/**
 * Independent Raw-Data Testing for CalcZen Gold Purity & Karat Converter
 * Validates all 12 test cases specified in Phase 10.
 */

import {
  convertGoldPurity,
  validateGoldPurityInput,
  roundTo,
} from "../src/utils/goldPurityConverterUtils";

function assertClose(actual: number, expected: number, tolerance: number = 0.01, label: string = "") {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`[FAIL] ${label}: Expected ${expected}, got ${actual} (diff: ${diff})`);
  }
  console.log(`  ✓ ${label}: ${actual} matches expected ${expected}`);
}

function assertEqual(actual: any, expected: any, label: string = "") {
  if (actual !== expected) {
    throw new Error(`[FAIL] ${label}: Expected "${expected}", got "${actual}"`);
  }
  console.log(`  ✓ ${label}: "${actual}" matches expected "${expected}"`);
}

console.log("=================================================");
console.log("CALCZEN: GOLD PURITY & KARAT CONVERTER TESTS");
console.log("=================================================\n");

// TEST 1: 22K to percentage and fineness
console.log("Test 1: 22K Conversion");
const t1 = convertGoldPurity("karat", 22);
assertClose(t1.percentageExact, 91.66666666666667, 0.0001, "Test 1 Exact Purity (91.666...)");
assertEqual(t1.percentageDisplay, "91.67%", "Test 1 Displayed Percentage");
assertClose(t1.finenessExact, 916.6666666666666, 0.0001, "Test 1 Mathematical Fineness (916.666...)");
assertEqual(t1.hallmarkGradeReference, "22K916", "Test 1 Common Hallmark Reference");

// TEST 2: 18K conversion
console.log("\nTest 2: 18K Conversion");
const t2 = convertGoldPurity("karat", 18);
assertClose(t2.percentageExact, 75.0, 0.0001, "Test 2 Exact Purity");
assertClose(t2.finenessExact, 750.0, 0.0001, "Test 2 Exact Fineness");
assertEqual(t2.hallmarkGradeReference, "18K750", "Test 2 Hallmark Grade");

// TEST 3: 14K conversion
console.log("\nTest 3: 14K Conversion");
const t3 = convertGoldPurity("karat", 14);
assertClose(t3.percentageExact, 58.333333333333336, 0.0001, "Test 3 Exact Purity (58.333...)");
assertClose(t3.finenessExact, 583.3333333333334, 0.0001, "Test 3 Mathematical Fineness (583.333...)");
assertEqual(t3.hallmarkGradeReference, "14K585", "Test 3 Common Hallmark Reference (14K585)");

// TEST 4: 24K conversion
console.log("\nTest 4: 24K Conversion");
const t4 = convertGoldPurity("karat", 24);
assertClose(t4.percentageExact, 100.0, 0.0001, "Test 4 Exact Purity (100%)");
assertClose(t4.finenessExact, 1000.0, 0.0001, "Test 4 Mathematical Fineness (1000)");

// TEST 5: 916 fineness
console.log("\nTest 5: 916 Fineness Conversion");
const t5 = convertGoldPurity("fineness", 916);
assertClose(t5.percentageExact, 91.6, 0.0001, "Test 5 Percentage (91.6%)");
assertClose(t5.karatExact, 21.984, 0.0001, "Test 5 Karat (21.984K)");
assertEqual(t5.hallmarkGradeReference, "22K916", "Test 5 Common Grade Reference");

// TEST 6: 750 fineness
console.log("\nTest 6: 750 Fineness Conversion");
const t6 = convertGoldPurity("fineness", 750);
assertClose(t6.percentageExact, 75.0, 0.0001, "Test 6 Percentage (75%)");
assertClose(t6.karatExact, 18.0, 0.0001, "Test 6 Karat (18K)");
assertEqual(t6.hallmarkGradeReference, "18K750", "Test 6 Common Grade Reference");

// TEST 7: 585 fineness
console.log("\nTest 7: 585 Fineness Conversion");
const t7 = convertGoldPurity("fineness", 585);
assertClose(t7.percentageExact, 58.5, 0.0001, "Test 7 Percentage (58.5%)");
assertClose(t7.karatExact, 14.04, 0.0001, "Test 7 Karat (14.04K)");
assertEqual(t7.hallmarkGradeReference, "14K585", "Test 7 Common Grade Reference");

// TEST 8: 833 fineness
console.log("\nTest 8: 833 Fineness Conversion");
const t8 = convertGoldPurity("fineness", 833);
assertClose(t8.percentageExact, 83.3, 0.0001, "Test 8 Percentage (83.3%)");
assertClose(t8.karatExact, 19.992, 0.0001, "Test 8 Karat (19.992K)");
assertEqual(t8.hallmarkGradeReference, "20K833", "Test 8 Common Grade Reference");

// TEST 9: 958 fineness
console.log("\nTest 9: 958 Fineness Conversion");
const t9 = convertGoldPurity("fineness", 958);
assertClose(t9.percentageExact, 95.8, 0.0001, "Test 9 Percentage (95.8%)");
assertClose(t9.karatExact, 22.992, 0.0001, "Test 9 Karat (22.992K)");
assertEqual(t9.hallmarkGradeReference, "23K958", "Test 9 Common Grade Reference");

// TEST 10: Decimal karat (21.5K)
console.log("\nTest 10: Decimal Karat (21.5K)");
const t10 = convertGoldPurity("karat", 21.5);
assertClose(t10.percentageExact, 89.58333333333334, 0.0001, "Test 10 Percentage (89.58333...)");
assertClose(t10.finenessExact, 895.8333333333334, 0.0001, "Test 10 Fineness (895.8333...)");

// TEST 11: Decimal percentage (91.6%)
console.log("\nTest 11: Decimal Percentage (91.6%)");
const t11 = convertGoldPurity("percentage", 91.6);
assertClose(t11.karatExact, 21.984, 0.0001, "Test 11 Karat (21.984K)");
assertClose(t11.finenessExact, 916.0, 0.0001, "Test 11 Fineness (916)");

// TEST 12: Validation tests
console.log("\nTest 12: Validation Edge Cases");
assertEqual(validateGoldPurityInput("karat", "").isValid, false, "Empty input rejected");
assertEqual(validateGoldPurityInput("karat", 0).isValid, false, "Zero rejected");
assertEqual(validateGoldPurityInput("karat", -5).isValid, false, "Negative rejected");
assertEqual(validateGoldPurityInput("karat", 25).isValid, false, "Karat > 24 rejected");
assertEqual(validateGoldPurityInput("percentage", 101).isValid, false, "Percentage > 100 rejected");
assertEqual(validateGoldPurityInput("fineness", 1005).isValid, false, "Fineness > 1000 rejected");
assertEqual(validateGoldPurityInput("karat", "abc").isValid, false, "Non-numeric string rejected");
assertEqual(validateGoldPurityInput("karat", 22).isValid, true, "Valid 22K accepted");
assertEqual(validateGoldPurityInput("percentage", 91.6).isValid, true, "Valid 91.6% accepted");
assertEqual(validateGoldPurityInput("fineness", 916).isValid, true, "Valid 916 fineness accepted");

console.log("\n=================================================");
console.log("ALL 12 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");

