/**
 * CalcZen Gold Loan Against Jewellery Calculator Utilities (India)
 * Based on Reserve Bank of India (Lending Against Gold and Silver Collateral) Directions, 2025.
 * 
 * LTV Limits for Eligible Consumption Loans:
 * - Up to ₹2.5 lakh: Maximum LTV = 85%
 * - Above ₹2.5 lakh and up to ₹5 lakh: Maximum LTV = 80%
 * - Above ₹5 lakh: Maximum LTV = 75%
 * 
 * Strict Band Boundary Handling:
 * Band 1 Candidate: min(85% × V, ₹2,50,000)
 * Band 2 Candidate: valid only when 80% × V > ₹2,50,000; Candidate 2 = min(80% × V, ₹5,00,000)
 * Band 3 Candidate: valid only when 75% × V > ₹5,00,000; Candidate 3 = 75% × V
 * Maximum Indicative Loan = max(valid candidates)
 */

export type GoldPurityKey =
  | "24k-999"
  | "24k-995"
  | "23k-958"
  | "22k-916"
  | "20k-833"
  | "18k-750";

export interface PurityInfo {
  key: GoldPurityKey;
  karat: number;
  finenessPerThousand: number;
  finenessFraction: number; // e.g. 0.916 for 22K
  label: string;
  shortLabel: string;
  hallmarkCode: string;
  description: string;
}

export const GOLD_PURITY_MAP: Record<GoldPurityKey, PurityInfo> = {
  "22k-916": {
    key: "22k-916",
    karat: 22,
    finenessPerThousand: 916,
    finenessFraction: 0.916,
    label: "22K (916 Hallmark - 91.6% Pure Gold)",
    shortLabel: "22K (916)",
    hallmarkCode: "916",
    description: "Standard Indian bridal and traditional jewellery",
  },
  "24k-999": {
    key: "24k-999",
    karat: 24,
    finenessPerThousand: 999,
    finenessFraction: 0.999,
    label: "24K (999 Fineness - 99.9% Pure Bullion)",
    shortLabel: "24K (999)",
    hallmarkCode: "999",
    description: "Minted gold coins, bars and pure gold items",
  },
  "24k-995": {
    key: "24k-995",
    karat: 24,
    finenessPerThousand: 995,
    finenessFraction: 0.995,
    label: "24K (995 Fineness - Standard Bullion)",
    shortLabel: "24K (995)",
    hallmarkCode: "995",
    description: "Standard market bullion bars and coins",
  },
  "23k-958": {
    key: "23k-958",
    karat: 23,
    finenessPerThousand: 958,
    finenessFraction: 0.958,
    label: "23K (958 Hallmark - 95.8% Pure Gold)",
    shortLabel: "23K (958)",
    hallmarkCode: "958",
    description: "High-purity temple jewellery and special ornaments",
  },
  "20k-833": {
    key: "20k-833",
    karat: 20,
    finenessPerThousand: 833,
    finenessFraction: 0.833,
    label: "20K (833 Hallmark - 83.3% Pure Gold)",
    shortLabel: "20K (833)",
    hallmarkCode: "833",
    description: "Vintage or regional gold jewellery",
  },
  "18k-750": {
    key: "18k-750",
    karat: 18,
    finenessPerThousand: 750,
    finenessFraction: 0.75,
    label: "18K (750 Hallmark - 75.0% Pure Gold)",
    shortLabel: "18K (750)",
    hallmarkCode: "750",
    description: "Diamond-studded jewellery and modern lightweight designs",
  },
};

export type RateBasis = "selected_purity" | "24k_rate";
export type LoanCalculationMode = "estimate_max" | "requested_amount";
export type LoanPurposeCategory = "consumption" | "business" | "unsure";
export type RepaymentMethod = "none" | "emi" | "bullet" | "overdraft";
export type ProcessingFeeType = "percentage" | "fixed" | "none";

export interface GoldLoanInputs {
  // 1. Core Gold Details
  grossWeight: number; // in grams
  nonGoldWeight: number; // in grams (stones, beads, wax, etc.)
  purity: GoldPurityKey;
  rateBasis: RateBasis;
  goldRate: number; // ₹ per gram (either for selected purity or for 24K)

  // 2. Loan Mode & Purpose
  loanMode: LoanCalculationMode; // "estimate_max" | "requested_amount"
  requestedLoanAmount: number; // in ₹ (if loanMode === "requested_amount")
  loanPurpose: LoanPurposeCategory; // "consumption" | "business" | "unsure"
  customLtv: number; // optional custom lender LTV percentage (0 = use RBI rule)
  otherDeductions: number; // optional lender appraisal adjustment in ₹

