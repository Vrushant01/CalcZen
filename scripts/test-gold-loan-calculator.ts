/**
 * CalcZen: Gold Loan Against Jewellery Calculator Independent Test Suite
 * Validating RBI (Lending Against Gold and Silver Collateral) Directions 2025
 */

import {
  calculateGoldLoan,
  calculateRbiLtvBands,
  calculateMonthlyEmi,
  calculateBulletRepayment,
  validateGoldLoanInputs,
  type GoldLoanInputs,
} from "../src/utils/goldLoanCalculatorUtils";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function approxEqual(a: number, b: number, epsilon = 0.05): boolean {
  return Math.abs(a - b) <= epsilon;
}

console.log("=================================================");
console.log("CALCZEN: GOLD LOAN AGAINST JEWELLERY TESTS");
console.log("=================================================\n");

// TEST 1 — Basic 22K Gold Valuation
console.log("Test 1: Basic 22K Gold Valuation (20g @ ₹10,000/g, consumption)");
const t1Inputs: GoldLoanInputs = {
  grossWeight: 20,
  nonGoldWeight: 0,
  purity: "22k-916",
  rateBasis: "selected_purity",
  goldRate: 10000,
  loanMode: "estimate_max",
  requestedLoanAmount: 0,
  loanPurpose: "consumption",
  customLtv: 0,
  otherDeductions: 0,
  repaymentMethod: "none",
  annualInterestRate: 10,
  tenureMonths: 12,
  overdraftUtilisationPct: 100,
  processingFeeType: "none",
  processingFeeValue: 0,
  valuationFee: 0,
  documentationFee: 0,
};
const t1Res = calculateGoldLoan(t1Inputs);
assert(t1Res.netGoldWeight === 20, `Net weight: ${t1Res.netGoldWeight} matches expected 20`);
assert(t1Res.eligibleGoldValue === 200000, `Gold value: ${t1Res.eligibleGoldValue} matches expected 200000`);
assert(t1Res.effectiveLtvPercentage === 85, `LTV: ${t1Res.effectiveLtvPercentage}% matches expected 85%`);
assert(t1Res.maxEligibleLoanAmount === 170000, `Max loan: ${t1Res.maxEligibleLoanAmount} matches expected 170000`);

// TEST 2 — Stone Weight Exclusion
console.log("\nTest 2: Stone Weight Exclusion (25g gross - 5g stones = 20g net @ ₹10k/g)");
const t2Inputs: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 25,
  nonGoldWeight: 5,
};
const t2Res = calculateGoldLoan(t2Inputs);
assert(t2Res.netGoldWeight === 20, `Net gold weight (25 - 5 = 20g): ${t2Res.netGoldWeight} matches expected 20`);
assert(t2Res.eligibleGoldValue === 200000, `Gold value: ${t2Res.eligibleGoldValue} matches expected 200000`);
assert(t2Res.maxEligibleLoanAmount === 170000, `Max loan: ${t2Res.maxEligibleLoanAmount} matches expected 170000`);

// TEST 3 — 24K Rate Conversion
console.log("\nTest 3: 24K Rate Conversion (10g 22K 916 @ ₹10,000/g 24K rate)");
const t3Inputs: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 10,
  nonGoldWeight: 0,
  purity: "22k-916",
  rateBasis: "24k_rate",
  goldRate: 10000,
};
const t3Res = calculateGoldLoan(t3Inputs);
assert(approxEqual(t3Res.effectiveRatePerGram, 9160), `Equivalent 22K rate: ${t3Res.effectiveRatePerGram} matches expected 9160`);
assert(approxEqual(t3Res.eligibleGoldValue, 91600), `Gold value: ${t3Res.eligibleGoldValue} matches expected 91600`);
assert(approxEqual(t3Res.maxEligibleLoanAmount, 77860), `85% LTV loan candidate: ${t3Res.maxEligibleLoanAmount} matches expected 77860`);

