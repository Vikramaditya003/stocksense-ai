"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogoMark } from "@/components/StocksenseLogo";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { X } from "lucide-react";

const _clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_READY =
  (_clerkKey.startsWith("pk_test_") || _clerkKey.startsWith("pk_live_")) &&
  _clerkKey.length > 30;

function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <>
        <Button size="sm" asChild className="text-[15px] px-5">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <UserButton
          appearance={{
            variables: {
              colorBackground: "#0D1B1D",
              colorText: "#e2f4f4",
              colorTextSecondary: "#94a3b8",
              colorPrimary: "#e2f4f4",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
              fontSize: "14px",
            },
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "!bg-[#0D1B1D] !border !border-[#00D26A]/20 !shadow-2xl !shadow-black/80 !rounded-xl",
              userButtonPopoverMain: "!bg-[#0D1B1D]",
              userButtonPopoverHeader: "!bg-[#0D1B1D] !border-b !border-white/[0.05]",
              userButtonPopoverActions: "!bg-[#0D1B1D]",
              userButtonPopoverActionButton: "!text-slate-200 hover:!bg-white/[0.05] !rounded-lg",
              userButtonPopoverActionButtonText: "!text-slate-200 !font-medium",
              userButtonPopoverActionButtonIconBox: "!text-slate-400",
              userButtonPopoverFooter: "!hidden",
              userPreviewMainIdentifier: "!text-white !font-semibold",
              userPreviewSecondaryIdentifier: "!text-slate-500",
              userPreviewTextContainer: "!text-white",
            },
          }}
        />
      </>
    );
  }
  return (
    <>
      <SignInButton mode="redirect">
        <Button variant="ghost" size="sm" className="text-[15px]">Sign in</Button>
      </SignInButton>
      <SignUpButton mode="redirect">
        <Button size="sm" className="text-[15px] px-5">Get started</Button>
      </SignUpButton>
    </>
  );
}

function MobileAuthButton() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <Button asChild className="w-full">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }
  return (
    <SignUpButton mode="redirect">
      <Button className="w-full">Get started free</Button>
    </SignUpButton>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features",     href: "/#features"     },
    { label: "Pricing",      href: "/#pricing"      },
    { label: "Blog",         href: "/blog"          },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Banner */}
      {bannerVisible && (
        <div className="w-full h-9 flex items-center justify-center bg-[#0a0f0a] border-b border-[#00D26A]/20 px-4 relative">
          <div className="absolute inset-0 bg-[#00D26A]/[0.04]" />
          <p className="relative text-[12px] text-slate-400 text-center">
            <span className="inline-flex items-center gap-1.5 mr-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <span className="font-semibold text-amber-300">Shopify Stocky</span>
            </span>
            shuts down August 2026 —{" "}
            <Link href="/forecast" className="font-semibold text-white underline underline-offset-2 hover:text-[#00D26A] transition-colors">
              migrate free →
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="absolute right-3 text-slate-600 hover:text-slate-300 transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="flex justify-center px-4 pt-4">
      <nav
        className={`w-full max-w-[1000px] flex items-center justify-between px-6 h-16 rounded-2xl transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2 duration-350 fill-mode-both ${
          scrolled
            ? "bg-[#111614]/95 backdrop-blur-2xl border border-[#00D26A]/15 shadow-2xl shadow-black/60"
            : "bg-[#111614]/70 backdrop-blur-xl border border-white/[0.07]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size={34} />
          <span className="text-[19px] font-extrabold tracking-[-0.03em]">
            <span className="text-white">Fore</span><span className="text-[#00D26A]">stock</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15px] text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/[0.05] transition-all duration-150 tracking-tight"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          {CLERK_READY ? (
            <AuthButtons />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-[15px]">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="text-[15px] px-5">
                <Link href="/forecast">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.05] transition-all"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
          </svg>
        </button>
      </nav>
      </div>

      {/* Mobile menu — CSS transition, no framer-motion */}
      <div
        className={`absolute left-4 right-4 bg-[#111614] border border-[#00D26A]/15 rounded-2xl p-3 shadow-2xl shadow-black/70 md:hidden transition-all duration-150 origin-top ${
          bannerVisible ? "top-[7.25rem]" : "top-[4.75rem]"
        } ${
          mobileOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-[0.98] pointer-events-none"
        }`}
      >
        <div className="space-y-0.5 mb-3">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="block text-[15px] text-slate-400 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all tracking-tight">
              {link.label}
            </a>
          ))}
        </div>
        {CLERK_READY ? (
          <MobileAuthButton />
        ) : (
          <Button asChild className="w-full">
            <Link href="/forecast">Get started free</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
