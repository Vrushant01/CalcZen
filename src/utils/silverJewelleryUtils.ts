/**
 * CalcZen Silver Jewellery Bill Calculator Utilities (India)
 * Bureau of Indian Standards (BIS) IS 2112:2025 Hallmarking Fineness & Silver Standards
 * CBIC GST Notification No. 1/2017-Central Tax (Rate) - HSN 7113 (3% on finished retail jewellery)
 */

export type SilverPurity =
  | "999"
  | "990"
  | "970"
  | "958"
  | "925"
  | "900"
  | "835"
  | "800"
  | "custom";

export interface SilverPurityConfig {
  key: SilverPurity;
  fineness: number; // e.g. 925
  percentage: number; // 92.5
  label: string;
  shortLabel: string;
  hallmarkCode: string;
  description: string;
}

export const BIS_SILVER_PURITY_OPTIONS: Record<SilverPurity, SilverPurityConfig> = {
  "925": {
    key: "925",
    fineness: 925,
    percentage: 92.5,
    label: "925 Silver (Sterling)",
    shortLabel: "925 Silver",
    hallmarkCode: "925",
    description: "925 silver contains approximately 92.5% silver.",
  },
  "999": {
    key: "999",
    fineness: 999,
    percentage: 99.9,
    label: "999 Silver (Pure)",
    shortLabel: "999 Silver",
    hallmarkCode: "999",
    description: "999 silver contains approximately 99.9% pure silver.",
  },
  "990": {
    key: "990",
    fineness: 990,
    percentage: 99.0,
    label: "990 Silver",
    shortLabel: "990 Silver",
    hallmarkCode: "990",
    description: "990 silver contains approximately 99% silver.",
  },
  "970": {
    key: "970",
    fineness: 970,
    percentage: 97.0,
    label: "970 Silver",
    shortLabel: "970 Silver",
    hallmarkCode: "970",
    description: "970 silver contains approximately 97% silver.",
  },
  "958": {
    key: "958",
    fineness: 958,
    percentage: 95.8,
    label: "958 Silver",
    shortLabel: "958 Silver",
    hallmarkCode: "958",
    description: "958 silver contains approximately 95.8% silver.",
  },
  "900": {
    key: "900",
    fineness: 900,
    percentage: 90.0,
    label: "900 Silver",
    shortLabel: "900 Silver",
    hallmarkCode: "900",
    description: "900 silver contains approximately 90% silver.",
  },
  "835": {
    key: "835",
    fineness: 835,
    percentage: 83.5,
    label: "835 Silver",
    shortLabel: "835 Silver",
    hallmarkCode: "835",
    description: "835 silver contains approximately 83.5% silver.",
  },
  "800": {
    key: "800",
    fineness: 800,
    percentage: 80.0,
    label: "800 Silver",
    shortLabel: "800 Silver",
    hallmarkCode: "800",
    description: "800 silver contains approximately 80% silver.",
  },
  custom: {
    key: "custom",
    fineness: 925,
    percentage: 92.5,
    label: "Custom",
    shortLabel: "Custom",
    hallmarkCode: "Custom",
    description: "Custom fineness (1 to 1000).",
  },
};

export const SILVER_PURITY_ORDER: SilverPurity[] = [
  "800",
  "835",
  "900",
  "925",
  "958",
  "970",
  "990",
  "999",
  "custom",
];

export type RateBasis = "selected_purity" | "999";
export type MakingChargeMethod = "percentage" | "per_gram" | "fixed";
export type DiscountType = "none" | "percentage" | "fixed";

export interface SilverBillInputs {
  // Weight details
  weightMode: "net" | "gross_stone";
  netWeight: number; // in grams
  grossWeight: number; // in grams
  nonSilverWeight: number; // in grams

  // Purity details
  purity: SilverPurity;
  customFineness?: number; // 1 to 1000

