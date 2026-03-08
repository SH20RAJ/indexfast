"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { sites, submissions, users } from "@/lib/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Generate a CF-compatible IndexNow key (32 hex chars) */
function generateIndexNowKey(): string {
    return globalThis.crypto.randomUUID().replace(/-/g, '');
}

// Helper to map snake_case DB rows to CamelCase for the UI
function mapSiteToCamelCase(row: any) {
    if (!row) return row;
    return {
        id: row.id,
        userId: row.user_id,
        domain: row.domain,
        gscSiteUrl: row.gsc_site_url,
        permissionLevel: row.permission_level,
        sitemapCount: row.sitemap_count,
        isVerified: row.is_verified,
        autoIndex: row.auto_index,
        indexNowKey: row.index_now_key,
        indexNowKeyLocation: row.index_now_key_location,
        indexNowKeyVerified: row.index_now_key_verified,
        lastSyncAt: row.last_sync_at,
        triggerSecret: row.trigger_secret,
        createdAt: row.created_at
    };
}

async function getOrCreateUser(stackUser: any) {
    if (!stackUser) return null;
    try {
        const existingUser = await db.select().from(users).where(eq(users.id, stackUser.id)).limit(1);
        if (existingUser.length > 0) return existingUser[0];
        const newUser = await db.insert(users).values({
            id: stackUser.id,
            email: stackUser.primaryEmail,
            plan: 'free',
            credits: 10,
        }).returning();
        return newUser[0];
    } catch (error) {
        console.error("Error in getOrCreateUser:", error);
        return null;
    }
}

export async function syncUser() {
    const user = await stackServerApp.getUser();
    if (user) await getOrCreateUser(user);
}

export async function getDashboardData() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;
  try {
    const dbUser = await getOrCreateUser(stackUser);
    let userSites: any[] = [];
    try {
      userSites = await db.select().from(sites).where(eq(sites.userId, stackUser.id)).orderBy(desc(sites.createdAt));
    } catch (e: any) {
      if (e.message?.includes('column "index_now_key" does not exist')) {
        const rows = (await db.execute(sql`SELECT id, user_id, domain, gsc_site_url, permission_level, sitemap_count, is_verified, auto_index, last_sync_at, created_at FROM sites WHERE user_id = ${stackUser.id} ORDER BY created_at DESC`)) as any;
        const resultRows = Array.isArray(rows) ? rows : (rows.rows || []);
        userSites = resultRows.map(mapSiteToCamelCase);
      } else throw e;
    }
    const userSubmissions = await db.select({
            id: submissions.id,
            url: submissions.url,
            status: submissions.status,
            submittedAt: submissions.submittedAt,
            sites: { domain: sites.domain }
        }).from(submissions).leftJoin(sites, eq(submissions.siteId, sites.id)).where(eq(sites.userId, stackUser.id)).orderBy(desc(submissions.submittedAt)).limit(20);
    return { user: dbUser, sites: userSites, submissions: userSubmissions.map(sub => ({ ...sub, sites: sub.sites || { domain: 'Unknown' } })) };
  } catch (error) {
    console.error("DB Error:", error);
    return { user: null, sites: [], submissions: [] };
  }
}

export async function saveSite(domain: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const dbUser = await getOrCreateUser(user);
        if (!dbUser) throw new Error("User not found");
        const indexNowKey = generateIndexNowKey();
        const result = await db.insert(sites).values({
                userId: user.id,
                domain: domain,
                gscSiteUrl: domain,
                permissionLevel: 'siteOwner',
                isVerified: false,
                indexNowKey,
            }).onConflictDoUpdate({ target: [sites.userId, sites.gscSiteUrl], set: { domain: domain } }).returning();
        return result[0];
    } catch (error) {
        console.error("Save Site Error:", error);
        throw error;
    }
}

export async function checkCredits(amount: number = 1) {
    const user = await stackServerApp.getUser();
    if (!user) return false;
    const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    return (dbUser ? dbUser.credits >= amount : false);
}

