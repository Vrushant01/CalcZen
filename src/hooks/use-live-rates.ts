import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-config";

export interface LiveRatesData {
  gold24kPerGram: number;
  silverPerGram: number;
  currency: string;
  source: string;
  sourceUrl: string;
  updatedAt: string;
  stale: boolean;
}

const DEV_FALLBACK_RATES: LiveRatesData = {
  gold24kPerGram: 11781.74,
  silverPerGram: 147.44,
  currency: "INR",
  source: "Gold-API.com",
  sourceUrl: "https://gold-api.com",
  updatedAt: new Date().toISOString(),
  stale: false,
};

export function useLiveRates() {
  return useQuery<LiveRatesData | null>({
    queryKey: ["live-rates"],
    queryFn: async () => {
      try {
        let res: Response;
        try {
          res = await apiFetch("/rates");
        } catch (fetchErr) {
          // If local Express server (:3001) is not running in dev, fallback to production /api/rates
          if (import.meta.env.DEV) {
            try {
              res = await fetch("https://www.calczen.in/api/rates");
            } catch {
              return DEV_FALLBACK_RATES;
            }
          } else {
            throw fetchErr;
          }
        }

        if (!res.ok) {
          if (import.meta.env.DEV && !res.url?.includes("calczen.in")) {
            try {
              const fallback = await fetch("https://www.calczen.in/api/rates");
              if (fallback.ok) res = fallback;
            } catch {
              return DEV_FALLBACK_RATES;
            }
          }
        }

        if (!res.ok) {
          if (import.meta.env.DEV) {
            return DEV_FALLBACK_RATES;
          }
          return null;
        }

        const data = (await res.json()) as LiveRatesData & { available?: boolean };
        if (data.available === false || !data.gold24kPerGram || !data.silverPerGram) {
          if (import.meta.env.DEV) return DEV_FALLBACK_RATES;
          return null;
        }
        return data;
      } catch (err) {
        console.warn("[LIVE RATES HOOK] Could not fetch live rates:", err);
        if (import.meta.env.DEV) {
          return DEV_FALLBACK_RATES;
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: typeof window !== "undefined",
  });
}

/**
 * Converts a base rate per gram to a specific rate basis and purity.
 * Rounds to whole rupees for per-10g, per-tola, per-pavan, and per-kg;
 * rounds to 2 decimals for per-gram.
 */
export function convertRateToBasis(
  ratePerGram: number,
  basis: string = "per_gram",
  purityFactor: number = 1.0
): number {
  if (!ratePerGram || !isFinite(ratePerGram) || ratePerGram <= 0) return 0;
  const effectivePerGram = ratePerGram * (purityFactor > 0 ? purityFactor : 1.0);
  switch (basis) {
    case "per_10g":
      return Math.round(effectivePerGram * 10);
    case "per_tola":
      return Math.round(effectivePerGram * 11.6638038);
    case "per_pavan":
      return Math.round(effectivePerGram * 8);
    case "per_kg":
      return Math.round(effectivePerGram * 1000);
    case "per_gram":
    default:
      return Math.round(effectivePerGram * 100) / 100;
  }
}

export interface UseLiveRateDefaultOptions {
  metal: "gold" | "silver";
  basis?: string;
  purityFactor?: number;
  currentValue?: number | "";
  setValue: (val: any) => void;
  hasCalculated?: boolean;
}

export function useLiveRateDefault({
  metal,
  basis = "per_gram",
  purityFactor = 1.0,
  setValue,
  hasCalculated = false,
}: UseLiveRateDefaultOptions) {
  const { data: liveRates, isLoading } = useLiveRates();
  const [isUserEdited, setIsUserEdited] = useState(false);
  const isUserEditedRef = useRef(false);
  isUserEditedRef.current = isUserEdited;

  const getTargetLiveRate = useCallback(() => {
    if (!liveRates) return null;
    const basePerGram = metal === "gold" ? liveRates.gold24kPerGram : liveRates.silverPerGram;
    if (!basePerGram) return null;
    return convertRateToBasis(basePerGram, basis, purityFactor);
  }, [liveRates, metal, basis, purityFactor]);

  // When live rates arrive, or basis/purity changes before user edit or calculation
  useEffect(() => {
    if (isUserEditedRef.current || hasCalculated) return;
    const target = getTargetLiveRate();
    if (target !== null) {
      setValue(target);
    }
  }, [getTargetLiveRate, hasCalculated, setValue]);

  const onUserEdit = useCallback(() => {
    setIsUserEdited(true);
  }, []);

  const resetToLiveRate = useCallback(
    (staticDefault?: number) => {
      setIsUserEdited(false);
      isUserEditedRef.current = false;
      const target = getTargetLiveRate();
      if (target !== null) {
        setValue(target);
      } else if (staticDefault !== undefined) {
        setValue(staticDefault);
      }
    },
    [getTargetLiveRate, setValue]
  );

  const onUseLiveRate = useCallback(() => {
    setIsUserEdited(false);
    isUserEditedRef.current = false;
    const target = getTargetLiveRate();
    if (target !== null) {
      setValue(target);
    }
  }, [getTargetLiveRate, setValue]);

  return {
    liveRates,
    isLoading,
    isUserEdited,
    setIsUserEdited,
    onUserEdit,
    resetToLiveRate,
    onUseLiveRate,
  };
}
