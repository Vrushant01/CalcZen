import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  Eye,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/layout/PageShell";
import { FaqAccordion } from "@/components/FaqAccordion";
import { calculators, getCalculator } from "@/data/calculators";
import { fetchBlogBySlug, fetchPublishedBlogs, trackBlogView, type Blog } from "@/lib/blog-api";

// 1. TanStack Router file-route mapping
export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await fetchBlogBySlug(params.slug);
    if (!res.ok || !res.data) {
      throw notFound();
    }
    return { blog: res.data };
  },
  head: ({ loaderData }) => {
    const blog = loaderData?.blog;
    if (!blog) return {};
    const title = blog.metaTitle || `${blog.title} | CalcZen Blog`;
    const desc = blog.metaDescription || blog.excerpt;
    const siteUrl = "https://calczen.in";
    const canonical = `${siteUrl}/blog/${blog.slug}`;
    const keys =
      blog.keywords && blog.keywords.length > 0 ? blog.keywords.join(", ") : blog.tags.join(", ");

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: keys },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: blog.thumbnail || "" },
        { property: "article:published_time", content: blog.publishDate || blog.createdAt },
        { property: "article:author", content: blog.author },
        { property: "article:section", content: blog.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: blog.thumbnail || "" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            image: blog.thumbnail || "",
            genre: blog.category,
            keywords: keys,
            publisher: {
              "@type": "Organization",
              name: "CalcZen",
              logo: { "@type": "ImageObject", url: `${siteUrl}/brand-logo.png` },
            },
            url: `${siteUrl}/blog/${blog.slug}`,
            datePublished: blog.publishDate || blog.createdAt,
            dateModified: blog.updatedAt,
            author: { "@type": "Organization", name: "CalcZen" },
            description: blog.excerpt || desc,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteUrl}/blog/${blog.slug}`,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${blog.slug}#webpage`,
            name: title,
            description: desc,
            url: `${siteUrl}/blog/${blog.slug}`,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
              {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: `${siteUrl}/blog/${blog.slug}`,
              },
            ],
          }),
        },
        ...(blog.faqs && blog.faqs.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: blog.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: BlogPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="page-container max-w-3xl py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Article not found</h1>
        <p className="mt-4 text-base text-muted-foreground">
          We couldn't find the blog post you're looking for. It may have been relocated or
          unpublished.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-glow"
        >
          Return to Blog
        </Link>
      </div>
    </PageShell>
  ),
});

// Keyword dictionary for mapping standard terms directly to CalcZen calculator tools
const KEYWORD_MAP: Array<{ term: string; slug: string; text: string }> = [
  { term: "mortgage", slug: "mortgage-calculator", text: "Mortgage Calculator" },
  { term: "emi", slug: "loan-emi-calculator", text: "EMI Calculator" },
  { term: "bmi", slug: "bmi-calculator", text: "BMI Calculator" },
  { term: "sleep", slug: "sleep-calculator", text: "Sleep Calculator" },
  { term: "calories", slug: "calorie-calculator", text: "Calorie Calculator" },
  { term: "calorie", slug: "calorie-calculator", text: "Calorie Calculator" },
  { term: "percentage", slug: "percentage-calculator", text: "Percentage Calculator" },
  { term: "loan", slug: "loan-emi-calculator", text: "Loan Calculator" },
  { term: "interest", slug: "compound-interest-calculator", text: "Compound Interest Calculator" },
  { term: "age", slug: "age-calculator", text: "Age Calculator" },
  { term: "tip", slug: "tip-calculator", text: "Tip Calculator" },
];

