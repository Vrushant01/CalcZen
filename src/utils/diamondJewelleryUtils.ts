/**
 * Diamond Jewellery Price Calculator Utility
 * Mathematically rigorous calculations for diamond jewellery pricing in India.
 * Implements GIA 4Cs diamond attributes, metal valuation, making charges, and CBIC 3% retail GST.
 */

export type DiamondCalculationMode = "simple" | "advanced";
export type DiamondPricingBasis = "total" | "per_carat";
export type DiamondOrigin = "natural" | "lab_grown" | "not_sure";
export type DiamondCut = "excellent" | "very_good" | "good" | "fair" | "poor" | "not_sure";
export type DiamondColor = "D-F" | "G-J" | "K-M" | "N-R" | "S-Z" | "not_sure";
export type DiamondClarity = "FL-IF" | "VVS1-VVS2" | "VS1-VS2" | "SI1-SI2" | "I1-I3" | "not_sure";
export type DiamondShape = "round" | "princess" | "oval" | "cushion" | "emerald" | "pear" | "marquise" | "other";
export type DiamondCertification = "GIA" | "IGI" | "SGL" | "other" | "none" | "not_sure";
export type MakingChargeMethod = "percentage" | "per_gram" | "fixed";
export type DiscountType = "none" | "percentage" | "fixed";

export interface DiamondItem {
  id: string;
  name?: string;
  caratWeight: number; // in ct
  pricingBasis: DiamondPricingBasis;
  pricePerCarat?: number; // ₹ per ct
  totalDiamondPrice?: number; // ₹ total
  cut?: DiamondCut;
  color?: DiamondColor;
  clarity?: DiamondClarity;
  shape?: DiamondShape;
  certification?: DiamondCertification;
  origin?: DiamondOrigin;
}

export interface DiamondJewelleryInputs {
  mode: DiamondCalculationMode;

  // Simple Mode Inputs
  directDiamondPrice: number; // ₹
  directMetalPrice: number; // ₹

  // Advanced Mode Inputs
  diamonds: DiamondItem[];
  metalWeightGrams: number; // in g
  metalPurityKarat: string; // e.g. "18K", "14K", "22K", "platinum_950"
  metalRatePerGram: number; // ₹ / g
  metalCalculationMode: "direct" | "breakdown";

  // Making charges
  makingChargeMethod: MakingChargeMethod;
  makingChargePercentage: number; // % of metal value (default 10%)
  makingChargePerGram: number; // ₹ per gram of metal
  fixedMakingCharge: number; // ₹ flat fee

  // Discounts & Other fees
  discountType: DiscountType;
  discountValue: number; // % or ₹
  otherCharges: number; // certification, packaging, hallmarking ₹

  // Statutory GST
  gstEnabled: boolean;
  gstRate: number; // Statutory CBIC retail finished jewellery GST is 3%
}

export interface DiamondJewelleryResult {
  // Diamond Valuation
  totalDiamondWeightCarats: number;
  totalDiamondWeightGrams: number; // 1 ct = 0.20g
  totalDiamondValue: number;
  diamondDetailsSummary: string;

  // Metal Valuation
  metalWeightGrams: number;
  totalMetalValue: number;
  metalPurityLabel: string;

  // Making charges
  makingCharges: number;
  makingChargeMethodLabel: string;

  // Additional fees & discounts
  otherCharges: number;
  subtotalBeforeDiscount: number;
  discountAmount: number;
  taxableValue: number;

  // Taxes (CBIC GST HSN 7113)
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;

  // Final Price
  finalBillAmount: number;

  // Display strings
  formattedDiamondValue: string;
  formattedMetalValue: string;
  formattedMakingCharges: string;
  formattedOtherCharges: string;
  formattedDiscount: string;
  formattedTaxableValue: string;
  formattedGstAmount: string;
  formattedFinalBill: string;
  formattedDiamondWeight: string;

  // Consumer guidance
  consumerNote: string;
}

export interface DiamondValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Standard conversion: 1 Carat = 0.20 Grams = 200 Milligrams
 */
export function caratToGrams(carats: number): number {
  return roundTo(carats * 0.2, 4);
}

/**
 * Helper to round to decimal precision
 */
