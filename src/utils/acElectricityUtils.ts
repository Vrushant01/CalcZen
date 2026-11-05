/**
 * AC Electricity Cost Calculator Utilities (India)
 * Authoritative calculations for Air Conditioner electricity consumption,
 * running costs, BEE star label benchmarks, and Indian state electricity tariff impacts.
 *
 * Adheres to:
 * - Bureau of Energy Efficiency (BEE) Star Rating Standards (IS 1391 Part 1 & 2)
 * - Central Electricity Authority (CEA) guidelines
 * - Indian State Electricity Regulatory Commissions (GERC, MERC, DERC, KERC, TNERC, UPERC)
 */

export type CalculationMethod = "wattage" | "bee_label" | "tonnage_approx";
export type PowerUnit = "W" | "kW";
export type AcType = "inverter" | "non_inverter" | "not_sure";
export type TariffCalculationMode = "simple" | "tariff_slab";

export interface TariffSlab {
  minUnits: number;
  maxUnits: number | null; // null represents infinity / above threshold
  ratePerUnitINR: number;
}

export interface DiscomTariffProfile {
  id: string;
  state: string;
  discomName: string;
  categoryName: string;
  effectiveDate: string;
  officialSource: string;
  slabs: TariffSlab[];
  electricityDutyPct: number;
  fuelSurchargePerUnitINR: number; // FPPPA / FAC / PPAC
  fixedMonthlyChargesINR: number;
}

export interface AcCalculationInputs {
  // Method selection
  method: CalculationMethod;

  // Power inputs (Method A & Tonnage helper)
  powerInput: number; // entered numeric value
  powerUnit: PowerUnit; // "W" or "kW"
  acType: AcType;
  inverterPowerMode: "rated_max" | "average_operating";
  inverterOperatingFactor: number; // default 0.70 (70% average power)

  // Tonnage approximation helper
  tonnage: number; // 0.75, 1.0, 1.5, 2.0
  starRating: number; // 1 to 5

  // BEE Label input (Method B)
  beeAnnualConsumptionKWh: number; // from BEE label sticker (1600 hours standard)

  // Usage inputs
  acCount: number;
  dailyUsageHours: number;
  operatingDaysPerMonth: number;
  operatingMonthsPerYear: number;

  // Tariff & Rate inputs
  tariffMode: TariffCalculationMode;
  simpleRatePerUnitINR: number; // e.g. ₹8.00 / kWh
  selectedDiscomId: string;
  existingMonthlyHouseholdUnits: number; // base consumption without AC
  customSlabs: TariffSlab[];
  customDutyPct: number;
  customFuelSurchargePerUnitINR: number;
}

export interface UsageScenarioItem {
  hoursPerDay: number;
  dailyUnits: number;
  monthlyUnits: number;
  dailyCostINR: number;
  monthlyCostINR: number;
  annualCostINR: number;
  monthlySavingsVsCurrentINR: number;
}

export interface AcCalculationResult {
  // Power & Operating assumption
  effectivePowerWatts: number;
  effectivePowerKW: number;
  isApproximatedInverter: boolean;
  powerCalculationNote: string;

  // Electricity Units (kWh)
  dailyUnits: number;
  monthlyUnits: number;
  annualUnits: number;

  // Cost outputs (Simple or Tariff-based)
  dailyCostINR: number;
  monthlyCostINR: number;
  annualCostINR: number;
  effectiveCostPerUnitINR: number;

  // Incremental Bill Impact (in Tariff Mode)
  isTariffModeActive: boolean;
  householdBaseUnits: number;
  householdWithAcUnits: number;
  householdBaseBillINR: number;
  householdWithAcBillINR: number;
  incrementalMonthlyAcCostINR: number;
  effectiveMarginalRateINR: number;
  discomProfileName: string;

  // Scenarios & Insights
  scenarios: UsageScenarioItem[];
  savings1HourPerDayMonthlyINR: number;
  savings2HoursPerDayMonthlyINR: number;
  thermostatOptimizationSavingsMonthlyINR: number; // 24°C vs 20°C (~24%)

  // Calculation explanation steps
  calculationSteps: Array<{
    title: string;
    description: string;
    formula: string;
    substitution: string;
    result: string;
  }>;
}

export interface AcComparisonInputs {
  acAName: string;
  acAPowerWatts: number;
  acABeeAnnualKWh?: number;
  acAIsBee: boolean;

  acBName: string;
  acBPowerWatts: number;
  acBBeeAnnualKWh?: number;
  acBIsBee: boolean;

  dailyHours: number;
  operatingDaysPerMonth: number;
  operatingMonthsPerYear: number;
  electricityRateINR: number;
}