function BlogPage() {
  const { blog } = Route.useLoaderData();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [toc, setToc] = useState<Array<{ id: string; text: string }>>([]);

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

  // 3. Load Related Blogs in same category
  useEffect(() => {
    async function loadRelated() {
      const res = await fetchPublishedBlogs({
        category: blog.category,
        page: 1,
        limit: 3,
      });
      if (res.ok && res.data) {
        // Exclude current blog
        setRelatedBlogs(res.data.blogs.filter((b) => b._id !== blog._id).slice(0, 2));
      }
    }
    loadRelated();
  }, [blog.category, blog._id]);

  // 4. Generate dynamic Table of Contents by parsing H2 elements
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");
    const headings = doc.querySelectorAll("h2");
    const items: Array<{ id: string; text: string }> = [];

    headings.forEach((h, idx) => {
      const text = h.textContent || "";
      const id = `heading-${idx}`;
      items.push({ id, text });
    });

    setToc(items);
  }, [blog.content]);

  // 5. Social Share actions
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

  // 6. INTERNAL CALCULATOR LINKING ENGINE
  // Parsers raw HTML to inject interactive calculators cards and highlights keywords.
  const renderedContent = useMemo(() => {
    const parsedContent = blog.content;

    // 6.1 Render Custom Embed Inserters [calculator slug="x"] or CTA blocks from visual editor
    // We already inserted visual editor block `<div class="calc-cta-block" data-slug="...">`
    // We can replace the static content editable block in preview with a rich interactive markup!
    const parser = new DOMParser();
    const doc = parser.parseFromString(parsedContent, "text/html");

    // Replace CTA placeholder blocks with premium interactive markup
    const placeholders = doc.querySelectorAll(".calc-cta-block");
    placeholders.forEach((el) => {
      const slug = el.getAttribute("data-slug");
      if (!slug) return;

      const calc = getCalculator(slug);
      if (!calc) return;

      const CalcIcon = calc.icon;

      // Swap out the children with a gorgeous responsive interactive recommendation card
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg bg-gradient-accent text-primary-foreground shadow-glow shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          </div>
          <div class="min-w-0">
            <div class="font-bold text-white text-base leading-tight">Try Our ${calc.name} →</div>
            <p class="text-xs text-slate-400 mt-1 line-clamp-1">${calc.description}</p>
          </div>
        </div>
        <a href="/calculator/${calc.slug}" class="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 hover:scale-[1.015] active:scale-[0.985] transition-all shrink-0 text-center w-full sm:w-auto" style="text-decoration: none !important;">Calculate Free</a>
      `;
      el.className =
        "calc-cta-block rounded-xl border border-indigo-500/25 bg-gradient-hero p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 select-none";
    });

    // Inject heading IDs for smooth anchors in Toc navigation
    const headings = doc.querySelectorAll("h2");
    headings.forEach((h, idx) => {
      h.setAttribute("id", `heading-${idx}`);
    });

    // 6.2 Keyword recommendation injector
    // Automatically inject recommending interactive cards after paragraphs containing high-value keywords.
    const paragraphs = doc.querySelectorAll("p");
    const matchedSlugs = new Set<string>();

    paragraphs.forEach((p, idx) => {
      // Limit to max 2 keyword recommendation cards per article to prevent spamming
      if (matchedSlugs.size >= 2) return;

      const text = p.textContent?.toLowerCase() || "";

      for (const mapping of KEYWORD_MAP) {
        if (matchedSlugs.has(mapping.slug)) continue;

        // Smart check: keyword boundaries matching
        const regex = new RegExp(`\\b${mapping.term}\\b`, "i");
        if (regex.test(text)) {
          const calc = getCalculator(mapping.slug);
          if (calc) {
            matchedSlugs.add(mapping.slug);

            // Inject an elegant CTA box immediately following the paragraph
            const ctaBox = doc.createElement("div");
            ctaBox.className =
              "calc-keyword-cta rounded-xl border border-border/80 bg-card/65 p-4.5 my-5 flex items-center justify-between gap-4 select-none border-l-4 border-l-indigo-500";
            ctaBox.innerHTML = `
              <div class="flex items-center gap-3 min-w-0">
                <div class="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold text-xs sm:text-sm text-foreground leading-tight">Featured Calculator: ${calc.name}</div>
                  <p class="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">${calc.description}</p>
                </div>
              </div>
              <a href="/calculator/${calc.slug}" class="rounded-lg bg-indigo-600/15 hover:bg-indigo-600/35 border border-indigo-500/35 text-indigo-300 font-semibold text-[11px] px-3.5 py-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0" style="text-decoration: none !important;">Open Tool →</a>
            `;

            // Insert after the current paragraph
            p.parentNode?.insertBefore(ctaBox, p.nextSibling);
            break;
          }
        }
      }
    });

    return doc.body.innerHTML;
  }, [blog.content]);

  // Related calculators widget (retrieved based on category matches)
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
    return calculators.filter((c) => c.category === targetCat).slice(0, 4);
  }, [blog.category]);

  return (
    <PageShell>
      <Toaster />
      {/* Sticky Top Reading progress indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-secondary z-[60] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="page-container mt-8 sm:mt-12">
        {/* Back and Breadcrumbs Navigation */}
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
            <span className="text-foreground truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body Column */}
          <div className="lg:col-span-8 min-w-0 bg-card/15 border border-border/40 rounded-2xl p-5 sm:p-7 md:p-9 shadow-card">
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
                  title="Copy Link Clipboard"
                >
                  <LinkIcon size={14} />
                </button>
              </div>
            </div>

            {blog.thumbnail && (
              <div className="rounded-xl overflow-hidden mt-6 h-60 sm:h-80 border border-border/40 bg-black">
                <img
                  src={blog.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
            )}

            {/* Visual content area parsed with linking engines */}
            <div
              className="mt-8 prose prose-invert max-w-none select-text font-normal leading-[1.8] text-sm sm:text-base prose-table:block prose-table:overflow-x-auto prose-table:border prose-table:border-border prose-img:max-w-full prose-img:h-auto"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Author Biography footer block */}
            <div className="mt-12 rounded-xl border border-border/50 bg-card/35 p-5 flex items-start gap-4 shadow-soft">
              <div className="h-10 w-10 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">
                CZ
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground">{blog.author}</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  CalcZen content team provides premium, mathematical, and simulation models
                  tutorials that simplify complex computations for everyday finance, taxes, fitness,
                  and calculations.
                </p>
              </div>
            </div>

            {/* FAQs Block */}
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
          </div>

          {/* Desktop Right Sidebar Widget Column */}
          <aside className="lg:col-span-4 space-y-6 shrink-0 min-w-0 lg:sticky lg:top-20">
            {/* Table of Contents Widget */}
            {toc.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/25 p-5 min-w-0">
                <h2 className="font-bold text-sm tracking-tight text-foreground mb-3 border-b border-border/40 pb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-400" />
                  Table of Contents
                </h2>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs font-semibold text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all truncate leading-relaxed"
                    >
                      • {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Tools Recommendation Sidebar Widget */}
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
                        to={`/calculator/$slug`}
                        params={{ slug: c.slug }}
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
                          className="text-[var(--color-muted)] group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Footer Similar/Related Articles Grid */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 border-t border-border/40 pt-10 pb-6 min-w-0">
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
                    to={`/blog/$slug`}
                    params={{ slug: r.slug }}
                    className="flex flex-col h-full"
                  >
                    <div className="h-40 bg-black overflow-hidden relative">
                      <img
                        src={r.thumbnail || ""}
                        alt=""
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
          </div>
        )}
      </article>
    </PageShell>
  );
}
