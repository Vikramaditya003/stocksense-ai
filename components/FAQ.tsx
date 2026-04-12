"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How is Forestock different from Shopify's built-in analytics?",
    a: "Shopify analytics shows historical sales data — it doesn't predict when you'll run out of stock. Forestock uses that data to calculate exact stockout dates per SKU, recommended reorder quantities that factor in your supplier lead time, and the revenue you'll lose if you don't act.",
  },
  {
    q: "Do I need to install anything on my Shopify store?",
    a: "No. Just export a CSV from your Shopify admin (Orders or Inventory report) and upload it to Forestock. There's no app install, no API keys, and no OAuth flow. Setup takes under 2 minutes.",
  },
  {
    q: "How accurate are the forecasts?",
    a: "Across all SKU types we see 87% forecast accuracy. Accuracy is highest for products with consistent sales velocity (steady-sellers, subscriptions) and lower for highly seasonal or trend-driven items. The dashboard shows a confidence indicator per product so you always know how much to trust each forecast.",
  },
  {
    q: "Can I use Forestock instead of Shopify Stocky?",
    a: "Yes — and Shopify Stocky is shutting down in August 2026, so now is the time to switch. Forestock goes further than Stocky: exact stockout countdowns, revenue-at-risk figures, ad-spend correlation, and one-click purchase order generation. All without needing a Shopify app install.",
  },
  {
    q: "What file formats do you support?",
    a: "We support CSV files exported from Shopify — specifically the Orders export and the Inventory export. We auto-detect the format so there's no column mapping required. Other e-commerce platforms (WooCommerce, etc.) are on the roadmap.",
  },
  {
    q: "What happens to my data?",
    a: "Your CSV data is processed in-session and used only to generate your forecast. We do not store, sell, or share your raw inventory or order data. Forecast results are saved to your account so you can access them later, but the source file is not retained.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#dfe4e0] last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open ? "true" : "false"}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-[#006d34] focus-visible:outline-offset-2 rounded-[4px]"
      >
        <span className="text-[15px] font-semibold text-[#181d1b] leading-snug">{q}</span>
        <span
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#6c7b6c] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div className={`faq-answer ${open ? "open" : ""}`}>
        <div>
          <p className="text-[14px] text-[#5a6059] leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-28 bg-[#f6faf6]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">

        <div className="mb-12">
          <p className="text-[11px] font-medium text-[#6c7b6c] uppercase tracking-[0.18em] mb-4">FAQ</p>
          <h2 className="text-[48px] sm:text-[56px] font-bold leading-[0.93] tracking-[-0.03em] text-[#181d1b]">
            Common questions.
          </h2>
        </div>

        <div className="rounded-[10px] border border-[#bbcbba]/60 bg-white px-6 ambient-shadow">
          {faqs.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

      </div>
    </section>
  );
}
