/**
 * Independent Raw-Data Testing for CalcZen Diamond Jewellery Price Calculator
 * Validates all 9 test cases specified in Phase 13.
 */

import {
  calculateDiamondJewelleryPrice,
  validateDiamondJewelleryInputs,
  caratToGrams,
  roundTo,
  type DiamondJewelleryInputs,
} from "../src/utils/diamondJewelleryUtils";

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
console.log("CALCZEN: DIAMOND JEWELLERY PRICE CALCULATOR TESTS");
console.log("=================================================\n");

// TEST 1: Simple diamond jewellery bill
console.log("Test 1: Simple Diamond Jewellery Bill (₹40k diamond, ₹50k metal, 10% making, 3% GST)");
const t1 = calculateDiamondJewelleryPrice({
  mode: "simple",
  directDiamondPrice: 40000,
  directMetalPrice: 50000,
  diamonds: [],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "percentage",
  makingChargePercentage: 10,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t1.totalDiamondValue, 40000, 0.01, "Test 1 Diamond Value");
assertClose(t1.totalMetalValue, 50000, 0.01, "Test 1 Metal Value");
assertClose(t1.makingCharges, 5000, 0.01, "Test 1 Making Charges (10% of ₹50k metal)");
assertClose(t1.taxableValue, 95000, 0.01, "Test 1 Taxable Value (40k + 50k + 5k)");
assertClose(t1.gstAmount, 2850, 0.01, "Test 1 GST (3% of ₹95,000)");
assertClose(t1.finalBillAmount, 97850, 0.01, "Test 1 Final Bill");

// TEST 2: Diamond price per carat
console.log("\nTest 2: Diamond Price Per Carat (0.50 ct @ ₹80,000/ct, ₹30,000 metal, ₹3,000 making, 3% GST)");
const t2 = calculateDiamondJewelleryPrice({
  mode: "advanced",
  directDiamondPrice: 0,
  directMetalPrice: 30000,
  diamonds: [
    {
      id: "d1",
      caratWeight: 0.5,
      pricingBasis: "per_carat",
      pricePerCarat: 80000,
    },
  ],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 3000,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t2.totalDiamondValue, 40000, 0.01, "Test 2 Diamond Value (0.50 ct * ₹80k)");
assertClose(t2.totalMetalValue, 30000, 0.01, "Test 2 Metal Value");
assertClose(t2.makingCharges, 3000, 0.01, "Test 2 Making Charges");
assertClose(t2.taxableValue, 73000, 0.01, "Test 2 Taxable Value");
assertClose(t2.gstAmount, 2190, 0.01, "Test 2 GST (3% of ₹73,000)");
assertClose(t2.finalBillAmount, 75190, 0.01, "Test 2 Final Bill");

// TEST 3: Total diamond price in advanced mode
console.log("\nTest 3: Total Diamond Price (₹75,000 diamond, ₹40,000 metal, ₹4,000 making, 3% GST)");
const t3 = calculateDiamondJewelleryPrice({
  mode: "advanced",
  directDiamondPrice: 0,
  directMetalPrice: 40000,
  diamonds: [
    {
      id: "d1",
      caratWeight: 1.0,
      pricingBasis: "total",
      totalDiamondPrice: 75000,
    },
  ],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 4000,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t3.totalDiamondValue, 75000, 0.01, "Test 3 Diamond Value");
assertClose(t3.totalMetalValue, 40000, 0.01, "Test 3 Metal Value");
assertClose(t3.makingCharges, 4000, 0.01, "Test 3 Making Charges");
assertClose(t3.taxableValue, 119000, 0.01, "Test 3 Taxable Value");
assertClose(t3.gstAmount, 3570, 0.01, "Test 3 GST (3% of ₹1,19,000)");
assertClose(t3.finalBillAmount, 122570, 0.01, "Test 3 Final Bill");

// TEST 4: Multiple diamonds
console.log("\nTest 4: Multiple Diamonds (0.30 ct @ ₹80k/ct + 0.20 ct @ ₹80k/ct, ₹25k metal, ₹2.5k making, 3% GST)");
const t4 = calculateDiamondJewelleryPrice({
  mode: "advanced",
  directDiamondPrice: 0,
  directMetalPrice: 25000,
  diamonds: [
    {
      id: "d1",
      caratWeight: 0.3,
      pricingBasis: "per_carat",
      pricePerCarat: 80000,
    },
    {
      id: "d2",
      caratWeight: 0.2,
      pricingBasis: "per_carat",
      pricePerCarat: 80000,
    },
  ],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 2500,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t4.totalDiamondWeightCarats, 0.5, 0.001, "Test 4 Total Diamond Weight (0.30 + 0.20 = 0.50 ct)");
assertClose(t4.totalDiamondValue, 40000, 0.01, "Test 4 Total Diamond Value (24k + 16k = 40k)");
assertClose(t4.totalMetalValue, 25000, 0.01, "Test 4 Metal Value");
assertClose(t4.makingCharges, 2500, 0.01, "Test 4 Making Charges");
assertClose(t4.taxableValue, 67500, 0.01, "Test 4 Taxable Value");
assertClose(t4.gstAmount, 2025, 0.01, "Test 4 GST (3% of ₹67,500)");
assertClose(t4.finalBillAmount, 69525, 0.01, "Test 4 Final Bill");

// TEST 5: Discount
console.log("\nTest 5: Discount (₹40k diamond, ₹50k metal, ₹5k making, 5% discount, 3% GST)");
const t5 = calculateDiamondJewelleryPrice({
  mode: "simple",
  directDiamondPrice: 40000,
  directMetalPrice: 50000,
  diamonds: [],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 5000,
  discountType: "percentage",
  discountValue: 5,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t5.subtotalBeforeDiscount, 95000, 0.01, "Test 5 Subtotal Before Discount");
assertClose(t5.discountAmount, 4750, 0.01, "Test 5 Discount Amount (5% of 95,000)");
assertClose(t5.taxableValue, 90250, 0.01, "Test 5 Taxable Value (95,000 - 4,750)");
assertClose(t5.gstAmount, 2707.5, 0.01, "Test 5 GST Amount (3% of 90,250)");
assertClose(t5.finalBillAmount, 92957.5, 0.01, "Test 5 Final Bill");

// TEST 6: Fixed making charges
console.log("\nTest 6: Fixed Making Charges (₹40k diamond, ₹50k metal, ₹3,000 fixed making, 3% GST)");
const t6 = calculateDiamondJewelleryPrice({
  mode: "simple",
  directDiamondPrice: 40000,
  directMetalPrice: 50000,
  diamonds: [],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 3000,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t6.taxableValue, 93000, 0.01, "Test 6 Taxable Value");
assertClose(t6.gstAmount, 2790, 0.01, "Test 6 GST Amount");
assertClose(t6.finalBillAmount, 95790, 0.01, "Test 6 Final Bill");

// TEST 7: Carat to gram conversion
console.log("\nTest 7: Carat to Gram Conversion (1 ct = 0.20g, 0.50 ct = 0.10g)");
assertClose(caratToGrams(1.0), 0.2, 0.0001, "Test 7: 1.00 Carat in Grams");
assertClose(caratToGrams(0.5), 0.1, 0.0001, "Test 7: 0.50 Carat in Grams");
assertClose(caratToGrams(2.5), 0.5, 0.0001, "Test 7: 2.50 Carats in Grams");

// TEST 8: Validation tests
console.log("\nTest 8: Validation Edge Cases");
const vNegativeDiamond = validateDiamondJewelleryInputs({
  mode: "simple",
  directDiamondPrice: -100,
  directMetalPrice: 50000,
  diamonds: [],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "percentage",
  makingChargePercentage: 10,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertEqual(vNegativeDiamond.isValid, false, "Negative diamond price rejected");

const vZeroCaratPerCarat = validateDiamondJewelleryInputs({
  mode: "advanced",
  directDiamondPrice: 0,
  directMetalPrice: 50000,
  diamonds: [
    {
      id: "d1",
      caratWeight: 0,
      pricingBasis: "per_carat",
      pricePerCarat: 80000,
    },
  ],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "percentage",
  makingChargePercentage: 10,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertEqual(vZeroCaratPerCarat.isValid, false, "Zero carat weight with per-carat pricing rejected");

const vDiscountOverflow = validateDiamondJewelleryInputs({
  mode: "simple",
  directDiamondPrice: 40000,
  directMetalPrice: 50000,
  diamonds: [],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "percentage",
  makingChargePercentage: 10,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "percentage",
  discountValue: 120, // > 100%
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertEqual(vDiscountOverflow.isValid, false, "Discount > 100% rejected");

// TEST 9: No Invented Market Pricing Verification
console.log("\nTest 9: Verification that 4Cs alone do not invent diamond price");
// In advanced mode, if a user enters 1.0 carat but enters 0 price, diamond value must be 0, not fabricated.
const t9 = calculateDiamondJewelleryPrice({
  mode: "advanced",
  directDiamondPrice: 0,
  directMetalPrice: 50000,
  diamonds: [
    {
      id: "d1",
      caratWeight: 1.0,
      pricingBasis: "total",
      totalDiamondPrice: 0,
      color: "D-F",
      clarity: "FL-IF",
      cut: "excellent",
      certification: "GIA",
    },
  ],
  metalWeightGrams: 0,
  metalPurityKarat: "18K",
  metalRatePerGram: 0,
  metalCalculationMode: "direct",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: false,
  gstRate: 0,
});
assertClose(t9.totalDiamondValue, 0, 0.001, "Test 9: No price invented for 1 ct D/FL-IF diamond without user quotation");

console.log("\n=================================================");
console.log("ALL 9 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");

