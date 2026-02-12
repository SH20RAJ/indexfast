import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, checkRateLimit, ApiAuthResult } from "@/lib/api-auth";
import db from "@/lib/db";
import { usageLogs, submissions, sites } from "@/lib/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const auth = await validateApiKey(request);
    if (auth instanceof NextResponse) return auth;
    const { userId, user } = auth as ApiAuthResult;

    const rateLimited = checkRateLimit(userId, user.plan);
    if (rateLimited) return rateLimited;

    try {
        // Get total submissions this month
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyCount = await db.select({ count: sql<number>`count(*)` })
            .from(submissions)
            .innerJoin(sites, eq(submissions.siteId, sites.id))
            .where(
                and(
                    eq(sites.userId, userId),
                    sql`${submissions.submittedAt} >= ${thirtyDaysAgo.toISOString()}`
                )
            );

        // Get site count
        const siteCount = await db.select({ count: sql<number>`count(*)` })
            .from(sites)
            .where(eq(sites.userId, userId));

        return NextResponse.json({
            success: true,
            usage: {
                plan: user.plan,
                credits_remaining: user.credits,
                submissions_this_month: monthlyCount[0]?.count || 0,
                sites_count: siteCount[0]?.count || 0,
            },
        });
    } catch (error) {
        console.error("API usage error:", error);
        return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
    }
}
