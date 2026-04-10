import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BookOpen, GraduationCap, BarChart2, Settings2, TreePine, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPost, POSTS, type Section } from "@/lib/blog-posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Forestock Blog`,
    description: post.excerpt,
  };
}

// All class strings are static literals so Tailwind includes them at build time
const TAG_COVER: Record<string, {
  panelClass:    string;
  iconWrapClass: string;
  iconClass:     string;
  stripClass:    string;
  pillClass:     string;
  icon: ReactNode;
}> = {
  Guide: {
    panelClass:    "bg-[rgba(196,113,74,0.08)]",
    iconWrapClass: "bg-[rgba(196,113,74,0.2)] border border-[rgba(196,113,74,0.3)]",
    iconClass:     "text-[#C4714A]",
    stripClass:    "bg-[#C4714A]",
    pillClass:     "text-[#C4714A] bg-[rgba(196,113,74,0.12)]",
    icon: <BookOpen      className="w-5 h-5" strokeWidth={1.75} />,
  },
  Education: {
    panelClass:    "bg-[rgba(61,138,106,0.08)]",
    iconWrapClass: "bg-[rgba(61,138,106,0.2)] border border-[rgba(61,138,106,0.3)]",
    iconClass:     "text-[#3D8A6A]",
    stripClass:    "bg-[#3D8A6A]",
    pillClass:     "text-[#3D8A6A] bg-[rgba(61,138,106,0.12)]",
    icon: <GraduationCap  className="w-5 h-5" strokeWidth={1.75} />,
  },
  Analysis: {
    panelClass:    "bg-[rgba(85,103,164,0.08)]",
    iconWrapClass: "bg-[rgba(85,103,164,0.2)] border border-[rgba(85,103,164,0.3)]",
    iconClass:     "text-[#5567A4]",
    stripClass:    "bg-[#5567A4]",
    pillClass:     "text-[#5567A4] bg-[rgba(85,103,164,0.12)]",
    icon: <BarChart2      className="w-5 h-5" strokeWidth={1.75} />,
  },
  Tutorial: {
    panelClass:    "bg-[rgba(124,92,140,0.08)]",
    iconWrapClass: "bg-[rgba(124,92,140,0.2)] border border-[rgba(124,92,140,0.3)]",
    iconClass:     "text-[#7C5C8C]",
    stripClass:    "bg-[#7C5C8C]",
    pillClass:     "text-[#7C5C8C] bg-[rgba(124,92,140,0.12)]",
    icon: <Settings2      className="w-5 h-5" strokeWidth={1.75} />,
  },
  Company: {
    panelClass:    "bg-[rgba(34,197,94,0.06)]",
    iconWrapClass: "bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.25)]",
    iconClass:     "text-[#22C55E]",
    stripClass:    "bg-[#22C55E]",
    pillClass:     "text-[#22C55E] bg-[rgba(34,197,94,0.12)]",
    icon: <TreePine       className="w-5 h-5" strokeWidth={1.75} />,
  },
};

