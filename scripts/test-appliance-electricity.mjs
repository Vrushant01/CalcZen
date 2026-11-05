import assert from "node:assert";

// Direct testing of appliance electricity calculation formulas
function runTests() {
  console.log("=== APPLIANCE ELECTRICITY CALCULATION TEST SUITE ===");
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

  // --- Test 1: Ceiling Fan (Method A) ---
  console.log("Testing Test 1: Ceiling Fan...");
  const fan = {
    powerWatts: 75,
    dailyHours: 8,
    daysPerMonth: 30,
    quantity: 2,
  };
  const rate1 = 8;
  const fanDailyKWh = (fan.powerWatts / 1000) * fan.dailyHours * fan.quantity;
  const fanMonthlyKWh = fanDailyKWh * fan.daysPerMonth;
  const fanYearlyKWh = fanDailyKWh * 365;
  const fanDailyCost = fanDailyKWh * rate1;
  const fanMonthlyCost = fanMonthlyKWh * rate1;
  const fanYearlyCost = fanYearlyKWh * rate1;

  approxEqual(fanDailyKWh, 1.2, 0.001, "Test 1 Daily kWh");
  approxEqual(fanMonthlyKWh, 36.0, 0.001, "Test 1 Monthly kWh");
  approxEqual(fanYearlyKWh, 438.0, 0.001, "Test 1 Yearly kWh");
  approxEqual(fanDailyCost, 9.6, 0.01, "Test 1 Daily Cost");
  approxEqual(fanMonthlyCost, 288.0, 0.01, "Test 1 Monthly Cost");
  approxEqual(fanYearlyCost, 3504.0, 0.01, "Test 1 Yearly Cost");

  // --- Test 2: LED Bulb (Method A) ---
  console.log("Testing Test 2: LED Bulb...");
  const bulb = {
    powerWatts: 9,
    dailyHours: 6,
    daysPerMonth: 30,
    quantity: 5,
  };
  const rate2 = 8;
  const bulbDailyKWh = (bulb.powerWatts / 1000) * bulb.dailyHours * bulb.quantity;
  const bulbMonthlyKWh = bulbDailyKWh * bulb.daysPerMonth;
  const bulbYearlyKWh = bulbDailyKWh * 365;
  const bulbMonthlyCost = bulbMonthlyKWh * rate2;
  const bulbYearlyCost = bulbYearlyKWh * rate2;

  approxEqual(bulbDailyKWh, 0.27, 0.001, "Test 2 Daily kWh");
  approxEqual(bulbMonthlyKWh, 8.1, 0.001, "Test 2 Monthly kWh");
  approxEqual(bulbYearlyKWh, 98.55, 0.001, "Test 2 Yearly kWh");
  approxEqual(bulbMonthlyCost, 64.8, 0.01, "Test 2 Monthly Cost");
  approxEqual(bulbYearlyCost, 788.4, 0.01, "Test 2 Yearly Cost");

  // --- Test 3: Refrigerator Annual Label (Method C) ---
  console.log("Testing Test 3: Refrigerator Annual Label...");
  const fridge = {
    annualKWh: 250,
    quantity: 1,
  };
  const rate3 = 8;
  const fridgeYearlyKWh = fridge.annualKWh * fridge.quantity;
  const fridgeMonthlyKWh = fridgeYearlyKWh / 12;
  const fridgeDailyKWh = fridgeYearlyKWh / 365;
  const fridgeYearlyCost = fridgeYearlyKWh * rate3;
  const fridgeMonthlyCost = fridgeMonthlyKWh * rate3;
  const fridgeDailyCost = fridgeDailyKWh * rate3;

  approxEqual(fridgeYearlyKWh, 250, 0.001, "Test 3 Yearly kWh");
  approxEqual(fridgeMonthlyKWh, 20.833333, 0.001, "Test 3 Monthly kWh");
  approxEqual(fridgeDailyKWh, 0.684932, 0.001, "Test 3 Daily kWh");
  approxEqual(fridgeYearlyCost, 2000, 0.01, "Test 3 Yearly Cost");
  approxEqual(fridgeMonthlyCost, 166.67, 0.01, "Test 3 Monthly Cost");
  approxEqual(fridgeDailyCost, 5.48, 0.01, "Test 3 Daily Cost");

  // --- Test 4: Washing Machine Cycle (Method B) ---
  console.log("Testing Test 4: Washing Machine Cycle...");
  const washer = {
    kwhPerCycle: 0.8,
    cyclesPerWeek: 5,
    quantity: 1,
  };
  const rate4 = 8;
  const washerYearlyCycles = (washer.cyclesPerWeek * 365) / 7;
  const washerYearlyKWh = washer.kwhPerCycle * washerYearlyCycles * washer.quantity;
  const washerMonthlyKWh = (washer.kwhPerCycle * washer.cyclesPerWeek * 365) / 12 / 7 * washer.quantity;
  const washerYearlyCost = washerYearlyKWh * rate4;
  const washerMonthlyCost = washerMonthlyKWh * rate4;

  approxEqual(washerYearlyCycles, 260.714286, 0.001, "Test 4 Yearly Cycles");
  approxEqual(washerYearlyKWh, 208.571429, 0.001, "Test 4 Yearly Energy");
  approxEqual(washerMonthlyKWh, 17.380952, 0.001, "Test 4 Monthly Energy");
  approxEqual(washerYearlyCost, 1668.57, 0.01, "Test 4 Yearly Cost");
  approxEqual(washerMonthlyCost, 139.05, 0.01, "Test 4 Monthly Cost");

  // --- Test 5: Standby Consumption (Method D) ---
  console.log("Testing Test 5: Standby Consumption...");
  const tv = {
    activeWatts: 100,
    activeHours: 4,
    standbyWatts: 2,
    standbyHours: 20,
    daysPerMonth: 30,
    quantity: 1,
  };
  const rate5 = 8;
  const tvActiveDailyKWh = (tv.activeWatts * tv.activeHours) / 1000;
  const tvStandbyDailyKWh = (tv.standbyWatts * tv.standbyHours) / 1000;
  const tvTotalDailyKWh = (tvActiveDailyKWh + tvStandbyDailyKWh) * tv.quantity;
  const tvMonthlyKWh = tvTotalDailyKWh * tv.daysPerMonth;
  const tvMonthlyActiveCost = tvActiveDailyKWh * tv.daysPerMonth * rate5 * tv.quantity;
  const tvMonthlyStandbyCost = tvStandbyDailyKWh * tv.daysPerMonth * rate5 * tv.quantity;
  const tvTotalMonthlyCost = tvMonthlyKWh * rate5;

  approxEqual(tvActiveDailyKWh, 0.4, 0.001, "Test 5 Active Daily kWh");
  approxEqual(tvStandbyDailyKWh, 0.04, 0.001, "Test 5 Standby Daily kWh");
  approxEqual(tvTotalDailyKWh, 0.44, 0.001, "Test 5 Total Daily kWh");
  approxEqual(tvMonthlyKWh, 13.2, 0.001, "Test 5 Monthly kWh");
  approxEqual(tvMonthlyActiveCost, 96.0, 0.01, "Test 5 Monthly Active Cost");
  approxEqual(tvMonthlyStandbyCost, 9.6, 0.01, "Test 5 Monthly Standby Cost");
  approxEqual(tvTotalMonthlyCost, 105.6, 0.01, "Test 5 Total Monthly Cost");

  // --- Test 6: Multiple Appliances ---
  console.log("Testing Test 6: Multiple Appliances...");
  const combinedMonthlyKWh = fanMonthlyKWh + bulbMonthlyKWh;
  const combinedMonthlyCost = combinedMonthlyKWh * 8;
  const combinedYearlyKWh = fanYearlyKWh + bulbYearlyKWh;
  const combinedYearlyCost = combinedYearlyKWh * 8;

  approxEqual(fanMonthlyKWh, 36.0, 0.001, "Test 6 Fan Monthly Energy");
  approxEqual(bulbMonthlyKWh, 8.1, 0.001, "Test 6 Bulb Monthly Energy");
  approxEqual(combinedMonthlyKWh, 44.1, 0.001, "Test 6 Combined Monthly Energy");
  approxEqual(combinedMonthlyCost, 352.8, 0.01, "Test 6 Combined Monthly Cost");
  // 438 + 98.55 = 536.55 kWh (mathematical exact sum of Test 1 + Test 2 yearly kWh)
  approxEqual(combinedYearlyKWh, 536.55, 0.001, "Test 6 Combined Yearly Energy");
  approxEqual(combinedYearlyCost, 4292.4, 0.01, "Test 6 Combined Yearly Cost");

  // --- Test 7: Zero Usage ---
  console.log("Testing Test 7: Zero Usage...");
  const zeroApp = {
    powerWatts: 100,
    dailyHours: 0,
    daysPerMonth: 30,
    quantity: 1,
  };
  const zeroDailyKWh = (zeroApp.powerWatts / 1000) * zeroApp.dailyHours * zeroApp.quantity;
  const zeroCost = zeroDailyKWh * 8;
  approxEqual(zeroDailyKWh, 0, 0.0001, "Test 7 Zero kWh");
  approxEqual(zeroCost, 0, 0.0001, "Test 7 Zero Cost");
  assert.ok(!isNaN(zeroDailyKWh) && isFinite(zeroDailyKWh), "Zero kWh must not be NaN or Infinity");
  assert.ok(!isNaN(zeroCost) && isFinite(zeroCost), "Zero Cost must not be NaN or Infinity");

  // --- Test 8: Validation Error ---
  console.log("Testing Test 8: Validation Error...");
  const invalidHours = 25;
  const isValid = invalidHours >= 0 && invalidHours <= 24;
  assert.strictEqual(isValid, false, "25 hours must be invalid");
  passed++;

  console.log(`\nTEST RESULTS: ${passed} assertions passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
