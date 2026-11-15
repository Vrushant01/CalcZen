import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-config";

export interface LiveRatesData {
  gold24kPerGram: number;
  silverPerGram: number;
  spotGold24kPerGram?: number;
  spotSilverPerGram?: number;
  multiplierGold?: number;
  multiplierSilver?: number;
  adjusted?: boolean;
  multiplierStale?: boolean;
  benchmark?: {
    name: "IBJA" | "MCX";
    updatedAt: string;
  } | null;
  currency: string;
  source: string;
  sourceUrl: string;
  updatedAt: string;
  stale: boolean;
  premiumPercent?: number;
}

export function useLiveRates() {
  return useQuery<LiveRatesData | null>({
    queryKey: ["live-rates"],
    queryFn: async () => {
      try {
        const res = await apiFetch("/rates");
        if (!res.ok) {
          return null;
        }

        const data = (await res.json()) as LiveRatesData & { available?: boolean };
        if (data.available === false || !data.gold24kPerGram || !data.silverPerGram) {
          return null;
        }
        return data;
      } catch (err) {
        console.warn("[LIVE RATES HOOK] Could not fetch live rates:", err);
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
    targetLiveRate: getTargetLiveRate(),
  };
}
