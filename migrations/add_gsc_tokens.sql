-- Manual SQL migration for adding GSC OAuth token fields
-- Run this in your PostgreSQL database if drizzle-kit push fails

ALTER TABLE users ADD COLUMN IF NOT EXISTS gsc_refresh_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gsc_access_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gsc_token_expiry TIMESTAMP;
