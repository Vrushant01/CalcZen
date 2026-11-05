/**
 * Indian Payroll and Income Tax Calculation Engine
 * Applicable for Financial Year 2026–27 (Assessment Year 2027–28)
 *
 * Official sources & references:
 * - Income Tax Department of India (Finance Act 2024 / FY 2025-26 & FY 2026-27 updates): https://www.incometax.gov.in/
 * - Employees' Provident Fund Organisation (EPFO): https://www.epfindia.gov.in/
 * - Employees' State Insurance Corporation (ESIC): https://www.esic.gov.in/
 * - Ministry of Labour & Employment (Payment of Gratuity Act, 1972 & Labour Codes): https://labour.gov.in/
 */

export type TaxRegime = "new" | "old";

export type CityType = "metro" | "non-metro";

export interface ProfessionalTaxRule {
  state: string;
  calculate: (monthlyGross: number, isFemale?: boolean) => number;
  annualMax: number;
  notes: string;
}

/**
 * State-wise Professional Tax Rules Table
 * Subject to the constitutional maximum of ₹2,500/year under Article 276(2).
 */
export const STATE_PROFESSIONAL_TAX_RULES: Record<string, ProfessionalTaxRule> = {
  Gujarat: {
    state: "Gujarat",
    calculate: (monthlyGross: number) => {
      // Gujarat PT: Up to ₹12,000/mo: Nil, > ₹12,000/mo: ₹200/mo (₹2,400/yr)
      if (monthlyGross <= 12000) return 0;
      return 200;
    },
    annualMax: 2400,
    notes: "Gujarat: Exempt up to ₹12,000/month. ₹200/month above ₹12,000.",
  },
  Maharashtra: {
    state: "Maharashtra",
    calculate: (monthlyGross: number, isFemale = false) => {
      // Maharashtra PT: Women up to ₹25,000/mo exempt
      if (isFemale && monthlyGross <= 25000) return 0;
      if (monthlyGross <= 7500) return 0;
      if (monthlyGross <= 10000) return 175;
      // > ₹10,000: ₹200/mo for 11 months, ₹300 in Feb (Average ₹208.33/mo = ₹2,500/yr)
      return 208.33;
    },
    annualMax: 2500,
    notes: "Maharashtra: ₹200/mo (₹300 in Feb, total ₹2,500/yr). Women exempt up to ₹25,000/mo.",
  },
  Karnataka: {
    state: "Karnataka",
    calculate: (monthlyGross: number) => {
      // Karnataka amendment: Up to ₹25,000/mo: Nil; > ₹25,000/mo: ₹200/mo (₹2,400/yr)
      if (monthlyGross <= 25000) return 0;
      return 200;
    },
    annualMax: 2400,
    notes: "Karnataka: Exempt up to ₹25,000/month. ₹200/month above ₹25,000.",
  },
  "Tamil Nadu": {
    state: "Tamil Nadu",
    calculate: (monthlyGross: number) => {
      // Half-yearly slab divided by 6
      if (monthlyGross <= 3500) return 0;
      if (monthlyGross <= 5000) return 22.5;
      if (monthlyGross <= 7500) return 52.5;
      if (monthlyGross <= 10000) return 115;
      if (monthlyGross <= 12500) return 171;
      return 208.33; // ₹1,250 half-yearly = ₹2,500/yr
    },
    annualMax: 2500,
    notes: "Tamil Nadu: Half-yearly slab up to ₹1,250 per half-year (₹2,500/yr max).",
  },
  Telangana: {
    state: "Telangana",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      if (monthlyGross <= 20000) return 150;
      return 200;
    },
    annualMax: 2400,
    notes: "Telangana: Exempt up to ₹15,000/mo, ₹150 for 15k-20k, ₹200 above 20k.",
  },
  "Andhra Pradesh": {
    state: "Andhra Pradesh",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      if (monthlyGross <= 20000) return 150;
      return 200;
    },
    annualMax: 2400,
    notes: "Andhra Pradesh: Exempt up to ₹15,000/mo, ₹150 for 15k-20k, ₹200 above 20k.",
  },
  "West Bengal": {
    state: "West Bengal",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 10000) return 0;
      if (monthlyGross <= 15000) return 110;
      if (monthlyGross <= 25000) return 130;
      if (monthlyGross <= 40000) return 150;
      return 200;
    },
    annualMax: 2500,
    notes: "West Bengal: Slabs from ₹110 to ₹200/mo.",
  },
  Kerala: {
    state: "Kerala",
    calculate: (monthlyGross: number) => {
      // Half-yearly slab in Kerala
      if (monthlyGross <= 1999) return 0;
      if (monthlyGross <= 2999) return 20;
      if (monthlyGross <= 4999) return 30;
      if (monthlyGross <= 7499) return 50;
      if (monthlyGross <= 9999) return 75;
      if (monthlyGross <= 12499) return 100;
      if (monthlyGross <= 16666) return 125;
      if (monthlyGross <= 20833) return 166.67;
      return 208.33; // ₹1,250 half-yearly = ₹2,500/yr
    },
    annualMax: 2500,
    notes: "Kerala: Half-yearly deduction up to ₹1,250 (₹2,500/yr).",
  },
  "Madhya Pradesh": {
    state: "Madhya Pradesh",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 18750) return 0; // ₹2,25,000/yr exempt
      return 208.33; // ₹2,500/yr
    },
    annualMax: 2500,
    notes: "Madhya Pradesh: Annual exempt up to ₹2,25,000; ₹2,500/yr above.",
  },
  Odisha: {
    state: "Odisha",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 13333) return 0;
      if (monthlyGross <= 25000) return 166.67;
      return 208.33; // ₹2,500/yr
    },
    annualMax: 2500,
    notes: "Odisha: Exempt up to ₹1,60,000/yr; ₹200/mo (₹300 in 12th mo).",
  },
  Assam: {
    state: "Assam",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 10000) return 0;
      if (monthlyGross <= 15000) return 150;
      if (monthlyGross <= 25000) return 180;
      return 208.33;
    },
    annualMax: 2500,
    notes: "Assam: Exempt up to ₹10,000/mo; up to ₹2,500/yr.",
  },
  Delhi: {
    state: "Delhi",
    calculate: () => 0,
    annualMax: 0,
    notes: "Delhi: No Professional Tax levied.",
  },
  Haryana: {
    state: "Haryana",
    calculate: () => 0,
    annualMax: 0,
    notes: "Haryana: No Professional Tax levied.",
  },
  "Uttar Pradesh": {
    state: "Uttar Pradesh",
    calculate: () => 0,
    annualMax: 0,
    notes: "Uttar Pradesh: No Professional Tax levied on salaried employees.",
  },
  Rajasthan: {
    state: "Rajasthan",
    calculate: () => 0,
    annualMax: 0,
    notes: "Rajasthan: No Professional Tax levied on salaried employees.",
  },
  Punjab: {
    state: "Punjab",
    calculate: (monthlyGross: number) => {
      // Punjab Development Tax: ₹200/month if income > ₹2.5L/year (exempt for income tax non-assessees)
      if (monthlyGross <= 20833) return 0;
      return 200;
    },
    annualMax: 2400,
    notes: "Punjab: ₹200/month Development Tax if taxable income exceeds ₹2.5L/yr.",
  },
  "Himachal Pradesh": {
    state: "Himachal Pradesh",
    calculate: () => 0,
    annualMax: 0,
    notes: "Himachal Pradesh: No Professional Tax levied.",
  },
  Uttarakhand: {
    state: "Uttarakhand",
    calculate: () => 0,
    annualMax: 0,
    notes: "Uttarakhand: No Professional Tax levied.",
  },
  Bihar: {
    state: "Bihar",
    calculate: (monthlyGross: number) => {
      const annual = monthlyGross * 12;
      if (annual <= 300000) return 0;
      if (annual <= 500000) return 83.33; // ₹1,000/yr
      if (annual <= 1000000) return 166.67; // ₹2,000/yr
      return 208.33; // ₹2,500/yr
    },
    annualMax: 2500,
    notes: "Bihar: Slabs from ₹1,000 to ₹2,500 per year based on annual gross.",
  },
  Jharkhand: {
    state: "Jharkhand",
    calculate: (monthlyGross: number) => {
      const annual = monthlyGross * 12;
      if (annual <= 300000) return 0;
      if (annual <= 500000) return 83.33;
      if (annual <= 800000) return 125;
      if (annual <= 1000000) return 150;
      return 208.33;
    },
    annualMax: 2500,
    notes: "Jharkhand: Slabs up to ₹2,500 per year.",
  },
  Goa: {
    state: "Goa",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      if (monthlyGross <= 25000) return 150;
      return 200;
    },
    annualMax: 2500,
    notes: "Goa: Slabs up to ₹200/mo.",
  },
  Chhattisgarh: {
    state: "Chhattisgarh",
    calculate: (monthlyGross: number) => {
      const annual = monthlyGross * 12;
      if (annual <= 180000) return 0;
      if (annual <= 250000) return 125;
      if (annual <= 350000) return 166.67;
      return 208.33;
    },
    annualMax: 2500,
    notes: "Chhattisgarh: Slabs up to ₹2,500/year.",
  },
  "Other / Default": {
    state: "Other / Default",
    calculate: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      return 200;
    },
    annualMax: 2400,
    notes: "Standard estimate: ₹200/month above ₹15,000.",
  },
};