export interface AcComparisonResult {
  acAMonthlyUnits: number;
  acAMonthlyCostINR: number;
  acAAnnualCostINR: number;

  acBMonthlyUnits: number;
  acBMonthlyCostINR: number;
  acBAnnualCostINR: number;

  monthlyCostDifferenceINR: number; // positive means B is cheaper
  annualCostDifferenceINR: number;
  fiveYearCostDifferenceINR: number;
  cheaperModelName: string;
  percentageSavings: number;
}

// -------------------------------------------------------------
// VERIFIED INDIAN DISCOM TARIFF PROFILES (FY 2026-27 SCHEDULES)
// -------------------------------------------------------------

export const INDIAN_DISCOM_PROFILES: DiscomTariffProfile[] = [
  {
    id: "gujarat_gerc",
    state: "Gujarat",
    discomName: "UGVCL / DGVCL / MGVCL / PGVCL (GERC)",
    categoryName: "RGP (Residential General Purpose)",
    effectiveDate: "1 April 2026",
    officialSource: "GERC Tariff Order & DISCOM Retail Tariff Schedule",
    electricityDutyPct: 15.0,
    fuelSurchargePerUnitINR: 2.35, // Average FPPPA
    fixedMonthlyChargesINR: 35.0,
    slabs: [
      { minUnits: 0, maxUnits: 50, ratePerUnitINR: 3.05 },
      { minUnits: 50, maxUnits: 100, ratePerUnitINR: 3.5 },
      { minUnits: 100, maxUnits: 250, ratePerUnitINR: 4.15 },
      { minUnits: 250, maxUnits: null, ratePerUnitINR: 5.2 },
    ],
  },
  {
    id: "maharashtra_msedcl",
    state: "Maharashtra",
    discomName: "MSEDCL (Mahavitaran)",
    categoryName: "LT-I (Residential)",
    effectiveDate: "1 April 2026",
    officialSource: "MERC Multi-Year Tariff Order",
    electricityDutyPct: 16.0,
    fuelSurchargePerUnitINR: 0.95,
    fixedMonthlyChargesINR: 115.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 5.88 },
      { minUnits: 100, maxUnits: 300, ratePerUnitINR: 11.26 },
      { minUnits: 300, maxUnits: 500, ratePerUnitINR: 15.72 },
      { minUnits: 500, maxUnits: null, ratePerUnitINR: 17.81 },
    ],
  },
  {
    id: "delhi_bses",
    state: "Delhi",
    discomName: "BSES Rajdhani / Yamuna (DERC)",
    categoryName: "Domestic Lighting & Power",
    effectiveDate: "FY 2026-27",
    officialSource: "DERC Tariff Order",
    electricityDutyPct: 5.0,
    fuelSurchargePerUnitINR: 1.5, // PPAC approx 8.75%
    fixedMonthlyChargesINR: 40.0,
    slabs: [
      { minUnits: 0, maxUnits: 200, ratePerUnitINR: 3.0 },
      { minUnits: 200, maxUnits: 400, ratePerUnitINR: 4.5 },
      { minUnits: 400, maxUnits: 800, ratePerUnitINR: 6.5 },
      { minUnits: 800, maxUnits: 1200, ratePerUnitINR: 7.0 },
      { minUnits: 1200, maxUnits: null, ratePerUnitINR: 8.0 },
    ],
  },
  {
    id: "karnataka_bescom",
    state: "Karnataka",
    discomName: "BESCOM (Bangalore Electricity)",
    categoryName: "LT-2(a) Domestic",
    effectiveDate: "1 April 2026",
    officialSource: "KERC Tariff Regulations",
    electricityDutyPct: 9.0,
    fuelSurchargePerUnitINR: 0.8,
    fixedMonthlyChargesINR: 85.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 4.75 },
      { minUnits: 100, maxUnits: null, ratePerUnitINR: 7.0 },
    ],
  },
  {
    id: "tamilnadu_tangedco",
    state: "Tamil Nadu",
    discomName: "TANGEDCO",
    categoryName: "Tariff IA (Domestic)",
    effectiveDate: "FY 2026-27",
    officialSource: "TNERC Comprehensive Tariff Schedule",
    electricityDutyPct: 0.0,
    fuelSurchargePerUnitINR: 0.0,
    fixedMonthlyChargesINR: 0.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 0.0 }, // First 100 units free in TN
      { minUnits: 100, maxUnits: 200, ratePerUnitINR: 2.25 },
      { minUnits: 200, maxUnits: 400, ratePerUnitINR: 4.5 },
      { minUnits: 400, maxUnits: 500, ratePerUnitINR: 6.0 },
      { minUnits: 500, maxUnits: null, ratePerUnitINR: 8.0 },
    ],
  },
  {
    id: "uttar_pradesh_uppcl",
    state: "Uttar Pradesh",
    discomName: "UPPCL (Urban Domestic)",
    categoryName: "LMV-1 (Domestic)",
    effectiveDate: "FY 2026-27",
    officialSource: "UPERC Tariff Schedule",
    electricityDutyPct: 5.0,
    fuelSurchargePerUnitINR: 0.65,
    fixedMonthlyChargesINR: 110.0,
    slabs: [
      { minUnits: 0, maxUnits: 150, ratePerUnitINR: 5.5 },
      { minUnits: 150, maxUnits: 300, ratePerUnitINR: 6.0 },
      { minUnits: 300, maxUnits: 500, ratePerUnitINR: 6.5 },
      { minUnits: 500, maxUnits: null, ratePerUnitINR: 7.0 },
    ],
  },
  {
    id: "west_bengal_wbsedcl",
    state: "West Bengal",
    discomName: "WBSEDCL (Domestic)",
    categoryName: "Class A Residential",
    effectiveDate: "FY 2026-27",
    officialSource: "WBERC Tariff Schedule",
    electricityDutyPct: 5.0,
    fuelSurchargePerUnitINR: 0.45,
    fixedMonthlyChargesINR: 40.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 5.3 },
      { minUnits: 100, maxUnits: 180, ratePerUnitINR: 5.97 },
      { minUnits: 180, maxUnits: 300, ratePerUnitINR: 6.97 },
      { minUnits: 300, maxUnits: null, ratePerUnitINR: 7.71 },
    ],
  },
];

