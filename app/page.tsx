import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import ExitIntentModal from "@/components/ExitIntentModal";
import { LogoMark } from "@/components/StocksenseLogo";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export const metadata: Metadata = {
  title: "Forestock — Shopify Inventory Forecasting & Stocky Alternative",
  description:
    "The best Shopify Stocky alternative. AI-powered demand forecasting that shows exact stockout dates, reorder quantities, and revenue at risk — in 30 seconds. Free to try.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Forestock — Shopify Inventory Forecasting & Stocky Alternative",
    description:
      "AI-powered demand forecasting for Shopify. Get exact stockout dates and reorder quantities in 30 seconds. Better than Shopify Stocky.",
    url: SITE_URL,
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* 1 — dark */}
      <Hero />

      {/* 2 — light */}
      <HowItWorks />

      {/* 3 — dark */}
      <Features />

      {/* 4 — light */}
      <Comparison />

      {/* 6 — dark */}
      <Pricing />

      {/* 7 — light */}
      <FAQ />

      {/* ── Final CTA ── */}
      <section className="py-24 bg-[#f0f5f1] border-t border-[#bbcbba]/40">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="rounded-[10px] border border-[#bbcbba]/60 bg-white px-8 py-10 sm:px-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 card-depth">
            <div>
              <h2 className="text-[40px] sm:text-[52px] font-bold leading-[0.93] tracking-[-0.03em] text-[#181d1b] mb-3">
                Stop losing revenue<br />
                to stockouts.
              </h2>
              <p className="text-[13px] text-[#8a9a8a]">
                No credit card · Results in 30 seconds · Cancel anytime
              </p>
            </div>
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              <Link
                href="/forecast"
                className="btn-primary btn-gradient inline-flex items-center gap-2 text-[15px] font-semibold text-white px-7 py-3 rounded-[6px] whitespace-nowrap"
              >
                Run free forecast
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#f6faf6] pt-16 pb-10 border-t border-[#bbcbba]/40">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

          {/* Top: logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <LogoMark size={36} />
                <span className="text-[16px] font-bold tracking-tight">
                  <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
                </span>
              </div>
              <p className="text-[12px] text-[#5a6059] leading-relaxed mb-4">
                AI-powered inventory forecasting for Shopify merchants.
              </p>
              <p className="text-[11px] text-[#8a9a8a]">
                &copy; {new Date().getFullYear()} Forestock.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Home",         href: "/"             },
                  { label: "Features",     href: "#features"     },
                  { label: "Pricing",      href: "#pricing"      },
                  { label: "How it works", href: "#how-it-works" },
                  { label: "Forecast",     href: "/forecast"     },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-[#5a6059] hover:text-[#181d1b] transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[11px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-4">Resources</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Blog",       href: "/blog"                              },
                  { label: "Contact Us", href: "mailto:support@getforestock.com"    },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-[#5a6059] hover:text-[#181d1b] transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy Policy",   href: "/privacy"  },
                  { label: "Terms of Service", href: "/terms"    },
                  { label: "Cookie Policy",    href: "/cookies"  },
                  { label: "Refund Policy",    href: "/refunds"  },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-[#5a6059] hover:text-[#181d1b] transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-[#bbcbba]/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#8a9a8a]">
              Forecasts are AI-generated estimates, not financial guarantees.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34]" />
              <span className="text-[11px] text-[#8a9a8a]">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Global overlays ── */}
      <MobileStickyCTA />
      <ExitIntentModal />
    </main>
  );
}
