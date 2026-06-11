import { Info, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export type InsightTone = "info" | "success" | "warning" | "tip";

type Props = {
  text: string;
  tone?: InsightTone;
  icon?: React.ReactNode;
  index?: number;
};

const toneStyles: Record<InsightTone, { defaultIcon: React.ReactNode }> = {
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
};

export function InsightCard({ text, tone = "info", icon, index = 0 }: Props) {
  const s = toneStyles[tone];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      data-tone={tone}
      className="dashboard-insight-card flex items-start gap-3 rounded-xl border px-4 py-3"
    >
      <span className="dashboard-insight-icon">{icon ?? s.defaultIcon}</span>
      <p className="dashboard-insight-text text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}
