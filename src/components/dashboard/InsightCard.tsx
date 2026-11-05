import { Info, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

<<<<<<< HEAD
export type InsightTone = "info" | "success" | "warning" | "tip";

type Props = {
  text: string;
=======
export type InsightTone = "info" | "success" | "warning" | "tip" | "note";

type Props = {
  text?: string;
  title?: string;
  children?: React.ReactNode;
>>>>>>> 529569b (Deploy CalcZen V2)
  tone?: InsightTone;
  icon?: React.ReactNode;
  index?: number;
};

<<<<<<< HEAD
const toneStyles: Record<InsightTone, { defaultIcon: React.ReactNode }> = {
=======
const toneStyles: Record<string, { defaultIcon: React.ReactNode }> = {
>>>>>>> 529569b (Deploy CalcZen V2)
  info: {
    defaultIcon: <Info className="h-4 w-4 shrink-0 mt-0.5" />,
  },
  success: {
    defaultIcon: <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />,
  },
  warning: {
    defaultIcon: <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />,
  },
  tip: {
    defaultIcon: <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />,
  },
<<<<<<< HEAD
};

export function InsightCard({ text, tone = "info", icon, index = 0 }: Props) {
  const s = toneStyles[tone];
=======
  note: {
    defaultIcon: <Info className="h-4 w-4 shrink-0 mt-0.5" />,
  },
};

export function InsightCard({ text, title, children, tone = "info", icon, index = 0 }: Props) {
  const s = (tone && toneStyles[tone]) || toneStyles.info;
  const safeTone = tone && toneStyles[tone] ? (tone === "note" ? "info" : tone) : "info";
  const content = children ?? text;

>>>>>>> 529569b (Deploy CalcZen V2)
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
<<<<<<< HEAD
      data-tone={tone}
      className="dashboard-insight-card flex items-start gap-3 rounded-xl border px-4 py-3"
    >
      <span className="dashboard-insight-icon">{icon ?? s.defaultIcon}</span>
      <p className="dashboard-insight-text text-sm leading-relaxed">{text}</p>
=======
      data-tone={safeTone}
      className="dashboard-insight-card flex items-start gap-3 rounded-xl border px-4 py-3"
    >
      <span className="dashboard-insight-icon">{icon ?? s.defaultIcon}</span>
      <div className="flex flex-col flex-1 min-w-0">
        {title && (
          <span className="font-bold text-xs uppercase tracking-wider mb-0.5 opacity-90">
            {title}
          </span>
        )}
        <p className="dashboard-insight-text text-sm leading-relaxed">{content}</p>
      </div>
>>>>>>> 529569b (Deploy CalcZen V2)
    </motion.div>
  );
}