// TEST 4 — LTV Band Boundary (Gold Value: ₹3,00,000)
console.log("\nTest 4: LTV Band Boundary (Gold Value ₹3,00,000)");
const t4Bands = calculateRbiLtvBands(300000);
// Band 1: min(85% × 3,00,000, 2,50,000) = 2,50,000
// Band 2: 80% × 3,00,000 = 2,40,000 (not > 2,50,000, invalid)
// Band 3: not applicable
assert(t4Bands.candidates[0].candidateAmount === 250000, `Band 1 candidate: ${t4Bands.candidates[0].candidateAmount} matches expected 250000`);
assert(t4Bands.candidates[1].isValid === false, `Band 2 is invalid (not > 2.5L): isValid is false`);
assert(t4Bands.maxEligibleLoan === 250000, `Max eligible loan: ${t4Bands.maxEligibleLoan} matches expected 250000`);

// TEST 5 — Above ₹2.5 Lakh Band (Gold Value: ₹4,00,000)
console.log("\nTest 5: Above ₹2.5 Lakh Band (Gold Value ₹4,00,000)");
const t5Bands = calculateRbiLtvBands(400000);
// Band 1: 2,50,000
// Band 2: 80% × 4,00,000 = 3,20,000
// Band 3: not applicable
assert(t5Bands.candidates[0].candidateAmount === 250000, `Band 1 candidate: 250000`);
assert(t5Bands.candidates[1].isValid === true, `Band 2 is valid: isValid is true`);
assert(t5Bands.candidates[1].candidateAmount === 320000, `Band 2 candidate: ${t5Bands.candidates[1].candidateAmount} matches expected 320000`);
assert(t5Bands.maxEligibleLoan === 320000, `Max eligible loan: ${t5Bands.maxEligibleLoan} matches expected 320000`);

// TEST 6 — ₹5 Lakh Boundary (Gold Value: ₹6,25,000)
console.log("\nTest 6: ₹5 Lakh Boundary (Gold Value ₹6,25,000)");
const t6Bands = calculateRbiLtvBands(625000);
// Band 1: 2,50,000
// Band 2: min(80% × 6,25,000, 5,00,000) = 5,00,000
// Band 3: 75% × 6,25,000 = 4,68,750 (not > 5,00,000, invalid)
assert(t6Bands.candidates[1].candidateAmount === 500000, `Band 2 candidate: ${t6Bands.candidates[1].candidateAmount} matches expected 500000`);
assert(t6Bands.candidates[2].isValid === false, `Band 3 is invalid (not > 5L): isValid is false`);
assert(t6Bands.maxEligibleLoan === 500000, `Max eligible loan: ${t6Bands.maxEligibleLoan} matches expected 500000`);

// TEST 7 — Above ₹5 Lakh Band (Gold Value: ₹8,00,000)
console.log("\nTest 7: Above ₹5 Lakh Band (Gold Value ₹8,00,000)");
const t7Bands = calculateRbiLtvBands(800000);
// Band 1: 2,50,000
// Band 2: 5,00,000
// Band 3: 75% × 8,00,000 = 6,00,000
assert(t7Bands.candidates[2].isValid === true, `Band 3 is valid: isValid is true`);
assert(t7Bands.candidates[2].candidateAmount === 600000, `Band 3 candidate: ${t7Bands.candidates[2].candidateAmount} matches expected 600000`);
assert(t7Bands.maxEligibleLoan === 600000, `Max eligible loan: ${t7Bands.maxEligibleLoan} matches expected 600000`);

// TEST 8 — Requested Loan Amount
console.log("\nTest 8: Requested Loan Amount (Gold: ₹2L, Requested: ₹1.5L)");
const t8Inputs: GoldLoanInputs = {
  ...t1Inputs,
  loanMode: "requested_amount",
  requestedLoanAmount: 150000,
};
const t8Res = calculateGoldLoan(t8Inputs);
assert(t8Res.requestedLtvPercentage === 75, `Required LTV (1.5L / 2L): ${t8Res.requestedLtvPercentage}% matches expected 75%`);
assert(t8Res.isRequestedLoanApproved === true, `Requested loan is approved within 85% limit`);

