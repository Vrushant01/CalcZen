export interface RooftopSolarInputs {
  inputMode: 'bill' | 'units';
  monthlyElectricityBill?: number; // ₹ per month
  monthlyUnitsConsumed?: number; // kWh per month
  tariffRatePerUnit: number; // ₹ per kWh, default 7.5
  roofAreaSqFt: number; // available rooftop area
  costPerKw?: number; // installation benchmark ₹/kW, default 60000
  includeSubsidy?: boolean; // default true (PM Surya Ghar)
}

export interface YearProjection {
  year: number;
  annualGenerationKwh: number;
  annualSavings: number;
  cumulativeSavings: number;
  netFinancialPosition: number; // cumulative savings - net cost
}

export interface RooftopSolarResult {
  monthlyUnitsConsumed: number;
  recommendedKw: number;
  maxFeasibleKwByRoof: number;
  finalSystemKw: number;
  requiredRoofAreaSqFt: number;
  dailyGenerationUnits: number;
  monthlyGenerationUnits: number;
  annualGenerationUnits: number;
  grossSystemCost: number;
  subsidyAmount: number;
  netSystemCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackPeriodYears: number;
  twentyFiveYearSavings: number;
  co2SavedTonnesPerYear: number;
  equivalentTreesPlanted: number;
  yearlyProjections: YearProjection[];
  roofConstraintWarning: boolean;
}

export const SQ_FT_PER_KW = 100; // MNRE standard rule of thumb for shadow-free space
export const UNITS_PER_KW_PER_DAY = 4.0; // Pan-India average daily generation

export function calculatePmSuryaGharSubsidy(kw: number): number {
  if (kw <= 0) return 0;
  if (kw < 1) {
    // Pro-rata for less than 1 kW
    return Math.round(kw * 30000);
  } else if (kw < 2) {
    // 1 kW to 2 kW: ₹30,000 for 1st kW + ₹30,000 * fraction
    return Math.round(30000 + (kw - 1) * 30000);
  } else if (kw < 3) {
    // 2 kW to 3 kW: ₹60,000 for first 2 kW + ₹18,000 * fraction (up to ₹78,000)
    return Math.round(60000 + (kw - 2) * 18000);
  } else {
    // 3 kW and above is capped at ₹78,000 under PM Surya Ghar
    return 78000;
  }
}

export function calculateRooftopSolar(inputs: RooftopSolarInputs): RooftopSolarResult {
  const tariff = Math.max(1, Number(inputs.tariffRatePerUnit) || 7.5);
  const costPerKw = Math.max(20000, Number(inputs.costPerKw) || 60000);
  const roofArea = Math.max(0, Number(inputs.roofAreaSqFt) || 0);

  let monthlyUnits = 0;
  if (inputs.inputMode === 'bill') {
    const bill = Math.max(0, Number(inputs.monthlyElectricityBill) || 0);
    monthlyUnits = tariff > 0 ? bill / tariff : 0;
  } else {
    monthlyUnits = Math.max(0, Number(inputs.monthlyUnitsConsumed) || 0);
  }

  // Monthly units generated per 1 kW = 4 units/day * 30 days = 120 units/month
  const monthlyUnitsPerKw = UNITS_PER_KW_PER_DAY * 30;
  let idealKw = monthlyUnits > 0 ? monthlyUnits / monthlyUnitsPerKw : 1;
  // Round to nearest 0.5 kW, minimum 1 kW
  idealKw = Math.max(1, Math.round(idealKw * 2) / 2);

  const maxFeasibleKw = Math.floor((roofArea / SQ_FT_PER_KW) * 2) / 2;
  const roofConstraintWarning = roofArea > 0 && maxFeasibleKw < idealKw;

  // Final system size takes roof area into account if roof area is specified (> 0)
  const finalSystemKw = roofArea > 0 ? Math.min(idealKw, Math.max(0.5, maxFeasibleKw)) : idealKw;

  const requiredRoofAreaSqFt = Math.round(finalSystemKw * SQ_FT_PER_KW);
  const dailyGenerationUnits = Number((finalSystemKw * UNITS_PER_KW_PER_DAY).toFixed(1));
  const monthlyGenerationUnits = Math.round(dailyGenerationUnits * 30);
  const annualGenerationUnits = Math.round(dailyGenerationUnits * 365);

  const grossSystemCost = Math.round(finalSystemKw * costPerKw);
  const includeSubsidy = inputs.includeSubsidy !== false;
  const subsidyAmount = includeSubsidy ? calculatePmSuryaGharSubsidy(finalSystemKw) : 0;
  const netSystemCost = Math.max(0, grossSystemCost - subsidyAmount);

  // Monthly savings is generation * tariff, but cannot exceed monthly consumption bill
  const rawMonthlySavings = monthlyGenerationUnits * tariff;
  const monthlyBillEquivalent = monthlyUnits * tariff;
  // In net metering, excess units are credited or banked at DISCOM tariff/APPC
  const monthlySavings = Math.round(rawMonthlySavings);
  const annualSavings = Math.round(monthlySavings * 12);

  const paybackPeriodYears = annualSavings > 0
    ? Number((netSystemCost / annualSavings).toFixed(1))
    : 0;

  // 25-Year projection:
  // Panels degrade ~0.7% annually; grid tariffs typically inflate ~3% annually
  const yearlyProjections: YearProjection[] = [];
  let cumulativeSavings = 0;
  let currentYearGeneration = annualGenerationUnits;
  let currentTariff = tariff;

  for (let year = 1; year <= 25; year++) {
    const yearSavings = Math.round(currentYearGeneration * currentTariff);
    cumulativeSavings += yearSavings;
    yearlyProjections.push({
      year,
      annualGenerationKwh: Math.round(currentYearGeneration),
      annualSavings: yearSavings,
      cumulativeSavings,
      netFinancialPosition: cumulativeSavings - netSystemCost,
    });
    currentYearGeneration *= 0.993; // 0.7% degradation
    currentTariff *= 1.03; // 3% inflation
  }

  const twentyFiveYearSavings = cumulativeSavings;

  // Environmental impact: Central Electricity Authority (CEA) CO2 baseline ~0.82 kg/kWh
  const co2SavedTonnesPerYear = Number(((annualGenerationUnits * 0.82) / 1000).toFixed(2));
  // 1 tree absorbs ~20 kg CO2 / year
  const equivalentTreesPlanted = Math.round((annualGenerationUnits * 0.82) / 20);

  return {
    monthlyUnitsConsumed: Math.round(monthlyUnits),
    recommendedKw: idealKw,
    maxFeasibleKwByRoof: maxFeasibleKw,
    finalSystemKw,
    requiredRoofAreaSqFt,
    dailyGenerationUnits,
    monthlyGenerationUnits,
    annualGenerationUnits,
    grossSystemCost,
    subsidyAmount,
    netSystemCost,
    monthlySavings,
    annualSavings,
    paybackPeriodYears,
    twentyFiveYearSavings,
    co2SavedTonnesPerYear,
    equivalentTreesPlanted,
    yearlyProjections,
    roofConstraintWarning,
  };
}
