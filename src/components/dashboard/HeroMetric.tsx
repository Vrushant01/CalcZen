import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  sub?: string;
  badge?: { text: string; color?: "green" | "blue" | "amber" | "red" | "purple" | "default" };
  glow?: string; // CSS color for radial glow e.g. "#10b981"
  className?: string;
};

const badgeColors = {
  green:   "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  blue:    "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  amber:   "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  red:     "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/60 dark:text-red-300",
  purple:  "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  default: "border-border bg-muted text-muted-foreground",
};

export function HeroMetric({ label, value, sub, badge, glow, className }: Props) {
  return (
    <div className={cn("dashboard-hero-metric relative rounded-2xl border border-border/60 bg-card px-6 py-5 shadow-soft overflow-hidden", className)}>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 opacity-10 blur-2xl -z-10"
          style={{ background: `radial-gradient(circle at 30% 60%, ${glow}, transparent 70%)` }}
        />
      )}

      <div className="dashboard-hero-label text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="dashboard-hero-value text-gradient text-4xl font-extrabold leading-none tracking-tight"
        >
          {value}
        </motion.div>

        {badge && (
          <span className={cn(
            "dashboard-hero-badge mb-0.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
            badgeColors[badge.color ?? "default"]
          )}>
            {badge.text}
          </span>
        )}
      </div>

      {sub && (
        <div className="dashboard-hero-sub mt-2 text-sm text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}
