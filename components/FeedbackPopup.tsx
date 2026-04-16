"use client";

import { useState, useEffect } from "react";

interface Props {
  page?: string;
  delayMs?: number;
  onClose?: () => void;
}

const STORAGE_KEY = "forestock_feedback_done";

export default function FeedbackPopup({ page = "forecast", delayMs = 5000, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
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
    const combined = [
      message ? `What could improve: ${message}` : "",
      feature ? `Feature request: ${feature}` : "",
    ].filter(Boolean).join("\n\n");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nps_score: score, message: combined, page }),
      });
    } catch {
      // silent — feedback is best-effort
    }
    setStatus("done");
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => { setVisible(false); onClose?.(); }, 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)]">
      <div className="relative bg-white border border-[#bbcbba]/40 rounded-2xl shadow-2xl shadow-black/10 p-5 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">

        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-emerald-brand" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-[#8a9a8a] hover:text-[#181d1b] transition-colors rounded-md hover:bg-[#f0f5f1]"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="py-4 text-center">
            <div className="w-11 h-11 rounded-full bg-[#006d34]/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-[#006d34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#181d1b] mb-1">Thanks — really appreciate it!</p>
            <p className="text-[12px] text-[#8a9a8a]">Your feedback helps us build a better product.</p>
          </div>
        ) : (
          <>
            <p className="text-[13px] font-semibold text-[#181d1b] mb-0.5 pr-6">How was your first forecast?</p>
            <p className="text-[12px] text-[#8a9a8a] mb-4 leading-relaxed">
              Takes 30 seconds — helps us improve for Shopify merchants like you.
            </p>

            {/* NPS score */}
            <p className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-wide mb-2">
              How likely are you to recommend Forestock? (1–10)
            </p>
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all border ${
                    score === n
                      ? "bg-[#006d34] text-white border-[#006d34] shadow-sm"
                      : "bg-[#f6faf6] text-[#5a6059] border-[#bbcbba]/50 hover:bg-[#eaefeb] hover:text-[#181d1b]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-[10px] text-[#8a9a8a]">Not likely</span>
              <span className="text-[10px] text-[#8a9a8a]">Very likely</span>
            </div>

            {/* Extra fields — show after score picked */}
            {score !== null && (
              <div className="space-y-2.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                <div>
                  <label className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-wide block mb-1.5">
                    What should we improve?
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. the forecast took too long, I didn't understand the results…"
                    rows={2}
                    maxLength={500}
                    className="w-full bg-[#f6faf6] border border-[#bbcbba]/50 rounded-xl px-3 py-2.5 text-[12px] text-[#181d1b] placeholder:text-[#8a9a8a] resize-none focus:outline-none focus:border-[#006d34]/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#5a6059] uppercase tracking-wide block mb-1.5">
                    What feature would help you most?
                  </label>
                  <textarea
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    placeholder="e.g. Shopify direct sync, email alerts, purchase order export…"
                    rows={2}
                    maxLength={500}
                    className="w-full bg-[#f6faf6] border border-[#bbcbba]/50 rounded-xl px-3 py-2.5 text-[12px] text-[#181d1b] placeholder:text-[#8a9a8a] resize-none focus:outline-none focus:border-[#006d34]/40 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              onClick={submit}
              disabled={score === null || status === "submitting"}
              className="mt-4 w-full text-center text-[13px] font-semibold py-2.5 rounded-xl transition-all bg-emerald-brand hover:opacity-90 text-white shadow-md shadow-[#006d34]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending…" : "Send feedback"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
