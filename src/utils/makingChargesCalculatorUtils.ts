/**
 * CalcZen Gold Making Charges Calculator Utilities (India)
 * Official statutory reference: CBIC GST Rules (3% on retail jewellery transaction value)
 * Bureau of Indian Standards (BIS) Hallmarking Fineness & Karat System
 */

import {
  type GoldPurity,
  PURITY_DEFINITIONS,
  type WeightUnit,
  type RateBasis,
  type RateType,
  type MakingChargeType,
  type WastageType,
  type DiscountType,
  type GstTransactionType,
  convertWeightToGrams,
  convertGramsToUnit,
  convertRateToPerGram,
  getPurityFineness,
  calculateDerivedGoldRate,
  formatINR,
  formatINRWithDecimals,
} from "./jewelleryCalculatorUtils";

export type {
  GoldPurity,
  WeightUnit,
  RateBasis,
  RateType,
  MakingChargeType,
  WastageType,
  DiscountType,
  GstTransactionType,
};

export {
  PURITY_DEFINITIONS,
  convertWeightToGrams,
  convertGramsToUnit,
  convertRateToPerGram,
  getPurityFineness,
  calculateDerivedGoldRate,
  formatINR,
  formatINRWithDecimals,
};

export interface MakingChargesInputs {
  purity: GoldPurity;
  customKarat?: number;
  customFinenessPct?: number;

  goldWeight: number;
  weightUnit: WeightUnit;

  goldRate: number;
  goldRateBasis: RateBasis;
  goldRateType: RateType; // "direct" | "derived_from_24k"
  reference24kPurity?: "24k-999" | "24k-995";

  makingChargeMethod: MakingChargeType; // "percentage" | "per_gram" | "flat"
  makingChargePercentage: number; // e.g. 8 for 8%
  makingChargePerGram: number; // e.g. 500 for ₹500/g
  flatMakingCharge: number; // e.g. 8000 for flat ₹8k

  wastageType: WastageType; // "none" | "percentage" | "weight_grams" | "flat"
  wastageValue: number;

  discountType: DiscountType; // "none" | "percentage" | "flat"
  discountValue: number;
  discountApplyOn?: "making_charges" | "total_eligible";

  gstRatePct: number; // Default 3%
  gstTransactionType: GstTransactionType; // "intra_state" | "inter_state"
}

export interface CalculatedMakingCharges {
  goldWeightGrams: number;
  selectedPurity: GoldPurity;
  purityLabel: string;
  finenessRatio: number;
  effectiveGoldRatePerGram: number;
  ratePer10g: number;
  rawGoldValue: number;

  // Making charges
  selectedMethod: MakingChargeType;
  originalMakingCharges: number;
  makingChargeDiscount: number;
  netMakingCharges: number;

  // Equivalent conversions across all 3 methods
  makingChargePerGram: number;
  makingChargePercentageEquivalent: number;
  makingChargePer10g: number;

  // Wastage / Value Addition
  wastageValue: number;
  wastageEquivalentPct: number;

  // Totals & GST
  totalAdditionalCharges: number; // netMaking + wastage
  taxableTransactionValue: number;
  gstRatePct: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalGstAmount: number;
  gstOnMakingCharges: number; // Tax attributable to making charges portion
  finalTotalJewelleryAmount: number;

  // Percentage Shares
  makingChargesShareOfPreTaxPct: number;
  makingChargesShareOfTotalBillPct: number;
}

export interface JewellerOfferInput {
  jewellerName: string;
  method: MakingChargeType;
  value: number; // % or ₹/g or flat ₹
  discountPct?: number;
}

export interface CalculatedOffer {
  jewellerName: string;
  method: MakingChargeType;
  inputValue: number;
  originalMakingCharges: number;
  discountAmount: number;
  netMakingCharges: number;
  makingChargePerGram: number;
  equivalentPercentage: number;
  gstOnMakingCharges: number;
  finalTotalBill: number;
}

