import {
  calculateFinalJewelleryBill,
  calculateBudgetBasedWeight,
  compareTwoJewellerQuotes,
  convertWeightToGrams,
  convertRateToPerGram,
  calculateDerivedGoldRate,
  type JewelleryBillInputs,
  formatINR,
  formatINRWithDecimals,
} from "../src/utils/jewelleryCalculatorUtils";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

function assertClose(actual: number, expected: number, tolerance: number = 0.5, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`[PASS] ${message} (Actual: ${actual}, Expected: ${expected})`);
    passed++;
  } else {
    console.error(`[FAIL] ${message} (Actual: ${actual}, Expected: ${expected}, Diff: ${diff})`);
    failed++;
  }
}

console.log("=================================================");
console.log("CALCZEN GOLD JEWELLERY BILL CALCULATOR TEST SUITE");
console.log("=================================================");

// --- Test Case 1: Basic 22K Gold Bill ---
console.log("\n--- Test Case 1: Basic 22K Gold Bill ---");
// 24K gold rate: ₹1,50,000 per 10g (i.e. ₹15,000/g)
// Net gold weight: 10g
// Jewellery purity: 22K (22/24)
// Making charges: 8%
// Wastage: 0%, Other: 0, Discount: 0, GST: 3%
// Expected: Gold Value = 1,37,500, Making = 11,000, Taxable = 1,48,500, GST = 4,455, Final = 1,52,955
const tc1Inputs: JewelleryBillInputs = {
  purity: "22k-916",
  weightInputMode: "net_weight",
  grossWeight: 10,
  grossWeightUnit: "grams",
  nonGoldWeight: 0,
  nonGoldWeightUnit: "grams",
  netWeight: 10,
  netWeightUnit: "grams",
  goldRate: 150000,
  goldRateBasis: "per_10g",
  goldRateType: "derived_from_24k",
  makingChargeType: "percentage",
  makingChargeValue: 8,
  wastageType: "none",
  wastageValue: 0,
  diamondValue: 0,
  gemstoneValue: 0,
  otherStonesValue: 0,
  pearlsValue: 0,
  hallmarkingCharge: 0, // Set to 0 to match prompt benchmark
  certificationCharge: 0,
  packagingCharge: 0,
  otherServiceCharge: 0,
  discountType: "none",
  discountValue: 0,
  discountApplyOn: "making_charges",
  gstRatePct: 3,
  gstTransactionType: "intra_state",
};

const res1 = calculateFinalJewelleryBill(tc1Inputs);
assertClose(res1.ratePerGram24K, 15000, 0.01, "24K Rate per gram is ₹15,000");
assertClose(res1.effectiveGoldRatePerGram, 13750, 0.01, "Derived 22K Rate per gram is ₹13,750");
assertClose(res1.rawGoldValue, 137500, 0.01, "Gold Value is ₹1,37,500");
assertClose(res1.makingCharges, 11000, 0.01, "Making Charges (8%) is ₹11,000");
assertClose(res1.taxableTransactionValue, 148500, 0.01, "Taxable Value is ₹1,48,500");
assertClose(res1.totalGstAmount, 4455, 0.01, "GST (3%) is ₹4,455");
assertClose(res1.cgstAmount, 2227.5, 0.01, "CGST (1.5%) is ₹2,227.50");
assertClose(res1.sgstAmount, 2227.5, 0.01, "SGST (1.5%) is ₹2,227.50");
assertClose(res1.finalPayableAmount, 152955, 0.01, "Test 1 Expected Final Bill is ₹1,52,955");

// --- Test Case 2: Bill with Wastage ---
console.log("\n--- Test Case 2: Bill with Wastage ---");
// Same as TC1 + Wastage 5%
// Expected: Gold Value = 1,37,500, Wastage = 6,875, Making = 11,000, Taxable = 1,55,375, GST = 4,661.25, Final = 1,60,036.25
const tc2Inputs: JewelleryBillInputs = {
  ...tc1Inputs,
  wastageType: "percentage",
  wastageValue: 5,
};

const res2 = calculateFinalJewelleryBill(tc2Inputs);
assertClose(res2.rawGoldValue, 137500, 0.01, "Gold Value is ₹1,37,500");
assertClose(res2.wastageCharges, 6875, 0.01, "Wastage (5%) is ₹6,875");
assertClose(res2.makingCharges, 11000, 0.01, "Making Charges (8%) is ₹11,000");
assertClose(res2.taxableTransactionValue, 155375, 0.01, "Taxable Value is ₹1,55,375");
assertClose(res2.totalGstAmount, 4661.25, 0.01, "GST (3%) is ₹4,661.25");
assertClose(res2.finalPayableAmount, 160036.25, 0.01, "Test 2 Expected Final Bill is ₹1,60,036.25");

