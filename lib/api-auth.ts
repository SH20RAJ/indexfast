import { createHash } from "crypto";
import db from "@/lib/db";
import { apiKeys, users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface ApiAuthResult {
    userId: string;
    keyId: string;
    isTest: boolean;
    user: {
        id: string;
        email: string;
        plan: string;
        credits: number;
    };
}

/**
 * Validates a Bearer token from API requests.
 * Returns the authenticated user context or a 401 response.
 */
export async function validateApiKey(request: NextRequest): Promise<ApiAuthResult | NextResponse> {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Missing or invalid Authorization header. Use: Bearer ixf_live_xxx" },
            { status: 401 }
        );
    }

    const rawKey = authHeader.slice(7).trim();
    
    // Validate key format
    if (!rawKey.startsWith("ixf_live_") && !rawKey.startsWith("ixf_test_")) {
        return NextResponse.json(
            { error: "Invalid API key format" },
            { status: 401 }
        );
    }

    const keyHash = createHash("sha256").update(rawKey).digest("hex");

    try {
        // Find key by hash
        const keyRow = await db.query.apiKeys.findFirst({
            where: eq(apiKeys.keyHash, keyHash),
        });

        if (!keyRow) {
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 401 }
            );
        }

        // Check expiry
        if (keyRow.expiresAt && new Date(keyRow.expiresAt) < new Date()) {
            return NextResponse.json(
                { error: "API key has expired" },
                { status: 401 }
            );
        }

        // Fetch user
        const userRow = await db.query.users.findFirst({
            where: eq(users.id, keyRow.userId),
        });

        if (!userRow) {
            return NextResponse.json(
                { error: "Associated user account not found" },
                { status: 401 }
            );
        }

        // Check plan allows API access
        if (userRow.plan === "free") {
            return NextResponse.json(
                { error: "API access requires a Pro or Agency plan", upgrade_url: "/dashboard/billing" },
                { status: 403 }
            );
        }

        // Update last_used_at (fire-and-forget)
        db.update(apiKeys)
            .set({ lastUsedAt: new Date() })
            .where(eq(apiKeys.id, keyRow.id))
            .then(() => {})
            .catch(() => {});

        return {
            userId: keyRow.userId,
            keyId: keyRow.id,
            isTest: keyRow.isTest,
            user: {
                id: userRow.id,
                email: userRow.email,
                plan: userRow.plan,
                credits: userRow.credits,
            },
        };
    } catch (error) {
        console.error("API auth error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}

/**
 * Simple rate limiter using in-memory sliding window.
 * In production, use Redis or Cloudflare's built-in rate limiter.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, plan: string): NextResponse | null {
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const maxRequests = plan === "agency" ? 300 : 60; // agency: 300/min, pro: 60/min

    const entry = rateLimitMap.get(userId);
    
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs });
        return null; // allowed
    }

    if (entry.count >= maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
            { error: "Rate limit exceeded", retry_after: retryAfter },
            { 
                status: 429,
                headers: { "Retry-After": String(retryAfter) }
            }
        );
    }

    entry.count++;
    return null; // allowed
}
