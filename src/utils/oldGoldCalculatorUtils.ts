/**
 * CalcZen Old Gold Exchange Value Calculator Utilities (India)
 * Bureau of Indian Standards (BIS) Hallmarking Fineness & Karat System
 * Real-world Indian jewellery trade exchange & resale calculation rules.
 */

export type GoldPurity =
  | "24k-999"
  | "24k-995"
  | "23k-958"
  | "22k-916"
  | "20k-833"
  | "18k-750"
  | "14k-585"
  | "9k-375"
  | "custom";

export interface PurityConfig {
  key: GoldPurity;
  karat: number;
  finenessPerThousand: number; // e.g. 916 for 22K
  finenessFraction: number; // 0.916
  label: string;
  shortLabel: string;
  hallmarkCode: string;
  description: string;
}

export const OLD_GOLD_PURITY_OPTIONS: Record<GoldPurity, PurityConfig> = {
  "22k-916": {
    key: "22k-916",
    karat: 22,
    finenessPerThousand: 916,
    finenessFraction: 0.916,
    label: "22K (916 Hallmark - 91.6% Pure Gold)",
    shortLabel: "22K (916)",
    hallmarkCode: "916",
    description: "Standard Indian gold jewellery (most bridal and daily wear items)",
  },
  "24k-999": {
    key: "24k-999",
    karat: 24,
    finenessPerThousand: 999,
    finenessFraction: 0.999,
    label: "24K (999 Fineness - 99.9% Pure Bullion)",
    shortLabel: "24K (999)",
    hallmarkCode: "999",
    description: "Minted gold coins, bars, and pure bullion",
  },
  "24k-995": {
    key: "24k-995",
    karat: 24,
    finenessPerThousand: 995,
    finenessFraction: 0.995,
    label: "24K (995 Fineness - Standard Bullion)",
    shortLabel: "24K (995)",
    hallmarkCode: "995",
    description: "Standard Indian bullion trade gold bars",
  },
  "23k-958": {
    key: "23k-958",
    karat: 23,
    finenessPerThousand: 958,
    finenessFraction: 0.958,
    label: "23K (958 Fineness - Traditional Gold)",
    shortLabel: "23K (958)",
    hallmarkCode: "958",
    description: "Traditional temple, handcrafted heritage ornaments",
  },
  "20k-833": {
    key: "20k-833",
    karat: 20,
    finenessPerThousand: 833,
    finenessFraction: 0.833,
    label: "20K (833 Fineness - 83.3% Pure)",
    shortLabel: "20K (833)",
    hallmarkCode: "833",
    description: "Vintage, heirloom, or regional gold jewellery",
  },
  "18k-750": {
    key: "18k-750",
    karat: 18,
    finenessPerThousand: 750,
    finenessFraction: 0.75,
    label: "18K (750 Hallmark - Diamond & Studded)",
    shortLabel: "18K (750)",
    hallmarkCode: "750",
    description: "Diamond rings, gemstone pendants, and luxury designer jewellery",
  },
  "14k-585": {
    key: "14k-585",
    karat: 14,
    finenessPerThousand: 585,
    finenessFraction: 0.585,
    label: "14K (585 Hallmark - Contemporary Wear)",
    shortLabel: "14K (585)",
    hallmarkCode: "585",
    description: "Modern lightweight daily wear, office wear, and delicate chains",
  },
  "9k-375": {
    key: "9k-375",
    karat: 9,
    finenessPerThousand: 375,
    finenessFraction: 0.375,
    label: "9K (375 Hallmark - 37.5% Pure)",
    shortLabel: "9K (375)",
    hallmarkCode: "375",
    description: "Affordable contemporary fashion jewellery",
  },
  custom: {
    key: "custom",
    karat: 22,
    finenessPerThousand: 916,
    finenessFraction: 0.916,
    label: "Custom Karat / Fineness",
    shortLabel: "Custom",
    hallmarkCode: "Custom",
    description: "Custom fineness (1 to 1000) or non-standard karat",
  },
};

export type WeightUnit = "grams" | "tola" | "pavan";

export const WEIGHT_CONVERSIONS_TO_GRAMS: Record<WeightUnit, number> = {
  grams: 1,
  tola: 11.6638038, // 1 tola = 11.6638 grams
  pavan: 8, // 1 pavan (sovereign) = 8 grams
};

