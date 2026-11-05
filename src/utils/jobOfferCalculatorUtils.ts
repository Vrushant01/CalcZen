import {
  calculateSalaryBreakdown,
  formatINR,
  INDIAN_STATES,
  type TaxRegime,
  type CityType,
} from "./salaryCalculatorUtils";

export interface CultureRatings {
  workLifeBalance: number; // 1 to 5
  remoteFlexibility: number; // 1 to 5
  careerGrowth: number; // 1 to 5
  mentorship: number; // 1 to 5
  jobStability: number; // 1 to 5
  workplaceCulture: number; // 1 to 5
}

export interface JobOfferInput {
  id: string; // e.g. "offer-1", "offer-2"
  label: string; // e.g. "Offer A", "Offer B"
  companyName: string; // e.g. "Current Company", "Startup X"
  designation: string; // e.g. "Senior Software Engineer"
  location: string; // e.g. "Bengaluru, Karnataka"
  state: string; // State for professional tax e.g. "Karnataka", "Maharashtra", "Gujarat"
  employmentType: "full-time" | "contract" | "internship";
  workMode: "remote" | "hybrid" | "on-site";

  // Section A & B: Core Compensation & Fixed Structure
  annualCTC: number;
  fixedAnnualGross?: number; // If entered directly
  basicPercentage: number; // Default 50%
  hraPercentage: number; // Default 40%
  cityType: CityType;
  taxRegime: TaxRegime;

  // Section C: Variable Pay
  annualVariablePay: number; // Target annual bonus in INR
  expectedBonusPayoutPct: number; // 0 to 100%, default 100%
  guaranteedRecurringBonus: number; // Fixed recurring allowance / retention

  // Section D: One-Time Payments (First-Year Only)
  joiningBonus: number; // Cash sign-on bonus
  relocationBonus: number; // Cash relocation assistance
  joiningBonusClawbackMonths: number; // e.g. 12 months

  // Section E: Employer Retirals & Benefits included in CTC
  includeEmployerPFInCTC: boolean; // default true
  pfCappedAtStatutoryCeiling: boolean; // default true (₹1,800/mo)
  includeGratuityInCTC: boolean; // default true (~4.81% of basic)
  employerNPSPercentage: number; // e.g. 0 to 10%
  otherEmployerRetirals: number;

  // Section F: Equity / ESOPs / RSUs
  equityTotalGrantValue: number; // Total grant value in INR
  equityVestingYears: number; // Default 4 years
  equityRiskDiscountPct: number; // 0% (Listed MNC), 30% or 50% (Unlisted Startup)

  // Section G: Employer Benefits (Monetary Value)
  healthInsuranceSumInsured: number; // e.g. ₹5,00,000 coverage
  annualHealthInsuranceValue: number; // Estimated employer premium e.g. ₹15,000
  annualMealCouponsValue: number; // e.g. ₹26,400 (Sodexo)
  annualWellnessLearningValue: number; // e.g. ₹20,000
  annualOtherBenefitsValue: number; // e.g. phone/internet/cab

  // Section H: Commute, Work Hours & Lifestyle Costs
  officeDaysPerWeek: number; // 0 for remote, 2-3 for hybrid, 5 for on-site
  dailyCommuteMinutesRoundTrip: number; // e.g. 60 or 90 minutes
  monthlyCommuteCost: number; // Fuel / cab / metro cost in INR
  monthlyAddedAccommodationCost: number; // If relocating to costlier city
  dailyWorkingHours: number; // Default 8 or 9
  workingDaysPerWeek: number; // Default 5
  paidLeavesPerYear: number; // Default 24

  // Section I: Workplace Culture Ratings (Optional 1 to 5)
  cultureRatings?: CultureRatings;
}

export interface CalculatedOfferMetrics {
  id: string;
  label: string;
  companyName: string;
  designation: string;
  location: string;
  state: string;
  employmentType: "full-time" | "contract" | "internship";
  workMode: "remote" | "hybrid" | "on-site";

  // 1. Guaranteed Annual Cash
  guaranteedAnnualCash: number;
  monthlyGuaranteedCash: number;

  // 2. Expected Annual Cash
  expectedVariablePay: number;
  expectedAnnualCash: number;

