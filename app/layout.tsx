import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkReady =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  clerkKey.length > 30;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Forestock — Inventory Forecasting for Shopify",
    template: "%s | Forestock",
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
  authors: [{ name: "Forestock" }],
  creator: "Forestock",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Forestock",
    title: "Forestock — Inventory Forecasting for Shopify",
    description:
      "AI-powered demand forecasting and reorder intelligence for Shopify merchants. Know exactly when to reorder before you stock out.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Forestock — Inventory Forecasting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forestock — Inventory Forecasting for Shopify",
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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Forestock",
      "url": SITE_URL,
      "logo": `${SITE_URL}/icon.svg`,
      "description": "AI-powered inventory forecasting for Shopify merchants.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@getforestock.com",
        "contactType": "customer support",
      },
      "sameAs": [],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Forestock",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": SITE_URL,
      "description": "AI-powered inventory forecasting for Shopify merchants. Get exact stockout dates, reorder quantities, and revenue-at-risk analysis in 30 seconds.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "47",
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": "0",
          "priceCurrency": "USD",
          "description": "5 products per forecast, 30-day demand forecast",
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "9",
          "priceCurrency": "USD",
          "description": "Unlimited products, 90-day forecasts, AI ad-spend correlation, purchase order generation",
        },
      ],
    },
  ];

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Preconnect to third-party origins to shorten first-request latency */}
        <link rel="preconnect" href="https://clerk.getforestock.com" />
        <link rel="preconnect" href="https://api.groq.com" />
        <script
          type="application/ld+json"
          // JSON.stringify with replacer ensures no </script> injection via untrusted values.
          // All values here are static constants — safe.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/<\//g, "<\\/"),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#060C0D] text-slate-200 antialiased font-[family-name:var(--font-geist-sans)]">
        {clerkReady ? (
        <ClerkProvider
          appearance={{
            variables: {
              colorBackground: "#0A1415",
              colorInputBackground: "#0F1C1E",
              colorText: "#E2F4F4",
              colorTextSecondary: "#7DB8BC",
              colorPrimary: "#22C55E",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
            },
            elements: {
              // ── Shared cards ────────────────────────────────────────────────
              card: "!bg-[#0A1415] !border !border-[#22C55E]/15 !shadow-2xl !shadow-black/80",
              headerTitle: "!text-white !font-semibold",
              headerSubtitle: "!text-slate-400",

              // ── Social / OAuth buttons ───────────────────────────────────────
              socialButtonsBlockButton: "!border !border-white/10 !bg-white/[0.04] hover:!bg-white/[0.07] !text-white",
              socialButtonsBlockButtonText: "!text-slate-200 !font-medium",

              // ── Dividers ─────────────────────────────────────────────────────
              dividerLine: "!bg-white/10",
              dividerText: "!text-slate-500",

              // ── Form fields ──────────────────────────────────────────────────
              formFieldInput: "!bg-[#0F1C1E] !border-[#22C55E]/20 !text-white focus:!border-[#22C55E]/50 !text-[15px]",
              formFieldLabel: "!text-slate-300 !font-medium",
              formButtonPrimary: "!bg-[#22C55E] hover:!bg-[#16A34A] !text-[#060C0D] !font-semibold !shadow-lg !shadow-[#22C55E]/20",
              formButtonReset: "!text-slate-400 hover:!text-white !border !border-white/10 hover:!border-white/20",

              // ── Links ────────────────────────────────────────────────────────
              footerActionLink: "!text-[#22C55E] hover:!text-[#16A34A]",
              formResendCodeLink: "!text-[#22C55E]",

              // ── Identity preview ─────────────────────────────────────────────
              identityPreviewText: "!text-slate-300",
              identityPreviewEditButton: "!text-[#22C55E]",

              // ── OTP ──────────────────────────────────────────────────────────
              otpCodeFieldInput: "!bg-[#0F1C1E] !border-[#22C55E]/20 !text-white",

              // ── UserProfile modal root ───────────────────────────────────────
              rootBox: "!font-[family-name:var(--font-geist-sans)]",
              modalContent: "!bg-[#0A1415] !border !border-[#22C55E]/15 !shadow-2xl !shadow-black/80 !rounded-2xl",
              modalCloseButton: "!text-slate-500 hover:!text-white hover:!bg-white/[0.05] !rounded-lg",

              // ── UserProfile left nav ─────────────────────────────────────────
              navbar: "!bg-[#07100F] !border-r !border-[#22C55E]/[0.08]",
              navbarButton: "!text-slate-400 hover:!text-white hover:!bg-white/[0.04] !rounded-lg !font-medium",
              navbarButtonActive: "!text-[#22C55E] !bg-[#22C55E]/10 !rounded-lg",
              navbarButtonIcon: "!text-slate-500",

              // ── UserProfile page content ─────────────────────────────────────
              pageScrollBox: "!bg-[#0A1415]",
              page: "!bg-[#0A1415]",
              profilePage: "!bg-[#0A1415]",

              // ── Section titles & content ─────────────────────────────────────
              profileSectionTitle: "!border-b !border-[#22C55E]/[0.08]",
              profileSectionTitleText: "!text-white !font-semibold",
              profileSectionContent: "!text-slate-300",
              profileSectionPrimaryButton: "!text-[#22C55E] hover:!text-[#16A34A] !font-medium",

              // ── Badge (e.g. "Primary" email badge) ──────────────────────────
              badge: "!bg-[#22C55E]/10 !text-[#22C55E] !border !border-[#22C55E]/20 !font-semibold",

              // ── Menu items (⋯ action menus) ──────────────────────────────────
              menuList: "!bg-[#0D1B1D] !border !border-[#22C55E]/15 !rounded-xl !shadow-xl !shadow-black/60",
              menuItem: "!text-slate-300 hover:!bg-white/[0.05] hover:!text-white",
              menuItemDestructive: "!text-red-400 hover:!bg-red-500/[0.06]",

              // ── Action rows (connected accounts, etc.) ───────────────────────
              accordionTriggerButton: "!text-slate-300 hover:!text-white",
              userPreviewMainIdentifier: "!text-white !font-semibold",
              userPreviewSecondaryIdentifier: "!text-slate-500",
              avatarBox: "!ring-1 !ring-[#22C55E]/20",

              // ── Alert / danger zone ──────────────────────────────────────────
              alertText: "!text-red-400",
              alert: "!bg-red-500/[0.06] !border !border-red-500/20 !rounded-xl",
            },
          }}
        >
          {children}
        </ClerkProvider>
      ) : children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
