import React, { useMemo } from "react";
import { useLiveRates } from "@/hooks/use-live-rates";
import { Coins, Sparkles } from "lucide-react";

export function GoldSilverRateCard() {
  const { data, isLoading } = useLiveRates();

  const formattedTime = useMemo(() => {
    if (!data?.updatedAt) return "";
    try {
      const d = new Date(data.updatedAt);
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(d).toUpperCase();
    } catch {
      return "";
    }
  }, [data?.updatedAt]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="surface-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-border/60 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-muted rounded-md" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Unavailable -> render nothing
  if (!data || !data.gold24kPerGram || !data.silverPerGram) {
    return null;
  }

  const gold24k = data.gold24kPerGram;
  const gold22k = gold24k * (22 / 24);
  const gold18k = gold24k * (18 / 24);
  const silver = data.silverPerGram;

  return (
    <div className="surface-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                Today's Gold &amp; Silver Rate
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Indicative
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live market benchmark rates for jewellery valuation in India
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Rates */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* 24K Gold */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Gold 24K</span>
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">999 Pure</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold tracking-tight text-foreground">
            ₹{Math.round(gold24k * 10).toLocaleString("en-IN")}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">/ 10g</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ₹{gold24k.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / g
          </div>
        </div>

        {/* 22K Gold */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Gold 22K</span>
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">916 Hallmark</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold tracking-tight text-amber-700 dark:text-amber-300">
            ₹{Math.round(gold22k * 10).toLocaleString("en-IN")}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">/ 10g</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ₹{gold22k.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / g
          </div>
        </div>

        {/* 18K Gold */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Gold 18K</span>
            <span className="text-[10px] font-medium text-muted-foreground">750 Diamond</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold tracking-tight text-foreground">
            ₹{gold18k.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">/ g</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ₹{Math.round(gold18k * 10).toLocaleString("en-IN")} / 10g
          </div>
        </div>

        {/* Silver */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-border/70 bg-card/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Silver 999</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Pure Bullion</span>
          </div>
          <div className="mt-1 text-base sm:text-lg font-bold tracking-tight text-foreground">
            ₹{silver.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">/ g</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ₹{Math.round(silver * 1000).toLocaleString("en-IN")} / kg
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-muted-foreground">
        <div>
          {formattedTime ? `Updated ${formattedTime} IST · ` : ""}
          Source:{" "}
          <a
            href={data.sourceUrl || "https://gold-api.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {data.source || "Gold-API.com"}
          </a>
        </div>
        <p>Indicative market rate. Check your jeweller's rate for the final price.</p>
      </div>
    </div>
  );
}
