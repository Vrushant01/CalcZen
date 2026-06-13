import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Item = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

type Props = {
  items: Item[];
};

const accentColors = [
  "bg-blue-500 dark:bg-blue-400",
  "bg-emerald-500 dark:bg-emerald-400",
  "bg-purple-500 dark:bg-purple-400",
  "bg-amber-500 dark:bg-amber-400",
];

export function RecommendationList({ items }: Props) {
  return (
    <div className="dashboard-recommendation-list flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="dashboard-recommendation-item flex items-start gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-soft"
        >
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white mt-0.5",
              accentColors[i % accentColors.length],
            )}
          >
            {item.icon ?? i + 1}
          </div>
          <div className="min-w-0">
            <div className="dashboard-recommendation-title text-sm font-semibold text-foreground">
              {item.title}
            </div>
            <div className="dashboard-recommendation-description mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {item.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