  // 3. Take-Home In-Hand Salary (FY 2026-27 Tax Rules)
  monthlyFixedGross: number;
  annualFixedGross: number;
  monthlyBasic: number;
  annualBasic: number;
  monthlyHRA: number;
  annualHRA: number;
  monthlySpecialAllowance: number;
  annualSpecialAllowance: number;
  monthlyEmployeePF: number;
  annualEmployeePF: number;
  monthlyProfessionalTax: number;
  annualProfessionalTax: number;
  monthlyEmployeeESI: number;
  annualEmployeeESI: number;
  monthlyTDS: number;
  annualTDS: number;
  monthlyInHand: number;
  annualInHand: number;
  effectiveTaxRate: number;

  // 4. Retirals & Employer Contributions
  monthlyEmployerPF: number;
  annualEmployerPF: number;
  monthlyGratuityProvision: number;
  annualGratuityProvision: number;
  annualEmployerNPS: number;
  totalAnnualEmployerRetirals: number;

  // 5. One-Time Payments
  joiningBonus: number;
  relocationBonus: number;
  totalOneTimePayments: number;
  joiningBonusClawbackMonths: number;

  // 6. Equity / ESOPs
  annualizedNominalEquity: number;
  annualizedRiskAdjustedEquity: number;
  firstYearVestedEquity: number;
  totalGrantValue: number;
  vestingYears: number;
  riskDiscountPct: number;

  // 7. Non-Cash Valued Benefits
  annualHealthInsuranceValue: number;
  annualMealCouponsValue: number;
  annualWellnessLearningValue: number;
  annualOtherBenefitsValue: number;
  totalAnnualValuedBenefits: number;

  // 8. Commute, Time & Work Expenses
  annualCommuteCost: number;
  annualAddedAccommodationCost: number;
  totalAnnualWorkCosts: number;
  annualCommuteHours: number;
  annualContractualWorkHours: number;
  totalAnnualCommittedHours: number;
  effectiveHourlyRateGuaranteed: number;
  effectiveHourlyRateExpected: number;
  effectiveHourlyRateInHand: number;

  // 9. First-Year vs Recurring Total Compensation
  firstYearTotalCash: number; // Expected Annual Cash + One-time Joining & Relocation Bonus
  firstYearTotalValue: number; // First-year Total Cash + Vested Equity + Valued Benefits + Retirals
  recurringAnnualTotalCash: number; // Expected Annual Cash (No joining bonus)
  recurringAnnualTotalValue: number; // Recurring Cash + Annualized Equity + Valued Benefits + Retirals

  // 10. Annual Net Financial Value
  annualNetFinancialValue: number; // (Post-tax Cash + Risk-adjusted Equity + Valued Benefits) - Work Costs

  // 11. Culture & Subjective Rating
  cultureScore: number; // 0 to 100
  cultureRatings?: CultureRatings;
}

export interface PairwiseComparison {
  diffCTC: number;
  diffPctCTC: number;
  diffInHandMonthly: number;
  diffPctInHandMonthly: number;
  diffInHandAnnual: number;
  diffPctInHandAnnual: number;
  diffGuaranteedAnnual: number;
  diffPctGuaranteedAnnual: number;
  diffExpectedAnnualCash: number;
  diffPctExpectedAnnualCash: number;
  diffFirstYearTotal: number;
  diffPctFirstYearTotal: number;
  diffRecurringTotal: number;
  diffPctRecurringTotal: number;
  diffNetFinancialValue: number;
  diffPctNetFinancialValue: number;
  diffEffectiveHourly: number;
  diffPctEffectiveHourly: number;
  diffCommuteHoursAnnual: number;
  diffWorkCostsAnnual: number;
}

export interface ComparisonVerdict {
  highestMonthlyInHand: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestGuaranteedCash: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestFirstYearValue: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestRecurringValue: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestNetFinancialValue: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestEffectiveHourlyRate: { id: string; label: string; company: string; value: number; diffVsSecond?: number };
  highestCultureScore?: { id: string; label: string; company: string; score: number };
}

export interface ComparisonInsight {
  type: "verdict" | "take-home" | "first-year" | "lifestyle" | "equity" | "culture";
  tone: "info" | "success" | "warning" | "tip";
  text: string;
}

