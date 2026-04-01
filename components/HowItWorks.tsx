"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Upload your sales data",
    description: "Export a CSV from Shopify and drop it in — or paste raw data. No install, no API keys. Under 2 minutes.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI analyzes demand patterns",
    description: "Sales velocity, seasonal trends, growth signals, stockout risk per SKU — identified in seconds.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get precise decisions",
    description: "Not dashboards — decisions. Exact stockout dates, order quantities, revenue at risk, and a one-click PO.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative section-alt">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="section-label mb-5">Process</p>
          <h2 className="text-4xl sm:text-[52px] font-semibold text-white tracking-[-0.03em] leading-tight mb-4 mt-4">
            Forecasts in{" "}
            <span className="text-[#2DD4BF]">under 60 seconds</span>
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed tracking-tight">
            No Shopify app install. No API keys. Just your CSV.
          </p>
        </motion.div>

        {/* Steps with connector */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-[#2DD4BF]/30 via-[#2DD4BF]/15 to-[#2DD4BF]/30 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="relative z-10 rounded-2xl border border-[#2DD4BF]/10 bg-[#0A1415] p-6 hover:border-[#2DD4BF]/25 hover:shadow-lg hover:shadow-[#2DD4BF]/[0.05] transition-all duration-250 group"
            >
              {/* Step icon + number */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center text-[#2DD4BF] group-hover:bg-[#2DD4BF]/15 group-hover:border-[#2DD4BF]/30 transition-colors">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-white/[0.04] leading-none tabular-nums select-none">{step.step}</span>
              </div>
              <h3 className="text-[17px] font-semibold text-white mb-2.5 tracking-tight">{step.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed tracking-tight">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="mt-4 rounded-2xl border border-[#2DD4BF]/15 bg-[#0A1415] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-[17px] font-semibold text-white tracking-tight mb-0.5">
              Shopify Stocky shuts down August 2026.
            </p>
            <p className="text-[14px] text-slate-500 tracking-tight">
              Switch before your next peak season. Start free, no credit card.
            </p>
          </div>
          <Button asChild className="flex-shrink-0 gap-2 font-semibold shadow-lg shadow-[#2DD4BF]/15">
            <Link href="/forecast">
              Start free
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
