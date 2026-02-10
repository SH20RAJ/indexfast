import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { getPlanCredits } from "@/lib/subscription-utils";

interface PlanGuardResult {
    allowed: boolean;
    error?: string;
    user?: typeof users.$inferSelect;
}

interface GuardOptions {
    requiredPlan?: 'pro' | 'business';
    requiredCredits?: number;
    featureName?: string;
}

/**
 * Validates user access based on plan and credits.
 * Also performs plan expiry check and downgrades if necessary.
 */
export async function enforcePlanLimits(options: GuardOptions = {}): Promise<PlanGuardResult> {
    const user = await stackServerApp.getUser();
    
    if (!user) {
        return { allowed: false, error: "Unauthorized" };
    }

    // 1. Fetch User
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    });

    if (!dbUser) {
        return { allowed: false, error: "User not found" };
    }

    // 2. Check Plan Expiry & Downgrade if needed
    if (dbUser.plan !== 'free' && dbUser.planExpiresAt && new Date() > dbUser.planExpiresAt) {
        // Plan expired, downgrade immediately
        const freeCredits = getPlanCredits('free');
        
        await db.update(users)
            .set({ 
                plan: 'free', 
                planExpiresAt: null,
                subscriptionStatus: 'expired',
                credits: freeCredits,
                updatedAt: new Date()
            })
            .where(eq(users.id, user.id));
            
        // Update local object to reflect downgrade
        dbUser.plan = 'free';
        dbUser.credits = freeCredits;
    }

    // 3. Plan Level Check
    if (options.requiredPlan) {
        const planHierarchy = { free: 0, pro: 1, business: 2 };
        const userLevel = planHierarchy[dbUser.plan as keyof typeof planHierarchy] || 0;
        const requiredLevel = planHierarchy[options.requiredPlan];

        if (userLevel < requiredLevel) {
            return { 
                allowed: false, 
                error: `${options.featureName || 'This feature'} requires the ${options.requiredPlan} plan.`,
                user: dbUser
            };
        }
    }

    // 4. Credit Check
    if (options.requiredCredits && options.requiredCredits > 0) {
        if (dbUser.credits < options.requiredCredits) {
             return {
                allowed: false,
                error: `Insufficient credits. Required: ${options.requiredCredits}, Remaining: ${dbUser.credits}`,
                user: dbUser
            };
        }
    }

    return { allowed: true, user: dbUser };
}
