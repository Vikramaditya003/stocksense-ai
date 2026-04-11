// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { supabaseAdmin } from "./supabase";
import type { ForecastAnalysis } from "./types";

export type UserPlan = "free" | "growth" | "pro" | "business";

export interface SavedForecast {
  id: string;
  clerk_user_id: string;
  created_at: string;
  sku_count: number;
  health_score: number;
  critical_count: number;
  summary: string;
  analysis: ForecastAnalysis;
}

// Supabase types are not generated yet — use untyped client with explicit casts.
// Run `npx supabase gen types typescript --project-id <id>` after setup to get full types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

// Save a forecast result for a logged-in user
export async function saveForecast(clerkUserId: string, analysis: ForecastAnalysis) {
  const { data, error } = await db
    .from("forecasts")
    .insert({
      clerk_user_id: clerkUserId,
      sku_count: analysis.totalSkuCount,
      health_score: analysis.healthScore,
      critical_count: analysis.criticalCount,
      summary: analysis.summary,
      analysis,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data as { id: string };
}

// Get forecast history for a user (most recent first)
export async function getUserForecasts(clerkUserId: string, limit = 10) {
  const { data, error } = await db
    .from("forecasts")
    .select("id, created_at, sku_count, health_score, critical_count, summary")
    .eq("clerk_user_id", clerkUserId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Omit<SavedForecast, "analysis" | "clerk_user_id">[];
}

// Get a single forecast by ID (checks ownership)
export async function getForecast(id: string, clerkUserId: string) {
  const { data, error } = await db
    .from("forecasts")
    .select("*")
    .eq("id", id)
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) throw error;
  return data as SavedForecast;
}

// Activate or update a user's subscription plan after successful payment
export async function updateUserPlan(clerkUserId: string, plan: UserPlan, paymentId: string): Promise<void> {
  const { error } = await db
    .from("user_plans")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        plan,
        payment_id: paymentId,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    );
  if (error) throw error;
}

// Get or create user plan record
export async function getUserPlan(clerkUserId: string): Promise<UserPlan> {
  const { data } = await db
    .from("user_plans")
    .select("plan")
    .eq("clerk_user_id", clerkUserId)
    .single();

  return ((data as { plan: string } | null)?.plan as UserPlan) ?? "free";
}

// ── Pro waitlist ──────────────────────────────────────────────────────────────
// SQL: CREATE TABLE pro_waitlist (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   clerk_user_id text UNIQUE NOT NULL,
//   email text NOT NULL,
//   created_at timestamptz DEFAULT now()
// );

export async function addToWaitlist(clerkUserId: string, email: string): Promise<void> {
  const { error } = await db
    .from("pro_waitlist")
    .upsert({ clerk_user_id: clerkUserId, email }, { onConflict: "clerk_user_id" });
  if (error) throw error;
}

export async function getAllWaitlist(): Promise<{ clerk_user_id: string; email: string; created_at: string }[]> {
  const { data, error } = await db
    .from("pro_waitlist")
    .select("clerk_user_id, email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as { clerk_user_id: string; email: string; created_at: string }[];
}

// ── Feedback ──────────────────────────────────────────────────────────────────
// SQL: CREATE TABLE feedback (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   clerk_user_id text,
//   nps_score int NOT NULL CHECK (nps_score BETWEEN 1 AND 10),
//   message text,
//   page text,
//   created_at timestamptz DEFAULT now()
// );

export async function saveFeedback(row: {
  clerk_user_id?: string;
  nps_score: number;
  message: string;
  page: string;
}): Promise<void> {
  const { error } = await db.from("feedback").insert(row);
  if (error) throw error;
}

// ── Admin-only DB functions ───────────────────────────────────────────────────
// These bypass per-user filters intentionally. ONLY call them after requireAdmin()
// has confirmed the caller holds the admin role.

export interface AdminUserPlanRow {
  clerk_user_id: string;
  plan: UserPlan;
  payment_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** List all user plan records — admin only. */
export async function getAllUserPlans(
  limit = 50,
  offset = 0
): Promise<AdminUserPlanRow[]> {
  const { data, error } = await db
    .from("user_plans")
    .select("clerk_user_id, plan, payment_id, active, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data ?? []) as AdminUserPlanRow[];
}

export interface AdminForecastRow {
  id: string;
  clerk_user_id: string;
  created_at: string;
  sku_count: number;
  health_score: number;
  critical_count: number;
  summary: string;
}

/** List all forecasts across all users — admin only. Full analysis blob excluded. */
export async function getAllForecasts(
  limit = 50,
  offset = 0
): Promise<AdminForecastRow[]> {
  const { data, error } = await db
    .from("forecasts")
    .select("id, clerk_user_id, created_at, sku_count, health_score, critical_count, summary")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data ?? []) as AdminForecastRow[];
}
