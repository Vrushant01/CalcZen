import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutdatedResultBannerProps {
  onCalculate?: () => void;
  message?: string;
  className?: string;
}

export function OutdatedResultBanner({
  onCalculate,
  message = "Your inputs have changed. Press Calculate to update your result.",
  className = "",
}: OutdatedResultBannerProps) {
  return (
    <div
      role="alert"
      className={`p-3.5 sm:p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{message}</span>
      </div>
      {onCalculate && (
        <Button
          type="button"
          size="sm"
          onClick={onCalculate}
          className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 font-semibold text-xs px-3 py-1.5 h-8 gap-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Update Result
        </Button>
      )}
    </div>
  );
}