  // 3. Optional Repayment & Interest Estimator
  repaymentMethod: RepaymentMethod; // "none" | "emi" | "bullet" | "overdraft"
  annualInterestRate: number; // annual % e.g. 10.5
  tenureMonths: number; // e.g. 12
  overdraftUtilisationPct: number; // e.g. 100 for full utilisation

  // 4. Fees & Upfront Costs
  processingFeeType: ProcessingFeeType;
  processingFeeValue: number; // % or ₹ depending on type
  valuationFee: number; // ₹ appraisal fee
  documentationFee: number; // ₹ documentation fee
}

export interface LtvBandCandidate {
  band: number;
  label: string;
  maxLtv: number;
  rawAmount: number;
  candidateAmount: number;
  isValid: boolean;
  reason?: string;
}

export interface GoldLoanCalculationResult {
  // Weight & Valuation
  grossWeight: number;
  nonGoldWeight: number;
  netGoldWeight: number;
  purity: GoldPurityKey;
  purityLabel: string;
  finenessFraction: number;
  effectiveRatePerGram: number;
  grossGoldValue: number;
  otherDeductions: number;
  eligibleGoldValue: number; // V

  // LTV & Loan Amount
  isRbiConsumptionRule: boolean;
  bandCandidates: LtvBandCandidate[];
  maxEligibleLoanAmount: number;
  sanctionedLoanAmount: number; // either maxEligible or validated requested amount
  effectiveLtvPercentage: number;
  isRequestedLoanApproved: boolean;
  requestedLtvPercentage: number;
  permittedLtvForRequestedAmount: number;
  regulatoryCeilingNotice: string;

  // Repayment (if enabled)
  repaymentMethod: RepaymentMethod;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepaymentAmount: number;
  monthlyOverdraftInterest: number;

  // Fees & Disbursal
  processingFee: number;
  valuationFee: number;
  documentationFee: number;
  totalUpfrontFees: number;
  netDisbursalAmount: number;

  // Formatted Strings for Display
  formattedGrossWeight: string;
  formattedNetWeight: string;
  formattedEffectiveRate: string;
  formattedEligibleGoldValue: string;
  formattedMaxEligibleLoan: string;
  formattedSanctionedLoan: string;
  formattedEffectiveLtv: string;
  formattedMonthlyEmi: string;
  formattedTotalInterest: string;
  formattedTotalRepayment: string;
  formattedProcessingFee: string;
  formattedTotalFees: string;
  formattedNetDisbursal: string;
}

export interface GoldLoanValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

/**
 * Currency Formatter for Indian Rupees (INR)
 */
export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  const rounded = Math.round(val);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Input Validation
 */
