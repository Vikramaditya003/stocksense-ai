"use client";

import { useState, useEffect } from "react";

interface Props {
  page?: string;
  /** ms to wait after mount before showing — default 5000 */
  delayMs?: number;
  onClose?: () => void;
}

const STORAGE_KEY = "forestock_feedback_done";

export default function FeedbackPopup({ page = "forecast", delayMs = 5000, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    // Only show once per browser
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
    onClose?.();
  };

  const submit = async () => {
    if (score === null) return;
    setStatus("submitting");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nps_score: score, message, page }),
      });
    } catch {
      // silent — feedback is best-effort
    }
    setStatus("done");
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => { setVisible(false); onClose?.(); }, 2000);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)]">
      {/* Card */}
      <div className="relative bg-[#0A1415] border border-[#22C55E]/20 rounded-2xl shadow-2xl shadow-black/60 p-5 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">

        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#22C55E]/40 to-transparent" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3.5 right-3.5 w-6 h-6 flex items-center justify-center text-slate-600 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="py-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-white mb-1">Thanks — really appreciate it</p>
            <p className="text-[12px] text-slate-500">Your feedback helps us build a better product.</p>
          </div>
        ) : (
          <>
            <p className="text-[13px] font-semibold text-white mb-0.5 pr-6">Quick question</p>
            <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">
              How likely are you to recommend Forestock to another Shopify merchant?
            </p>

            {/* NPS score row */}
            <div className="mb-1">
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setScore(n)}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all border ${
                      score === n
                        ? "bg-[#22C55E] text-[#060C0D] border-[#22C55E]"
                        : "bg-white/[0.04] text-slate-500 border-white/[0.07] hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-700">Not likely</span>
                <span className="text-[10px] text-slate-700">Very likely</span>
              </div>
            </div>

            {/* Optional message — only show after score selected */}
            {score !== null && (
              <div className="mt-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's the one thing you'd change? (optional)"
                  rows={2}
                  maxLength={500}
                  className="w-full bg-[#060C0D] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-[#22C55E]/30 transition-colors"
                />
              </div>
            )}

            <button
              onClick={submit}
              disabled={score === null || status === "submitting"}
              className="mt-3 w-full text-center text-[13px] font-semibold py-2.5 rounded-xl transition-all bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] shadow-lg shadow-[#22C55E]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending…" : "Send feedback"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
