"use client";

import { Link } from "@/components/ui/Link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPublishedBlogs, type Blog } from "@/lib/blog-api";

// 2 premium mock articles for our high-quality teaser state
const MOCK_BLOGS = [
  {
    _id: "mock-2",
    title: "Understanding BMI: Metrics vs. Muscular Health",
    slug: "bmi-calculator",
    excerpt:
      "Explore how the Body Mass Index is calculated, and why it sometimes misclassifies high muscle density.",
    thumbnail:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    category: "Health",
    readingTime: 5,
    publishDate: "2026-05-22T00:00:00.000Z",
  },
  {
    _id: "mock-3",
    title: "The 28%/36% Rule: How Much Mortgage Can You Afford?",
    slug: "mortgage-calculator",
    excerpt:
      "Lenders use precise debt ratios to calculate your home loan limit. Master the calculations before shopping.",
    thumbnail:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
    category: "Finance",
    readingTime: 6,
    publishDate: "2026-05-29T00:00:00.000Z",
  },
];

// Helper to style category badges nicely
function getCategoryStyle(category: string): string {
  switch (category.toLowerCase()) {
    case "finance":
    case "loans":
    case "mortgage":
    case "investment":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "health":
    case "fitness":
    case "bmi":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "math":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    case "productivity":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "education":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmptyState, setIsEmptyState] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetchPublishedBlogs({ page: 1, limit: 3 });
        if (res.ok && res.data && res.data.blogs.length > 0) {
          setBlogs(res.data.blogs.slice(0, 3));
          setIsEmptyState(false);
        } else {
          setIsEmptyState(true);
        }
      } catch (err) {
        console.error("Failed to load live blogs, falling back to mock data:", err);
        setIsEmptyState(true);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  if (loading) {
    return (
      <section className="page-container mt-10 sm:mt-16 md:mt-20">
        <div className="h-8 w-40 bg-muted/20 animate-pulse rounded-lg mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
          <div className="h-[320px] bg-muted/20 animate-pulse rounded-2xl" />
          <div className="h-[320px] bg-muted/20 animate-pulse rounded-2xl" />
          <div className="h-[320px] bg-muted/20 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  const displayBlogs = isEmptyState ? (MOCK_BLOGS as unknown as Blog[]) : blogs;

  return (
    <section className="page-container mt-10 sm:mt-16 md:mt-20 relative min-w-0">
      {/* Header exactly matching Trending section spacing but editorial-oriented */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="h-5 w-5 text-accent shrink-0" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
            Latest From Our Blog
          </h2>
        </div>
        <Link
          to="/blog"
          className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1 shrink-0"
        >
          See all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Elegant placeholders notification banner for empty states */}
      {isEmptyState && (
        <div className="mb-6 rounded-xl border border-dashed border-accent/20 bg-accent/[0.01] p-3 text-center backdrop-blur-sm select-none">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent shrink-0 animate-pulse-slow" />
            <p className="text-xs font-semibold text-slate-300">
              New educational articles coming soon. Stay tuned for expert insights!
            </p>
          </div>
        </div>
      )}

      {/* 3-Column horizontal grid of equal-sized premium cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 min-w-0">
        {displayBlogs.map((b, i) => (
          <motion.div
            key={b._id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="h-full flex"
          >
            <Link
              to={isEmptyState ? "/calculator/$slug" : "/blog/$slug"}
              params={{ slug: b.slug }}
              className="group w-full surface-card bg-card/25 border border-border/70 hover:border-accent/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-glow active:scale-[0.99] transition-all duration-500 flex flex-col h-full text-left"
            >
              {/* Full bleed cover image with slow scale on hover */}
              <div className="aspect-[16/10] w-full overflow-hidden relative bg-black shrink-0 border-b border-border/40 select-none">
                <img
                  src={b.thumbnail || ""}
                  alt={`Cover image for ${b.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60";
                  }}
                />
                {/* Floating category badge on image overlay */}
                <span
                  className={`absolute bottom-3 left-3 rounded-md px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider select-none shadow-soft backdrop-blur-md border ${getCategoryStyle(b.category)}`}
                >
                  {b.category}
                </span>
              </div>

              {/* Card content text body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 min-w-0">
                <div className="min-w-0">
                  {/* Read time metadata */}
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-accent uppercase tracking-wider mb-2 select-none">
                    <span>{b.readingTime} min read</span>
                  </div>

                  <h3 className="text-base sm:text-[17px] font-extrabold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 font-normal">
                    {b.excerpt}
                  </p>
                </div>

                {/* Elegant separator line + footer info */}
                <div className="mt-5 pt-3.5 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground/75 select-none font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <time dateTime={b.publishDate || ""}>
                      {b.publishDate
                        ? new Date(b.publishDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Soon"}
                    </time>
                  </span>

                  <span className="text-accent group-hover:text-accent/90 transition-all font-bold flex items-center gap-0.5 shrink-0">
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5 transform translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
