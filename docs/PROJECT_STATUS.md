# PROJECT STATUS

## 1. Project Overview

**IndexFast** is a SaaS platform that automates the submission of website URLs to search engines for faster indexing. It helps website owners, bloggers, and SEO professionals get their content indexed by search engines more quickly by integrating with Google Search Console and using the IndexNow protocol.

**Target Users:**

- Website owners and bloggers
- SEO professionals
- Content creators who need rapid content indexing

**Core Problem Solved:**
Traditional search engine indexing can take days or weeks. IndexFast accelerates this process by automatically submitting URLs from sitemaps to search engines via IndexNow and Google Search Console APIs, significantly reducing the time to index.

---

## 2. Current Tech Stack

**Frontend Framework:**

- Next.js 16.1.5 (App Router with Turbopack)
- React 19
- TypeScript

**Styling:**

- Tailwind CSS
- Shadcn UI components
- Framer Motion for animations

**Authentication:**

- StackAuth (with cookie-based token store)
- Google OAuth (separate flow for GSC integration)

**Database:**

- PostgreSQL (via Vercel Postgres)
- Drizzle ORM for type-safe queries

**Deployment:**

- Target: Vercel
- Runtime: Node.js with Edge middleware

**External APIs:**

- Google Search Console API (webmasters v3)
- IndexNow Protocol
- Stripe (planned for payments - not yet integrated)

**Development Tools:**

- Bun as package manager and runtime
- ESLint for linting
- Drizzle Kit for database migrations

---

## 3. Implemented Features

### 3.1 User Authentication & Registration

- **Description:** Users can sign up and log in via StackAuth using email/password, GitHub, or other OAuth providers
- **Location:**
  - `app/login/page.tsx` - Login page
  - `app/signup/page.tsx` - Signup page
  - `components/auth/login-form.tsx` - Unified auth form
  - `components/auth/user-sync.tsx` - Auto-sync component
  - `app/actions/dashboard.ts:getOrCreateUser` - User creation logic
- **Limitations:**
  - No email verification enforcement
  - No password reset UI (relies on StackAuth defaults)

### 3.2 Google Search Console Integration

- **Description:** Users can connect their Google account to import verified sites from GSC
- **Location:**
  - `app/actions/gsc.ts` - OAuth flow and token management
  - `app/api/auth/google/callback/route.ts` - OAuth callback handler
  - `components/sites-manager.tsx` - UI for connecting and importing
- **Limitations:**
  - Requires manual Google Cloud Console setup
  - No disconnect UI (only backend function exists)
  - Token refresh happens on-demand, not proactively

### 3.3 Site Management

- **Description:** Users can import sites from GSC or add manually, view verified status
- **Location:**
  - `components/sites-manager.tsx` - Main UI
  - `app/actions/dashboard.ts:saveSite` - Save site to database
  - `app/dashboard/sites/page.tsx` - Sites dashboard page
- **Limitations:**
  - Manual site addition is disabled (UI shows "coming soon")
  - No site deletion functionality
  - No bulk import from GSC (one at a time)

### 3.4 Sitemap Syncing & URL Submission

- **Description:** Users can sync sitemaps and submit URLs to IndexNow
- **Location:**
  - `app/api/sync-sitemaps/route.ts` - Main sync endpoint
  - `lib/indexnow.ts` - IndexNow API integration
  - `components/sites-manager.tsx` - "Sync & Index" button
- **Limitations:**
  - No automatic/scheduled syncing (manual trigger only)
  - No Google Indexing API integration (only IndexNow)
  - No sitemap validation before parsing
  - No error recovery for partial failures

### 3.5 Auto-Index Toggle

- **Description:** Per-site toggle for enabling/disabling automatic indexing
- **Location:**
  - `components/sites-manager.tsx:handleToggleAutoIndex`
  - `app/actions/dashboard.ts:toggleAutoIndex`
- **Limitations:**
  - Toggle exists but automation is not implemented
  - No cron job or background worker to actually auto-index

