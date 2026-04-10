import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BookOpen, GraduationCap, BarChart2, Settings2, TreePine, FileText } from "lucide-react";
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

const TAG_COVER: Record<string, { bgClass: string; icon: ReactNode; badgeClass: string }> = {
  Guide:     { bgClass: "bg-[#C4714A]", badgeClass: "bg-[#C4714A]/10 text-[#C4714A]", icon: <BookOpen    className="w-6 h-6 text-white" strokeWidth={1.75} /> },
  Education: { bgClass: "bg-[#3D8A6A]", badgeClass: "bg-[#3D8A6A]/10 text-[#3D8A6A]", icon: <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.75} /> },
  Analysis:  { bgClass: "bg-[#5567A4]", badgeClass: "bg-[#5567A4]/10 text-[#5567A4]", icon: <BarChart2    className="w-6 h-6 text-white" strokeWidth={1.75} /> },
  Tutorial:  { bgClass: "bg-[#7C5C8C]", badgeClass: "bg-[#7C5C8C]/10 text-[#7C5C8C]", icon: <Settings2    className="w-6 h-6 text-white" strokeWidth={1.75} /> },
  Company:   { bgClass: "bg-[#2E7D52]", badgeClass: "bg-[#2E7D52]/10 text-[#2E7D52]", icon: <TreePine     className="w-6 h-6 text-white" strokeWidth={1.75} /> },
};
const FALLBACK_COVER = { bgClass: "bg-[#4A6B5C]", badgeClass: "bg-[#4A6B5C]/10 text-[#4A6B5C]", icon: <FileText className="w-6 h-6 text-white" strokeWidth={1.75} /> };

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return (
        <div key={i} className="text-[18px] font-bold text-[#1a1a1a] mt-10 mb-3 tracking-tight leading-snug">
          {s.text}
        </div>
      );
    case "subheading":
      return (
        <div key={i} className="text-[15px] font-semibold text-[#2a2a2a] mt-6 mb-2 tracking-tight">
          {s.text}
        </div>
      );
    case "paragraph":
      return (
        <p key={i} className="text-[15px] text-[#444] leading-[1.75]">
          {s.text}
        </p>
      );
    case "list":
      return (
        <ul key={i} className="space-y-2.5">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-[15px] text-[#444] leading-relaxed">
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
            <li key={j} className="flex items-start gap-4 text-[15px] text-[#444] leading-relaxed">
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
        <div key={i} className="bg-[#F0EDE8] border border-[#1a1a1a]/[0.08] rounded-xl px-5 py-4 font-mono text-[13px] text-[#2a2a2a] text-center tracking-tight">
          {s.text}
        </div>
      );
    case "callout": {
      const cfg = {
        tip:     { border: "border-[#22C55E]/30",  bg: "bg-[#22C55E]/[0.06]",  dot: "bg-[#22C55E]",   label: "Tip",     labelColor: "text-[#166534]" },
        warning: { border: "border-orange-400/30", bg: "bg-orange-50",          dot: "bg-orange-400",  label: "Warning", labelColor: "text-orange-700" },
        info:    { border: "border-blue-400/30",   bg: "bg-blue-50",            dot: "bg-blue-400",    label: "Note",    labelColor: "text-blue-700"  },
      };
      const c = cfg[s.variant ?? "info"];
      return (
        <div key={i} className={`border rounded-xl px-5 py-4 ${c.border} ${c.bg}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
            <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor}`}>{c.label}</p>
          </div>
          <p className="text-[14px] text-[#333] leading-relaxed">{s.text}</p>
        </div>
      );
    }
    case "table":
      return (
        <div key={i} className="overflow-x-auto rounded-xl border border-black/[0.07]">
          <table className="w-full text-sm">
            <thead className="bg-[#F0EDE8]">
              <tr>
                {s.headers?.map((h) => (
                  <th key={h} className="text-left text-[#555] font-semibold py-2.5 px-4 text-[12px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] bg-white">
              {s.rows?.map((row, j) => (
                <tr key={j} className="hover:bg-[#FAF8F5] transition-colors">
                  {row.map((cell, k) => (
                    <td key={k} className={`px-4 py-3 text-[14px] text-[#444] ${k === 0 ? "font-medium text-[#1a1a1a]" : ""}`}>
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
    <div className="min-h-screen bg-[#F5F1EC]">
      <Navbar />

      {/* Hero header — colored banner */}
      <div className={`pt-28 pb-12 px-4 sm:px-6 ${cover.bgClass}`}>
        <div className="max-w-[800px] mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12px] text-white/70 hover:text-white transition-colors mb-6">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All articles
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
              {cover.icon}
            </div>
            <span className="text-[12px] font-bold text-white/80 uppercase tracking-wider">{post.tag}</span>
          </div>
          <div className="text-[26px] sm:text-[32px] font-bold text-white leading-tight tracking-tight mb-4 max-w-[680px]">
            {post.title}
          </div>
          <div className="flex items-center gap-3 text-[12px] text-white/60">
            <span>Forestock Team</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* Article */}
          <article className="bg-white rounded-2xl shadow-sm p-8 sm:p-10">
            {/* Lead */}
            <p className="text-[16px] text-[#555] leading-[1.75] mb-8 pb-8 border-b border-black/[0.06] font-medium">
              {post.excerpt}
            </p>

            {/* Body sections */}
            <div className="space-y-5">
              {post.content.map((section, i) => renderSection(section, i))}
            </div>

            {/* Article CTA */}
            <div className="mt-12 rounded-2xl p-6 bg-[#1a1a1a] flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1">
                <p className="text-[11px] font-bold text-[#22C55E] uppercase tracking-widest mb-1.5">Try it free</p>
                <div className="text-[17px] font-bold text-white mb-1 tracking-tight">Ready to stop guessing?</div>
                <p className="text-[13px] text-[#888] leading-relaxed">Upload your CSV and see which products are at risk in 30 seconds.</p>
              </div>
              <Link
                href="/forecast"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-[#060C0D] font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#22C55E]/20 whitespace-nowrap"
              >
                Run free forecast →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">

            {/* More articles */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa] mb-4">More articles</p>
              <div className="space-y-4">
                {related.map((p) => {
                  const rc = TAG_COVER[p.tag] ?? FALLBACK_COVER;
                  return (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${rc.bgClass}`}>
                        {rc.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#1a1a1a] group-hover:underline underline-offset-2 leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-[#aaa] mt-1">{p.readTime}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa] mb-3">Quick links</p>
              <div className="space-y-1">
                {[
                  { label: "Run a forecast", href: "/forecast" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Contact us", href: "mailto:support@getforestock.com" },
                ].map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="flex items-center justify-between py-2 text-[13px] text-[#555] hover:text-[#1a1a1a] transition-colors border-b border-black/[0.04] last:border-0"
                  >
                    <span>{l.label}</span>
                    <svg className="w-3.5 h-3.5 text-[#aaa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="rounded-2xl p-5 bg-[#22C55E]/[0.08] border border-[#22C55E]/20">
              <p className="text-[12px] font-bold text-[#166534] mb-1">Free forecast</p>
              <p className="text-[13px] text-[#333] mb-3 leading-relaxed">
                See which SKUs will stock out and when — in 30 seconds.
              </p>
              <Link
                href="/forecast"
                className="block text-center text-[13px] font-semibold text-[#060C0D] bg-[#22C55E] hover:bg-[#16A34A] px-4 py-2 rounded-lg transition-all"
              >
                Try it free →
              </Link>
            </div>
          </aside>
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
