"use client";

import dynamic from "next/dynamic";

// ForecastClient uses Clerk hooks and browser APIs.
// ssr: false ensures Clerk hooks never run during server prerender,
// fixing the "Error occurred prerendering page /forecast" Vercel build failure.
const ForecastClient = dynamic(() => import("./ForecastClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#060C0D] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#2DD4BF]/30 border-t-[#2DD4BF] animate-spin" />
    </div>
  ),
});

export default function ForecastPage() {
  return <ForecastClient />;
}
