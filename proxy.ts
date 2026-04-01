import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
// Real Clerk keys are pk_test_<long-base64> or pk_live_<long-base64> — must be > 30 chars
const clerkReady =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  clerkKey.length > 30;

// Routes that require authentication — edge-level protection via Clerk
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/history(.*)",
  "/api/forecasts(.*)",
  "/api/payment(.*)",
  "/api/alert(.*)",
]);

export default clerkReady
  ? clerkMiddleware(async (auth, req) => {
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
