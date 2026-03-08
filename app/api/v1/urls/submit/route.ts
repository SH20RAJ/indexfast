import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, checkRateLimit, ApiAuthResult } from "@/lib/api-auth";
import db from "@/lib/db";
import { sites, submissions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { deductCredit } from "@/app/actions/dashboard";
import { getIndexNowHost, getIndexNowKeyLocation, chunkArray, submitToIndexNow } from "@/lib/url-utils";

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

    // Submit via IndexNow using per-site key in chunks
    const INDEXNOW_KEY = site.indexNowKey;
    if (!INDEXNOW_KEY) {
        return NextResponse.json({ 
            error: "IndexNow key not configured for this site. Go to Site Settings to set it up.",
            submitted: 0, failed: urls.length, credits_used: 0, credits_remaining: user.credits
        }, { status: 400 });
    }

    const host = getIndexNowHost(site.domain);
    const keyLocation = getIndexNowKeyLocation(site);
    const urlChunks = chunkArray(urls, 100); // Small chunks for API reliability
    
    let totalSubmitted = 0;
    let totalFailed = 0;
    let lastError = null;
    const results: { url: string; status: number }[] = [];

    for (const chunk of urlChunks) {
        const result = await submitToIndexNow(host, INDEXNOW_KEY, keyLocation, chunk);
        if (result.success) {
            totalSubmitted += chunk.length;
            chunk.forEach(url => results.push({ url, status: 200 }));
        } else {
            totalFailed += chunk.length;
            lastError = result.message;
            chunk.forEach(url => results.push({ url, status: result.status }));
        }
    }

    // Record submissions in DB
    if (results.length > 0) {
        const submissionRecords = results.map(r => ({
            siteId: site_id,
            url: r.url,
            status: r.status,
            submittedAt: new Date(),
        }));
        await db.insert(submissions).values(submissionRecords);
    }

    // Deduct credits
    if (totalSubmitted > 0) {
        await deductCredit(totalSubmitted);
    }

    if (totalSubmitted === 0 && totalFailed > 0) {
        return NextResponse.json({ 
            error: "IndexNow API error", 
            message: lastError,
            submitted: 0, failed: totalFailed, credits_used: 0, credits_remaining: user.credits
        }, { status: 502 });
    }

    return NextResponse.json({
        success: true,
        submitted: totalSubmitted,
        failed: totalFailed,
        credits_used: totalSubmitted,
        credits_remaining: user.credits - totalSubmitted,
        results,
    });
}
