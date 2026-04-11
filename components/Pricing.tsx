"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const _clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_READY =
  (_clerkKey.startsWith("pk_test_") || _clerkKey.startsWith("pk_live_")) &&
  _clerkKey.length > 30;

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

function Check() {
  return (
    <div className="w-4 h-4 rounded-[4px] bg-[#00D26A]/10 border border-[#00D26A]/25 flex items-center justify-center flex-shrink-0">
      <svg className="w-2.5 h-2.5 text-[#00D26A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function Cross() {
  return (
    <div className="w-4 h-4 rounded-[4px] bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
      <svg className="w-2.5 h-2.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function NotifyButton() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = async () => {
    if (!CLERK_READY || !isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-up?redirect_url=" + encodeURIComponent("/#pricing"));
      return;
    }

    if (state === "done") return;

    setState("loading");
    try {
      const res = await fetch("/api/waitlist", { method: "POST" });
      const json = await res.json();
      setState(json.success ? "done" : "idle");
    } catch {
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-[6px] mb-2 bg-[#00D26A]/10 border border-[#00D26A]/25 text-[#00D26A]">
        ✓ You&apos;re on the list — we&apos;ll email you at launch
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className="btn-ghost block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-[6px] mb-2 text-gray-300 border border-white/[0.12] hover:border-white/[0.25] hover:text-[#fafafa] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {state === "loading" ? "Saving…" : "Get notified at launch →"}
    </button>
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
    <section id="pricing" className="py-28 bg-[#0a0f0a] relative overflow-hidden">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">Pricing</p>
          <h2 className="text-[40px] sm:text-[52px] font-bold text-[#fafafa] tracking-[-0.03em] leading-tight mb-3">
            Get started for free
          </h2>
          <p className="text-[15px] text-gray-500 max-w-sm leading-relaxed">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Cards — side by side, identical structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          {/* Starter */}
          <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-[13px] font-semibold text-gray-300 mb-1">Starter</p>
              <p className="text-[13px] text-gray-600 mb-5">Try it free. No credit card needed.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[42px] font-bold text-[#fafafa] tracking-tight leading-none">$0</span>
              </div>
              <p className="text-[12px] text-gray-600">Free forever</p>
            </div>

            <Link
              href="/forecast"
              className="btn-primary block w-full text-center text-[13px] font-semibold py-2.5 px-4 rounded-[6px] mb-7 text-[#0a0f0a] bg-[#00D26A]"
            >
              Run free forecast
            </Link>

            <div className="border-t border-white/[0.05] pt-6">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">What&apos;s included</p>
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check />
                    <span className="text-[13px] text-gray-400">{f}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2.5 opacity-30">
                  <Cross />
                  <span className="text-[13px] text-gray-600">Unlimited products</span>
                </li>
                <li className="flex items-center gap-2.5 opacity-30">
                  <Cross />
                  <span className="text-[13px] text-gray-600">90-day forecasts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-[10px] border border-white/[0.08] bg-[#111614] p-7 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-semibold text-gray-300">Pro</p>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/[0.08] px-1.5 py-0.5 rounded-[4px]">
                  Coming Q2 2025
                </span>
              </div>
              <p className="text-[13px] text-gray-600 mb-5">For stores that can&apos;t afford stockouts.</p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-[42px] font-bold text-[#fafafa] tracking-tight leading-none">{proPrice}</span>
                <span className="text-[14px] text-gray-500 mb-2">/{proBilling.replace("per ", "")}</span>
              </div>
              <p className="text-[12px] text-gray-600">Early-bird discount at launch</p>
            </div>

            <div className="mb-7">
              <NotifyButton />
            </div>

            <div className="border-t border-white/[0.05] pt-6">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Everything in Starter, plus</p>
              <ul className="space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check />
                    <span className="text-[13px] text-gray-400">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center gap-6 text-[12px] text-gray-600">
          {["No credit card for Free plan", "Cancel anytime", "Instant forecasts", "Shopify CSV compatible"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
