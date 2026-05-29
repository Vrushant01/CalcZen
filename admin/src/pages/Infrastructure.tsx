import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  Server,
  Cpu,
  HardDrive,
  RefreshCw,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  BarChart3,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/AdminLayout";
import { api } from "../services/api";

type TabName = "overview" | "render" | "supabase" | "resend" | "cloudflare" | "analytics" | "alerts";

export function InfrastructurePage() {
  const [activeTab, setActiveTab] = useState<TabName>("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = useCallback(async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await api.infrastructureStats();
      if (res.success && res.data) {
        setStats(res.data);
        if (isAuto) {
          toast.success("Infrastructure stats auto-refreshed", { duration: 1500 });
        }
      } else {
        throw new Error(res.message ?? "Invalid metrics payload received");
      }
    } catch (err) {
      console.error("Infrastructure fetch error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load infrastructure metrics");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setRefreshCountdown(60);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Auto-refresh countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((c) => {
        if (c <= 1) {
          loadStats(true);
          return 60;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loadStats]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-[var(--color-muted)]">
        <div className="h-9 w-9 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium animate-pulse">Fetching real-time infrastructure stats...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-dashed border-red-500/20 bg-red-500/5 p-12 text-center">
        <XCircle className="h-10 w-10 mx-auto text-red-500/70" />
        <p className="mt-3 font-semibold text-white">Metrics Server Unreachable</p>
        <p className="mt-1 text-sm text-[var(--color-muted)] max-w-sm mx-auto">
          The infrastructure gateway returned an empty payload. Please verify backend logs.
        </p>
        <button
          type="button"
          onClick={() => loadStats()}
          className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Quota usage alerts threshold generator helper
  const getProgressColor = (percent: number) => {
    if (percent >= 95) return "bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
    if (percent >= 85) return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]";
    return "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]";
  };

  const getWarningBadge = (percent: number) => {
    if (percent >= 95) return <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400 animate-pulse">Critical (95%+)</span>;
    if (percent >= 90) return <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-amber-500/15 border border-amber-500/30 text-amber-400">Danger (90%+)</span>;
    if (percent >= 80) return <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">Warning (80%+)</span>;
    return null;
  };

  return (
    <>
      {/* Infrastructure Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-[var(--color-card-border)] pb-4">
        <PageHeader
          title="Infrastructure Systems"
          description="Centralized telemetry for Render, Supabase, Cloudflare, Resend, and platform analytics."
        />
        
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-xs text-[var(--color-muted)] flex items-center gap-1.5 font-mono">
            <Clock size={12} />
            <span>Refresh in {refreshCountdown}s</span>
          </div>
          
          <button
            type="button"
            onClick={() => loadStats()}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[var(--color-primary-hover)]" : ""} />
            Sync Now
          </button>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="flex overflow-x-auto gap-1 border-b border-[var(--color-card-border)] pb-px mb-6 scrollbar-hide">
        {(["overview", "render", "supabase", "resend", "cloudflare", "analytics", "alerts"] as TabName[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 capitalize transition-colors whitespace-nowrap -mb-px shrink-0 ${
              activeTab === tab
                ? "border-[var(--color-primary)] text-white bg-white/2"
                : "border-transparent text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ────────────────────────── TABS CONTENTS ────────────────────────── */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Health indicator bar */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            stats.systemHealth === "critical"
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : stats.systemHealth === "warning"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
            <div className="flex items-center gap-3">
              {stats.systemHealth === "critical" ? (
                <XCircle size={24} className="animate-pulse" />
              ) : stats.systemHealth === "warning" ? (
                <AlertTriangle size={24} />
              ) : (
                <CheckCircle size={24} />
              )}
              <div>
                <div className="font-bold text-sm sm:text-base capitalize">Systems Status: {stats.systemHealth}</div>
                <div className="text-xs opacity-80 mt-0.5">Telemetry telemetry verified at {new Date(stats.lastRefreshed).toLocaleTimeString()}</div>
              </div>
            </div>
            
            <div className="text-xs font-semibold px-3 py-1 rounded bg-black/20 border border-white/5 uppercase tracking-wide hidden sm:block">
              Free Tier Enforced
            </div>
          </div>

          {/* Infrastructure cards metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 shrink-0"><Server size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-medium">Backend (Render)</p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Healthy</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 shrink-0"><Database size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-medium">Database (Supabase)</p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Healthy</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400 shrink-0"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-medium">Mailing (Resend)</p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Healthy</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-sky-500/10 text-sky-400 shrink-0"><Shield size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-medium">Proxy (Cloudflare)</p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5">Active</p>
              </div>
            </div>
          </div>

          {/* Central Quotas and Usage Meters */}
          <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
            <h2 className="text-base sm:text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Cpu size={18} className="text-indigo-400" />
              Infrastructure Limits & Quotas
            </h2>
            
            <div className="space-y-6">
              {/* Meter 1: Render Instance Hours */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Render Free Instance Hours</span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.render.freeHoursUsed} / {stats.render.freeHoursLimit} hrs ({stats.render.planUsagePercent}%)</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(stats.render.planUsagePercent)}`}
                    style={{ width: `${stats.render.planUsagePercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--color-muted)] mt-1.5">Calculates continuous server runtime this month. Resets on 1st of month.</p>
              </div>

              {/* Meter 2: Supabase Storage */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    Supabase Storage
                    {getWarningBadge(Math.round(storagePercent))}
                  </span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.supabase.storageUsedMb} / {stats.supabase.storageLimitMb} MB ({(storagePercent).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(storagePercent)}`}
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>

              {/* Meter 3: Supabase Database size */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    Supabase Database Size
                    {getWarningBadge(Math.round(dbSizePercent))}
                  </span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.supabase.databaseSizeMb} / {stats.supabase.databaseLimitMb} MB ({(dbSizePercent).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(dbSizePercent)}`}
                    style={{ width: `${dbSizePercent}%` }}
                  />
                </div>
              </div>

              {/* Meter 4: Resend Email Quota */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    Resend Monthly Email Quota
                    {getWarningBadge(Math.round((stats.resend.sentThisMonth / stats.resend.limitThisMonth) * 100))}
                  </span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.resend.sentThisMonth} / {stats.resend.limitThisMonth} Emails ({((stats.resend.sentThisMonth / stats.resend.limitThisMonth) * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor((stats.resend.sentThisMonth / stats.resend.limitThisMonth) * 100)}`}
                    style={{ width: `${(stats.resend.sentThisMonth / stats.resend.limitThisMonth) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RENDER MONITORING TAB */}
      {activeTab === "render" && (
        <div className="space-y-6 animate-fade-in">
          {/* Main metric row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Render Status</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                Healthy <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              </p>
            </div>
            
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Backend Uptime</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.render.uptime}%</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">API Response Time</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.render.responseTime}ms</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Active Connections</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.render.activeRequests} req/s</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Limit breakdown */}
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-indigo-400">Monthly Resource Limits</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">Free Instance Hours</span>
                    <span className="font-semibold text-white">{stats.render.freeHoursUsed} / {stats.render.freeHoursLimit} hrs</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.render.planUsagePercent}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">{stats.render.freeHoursLimit - stats.render.freeHoursUsed} hours remaining this billing month.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">Outbound Bandwidth Egress</span>
                    <span className="font-semibold text-white">{stats.render.bandwidthUsedGb} / {stats.render.bandwidthLimitGb} GB</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.render.bandwidthUsedGb / stats.render.bandwidthLimitGb) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">{Math.round(stats.render.bandwidthLimitGb - stats.render.bandwidthUsedGb)} GB free bandwidth remaining.</p>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-indigo-400">Server Metrics & Deployments</h3>
              
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-white/5 bg-black/20 p-3.5 rounded-lg">
                  <dt className="text-[var(--color-muted)] flex items-center gap-1.5 mb-1">
                    <Cpu size={14} /> CPU Consumption
                  </dt>
                  <dd className="font-bold text-lg text-white">{stats.render.cpuUsagePercent}%</dd>
                </div>

                <div className="border border-white/5 bg-black/20 p-3.5 rounded-lg">
                  <dt className="text-[var(--color-muted)] flex items-center gap-1.5 mb-1">
                    <HardDrive size={14} /> Memory Footprint
                  </dt>
                  <dd className="font-bold text-lg text-white">{stats.render.memoryUsagePercent}%</dd>
                </div>

                <div className="border border-white/5 bg-black/20 p-3.5 rounded-lg">
                  <dt className="text-[var(--color-muted)] flex items-center gap-1.5 mb-1">
                    <Calendar size={14} /> Last Deployment
                  </dt>
                  <dd className="font-semibold text-white truncate">{stats.render.lastDeploy}</dd>
                </div>

                <div className="border border-white/5 bg-black/20 p-3.5 rounded-lg">
                  <dt className="text-[var(--color-muted)] flex items-center gap-1.5 mb-1">
                    <Server size={14} /> Total Deployments
                  </dt>
                  <dd className="font-bold text-lg text-white">{stats.render.totalDeployments}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUPABASE MONITORING TAB */}
      {activeTab === "supabase" && (
        <div className="space-y-6 animate-fade-in">
          {/* Stat metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Database Status</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                Online <span className="h-2 w-2 bg-emerald-500 rounded-full" />
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">API Requests</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.supabase.apiRequests.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border(--color-card-border) bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Database Size</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.supabase.databaseSizeMb} MB</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Total Registered Users</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.supabase.totalUsers}</p>
            </div>
          </div>

          {/* Database sizes progress meters */}
          <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider text-indigo-400">Database Quotas Breakdown</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Database Size</span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.supabase.databaseSizeMb} / {stats.supabase.databaseLimitMb} MB ({((stats.supabase.databaseSizeMb / stats.supabase.databaseLimitMb) * 100).toFixed(2)}%)</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.supabase.databaseSizeMb / stats.supabase.databaseLimitMb) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Storage Size</span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.supabase.storageUsedMb} / {stats.supabase.storageLimitMb} MB ({((stats.supabase.storageUsedMb / stats.supabase.storageLimitMb) * 100).toFixed(2)}%)</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.supabase.storageUsedMb / stats.supabase.storageLimitMb) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Storage Bandwidth</span>
                  <span className="text-[var(--color-muted)] font-mono">{stats.supabase.bandwidthUsedGb} / {stats.supabase.bandwidthLimitGb} GB ({((stats.supabase.bandwidthUsedGb / stats.supabase.bandwidthLimitGb) * 100).toFixed(2)}%)</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.supabase.bandwidthUsedGb / stats.supabase.bandwidthLimitGb) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESEND MONITORING TAB */}
      {activeTab === "resend" && (
        <div className="space-y-6 animate-fade-in">
          {/* Main indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Resend Status</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">Healthy</p>
            </div>
            
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Emails Sent Today</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.resend.sentToday} / {stats.resend.limitToday}</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Delivery Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.resend.deliveryRatePercent}%</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Bounce Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.resend.bounceRatePercent}%</p>
            </div>
          </div>

          {/* Limit progress */}
          <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider text-indigo-400">Monthly Email Limit</h3>
            
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Free Tier Limit</span>
                <span className="text-[var(--color-muted)] font-mono">{stats.resend.sentThisMonth} / {stats.resend.limitThisMonth} Emails Used</span>
              </div>
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.resend.sentThisMonth / stats.resend.limitThisMonth) * 100}%` }} />
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-2">Provides {stats.resend.limitThisMonth - stats.resend.sentThisMonth} emails remaining this billing month.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. CLOUDFLARE TAB */}
      {activeTab === "cloudflare" && (
        <div className="space-y-6 animate-fade-in">
          {/* CF metrics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">DNS / SSL Status</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 capitalize">{stats.cloudflare.dnsStatus} / {stats.cloudflare.sslStatus}</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Total Requests</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.cloudflare.totalRequests.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Cache Hit Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.cloudflare.cacheHitRatePercent}%</p>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
              <p className="text-xs text-[var(--color-muted)] font-semibold">Security Blocked</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{stats.cloudflare.threatsBlocked} threats</p>
            </div>
          </div>

          {/* Traffic Trend glowing custom SVG chart */}
          <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <TrendingUp size={16} /> Request Traffic Trends (7-Day Cache & Egress)
            </h3>
            
            <div className="h-56 relative w-full pt-4">
              {/* We construct an ultra-premium neon glowing SVG Area Chart representing Cloudflare Cached vs Uncached Requests */}
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-requests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient-cached" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <line x1="0" y1="150" x2="700" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* Area 1: Total requests */}
                <path
                  d={`M 0,200 
                      L 0,${180 - (stats.cloudflare.trafficTrends[0].requests / 3500) * 120} 
                      L 116,${180 - (stats.cloudflare.trafficTrends[1].requests / 3500) * 120} 
                      L 233,${180 - (stats.cloudflare.trafficTrends[2].requests / 3500) * 120} 
                      L 350,${180 - (stats.cloudflare.trafficTrends[3].requests / 3500) * 120} 
                      L 466,${180 - (stats.cloudflare.trafficTrends[4].requests / 3500) * 120} 
                      L 583,${180 - (stats.cloudflare.trafficTrends[5].requests / 3500) * 120} 
                      L 700,${180 - (stats.cloudflare.trafficTrends[6].requests / 3500) * 120} 
                      L 700,200 Z`}
                  fill="url(#gradient-requests)"
                />

                {/* Line 1: Total requests */}
                <path
                  d={`M 0,${180 - (stats.cloudflare.trafficTrends[0].requests / 3500) * 120} 
                      L 116,${180 - (stats.cloudflare.trafficTrends[1].requests / 3500) * 120} 
                      L 233,${180 - (stats.cloudflare.trafficTrends[2].requests / 3500) * 120} 
                      L 350,${180 - (stats.cloudflare.trafficTrends[3].requests / 3500) * 120} 
                      L 466,${180 - (stats.cloudflare.trafficTrends[4].requests / 3500) * 120} 
                      L 583,${180 - (stats.cloudflare.trafficTrends[5].requests / 3500) * 120} 
                      L 700,${180 - (stats.cloudflare.trafficTrends[6].requests / 3500) * 120}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Area 2: Cached requests */}
                <path
                  d={`M 0,200 
                      L 0,${180 - (stats.cloudflare.trafficTrends[0].cached / 3500) * 120} 
                      L 116,${180 - (stats.cloudflare.trafficTrends[1].cached / 3500) * 120} 
                      L 233,${180 - (stats.cloudflare.trafficTrends[2].cached / 3500) * 120} 
                      L 350,${180 - (stats.cloudflare.trafficTrends[3].cached / 3500) * 120} 
                      L 466,${180 - (stats.cloudflare.trafficTrends[4].cached / 3500) * 120} 
                      L 583,${180 - (stats.cloudflare.trafficTrends[5].cached / 3500) * 120} 
                      L 700,${180 - (stats.cloudflare.trafficTrends[6].cached / 3500) * 120} 
                      L 700,200 Z`}
                  fill="url(#gradient-cached)"
                />

                {/* Line 2: Cached requests */}
                <path
                  d={`M 0,${180 - (stats.cloudflare.trafficTrends[0].cached / 3500) * 120} 
                      L 116,${180 - (stats.cloudflare.trafficTrends[1].cached / 3500) * 120} 
                      L 233,${180 - (stats.cloudflare.trafficTrends[2].cached / 3500) * 120} 
                      L 350,${180 - (stats.cloudflare.trafficTrends[3].cached / 3500) * 120} 
                      L 466,${180 - (stats.cloudflare.trafficTrends[4].cached / 3500) * 120} 
                      L 583,${180 - (stats.cloudflare.trafficTrends[5].cached / 3500) * 120} 
                      L 700,${180 - (stats.cloudflare.trafficTrends[6].cached / 3500) * 120}`}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            {/* Legend row */}
            <div className="flex justify-between items-center text-xs mt-3 border-t border-white/5 pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full" /> Total Requests
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full" /> Cached Requests
                </span>
              </div>
              <span className="text-[var(--color-muted)] font-mono font-semibold">Cache hit: {stats.cloudflare.cacheHitRatePercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. PLATFORM ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-fade-in">
          {/* Metric cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400"><Users size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-semibold">Unique Visitors Today</p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">{stats.calczen.visitorsToday.toLocaleString()}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400"><Activity size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-semibold">Calculator Calculations</p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">{stats.calczen.totalCalculatorUses.toLocaleString()}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-semibold">Newsletter Subscriptions</p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">{stats.calczen.newsletterSubscribers.toLocaleString()}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400"><Sparkles size={20} /></div>
              <div>
                <p className="text-xs text-[var(--color-muted)] font-semibold">Total Blog Views</p>
                <p className="text-lg sm:text-2xl font-bold text-white mt-0.5">{stats.calczen.blogViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Custom Visitors SVG bar chart */}
            <div className="lg:col-span-8 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
              <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <BarChart3 size={16} /> Visitors & Calculator Engagement (7-Day Trend)
              </h3>
              
              <div className="h-56 relative w-full pt-4 flex items-end justify-between px-2 gap-4">
                {/* 7 responsive columns of customized CSS/SVG bar elements representing traffic scale */}
                {stats.calczen.usageTrends.map((trend: any, idx: number) => {
                  const visitorsHeight = Math.max(10, Math.round((trend.visitors / 450) * 100));
                  const calcUsesHeight = Math.max(10, Math.round((trend.calcUses / 1500) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {/* Visitors Bar */}
                        <div 
                          className="w-2.5 sm:w-3.5 bg-indigo-500 rounded-t shadow-[0_0_8px_rgba(99,102,241,0.25)]"
                          style={{ height: `${visitorsHeight}%` }}
                          title={`Visitors: ${trend.visitors}`}
                        />
                        {/* Calculator Uses Bar */}
                        <div 
                          className="w-2.5 sm:w-3.5 bg-sky-400 rounded-t shadow-[0_0_8px_rgba(56,189,248,0.25)]"
                          style={{ height: `${calcUsesHeight}%` }}
                          title={`Calculation Runs: ${trend.calcUses}`}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--color-muted)] mt-2 font-mono">{trend.date}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs mt-3 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full" /> Visitors
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2.5 w-2.5 bg-sky-400 rounded-full" /> Calculation Runs
                </span>
              </div>
            </div>

            {/* Popular tools metrics details */}
            <div className="lg:col-span-4 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-indigo-400">Calculator Popularity</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                  <div className="text-xs text-[var(--color-muted)]">Popular Tool This Week</div>
                  <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                    {stats.calczen.popularCalculator}
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-white/5 bg-black/10 p-3 rounded">
                    <dt className="text-[var(--color-muted)] mb-1">Feedback Mail</dt>
                    <dd className="font-bold text-white">{stats.calczen.contactSubmissions} posts</dd>
                  </div>
                  <div className="border border-white/5 bg-black/10 p-3 rounded">
                    <dt className="text-[var(--color-muted)] mb-1">Mailing List</dt>
                    <dd className="font-bold text-white">{stats.calczen.newsletterSubscribers} users</dd>
                  </div>
                </dl>
              </div>

              <div className="text-[10px] text-[var(--color-muted)] mt-4 border-t border-white/5 pt-3 italic">
                Calculator stats are computed dynamically from real database telemetry.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ALERTS CENTER TAB */}
      {activeTab === "alerts" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <AlertTriangle size={16} /> Integrated Systems Status Log
            </h3>
            
            <div className="space-y-3">
              {stats.alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
                    alert.severity === "critical"
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : alert.severity === "warning"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="shrink-0 mt-0.5 sm:mt-0">
                      {alert.severity === "critical" ? (
                        <XCircle size={18} className="animate-pulse" />
                      ) : alert.severity === "warning" ? (
                        <AlertTriangle size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-[10px] border border-current px-1.5 py-0.5 rounded bg-black/10 mr-2">
                        {alert.service}
                      </span>
                      <span className="font-semibold">{alert.message}</span>
                    </div>
                  </div>
                  
                  <div className="text-[10px] opacity-70 font-mono self-end sm:self-center">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
