"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const freeFeatures = [
  "5 products per forecast",
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

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-[#060C0D] relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22C55E]/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[860px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            Pricing
          </span>
          <h2 className="text-[40px] sm:text-[52px] font-semibold text-white tracking-[-0.03em] leading-tight mt-4 mb-3">
            Get started for free
          </h2>
          <p className="text-[15px] text-slate-500 max-w-sm mx-auto leading-relaxed">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.28 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0A1415] p-7 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-[13px] font-semibold text-slate-300 mb-1">Starter</p>
              <p className="text-[13px] text-slate-600 mb-5">Try it free. No credit card needed.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[42px] font-bold text-white tracking-tight leading-none">$0</span>
              </div>
              <p className="text-[12px] text-slate-600">Free plan</p>
            </div>

            <Link
              href="/forecast"
              className="block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-xl mb-7 transition-all bg-white/[0.06] hover:bg-white/[0.10] text-slate-300 border border-white/[0.08]"
            >
              Start free →
            </Link>

            <div className="border-t border-white/[0.05] pt-6">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">What&apos;s included</p>
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-slate-400">{f}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2.5 opacity-30">
                  <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-slate-600">Unlimited products</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-30">
                  <div className="w-4 h-4 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-slate-600">90-day forecasts</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.28, delay: 0.06 }}
            className="relative rounded-2xl bg-[#0A1415] p-7 flex flex-col overflow-hidden"
            style={{ boxShadow: "0 0 0 1.5px #22C55E40, 0 24px 60px -12px rgba(34,197,94,0.12)" }}
          >
            {/* Popular badge */}
            <div className="absolute top-5 right-5">
              <span className="bg-[#22C55E] text-[#060C0D] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase">
                Most popular
              </span>
            </div>

            {/* Subtle green glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#22C55E]/60 to-transparent" />

            <div className="mb-6">
              <p className="text-[13px] font-semibold text-white mb-1">Pro Plan</p>
              <p className="text-[13px] text-slate-500 mb-5">For stores that can&apos;t afford stockouts.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[42px] font-bold text-white tracking-tight leading-none">$9</span>
                <span className="text-[14px] text-slate-500 mb-1.5">/month</span>
              </div>
              <p className="text-[12px] text-slate-600">Billed in INR · approx ₹749/mo</p>
            </div>

            <Link
              href="/upgrade"
              className="block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-xl mb-7 transition-all bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] shadow-lg shadow-[#22C55E]/25"
            >
              Get Pro Plan →
            </Link>

            <div className="border-t border-[#22C55E]/[0.12] pt-6">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Everything in Starter, plus</p>
              <ul className="space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.25, delay: 0.14 }}
          className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-600"
        >
          {["No credit card for Free plan", "Cancel anytime", "Instant forecasts", "Shopify CSV compatible"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[#22C55E]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
