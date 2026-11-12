/**
 * Independent Raw-Data Testing for CalcZen Silver Jewellery Bill Calculator
 * Covers all 12 test cases specified in Phase 11.
 */

import {
  calculateSilverJewelleryBill,
  validateSilverJewelleryInputs,
  roundTo,
  formatINR,
  type SilverBillInputs,
} from "../src/utils/silverJewelleryUtils";

function assertClose(actual: number, expected: number, tolerance: number = 0.01, label: string = "") {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`[FAIL] ${label}: Expected ${expected}, got ${actual} (diff: ${diff})`);
  }
  console.log(`  ✓ ${label}: ${actual} matches expected ${expected}`);
}

console.log("=================================================");
console.log("CALCZEN: SILVER JEWELLERY BILL CALCULATOR TESTS");
console.log("=================================================\n");

// TEST 1: Basic 925 Silver
console.log("Test 1: Basic 925 Silver (20g @ ₹100/g, 10% making, 3% GST)");
const t1 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 20,
  grossWeight: 20,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
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
assertClose(t1.silverMetalValue, 2000, 0.01, "Test 1 Silver Value");
assertClose(t1.makingCharges, 200, 0.01, "Test 1 Making Charges");
assertClose(t1.taxableValue, 2200, 0.01, "Test 1 Taxable Value");
assertClose(t1.gstAmount, 66, 0.01, "Test 1 GST Amount");
assertClose(t1.finalBillAmount, 2266, 0.01, "Test 1 Final Bill");

// TEST 2: 999 Silver Rate Conversion
console.log("\nTest 2: 999 Silver Rate Conversion (10g, 925 purity, 999 rate @ ₹120/g, 3% GST)");
const t2 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  nonSilverWeight: 0,
  purity: "925",
  rate: 120,
  rateBasis: "999",
  makingChargeMethod: "percentage",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
const expectedEquivalentRate = 120 * (925 / 999);
const expectedSilverVal = 10 * expectedEquivalentRate;
const expectedGst = expectedSilverVal * 0.03;
const expectedFinalBeforeRounding = expectedSilverVal + expectedGst;

assertClose(t2.effectiveRatePerGram, expectedEquivalentRate, 0.0001, "Test 2 Equivalent Rate (111.1111...)");
assertClose(t2.silverMetalValue, expectedSilverVal, 0.0001, "Test 2 Silver Value (1111.1111...)");
assertClose(t2.gstAmount, expectedGst, 0.0001, "Test 2 GST Amount (33.3333...)");
assertClose(t2.finalBillAmount, expectedFinalBeforeRounding, 0.0001, "Test 2 Final Bill before rounding (1144.4444...)");
assertClose(roundTo(t2.finalBillAmount, 2), 1144.44, 0.001, "Test 2 Final Displayed Bill (1144.44)");

// TEST 3: Making Charge Per Gram
console.log("\nTest 3: Making Charge Per Gram (50g @ ₹100/g, ₹15/g making, 3% GST)");
const t3 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 50,
  grossWeight: 50,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "per_gram",
  makingChargePercentage: 0,
  makingChargePerGram: 15,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t3.silverMetalValue, 5000, 0.01, "Test 3 Silver Value");
assertClose(t3.makingCharges, 750, 0.01, "Test 3 Making Charges (50 * 15)");
assertClose(t3.taxableValue, 5750, 0.01, "Test 3 Taxable Value");
assertClose(t3.gstAmount, 172.5, 0.01, "Test 3 GST Amount");
assertClose(t3.finalBillAmount, 5922.5, 0.01, "Test 3 Final Bill");

// TEST 4: Fixed Making Charge
console.log("\nTest 4: Fixed Making Charge (10g 999 @ ₹120/g, ₹300 fixed making, 3% GST)");
const t4 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  nonSilverWeight: 0,
  purity: "999",
  rate: 120,
  rateBasis: "selected_purity",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 300,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t4.silverMetalValue, 1200, 0.01, "Test 4 Silver Value");
