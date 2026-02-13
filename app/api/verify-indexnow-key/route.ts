import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack/server";

export async function POST(request: NextRequest) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { siteId } = await request.json();
        if (!siteId) {
            return NextResponse.json({ error: "siteId is required" }, { status: 400 });
        }

        // Get site from DB
        const site = await db.query.sites.findFirst({
            where: eq(sites.id, siteId),
        });

        if (!site || site.userId !== user.id) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        if (!site.indexNowKey) {
            return NextResponse.json({ error: "No IndexNow key configured" }, { status: 400 });
        }

        // Try to fetch the key file from the user's domain
        const domain = site.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
        const keyUrl = `https://${domain}/${site.indexNowKey}.txt`;

        try {
            const res = await fetch(keyUrl, {
                signal: AbortSignal.timeout(10000), // 10s timeout
            });

            if (!res.ok) {
                return NextResponse.json({
                    verified: false,
                    error: `Key file not found at ${keyUrl} (HTTP ${res.status})`,
                    keyUrl,
                });
            }

            const content = (await res.text()).trim();

            if (content === site.indexNowKey) {
                // Mark as verified in DB
                await db.update(sites).set({ indexNowKeyVerified: true }).where(eq(sites.id, siteId));

                return NextResponse.json({
                    verified: true,
                    keyUrl,
                    message: "IndexNow key verified successfully!",
                });
            } else {
                return NextResponse.json({
                    verified: false,
                    error: `Key file content doesn't match. Expected "${site.indexNowKey}" but got "${content.substring(0, 50)}"`,
                    keyUrl,
                });
            }
        } catch (fetchError) {
            return NextResponse.json({
                verified: false,
                error: `Could not reach ${keyUrl}. Make sure the file is publicly accessible.`,
                keyUrl,
            });
        }
    } catch (error) {
        console.error("Verify IndexNow key error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
