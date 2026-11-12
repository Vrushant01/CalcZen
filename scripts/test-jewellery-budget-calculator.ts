/**
 * CalcZen: Jewellery Budget to Weight Calculator Independent Test Suite
 */

import {
  calculateBudgetToWeight,
  calculatePriceForWeight,
  validateBudgetInputs,
  type JewelleryBudgetInputs,
} from "../src/utils/jewelleryBudgetUtils";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function approxEqual(a: number, b: number, epsilon = 0.005): boolean {
  return Math.abs(a - b) <= epsilon;
}

console.log("=================================================");
console.log("CALCZEN: JEWELLERY BUDGET TO WEIGHT CALCULATOR TESTS");
console.log("=================================================\n");

const baseInputs: JewelleryBudgetInputs = {
  totalBudget: 50000,
  reservedAmount: 0,
  metalType: "gold",
  goldPurity: "22k-916",
  silverPurity: "925",
  rateBasis: "selected_purity",
  metalRate: 10000,
  makingMethod: "percentage",
  makingValue: 10,
  wastageMethod: "none",
  wastageValue: 0,
  gstRate: 3,
  discountMethod: "none",
  discountValue: 0,
  otherCharges: 0,
};

// TEST 1 — Basic ₹50,000 budget
console.log("Test 1: Basic ₹50,000 budget (₹10,000/g, 10% making, 3% GST -> ₹11,330/g)");
const t1Res = calculateBudgetToWeight(baseInputs, 4);
const t1Expected = 50000 / 11330; // ~4.41306g
assert(approxEqual(t1Res.maxAffordableWeight, t1Expected, 0.005), `Weight ${t1Res.maxAffordableWeight}g is approximately ~${t1Expected.toFixed(4)}g`);
assert(t1Res.breakdown.finalPrice <= t1Res.availableBudget, `Budget guarantee: Final price ${t1Res.breakdown.finalPrice.toFixed(2)} <= ${t1Res.availableBudget}`);

// TEST 2 — ₹25,000 budget
console.log("\nTest 2: ₹25,000 budget");
const t2Inputs: JewelleryBudgetInputs = { ...baseInputs, totalBudget: 25000 };
const t2Res = calculateBudgetToWeight(t2Inputs, 4);
const t2Expected = 25000 / 11330; // ~2.2065g
assert(approxEqual(t2Res.maxAffordableWeight, t2Expected, 0.005), `Weight ${t2Res.maxAffordableWeight}g is approximately ~${t2Expected.toFixed(4)}g`);
assert(t2Res.breakdown.finalPrice <= t2Res.availableBudget, `Budget guarantee: Final price ${t2Res.breakdown.finalPrice.toFixed(2)} <= ${t2Res.availableBudget}`);

// TEST 3 — ₹1,00,000 budget
console.log("\nTest 3: ₹1,00,000 budget");
const t3Inputs: JewelleryBudgetInputs = { ...baseInputs, totalBudget: 100000 };
const t3Res = calculateBudgetToWeight(t3Inputs, 4);
const t3Expected = 100000 / 11330; // ~8.8261g
assert(approxEqual(t3Res.maxAffordableWeight, t3Expected, 0.005), `Weight ${t3Res.maxAffordableWeight}g is approximately ~${t3Expected.toFixed(4)}g`);
assert(t3Res.breakdown.finalPrice <= t3Res.availableBudget, `Budget guarantee: Final price ${t3Res.breakdown.finalPrice.toFixed(2)} <= ${t3Res.availableBudget}`);

// TEST 4 — Per-gram making charges (₹500/g)
console.log("\nTest 4: Per-gram making charges (₹500/g -> price/g = ₹10,815)");
const t4Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  makingMethod: "per_gram",
  makingValue: 500,
};
const t4Res = calculateBudgetToWeight(t4Inputs, 4);
const t4Expected = 50000 / 10815; // ~4.6232g
assert(approxEqual(t4Res.maxAffordableWeight, t4Expected, 0.005), `Weight ${t4Res.maxAffordableWeight}g matches ~${t4Expected.toFixed(4)}g`);
assert(t4Res.breakdown.finalPrice <= t4Res.availableBudget, `Budget guarantee: Final price ${t4Res.breakdown.finalPrice.toFixed(2)} <= ${t4Res.availableBudget}`);

