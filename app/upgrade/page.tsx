"use client";

import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const FEATURES = [
  "Unlimited forecasts — no 5-run cap",
  "60 & 90-day demand forecasts",
  "AI ad-spend & promotion correlation",
  "Smart reorder quantities with lead time buffers",
  "Supplier lead time alerts",
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
      let data: { success: boolean; checkout_url?: string; session_id?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        setErrorMsg("Unexpected error. Please try again.");
        setStatus("error");
        return;
      }
      if (data.success && data.checkout_url) {
        if (data.session_id) {
          localStorage.setItem("dodo_session_id", data.session_id);
        }
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
        className="w-full flex items-center justify-center gap-2.5 btn-primary btn-gradient text-white font-bold text-[15px] px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#006d34]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Taking you to checkout…
          </>
        ) : (
          <>
            {isSignedIn ? "Get Pro — $9 / mo" : "Sign in to get Pro"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-[12px] text-red-500 text-center">{errorMsg}</p>
      )}
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#f6faf6] flex flex-col">

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#bbcbba]/30 bg-white max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[13px] text-[#5a6059] hover:text-[#181d1b] transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
      </header>

      {/* Urgency strip */}
      <div className="bg-amber-50 border-b border-amber-200/60 py-2 px-4 text-center">
        <p className="text-[12px] text-amber-700">
          <span className="inline-flex items-center gap-1.5 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Shopify Stocky shuts down August 2026</span>
          </span>
          — migrate your inventory forecasting before peak season.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] flex flex-col gap-5">

          {/* Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006d34] uppercase tracking-widest bg-[#006d34]/[0.07] border border-[#006d34]/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
              Pro plan · Live
            </span>
          </div>

          {/* Price card */}
          <div className="bg-white rounded-2xl border border-[#bbcbba]/40 shadow-sm p-8">
            <div className="text-center mb-7">
              <p className="text-[80px] font-black text-[#181d1b] tracking-[-0.04em] leading-none">$9</p>
              <p className="text-[16px] font-semibold text-[#006d34] mt-1">per month</p>
              <p className="text-[12px] text-[#8a9a8a] mt-1.5">approx ₹749 · billed monthly</p>
            </div>

            <BuyButton />

            {/* Trust strip */}
            <div className="mt-5 pt-5 border-t border-[#bbcbba]/30 grid grid-cols-3 gap-2 text-center">
              {[
                {
                  label: "Secure checkout",
                  icon: (
                    <svg className="w-4 h-4 text-[#006d34]/50 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                },
                {
                  label: "Cancel anytime",
                  icon: (
                    <svg className="w-4 h-4 text-[#006d34]/50 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  ),
                },
                {
                  label: "Instant access",
                  icon: (
                    <svg className="w-4 h-4 text-[#006d34]/50 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                },
              ].map((t) => (
                <div key={t.label}>
                  {t.icon}
                  <p className="text-[10px] text-[#8a9a8a] leading-tight">{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features card */}
          <div className="bg-white rounded-2xl border border-[#bbcbba]/40 shadow-sm p-6">
            <p className="text-[10px] font-bold text-[#8a9a8a] uppercase tracking-widest mb-5">Everything in Pro</p>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-[4px] bg-[#006d34]/[0.08] border border-[#006d34]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-[#5a6059]">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-[12px] text-[#8a9a8a]">
            Questions?{" "}
            <a href="mailto:support@getforestock.com" className="text-[#006d34] hover:underline underline-offset-2 transition-colors">
              support@getforestock.com
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
