-- Migration: Add Dodo Payments Support
-- Description: Adds dodoCustomerId to users and updates subscriptions table for multi-provider support
-- Date: 2026-02-10

-- Step 1: Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS dodo_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP;

-- Step 2: Update subscriptions table to support multiple providers
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'pro';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Step 3: Add comment to clarify provider field
COMMENT ON COLUMN subscriptions.provider IS 'Payment provider: stripe or dodo';
COMMENT ON COLUMN subscriptions.plan IS 'Subscription plan tier: pro, business';
COMMENT ON COLUMN users.plan_expires_at IS 'When the current plan expires, derived from active subscription';
COMMENT ON COLUMN users.dodo_customer_id IS 'Dodo Payments customer identifier';

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_users_dodo_customer_id ON users(dodo_customer_id);

-- Step 5: Add constraint to ensure valid providers
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS check_provider_valid;
ALTER TABLE subscriptions ADD CONSTRAINT check_provider_valid CHECK (provider IN ('stripe', 'dodo'));

-- Step 6: Add constraint to ensure valid plan values
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS check_plan_valid;
ALTER TABLE subscriptions ADD CONSTRAINT check_plan_valid CHECK (plan IN ('pro', 'business'));
