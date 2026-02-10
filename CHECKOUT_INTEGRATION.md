# Dodo Payments Checkout Integration

## Overview

This implementation provides a complete Dodo Payments checkout flow for IndexFast subscriptions.

## Components

### 1. Dodo API Client (`lib/dodo-client.ts`)

Server-side client for interacting with Dodo Payments API.

**Features:**

- Customer creation and retrieval
- Checkout session management
- Idempotent customer operations (get-or-create)
- Proper error handling
- Type-safe API interactions

**Security:**

- API key never exposed to client
- Runs exclusively on server
- Validates environment variables

### 2. Server Actions (`app/actions/checkout.ts`)

Server actions for checkout flow.

#### `createCheckoutSession()`

**Parameters:**

```typescript
{
  plan: 'pro' | 'business',
  billingPeriod?: 'monthly' | 'yearly' // defaults to 'monthly'
}
```

**Flow:**

1. Authenticates user via StackAuth
2. Retrieves or creates Dodo customer
3. Stores `dodoCustomerId` in users table
4. Creates checkout session with success/cancel URLs
5. Returns checkout URL for redirect

**Response:**

```typescript
{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}
```

#### `getCheckoutSessionStatus()`

Verifies checkout session status after successful payment.

### 3. Client Component (`components/checkout-button.tsx`)

React component for triggering checkout.

**Props:**

```typescript
{
  plan: 'pro' | 'business';
  billingPeriod?: 'monthly' | 'yearly';
  children?: React.ReactNode;
  className?: string;
}
```

**Features:**

- Loading states during checkout
- Error handling with toast notifications
- Automatic redirect to Dodo checkout page
- Customizable button text

## Environment Variables

Add these to your `.env`:

```env
# Required
DODOPAYMENTS_API_KEY=your_api_key_here

# Optional - Plan IDs (defaults provided)
DODO_PRO_MONTHLY_PLAN_ID=plan_pro_monthly
DODO_PRO_YEARLY_PLAN_ID=plan_pro_yearly
DODO_BUSINESS_MONTHLY_PLAN_ID=plan_business_monthly
DODO_BUSINESS_YEARLY_PLAN_ID=plan_business_yearly

# App URL for redirects
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Usage Examples

### Basic Usage (Pricing Page)

```tsx
import { CheckoutButton } from "@/components/checkout-button";

export default function PricingPage() {
  return (
    <div>
      <h2>Pro Plan</h2>
      <CheckoutButton plan="pro" billingPeriod="monthly">
        Subscribe Now
      </CheckoutButton>
    </div>
  );
}
```

### With Custom Styling

```tsx
<CheckoutButton
  plan="business"
  billingPeriod="yearly"
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
>
  Get Business Plan
</CheckoutButton>
```

### Programmatic Checkout (Advanced)

```tsx
"use client";

import { createCheckoutSession } from "@/app/actions/checkout";

async function handleUpgrade() {
  const result = await createCheckoutSession({
    plan: "pro",
    billingPeriod: "monthly",
  });

  if (result.success && result.checkoutUrl) {
    window.location.href = result.checkoutUrl;
  }
}
```

## Checkout Flow

1. **User clicks checkout button**
   - `CheckoutButton` component triggers
   - Loading state activates

2. **Server action executes**
   - User authenticated via StackAuth
   - Dodo customer created/retrieved
   - `dodoCustomerId` stored in database
   - Checkout session created

3. **Redirect to Dodo**
   - User redirected to `checkoutUrl`
   - Hosted checkout page by Dodo

4. **Payment completion**
   - Success → redirect to `/dashboard?checkout=success&session_id={ID}`
   - Cancel → redirect to `/pricing?checkout=canceled`

5. **Webhook triggers** (automatic)
   - Dodo sends webhook to `/api/webhooks/dodo`
   - Subscription created in database
   - User plan synced automatically

## Success Page Handling

Create a success handler in your dashboard:

```tsx
// app/dashboard/page.tsx

import { getCheckoutSessionStatus } from "@/app/actions/checkout";

export default async function DashboardPage({ searchParams }) {
  if (searchParams.checkout === "success" && searchParams.session_id) {
    const status = await getCheckoutSessionStatus(searchParams.session_id);

    if (status.success) {
      // Show success message
      return <SuccessMessage />;
    }
  }

  // Normal dashboard
  return <Dashboard />;
}
```

## Error Handling

All errors are handled gracefully:

### Server-side Errors

- API key missing → throws error (caught by action)
- Customer creation fails → returns error message
- Checkout session fails → returns error message

### Client-side Errors

- Network errors → toast notification
- Invalid response → toast notification
- User not logged in → error message displayed

## Testing

### Test Checkout Flow

1. **Setup test environment:**

   ```bash
   # Use Dodo Payments test API key
   DODOPAYMENTS_API_KEY=test_sk_xxx
   ```

2. **Click checkout button:**
   - Should create customer
   - Should create checkout session
   - Should redirect to Dodo checkout page

3. **Complete test payment:**
   - Use Dodo test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

4. **Verify webhook:**
   - Check `/api/webhooks/dodo` logs
   - Verify subscription created in database
   - Verify user plan updated

### Test Customer Deduplication

```typescript
// First checkout
const result1 = await createCheckoutSession({ plan: "pro" });
// Second checkout (same user)
const result2 = await createCheckoutSession({ plan: "business" });

// Both should use the same dodoCustomerId
```

## Security Considerations

✅ **API key never exposed to client**

- `getDodoClient()` only runs server-side
- API key only in environment variables
- Server actions enforce authentication

✅ **Customer ownership verified**

- User authenticated before checkout
- Customer metadata includes userId
- Webhook verifies userId from metadata

✅ **No sensitive data in URLs**

- Checkout URLs are temporary
- Session IDs are non-sensitive
- User data not passed in redirects

✅ **Idempotent operations**

- Duplicate customer creation prevented
- Safe to retry checkout
- No data corruption on retries

## Troubleshooting

### "API key is required" error

- Check `DODOPAYMENTS_API_KEY` is set
- Verify it's in `.env` or `.env.local`
- Restart dev server after adding

### Checkout URL not working

- Verify app URL in environment
- Check Dodo dashboard for session
- Ensure plan IDs are correct

### Customer not created

- Check Dodo API logs
- Verify email is valid
- Check for existing customer in Dodo dashboard

### Webhook not received

- Verify webhook URL in Dodo dashboard
- Check webhook secret is correct
- Test webhook with Dodo CLI/dashboard

## Next Steps

1. **Style the checkout button** to match your design
2. **Add plan comparison** on pricing page
3. **Implement customer portal** for managing subscriptions
4. **Add cancellation flow** (coming soon)
5. **Create admin dashboard** to view all subscriptions

## API Reference

### Dodo API Endpoints Used

| Endpoint                   | Method | Purpose                 |
| -------------------------- | ------ | ----------------------- |
| `/customers`               | POST   | Create customer         |
| `/customers?email={email}` | GET    | Get customer by email   |
| `/checkout/sessions`       | POST   | Create checkout session |
| `/checkout/sessions/{id}`  | GET    | Get session status      |

## Support

For Dodo Payments API documentation:

- https://docs.dodopayments.com

For integration issues:

- Check server logs for detailed errors
- Verify environment variables
- Test with Dodo test mode