export function roundTo(val: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Format currency in Indian Rupees format (₹)
 */
export function formatINR(val: number): string {
  const rounded = roundTo(val, 2);
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Input validation for Diamond Jewellery Price Calculator
 */
export function validateDiamondJewelleryInputs(inputs: DiamondJewelleryInputs): DiamondValidationResult {
  const errors: Record<string, string> = {};

  if (inputs.mode === "simple") {
    if (inputs.directDiamondPrice < 0 || isNaN(inputs.directDiamondPrice)) {
      errors.directDiamondPrice = "Diamond price cannot be negative.";
    }
    if (inputs.directMetalPrice < 0 || isNaN(inputs.directMetalPrice)) {
      errors.directMetalPrice = "Metal price cannot be negative.";
    }
  } else {
    // Advanced mode validation
    if (!inputs.diamonds || inputs.diamonds.length === 0) {
      errors.diamonds = "Please enter at least one diamond.";
    } else {
      inputs.diamonds.forEach((d, idx) => {
        if (d.caratWeight < 0 || isNaN(d.caratWeight)) {
          errors[`diamond_${idx}_weight`] = `Diamond ${idx + 1}: Carat weight cannot be negative.`;
        }
        if (d.pricingBasis === "per_carat") {
          if (d.caratWeight <= 0) {
            errors[`diamond_${idx}_weight_zero`] = `Diamond ${idx + 1}: Carat weight must be greater than 0 when using price per carat.`;
          }
          if (!d.pricePerCarat || d.pricePerCarat <= 0 || isNaN(d.pricePerCarat)) {
            errors[`diamond_${idx}_rate`] = `Diamond ${idx + 1}: Please enter a valid price per carat quoted by your jeweller.`;
          }
        } else if (d.pricingBasis === "total") {
          if (d.totalDiamondPrice === undefined || d.totalDiamondPrice < 0 || isNaN(d.totalDiamondPrice)) {
            errors[`diamond_${idx}_price`] = `Diamond ${idx + 1}: Please enter a valid total diamond price.`;
          }
        }
      });
    }

    if (inputs.metalCalculationMode === "breakdown") {
      if (inputs.metalWeightGrams < 0 || isNaN(inputs.metalWeightGrams)) {
        errors.metalWeightGrams = "Metal weight cannot be negative.";
      }
      if (inputs.metalRatePerGram < 0 || isNaN(inputs.metalRatePerGram)) {
        errors.metalRatePerGram = "Metal rate per gram cannot be negative.";
      }
    } else {
      if (inputs.directMetalPrice < 0 || isNaN(inputs.directMetalPrice)) {
        errors.directMetalPrice = "Metal price cannot be negative.";
      }
    }
  }

  // Making charges validation
  if (inputs.makingChargeMethod === "percentage" && inputs.makingChargePercentage < 0) {
    errors.makingChargePercentage = "Making charge percentage cannot be negative.";
  }
  if (inputs.makingChargeMethod === "per_gram" && inputs.makingChargePerGram < 0) {
    errors.makingChargePerGram = "Making charge per gram cannot be negative.";
  }
  if (inputs.makingChargeMethod === "fixed" && inputs.fixedMakingCharge < 0) {
    errors.fixedMakingCharge = "Fixed making charge cannot be negative.";
  }

  // Discount validation
  if (inputs.discountType === "percentage" && (inputs.discountValue < 0 || inputs.discountValue > 100)) {
    errors.discountValue = "Discount percentage must be between 0% and 100%.";
  }
  if (inputs.discountType === "fixed" && inputs.discountValue < 0) {
    errors.discountValue = "Discount amount cannot be negative.";
  }

  if (inputs.otherCharges < 0) {
    errors.otherCharges = "Other charges cannot be negative.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Main Calculation Engine for Diamond Jewellery
 */
export function calculateDiamondJewelleryPrice(inputs: DiamondJewelleryInputs): DiamondJewelleryResult {
  // 1. Calculate Diamond Value
  let totalDiamondValue = 0;
  let totalDiamondWeightCarats = 0;
  let diamondDetailsSummary = "";

  if (inputs.mode === "simple") {
    totalDiamondValue = Math.max(0, inputs.directDiamondPrice);
    diamondDetailsSummary = "Direct Diamond Quotation";
  } else {
    // Advanced mode: aggregate across diamond items
    inputs.diamonds.forEach((d) => {
      const weight = Math.max(0, d.caratWeight || 0);
      totalDiamondWeightCarats += weight;

      if (d.pricingBasis === "per_carat") {
        const rate = Math.max(0, d.pricePerCarat || 0);
        totalDiamondValue += weight * rate;
      } else {
        totalDiamondValue += Math.max(0, d.totalDiamondPrice || 0);
      }
    });

    diamondDetailsSummary = `${totalDiamondWeightCarats.toFixed(2)} ct Total Diamond Weight`;
  }

  const totalDiamondWeightGrams = caratToGrams(totalDiamondWeightCarats);

  // 2. Calculate Metal Value
  let totalMetalValue = 0;
  let metalWeightGrams = 0;
  let metalPurityLabel = "Gold / Metal";

  if (inputs.mode === "simple" || inputs.metalCalculationMode === "direct") {
    totalMetalValue = Math.max(0, inputs.directMetalPrice);
    metalWeightGrams = Math.max(0, inputs.metalWeightGrams);
  } else {
    // Breakdown mode: weight * rate
    metalWeightGrams = Math.max(0, inputs.metalWeightGrams);
    const rate = Math.max(0, inputs.metalRatePerGram);
    totalMetalValue = metalWeightGrams * rate;
    metalPurityLabel = inputs.metalPurityKarat || "18K Gold";
  }

  // 3. Calculate Making Charges
  let makingCharges = 0;
  let makingChargeMethodLabel = "";

  if (inputs.makingChargeMethod === "percentage") {
    // In Indian jewellery trade, making charges are calculated on metal value
    const pct = Math.max(0, inputs.makingChargePercentage);
    makingCharges = (totalMetalValue * pct) / 100;
    makingChargeMethodLabel = `${pct}% of metal value`;
  } else if (inputs.makingChargeMethod === "per_gram") {
    const ratePerGram = Math.max(0, inputs.makingChargePerGram);
    makingCharges = metalWeightGrams * ratePerGram;
    makingChargeMethodLabel = `₹${ratePerGram}/g on metal`;
  } else if (inputs.makingChargeMethod === "fixed") {
    makingCharges = Math.max(0, inputs.fixedMakingCharge);
    makingChargeMethodLabel = "Fixed charge";
  }

  // 4. Subtotal & Discount
  const otherCharges = Math.max(0, inputs.otherCharges);
  const subtotalBeforeDiscount = totalDiamondValue + totalMetalValue + makingCharges + otherCharges;

  let discountAmount = 0;
  if (inputs.discountType === "percentage") {
    const discPct = Math.min(100, Math.max(0, inputs.discountValue));
    discountAmount = (subtotalBeforeDiscount * discPct) / 100;
  } else if (inputs.discountType === "fixed") {
    discountAmount = Math.min(subtotalBeforeDiscount, Math.max(0, inputs.discountValue));
  }

  // 5. Taxable Value
  const taxableValue = Math.max(0, subtotalBeforeDiscount - discountAmount);

  // 6. GST (CBIC finished jewellery statutory 3%)
  const gstRate = inputs.gstEnabled ? Math.max(0, inputs.gstRate) : 0;
  const gstAmount = (taxableValue * gstRate) / 100;
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  // 7. Final Bill
  const finalBillAmount = taxableValue + gstAmount;

  return {
    totalDiamondWeightCarats: roundTo(totalDiamondWeightCarats, 3),
    totalDiamondWeightGrams,
    totalDiamondValue: roundTo(totalDiamondValue, 2),
    diamondDetailsSummary,

    metalWeightGrams: roundTo(metalWeightGrams, 3),
    totalMetalValue: roundTo(totalMetalValue, 2),
    metalPurityLabel,

    makingCharges: roundTo(makingCharges, 2),
    makingChargeMethodLabel,

    otherCharges: roundTo(otherCharges, 2),
    subtotalBeforeDiscount: roundTo(subtotalBeforeDiscount, 2),
    discountAmount: roundTo(discountAmount, 2),
    taxableValue: roundTo(taxableValue, 2),

    gstAmount: roundTo(gstAmount, 2),
    cgstAmount: roundTo(cgstAmount, 2),
    sgstAmount: roundTo(sgstAmount, 2),

    finalBillAmount: roundTo(finalBillAmount, 2),

    formattedDiamondValue: formatINR(totalDiamondValue),
    formattedMetalValue: formatINR(totalMetalValue),
    formattedMakingCharges: formatINR(makingCharges),
    formattedOtherCharges: formatINR(otherCharges),
    formattedDiscount: formatINR(discountAmount),
    formattedTaxableValue: formatINR(taxableValue),
    formattedGstAmount: formatINR(gstAmount),
    formattedFinalBill: formatINR(finalBillAmount),
    formattedDiamondWeight: `${roundTo(totalDiamondWeightCarats, 2)} ct`,

    consumerNote:
      "Actual jewellery prices may differ depending on diamond quality (cut, colour, clarity), certification (GIA/IGI), jeweller workmanship, gold market rates and applicable taxes.",
  };
}

