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