assertClose(t4.makingCharges, 300, 0.01, "Test 4 Making Charges");
assertClose(t4.taxableValue, 1500, 0.01, "Test 4 Taxable Value");
assertClose(t4.gstAmount, 45, 0.01, "Test 4 GST Amount");
assertClose(t4.finalBillAmount, 1545, 0.01, "Test 4 Final Bill");

// TEST 5: Percentage Discount
console.log("\nTest 5: Percentage Discount (20g @ ₹100/g, 10% making, 5% discount, 3% GST)");
const t5 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 20,
  grossWeight: 20,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "percentage",
  makingChargePercentage: 10,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "percentage",
  discountValue: 5,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t5.silverMetalValue, 2000, 0.01, "Test 5 Silver Value");
assertClose(t5.makingCharges, 200, 0.01, "Test 5 Making Charges");
assertClose(t5.subtotalBeforeDiscount, 2200, 0.01, "Test 5 Subtotal");
assertClose(t5.discountAmount, 110, 0.01, "Test 5 Discount (2200 * 0.05)");
assertClose(t5.taxableValue, 2090, 0.01, "Test 5 Taxable Value");
assertClose(t5.gstAmount, 62.7, 0.01, "Test 5 GST Amount");
assertClose(t5.finalBillAmount, 2152.7, 0.01, "Test 5 Final Bill");

// TEST 6: Fixed Discount
console.log("\nTest 6: Fixed Discount (10g @ ₹100/g, ₹100 fixed making, ₹50 discount, 3% GST)");
const t6 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 100,
  discountType: "fixed",
  discountValue: 50,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t6.silverMetalValue, 1000, 0.01, "Test 6 Silver Value");
assertClose(t6.makingCharges, 100, 0.01, "Test 6 Making Charges");
assertClose(t6.subtotalBeforeDiscount, 1100, 0.01, "Test 6 Subtotal");
assertClose(t6.discountAmount, 50, 0.01, "Test 6 Discount Amount");
assertClose(t6.taxableValue, 1050, 0.01, "Test 6 Taxable Value");
assertClose(t6.gstAmount, 31.5, 0.01, "Test 6 GST Amount");
assertClose(t6.finalBillAmount, 1081.5, 0.01, "Test 6 Final Bill");

// TEST 7: Stone Weight Deduction
console.log("\nTest 7: Stone Weight Deduction (25g Gross - 5g Stones = 20g Net @ ₹100/g, 3% GST)");
const t7 = calculateSilverJewelleryBill({
  weightMode: "gross_stone",
  netWeight: 0,
  grossWeight: 25,
  nonSilverWeight: 5,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "percentage",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t7.netWeight, 20, 0.001, "Test 7 Net Weight (25 - 5 = 20g)");
assertClose(t7.silverMetalValue, 2000, 0.01, "Test 7 Silver Value");
assertClose(t7.taxableValue, 2000, 0.01, "Test 7 Taxable Value");
assertClose(t7.gstAmount, 60, 0.01, "Test 7 GST Amount");
assertClose(t7.finalBillAmount, 2060, 0.01, "Test 7 Final Bill");

// TEST 8: GST Excluded
console.log("\nTest 8: GST Excluded (20g @ ₹100/g, ₹200 making, GST 0%)");
const t8 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 20,
  grossWeight: 20,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "fixed",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 200,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: false,
  gstRate: 0,
});
assertClose(t8.silverMetalValue, 2000, 0.01, "Test 8 Silver Value");
assertClose(t8.taxableValue, 2200, 0.01, "Test 8 Taxable Value");
assertClose(t8.gstAmount, 0, 0.01, "Test 8 GST Amount (0)");
assertClose(t8.finalBillAmount, 2200, 0.01, "Test 8 Final Bill before GST");

