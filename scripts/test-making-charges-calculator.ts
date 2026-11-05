/**
 * Independent Raw Data Test Suite for CalcZen Gold Making Charges Calculator (India)
 * Verifies all 10 Phase 15 Test Cases mathematically without using the system under test to generate expected values.
 */

import {
  calculateGoldMakingCharges,
  compareMakingChargeOffers,
  calculateMakingChargeNegotiationSavings,
  calculateAffordableWeightFromBudget,
  convertWeightToGrams,
  MakingChargesInputs,
} from "../src/utils/makingChargesCalculatorUtils";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, actual?: any, expected?: any) {
  if (condition) {
    console.log(`[PASS] ${testName} (Actual: ${actual ?? "OK"}, Expected: ${expected ?? "OK"})`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName} (Actual: ${actual}, Expected: ${expected})`);
    failedCount++;
  }
}

function approxEqual(a: number, b: number, tolerance = 0.05): boolean {
  return Math.abs(a - b) <= tolerance;
}

console.log("==========================================================");
console.log("CALCZEN GOLD MAKING CHARGES CALCULATOR TEST SUITE");
console.log("==========================================================\n");

// --- TEST CASE 1: PERCENTAGE METHOD ---
console.log("--- Test Case 1: Percentage Method ---");
const tc1Inputs: MakingChargesInputs = {
  purity: "22k-916",
  goldWeight: 10,
  weightUnit: "grams",
  goldRate: 150000,
  goldRateBasis: "per_10g",
  goldRateType: "derived_from_24k",
  makingChargeMethod: "percentage",
  makingChargePercentage: 8,
  makingChargePerGram: 0,
  flatMakingCharge: 0,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
};
const tc1 = calculateGoldMakingCharges(tc1Inputs);
assert(approxEqual(tc1.effectiveGoldRatePerGram, 13750), "22K derived rate per gram is ₹13,750", tc1.effectiveGoldRatePerGram, 13750);
assert(approxEqual(tc1.rawGoldValue, 137500), "Gold Value is ₹1,37,500", tc1.rawGoldValue, 137500);
assert(approxEqual(tc1.netMakingCharges, 11000), "Making Charges (8%) is ₹11,000", tc1.netMakingCharges, 11000);
assert(approxEqual(tc1.makingChargePerGram, 1100), "Making charge per gram is ₹1,100", tc1.makingChargePerGram, 1100);
assert(approxEqual(tc1.makingChargePercentageEquivalent, 8), "Equivalent percentage is 8%", tc1.makingChargePercentageEquivalent, 8);
assert(approxEqual(tc1.makingChargePer10g, 11000), "Making charge per 10g is ₹11,000", tc1.makingChargePer10g, 11000);
assert(approxEqual(tc1.totalGstAmount, 4455), "GST (3%) is ₹4,455", tc1.totalGstAmount, 4455);
assert(approxEqual(tc1.gstOnMakingCharges, 330), "GST on making charges portion (3% of ₹11,000) is ₹330", tc1.gstOnMakingCharges, 330);
assert(approxEqual(tc1.finalTotalJewelleryAmount, 152955), "Final Total is ₹1,52,955", tc1.finalTotalJewelleryAmount, 152955);

// --- TEST CASE 2: PER-GRAM METHOD ---
console.log("\n--- Test Case 2: Per-Gram Method ---");
const tc2Inputs: MakingChargesInputs = {
  purity: "22k-916",
  goldWeight: 10,
  weightUnit: "grams",
  goldRate: 13750,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeMethod: "per_gram",
  makingChargePercentage: 0,
  makingChargePerGram: 500,
  flatMakingCharge: 0,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
};
const tc2 = calculateGoldMakingCharges(tc2Inputs);
assert(approxEqual(tc2.netMakingCharges, 5000), "Making charges (10g × ₹500/g) is ₹5,000", tc2.netMakingCharges, 5000);
assert(approxEqual(tc2.makingChargePerGram, 500), "Making charge per gram is ₹500", tc2.makingChargePerGram, 500);
const expectedTc2Pct = (5000 / 137500) * 100; // ~3.63636%
assert(approxEqual(tc2.makingChargePercentageEquivalent, expectedTc2Pct, 0.001), `Equivalent percentage is ~3.63636%`, tc2.makingChargePercentageEquivalent, expectedTc2Pct);
assert(approxEqual(tc2.finalTotalJewelleryAmount, 146775), "GST-inclusive total is ₹1,46,775", tc2.finalTotalJewelleryAmount, 146775);

// --- TEST CASE 3: FLAT METHOD ---
console.log("\n--- Test Case 3: Flat Method ---");
const tc3Inputs: MakingChargesInputs = {
  purity: "22k-916",
  goldWeight: 10,
  weightUnit: "grams",
  goldRate: 13750,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeMethod: "flat",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  flatMakingCharge: 8000,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
};
const tc3 = calculateGoldMakingCharges(tc3Inputs);
assert(approxEqual(tc3.netMakingCharges, 8000), "Making charges is flat ₹8,000", tc3.netMakingCharges, 8000);
assert(approxEqual(tc3.makingChargePerGram, 800), "Making charge per gram (₹8,000 / 10g) is ₹800", tc3.makingChargePerGram, 800);
const expectedTc3Pct = (8000 / 137500) * 100; // ~5.81818%
assert(approxEqual(tc3.makingChargePercentageEquivalent, expectedTc3Pct, 0.001), `Equivalent percentage is ~5.81818%`, tc3.makingChargePercentageEquivalent, expectedTc3Pct);
assert(approxEqual(tc3.finalTotalJewelleryAmount, 149865), "GST-inclusive total is ₹1,49,865", tc3.finalTotalJewelleryAmount, 149865);

// --- TEST CASE 4: WASTAGE PLUS MAKING ---
console.log("\n--- Test Case 4: Wastage Plus Making ---");
const tc4Inputs: MakingChargesInputs = {
  ...tc1Inputs,
  makingChargeMethod: "percentage",
  makingChargePercentage: 8,
  wastageType: "percentage",
  wastageValue: 5,
};
const tc4 = calculateGoldMakingCharges(tc4Inputs);
assert(approxEqual(tc4.netMakingCharges, 11000), "Making charges is ₹11,000", tc4.netMakingCharges, 11000);
assert(approxEqual(tc4.wastageValue, 6875), "Wastage (5% of ₹1,37,500) is ₹6,875", tc4.wastageValue, 6875);
assert(approxEqual(tc4.taxableTransactionValue, 155375), "Taxable value is ₹1,55,375", tc4.taxableTransactionValue, 155375);
assert(approxEqual(tc4.totalGstAmount, 4661.25), "GST (3%) is ₹4,661.25", tc4.totalGstAmount, 4661.25);
assert(approxEqual(tc4.finalTotalJewelleryAmount, 160036.25), "Final Total is ₹1,60,036.25", tc4.finalTotalJewelleryAmount, 160036.25);

// --- TEST CASE 5: DISCOUNT ---
console.log("\n--- Test Case 5: Discount ---");
const tc5Inputs: MakingChargesInputs = {
  ...tc1Inputs,
  makingChargeMethod: "percentage",
  makingChargePercentage: 8,
  discountType: "percentage",
  discountValue: 10,
};
const tc5 = calculateGoldMakingCharges(tc5Inputs);
assert(approxEqual(tc5.originalMakingCharges, 11000), "Original making charges is ₹11,000", tc5.originalMakingCharges, 11000);
assert(approxEqual(tc5.makingChargeDiscount, 1100), "10% Discount on making is ₹1,100", tc5.makingChargeDiscount, 1100);
assert(approxEqual(tc5.netMakingCharges, 9900), "Net making charges after discount is ₹9,900", tc5.netMakingCharges, 9900);
assert(approxEqual(tc5.taxableTransactionValue, 147400), "Taxable value is ₹1,47,400", tc5.taxableTransactionValue, 147400);
assert(approxEqual(tc5.totalGstAmount, 4422), "GST (3%) is ₹4,422", tc5.totalGstAmount, 4422);
assert(approxEqual(tc5.finalTotalJewelleryAmount, 151822), "Final Total is ₹1,51,822", tc5.finalTotalJewelleryAmount, 151822);

// --- TEST CASE 6: WEIGHT CONVERSIONS ---
console.log("\n--- Test Case 6: Weight Conversions ---");
assert(approxEqual(convertWeightToGrams(1000, "milligrams"), 1), "1,000 mg = 1 gram", convertWeightToGrams(1000, "milligrams"), 1);
assert(approxEqual(convertWeightToGrams(1, "pavan"), 8), "1 pavan = 8 grams", convertWeightToGrams(1, "pavan"), 8);
assert(approxEqual(convertWeightToGrams(1, "tola"), 11.6638, 0.001), "1 tola ≈ 11.6638 grams", convertWeightToGrams(1, "tola"), 11.6638);

// --- TEST CASE 7: ZERO VALUES & SAFETY ---
console.log("\n--- Test Case 7: Zero Values & Safety ---");
const tc7Inputs: MakingChargesInputs = {
  purity: "22k-916",
  goldWeight: 0,
  weightUnit: "grams",
  goldRate: 0,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeMethod: "percentage",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  flatMakingCharge: 0,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
};
const tc7 = calculateGoldMakingCharges(tc7Inputs);
assert(!isNaN(tc7.makingChargePerGram) && tc7.makingChargePerGram === 0, "Zero weight results in 0 per gram without NaN", tc7.makingChargePerGram, 0);
assert(!isNaN(tc7.makingChargePercentageEquivalent) && tc7.makingChargePercentageEquivalent === 0, "Zero gold value results in 0% equivalent without NaN", tc7.makingChargePercentageEquivalent, 0);
assert(tc7.finalTotalJewelleryAmount === 0, "Final amount is 0", tc7.finalTotalJewelleryAmount, 0);

// --- TEST CASE 8: COMPARISON ---
console.log("\n--- Test Case 8: Jeweller Quote Comparison ---");
const comparisonRes = compareMakingChargeOffers(tc1Inputs, [
  { jewellerName: "Jeweller A", method: "percentage", value: 8 },
  { jewellerName: "Jeweller B", method: "per_gram", value: 500 },
]);
assert(comparisonRes.offers[0].netMakingCharges === 11000, "Offer A Making is ₹11,000", comparisonRes.offers[0].netMakingCharges, 11000);
assert(comparisonRes.offers[1].netMakingCharges === 5000, "Offer B Making is ₹5,000", comparisonRes.offers[1].netMakingCharges, 5000);
assert(comparisonRes.cheapestIndex === 1, "Jeweller B is cheaper", comparisonRes.cheapestOfferName, "Jeweller B");
assert(approxEqual(comparisonRes.differenceInMakingCharges, 6000), "Pre-tax difference is ₹6,000", comparisonRes.differenceInMakingCharges, 6000);
assert(approxEqual(comparisonRes.differenceInTotalBillWithGst, 6180), "Difference with 3% GST is ₹6,180", comparisonRes.differenceInTotalBillWithGst, 6180);

// --- TEST CASE 9: BUDGET MODE REVERSE CALCULATION ---
console.log("\n--- Test Case 9: Budget Mode Reverse Calculation ---");
const budgetAmount = 150000;
const budgetRes = calculateAffordableWeightFromBudget(budgetAmount, {
  purity: "22k-916",
  goldRate: 150000,
  goldRateBasis: "per_10g",
  goldRateType: "derived_from_24k",
  makingChargeMethod: "percentage",
  makingChargePercentage: 8,
  makingChargePerGram: 0,
  flatMakingCharge: 0,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
});
console.log(`Affordable Gold Weight for ₹${budgetAmount.toLocaleString("en-IN")}: ${budgetRes.affordableWeightGrams} grams`);
console.log(`Verified Final Total: ₹${budgetRes.verifiedFinalTotalINR.toLocaleString("en-IN")}, Diff: ₹${budgetRes.differenceFromBudgetINR}`);
assert(budgetRes.affordableWeightGrams > 0, "Affordable weight is positive", budgetRes.affordableWeightGrams > 0, true);
assert(Math.abs(budgetRes.differenceFromBudgetINR) <= 50, "Verified final total matches budget within milligram rounding tolerance", Math.abs(budgetRes.differenceFromBudgetINR) <= 50, true);

// Test budget with per-gram method
const budgetPerGramRes = calculateAffordableWeightFromBudget(100000, {
  purity: "22k-916",
  goldRate: 13750,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeMethod: "per_gram",
  makingChargePercentage: 0,
  makingChargePerGram: 500,
  flatMakingCharge: 0,
  wastageType: "none",
  wastageValue: 0,
  discountType: "none",
  discountValue: 0,
  gstRatePct: 3,
  gstTransactionType: "intra_state",
});
assert(Math.abs(budgetPerGramRes.differenceFromBudgetINR) <= 50, "Per-gram budget verification within milligram tolerance", Math.abs(budgetPerGramRes.differenceFromBudgetINR) <= 50, true);

// --- TEST CASE 10: EDGE CASES & NEGOTIATION ---
console.log("\n--- Test Case 10: Edge Cases & Negotiation ---");
// Negotiation tool: 10% vs 8% on ₹1,37,500 gold value
const negRes = calculateMakingChargeNegotiationSavings(tc1Inputs, 10, "percentage", 8, "percentage");
assert(approxEqual(negRes.currentMakingCharges, 13750), "Current 10% making is ₹13,750", negRes.currentMakingCharges, 13750);
assert(approxEqual(negRes.desiredMakingCharges, 11000), "Desired 8% making is ₹11,000", negRes.desiredMakingCharges, 11000);
assert(approxEqual(negRes.preTaxSavings, 2750), "Pre-tax savings is ₹2,750", negRes.preTaxSavings, 2750);
assert(approxEqual(negRes.gstSavings, 82.5), "GST savings is ₹82.50", negRes.gstSavings, 82.5);
assert(approxEqual(negRes.totalSavingsWithGst, 2832.5), "Total savings including 3% GST is ₹2,832.50", negRes.totalSavingsWithGst, 2832.5);

// 18K purity check
const tc10_18k = calculateGoldMakingCharges({
  ...tc1Inputs,
  purity: "18k-750",
  goldRate: 150000,
  goldRateBasis: "per_10g",
  goldRateType: "derived_from_24k",
});
assert(approxEqual(tc10_18k.effectiveGoldRatePerGram, 11250), "18K derived rate per gram is ₹11,250 (75% of 15k)", tc10_18k.effectiveGoldRatePerGram, 11250);

// Discount greater than making charges safety test
const tc10_discOver = calculateGoldMakingCharges({
  ...tc1Inputs,
  discountType: "flat",
  discountValue: 25000, // Greater than ₹11,000 making charge
});
assert(tc10_discOver.netMakingCharges === 0, "Excess flat discount is capped at making charge (does not make making charge negative)", tc10_discOver.netMakingCharges, 0);

console.log("\n==========================================================");
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("==========================================================");

if (failedCount > 0) {
  process.exit(1);
}