// TEST 5 — Fixed making charges (₹2,000 fixed)
console.log("\nTest 5: Fixed making charges (₹2,000 fixed)");
const t5Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  makingMethod: "fixed",
  makingValue: 2000,
};
const t5Res = calculateBudgetToWeight(t5Inputs, 4);
const t5Expected = (50000 / 1.03 - 2000) / 10000; // ~4.6544g
assert(approxEqual(t5Res.maxAffordableWeight, t5Expected, 0.005), `Weight ${t5Res.maxAffordableWeight}g matches ~${t5Expected.toFixed(4)}g`);
assert(t5Res.breakdown.finalPrice <= t5Res.availableBudget, `Budget guarantee: Final price ${t5Res.breakdown.finalPrice.toFixed(2)} <= ${t5Res.availableBudget}`);

// TEST 6 — Wastage charges (5% wastage)
console.log("\nTest 6: Wastage charges (5% wastage -> ₹11,845/g)");
const t6Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  wastageMethod: "percentage",
  wastageValue: 5,
};
const t6Res = calculateBudgetToWeight(t6Inputs, 4);
const t6Expected = 50000 / 11845; // ~4.2212g
assert(approxEqual(t6Res.maxAffordableWeight, t6Expected, 0.005), `Weight ${t6Res.maxAffordableWeight}g matches ~${t6Expected.toFixed(4)}g`);
assert(t6Res.breakdown.finalPrice <= t6Res.availableBudget, `Budget guarantee: Final price ${t6Res.breakdown.finalPrice.toFixed(2)} <= ${t6Res.availableBudget}`);

// TEST 7 — Discount (5% on subtotal)
console.log("\nTest 7: Discount (5% on subtotal -> ₹10,763.50/g)");
const t7Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  discountMethod: "percentage",
  discountValue: 5,
};
const t7Res = calculateBudgetToWeight(t7Inputs, 4);
const t7Expected = 50000 / 10763.5; // ~4.6453g
assert(approxEqual(t7Res.maxAffordableWeight, t7Expected, 0.005), `Weight ${t7Res.maxAffordableWeight}g matches ~${t7Expected.toFixed(4)}g`);
assert(t7Res.breakdown.finalPrice <= t7Res.availableBudget, `Budget guarantee: Final price ${t7Res.breakdown.finalPrice.toFixed(2)} <= ${t7Res.availableBudget}`);

// TEST 8 — 24K rate conversion
console.log("\nTest 8: 24K rate conversion (10g 22K 916 @ ₹10k 24K rate -> ₹9,160/g, total ₹10,378.28/g)");
const t8Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  rateBasis: "24k_or_999",
  metalRate: 10000,
};
const t8Res = calculateBudgetToWeight(t8Inputs, 4);
const t8Expected = 50000 / (9160 * 1.1 * 1.03); // ~4.81775g
assert(approxEqual(t8Res.maxAffordableWeight, t8Expected, 0.005), `Weight ${t8Res.maxAffordableWeight}g matches exact ~${t8Expected.toFixed(4)}g`);
assert(t8Res.breakdown.finalPrice <= t8Res.availableBudget, `Budget guarantee: Final price ${t8Res.breakdown.finalPrice.toFixed(2)} <= ${t8Res.availableBudget}`);