// -------------------------------------------------------------
// TONNAGE TO TYPICAL ELECTRICAL INPUT POWER BENCHMARKS
// -------------------------------------------------------------

export const TONNAGE_POWER_BENCHMARKS: Record<
  string,
  {
    coolingCapacityWatts: number;
    starRatings: Record<number, { ratedWatts: number; avgInverterWatts: number; typicalAnnualKWh: number }>;
  }
> = {
  "1.0": {
    coolingCapacityWatts: 3500,
    starRatings: {
      3: { ratedWatts: 980, avgInverterWatts: 680, typicalAnnualKWh: 685 },
      5: { ratedWatts: 820, avgInverterWatts: 550, typicalAnnualKWh: 520 },
    },
  },
  "1.5": {
    coolingCapacityWatts: 5275,
    starRatings: {
      3: { ratedWatts: 1450, avgInverterWatts: 990, typicalAnnualKWh: 980 },
      5: { ratedWatts: 1180, avgInverterWatts: 790, typicalAnnualKWh: 750 },
    },
  },
  "2.0": {
    coolingCapacityWatts: 7000,
    starRatings: {
      3: { ratedWatts: 1980, avgInverterWatts: 1380, typicalAnnualKWh: 1350 },
      5: { ratedWatts: 1650, avgInverterWatts: 1120, typicalAnnualKWh: 1050 },
    },
  },
};

// -------------------------------------------------------------
// CORE CALCULATION FUNCTIONS
// -------------------------------------------------------------

/**
 * Convert user power input into standardized Watts and Kilowatts
 */
export function convertPowerToWattsAndKW(powerInput: number, unit: PowerUnit): { watts: number; kW: number } {
  if (powerInput <= 0 || isNaN(powerInput)) {
    return { watts: 0, kW: 0 };
  }
  const watts = unit === "kW" ? powerInput * 1000 : powerInput;
  const kW = watts / 1000;
  return { watts, kW };
}

/**
 * Calculate Daily Electricity Units (kWh)
 * Formula: Daily Units = Power (kW) × Daily Hours × AC Count
 */
export function calculateAcDailyUnits(powerKW: number, dailyHours: number, acCount: number = 1): number {
  if (powerKW <= 0 || dailyHours <= 0 || acCount <= 0 || isNaN(powerKW) || isNaN(dailyHours) || isNaN(acCount)) {
    return 0;
  }
  // Cap hours to maximum 24 per day
  const clampedHours = Math.min(24, Math.max(0, dailyHours));
  return powerKW * clampedHours * acCount;
}

/**
 * Calculate Monthly Electricity Units (kWh)
 * Formula: Monthly Units = Daily Units × Operating Days per Month
 */
export function calculateAcMonthlyUnits(dailyUnits: number, operatingDaysPerMonth: number = 30): number {
  if (dailyUnits <= 0 || operatingDaysPerMonth <= 0 || isNaN(dailyUnits) || isNaN(operatingDaysPerMonth)) {
    return 0;
  }
  const clampedDays = Math.min(31, Math.max(0, operatingDaysPerMonth));
  return dailyUnits * clampedDays;
}

/**
 * Calculate Annual Electricity Units (kWh)
 * Handles seasonal operating months (e.g. summer 4 months vs year-round)
 */