export type RateBasis = "selected_purity" | "24k";
export type RateUnit = "per_gram" | "per_10g";

export interface OldGoldInputs {
  weightMode: "net" | "gross_stone";
  netWeight: number;
  grossWeight: number;
  stoneWeight: number;
  weightUnit: WeightUnit;

  purity: GoldPurity;
  customFinenessPerThousand?: number; // 1 to 1000
  customKarat?: number; // e.g. 21.6

  rate: number;
  rateBasis: RateBasis; // "selected_purity" or "24k"
  rateUnit: RateUnit; // "per_gram" or "per_10g"

  deductionPct: number; // Jeweller melting / exchange deduction % (0% to 100%)
  fixedCharges: number; // Additional fixed melting/testing/refining charges in ₹
}

export interface OldGoldValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface OldGoldCalculationResult {
  // Weights in Grams
  grossWeightGrams: number;
  stoneWeightGrams: number;
  netWeightGrams: number;
  fineGoldContentGrams: number;

  // Purity details
  finenessPerThousand: number;
  finenessFraction: number;
  karatDisplay: string;
  hallmarkCode: string;

  // Rate details
  enteredRate: number;
  rateBasis: RateBasis;
  rateUnit: RateUnit;
  effectiveRatePerGram: number; // Rate applied to net weight (₹/g)
  equivalent24kRatePerGram: number;

  // Financial components
  baseGoldValue: number; // Gross value before deductions (₹)
  percentageDeductionAmount: number; // (₹)
  fixedChargesAmount: number; // (₹)
  totalDeductions: number; // (₹)
  finalExchangeValue: number; // (₹)

  // Formatted representations
  formattedNetWeight: string;
  formattedFineGold: string;
  formattedEffectiveRate: string;
  formattedBaseGoldValue: string;
  formattedTotalDeductions: string;
  formattedFinalExchangeValue: string;

  // Summary and explanation
  explanation: string;
  insights: Array<{
    type: "info" | "warning" | "success";
    title: string;
    description: string;
  }>;
}

/**
 * Rounds a number to a specified number of decimal places.
 */