export interface OfferComparisonResult {
  offers: CalculatedOffer[];
  cheapestIndex: number;
  cheapestOfferName: string;
  differenceInMakingCharges: number;
  differenceInPercentage: number;
  differencePerGram: number;
  differenceInTotalBillWithGst: number;
}

export interface NegotiationSavingsResult {
  currentMakingCharges: number;
  currentPerGram: number;
  currentEquivalentPct: number;
  desiredMakingCharges: number;
  desiredPerGram: number;
  desiredEquivalentPct: number;
  preTaxSavings: number;
  gstSavings: number;
  totalSavingsWithGst: number;
  savingsPercentage: number;
  savingsPerGram: number;
}

export interface BudgetWeightResult {
  budgetINR: number;
  affordableWeightGrams: number;
  verifiedFinalTotalINR: number;
  differenceFromBudgetINR: number;
  makingChargesAtAffordableWeight: number;
  makingChargePerGram: number;
  goldValueAtAffordableWeight: number;
}

export interface MakingChargeInsight {
  title: string;
  text: string;
  type: "highlight" | "tip" | "comparison" | "tax";
}

/**
 * Calculates complete gold making charges and equivalent conversions
 */
export function calculateGoldMakingCharges(inputs: MakingChargesInputs): CalculatedMakingCharges {
  // 1. Weight Conversion
  const goldWeightGrams = convertWeightToGrams(inputs.goldWeight, inputs.weightUnit);

  // 2. Gold Rate Calculation
  const baseRatePerGram = convertRateToPerGram(inputs.goldRate, inputs.goldRateBasis);
  const finenessRatio = getPurityFineness(inputs.purity, inputs.customKarat, inputs.customFinenessPct);

  let effectiveGoldRatePerGram = baseRatePerGram;
  if (inputs.goldRateType === "derived_from_24k") {
    effectiveGoldRatePerGram = baseRatePerGram * finenessRatio;
  }

  const ratePer10g = effectiveGoldRatePerGram * 10;
  const purityDef = PURITY_DEFINITIONS[inputs.purity];
  const purityLabel = purityDef ? purityDef.shortLabel : `${inputs.customKarat || 22}K`;

  // 3. Raw Gold Value
  const rawGoldValue = goldWeightGrams * effectiveGoldRatePerGram;

  // 4. Raw Making Charges (before discount)
  let originalMakingCharges = 0;
  if (inputs.makingChargeMethod === "percentage") {
    const pct = Math.max(0, inputs.makingChargePercentage || 0);
    originalMakingCharges = (rawGoldValue * pct) / 100;
  } else if (inputs.makingChargeMethod === "per_gram") {
    const ratePerGramCharge = Math.max(0, inputs.makingChargePerGram || 0);
    originalMakingCharges = goldWeightGrams * ratePerGramCharge;
  } else if (inputs.makingChargeMethod === "flat") {
    originalMakingCharges = Math.max(0, inputs.flatMakingCharge || 0);
  }

  // 5. Discount
  let makingChargeDiscount = 0;
  if (inputs.discountType === "percentage") {
    const discountPct = Math.max(0, Math.min(100, inputs.discountValue || 0));
    makingChargeDiscount = (originalMakingCharges * discountPct) / 100;
  } else if (inputs.discountType === "flat") {
    const flatDisc = Math.max(0, inputs.discountValue || 0);
    makingChargeDiscount = Math.min(flatDisc, originalMakingCharges);
  }

  const netMakingCharges = Math.max(0, originalMakingCharges - makingChargeDiscount);

  // 6. Equivalent Conversions (Core Differentiating Feature)
  const makingChargePerGram = goldWeightGrams > 0 ? netMakingCharges / goldWeightGrams : 0;
  const makingChargePercentageEquivalent = rawGoldValue > 0 ? (netMakingCharges / rawGoldValue) * 100 : 0;
  const makingChargePer10g = makingChargePerGram * 10;

  // 7. Wastage / Value Addition (Optional)
  let wastageValue = 0;
  if (inputs.wastageType === "percentage") {
    const wastagePct = Math.max(0, inputs.wastageValue || 0);
    wastageValue = (rawGoldValue * wastagePct) / 100;
  } else if (inputs.wastageType === "weight_grams") {
    const wastageGrams = Math.max(0, inputs.wastageValue || 0);
    wastageValue = wastageGrams * effectiveGoldRatePerGram;
  } else if (inputs.wastageType === "flat") {
    wastageValue = Math.max(0, inputs.wastageValue || 0);
  }

  const wastageEquivalentPct = rawGoldValue > 0 ? (wastageValue / rawGoldValue) * 100 : 0;
  const totalAdditionalCharges = netMakingCharges + wastageValue;

  // 8. Taxable Transaction Value & GST
  // Standard retail jewellery sale: GST applies at 3% of the total transaction value
  const taxableTransactionValue = Math.max(0, rawGoldValue + wastageValue + netMakingCharges);
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

  // Tax attributable specifically to making charges
  const gstOnMakingCharges = (netMakingCharges * gstRatePct) / 100;

  // Final Total Amount
  const finalTotalJewelleryAmount = taxableTransactionValue + totalGstAmount;

  // Percentage Shares
  const makingChargesShareOfPreTaxPct =
    taxableTransactionValue > 0 ? (netMakingCharges / taxableTransactionValue) * 100 : 0;
  const makingChargesShareOfTotalBillPct =
    finalTotalJewelleryAmount > 0 ? ((netMakingCharges + gstOnMakingCharges) / finalTotalJewelleryAmount) * 100 : 0;

  return {
    goldWeightGrams,
    selectedPurity: inputs.purity,
    purityLabel,
    finenessRatio,
    effectiveGoldRatePerGram,
    ratePer10g,
    rawGoldValue,
    selectedMethod: inputs.makingChargeMethod,
    originalMakingCharges,
    makingChargeDiscount,
    netMakingCharges,
    makingChargePerGram,
    makingChargePercentageEquivalent,
    makingChargePer10g,
    wastageValue,
    wastageEquivalentPct,
    totalAdditionalCharges,
    taxableTransactionValue,
    gstRatePct,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalGstAmount,
    gstOnMakingCharges,
    finalTotalJewelleryAmount,
    makingChargesShareOfPreTaxPct,
    makingChargesShareOfTotalBillPct,
  };
}

