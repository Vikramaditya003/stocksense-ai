"use client";

import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const FEATURES = [
  "Unlimited forecast runs — no 5-run cap",
  "60 & 90-day demand forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase order generation",
  "Priority email support",
];

async function startRazorpayCheckout(onSuccess: () => void, onError: () => void) {
  try {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (!data.success) { onError(); return; }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Forestock",
        description: data.planName,
        order_id: data.orderId,
        theme: { color: "#006d34" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan: "pro" }),
          });
          const vdata = await verify.json();
          if (vdata.success) { onSuccess(); } else { onError(); }
        },
        modal: { ondismiss: () => onError() },
      });
      rzp.open();
    };
    script.onerror = () => onError();
    document.body.appendChild(script);
  } catch {
    onError();
  }
}

function UpgradeButton() {
  const { isSignedIn } = useUser();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleClick() {
    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/upgrade";
      return;
    }
    setStatus("loading");
    startRazorpayCheckout(
      () => { setStatus("success"); setTimeout(() => window.location.href = "/dashboard", 1500); },
      () => setStatus("error"),
    );
  }

  if (status === "success") {
    return (
      <div className="inline-flex items-center justify-center gap-2 bg-[#006d34]/10 border border-[#006d34]/30 text-[#006d34] font-semibold text-[14px] px-7 py-3 rounded-xl">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Payment confirmed — redirecting…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 bg-[#006d34] hover:bg-[#005a28] text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#006d34]/25 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Opening payment…
          </>
        ) : (
          <>
            Upgrade to Pro — ₹749/mo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-[12px] text-red-500">Payment failed. Please try again.</p>
      )}
    </div>
  );
}

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-[#f6faf6] flex flex-col">
      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#bbcbba]/30 max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
        <Link href="/" className="text-[12px] text-[#5a6059] hover:text-[#181d1b] transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[760px]">

          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#006d34]/[0.08] border border-[#006d34]/25 text-[#006d34] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006d34] animate-pulse" />
              Pro plan · Live now
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-[36px] sm:text-[48px] font-bold text-[#181d1b] tracking-[-0.03em] leading-tight mb-4">
              Unlock unlimited<br className="hidden sm:block" /> forecasts
            </h1>
            <p className="text-[16px] text-[#5a6059] max-w-[460px] mx-auto leading-relaxed">
              ₹749/month. Cancel anytime. Instant access after payment.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col items-center gap-3 mb-12">
            <UpgradeButton />
            <Link
              href="/forecast"
              className="text-[13px] text-[#8a9a8a] hover:text-[#5a6059] transition-colors"
            >
              Continue with free plan →
            </Link>
          </div>

          {/* What's coming */}
          <div className="bg-white border border-[#bbcbba]/40 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#006d34] uppercase tracking-widest mb-1">Forestock Pro</p>
                <p className="text-[18px] font-semibold text-[#181d1b] tracking-tight">Everything in Pro</p>
              </div>
              <div className="text-right">
                <p className="text-[28px] font-bold text-[#181d1b] tracking-tight leading-none">$9<span className="text-[14px] font-normal text-[#8a9a8a]">/mo</span></p>
                <p className="text-[11px] text-[#8a9a8a] mt-0.5">approx ₹749/mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[13px] text-[#5a6059]">{f}</span>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-6 pt-5 border-t border-[#bbcbba]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                  Instant access after payment
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
