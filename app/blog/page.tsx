import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, GraduationCap, BarChart2, Settings2, TreePine, FileText, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { POSTS, type BlogPost } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getforestock.com";

export const metadata: Metadata = {
  title: "Inventory Forecasting Blog — Guides & Strategy for Shopify Merchants",
  description:
    "Practical guides on inventory forecasting, stockout prevention, reorder point calculations, and demand planning for Shopify merchants. Written by the Forestock team.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Inventory Forecasting Blog — Guides & Strategy for Shopify Merchants",
    description:
      "Practical guides on inventory forecasting, stockout prevention, and demand planning for Shopify merchants.",
    url: `${SITE_URL}/blog`,
  },
};

const TAG_META: Record<string, {
  pillClass:     string;
  iconWrapClass: string;
  iconClass:     string;
  borderClass:   string;
  icon: React.ReactNode;
}> = {
  Guide: {
    pillClass:     "text-[#C4714A] bg-[rgba(196,113,74,0.12)] border border-[rgba(196,113,74,0.2)]",
    iconWrapClass: "bg-[rgba(196,113,74,0.15)] border border-[rgba(196,113,74,0.25)]",
    iconClass:     "text-[#C4714A]",
    borderClass:   "border-l-[#C4714A]",
    icon: <BookOpen      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Education: {
    pillClass:     "text-[#3D8A6A] bg-[rgba(61,138,106,0.12)] border border-[rgba(61,138,106,0.2)]",
    iconWrapClass: "bg-[rgba(61,138,106,0.15)] border border-[rgba(61,138,106,0.25)]",
    iconClass:     "text-[#3D8A6A]",
    borderClass:   "border-l-[#3D8A6A]",
    icon: <GraduationCap  className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Analysis: {
    pillClass:     "text-[#5567A4] bg-[rgba(85,103,164,0.12)] border border-[rgba(85,103,164,0.2)]",
    iconWrapClass: "bg-[rgba(85,103,164,0.15)] border border-[rgba(85,103,164,0.25)]",
    iconClass:     "text-[#5567A4]",
    borderClass:   "border-l-[#5567A4]",
    icon: <BarChart2      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Tutorial: {
    pillClass:     "text-[#7C5C8C] bg-[rgba(124,92,140,0.12)] border border-[rgba(124,92,140,0.2)]",
    iconWrapClass: "bg-[rgba(124,92,140,0.15)] border border-[rgba(124,92,140,0.25)]",
    iconClass:     "text-[#7C5C8C]",
    borderClass:   "border-l-[#7C5C8C]",
    icon: <Settings2      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Company: {
    pillClass:     "text-[#22C55E] bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.2)]",
    iconWrapClass: "bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.25)]",
    iconClass:     "text-[#22C55E]",
    borderClass:   "border-l-[#22C55E]",
    icon: <TreePine       className="w-3.5 h-3.5" strokeWidth={2} />,
  },
};

const FALLBACK = {
  pillClass:     "text-slate-400 bg-white/[0.06] border border-white/10",
  iconWrapClass: "bg-white/[0.08] border border-white/10",
  iconClass:     "text-slate-400",
  borderClass:   "border-l-slate-600",
  icon: <FileText className="w-3.5 h-3.5" strokeWidth={2} />,
};

function TagPill({ tag }: { tag: string }) {
  const m = TAG_META[tag] ?? FALLBACK;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${m.pillClass}`}>
      {m.icon}
      {tag}
    </span>
  );
}

// Large editorial "featured" post — full width
function EditorialHero({ post, index }: { post: BlogPost; index: number }) {
  const m = TAG_META[post.tag] ?? FALLBACK;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block border-l-4 ${m.borderClass} pl-6 sm:pl-8 py-2 hover:pl-10 transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <TagPill tag={post.tag} />
        <span className="text-[11px] text-slate-700 tabular-nums flex-shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h2 className="text-[28px] sm:text-[38px] lg:text-[46px] font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4 group-hover:text-[#22C55E] transition-colors duration-150">
        {post.title}
      </h2>
      <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed max-w-[620px] mb-5">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-[11px] text-slate-600">{post.date} · {post.readTime}</span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#22C55E] opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-150">
          Read article <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

// Mid-weight card for posts 2-3
function FeaturedCard({ post, index }: { post: BlogPost; index: number }) {
  const m = TAG_META[post.tag] ?? FALLBACK;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block border border-white/[0.06] bg-[#0A1415] rounded-xl p-5 sm:p-6 hover:border-[#22C55E]/20 hover:bg-[#0D1B1E] transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between mb-4">
        <TagPill tag={post.tag} />
        <span className="text-[22px] font-black text-white/[0.05] leading-none tabular-nums select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-[17px] sm:text-[19px] font-bold text-slate-100 leading-snug tracking-tight mb-2.5 group-hover:text-white transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span className="text-[11px] text-slate-600">{post.date}</span>
        <span className="text-[11px] text-slate-700">{post.readTime}</span>
      </div>
    </Link>
  );
}

// Compact list row for remaining posts
function ListRow({ post, index }: { post: BlogPost; index: number }) {
  const m = TAG_META[post.tag] ?? FALLBACK;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-4 sm:gap-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors px-2 -mx-2 rounded-lg"
    >
      <span className="text-[13px] font-black text-white/[0.08] tabular-nums flex-shrink-0 mt-0.5 w-5 text-right select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <TagPill tag={post.tag} />
          <span className="text-[10px] text-slate-700">{post.readTime}</span>
        </div>
        <p className="text-[14px] font-semibold text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-1">
          {post.title}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-[#22C55E] flex-shrink-0 mt-1 transition-colors" strokeWidth={2} />
    </Link>
  );
}

export default function BlogPage() {
  const [hero, second, third, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#060C0D]">
      <Navbar />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="relative pt-28 pb-10 px-4 sm:px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="absolute inset-0 dot-grid opacity-15" />
        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#22C55E] mb-3">
              Forestock Blog
            </p>
            <h1 className="text-[32px] sm:text-[44px] font-bold text-white tracking-[-0.03em] leading-tight">
              Inventory Intelligence
            </h1>
            <p className="text-[13px] text-slate-500 mt-2 max-w-[380px] leading-relaxed">
              Guides, analysis and deep dives for Shopify merchants who can&apos;t afford stockouts.
            </p>
          </div>
          <Link
            href="/forecast"
            className="flex-shrink-0 self-start sm:self-auto inline-flex items-center gap-2 text-[12px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-4 py-2 rounded-lg transition-all shadow-md shadow-[#22C55E]/20"
          >
            Run a free forecast <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">

          {/* ── Left: Main column ── */}
          <div>
            {/* Editorial hero post */}
            {hero && (
              <div className="mb-12 pb-12 border-b border-white/[0.05]">
                <EditorialHero post={hero} index={0} />
              </div>
            )}

            {/* Two mid-weight cards */}
            {(second || third) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {second && <FeaturedCard post={second} index={1} />}
                {third  && <FeaturedCard post={third}  index={2} />}
              </div>
            )}

            {/* Compact list for the rest */}
            {rest.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">More reads</p>
                <div>
                  {rest.map((post, i) => (
                    <ListRow key={post.slug} post={post} index={i + 3} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">

              {/* All posts index */}
              <div className="bg-[#0A1415] border border-white/[0.06] rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-4">All articles</p>
                <div className="space-y-1">
                  {POSTS.map((post, i) => {
                    const m = TAG_META[post.tag] ?? FALLBACK;
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${m.iconWrapClass}`}>
                          <span className={m.iconClass}>{m.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-slate-400 group-hover:text-white transition-colors leading-snug line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-slate-700 mt-0.5">{post.readTime}</p>
                        </div>
                        <span className="text-[11px] text-white/[0.06] font-black tabular-nums flex-shrink-0 mt-0.5 select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#0A1415] border border-[#22C55E]/15 rounded-xl p-5">
                <p className="text-[11px] font-bold text-[#22C55E] mb-1">Free to try</p>
                <p className="text-[13px] font-semibold text-white leading-snug mb-1">Stop guessing. Start forecasting.</p>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                  Upload your Shopify CSV and get exact stockout dates in 30 seconds.
                </p>
                <Link
                  href="/forecast"
                  className="block w-full text-center text-[12px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] py-2 rounded-lg transition-all shadow-md shadow-[#22C55E]/15"
                >
                  Run a free forecast
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-6 text-center">
        <p className="text-[11px] text-slate-700">
          &copy; {new Date().getFullYear()} Forestock ·{" "}
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>{" "}·{" "}
          <a href="mailto:support@getforestock.com" className="hover:text-slate-400 transition-colors">Contact</a>
        </p>
      </footer>
    </div>
  );
}