// TEST 9 — Reserved budget
console.log("\nTest 9: Reserved budget (Total ₹50k, Reserved ₹2k -> Available ₹48k)");
const t9Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  totalBudget: 50000,
  reservedAmount: 2000,
};
const t9Res = calculateBudgetToWeight(t9Inputs, 4);
const t9Expected = 48000 / 11330; // ~4.2365g
assert(approxEqual(t9Res.maxAffordableWeight, t9Expected, 0.005), `Weight ${t9Res.maxAffordableWeight}g matches ~${t9Expected.toFixed(4)}g`);
assert(t9Res.availableBudget === 48000, `Available budget is 48000`);
assert(t9Res.breakdown.finalPrice <= t9Res.availableBudget, `Budget guarantee: Final price ${t9Res.breakdown.finalPrice.toFixed(2)} <= ${t9Res.availableBudget}`);

// TEST 10 — Desired weight mode (5g @ ₹10,000/g, 10% making, 3% GST)
console.log("\nTest 10: Desired weight mode (5g @ ₹10,000/g, 10% making, 3% GST -> ₹56,650)");
const t10Breakdown = calculatePriceForWeight(5, baseInputs);
assert(t10Breakdown.metalValue === 50000, `Gold value: ${t10Breakdown.metalValue} matches 50000`);
assert(t10Breakdown.makingCharges === 5000, `Making charges: ${t10Breakdown.makingCharges} matches 5000`);
assert(t10Breakdown.taxableSubtotal === 55000, `Taxable subtotal: ${t10Breakdown.taxableSubtotal} matches 55000`);
assert(t10Breakdown.gstAmount === 1650, `GST amount: ${t10Breakdown.gstAmount} matches 1650`);
assert(t10Breakdown.finalPrice === 56650, `Final price: ${t10Breakdown.finalPrice} matches 56650`);

// TEST 11 — Silver mode (Budget: ₹10,000, 925 silver @ ₹100/g, 10% making, 3% GST -> ₹113.30/g)
console.log("\nTest 11: Silver mode (Budget ₹10k, 925 silver @ ₹100/g, 10% making -> ~88.2613g)");
const t11Inputs: JewelleryBudgetInputs = {
  ...baseInputs,
  totalBudget: 10000,
  metalType: "silver",
  silverPurity: "925",
  metalRate: 100,
};
const t11Res = calculateBudgetToWeight(t11Inputs, 4);
const t11Expected = 10000 / 113.3; // ~88.2613g
assert(approxEqual(t11Res.maxAffordableWeight, t11Expected, 0.05), `Weight ${t11Res.maxAffordableWeight}g matches ~${t11Expected.toFixed(4)}g`);
assert(t11Res.breakdown.finalPrice <= t11Res.availableBudget, `Budget guarantee: Final price ${t11Res.breakdown.finalPrice.toFixed(2)} <= ${t11Res.availableBudget}`);

// TEST 12 — Invalid values validation
console.log("\nTest 12: Invalid values validation");
const inv1 = validateBudgetInputs({ ...baseInputs, totalBudget: 0 });
assert(!inv1.isValid && !!inv1.errors.totalBudget, `Zero budget correctly rejected`);

const inv2 = validateBudgetInputs({ ...baseInputs, totalBudget: 50000, reservedAmount: 55000 });
assert(!inv2.isValid && !!inv2.errors.reservedAmount, `Reserved > total budget correctly rejected`);

const inv3 = validateBudgetInputs({ ...baseInputs, metalRate: 0 });
assert(!inv3.isValid && !!inv3.errors.metalRate, `Zero metal rate correctly rejected`);

// TEST 13 — Budget guarantee across all tests
console.log("\nTest 13: Budget guarantee verification");
[t1Res, t2Res, t3Res, t4Res, t5Res, t6Res, t7Res, t8Res, t9Res, t11Res].forEach((res, idx) => {
  assert(
    res.breakdown.finalPrice <= res.availableBudget,
    `Test ${idx + 1} Budget Guarantee: Final price ₹${res.breakdown.finalPrice.toFixed(2)} <= Available budget ₹${res.availableBudget}`
  );
  assert(
    !isNaN(res.maxAffordableWeight) && isFinite(res.maxAffordableWeight),
    `Test ${idx + 1} is valid finite number: ${res.maxAffordableWeight}g`
  );
});

console.log("\n=================================================");
console.log("ALL 13 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");
