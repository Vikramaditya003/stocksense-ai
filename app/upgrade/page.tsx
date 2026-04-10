import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Plan — Coming Soon · Forestock",
};

const FEATURES = [
  "Unlimited products — no 5-SKU cap",
  "60 & 90-day demand forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase order generation",
  "Priority email support",
];

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#060C0D] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#22C55E]/[0.05] blur-[140px] rounded-full pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.05] max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-white">Fore</span><span className="text-[#22C55E]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[760px]">

          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#22C55E]/[0.08] border border-[#22C55E]/25 text-[#22C55E] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Pro plan · Launching very soon
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-[36px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight mb-4">
              We&apos;re putting the finishing<br className="hidden sm:block" /> touches on Pro
            </h1>
            <p className="text-[16px] text-slate-400 max-w-[460px] mx-auto leading-relaxed">
              Pro is almost ready. Drop us your email and we&apos;ll let you know the moment it goes live — with an early-bird discount.
            </p>
          </div>

          {/* Notify CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a
              href="mailto:support@getforestock.com?subject=Notify me when Pro launches&body=Hi, please notify me when the Forestock Pro plan goes live. My email is: "
              className="inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#22C55E]/25"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Notify me at launch
            </a>
            <Link
              href="/forecast"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-[#22C55E]/30 text-slate-400 hover:text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all"
            >
              Use free plan for now
            </Link>
          </div>

          {/* What's coming */}
          <div className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Forestock Pro</p>
                <p className="text-[18px] font-semibold text-white tracking-tight">What you&apos;ll get</p>
              </div>
              <div className="text-right">
                <p className="text-[28px] font-bold text-white tracking-tight leading-none">$9<span className="text-[14px] font-normal text-slate-500">/mo</span></p>
                <p className="text-[11px] text-slate-600 mt-0.5">approx ₹749/mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-slate-400">{f}</span>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-6 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[12px] text-slate-600">
                Questions?{" "}
                <a href="mailto:support@getforestock.com" className="text-slate-400 hover:text-white transition-colors underline">
                  support@getforestock.com
                </a>
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#22C55E]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Cancel anytime
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#22C55E]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Early-bird discount at launch
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