/**
 * Compares 2 or 3 jeweller making charge quotations side-by-side
 */
export function compareMakingChargeOffers(
  baseInputs: MakingChargesInputs,
  offers: JewellerOfferInput[]
): OfferComparisonResult {
  const calculatedOffers: CalculatedOffer[] = offers.map((offer) => {
    const offerInputs: MakingChargesInputs = {
      ...baseInputs,
      makingChargeMethod: offer.method,
      makingChargePercentage: offer.method === "percentage" ? offer.value : 0,
      makingChargePerGram: offer.method === "per_gram" ? offer.value : 0,
      flatMakingCharge: offer.method === "flat" ? offer.value : 0,
      discountType: offer.discountPct && offer.discountPct > 0 ? "percentage" : "none",
      discountValue: offer.discountPct || 0,
    };

    const res = calculateGoldMakingCharges(offerInputs);

    return {
      jewellerName: offer.jewellerName,
      method: offer.method,
      inputValue: offer.value,
      originalMakingCharges: res.originalMakingCharges,
      discountAmount: res.makingChargeDiscount,
      netMakingCharges: res.netMakingCharges,
      makingChargePerGram: res.makingChargePerGram,
      equivalentPercentage: res.makingChargePercentageEquivalent,
      gstOnMakingCharges: res.gstOnMakingCharges,
      finalTotalBill: res.finalTotalJewelleryAmount,
    };
  });

  // Find lowest making charge
  let cheapestIndex = 0;
  let minMaking = Infinity;
  let maxMaking = -Infinity;

  calculatedOffers.forEach((o, idx) => {
    if (o.netMakingCharges < minMaking) {
      minMaking = o.netMakingCharges;
      cheapestIndex = idx;
    }
    if (o.netMakingCharges > maxMaking) {
      maxMaking = o.netMakingCharges;
    }
  });

  const diffMaking = Math.max(0, maxMaking - minMaking);
  const diffPct = minMaking > 0 ? (diffMaking / minMaking) * 100 : 0;
  const weight = convertWeightToGrams(baseInputs.goldWeight, baseInputs.weightUnit);
  const diffPerGram = weight > 0 ? diffMaking / weight : 0;
  const diffWithGst = diffMaking * (1 + (baseInputs.gstRatePct ?? 3) / 100);

  return {
    offers: calculatedOffers,
    cheapestIndex,
    cheapestOfferName: calculatedOffers[cheapestIndex]?.jewellerName || "Jeweller 1",
    differenceInMakingCharges: diffMaking,
    differenceInPercentage: diffPct,
    differencePerGram: diffPerGram,
    differenceInTotalBillWithGst: diffWithGst,
  };
}

