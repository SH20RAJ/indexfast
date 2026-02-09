import { pgTable, text, timestamp, uuid, integer, unique } from 'drizzle-orm/pg-core';

export const sites = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  domain: text('domain').notNull(),
  gscSiteUrl: text('gsc_site_url').notNull(),
  permissionLevel: text('permission_level').default('siteOwner'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
    unq: unique().on(t.userId, t.gscSiteUrl),
}));

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  url: text('url').notNull(),
  status: integer('status').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});
