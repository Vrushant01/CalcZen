import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Eye, Sparkles, TrendingUp, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculators } from "@/data/calculators";
import { subscribeEmail } from "@/lib/subscribe-api";
import { fetchPublishedBlogs, type Blog } from "@/lib/blog-api";

// 1. Sidebar Newsletter Component
function SidebarNewsletter() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (!email) return;

    setLoading(true);
    const result = await subscribeEmail(email);
    setLoading(false);

    if (result.ok) {
      toast.success(result.message);
      if (emailRef.current) emailRef.current.value = "";
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-gradient-hero p-5 text-white shadow-glow relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 opacity-10 text-indigo-400">
        <Mail size={120} />
      </div>
      <div className="font-semibold text-base flex items-center gap-1.5 text-white">
        <Sparkles size={16} className="text-indigo-400 shrink-0" />
        Get Updates
      </div>
      <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
        Stay updated with our latest calculators, financial updates, and helpful articles. No spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 relative z-10">
        <Input
          ref={emailRef}
          type="email"
          required
          disabled={loading}
          placeholder="your@email.com"
          className="bg-white/95 border-0 h-10 w-full text-slate-900 placeholder:text-slate-500 text-xs rounded-lg"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white w-full text-xs font-semibold rounded-lg"
        >
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "CalcZen Blog — Financial Insights, Health Tips & Math Guides" },
      { name: "description", content: "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations." },
      { property: "og:title", content: "CalcZen Blog — Expert Insights" },
      { property: "og:description", content: "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations." },
      { name: "twitter:description", content: "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://calczen.in/blog" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.in/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "CalcZen Blog — Financial Insights, Health Tips & Math Guides",
          "description": "Explore the CalcZen Blog for expert guides, financial tips, health calculator breakdowns, tax advice, and practical guides on online tool calculations.",
          "url": "https://calczen.in/blog"
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://calczen.in"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": "https://calczen.in/blog"
            }
          ]
        }),
      }
    ],
  }),
  component: BlogHomepage,
});

const CATEGORY_PILLS = [
  "All",
  "Finance",
  "Health",
  "Mortgage",
  "Taxes",
  "Loans",
  "BMI",
  "Fitness",
  "Investment",
  "Business",
];