export const INDIAN_STATES = Object.keys(STATE_PROFESSIONAL_TAX_RULES);

export interface SalaryCalculatorInputs {
  /** Total Cost to Company per annum in ₹ */
  annualCTC: number;
  /** Financial Year e.g. "FY 2026-27" */
  financialYear: string;
  /** Indian State for Professional Tax */
  state: string;
  /** Tax regime */
  regime: TaxRegime;
  /** Structure mode: standard automatic vs custom percentages */
  structureType: "standard" | "custom";
  /** Basic salary as % of fixed gross (Default: 50%) */
  basicPercentage: number;
  /** HRA as % of basic salary (Default: 40% non-metro, 50% metro) */
  hraPercentage: number;
  /** City type for HRA exemption under Old Regime */
  cityType: CityType;
  /** Actual rent paid per month (for HRA exemption under Old Regime) */
  monthlyRentPaid: number;
  /** Annual variable pay / bonus included in CTC */
  annualVariablePay: number;
  /** Is Employee PF enabled? (Default: true) */
  includeEmployeePF: boolean;
  /** Is Employer PF included in CTC? (Default: true) */
  includeEmployerPFInCTC: boolean;
  /** Restrict PF wage to statutory ceiling of ₹15,000/mo (₹1,800/mo contribution)? */
  pfCappedAtStatutoryCeiling: boolean;
  /** Voluntary Provident Fund (VPF) additional % of Basic (Default: 0) */
  vpfPercentage: number;
  /** Is Gratuity included in CTC? (Default: true) */
  includeGratuityInCTC: boolean;
  /** Gratuity override amount per year (if entered > 0, overrides formula) */
  gratuityOverride: number;
  /** Employer NPS contribution % of Basic under Section 80CCD(2) (Default: 0) */
  employerNPSPercentage: number;
  /** Other Employer Benefits in CTC per year */
  otherEmployerBenefits: number;