### 3.6 Dashboard & Analytics

- **Description:** Users can view their sites, recent submissions, and account credits
- **Location:**
  - `app/dashboard/page.tsx` - Main dashboard
  - `components/sites-grid.tsx` - Sites overview
  - `components/submissions-list.tsx` - Submission history
  - `app/dashboard/analytics/page.tsx` - Analytics page (minimal)
- **Limitations:**
  - Analytics page is placeholder only
  - No charts or graphs
  - No detailed submission metrics
  - No real-time updates

### 3.7 Credit System

- **Description:** Users have a credit balance for limiting submissions
- **Location:**
  - `app/actions/dashboard.ts:checkCredits` - Check balance
  - `app/actions/dashboard.ts:deductCredit` - Deduct on submission
  - Database: `users.credits` field
- **Limitations:**
  - Credits are not actually deducted in sync-sitemaps flow
  - No credit purchase/top-up functionality
  - No daily credit reset logic
  - No plan-based credit limits

### 3.8 Pricing Page

- **Description:** Marketing page showing pricing tiers
- **Location:**
  - `app/pricing/page.tsx`
  - `components/pricing-section.tsx`
- **Limitations:**
  - No checkout integration
  - No plan selection/upgrade flow
  - Stripe not integrated

### 3.9 Blog/Content Pages

- **Description:** Static blog posts for SEO
- **Location:**
  - `app/blog/[slug]/page.tsx` - Dynamic blog posts
  - Blog content hardcoded in component
- **Limitations:**
  - No CMS integration
  - Posts are hardcoded, not in database
  - No blog admin panel

---

## 4. Authentication & Authorization

### User Authentication

1. **StackAuth** is the primary authentication provider
2. Users can sign in via:
   - Email/password (credential-based)
   - OAuth providers (GitHub, Google, etc. - configured in StackAuth)
3. Session management uses cookie-based tokens (`stackClientApp` with `"nextjs-cookie"`)
4. The `UserSync` component (in root layout) automatically creates/updates users in local DB on login

### Google Search Console Access

1. **Separate OAuth flow** from StackAuth login
2. Uses `.env` credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
3. Refresh tokens stored in `users.gscRefreshToken`
4. Access tokens auto-refresh when expired
5. Scopes: `https://www.googleapis.com/auth/webmasters.readonly`

### User-Site Ownership

- Sites table has `userId` field referencing authenticated user
- `sites` table has unique constraint on `(userId, gscSiteUrl)`
- Server actions verify user identity via `stackServerApp.getUser()`
- **Security Gap:** `toggleAutoIndex` checks ownership but other actions may have gaps

---

## 5. Database Schema (Current State)

### `users` Table

- **Purpose:** Store local user data synced from StackAuth
- **Key Fields:**
  - `id` (text, PK) - StackAuth user ID
  - `email` (text) - User email
  - `plan` (text) - Subscription tier (free/pro/business)
  - `credits` (integer) - Daily submission quota
  - `gscRefreshToken`, `gscAccessToken`, `gscTokenExpiry` - Google OAuth tokens
  - `stripeCustomerId`, `subscriptionStatus` - Payment integration (unused)
- **Relationships:** Referenced by `sites` (via userId) and `subscriptions`

### `sites` Table

- **Purpose:** Store user's verified websites from GSC
- **Key Fields:**
  - `id` (uuid, PK)
  - `userId` (text) - Owner reference
  - `domain` (text) - Human-readable domain
  - `gscSiteUrl` (text) - Exact GSC property URL
  - `permissionLevel` (text) - GSC permission level
  - `isVerified` (boolean) - Verification status
  - `autoIndex` (boolean) - Auto-indexing toggle
  - `lastSyncAt` (timestamp) - Last sitemap sync
- **Unique Constraint:** `(userId, gscSiteUrl)`
- **Relationships:** Has many `submissions`

### `submissions` Table

