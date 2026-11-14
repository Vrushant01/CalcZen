import { Info, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export type InsightTone = "info" | "success" | "warning" | "tip" | "note";

type Props = {
  text?: string;
  title?: string;
  children?: React.ReactNode;
  tone?: InsightTone;
  type?: InsightTone;
  icon?: React.ReactNode;
  index?: number;
};

const toneStyles: Record<string, { defaultIcon: React.ReactNode }> = {
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
  note: {
    defaultIcon: <Info className="h-4 w-4 shrink-0 mt-0.5" />,
  },
};

export function InsightCard({ text, title, children, tone = "info", type, icon, index = 0 }: Props) {
  const effectiveTone = type ?? tone;
  const s = (effectiveTone && toneStyles[effectiveTone]) || toneStyles.info;
  const safeTone = effectiveTone && toneStyles[effectiveTone] ? (effectiveTone === "note" ? "info" : effectiveTone) : "info";
  const content = children ?? text;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
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
    </motion.div>
  );
}