  // Deductions for Old Tax Regime
  /** Section 80C deductions (ELSS, PPF, LIC, etc. up to ₹1.5L - Employee PF is auto-added) */
  section80C: number;
  /** Section 80D health insurance (Self/Family/Parents up to ₹75,000/₹1,00,000) */
  section80D: number;
  /** Section 80CCD(1B) additional NPS deduction up to ₹50,000 */
  section80CCD1B: number;
  /** Section 24(b) home loan interest deduction up to ₹2,00,000 */
  homeLoanInterest80EEA: number;
  /** Other eligible tax deductions under Chapter VI-A (80E, 80G, 80TTA, etc.) */
  otherTaxDeductions: number;

  // Additional payroll deductions
  /** Employee voluntary insurance / medical policy per month */
  monthlyEmployeeInsurance: number;
  /** Other recurring monthly deductions */
  otherMonthlyDeductions: number;
}

export interface TaxCalculationBreakdown {
  regime: TaxRegime;
  grossSalary: number;
  standardDeduction: number;
  professionalTaxDeduction: number;
  hraExemption: number;
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  section80CCD2: number;
  homeLoanInterest: number;
  otherDeductions: number;
  totalDeductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  marginalRelief: number;
  surcharge: number;
  healthAndEducationCess: number;
  totalAnnualTax: number;
  monthlyTDS: number;
  effectiveTaxRate: number;
}

export interface SalaryBreakdownResult {
  // CTC Reconciliation Components
  annualCTC: number;
  annualFixedGross: number;
  monthlyFixedGross: number;
  annualVariablePay: number;

  // Basic Components
  annualBasic: number;
  monthlyBasic: number;
  annualHRA: number;
  monthlyHRA: number;
  annualSpecialAllowance: number;
  monthlySpecialAllowance: number;

  // Employer Contributions (part of CTC)
  annualEmployerPF: number;
  monthlyEmployerPF: number;
  annualGratuityProvision: number;
  monthlyGratuityProvision: number;
  annualEmployerESI: number;
  monthlyEmployerESI: number;
  annualEmployerNPS: number;
  monthlyEmployerNPS: number;
  annualOtherEmployerBenefits: number;
  totalAnnualEmployerContributions: number;

  // Employee Deductions (deducted from Gross Cash Salary)
  annualEmployeePF: number;
  monthlyEmployeePF: number;
  annualVPF: number;
  monthlyVPF: number;
  annualEmployeeESI: number;
  monthlyEmployeeESI: number;
  annualProfessionalTax: number;
  monthlyProfessionalTax: number;
  annualOtherDeductions: number;
  monthlyOtherDeductions: number;
  totalAnnualEmployeeStatutoryDeductions: number;
  totalMonthlyEmployeeStatutoryDeductions: number;

  // Tax details
  activeRegime: TaxRegime;
  taxBreakdown: TaxCalculationBreakdown;
  newRegimeComparison: TaxCalculationBreakdown;
  oldRegimeComparison: TaxCalculationBreakdown;
  taxDifferenceAnnual: number;
  inHandDifferenceMonthly: number;
  recommendedRegime: TaxRegime;

  // Final In-Hand Take-Home Figures
  monthlyInHand: number;
  annualInHand: number;
  annualNetVariablePay: number;
  totalAnnualInHandWithBonus: number;

