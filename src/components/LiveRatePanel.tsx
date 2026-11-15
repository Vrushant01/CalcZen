import React, { useMemo } from "react";
import { useLiveRates } from "@/hooks/use-live-rates";
import { cn } from "@/lib/utils";

export interface LiveRatePanelProps {
  metal: "gold" | "silver";
  rateInUse: number | "";
  rateBasis?: string;
  purityLabel?: string;
  isUserEdited: boolean;
  onUseLiveRate?: () => void;
  className?: string;
}

function formatISTTime(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const timeStr = d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${timeStr} IST`;
  } catch {
    return "";
  }
}

function formatISTDate(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function formatNumber(num: number | ""): string {
  if (num === "" || num === undefined || isNaN(Number(num))) return "0";
  return Number(num).toLocaleString("en-IN");
}

function getBasisDisplay(basis?: string): string {
  switch (basis) {
    case "per_10g":
      return "10g";
    case "per_tola":
      return "tola";
    case "per_pavan":
      return "pavan";
    case "per_kg":
      return "kg";
    case "per_gram":
    default:
      return "gram";
  }
}

export function LiveRatePanel({
  metal,
  rateInUse,
  rateBasis = "per_gram",
  purityLabel,
  isUserEdited,
  onUseLiveRate,
  className,
}: LiveRatePanelProps) {
  const { data: liveRates, isLoading } = useLiveRates();

  // Skeleton while loading: avoids layout shift
  if (isLoading && !liveRates) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/70 bg-card/40 p-3 sm:p-4 mb-4 sm:mb-5 min-h-[140px] w-full",
          className
        )}
        aria-hidden="true"
      >
        <div className="h-4 w-36 bg-muted/60 rounded animate-pulse mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <div className="h-12 bg-muted/40 rounded animate-pulse" />
          <div className="h-12 bg-muted/40 rounded animate-pulse" />
          <div className="h-12 bg-muted/40 rounded animate-pulse hidden sm:block" />
        </div>
        <div className="h-6 w-full bg-muted/40 rounded animate-pulse" />
      </div>
    );
  }

  // If rates are unavailable or not loaded: hide the whole section per rule
  if (!liveRates || !liveRates.gold24kPerGram || !liveRates.silverPerGram) {
    return null;
  }

  const updatedTime = formatISTTime(liveRates.updatedAt);
  const gold24k = liveRates.gold24kPerGram;
  const gold22k = Math.round(gold24k * (22 / 24) * 100) / 100;
  const gold18k = Math.round(gold24k * (18 / 24) * 100) / 100;
  const silverGram = liveRates.silverPerGram;
  const silverKg = Math.round(silverGram * 1000);

  const displayPurity = purityLabel || (metal === "gold" ? "24K" : "Silver");
  const benchmarkName = liveRates.benchmark?.name || "IBJA";
  const benchmarkTime = formatISTTime(liveRates.benchmark?.updatedAt);
  const benchmarkDate = formatISTDate(liveRates.benchmark?.updatedAt);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/60 p-3 sm:p-4 mb-4 sm:mb-5 text-foreground shadow-xs w-full min-w-0 transition-colors",
        className
      )}
    >
      {/* Title */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border/50">
        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
          {metal === "gold" ? "Live Gold Rate (India)" : "Live Silver Rate (India)"}
        </h3>
        {liveRates.stale && (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            (Cached)
          </span>
        )}
      </div>

      {/* Precious Metal Rates Grid */}
      {metal === "gold" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
          {/* 24K Benchmark */}
          <div className="rounded-lg bg-muted/40 border border-border/50 p-2 sm:p-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              24K Pure Gold
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
              ₹{formatNumber(gold24k)}
              <span className="text-[11px] font-normal text-muted-foreground"> /g</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              ₹{formatNumber(Math.round(gold24k * 10))} /10g
            </div>
          </div>

          {/* 22K Standard */}
          <div className="rounded-lg bg-muted/40 border border-border/50 p-2 sm:p-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              22K (916 Hallmark)
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
              ₹{formatNumber(gold22k)}
              <span className="text-[11px] font-normal text-muted-foreground"> /g</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              ₹{formatNumber(Math.round(gold24k * (22 / 24) * 10))} /10g
            </div>
          </div>

          {/* 18K Diamond / Luxury */}
          <div className="rounded-lg bg-muted/40 border border-border/50 p-2 sm:p-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              18K (750 Hallmark)
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
              ₹{formatNumber(gold18k)}
              <span className="text-[11px] font-normal text-muted-foreground"> /g</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              ₹{formatNumber(Math.round(gold24k * (18 / 24) * 10))} /10g
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
          {/* Silver Per Gram */}
          <div className="rounded-lg bg-muted/40 border border-border/50 p-2 sm:p-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              999 Fine Silver (Per Gram)
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
              ₹{formatNumber(silverGram)}
              <span className="text-[11px] font-normal text-muted-foreground"> /g</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              ₹{formatNumber(Math.round(silverGram * 10))} /10g
            </div>
          </div>

          {/* Silver Per Kg */}
          <div className="rounded-lg bg-muted/40 border border-border/50 p-2 sm:p-2.5">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              999 Fine Silver (Per Kg)
            </div>
            <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
              ₹{formatNumber(silverKg)}
              <span className="text-[11px] font-normal text-muted-foreground"> /kg</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              ₹{formatNumber(Math.round(silverGram * 11.6638038))} /tola
            </div>
          </div>
        </div>
      )}

      {/* Highlighted Line: Rate used in this calculator */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 sm:p-2.5 rounded-lg bg-primary/5 border border-primary/15 my-2.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm font-medium text-foreground">
          <span>Rate used in this calculator:</span>
          <span className="font-bold text-foreground">
            ₹{formatNumber(rateInUse)} per {getBasisDisplay(rateBasis)} ({displayPurity})
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isUserEdited ? (
            <>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Edited by you
              </span>
              {onUseLiveRate && (
                <button
                  type="button"
                  onClick={onUseLiveRate}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Use live rate
                </button>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Transparency Line */}
      <div className="text-xs text-muted-foreground pb-2 leading-relaxed">
        {liveRates.adjusted ? (
          liveRates.multiplierStale ? (
            <span>Benchmark last updated {benchmarkDate}</span>
          ) : (
            <span>Based on {benchmarkName} benchmark, updated {benchmarkTime || updatedTime}</span>
          )
        ) : (
          <span>International spot price converted to INR. Indian shop rates are usually higher.</span>
        )}
      </div>

      {/* Footer Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 flex-wrap">
          {updatedTime && <span>Updated {updatedTime}</span>}
          <span>·</span>
          <span>
            Source:{" "}
            <a
              href="https://gold-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Gold-API.com
            </a>
            {liveRates.adjusted && liveRates.benchmark?.name ? (
              <>
                {" + "}
                <a
                  href="https://metals.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  {liveRates.benchmark.name} via Metals.dev
                </a>
              </>
            ) : null}
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-muted-foreground/80">
          Indicative market rate. Excludes GST and making charges. Check your jeweller's rate for the final price.
        </div>
      </div>
    </div>
  );
}
