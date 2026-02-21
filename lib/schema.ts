import { pgTable, text, timestamp, uuid, integer, boolean, unique, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // StackAuth ID
  email: text('email').notNull(),
  plan: text('plan').default('free').notNull(), // free, pro, business - derived from active subscription
  planExpiresAt: timestamp('plan_expires_at'), // When the current plan expires (null for free/lifetime)
  stripeCustomerId: text('stripe_customer_id'), // Stripe customer ID
  dodoCustomerId: text('dodo_customer_id'), // Dodo Payments customer ID
  subscriptionStatus: text('subscription_status'), // active, canceled, past_due, trialing
  credits: integer('credits').default(10).notNull(), // Daily submission credits
  gscRefreshToken: text('gsc_refresh_token'), // Google OAuth refresh token for GSC API
  gscAccessToken: text('gsc_access_token'), // Google OAuth access token for GSC API
  gscTokenExpiry: timestamp('gsc_token_expiry'), // When the access token expires
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(), // Subscription ID from provider (Stripe or Dodo)
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(), // 'stripe' or 'dodo'
  status: text('status').notNull(), // active, canceled, past_due, trialing, incomplete
  plan: text('plan').notNull(), // pro, business - maps to users.plan
  priceId: text('price_id'), // Price/Plan ID from provider
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  count: integer('count').default(0).notNull(),
  type: text('type').default('submission').notNull(), // submission, crawl, etc.
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.date, t.type),
}));

export const sites = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  domain: text('domain').notNull(),
  gscSiteUrl: text('gsc_site_url').notNull(), // The actual ID from GSC (sc-domain: or https://)
  permissionLevel: text('permission_level').default('siteOwner'),
  sitemapCount: integer('sitemap_count').default(0),
  isVerified: boolean('is_verified').default(false).notNull(),
  autoIndex: boolean('auto_index').default(false).notNull(),
  indexNowKey: text('index_now_key'),  // Per-site IndexNow API key
  indexNowKeyLocation: text('index_now_key_location'), // Custom URL to the key file
  indexNowKeyVerified: boolean('index_now_key_verified').default(false).notNull(), // Whether key file is verified on domain
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
    unq: unique().on(t.userId, t.gscSiteUrl),
}));

export const sitemaps = pgTable('sitemaps', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  lastCrawled: timestamp('last_crawled'),
  urlsCount: integer('urls_count').default(0),
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
    unq: unique().on(t.siteId, t.url),
}));

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  status: integer('status').notNull(),
  responseBody: jsonb('response_body'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),               // "My CI/CD Key"
  keyHash: text('key_hash').notNull(),         // SHA-256 hash of the full key
  keyPrefix: text('key_prefix').notNull(),     // "ixf_live_" or "ixf_test_"
  keyLast4: text('key_last4').notNull(),       // last 4 chars for display
  isTest: boolean('is_test').default(false).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
