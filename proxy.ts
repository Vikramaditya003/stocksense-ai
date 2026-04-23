import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isAdminFromClaims } from "@/lib/roles";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
// Real Clerk keys are pk_test_<long-base64> or pk_live_<long-base64> — must be > 30 chars
const clerkReady =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  clerkKey.length > 30;

const isAuthPage = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Routes that require authentication only (any signed-in user)
// /api/forecast(.*) covers both /api/forecast (run) and /api/forecasts (history)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/history(.*)",
  "/api/forecast(.*)",
  "/api/alert(.*)",
  // /api/payment is NOT here — the route handler does its own auth() check,
  // and putting it here caused middleware to return 401 before the handler runs
  // when the Clerk session cookie was slightly stale.
]);

// Routes that require admin role in addition to authentication.
// Checked against sessionClaims so no DB round-trip is needed at the edge.
// NOTE: requireAdmin() in each route handler is a second enforcement layer —
// middleware here is the primary gate, the handler check is defense-in-depth.
const isAdminRoute = createRouteMatcher([
  "/api/admin(.*)",
  "/admin(.*)",
]);

export default clerkReady
  ? clerkMiddleware(async (auth, req) => {
      // ── Redirect signed-in users away from auth pages ──────────────────────
      const { userId } = await auth();
      if (userId && isAuthPage(req)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // ── Admin routes — must be authenticated AND have admin role ────────────
      if (isAdminRoute(req)) {
        // auth.protect() redirects guests to sign-in (pages) or returns 401 (API)
        const authObj = await auth.protect();

        if (!isAdminFromClaims(authObj.sessionClaims as Record<string, unknown>)) {
          // Authenticated but not admin — return 403.
          // For page routes this could redirect to a /403 page; for API routes
          // returning JSON is correct. We detect API routes by path prefix.
          if (req.nextUrl.pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
          }
          // For admin UI pages (future), redirect to home rather than exposing
          // that an admin panel exists.
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return; // admin confirmed — allow through
      }

      // ── Standard protected routes — authentication only ─────────────────────
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : (_req: NextRequest) => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
