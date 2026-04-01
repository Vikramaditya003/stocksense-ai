"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

interface AppSidebarProps {
  alertCount?: number;
}

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "New Forecast",
    href: "/forecast",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    highlight: true,
  },
  {
    label: "Products",
    href: "/dashboard?tab=products",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Alerts",
    href: "/dashboard?tab=alerts",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    alertBadge: true,
  },
  {
    label: "History",
    href: "/history",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const BOTTOM_NAV = [
  {
    label: "Blog",
    href: "/blog",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
  },
  {
    label: "Help",
    href: "mailto:support@stocksenseai.com",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function AppSidebar({ alertCount = 0 }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string) {
    const [base, query] = href.split("?");
    if (pathname !== base) return false;
    if (!query) return !searchParams.get("tab");
    const p = new URLSearchParams(query);
    return searchParams.get("tab") === p.get("tab");
  }

  return (
    <aside
      className={`flex-shrink-0 ${collapsed ? "w-[64px]" : "w-[240px]"} transition-all duration-200 bg-[#07100F] border-r border-[#2DD4BF]/[0.08] flex flex-col h-screen sticky top-0 z-30 overflow-hidden`}
    >
      {/* ── Logo ── */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[#2DD4BF]/[0.07] flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#2DD4BF] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2DD4BF]/25">
            <svg className="w-4 h-4 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14M9 20V8M14 20V11M19 20V4" />
            </svg>
          </div>
          {!collapsed && (
            <span className="text-[15px] font-bold text-white truncate tracking-tight">
              StockSense<span className="text-[#2DD4BF]">AI</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-white/[0.05] rounded-lg transition-all"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />}
          </svg>
        </button>
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2.5 mb-2">Menu</p>
        )}

        {NAV.map((item) => {
          const active = isActive(item.href);
          const alerts = item.alertBadge ? alertCount : 0;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 font-semibold text-[13px] transition-all group ${
                  active
                    ? "bg-[#2DD4BF] text-[#060C0D] shadow-lg shadow-[#2DD4BF]/25"
                    : "bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/15"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative group ${
                active
                  ? "bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/15"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {alerts > 0 && (
                    <span className="flex-shrink-0 ml-auto text-[10px] font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {alerts > 9 ? "9+" : alerts}
                    </span>
                  )}
                </>
              )}
              {collapsed && alerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}

        {/* Bottom nav section */}
        <div className="pt-4 mt-4 border-t border-white/[0.05] space-y-0.5">
          {!collapsed && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2.5 mb-2">Support</p>
          )}
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent transition-all"
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Upgrade Banner ── */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <Link
            href="/#pricing"
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#2DD4BF]/10 to-cyan-500/5 border border-[#2DD4BF]/20 px-3 py-2.5 rounded-xl hover:border-[#2DD4BF]/35 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#2DD4BF] truncate">Upgrade to Pro</p>
              <p className="text-[10px] text-slate-600 truncate">Unlimited SKUs · 90-day forecasts</p>
            </div>
          </Link>
        </div>
      )}

      {/* ── User profile ── */}
      <div className={`flex-shrink-0 border-t border-[#2DD4BF]/[0.07] p-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <UserButton
          appearance={{
            variables: {
              colorBackground: "#0A1415",
              colorInputBackground: "#0F1C1E",
              colorText: "#E2F4F4",
              colorTextSecondary: "#7DB8BC",
              colorPrimary: "#2DD4BF",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
            },
            elements: {
              // Popover
              avatarBox: "w-8 h-8 !ring-1 !ring-[#2DD4BF]/20",
              userButtonPopoverCard: "!bg-[#0D1B1D] !border !border-[#2DD4BF]/20 !shadow-2xl !shadow-black/80 !rounded-xl",
              userButtonPopoverMain: "!bg-[#0D1B1D]",
              userButtonPopoverHeader: "!bg-[#0D1B1D] !border-b !border-white/[0.05]",
              userButtonPopoverActions: "!bg-[#0D1B1D]",
              userButtonPopoverActionButton: "!text-slate-200 hover:!bg-white/[0.05] !rounded-lg",
              userButtonPopoverActionButtonText: "!text-slate-200 !font-medium",
              userButtonPopoverActionButtonIcon: "!text-slate-500",
              userButtonPopoverFooter: "!hidden",
              userPreviewMainIdentifier: "!text-white !font-semibold",
              userPreviewSecondaryIdentifier: "!text-slate-500",
              // Manage Account modal
              modalContent: "!bg-[#0A1415] !border !border-[#2DD4BF]/15 !shadow-2xl !shadow-black/80 !rounded-2xl",
              modalCloseButton: "!text-slate-500 hover:!text-white hover:!bg-white/[0.05] !rounded-lg",
              navbar: "!bg-[#07100F] !border-r !border-[#2DD4BF]/[0.08]",
              navbarButton: "!text-slate-400 hover:!text-white hover:!bg-white/[0.04] !rounded-lg !font-medium",
              navbarButtonActive: "!text-[#2DD4BF] !bg-[#2DD4BF]/10 !rounded-lg",
              pageScrollBox: "!bg-[#0A1415]",
              profileSectionTitleText: "!text-white !font-semibold",
              profileSectionTitle: "!border-b !border-[#2DD4BF]/[0.08]",
              profileSectionPrimaryButton: "!text-[#2DD4BF] hover:!text-[#14B8A6] !font-medium",
              badge: "!bg-[#2DD4BF]/10 !text-[#2DD4BF] !border !border-[#2DD4BF]/20 !font-semibold",
              formFieldInput: "!bg-[#0F1C1E] !border-[#2DD4BF]/20 !text-white focus:!border-[#2DD4BF]/50",
              formFieldLabel: "!text-slate-300 !font-medium",
              formButtonPrimary: "!bg-[#2DD4BF] hover:!bg-[#14B8A6] !text-[#060C0D] !font-semibold",
              formButtonReset: "!text-slate-400 hover:!text-white !border !border-white/10",
              menuList: "!bg-[#0D1B1D] !border !border-[#2DD4BF]/15 !rounded-xl !shadow-xl !shadow-black/60",
              menuItem: "!text-slate-300 hover:!bg-white/[0.05] hover:!text-white",
              menuItemDestructive: "!text-red-400 hover:!bg-red-500/[0.06]",
            },
          }}
        />
        {!collapsed && user && (
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">
              {user.firstName ?? user.username ?? "User"}
            </p>
            <p className="text-[11px] text-slate-600 truncate">
              {user.primaryEmailAddress?.emailAddress ?? ""}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