export function calculateAcAnnualUnits(
  monthlyUnits: number,
  operatingMonthsPerYear: number = 12,
  dailyUnits: number = 0,
  operatingDaysPerMonth: number = 30
): number {
  if (monthlyUnits <= 0 || operatingMonthsPerYear <= 0 || isNaN(monthlyUnits) || isNaN(operatingMonthsPerYear)) {
    return 0;
  }
  const clampedMonths = Math.min(12, Math.max(0, operatingMonthsPerYear));

  // If operating 12 months full year at 30 days/month: 360 days or exactly 12 * monthlyUnits
  return monthlyUnits * clampedMonths;
}

/**
 * Calculate Daily Running Cost
 */
export function calculateAcDailyCost(dailyUnits: number, ratePerUnitINR: number): number {
  if (dailyUnits <= 0 || ratePerUnitINR <= 0 || isNaN(dailyUnits) || isNaN(ratePerUnitINR)) {
    return 0;
  }
  return dailyUnits * ratePerUnitINR;
}

/**
 * Calculate Monthly Running Cost
 */
export function calculateAcMonthlyCost(monthlyUnits: number, ratePerUnitINR: number): number {
  if (monthlyUnits <= 0 || ratePerUnitINR <= 0 || isNaN(monthlyUnits) || isNaN(ratePerUnitINR)) {
    return 0;
  }
  return monthlyUnits * ratePerUnitINR;
}

/**
 * Calculate Annual Running Cost
 */
export function calculateAcAnnualCost(annualUnits: number, ratePerUnitINR: number): number {
  if (annualUnits <= 0 || ratePerUnitINR <= 0 || isNaN(annualUnits) || isNaN(ratePerUnitINR)) {
    return 0;
  }
  return annualUnits * ratePerUnitINR;
}

/**
 * Calculate bill for a given total consumption (units) under telescopic tariff slabs
 */
export function calculateTariffSlabEnergyCharge(units: number, slabs: TariffSlab[]): number {
  if (units <= 0 || !slabs || slabs.length === 0) return 0;

  let remainingUnits = units;
  let totalEnergyCharge = 0;

  for (const slab of slabs) {
    if (remainingUnits <= 0) break;

    const slabRange = slab.maxUnits !== null ? slab.maxUnits - slab.minUnits : Infinity;
    const unitsInThisSlab = Math.min(remainingUnits, slabRange);

    totalEnergyCharge += unitsInThisSlab * slab.ratePerUnitINR;
    remainingUnits -= unitsInThisSlab;
  }

  return totalEnergyCharge;
}

/**
 * Calculate full monthly bill under slab structure (Energy + FPPPA/Fuel + Electricity Duty)
 * Note: Fixed charges are omitted or kept constant for incremental calculation.
 */
export function calculateTotalMonthlyBill(
  monthlyUnits: number,
  slabs: TariffSlab[],
  dutyPct: number = 0,
  fuelSurchargePerUnit: number = 0
): { energyChargesINR: number; fuelSurchargeINR: number; electricityDutyINR: number; totalBillINR: number } {
  if (monthlyUnits <= 0) {
    return { energyChargesINR: 0, fuelSurchargeINR: 0, electricityDutyINR: 0, totalBillINR: 0 };
  }

  const energyChargesINR = calculateTariffSlabEnergyCharge(monthlyUnits, slabs);
  const fuelSurchargeINR = monthlyUnits * Math.max(0, fuelSurchargePerUnit);
  const taxableBase = energyChargesINR + fuelSurchargeINR;
  const electricityDutyINR = (taxableBase * Math.max(0, dutyPct)) / 100;
  const totalBillINR = energyChargesINR + fuelSurchargeINR + electricityDutyINR;

  return { energyChargesINR, fuelSurchargeINR, electricityDutyINR, totalBillINR };
}

/**
 * Calculate Incremental AC Bill Impact:
 * Incremental AC Cost = Bill(Existing Units + AC Units) - Bill(Existing Units)
 * Prevents attributing unchanged fixed charges and correctly applies marginal tariff slabs.
 */
