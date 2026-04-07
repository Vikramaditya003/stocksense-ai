/**
 * Role and plan enforcement helpers.
 *
 * HOW ADMIN ROLES WORK
 * ────────────────────
 * Roles are stored in Clerk's `publicMetadata` as `{ role: "admin" }`.
 * They are surfaced into every session JWT via a Clerk JWT template so that
 * middleware can read them from `sessionClaims` without a DB round-trip.
 *
 * To promote a user to admin (one-time, in Clerk Dashboard):
 *   Dashboard → Users → [user] → Metadata → Public → add: { "role": "admin" }
 *
 * To surface it in the JWT (one-time, in Clerk Dashboard):
 *   Dashboard → JWT Templates → Default → add to Claims:
 *   { "metadata": "{{user.public_metadata}}" }
 *
 * After that, `sessionClaims.metadata?.role === "admin"` is available in both
 * middleware (edge, zero DB cost) and API routes (via `auth().sessionClaims`).
 *
 * HOW PLAN ENFORCEMENT WORKS
 * ──────────────────────────
 * Plan is stored in Supabase `user_plans` and checked in API routes via
 * `requirePlan()`. It is NOT checked at the middleware/edge layer because it
 * requires a DB read — keep the edge fast and enforce plans in route handlers.
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserPlan, type UserPlan } from "./db";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppRole = "admin" | "user";

// Plans ordered from lowest to highest privilege
const PLAN_ORDER: UserPlan[] = ["free", "growth", "pro", "business"];

// ─── Role helpers (read from JWT sessionClaims — no DB) ───────────────────────

/**
 * Extract the role stored in Clerk publicMetadata from the session JWT.
 * Returns "user" if the metadata claim is absent (safe default).
 *
 * Reads `sessionClaims.metadata.role` — this is only populated when you add
 * the `metadata` claim to the Clerk JWT template (see instructions above).
 */
export function getRoleFromClaims(
  sessionClaims: Record<string, unknown> | null | undefined
): AppRole {
  const role = (sessionClaims as { metadata?: { role?: string } } | null)
    ?.metadata?.role;
  return role === "admin" ? "admin" : "user";
}

/** Returns true if the given session claims indicate an admin user. */
export function isAdminFromClaims(
  sessionClaims: Record<string, unknown> | null | undefined
): boolean {
  return getRoleFromClaims(sessionClaims) === "admin";
}

// ─── Server-side route guard helpers ─────────────────────────────────────────

/**
 * Call at the top of an admin API route handler.
 * Returns a 403 Response if the caller is not an admin, null otherwise.
 *
 * Usage:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isAdminFromClaims(sessionClaims as Record<string, unknown>)) {
    // 403, not 404 — admin routes are documented internally so obscuring them
    // with 404 provides false security. 403 is the correct semantics.
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return null;
}

/**
 * Call at the top of a plan-gated API route handler.
 * Checks the user's plan from Supabase and returns 403 if below the required tier.
 *
 * Usage:
 *   const denied = await requirePlan("pro");
 *   if (denied) return denied;
 */
export async function requirePlan(
  minimum: UserPlan
): Promise<NextResponse | null> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userPlan = await getUserPlan(userId);
  const userIdx = PLAN_ORDER.indexOf(userPlan);
  const minIdx = PLAN_ORDER.indexOf(minimum);

  if (userIdx < minIdx) {
    return NextResponse.json(
      {
        error: `This feature requires the ${minimum} plan or above.`,
        requiredPlan: minimum,
        currentPlan: userPlan,
      },
      { status: 403 }
    );
  }

  return null;
}
