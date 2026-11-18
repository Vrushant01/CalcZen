export type GoldWeightUnit = "grams" | "tenGrams" | "tola" | "oz";
export type GoldValuationKarat = "24K" | "22K" | "18K" | "14K";
export type MakingChargeType = "percent" | "perGram";

export interface GoldValueInputs {
  weight: number;
  unit: GoldWeightUnit;
  karat: GoldValuationKarat;
  rate24kPerGram: number; // e.g. 7500
  makingChargeType?: MakingChargeType;
  makingChargeValue?: number; // e.g. 10 for 10% or 450 for ₹450/g
  gstPct?: number; // default 3%
}

export interface KaratPriceSummary {
  karat: GoldValuationKarat;
  purityPercent: string;
  pricePerGram: number;
  pricePer10g: number;
}

export interface GoldValueResult {
  weightInGrams: number;
  purityFactor: number;
  goldBaseValue: number;
  makingChargesAmount: number;
  subtotalWithMaking: number;
  gstAmount: number;
  finalTotalAmount: number;
  priceSummaryTable: KaratPriceSummary[];
}

const UNIT_TO_GRAMS: Record<GoldWeightUnit, number> = {
  grams: 1.0,
  tenGrams: 10.0,
  tola: 11.6638,
  oz: 31.1035, // Troy ounce for precious metals
};

const PURITY_FACTORS: Record<GoldValuationKarat, number> = {
  "24K": 1.0,
  "22K": 22 / 24, // 0.9166667
  "18K": 18 / 24, // 0.75
  "14K": 14 / 24, // 0.5833333
};

export function calculateGoldValue(inputs: GoldValueInputs): GoldValueResult {
  const rawWeight = Math.max(0, Number(inputs.weight) || 0);
  const unitFactor = UNIT_TO_GRAMS[inputs.unit] || 1.0;
  const weightInGrams = rawWeight * unitFactor;

  const karat = inputs.karat || "22K";
  const purityFactor = PURITY_FACTORS[karat] || PURITY_FACTORS["22K"];
  const rate24k = Math.max(0, Number(inputs.rate24kPerGram) || 0);

  // Base gold value
  const effectivePerGramRate = rate24k * purityFactor;
  const goldBaseValue = Math.round(weightInGrams * effectivePerGramRate);

  // Making charges
  const mcType = inputs.makingChargeType || "percent";
  const mcValue = Math.max(0, Number(inputs.makingChargeValue) || 0);
  let makingChargesAmount = 0;
  if (mcType === "percent") {
    makingChargesAmount = Math.round((goldBaseValue * mcValue) / 100);
  } else {
    makingChargesAmount = Math.round(weightInGrams * mcValue);
  }

  const subtotalWithMaking = goldBaseValue + makingChargesAmount;

  // GST (standard 3% on jewellery value + making charges in India)
  const gstPct = inputs.gstPct !== undefined ? Math.max(0, Number(inputs.gstPct)) : 3.0;
  const gstAmount = Math.round((subtotalWithMaking * gstPct) / 100);
  const finalTotalAmount = subtotalWithMaking + gstAmount;

  // Small table of 24K, 22K, 18K price per gram and per 10g
  const karats: GoldValuationKarat[] = ["24K", "22K", "18K", "14K"];
  const priceSummaryTable: KaratPriceSummary[] = karats.map((k) => {
    const factor = PURITY_FACTORS[k];
    const pGram = Math.round(rate24k * factor);
    const p10g = Math.round(rate24k * factor * 10);
    const pctStr = (factor * 100).toFixed(1) + "%";
    return {
      karat: k,
      purityPercent: pctStr,
      pricePerGram: pGram,
      pricePer10g: p10g,
    };
  });

  return {
    weightInGrams: Number(weightInGrams.toFixed(3)),
    purityFactor: Number(purityFactor.toFixed(4)),
    goldBaseValue,
    makingChargesAmount,
    subtotalWithMaking,
    gstAmount,
    finalTotalAmount,
    priceSummaryTable,
  };
}