export function validateGoldLoanInputs(inputs: GoldLoanInputs): GoldLoanValidation {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (!inputs.grossWeight || inputs.grossWeight <= 0) {
    errors.grossWeight = "Please enter a valid jewellery weight greater than 0g.";
  } else if (inputs.grossWeight > 50000) {
    errors.grossWeight = "Weight exceeds standard retail limit (50 kg).";
  }

  if (inputs.nonGoldWeight < 0) {
    errors.nonGoldWeight = "Stone / non-gold weight cannot be negative.";
  } else if (inputs.nonGoldWeight >= inputs.grossWeight) {
    errors.nonGoldWeight = "Stone / non-gold weight must be strictly less than gross weight.";
  }

  if (!GOLD_PURITY_MAP[inputs.purity]) {
    errors.purity = "Please select a valid gold purity.";
  }

  if (!inputs.goldRate || inputs.goldRate <= 0) {
    errors.goldRate = "Please enter a valid gold rate greater than ₹0 per gram.";
  } else if (inputs.goldRate > 200000) {
    errors.goldRate = "Entered gold rate seems unusually high. Please verify.";
  }

  if (inputs.customLtv !== 0) {
    if (inputs.customLtv < 1 || inputs.customLtv > 100) {
      errors.customLtv = "Custom LTV must be between 1% and 100%.";
    }
  }

  if (inputs.loanMode === "requested_amount") {
    if (!inputs.requestedLoanAmount || inputs.requestedLoanAmount <= 0) {
      errors.requestedLoanAmount = "Please enter your desired loan amount in ₹.";
    }
  }

  if (inputs.repaymentMethod !== "none") {
    if (inputs.annualInterestRate < 0 || inputs.annualInterestRate > 60) {
      errors.annualInterestRate = "Annual interest rate must be between 0% and 60%.";
    }
    if (!inputs.tenureMonths || inputs.tenureMonths <= 0 || inputs.tenureMonths > 120) {
      errors.tenureMonths = "Loan tenure must be between 1 and 120 months.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate RBI Consumption Loan LTV Band Candidates
 * 
 * Rules:
 * Band 1 (Up to ₹2.5 lakh, 85% LTV):
 * Candidate 1 = min(85% × V, ₹2,50,000)
 * 
 * Band 2 (Above ₹2.5 lakh and up to ₹5 lakh, 80% LTV):
 * Candidate 2 is valid ONLY when 80% × V > ₹2,50,000.
 * Candidate 2 = min(80% × V, ₹5,00,000)
 * 
 * Band 3 (Above ₹5 lakh, 75% LTV):
 * Candidate 3 is valid ONLY when 75% × V > ₹5,00,000.
 * Candidate 3 = 75% × V
 * 
 * Max Indicative Loan = max(Candidate 1, Candidate 2 (if valid), Candidate 3 (if valid))
 */
export function calculateRbiLtvBands(eligibleGoldValue: number): {
  candidates: LtvBandCandidate[];
  maxEligibleLoan: number;
  effectiveLtv: number;
} {
  const V = Math.max(0, eligibleGoldValue);

  // Band 1: Up to ₹2.5 lakh @ 85% LTV
  const band1Raw = 0.85 * V;
  const cand1 = Math.min(band1Raw, 250000);
  const band1Candidate: LtvBandCandidate = {
    band: 1,
    label: "Band 1 (Up to ₹2.5 Lakh)",
    maxLtv: 85,
    rawAmount: band1Raw,
    candidateAmount: cand1,
    isValid: true,
  };

  // Band 2: Above ₹2.5 lakh to ₹5 lakh @ 80% LTV
  // Valid only when resulting loan is greater than ₹2,50,000
  const band2Raw = 0.8 * V;
  const band2Valid = band2Raw > 250000;
  const cand2 = band2Valid ? Math.min(band2Raw, 500000) : 0;
  const band2Candidate: LtvBandCandidate = {
    band: 2,
    label: "Band 2 (Above ₹2.5L to ₹5 Lakh)",
    maxLtv: 80,
    rawAmount: band2Raw,
    candidateAmount: cand2,
    isValid: band2Valid,
    reason: band2Valid ? undefined : "80% of gold value does not exceed ₹2,50,000 threshold",
  };

  // Band 3: Above ₹5 lakh @ 75% LTV
  // Valid only when resulting loan is greater than ₹5,00,000
  const band3Raw = 0.75 * V;
  const band3Valid = band3Raw > 500000;
  const cand3 = band3Valid ? band3Raw : 0;
  const band3Candidate: LtvBandCandidate = {
    band: 3,
    label: "Band 3 (Above ₹5 Lakh)",
    maxLtv: 75,
    rawAmount: band3Raw,
    candidateAmount: cand3,
    isValid: band3Valid,
    reason: band3Valid ? undefined : "75% of gold value does not exceed ₹5,00,000 threshold",
  };

  const candidates = [band1Candidate, band2Candidate, band3Candidate];
  const maxEligibleLoan = Math.max(cand1, cand2, cand3);
  const effectiveLtv = V > 0 ? (maxEligibleLoan / V) * 100 : 0;

  return {
    candidates,
    maxEligibleLoan,
    effectiveLtv,
  };
}

/**
 * Determine Maximum Permitted LTV for a Requested Loan Amount under RBI rules
 */
export function getRbiPermittedLtvForAmount(loanAmount: number): number {
  if (loanAmount <= 250000) return 85;
  if (loanAmount <= 500000) return 80;
  return 75;
}

/**
 * Monthly Reducing Balance EMI Formula
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateMonthlyEmi(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): { emi: number; totalPayment: number; totalInterest: number } {
  const P = Math.max(0, principal);
  const n = Math.max(1, Math.round(tenureMonths));
  const r = annualRatePct / 12 / 100;

  if (P === 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 };
  }

  if (r <= 0) {
    const emi = P / n;
    return { emi, totalPayment: P, totalInterest: 0 };
  }

  const factor = Math.pow(1 + r, n);
  const emi = (P * r * factor) / (factor - 1);
  const totalPayment = emi * n;
  const totalInterest = Math.max(0, totalPayment - P);

  return {
    emi,
    totalPayment,
    totalInterest,
  };
}

/**
 * Bullet Repayment (Simple Interest Illustration)
 * Interest = Principal × Annual Rate / 100 × (n / 12)
 * Total = Principal + Interest
 */
export function calculateBulletRepayment(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): { maturityAmount: number; totalInterest: number } {
  const P = Math.max(0, principal);
  const years = Math.max(0, tenureMonths) / 12;
  const totalInterest = (P * annualRatePct * years) / 100;
  const maturityAmount = P + totalInterest;

  return {
    maturityAmount,
    totalInterest,
  };
}

/**
 * Master Gold Loan Calculation Engine
 */
export function calculateGoldLoan(inputs: GoldLoanInputs): GoldLoanCalculationResult {
  // 1. Net Gold Weight
  const grossWeight = Math.max(0, inputs.grossWeight || 0);
  const nonGoldWeight = Math.max(0, inputs.nonGoldWeight || 0);
  const netGoldWeight = Math.max(0, grossWeight - nonGoldWeight);

  // 2. Purity & Effective Rate
  const purityConfig = GOLD_PURITY_MAP[inputs.purity] || GOLD_PURITY_MAP["22k-916"];
  const goldRate = Math.max(0, inputs.goldRate || 0);

  let effectiveRatePerGram = goldRate;
  if (inputs.rateBasis === "24k_rate") {
    effectiveRatePerGram = goldRate * purityConfig.finenessFraction;
  }

  // 3. Gold Collateral Valuation
  const grossGoldValue = netGoldWeight * effectiveRatePerGram;
  const otherDeductions = Math.max(0, inputs.otherDeductions || 0);
  const eligibleGoldValue = Math.max(0, grossGoldValue - otherDeductions);

  // 4. LTV & Loan Amount Calculation
  let isRbiConsumptionRule = false;
  let bandCandidates: LtvBandCandidate[] = [];
  let maxEligibleLoanAmount = 0;
  let effectiveLtvPercentage = 0;
  let regulatoryCeilingNotice = "";

  if (inputs.customLtv > 0) {
    // Custom Lender LTV specified by user
    effectiveLtvPercentage = Math.min(100, Math.max(1, inputs.customLtv));
    maxEligibleLoanAmount = (eligibleGoldValue * effectiveLtvPercentage) / 100;
    regulatoryCeilingNotice = `Calculated using custom lender LTV of ${effectiveLtvPercentage}%.`;
  } else if (inputs.loanPurpose === "consumption") {
    // RBI 2025 Consumption Loan LTV Bands (85% / 80% / 75%)
    isRbiConsumptionRule = true;
    const rbi = calculateRbiLtvBands(eligibleGoldValue);
    bandCandidates = rbi.candidates;
    maxEligibleLoanAmount = rbi.maxEligibleLoan;
    effectiveLtvPercentage = rbi.effectiveLtv;
    regulatoryCeilingNotice =
      "Calculated under RBI 2025 maximum LTV limits for eligible consumption loans (up to 85% for ≤₹2.5L, 80% for >₹2.5L–₹5L, 75% for >₹5L).";
  } else {
    // Business purpose or unsure: standard bank guideline average (default 75% ceiling)
    effectiveLtvPercentage = 75;
    maxEligibleLoanAmount = (eligibleGoldValue * 75) / 100;
    regulatoryCeilingNotice =
      "For business or non-consumption loans, regulatory LTV ceilings are determined by lender policy (typically up to 75%).";
  }

  // 5. Handling Loan Mode (Max Eligible vs User Requested Amount)
  let sanctionedLoanAmount = maxEligibleLoanAmount;
  let isRequestedLoanApproved = true;
  let requestedLtvPercentage = 0;
  let permittedLtvForRequestedAmount = 75;

  if (inputs.loanMode === "requested_amount") {
    const requested = Math.max(0, inputs.requestedLoanAmount || 0);
    sanctionedLoanAmount = requested;
    requestedLtvPercentage = eligibleGoldValue > 0 ? (requested / eligibleGoldValue) * 100 : 0;

    if (inputs.customLtv > 0) {
      permittedLtvForRequestedAmount = inputs.customLtv;
      isRequestedLoanApproved = requested <= maxEligibleLoanAmount;
    } else if (inputs.loanPurpose === "consumption") {
      permittedLtvForRequestedAmount = getRbiPermittedLtvForAmount(requested);
      // Valid if requested does not exceed max eligible loan under RBI rules
      isRequestedLoanApproved = requested <= maxEligibleLoanAmount;
    } else {
      permittedLtvForRequestedAmount = 75;
      isRequestedLoanApproved = requested <= maxEligibleLoanAmount;
    }
  }

  // 6. Upfront Fees & Net Disbursal
  let processingFee = 0;
  if (inputs.processingFeeType === "percentage") {
    processingFee = (sanctionedLoanAmount * Math.max(0, inputs.processingFeeValue)) / 100;
  } else if (inputs.processingFeeType === "fixed") {
    processingFee = Math.max(0, inputs.processingFeeValue);
  }

  const valuationFee = Math.max(0, inputs.valuationFee || 0);
  const documentationFee = Math.max(0, inputs.documentationFee || 0);
  const totalUpfrontFees = processingFee + valuationFee + documentationFee;
  const netDisbursalAmount = Math.max(0, sanctionedLoanAmount - totalUpfrontFees);

  // 7. Repayment Calculation
  let monthlyEmi = 0;
  let totalInterest = 0;
  let totalRepaymentAmount = sanctionedLoanAmount;
  let monthlyOverdraftInterest = 0;

  if (inputs.repaymentMethod === "emi") {
    const emiRes = calculateMonthlyEmi(
      sanctionedLoanAmount,
      inputs.annualInterestRate,
      inputs.tenureMonths
    );
    monthlyEmi = emiRes.emi;
    totalInterest = emiRes.totalInterest;
    totalRepaymentAmount = emiRes.totalPayment;
  } else if (inputs.repaymentMethod === "bullet") {
    const bulletRes = calculateBulletRepayment(
      sanctionedLoanAmount,
      inputs.annualInterestRate,
      inputs.tenureMonths
    );
    totalInterest = bulletRes.totalInterest;
    totalRepaymentAmount = bulletRes.maturityAmount;
  } else if (inputs.repaymentMethod === "overdraft") {
    const utilisationPct = Math.min(100, Math.max(0, inputs.overdraftUtilisationPct || 100));
    const utilisedPrincipal = (sanctionedLoanAmount * utilisationPct) / 100;
    const monthlyRate = inputs.annualInterestRate / 12 / 100;
    monthlyOverdraftInterest = utilisedPrincipal * monthlyRate;
    totalInterest = monthlyOverdraftInterest * inputs.tenureMonths;
    totalRepaymentAmount = sanctionedLoanAmount + totalInterest;
  }

  return {
    grossWeight,
    nonGoldWeight,
    netGoldWeight,
    purity: inputs.purity,
    purityLabel: purityConfig.label,
    finenessFraction: purityConfig.finenessFraction,
    effectiveRatePerGram,
    grossGoldValue,
    otherDeductions,
    eligibleGoldValue,

    isRbiConsumptionRule,
    bandCandidates,
    maxEligibleLoanAmount,
    sanctionedLoanAmount,
    effectiveLtvPercentage,
    isRequestedLoanApproved,
    requestedLtvPercentage,
    permittedLtvForRequestedAmount,
    regulatoryCeilingNotice,

    repaymentMethod: inputs.repaymentMethod,
    annualInterestRate: inputs.annualInterestRate,
    tenureMonths: inputs.tenureMonths,
    monthlyEmi,
    totalInterest,
    totalRepaymentAmount,
    monthlyOverdraftInterest,

    processingFee,
    valuationFee,
    documentationFee,
    totalUpfrontFees,
    netDisbursalAmount,

    // Formatted strings
    formattedGrossWeight: `${grossWeight.toFixed(2)} g`,
    formattedNetWeight: `${netGoldWeight.toFixed(2)} g`,
    formattedEffectiveRate: `₹${Math.round(effectiveRatePerGram).toLocaleString("en-IN")}`,
    formattedEligibleGoldValue: formatINR(eligibleGoldValue),
    formattedMaxEligibleLoan: formatINR(maxEligibleLoanAmount),
    formattedSanctionedLoan: formatINR(sanctionedLoanAmount),
    formattedEffectiveLtv: `${effectiveLtvPercentage.toFixed(1)}%`,
    formattedMonthlyEmi: formatINR(monthlyEmi),
    formattedTotalInterest: formatINR(totalInterest),
    formattedTotalRepayment: formatINR(totalRepaymentAmount),
    formattedProcessingFee: formatINR(processingFee),
    formattedTotalFees: formatINR(totalUpfrontFees),
    formattedNetDisbursal: formatINR(netDisbursalAmount),
  };
}

