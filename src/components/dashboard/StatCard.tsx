import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatAccent = "blue" | "green" | "amber" | "red" | "purple" | "cyan" | "default";
export type StatTrend = "up" | "down" | "neutral";

type Props = {
  label: string;
  value: string;
  subValue?: string;
  accent?: StatAccent;
  trend?: StatTrend;
  trendLabel?: string;
  badge?: string;
  className?: string;
  index?: number;
};

type StatColors = CSSProperties & {
  "--stat-value-light": string;
  "--stat-value-dark": string;
  "--stat-badge-bg-light": string;
  "--stat-badge-bg-dark": string;
  "--stat-badge-border-light": string;
  "--stat-badge-border-dark": string;
  "--stat-badge-text-light": string;
  "--stat-badge-text-dark": string;
};

const accentStyles: Record<StatAccent, { bar: string; colors: StatColors }> = {
  blue: {
    bar: "bg-blue-500",
    colors: {
      "--stat-value-light": "#2563eb",
      "--stat-value-dark": "var(--color-blue-300)",
      "--stat-badge-bg-light": "#edf2fd",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-blue-950) 50%, transparent)",
      "--stat-badge-border-light": "#d4e0fb",
      "--stat-badge-border-dark": "var(--color-blue-800)",
      "--stat-badge-text-light": "#1d4ed8",
      "--stat-badge-text-dark": "var(--color-blue-300)",
    },
  },
  green: {
    bar: "bg-emerald-500",
    colors: {
      "--stat-value-light": "#047857",
      "--stat-value-dark": "var(--color-emerald-300)",
      "--stat-badge-bg-light": "#ecf9f5",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-emerald-950) 50%, transparent)",
      "--stat-badge-border-light": "#cff3e6",
      "--stat-badge-border-dark": "var(--color-emerald-800)",
      "--stat-badge-text-light": "#047857",
      "--stat-badge-text-dark": "var(--color-emerald-300)",
    },
  },
  amber: {
    bar: "bg-amber-500",
    colors: {
      "--stat-value-light": "#b45309",
      "--stat-value-dark": "var(--color-amber-300)",
      "--stat-badge-bg-light": "#fff7e7",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-amber-950) 50%, transparent)",
      "--stat-badge-border-light": "#fdecce",
      "--stat-badge-border-dark": "var(--color-amber-800)",
      "--stat-badge-text-light": "#92400e",
      "--stat-badge-text-dark": "var(--color-amber-300)",
    },
  },
  red: {
    bar: "bg-red-500",
    colors: {
      "--stat-value-light": "#dc2626",
      "--stat-value-dark": "var(--color-red-300)",
      "--stat-badge-bg-light": "#fef0f0",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-red-950) 50%, transparent)",
      "--stat-badge-border-light": "#fcdada",
      "--stat-badge-border-dark": "var(--color-red-800)",
      "--stat-badge-text-light": "#b91c1c",
      "--stat-badge-text-dark": "var(--color-red-300)",
    },
  },
  purple: {
    bar: "bg-purple-500",
    colors: {
      "--stat-value-light": "#9333ea",
      "--stat-value-dark": "var(--color-purple-300)",
      "--stat-badge-bg-light": "#f8f1fe",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-purple-950) 50%, transparent)",
      "--stat-badge-border-light": "#eeddfd",
      "--stat-badge-border-dark": "var(--color-purple-800)",
      "--stat-badge-text-light": "#7e22ce",
      "--stat-badge-text-dark": "var(--color-purple-300)",
    },
  },
  cyan: {
    bar: "bg-cyan-500",
    colors: {
      "--stat-value-light": "#0e7490",
      "--stat-value-dark": "var(--color-cyan-300)",
      "--stat-badge-bg-light": "#ebf9fc",
      "--stat-badge-bg-dark": "color-mix(in oklab, var(--color-cyan-950) 50%, transparent)",
      "--stat-badge-border-light": "#cdeff6",
      "--stat-badge-border-dark": "var(--color-cyan-800)",
      "--stat-badge-text-light": "#0e7490",
      "--stat-badge-text-dark": "var(--color-cyan-300)",
    },
  },
  default: {
    bar: "bg-accent",
    colors: {
      "--stat-value-light": "#0f172a",
      "--stat-value-dark": "var(--foreground)",
      "--stat-badge-bg-light": "#f3f3f4",
      "--stat-badge-bg-dark": "var(--muted)",
      "--stat-badge-border-light": "#e1e3e6",
      "--stat-badge-border-dark": "var(--border)",
      "--stat-badge-text-light": "#0f172a",
      "--stat-badge-text-dark": "var(--foreground)",
    },
  },
};

const trendIcon: Record<StatTrend, React.ReactNode> = {
  up: <TrendingUp className="h-3 w-3" />,
  down: <TrendingDown className="h-3 w-3" />,
  neutral: <Minus className="h-3 w-3" />,
};

const trendColor: Record<StatTrend, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-500 dark:text-red-400",
  neutral: "text-muted-foreground",
};

export function StatCard({
  label,
  value,
  subValue,
  accent = "default",
  trend,
  trendLabel,
  badge,
  className,
  index = 0,
}: Props) {
  const a = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      style={a.colors}
      className={cn(
        "dashboard-stat-card relative flex flex-col gap-1.5 overflow-hidden rounded-xl border p-4",
        className,
      )}
    >
      {/* accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl", a.bar)} />

      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="dashboard-stat-label truncate text-xs font-medium leading-tight">
          {label}
        </span>
        {badge && (
          <span
            className={cn(
              "dashboard-stat-badge shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="dashboard-stat-value text-xl font-bold leading-tight tracking-tight">
        {value}
      </div>

      {(subValue || trend) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {trend && (
            <span
              className={cn("flex items-center gap-0.5 text-xs font-medium", trendColor[trend])}
            >
              {trendIcon[trend]}
              {trendLabel}
            </span>
          )}
          {subValue && !trend && <span className="text-xs text-muted-foreground">{subValue}</span>}
        </div>
      )}
    </motion.div>
  );
}
