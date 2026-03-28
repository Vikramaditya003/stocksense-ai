-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- Forecast history table
create table if not exists public.forecasts (
  id            uuid primary key default gen_random_uuid(),
  clerk_user_id text        not null,
  created_at    timestamptz not null default now(),
  sku_count     integer     not null default 0,
  health_score  integer     not null default 0,
  critical_count integer    not null default 0,
  summary       text        not null default '',
  analysis      jsonb       not null
);

create index if not exists forecasts_clerk_user_id_idx on public.forecasts (clerk_user_id);
create index if not exists forecasts_created_at_idx   on public.forecasts (created_at desc);

-- User plans table (free / pro / business)
create table if not exists public.user_plans (
  clerk_user_id text        primary key,
  plan          text        not null default 'free' check (plan in ('free', 'pro', 'business')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Row Level Security: users can only read their own data
alter table public.forecasts   enable row level security;
alter table public.user_plans  enable row level security;

-- We use the service role key on the server so RLS is bypassed there.
-- These policies protect direct client-side queries.
create policy "Users read own forecasts"
  on public.forecasts for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "Users read own plan"
  on public.user_plans for select
  using (clerk_user_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');
