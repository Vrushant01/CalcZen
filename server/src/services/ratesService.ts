import { env, hasDbConfig } from "../config/env.js";
import { getSupabase } from "../config/supabase.js";

export interface LiveRatesResponse {
  gold24kPerGram: number; // multiplied by multiplierGold
  silverPerGram: number; // multiplied by multiplierSilver
  spotGold24kPerGram: number;
  spotSilverPerGram: number;
  multiplierGold: number;
  multiplierSilver: number;
  adjusted: boolean;
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

export interface StoredMultiplier {
  multiplierGold: number;
  multiplierSilver: number;
  authority: "IBJA" | "MCX";
  indianGoldRate: number;
  indianSilverRate: number;
  spotGoldRate: number;
  spotSilverRate: number;
  computedAt: string;
  metalsDevTimestamp: string | null;
}

export interface RatesServiceOptions {
  apiUrl?: string;
  metalsDevUrl?: string;
  metalsDevApiKey?: string;
  cacheTtlMinutes?: number;
  multiplierTtlHours?: number;
  monthlyCallBudget?: number;
  indiaPremiumPercent?: number;
  fetchFn?: typeof fetch;
  supabaseClient?: any;
}

const TROY_OUNCE_IN_GRAMS = 31.1035;
const DEFAULT_TIMEOUT_MS = 8000;

export class RatesService {
  private apiUrl: string;
  private metalsDevUrl: string;
  private metalsDevApiKey: string;
  private cacheTtlMinutes: number;
  private multiplierTtlHours: number;
  private monthlyCallBudget: number;
  private indiaPremiumPercent: number;
  private fetchFn: typeof fetch;
  private customSupabaseClient: any;

  private cachedRates: LiveRatesResponse | null = null;
  private lastFetchTime = 0;
  private inFlightPromise: Promise<LiveRatesResponse | null> | null = null;

  // Multiplier state
  private storedMultiplier: StoredMultiplier | null = null;
  private callsThisMonth = 0;
  private callsMonth = "";
  private multiplierLock: Promise<void> | null = null;
  private dbLoaded = false;

  constructor(options?: RatesServiceOptions) {
    this.apiUrl = (options?.apiUrl ?? env.ratesApiUrl ?? "https://api.gold-api.com").replace(/\/$/, "");
    this.metalsDevUrl = (options?.metalsDevUrl ?? env.metalsDevApiUrl ?? "https://api.metals.dev").replace(/\/$/, "");
    this.metalsDevApiKey = options?.metalsDevApiKey ?? env.metalsDevApiKey ?? "";
    this.cacheTtlMinutes = Number(options?.cacheTtlMinutes ?? env.ratesCacheTtlMinutes ?? 5);
    this.multiplierTtlHours = Number(options?.multiplierTtlHours ?? env.ratesMultiplierTtlHours ?? 12);
    this.monthlyCallBudget = Number(options?.monthlyCallBudget ?? env.ratesMonthlyCallBudget ?? 60);
    this.indiaPremiumPercent = Number(options?.indiaPremiumPercent ?? env.ratesIndiaPremiumPercent ?? 0);
    this.fetchFn = options?.fetchFn ?? fetch;
    this.customSupabaseClient = options?.supabaseClient;
    this.callsMonth = this.getCurrentMonthString();
  }