// --- Test Case 3: Per-Gram Making Charge ---
console.log("\n--- Test Case 3: Per-Gram Making Charge ---");
// Net gold weight: 10g, Gold rate: ₹12,000/g purity-specific
// Making charge: ₹500/g = ₹5,000, Wastage: 0, GST: 3%
// Expected: Gold Value = 1,20,000, Making = 5,000, Taxable = 1,25,000, GST = 3,750, Final = 1,28,750
const tc3Inputs: JewelleryBillInputs = {
  ...tc1Inputs,
  goldRate: 12000,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeType: "per_gram",
  makingChargeValue: 500,
  wastageType: "none",
  wastageValue: 0,
};

const res3 = calculateFinalJewelleryBill(tc3Inputs);
assertClose(res3.rawGoldValue, 120000, 0.01, "Gold Value is ₹1,20,000");
assertClose(res3.makingCharges, 5000, 0.01, "Making Charges (₹500/g) is ₹5,000");
assertClose(res3.taxableTransactionValue, 125000, 0.01, "Taxable Value is ₹1,25,000");
assertClose(res3.totalGstAmount, 3750, 0.01, "GST (3%) is ₹3,750");
assertClose(res3.finalPayableAmount, 128750, 0.01, "Test 3 Expected Final Bill is ₹1,28,750");

// --- Test Case 4: Flat Making Charge ---
console.log("\n--- Test Case 4: Flat Making Charge ---");
// Gold value: ₹1,00,000 (10g @ 10,000/g direct)
// Flat making: ₹8,000, Wastage: 0, GST: 3%
// Expected: Taxable = 1,08,000, GST = 3,240, Final = 1,11,240
const tc4Inputs: JewelleryBillInputs = {
  ...tc1Inputs,
  netWeight: 10,
  goldRate: 10000,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeType: "flat",
  makingChargeValue: 8000,
  wastageType: "none",
  wastageValue: 0,
};

const res4 = calculateFinalJewelleryBill(tc4Inputs);
assertClose(res4.rawGoldValue, 100000, 0.01, "Gold Value is ₹1,00,000");
assertClose(res4.makingCharges, 8000, 0.01, "Flat Making Charge is ₹8,000");
assertClose(res4.taxableTransactionValue, 108000, 0.01, "Taxable Value is ₹1,08,000");
assertClose(res4.totalGstAmount, 3240, 0.01, "GST (3%) is ₹3,240");
assertClose(res4.finalPayableAmount, 111240, 0.01, "Test 4 Expected Final Bill is ₹1,11,240");

// --- Test Case 5: Gross Weight with Stones ---
console.log("\n--- Test Case 5: Gross Weight with Stones ---");
// Gross weight: 12g, Stone weight: 2g -> Net gold weight = 10g
// Gold rate: ₹12,000/g, Making: 5%, Stone value: ₹10,000, GST: 3%
// Expected: Gold Value = 1,20,000, Making (5%) = 6,000, Stones = 10,000, Taxable = 1,36,000, GST = 4,080, Final = 1,40,080
const tc5Inputs: JewelleryBillInputs = {
  ...tc1Inputs,
  weightInputMode: "gross_weight",
  grossWeight: 12,
  grossWeightUnit: "grams",
  nonGoldWeight: 2,
  nonGoldWeightUnit: "grams",
  netWeight: 0,
  goldRate: 12000,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeType: "percentage",
  makingChargeValue: 5,
  gemstoneValue: 10000,
};

const res5 = calculateFinalJewelleryBill(tc5Inputs);
assertClose(res5.netGoldWeightGrams, 10, 0.01, "Net Gold Weight is 10g (12g - 2g)");
assertClose(res5.rawGoldValue, 120000, 0.01, "Gold Value is ₹1,20,000");
assertClose(res5.makingCharges, 6000, 0.01, "Making Charges (5%) is ₹6,000");
assertClose(res5.totalStoneValue, 10000, 0.01, "Stone Value is ₹10,000");
assertClose(res5.taxableTransactionValue, 136000, 0.01, "Taxable Value is ₹1,36,000");
assertClose(res5.totalGstAmount, 4080, 0.01, "GST (3%) is ₹4,080");
assertClose(res5.finalPayableAmount, 140080, 0.01, "Test 5 Expected Final Bill is ₹1,40,080");

