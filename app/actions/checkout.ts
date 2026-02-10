"use server";

import { stackServerApp } from "@/stack/server";
import { getDodoClient, DODO_PLAN_IDS } from "@/lib/dodo-client";
import { setCustomerId, getCustomerId } from "@/lib/subscription-utils";

export type CheckoutPlan = 'pro' | 'business';
export type BillingPeriod = 'monthly' | 'yearly';

interface CreateCheckoutSessionParams {
  plan: CheckoutPlan;
  billingPeriod?: BillingPeriod;
}

interface CheckoutSessionResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Create a Dodo Payments checkout session for subscription
 * 
 * This server action:
 * 1. Authenticates the user
 * 2. Creates/retrieves Dodo customer
 * 3. Creates a checkout session
 * 4. Returns the checkout URL
 * 
 * @param plan - The subscription plan ('pro' or 'business')
 * @param billingPeriod - Optional billing period (defaults to 'monthly')
 */
export async function createCheckoutSession({
  plan,
  billingPeriod = 'monthly',
}: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
  try {
    // 1. Get authenticated user
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to subscribe',
      };
    }

    // 2. Get Dodo Payments client (server-side only)
    const dodoClient = getDodoClient();

    // 3. Check if user already has a Dodo customer ID
    let dodoCustomerId = await getCustomerId(user.id, 'dodo');

    // 4. Create or get Dodo customer
    if (!dodoCustomerId) {
      const customer = await dodoClient.getOrCreateCustomer({
        email: user.primaryEmail || user.clientMetadata?.email as string,
        name: user.displayName || undefined,
        metadata: {
          userId: user.id,
          source: 'indexfast',
        },
      });

      dodoCustomerId = customer.customer_id;

      // Store Dodo customer ID in our database
      await setCustomerId(user.id, 'dodo', dodoCustomerId);
    }

    // 5. Determine plan ID based on plan and billing period
    const planKey = `${plan}_${billingPeriod}` as keyof typeof DODO_PLAN_IDS;
    const dodoPlanId = DODO_PLAN_IDS[planKey];

    if (!dodoPlanId) {
      return {
        success: false,
        error: `Invalid plan configuration: ${plan} ${billingPeriod}`,
      };
    }

    // 6. Get app URL for redirect URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing?checkout=canceled`;

    // 7. Create checkout session
    const checkoutSession = await dodoClient.createCheckoutSession({
      customer_id: dodoCustomerId,
      plan_id: dodoPlanId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user.id,
        plan: plan,
        billingPeriod: billingPeriod,
      },
    });

    // 8. Return checkout URL
    return {
      success: true,
      checkoutUrl: checkoutSession.checkout_url,
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Failed to create checkout session',
    };
  }
}

/**
 * Get checkout session status
 * Used to verify successful payment after redirect
 */
export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const dodoClient = getDodoClient();
    const session = await dodoClient.getCheckoutSession(sessionId);

    return {
      success: true,
      status: session.status,
      customerId: session.customer_id,
    };
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    return {
      success: false,
      error: 'Failed to fetch checkout session',
    };
  }
}