  private getCurrentMonthString(): string {
    const d = new Date();
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  /** Expose for testing to clear or inject cache/multiplier */
  public resetCache(
    initialCache: LiveRatesResponse | null = null,
    lastFetchTime = 0,
    multiplier: StoredMultiplier | null = null
  ): void {
    this.cachedRates = initialCache;
    this.lastFetchTime = lastFetchTime;
    this.storedMultiplier = multiplier;
    this.inFlightPromise = null;
    this.multiplierLock = null;
    this.dbLoaded = true;
  }

  public setCallsThisMonth(count: number, month?: string): void {
    this.callsThisMonth = count;
    if (month) this.callsMonth = month;
  }

  public getCallsThisMonth(): number {
    return this.callsThisMonth;
  }

  public getStoredMultiplier(): StoredMultiplier | null {
    return this.storedMultiplier;
  }

  public getCachedRates(): LiveRatesResponse | null {
    return this.cachedRates;
  }

  private getSupabaseClient() {
    if (this.customSupabaseClient !== undefined) {
      return this.customSupabaseClient;
    }
    if (hasDbConfig()) {
      try {
        return getSupabase();
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Loads persisted multiplier & monthly call count from Supabase on cold start.
   */
  private async loadMultiplierFromDb(): Promise<void> {
    if (this.dbLoaded) return;
    this.dbLoaded = true;

    const supabase = this.getSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("rates_multiplier")
        .select("*")
        .eq("id", "current")
        .maybeSingle();

      if (error) {
        console.warn("[RATES SERVICE] Error loading rates_multiplier from Supabase:", error.message);
        return;
      }

      if (data) {
        this.storedMultiplier = {
          multiplierGold: Number(data.multiplier_gold),
          multiplierSilver: Number(data.multiplier_silver),
          authority: data.authority as "IBJA" | "MCX",
          indianGoldRate: Number(data.indian_gold_rate),
          indianSilverRate: Number(data.indian_silver_rate),
          spotGoldRate: Number(data.spot_gold_rate),
          spotSilverRate: Number(data.spot_silver_rate),
          computedAt: data.computed_at,
          metalsDevTimestamp: data.metals_dev_timestamp ?? null,
        };

        const currentMonth = this.getCurrentMonthString();
        if (data.calls_month === currentMonth) {
          this.callsThisMonth = Number(data.calls_this_month ?? 0);
          this.callsMonth = currentMonth;
        } else {
          this.callsThisMonth = 0;
          this.callsMonth = currentMonth;
        }
      }
    } catch (err) {
      console.warn("[RATES SERVICE] Failed to query Supabase rates_multiplier:", (err as Error).message);
    }
  }

  /**
   * Persists stored multiplier & monthly call count to Supabase.
   */
  private async persistMultiplierToDb(): Promise<void> {
    const supabase = this.getSupabaseClient();
    if (!supabase || !this.storedMultiplier) return;

    try {
      await supabase.from("rates_multiplier").upsert({
        id: "current",
        multiplier_gold: this.storedMultiplier.multiplierGold,
        multiplier_silver: this.storedMultiplier.multiplierSilver,
        authority: this.storedMultiplier.authority,
        indian_gold_rate: this.storedMultiplier.indianGoldRate,
        indian_silver_rate: this.storedMultiplier.indianSilverRate,
        spot_gold_rate: this.storedMultiplier.spotGoldRate,
        spot_silver_rate: this.storedMultiplier.spotSilverRate,
        computed_at: this.storedMultiplier.computedAt,
        metals_dev_timestamp: this.storedMultiplier.metalsDevTimestamp,
        calls_this_month: this.callsThisMonth,
        calls_month: this.callsMonth,
      });
    } catch (err) {
      console.warn("[RATES SERVICE] Failed to save rates_multiplier to Supabase:", (err as Error).message);
    }
  }

  /**
   * Main method to get live rates. Respects in-memory spot cache TTL (5 min),
   * deduplicates concurrent calls, and refreshes the multiplier lazily when expired.
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
      await this.loadMultiplierFromDb();
      const result = await this.fetchFromProviders();
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

  private async fetchGoldApiEndpoint(symbol: string): Promise<{ price: number; updatedAt: string }> {
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

  /**
   * Refreshes the multiplier if expired and budget allows, using a lock
   * to deduplicate concurrent requests.
   */
  private async maybeRefreshMultiplier(
    spotGoldPerGram: number,
    spotSilverPerGram: number
  ): Promise<void> {
    // If a refresh is already in flight, wait for it
    if (this.multiplierLock) {
      await this.multiplierLock;
      return;
    }

    const now = Date.now();
    const multiplierTtlMs = this.multiplierTtlHours * 3600 * 1000;

    const isExpired =
      !this.storedMultiplier ||
      now - new Date(this.storedMultiplier.computedAt).getTime() >= multiplierTtlMs;

    const currentMonth = this.getCurrentMonthString();
    if (this.callsMonth !== currentMonth) {
      this.callsThisMonth = 0;
      this.callsMonth = currentMonth;
    }

    const budgetAvailable = this.callsThisMonth < this.monthlyCallBudget;

    if (!isExpired || !this.metalsDevApiKey || !budgetAvailable) {
      return;
    }

    // Acquire lock
    let resolveLock!: () => void;
    this.multiplierLock = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });

    try {
      await this.executeBenchmarkRefresh(spotGoldPerGram, spotSilverPerGram);
    } finally {
      this.multiplierLock = null;
      resolveLock();
    }
  }

  private async callMetalsDevAuthority(authority: "ibja" | "mcx"): Promise<{
    authority: "IBJA" | "MCX";
    gold: number;
    silver: number;
    timestamp: string;
  } | null> {
    const url = `${this.metalsDevUrl}/v1/metal/authority?currency=INR&unit=g&authority=${authority}&api_key=${this.metalsDevApiKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const res = await this.fetchFn(url, { signal: controller.signal });
      if (!res.ok) {
        console.warn(`[RATES SERVICE] Metals.dev ${authority} returned HTTP ${res.status}`);
        return null;
      }

      const data = (await res.json()) as any;
      if (data?.status !== "success" || !data?.rates) {
        return null;
      }

      const goldKey = authority === "ibja" ? "ibja_gold" : "mcx_gold";
      const silverKey = authority === "ibja" ? "ibja_silver" : "mcx_silver";

      const goldRate = Number(data.rates[goldKey]);
      const silverRate = Number(data.rates[silverKey] ?? 0);

      if (!Number.isFinite(goldRate) || goldRate <= 0) {
        return null;
      }

      return {
        authority: authority.toUpperCase() as "IBJA" | "MCX",
        gold: goldRate,
        silver: Number.isFinite(silverRate) && silverRate > 0 ? silverRate : 0,
        timestamp: typeof data.timestamp === "string" ? data.timestamp : new Date().toISOString(),
      };
    } catch (err) {
      console.warn(`[RATES SERVICE] Failed calling Metals.dev (${authority}):`, (err as Error).message);
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  private async executeBenchmarkRefresh(
    spotGoldPerGram: number,
    spotSilverPerGram: number
  ): Promise<void> {
    // 1. Try IBJA first
    let result = await this.callMetalsDevAuthority("ibja");
    // Increment monthly call counter for the IBJA call
    this.callsThisMonth++;

    // 2. If IBJA unavailable/empty (e.g. Sunday/holiday), try MCX fallback if budget allows
    if (!result && this.callsThisMonth < this.monthlyCallBudget) {
      console.log("[RATES SERVICE] IBJA unavailable or no rate. Attempting fallback to MCX...");
      result = await this.callMetalsDevAuthority("mcx");
      this.callsThisMonth++;
    }

    if (!result) {
      console.warn("[RATES SERVICE] Both IBJA and MCX benchmark calls failed or had no rates. Keeping previous multiplier.");
      return;
    }

    const candidateGold = result.gold / spotGoldPerGram;
    const candidateSilver =
      result.silver > 0 && spotSilverPerGram > 0 ? result.silver / spotSilverPerGram : candidateGold;

    // Sanity bounds: accept only if finite, between 1.00 and 1.40, and within 8% of previous
    const isGoldValid = this.validateMultiplier(candidateGold, this.storedMultiplier?.multiplierGold);
    const isSilverValid = this.validateMultiplier(candidateSilver, this.storedMultiplier?.multiplierSilver);

    if (!isGoldValid || !isSilverValid) {
      console.warn(
        `[RATES SERVICE] Multiplier out of bounds or deviated >8% (gold: ${candidateGold.toFixed(
          4
        )}, silver: ${candidateSilver.toFixed(4)}). Keeping previous multiplier.`
      );
      return;
    }

    // Multipliers are valid: persist new state
    this.storedMultiplier = {
      multiplierGold: candidateGold,
      multiplierSilver: candidateSilver,
      authority: result.authority,
      indianGoldRate: result.gold,
      indianSilverRate: result.silver,
      spotGoldRate: spotGoldPerGram,
      spotSilverRate: spotSilverPerGram,
      computedAt: new Date().toISOString(),
      metalsDevTimestamp: result.timestamp,
    };

    await this.persistMultiplierToDb();
    console.log(
      `[RATES SERVICE] Multiplier successfully refreshed from ${result.authority}: Gold=${candidateGold.toFixed(
        4
      )}, Silver=${candidateSilver.toFixed(4)} (Monthly calls: ${this.callsThisMonth}/${this.monthlyCallBudget})`
    );
  }

  private validateMultiplier(multiplier: number, previous?: number): boolean {
    if (!Number.isFinite(multiplier) || multiplier < 1.0 || multiplier > 1.4) {
      return false;
    }
    if (previous !== undefined && Number.isFinite(previous) && previous > 0) {
      const diff = Math.abs(multiplier - previous) / previous;
      if (diff > 0.08) {
        return false;
      }
    }
    return true;
  }

  private async fetchFromProviders(): Promise<LiveRatesResponse> {
    // 1. Fetch live spot prices from Gold-API.com
    const [goldRes, silverRes] = await Promise.all([
      this.fetchGoldApiEndpoint("XAU"),
      this.fetchGoldApiEndpoint("XAG"),
    ]);

    const spotGoldPerGram = goldRes.price / TROY_OUNCE_IN_GRAMS;
    const spotSilverPerGram = silverRes.price / TROY_OUNCE_IN_GRAMS;

    if (!Number.isFinite(spotGoldPerGram) || spotGoldPerGram <= 0) {
      throw new Error(`Sanity check failed: spot gold rate is invalid (${spotGoldPerGram})`);
    }
    if (!Number.isFinite(spotSilverPerGram) || spotSilverPerGram <= 0) {
      throw new Error(`Sanity check failed: spot silver rate is invalid (${spotSilverPerGram})`);
    }

    // 2. Lazily refresh multiplier if needed
    await this.maybeRefreshMultiplier(spotGoldPerGram, spotSilverPerGram);

    // 3. Fallback order for multiplier:
    // Stored multiplier -> RATES_INDIA_PREMIUM_PERCENT -> 1.0
    const now = Date.now();
    const multiplierTtlMs = this.multiplierTtlHours * 3600 * 1000;

    let multiplierGold = 1.0;
    let multiplierSilver = 1.0;
    let adjusted = false;
    let multiplierStale: boolean | undefined = undefined;
    let benchmark: { name: "IBJA" | "MCX"; updatedAt: string } | null = null;
    let source = "Gold-API.com";
    let premiumPercent: number | undefined = undefined;

    if (this.storedMultiplier) {
      multiplierGold = this.storedMultiplier.multiplierGold;
      multiplierSilver = this.storedMultiplier.multiplierSilver;
      adjusted = true;
      const isExpired =
        now - new Date(this.storedMultiplier.computedAt).getTime() >= multiplierTtlMs;
      if (isExpired) {
        multiplierStale = true;
      }
      benchmark = {
        name: this.storedMultiplier.authority,
        updatedAt: this.storedMultiplier.metalsDevTimestamp || this.storedMultiplier.computedAt,
      };
      source = `Gold-API.com + ${this.storedMultiplier.authority} via Metals.dev`;
    } else if (this.indiaPremiumPercent > 0) {
      const factor = 1 + this.indiaPremiumPercent / 100;
      multiplierGold = factor;
      multiplierSilver = factor;
      adjusted = true;
      source = "Gold-API.com";
      premiumPercent = this.indiaPremiumPercent;
    } else {
      multiplierGold = 1.0;
      multiplierSilver = 1.0;
      adjusted = false;
      source = "Gold-API.com";
    }

    const gold24kPerGram = Math.round(spotGoldPerGram * multiplierGold * 100) / 100;
    const finalSilverPerGram = Math.round(spotSilverPerGram * multiplierSilver * 100) / 100;

    // Check against previous cached live rates for runaway 15% spikes
    if (this.cachedRates) {
      const goldDiff = Math.abs(gold24kPerGram - this.cachedRates.gold24kPerGram) / this.cachedRates.gold24kPerGram;
      if (goldDiff > 0.15) {
        throw new Error(
          `Sanity check failed: gold rate changed by ${(goldDiff * 100).toFixed(1)}% (max 15% allowed)`
        );
      }
      const silverDiff =
        Math.abs(finalSilverPerGram - this.cachedRates.silverPerGram) / this.cachedRates.silverPerGram;
      if (silverDiff > 0.15) {
        throw new Error(
          `Sanity check failed: silver rate changed by ${(silverDiff * 100).toFixed(1)}% (max 15% allowed)`
        );
      }
    }

    const goldTime = new Date(goldRes.updatedAt).getTime();
    const silverTime = new Date(silverRes.updatedAt).getTime();
    const olderUpdatedAt = goldTime <= silverTime ? goldRes.updatedAt : silverRes.updatedAt;

    const response: LiveRatesResponse = {
      gold24kPerGram,
      silverPerGram: finalSilverPerGram,
      spotGold24kPerGram: Math.round(spotGoldPerGram * 100) / 100,
      spotSilverPerGram: Math.round(spotSilverPerGram * 100) / 100,
      multiplierGold: Math.round(multiplierGold * 10000) / 10000,
      multiplierSilver: Math.round(multiplierSilver * 10000) / 10000,
      adjusted,
      ...(multiplierStale !== undefined ? { multiplierStale } : {}),
      benchmark,
      currency: "INR",
      source,
      sourceUrl: "https://gold-api.com",
      updatedAt: olderUpdatedAt,
      stale: false,
      ...(premiumPercent !== undefined ? { premiumPercent } : {}),
    };

    return response;
  }
}

export const ratesService = new RatesService();
