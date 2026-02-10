import { NextRequest, NextResponse } from 'next/server';
import { upsertSubscription, syncUserPlanFromSubscription, setCustomerId } from '@/lib/subscription-utils';

/**
 * Dodo Payments Webhook Handler
 * 
 * Handles subscription lifecycle events from Dodo Payments
 * 
 * Events to handle:
 * - subscription.created
 * - subscription.updated
 * - subscription.canceled
 * - subscription.renewed
 * - customer.created
 */

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implement based on Dodo Payments documentation)
    const signature = request.headers.get('x-dodo-signature');
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 401 });
    }

    // TODO: Implement signature verification based on Dodo Payments docs
    // const isValid = verifyDodoSignature(await request.text(), signature, webhookSecret);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const event = await request.json();
    const { type, data } = event;

    console.log('Dodo webhook received:', type);

    switch (type) {
      case 'customer.created':
        await handleCustomerCreated(data);
        break;

      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.renewed':
        await handleSubscriptionUpdate(data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(data);
        break;

      default:
        console.log('Unhandled Dodo webhook type:', type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Dodo webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCustomerCreated(data: any) {
  const { customer_id, metadata } = data;
  const userId = metadata?.userId;

  if (!userId) {
    console.error('No userId in customer metadata');
    return;
  }

  await setCustomerId(userId, 'dodo', customer_id);
}

async function handleSubscriptionUpdate(data: any) {
  const {
    subscription_id,
    customer_id,
    status,
    plan_id,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    metadata,
  } = data;

  const userId = metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Map Dodo plan_id to our internal plan names
  const planMapping: Record<string, 'pro' | 'business'> = {
    'dodo_pro_monthly': 'pro',
    'dodo_pro_yearly': 'pro',
    'dodo_business_monthly': 'business',
    'dodo_business_yearly': 'business',
  };

  const plan = planMapping[plan_id] || 'pro';

  await upsertSubscription({
    id: subscription_id,
    userId,
    provider: 'dodo',
    status: mapDodoStatus(status),
    plan,
    priceId: plan_id,
    currentPeriodStart: new Date(current_period_start * 1000), // Convert Unix timestamp
    currentPeriodEnd: new Date(current_period_end * 1000),
    cancelAtPeriodEnd: cancel_at_period_end || false,
  });
}

async function handleSubscriptionCanceled(data: any) {
  const { subscription_id, metadata } = data;
  const userId = metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Update subscription status to canceled
  await upsertSubscription({
    ...data,
    userId,
    provider: 'dodo',
    status: 'canceled',
  });

  // Sync user plan (will set to free if no other active subscriptions)
  await syncUserPlanFromSubscription(userId);
}

function mapDodoStatus(dodoStatus: string): 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' {
  const statusMap: Record<string, any> = {
    'active': 'active',
    'cancelled': 'canceled',
    'canceled': 'canceled',
    'past_due': 'past_due',
    'trialing': 'trialing',
    'incomplete': 'incomplete',
  };

  return statusMap[dodoStatus.toLowerCase()] || 'active';
}
