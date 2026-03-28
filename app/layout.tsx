import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
});
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
    "shopify stockout alert",
    "inventory management shopify",
    "demand forecasting tool",
    "stockout prevention",
    "reorder point calculator",
    "shopify analytics",
    "shopify stocky alternative",
    "inventory forecasting india",
    "D2C inventory tool",
    "AI inventory management",
    "shopify CSV forecast",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockSense AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": SITE_URL,
    "description": "AI-powered inventory forecasting for Shopify merchants. Get exact stockout dates, reorder quantities, and revenue-at-risk analysis in 30 seconds.",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "price": "0",
        "priceCurrency": "INR",
        "description": "5 products per month, 30-day forecast"
      },
      {
        "@type": "Offer",
        "name": "Pro",
        "price": "1999",
        "priceCurrency": "INR",
        "description": "Unlimited products, 90-day forecasts, purchase order generation"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#060C0D] text-slate-200 antialiased font-[family-name:var(--font-inter)]">
        {clerkReady ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