export function calculateAcBillImpact(
  existingMonthlyUnits: number,
  acMonthlyUnits: number,
  slabs: TariffSlab[],
  dutyPct: number = 0,
  fuelSurchargePerUnit: number = 0
): {
  baseBillINR: number;
  billWithAcINR: number;
  incrementalAcCostINR: number;
  effectiveMarginalRateINR: number;
} {
  const baseUnits = Math.max(0, existingMonthlyUnits);
  const totalUnits = baseUnits + Math.max(0, acMonthlyUnits);

  const baseBill = calculateTotalMonthlyBill(baseUnits, slabs, dutyPct, fuelSurchargePerUnit).totalBillINR;
  const billWithAc = calculateTotalMonthlyBill(totalUnits, slabs, dutyPct, fuelSurchargePerUnit).totalBillINR;

  const incrementalAcCostINR = Math.max(0, billWithAc - baseBill);
  const effectiveMarginalRateINR = acMonthlyUnits > 0 ? incrementalAcCostINR / acMonthlyUnits : 0;

  return {
    baseBillINR: Math.round(baseBill * 100) / 100,
    billWithAcINR: Math.round(billWithAc * 100) / 100,
    incrementalAcCostINR: Math.round(incrementalAcCostINR * 100) / 100,
    effectiveMarginalRateINR: Math.round(effectiveMarginalRateINR * 100) / 100,
  };
}

/**
 * Compare usage hours scenarios: 4h, 6h, 8h, 10h, 12h
 */
export function compareAcUsageScenarios(
  powerKW: number,
  acCount: number,
  operatingDaysPerMonth: number,
  operatingMonthsPerYear: number,
  currentHours: number,
  ratePerUnitINR: number
): UsageScenarioItem[] {
  const standardHours = [4, 6, 8, 10, 12];
  const allHours = Array.from(new Set([...standardHours, currentHours])).sort((a, b) => a - b);

  const currentDailyUnits = calculateAcDailyUnits(powerKW, currentHours, acCount);
  const currentMonthlyUnits = calculateAcMonthlyUnits(currentDailyUnits, operatingDaysPerMonth);
  const currentMonthlyCost = calculateAcMonthlyCost(currentMonthlyUnits, ratePerUnitINR);

  return allHours.map((hrs) => {
    const dUnits = calculateAcDailyUnits(powerKW, hrs, acCount);
    const mUnits = calculateAcMonthlyUnits(dUnits, operatingDaysPerMonth);
    const aUnits = calculateAcAnnualUnits(mUnits, operatingMonthsPerYear, dUnits, operatingDaysPerMonth);

    const dCost = calculateAcDailyCost(dUnits, ratePerUnitINR);
    const mCost = calculateAcMonthlyCost(mUnits, ratePerUnitINR);
    const aCost = calculateAcAnnualCost(aUnits, ratePerUnitINR);

    return {
      hoursPerDay: hrs,
      dailyUnits: Math.round(dUnits * 100) / 100,
      monthlyUnits: Math.round(mUnits * 10) / 10,
      dailyCostINR: Math.round(dCost),
      monthlyCostINR: Math.round(mCost),
      annualCostINR: Math.round(aCost),
      monthlySavingsVsCurrentINR: Math.round(currentMonthlyCost - mCost),
    };
  });
}

/**
 * Compare two AC units (e.g. Old 3-Star AC vs New 5-Star Inverter AC)
 */
export function calculateAcComparison(inputs: AcComparisonInputs): AcComparisonResult {
  const daysPerMonth = Math.min(31, Math.max(1, inputs.operatingDaysPerMonth || 30));
  const monthsPerYear = Math.min(12, Math.max(1, inputs.operatingMonthsPerYear || 12));
  const rate = Math.max(0, inputs.electricityRateINR || 8);

  let aMonthlyUnits = 0;
  let aAnnualUnits = 0;

  if (inputs.acAIsBee && inputs.acABeeAnnualKWh && inputs.acABeeAnnualKWh > 0) {
    aAnnualUnits = inputs.acABeeAnnualKWh;
    aMonthlyUnits = aAnnualUnits / 12;
  } else {
    const aKW = (inputs.acAPowerWatts || 0) / 1000;
    const aDailyUnits = aKW * (inputs.dailyHours || 0);
    aMonthlyUnits = aDailyUnits * daysPerMonth;
    aAnnualUnits = aMonthlyUnits * monthsPerYear;
  }

  let bMonthlyUnits = 0;
  let bAnnualUnits = 0;

  if (inputs.acBIsBee && inputs.acBBeeAnnualKWh && inputs.acBBeeAnnualKWh > 0) {
    bAnnualUnits = inputs.acBBeeAnnualKWh;
    bMonthlyUnits = bAnnualUnits / 12;
  } else {
    const bKW = (inputs.acBPowerWatts || 0) / 1000;
    const bDailyUnits = bKW * (inputs.dailyHours || 0);
    bMonthlyUnits = bDailyUnits * daysPerMonth;
    bAnnualUnits = bMonthlyUnits * monthsPerYear;
  }

  const aMonthlyCost = aMonthlyUnits * rate;
  const aAnnualCost = aAnnualUnits * rate;

  const bMonthlyCost = bMonthlyUnits * rate;
  const bAnnualCost = bAnnualUnits * rate;

  const monthlyCostDifferenceINR = aMonthlyCost - bMonthlyCost;
  const annualCostDifferenceINR = aAnnualCost - bAnnualCost;
  const fiveYearCostDifferenceINR = annualCostDifferenceINR * 5;

  const cheaperModelName =
    bMonthlyCost < aMonthlyCost
      ? inputs.acBName || "Model B"
      : bMonthlyCost > aMonthlyCost
      ? inputs.acAName || "Model A"
      : "Both Equal";

  const percentageSavings =
    aMonthlyCost > 0 ? Math.round(((aMonthlyCost - bMonthlyCost) / aMonthlyCost) * 100) : 0;

  return {
    acAMonthlyUnits: Math.round(aMonthlyUnits * 10) / 10,
    acAMonthlyCostINR: Math.round(aMonthlyCost),
    acAAnnualCostINR: Math.round(aAnnualCost),

    acBMonthlyUnits: Math.round(bMonthlyUnits * 10) / 10,
    acBMonthlyCostINR: Math.round(bMonthlyCost),
    acBAnnualCostINR: Math.round(bAnnualCost),

    monthlyCostDifferenceINR: Math.round(monthlyCostDifferenceINR),
    annualCostDifferenceINR: Math.round(annualCostDifferenceINR),
    fiveYearCostDifferenceINR: Math.round(fiveYearCostDifferenceINR),
    cheaperModelName,
    percentageSavings,
  };
}

