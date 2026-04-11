// Server Component — no "use client".
// force-dynamic prevents Vercel from prerendering this page at build time,
// which is what causes the Clerk hook errors. The actual Clerk-using code
// lives in ForecastShell (Client Component) with ssr:false so it is never
// executed on the server at all.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ForecastShell from "./ForecastShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export const metadata: Metadata = {
  title: "Free Shopify Inventory Forecast — Forestock",
  description:
    "Upload your Shopify CSV and get AI-powered demand forecasts in 30 seconds. See exact stockout dates, reorder quantities, and revenue at risk for every SKU. Free to use.",
  alternates: { canonical: `${SITE_URL}/forecast` },
  openGraph: {
    title: "Free Shopify Inventory Forecast — Forestock",
    description:
      "Get AI-powered demand forecasts for your Shopify store in 30 seconds. Free to try — no credit card required.",
    url: `${SITE_URL}/forecast`,
  },
};

export default function ForecastPage() {
  return <ForecastShell />;
}
