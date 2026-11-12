/**
 * CalcZen Jewellery Budget to Weight Calculator Utilities (India)
 * Real-world Indian jewellery pricing practices:
 * - Bureau of Indian Standards (BIS) Gold (IS 1417) and Silver (IS 2112) Fineness Standards
 * - Central Board of Indirect Taxes and Customs (CBIC) finished retail jewellery GST (3% under HSN 7113)
 * - Reverse mathematical solver with 100% budget safety guarantee (Final Price <= Available Budget)
 */

export type MetalType = "gold" | "silver";

export type GoldPurityKey =
  | "24k-999"
  | "24k-995"
  | "23k-958"
  | "22k-916"
  | "20k-833"
  | "18k-750";

export type SilverPurityKey =
  | "999"
  | "990"
  | "970"
  | "958"
  | "925"
  | "900"
  | "835"
  | "800";

export interface PurityOption {
  key: string;
  label: string;
  shortLabel: string;
  fineness: number; // parts per thousand e.g. 916 for 22K
  fraction: number; // 0.916
  description: string;
}

export const GOLD_PURITIES: Record<GoldPurityKey, PurityOption> = {
  "22k-916": {
    key: "22k-916",
    label: "22K (916 Hallmark - 91.6% Gold)",
    shortLabel: "22K (916)",
    fineness: 916,
    fraction: 0.916,
    description: "22K gold contains approximately 91.6% pure gold.",
  },
  "24k-999": {
    key: "24k-999",
    label: "24K (999 Fineness - 99.9% Pure Bullion)",
    shortLabel: "24K (999)",
    fineness: 999,
    fraction: 0.999,
    description: "24K pure bullion gold coins and bars.",
  },
  "24k-995": {
    key: "24k-995",
    label: "24K (995 Fineness - Standard Bullion)",
    shortLabel: "24K (995)",
    fineness: 995,
    fraction: 0.995,
    description: "Standard Indian bullion gold bars.",
  },
  "23k-958": {
    key: "23k-958",
    label: "23K (958 Hallmark - 95.8% Gold)",
    shortLabel: "23K (958)",
    fineness: 958,
    fraction: 0.958,
    description: "High-purity heritage and temple jewellery.",
  },
  "20k-833": {
    key: "20k-833",
    label: "20K (833 Hallmark - 83.3% Gold)",
    shortLabel: "20K (833)",
    fineness: 833,
    fraction: 0.833,
    description: "Regional and vintage Indian jewellery.",
  },
  "18k-750": {
    key: "18k-750",
    label: "18K (750 Hallmark - 75.0% Gold)",
    shortLabel: "18K (750)",
    fineness: 750,
    fraction: 0.75,
    description: "Diamond jewellery and modern lightweight ornaments.",
  },
};

export const SILVER_PURITIES: Record<SilverPurityKey, PurityOption> = {
  "925": {
    key: "925",
    label: "925 Silver (Sterling Silver - 92.5%)",
    shortLabel: "925 Silver",
    fineness: 925,
    fraction: 0.925,
    description: "925 silver contains approximately 92.5% silver.",
  },
  "999": {
    key: "999",
    label: "999 Silver (Pure Silver - 99.9%)",
    shortLabel: "999 Silver",
    fineness: 999,
    fraction: 0.999,
    description: "999 pure silver bullion coins and bars.",
  },
  "990": {
    key: "990",
    label: "990 Silver (99.0% Fine)",
    shortLabel: "990 Silver",
    fineness: 990,
    fraction: 0.99,
    description: "990 silver contains 99.0% fine silver.",
  },
  "970": {
    key: "970",
    label: "970 Silver (97.0% Fine)",
    shortLabel: "970 Silver",
    fineness: 970,
    fraction: 0.97,
    description: "970 silver contains 97.0% fine silver.",
  },
  "958": {
    key: "958",
    label: "958 Silver (Britannia - 95.8%)",
    shortLabel: "958 Silver",
    fineness: 958,
    fraction: 0.958,
    description: "Britannia standard silver tableware and coins.",
  },
  "900": {
    key: "900",
    label: "900 Silver (Coin Silver - 90.0%)",
    shortLabel: "900 Silver",
    fineness: 900,
    fraction: 0.9,
    description: "Traditional heavy silverware and regional ornaments.",
  },
  "835": {
    key: "835",
    label: "835 Silver (83.5% Fine)",
    shortLabel: "835 Silver",
    fineness: 835,
    fraction: 0.835,
    description: "Continental silver standard.",
  },
  "800": {
    key: "800",
    label: "800 Silver (80.0% Fine)",
    shortLabel: "800 Silver",
    fineness: 800,
    fraction: 0.8,
    description: "Minimum hallmarking standard for silver articles in India.",
  },
};

