/**
 * Automated Test Suite for CalcZen Old Gold Exchange Value Calculator
 * Verifies all 12 test cases specified in the master development prompt.
 */

import {
  calculateOldGoldExchangeValue,
  validateOldGoldInputs,
  type OldGoldInputs,
} from "../src/utils/oldGoldCalculatorUtils";

function assertClose(actual: number, expected: number, tolerance: number = 0.5, name: string = "") {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`[FAIL] ${name}: Expected ${expected}, got ${actual} (diff: ${diff})`);
  }
  console.log(`  ✓ ${name}: ${actual} matches expected ${expected}`);
}

console.log("=================================================");
console.log("CALCZEN: OLD GOLD EXCHANGE VALUE CALCULATOR TESTS");
console.log("=================================================\n");

// TEST 1: Basic 22K (10g @ ₹9,160/g, 0% deduction)
console.log("Test 1: Basic 22K Gold Valuation (10g @ ₹9,160/g, 0% ded)");
const t1 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t1.fineGoldContentGrams, 9.16, 0.001, "Test 1 Fine Gold");
assertClose(t1.baseGoldValue, 91600, 0.01, "Test 1 Base Value");
assertClose(t1.totalDeductions, 0, 0.01, "Test 1 Deductions");
assertClose(t1.finalExchangeValue, 91600, 0.01, "Test 1 Final Value");

// TEST 2: 18K Gold (20g @ ₹7,500/g, 0% deduction)
console.log("\nTest 2: 18K Gold Valuation (20g @ ₹7,500/g, 0% ded)");
const t2 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 20,
  grossWeight: 20,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "18k-750",
  rate: 7500,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t2.fineGoldContentGrams, 15.0, 0.001, "Test 2 Fine Gold (20 * 0.75 = 15g)");
assertClose(t2.baseGoldValue, 150000, 0.01, "Test 2 Base Value (20 * 7500)");
assertClose(t2.finalExchangeValue, 150000, 0.01, "Test 2 Final Value");

// TEST 3: 22K via 24K Rate (10g, 24K @ ₹10,000/g)
console.log("\nTest 3: 22K via 24K Rate (10g, 24K @ ₹10,000/g)");
const t3 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 10000,
  rateBasis: "24k",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t3.effectiveRatePerGram, 9160, 0.01, "Test 3 Effective 22K Rate (10000 * 0.916 = 9160)");
assertClose(t3.fineGoldContentGrams, 9.16, 0.001, "Test 3 Fine Gold");
assertClose(t3.baseGoldValue, 91600, 0.01, "Test 3 Base Value");
assertClose(t3.finalExchangeValue, 91600, 0.01, "Test 3 Final Value");

// TEST 4: 14K Gold (10g @ ₹5,850/g)
console.log("\nTest 4: 14K Gold (10g @ ₹5,850/g)");
const t4 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "14k-585",
  rate: 5850,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t4.fineGoldContentGrams, 5.85, 0.001, "Test 4 Fine Gold");
assertClose(t4.baseGoldValue, 58500, 0.01, "Test 4 Base Value");
assertClose(t4.finalExchangeValue, 58500, 0.01, "Test 4 Final Value");

// TEST 5: Percentage Deduction (10g 22K @ ₹9,160/g, 2% deduction)
console.log("\nTest 5: Percentage Deduction (10g 22K @ ₹9,160/g, 2% ded)");
const t5 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 2,
  fixedCharges: 0,
});
assertClose(t5.baseGoldValue, 91600, 0.01, "Test 5 Base Value");
assertClose(t5.percentageDeductionAmount, 1832, 0.01, "Test 5 2% Deduction (91600 * 0.02 = 1832)");
assertClose(t5.finalExchangeValue, 89768, 0.01, "Test 5 Final Value (91600 - 1832 = 89768)");