// TEST 9: Zero Making Charges
console.log("\nTest 9: Zero Making Charges (10g 999 @ ₹120/g, 0 making, 3% GST)");
const t9 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 10,
  grossWeight: 10,
  nonSilverWeight: 0,
  purity: "999",
  rate: 120,
  rateBasis: "selected_purity",
  makingChargeMethod: "percentage",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
assertClose(t9.silverMetalValue, 1200, 0.01, "Test 9 Silver Value");
assertClose(t9.gstAmount, 36, 0.01, "Test 9 GST Amount");
assertClose(t9.finalBillAmount, 1236, 0.01, "Test 9 Final Bill");

// TEST 10: Validation Tests
console.log("\nTest 10: Validation Tests");
const valZeroWeight = validateSilverJewelleryInputs({
  weightMode: "net",
  netWeight: 0,
  grossWeight: 0,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
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
if (valZeroWeight.isValid || !valZeroWeight.errors.netWeight) {
  throw new Error("[FAIL] Validation failed: Zero weight should be invalid");
}
console.log("  ✓ Zero weight correctly rejected:", valZeroWeight.errors.netWeight);

const valStoneGreater = validateSilverJewelleryInputs({
  weightMode: "gross_stone",
  netWeight: 0,
  grossWeight: 10,
  nonSilverWeight: 12,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
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
if (valStoneGreater.isValid || !valStoneGreater.errors.nonSilverWeight) {
  throw new Error("[FAIL] Validation failed: Non-silver weight >= gross weight should be invalid");
}
console.log("  ✓ Stone weight > gross weight correctly rejected:", valStoneGreater.errors.nonSilverWeight);

// TEST 11: Rate Basis Protection
console.log("\nTest 11: Rate Basis Protection");
const t11 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 20,
  grossWeight: 20,
  nonSilverWeight: 0,
  purity: "925",
  rate: 100,
  rateBasis: "selected_purity",
  makingChargeMethod: "percentage",
  makingChargePercentage: 0,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: false,
  gstRate: 0,
});
assertClose(t11.silverMetalValue, 2000, 0.01, "Test 11 Direct Rate not double multiplied");

// TEST 12: Decimal & Rounding Precision
console.log("\nTest 12: Decimal & Rounding Precision (12.345g @ ₹98.75/g, 8.5% making, 3% GST)");
const t12 = calculateSilverJewelleryBill({
  weightMode: "net",
  netWeight: 12.345,
  grossWeight: 12.345,
  nonSilverWeight: 0,
  purity: "925",
  rate: 98.75,
  rateBasis: "selected_purity",
  makingChargeMethod: "percentage",
  makingChargePercentage: 8.5,
  makingChargePerGram: 0,
  fixedMakingCharge: 0,
  discountType: "none",
  discountValue: 0,
  otherCharges: 0,
  gstEnabled: true,
  gstRate: 3,
});
const expectedT12Metal = 12.345 * 98.75; // 1219.06875
const expectedT12Making = (expectedT12Metal * 8.5) / 100; // 103.62084375
const expectedT12Taxable = expectedT12Metal + expectedT12Making; // 1322.68959375
const expectedT12Gst = expectedT12Taxable * 0.03; // 39.6806878125
const expectedT12Total = expectedT12Taxable + expectedT12Gst; // 1362.3702815625

assertClose(t12.silverMetalValue, expectedT12Metal, 0.0001, "Test 12 Exact Metal Value");
assertClose(t12.makingCharges, expectedT12Making, 0.0001, "Test 12 Exact Making Charges");
assertClose(t12.taxableValue, expectedT12Taxable, 0.0001, "Test 12 Exact Taxable Value");
assertClose(t12.finalBillAmount, expectedT12Total, 0.0001, "Test 12 Exact Final Bill");
assertClose(roundTo(t12.finalBillAmount, 2), 1362.37, 0.001, "Test 12 Rounded Final Bill (1362.37)");

console.log("\n=================================================");
console.log("ALL 12 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");

