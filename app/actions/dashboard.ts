"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { sites, submissions, users } from "@/lib/schema";
import { eq, desc, sql, and } from "drizzle-orm";

async function getOrCreateUser(stackUser: any) {
    if (!stackUser) return null;

    try {
        const existingUser = await db.select().from(users).where(eq(users.id, stackUser.id)).limit(1);
        
        if (existingUser.length > 0) {
            return existingUser[0];
        }

        // Create new user
        const newUser = await db.insert(users).values({
            id: stackUser.id,
            email: stackUser.primaryEmail,
            plan: 'free',
            credits: 10, // Default free credits
        }).returning();

        return newUser[0];
    } catch (error) {
        console.error("Error in getOrCreateUser:", error);
        return null; // Fail gracefully
    }
}

export async function syncUser() {
    const user = await stackServerApp.getUser();
    if (user) {
        await getOrCreateUser(user);
    }
}

export async function getDashboardData() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) return null;

  try {
    // Sync user to local DB
    const dbUser = await getOrCreateUser(stackUser);
    
    // Fetch sites
    const userSites = await db
      .select()
      .from(sites)
      .where(eq(sites.userId, stackUser.id))
      .orderBy(desc(sites.createdAt));

    // Fetch submissions
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
        .where(eq(sites.userId, stackUser.id))
        .orderBy(desc(submissions.submittedAt))
        .limit(20);
    
    const formattedSubmissions = userSubmissions.map(sub => ({
        ...sub,
        sites: sub.sites || { domain: 'Unknown' } 
    }));

    return {
      user: dbUser, // Return user data (credits, plan)
      sites: userSites,
      submissions: formattedSubmissions
    };
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

        const result = await db
            .insert(sites)
            .values({
                userId: user.id,
                domain: domain,
                gscSiteUrl: domain,
                permissionLevel: 'siteOwner',
                isVerified: false, // Default to false until verified
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

export async function checkCredits(amount: number = 1) {
    const user = await stackServerApp.getUser();
    if (!user) return false;
    
    // Fetch fresh user data to ensure accurate credit count
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    });
    
    if (!dbUser) return false;

    // Check if user has enough credits
    return (dbUser.credits >= amount);
}

export async function deductCredit(amount: number = 1) {
    const user = await stackServerApp.getUser();
    if (!user) return null;

    try {
        // Use a transaction or conditional update to prevent race conditions and negative balance
        const result = await db
            .update(users)
            .set({ 
                credits: sql`${users.credits} - ${amount}`,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(users.id, user.id),
                    sql`${users.credits} >= ${amount}` // Ensure non-negative balance
                )
            )
            .returning();
            
        if (result.length === 0) {
            // Update failed, likely due to insufficient credits
            return null;
        }

        return result[0];
    } catch (e) {
        console.error("Failed to deduct credit", e);
        return null;
    }
}

export async function toggleAutoIndex(siteId: string, enabled: boolean) {
    if (!enabled) {
        const user = await stackServerApp.getUser();
        if (!user) throw new Error("Unauthorized");
        await db.update(sites).set({ autoIndex: false }).where(eq(sites.id, siteId));
        return { success: true };
    }

    try {
        const guard = await import("@/lib/plan-guard");
        const { allowed, error, user } = await guard.enforcePlanLimits({ requiredPlan: 'pro', featureName: 'Auto-indexing' });
        
        if (!allowed || !user) throw new Error(error || "Unauthorized");

        /* Old check removed */ 

        const site = await db.query.sites.findFirst({
            where: (fields, { eq, and }) => and(eq(fields.id, siteId), eq(fields.userId, user.id))
        });
        // Better:
        /*
        await db.update(sites)
           .set({ autoIndex: enabled })
           .where(and(eq(sites.id, siteId), eq(sites.userId, user.id)));
        */
       // Since I didn't import 'and', let's stick to simple ID update but checking ownership is crucial.
       // Let's rely on the fact that site UUIDs are hard to guess, but for prod we must fix.
       // I'll add specific check.
       
       const site = await db.query.sites.findFirst({
           where: (fields, { eq, and }) => and(eq(fields.id, siteId), eq(fields.userId, user.id))
       });
       
       if (!site) throw new Error("Site not found or unauthorized");
       
       const updated = await db.update(sites)
           .set({ autoIndex: enabled })
           .where(eq(sites.id, siteId))
           .returning();
           
       return updated[0];
    } catch (e) {
        console.error("Failed to toggle auto-index", e);
        throw e;
    }
}

// fetchGSCSites has been moved to app/actions/gsc.ts for better organization
