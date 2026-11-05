import assert from "node:assert";

function runTests() {
  console.log("=== HOME ELECTRICITY BILL CALCULATION TEST SUITE ===");
  let passed = 0;
  let failed = 0;

  function approxEqual(actual, expected, tolerance = 0.01, msg = "") {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
      console.error(`FAIL: ${msg} -> expected ${expected}, got ${actual} (diff: ${diff})`);
      failed++;
    } else {
      passed++;
    }
  }

  // --- Test 1: Flat-rate monthly bill ---
  console.log("Testing Test 1: Flat-rate monthly bill...");
  const units1 = 250;
  const rate1 = 5;
  const fixed1 = 50;
  const addl1 = 100;
  const energy1 = units1 * rate1;
  const total1 = energy1 + fixed1 + addl1;

  approxEqual(energy1, 1250, 0.001, "Test 1 Energy Charges");
  approxEqual(total1, 1400, 0.001, "Test 1 Total Bill");

  // --- Test 2: Zero consumption ---
  console.log("Testing Test 2: Zero consumption...");
  const units2 = 0;
  const rate2 = 5;
  const fixed2 = 50;
  const addl2 = 0;
  const energy2 = units2 * rate2;
  const total2 = energy2 + fixed2 + addl2;

  approxEqual(energy2, 0, 0.001, "Test 2 Energy Charges");
  approxEqual(total2, 50, 0.001, "Test 2 Total Bill");
  assert.ok(!isNaN(total2) && isFinite(total2), "Total bill must be finite");

  // --- Progressive slab calculation helper ---
  const testSlabs = [
    { min: 0, max: 100, rate: 3 },
    { min: 100, max: 200, rate: 5 },
    { min: 200, max: Infinity, rate: 8 },
  ];

  function calcProgressive(units) {
    let remaining = units;
    let cost = 0;
    const slabCosts = [];
    for (const slab of testSlabs) {
      if (remaining <= 0) break;
      const capacity = slab.max - slab.min;
      const taken = Math.min(remaining, capacity);
      const c = taken * slab.rate;
      cost += c;
      slabCosts.push(c);
      remaining -= taken;
    }
    return { cost, slabCosts };
  }

  // --- Test 3: Progressive slab calculation (250 units) ---
  console.log("Testing Test 3: Progressive slab calculation (250 units)...");
  const res3 = calcProgressive(250);
  approxEqual(res3.slabCosts[0], 300, 0.001, "Test 3 First Slab (100 @ 3)");
  approxEqual(res3.slabCosts[1], 500, 0.001, "Test 3 Second Slab (100 @ 5)");
  approxEqual(res3.slabCosts[2], 400, 0.001, "Test 3 Third Slab (50 @ 8)");
  approxEqual(res3.cost, 1200, 0.001, "Test 3 Total Energy Charges");

  // --- Test 4: Slab boundary: 100 units ---
  console.log("Testing Test 4: Slab boundary (100 units)...");
  const res4 = calcProgressive(100);
  approxEqual(res4.cost, 300, 0.001, "Test 4 Energy Charges (100 units)");

  // --- Test 5: Slab boundary: 200 units ---
  console.log("Testing Test 5: Slab boundary (200 units)...");
  const res5 = calcProgressive(200);
  approxEqual(res5.cost, 800, 0.001, "Test 5 Energy Charges (200 units)");

  // --- Test 6: Slab boundary: 201 units ---
  console.log("Testing Test 6: Slab boundary (201 units)...");
  const res6 = calcProgressive(201);
  approxEqual(res6.cost, 808, 0.001, "Test 6 Energy Charges (201 units)");

  // --- Test 7: Appliance-based household estimate ---
  console.log("Testing Test 7: Appliance-based household estimate...");
  const fanKWh = (75 / 1000) * 8 * 30 * 2; // 36 kWh
  const bulbKWh = (9 / 1000) * 6 * 30 * 5; // 8.1 kWh
  const fridgeKWh = 250 / 12 * 1; // 20.833333 kWh
  const totalKWh = fanKWh + bulbKWh + fridgeKWh;
  const rate7 = 8;
  const energyCost7 = totalKWh * rate7;
  const displayedEnergyCost7 = parseFloat(energyCost7.toFixed(2));

  approxEqual(fanKWh, 36.0, 0.001, "Test 7 Fan Monthly Energy");
  approxEqual(bulbKWh, 8.1, 0.001, "Test 7 Bulb Monthly Energy");
  approxEqual(fridgeKWh, 20.833333, 0.001, "Test 7 Fridge Monthly Energy");
  approxEqual(totalKWh, 64.933333, 0.001, "Test 7 Total Monthly Energy");
  approxEqual(energyCost7, 519.466664, 0.001, "Test 7 Energy Cost Full Precision");
  approxEqual(displayedEnergyCost7, 519.47, 0.001, "Test 7 Displayed Energy Cost");

  // --- Test 8: Appliance method with standby ---
  console.log("Testing Test 8: Appliance method with standby...");
  const activeDaily = (100 * 4) / 1000;
  const standbyDaily = (2 * 20) / 1000;
  const activeMonthly = activeDaily * 30 * 1;
  const standbyMonthly = standbyDaily * 30 * 1;
  const totalMonthly8 = activeMonthly + standbyMonthly;
  const rate8 = 8;
  const totalMonthlyCost8 = totalMonthly8 * rate8;

  approxEqual(activeMonthly, 12.0, 0.001, "Test 8 Active Monthly Energy");
  approxEqual(standbyMonthly, 1.2, 0.001, "Test 8 Standby Monthly Energy");
  approxEqual(totalMonthly8, 13.2, 0.001, "Test 8 Total Monthly Energy");
  approxEqual(totalMonthlyCost8, 105.6, 0.001, "Test 8 Total Monthly Cost");

  // --- Test 9: Monthly comparison ---
  console.log("Testing Test 9: Monthly comparison...");
  const prevUnits = 200;
  const currUnits = 250;
  const diffUnits = currUnits - prevUnits;
  const pctIncrease = (diffUnits / prevUnits) * 100;

  approxEqual(diffUnits, 50, 0.001, "Test 9 Units Difference");
  approxEqual(pctIncrease, 25.0, 0.001, "Test 9 Percentage Increase");

  // --- Test 10: Invalid input ---
  console.log("Testing Test 10: Invalid input (-50 units)...");
  const invalidUnits = -50;
  const isValid = invalidUnits >= 0;
  assert.strictEqual(isValid, false, "Negative units must be invalid");
  passed++;

  console.log(`\nTEST RESULTS: ${passed} assertions passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

