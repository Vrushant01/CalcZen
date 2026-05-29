import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, FileText, Globe, Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "../components/AdminLayout";
import { EmptyState } from "../components/EmptyState";
import { LoadingTable } from "../components/LoadingTable";
import { api, type Blog, type BlogStats } from "../services/api";

const emptyStats: BlogStats = {
  total: 0,
  published: 0,
  drafts: 0,
  views: 0,
};

const CATEGORIES = [
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

export function BlogListPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<BlogStats>(emptyStats);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.blogStats();
      if (res.data) setStats(res.data);
    } catch {
      // Fail silently
    }
  }, []);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.blogs({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        page,
        limit: 10,
      });
      if (res.data) {
        setBlogs(res.data.blogs);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBlogs();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [loadBlogs]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.deleteBlog(id);
      toast.success("Article deleted");
      loadStats();
      loadBlogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  }

  function handleExport() {
    setExporting(true);
    try {
      if (blogs.length === 0) {
        toast.error("No blogs to export");
        setExporting(false);
        return;
      }

      // Generate CSV string
      const headers = ["ID", "Title", "Slug", "Excerpt", "Category", "Author", "Views", "Published", "Publish Date", "Created At"];
      const rows = blogs.map((b) => [
        b._id,
        `"${b.title.replace(/"/g, '""')}"`,
        b.slug,
        `"${b.excerpt.replace(/"/g, '""')}"`,
        b.category,
        `"${b.author.replace(/"/g, '""')}"`,
        b.views,
        b.published ? "TRUE" : "FALSE",
        b.publishDate ? new Date(b.publishDate).toISOString() : "",
        new Date(b.createdAt).toISOString(),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `blogs-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV Exported successfully");
    } catch (err) {
      toast.error("CSV Export failed");
    } finally {
      setExporting(false);
    }
  }

  // Helper for direct public link preview
  const getPublicPreviewUrl = (slug: string) => {
    // Falls back to origin if needed
    const origin = window.location.origin.replace(":5173", ":8080"); // Standard dev port mapping
    return `/blog/${slug}`;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <PageHeader
          title="Blogs CMS"
          description="Write SEO blogs and funnel users directly to calculators."
        />
        <Link
          to="/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <Plus size={18} />
          Create Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Blogs" value={stats.total} icon={FileText} />
        <StatCard
          label="Published"
          value={stats.published}
          icon={Globe}
          accent="rgba(34,197,94,0.2)"
        />
        <StatCard
          label="Drafts"
          value={stats.drafts}
          icon={FileText}
          accent="rgba(234,179,8,0.2)"
        />
        <StatCard label="Total Blog Views" value={stats.views} icon={Eye} accent="rgba(99,102,241,0.2)" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="search"
            placeholder="Search blogs by title or summary..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-white"
        >
          <option value="">All Statuses</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts Only</option>
        </select>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || blogs.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-sm font-medium hover:bg-white/5 disabled:opacity-40 shrink-0 transition-colors text-white"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {loading ? (
        <LoadingTable rows={5} />
      ) : blogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles found"
          description="Get started by writing your first blog post or adjusting your search parameters."
        />
      ) : (
        <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-card-border)] bg-white/5 text-[var(--color-muted)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Thumbnail</th>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Views</th>
                  <th className="p-4 font-semibold">Publish Date</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-card-border)]">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 shrink-0">
                      {b.thumbnail ? (
                        <img
                          src={b.thumbnail}
                          alt=""
                          className="h-10 w-16 object-cover rounded border border-[var(--color-card-border)] bg-black"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=60";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-16 bg-white/5 rounded border border-[var(--color-card-border)] flex items-center justify-center">
                          <FileText size={16} className="text-[var(--color-muted)]" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium max-w-[280px]">
                      <div className="truncate text-white" title={b.title}>
                        {b.title}
                      </div>
                      <div className="text-xs text-[var(--color-muted)] truncate" title={b.slug}>
                        /{b.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-[var(--color-muted)]">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {b.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right tabular-nums text-white">{b.views.toLocaleString()}</td>
                    <td className="p-4 text-[var(--color-muted)]">
                      {b.publishDate ? new Date(b.publishDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/blogs/edit/${b._id}`}
                          className="p-2 text-[var(--color-muted)] hover:text-white rounded hover:bg-white/5 transition-colors"
                          title="Edit Article"
                        >
                          <Edit size={16} />
                        </Link>
                        {b.published && (
                          <a
                            href={getPublicPreviewUrl(b.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--color-muted)] hover:text-white rounded hover:bg-white/5 transition-colors"
                            title="Preview Public Article"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(b._id)}
                          disabled={deletingId === b._id}
                          className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          title="Delete Article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded text-sm border border-[var(--color-card-border)] bg-[var(--color-card)] hover:bg-white/5 text-white disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--color-muted)]">
            Page {page} of {pagination.pages} ({pagination.total} total)
          </span>
          <button
            type="button"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded text-sm border border-[var(--color-card-border)] bg-[var(--color-card)] hover:bg-white/5 text-white disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
