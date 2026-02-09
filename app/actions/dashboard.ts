"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { sites, submissions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function getDashboardData() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  try {
    const userSites = await db
      .select()
      .from(sites)
      .where(eq(sites.userId, user.id))
      .orderBy(desc(sites.createdAt));

    const userSubmissions = await db
        .select({
            id: submissions.id,
            url: submissions.url,
            status: submissions.status,
            submittedAt: submissions.submittedAt,
            sites: {
                domain: sites.domain
            }
        })
        .from(submissions)
        .leftJoin(sites, eq(submissions.siteId, sites.id))
        .where(eq(sites.userId, user.id))
        .orderBy(desc(submissions.submittedAt))
        .limit(20);
    
    // Map submissions to match the expected interface if necessary (renaming nested objects for frontend compat)
    const formattedSubmissions = userSubmissions.map(sub => ({
        ...sub,
        sites: sub.sites || { domain: 'Unknown' } 
    }));

    return {
      sites: userSites,
      submissions: formattedSubmissions
    };
  } catch (error) {
    console.error("DB Error:", error);
    return { sites: [], submissions: [] };
  }
}

export async function saveSite(domain: string) {
    const user = await stackServerApp.getUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const result = await db
            .insert(sites)
            .values({
                userId: user.id,
                domain: domain,
                gscSiteUrl: domain,
                permissionLevel: 'siteOwner'
            })
            .onConflictDoUpdate({
                target: [sites.userId, sites.gscSiteUrl],
                set: { domain: domain }
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error("Save Site Error:", error);
        throw error;
    }
}
