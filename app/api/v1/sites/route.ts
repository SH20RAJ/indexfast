import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, checkRateLimit, ApiAuthResult } from "@/lib/api-auth";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const auth = await validateApiKey(request);
    if (auth instanceof NextResponse) return auth;
    const { userId, user } = auth as ApiAuthResult;

    const rateLimited = checkRateLimit(userId, user.plan);
    if (rateLimited) return rateLimited;

    try {
        const userSites = await db.select({
            id: sites.id,
            domain: sites.domain,
            gsc_site_url: sites.gscSiteUrl,
            is_verified: sites.isVerified,
            auto_index: sites.autoIndex,
            created_at: sites.createdAt,
        })
        .from(sites)
        .where(eq(sites.userId, userId));

        return NextResponse.json({
            success: true,
            sites: userSites,
            count: userSites.length,
        });
    } catch (error) {
        console.error("API sites error:", error);
        return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
    }
}
