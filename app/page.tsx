import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/StocksenseLogo";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="relative py-28 bg-[#060C0D] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#22C55E]/[0.06] blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[720px] mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-5">Get started free</p>
          <h2 className="text-4xl sm:text-[56px] font-bold text-white tracking-[-0.035em] leading-[1.0] mb-6 mt-4">
            Stop losing revenue<br className="hidden sm:block" />{" "}
            to <span className="text-[#22C55E]">stockouts.</span>
          </h2>
          <p className="text-[17px] text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed tracking-tight">
            Upload your Shopify CSV and get AI-powered forecasts, reorder quantities, and revenue at risk in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button asChild size="lg"
              className="text-[16px] px-8 h-13 font-semibold gap-2 shadow-xl shadow-[#22C55E]/20 hover:shadow-[#22C55E]/30 transition-shadow">
              <Link href="/forecast">
                Analyze free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg"
              className="text-[16px] px-8 h-13 border-white/15 hover:border-[#22C55E]/40 text-slate-300 hover:text-white">
              <Link href="/forecast?demo=true">See live demo</Link>
            </Button>
          </div>
          <p className="text-[13px] text-slate-600">
            No credit card · Results in 30 seconds · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#07100F] pt-16 pb-10 border-t border-[#22C55E]/10">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">

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
                  { label: "Instagram", href: "https://instagram.com/stocksenseai" },
                  { label: "Twitter / X", href: "https://x.com/stocksenseai" },
                  { label: "Contact Us", href: "mailto:support@forestock.app" },
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
