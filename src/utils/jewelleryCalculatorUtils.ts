/**
 * CalcZen Gold Jewellery Bill Calculator Utilities (India)
 * Official statutory reference: CBIC GST Rules (3% on retail jewellery transaction value)
 * Bureau of Indian Standards (BIS) Hallmarking Fineness & Karat System
 */

export type GoldPurity =
  | "24k-999"
  | "24k-995"
  | "23k-958"
  | "22k-916"
  | "20k-833"
  | "18k-750"
  | "14k-585"
  | "custom";

export interface PurityInfo {
  key: GoldPurity;
  karat: number;
  fineness: number; // e.g. 0.9167 for 22K (916)
  finenessPerThousand: number; // e.g. 916
  label: string;
  shortLabel: string;
  hallmarkCode: string;
  typicalUsage: string;
}

export const PURITY_DEFINITIONS: Record<GoldPurity, PurityInfo> = {
  "24k-999": {
    key: "24k-999",
    karat: 24,
    fineness: 0.999,
    finenessPerThousand: 999,
    label: "24K (999 Fineness - 99.9% Pure Gold)",
    shortLabel: "24K (999)",
    hallmarkCode: "999",
    typicalUsage: "Coins, Gold Bars & Bullion",
  },
  "24k-995": {
    key: "24k-995",
    karat: 24,
    fineness: 0.995,
    finenessPerThousand: 995,
    label: "24K (995 Fineness - Standard Bullion)",
    shortLabel: "24K (995)",
    hallmarkCode: "995",
    typicalUsage: "Standard Indian Gold Bars",
  },
  "23k-958": {
    key: "23k-958",
    karat: 23,
    fineness: 0.958,
    finenessPerThousand: 958,
    label: "23K (958 Fineness - Traditional Jewellery)",
    shortLabel: "23K (958)",
    hallmarkCode: "958",
    typicalUsage: "Traditional Temple & Heritage Jewellery",
  },
  "22k-916": {
    key: "22k-916",
    karat: 22,
    fineness: 22 / 24, // 0.916666...
    finenessPerThousand: 916,
    label: "22K (916 Fineness - Standard Indian Hallmark)",
    shortLabel: "22K (916)",
    hallmarkCode: "916",
    typicalUsage: "Most Indian Bridal & Everyday Jewellery",
  },
  "20k-833": {
    key: "20k-833",
    karat: 20,
    fineness: 20 / 24, // 0.833333...
    finenessPerThousand: 833,
    label: "20K (833 Fineness - 83.3% Pure)",
    shortLabel: "20K (833)",
    hallmarkCode: "833",
    typicalUsage: "Vintage & Regional Jewellery",
  },
  "18k-750": {
    key: "18k-750",
    karat: 18,
    fineness: 18 / 24, // 0.750
    finenessPerThousand: 750,
    label: "18K (750 Fineness - Diamond & Studded)",
    shortLabel: "18K (750)",
    hallmarkCode: "750",
    typicalUsage: "Diamond Jewellery & Modern Rings",
  },
  "14k-585": {
    key: "14k-585",
    karat: 14,
    fineness: 14 / 24, // 0.5833... (industry standard 585)
    finenessPerThousand: 585,
    label: "14K (585 Fineness - Contemporary Daily Wear)",
    shortLabel: "14K (585)",
    hallmarkCode: "585",
    typicalUsage: "Lightweight Contemporary Daily Wear",
  },
  custom: {
    key: "custom",
    karat: 22,
    fineness: 22 / 24,
    finenessPerThousand: 916,
    label: "Custom Karat / Fineness",
    shortLabel: "Custom",
    hallmarkCode: "Custom",
    typicalUsage: "User Defined Specification",
  },
};

export type WeightUnit = "grams" | "milligrams" | "tola" | "pavan";

export const WEIGHT_UNIT_CONVERSIONS: Record<WeightUnit, number> = {
  grams: 1,
  milligrams: 0.001,
  tola: 11.6638038, // 1 tola ≈ 11.6638 grams
  pavan: 8, // 1 pavan (sovereign) = 8 grams
};

export type RateBasis = "per_gram" | "per_10g" | "per_tola" | "per_pavan";

export type RateType = "direct" | "derived_from_24k";

export type MakingChargeType = "percentage" | "per_gram" | "flat";

export type WastageType = "none" | "percentage" | "weight_grams" | "flat";

export type DiscountType = "none" | "percentage" | "flat";

export type DiscountApplyOn = "making_charges" | "total_jewellery_value";