  // Validation & Warnings
  warnings: string[];
  reconciliationCheckPassed: boolean;
  reconciliationDifference: number;
}

/**
 * Calculates Professional Tax for a given state and monthly gross income.
 */
export function calculateProfessionalTax(state: string, monthlyGross: number): number {
  const rule = STATE_PROFESSIONAL_TAX_RULES[state] || STATE_PROFESSIONAL_TAX_RULES["Other / Default"];
  const ptMonthly = rule.calculate(monthlyGross);
  return Math.min(Math.round(ptMonthly * 100) / 100, 2500 / 12);
}

/**
 * Calculates EPF Employee and Employer Contributions
 * Statutory wage ceiling: ₹15,000/month.
 * Rate: 12% each.
 */
export function calculateEPF(
  monthlyBasic: number,
  cappedAtCeiling: boolean,
  includeEmployeePF: boolean,
  vpfPercentage = 0,
): {
  monthlyEmployeePF: number;
  monthlyEmployerPF: number;
  monthlyVPF: number;
} {
  if (!includeEmployeePF && monthlyBasic > 15000) {
    return { monthlyEmployeePF: 0, monthlyEmployerPF: 0, monthlyVPF: 0 };
  }

  const eligiblePFBase = cappedAtCeiling ? Math.min(monthlyBasic, 15000) : monthlyBasic;

  const monthlyEmployeePF = Math.round(eligiblePFBase * 0.12);
  const monthlyEmployerPF = Math.round(eligiblePFBase * 0.12);
  const monthlyVPF = vpfPercentage > 0 ? Math.round(monthlyBasic * (vpfPercentage / 100)) : 0;

  return { monthlyEmployeePF, monthlyEmployerPF, monthlyVPF };
}

/**
 * Calculates Gratuity Provision as per the Payment of Gratuity Act, 1972:
 * Formula: (15 / 26) * (Basic / 12) per year ≈ 4.81% of Annual Basic.
 */
export function calculateGratuity(annualBasic: number, override = 0): number {
  if (override > 0) return Math.round(override);
  return Math.round((annualBasic * 15) / (26 * 12));
}

/**
 * Calculates ESI (Employee State Insurance)
 * Eligibility: Gross salary <= ₹21,000/month.
 * Employee: 0.75% of Gross. Employer: 3.25% of Gross.
 */
export function calculateESI(monthlyGross: number): {
  isEligible: boolean;
  monthlyEmployeeESI: number;
  monthlyEmployerESI: number;
} {
  if (monthlyGross > 21000) {
    return { isEligible: false, monthlyEmployeeESI: 0, monthlyEmployerESI: 0 };
  }
  const monthlyEmployeeESI = Math.round(monthlyGross * 0.0075);
  const monthlyEmployerESI = Math.round(monthlyGross * 0.0325);
  return { isEligible: true, monthlyEmployeeESI, monthlyEmployerESI };
}

/**
 * Calculates HRA Tax Exemption under Old Tax Regime (Section 10(13A))
 * Least of:
 * 1. Actual HRA received
 * 2. Rent paid minus 10% of Basic salary
 * 3. 50% of Basic (Metro: Delhi, Mumbai, Kolkata, Chennai) or 40% of Basic (Non-metro)
 */
export function calculateHRAExemption(
  annualBasic: number,
  annualHRA: number,
  annualRentPaid: number,
  cityType: CityType,
): number {
  if (annualRentPaid <= 0 || annualHRA <= 0) return 0;

  const rentMinusTenPercentBasic = Math.max(0, annualRentPaid - 0.1 * annualBasic);
  const salaryPercent = cityType === "metro" ? 0.5 * annualBasic : 0.4 * annualBasic;

  const exemption = Math.min(annualHRA, rentMinusTenPercentBasic, salaryPercent);
  return Math.max(0, Math.round(exemption));
}

/**
 * Calculates Income Tax under New Tax Regime (Section 115BAC) for FY 2026–27 / AY 2027–28
 *
 * Rules:
 * - Standard Deduction: ₹75,000 (applicable to salaried employees).
 * - Slabs:
 *   - ₹0 to ₹3,00,000: Nil
 *   - ₹3,00,001 to ₹7,00,000: 5%
 *   - ₹7,00,001 to ₹10,00,000: 10%
 *   - ₹10,00,001 to ₹12,00,000: 15%
 *   - ₹12,00,001 to ₹15,00,000: 20%
 *   - Above ₹15,00,000: 30%
 * - Section 87A Rebate: Full rebate up to ₹25,000 if taxable income <= ₹7,00,000.
 * - Section 87A Marginal Relief: If taxable income > ₹7,00,000, tax cannot exceed income in excess of ₹7,00,000.
 * - Surcharge: 10% (50L-1Cr), 15% (1Cr-2Cr), 25% (>2Cr).
 * - Health and Education Cess: 4% on (Tax + Surcharge).
 */