const FALLBACK_COVER = {
  panelClass:    "bg-white/[0.03]",
  iconWrapClass: "bg-white/[0.1] border border-white/[0.15]",
  iconClass:     "text-slate-400",
  stripClass:    "bg-slate-600",
  pillClass:     "text-slate-400 bg-white/[0.06]",
  icon: <FileText className="w-5 h-5" strokeWidth={1.75} />,
};

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return (
        <div key={i} className="text-[18px] font-bold text-white mt-10 mb-3 tracking-tight leading-snug">
          {s.text}
        </div>
      );
    case "subheading":
      return (
        <div key={i} className="text-[15px] font-semibold text-slate-200 mt-6 mb-2 tracking-tight">
          {s.text}
        </div>
      );
    case "paragraph":
      return (
        <p key={i} className="text-[15px] text-slate-400 leading-[1.75]">
          {s.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="space-y-2.5">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[15px] text-slate-400 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0 mt-2.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol key={i} className="space-y-4">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-4 text-[15px] text-slate-400 leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-[#22C55E] text-[#060C0D] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {j + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "formula":
      return (
        <div key={i} className="bg-[#0A1415] border border-white/[0.08] rounded-xl px-5 py-4 font-mono text-[13px] text-slate-300 text-center tracking-tight">
          {s.text}
        </div>
      );
    case "callout": {
      const cfg = {
        tip:     { border: "border-[#22C55E]/25",  bg: "bg-[rgba(34,197,94,0.06)]",  dot: "bg-[#22C55E]",   label: "Tip",     labelColor: "text-[#22C55E]",   textColor: "text-slate-300" },
        warning: { border: "border-orange-500/25", bg: "bg-[rgba(249,115,22,0.06)]", dot: "bg-orange-400",  label: "Warning", labelColor: "text-orange-400",  textColor: "text-slate-300" },
        info:    { border: "border-blue-500/25",   bg: "bg-[rgba(59,130,246,0.06)]", dot: "bg-blue-400",    label: "Note",    labelColor: "text-blue-400",    textColor: "text-slate-300" },
      };
      const c = cfg[s.variant ?? "info"];
      return (
        <div key={i} className={`border rounded-xl px-5 py-4 ${c.border} ${c.bg}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
            <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor}`}>{c.label}</p>
          </div>
          <p className={`text-[14px] leading-relaxed ${c.textColor}`}>{s.text}</p>
        </div>
      );
    }
    case "table":
      return (
        <div key={i} className="overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04]">
              <tr>
                {s.headers?.map((h) => (
                  <th key={h} className="text-left text-slate-500 font-semibold py-2.5 px-4 text-[12px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-[#0A1415]">
              {s.rows?.map((row, j) => (
                <tr key={j} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, k) => (
                    <td key={k} className={`px-4 py-3 text-[14px] text-slate-400 ${k === 0 ? "font-medium text-slate-200" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const cover = TAG_COVER[post.tag] ?? FALLBACK_COVER;

  return (
    <div className="min-h-screen bg-[#060C0D]">
      <Navbar />

      {/* Hero header */}
      <div className={`relative pt-28 pb-12 px-4 sm:px-6 overflow-hidden ${cover.panelClass}`}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        {/* Accent strip at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${cover.stripClass} opacity-40`} />

        <div className="relative z-10 max-w-[800px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            All articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cover.iconWrapClass}`}>
              <span className={cover.iconClass}>{cover.icon}</span>
            </div>
            <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${cover.pillClass}`}>
              {post.tag}
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[34px] font-bold text-white leading-tight tracking-[-0.02em] mb-4 max-w-[680px]">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-[12px] text-slate-600">
            <span>Forestock Team</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

          {/* Article */}
          <article className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-7 sm:p-10">
            {/* Lead */}
            <p className="text-[16px] text-slate-400 leading-[1.75] mb-8 pb-8 border-b border-white/[0.06] font-medium">
              {post.excerpt}
            </p>

            {/* Body sections */}
            <div className="space-y-5">
              {post.content.map((section, i) => renderSection(section, i))}
            </div>

            {/* Article CTA */}
            <div className="mt-12 rounded-2xl p-6 bg-[#060C0D] border border-[#22C55E]/15 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1">
                <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-1.5">Try it free</p>
                <div className="text-[17px] font-bold text-white mb-1 tracking-tight">Ready to stop guessing?</div>
                <p className="text-[13px] text-slate-500 leading-relaxed">Upload your CSV and see which products are at risk in 30 seconds.</p>
              </div>
              <Link
                href="/forecast"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20 whitespace-nowrap"
              >
                Run free forecast <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">

            {/* More articles */}
            <div className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-4">More articles</p>
              <div className="space-y-4">
                {related.map((p) => {
                  const rc = TAG_COVER[p.tag] ?? FALLBACK_COVER;
                  return (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${rc.iconWrapClass}`}>
                        <span className={rc.iconClass}>{rc.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">{p.readTime}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-[#0A1415] border border-white/[0.07] rounded-2xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 mb-3">Quick links</p>
              <div className="space-y-1">
                {[
                  { label: "Run a forecast", href: "/forecast" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Contact us", href: "mailto:support@getforestock.com" },
                ].map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="flex items-center justify-between py-2 text-[13px] text-slate-500 hover:text-slate-200 transition-colors border-b border-white/[0.04] last:border-0"
                  >
                    <span>{l.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="rounded-2xl p-5 bg-[#0A1415] border border-[#22C55E]/15">
              <p className="text-[12px] font-bold text-[#22C55E] mb-1">Free forecast</p>
              <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">
                See which SKUs will stock out and when — in 30 seconds.
              </p>
              <Link
                href="/forecast"
                className="block text-center text-[13px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-4 py-2 rounded-lg transition-all shadow-md shadow-[#22C55E]/15"
              >
                Try it free
              </Link>
            </div>
          </aside>
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