export type GstTransactionType = "intra_state" | "inter_state";

export interface JewelleryBillInputs {
  itemName?: string;
  purity: GoldPurity;
  customKarat?: number;
  customFinenessPct?: number;

  // Weight details
  weightInputMode: "net_weight" | "gross_weight";
  grossWeight: number;
  grossWeightUnit: WeightUnit;
  nonGoldWeight: number; // In same unit or converted
  nonGoldWeightUnit: WeightUnit;
  netWeight: number;
  netWeightUnit: WeightUnit;

  // Gold Rate details
  goldRate: number;
  goldRateBasis: RateBasis;
  goldRateType: RateType; // direct for this purity vs derived from 24K
  reference24kPurity?: "24k-999" | "24k-995";

  // Making charges
  makingChargeType: MakingChargeType;
  makingChargeValue: number; // e.g. 8 for 8%, 500 for ₹500/g, 10000 for flat ₹10k

  // Wastage / Value Addition
  wastageType: WastageType;
  wastageValue: number; // e.g. 5 for 5%, 0.5 for 0.5g, 2000 for flat ₹2k

  // Stones and other items
  diamondValue: number;
  gemstoneValue: number;
  otherStonesValue: number;
  pearlsValue: number;
  hallmarkingCharge: number; // default ₹45 + 18% GST = ~₹53.10
  certificationCharge: number;
  packagingCharge: number;
  otherServiceCharge: number;

  // Discounts
  discountType: DiscountType;
  discountValue: number; // percentage or flat amount
  discountApplyOn: DiscountApplyOn;

  // Tax
  gstRatePct: number; // Default 3% per CBIC retail jewellery rule
  gstTransactionType: GstTransactionType; // intra-state (CGST+SGST) vs inter-state (IGST)

  // Old Gold Exchange (Optional)
  enableOldGoldExchange?: boolean;
  oldGoldNetWeight?: number;
  oldGoldWeightUnit?: WeightUnit;
  oldGoldPurity?: GoldPurity;
  oldGoldBuybackRatePerGram?: number;
  oldGoldDeductionPct?: number; // e.g. 0% for hallmarked, 2-5% melting loss

  // Advance Payment (Optional)
  advancePaymentPaid?: number;
}

export interface CalculatedJewelleryBill {
  // Converted Weights in Grams
  grossWeightGrams: number;
  nonGoldWeightGrams: number;
  netGoldWeightGrams: number;

  // Gold Purity & Rates
  selectedPurity: GoldPurity;
  purityLabel: string;
  effectiveFinenessRatio: number;
  ratePerGram24K: number;
  effectiveGoldRatePerGram: number; // In ₹/gram for the specific purity

  // Core Value Breakdown
  rawGoldValue: number;
  makingCharges: number;
  makingChargeEquivalentPct: number;
  makingChargePerGram: number;
  wastageCharges: number;
  wastageEquivalentPct: number;
  totalMakingAndWastage: number;

  // Non-Gold & Extra Charges
  diamondValue: number;
  gemstoneValue: number;
  otherStonesValue: number;
  totalStoneValue: number;
  hallmarkingCharge: number;
  otherCharges: number;
  totalExtraCharges: number;

  // Discounts
  grossPreDiscountValue: number;
  eligibleDiscountAmount: number;
  effectiveDiscountPercentage: number;

  // Taxable Value & GST
  taxableTransactionValue: number;
  gstRatePct: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGstAmount: number;

  // Final Payable
  finalPayableAmount: number;
  effectiveFinalPricePerGram: number;

  // Old Gold Exchange Details
  oldGoldGrossValue: number;
  oldGoldDeductionAmount: number;
  netOldGoldExchangeCredit: number;
  netPayableAfterExchange: number;

  // Advance Payment & Balance
  advancePaymentPaid: number;
  remainingBalanceDue: number;
}

export interface QuoteComparison {
  quoteA: CalculatedJewelleryBill;
  quoteB: CalculatedJewelleryBill;
  cheaperQuote: "A" | "B" | "equal";
  differenceInTotalPayable: number;
  differenceInPercentage: number;
  differenceInMakingCharges: number;
  differenceInWastage: number;
  differenceInGoldValue: number;
  differenceInEffectivePricePerGram: number;
}

export interface JewelleryInsight {
  type: "making" | "wastage" | "gst" | "savings" | "purity" | "quote";
  tone: "info" | "success" | "warning" | "tip";
  title: string;
  text: string;
}

/**
 * Converts any supported weight unit to standard grams
 */
