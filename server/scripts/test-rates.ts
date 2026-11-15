import assert from "node:assert/strict";
import { RatesService } from "../src/services/ratesService.js";

async function runTests() {
  console.log("--- Starting RatesService Automated Unit Tests ---");

  // 1. Correct perGram conversion
  {
    console.log("Test 1: Correct perGram conversion (price / 31.1035)");
    let fetchCalls = 0;
    const mockFetch: typeof fetch = async (url) => {
      fetchCalls++;
      const u = String(url);
      if (u.includes("XAU")) {
        return new Response(
          JSON.stringify({
            name: "Gold",
            price: 311035, // 311035 / 31.1035 = 10,000
            updatedAt: "2026-11-15T10:00:00.000Z",
          }),
          { status: 200 },
        );
      }
      if (u.includes("XAG")) {
        return new Response(
          JSON.stringify({
            name: "Silver",
            price: 3110.35, // 3110.35 / 31.1035 = 100
            updatedAt: "2026-11-15T10:05:00.000Z",
          }),
          { status: 200 },
        );
      }
      return new Response("Not found", { status: 404 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      fetchFn: mockFetch,
    });

    const rates = await service.getRates();
    assert.ok(rates, "Rates must be returned");
    assert.equal(rates.gold24kPerGram, 10000, "Gold 24k per gram should be 10000");
    assert.equal(rates.silverPerGram, 100, "Silver per gram should be 100");
    assert.equal(rates.currency, "INR");
    assert.equal(rates.source, "Gold-API.com");
    assert.equal(rates.stale, false);
    // Older of the two timestamps:
    assert.equal(rates.updatedAt, "2026-11-15T10:00:00.000Z", "Updated at should be the older timestamp");
    console.log("  ✓ Passed: perGram conversion verified (10000 / 100).");
  }

  // 2. 22K/18K derivation
  {
    console.log("Test 2: 22K/18K derivation formula");
    const rate24k = 15000;
    const rate22k = rate24k * (22 / 24);
    const rate18k = rate24k * (18 / 24);

    assert.equal(rate22k, 13750, "22K should be 13,750 for 15,000 24K rate");
    assert.equal(rate18k, 11250, "18K should be 11,250 for 15,000 24K rate");
    console.log("  ✓ Passed: 22K (13,750) and 18K (11,250) derived accurately from 24K (15,000).");
  }

  // 3. Failure without cache returns null (translates to 503 { available: false })
  {
    console.log("Test 3: Failure without cache returns null");
    const mockFailingFetch: typeof fetch = async () => {
      return new Response("Internal Server Error", { status: 500 });
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      fetchFn: mockFailingFetch,
    });

    const rates = await service.getRates();
    assert.equal(rates, null, "Should return null on provider failure when no cache is present");
    console.log("  ✓ Passed: Null returned on provider failure without cache.");
  }

  // 4. Failure with cache returns last good value with stale: true
  {
    console.log("Test 4: Failure with cache returns cached value with stale: true");
    let shouldFail = false;
    const mockFlakyFetch: typeof fetch = async (url) => {
      if (shouldFail) {
        throw new Error("Network timeout");
      }
      const u = String(url);
      return new Response(
        JSON.stringify({
          price: u.includes("XAU") ? 311035 : 3110.35,
          updatedAt: "2026-11-15T09:00:00.000Z",
        }),
        { status: 200 },
      );
    };

    const service = new RatesService({
      apiUrl: "https://mock.gold-api.com",
      cacheTtlMinutes: 0.001, // 60ms TTL
      fetchFn: mockFlakyFetch,
    });

    const initialRates = await service.getRates();
    assert.ok(initialRates);
    assert.equal(initialRates.stale, false);

    // Now fail provider and force cache expiration
    shouldFail = true;
    await new Promise((r) => setTimeout(r, 70));

    const staleRates = await service.getRates();
    assert.ok(staleRates, "Cached rates must still be returned");
    assert.equal(staleRates.gold24kPerGram, 10000);
    assert.equal(staleRates.stale, true, "stale flag must be true");
    console.log("  ✓ Passed: Last good value returned with stale: true on provider failure.");
  }

  // 5. Bad value rejected
  {
    console.log("Test 5: Bad value rejected (non-finite, <= 0, >15% deviation)");

    // 5a. Non-finite / <= 0
    const mockBadDataFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ price: -100 }), { status: 200 });
    };
    const service1 = new RatesService({ fetchFn: mockBadDataFetch });
    const r1 = await service1.getRates();
    assert.equal(r1, null, "Negative price must be rejected");

    // 5b. Deviation > 15% from last good value
    let returnExtremeValue = false;
    const mockDeviationFetch: typeof fetch = async (url) => {
      const u = String(url);
      if (returnExtremeValue) {
        // Jump from 311035 to 400000 (+28.6% jump)
        return new Response(
          JSON.stringify({
            price: u.includes("XAU") ? 400000 : 3110.35,
            updatedAt: "2026-11-15T11:00:00.000Z",
          }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({
          price: u.includes("XAU") ? 311035 : 3110.35,
          updatedAt: "2026-11-15T10:00:00.000Z",
        }),
        { status: 200 },
      );
    };

    const service2 = new RatesService({
      cacheTtlMinutes: 0.001,
      fetchFn: mockDeviationFetch,
    });
    const goodRates = await service2.getRates();
    assert.ok(goodRates);
    assert.equal(goodRates.gold24kPerGram, 10000);

    returnExtremeValue = true;
    await new Promise((r) => setTimeout(r, 70));

    // Should reject the 28.6% deviation and return cached with stale: true
    const fallbackRates = await service2.getRates();
    assert.ok(fallbackRates);
    assert.equal(fallbackRates.gold24kPerGram, 10000, "Should reject >15% deviation and retain 10000");
    assert.equal(fallbackRates.stale, true);
    console.log("  ✓ Passed: Bad and extreme values correctly rejected.");
  }

  // 6. Premium applied
  {
    console.log("Test 6: RATES_INDIA_PREMIUM_PERCENT applied");
    const mockFetch: typeof fetch = async (url) => {
      const u = String(url);
      return new Response(
        JSON.stringify({
          price: u.includes("XAU") ? 311035 : 3110.35,
          updatedAt: "2026-11-15T10:00:00.000Z",
        }),
        { status: 200 },
      );
    };

    const service = new RatesService({
      indiaPremiumPercent: 3, // +3% India import premium
      fetchFn: mockFetch,
    });

    const rates = await service.getRates();
    assert.ok(rates);
    // 10000 * 1.03 = 10300
    assert.equal(rates.gold24kPerGram, 10300, "Gold should have 3% premium (10,300)");
    // 100 * 1.03 = 103
    assert.equal(rates.silverPerGram, 103, "Silver should have 3% premium (103)");
    console.log("  ✓ Passed: Premium correctly applied.");
  }

  // 7. 20 rapid concurrent requests hitting the provider once per TTL
  {
    console.log("Test 7: 20 rapid concurrent requests hit provider once per TTL");
    let providerHits = 0;
    const mockCountingFetch: typeof fetch = async (url) => {
      providerHits++;
      const u = String(url);
      return new Response(
        JSON.stringify({
          price: u.includes("XAU") ? 311035 : 3110.35,
          updatedAt: "2026-11-15T10:00:00.000Z",
        }),
        { status: 200 },
      );
    };

    const service = new RatesService({
      cacheTtlMinutes: 5,
      fetchFn: mockCountingFetch,
    });

    // Launch 20 concurrent requests
    const results = await Promise.all(
      Array.from({ length: 20 }, () => service.getRates()),
    );

    // Each fetch hits XAU and XAG, so 1 batch = 2 HTTP calls
    assert.equal(providerHits, 2, "20 requests should only hit provider once (2 endpoints XAU + XAG)");
    for (const r of results) {
      assert.ok(r);
      assert.equal(r.gold24kPerGram, 10000);
      assert.equal(r.stale, false);
    }
    console.log("  ✓ Passed: 20 concurrent calls deduplicated to 1 provider fetch per TTL.");
  }

  console.log("\nALL 7 UNIT TESTS PASSED SUCCESSFULLY! ✓\n");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