export function calculateNewRegimeTax(
  grossSalary: number,
  employerNPS = 0,
): TaxCalculationBreakdown {
  const standardDeduction = 75000;
  // Section 80CCD(2) employer NPS deduction is allowed under New Tax Regime
  const allowedEmployerNPS = Math.max(0, employerNPS);
  const totalDeductions = standardDeduction + allowedEmployerNPS;
  const taxableIncome = Math.max(0, Math.round(grossSalary - totalDeductions));

  // Slab-wise calculation
  let slabTax = 0;
  if (taxableIncome > 1500000) {
    slabTax += (taxableIncome - 1500000) * 0.3;
    slabTax += 300000 * 0.2; // 12L to 15L
    slabTax += 200000 * 0.15; // 10L to 12L
    slabTax += 300000 * 0.1; // 7L to 10L
    slabTax += 400000 * 0.05; // 3L to 7L
  } else if (taxableIncome > 1200000) {
    slabTax += (taxableIncome - 1200000) * 0.2;
    slabTax += 200000 * 0.15;
    slabTax += 300000 * 0.1;
    slabTax += 400000 * 0.05;
  } else if (taxableIncome > 1000000) {
    slabTax += (taxableIncome - 1000000) * 0.15;
    slabTax += 300000 * 0.1;
    slabTax += 400000 * 0.05;
  } else if (taxableIncome > 700000) {
    slabTax += (taxableIncome - 700000) * 0.1;
    slabTax += 400000 * 0.05;
  } else if (taxableIncome > 300000) {
    slabTax += (taxableIncome - 300000) * 0.05;
  }

  slabTax = Math.round(slabTax);

  // Section 87A Rebate & Marginal Relief
  let rebate87A = 0;
  let marginalRelief = 0;
  let taxAfterRebate = slabTax;

  if (taxableIncome <= 700000) {
    rebate87A = slabTax;
    taxAfterRebate = 0;
  } else {
    // Marginal relief under Section 87A for New Regime:
    // Tax payable cannot exceed (Taxable Income - ₹7,00,000)
    const excessIncome = taxableIncome - 700000;
    if (slabTax > excessIncome) {
      marginalRelief = slabTax - excessIncome;
      taxAfterRebate = excessIncome;
    }
  }

  // Surcharge
  let surchargeRate = 0;
  if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.1;

  const surcharge = Math.round(taxAfterRebate * surchargeRate);
  const taxWithSurcharge = taxAfterRebate + surcharge;
  const healthAndEducationCess = Math.round(taxWithSurcharge * 0.04);
  const totalAnnualTax = taxWithSurcharge + healthAndEducationCess;
  const monthlyTDS = Math.round(totalAnnualTax / 12);
  const effectiveTaxRate = grossSalary > 0 ? (totalAnnualTax / grossSalary) * 100 : 0;

  return {
    regime: "new",
    grossSalary,
    standardDeduction,
    professionalTaxDeduction: 0, // Not allowed under new regime
    hraExemption: 0,
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    section80CCD2: allowedEmployerNPS,
    homeLoanInterest: 0,
    otherDeductions: 0,
    totalDeductions,
    taxableIncome,
    slabTax,
    rebate87A,
    taxAfterRebate,
    marginalRelief,
    surcharge,
    healthAndEducationCess,
    totalAnnualTax,
    monthlyTDS,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
  };
}

/**
 * Calculates Income Tax under Old Tax Regime for FY 2026–27 / AY 2027–28
 *
 * Slabs:
 * - Up to ₹2,50,000: Nil
 * - ₹2,50,001 to ₹5,00,000: 5%
 * - ₹5,00,001 to ₹10,00,000: 20%
 * - Above ₹10,00,000: 30%
 *
 * Standard deduction: ₹50,000
 * Section 87A rebate: Up to ₹12,500 if taxable income <= ₹5,00,000
 * Surcharge: 10% (50L-1Cr), 15% (1Cr-2Cr), 25% (2Cr-5Cr), 37% (>5Cr).
 * Cess: 4%
 */