export function convertWeightToGrams(weight: number, unit: WeightUnit = "grams"): number {
  const w = Math.max(0, Number(weight) || 0);
  const factor = WEIGHT_UNIT_CONVERSIONS[unit] || 1;
  return w * factor;
}

/**
 * Converts standard grams to any target weight unit
 */
export function convertGramsToUnit(grams: number, unit: WeightUnit = "grams"): number {
  const g = Math.max(0, Number(grams) || 0);
  const factor = WEIGHT_UNIT_CONVERSIONS[unit] || 1;
  return g / factor;
}

/**
 * Converts any rate basis into rupees per gram
 */
export function convertRateToPerGram(rate: number, basis: RateBasis = "per_gram"): number {
  const r = Math.max(0, Number(rate) || 0);
  switch (basis) {
    case "per_gram":
      return r;
    case "per_10g":
      return r / 10;
    case "per_tola":
      return r / WEIGHT_UNIT_CONVERSIONS.tola; // r / 11.6638038
    case "per_pavan":
      return r / 8;
    default:
      return r;
  }
}

/**
 * Gets fineness ratio (0 to 1) for a selected purity
 */
export function getPurityFineness(
  purity: GoldPurity,
  customKarat?: number,
  customFinenessPct?: number
): number {
  if (purity === "custom") {
    if (customFinenessPct && customFinenessPct > 0) {
      return Math.min(1, Math.max(0, customFinenessPct / 100));
    }
    if (customKarat && customKarat > 0) {
      return Math.min(1, Math.max(0, customKarat / 24));
    }
    return 22 / 24;
  }
  const def = PURITY_DEFINITIONS[purity];
  return def ? def.fineness : 22 / 24;
}

/**
 * Derives purity-specific gold rate from a 24K benchmark rate
 */
export function calculateDerivedGoldRate(
  reference24kRatePerGram: number,
  targetPurity: GoldPurity,
  customKarat?: number,
  customFinenessPct?: number
): number {
  const targetFineness = getPurityFineness(targetPurity, customKarat, customFinenessPct);
  // Using official pure ratio (karat / 24 or fineness)
  return reference24kRatePerGram * targetFineness;
}

/**
 * Calculates net gold weight from gross and non-gold weights
 */
export function calculateNetGoldWeight(grossWeightGrams: number, nonGoldWeightGrams: number): number {
  const gross = Math.max(0, Number(grossWeightGrams) || 0);
  const nonGold = Math.max(0, Number(nonGoldWeightGrams) || 0);
  return Math.max(0, gross - nonGold);
}

/**
 * Master calculation function for Indian Gold Jewellery Billing
 */
