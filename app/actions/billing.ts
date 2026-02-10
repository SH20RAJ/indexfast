"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { users, subscriptions } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getBillingData() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  try {
    // Fetch user details
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!dbUser) return null;

    // Fetch active subscription details
    // We want the most relevant subscription (active or canceling)
    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, user.id),
        // We're interested in active or trialing
        // Canceled subscriptions that are still in the period are also relevant
      ),
      orderBy: [desc(subscriptions.currentPeriodEnd)],
    });

    return {
      user: dbUser,
      subscription: subscription || null,
    };
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return null;
  }
}