export type RateBasis = "selected_purity" | "24k_or_999";
export type MakingChargeMethod = "percentage" | "per_gram" | "fixed";
export type WastageMethod = "percentage" | "fixed" | "none";
export type DiscountMethod = "percentage" | "fixed" | "none";

export interface JewelleryBudgetInputs {
  // 1. Budget & Allocation
  totalBudget: number; // in ₹ e.g. 50000
  reservedAmount: number; // in ₹ e.g. 2000

  // 2. Metal & Purity
  metalType: MetalType; // "gold" | "silver"
  goldPurity: GoldPurityKey;
  silverPurity: SilverPurityKey;
  rateBasis: RateBasis;
  metalRate: number; // ₹ per gram

  // 3. Making Charges
  makingMethod: MakingChargeMethod;
  makingValue: number; // % (e.g. 10) or ₹/g (e.g. 500) or fixed ₹ (e.g. 2000)

  // 4. Advanced / Collapsible options
  wastageMethod: WastageMethod;
  wastageValue: number; // % or fixed ₹
  gstRate: number; // % default 3
  discountMethod: DiscountMethod;
  discountValue: number; // % or fixed ₹
  otherCharges: number; // fixed ₹ (stone charges, labour, hallmark fee)
}

export interface PriceBreakdownForWeight {
  weightGrams: number;
  applicableRatePerGram: number;
  metalValue: number;
  makingCharges: number;
  wastageValue: number;
  otherCharges: number;
  subtotalBeforeDiscount: number;
  discountAmount: number;
  taxableSubtotal: number;
  gstAmount: number;
  finalPrice: number;
  remainingBudget: number;
}

export interface BudgetToWeightResult {
  totalBudget: number;
  reservedAmount: number;
  availableBudget: number;
  metalType: MetalType;
  purityLabel: string;
  applicableRatePerGram: number;
  maxAffordableWeight: number; // Safe weight in grams
  breakdown: PriceBreakdownForWeight;

  // Formatted strings
  formattedTotalBudget: string;
  formattedAvailableBudget: string;
  formattedWeight: string;
  formattedRate: string;
  formattedMetalValue: string;
  formattedMakingCharges: string;
  formattedWastage: string;
  formattedDiscount: string;
  formattedTaxableSubtotal: string;
  formattedGst: string;
  formattedFinalPrice: string;
  formattedRemainingBudget: string;
}

export interface BudgetValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function formatWeight(val: number, decimals: number = 3): string {
  if (isNaN(val) || !isFinite(val) || val <= 0) return "0.000 g";
  return `${val.toFixed(decimals)} g`;
}

/**
 * Determine Applicable Rate per Gram based on Purity and Rate Basis
 */
export function getApplicableRate(inputs: JewelleryBudgetInputs): {
  applicableRate: number;
  purityLabel: string;
  finenessFraction: number;
} {
  const metalRate = Math.max(0, inputs.metalRate || 0);

  if (inputs.metalType === "gold") {
    const p = GOLD_PURITIES[inputs.goldPurity] || GOLD_PURITIES["22k-916"];
    if (inputs.rateBasis === "24k_or_999") {
      const applicableRate = metalRate * p.fraction;
      return { applicableRate, purityLabel: p.label, finenessFraction: p.fraction };
    }
    return { applicableRate: metalRate, purityLabel: p.label, finenessFraction: p.fraction };
  } else {
    const p = SILVER_PURITIES[inputs.silverPurity] || SILVER_PURITIES["925"];
    if (inputs.rateBasis === "24k_or_999") {
      const applicableRate = metalRate * p.fraction;
      return { applicableRate, purityLabel: p.label, finenessFraction: p.fraction };
    }
    return { applicableRate: metalRate, purityLabel: p.label, finenessFraction: p.fraction };
  }
}