export function calculateFinalJewelleryBill(inputs: JewelleryBillInputs): CalculatedJewelleryBill {
  // 1. Weight Conversion
  let grossWeightGrams = 0;
  let nonGoldWeightGrams = 0;
  let netGoldWeightGrams = 0;

  if (inputs.weightInputMode === "gross_weight") {
    grossWeightGrams = convertWeightToGrams(inputs.grossWeight, inputs.grossWeightUnit);
    nonGoldWeightGrams = convertWeightToGrams(inputs.nonGoldWeight, inputs.nonGoldWeightUnit);
    netGoldWeightGrams = calculateNetGoldWeight(grossWeightGrams, nonGoldWeightGrams);
  } else {
    netGoldWeightGrams = convertWeightToGrams(inputs.netWeight, inputs.netWeightUnit);
    grossWeightGrams = netGoldWeightGrams;
    nonGoldWeightGrams = 0;
  }

  // 2. Gold Purity & Rate Resolution
  const selectedPurity = inputs.purity || "22k-916";
  const purityDef = PURITY_DEFINITIONS[selectedPurity] || PURITY_DEFINITIONS["22k-916"];
  const purityLabel = purityDef.label;
  const effectiveFinenessRatio = getPurityFineness(
    selectedPurity,
    inputs.customKarat,
    inputs.customFinenessPct
  );

  const rawEnteredRatePerGram = convertRateToPerGram(inputs.goldRate, inputs.goldRateBasis);

  let ratePerGram24K = 0;
  let effectiveGoldRatePerGram = 0;

  if (inputs.goldRateType === "derived_from_24k") {
    ratePerGram24K = rawEnteredRatePerGram;
    effectiveGoldRatePerGram = calculateDerivedGoldRate(
      ratePerGram24K,
      selectedPurity,
      inputs.customKarat,
      inputs.customFinenessPct
    );
  } else {
    effectiveGoldRatePerGram = rawEnteredRatePerGram;
    ratePerGram24K = effectiveFinenessRatio > 0 ? effectiveGoldRatePerGram / effectiveFinenessRatio : effectiveGoldRatePerGram;
  }

  // 3. Raw Gold Value
  const rawGoldValue = netGoldWeightGrams * effectiveGoldRatePerGram;

  // 4. Wastage (Value Addition)
  let wastageCharges = 0;
  if (inputs.wastageType === "percentage") {
    wastageCharges = (rawGoldValue * Math.max(0, inputs.wastageValue || 0)) / 100;
  } else if (inputs.wastageType === "weight_grams") {
    const additionalGrams = Math.max(0, inputs.wastageValue || 0);
    wastageCharges = additionalGrams * effectiveGoldRatePerGram;
  } else if (inputs.wastageType === "flat") {
    wastageCharges = Math.max(0, inputs.wastageValue || 0);
  }

  const wastageEquivalentPct = rawGoldValue > 0 ? (wastageCharges / rawGoldValue) * 100 : 0;

  // 5. Making Charges
  let makingCharges = 0;
  if (inputs.makingChargeType === "percentage") {
    makingCharges = (rawGoldValue * Math.max(0, inputs.makingChargeValue || 0)) / 100;
  } else if (inputs.makingChargeType === "per_gram") {
    makingCharges = netGoldWeightGrams * Math.max(0, inputs.makingChargeValue || 0);
  } else if (inputs.makingChargeType === "flat") {
    makingCharges = Math.max(0, inputs.makingChargeValue || 0);
  }

  const makingChargeEquivalentPct = rawGoldValue > 0 ? (makingCharges / rawGoldValue) * 100 : 0;
  const makingChargePerGram = netGoldWeightGrams > 0 ? makingCharges / netGoldWeightGrams : 0;
  const totalMakingAndWastage = makingCharges + wastageCharges;

  // 6. Stones & Extras
  const diamondValue = Math.max(0, inputs.diamondValue || 0);
  const gemstoneValue = Math.max(0, inputs.gemstoneValue || 0);
  const otherStonesValue = Math.max(0, inputs.otherStonesValue || 0);
  const pearlsValue = Math.max(0, inputs.pearlsValue || 0);
  const totalStoneValue = diamondValue + gemstoneValue + otherStonesValue + pearlsValue;

  const hallmarkingCharge = Math.max(0, inputs.hallmarkingCharge ?? 45);
  const certificationCharge = Math.max(0, inputs.certificationCharge || 0);
  const packagingCharge = Math.max(0, inputs.packagingCharge || 0);
  const otherServiceCharge = Math.max(0, inputs.otherServiceCharge || 0);
  const otherCharges = certificationCharge + packagingCharge + otherServiceCharge;
  const totalExtraCharges = hallmarkingCharge + otherCharges;

  // 7. Gross Pre-Discount Transaction Value
  const grossPreDiscountValue =
    rawGoldValue + wastageCharges + makingCharges + totalStoneValue + totalExtraCharges;

  // 8. Discounts
  let eligibleDiscountAmount = 0;
  if (inputs.discountType === "percentage") {
    const pct = Math.max(0, Math.min(100, inputs.discountValue || 0));
    if (inputs.discountApplyOn === "making_charges") {
      eligibleDiscountAmount = (makingCharges * pct) / 100;
    } else {
      eligibleDiscountAmount = (grossPreDiscountValue * pct) / 100;
    }
  } else if (inputs.discountType === "flat") {
    eligibleDiscountAmount = Math.max(0, inputs.discountValue || 0);
    if (inputs.discountApplyOn === "making_charges") {
      eligibleDiscountAmount = Math.min(eligibleDiscountAmount, makingCharges);
    } else {
      eligibleDiscountAmount = Math.min(eligibleDiscountAmount, grossPreDiscountValue);
    }
  }

  const effectiveDiscountPercentage =
    grossPreDiscountValue > 0 ? (eligibleDiscountAmount / grossPreDiscountValue) * 100 : 0;

  // 9. Taxable Value
  const taxableTransactionValue = Math.max(0, grossPreDiscountValue - eligibleDiscountAmount);

  // 10. GST (Default 3% on retail transaction value)
  const gstRatePct = Math.max(0, inputs.gstRatePct ?? 3);
  const totalGstAmount = (taxableTransactionValue * gstRatePct) / 100;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (inputs.gstTransactionType === "inter_state") {
    igstAmount = totalGstAmount;
  } else {
    cgstAmount = totalGstAmount / 2;
    sgstAmount = totalGstAmount / 2;
  }

  // 11. Final Payable Amount
  const finalPayableAmount = taxableTransactionValue + totalGstAmount;
  const effectiveFinalPricePerGram =
    netGoldWeightGrams > 0 ? finalPayableAmount / netGoldWeightGrams : 0;

  // 12. Old Gold Exchange
  let oldGoldGrossValue = 0;
  let oldGoldDeductionAmount = 0;
  let netOldGoldExchangeCredit = 0;
  let netPayableAfterExchange = finalPayableAmount;

  if (inputs.enableOldGoldExchange && inputs.oldGoldNetWeight && inputs.oldGoldNetWeight > 0) {
    const oldWeightGrams = convertWeightToGrams(
      inputs.oldGoldNetWeight,
      inputs.oldGoldWeightUnit || "grams"
    );
    const oldRatePerGram = Math.max(0, inputs.oldGoldBuybackRatePerGram || effectiveGoldRatePerGram);
    oldGoldGrossValue = oldWeightGrams * oldRatePerGram;
    const deductionPct = Math.max(0, Math.min(100, inputs.oldGoldDeductionPct ?? 0));
    oldGoldDeductionAmount = (oldGoldGrossValue * deductionPct) / 100;
    netOldGoldExchangeCredit = Math.max(0, oldGoldGrossValue - oldGoldDeductionAmount);
    netPayableAfterExchange = Math.max(0, finalPayableAmount - netOldGoldExchangeCredit);
  }

  // 13. Advance Payment & Remaining Balance
  const advancePaymentPaid = Math.max(0, inputs.advancePaymentPaid || 0);
  const remainingBalanceDue = Math.max(0, netPayableAfterExchange - advancePaymentPaid);

  return {
    grossWeightGrams,
    nonGoldWeightGrams,
    netGoldWeightGrams,
    selectedPurity,
    purityLabel,
    effectiveFinenessRatio,
    ratePerGram24K,
    effectiveGoldRatePerGram,
    rawGoldValue,
    makingCharges,
    makingChargeEquivalentPct,
    makingChargePerGram,
    wastageCharges,
    wastageEquivalentPct,
    totalMakingAndWastage,
    diamondValue,
    gemstoneValue,
    otherStonesValue,
    totalStoneValue,
    hallmarkingCharge,
    otherCharges,
    totalExtraCharges,
    grossPreDiscountValue,
    eligibleDiscountAmount,
    effectiveDiscountPercentage,
    taxableTransactionValue,
    gstRatePct,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalGstAmount,
    finalPayableAmount,
    effectiveFinalPricePerGram,
    oldGoldGrossValue,
    oldGoldDeductionAmount,
    netOldGoldExchangeCredit,
    netPayableAfterExchange,
    advancePaymentPaid,
    remainingBalanceDue,
  };
}

