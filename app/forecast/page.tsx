"use client";

import { useState, useEffect, lazy, Suspense } from "react";

// React.lazy + isMounted ensures ForecastClient (which uses Clerk hooks)
// is NEVER evaluated on the server. next/dynamic with ssr:false was still
// being analyzed by Vercel's Turbopack during prerender, causing the build failure.
const ForecastClient = lazy(() => import("./ForecastClient"));

const Spinner = () => (
  <div className="min-h-screen bg-[#060C0D] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#2DD4BF]/30 border-t-[#2DD4BF] animate-spin" />
  </div>
);

export default function ForecastPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Spinner />;

  return (
    <Suspense fallback={<Spinner />}>
      <ForecastClient />
    </Suspense>
  );
}
