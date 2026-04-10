import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Forestock",
  description: "Inventory management tips, demand forecasting guides, and Shopify growth strategies from the Forestock team.",
};

// Full Tailwind class strings — must be literal so Tailwind includes them at build time
const TAG_COVER: Record<string, {
  bgClass: string;
  patternFill: string;
  badgeClass: string;
  icon: string;
}> = {
  Guide:     { bgClass: "bg-[#C4714A]", patternFill: "fill-white/10",   badgeClass: "bg-[#C4714A]/10 text-[#C4714A]", icon: "📋" },
  Education: { bgClass: "bg-[#3D8A6A]", patternFill: "fill-white/10",   badgeClass: "bg-[#3D8A6A]/10 text-[#3D8A6A]", icon: "🎓" },
  Analysis:  { bgClass: "bg-[#5567A4]", patternFill: "fill-white/10",   badgeClass: "bg-[#5567A4]/10 text-[#5567A4]", icon: "📊" },
  Tutorial:  { bgClass: "bg-[#7C5C8C]", patternFill: "fill-white/10",   badgeClass: "bg-[#7C5C8C]/10 text-[#7C5C8C]", icon: "⚙️" },
  Company:   { bgClass: "bg-[#2E7D52]", patternFill: "fill-white/10",   badgeClass: "bg-[#2E7D52]/10 text-[#2E7D52]", icon: "🌲" },
};

const FALLBACK_COVER = {
  bgClass: "bg-[#4A6B5C]",
  patternFill: "fill-white/10",
  badgeClass: "bg-[#4A6B5C]/10 text-[#4A6B5C]",
  icon: "📝",
};

function CoverCard({ post, featured = false }: { post: typeof POSTS[number]; featured?: boolean }) {
  const cover = TAG_COVER[post.tag] ?? FALLBACK_COVER;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${featured ? "md:flex-row" : ""}`}
    >
      {/* Colored cover area */}
      <div className={`relative flex items-center justify-center flex-shrink-0 overflow-hidden ${cover.bgClass} ${featured ? "md:w-[340px] h-[200px] md:h-auto" : "h-[160px]"}`}>
        {/* Dot-grid pattern */}
        <svg
          viewBox="0 0 120 80"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {[...Array(8)].map((_, r) =>
            [...Array(12)].map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 11 + 2}
                y={r * 11 + 2}
                width={8}
                height={8}
                rx={1.5}
                className={cover.patternFill}
              />
            ))
          )}
        </svg>
        {/* Icon badge */}
        <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20">
          <span className="text-2xl" role="img" aria-label={post.tag}>{cover.icon}</span>
        </div>
      </div>

      {/* Content area */}
      <div className={`flex flex-col p-5 ${featured ? "flex-1 justify-center" : ""}`}>
        <p className="text-[11px] text-[#888] mb-2 font-medium">{post.date}</p>
        <p
          className={`font-semibold text-[#1a1a1a] leading-snug tracking-tight mb-2.5 group-hover:underline underline-offset-2 decoration-[#1a1a1a]/30 ${
            featured ? "text-[18px]" : "text-[14px]"
          }`}
        >
          {post.title}
        </p>
        {featured && (
          <p className="text-[13px] text-[#555] leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 mt-auto pt-3">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cover.badgeClass}`}>
            {post.tag}
          </span>
          <span className="text-[11px] text-[#aaa]">{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <Navbar />

      {/* Page header */}
      <div className="pt-28 pb-10 px-4 sm:px-6 bg-[#F5F1EC]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#aaa] mb-3">
            Forestock Blog
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[32px] sm:text-[40px] font-bold text-[#1a1a1a] leading-tight tracking-tight">
                Inventory Intelligence
              </div>
              <p className="text-[14px] text-[#666] mt-2 max-w-[480px]">
                Forecasting guides, reorder strategies, and growth insights for Shopify merchants.
              </p>
            </div>
            <Link
              href="/forecast"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Try free forecast →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-black/[0.06]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">

        {/* Featured post */}
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa] mb-4">Featured</p>
        <CoverCard post={featured} featured />

        <div className="border-t border-black/[0.06] my-8" />

        {/* Post grid */}
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa] mb-4">All articles</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rest.map((post) => (
            <CoverCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="border-t border-black/[0.06] my-10" />

        {/* CTA */}
        <div className="rounded-2xl p-8 bg-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#22C55E] mb-2">
              Free to try
            </p>
            <div className="text-[20px] font-bold text-white leading-tight mb-1.5">
              Stop guessing. Start forecasting.
            </div>
            <p className="text-[13px] text-[#888] leading-relaxed max-w-[380px]">
              Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue-at-risk in 30 seconds.
            </p>
          </div>
          <Link
            href="/forecast"
            className="flex-shrink-0 inline-flex items-center gap-2 text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] font-semibold text-[13px] px-6 py-3 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-[#22C55E]/20"
          >
            Run a free forecast →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/[0.07] py-6 text-center bg-[#F5F1EC]">
        <p className="text-[11px] text-[#aaa]">
          &copy; {new Date().getFullYear()} Forestock ·{" "}
          <Link href="/privacy" className="hover:text-[#1a1a1a] transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-[#1a1a1a] transition-colors">Terms</Link>{" "}·{" "}
          <a href="mailto:support@getforestock.com" className="hover:text-[#1a1a1a] transition-colors">Contact</a>
        </p>
      </footer>
    </div>
  );
}