  // Rate details
  rate: number; // ₹ per gram
  rateBasis: RateBasis; // "selected_purity" or "999"

  // Making charges
  makingChargeMethod: MakingChargeMethod;
  makingChargePercentage: number; // e.g. 10 for 10%
  makingChargePerGram: number; // e.g. 15 for ₹15/g
  fixedMakingCharge: number; // e.g. 300 for ₹300

  // Optional Advanced options
  discountType: DiscountType;
  discountValue: number; // percentage or fixed amount
  otherCharges: number; // ₹ (packaging, certification, delivery, etc.)

  // GST
  gstEnabled: boolean;
  gstRate: number; // default 3%
}

export interface SilverBillResult {
  // Weights
  netWeight: number;
  grossWeight: number;
  nonSilverWeight: number;

  // Purity
  fineness: number;
  percentage: number;
  purityDisplay: string;
  hallmarkCode: string;

  // Rates
  enteredRate: number;
  rateBasis: RateBasis;
  effectiveRatePerGram: number;

  // Monetary components (unrounded for calculation, rounded for display)
  silverMetalValue: number;
  makingCharges: number;
  otherCharges: number;
  subtotalBeforeDiscount: number;
  discountAmount: number;
  taxableValue: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  finalBillAmount: number;

  // Formatted display strings
  formattedNetWeight: string;
  formattedEffectiveRate: string;
  formattedSilverValue: string;
  formattedMakingCharges: string;
  formattedOtherCharges: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTaxableValue: string;
  formattedGstAmount: string;
  formattedFinalBill: string;

  // Explanation and calculation notes
  explanation: string;
}

export interface SilverValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Rounds a number to a specified decimal places.
 */
export function roundTo(val: number, decimals: number = 2): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

/**
 * Formats a number into Indian Rupee currency format (₹).
 */
