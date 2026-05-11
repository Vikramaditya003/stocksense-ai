import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export const metadata: Metadata = {
  title: "Upgrade to Forestock Pro — Unlimited Forecasts",
  description:
    "Upgrade to Forestock Pro for unlimited inventory forecasts, 90-day demand forecasting, full SKU analysis, and ad spend impact. $10/month, cancel anytime.",
  alternates: { canonical: `${SITE_URL}/upgrade` },
  openGraph: {
    title: "Upgrade to Forestock Pro — Unlimited Forecasts",
    description: "Unlimited inventory forecasts, 90-day demand forecasting, and full SKU analysis. $10/month, cancel anytime.",
    url: `${SITE_URL}/upgrade`,
    siteName: "Forestock",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade to Forestock Pro",
    description: "Unlimited forecasts, 90-day demand forecasting, full SKU analysis. $10/month, cancel anytime.",
  },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