/**
 * Forward Price Calculator for a given physical weight
 */
export function calculatePriceForWeight(
  weightGrams: number,
  inputs: JewelleryBudgetInputs
): PriceBreakdownForWeight {
  const W = Math.max(0, weightGrams);
  const { applicableRate } = getApplicableRate(inputs);
  const availableBudget = Math.max(0, (inputs.totalBudget || 0) - (inputs.reservedAmount || 0));

  // 1. Metal Value
  const metalValue = W * applicableRate;

  // 2. Making Charges
  let makingCharges = 0;
  if (inputs.makingMethod === "percentage") {
    makingCharges = (metalValue * Math.max(0, inputs.makingValue || 0)) / 100;
  } else if (inputs.makingMethod === "per_gram") {
    makingCharges = W * Math.max(0, inputs.makingValue || 0);
  } else if (inputs.makingMethod === "fixed") {
    makingCharges = Math.max(0, inputs.makingValue || 0);
  }

  // 3. Wastage Charges
  let wastageValue = 0;
  if (inputs.wastageMethod === "percentage") {
    wastageValue = (metalValue * Math.max(0, inputs.wastageValue || 0)) / 100;
  } else if (inputs.wastageMethod === "fixed") {
    wastageValue = Math.max(0, inputs.wastageValue || 0);
  }

  // 4. Other Charges
  const otherCharges = Math.max(0, inputs.otherCharges || 0);

  // 5. Subtotal before discount
  const subtotalBeforeDiscount = metalValue + makingCharges + wastageValue + otherCharges;

  // 6. Discount (applied before tax on eligible subtotal)
  let discountAmount = 0;
  if (inputs.discountMethod === "percentage") {
    discountAmount = (subtotalBeforeDiscount * Math.max(0, inputs.discountValue || 0)) / 100;
  } else if (inputs.discountMethod === "fixed") {
    discountAmount = Math.max(0, inputs.discountValue || 0);
  }
  discountAmount = Math.min(subtotalBeforeDiscount, discountAmount);

  // 7. Taxable Value
  const taxableSubtotal = Math.max(0, subtotalBeforeDiscount - discountAmount);

  // 8. GST (statutory 3% on finished jewellery under HSN 7113)
  const gstRate = Math.max(0, inputs.gstRate || 0);
  const gstAmount = (taxableSubtotal * gstRate) / 100;

  // 9. Final Price
  const finalPrice = taxableSubtotal + gstAmount;
  const remainingBudget = Math.max(0, availableBudget - finalPrice);

  return {
    weightGrams: W,
    applicableRatePerGram: applicableRate,
    metalValue,
    makingCharges,
    wastageValue,
    otherCharges,
    subtotalBeforeDiscount,
    discountAmount,
    taxableSubtotal,
    gstAmount,
    finalPrice,
    remainingBudget,
  };
}

/**
 * Validate Inputs
 */