/**
 * Reverse calculation: Given a total budget (₹), calculates the maximum net gold weight in grams
 * that can be purchased with the given rate, making charge %, wastage %, and 3% GST.
 */
export function calculateBudgetBasedWeight(
  budgetINR: number,
  effectiveGoldRatePerGram: number,
  makingChargePct: number = 8,
  wastagePct: number = 0,
  gstRatePct: number = 3,
  fixedChargesINR: number = 45 // e.g. hallmark
): number {
  const budget = Math.max(0, Number(budgetINR) || 0);
  const rate = Math.max(1, Number(effectiveGoldRatePerGram) || 1);
  const gstMultiplier = 1 + Math.max(0, gstRatePct) / 100;
  const surchargeMultiplier = 1 + (Math.max(0, makingChargePct) + Math.max(0, wastagePct)) / 100;

  // Final = (Weight * Rate * Surcharge + Fixed) * GST
  // Weight = [ (Budget / GST) - Fixed ] / (Rate * Surcharge)
  const preTaxBudget = budget / gstMultiplier;
  const availableForGold = Math.max(0, preTaxBudget - fixedChargesINR);
  const netGrams = availableForGold / (rate * surchargeMultiplier);

  return Math.max(0, Math.round(netGrams * 1000) / 1000);
}

/**
 * Compares two jeweller quotations side-by-side
 */