/**
 * Calculates the exact financial difference when negotiating making charges
 */
export function calculateMakingChargeNegotiationSavings(
  baseInputs: MakingChargesInputs,
  currentValue: number,
  currentMethod: MakingChargeType,
  desiredValue: number,
  desiredMethod: MakingChargeType
): NegotiationSavingsResult {
  const currentInputs: MakingChargesInputs = {
    ...baseInputs,
    makingChargeMethod: currentMethod,
    makingChargePercentage: currentMethod === "percentage" ? currentValue : 0,
    makingChargePerGram: currentMethod === "per_gram" ? currentValue : 0,
    flatMakingCharge: currentMethod === "flat" ? currentValue : 0,
    discountType: "none",
    discountValue: 0,
  };

  const desiredInputs: MakingChargesInputs = {
    ...baseInputs,
    makingChargeMethod: desiredMethod,
    makingChargePercentage: desiredMethod === "percentage" ? desiredValue : 0,
    makingChargePerGram: desiredMethod === "per_gram" ? desiredValue : 0,
    flatMakingCharge: desiredMethod === "flat" ? desiredValue : 0,
    discountType: "none",
    discountValue: 0,
  };

  const currentRes = calculateGoldMakingCharges(currentInputs);
  const desiredRes = calculateGoldMakingCharges(desiredInputs);

  const preTaxSavings = Math.max(0, currentRes.netMakingCharges - desiredRes.netMakingCharges);
  const gstRate = (baseInputs.gstRatePct ?? 3) / 100;
  const gstSavings = preTaxSavings * gstRate;
  const totalSavingsWithGst = preTaxSavings + gstSavings;
  const savingsPercentage =
    currentRes.netMakingCharges > 0 ? (preTaxSavings / currentRes.netMakingCharges) * 100 : 0;
  const weight = currentRes.goldWeightGrams;
  const savingsPerGram = weight > 0 ? preTaxSavings / weight : 0;

  return {
    currentMakingCharges: currentRes.netMakingCharges,
    currentPerGram: currentRes.makingChargePerGram,
    currentEquivalentPct: currentRes.makingChargePercentageEquivalent,
    desiredMakingCharges: desiredRes.netMakingCharges,
    desiredPerGram: desiredRes.makingChargePerGram,
    desiredEquivalentPct: desiredRes.makingChargePercentageEquivalent,
    preTaxSavings,
    gstSavings,
    totalSavingsWithGst,
    savingsPercentage,
    savingsPerGram,
  };
}

/**
 * Reverse calculation: Solves for maximum affordable net gold weight in grams given a total budget (₹)
 * and verifies that the resulting weight yields the exact budget within ±₹1 tolerance.
 */
