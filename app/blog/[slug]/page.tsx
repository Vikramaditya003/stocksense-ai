import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
    title: `${post.title} — StockSense AI Blog`,
    description: post.excerpt,
  };
}

// ── Section renderers ─────────────────────────────────────────────────────────

function renderSection(s: Section, i: number) {
  switch (s.type) {
    case "heading":
      return (
        <h2 key={i} className="text-lg font-bold text-white mt-10 mb-3">
          {s.text}
        </h2>
      );

    case "subheading":
      return (
        <h3 key={i} className="text-base font-semibold text-slate-200 mt-6 mb-2">
          {s.text}
        </h3>
      );

    case "paragraph":
      return (
        <p key={i} className="text-slate-400 leading-relaxed">
          {s.text}
        </p>
      );

    case "list":
      return (
        <ul key={i} className="space-y-2">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-slate-400">
              <span className="text-[#2DD4BF] mt-0.5 flex-shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol key={i} className="space-y-3">
          {s.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {j + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case "formula":
      return (
        <div key={i} className="bg-[#2DD4BF]/[0.04] border border-[#2DD4BF]/20 rounded-xl px-5 py-4 font-mono text-sm text-[#2DD4BF] text-center tracking-tight">
          {s.text}
        </div>
      );

    case "callout": {
      const cfg = {
        tip:     { border: "border-[#2DD4BF]/20",   bg: "bg-[#2DD4BF]/[0.04]",   icon: "💡", label: "Tip",     labelColor: "text-[#2DD4BF]" },
        warning: { border: "border-orange-500/20",   bg: "bg-orange-500/[0.04]",  icon: "⚠",  label: "Warning", labelColor: "text-orange-400" },
        info:    { border: "border-blue-500/20",     bg: "bg-blue-500/[0.04]",    icon: "ℹ",  label: "Note",    labelColor: "text-blue-400"  },
      };
      const c = cfg[s.variant ?? "info"];
      return (
        <div key={i} className={`border rounded-xl px-5 py-4 ${c.border} ${c.bg}`}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${c.labelColor}`}>{c.icon} {c.label}</p>
          <p className="text-sm text-slate-300 leading-relaxed">{s.text}</p>
        </div>
      );
    }

    case "table":
      return (
        <div key={i} className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-y-1">
            <thead>
              <tr>
                {s.headers?.map((h) => (
                  <th key={h} className="text-left text-[#475569] uppercase tracking-wider font-semibold pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows?.map((row, j) => (
                <tr key={j} className="bg-white/[0.02]">
                  {row.map((cell, k) => (
                    <td key={k} className={`px-3 py-2.5 text-slate-400 ${k === 0 ? "font-medium text-slate-300 rounded-l-lg" : ""} ${k === row.length - 1 ? "rounded-r-lg" : ""}`}>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#060C0D] text-slate-300">
      {/* Nav */}
      <nav className="border-b border-[#2DD4BF]/10 px-6 h-16 flex items-center justify-between max-w-[960px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#060C0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V14M9 20V8M14 20V11M19 20V4" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white">StockSense<span className="text-[#2DD4BF]">AI</span></span>
        </Link>
        <Link href="/blog" className="text-xs text-slate-500 hover:text-white transition-colors">← All articles</Link>
      </nav>

      {/* Article */}
      <article className="max-w-[680px] mx-auto px-6 py-14">
        {/* Tag + meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${post.tagColor}`}>
            {post.tag}
          </span>
          <span className="text-xs text-[#475569]">{post.date}</span>
          <span className="text-xs text-[#475569]">·</span>
          <span className="text-xs text-[#475569]">{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-5">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        <p className="text-base text-slate-400 leading-relaxed mb-10 pb-10 border-b border-white/[0.06]">
          {post.excerpt}
        </p>

        {/* Body */}
        <div className="space-y-6 text-sm">
          {post.content.map((section, i) => renderSection(section, i))}
        </div>

        {/* CTA */}
        <div className="mt-14 border border-[#2DD4BF]/15 rounded-2xl p-8 text-center bg-[#2DD4BF]/[0.02]">
          <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">Try it free</p>
          <h2 className="text-lg font-bold text-white mb-2">Ready to stop guessing?</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-[360px] mx-auto">
            Upload your Shopify CSV and see which products are at risk — in 30 seconds.
          </p>
          <Link
            href="/forecast"
            className="inline-flex items-center gap-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#060C0D] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#2DD4BF]/20"
          >
            Run a free forecast
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-[960px] mx-auto px-6 pb-16">
          <div className="border-t border-white/[0.06] pt-12">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-widest mb-6">More articles</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#2DD4BF]/20 rounded-xl p-5 transition-all"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.tagColor} mb-3 inline-block`}>
                    {p.tag}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#2DD4BF] transition-colors leading-snug mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-[#475569]">{p.date} · {p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 text-center">
        <p className="text-xs text-[#475569]">
          &copy; {new Date().getFullYear()} StockSense AI ·{" "}
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>{" "}·{" "}
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>{" "}·{" "}
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </p>
      </footer>
    </div>
  );
}