export function calculateOldRegimeTax(
  grossSalary: number,
  deductions: {
    professionalTax: number;
    hraExemption: number;
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    section80CCD2: number;
    homeLoanInterest: number;
    otherDeductions: number;
  },
): TaxCalculationBreakdown {
  const standardDeduction = 50000;
  const ptDeduction = Math.min(deductions.professionalTax, 2500);
  const capped80C = Math.min(Math.max(0, deductions.section80C), 150000);
  const capped80D = Math.min(Math.max(0, deductions.section80D), 100000);
  const capped80CCD1B = Math.min(Math.max(0, deductions.section80CCD1B), 50000);
  const cappedHomeLoan = Math.min(Math.max(0, deductions.homeLoanInterest), 200000);

  const totalDeductions =
    standardDeduction +
    ptDeduction +
    deductions.hraExemption +
    capped80C +
    capped80D +
    capped80CCD1B +
    deductions.section80CCD2 +
    cappedHomeLoan +
    deductions.otherDeductions;

  const taxableIncome = Math.max(0, Math.round(grossSalary - totalDeductions));

  let slabTax = 0;
  if (taxableIncome > 1000000) {
    slabTax += (taxableIncome - 1000000) * 0.3;
    slabTax += 500000 * 0.2; // 5L to 10L
    slabTax += 250000 * 0.05; // 2.5L to 5L
  } else if (taxableIncome > 500000) {
    slabTax += (taxableIncome - 500000) * 0.2;
    slabTax += 250000 * 0.05;
  } else if (taxableIncome > 250000) {
    slabTax += (taxableIncome - 250000) * 0.05;
  }

  slabTax = Math.round(slabTax);

  // Section 87A rebate for Old Regime
  let rebate87A = 0;
  let taxAfterRebate = slabTax;
  if (taxableIncome <= 500000) {
    rebate87A = Math.min(slabTax, 12500);
    taxAfterRebate = Math.max(0, slabTax - rebate87A);
  }

  // Surcharge
  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = 0.37;
  else if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.1;

  const surcharge = Math.round(taxAfterRebate * surchargeRate);
  const taxWithSurcharge = taxAfterRebate + surcharge;
  const healthAndEducationCess = Math.round(taxWithSurcharge * 0.04);
  const totalAnnualTax = taxWithSurcharge + healthAndEducationCess;
  const monthlyTDS = Math.round(totalAnnualTax / 12);
  const effectiveTaxRate = grossSalary > 0 ? (totalAnnualTax / grossSalary) * 100 : 0;

  return {
    regime: "old",
    grossSalary,
    standardDeduction,
    professionalTaxDeduction: ptDeduction,
    hraExemption: deductions.hraExemption,
    section80C: capped80C,
    section80D: capped80D,
    section80CCD1B: capped80CCD1B,
    section80CCD2: deductions.section80CCD2,
    homeLoanInterest: cappedHomeLoan,
    otherDeductions: deductions.otherDeductions,
    totalDeductions,
    taxableIncome,
    slabTax,
    rebate87A,
    taxAfterRebate,
    marginalRelief: 0,
    surcharge,
    healthAndEducationCess,
    totalAnnualTax,
    monthlyTDS,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
  };
}

/**
 * Master Calculation Function: CTC to In-Hand Salary Breakdown
 */
