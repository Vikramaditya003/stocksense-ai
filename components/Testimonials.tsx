"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "We were manually tracking reorders in a spreadsheet. StockSense flagged that our best-selling SKU would stock out in 6 days — we had no idea. Saved us from losing at least ₹40,000 that month.",
    name: "Priya M.",
    role: "Founder, wellness brand · Pune",
    initials: "PM",
    color: "#2DD4BF",
  },
  {
    quote: "I used to spend 3 hours every Sunday going through stock levels. Now I upload a CSV and get a full reorder plan in under a minute. The revenue-at-risk numbers alone are worth the subscription.",
    name: "Rahul S.",
    role: "Operations, fashion D2C · Mumbai",
    initials: "RS",
    color: "#0D9488",
  },
  {
    quote: "Switched from Stocky after they announced shutdown. StockSense is honestly better — the 90-day forecast helped us plan for a sale campaign without overstocking. Game changer.",
    name: "Ananya K.",
    role: "E-commerce manager · Bengaluru",
    initials: "AK",
    color: "#2DD4BF",
  },
];

const stats = [
  { value: "₹2.4Cr+", label: "revenue protected from stockouts" },
  { value: "1,200+", label: "forecasts run this month" },
  { value: "4.9 / 5", label: "average merchant rating" },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#060C0D] relative overflow-hidden">
      {/* Subtle glow */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2DD4BF]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">Results</p>
          <h2 className="text-4xl sm:text-[52px] font-light text-white tracking-[-0.03em] leading-tight mb-4">
            Merchants stopped{" "}
            <span className="text-slate-500">guessing</span>
          </h2>
          <p className="text-[15px] text-slate-500 max-w-sm mx-auto leading-relaxed tracking-tight">
            Real feedback from Shopify store owners who switched from spreadsheets and Stocky.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.26, delay: 0.08 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#2DD4BF]/10 bg-[#0A1415] p-5 text-center">
              <p className="text-[26px] sm:text-[32px] font-semibold text-white tracking-tight tabular-nums mb-1">{s.value}</p>
              <p className="text-[12px] text-slate-500 tracking-tight leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.26, delay: i * 0.05 }}
              className="rounded-2xl border border-[#2DD4BF]/10 bg-[#0A1415] p-6 flex flex-col gap-5 hover:border-[#2DD4BF]/20 transition-colors duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-[#2DD4BF]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-slate-400 leading-relaxed tracking-tight flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-[#060C0D] flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-200 tracking-tight">{t.name}</p>
                  <p className="text-[11px] text-slate-600 tracking-tight">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