- **Purpose:** Track individual URL indexing submissions
- **Key Fields:**
  - `id` (uuid, PK)
  - `siteId` (uuid, FK) - References sites(id), cascade delete
  - `url` (text) - Submitted URL
  - `status` (integer) - HTTP response code
  - `responseBody` (jsonb) - API response details
  - `submittedAt` (timestamp) - Submission timestamp
- **Relationships:** Belongs to `sites`

### `subscriptions` Table

- **Purpose:** Store Stripe subscription data (not yet used)
- **Key Fields:**
  - `id` (text, PK) - Stripe subscription ID
  - `userId` (text, FK) - References users(id)
  - `status`, `priceId`, period dates
- **Status:** Schema exists but no insertion/update logic

### `usageLogs` Table

- **Purpose:** Track daily usage per user
- **Key Fields:**
  - `userId`, `date`, `count`, `type`
- **Unique Constraint:** `(userId, date, type)`
- **Status:** Schema exists but no insertion logic

---

## 6. Current User Flow

### Signup Flow

1. User visits `/login` or `/signup`
2. `LoginForm` component renders StackAuth `SignIn`/`SignUp` components
3. User creates account via email/password or OAuth
4. StackAuth handles authentication
5. User is redirected to `/dashboard`
6. `UserSync` component (in root layout) detects login
7. `syncUser()` server action calls `getOrCreateUser()`
8. User record created in local DB with default plan (`free`) and credits (`10`)

### Dashboard Access

1. User navigates to `/dashboard`
2. `getDashboardData()` server action executes:
   - Fetches current user from StackAuth
   - Syncs user to local DB if needed
   - Queries user's sites and recent submissions
3. Dashboard renders:
   - User credits and plan
   - Sites grid with verification status
   - Recent submissions list
4. If no sites exist, shows "Import from GSC" prompt

### Importing from Google Search Console

1. User clicks "Import from GSC" button in `SitesManager`
2. `openGSCModal()` checks if GSC is connected via `checkGSCConnection()`
3. **If NOT connected:**
   - Modal shows "Connect Google Account" button
   - User clicks button → `initiateGoogleOAuth()` generates OAuth URL
   - User redirected to Google consent screen
   - After consent, redirected to `/api/auth/google/callback`
   - Callback exchanges code for tokens, stores in DB
   - User redirected back to `/dashboard?gsc_connected=true`
4. **If connected:**
   - `fetchGSCSites()` calls GSC API with stored access token
   - If token expired, auto-refreshes using refresh token
   - Modal displays list of user's GSC properties
5. User clicks on a site to import
6. `handleImport()` calls `saveSite()` server action
7. Site saved to DB with `userId` and `gscSiteUrl`
8. Site appears in dashboard sites grid

---

## 7. What Is NOT Implemented Yet

### Missing Backend Features

- **Automated indexing:** Auto-index toggle exists but no cron/scheduler
- **Google Indexing API:** Only IndexNow is integrated
- **Credit deduction:** Not actually called in sync flow
- **Daily credit reset:** No logic to refresh credits
- **Plan enforcement:** No validation of plan limits
- **Webhook handling:** No Stripe webhooks for subscription events
- **Email notifications:** No email service integration
- **Usage logging:** Schema exists but no insertion

### Missing Automation

- **Scheduled sitemap syncing:** Currently manual-only
- **Automatic new URL detection:** No polling for new sitemap entries
- **Retry logic:** Failed submissions are not retried
- **Batch processing:** All URLs submitted synchronously

### Missing Indexing Logic

- **Google Indexing API integration:** Not implemented
- **Bing IndexNow integration:** Only generic IndexNow endpoint
- **Sitemap validation:** No pre-processing of sitemaps
- **URL deduplication:** May submit same URL multiple times
- **Crawl delay respect:** No rate limiting per site

### Missing Monetization

- **Stripe checkout:** Pricing page has no checkout links
- **Subscription management:** No upgrade/downgrade flow
- **Payment method storage:** No credit card collection
- **Invoice generation:** Not implemented
- **Trial period logic:** No free trial handling

