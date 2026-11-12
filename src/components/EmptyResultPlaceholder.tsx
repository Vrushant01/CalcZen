import React from "react";
import { Calculator } from "lucide-react";

interface EmptyResultPlaceholderProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

export function EmptyResultPlaceholder({
  message = "Ready to calculate",
  subMessage = "Enter your details and press Calculate to see your result.",
  className = "",
}: EmptyResultPlaceholderProps) {
  return (
    <div
      className={`p-8 sm:p-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center gap-3 transition-colors ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Calculator className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{message}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">{subMessage}</p>
      </div>
    </div>
  );
}

