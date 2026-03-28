// Server Component — no "use client".
// force-dynamic prevents Vercel from prerendering this page at build time,
// which is what causes the Clerk hook errors. The actual Clerk-using code
// lives in ForecastShell (Client Component) with ssr:false so it is never
// executed on the server at all.
export const dynamic = "force-dynamic";

import ForecastShell from "./ForecastShell";

export default function ForecastPage() {
  return <ForecastShell />;
}
