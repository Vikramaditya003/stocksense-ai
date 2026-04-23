"use client";

import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const FEATURES = [
  "Unlimited products — no 5-SKU cap",
  "60 & 90-day demand forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase order generation",
  "Priority email support",
];

function BuyButton() {
  const { isSignedIn } = useUser();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleBuy() {
    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/upgrade";
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/payment/checkout", { method: "POST" });

      // Session expired or not recognized — send to sign-in
      if (res.status === 401) {
        window.location.href = "/sign-in?redirect_url=/upgrade";
        return;
      }

      const data = await res.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleBuy}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 bg-emerald-brand hover:opacity-90 text-white font-bold text-[15px] px-9 py-4 rounded-xl transition-all shadow-lg shadow-[#006d34]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Redirecting to checkout…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            {isSignedIn ? "Get Pro — $9 / mo" : "Sign in to upgrade"}
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-[12px] text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#f6faf6] flex flex-col">
      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#bbcbba]/30 max-w-[960px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark size={32} />
          <span className="text-[17px] font-bold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[13px] text-[#5a6059] hover:text-[#181d1b] transition-colors flex items-center gap-1.5 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[780px]">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-[#006d34]/[0.08] border border-[#006d34]/25 text-[#006d34] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
              Pro plan · Live now
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="text-[44px] sm:text-[60px] font-bold text-[#181d1b] tracking-[-0.04em] leading-[1.1] mb-5">
              Upgrade to<br />
              <span className="text-[#006d34]">Forestock Pro</span>
            </h1>
            <p className="text-[17px] text-[#5a6059] max-w-[500px] mx-auto leading-relaxed">
              Unlimited forecasts, 90-day predictions, and smart reorder automation — everything you need to never stock out again.
            </p>
          </div>

          {/* Price callout */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border border-[#bbcbba]/40 rounded-2xl px-10 py-6 text-center shadow-sm">
              <p className="text-[48px] font-bold text-[#181d1b] tracking-tight leading-none">
                $9<span className="text-[20px] font-normal text-[#8a9a8a]">/mo</span>
              </p>
              <p className="text-[13px] text-[#8a9a8a] mt-1">approx ₹749/mo · cancel anytime</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <BuyButton />
            <Link
              href="/forecast"
              className="inline-flex items-center justify-center gap-2 border border-[#bbcbba]/60 hover:border-[#006d34]/30 text-[#5a6059] hover:text-[#181d1b] font-semibold text-[14px] px-7 py-4 rounded-xl transition-all bg-white"
            >
              Use free plan for now
            </Link>
          </div>

          {/* Features grid */}
          <div className="bg-white border border-[#bbcbba]/40 rounded-2xl p-8 shadow-sm">
            <p className="text-[12px] font-bold text-[#006d34] uppercase tracking-widest mb-5">Everything in Pro</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-[#5a6059]">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-6 border-t border-[#bbcbba]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[12px] text-[#8a9a8a]">
                Questions?{" "}
                <a href="mailto:support@getforestock.com" className="text-[#5a6059] hover:text-[#181d1b] transition-colors underline">
                  support@getforestock.com
                </a>
              </p>
              <div className="flex items-center gap-4 text-[11px] text-[#8a9a8a]">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#006d34]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Cancel anytime
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#006d34]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Secure checkout via Dodo Payments
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
