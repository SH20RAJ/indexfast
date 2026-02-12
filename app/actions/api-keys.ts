"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { apiKeys } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

function generateApiKey(isTest: boolean = false): string {
    const prefix = isTest ? "ixf_test_" : "ixf_live_";
    const random = randomBytes(24).toString("base64url"); // 32 chars
    return prefix + random;
}

export async function createApiKey(name: string, isTest: boolean = false) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check plan limits (free = 0, pro = 2, agency = 10)
    const existingKeys = await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.userId, user.id));

    // For now, allow up to 5 keys per user (plan enforcement later)
    if (existingKeys.length >= 5) {
        throw new Error("Maximum API keys reached. Delete an existing key first.");
    }

    const rawKey = generateApiKey(isTest);
    const keyHash = hashKey(rawKey);
    const keyPrefix = isTest ? "ixf_test_" : "ixf_live_";
    const keyLast4 = rawKey.slice(-4);

    await db.insert(apiKeys).values({
        userId: user.id,
        name,
        keyHash,
        keyPrefix,
        keyLast4,
        isTest,
    });

    // Return the raw key only once — never stored in plain text
    return {
        key: rawKey,
        name,
        prefix: keyPrefix,
        last4: keyLast4,
        isTest,
    };
}

export async function listApiKeys() {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    const keys = await db.select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        keyLast4: apiKeys.keyLast4,
        isTest: apiKeys.isTest,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .orderBy(desc(apiKeys.createdAt));

    return keys;
}

export async function revokeApiKey(keyId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    const result = await db.delete(apiKeys).where(
        and(eq(apiKeys.id, keyId), eq(apiKeys.userId, user.id))
    );

    return { success: true };
}
