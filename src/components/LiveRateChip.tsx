import React, { useMemo } from "react";
import type { LiveRatesData } from "@/hooks/use-live-rates";

interface LiveRateChipProps {
  liveRates: LiveRatesData | null | undefined;
  isUserEdited: boolean;
  onUseLiveRate: () => void;
  className?: string;
}

export function LiveRateChip({
  liveRates,
  isUserEdited,
  onUseLiveRate,
  className = "",
}: LiveRateChipProps) {
  const formattedTime = useMemo(() => {
    if (!liveRates?.updatedAt) return "";
    try {
      const d = new Date(liveRates.updatedAt);
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(d).toUpperCase();
    } catch {
      return "";
    }
  }, [liveRates?.updatedAt]);

  // While loading or if rates unavailable, render nothing to avoid layout shift
  if (!liveRates || !liveRates.updatedAt) {
    return null;
  }

  return (
    <div className={`text-xs text-muted-foreground mt-2 space-y-1 ${className}`}>
      <div className="flex flex-wrap items-center gap-1.5 leading-tight">
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live rate
        </span>
        {formattedTime && (
          <>
            <span>·</span>
            <span>updated {formattedTime} IST</span>
          </>
        )}
        <span>·</span>
        <span>
          Source:{" "}
          <a
            href={liveRates.sourceUrl || "https://gold-api.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {liveRates.source || "Gold-API.com"}
          </a>
        </span>
        {isUserEdited && (
          <button
            type="button"
            onClick={onUseLiveRate}
            className="text-primary hover:underline font-semibold ml-1 cursor-pointer"
          >
            Use live rate
          </button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground leading-normal">
        Indicative market rate. Check your jeweller's rate for the final price.
      </p>
    </div>
  );
}
