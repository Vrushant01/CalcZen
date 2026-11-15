import assert from "node:assert/strict";
import { RatesService } from "../src/services/ratesService.js";

async function runTests() {
  console.log("--- Starting RatesService Automated Unit Tests ---");

  // Helper mock for Gold-API (XAU = 311035 -> 10,000/g, XAG = 3110.35 -> 100/g)
  function createGoldApiMock(goldPerToz = 311035, silverPerToz = 3110.35) {
    return (url: string) => {
      if (url.includes("XAU")) {
        return new Response(
          JSON.stringify({
            name: "Gold",
            price: goldPerToz,
            updatedAt: "2026-11-15T10:00:00.000Z",
          }),
          { status: 200 }
        );
      }
      if (url.includes("XAG")) {
        return new Response(
          JSON.stringify({
            name: "Silver",
            price: silverPerToz,
            updatedAt: "2026-11-15T10:05:00.000Z",
          }),
          { status: 200 }
        );
      }
      return null;
    };
  }

  // 1. Multiplier computed correctly
  {
    console.log("Test 1: Multiplier computed correctly from IBJA benchmark");
    let metalsDevCalls = 0;
    const goldApiMock = createGoldApiMock(311035, 3110.35); // spot: 10,000/g gold, 100/g silver

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        metalsDevCalls++;
        return new Response(
          JSON.stringify({
            status: "success",
            authority: "ibja",
            currency: "INR",
            unit: "g",
            timestamp: "2026-11-15T10:00:00.000Z",
            rates: {
              ibja_gold: 11800, // 11800 / 10000 = 1.18
              ibja_silver: 120, // 120 / 100 = 1.20
            },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      multiplierTtlHours: 12,
      fetchFn: mockFetch,
    });

    const rates = await service.getRates();
    assert.ok(rates, "Rates must be returned");
    assert.equal(rates.spotGold24kPerGram, 10000);
    assert.equal(rates.spotSilverPerGram, 100);
    assert.equal(rates.multiplierGold, 1.18, "Gold multiplier should be 1.18");
    assert.equal(rates.multiplierSilver, 1.2, "Silver multiplier should be 1.20");
    assert.equal(rates.gold24kPerGram, 11800, "Gold visitor price should be 11,800");
    assert.equal(rates.silverPerGram, 120, "Silver visitor price should be 120");
    assert.equal(rates.adjusted, true);
    assert.equal(rates.benchmark?.name, "IBJA");
    assert.equal(rates.source, "Gold-API.com + IBJA via Metals.dev");
    assert.equal(metalsDevCalls, 1, "Metals.dev should be called exactly once");
    console.log("  ✓ Passed: Multiplier computed correctly and visitor rates adjusted.");
  }

  // 2. Refresh only when older than TTL
  {
    console.log("Test 2: Refresh only when older than TTL");
    let metalsDevCalls = 0;
    const goldApiMock = createGoldApiMock();

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        metalsDevCalls++;
        return new Response(
          JSON.stringify({
            status: "success",
            authority: "ibja",
            rates: { ibja_gold: 11500, ibja_silver: 115 },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      cacheTtlMinutes: 0.0001, // expire spot cache quickly
      multiplierTtlHours: 12,
      fetchFn: mockFetch,
    });

    // Call 1: triggers multiplier refresh
    await service.getRates();
    assert.equal(metalsDevCalls, 1);

    // Call 2: spot cache expired, but multiplier is fresh (< 12h)
    await service.getRates();
    assert.equal(metalsDevCalls, 1, "Should not refresh multiplier within TTL");

    // Artificially age the multiplier past 12h and let spot cache expire
    const stored = service.getStoredMultiplier();
    assert.ok(stored);
    stored.computedAt = new Date(Date.now() - 13 * 3600 * 1000).toISOString();
    await new Promise((r) => setTimeout(r, 20));

    // Call 3: should refresh multiplier now
    await service.getRates();
    assert.equal(metalsDevCalls, 2, "Should refresh multiplier when older than TTL");
    console.log("  ✓ Passed: Multiplier refreshed only when older than TTL.");
  }

  // 3. One provider call for 20 simultaneous requests
  {
    console.log("Test 3: One Metals.dev call for 20 simultaneous requests (lock deduplication)");
    let metalsDevCalls = 0;
    const goldApiMock = createGoldApiMock();

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        metalsDevCalls++;
        // Simulate network latency
        await new Promise((r) => setTimeout(r, 20));
        return new Response(
          JSON.stringify({
            status: "success",
            authority: "ibja",
            rates: { ibja_gold: 11600, ibja_silver: 116 },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      multiplierTtlHours: 12,
      fetchFn: mockFetch,
    });

    // Fire 20 simultaneous requests
    const results = await Promise.all(
      Array.from({ length: 20 }, () => service.getRates())
    );

    assert.equal(metalsDevCalls, 1, "Expected exactly 1 Metals.dev call across 20 concurrent requests");
    for (const r of results) {
      assert.ok(r);
      assert.equal(r.gold24kPerGram, 11600);
    }
    console.log("  ✓ Passed: Lock prevents parallel Metals.dev calls on 20 simultaneous requests.");
  }

  // 4. Budget exhausted keeps the old multiplier
  {
    console.log("Test 4: Budget exhausted keeps old multiplier");
    let metalsDevCalls = 0;
    const goldApiMock = createGoldApiMock();

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        metalsDevCalls++;
        return new Response(
          JSON.stringify({
            status: "success",
            authority: "ibja",
            rates: { ibja_gold: 11500, ibja_silver: 115 },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      multiplierTtlHours: 12,
      monthlyCallBudget: 2,
      fetchFn: mockFetch,
    });

    // Set call counter to budget limit (2/2)
    service.setCallsThisMonth(2);
    // Give it an expired multiplier
    service.resetCache(null, 0, {
      multiplierGold: 1.15,
      multiplierSilver: 1.15,
      authority: "IBJA",
      indianGoldRate: 11500,
      indianSilverRate: 115,
      spotGoldRate: 10000,
      spotSilverRate: 100,
      computedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), // expired
      metalsDevTimestamp: null,
    });

    const rates = await service.getRates();
    assert.ok(rates);
    assert.equal(metalsDevCalls, 0, "No Metals.dev calls should be made when budget is exhausted");
    assert.equal(rates.multiplierGold, 1.15, "Old multiplier must be kept");
    assert.equal(rates.multiplierStale, true, "Expired multiplier marked multiplierStale: true");
    console.log("  ✓ Passed: Budget exhausted suppresses provider calls and keeps old multiplier.");
  }

  // 5. Multiplier out of bounds rejected
  {
    console.log("Test 5: Multiplier out of bounds (< 1.0, > 1.4, or >8% deviation) rejected");
    const goldApiMock = createGoldApiMock();

    let returnedGoldRate = 8000; // 8000 / 10000 = 0.80 (< 1.00)
    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        return new Response(
          JSON.stringify({
            status: "success",
            authority: "ibja",
            rates: { ibja_gold: returnedGoldRate, ibja_silver: 115 },
          }),
          { status: 200 }
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      cacheTtlMinutes: 0.0001,
      multiplierTtlHours: 12,
      fetchFn: mockFetch,
    });

    // Seed with a good multiplier of 1.15
    service.resetCache(null, 0, {
      multiplierGold: 1.15,
      multiplierSilver: 1.15,
      authority: "IBJA",
      indianGoldRate: 11500,
      indianSilverRate: 115,
      spotGoldRate: 10000,
      spotSilverRate: 100,
      computedAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
      metalsDevTimestamp: null,
    });

    // Attempt 1: 0.80 multiplier (< 1.00 bound)
    let rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.multiplierGold, 1.15, "Should reject < 1.00 multiplier and keep 1.15");

    // Attempt 2: 1.50 multiplier (> 1.40 bound)
    returnedGoldRate = 15000;
    service.resetCache(null, 0, service.getStoredMultiplier());
    rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.multiplierGold, 1.15, "Should reject > 1.40 multiplier and keep 1.15");

    // Attempt 3: 10% change (1.15 -> 1.28 is ~11.3% deviation, max 8% allowed)
    returnedGoldRate = 12800;
    service.resetCache(null, 0, service.getStoredMultiplier());
    rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.multiplierGold, 1.15, "Should reject > 8% change and keep 1.15");

    // Attempt 4: 4% change (1.15 -> 1.196 is 4% change, within 8% allowed)
    returnedGoldRate = 11960;
    service.resetCache(null, 0, service.getStoredMultiplier());
    rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.multiplierGold, 1.196, "Valid multiplier within 8% should be accepted");
    console.log("  ✓ Passed: Out of bounds and >8% deviations correctly rejected.");
  }

  // 6. Sunday/holiday with no IBJA rate falls back to MCX or keeps previous multiplier
  {
    console.log("Test 6: No IBJA rate falls back to MCX; if both fail keeps previous multiplier");
    const goldApiMock = createGoldApiMock();
    let ibjaSucceeds = false;
    let mcxSucceeds = true;

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;

      if (u.includes("authority=ibja")) {
        if (!ibjaSucceeds) {
          // Empty or closed on Sunday
          return new Response(JSON.stringify({ status: "success", rates: {} }), { status: 200 });
        }
      }
      if (u.includes("authority=mcx")) {
        if (mcxSucceeds) {
          return new Response(
            JSON.stringify({
              status: "success",
              authority: "mcx",
              rates: { mcx_gold: 11700, mcx_silver: 117 },
            }),
            { status: 200 }
          );
        }
        return new Response("Service Unavailable", { status: 503 });
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevUrl: "https://mock.metals.dev",
      metalsDevApiKey: "test-key",
      multiplierTtlHours: 12,
      cacheTtlMinutes: 0.0001,
      fetchFn: mockFetch,
    });

    // 6a: IBJA fails -> MCX succeeds
    let rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.benchmark?.name, "MCX", "Should use MCX when IBJA has no rate");
    assert.equal(rates.multiplierGold, 1.17);
    assert.equal(rates.source, "Gold-API.com + MCX via Metals.dev");

    // 6b: Both fail -> keep previous multiplier
    mcxSucceeds = false;
    // Artificially age the multiplier and clear spot cache
    const stored = service.getStoredMultiplier();
    assert.ok(stored);
    stored.computedAt = new Date(Date.now() - 15 * 3600 * 1000).toISOString();
    service.resetCache(null, 0, stored);

    rates = await service.getRates();
    assert.ok(rates);
    assert.equal(rates.multiplierGold, 1.17, "Should retain previous multiplier when both fail");
    assert.equal(rates.multiplierStale, true, "Retained multiplier marked stale");
    console.log("  ✓ Passed: Fallback to MCX and retention of previous multiplier verified.");
  }

  // 7. Missing Metals.dev key falls back to RATES_INDIA_PREMIUM_PERCENT
  {
    console.log("Test 7: Missing Metals.dev key falls back to RATES_INDIA_PREMIUM_PERCENT (or 1.0)");
    const goldApiMock = createGoldApiMock();

    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      const goldRes = goldApiMock(u);
      if (goldRes) return goldRes;
      return new Response("Not found", { status: 404 });
    };

    // 7a: With positive manual premium (e.g. 15%)
    const serviceWithPremium = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevApiKey: "", // No key
      indiaPremiumPercent: 15,
      fetchFn: mockFetch,
    });

    const ratesWithPremium = await serviceWithPremium.getRates();
    assert.ok(ratesWithPremium);
    assert.equal(ratesWithPremium.multiplierGold, 1.15);
    assert.equal(ratesWithPremium.adjusted, true);
    assert.equal(ratesWithPremium.benchmark, null);
    assert.equal(ratesWithPremium.source, "Gold-API.com");

    // 7b: With 0% premium and no key -> multiplier 1.0 and adjusted: false
    const serviceZero = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      metalsDevApiKey: "",
      indiaPremiumPercent: 0,
      fetchFn: mockFetch,
    });

    const ratesZero = await serviceZero.getRates();
    assert.ok(ratesZero);
    assert.equal(ratesZero.multiplierGold, 1.0);
    assert.equal(ratesZero.multiplierSilver, 1.0);
    assert.equal(ratesZero.adjusted, false, "When multiplier is 1.0, adjusted must be false");
    assert.equal(ratesZero.benchmark, null);
    console.log("  ✓ Passed: Missing key falls back to premium percent, or 1.0 (adjusted: false).");
  }

  // 8. Both providers failing returns 503 { available: false } when no cache exists
  {
    console.log("Test 8: Failure without cache returns null (translates to 503 available:false)");
    const mockFailingFetch: typeof fetch = async () => {
      return new Response("Internal Server Error", { status: 500 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      fetchFn: mockFailingFetch,
    });

    const rates = await service.getRates();
    assert.equal(rates, null, "Should return null on provider failure when no cache exists");
    console.log("  ✓ Passed: Null returned on provider failure without cache.");
  }

  console.log("\nALL 8 AUTOMATED UNIT TESTS PASSED SUCCESSFULLY! ✓\n");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
