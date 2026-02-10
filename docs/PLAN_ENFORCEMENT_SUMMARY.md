# Plan & Credit Enforcement

## Summary of Changes

I have implemented strict plan and credit enforcement across the application to ensure usage limits are respected and monetizeable features are gated correctly.

### 1. Credit Management (`app/actions/dashboard.ts`)

- **`checkCredits(amount)`**: Updated to accept a required `amount`. It verifies if the user has at least that many credits available.
- **`deductCredit(amount)`**: Updated to atomically deduct a specific `amount` of credits. It uses a conditional update `WHERE credits >= amount` to prevent race conditions and ensure balances never drop below zero.

### 2. Sitemap Sync Enforcement (`app/api/sync-sitemaps/route.ts`)

- **Pre-check**: Before processing a sitemap, the total number of URLs is calculated.
- **Credit Validation**: Checks if the user has enough credits for _all_ URLs in the batch.
- **Truncation Strategy**: If credits are insufficient for the full batch, the valid approach implemented is to truncate the batch to the number of available credits (rather than rejecting entirely), maximizing utility for the user while protecting resources.
- **Deduction**: Credits are deducted based on the _actual_ number of URLs submitted.
- **Zero-Credit Block**: If a user has 0 credits, the request is rejected immediately with a 403.

### 3. Feature Gating (`app/actions/dashboard.ts`)

- **Auto-Index Gating**: The `toggleAutoIndex` action now checks the user's plan.
- **Restriction**: Users on the `free` plan are identifyingly blocked from enabling auto-indexing, with a clear error message: "Auto-index is available on Pro and Business plans only."

## Security & Integrity

- **Database Integrity**: Using atomic SQL updates prevents race conditions on credit balances.
- **Plan Verification**: Server-side checks ensure client-side UI restrictions cannot be bypassed.
- **Error Handling**: Graceful failures and clear messages for insufficient credits or plan restrictions.

## Usage Scenarios

1.  **Usage**: User with 5 credits tries to submit 10 URLs.
    - **Result**: 5 URLs are submitted, 5 credits deducted, user sees 0 credits remaining.
2.  **Usage**: User with 0 credits tries to submit.
    - **Result**: Request rejected (403).
3.  **Usage**: Free user tries to enable auto-index.
    - **Result**: Action fails with upgrade prompt error.
