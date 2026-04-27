"use client";

import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status");
  const failed = status === "failed" || status === "cancelled";

  const [activating, setActivating] = useState(!failed);
  const [activated, setActivated] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (failed) return;

    const sessionId =
      typeof window !== "undefined" ? localStorage.getItem("dodo_session_id") ?? "" : "";

    let stopped = false;
    let tries = 0;
    const MAX = 12; // poll up to ~24 seconds

    async function poll() {
      if (stopped) return;
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data: { activated: boolean } = await res.json();
        if (data.activated) {
          if (typeof window !== "undefined") localStorage.removeItem("dodo_session_id");
          setActivated(true);
          setActivating(false);
          // Auto-redirect to dashboard after 2.5s
          setTimeout(() => router.push("/dashboard"), 2500);
          return;
        }
      } catch {
        // network error — keep polling
      }
      tries++;
      setAttempts(tries);
      if (tries < MAX && !stopped) {
        setTimeout(poll, 2000);
      } else {
        setActivating(false); // gave up — show manual CTA
      }
    }

    // Small initial delay to give webhook a head start
    setTimeout(poll, 1500);
    return () => { stopped = true; };
  }, [failed, router]);

  return (
    <div className="min-h-screen bg-[#f6faf6] flex flex-col">
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#bbcbba]/30 bg-white max-w-[900px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="text-[15px] font-semibold tracking-tight">
            <span className="text-[#181d1b]">Fore</span><span className="text-[#006d34]">stock</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[480px] text-center">

          {failed ? (
            /* ── Payment cancelled / failed ── */
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">Payment not completed</h1>
              <p className="text-[15px] text-[#5a6059] mb-8">
                No charge was made. Please try again or contact{" "}
                <a href="mailto:support@getforestock.com" className="text-[#006d34] underline">support@getforestock.com</a>.
              </p>
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 btn-gradient text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#006d34]/20"
              >
                Try again
              </Link>
            </>

          ) : activated ? (
            /* ── Plan activated ── */
            <>
              <div className="w-16 h-16 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">You&apos;re on Pro!</h1>
              <p className="text-[15px] text-[#5a6059] mb-2">
                Your Forestock Pro plan is now active. Unlimited forecasts unlocked.
              </p>
              <p className="text-[12px] text-[#8a9a8a] mb-8">Taking you to your dashboard…</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 btn-gradient text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#006d34]/20"
              >
                Go to dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </>

          ) : activating ? (
            /* ── Activating — polling ── */
            <>
              <div className="w-16 h-16 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#006d34] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">Activating your Pro plan…</h1>
              <p className="text-[15px] text-[#5a6059] mb-2">
                Payment received. Setting up your account — this takes a few seconds.
              </p>
              <p className="text-[12px] text-[#8a9a8a]">
                Checking{attempts > 0 ? ` (${attempts})` : ""}…
              </p>
            </>

          ) : (
            /* ── Timed out — activation may come via webhook ── */
            <>
              <div className="w-16 h-16 rounded-full bg-[#006d34]/10 border border-[#006d34]/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-[28px] font-bold text-[#181d1b] tracking-tight mb-3">Payment received!</h1>
              <p className="text-[15px] text-[#5a6059] mb-2">
                Your Pro plan is being activated. Open your dashboard in a moment — it may take up to a minute.
              </p>
              <p className="text-[13px] text-[#8a9a8a] mb-8">
                A confirmation email is on its way. If you have any issues, email{" "}
                <a href="mailto:support@getforestock.com" className="text-[#006d34] underline">support@getforestock.com</a>.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 btn-gradient text-white font-semibold text-[14px] px-7 py-3 rounded-xl transition-all shadow-lg shadow-[#006d34]/20"
              >
                Go to dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