// TEST 9 — EMI Calculation (Principal: ₹1,00,000, 12% p.a., 12 months)
console.log("\nTest 9: Reducing Balance EMI Calculation (₹1,00,000 @ 12% for 12 mos)");
const t9Emi = calculateMonthlyEmi(100000, 12, 12);
assert(approxEqual(t9Emi.emi, 8884.88, 0.1), `Monthly EMI: ${t9Emi.emi.toFixed(2)} matches ~8884.88`);
assert(approxEqual(t9Emi.totalPayment, 106618.56, 1.0), `Total payment: ${t9Emi.totalPayment.toFixed(2)} matches ~106618.56`);
assert(approxEqual(t9Emi.totalInterest, 6618.56, 1.0), `Total interest: ${t9Emi.totalInterest.toFixed(2)} matches ~6618.56`);

// TEST 10 — Bullet Repayment Illustration (Principal: ₹1,00,000, 12% p.a., 12 months)
console.log("\nTest 10: Bullet Repayment Illustration (₹1,00,000 @ 12% for 12 mos simple interest)");
const t10Bullet = calculateBulletRepayment(100000, 12, 12);
assert(t10Bullet.totalInterest === 12000, `Bullet interest: ${t10Bullet.totalInterest} matches expected 12000`);
assert(t10Bullet.maturityAmount === 112000, `Bullet maturity amount: ${t10Bullet.maturityAmount} matches expected 112000`);

// TEST 11 — Processing Fee & Disbursal (Loan: ₹1,00,000, 1% fee)
console.log("\nTest 11: Processing Fee & Net Disbursal (₹1,00,000 loan with 1% fee)");
const t11Inputs: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 20,
  goldRate: 10000,
  loanMode: "requested_amount",
  requestedLoanAmount: 100000,
  processingFeeType: "percentage",
  processingFeeValue: 1,
};
const t11Res = calculateGoldLoan(t11Inputs);
assert(t11Res.processingFee === 1000, `Processing fee (1% of 1L): ${t11Res.processingFee} matches expected 1000`);
assert(t11Res.netDisbursalAmount === 99000, `Net disbursal (1L - 1k): ${t11Res.netDisbursalAmount} matches expected 99000`);

// TEST 12 — Validation & Edge Cases
console.log("\nTest 12: Validation & Edge Cases");
const invalidInputs1: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 0,
};
const val1 = validateGoldLoanInputs(invalidInputs1);
assert(!val1.isValid && !!val1.errors.grossWeight, `Zero weight correctly rejected`);

const invalidInputs2: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 20,
  nonGoldWeight: 25,
};
const val2 = validateGoldLoanInputs(invalidInputs2);
assert(!val2.isValid && !!val2.errors.nonGoldWeight, `Stones > gross weight correctly rejected`);

const invalidInputs3: GoldLoanInputs = {
  ...t1Inputs,
  customLtv: 105,
};
const val3 = validateGoldLoanInputs(invalidInputs3);
assert(!val3.isValid && !!val3.errors.customLtv, `Custom LTV > 100% correctly rejected`);

// TEST 13 — Valuation Transparency
console.log("\nTest 13: Valuation Transparency");
const t13Inputs: GoldLoanInputs = {
  ...t1Inputs,
  grossWeight: 50,
  nonGoldWeight: 10, // 40g net
  rateBasis: "selected_purity",
  goldRate: 10000,
  loanPurpose: "consumption",
};
const t13Res = calculateGoldLoan(t13Inputs);
assert(t13Res.netGoldWeight === 40, `Non-gold weight excluded: 40g net`);
assert(t13Res.eligibleGoldValue === 400000, `Only intrinsic gold value used (₹4,00,000), no making charges/GST added`);
assert(
  !isNaN(t13Res.maxEligibleLoanAmount) && isFinite(t13Res.maxEligibleLoanAmount),
  `No NaN or Infinity produced: ₹${t13Res.maxEligibleLoanAmount}`
);

console.log("\n=================================================");
console.log("ALL 13 TEST CASES PASSED WITH 100% ACCURACY!");
console.log("=================================================");

