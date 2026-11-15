import { env } from "../config/env.js";

export interface LiveRatesResponse {
  gold24kPerGram: number;
  silverPerGram: number;
  currency: string;
  source: string;
  sourceUrl: string;
  updatedAt: string;
  stale: boolean;
}

export interface RatesServiceOptions {
  apiUrl?: string;
  cacheTtlMinutes?: number;
  indiaPremiumPercent?: number;
  fetchFn?: typeof fetch;
}

const TROY_OUNCE_IN_GRAMS = 31.1035;
const DEFAULT_TIMEOUT_MS = 8000;

export class RatesService {
  private apiUrl: string;
  private cacheTtlMinutes: number;
  private indiaPremiumPercent: number;
  private fetchFn: typeof fetch;

  private cachedRates: LiveRatesResponse | null = null;
  private lastFetchTime = 0;
  private inFlightPromise: Promise<LiveRatesResponse | null> | null = null;

  constructor(options?: RatesServiceOptions) {
    this.apiUrl = (options?.apiUrl ?? env.ratesApiUrl ?? "https://api.gold-api.com").replace(/\/$/, "");
    this.cacheTtlMinutes = Number(options?.cacheTtlMinutes ?? env.ratesCacheTtlMinutes ?? 5);
    this.indiaPremiumPercent = Number(options?.indiaPremiumPercent ?? env.ratesIndiaPremiumPercent ?? 0);
    this.fetchFn = options?.fetchFn ?? fetch;
  }

  /** Expose for testing to clear or inject cache */
  public resetCache(initialCache: LiveRatesResponse | null = null, lastFetchTime = 0): void {
    this.cachedRates = initialCache;
    this.lastFetchTime = lastFetchTime;
    this.inFlightPromise = null;
  }

  public getCachedRates(): LiveRatesResponse | null {
    return this.cachedRates;
  }

  /**
   * Main method to get rates. Deduplicates concurrent in-flight requests and
   * respects the in-memory cache TTL.
   */
  public async getRates(): Promise<LiveRatesResponse | null> {
    const now = Date.now();
    const ttlMs = this.cacheTtlMinutes * 60 * 1000;

    // Cache hit and still fresh
    if (this.cachedRates && now - this.lastFetchTime < ttlMs) {
      return { ...this.cachedRates, stale: false };
    }

    // Deduplicate in-flight fetch
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    this.inFlightPromise = this.fetchAndCacheRates().finally(() => {
      this.inFlightPromise = null;
    });

    return this.inFlightPromise;
  }

  private async fetchAndCacheRates(): Promise<LiveRatesResponse | null> {
    try {
      const result = await this.fetchFromProvider();
      this.cachedRates = result;
      this.lastFetchTime = Date.now();
      return { ...result, stale: false };
    } catch (err) {
      console.warn("[RATES SERVICE] Failed to fetch fresh live rates:", (err as Error).message);
      if (this.cachedRates) {
        return { ...this.cachedRates, stale: true };
      }
      return null;
    }
  }

  private async fetchEndpoint(symbol: string): Promise<{ price: number; updatedAt: string }> {
    const url = `${this.apiUrl}/price/${symbol}/INR`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const res = await this.fetchFn(url, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${url}`);
      }
      const data = (await res.json()) as { price?: unknown; updatedAt?: unknown };
      const price = Number(data.price);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price value for ${symbol}: ${data.price}`);
      }

      let updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";
      if (!updatedAt || Number.isNaN(Date.parse(updatedAt))) {
        updatedAt = new Date().toISOString();
      }

      return { price, updatedAt };
    } finally {
      clearTimeout(timer);
    }
  }

  private async fetchFromProvider(): Promise<LiveRatesResponse> {
    const [goldRes, silverRes] = await Promise.all([
      this.fetchEndpoint("XAU"),
      this.fetchEndpoint("XAG"),
    ]);

    // Convert from Troy Ounce to per gram
    let goldPerGram = goldRes.price / TROY_OUNCE_IN_GRAMS;
    let silverPerGram = silverRes.price / TROY_OUNCE_IN_GRAMS;

    // Sanity checks 1 & 2: Finite and > 0
    if (!Number.isFinite(goldPerGram) || goldPerGram <= 0) {
      throw new Error(`Sanity check failed: gold rate is invalid (${goldPerGram})`);
    }
    if (!Number.isFinite(silverPerGram) || silverPerGram <= 0) {
      throw new Error(`Sanity check failed: silver rate is invalid (${silverPerGram})`);
    }

    // Apply optional India premium if set
    if (this.indiaPremiumPercent > 0) {
      goldPerGram *= 1 + this.indiaPremiumPercent / 100;
      silverPerGram *= 1 + this.indiaPremiumPercent / 100;
    }

    // Round to 2 decimals for per-gram storage
    const gold24kPerGram = Math.round(goldPerGram * 100) / 100;
    const finalSilverPerGram = Math.round(silverPerGram * 100) / 100;

    // Sanity check 3: Differ by > 15% from last good value
    if (this.cachedRates) {
      const goldDiff = Math.abs(gold24kPerGram - this.cachedRates.gold24kPerGram) / this.cachedRates.gold24kPerGram;
      if (goldDiff > 0.15) {
        throw new Error(
          `Sanity check failed: gold rate changed by ${(goldDiff * 100).toFixed(1)}% (max 15% allowed)`,
        );
      }
      const silverDiff =
        Math.abs(finalSilverPerGram - this.cachedRates.silverPerGram) / this.cachedRates.silverPerGram;
      if (silverDiff > 0.15) {
        throw new Error(
          `Sanity check failed: silver rate changed by ${(silverDiff * 100).toFixed(1)}% (max 15% allowed)`,
        );
      }
    }

    // Determine the older of the two timestamps
    const goldTime = new Date(goldRes.updatedAt).getTime();
    const silverTime = new Date(silverRes.updatedAt).getTime();
    const olderUpdatedAt = goldTime <= silverTime ? goldRes.updatedAt : silverRes.updatedAt;

    return {
      gold24kPerGram,
      silverPerGram: finalSilverPerGram,
      currency: "INR",
      source: "Gold-API.com",
      sourceUrl: "https://gold-api.com",
      updatedAt: olderUpdatedAt,
      stale: false,
    };
  }
}

export const ratesService = new RatesService();
