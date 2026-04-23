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
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleBuy}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2.5 bg-[#006d34] hover:bg-[#005a2b] text-white font-bold text-[16px] px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-[#006d34]/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            {isSignedIn ? "Get Pro — $9 / mo" : "Sign in to get Pro"}
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-[12px] text-red-500 text-center">{errorMsg}</p>
      )}
      <p className="text-[11px] text-[#8a9a8a]">Cancel anytime · Secure checkout · Instant access</p>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="text-[16px] font-bold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] flex flex-col gap-8">

          {/* Top label */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006d34] uppercase tracking-widest bg-[#006d34]/[0.07] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
              Pro plan · Live
            </span>
          </div>

          {/* Price */}
          <div className="text-center">
            <p className="text-[64px] font-black text-[#181d1b] tracking-[-0.04em] leading-none">$9</p>
            <p className="text-[15px] text-gray-400 mt-1">per month · approx ₹749</p>
          </div>

          {/* CTA */}
          <BuyButton />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-300 uppercase tracking-widest">What&apos;s included</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#006d34]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[14px] text-gray-600">{f}</span>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <p className="text-center text-[12px] text-gray-400">
            Questions?{" "}
            <a href="mailto:support@getforestock.com" className="underline hover:text-gray-600 transition-colors">
              support@getforestock.com
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
