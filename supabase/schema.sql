-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor
--
-- IMPORTANT — Clerk JWT integration:
-- For RLS policies to work with Clerk-issued JWTs on direct client queries,
-- Supabase must be configured to verify Clerk tokens:
--   1. Supabase dashboard → Settings → API → JWT Settings
--   2. Set "JWT Secret" to your Clerk secret key (Settings → API Keys in Clerk dashboard)
--      OR add Clerk's JWKS URL under "Third-party Auth providers"
-- Without this, all access via the anon key is denied (the deny-all policy below
-- ensures no data leaks even if the JWT config is incomplete).

-- ── Forecast history table ────────────────────────────────────────────────────
create table if not exists public.forecasts (
  id             uuid        primary key default gen_random_uuid(),
  clerk_user_id  text        not null,
  created_at     timestamptz not null default now(),
  sku_count      integer     not null default 0,
  health_score   integer     not null default 0,
  critical_count integer     not null default 0,
  summary        text        not null default '',
  analysis       jsonb       not null
);

create index if not exists forecasts_clerk_user_id_idx on public.forecasts (clerk_user_id);
create index if not exists forecasts_created_at_idx    on public.forecasts (created_at desc);

-- ── User plans table ──────────────────────────────────────────────────────────
create table if not exists public.user_plans (
  clerk_user_id text        primary key,
  plan          text        not null default 'free'
                            check (plan in ('free', 'growth', 'pro', 'business')),
  payment_id    text,                          -- last successful payment ID (Razorpay/Stripe)
  active        boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Migrations (idempotent — safe to re-run) ──────────────────────────────────
-- Add columns if upgrading from the original schema
alter table public.user_plans
  add column if not exists payment_id text,
  add column if not exists active     boolean not null default true;

-- Widen the plan constraint to include 'growth'
-- (drop and recreate since ALTER CONSTRAINT is not supported for check constraints)
alter table public.user_plans drop constraint if exists user_plans_plan_check;
alter table public.user_plans
  add constraint user_plans_plan_check
  check (plan in ('free', 'growth', 'pro', 'business'));

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.forecasts  enable row level security;
alter table public.user_plans enable row level security;

-- Drop any previously created policies so this script is idempotent
drop policy if exists "Users read own forecasts"   on public.forecasts;
drop policy if exists "Users read own plan"        on public.user_plans;
drop policy if exists "Deny anon forecasts"        on public.forecasts;
drop policy if exists "Deny anon user_plans"       on public.user_plans;
drop policy if exists "Admins read all forecasts"  on public.forecasts;
drop policy if exists "Admins read all user_plans" on public.user_plans;

-- Defense-in-depth: deny ALL direct anon-key access.
-- All legitimate server-side access uses the service role key (bypasses RLS).
-- This ensures a leaked anon key cannot be used to read any user data.
create policy "Deny anon forecasts"
  on public.forecasts for all to anon
  using (false);

create policy "Deny anon user_plans"
  on public.user_plans for all to anon
  using (false);

-- Authenticated (Clerk JWT) read policies — active once Supabase JWT is configured
-- to verify Clerk tokens (see instructions at top of file).
-- Clerk sets the user ID as the JWT `sub` claim.
create policy "Users read own forecasts"
  on public.forecasts for select
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

create policy "Users read own plan"
  on public.user_plans for select
  to authenticated
  using (clerk_user_id = (auth.jwt() ->> 'sub'));

-- ── Admin RLS policies ────────────────────────────────────────────────────────
-- Admin role is stored in Clerk publicMetadata and surfaced into the JWT via a
-- Clerk JWT template claim: { "metadata": "{{user.public_metadata}}" }
-- The expression below reads metadata.role from the JWT claim.
-- These policies only apply to direct Supabase client queries (anon key).
-- Server-side code using the service role key bypasses RLS entirely and is
-- guarded by requireAdmin() in the route handler instead.

create policy "Admins read all forecasts"
  on public.forecasts for select
  to authenticated
  using (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin'
  );

create policy "Admins read all user_plans"
  on public.user_plans for select
  to authenticated
  using (
    (auth.jwt() -> 'metadata' ->> 'role') = 'admin'
  );