export function calculateSalaryBreakdown(inputs: SalaryCalculatorInputs): SalaryBreakdownResult {
  const warnings: string[] = [];
  const annualCTC = Math.max(0, inputs.annualCTC);
  const annualVariablePay = Math.min(annualCTC, Math.max(0, inputs.annualVariablePay));

  // Determine fixed compensation envelope from CTC
  // CTC = Fixed Gross + Employer PF + Gratuity + Employer ESI + Employer NPS + Other Benefits + Variable Pay
  // For standard estimation:
  let annualFixedGross = 0;
  let annualBasic = 0;
  let annualHRA = 0;
  let annualSpecialAllowance = 0;
  let annualEmployerPF = 0;
  let annualGratuityProvision = 0;
  let annualEmployerESI = 0;
  let annualEmployerNPS = 0;
  const annualOtherEmployerBenefits = Math.max(0, inputs.otherEmployerBenefits);

  const basicPct = Math.min(100, Math.max(10, inputs.basicPercentage || 50)) / 100;
  const hraPct = Math.min(100, Math.max(0, inputs.hraPercentage || 40)) / 100;

  if (inputs.structureType === "standard") {
    // In standard structure, we derive Gross Cash Salary by peeling off employer provisions
    // Let G = Annual Fixed Gross. Basic = G * basicPct.
    // Employer PF = (Basic <= 15000*12 ? Basic : 15000*12) * 0.12 (if capped), or Basic * 0.12.
    // Gratuity = Basic * (15 / (26*12)) ≈ Basic * 0.048077
    // CTC - Variable - Benefits = G + Employer PF(G) + Gratuity(G) + Employer NPS(G)
    // We solve for G iteratively or mathematically:
    const availablePool = Math.max(0, annualCTC - annualVariablePay - annualOtherEmployerBenefits);

    // Iterative convergence for exact integer rupee precision:
    let low = 0;
    let high = availablePool;
    let bestGross = availablePool;

    for (let iter = 0; iter < 40; iter++) {
      const mid = (low + high) / 2;
      const testBasic = mid * basicPct;
      const testMonthlyBasic = testBasic / 12;

      let testEmprPF = 0;
      if (inputs.includeEmployerPFInCTC) {
        const pfWage = inputs.pfCappedAtStatutoryCeiling ? Math.min(testMonthlyBasic, 15000) : testMonthlyBasic;
        testEmprPF = Math.round(pfWage * 0.12) * 12;
      }

      let testGratuity = 0;
      if (inputs.includeGratuityInCTC) {
        testGratuity = calculateGratuity(testBasic, inputs.gratuityOverride);
      }

      const testEmprNPS = inputs.employerNPSPercentage > 0 ? Math.round(testBasic * (inputs.employerNPSPercentage / 100)) : 0;

      // ESI check
      const testMonthlyGross = mid / 12;
      const testEmprESI = testMonthlyGross <= 21000 ? Math.round(testMonthlyGross * 0.0325) * 12 : 0;

      const totalCalculatedCTC = mid + testEmprPF + testGratuity + testEmprNPS + testEmprESI;

      if (Math.abs(totalCalculatedCTC - availablePool) < 1) {
        bestGross = mid;
        break;
      } else if (totalCalculatedCTC > availablePool) {
        high = mid;
      } else {
        low = mid;
        bestGross = mid;
      }
    }

    annualFixedGross = Math.round(bestGross);
    annualBasic = Math.round(annualFixedGross * basicPct);
    annualHRA = Math.round(annualBasic * hraPct);
    annualSpecialAllowance = Math.max(0, annualFixedGross - annualBasic - annualHRA);

    const monthlyBasic = annualBasic / 12;
    if (inputs.includeEmployerPFInCTC) {
      const pfBase = inputs.pfCappedAtStatutoryCeiling ? Math.min(monthlyBasic, 15000) : monthlyBasic;
      annualEmployerPF = Math.round(pfBase * 0.12) * 12;
    }

    if (inputs.includeGratuityInCTC) {
      annualGratuityProvision = calculateGratuity(annualBasic, inputs.gratuityOverride);
    }

    if (inputs.employerNPSPercentage > 0) {
      annualEmployerNPS = Math.round(annualBasic * (inputs.employerNPSPercentage / 100));
    }

    const monthlyGross = annualFixedGross / 12;
    if (monthlyGross <= 21000) {
      annualEmployerESI = Math.round(monthlyGross * 0.0325) * 12;
    }
  } else {
    // Custom structure: user specifies percentages
    const availablePool = Math.max(0, annualCTC - annualVariablePay - annualOtherEmployerBenefits);
    annualFixedGross = Math.round(availablePool * 0.88); // baseline estimate if custom
    annualBasic = Math.round(annualFixedGross * basicPct);
    annualHRA = Math.round(annualBasic * hraPct);
    annualSpecialAllowance = Math.max(0, annualFixedGross - annualBasic - annualHRA);

    const monthlyBasic = annualBasic / 12;
    if (inputs.includeEmployerPFInCTC) {
      const pfBase = inputs.pfCappedAtStatutoryCeiling ? Math.min(monthlyBasic, 15000) : monthlyBasic;
      annualEmployerPF = Math.round(pfBase * 0.12) * 12;
    }

    if (inputs.includeGratuityInCTC) {
      annualGratuityProvision = calculateGratuity(annualBasic, inputs.gratuityOverride);
    }

    if (inputs.employerNPSPercentage > 0) {
      annualEmployerNPS = Math.round(annualBasic * (inputs.employerNPSPercentage / 100));
    }
  }

  // Monthly conversions
  const monthlyFixedGross = Math.round(annualFixedGross / 12);
  const monthlyBasic = Math.round(annualBasic / 12);
  const monthlyHRA = Math.round(annualHRA / 12);
  const monthlySpecialAllowance = Math.max(0, monthlyFixedGross - monthlyBasic - monthlyHRA);
  const monthlyEmployerPF = Math.round(annualEmployerPF / 12);
  const monthlyGratuityProvision = Math.round(annualGratuityProvision / 12);
  const monthlyEmployerESI = Math.round(annualEmployerESI / 12);
  const monthlyEmployerNPS = Math.round(annualEmployerNPS / 12);

  const totalAnnualEmployerContributions =
    annualEmployerPF + annualGratuityProvision + annualEmployerESI + annualEmployerNPS + annualOtherEmployerBenefits;

  // Calculate Employee Deductions
  const { monthlyEmployeePF, monthlyVPF } = calculateEPF(
    monthlyBasic,
    inputs.pfCappedAtStatutoryCeiling,
    inputs.includeEmployeePF,
    inputs.vpfPercentage,
  );
  const annualEmployeePF = monthlyEmployeePF * 12;
  const annualVPF = monthlyVPF * 12;

  const { monthlyEmployeeESI } = calculateESI(monthlyFixedGross);
  const annualEmployeeESI = monthlyEmployeeESI * 12;

  const monthlyProfessionalTax = calculateProfessionalTax(inputs.state, monthlyFixedGross);
  const annualProfessionalTax = Math.round(monthlyProfessionalTax * 12);

  const monthlyOtherDeductions = Math.max(0, inputs.monthlyEmployeeInsurance + inputs.otherMonthlyDeductions);
  const annualOtherDeductions = monthlyOtherDeductions * 12;

  const totalMonthlyEmployeeStatutoryDeductions =
    monthlyEmployeePF + monthlyVPF + monthlyEmployeeESI + monthlyProfessionalTax + monthlyOtherDeductions;
  const totalAnnualEmployeeStatutoryDeductions = totalMonthlyEmployeeStatutoryDeductions * 12;

  // Calculate Taxes under both Regimes
  const hraExemption = calculateHRAExemption(
    annualBasic,
    annualHRA,
    inputs.monthlyRentPaid * 12,
    inputs.cityType,
  );

  // Auto-include employee PF in 80C under Old Regime
  const combined80C = Math.min(150000, annualEmployeePF + Math.max(0, inputs.section80C));

  const newRegimeComparison = calculateNewRegimeTax(annualFixedGross + annualVariablePay, annualEmployerNPS);
  const oldRegimeComparison = calculateOldRegimeTax(annualFixedGross + annualVariablePay, {
    professionalTax: annualProfessionalTax,
    hraExemption,
    section80C: combined80C,
    section80D: inputs.section80D,
    section80CCD1B: inputs.section80CCD1B,
    section80CCD2: annualEmployerNPS,
    homeLoanInterest: inputs.homeLoanInterest80EEA,
    otherDeductions: inputs.otherTaxDeductions,
  });

  const activeRegime = inputs.regime;
  const taxBreakdown = activeRegime === "new" ? newRegimeComparison : oldRegimeComparison;

  // Monthly and Annual In-Hand Salary
  const monthlyInHand = Math.max(
    0,
    monthlyFixedGross - totalMonthlyEmployeeStatutoryDeductions - taxBreakdown.monthlyTDS,
  );
  const annualInHand = monthlyInHand * 12;

  // Net Variable Pay: if variable pay is received, it attracts tax at the employee's marginal rate
  const marginalTaxRate = taxBreakdown.effectiveTaxRate / 100;
  const annualNetVariablePay = Math.round(annualVariablePay * (1 - marginalTaxRate));
  const totalAnnualInHandWithBonus = annualInHand + annualNetVariablePay;

  // Regime Recommendation
  const taxDifferenceAnnual = Math.round(oldRegimeComparison.totalAnnualTax - newRegimeComparison.totalAnnualTax);
  const inHandDifferenceMonthly = Math.round((oldRegimeComparison.monthlyTDS - newRegimeComparison.monthlyTDS));
  const recommendedRegime: TaxRegime =
    newRegimeComparison.totalAnnualTax <= oldRegimeComparison.totalAnnualTax ? "new" : "old";

  // Reconciliation Check
  const accountedCTC =
    annualFixedGross +
    totalAnnualEmployerContributions +
    annualVariablePay;
  const reconciliationDifference = Math.round(annualCTC - accountedCTC);
  const reconciliationCheckPassed = Math.abs(reconciliationDifference) <= 2;

  if (annualCTC <= 0) {
    warnings.push("Please enter a valid Annual CTC greater than zero.");
  }
  if (!reconciliationCheckPassed && annualCTC > 0) {
    warnings.push(
      `CTC component discrepancy of ₹${Math.abs(reconciliationDifference).toLocaleString("en-IN")}. Adjusting special allowance.`,
    );
  }

  return {
    annualCTC,
    annualFixedGross,
    monthlyFixedGross,
    annualVariablePay,
    annualBasic,
    monthlyBasic,
    annualHRA,
    monthlyHRA,
    annualSpecialAllowance,
    monthlySpecialAllowance,
    annualEmployerPF,
    monthlyEmployerPF,
    annualGratuityProvision,
    monthlyGratuityProvision,
    annualEmployerESI,
    monthlyEmployerESI,
    annualEmployerNPS,
    monthlyEmployerNPS,
    annualOtherEmployerBenefits,
    totalAnnualEmployerContributions,
    annualEmployeePF,
    monthlyEmployeePF,
    annualVPF,
    monthlyVPF,
    annualEmployeeESI,
    monthlyEmployeeESI,
    annualProfessionalTax,
    monthlyProfessionalTax,
    annualOtherDeductions,
    monthlyOtherDeductions,
    totalAnnualEmployeeStatutoryDeductions,
    totalMonthlyEmployeeStatutoryDeductions,
    activeRegime,
    taxBreakdown,
    newRegimeComparison,
    oldRegimeComparison,
    taxDifferenceAnnual,
    inHandDifferenceMonthly,
    recommendedRegime,
    monthlyInHand,
    annualInHand,
    annualNetVariablePay,
    totalAnnualInHandWithBonus,
    warnings,
    reconciliationCheckPassed,
    reconciliationDifference,
  };
}

/**
 * Format currency amount with the Indian Rupee symbol (₹) and Indian comma system.
 * e.g. ₹12,00,000 or ₹45,500
 */
export function formatINR(val: number, decimals = 0): string {
  if (isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val);
}