export function compareTwoJewellerQuotes(
  inputsA: JewelleryBillInputs,
  inputsB: JewelleryBillInputs
): QuoteComparison {
  const quoteA = calculateFinalJewelleryBill(inputsA);
  const quoteB = calculateFinalJewelleryBill(inputsB);

  const diffPayable = Math.round((quoteA.finalPayableAmount - quoteB.finalPayableAmount) * 100) / 100;
  const cheaperQuote: "A" | "B" | "equal" =
    Math.abs(diffPayable) < 1 ? "equal" : diffPayable < 0 ? "A" : "B";

  const basePayable = Math.min(quoteA.finalPayableAmount, quoteB.finalPayableAmount) || 1;
  const diffPct = Math.round((Math.abs(diffPayable) / basePayable) * 1000) / 10;

  return {
    quoteA,
    quoteB,
    cheaperQuote,
    differenceInTotalPayable: Math.abs(diffPayable),
    differenceInPercentage: diffPct,
    differenceInMakingCharges: Math.round((quoteA.makingCharges - quoteB.makingCharges) * 100) / 100,
    differenceInWastage: Math.round((quoteA.wastageCharges - quoteB.wastageCharges) * 100) / 100,
    differenceInGoldValue: Math.round((quoteA.rawGoldValue - quoteB.rawGoldValue) * 100) / 100,
    differenceInEffectivePricePerGram:
      Math.round((quoteA.effectiveFinalPricePerGram - quoteB.effectiveFinalPricePerGram) * 100) / 100,
  };
}

/**
 * Generates personalized rule-based savings, billing insights, and negotiation guidance
 */
export function generateJewelleryInsights(bill: CalculatedJewelleryBill): JewelleryInsight[] {
  const insights: JewelleryInsight[] = [];

  // Insight 1: Making Charges Contribution
  if (bill.rawGoldValue > 0) {
    const mcPct = Math.round(bill.makingChargeEquivalentPct * 10) / 10;
    if (mcPct > 15) {
      insights.push({
        type: "making",
        tone: "warning",
        title: "High Making Charges Alert",
        text: `Making charges account for ${mcPct}% (₹${formatINR(bill.makingCharges)}) of the pure gold value. Standard plain gold jewellery typically carries 6% to 12% making charges. You have room to negotiate this rate down with your jeweller.`,
      });
    } else {
      insights.push({
        type: "making",
        tone: "success",
        title: "Competitive Making Charges",
        text: `Making charges represent ${mcPct}% (₹${formatINR(bill.makingCharges)}) of your gold value, which is within the competitive Indian retail benchmark for machine-crafted jewellery.`,
      });
    }
  }

  // Insight 2: Wastage / Value Addition
  if (bill.wastageCharges > 0) {
    insights.push({
      type: "wastage",
      tone: "info",
      title: "Wastage (Value Addition) Fee",
      text: `Your bill includes ₹${formatINR(bill.wastageCharges)} (${Math.round(bill.wastageEquivalentPct * 10) / 10}%) in separate wastage. Many branded jewellers already include wastage inside making charges—ensure your jeweller is not charging for craftsmanship twice.`,
    });
  }

  // Insight 3: Negotiation Leverage
  if (bill.makingCharges > 0 && bill.rawGoldValue > 0) {
    const savedPerPoint = (bill.rawGoldValue * 0.01) * (1 + bill.gstRatePct / 100);
    insights.push({
      type: "savings",
      tone: "tip",
      title: "Negotiation Savings Opportunity",
      text: `Negotiating a reduction of just 2 percentage points on your making charges will save you approximately ₹${formatINR(savedPerPoint * 2)} (including GST savings) on this purchase.`,
    });
  }

  // Insight 4: Effective Price vs Benchmark
  if (bill.netGoldWeightGrams > 0 && bill.effectiveGoldRatePerGram > 0) {
    const premiumPerGram = bill.effectiveFinalPricePerGram - bill.effectiveGoldRatePerGram;
    const premiumPct = Math.round((premiumPerGram / bill.effectiveGoldRatePerGram) * 1000) / 10;
    insights.push({
      type: "purity",
      tone: "info",
      title: "Total Surcharges & GST Premium",
      text: `Your effective final price is ₹${formatINR(bill.effectiveFinalPricePerGram)}/gram. Making charges, wastage, and 3% GST add an effective premium of ₹${formatINR(premiumPerGram)}/g (+${premiumPct}%) above the raw gold rate.`,
    });
  }

  return insights;
}

/**
 * Currency formatter for Indian Rupees
 */
export function formatINR(val: number): string {
  const n = Math.round(Number(val) || 0);
  return "₹" + n.toLocaleString("en-IN");
}

export function formatINRWithDecimals(val: number): string {
  const n = Number(val) || 0;
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

