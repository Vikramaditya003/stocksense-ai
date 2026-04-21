-- ─────────────────────────────────────────────────────────────────────────────
-- Forestock — Row Level Security Policies
--
-- HOW TO APPLY:
--   1. Go to Supabase Dashboard → SQL Editor
--   2. Paste and run this entire file
--
-- WHY:
--   The app uses the service-role key server-side (bypasses RLS).
--   These policies are a database-level backstop — if the anon key is ever
--   used accidentally, or a future route forgets an auth check, Supabase
--   itself will block cross-user data access.
--
-- NOTE ON CLERK + SUPABASE JWT:
--   Clerk embeds the user ID in the JWT `sub` claim. Supabase reads it via
--   auth.jwt() ->> 'sub'. To activate this, add a Clerk JWT template named
--   "supabase" with { "sub": "{{user.id}}" } in the Clerk dashboard.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enable RLS on all user-data tables ───────────────────────────────────────
ALTER TABLE forecasts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_waitlist  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback      ENABLE ROW LEVEL SECURITY;

-- ── Drop existing policies (idempotent re-run) ────────────────────────────────
DROP POLICY IF EXISTS "forecasts_owner"    ON forecasts;
DROP POLICY IF EXISTS "user_plans_owner"   ON user_plans;
DROP POLICY IF EXISTS "pro_waitlist_owner" ON pro_waitlist;
DROP POLICY IF EXISTS "feedback_owner"     ON feedback;

-- ── forecasts ─────────────────────────────────────────────────────────────────
-- Users can only read/write/delete their own forecast rows.
CREATE POLICY "forecasts_owner"
  ON forecasts
  FOR ALL
  USING  (clerk_user_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- ── user_plans ────────────────────────────────────────────────────────────────
CREATE POLICY "user_plans_owner"
  ON user_plans
  FOR ALL
  USING  (clerk_user_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- ── pro_waitlist ──────────────────────────────────────────────────────────────
CREATE POLICY "pro_waitlist_owner"
  ON pro_waitlist
  FOR ALL
  USING  (clerk_user_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- ── feedback ──────────────────────────────────────────────────────────────────
-- Feedback rows may be anonymous (clerk_user_id is nullable).
-- Allow insert from anyone; restrict reads to the owner or anonymous rows.
CREATE POLICY "feedback_owner"
  ON feedback
  FOR ALL
  USING  (clerk_user_id IS NULL OR clerk_user_id = auth.jwt() ->> 'sub')
  WITH CHECK (clerk_user_id IS NULL OR clerk_user_id = auth.jwt() ->> 'sub');

-- ── Verify RLS is active ──────────────────────────────────────────────────────
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('forecasts', 'user_plans', 'pro_waitlist', 'feedback');
-- Expected: rowsecurity = true for all 4 tables
