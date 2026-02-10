import { NextRequest, NextResponse } from 'next/server';
import { upsertSubscription, syncUserPlanFromSubscription, setCustomerId } from '@/lib/subscription-utils';
import crypto from 'crypto';
import type { DodoSubscription, DodoCustomer, DodoWebhookEvent } from '@/lib/dodo-client';

/**
 * Verify Dodo Payments Webhook Signature
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    // Use timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);
    
    if (signatureBuffer.length !== digestBuffer.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Dodo Payments Webhook Handler
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-dodo-signature');
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Dodo webhook secret not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Read raw body for signature verification
    const body = await request.text();

    const isValid = verifySignature(body, signature, webhookSecret);
    if (!isValid) {
      console.warn('Invalid Dodo webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body) as DodoWebhookEvent;
    const { type, data } = event;

    // Cast data safely for logging
    const subscriptionId = (data as any)?.subscription_id;
    console.log(`Dodo webhook received: ${type}`, { subscription_id: subscriptionId });

    switch (type) {
      case 'customer.created':
        await handleCustomerCreated(data as DodoCustomer);
        break;

      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.renewed':
        await handleSubscriptionUpdate(data as DodoSubscription);
        break;

      case 'subscription.canceled':
      case 'subscription.expired': // Handle expiration same as cancellation
        await handleSubscriptionCanceled(data as DodoSubscription);
        break;

      case 'payment.succeeded':
        // Optional: specific payment handling logic if needed separately
        // Usually subscription.updated handles the period updates
        break;

      case 'payment.failed':
          // Handle failed payment (e.g., notify user)
          console.log(`Payment failed for subscription: ${subscriptionId}`);
          break;

      default:
        console.log('Unhandled Dodo webhook type:', type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Dodo webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCustomerCreated(data: DodoCustomer) {
  const { customer_id, metadata } = data;
  const userId = metadata?.userId;

  if (!userId) {
    // Ideally log this, but it might be a customer created without our metadata (e.g. manual dashboard creation)
    console.log('No userId in customer metadata for customer.created');
    return;
  }

  await setCustomerId(userId, 'dodo', customer_id);
}

async function handleSubscriptionUpdate(data: DodoSubscription) {
  const {
    subscription_id,
    status,
    plan_id,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    metadata,
  } = data;

  const userId = metadata?.userId;

  if (!userId) {
    console.error(`No userId in subscription metadata for subscription ${subscription_id}`);
    return;
  }

  // Map Dodo plan_id to our internal plan names
  // Ensure these match the env variables usually, or use a robust mapping
  // Fallback to 'pro' if unknown, but better to be safe.
  const planMapping: Record<string, 'pro' | 'business'> = {
    'plan_pro_monthly': 'pro',
    'plan_pro_yearly': 'pro',
    'plan_business_monthly': 'business',
    'plan_business_yearly': 'business',
    // Add environment variable values if they differ
    [process.env.DODO_PRO_MONTHLY_PLAN_ID || 'dodo_pro_monthly']: 'pro',
    [process.env.DODO_PRO_YEARLY_PLAN_ID || 'dodo_pro_yearly']: 'pro',
    [process.env.DODO_BUSINESS_MONTHLY_PLAN_ID || 'dodo_business_monthly']: 'business',
    [process.env.DODO_BUSINESS_YEARLY_PLAN_ID || 'dodo_business_yearly']: 'business',
  };

  const plan = planMapping[plan_id] || 'pro'; 

  await upsertSubscription({
    id: subscription_id,
    userId,
    provider: 'dodo',
    status: mapDodoStatus(status),
    plan,
    priceId: plan_id,
    currentPeriodStart: new Date(current_period_start * 1000), // Dodo sends Unix timestamp
    currentPeriodEnd: new Date(current_period_end * 1000),
    cancelAtPeriodEnd: cancel_at_period_end || false,
  });
  
  console.log(`Updated subscription ${subscription_id} for user ${userId} to ${plan}`);
}

async function handleSubscriptionCanceled(data: DodoSubscription) {
  const { subscription_id, metadata } = data;
  const userId = metadata?.userId;


  if (!userId) {
     console.error(`No userId in subscription metadata for canceled subscription ${subscription_id}`);
    return;
  }

  const {
      status, 
      plan_id,
      current_period_start,
      current_period_end,
      cancel_at_period_end
  } = data;
  
  await upsertSubscription({
    id: subscription_id,
    userId,
    provider: 'dodo',
    status: mapDodoStatus(status || 'canceled'),
    plan: 'pro', // Placeholder
    priceId: plan_id,
    currentPeriodStart: new Date((current_period_start || Date.now() / 1000) * 1000),
    currentPeriodEnd: new Date((current_period_end || Date.now() / 1000) * 1000),
    cancelAtPeriodEnd: cancel_at_period_end || false,
  });

  // Sync user plan (will set to free if no other active subscriptions)
  await syncUserPlanFromSubscription(userId);
  console.log(`Processed cancellation for subscription ${subscription_id} user ${userId}`);
}

function mapDodoStatus(dodoStatus: string): 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' {
  if (!dodoStatus) return 'canceled';
  const statusMap: Record<string, any> = {
    'active': 'active',
    'cancelled': 'canceled',
    'canceled': 'canceled',
    'past_due': 'past_due',
    'trialing': 'trialing',
    'incomplete': 'incomplete',
    'paused': 'canceled', // Treat paused as canceled/inactive for access
    'expired': 'canceled'
  };

  return statusMap[dodoStatus.toLowerCase()] || 'canceled';
}