export async function deductCredit(amount: number = 1) {
    const user = await stackServerApp.getUser();
    if (!user) return null;
    try {
        const result = await db.update(users).set({ credits: sql`${users.credits} - ${amount}`, updatedAt: new Date() })
            .where(and(eq(users.id, user.id), sql`${users.credits} >= ${amount}`)).returning();
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        console.error("Failed to deduct credit", e);
        return null;
    }
}

export async function toggleAutoIndex(siteId: string, enabled: boolean) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    if (!enabled) {
        await db.update(sites).set({ autoIndex: false }).where(eq(sites.id, siteId));
        return { success: true };
    }

    try {
        const guard = await import("@/lib/plan-guard");
        const { allowed, error } = await guard.enforcePlanLimits({ requiredPlan: 'pro', featureName: 'Auto-indexing' });
        if (!allowed) throw new Error(error || "Unauthorized");
       
       const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
       if (!site) throw new Error("Site not found or unauthorized");
       
       await db.update(sites).set({ autoIndex: enabled }).where(eq(sites.id, siteId));
       revalidatePath(`/dashboard/sites/${site.domain}/overview`);
       return { success: true };
    } catch (e) {
        console.error("Failed to toggle auto-index", e);
        throw e;
    }
}

export async function deleteSite(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
        if (!site) throw new Error("Site not found");
        await db.delete(submissions).where(eq(submissions.siteId, siteId));
        await db.delete(sites).where(eq(sites.id, siteId));
        return { success: true };
    } catch (error) {
        console.error("Delete Site Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearSiteHistory(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
        if (!site) throw new Error("Site not found");
        await db.delete(submissions).where(eq(submissions.siteId, siteId));
        return { success: true };
    } catch (error) {
        console.error("Clear History Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function regenerateIndexNowKey(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
        if (!site) throw new Error("Site not found");
        const newKey = generateIndexNowKey();
        await db.update(sites).set({ indexNowKey: newKey, indexNowKeyVerified: false }).where(eq(sites.id, siteId));
        return { success: true, key: newKey };
    } catch (error) {
        console.error("Regenerate IndexNow Key Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateIndexNowSettings(siteId: string, customKey: string, customLocation: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
        if (!site) throw new Error("Site not found");
        await db.update(sites).set({ 
            indexNowKey: customKey ? customKey.trim() : null,
            indexNowKeyLocation: customLocation ? customLocation.trim() : null,
            indexNowKeyVerified: false 
        }).where(eq(sites.id, siteId));
        return { success: true };
    } catch (error) {
        console.error("Update IndexNow Settings Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function verifyIndexNowKey(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    try {
        const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
        if (!site || !site.indexNowKey) throw new Error("Site or key not found");
        const protocol = site.domain.startsWith('http') ? '' : 'https://';
        const displayDomain = site.domain.replace('sc-domain:', '');
        const defaultLocation = `${protocol}${displayDomain}/${site.indexNowKey}.txt`;
        const keyLocation = site.indexNowKeyLocation || defaultLocation;
        const response = await fetch(keyLocation, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to fetch key from ${keyLocation} (Status: ${response.status})`);
        const text = await response.text();
        const isValid = text.trim() === site.indexNowKey;
        if (isValid) await db.update(sites).set({ indexNowKeyVerified: true }).where(eq(sites.id, siteId));
        return { success: isValid, message: isValid ? "Key verified successfully!" : "Key found but content does not match.", location: keyLocation };
    } catch (error) {
        console.error("Verify IndexNow Key Error:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getOrGenerateTriggerSecret(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    const site = await db.query.sites.findFirst({ where: and(eq(sites.id, siteId), eq(sites.userId, user.id)) });
    if (!site) throw new Error("Site not found");
    if (site.triggerSecret) return site.triggerSecret;
    const newSecret = globalThis.crypto.randomUUID();
    await db.update(sites).set({ triggerSecret: newSecret }).where(eq(sites.id, siteId));
    return newSecret;
}
