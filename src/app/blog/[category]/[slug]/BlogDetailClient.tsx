"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/layout/PageShell";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "@/components/ui/Link";
import { trackBlogView, type Blog } from "@/lib/blog-api";
import { getCalculator } from "@/data/calculators";
import { getActiveToc } from "@/utils/blog-parser";
import dynamic from "next/dynamic";

const FaqAccordion = dynamic(
  () => import("@/components/FaqAccordion").then((m) => m.FaqAccordion),
  {
    loading: () => <div className="h-20 animate-pulse bg-slate-800/10 rounded-lg"></div>,
    ssr: false,
  }
);

interface BlogDetailClientProps {
  blog: Blog;
  relatedBlogs: Blog[];
  renderedContent: string;
}

export default function BlogDetailClient({
  blog,
  relatedBlogs,
  renderedContent,
}: BlogDetailClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Dynamic reading scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Views tracking call
  useEffect(() => {
    trackBlogView(blog._id);
  }, [blog._id]);

  // 3. Social Share actions
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "copy") => {
    const url = window.location.href;
    const title = blog.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Article link copied to clipboard!");
      return;
    }

    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const activeToc = useMemo(() => {
    return getActiveToc(blog.content, blog.toc);
  }, [blog.content, blog.toc]);

  const sidebarCalculators = useMemo(() => {
    const catSlugs: Record<string, string> = {
      finance: "finance",
      mortgage: "finance",
      loans: "finance",
      taxes: "finance",
      investment: "finance",
      health: "health",
      bmi: "health",
      fitness: "health",
      everyday: "everyday",
      business: "finance",
    };
    const targetCat = catSlugs[blog.category.toLowerCase()] || "finance";
    // Reuse registry data
    const calculatorsMeta = require("@/data/calculators").calculators;
    return calculatorsMeta.filter((c: any) => c.category === targetCat).slice(0, 4);
  }, [blog.category]);

  return (
    <PageShell>
      <Toaster />
      {/* Sticky top reading progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-secondary z-[60] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="page-container mt-8 sm:mt-12">
        {/* Breadcrumb List and Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </Link>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground font-medium select-none">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={10} />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight size={10} />
            <Link to={`/blog?category=${blog.category}`} className="hover:text-foreground transition-colors">
              {blog.category}
            </Link>
            <ChevronRight size={10} />
            <span className="text-foreground truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body */}
          <main className="lg:col-span-8 min-w-0 bg-card/15 border border-border/40 rounded-2xl p-5 sm:p-7 md:p-9 shadow-card">
            <span className="inline-block rounded-full bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-400">
              {blog.category}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-4 leading-tight text-foreground tracking-tight">
              {blog.title}
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-muted-foreground font-normal leading-relaxed italic border-l-2 border-indigo-500 pl-3">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-y border-border/40 py-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  By {blog.author}
                </span>
                <span className="h-3 w-px bg-border/60" />
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : "-"}
                </span>
                <span className="h-3 w-px bg-border/60" />
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {blog.readingTime} min read
                </span>
              </div>

              {/* Share Drawer */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare("copy")}
                  type="button"
                  className="p-1.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Copy Link to Clipboard"
                >
                  <LinkIcon size={14} />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  type="button"
                  className="p-1.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  title="Share on Twitter"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            {/* Optimized High-Quality Responsive Image */}
            {blog.thumbnail && (
              <div className="rounded-xl overflow-hidden mt-6 h-60 sm:h-90 border border-border/40 bg-black relative">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                  srcSet={`${blog.thumbnail} 1200w, ${blog.thumbnail}?w=800 800w, ${blog.thumbnail}?w=400 400w`}
                  sizes="(max-width: 768px) 100vw, 800px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
            )}

            {/* Structured Post Content */}
            <div
              className="mt-8 prose prose-invert max-w-none select-text font-normal leading-[1.8] text-sm sm:text-base prose-table:block prose-table:overflow-x-auto prose-table:border prose-table:border-border prose-img:max-w-full prose-img:h-auto animate-[fadeIn_0.5s_ease-out]"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Author Biography Bio card */}
            <div className="mt-12 rounded-xl border border-border/50 bg-card/35 p-5 flex items-start gap-4 shadow-soft">
              <div className="h-10 w-10 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                CZ
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground">{blog.author}</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  CalcZen content team provides premium, mathematical, and simulation models tutorials that simplify complex computations for everyday finance, taxes, fitness, and calculations.
                </p>
              </div>
            </div>

            {/* FAQs Accordion rendering */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="mt-12 border-t border-border/40 pt-10">
                <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Frequently Asked Questions
                  </h2>
                  <FaqAccordion faqs={blog.faqs.map((f) => ({ q: f.question, a: f.answer }))} />
                </div>
              </div>
            )}
          </main>

          {/* Desktop Sticky Side Widget Drawer */}
          <aside className="lg:col-span-4 space-y-6 shrink-0 min-w-0 lg:sticky lg:top-20">
            {/* Table of Contents sidebar */}
            {activeToc.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/25 p-5 min-w-0">
                <h2 className="font-bold text-sm tracking-tight text-foreground mb-3 border-b border-border/40 pb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-400" />
                  Table of Contents
                </h2>
                <nav className="space-y-2.5">
                  {activeToc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                          window.history.pushState(null, "", `#${item.id}`);
                        }
                      }}
                      className={`block text-xs font-semibold text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all truncate leading-relaxed ${
                        item.level === 3 ? "pl-3 text-[11px] font-medium" : ""
                      }`}
                    >
                      {item.level === 3 ? "└ " : "• "}{item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Tools sidebar recommendation card */}
            {sidebarCalculators.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/25 p-5 min-w-0">
                <h2 className="font-bold text-sm tracking-tight text-foreground mb-3 border-b border-border/40 pb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent" />
                  Related Calculators
                </h2>
                <div className="space-y-3">
                  {sidebarCalculators.map((c) => {
                    const CalcIcon = c.icon;
                    return (
                      <Link
                        key={c.slug}
                        to={`/calculator/${c.slug}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/45 hover:bg-white/5 hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0">
                            <CalcIcon size={14} />
                          </div>
                          <span className="font-semibold text-xs text-foreground group-hover:text-accent transition-colors truncate">
                            {c.name}
                          </span>
                        </div>
                        <ArrowRight
                          size={12}
                          className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Footer Related Articles Grid */}
        {relatedBlogs.length > 0 && (
          <footer className="mt-16 border-t border-border/40 pt-10 pb-6 min-w-0">
            <h2 className="font-bold text-xl sm:text-2xl tracking-tight text-foreground mb-6">
              Similar Reading You Might Enjoy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              {relatedBlogs.map((r) => (
                <div
                  key={r._id}
                  className="group border border-border/80 bg-card/25 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-accent/40 shadow-soft transition-all duration-300"
                >
                  <Link
                    to={`/blog/${r.category.toLowerCase()}/${r.slug}`}
                    className="flex flex-col h-full"
                  >
                    <div className="h-40 bg-black overflow-hidden relative">
                      <img
                        src={r.thumbnail || ""}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                    <div className="p-4 sm:p-5 min-w-0">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                        {r.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-foreground mt-1 group-hover:text-accent transition-colors truncate">
                        {r.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {r.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/40 pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {r.publishDate ? new Date(r.publishDate).toLocaleDateString() : "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {r.readingTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </footer>
        )}
      </article>
    </PageShell>
  );
}
