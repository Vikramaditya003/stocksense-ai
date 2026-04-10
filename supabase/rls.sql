-- ─────────────────────────────────────────────────────────────────────────────
-- Forestock — Supabase Row-Level Security (RLS) policies
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- The service_role key (used by the Next.js server) bypasses RLS by design —
-- that is correct and safe because it never reaches the browser.
-- The anon key (public) is blocked from all direct table access.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Create tables (skip if already exist) ─────────────────────────────────

create table if not exists forecasts (
  id               uuid primary key default gen_random_uuid(),
  clerk_user_id    text not null,
  created_at       timestamptz not null default now(),
  sku_count        int not null default 0,
  health_score     int not null default 0,
  critical_count   int not null default 0,
  summary          text not null default '',
  analysis         jsonb not null default '{}'::jsonb
);

create table if not exists user_plans (
  clerk_user_id    text primary key,
  plan             text not null default 'free',
  payment_id       text,
  active           boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── 2. Indexes ────────────────────────────────────────────────────────────────

create index if not exists forecasts_clerk_user_id_idx
  on forecasts (clerk_user_id, created_at desc);

create index if not exists user_plans_plan_idx
  on user_plans (plan);

-- ── 3. Enable RLS on both tables ─────────────────────────────────────────────

alter table forecasts   enable row level security;
alter table user_plans  enable row level security;

-- ── 4. Drop any existing policies before recreating ──────────────────────────

drop policy if exists "No direct anon access — forecasts"  on forecasts;
drop policy if exists "No direct anon access — user_plans" on user_plans;

-- ── 5. Deny all direct access from the anon / authenticated Supabase roles ───
--
-- All real access goes through the service_role key in the Next.js API layer
-- (lib/supabase.ts → getSupabaseAdmin). The anon key has no business touching
-- these tables at all — block it explicitly so even if the key leaks, an
-- attacker cannot read or write data directly via the REST API.

create policy "No direct anon access — forecasts"
  on forecasts
  as restrictive
  for all
  to anon, authenticated
  using (false);

create policy "No direct anon access — user_plans"
  on user_plans
  as restrictive
  for all
  to anon, authenticated
  using (false);

-- ── 6. Restrict analysis column — never expose via storage/CDN ───────────────
--
-- The `analysis` JSONB column can contain merchant revenue data and product names.
-- Adding a column-level privilege ensures it cannot be SELECTed even if a future
-- policy accidentally grants broader access.

revoke select on column forecasts.analysis from anon, authenticated;

-- ── 7. Verify setup ───────────────────────────────────────────────────────────
--
-- After running this script, you can verify RLS is active with:
--
--   select tablename, rowsecurity from pg_tables
--   where tablename in ('forecasts', 'user_plans');
--
-- Both rows should show rowsecurity = true.
