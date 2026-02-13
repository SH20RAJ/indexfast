CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"key_last4" text NOT NULL,
	"is_test" boolean DEFAULT false NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sitemaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"url" text NOT NULL,
	"last_crawled" timestamp,
	"urls_count" integer DEFAULT 0,
	"is_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sitemaps_site_id_url_unique" UNIQUE("site_id","url")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "sitemap_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "index_now_key" text;--> statement-breakpoint
ALTER TABLE "sites" ADD COLUMN "index_now_key_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "provider" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "plan" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "cancel_at_period_end" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dodo_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gsc_refresh_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gsc_access_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gsc_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sitemaps" ADD CONSTRAINT "sitemaps_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;