// -------------------------------------------------------------
// MASTER CALCULATION DISPATCHER
// -------------------------------------------------------------

export function masterCalculateAcCost(inputs: AcCalculationInputs): AcCalculationResult {
  const acCount = Math.max(1, inputs.acCount || 1);
  const dailyHours = Math.min(24, Math.max(0, inputs.dailyUsageHours || 0));
  const operatingDays = Math.min(31, Math.max(0, inputs.operatingDaysPerMonth || 30));
  const operatingMonths = Math.min(12, Math.max(1, inputs.operatingMonthsPerYear || 12));

  let effectivePowerWatts = 0;
  let effectivePowerKW = 0;
  let isApproximatedInverter = false;
  let powerCalculationNote = "";

  let dailyUnits = 0;
  let monthlyUnits = 0;
  let annualUnits = 0;

  // METHOD B: BEE STAR LABEL ANNUAL CONSUMPTION
  if (inputs.method === "bee_label") {
    const annualLabelKWh = Math.max(0, inputs.beeAnnualConsumptionKWh || 0);

    // BEE Star Label annual consumption is tested for 1,600 standard operating hours
    // Daily average across 365 days
    dailyUnits = (annualLabelKWh / 365) * acCount;
    // Monthly average across 12 months
    monthlyUnits = (annualLabelKWh / 12) * acCount;
    annualUnits = annualLabelKWh * acCount;

    // Equivalent implied average electrical power
    effectivePowerWatts = annualLabelKWh > 0 ? (annualLabelKWh * 1000) / 1600 : 0;
    effectivePowerKW = effectivePowerWatts / 1000;

    powerCalculationNote = `Calculated using official BEE Star Label figure (${annualLabelKWh} kWh/year). Implies average operating power of ~${Math.round(
      effectivePowerWatts
    )} W during active cooling.`;
  } else {
    // METHOD A: RATED WATTAGE OR TONNAGE APPROXIMATION
    let rawWatts = 0;

    if (inputs.method === "tonnage_approx") {
      const tonnageStr = String(inputs.tonnage || 1.5);
      const star = inputs.starRating || 3;
      const benchmark = TONNAGE_POWER_BENCHMARKS[tonnageStr]?.starRatings[star] || {
        ratedWatts: 1450,
        avgInverterWatts: 990,
        typicalAnnualKWh: 980,
      };

      rawWatts = inputs.acType === "inverter" ? benchmark.avgInverterWatts : benchmark.ratedWatts;
      isApproximatedInverter = inputs.acType === "inverter";
      powerCalculationNote = `Approximated based on typical Indian ${inputs.starRating}-Star ${inputs.tonnage} Ton ${
        inputs.acType === "inverter" ? "Inverter" : "Non-Inverter"
      } AC.`;
    } else {
      // Direct wattage / kW input
      const converted = convertPowerToWattsAndKW(inputs.powerInput, inputs.powerUnit);
      rawWatts = converted.watts;

      if (inputs.acType === "inverter" && inputs.inverterPowerMode === "rated_max") {
        // User entered rated maximum wattage for an Inverter AC
        // In real residential use, inverter AC averages approx 70% of max capacity
        const factor = inputs.inverterOperatingFactor > 0 ? inputs.inverterOperatingFactor : 0.7;
        effectivePowerWatts = rawWatts * factor;
        isApproximatedInverter = true;
        powerCalculationNote = `Rated maximum power entered (${Math.round(
          rawWatts
        )} W). Adjusted to ~${Math.round(factor * 100)}% average power (${Math.round(
          effectivePowerWatts
        )} W) for variable-speed inverter operation.`;
      } else {
        effectivePowerWatts = rawWatts;
        powerCalculationNote =
          inputs.acType === "inverter"
            ? "Using entered average operating power for inverter calculation."
            : "Using rated electrical input power for non-inverter compressor cycling calculation.";
      }
    }

    if (!effectivePowerWatts) {
      effectivePowerWatts = rawWatts;
    }

    effectivePowerKW = effectivePowerWatts / 1000;
    dailyUnits = calculateAcDailyUnits(effectivePowerKW, dailyHours, acCount);
    monthlyUnits = calculateAcMonthlyUnits(dailyUnits, operatingDays);
    annualUnits = calculateAcAnnualUnits(monthlyUnits, operatingMonths, dailyUnits, operatingDays);
  }

  // TARIFF & COST CALCULATIONS
  let dailyCostINR = 0;
  let monthlyCostINR = 0;
  let annualCostINR = 0;
  let effectiveCostPerUnitINR = inputs.simpleRatePerUnitINR || 8;

  let isTariffModeActive = false;
  let householdBaseUnits = 0;
  let householdWithAcUnits = 0;
  let householdBaseBillINR = 0;
  let householdWithAcBillINR = 0;
  let incrementalMonthlyAcCostINR = 0;
  let effectiveMarginalRateINR = 0;
  let discomProfileName = "Simple Flat Rate";

  if (inputs.tariffMode === "tariff_slab") {
    isTariffModeActive = true;
    const selectedProfile =
      INDIAN_DISCOM_PROFILES.find((p) => p.id === inputs.selectedDiscomId) || INDIAN_DISCOM_PROFILES[0];
    discomProfileName = `${selectedProfile.state} (${selectedProfile.discomName})`;

    const slabsToUse =
      inputs.customSlabs && inputs.customSlabs.length > 0 ? inputs.customSlabs : selectedProfile.slabs;
    const dutyPct = inputs.customDutyPct ?? selectedProfile.electricityDutyPct;
    const fuelSurcharge = inputs.customFuelSurchargePerUnitINR ?? selectedProfile.fuelSurchargePerUnitINR;

    householdBaseUnits = Math.max(0, inputs.existingMonthlyHouseholdUnits || 0);
    householdWithAcUnits = householdBaseUnits + monthlyUnits;

    const impact = calculateAcBillImpact(householdBaseUnits, monthlyUnits, slabsToUse, dutyPct, fuelSurcharge);

    householdBaseBillINR = impact.baseBillINR;
    householdWithAcBillINR = impact.billWithAcINR;
    incrementalMonthlyAcCostINR = impact.incrementalAcCostINR;
    effectiveMarginalRateINR = impact.effectiveMarginalRateINR;

    monthlyCostINR = incrementalMonthlyAcCostINR;
    effectiveCostPerUnitINR = effectiveMarginalRateINR > 0 ? effectiveMarginalRateINR : inputs.simpleRatePerUnitINR;
    dailyCostINR = operatingDays > 0 ? monthlyCostINR / operatingDays : 0;
    annualCostINR = monthlyCostINR * operatingMonths;
  } else {
    // Simple Flat Rate Mode
    const rate = Math.max(0, inputs.simpleRatePerUnitINR || 8);
    effectiveCostPerUnitINR = rate;
    dailyCostINR = calculateAcDailyCost(dailyUnits, rate);
    monthlyCostINR = calculateAcMonthlyCost(monthlyUnits, rate);
    annualCostINR = calculateAcAnnualCost(annualUnits, rate);
  }

  // USAGE SCENARIOS & SAVINGS
  const rateForScenarios = effectiveCostPerUnitINR > 0 ? effectiveCostPerUnitINR : 8;
  const scenarios = compareAcUsageScenarios(
    effectivePowerKW,
    acCount,
    operatingDays,
    operatingMonths,
    dailyHours,
    rateForScenarios
  );

  // Savings if reducing daily usage by 1 hour
  const oneHourLessDailyUnits = calculateAcDailyUnits(effectivePowerKW, Math.max(0, dailyHours - 1), acCount);
  const oneHourLessMonthlyUnits = calculateAcMonthlyUnits(oneHourLessDailyUnits, operatingDays);
  const oneHourLessMonthlyCost = oneHourLessMonthlyUnits * rateForScenarios;
  const savings1HourPerDayMonthlyINR = Math.max(0, Math.round(monthlyCostINR - oneHourLessMonthlyCost));

  // Savings if reducing daily usage by 2 hours
  const twoHourLessDailyUnits = calculateAcDailyUnits(effectivePowerKW, Math.max(0, dailyHours - 2), acCount);
  const twoHourLessMonthlyUnits = calculateAcMonthlyUnits(twoHourLessDailyUnits, operatingDays);
  const twoHourLessMonthlyCost = twoHourLessMonthlyUnits * rateForScenarios;
  const savings2HoursPerDayMonthlyINR = Math.max(0, Math.round(monthlyCostINR - twoHourLessMonthlyCost));

  // Thermostat optimization savings (BEE standard: setting 24°C instead of 20°C saves ~24% compressor load)
  const thermostatOptimizationSavingsMonthlyINR = Math.round(monthlyCostINR * 0.24);

  // STEP-BY-STEP CALCULATION AUDIT LOG
  const calculationSteps = [
    {
      title: "1. AC Power Conversion to Kilowatts (kW)",
      description: "Electricity consumption is billed per kilowatt-hour (kWh). 1 kilowatt equals 1,000 watts.",
      formula: "Power (kW) = Power (Watts) / 1,000",
      substitution: `${Math.round(effectivePowerWatts)} W / 1,000`,
      result: `${effectivePowerKW.toFixed(3)} kW`,
    },
    {
      title: "2. Daily Electricity Units Calculation",
      description: "One electricity unit equals 1 kWh of power drawn for 1 hour.",
      formula: "Daily Units = Power (kW) × Daily Operating Hours × Number of ACs",
      substitution: `${effectivePowerKW.toFixed(3)} kW × ${dailyHours} hrs × ${acCount} AC`,
      result: `${dailyUnits.toFixed(2)} units (kWh) / day`,
    },
    {
      title: "3. Monthly Electricity Units Calculation",
      description: "Calculated across your active operating days in a month.",
      formula: "Monthly Units = Daily Units × Operating Days per Month",
      substitution: `${dailyUnits.toFixed(2)} units × ${operatingDays} days`,
      result: `${Math.round(monthlyUnits)} units (kWh) / month`,
    },
    {
      title: "4. Monthly AC Electricity Cost",
      description: isTariffModeActive
        ? `Applied marginal tariff slabs for ${discomProfileName} over existing household baseline (${householdBaseUnits} units).`
        : `Multiplied monthly electricity units by your flat tariff rate (₹${inputs.simpleRatePerUnitINR}/unit).`,
      formula: isTariffModeActive
        ? "Incremental Cost = Bill(Existing Units + AC Units) - Bill(Existing Units)"
        : "Monthly Cost = Monthly Units × Electricity Rate (₹/kWh)",
      substitution: isTariffModeActive
        ? `₹${Math.round(householdWithAcBillINR)} (Total) - ₹${Math.round(householdBaseBillINR)} (Base)`
        : `${Math.round(monthlyUnits)} units × ₹${inputs.simpleRatePerUnitINR}`,
      result: `₹${Math.round(monthlyCostINR)} / month`,
    },
  ];

  return {
    effectivePowerWatts: Math.round(effectivePowerWatts),
    effectivePowerKW: Math.round(effectivePowerKW * 1000) / 1000,
    isApproximatedInverter,
    powerCalculationNote,

    dailyUnits: Math.round(dailyUnits * 100) / 100,
    monthlyUnits: Math.round(monthlyUnits * 10) / 10,
    annualUnits: Math.round(annualUnits * 10) / 10,

    dailyCostINR: Math.round(dailyCostINR),
    monthlyCostINR: Math.round(monthlyCostINR),
    annualCostINR: Math.round(annualCostINR),
    effectiveCostPerUnitINR: Math.round(effectiveCostPerUnitINR * 100) / 100,

    isTariffModeActive,
    householdBaseUnits,
    householdWithAcUnits: Math.round(householdWithAcUnits * 10) / 10,
    householdBaseBillINR: Math.round(householdBaseBillINR),
    householdWithAcBillINR: Math.round(householdWithAcBillINR),
    incrementalMonthlyAcCostINR: Math.round(incrementalMonthlyAcCostINR),
    effectiveMarginalRateINR: Math.round(effectiveMarginalRateINR * 100) / 100,
    discomProfileName,

    scenarios,
    savings1HourPerDayMonthlyINR,
    savings2HoursPerDayMonthlyINR,
    thermostatOptimizationSavingsMonthlyINR,

    calculationSteps,
  };
}

// -------------------------------------------------------------
// CURRENCY & NUMBER FORMATTERS
// -------------------------------------------------------------

export function formatINR(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return "₹0";
  return (
    "₹" +
    Math.round(val).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return val.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