export function validateBudgetInputs(inputs: JewelleryBudgetInputs): BudgetValidation {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (!inputs.totalBudget || inputs.totalBudget <= 0) {
    errors.totalBudget = "Please enter your budget amount greater than ₹0.";
  }

  if (inputs.reservedAmount < 0) {
    errors.reservedAmount = "Reserved amount cannot be negative.";
  } else if (inputs.reservedAmount >= inputs.totalBudget) {
    errors.reservedAmount = "Reserved amount must be strictly less than your total budget.";
  }

  if (!inputs.metalRate || inputs.metalRate <= 0) {
    errors.metalRate = "Please enter today's metal rate per gram.";
  }

  if (inputs.makingValue < 0) {
    errors.makingValue = "Making charges cannot be negative.";
  }

  if (inputs.wastageValue < 0) {
    errors.wastageValue = "Wastage charges cannot be negative.";
  }

  if (inputs.gstRate < 0 || inputs.gstRate > 28) {
    errors.gstRate = "GST rate must be between 0% and 28%.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Core Reverse Calculation Engine:
 * Solves for the maximum weight W such that Final Price(W) <= Available Budget.
 * Includes a 100% Budget Safety Guarantee step:
 * Tests the rounded weight; if Price(Rounded W) > Available Budget, safely steps down.
 */
export function calculateBudgetToWeight(
  inputs: JewelleryBudgetInputs,
  displayDecimals: number = 3
): BudgetToWeightResult {
  const totalBudget = Math.max(0, inputs.totalBudget || 0);
  const reservedAmount = Math.max(0, inputs.reservedAmount || 0);
  const availableBudget = Math.max(0, totalBudget - reservedAmount);

  const { applicableRate, purityLabel } = getApplicableRate(inputs);

  if (availableBudget <= 0 || applicableRate <= 0) {
    const zeroBreakdown = calculatePriceForWeight(0, inputs);
    return {
      totalBudget,
      reservedAmount,
      availableBudget,
      metalType: inputs.metalType,
      purityLabel,
      applicableRatePerGram: applicableRate,
      maxAffordableWeight: 0,
      breakdown: zeroBreakdown,
      formattedTotalBudget: formatINR(totalBudget),
      formattedAvailableBudget: formatINR(availableBudget),
      formattedWeight: "0.000 g",
      formattedRate: `₹${Math.round(applicableRate).toLocaleString("en-IN")}`,
      formattedMetalValue: "₹0",
      formattedMakingCharges: "₹0",
      formattedWastage: "₹0",
      formattedDiscount: "₹0",
      formattedTaxableSubtotal: "₹0",
      formattedGst: "₹0",
      formattedFinalPrice: "₹0",
      formattedRemainingBudget: formatINR(availableBudget),
    };
  }

  // Binary search for high-precision unrounded weight
  let low = 0;
  let high = (availableBudget / applicableRate) * 2; // generous upper bound
  const epsilon = 0.000001; // precision in grams

  for (let iter = 0; iter < 80; iter++) {
    const mid = (low + high) / 2;
    const price = calculatePriceForWeight(mid, inputs).finalPrice;

    if (price <= availableBudget) {
      low = mid;
    } else {
      high = mid;
    }

    if (high - low < epsilon) break;
  }

  let unroundedWeight = low;

  // Precision step for safe rounding (e.g. 0.001 for 3 decimals, 0.0001 for 4 decimals)
  const precisionStep = Math.pow(10, -displayDecimals);
  // Initial display rounded weight (truncated/rounded)
  let safeWeight = Math.floor(unroundedWeight / precisionStep) * precisionStep;

  // Budget Safety Guard: Verify that Price(safeWeight) <= availableBudget
  let finalBreakdown = calculatePriceForWeight(safeWeight, inputs);
  while (finalBreakdown.finalPrice > availableBudget && safeWeight > 0) {
    safeWeight = Math.max(0, safeWeight - precisionStep);
    finalBreakdown = calculatePriceForWeight(safeWeight, inputs);
  }

  return {
    totalBudget,
    reservedAmount,
    availableBudget,
    metalType: inputs.metalType,
    purityLabel,
    applicableRatePerGram: applicableRate,
    maxAffordableWeight: safeWeight,
    breakdown: finalBreakdown,

    formattedTotalBudget: formatINR(totalBudget),
    formattedAvailableBudget: formatINR(availableBudget),
    formattedWeight: formatWeight(safeWeight, displayDecimals),
    formattedRate: `₹${Math.round(applicableRate).toLocaleString("en-IN")}`,
    formattedMetalValue: formatINR(finalBreakdown.metalValue),
    formattedMakingCharges: formatINR(finalBreakdown.makingCharges),
    formattedWastage: formatINR(finalBreakdown.wastageValue),
    formattedDiscount: formatINR(finalBreakdown.discountAmount),
    formattedTaxableSubtotal: formatINR(finalBreakdown.taxableSubtotal),
    formattedGst: formatINR(finalBreakdown.gstAmount),
    formattedFinalPrice: formatINR(finalBreakdown.finalPrice),
    formattedRemainingBudget: formatINR(finalBreakdown.remainingBudget),
  };
}