export function calculateAffordableWeightFromBudget(
  budgetINR: number,
  baseInputs: Omit<MakingChargesInputs, "goldWeight" | "weightUnit">
): BudgetWeightResult {
  const budget = Math.max(0, Number(budgetINR) || 0);
  const gstMultiplier = 1 + (baseInputs.gstRatePct ?? 3) / 100;
  const preTaxBudget = budget / gstMultiplier;

  // Rate per gram
  const baseRatePerGram = convertRateToPerGram(baseInputs.goldRate, baseInputs.goldRateBasis);
  const fineness = getPurityFineness(baseInputs.purity, baseInputs.customKarat, baseInputs.customFinenessPct);
  const effectiveRate =
    baseInputs.goldRateType === "derived_from_24k" ? baseRatePerGram * fineness : baseRatePerGram;

  if (effectiveRate <= 0 || budget <= 0) {
    return {
      budgetINR: budget,
      affordableWeightGrams: 0,
      verifiedFinalTotalINR: 0,
      differenceFromBudgetINR: 0,
      makingChargesAtAffordableWeight: 0,
      makingChargePerGram: 0,
      goldValueAtAffordableWeight: 0,
    };
  }

  // Wastage per gram multiplier or flat
  let wastageMultiplier = 0;
  let flatWastage = 0;
  if (baseInputs.wastageType === "percentage") {
    wastageMultiplier = (Math.max(0, baseInputs.wastageValue || 0)) / 100;
  } else if (baseInputs.wastageType === "weight_grams") {
    wastageMultiplier = 0; // Handled per gram if grams entered
  } else if (baseInputs.wastageType === "flat") {
    flatWastage = Math.max(0, baseInputs.wastageValue || 0);
  }

  // Discount multiplier
  let discountMultiplier = 1;
  let flatDiscount = 0;
  if (baseInputs.discountType === "percentage") {
    discountMultiplier = 1 - Math.max(0, Math.min(100, baseInputs.discountValue || 0)) / 100;
  } else if (baseInputs.discountType === "flat") {
    flatDiscount = Math.max(0, baseInputs.discountValue || 0);
  }

  let affordableGrams = 0;

  if (baseInputs.makingChargeMethod === "percentage") {
    // Making = Weight * Rate * (Making% / 100) * discountMultiplier
    // PreTax = Weight * Rate * (1 + wastageMultiplier + (Making% / 100) * discountMultiplier) + flatWastage - flatDiscount
    const makingPerGramRate = (Math.max(0, baseInputs.makingChargePercentage || 0) / 100) * discountMultiplier;
    const totalCostFactorPerGram = effectiveRate * (1 + wastageMultiplier + makingPerGramRate);
    const availablePreTax = Math.max(0, preTaxBudget - flatWastage + flatDiscount);
    affordableGrams = totalCostFactorPerGram > 0 ? availablePreTax / totalCostFactorPerGram : 0;
  } else if (baseInputs.makingChargeMethod === "per_gram") {
    // Making = Weight * (makingChargePerGram * discountMultiplier)
    // PreTax = Weight * [ Rate * (1 + wastageMultiplier) + (makingChargePerGram * discountMultiplier) ] + flatWastage - flatDiscount
    const makingPerGramAmount = Math.max(0, baseInputs.makingChargePerGram || 0) * discountMultiplier;
    const totalCostFactorPerGram = effectiveRate * (1 + wastageMultiplier) + makingPerGramAmount;
    const availablePreTax = Math.max(0, preTaxBudget - flatWastage + flatDiscount);
    affordableGrams = totalCostFactorPerGram > 0 ? availablePreTax / totalCostFactorPerGram : 0;
  } else if (baseInputs.makingChargeMethod === "flat") {
    // Making is fixed amount
    const netFlatMaking = Math.max(0, (baseInputs.flatMakingCharge || 0) * discountMultiplier);
    const fixedCharges = netFlatMaking + flatWastage - flatDiscount;
    const availableForGold = Math.max(0, preTaxBudget - fixedCharges);
    const totalCostFactorPerGram = effectiveRate * (1 + wastageMultiplier);
    affordableGrams = totalCostFactorPerGram > 0 ? availableForGold / totalCostFactorPerGram : 0;
  }

  // Round weight to 3 decimal places (standard Indian jewellery scale precision, 1 milligram = 0.001g)
  const roundedWeightGrams = Math.max(0, Math.round(affordableGrams * 1000) / 1000);

  // Verification pass through forward calculator
  const verificationInputs: MakingChargesInputs = {
    ...baseInputs,
    goldWeight: roundedWeightGrams,
    weightUnit: "grams",
  };
  const verifiedRes = calculateGoldMakingCharges(verificationInputs);

  return {
    budgetINR: budget,
    affordableWeightGrams: roundedWeightGrams,
    verifiedFinalTotalINR: verifiedRes.finalTotalJewelleryAmount,
    differenceFromBudgetINR: Math.round((verifiedRes.finalTotalJewelleryAmount - budget) * 100) / 100,
    makingChargesAtAffordableWeight: verifiedRes.netMakingCharges,
    makingChargePerGram: verifiedRes.makingChargePerGram,
    goldValueAtAffordableWeight: verifiedRes.rawGoldValue,
  };
}

