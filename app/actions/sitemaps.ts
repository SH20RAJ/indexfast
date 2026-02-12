"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { sitemaps, sites } from "@/lib/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function saveSitemaps(siteId: string, sitemapUrls: string[]) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Verify site ownership
        const site = await db.query.sites.findFirst({
            where: and(eq(sites.id, siteId), eq(sites.userId, user.id))
        });

        if (!site) throw new Error("Site not found");

        if (sitemapUrls.length === 0) return { success: true, count: 0 };

        const operations = sitemapUrls.map(url => {
            return db.insert(sitemaps)
                .values({
                    siteId,
                    url,
                    urlsCount: 0,
                    isEnabled: true
                })
                .onConflictDoUpdate({
                    target: [sitemaps.siteId, sitemaps.url],
                    set: { isEnabled: true } // Re-enable if exists
                });
        });

        await Promise.all(operations);
        return { success: true, count: sitemapUrls.length };
    } catch (error) {
        console.error("Save Sitemaps Error:", error);
        throw error;
    }
}

export async function getSitemaps(siteId: string) {
    const user = await stackServerApp.getUser();
    if (!user) return [];

    try {
        // Verify ownership indirectly via query if needed, or just fetch by siteId
        // Assuming the caller has already verified access to siteId context via page load
        // But for safety:
        const site = await db.query.sites.findFirst({
            where: and(eq(sites.id, siteId), eq(sites.userId, user.id))
        });
        
        if (!site) return [];

        const result = await db.select()
            .from(sitemaps)
            .where(eq(sitemaps.siteId, siteId));
        return result;
    } catch (error) {
        console.error("Get Sitemaps Error:", error);
        return [];
    }
}

export async function toggleSitemap(sitemapId: string, enabled: boolean) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    
    try {
        // Ensure user owns the site
        const sitemap = await db.query.sitemaps.findFirst({
            with: {
                site: true
            },
            where: eq(sitemaps.id, sitemapId)
        });
        
        // Drizzle specific: need to define relation in schema to use 'with', doing manual join check instead
         const sitemapRecord = await db.select({
            id: sitemaps.id,
            userId: sites.userId
         })
         .from(sitemaps)
         .innerJoin(sites, eq(sitemaps.siteId, sites.id))
         .where(eq(sitemaps.id, sitemapId))
         .limit(1);

         if (!sitemapRecord.length || sitemapRecord[0].userId !== user.id) {
             throw new Error("Unauthorized");
         }

        await db.update(sitemaps)
            .set({ isEnabled: enabled })
            .where(eq(sitemaps.id, sitemapId));
            
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to toggle" };
    }
}

export async function deleteSitemap(sitemapId: string) {
      const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");
    
    try {
         const sitemapRecord = await db.select({
            id: sitemaps.id,
            userId: sites.userId
         })
         .from(sitemaps)
         .innerJoin(sites, eq(sitemaps.siteId, sites.id))
         .where(eq(sitemaps.id, sitemapId))
         .limit(1);

         if (!sitemapRecord.length || sitemapRecord[0].userId !== user.id) {
             throw new Error("Unauthorized");
         }

        await db.delete(sitemaps).where(eq(sitemaps.id, sitemapId));
            
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to delete" };
    }
}
