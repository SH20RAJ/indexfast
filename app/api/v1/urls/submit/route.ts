import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, checkRateLimit, ApiAuthResult } from "@/lib/api-auth";
import db from "@/lib/db";
import { sites, submissions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { deductCredit } from "@/app/actions/dashboard";

export async function POST(request: NextRequest) {
    // Auth
    const auth = await validateApiKey(request);
    if (auth instanceof NextResponse) return auth;
    const { userId, isTest, user } = auth as ApiAuthResult;

    // Rate limit
    const rateLimited = checkRateLimit(userId, user.plan);
    if (rateLimited) return rateLimited;

    // Parse body
    let body: { site_id?: string; urls?: string[]; engine?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { site_id, urls, engine = "indexnow" } = body;

    if (!site_id) {
        return NextResponse.json({ error: "site_id is required" }, { status: 400 });
    }
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ error: "urls must be a non-empty array" }, { status: 400 });
    }

    // Enforce max URLs per request
    const maxUrls = user.plan === "agency" ? 1000 : 100;
    if (urls.length > maxUrls) {
        return NextResponse.json(
            { error: `Maximum ${maxUrls} URLs per request on your plan` },
            { status: 400 }
        );
    }

    // Verify site ownership
    const site = await db.query.sites.findFirst({
        where: and(eq(sites.id, site_id), eq(sites.userId, userId)),
    });

    if (!site) {
        return NextResponse.json({ error: "Site not found or access denied" }, { status: 404 });
    }

    // Check credits
    if (user.credits < urls.length) {
        return NextResponse.json(
            { error: "Insufficient credits", credits_remaining: user.credits, urls_requested: urls.length },
            { status: 402 }
        );
    }

    // Test mode: simulate submission without actually sending
    if (isTest) {
        return NextResponse.json({
            success: true,
            test_mode: true,
            submitted: urls.length,
            failed: 0,
            credits_used: 0,
            credits_remaining: user.credits,
            results: urls.map(url => ({ url, status: 200, test: true })),
        });
    }

    // Submit via IndexNow using per-site key
    const INDEXNOW_KEY = site.indexNowKey;
    if (!INDEXNOW_KEY) {
        return NextResponse.json({ 
            error: "IndexNow key not configured for this site. Go to Site Settings to set it up.",
            submitted: 0, failed: urls.length, credits_used: 0, credits_remaining: user.credits
        }, { status: 400 });
    }
    const results: { url: string; status: number }[] = [];
    let submitted = 0;
    let failed = 0;

    try {
        const host = new URL(urls[0]).hostname;
        const protocol = urls[0].startsWith('http:') ? 'http://' : 'https://';
        const defaultLocation = `${protocol}${host}/${INDEXNOW_KEY}.txt`;
        const keyLocation = site.indexNowKeyLocation || defaultLocation;
        
        const indexNowPayload = {
            host,
            key: INDEXNOW_KEY,
            keyLocation,
            urlList: urls,
        };

        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(indexNowPayload),
        });

        const status = response.status;
        
        // IndexNow returns 200/202 for success
        if (status >= 200 && status < 300) {
            for (const url of urls) {
                results.push({ url, status: 200 });
                submitted++;
            }
        } else {
            for (const url of urls) {
                results.push({ url, status });
                failed++;
            }
        }

        // Record submissions in DB
        const submissionRecords = urls.map(url => ({
            siteId: site_id,
            url,
            status: status >= 200 && status < 300 ? 200 : status,
        }));

        await db.insert(submissions).values(submissionRecords);

        // Deduct credits
        if (submitted > 0) {
            await deductCredit(submitted);
        }

    } catch (error) {
        console.error("IndexNow API error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to submit URLs to IndexNow",
            submitted: 0,
            failed: urls.length,
            credits_used: 0,
            credits_remaining: user.credits,
        }, { status: 502 });
    }

    return NextResponse.json({
        success: true,
        submitted,
        failed,
        credits_used: submitted,
        credits_remaining: user.credits - submitted,
        results,
    });
}