/**
 * Generates dynamic, data-driven insights tailored to the calculated making charges
 */
export function generateMakingChargeInsights(calc: CalculatedMakingCharges): MakingChargeInsight[] {
  const insights: MakingChargeInsight[] = [];

  // Insight 1: Equivalent metrics summary
  insights.push({
    title: "Equivalent Pricing Conversion",
    text: `Your making charge of ₹${Math.round(calc.netMakingCharges).toLocaleString("en-IN")} works out to ₹${Math.round(calc.makingChargePerGram).toLocaleString("en-IN")} per gram, which is equivalent to ${calc.makingChargePercentageEquivalent.toFixed(2)}% of the gold value.`,
    type: "highlight",
  });

  // Insight 2: Share of jewellery bill
  insights.push({
    title: "Bill Composition Impact",
    text: `Making charges represent ${calc.makingChargesShareOfPreTaxPct.toFixed(1)}% of your pre-tax jewellery bill and account for ₹${Math.round(calc.gstOnMakingCharges).toLocaleString("en-IN")} in GST. Pure gold constitutes ${(100 - calc.makingChargesShareOfPreTaxPct).toFixed(1)}% of the value.`,
    type: "tax",
  });

  // Insight 3: Negotiation leverage
  if (calc.rawGoldValue > 0) {
    const savingsPer1Pct = Math.round((calc.rawGoldValue * 0.01) * (1 + calc.gstRatePct / 100));
    insights.push({
      title: "Negotiation Rule of Thumb",
      text: `Every 1% reduction in making charges saves approximately ₹${savingsPer1Pct.toLocaleString("en-IN")} on this jewellery piece (including 3% GST savings).`,
      type: "tip",
    });
  }

  // Insight 4: Pricing Method Context
  if (calc.selectedMethod === "flat") {
    insights.push({
      title: "Flat Making Fee Reality",
      text: `On a ${calc.goldWeightGrams.toFixed(2)}g item, a flat fee of ₹${Math.round(calc.netMakingCharges).toLocaleString("en-IN")} equals ₹${Math.round(calc.makingChargePerGram).toLocaleString("en-IN")}/g. On heavier items flat fees offer higher savings, whereas on lightweight items they can represent a higher percentage.`,
      type: "highlight",
    });
  } else if (calc.selectedMethod === "per_gram") {
    insights.push({
      title: "Per-Gram Transparency",
      text: `Paying ₹${Math.round(calc.makingChargePerGram).toLocaleString("en-IN")}/g is straightforward because your making cost scales directly with weight rather than rising when gold bullion prices fluctuate.`,
      type: "highlight",
    });
  } else {
    insights.push({
      title: "Percentage Pricing Behavior",
      text: `With percentage pricing (${calc.makingChargePercentageEquivalent.toFixed(1)}%), if daily gold rates rise, the rupee cost of your making charges increases proportionally even though the craftsmanship effort remains the same.`,
      type: "tip",
    });
  }

  return insights;
}