export function formatINR(val: number, forceDecimals: boolean = false): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  const absVal = Math.abs(val);

  // If forceDecimals is false, show decimals only if number has fractional paise
  const hasFraction = Math.abs(val - Math.round(val)) > 0.0001;
  const showDecimals = forceDecimals || hasFraction;

  const formatted = absVal.toLocaleString("en-IN", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return val < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

/**
 * Validates inputs for the Silver Jewellery Bill Calculator.
 */
export function validateSilverJewelleryInputs(inputs: SilverBillInputs): SilverValidation {
  const errors: Record<string, string> = {};

  if (inputs.weightMode === "net") {
    if (inputs.netWeight === undefined || isNaN(inputs.netWeight) || inputs.netWeight <= 0) {
      errors.netWeight = "Silver jewellery weight must be greater than 0.";
    }
  } else {
    if (inputs.grossWeight === undefined || isNaN(inputs.grossWeight) || inputs.grossWeight <= 0) {
      errors.grossWeight = "Gross weight must be greater than 0.";
    }
    if (inputs.nonSilverWeight < 0) {
      errors.nonSilverWeight = "Non-silver weight cannot be negative.";
    }
    if (inputs.grossWeight > 0 && inputs.nonSilverWeight >= inputs.grossWeight) {
      errors.nonSilverWeight = "Non-silver weight must be strictly less than gross weight.";
    }
  }

  if (inputs.rate === undefined || isNaN(inputs.rate) || inputs.rate <= 0) {
    errors.rate = "Silver rate must be greater than 0.";
  }

  if (inputs.purity === "custom") {
    const fineness = inputs.customFineness;
    if (fineness === undefined || isNaN(fineness) || fineness < 1 || fineness > 1000) {
      errors.customFineness = "Custom fineness must be between 1 and 1000.";
    }
  }

  if (inputs.makingChargeMethod === "percentage" && inputs.makingChargePercentage < 0) {
    errors.makingCharges = "Making charge percentage cannot be negative.";
  }
  if (inputs.makingChargeMethod === "per_gram" && inputs.makingChargePerGram < 0) {
    errors.makingCharges = "Making charge per gram cannot be negative.";
  }
  if (inputs.makingChargeMethod === "fixed" && inputs.fixedMakingCharge < 0) {
    errors.makingCharges = "Fixed making charge cannot be negative.";
  }

  if (inputs.otherCharges < 0) {
    errors.otherCharges = "Other charges cannot be negative.";
  }

  if (inputs.discountValue < 0) {
    errors.discount = "Discount cannot be negative.";
  }

  if (inputs.gstRate < 0) {
    errors.gstRate = "GST rate cannot be negative.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Core mathematical engine for the Silver Jewellery Bill Calculator.
 * Strictly adheres to Indian bullion and jewellery retail pricing rules.
 */
export function calculateSilverJewelleryBill(inputs: SilverBillInputs): SilverBillResult {
  // 1. Resolve Net Silver Weight (in grams)
  let netWeight = 0;
  let grossWeight = 0;
  let nonSilverWeight = 0;

  if (inputs.weightMode === "gross_stone") {
    grossWeight = Math.max(0, inputs.grossWeight || 0);
    nonSilverWeight = Math.max(0, inputs.nonSilverWeight || 0);
    netWeight = Math.max(0, grossWeight - nonSilverWeight);
  } else {
    netWeight = Math.max(0, inputs.netWeight || 0);
    grossWeight = netWeight;
    nonSilverWeight = 0;
  }

  // 2. Resolve Fineness and Purity
  let fineness = 925;
  let percentage = 92.5;
  let purityDisplay = "925 (Sterling)";
  let hallmarkCode = "925";

  if (inputs.purity === "custom") {
    const customFineness = Math.min(1000, Math.max(1, inputs.customFineness || 925));
    fineness = customFineness;
    percentage = roundTo((customFineness / 1000) * 100, 2);
    purityDisplay = `${customFineness} Fineness`;
    hallmarkCode = `${customFineness}`;
  } else {
    const config = BIS_SILVER_PURITY_OPTIONS[inputs.purity] || BIS_SILVER_PURITY_OPTIONS["925"];
    fineness = config.fineness;
    percentage = config.percentage;
    purityDisplay = config.shortLabel;
    hallmarkCode = config.hallmarkCode;
  }

  // 3. Resolve Effective Rate per Gram
  const rawRate = Math.max(0, inputs.rate || 0);
  let effectiveRatePerGram = 0;

  if (inputs.rateBasis === "999") {
    // Equivalent Rate = 999 Rate × (Selected Fineness / 999)
    effectiveRatePerGram = rawRate * (fineness / 999);
  } else {
    // Entered rate is specifically for the selected purity (e.g. 925 silver rate)
    effectiveRatePerGram = rawRate;
  }

  // 4. Calculate Silver Metal Value
  const silverMetalValue = netWeight * effectiveRatePerGram;

  // 5. Calculate Making Charges
  let makingCharges = 0;
  if (inputs.makingChargeMethod === "percentage") {
    const pct = Math.max(0, inputs.makingChargePercentage || 0);
    makingCharges = (silverMetalValue * pct) / 100;
  } else if (inputs.makingChargeMethod === "per_gram") {
    const perGramRate = Math.max(0, inputs.makingChargePerGram || 0);
    makingCharges = netWeight * perGramRate;
  } else {
    makingCharges = Math.max(0, inputs.fixedMakingCharge || 0);
  }

  // 6. Subtotal before discount (Metal Value + Making Charges + Other Charges)
  const otherCharges = Math.max(0, inputs.otherCharges || 0);
  const eligibleDiscountBase = silverMetalValue + makingCharges;
  const subtotalBeforeDiscount = eligibleDiscountBase + otherCharges;

  // 7. Calculate Discount
  let discountAmount = 0;
  if (inputs.discountType === "percentage") {
    const discPct = Math.min(100, Math.max(0, inputs.discountValue || 0));
    discountAmount = (eligibleDiscountBase * discPct) / 100;
  } else if (inputs.discountType === "fixed") {
    discountAmount = Math.max(0, inputs.discountValue || 0);
  }

  // Capped so discount cannot exceed subtotal
  discountAmount = Math.min(subtotalBeforeDiscount, discountAmount);

  // 8. Taxable Value
  const taxableValue = Math.max(0, subtotalBeforeDiscount - discountAmount);

  // 9. GST Calculation
  const activeGstRate = inputs.gstEnabled ? Math.max(0, inputs.gstRate || 0) : 0;
  const gstAmount = (taxableValue * activeGstRate) / 100;
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  // 10. Final Bill Amount
  const finalBillAmount = taxableValue + gstAmount;

  // 11. Explanation Summary
  let explanation = "";
  if (inputs.rateBasis === "999") {
    explanation = `${roundTo(netWeight, 3)}g of ${purityDisplay} silver at ₹${roundTo(
      effectiveRatePerGram,
      2
    )}/g (converted from pure 999 rate of ₹${rawRate}/g) gives a silver metal value of ${formatINR(
      roundTo(silverMetalValue, 2)
    )}.`;
  } else {
    explanation = `${roundTo(netWeight, 3)}g of ${purityDisplay} silver at ₹${rawRate}/g gives a silver metal value of ${formatINR(
      roundTo(silverMetalValue, 2)
    )}.`;
  }

  if (makingCharges > 0) {
    explanation += ` Making charges add ${formatINR(roundTo(makingCharges, 2))}.`;
  }
  if (otherCharges > 0) {
    explanation += ` Other charges add ${formatINR(roundTo(otherCharges, 2))}.`;
  }
  if (discountAmount > 0) {
    explanation += ` A discount of ${formatINR(roundTo(discountAmount, 2))} is deducted.`;
  }

  if (inputs.gstEnabled && gstAmount > 0) {
    explanation += ` Taxable value is ${formatINR(roundTo(taxableValue, 2))}. With ${activeGstRate}% GST (${formatINR(
      roundTo(gstAmount, 2)
    )}), the final estimated bill is ${formatINR(roundTo(finalBillAmount, 2))}.`;
  } else {
    explanation += ` Taxable amount is ${formatINR(
      roundTo(taxableValue, 2)
    )} (GST excluded). Total estimated bill is ${formatINR(roundTo(finalBillAmount, 2))}.`;
  }

  return {
    netWeight: roundTo(netWeight, 3),
    grossWeight: roundTo(grossWeight, 3),
    nonSilverWeight: roundTo(nonSilverWeight, 3),

    fineness,
    percentage,
    purityDisplay,
    hallmarkCode,

    enteredRate: rawRate,
    rateBasis: inputs.rateBasis,
    effectiveRatePerGram,

    silverMetalValue,
    makingCharges,
    otherCharges,
    subtotalBeforeDiscount,
    discountAmount,
    taxableValue,
    gstAmount,
    cgstAmount,
    sgstAmount,
    finalBillAmount,

    formattedNetWeight: `${roundTo(netWeight, 3)} g`,
    formattedEffectiveRate: formatINR(roundTo(effectiveRatePerGram, 2)),
    formattedSilverValue: formatINR(roundTo(silverMetalValue, 2)),
    formattedMakingCharges: formatINR(roundTo(makingCharges, 2)),
    formattedOtherCharges: formatINR(roundTo(otherCharges, 2)),
    formattedSubtotal: formatINR(roundTo(subtotalBeforeDiscount, 2)),
    formattedDiscount: formatINR(roundTo(discountAmount, 2)),
    formattedTaxableValue: formatINR(roundTo(taxableValue, 2)),
    formattedGstAmount: formatINR(roundTo(gstAmount, 2)),
    formattedFinalBill: formatINR(roundTo(finalBillAmount, 2)),

    explanation,
  };
}

