"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getUserSites() {
    const user = await stackServerApp.getUser();
    if (!user) return [];

    try {
        const userSites = await db.select({
            id: sites.id,
            domain: sites.domain,
            gscSiteUrl: sites.gscSiteUrl,
            isVerified: sites.isVerified,
        })
        .from(sites)
        .where(eq(sites.userId, user.id));

        return userSites;
    } catch (error) {
        console.error("getUserSites error:", error);
        return [];
    }
}
