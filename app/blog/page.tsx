import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, GraduationCap, BarChart2, Settings2, TreePine, FileText, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { POSTS, type BlogPost } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Forestock",
  description: "Inventory management tips, demand forecasting guides, and Shopify growth strategies from the Forestock team.",
};

// All class strings are static literals so Tailwind includes them at build time
const TAG_META: Record<string, {
  pillClass:     string;
  panelClass:    string;
  iconWrapClass: string;
  iconClass:     string;
  stripClass:    string;
  icon: React.ReactNode;
}> = {
  Guide: {
    pillClass:     "text-[#C4714A] bg-[rgba(196,113,74,0.12)]",
    panelClass:    "bg-[rgba(196,113,74,0.06)]",
    iconWrapClass: "bg-[rgba(196,113,74,0.15)] border border-[rgba(196,113,74,0.25)]",
    iconClass:     "text-[#C4714A]",
    stripClass:    "bg-[#C4714A]",
    icon: <BookOpen      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Education: {
    pillClass:     "text-[#3D8A6A] bg-[rgba(61,138,106,0.12)]",
    panelClass:    "bg-[rgba(61,138,106,0.06)]",
    iconWrapClass: "bg-[rgba(61,138,106,0.15)] border border-[rgba(61,138,106,0.25)]",
    iconClass:     "text-[#3D8A6A]",
    stripClass:    "bg-[#3D8A6A]",
    icon: <GraduationCap  className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Analysis: {
    pillClass:     "text-[#5567A4] bg-[rgba(85,103,164,0.12)]",
    panelClass:    "bg-[rgba(85,103,164,0.06)]",
    iconWrapClass: "bg-[rgba(85,103,164,0.15)] border border-[rgba(85,103,164,0.25)]",
    iconClass:     "text-[#5567A4]",
    stripClass:    "bg-[#5567A4]",
    icon: <BarChart2      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Tutorial: {
    pillClass:     "text-[#7C5C8C] bg-[rgba(124,92,140,0.12)]",
    panelClass:    "bg-[rgba(124,92,140,0.06)]",
    iconWrapClass: "bg-[rgba(124,92,140,0.15)] border border-[rgba(124,92,140,0.25)]",
    iconClass:     "text-[#7C5C8C]",
    stripClass:    "bg-[#7C5C8C]",
    icon: <Settings2      className="w-3.5 h-3.5" strokeWidth={2} />,
  },
  Company: {
    pillClass:     "text-[#22C55E] bg-[rgba(34,197,94,0.12)]",
    panelClass:    "bg-[rgba(34,197,94,0.06)]",
    iconWrapClass: "bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.25)]",
    iconClass:     "text-[#22C55E]",
    stripClass:    "bg-[#22C55E]",
    icon: <TreePine       className="w-3.5 h-3.5" strokeWidth={2} />,
  },
};

const FALLBACK_TAG = {
  pillClass:     "text-slate-400 bg-white/[0.06]",
  panelClass:    "bg-white/[0.03]",
  iconWrapClass: "bg-white/[0.08] border border-white/10",
  iconClass:     "text-slate-400",
  stripClass:    "bg-slate-600",
  icon: <FileText className="w-3.5 h-3.5" strokeWidth={2} />,
};

function TagPill({ tag }: { tag: string }) {
  const m = TAG_META[tag] ?? FALLBACK_TAG;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${m.pillClass}`}>
      {m.icon}
      {tag}
    </span>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const m = TAG_META[post.tag] ?? FALLBACK_TAG;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col sm:flex-row rounded-2xl bg-[#0A1415] border border-white/[0.07] overflow-hidden hover:border-[#22C55E]/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-200"
    >
      {/* Accent panel */}
      <div className={`flex-shrink-0 sm:w-[220px] h-[140px] sm:h-auto relative flex items-center justify-center ${m.panelClass}`}>
        <div className="absolute inset-0 dot-grid opacity-25" />
        <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center ${m.iconWrapClass}`}>
          <span className={`[&>svg]:w-7 [&>svg]:h-7 [&>svg]:stroke-[1.5] ${m.iconClass}`}>
            {m.icon}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <TagPill tag={post.tag} />
            <span className="text-[11px] text-slate-600">{post.date}</span>
          </div>
          <h2 className="text-[20px] font-bold text-white tracking-tight leading-snug mb-2.5 group-hover:text-[#22C55E] transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between mt-5">
          <span className="text-[11px] text-slate-600">{post.readTime}</span>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity">
            Read article <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const m = TAG_META[post.tag] ?? FALLBACK_TAG;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl bg-[#0A1415] border border-white/[0.07] overflow-hidden hover:border-[#22C55E]/20 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Top accent strip */}
      <div className={`h-[3px] w-full ${m.stripClass}`} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <TagPill tag={post.tag} />
          <span className="text-[11px] text-slate-600">{post.readTime}</span>
        </div>
        <h3 className="text-[15px] font-semibold text-slate-200 tracking-tight leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <p className="text-[11px] text-slate-700 mt-4">{post.date}</p>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="min-h-screen bg-[#060C0D]">
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22C55E]/[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#22C55E] mb-4">
            Forestock Blog
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h1 className="text-[36px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight">
                Inventory Intelligence
              </h1>
              <p className="text-[14px] text-slate-500 mt-2 max-w-[420px] leading-relaxed">
                Forecasting guides, reorder strategies, and growth insights for Shopify merchants.
              </p>
            </div>
            <Link
              href="/forecast"
              className="flex-shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20"
            >
              Try free forecast <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05]" />

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Featured */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-4">Featured</p>
          <FeaturedCard post={featured} />
        </div>

        <div className="border-t border-white/[0.05]" />

        {/* All posts */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-5">All articles</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05]" />

        {/* CTA */}
        <div className="rounded-2xl bg-[#0A1415] border border-[#22C55E]/15 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#22C55E] mb-2">Free to try</p>
            <p className="text-[20px] font-bold text-white leading-tight mb-1.5">Stop guessing. Start forecasting.</p>
            <p className="text-[13px] text-slate-500 max-w-[360px] leading-relaxed">
              Upload your Shopify CSV and get exact stockout dates, reorder quantities, and revenue at risk in 30 seconds.
            </p>
          </div>
          <Link
            href="/forecast"
            className="flex-shrink-0 inline-flex items-center gap-2 text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] font-semibold text-[14px] px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20 whitespace-nowrap"
          >
            Run a free forecast <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Footer */}
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
