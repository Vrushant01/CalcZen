import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Mail, Search, TrendingUp, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/AdminLayout";
import { SubscriberTable } from "@/components/SubscriberTable";
import { api, type AdminStats } from "@/services/api";

const emptyStats: AdminStats = {
  total: 0,
  active: 0,
  unsubscribed: 0,
  recentLast30Days: 0,
  recentLast7Days: 0,
};

export function DashboardPage() {
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [recent, setRecent] = useState<
    Array<{ _id: string; email: string; subscribedAt: string; source: string; status: string }>
  >([]);
  const [subscribers, setSubscribers] = useState<
    Array<{ _id: string; email: string; subscribedAt: string; source: string; status: string }>
  >([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const debouncedSearch = useMemo(() => search, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, recentRes, subsRes] = await Promise.all([
        api.stats(),
        api.recentSubscribers(),
        api.subscribers({
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          page,
          limit: 15,
        }),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (recentRes.data) setRecent(recentRes.data);
      if (subsRes.data) {
        setSubscribers(subsRes.data.subscribers);
        setPagination(subsRes.data.pagination);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    try {
      await api.deleteSubscriber(id);
      toast.success("Subscriber removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await api.exportCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Manage newsletter subscribers and view analytics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total subscribers" value={stats.total} icon={Users} />
        <StatCard
          label="Active"
          value={stats.active}
          icon={UserCheck}
          accent="rgba(34,197,94,0.2)"
        />
        <StatCard label="New (7 days)" value={stats.recentLast7Days} icon={TrendingUp} />
        <StatCard label="New (30 days)" value={stats.recentLast30Days} icon={Mail} />
      </div>

      {recent.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
            Recent sign-ups
          </h2>
          <div className="flex flex-wrap gap-2">
            {recent.map((s) => (
              <span
                key={s._id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-xs"
              >
                <span className="font-medium truncate max-w-[200px]">{s.email}</span>
                <span className="text-[var(--color-muted)]">
                  {new Date(s.subscribedAt).toLocaleDateString()}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="search"
            placeholder="Search by email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-sm font-medium hover:bg-white/5 disabled:opacity-60 shrink-0 transition-colors"
        >
          <Download size={18} />
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      <SubscriberTable
        subscribers={subscribers}
        loading={loading}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded text-sm border border-[var(--color-card-border)] disabled:opacity-40 hover:bg-white/5 transition-colors"
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
            className="px-3 py-1.5 rounded text-sm border border-[var(--color-card-border)] disabled:opacity-40 hover:bg-white/5 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