// TEST 6: Gross Weight and Stone Weight Deduction (12g Gross - 2g Stone = 10g Net)
console.log("\nTest 6: Gross Weight and Stone Weight Deduction (12g Gross - 2g Stone = 10g Net)");
const t6 = calculateOldGoldExchangeValue({
  weightMode: "gross_stone",
  netWeight: 0,
  grossWeight: 12,
  stoneWeight: 2,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t6.netWeightGrams, 10, 0.001, "Test 6 Net Weight (12 - 2 = 10g)");
assertClose(t6.finalExchangeValue, 91600, 0.01, "Test 6 Final Value");

// TEST 7: Percentage + Fixed Charges (2% deduction + ₹200 fee)
console.log("\nTest 7: Percentage + Fixed Charges (2% deduction + ₹200 fee)");
const t7 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 2,
  fixedCharges: 200,
});
assertClose(t7.totalDeductions, 2032, 0.01, "Test 7 Total Deductions (1832 + 200 = 2032)");
assertClose(t7.finalExchangeValue, 89568, 0.01, "Test 7 Final Value (91600 - 2032 = 89568)");

// TEST 8: Zero Deduction Case (5g 22K @ ₹9,160)
console.log("\nTest 8: Zero Deduction Case (5g 22K @ ₹9,160)");
const t8 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 5,
  grossWeight: 5,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t8.baseGoldValue, 45800, 0.01, "Test 8 Base Value (5 * 9160 = 45800)");
assertClose(t8.finalExchangeValue, 45800, 0.01, "Test 8 Final Value");

// TEST 9: Decimal Weight (5.75g 22K @ ₹9,160)
console.log("\nTest 9: Decimal Weight (5.75g 22K @ ₹9,160)");
const t9 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 5.75,
  grossWeight: 5.75,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t9.baseGoldValue, 52670, 0.01, "Test 9 Base Value (5.75 * 9160 = 52670)");
assertClose(t9.fineGoldContentGrams, 5.267, 0.001, "Test 9 Fine Gold (5.75 * 0.916 = 5.267g)");

// TEST 10: Validation Tests
console.log("\nTest 10: Validation Tests");
const valZeroWeight = validateOldGoldInputs({
  weightMode: "net",
  netWeight: 0,
  grossWeight: 0,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
if (valZeroWeight.isValid || !valZeroWeight.errors.netWeight) {
  throw new Error("[FAIL] Validation should reject zero weight");
}
console.log("  ✓ Zero weight correctly rejected:", valZeroWeight.errors.netWeight);

const valStoneGreater = validateOldGoldInputs({
  weightMode: "gross_stone",
  netWeight: 0,
  grossWeight: 5,
  stoneWeight: 6,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
if (valStoneGreater.isValid || !valStoneGreater.errors.stoneWeight) {
  throw new Error("[FAIL] Validation should reject stone weight >= gross weight");
}
console.log("  ✓ Stone weight > gross weight correctly rejected:", valStoneGreater.errors.stoneWeight);

// TEST 11: Rate Basis Protection (No Double Multiplication)
console.log("\nTest 11: Rate Basis Protection");
// If user selects 22K rate directly (e.g. ₹9,160), base value MUST be 10 * 9160 = 91600, NOT 10 * 9160 * 0.916
const t11 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "22k-916",
  rate: 9160,
  rateBasis: "selected_purity",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t11.baseGoldValue, 91600, 0.01, "Test 11 Direct Rate not double multiplied");

// TEST 12: Custom Fineness Range (1 to 1000)
console.log("\nTest 12: Custom Fineness Range (Fineness 875, 10g @ 24K ₹10,000/g)");
const t12 = calculateOldGoldExchangeValue({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  stoneWeight: 0,
  weightUnit: "grams",
  purity: "custom",
  customFinenessPerThousand: 875,
  rate: 10000,
  rateBasis: "24k",
  rateUnit: "per_gram",
  deductionPct: 0,
  fixedCharges: 0,
});
assertClose(t12.fineGoldContentGrams, 8.75, 0.001, "Test 12 Custom Fine Gold (10 * 0.875 = 8.75g)");
assertClose(t12.effectiveRatePerGram, 8750, 0.01, "Test 12 Custom Rate (10000 * 0.875 = 8750)");
assertClose(t12.baseGoldValue, 87500, 0.01, "Test 12 Custom Base Value");

console.log("\n=================================================");
console.log("ALL 12 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");