// --- Test Case 6: Weight Conversion ---
console.log("\n--- Test Case 6: Weight Unit Conversions ---");
assertClose(convertWeightToGrams(1000, "milligrams"), 1, 0.0001, "1,000 mg = 1 gram");
assertClose(convertWeightToGrams(1, "pavan"), 8, 0.0001, "1 pavan = 8 grams");
assertClose(convertWeightToGrams(1, "tola"), 11.6638, 0.001, "1 tola ≈ 11.6638 grams");

// --- Test Case 7: Budget Mode (Reverse Calculation) ---
console.log("\n--- Test Case 7: Budget to Weight Calculation ---");
const budget = 150000;
const ratePerG = 13750; // 22K rate
const makingPct = 8;
const wastagePct = 0;
const gstPct = 3;
const hallmark = 0;

const estGrams = calculateBudgetBasedWeight(budget, ratePerG, makingPct, wastagePct, gstPct, hallmark);
console.log(`Estimated gold weight for ₹1,50,000 budget: ${estGrams} grams`);

// Verify reverse: plug estGrams into the bill calculator
const reverseInputs: JewelleryBillInputs = {
  ...tc1Inputs,
  netWeight: estGrams,
  goldRate: ratePerG,
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeValue: makingPct,
  wastageValue: wastagePct,
};
const reverseRes = calculateFinalJewelleryBill(reverseInputs);
assertClose(reverseRes.finalPayableAmount, budget, 20, `Reverse calculation verifies within rounding tolerance (Final: ₹${Math.round(reverseRes.finalPayableAmount)} vs Budget: ₹${budget})`);

// --- Test Case 8: Advanced Features & Edge Cases ---
console.log("\n--- Test Case 8: Quotation Comparison & Old Gold Exchange ---");

// Quotation Comparison: Jeweller A vs Jeweller B
const quoteAInputs: JewelleryBillInputs = {
  ...tc1Inputs,
  goldRate: 14000, // Higher gold rate
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeValue: 6, // Lower making charge
};
const quoteBInputs: JewelleryBillInputs = {
  ...tc1Inputs,
  goldRate: 13500, // Lower gold rate
  goldRateBasis: "per_gram",
  goldRateType: "direct",
  makingChargeValue: 12, // Higher making charge
};

const comparison = compareTwoJewellerQuotes(quoteAInputs, quoteBInputs);
assert(comparison.differenceInTotalPayable > 0, "Quotation Comparison detects bill difference between jewellers");
console.log(`Jeweller A Final: ₹${comparison.quoteA.finalPayableAmount.toFixed(0)}, Jeweller B Final: ₹${comparison.quoteB.finalPayableAmount.toFixed(0)}, Cheaper: ${comparison.cheaperQuote}`);

// Old Gold Exchange Test
const exchangeInputs: JewelleryBillInputs = {
  ...tc1Inputs,
  enableOldGoldExchange: true,
  oldGoldNetWeight: 5,
  oldGoldWeightUnit: "grams",
  oldGoldBuybackRatePerGram: 13500,
  oldGoldDeductionPct: 2, // 2% testing loss
};
const exchangeRes = calculateFinalJewelleryBill(exchangeInputs);
assertClose(exchangeRes.oldGoldGrossValue, 67500, 0.01, "Old Gold Gross Value is ₹67,500");
assertClose(exchangeRes.oldGoldDeductionAmount, 1350, 0.01, "Old Gold 2% Deduction is ₹1,350");
assertClose(exchangeRes.netOldGoldExchangeCredit, 66150, 0.01, "Net Exchange Credit is ₹66,150");
assertClose(exchangeRes.netPayableAfterExchange, 152955 - 66150, 0.01, "Net Payable after Old Gold Exchange is ₹86,805");

// Advance Payment Test
const advanceInputs: JewelleryBillInputs = {
  ...tc1Inputs,
  advancePaymentPaid: 50000,
};
const advanceRes = calculateFinalJewelleryBill(advanceInputs);
assertClose(advanceRes.remainingBalanceDue, 152955 - 50000, 0.01, "Remaining Balance after ₹50k advance is ₹1,02,955");

console.log("=================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

