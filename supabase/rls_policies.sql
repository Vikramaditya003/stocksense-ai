-- ─────────────────────────────────────────────────────────────────────────────
-- Forestock — Row Level Security (Clerk + Supabase)
-- Run this entire file in Supabase SQL Editor → new tab → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Enable RLS on all tables
ALTER TABLE forecasts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_waitlist  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback      ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any old/partial policies (safe to re-run)
DROP POLICY IF EXISTS "Users read own forecasts"   ON forecasts;
DROP POLICY IF EXISTS "Users read own plan"        ON user_plans;
DROP POLICY IF EXISTS "forecasts_owner"            ON forecasts;
DROP POLICY IF EXISTS "user_plans_owner"           ON user_plans;
DROP POLICY IF EXISTS "pro_waitlist_owner"         ON pro_waitlist;
DROP POLICY IF EXISTS "feedback_owner"             ON feedback;

-- Step 3: forecasts — full CRUD, own rows only
CREATE POLICY "forecasts_owner"
  ON forecasts FOR ALL
  USING     (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub')
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Step 4: user_plans — full CRUD, own row only
CREATE POLICY "user_plans_owner"
  ON user_plans FOR ALL
  USING     (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub')
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Step 5: pro_waitlist — full CRUD, own row only
CREATE POLICY "pro_waitlist_owner"
  ON pro_waitlist FOR ALL
  USING     (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub')
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Step 6: feedback — allow anonymous inserts; reads restricted to own rows
CREATE POLICY "feedback_owner"
  ON feedback FOR ALL
  USING     (clerk_user_id IS NULL OR clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub')
  WITH CHECK (clerk_user_id IS NULL OR clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Step 7: Verify — should show rowsecurity = true for all 4 tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('forecasts', 'user_plans', 'pro_waitlist', 'feedback');
