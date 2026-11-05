import {
  calculateOfferCompensation,
  compareJobOffers,
  calculateCultureScore,
  type JobOfferInput,
} from "../src/utils/jobOfferCalculatorUtils";
import { formatINR } from "../src/utils/salaryCalculatorUtils";

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

console.log("=================================================");
console.log("CALCZEN JOB OFFER COMPARISON CALCULATOR TEST SUITE");
console.log("=================================================");

// --- Test 1: Same CTC, Different Fixed vs Variable ---
console.log("\n--- Scenario 1: Same ₹20L CTC, Different Fixed vs Variable ---");
const offerA: JobOfferInput = {
  id: "offer-a",
  label: "Offer A",
  companyName: "Acme Tech (Startup)",
  designation: "Senior SDE",
  location: "Bengaluru, Karnataka",
  state: "Karnataka",
  employmentType: "full-time",
  workMode: "hybrid",
  annualCTC: 2000000,
  basicPercentage: 50,
  hraPercentage: 40,
  cityType: "metro",
  taxRegime: "new",
  annualVariablePay: 400000, // 20% variable pay
  expectedBonusPayoutPct: 80, // expected 80% payout = 3.2L
  guaranteedRecurringBonus: 0,
  joiningBonus: 200000, // 2L joining bonus (Year 1 only)
  relocationBonus: 50000,
  joiningBonusClawbackMonths: 12,
  includeEmployerPFInCTC: true,
  pfCappedAtStatutoryCeiling: true,
  includeGratuityInCTC: true,
  employerNPSPercentage: 0,
  otherEmployerRetirals: 0,
  equityTotalGrantValue: 800000, // 8L over 4 yrs = 2L/yr
  equityVestingYears: 4,
  equityRiskDiscountPct: 30, // 30% discount for startup
  healthInsuranceSumInsured: 500000,
  annualHealthInsuranceValue: 15000,
  annualMealCouponsValue: 0,
  annualWellnessLearningValue: 20000,
  annualOtherBenefitsValue: 0,
  officeDaysPerWeek: 3,
  dailyCommuteMinutesRoundTrip: 90,
  monthlyCommuteCost: 4000,
  monthlyAddedAccommodationCost: 0,
  dailyWorkingHours: 9,
  workingDaysPerWeek: 5,
  paidLeavesPerYear: 24,
  cultureRatings: {
    workLifeBalance: 3,
    remoteFlexibility: 3,
    careerGrowth: 4,
    mentorship: 4,
    jobStability: 3,
    workplaceCulture: 4,
  },
};

const offerB: JobOfferInput = {
  id: "offer-b",
  label: "Offer B",
  companyName: "Global Systems (MNC)",
  designation: "Senior SDE",
  location: "Bengaluru, Karnataka",
  state: "Karnataka",
  employmentType: "full-time",
  workMode: "remote",
  annualCTC: 2000000,
  basicPercentage: 50,
  hraPercentage: 40,
  cityType: "metro",
  taxRegime: "new",
  annualVariablePay: 0, // 100% fixed salary
  expectedBonusPayoutPct: 100,
  guaranteedRecurringBonus: 0,
  joiningBonus: 0, // No joining bonus
  relocationBonus: 0,
  joiningBonusClawbackMonths: 0,
  includeEmployerPFInCTC: true,
  pfCappedAtStatutoryCeiling: true,
  includeGratuityInCTC: true,
  employerNPSPercentage: 0,
  otherEmployerRetirals: 0,
  equityTotalGrantValue: 0,
  equityVestingYears: 4,
  equityRiskDiscountPct: 0,
  healthInsuranceSumInsured: 1000000,
  annualHealthInsuranceValue: 25000,
  annualMealCouponsValue: 26400,
  annualWellnessLearningValue: 10000,
  annualOtherBenefitsValue: 12000,
  officeDaysPerWeek: 0, // Remote
  dailyCommuteMinutesRoundTrip: 0,
  monthlyCommuteCost: 0,
  monthlyAddedAccommodationCost: 0,
  dailyWorkingHours: 8,
  workingDaysPerWeek: 5,
  paidLeavesPerYear: 28,
  cultureRatings: {
    workLifeBalance: 5,
    remoteFlexibility: 5,
    careerGrowth: 3,
    mentorship: 3,
    jobStability: 5,
    workplaceCulture: 4,
  },
};

const resA = calculateOfferCompensation(offerA);
const resB = calculateOfferCompensation(offerB);

