"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Try it risk-free. No credit card.",
    features: ["5 products/month", "30-day forecast", "Stockout alerts", "Health score", "CSV upload"],
    out: ["Unlimited products", "Up to 90-day forecasts", "Ad-spend correlation", "Reorder automation"],
    cta: "Start free",
    href: "/forecast",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    description: "For stores that can't afford stockouts.",
    features: [
      "Unlimited products",
      "Up to 90-day forecasts",
      "AI ad-spend correlation",
      "Smart reorder quantities",
      "Seasonal pattern detection",
      "Supplier lead time alerts",
      "1-click PO generation",
      "Priority email support",
    ],
    out: [],
    cta: "Get Pro",
    href: "/forecast",
    highlight: true,
    badge: "Most popular",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-[#060C0D] relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2DD4BF]/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[680px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p className="section-label mb-5">Pricing</p>
          <h2 className="text-4xl sm:text-[52px] font-semibold text-white tracking-[-0.03em] leading-tight mb-4 mt-4">
            Simple,{" "}
            <span className="text-slate-500">honest pricing</span>
          </h2>
          <p className="text-[16px] text-slate-500 max-w-sm mx-auto leading-relaxed tracking-tight">
            Prediko starts at ₹4,000/mo. We&apos;re ₹999 — with features they don&apos;t have.
          </p>
        </motion.div>

        {/* Cards — 2 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.28, delay: i * 0.06 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-[#2DD4BF] text-[#060C0D] text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-lg shadow-[#2DD4BF]/30 tracking-widest uppercase">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`rounded-2xl p-6 h-full transition-all duration-200 ${
                plan.highlight
                  ? "gradient-border-teal bg-[#0A1415] shadow-2xl shadow-[#2DD4BF]/[0.1]"
                  : "border border-[#2DD4BF]/10 bg-[#0A1415] hover:border-[#2DD4BF]/20"
              }`}>
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">{plan.name}</p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[42px] font-bold text-white tracking-tight leading-none">{plan.price}</span>
                    <span className="text-[14px] text-slate-500 tracking-tight">{plan.period}</span>
                  </div>
                  <p className="text-[14px] text-slate-500 tracking-tight">{plan.description}</p>
                </div>

                <Link
                  href={plan.href}
                  className={`block w-full text-center text-[14px] font-bold py-3 px-4 rounded-xl mb-6 transition-all duration-150 tracking-tight ${
                    plan.highlight
                      ? "bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] shadow-lg shadow-[#2DD4BF]/25"
                      : "bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 border border-white/[0.08]"
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <svg className="w-3.5 h-3.5 text-[#2DD4BF] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[14px] text-slate-300 tracking-tight">{f}</span>
                    </div>
                  ))}
                  {plan.out.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 opacity-30">
                      <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-[13px] text-slate-600 tracking-tight">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.25, delay: 0.14 }}
          className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-500"
        >
          {["No credit card for Free plan", "Cancel anytime", "Instant forecasts", "Shopify CSV compatible"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-[#2DD4BF]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