function BlogHomepage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load public blogs
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchPublishedBlogs({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: search.trim() || undefined,
        page,
        limit: 9,
      });

      if (res.ok && res.data) {
        setBlogs(res.data.blogs);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.pages);
      } else {
        setBlogs([]);
        setTotal(0);
        setTotalPages(1);
      }
      setLoading(false);
    }

    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, search ? 300 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, search, page]);

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const popularBlogs = [...blogs].sort((a, b) => b.views - a.views).slice(0, 4);
  const trendingCalculators = calculators.filter((c) => c.trending).slice(0, 4);

  return (
    <PageShell>
      <Toaster />
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-85" />
        <div className="relative page-container flex flex-col items-center justify-center text-center py-16 sm:py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl min-w-0"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/45 text-xs text-indigo-400 font-semibold mb-4 shadow-soft">
              <Sparkles size={12} />
              Insights & Guides
            </span>
            <h1 className="text-[1.85rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
              Financial Insights,{" "}
              <span className="text-gradient bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Health Guides, and Calculation Tips
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-lg mx-auto">
              Master the calculations, equations, and financial models behind everyday decisions. Simplified mathematics, finance, and wellness guides.
            </p>

            <div className="relative max-w-md mx-auto mt-6 w-full px-4">
              <Search
                size={18}
                className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                placeholder="Search articles by title or keyword..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-slate-400 shadow-soft"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter Bar */}
      <section className="border-y border-border/40 py-4.5 bg-card/10 select-none">
        <div className="page-container overflow-x-auto scrollbar-none flex gap-2 items-center justify-start md:justify-center">
          {CATEGORY_PILLS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              type="button"
              className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-glow scale-[1.02]"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="page-container mt-10 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10 min-w-0">
            {loading ? (
              <div className="space-y-6">
                <div className="h-96 rounded-2xl bg-muted/20 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-64 rounded-xl bg-muted/20 animate-pulse" />
                  <div className="h-64 rounded-xl bg-muted/20 animate-pulse" />
                </div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/35 p-12 text-center">
                <Search className="h-10 w-10 mx-auto text-muted-foreground opacity-60" />
                <p className="mt-3 font-semibold text-base">No articles found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search keywords or switching category filters.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Blog */}
                {page === 1 && !search && featuredBlog && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group border border-border bg-card/45 rounded-2xl overflow-hidden shadow-card hover:-translate-y-0.5 transition-all duration-300 hover:border-accent/40"
                  >
                    <Link
                      to={`/blog/$slug`}
                      params={{ slug: featuredBlog.slug }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-0"
                    >
                      <div className="md:col-span-6 overflow-hidden h-64 md:h-full relative min-h-[220px]">
                        <img
                          src={featuredBlog.thumbnail || ""}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 bg-black"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        <div className="absolute top-3 left-3 rounded bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-1">
                          Featured
                        </div>
                      </div>
                      <div className="md:col-span-6 p-5 sm:p-6 md:p-8 flex flex-col justify-center min-w-0">
                        <span className="text-accent font-semibold text-xs uppercase tracking-wider">
                          {featuredBlog.category}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold mt-2 text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-2">
                          {featuredBlog.title}
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {featuredBlog.excerpt}
                        </p>
                        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {featuredBlog.publishDate
                              ? new Date(featuredBlog.publishDate).toLocaleDateString()
                              : "-"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {featuredBlog.readingTime} min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Recent Blogs Grid */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
                    {search ? "Search Results" : "Recent Publications"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    <AnimatePresence mode="popLayout">
                      {blogs
                        .filter((b) => (page === 1 && !search ? b._id !== featuredBlog?._id : true))
                        .map((b, i) => (
                          <motion.div
                            key={b._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: i * 0.04 }}
                            className="group border border-border bg-card/25 rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-accent/40 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full"
                          >
                            <Link
                              to={`/blog/$slug`}
                              params={{ slug: b.slug }}
                              className="flex flex-col h-full"
                            >
                              <div className="h-44 overflow-hidden relative bg-black shrink-0">
                                <img
                                  src={b.thumbnail || ""}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=60";
                                  }}
                                />
                                <span className="absolute bottom-2.5 left-2.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-slate-200 font-bold px-2 py-0.5">
                                  {b.category}
                                </span>
                              </div>
                              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                                    {b.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                                    {b.excerpt}
                                  </p>
                                </div>
                                <div className="mt-4.5 flex items-center gap-3.5 text-[11px] text-muted-foreground border-t border-border/30 pt-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={10.5} />
                                    {b.publishDate
                                      ? new Date(b.publishDate).toLocaleDateString()
                                      : "-"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={10.5} />
                                    {b.readingTime} min
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 border-t border-border/45 pt-6">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-muted-foreground mx-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Desktop Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6 shrink-0 min-w-0">
            <SidebarNewsletter />

            {popularBlogs.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/25 p-5 min-w-0">
                <h2 className="font-bold text-sm tracking-tight text-foreground mb-4 border-b border-border/40 pb-2">
                  Popular Reading
                </h2>
                <div className="space-y-4">
                  {popularBlogs.map((pop) => (
                    <Link
                      key={pop._id}
                      to={`/blog/$slug`}
                      params={{ slug: pop.slug }}
                      className="group flex gap-3 items-center min-w-0"
                    >
                      <div className="h-12 w-18 shrink-0 rounded overflow-hidden bg-black border border-border">
                        <img
                          src={pop.thumbnail || ""}
                          alt=""
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                          {pop.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Eye size={10} />
                          {pop.views.toLocaleString()} views
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {trendingCalculators.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/25 p-5 min-w-0">
                <h2 className="font-bold text-sm tracking-tight text-foreground mb-4 border-b border-border/40 pb-2 flex items-center gap-1.5">
                  <TrendingUp size={15} className="text-accent" />
                  Trending Calculations
                </h2>
                <div className="space-y-3">
                  {trendingCalculators.map((c) => {
                    const CalcIcon = c.icon;
                    return (
                      <Link
                        key={c.slug}
                        to={`/calculator/$slug`}
                        params={{ slug: c.slug }}
                        className="group flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card hover:bg-white/5 hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-gradient-accent text-primary-foreground flex items-center justify-center shrink-0">
                            <CalcIcon size={14} />
                          </div>
                          <span className="font-medium text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors truncate">
                            {c.name}
                          </span>
                        </div>
                        <ArrowRight size={12} className="text-[var(--color-muted)] group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