### Missing UI/UX Features

- **Site deletion:** No UI or API to remove sites
- **Manual URL submission:** UI disabled, not implemented
- **Bulk actions:** No multi-select for sites
- **Real-time notifications:** No toast/alert system for async operations
- **Settings page:** `/dashboard/settings` exists but is placeholder

---

## 8. Known Risks or Gaps

### Security

- **Insufficient authorization checks:** Some server actions may not verify site ownership
- **No rate limiting:** API endpoints lack rate limiting per user
- **Token storage:** OAuth tokens stored as plain text in database (should encrypt)
- **CSRF protection:** No explicit CSRF tokens (relies on Next.js defaults)
- **Input validation:** Limited validation on client and server
- **No API key rotation:** GSC tokens never proactively refreshed

### Scalability

- **Synchronous URL submission:** No job queue for async processing
- **No caching:** Database queries not cached (e.g., user data on every page)
- **In-memory state:** No Redis/cache layer for session or frequently accessed data
- **Large sitemap handling:** May timeout on sitemaps with 50,000+ URLs
- **Database connection pooling:** May hit connection limits under load

### SEO / API Limitations

- **IndexNow quota:** No tracking of IndexNow submission limits per day
- **GSC API quota:** Google Search Console API has daily quotas (not tracked)
- **IndexNow acceptance:** Not all search engines support IndexNow
- **Google Indexing API not used:** More reliable than IndexNow for Google
- **No sitemap compression:** Gzipped sitemaps may not parse correctly
- **No sitemap index support:** Only processes single sitemaps

### Data Integrity

- **No transaction handling:** Multi-step operations not atomic
- **No soft deletes:** Hard deletes may orphan submission records
- **No audit trail:** No logging of who changed what
- **Timestamp precision:** Some timestamps may be inconsistent

### User Experience

- **No loading states:** Some async operations lack proper loading indicators
- **Error messages:** Generic error messages, not user-friendly
- **No email confirmation:** Users not notified of important events
- **No dark mode toggle:** Forced dark mode only

---

## 9. Suggested Next High-Level Milestones

### Phase 1: Core Functionality Completion

- Complete credit deduction logic in sync flow
- Implement daily credit reset cron job
- Add Google Indexing API integration alongside IndexNow
- Build automated indexing scheduler for auto-index enabled sites
- Add sitemap validation and error handling

### Phase 2: Monetization & Payments

- Integrate Stripe checkout for plan upgrades
- Implement subscription webhook handlers
- Build plan enforcement logic (credit limits per tier)
- Create customer portal for managing subscriptions
- Add invoice/receipt generation

### Phase 3: Reliability & Scale

- Implement job queue (e.g., BullMQ) for async URL processing
- Add retry logic with exponential backoff for failed submissions
- Implement rate limiting per user and per site
- Add caching layer (Redis) for user sessions and frequently accessed data
- Optimize database queries and add proper indexing

### Phase 4: Enhanced UX & Features

- Build real-time notifications system (WebSocket or SSE)
- Add manual URL submission interface
- Implement site deletion with confirmation
- Create detailed analytics dashboard with charts
- Add email notifications for important events (successful indexing, quota exceeded)

### Phase 5: Security & Compliance

- Encrypt OAuth tokens at rest
- Add comprehensive authorization checks across all server actions
- Implement audit logging for sensitive operations
- Add GDPR-compliant data export/deletion
- Set up security monitoring and alerting

### Phase 6: Developer Experience

- Add comprehensive API documentation
- Create developer API keys for programmatic access
- Build webhooks for third-party integrations
- Add public API with authentication
- Implement OpenAPI/Swagger spec

### Phase 7: Advanced Features

- Support for sitemap index files
- Crawl budget optimization recommendations
- Indexing status tracking via GSC API
- Multi-language support
- White-label solution for agencies