export function roundTo(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Formats a number in Indian Rupee currency format (₹).
 */
export function formatINR(val: number, includeDecimals: boolean = false): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  const absVal = Math.abs(val);
  const formatted = absVal.toLocaleString("en-IN", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return val < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

/**
 * Validates inputs for Old Gold Exchange Value calculation.
 */
export function validateOldGoldInputs(inputs: OldGoldInputs): OldGoldValidation {
  const errors: Record<string, string> = {};

  if (inputs.weightMode === "net") {
    if (inputs.netWeight === undefined || isNaN(inputs.netWeight) || inputs.netWeight <= 0) {
      errors.netWeight = "Gold weight must be greater than 0.";
    }
  } else {
    if (inputs.grossWeight === undefined || isNaN(inputs.grossWeight) || inputs.grossWeight <= 0) {
      errors.grossWeight = "Gross weight must be greater than 0.";
    }
    if (inputs.stoneWeight < 0) {
      errors.stoneWeight = "Stone weight cannot be negative.";
    }
    if (inputs.grossWeight > 0 && inputs.stoneWeight >= inputs.grossWeight) {
      errors.stoneWeight = "Stone weight must be less than gross weight.";
    }
  }

  if (inputs.rate === undefined || isNaN(inputs.rate) || inputs.rate <= 0) {
    errors.rate = "Gold rate must be greater than 0.";
  }

  if (inputs.purity === "custom") {
    const fineness = inputs.customFinenessPerThousand;
    if (fineness === undefined || isNaN(fineness) || fineness < 1 || fineness > 1000) {
      errors.customFineness = "Custom fineness must be between 1 and 1000.";
    }
  }

  if (inputs.deductionPct < 0 || inputs.deductionPct > 100) {
    errors.deductionPct = "Deduction percentage must be between 0% and 100%.";
  }

  if (inputs.fixedCharges < 0) {
    errors.fixedCharges = "Fixed charges cannot be negative.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Core mathematical engine for Old Gold Exchange Value.
 * Strictly implements Indian bullion and jewellery valuation standards.
 */
export function calculateOldGoldExchangeValue(inputs: OldGoldInputs): OldGoldCalculationResult {
  const unitFactor = WEIGHT_CONVERSIONS_TO_GRAMS[inputs.weightUnit] || 1;

  // 1. Calculate Net Gold Weight in Grams
  let grossWeightGrams = 0;
  let stoneWeightGrams = 0;
  let netWeightGrams = 0;

  if (inputs.weightMode === "gross_stone") {
    grossWeightGrams = Math.max(0, inputs.grossWeight || 0) * unitFactor;
    stoneWeightGrams = Math.max(0, inputs.stoneWeight || 0) * unitFactor;
    netWeightGrams = Math.max(0, grossWeightGrams - stoneWeightGrams);
  } else {
    netWeightGrams = Math.max(0, inputs.netWeight || 0) * unitFactor;
    grossWeightGrams = netWeightGrams;
    stoneWeightGrams = 0;
  }

  // 2. Resolve Fineness and Karat
  let finenessPerThousand = 916;
  let finenessFraction = 0.916;
  let karatDisplay = "22K";
  let hallmarkCode = "916";

  if (inputs.purity === "custom") {
    const customFineness = Math.min(
      1000,
      Math.max(1, inputs.customFinenessPerThousand || 916)
    );
    finenessPerThousand = customFineness;
    finenessFraction = customFineness / 1000;
    const derivedKarat = roundTo((customFineness / 1000) * 24, 1);
    karatDisplay = `${derivedKarat}K`;
    hallmarkCode = `${customFineness}`;
  } else {
    const pConfig = OLD_GOLD_PURITY_OPTIONS[inputs.purity] || OLD_GOLD_PURITY_OPTIONS["22k-916"];
    finenessPerThousand = pConfig.finenessPerThousand;
    finenessFraction = pConfig.finenessFraction;
    karatDisplay = `${pConfig.karat}K`;
    hallmarkCode = pConfig.hallmarkCode;
  }

  // 3. Fine Pure Gold Content in Grams (24K Equivalent)
  const fineGoldContentGrams = netWeightGrams * finenessFraction;

  // 4. Resolve Gold Rate per Gram
  // If rateUnit is per_10g, divide by 10 to get rate per 1 gram
  const rawRatePerGram =
    inputs.rateUnit === "per_10g" ? Math.max(0, inputs.rate || 0) / 10 : Math.max(0, inputs.rate || 0);

  let effectiveRatePerGram = 0;
  let equivalent24kRatePerGram = 0;

  if (inputs.rateBasis === "24k") {
    // Entered rate is for 24K pure gold
    equivalent24kRatePerGram = rawRatePerGram;
    // Purity rate = 24K Rate * (Fineness / 1000)
    effectiveRatePerGram = rawRatePerGram * finenessFraction;
  } else {
    // Entered rate is specifically for the selected purity (e.g. 22K rate)
    effectiveRatePerGram = rawRatePerGram;
    // Equivalent 24K rate = Purity Rate / (Fineness / 1000)
    equivalent24kRatePerGram = finenessFraction > 0 ? rawRatePerGram / finenessFraction : 0;
  }

  // 5. Calculate Base Gold Value (Gross Value)
  // Base Gold Value = Net Weight (g) * Effective Rate Per Gram
  // Note: This mathematically equals fineGoldContentGrams * equivalent24kRatePerGram
  const baseGoldValue = netWeightGrams * effectiveRatePerGram;

  // 6. Calculate Deductions
  const deductionPct = Math.min(100, Math.max(0, inputs.deductionPct || 0));
  const percentageDeductionAmount = baseGoldValue * (deductionPct / 100);
  const fixedChargesAmount = Math.max(0, inputs.fixedCharges || 0);
  const totalDeductions = percentageDeductionAmount + fixedChargesAmount;

  // 7. Calculate Final Estimated Exchange Value
  const finalExchangeValue = Math.max(0, baseGoldValue - totalDeductions);

  // 8. Generate Clear Explanation
  let explanation = "";
  if (inputs.rateBasis === "24k") {
    explanation = `${roundTo(netWeightGrams, 3)}g of ${karatDisplay} (${hallmarkCode}) gold contains ${roundTo(
      fineGoldContentGrams,
      3
    )}g of pure 24K gold. At a 24K rate of ${formatINR(
      equivalent24kRatePerGram
    )}/g, the effective rate for ${karatDisplay} is ${formatINR(
      effectiveRatePerGram
    )}/g. Base gold value is ${formatINR(roundTo(baseGoldValue))}.`;
  } else {
    explanation = `${roundTo(netWeightGrams, 3)}g of ${karatDisplay} (${hallmarkCode}) gold valued at ${formatINR(
      effectiveRatePerGram
    )}/g yields a base gold value of ${formatINR(roundTo(baseGoldValue))}. Pure gold equivalent is ${roundTo(
      fineGoldContentGrams,
      3
    )}g.`;
  }

  if (totalDeductions > 0) {
    explanation += ` After deducting ${deductionPct}% (${formatINR(
      roundTo(percentageDeductionAmount)
    )})${
      fixedChargesAmount > 0
        ? ` and fixed charges of ${formatINR(fixedChargesAmount)}`
        : ""
    }, total deductions are ${formatINR(
      roundTo(totalDeductions)
    )}. Final estimated exchange value is ${formatINR(roundTo(finalExchangeValue))}.`;
  } else {
    explanation += ` With 0% deductions, your estimated exchange value is ${formatINR(
      roundTo(finalExchangeValue)
    )}.`;
  }

  // 9. Generate Strategic Indian Market Insights
  const insights: Array<{
    type: "info" | "warning" | "success";
    title: string;
    description: string;
  }> = [];

  if (deductionPct === 0) {
    insights.push({
      type: "success",
      title: "100% Value for Hallmarked Exchange",
      description:
        "Top Indian jewelers (Tanishq, Malabar, Kalyan, etc.) typically offer 100% exchange value for BIS-hallmarked gold when exchanging against new jewellery.",
    });
  } else if (deductionPct > 3) {
    insights.push({
      type: "warning",
      title: "High Jeweller Deduction Alert",
      description: `A deduction of ${deductionPct}% (${formatINR(
        roundTo(percentageDeductionAmount)
      )}) is higher than typical market standards. For hallmarked jewellery, deductions usually should not exceed 1% to 2%.`,
    });
  }

  if (inputs.weightMode === "gross_stone" && stoneWeightGrams > 0) {
    insights.push({
      type: "info",
      title: "Strict Stone Weight Removal",
      description: `Deducting ${roundTo(
        stoneWeightGrams,
        2
      )}g of stones protected you from losing ${formatINR(
        roundTo(stoneWeightGrams * effectiveRatePerGram)
      )} in gold value. Always insist on separate net weighing.`,
    });
  }

  insights.push({
    type: "info",
    title: "Exchange vs Cash Difference",
    description:
      "Selling old gold for direct cash may incur an additional 2% to 4% melting fee or TDS under Section 194Q for large transactions, compared to 1-to-1 exchange value.",
  });

  return {
    grossWeightGrams: roundTo(grossWeightGrams, 3),
    stoneWeightGrams: roundTo(stoneWeightGrams, 3),
    netWeightGrams: roundTo(netWeightGrams, 3),
    fineGoldContentGrams: roundTo(fineGoldContentGrams, 3),

    finenessPerThousand,
    finenessFraction,
    karatDisplay,
    hallmarkCode,

    enteredRate: inputs.rate,
    rateBasis: inputs.rateBasis,
    rateUnit: inputs.rateUnit,
    effectiveRatePerGram: roundTo(effectiveRatePerGram, 2),
    equivalent24kRatePerGram: roundTo(equivalent24kRatePerGram, 2),

    baseGoldValue: roundTo(baseGoldValue, 2),
    percentageDeductionAmount: roundTo(percentageDeductionAmount, 2),
    fixedChargesAmount: roundTo(fixedChargesAmount, 2),
    totalDeductions: roundTo(totalDeductions, 2),
    finalExchangeValue: roundTo(finalExchangeValue, 2),

    formattedNetWeight: `${roundTo(netWeightGrams, 3)} g`,
    formattedFineGold: `${roundTo(fineGoldContentGrams, 3)} g`,
    formattedEffectiveRate: formatINR(roundTo(effectiveRatePerGram, 2)),
    formattedBaseGoldValue: formatINR(roundTo(baseGoldValue, 2)),
    formattedTotalDeductions: formatINR(roundTo(totalDeductions, 2)),
    formattedFinalExchangeValue: formatINR(roundTo(finalExchangeValue, 2)),

    explanation,
    insights,
  };
}

