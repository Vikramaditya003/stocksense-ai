import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkReady =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  clerkKey.length > 30;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stocksense.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StockSense AI — Inventory Forecasting for Shopify",
    template: "%s | StockSense AI",
  },
  description:
    "AI-powered demand forecasting and reorder intelligence for Shopify merchants. Know exactly when to reorder, how much to buy, and which products are at risk — before they stock out.",
  keywords: [
    "shopify inventory forecasting",
    "demand forecasting",
    "inventory management",
    "stockout prevention",
    "reorder point calculator",
    "shopify analytics",
  ],
  authors: [{ name: "StockSense AI" }],
  creator: "StockSense AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "StockSense AI",
    title: "StockSense AI — Inventory Forecasting for Shopify",
    description:
      "AI-powered demand forecasting and reorder intelligence for Shopify merchants. Know exactly when to reorder before you stock out.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StockSense AI — Inventory Forecasting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StockSense AI — Inventory Forecasting for Shopify",
    description:
      "AI-powered demand forecasting for Shopify merchants. Never stock out again.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-[#060C0D] text-slate-200 antialiased font-[family-name:var(--font-geist-sans)]">
        {clerkReady ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
