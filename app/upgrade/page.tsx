"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { LogoMark } from "@/components/StocksenseLogo";
import Link from "next/link";

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
        theme: { color: "#22C55E" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan: "pro" }),
          });
          const vData = await verify.json();
          if (vData.success) onSuccess();
          else onError();
        },
      });
      rzp.open();
    };
    document.body.appendChild(script);
  } catch {
    onError();
  }
}

const FEATURES = [
  "Unlimited products (no 5-SKU cap)",
  "60 & 90-day demand forecasts",
  "AI ad-spend correlation",
  "Smart reorder quantities",
  "Supplier lead time alerts",
  "1-click purchase order generation",
  "Priority support",
];

export default function UpgradePage() {
  const { isSignedIn, isLoaded } = useUser();
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(false);

  // Auto-trigger checkout if redirected back after sign-in with ?checkout=1
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("checkout") === "1") {
      handleUpgrade();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const handleUpgrade = () => {
    setPaying(true);
    setPayError(false);
    startRazorpayCheckout(
      () => { setPaying(false); setPaySuccess(true); setTimeout(() => window.location.href = "/dashboard", 2000); },
      () => { setPaying(false); setPayError(true); }
    );
  };

  return (
    <div className="min-h-screen bg-[#060C0D] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <LogoMark size={36} />
        <span className="text-[18px] font-semibold tracking-tight">
          <span className="text-white">Fore</span><span className="text-[#22C55E]">stock</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-[#0A1415] border border-[#22C55E]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#22C55E]/[0.08]">
          <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest mb-1">Forestock Pro</p>
          <h1 className="text-[24px] font-bold text-white tracking-tight">Upgrade your plan</h1>
          <p className="text-slate-500 text-sm mt-1">Everything you need to never stock out again.</p>
        </div>

        {/* Features */}
        <div className="px-8 py-6">
          <ul className="space-y-3 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-slate-300">
                <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[36px] font-bold text-white tracking-tight">$9</span>
            <span className="text-slate-500 text-sm">/month · cancel anytime</span>
          </div>
          <p className="text-xs text-slate-600 mb-6">Billed in INR · approx ₹749/mo at current rates</p>

          {paySuccess ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#22C55E]">Payment successful!</p>
              <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
            </div>
          ) : isLoaded && !isSignedIn ? (
            <>
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-sm text-amber-300">Sign in to complete your purchase.</p>
              </div>
              <SignInButton mode="redirect" fallbackRedirectUrl="/upgrade?checkout=1">
                <button type="button" className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-[#22C55E]/20 hover:-translate-y-0.5">
                  Sign in to upgrade
                </button>
              </SignInButton>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={paying}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-[#22C55E]/20 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {paying ? "Opening payment..." : "Upgrade to Pro — $9/mo"}
              </button>
              {payError && (
                <p className="text-xs text-red-400 text-center mt-3">Payment failed. Please try again.</p>
              )}
            </>
          )}

          <p className="text-center text-xs text-slate-600 mt-4">
            Secured by Razorpay · Cancel anytime from your account
          </p>
        </div>
      </div>

      <Link href="/" className="mt-6 text-xs text-slate-600 hover:text-slate-400 transition-colors">
        ← Back to home
      </Link>
    </div>
  );
}
