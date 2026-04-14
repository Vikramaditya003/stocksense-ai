"use client";
import dynamic from "next/dynamic";

// ── Shimmer primitive ─────────────────────────────────────────────────────────
const S = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-black/[0.06] ${className}`} />
);

// ── Skeleton that mirrors the real dashboard layout exactly ───────────────────
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f6faf6] flex">

      {/* Sidebar ghost — dark emerald, matches AppSidebar */}
      <div className="flex-shrink-0 w-[220px] bg-emerald-950 h-screen sticky top-0 flex flex-col overflow-hidden">
        {/* Logo area */}
        <div className="h-14 flex items-center gap-3 px-4 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-800/60 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 rounded bg-emerald-800/60 animate-pulse" />
            <div className="h-2 w-16 rounded bg-emerald-900/60 animate-pulse" />
          </div>
        </div>
        {/* Search */}
        <div className="px-3 pb-2">
          <div className="h-8 rounded-xl bg-emerald-900/40 animate-pulse w-full" />
        </div>
        {/* Nav items */}
        <div className="px-3 space-y-1 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-10 rounded-lg animate-pulse ${i === 0 ? "bg-emerald-900/50" : "bg-emerald-900/20"}`} />
          ))}
        </div>
        {/* CTA */}
        <div className="px-3 pb-3">
          <div className="h-10 rounded-xl bg-emerald-800/40 animate-pulse w-full" />
        </div>
        {/* User */}
        <div className="border-t border-emerald-900/60 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800/60 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-20 rounded bg-emerald-800/60 animate-pulse" />
            <div className="h-2 w-28 rounded bg-emerald-900/40 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-14 border-b border-[#bbcbba]/30 bg-white/70 backdrop-blur-xl flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-20">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <S className="h-8 w-full rounded-full" />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <S className="h-5 w-5 rounded-full" />
            <S className="h-5 w-5 rounded-full" />
            <div className="w-px h-6 bg-[#bbcbba]/30" />
            <div className="flex items-center gap-2.5">
              <div className="text-right space-y-1">
                <S className="h-2 w-24 ml-auto" />
                <S className="h-3 w-20 ml-auto" />
              </div>
              <S className="w-9 h-9 rounded-full flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-6 overflow-auto">

          {/* 4 KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#bbcbba]/20 p-5">
                <S className="h-2.5 w-28 mb-4" />
                <S className="h-8 w-24 mb-1" />
                <S className="h-2.5 w-16" />
              </div>
            ))}
            {/* Dark card */}
            <div className="bg-emerald-900 rounded-xl p-5">
              <div className="animate-pulse rounded bg-emerald-800/60 h-2.5 w-24 mb-4" />
              <div className="animate-pulse rounded bg-emerald-800/60 h-8 w-20 mb-3" />
              <div className="animate-pulse rounded-full bg-emerald-800/60 h-1.5 w-full" />
            </div>
          </div>

          {/* Two-column main area */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-4">

            {/* Left: chart + table */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#bbcbba]/20 p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1.5">
                    <S className="h-5 w-40" />
                    <S className="h-3 w-56" />
                  </div>
                  <div className="flex gap-2">
                    <S className="h-8 w-20 rounded-lg" />
                    <S className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
                <S className="h-56 w-full rounded-xl" />
              </div>

              <div className="bg-white rounded-2xl border border-[#bbcbba]/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#bbcbba]/20 flex items-center justify-between">
                  <S className="h-5 w-36" />
                  <S className="h-4 w-24 rounded" />
                </div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#bbcbba]/10">
                    <S className="w-8 h-8 rounded-full flex-shrink-0" />
                    <S className="h-4 flex-1" />
                    <S className="h-4 w-24 hidden sm:block" />
                    <S className="h-6 w-20 rounded-full" />
                    <S className="h-4 w-16 text-right" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: panels */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-[#bbcbba]/20 p-5">
                <S className="h-3 w-24 mb-4" />
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-full border-[9px] border-[#eaefeb] animate-pulse" />
                </div>
                <div className="space-y-2.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <S className="h-2.5 w-20" />
                      <S className="h-2.5 w-10" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#bbcbba]/20 p-5">
                <S className="h-3 w-28 mb-3" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <S className="w-2 h-2 rounded-full flex-shrink-0" />
                      <S className="h-3 flex-1" />
                      <S className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export default function DashboardShell() {
  return <DashboardClient />;
}
