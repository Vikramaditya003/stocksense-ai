"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "forestock_exit_modal_shown";

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && e.relatedTarget === null) {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, "1");
        document.removeEventListener("mouseout", handleMouseOut);
      }
    };

    // Small delay so it doesn't fire on page load jitter
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseOut);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) setVisible(false); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
        className="relative w-full max-w-md rounded-[10px] border border-white/[0.08] bg-[#111614] p-8 shadow-2xl shadow-black/80"
      >
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors p-1 rounded-[4px] focus-visible:outline-2 focus-visible:outline-[#00D26A]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.18em] mb-3">
          Before you go
        </p>
        <h2 id="exit-modal-title" className="text-[28px] font-bold text-[#fafafa] tracking-[-0.03em] leading-tight mb-3">
          Get your first forecast free.
        </h2>
        <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
          No install. No credit card. Upload a CSV and see exact stockout dates
          for every SKU in 30 seconds.
        </p>

        <Link
          href="/forecast"
          onClick={() => setVisible(false)}
          className="btn-primary flex items-center justify-center gap-2 w-full text-[15px] font-semibold text-[#0a0f0a] bg-[#00D26A] py-3 rounded-[6px] mb-3"
        >
          Run free forecast
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="w-full text-center text-[13px] text-gray-600 hover:text-gray-400 transition-colors py-1"
        >
          No thanks, I&apos;ll pass
        </button>
      </div>
    </div>
  );
}
