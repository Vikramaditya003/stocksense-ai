"use client";

import Link from "next/link";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

const freeFeatures = [
  "5 forecast runs",
  "30-day demand forecast",
  "Stockout countdown",
  "Inventory health score",
  "CSV upload",
];

const proFeatures = [
  "Unlimited products",
  "60 & 90-day forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase orders",
  "Priority email support",
];

function Check() {
  return (
    <div className="w-4 h-4 rounded-[4px] bg-[#006d34]/10 border border-[#006d34]/25 flex items-center justify-center flex-shrink-0">
      <svg className="w-2.5 h-2.5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function Cross() {
  return (
    <div className="w-4 h-4 rounded-[4px] bg-[#eaefeb] border border-[#bbcbba]/60 flex items-center justify-center flex-shrink-0">
      <svg className="w-2.5 h-2.5 text-[#8a9a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}


export default function Pricing() {
  const [currency] = useState<"USD" | "INR">(() => {
    if (typeof window === "undefined") return "USD";
    const lang = navigator.language || "";
    return lang === "en-IN" || lang.startsWith("hi") ? "INR" : "USD";
  });

  const proPrice    = currency === "INR" ? "₹749"  : "$9";
  const proBilling  = currency === "INR" ? "billed monthly" : "per month";

  return (
    <section id="pricing" className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <FadeIn className="mb-14">
          <span className="inline-flex items-center text-[10px] font-bold text-[#006d34] uppercase tracking-[0.18em] bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-1 rounded-full mb-6">Pricing</span>
          <h2 className="text-[40px] sm:text-[52px] font-bold text-[#181d1b] tracking-[-0.03em] leading-tight mb-3">
            Get started for free
          </h2>
          <p className="text-[15px] text-[#5a6059] max-w-sm leading-relaxed">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </FadeIn>

        {/* Cards — side by side, identical structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          {/* Starter */}
          <FadeIn delay={1}>
          <div className="rounded-[10px] border border-[#bbcbba]/60 bg-white p-7 flex flex-col card-depth h-full">
            <div className="mb-6">
              <p className="text-[13px] font-semibold text-[#181d1b] mb-1">Starter</p>
              <p className="text-[13px] text-[#5a6059] mb-5">Try it free. No credit card needed.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[64px] font-black text-[#181d1b] tracking-[-0.04em] leading-none">$0</span>
              </div>
              <p className="text-[12px] text-[#8a9a8a]">Free forever</p>
            </div>

            <Link
              href="/forecast"
              className="btn-primary btn-gradient block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-[6px] mb-7 text-white"
            >
              Run free forecast
            </Link>

            <div className="border-t border-[#bbcbba]/40 pt-6">
              <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-4">What&apos;s included</p>
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check />
                    <span className="text-[13px] text-[#5a6059]">{f}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2.5 opacity-40">
                  <Cross />
                  <span className="text-[13px] text-[#8a9a8a]">Unlimited products</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-40">
                  <Cross />
                  <span className="text-[13px] text-[#8a9a8a]">90-day forecasts</span>
                </li>
              </ul>
            </div>
          </div>
          </FadeIn>

          {/* Pro */}
          <FadeIn delay={2}>
          <div className="rounded-[10px] border border-[#006d34]/40 bg-white flex flex-col relative overflow-hidden card-pro-glow h-full">
            {/* Dark header strip */}
            <div className="bg-[#0d1a10] px-7 pt-6 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold text-white">Pro</p>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 rounded-[4px]">
                  Most popular
                </span>
              </div>
              <p className="text-[13px] text-white/50 mb-4">For stores that can&apos;t afford stockouts.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[64px] font-black text-white tracking-[-0.04em] leading-none">{proPrice}</span>
                <span className="text-[14px] text-white/50 mb-2">/{proBilling.replace("per ", "")}</span>
              </div>
              <p className="text-[12px] text-white/35">Cancel anytime — no lock-in</p>
            </div>
            <div className="p-7 flex flex-col flex-1">

            <div className="mb-7">
              <Link
                href="/upgrade"
                className="btn-primary btn-gradient block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-[6px] text-white"
              >
                Get Pro →
              </Link>
            </div>

            <div className="border-t border-[#bbcbba]/40 pt-6">
              <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-4">Everything in Starter, plus</p>
              <ul className="space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check />
                    <span className="text-[13px] text-[#5a6059]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            </div>{/* end inner p-7 flex */}
          </div>{/* end Pro card */}
          </FadeIn>

        </div>

        {/* Trust strip */}
        <FadeIn>
        <div className="flex flex-wrap items-center gap-6 text-[12px] text-[#5a6059]">
          {["No credit card for Free plan", "Cancel anytime", "Instant forecasts", "Shopify CSV compatible"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[#8a9a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t}
            </span>
          ))}
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
