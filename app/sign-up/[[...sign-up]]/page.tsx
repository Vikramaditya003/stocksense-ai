"use client";

import { SignUp, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { LogoMark } from "@/components/StocksenseLogo";
import { useState, useEffect } from "react";

function getStrength(pw: string): { score: number; label: string; color: string; tip: string } {
  if (!pw) return { score: 0, label: "", color: "", tip: "" };

  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Too weak", color: "bg-red-500",    tip: "Add more characters or a number" };
  if (score === 2) return { score: 2, label: "Weak",     color: "bg-orange-400", tip: "Try mixing letters and numbers" };
  if (score === 3) return { score: 3, label: "Fair",     color: "bg-yellow-400", tip: "Add a capital letter or symbol" };
  if (score === 4) return { score: 4, label: "Good",     color: "bg-emerald-400", tip: "Almost there!" };
  return              { score: 5, label: "Strong",   color: "bg-emerald-500", tip: "Great password!" };
}

function PasswordHint() {
  const [password, setPassword] = useState("");
  const [hasPasswordField, setHasPasswordField] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.querySelector<HTMLInputElement>("input[type='password']");
      setHasPasswordField(!!input);
      if (input) {
        if (input.value !== password) setPassword(input.value);
      } else {
        setPassword("");
      }
    }, 150);
    return () => clearInterval(interval);
  }, [password]);

  if (!hasPasswordField) return null;

  const { score, label, color, tip } = getStrength(password);
  const bars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-emerald-950/80 backdrop-blur-xl border border-emerald-800/40 border-t-0 rounded-b-2xl shadow-2xl shadow-black/60 px-5 pt-3 pb-4">
      <div className="border-t border-emerald-800/30 pt-3">
        {!password ? (
          <p className="text-[11px] text-emerald-400/50 text-center">
            Use 8+ characters — a mix of letters and numbers works well
          </p>
        ) : (
          <div className="px-1">
            <div className="flex gap-1 mb-1">
              {bars.map((b) => (
                <div
                  key={b}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${b <= score ? color : "bg-emerald-900/40"}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold ${
                score <= 1 ? "text-red-400" :
                score === 2 ? "text-orange-400" :
                score === 3 ? "text-yellow-400" : "text-emerald-400"
              }`}>{label}</span>
              <span className="text-[11px] text-emerald-400/50">{tip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="bg-emerald-signin min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-emerald-400/[0.06] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-emerald-600/[0.08] blur-[100px] pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 relative z-10">
        <div className="bg-emerald-brand w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
          <LogoMark size={24} />
        </div>
        <div>
          <p className="text-[16px] font-bold text-white tracking-tight leading-none">Forestock</p>
          <p className="text-[10px] font-semibold text-emerald-400/60 uppercase tracking-widest leading-none mt-0.5">Inventory Hub</p>
        </div>
      </Link>

      {/* Social proof strip */}
      <div className="relative z-10 flex items-center justify-center gap-8 mb-6">
        {[
          { val: "12,000+", label: "SKUs forecast" },
          { val: "87%",     label: "accuracy"      },
          { val: "30s",     label: "to insights"   },
        ].map((s, i) => (
          <div key={s.val} className={`text-center ${i < 2 ? "border-r border-emerald-800/50 pr-8" : ""}`}>
            <p className="text-[22px] font-bold text-white tracking-tight leading-none">{s.val}</p>
            <p className="text-[10px] text-emerald-400/55 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
        <SignUp
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#00d26a",
              colorBackground: "#022c22",
              colorText: "#ecfdf5",
              colorTextSecondary: "#6ee7b7",
              colorInputBackground: "#064e3b",
              colorInputText: "#ecfdf5",
              colorNeutral: "#6ee7b7",
              borderRadius: "0.75rem",
              fontSize: "14px",
            },
            elements: {
              rootBox: "w-full",
              card: "!bg-emerald-950/80 !backdrop-blur-xl !shadow-2xl !shadow-black/60 !border !border-emerald-800/40 !rounded-2xl",
              headerTitle: "!text-white !font-bold !tracking-tight",
              headerSubtitle: "!text-emerald-100/70",
              socialButtonsBlockButton: "!bg-emerald-900/60 !border !border-emerald-700/30 hover:!border-emerald-500/40 hover:!bg-emerald-900 !text-emerald-100 !rounded-xl !transition-all",
              socialButtonsBlockButtonText: "!text-emerald-100 !font-medium",
              dividerLine: "!bg-emerald-800/40",
              dividerText: "!text-emerald-400/40",
              formFieldLabel: "!text-emerald-100/90 !text-sm !font-medium",
              formFieldInput: "!bg-emerald-900/60 !border !border-emerald-700/30 focus:!border-emerald-500/50 focus:!ring-0 !text-white !rounded-xl !placeholder-emerald-300/60",
              formButtonPrimary: "!font-bold !shadow-lg !rounded-xl !transition-all !text-emerald-950",
              footerActionLink: "!text-emerald-400 hover:!text-emerald-300 !font-medium",
              footerActionText: "!text-emerald-100/40",
              identityPreviewText: "!text-emerald-100",
              identityPreviewEditButton: "!text-emerald-400",
              formFieldInputShowPasswordButton: "!text-emerald-400/60",
              otpCodeFieldInput: "!bg-emerald-900/60 !border-emerald-700/30 !text-white",
              alertText: "!text-emerald-100/70",
              alertTextDanger: "!text-red-400",
              formResendCodeLink: "!text-emerald-400",
              footer: "!bg-transparent",
            },
          }}
        />
        <PasswordHint />
      </div>

      <p className="mt-6 text-xs text-emerald-100/30 text-center relative z-10">
        Free to start · No credit card required ·{" "}
        <Link href="/privacy" className="text-emerald-400/60 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
      </p>
    </div>
  );
}
