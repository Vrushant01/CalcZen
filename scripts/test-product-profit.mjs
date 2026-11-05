import {
  calculateProductProfit,
  calculateBreakEvenPrice,
  calculateTargetSellingPrice,
  validateProfitInput,
} from "../src/utils/productProfitUtils.ts";

function approx(val, target, tolerance = 0.01) {
  if (val === null && target === null) return true;
  if (val === null || target === null) return false;
  return Math.abs(val - target) <= tolerance;
}

let passed = 0;
let failed = 0;

function runTest(name, condition, detail) {
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${name} -> ${detail}`);
    failed++;
  }
}

console.log("=== RUNNING PRODUCT PROFIT CALCULATOR TESTS ===\n");

// Test 1: Simple profit with zero expenses
{
  const res = calculateProductProfit({
    costPrice: 200,
    sellingPrice: 500,
    quantity: 1,
  });
  runTest(
    "Test 1: Simple profit",
    approx(res.profitPerUnit, 300) &&
      approx(res.totalProfit, 300) &&
      approx(res.profitMarginPct, 60) &&
      approx(res.markupPct, 150),
    `profit=${res.profitPerUnit}, total=${res.totalProfit}, margin=${res.profitMarginPct}, markup=${res.markupPct}`
  );
}

// Test 2: Multi-unit order
{
  const res = calculateProductProfit({
    costPrice: 100,
    sellingPrice: 180,
    quantity: 50,
  });
  runTest(
    "Test 2: Multi-unit order (50 units)",
    approx(res.profitPerUnit, 80) &&
      approx(res.totalProfit, 4000) &&
      approx(res.totalRevenue, 9000) &&
      approx(res.profitMarginPct, 44.44),
    `profit=${res.profitPerUnit}, total=${res.totalProfit}, revenue=${res.totalRevenue}, margin=${res.profitMarginPct}`
  );
}

// Test 3: Profit with full expenses breakdown
{
  const res = calculateProductProfit({
    costPrice: 300,
    sellingPrice: 800,
    quantity: 1,
    hasExtraExpenses: true,
    packagingCostPerUnit: 30,
    shippingCost: 70,
    shippingType: "per_unit",
    advertisingCostPerUnit: 100,
    marketplaceCommissionPct: 10,
    paymentGatewayFeePct: 2,
  });
  // total cost = 300 + 30 + 70 + 100 + (800 * 0.12 = 96) = 596
  // profit = 800 - 596 = 204
  // margin = 204 / 800 = 25.5%
  runTest(
    "Test 3: Full expenses breakdown",
    approx(res.totalCostPerUnit, 596) &&
      approx(res.profitPerUnit, 204) &&
      approx(res.profitMarginPct, 25.5),
    `totalCost=${res.totalCostPerUnit}, profit=${res.profitPerUnit}, margin=${res.profitMarginPct}`
  );
}

// Test 4: Loss scenario
{
  const res = calculateProductProfit({
    costPrice: 600,
    sellingPrice: 500,
    quantity: 1,
  });
  runTest(
    "Test 4: Loss scenario",
    res.isLoss === true &&
      approx(res.profitPerUnit, -100) &&
      approx(res.profitMarginPct, -20) &&
      approx(res.markupPct, -16.67),
    `isLoss=${res.isLoss}, profit=${res.profitPerUnit}, margin=${res.profitMarginPct}, markup=${res.markupPct}`
  );
}

// Test 5: Break-even test
{
  const res = calculateProductProfit({
    costPrice: 400,
    sellingPrice: 400,
    quantity: 1,
  });
  runTest(
    "Test 5: Break-even test",
    approx(res.profitPerUnit, 0) &&
      approx(res.profitMarginPct, 0) &&
      approx(res.markupPct, 0),
    `profit=${res.profitPerUnit}, margin=${res.profitMarginPct}, markup=${res.markupPct}`
  );
}

// Test 6: Zero selling price
{
  const res = calculateProductProfit({
    costPrice: 100,
    sellingPrice: 0,
    quantity: 1,
  });
  runTest(
    "Test 6: Zero selling price",
    approx(res.profitPerUnit, -100) && res.profitMarginPct === null,
    `profit=${res.profitPerUnit}, margin=${res.profitMarginPct}`
  );
}

// Test 7: Zero cost price
{
  const res = calculateProductProfit({
    costPrice: 0,
    sellingPrice: 100,
    quantity: 1,
  });
  runTest(
    "Test 7: Zero cost price",
    approx(res.profitPerUnit, 100) &&
      approx(res.profitMarginPct, 100) &&
      res.markupPct === null,
    `profit=${res.profitPerUnit}, margin=${res.profitMarginPct}, markup=${res.markupPct}`
  );
}

// Test 8: Discount applied
{
  const res = calculateProductProfit({
    costPrice: 300,
    sellingPrice: 600,
    quantity: 1,
    hasDiscount: true,
    discountPct: 20,
  });
  // Actual price: 480, profit: 180, margin: 180/480 = 37.5%, markup: 180/300 = 60%
  runTest(
    "Test 8: Discount applied (20%)",
    approx(res.actualSellingPrice, 480) &&
      approx(res.profitPerUnit, 180) &&
      approx(res.profitMarginPct, 37.5) &&
      approx(res.markupPct, 60),
    `actualPrice=${res.actualSellingPrice}, profit=${res.profitPerUnit}, margin=${res.profitMarginPct}, markup=${res.markupPct}`
  );
}

// Test 9: GST inclusive price
{
  const res = calculateProductProfit({
    costPrice: 700,
    sellingPrice: 1180,
    quantity: 1,
    hasGst: true,
    isSellingPriceGstInclusive: true,
    gstRatePct: 18,
  });
  // Revenue excl GST = 1000, Profit = 300, margin = 30%
  runTest(
    "Test 9: GST inclusive price",
    approx(res.revenueExcludingGstPerUnit, 1000) &&
      approx(res.outputGstPerUnit, 180) &&
      approx(res.profitPerUnit, 300) &&
      approx(res.profitMarginPct, 30),
    `revExclGst=${res.revenueExcludingGstPerUnit}, outputGst=${res.outputGstPerUnit}, profit=${res.profitPerUnit}, margin=${res.profitMarginPct}`
  );
}

// Test 10: Target selling price by desired profit amount
{
  const targetRes = calculateTargetSellingPrice(450, 0.10, { amount: 150 });
  // (450 + 150) / 0.90 = 666.67
  runTest(
    "Test 10: Target selling price by amount",
    targetRes.isValid && approx(targetRes.requiredSellingPrice, 666.67),
    `reqPrice=${targetRes.requiredSellingPrice}`
  );
}

// Test 11: Target selling price by desired margin %
{
  const targetRes = calculateTargetSellingPrice(600, 0.05, { marginPct: 25 });
  // 600 / (1 - 0.05 - 0.25) = 600 / 0.70 = 857.14
  runTest(
    "Test 11: Target selling price by margin %",
    targetRes.isValid && approx(targetRes.requiredSellingPrice, 857.14),
    `reqPrice=${targetRes.requiredSellingPrice}`
  );
}

// Test 12: Per-order vs per-unit expense handling
{
  const res1 = calculateProductProfit({
    costPrice: 100,
    sellingPrice: 200,
    quantity: 1,
    hasExtraExpenses: true,
    shippingCost: 60,
    shippingType: "per_order",
  });
  const res10 = calculateProductProfit({
    costPrice: 100,
    sellingPrice: 200,
    quantity: 10,
    hasExtraExpenses: true,
    shippingCost: 60,
    shippingType: "per_order",
  });
  runTest(
    "Test 12: Per-order shipping allocation (Qty=1 vs Qty=10)",
    approx(res1.profitPerUnit, 40) &&
      approx(res1.totalProfit, 40) &&
      approx(res10.profitPerUnit, 94) &&
      approx(res10.totalProfit, 940),
    `Q1 profit=${res1.profitPerUnit}, Q10 profit=${res10.profitPerUnit}, Q10 total=${res10.totalProfit}`
  );
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL 12 TESTS PASSED PERFECTLY!");
}

