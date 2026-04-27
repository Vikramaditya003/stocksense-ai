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
      if (res.status === 401) {
        window.location.href = "/sign-in?redirect_url=/upgrade";
        return;
      }
      let data: { success: boolean; checkout_url?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        setErrorMsg("Unexpected error. Please try again.");
        setStatus("error");
        return;
      }
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
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        type="button"
        onClick={handleBuy}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2.5 btn-primary btn-gradient text-white font-bold text-[16px] px-8 py-4 rounded-xl transition-all shadow-2xl shadow-[#006d34]/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Taking you to checkout…
          </>
        ) : (
          <>
            {isSignedIn ? "Get Pro — $9 / mo" : "Sign in to get Pro"}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-[12px] text-red-400 text-center">{errorMsg}</p>
      )}
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#0d1a10] flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#006d34]/[0.12] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#006d34]/[0.07] blur-[100px] pointer-events-none" />

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] max-w-[900px] mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="text-[16px] font-bold tracking-tight">
            <span className="text-white">Fore</span><span className="text-[#00d26a]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[13px] text-white/35 hover:text-white/70 transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
      </header>

      {/* Urgency strip */}
      <div className="bg-amber-400/[0.08] border-b border-amber-400/15 py-2 px-4 text-center relative z-10">
        <p className="text-[12px] text-amber-300/80">
          <span className="inline-flex items-center gap-1.5 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold">Shopify Stocky shuts down August 2026</span>
          </span>
          — migrate your inventory forecasting before peak season.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-[460px] flex flex-col gap-5">

          {/* Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#00d26a] uppercase tracking-widest bg-[#00d26a]/10 border border-[#00d26a]/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] animate-pulse" />
              Pro plan · Live
            </span>
          </div>

          {/* Price card */}
          <div className="card-glass-dark rounded-2xl p-8">
            <div className="text-center mb-7">
              <p className="text-[88px] font-black text-white tracking-[-0.04em] leading-none">$9</p>
              <p className="text-[18px] font-semibold text-emerald-400/70 mt-1 tracking-wide">per month</p>
              <p className="text-[13px] text-white/35 mt-1.5">approx ₹749 · billed monthly</p>
            </div>

            <BuyButton />

            {/* Trust strip */}
            <div className="mt-5 pt-5 border-t border-white/[0.07] grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: "Secure checkout",
                  icon: (
                    <svg className="w-4 h-4 text-[#00d26a]/60 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                },
                {
                  label: "Cancel anytime",
                  icon: (
                    <svg className="w-4 h-4 text-[#00d26a]/60 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  ),
                },
                {
                  label: "Instant access",
                  icon: (
                    <svg className="w-4 h-4 text-[#00d26a]/60 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                },
              ].map((t) => (
                <div key={t.label}>
                  {t.icon}
                  <p className="text-[10px] text-white/35 leading-tight">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features card */}
          <div className="card-glass-dark rounded-2xl p-6">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">Everything in Pro</p>
            <ul className="space-y-3.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00d26a]/15 border border-[#00d26a]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#00d26a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-white/65">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-[12px] text-white/30">
            Questions?{" "}
            <a href="mailto:support@getforestock.com" className="text-[#00d26a]/60 hover:text-[#00d26a] transition-colors underline underline-offset-2">
              support@getforestock.com
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
