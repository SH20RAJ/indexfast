# Subscription Integration Guide

## Overview

The database schema now supports both Stripe and Dodo Payments as subscription providers. This allows users to subscribe via either payment gateway, with proper tracking and plan synchronization.

## Database Schema Updates

### Users Table - New Fields

```sql
ALTER TABLE users ADD COLUMN dodo_customer_id TEXT;
ALTER TABLE users ADD COLUMN plan_expires_at TIMESTAMP;
```

- `dodo_customer_id`: Stores the Dodo Payments customer identifier
- `plan_expires_at`: Tracks when the current plan expires (derived from active subscription)

### Subscriptions Table - Enhanced Fields

```sql
ALTER TABLE subscriptions ADD COLUMN provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE subscriptions ADD COLUMN plan TEXT NOT NULL DEFAULT 'pro';
ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN updated_at TIMESTAMP DEFAULT NOW() NOT NULL;
```

- `provider`: Either 'stripe' or 'dodo' - identifies the payment provider
- `plan`: The subscription tier ('pro' or 'business')
- `cancel_at_period_end`: Whether the subscription will cancel at period end
- `updated_at`: Last modification timestamp

## Migration Instructions

### Step 1: Run the SQL Migration

```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL -f migrations/add_dodo_payments_support.sql
```

Or run via Drizzle Kit if you prefer:

```bash
bun drizzle-kit push
```

### Step 2: Update Environment Variables

Add Dodo Payments credentials to your `.env`:

```env
# Dodo Payments
DODO_API_KEY=your_dodo_api_key
DODO_SECRET_KEY=your_dodo_secret_key
DODO_WEBHOOK_SECRET=your_dodo_webhook_secret
NEXT_PUBLIC_DODO_PUBLIC_KEY=your_dodo_public_key
```

### Step 3: Configure Webhook Endpoints

Set up webhook endpoints in both Stripe and Dodo Payments dashboards:

**Stripe Webhooks:**

- Endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

**Dodo Payments Webhooks:**

- Endpoint: `https://yourdomain.com/api/webhooks/dodo`
- Events: `subscription.created`, `subscription.updated`, `subscription.canceled`, `subscription.renewed`

## Usage Examples

### 1. Get Active Subscription

```typescript
import { getActiveSubscription } from "@/lib/subscription-utils";

const subscription = await getActiveSubscription(userId);
if (subscription) {
  console.log(
    `User has ${subscription.plan} plan via ${subscription.provider}`,
  );
}
```

### 2. Create/Update Subscription (from webhook)

```typescript
import { upsertSubscription } from "@/lib/subscription-utils";

await upsertSubscription({
  id: "sub_dodo_123",
  userId: "user_abc",
  provider: "dodo",
  status: "active",
  plan: "pro",
  priceId: "dodo_pro_monthly",
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
});
```

### 3. Check Plan Status

```typescript
import { hasActiveSubscription, isPlanExpired } from "@/lib/subscription-utils";

const isActive = await hasActiveSubscription(userId);
const user = await db.select().from(users).where(eq(users.id, userId));
const expired = isPlanExpired(user[0].planExpiresAt);
```

### 4. Get/Set Customer ID

```typescript
import { getCustomerId, setCustomerId } from "@/lib/subscription-utils";

// Get Dodo customer ID
const dodoCustomerId = await getCustomerId(userId, "dodo");

// Set Dodo customer ID (usually done during checkout)
await setCustomerId(userId, "dodo", "cus_dodo_xyz");
```

## Plan Derivation Logic

The `users.plan` and `users.plan_expires_at` fields are **derived** from the active subscription:

1. When a subscription is created/updated, the webhook handler calls `upsertSubscription()`
2. `upsertSubscription()` automatically calls `syncUserPlanFromSubscription()`
3. `syncUserPlanFromSubscription()` queries the most recent active subscription
4. If an active subscription exists:
   - `users.plan` = `subscriptions.plan`
   - `users.plan_expires_at` = `subscriptions.current_period_end`
5. If no active subscription exists:
   - `users.plan` = 'free'
   - `users.plan_expires_at` = null

## Credits Management

Credits are plan-based:

```typescript
import { getPlanCredits } from "@/lib/subscription-utils";

const credits = getPlanCredits("pro"); // Returns 100
```

Default credits per plan:

- **Free**: 10 credits
- **Pro**: 100 credits
- **Business**: 1000 credits

You can implement daily credit reset logic based on `users.plan`.

## Webhook Implementation Checklist

### Stripe Webhooks

- [ ] Implement `/api/webhooks/stripe/route.ts`
- [ ] Handle `customer.subscription.created`
- [ ] Handle `customer.subscription.updated`
- [ ] Handle `customer.subscription.deleted`
- [ ] Verify webhook signature

### Dodo Webhooks

- [x] Created `/api/webhooks/dodo/route.ts`
- [x] Handle `subscription.created`
- [x] Handle `subscription.updated`
- [x] Handle `subscription.canceled`
- [ ] Implement signature verification (TODO: based on Dodo docs)
- [ ] Test with Dodo Payments sandbox

## Testing

### Manual Testing Steps

1. **Create a Dodo Payments subscription** (via checkout flow)
2. **Verify webhook received** at `/api/webhooks/dodo`
3. **Check database**:
   ```sql
   SELECT * FROM subscriptions WHERE user_id = 'test_user_id';
   SELECT plan, plan_expires_at FROM users WHERE id = 'test_user_id';
   ```
4. **Cancel subscription** in Dodo dashboard
5. **Verify webhook updates** the subscription status to 'canceled'
6. **Verify user plan** reverts to 'free' (if no other active subscriptions)

### Automated Testing

```typescript
// Example test
import {
  upsertSubscription,
  syncUserPlanFromSubscription,
} from "@/lib/subscription-utils";

test("should update user plan when subscription created", async () => {
  await upsertSubscription({
    id: "test_sub",
    userId: "test_user",
    provider: "dodo",
    status: "active",
    plan: "pro",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const user = await db.select().from(users).where(eq(users.id, "test_user"));
  expect(user[0].plan).toBe("pro");
});
```

## Next Steps

1. **Implement Stripe webhook handler** (similar to Dodo)
2. **Create checkout flows** for both Stripe and Dodo
3. **Add customer portal** for managing subscriptions
4. **Implement daily credit reset cron job**
5. **Add subscription status UI** in dashboard
6. **Create admin panel** to view all subscriptions

## Security Considerations

- **Always verify webhook signatures** before processing
- **Store API keys securely** in environment variables
- **Never expose secret keys** to the client
- **Implement rate limiting** on webhook endpoints
- **Log all subscription changes** for audit trail

## Support

For issues or questions:

1. Check Dodo Payments documentation
2. Review webhook logs in your provider dashboards
3. Check database logs for constraint violations
4. Verify environment variables are set correctly