export interface OfferComparisonResult {
  offers: CalculatedOfferMetrics[];
  verdict: ComparisonVerdict;
  pairwiseComparison?: PairwiseComparison;
  insights: ComparisonInsight[];
}

/**
 * Calculates a 0-100 culture & workplace preference score from 1-5 ratings
 */
export function calculateCultureScore(ratings?: CultureRatings): number {
  if (!ratings) return 50; // Neutral default
  const {
    workLifeBalance = 3,
    remoteFlexibility = 3,
    careerGrowth = 3,
    mentorship = 3,
    jobStability = 3,
    workplaceCulture = 3,
  } = ratings;

  // Weighted score (sum of weights = 1.0)
  const weighted =
    workLifeBalance * 0.25 +
    remoteFlexibility * 0.15 +
    careerGrowth * 0.25 +
    mentorship * 0.10 +
    jobStability * 0.15 +
    workplaceCulture * 0.10;

  // Map 1-5 to 0-100%
  const score = Math.round(((weighted - 1) / 4) * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates comprehensive compensation metrics for a single job offer
 */
export function calculateOfferCompensation(input: JobOfferInput): CalculatedOfferMetrics {
  const annualCTC = Math.max(0, Number(input.annualCTC) || 0);
  const targetVariablePay = Math.max(0, Number(input.annualVariablePay) || 0);
  const expectedBonusPayoutPct = Math.max(0, Math.min(200, Number(input.expectedBonusPayoutPct) ?? 100));
  const expectedVariablePay = Math.round(targetVariablePay * (expectedBonusPayoutPct / 100));
  const guaranteedRecurringBonus = Math.max(0, Number(input.guaranteedRecurringBonus) || 0);

  // One-time joining bonuses
  const joiningBonus = Math.max(0, Number(input.joiningBonus) || 0);
  const relocationBonus = Math.max(0, Number(input.relocationBonus) || 0);
  const totalOneTimePayments = joiningBonus + relocationBonus;
  const joiningBonusClawbackMonths = Math.max(0, Number(input.joiningBonusClawbackMonths) || 12);

  // Statutory retiral calculations using the standard CTC reconciliation engine
  const breakdown = calculateSalaryBreakdown({
    annualCTC,
    financialYear: "FY 2026-27",
    state: input.state || "Karnataka",
    regime: input.taxRegime || "new",
    structureType: input.fixedAnnualGross ? "custom" : "standard",
    basicPercentage: input.basicPercentage || 50,
    hraPercentage: input.hraPercentage || 40,
    cityType: input.cityType || "non-metro",
    monthlyRentPaid: 0,
    annualVariablePay: targetVariablePay, // target variable inside CTC
    includeEmployeePF: true,
    includeEmployerPFInCTC: input.includeEmployerPFInCTC ?? true,
    pfCappedAtStatutoryCeiling: input.pfCappedAtStatutoryCeiling ?? true,
    vpfPercentage: 0,
    includeGratuityInCTC: input.includeGratuityInCTC ?? true,
    gratuityOverride: 0,
    employerNPSPercentage: input.employerNPSPercentage || 0,
    otherEmployerBenefits: input.otherEmployerRetirals || 0,
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    homeLoanInterest80EEA: 0,
    otherTaxDeductions: 0,
    monthlyEmployeeInsurance: 0,
    otherMonthlyDeductions: 0,
  });

  const annualFixedGross = breakdown.annualFixedGross;
  const monthlyFixedGross = breakdown.monthlyFixedGross;
  const monthlyBasic = breakdown.monthlyBasic;
  const annualBasic = breakdown.annualBasic;
  const monthlyHRA = breakdown.monthlyHRA;
  const annualHRA = breakdown.annualHRA;
  const monthlySpecialAllowance = breakdown.monthlySpecialAllowance;
  const annualSpecialAllowance = breakdown.annualSpecialAllowance;

  // Monthly in-hand take-home components
  const monthlyEmployeePF = breakdown.monthlyEmployeePF;
  const annualEmployeePF = breakdown.annualEmployeePF;
  const monthlyProfessionalTax = breakdown.monthlyProfessionalTax;
  const annualProfessionalTax = breakdown.annualProfessionalTax;
  const monthlyEmployeeESI = breakdown.monthlyEmployeeESI;
  const annualEmployeeESI = breakdown.annualEmployeeESI;
  const monthlyTDS = breakdown.taxBreakdown.monthlyTDS;
  const annualTDS = breakdown.taxBreakdown.totalAnnualTax;
  const monthlyInHand = breakdown.monthlyInHand;
  const annualInHand = breakdown.annualInHand;
  const effectiveTaxRate = breakdown.taxBreakdown.effectiveTaxRate;

  // Employer Retirals
  const monthlyEmployerPF = breakdown.monthlyEmployerPF;
  const annualEmployerPF = breakdown.annualEmployerPF;
  const monthlyGratuityProvision = breakdown.monthlyGratuityProvision;
  const annualGratuityProvision = breakdown.annualGratuityProvision;
  const annualEmployerNPS = breakdown.annualEmployerNPS;
  const totalAnnualEmployerRetirals = breakdown.totalAnnualEmployerContributions;

  // 1. Guaranteed Annual Cash
  const guaranteedAnnualCash = annualFixedGross + guaranteedRecurringBonus;
  const monthlyGuaranteedCash = Math.round(guaranteedAnnualCash / 12);

  // 2. Expected Annual Cash
  const expectedAnnualCash = guaranteedAnnualCash + expectedVariablePay;

  // 5. Equity / ESOPs
  const totalGrantValue = Math.max(0, Number(input.equityTotalGrantValue) || 0);
  const vestingYears = Math.max(1, Number(input.equityVestingYears) || 4);
  const riskDiscountPct = Math.max(0, Math.min(100, Number(input.equityRiskDiscountPct) || 0));

  const annualizedNominalEquity = Math.round(totalGrantValue / vestingYears);
  const annualizedRiskAdjustedEquity = Math.round(annualizedNominalEquity * (1 - riskDiscountPct / 100));
  const firstYearVestedEquity = annualizedNominalEquity; // Standard 25% 1-year cliff / equal vesting

  // 6. Non-Cash Valued Benefits
  const annualHealthInsuranceValue = Math.max(0, Number(input.annualHealthInsuranceValue) || 0);
  const annualMealCouponsValue = Math.max(0, Number(input.annualMealCouponsValue) || 0);
  const annualWellnessLearningValue = Math.max(0, Number(input.annualWellnessLearningValue) || 0);
  const annualOtherBenefitsValue = Math.max(0, Number(input.annualOtherBenefitsValue) || 0);
  const totalAnnualValuedBenefits =
    annualHealthInsuranceValue +
    annualMealCouponsValue +
    annualWellnessLearningValue +
    annualOtherBenefitsValue;

  // 7. Commute, Time & Work Expenses
  const officeDaysPerWeek = Math.max(0, Math.min(7, Number(input.officeDaysPerWeek) ?? (input.workMode === "remote" ? 0 : input.workMode === "hybrid" ? 3 : 5)));
  const dailyCommuteMinutes = Math.max(0, Number(input.dailyCommuteMinutesRoundTrip) || 0);
  const monthlyCommuteCost = Math.max(0, Number(input.monthlyCommuteCost) || 0);
  const monthlyAddedAccommodationCost = Math.max(0, Number(input.monthlyAddedAccommodationCost) || 0);

  const annualCommuteCost = monthlyCommuteCost * 12;
  const annualAddedAccommodationCost = monthlyAddedAccommodationCost * 12;
  const totalAnnualWorkCosts = annualCommuteCost + annualAddedAccommodationCost;

  // Annual working days = (52 weeks * workingDaysPerWeek) - paidLeavesPerYear
  const workingDaysPerWeek = Math.max(1, Math.min(7, Number(input.workingDaysPerWeek) || 5));
  const paidLeavesPerYear = Math.max(0, Number(input.paidLeavesPerYear) || 24);
  const netAnnualWorkingDays = Math.max(0, 52 * workingDaysPerWeek - paidLeavesPerYear);

  const dailyWorkingHours = Math.max(1, Math.min(24, Number(input.dailyWorkingHours) || 8.5));
  const annualContractualWorkHours = Math.round(netAnnualWorkingDays * dailyWorkingHours);

  // Office days per year = (netAnnualWorkingDays / workingDaysPerWeek) * officeDaysPerWeek
  const annualOfficeDays = Math.round((netAnnualWorkingDays / workingDaysPerWeek) * officeDaysPerWeek);
  const annualCommuteHours = Math.round((annualOfficeDays * dailyCommuteMinutes) / 60);
  const totalAnnualCommittedHours = annualContractualWorkHours + annualCommuteHours;

  const effectiveHourlyRateGuaranteed =
    totalAnnualCommittedHours > 0 ? Math.round(guaranteedAnnualCash / totalAnnualCommittedHours) : 0;
  const effectiveHourlyRateExpected =
    totalAnnualCommittedHours > 0 ? Math.round(expectedAnnualCash / totalAnnualCommittedHours) : 0;
  const effectiveHourlyRateInHand =
    totalAnnualCommittedHours > 0 ? Math.round(annualInHand / totalAnnualCommittedHours) : 0;

  // 8. First-Year vs Recurring Total Compensation
  const firstYearTotalCash = expectedAnnualCash + totalOneTimePayments;
  const firstYearTotalValue =
    firstYearTotalCash + firstYearVestedEquity + totalAnnualValuedBenefits + totalAnnualEmployerRetirals;

  const recurringAnnualTotalCash = expectedAnnualCash; // Excludes one-time joining/relocation bonus
  const recurringAnnualTotalValue =
    recurringAnnualTotalCash + annualizedNominalEquity + totalAnnualValuedBenefits + totalAnnualEmployerRetirals;

  // 9. Annual Net Financial Value
  // Post-tax cash + Risk-adjusted equity + Valued Benefits - Work costs
  const annualNetFinancialValue =
    annualInHand + expectedVariablePay * (1 - effectiveTaxRate / 100) + annualizedRiskAdjustedEquity + totalAnnualValuedBenefits - totalAnnualWorkCosts;

  // 10. Culture Score
  const cultureScore = calculateCultureScore(input.cultureRatings);

  return {
    id: input.id,
    label: input.label || "Offer",
    companyName: input.companyName || "Company",
    designation: input.designation || "Role",
    location: input.location || "Location",
    state: input.state || "Karnataka",
    employmentType: input.employmentType || "full-time",
    workMode: input.workMode || "hybrid",

    guaranteedAnnualCash,
    monthlyGuaranteedCash,
    expectedVariablePay,
    expectedAnnualCash,

    monthlyFixedGross,
    annualFixedGross,
    monthlyBasic,
    annualBasic,
    monthlyHRA,
    annualHRA,
    monthlySpecialAllowance,
    annualSpecialAllowance,
    monthlyEmployeePF,
    annualEmployeePF,
    monthlyProfessionalTax,
    annualProfessionalTax,
    monthlyEmployeeESI,
    annualEmployeeESI,
    monthlyTDS,
    annualTDS,
    monthlyInHand,
    annualInHand,
    effectiveTaxRate,

    monthlyEmployerPF,
    annualEmployerPF,
    monthlyGratuityProvision,
    annualGratuityProvision,
    annualEmployerNPS,
    totalAnnualEmployerRetirals,

    joiningBonus,
    relocationBonus,
    totalOneTimePayments,
    joiningBonusClawbackMonths,

    annualizedNominalEquity,
    annualizedRiskAdjustedEquity,
    firstYearVestedEquity,
    totalGrantValue,
    vestingYears,
    riskDiscountPct,

    annualHealthInsuranceValue,
    annualMealCouponsValue,
    annualWellnessLearningValue,
    annualOtherBenefitsValue,
    totalAnnualValuedBenefits,

    annualCommuteCost,
    annualAddedAccommodationCost,
    totalAnnualWorkCosts,
    annualCommuteHours,
    annualContractualWorkHours,
    totalAnnualCommittedHours,
    effectiveHourlyRateGuaranteed,
    effectiveHourlyRateExpected,
    effectiveHourlyRateInHand,

    firstYearTotalCash,
    firstYearTotalValue,
    recurringAnnualTotalCash,
    recurringAnnualTotalValue,
    annualNetFinancialValue: Math.round(annualNetFinancialValue),

    cultureScore,
    cultureRatings: input.cultureRatings,
  };
}

/**
 * Compares two or more job offers and identifies metric winners, diffs, and insights
 */
export function compareJobOffers(offerInputs: JobOfferInput[]): OfferComparisonResult {
  if (!offerInputs || offerInputs.length === 0) {
    throw new Error("At least one job offer is required for comparison.");
  }

  const calculatedOffers = offerInputs.map((input) => calculateOfferCompensation(input));

  // Determine winners for each core metric
  const findWinner = (getter: (m: CalculatedOfferMetrics) => number) => {
    const sorted = [...calculatedOffers].sort((a, b) => getter(b) - getter(a));
    const winner = sorted[0];
    const second = sorted[1];
    const diffVsSecond = second ? getter(winner) - getter(second) : undefined;
    return {
      id: winner.id,
      label: winner.label,
      company: winner.companyName,
      value: getter(winner),
      diffVsSecond,
    };
  };

  const verdict: ComparisonVerdict = {
    highestMonthlyInHand: findWinner((m) => m.monthlyInHand),
    highestGuaranteedCash: findWinner((m) => m.guaranteedAnnualCash),
    highestFirstYearValue: findWinner((m) => m.firstYearTotalValue),
    highestRecurringValue: findWinner((m) => m.recurringAnnualTotalValue),
    highestNetFinancialValue: findWinner((m) => m.annualNetFinancialValue),
    highestEffectiveHourlyRate: findWinner((m) => m.effectiveHourlyRateInHand),
  };

  // Culture winner
  const cultureSorted = [...calculatedOffers].sort((a, b) => b.cultureScore - a.cultureScore);
  verdict.highestCultureScore = {
    id: cultureSorted[0].id,
    label: cultureSorted[0].label,
    company: cultureSorted[0].companyName,
    score: cultureSorted[0].cultureScore,
  };

  // Pairwise diff calculation if exactly 2 offers
  let pairwiseComparison: PairwiseComparison | undefined = undefined;
  if (calculatedOffers.length >= 2) {
    const a = calculatedOffers[0];
    const b = calculatedOffers[1];

    const safePct = (diff: number, base: number) => (base !== 0 ? Math.round((diff / base) * 1000) / 10 : 0);

    const diffInHandMonthly = a.monthlyInHand - b.monthlyInHand;
    const diffInHandAnnual = a.annualInHand - b.annualInHand;
    const diffGuaranteedAnnual = a.guaranteedAnnualCash - b.guaranteedAnnualCash;
    const diffExpectedAnnualCash = a.expectedAnnualCash - b.expectedAnnualCash;
    const diffFirstYearTotal = a.firstYearTotalValue - b.firstYearTotalValue;
    const diffRecurringTotal = a.recurringAnnualTotalValue - b.recurringAnnualTotalValue;
    const diffNetFinancialValue = a.annualNetFinancialValue - b.annualNetFinancialValue;
    const diffEffectiveHourly = a.effectiveHourlyRateInHand - b.effectiveHourlyRateInHand;
    const diffCTC = (offerInputs[0].annualCTC || 0) - (offerInputs[1].annualCTC || 0);

    pairwiseComparison = {
      diffCTC,
      diffPctCTC: safePct(diffCTC, offerInputs[1].annualCTC || 1),
      diffInHandMonthly,
      diffPctInHandMonthly: safePct(diffInHandMonthly, b.monthlyInHand),
      diffInHandAnnual,
      diffPctInHandAnnual: safePct(diffInHandAnnual, b.annualInHand),
      diffGuaranteedAnnual,
      diffPctGuaranteedAnnual: safePct(diffGuaranteedAnnual, b.guaranteedAnnualCash),
      diffExpectedAnnualCash,
      diffPctExpectedAnnualCash: safePct(diffExpectedAnnualCash, b.expectedAnnualCash),
      diffFirstYearTotal,
      diffPctFirstYearTotal: safePct(diffFirstYearTotal, b.firstYearTotalValue),
      diffRecurringTotal,
      diffPctRecurringTotal: safePct(diffRecurringTotal, b.recurringAnnualTotalValue),
      diffNetFinancialValue,
      diffPctNetFinancialValue: safePct(diffNetFinancialValue, b.annualNetFinancialValue),
      diffEffectiveHourly,
      diffPctEffectiveHourly: safePct(diffEffectiveHourly, b.effectiveHourlyRateInHand),
      diffCommuteHoursAnnual: a.annualCommuteHours - b.annualCommuteHours,
      diffWorkCostsAnnual: a.totalAnnualWorkCosts - b.totalAnnualWorkCosts,
    };
  }

  // Generate personalized, rule-based comparison insights
  const insights: ComparisonInsight[] = [];

  if (calculatedOffers.length >= 2) {
    const a = calculatedOffers[0];
    const b = calculatedOffers[1];

    // Insight 1: CTC vs Take-Home Paradox
    const aCTC = offerInputs[0].annualCTC || 0;
    const bCTC = offerInputs[1].annualCTC || 0;
    if (aCTC > bCTC && a.monthlyInHand < b.monthlyInHand) {
      insights.push({
        type: "take-home",
        tone: "warning",
        text: `${a.companyName} offers ${formatINR(aCTC - bCTC)} higher annual CTC, but ${b.companyName} actually pays ${formatINR(b.monthlyInHand - a.monthlyInHand)}/month MORE in take-home cash because ${a.companyName}'s CTC has higher non-cash retiral provisions or variable bonus.`,
      });
    } else if (bCTC > aCTC && b.monthlyInHand < a.monthlyInHand) {
      insights.push({
        type: "take-home",
        tone: "warning",
        text: `${b.companyName} offers ${formatINR(bCTC - aCTC)} higher annual CTC, but ${a.companyName} pays ${formatINR(a.monthlyInHand - b.monthlyInHand)}/month MORE in take-home cash.`,
      });
    } else {
      const winner = a.monthlyInHand >= b.monthlyInHand ? a : b;
      const loser = a.monthlyInHand >= b.monthlyInHand ? b : a;
      insights.push({
        type: "take-home",
        tone: "success",
        text: `${winner.companyName} leads in monthly in-hand cash by ${formatINR(winner.monthlyInHand - loser.monthlyInHand)}/month (${formatINR((winner.monthlyInHand - loser.monthlyInHand) * 12)} annually).`,
      });
    }

    // Insight 2: First-Year vs Long-Term Recurring
    if (a.firstYearTotalValue > b.firstYearTotalValue && a.recurringAnnualTotalValue < b.recurringAnnualTotalValue) {
      insights.push({
        type: "first-year",
        tone: "info",
        text: `${a.companyName} wins in Year 1 by ${formatINR(a.firstYearTotalValue - b.firstYearTotalValue)} due to joining bonus / relocation packages, but ${b.companyName} becomes more rewarding from Year 2 onwards by ${formatINR(b.recurringAnnualTotalValue - a.recurringAnnualTotalValue)}/year in recurring compensation.`,
      });
    } else if (b.firstYearTotalValue > a.firstYearTotalValue && b.recurringAnnualTotalValue < a.recurringAnnualTotalValue) {
      insights.push({
        type: "first-year",
        tone: "info",
        text: `${b.companyName} wins in Year 1 by ${formatINR(b.firstYearTotalValue - a.firstYearTotalValue)}, but ${a.companyName} is financially superior from Year 2 onwards by ${formatINR(a.recurringAnnualTotalValue - b.recurringAnnualTotalValue)}/year.`,
      });
    }

    // Insight 3: Commute & Effective Hourly Rate
    if (Math.abs(a.annualCommuteHours - b.annualCommuteHours) >= 100) {
      const moreCommute = a.annualCommuteHours > b.annualCommuteHours ? a : b;
      const lessCommute = a.annualCommuteHours > b.annualCommuteHours ? b : a;
      const hoursDiff = Math.abs(a.annualCommuteHours - b.annualCommuteHours);
      const costDiff = Math.abs(a.totalAnnualWorkCosts - b.totalAnnualWorkCosts);

      insights.push({
        type: "lifestyle",
        tone: "tip",
        text: `${lessCommute.companyName} saves you approximately ${hoursDiff} hours of commute travel and ${formatINR(costDiff)} in travel/living costs annually, giving you an effective hourly wage of ${formatINR(lessCommute.effectiveHourlyRateInHand)}/hr vs ${formatINR(moreCommute.effectiveHourlyRateInHand)}/hr.`,
      });
    }

    // Insight 4: Equity / ESOP Risk
    const hasEquity = a.totalGrantValue > 0 || b.totalGrantValue > 0;
    if (hasEquity) {
      const equityLeader = a.totalGrantValue >= b.totalGrantValue ? a : b;
      insights.push({
        type: "equity",
        tone: "info",
        text: `${equityLeader.companyName} includes ${formatINR(equityLeader.totalGrantValue)} in total equity over ${equityLeader.vestingYears} years. Note that unvested startup ESOPs carry liquidity risk; our calculator applies a ${equityLeader.riskDiscountPct}% risk adjustment for realistic valuation.`,
      });
    }

    // Insight 5: Culture & Work-Life Balance
    if (Math.abs(a.cultureScore - b.cultureScore) >= 15) {
      const cultureLeader = a.cultureScore > b.cultureScore ? a : b;
      const other = a.cultureScore > b.cultureScore ? b : a;
      insights.push({
        type: "culture",
        tone: "tip",
        text: `Based on your personal preference ratings, ${cultureLeader.companyName} scored significantly higher (${cultureLeader.cultureScore}/100 vs ${other.cultureScore}/100) in work-life balance, flexibility, and career growth.`,
      });
    }
  }

  return {
    offers: calculatedOffers,
    verdict,
    pairwiseComparison,
    insights,
  };
}

export const DEFAULT_OFFER_A: JobOfferInput = {
  id: "offer-a",
  label: "Offer A",
  companyName: "Acme Tech (Startup)",
  designation: "Senior Software Engineer",
  location: "Bengaluru, Karnataka",
  state: "Karnataka",
  employmentType: "full-time",
  workMode: "hybrid",
  annualCTC: 2000000,
  basicPercentage: 50,
  hraPercentage: 40,
  cityType: "metro",
  taxRegime: "new",
  annualVariablePay: 400000,
  expectedBonusPayoutPct: 80,
  guaranteedRecurringBonus: 0,
  joiningBonus: 200000,
  relocationBonus: 50000,
  joiningBonusClawbackMonths: 12,
  includeEmployerPFInCTC: true,
  pfCappedAtStatutoryCeiling: true,
  includeGratuityInCTC: true,
  employerNPSPercentage: 0,
  otherEmployerRetirals: 0,
  equityTotalGrantValue: 800000,
  equityVestingYears: 4,
  equityRiskDiscountPct: 30,
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

export const DEFAULT_OFFER_B: JobOfferInput = {
  id: "offer-b",
  label: "Offer B",
  companyName: "Global Systems (MNC)",
  designation: "Senior Software Engineer",
  location: "Bengaluru, Karnataka",
  state: "Karnataka",
  employmentType: "full-time",
  workMode: "remote",
  annualCTC: 2000000,
  basicPercentage: 50,
  hraPercentage: 40,
  cityType: "metro",
  taxRegime: "new",
  annualVariablePay: 0,
  expectedBonusPayoutPct: 100,
  guaranteedRecurringBonus: 0,
  joiningBonus: 0,
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
  officeDaysPerWeek: 0,
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

export const DEFAULT_OFFER_C: JobOfferInput = {
  ...DEFAULT_OFFER_B,
  id: "offer-c",
  label: "Offer C",
  companyName: "HyperGrowth Fintech",
  designation: "Tech Lead",
  annualCTC: 2800000,
  annualVariablePay: 500000,
  expectedBonusPayoutPct: 100,
  joiningBonus: 300000,
  relocationBonus: 0,
  equityTotalGrantValue: 1200000,
  equityVestingYears: 4,
  equityRiskDiscountPct: 20,
  workMode: "hybrid",
  officeDaysPerWeek: 2,
  dailyCommuteMinutesRoundTrip: 60,
  monthlyCommuteCost: 2500,
  cultureRatings: {
    workLifeBalance: 3,
    remoteFlexibility: 4,
    careerGrowth: 5,
    mentorship: 4,
    jobStability: 4,
    workplaceCulture: 4,
  },
};