assert(resB.monthlyInHand > resA.monthlyInHand, `Offer B has higher monthly in-hand (${formatINR(resB.monthlyInHand)} > ${formatINR(resA.monthlyInHand)}) despite identical ₹20L CTC`);
assert(resB.guaranteedAnnualCash > resA.guaranteedAnnualCash, `Offer B has higher guaranteed cash (${formatINR(resB.guaranteedAnnualCash)} > ${formatINR(resA.guaranteedAnnualCash)})`);
assert(resA.firstYearTotalValue > resB.firstYearTotalValue, `Offer A has higher Year 1 value (${formatINR(resA.firstYearTotalValue)} > ${formatINR(resB.firstYearTotalValue)}) due to ₹2.5L joining/relocation bonus`);
assert(resA.annualizedNominalEquity === 200000, `Offer A nominal annualized equity is ₹2,00,000`);
assert(resA.annualizedRiskAdjustedEquity === 140000, `Offer A 30% risk-adjusted equity is ₹1,40,000`);
assert(resB.annualCommuteHours === 0, `Offer B remote commute hours is 0`);
assert(resA.annualCommuteHours > 0, `Offer A hybrid commute hours is ${resA.annualCommuteHours} hrs/yr`);

// --- Test 2: Comparison Analysis & Verdict ---
console.log("\n--- Scenario 2: Head-to-Head Pairwise Comparison ---");
const comparison = compareJobOffers([offerA, offerB]);

assert(comparison.verdict.highestMonthlyInHand.id === "offer-b", "Verdict: Offer B wins on Monthly In-Hand");
assert(comparison.verdict.highestGuaranteedCash.id === "offer-b", "Verdict: Offer B wins on Guaranteed Cash");
assert(comparison.verdict.highestFirstYearValue.id === "offer-a", "Verdict: Offer A wins on First-Year Value");
assert(comparison.pairwiseComparison !== undefined, "Pairwise comparison object is computed for 2 offers");
assert(comparison.insights.length >= 3, `Generated ${comparison.insights.length} personalized insights`);

// Verify that the CTC vs In-Hand insight is produced
const paradoxInsight = comparison.insights.find((i) => i.type === "take-home");
assert(paradoxInsight !== undefined, "Take-home paradox insight is generated");

// --- Test 3: Culture Scoring ---
console.log("\n--- Scenario 3: Culture Score Calculation ---");
const scoreA = calculateCultureScore(offerA.cultureRatings);
const scoreB = calculateCultureScore(offerB.cultureRatings);
assert(scoreA >= 0 && scoreA <= 100, `Score A is bounded (0-100): ${scoreA}`);
assert(scoreB > scoreA, `Offer B remote/WLB score is higher than Offer A (${scoreB} > ${scoreA})`);

// --- Test 4: Three-Offer Comparison ---
console.log("\n--- Scenario 4: Three-Offer Comparison (Offer A, B, C) ---");
const offerC: JobOfferInput = {
  ...offerB,
  id: "offer-c",
  label: "Offer C",
  companyName: "HyperGrowth Fintech",
  annualCTC: 2800000,
  annualVariablePay: 500000,
  expectedBonusPayoutPct: 100,
  joiningBonus: 300000,
  equityTotalGrantValue: 1200000,
  equityVestingYears: 4,
};

const comparison3 = compareJobOffers([offerA, offerB, offerC]);
assert(comparison3.offers.length === 3, "3 offers evaluated simultaneously");
assert(comparison3.verdict.highestFirstYearValue.id === "offer-c", "Offer C wins on First-Year Value with ₹28L CTC + ₹3L bonus");
assert(comparison3.verdict.highestMonthlyInHand.id === "offer-c", "Offer C wins on Monthly In-Hand");

// --- Test 5: Edge Cases ---
console.log("\n--- Scenario 5: Edge Cases ---");
const zeroBonusOffer: JobOfferInput = {
  ...offerB,
  id: "offer-zero",
  annualCTC: 1200000,
  annualVariablePay: 0,
  joiningBonus: 0,
  equityTotalGrantValue: 0,
  monthlyCommuteCost: 0,
  dailyCommuteMinutesRoundTrip: 0,
};

const zeroRes = calculateOfferCompensation(zeroBonusOffer);
assert(zeroRes.expectedVariablePay === 0, "Zero variable pay stays 0");
assert(zeroRes.joiningBonus === 0, "Zero joining bonus stays 0");
assert(zeroRes.annualCommuteCost === 0, "Zero commute cost stays 0");
assert(zeroRes.effectiveHourlyRateInHand > 0, `Effective hourly rate is positive (${formatINR(zeroRes.effectiveHourlyRateInHand)}/hr)`);

console.log("\n=================================================");
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
}

