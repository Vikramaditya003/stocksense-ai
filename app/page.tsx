import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import { LogoMark } from "@/components/StocksenseLogo";

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
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />

      {/* ── CTA Section — full-width editorial bar ── */}
      <section className="relative py-24 bg-[#060C0D] overflow-hidden grain">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0A1415] px-8 py-10 sm:px-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-[40px] sm:text-[52px] leading-[0.95] text-white mb-3">
                Stop losing revenue<br />
                <em className="font-serif-italic text-[#22C55E]">to stockouts.</em>
              </h2>
              <p className="text-[13px] text-slate-600">
                No credit card · Results in 30 seconds · Cancel anytime
              </p>
            </div>
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              <Link
                href="/forecast"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#22C55E]/15 whitespace-nowrap"
              >
                Analyze free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/forecast?demo=true"
                className="inline-flex items-center justify-center gap-2 text-[14px] text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap"
              >
                See live demo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#07100F] pt-16 pb-10 border-t border-white/[0.05]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

          {/* Top: logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <LogoMark size={36} />
                <span className="text-[16px] font-bold tracking-tight">
                  <span className="text-white">Fore</span><span className="text-[#22C55E]">stock</span>
                </span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
                AI-powered inventory forecasting for Shopify merchants.
              </p>
              <p className="text-[11px] text-slate-700">
                &copy; {new Date().getFullYear()} Forestock.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How it works", href: "#how-it-works" },
                  { label: "Forecast", href: "/forecast" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-slate-500 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Resources</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Blog", href: "/blog" },
                  { label: "Contact Us", href: "mailto:support@getforestock.com" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-slate-500 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Refund Policy", href: "/refunds" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13px] text-slate-500 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-700">
              Forecasts are AI-generated estimates, not financial guarantees.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] text-slate-600">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
