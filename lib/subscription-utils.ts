/**
 * Subscription Utilities
 * 
 * Helper functions to manage subscriptions across Stripe and Dodo Payments
 */

import db from "@/lib/db";
import { users, subscriptions } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export type PaymentProvider = 'stripe' | 'dodo';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
export type PlanTier = 'free' | 'pro' | 'business';

/**
 * Get the active subscription for a user
 */
export async function getActiveSubscription(userId: string) {
  const activeSubscriptions = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      )
    )
    .orderBy(desc(subscriptions.currentPeriodEnd))
    .limit(1);

  return activeSubscriptions[0] || null;
}

/**
 * Update user plan based on subscription status
 * Should be called when subscription changes (webhook handlers)
 */
export async function syncUserPlanFromSubscription(userId: string) {
  const activeSubscription = await getActiveSubscription(userId);

  if (!activeSubscription) {
    // No active subscription, set to free
    const freeCredits = getPlanCredits('free');
    await db
      .update(users)
      .set({
        plan: 'free',
        subscriptionStatus: null,
        planExpiresAt: null,
        credits: freeCredits, // Reset to free tier credits
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    return { plan: 'free' as PlanTier, expiresAt: null };
  }

  // Update user plan from active subscription
  const newPlan = activeSubscription.plan as PlanTier;
  const newCredits = getPlanCredits(newPlan);

  await db
    .update(users)
    .set({
      plan: newPlan,
      subscriptionStatus: activeSubscription.status,
      planExpiresAt: activeSubscription.currentPeriodEnd,
      credits: newCredits, // Update credits to match new plan
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    plan: newPlan,
    expiresAt: activeSubscription.currentPeriodEnd,
  };
}

/**
 * Create or update a subscription record
 */
export async function upsertSubscription(data: {
  id: string;
  userId: string;
  provider: PaymentProvider;
  status: SubscriptionStatus;
  plan: 'pro' | 'business';
  priceId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd?: boolean;
}) {
  const subscription = await db
    .insert(subscriptions)
    .values({
      id: data.id,
      userId: data.userId,
      provider: data.provider,
      status: data.status,
      plan: data.plan,
      priceId: data.priceId || null,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status: data.status,
        plan: data.plan,
        priceId: data.priceId || null,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
        updatedAt: new Date(),
      },
    })
    .returning();

  // Sync user plan
  await syncUserPlanFromSubscription(data.userId);

  return subscription[0];
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getActiveSubscription(userId);
  return subscription !== null;
}

/**
 * Get customer ID for a specific provider
 */
export async function getCustomerId(userId: string, provider: PaymentProvider): Promise<string | null> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) return null;

  return provider === 'stripe' 
    ? user[0].stripeCustomerId 
    : user[0].dodoCustomerId;
}

/**
 * Set customer ID for a specific provider
 */
export async function setCustomerId(
  userId: string, 
  provider: PaymentProvider, 
  customerId: string
): Promise<void> {
  const updateData = provider === 'stripe'
    ? { stripeCustomerId: customerId }
    : { dodoCustomerId: customerId };

  await db
    .update(users)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/**
 * Get plan credits based on tier
 */
export function getPlanCredits(plan: PlanTier): number {
  const creditsMap: Record<PlanTier, number> = {
    free: 10,
    pro: 100,
    business: 1000,
  };
  return creditsMap[plan] || 10;
}

/**
 * Check if plan has expired
 */
export function isPlanExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false; // No expiry (free or lifetime)
  return new Date() > expiresAt;
}
