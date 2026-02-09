import { pgTable, text, timestamp, uuid, integer, boolean, unique, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // StackAuth ID
  email: text('email').notNull(),
  plan: text('plan').default('free').notNull(), // free, pro, business
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: text('subscription_status'), // active, canceled, past_due
  credits: integer('credits').default(10).notNull(), // Daily submission credits
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(), // Stripe Subscription ID
  userId: text('user_id').references(() => users.id).notNull(),
  status: text('status').notNull(),
  priceId: text('price_id'),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
  userId: text('user_id').notNull(), // Intentionally not referencing users.id yet to allow sites for anon/unmigrated users if needed, or link later. Ideally should ref users.id.
  domain: text('domain').notNull(),
  gscSiteUrl: text('gsc_site_url').notNull(),
  permissionLevel: text('permission_level').default('siteOwner'),
  isVerified: boolean('is_verified').default(false).notNull(),
  autoIndex: boolean('auto_index').default(false).notNull(),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
    unq: unique().on(t.userId, t.gscSiteUrl),
}));

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  status: integer('status').notNull(),
  responseBody: jsonb('response_body'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});
