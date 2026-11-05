/**
 * Home Electricity Bill Calculator Utilities
 * Accurate Indian household electricity billing engine
 * Supports flat-rate and progressive slab-based tariffs (GERC, MSEDCL, BSES, BESCOM, etc.)
 */

import {
  APPLIANCE_PRESETS,
  calculateApplianceItem,
  calculateMultiAppliance,
  createItemFromPreset,
  formatINR,
  formatUnits,
} from "./applianceElectricityUtils";
import type { ApplianceItem, AppliancePreset } from "./applianceElectricityUtils";

// Re-export shared appliance utilities
export {
  APPLIANCE_PRESETS,
  calculateApplianceItem,
  calculateMultiAppliance,
  createItemFromPreset,
  formatINR,
  formatUnits,
};
export type { ApplianceItem, AppliancePreset };

export type BillingInputMode = "monthly_units" | "appliances";
export type TariffCalculationMode = "flat" | "slab" | "discom";

export interface TariffSlab {
  minUnits: number;
  maxUnits: number | null; // null represents upper unbounded slab
  ratePerUnitINR: number;
}

export interface DiscomTariffProfile {
  id: string;
  state: string;
  discomName: string;
  categoryName: string;
  effectiveDate: string;
  officialSource: string;
  electricityDutyPct: number;
  fuelSurchargePerUnitINR: number; // FPPAS / FPPPA
  fixedMonthlyChargesINR: number;
  slabs: TariffSlab[];
  notes?: string;
}

export interface HomeBillInput {
  mode: BillingInputMode;
  // Mode A: Monthly units known
  monthlyUnits: number;
  // Mode B: Appliance list
  appliances: ApplianceItem[];
  // Tariff configuration
  tariffMode: TariffCalculationMode;
  flatRatePerUnitINR: number;
  selectedDiscomId?: string;
  customSlabs?: TariffSlab[];
  // Optional charges
  fixedChargesINR: number;
  additionalChargesINR: number; // Taxes, surcharges, meter rent
  electricityDutyPct?: number;
  fppasRatePerUnitINR?: number;
}

export interface SlabBreakdownItem {
  slabLabel: string;
  unitsInSlab: number;
  ratePerUnit: number;
  costINR: number;
}

export interface HomeBillResult {
  totalMonthlyUnits: number;
  dailyAverageUnits: number;
  yearlyEstimatedUnits: number;
  energyChargesINR: number;
  fixedChargesINR: number;
  additionalChargesINR: number;
  fppasChargesINR: number;
  dutyChargesINR: number;
  totalMonthlyBillINR: number;
  yearlyEstimatedBillINR: number;
  dailyEstimatedBillINR: number;
  effectiveRatePerUnitINR: number;
  slabBreakdown?: SlabBreakdownItem[];
  applianceBreakdown?: Array<{
    id: string;
    name: string;
    quantity: number;
    monthlyUnits: number;
    monthlyCostINR: number;
    percentageOfBill: number;
  }>;
  highestConsumingAppliance?: {
    name: string;
    monthlyUnits: number;
    monthlyCostINR: number;
    percentage: number;
  };
  totalStandbyCostINR?: number;
  explanation: string;
}

export interface MonthComparisonInput {
  prevUnits: number;
  currUnits: number;
  prevBillINR?: number;
  currBillINR?: number;
}

export interface MonthComparisonResult {
  unitsDifference: number;
  unitsPercentChange: number;
  isUnitsIncrease: boolean;
  billDifferenceINR?: number;
  billPercentChange?: number;
  isBillIncrease?: boolean;
}

/**
 * Verified Indian DISCOM Tariff Schedules (FY 2026-27)
 */
export const VERIFIED_DISCOM_PROFILES: DiscomTariffProfile[] = [
  {
    id: "gujarat_gerc_rgp",
    state: "Gujarat",
    discomName: "UGVCL / DGVCL / MGVCL / PGVCL (GERC)",
    categoryName: "RGP (Urban Residential Postpaid)",
    effectiveDate: "1 April 2026",
    officialSource: "GERC Tariff Order FY 2026-27 & DISCOM Retail Schedules",
    electricityDutyPct: 15.0,
    fuelSurchargePerUnitINR: 2.35, // Average FPPPA
    fixedMonthlyChargesINR: 35.0,
    slabs: [
      { minUnits: 0, maxUnits: 50, ratePerUnitINR: 3.05 },
      { minUnits: 50, maxUnits: 100, ratePerUnitINR: 3.5 },
      { minUnits: 100, maxUnits: 250, ratePerUnitINR: 4.15 },
      { minUnits: 250, maxUnits: null, ratePerUnitINR: 5.2 },
    ],
    notes: "Official GERC urban residential telescopic schedule effective from 1 April 2026.",
  },
  {
    id: "maharashtra_msedcl",
    state: "Maharashtra",
    discomName: "MSEDCL (Mahavitaran)",
    categoryName: "LT-I Residential (B)",
    effectiveDate: "FY 2026-27",
    officialSource: "MERC Multi-Year Tariff Regulations & Mahavitaran Schedule",
    electricityDutyPct: 16.0,
    fuelSurchargePerUnitINR: 0.95,
    fixedMonthlyChargesINR: 115.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 5.88 },
      { minUnits: 100, maxUnits: 300, ratePerUnitINR: 11.26 },
      { minUnits: 300, maxUnits: 500, ratePerUnitINR: 15.72 },
      { minUnits: 500, maxUnits: null, ratePerUnitINR: 17.81 },
    ],
    notes: "MERC residential progressive slabs for single-phase domestic connections.",
  },
  {
    id: "delhi_bses",
    state: "Delhi",
    discomName: "BSES Rajdhani / BSES Yamuna",
    categoryName: "Domestic Lighting & Power",
    effectiveDate: "FY 2026-27",
    officialSource: "DERC Retail Tariff Schedule",
    electricityDutyPct: 5.0,
    fuelSurchargePerUnitINR: 1.5, // Power Purchase Adjustment (PPAC)
    fixedMonthlyChargesINR: 40.0,
    slabs: [
      { minUnits: 0, maxUnits: 200, ratePerUnitINR: 3.0 },
      { minUnits: 200, maxUnits: 400, ratePerUnitINR: 4.5 },
      { minUnits: 400, maxUnits: 800, ratePerUnitINR: 6.5 },
      { minUnits: 800, maxUnits: 1200, ratePerUnitINR: 7.0 },
      { minUnits: 1200, maxUnits: null, ratePerUnitINR: 8.0 },
    ],
    notes: "DERC standard residential tariff without Delhi government special subsidy deductions.",
  },
  {
    id: "karnataka_bescom",
    state: "Karnataka",
    discomName: "BESCOM (Bangalore Electricity Supply)",
    categoryName: "LT-2(a) Domestic",
    effectiveDate: "1 April 2026",
    officialSource: "KERC Tariff Regulations",
    electricityDutyPct: 9.0,
    fuelSurchargePerUnitINR: 0.85,
    fixedMonthlyChargesINR: 70.0,
    slabs: [
      { minUnits: 0, maxUnits: 50, ratePerUnitINR: 4.15 },
      { minUnits: 50, maxUnits: 100, ratePerUnitINR: 5.6 },
      { minUnits: 100, maxUnits: null, ratePerUnitINR: 7.15 },
    ],
  },
  {
    id: "test_progressive_preset",
    state: "Standard Benchmark",
    discomName: "3-Tier Progressive Test Benchmark",
    categoryName: "General 3-Tier Slab",
    effectiveDate: "Standard",
    officialSource: "Standard 3-Tier Progressive Electricity Tariff",
    electricityDutyPct: 0,
    fuelSurchargePerUnitINR: 0,
    fixedMonthlyChargesINR: 50.0,
    slabs: [
      { minUnits: 0, maxUnits: 100, ratePerUnitINR: 3.0 },
      { minUnits: 100, maxUnits: 200, ratePerUnitINR: 5.0 },
      { minUnits: 200, maxUnits: null, ratePerUnitINR: 8.0 },
    ],
  },
];

/**
 * Calculates progressive slab energy charges
 * Each block of units is billed strictly at its respective slab rate
 */
export function calculateSlabEnergyCharges(
  units: number,
  slabs: TariffSlab[],
): {
  totalEnergyCostINR: number;
  breakdown: SlabBreakdownItem[];
} {
  const safeUnits = Math.max(0, units);
  if (safeUnits === 0 || !slabs || slabs.length === 0) {
    return { totalEnergyCostINR: 0, breakdown: [] };
  }

  let remainingUnits = safeUnits;
  let totalEnergyCostINR = 0;
  const breakdown: SlabBreakdownItem[] = [];

  for (const slab of slabs) {
    if (remainingUnits <= 0) break;

    const slabCapacity =
      slab.maxUnits !== null ? Math.max(0, slab.maxUnits - slab.minUnits) : Infinity;
    const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);

    if (unitsInThisSlab > 0) {
      const costInSlab = unitsInThisSlab * slab.ratePerUnitINR;
      totalEnergyCostINR += costInSlab;

      const slabLabel =
        slab.maxUnits !== null
          ? `${slab.minUnits} – ${slab.maxUnits} units`
          : `Above ${slab.minUnits} units`;

      breakdown.push({
        slabLabel,
        unitsInSlab: unitsInThisSlab,
        ratePerUnit: slab.ratePerUnitINR,
        costINR: costInSlab,
      });

      remainingUnits -= unitsInThisSlab;
    }
  }

  return { totalEnergyCostINR, breakdown };
}

/**
 * Validation function for home electricity bill input
 */
export function validateHomeBillInput(
  input: HomeBillInput,
): { isValid: boolean; error?: string } {
  if (input.mode === "monthly_units") {
    if (isNaN(input.monthlyUnits) || input.monthlyUnits < 0) {
      return { isValid: false, error: "Monthly units cannot be negative." };
    }
  } else {
    if (!input.appliances || input.appliances.length === 0) {
      return { isValid: false, error: "Please select at least one appliance." };
    }
    for (const app of input.appliances) {
      if (app.quantity <= 0) {
        return { isValid: false, error: "Appliance quantity must be a positive integer." };
      }
      if (app.dailyHours < 0 || app.dailyHours > 24) {
        return { isValid: false, error: "Appliance operating hours must be between 0 and 24." };
      }
      if (app.activeHours + app.standbyHours > 24) {
        return { isValid: false, error: "Active and standby hours cannot exceed 24 hours." };
      }
    }
  }

  if (input.flatRatePerUnitINR < 0) {
    return { isValid: false, error: "Electricity rate cannot be negative." };
  }
  if (input.fixedChargesINR < 0) {
    return { isValid: false, error: "Fixed charges cannot be negative." };
  }
  if (input.additionalChargesINR < 0) {
    return { isValid: false, error: "Additional charges cannot be negative." };
  }

  if (input.tariffMode === "slab" && input.customSlabs) {
    for (const slab of input.customSlabs) {
      if (slab.minUnits < 0 || slab.ratePerUnitINR < 0) {
        return { isValid: false, error: "Please check your tariff slab values." };
      }
      if (slab.maxUnits !== null && slab.maxUnits <= slab.minUnits) {
        return { isValid: false, error: "Slab upper limit must be greater than lower limit." };
      }
    }
  }

  return { isValid: true };
}

/**
 * Master calculation function for Home Electricity Bill
 */
export function calculateHomeElectricityBill(input: HomeBillInput): HomeBillResult {
  let totalMonthlyUnits = 0;
  let applianceBreakdown: HomeBillResult["applianceBreakdown"];
  let totalStandbyCostINR = 0;
  let highestConsumingAppliance: HomeBillResult["highestConsumingAppliance"];

  // Step 1: Calculate Total Monthly Consumption Units
  if (input.mode === "monthly_units") {
    totalMonthlyUnits = Math.max(0, input.monthlyUnits || 0);
  } else {
    // Mode B: Aggregate from appliances
    const apps = input.appliances || [];
    let sumUnits = 0;
    const details: Array<{
      id: string;
      name: string;
      quantity: number;
      monthlyUnits: number;
      monthlyCostINR: number;
    }> = [];

    for (const app of apps) {
      const res = calculateApplianceItem(app, input.flatRatePerUnitINR);
      sumUnits += res.monthlyKwh;
      if (res.monthlyStandbyCost) {
        totalStandbyCostINR += res.monthlyStandbyCost;
      }
      details.push({
        id: app.id,
        name: app.name,
        quantity: app.quantity,
        monthlyUnits: res.monthlyKwh,
        monthlyCostINR: res.monthlyCost,
      });
    }

    totalMonthlyUnits = sumUnits;

    // Sort to find highest consuming appliance
    if (details.length > 0) {
      details.sort((a, b) => b.monthlyUnits - a.monthlyUnits);
      const top = details[0];
      highestConsumingAppliance = {
        name: top.name,
        monthlyUnits: top.monthlyUnits,
        monthlyCostINR: top.monthlyCostINR,
        percentage: totalMonthlyUnits > 0 ? (top.monthlyUnits / totalMonthlyUnits) * 100 : 0,
      };
    }

    applianceBreakdown = details.map((d) => ({
      ...d,
      percentageOfBill: totalMonthlyUnits > 0 ? (d.monthlyUnits / totalMonthlyUnits) * 100 : 0,
    }));
  }

  // Step 2: Calculate Energy Charges (Flat vs Slab vs Discom)
  let energyChargesINR = 0;
  let slabBreakdown: SlabBreakdownItem[] | undefined;
  let fppasChargesINR = 0;
  let dutyChargesINR = 0;

  if (input.tariffMode === "flat") {
    energyChargesINR = totalMonthlyUnits * Math.max(0, input.flatRatePerUnitINR);
  } else if (input.tariffMode === "discom" && input.selectedDiscomId) {
    const profile =
      VERIFIED_DISCOM_PROFILES.find((p) => p.id === input.selectedDiscomId) ||
      VERIFIED_DISCOM_PROFILES[0];
    const slabRes = calculateSlabEnergyCharges(totalMonthlyUnits, profile.slabs);
    energyChargesINR = slabRes.totalEnergyCostINR;
    slabBreakdown = slabRes.breakdown;

    // Calculate FPPAS (Fuel surcharge) if applicable
    fppasChargesINR = totalMonthlyUnits * (profile.fuelSurchargePerUnitINR || 0);

    // Calculate Electricity Duty on energy charges
    if (profile.electricityDutyPct > 0) {
      dutyChargesINR = (energyChargesINR * profile.electricityDutyPct) / 100;
    }
  } else if (input.tariffMode === "slab" && input.customSlabs && input.customSlabs.length > 0) {
    const slabRes = calculateSlabEnergyCharges(totalMonthlyUnits, input.customSlabs);
    energyChargesINR = slabRes.totalEnergyCostINR;
    slabBreakdown = slabRes.breakdown;

    if (input.fppasRatePerUnitINR) {
      fppasChargesINR = totalMonthlyUnits * Math.max(0, input.fppasRatePerUnitINR);
    }
    if (input.electricityDutyPct) {
      dutyChargesINR = (energyChargesINR * Math.max(0, input.electricityDutyPct)) / 100;
    }
  }

  // Step 3: Fixed and Additional Charges
  const fixedChargesINR = Math.max(0, input.fixedChargesINR || 0);
  const additionalChargesINR =
    Math.max(0, input.additionalChargesINR || 0) + fppasChargesINR + dutyChargesINR;

  // Step 4: Total Bill
  const totalMonthlyBillINR = energyChargesINR + fixedChargesINR + additionalChargesINR;

  const dailyAverageUnits = totalMonthlyUnits / 30;
  const yearlyEstimatedUnits = totalMonthlyUnits * 12;
  const dailyEstimatedBillINR = totalMonthlyBillINR / 30;
  const yearlyEstimatedBillINR = totalMonthlyBillINR * 12;

  const effectiveRatePerUnitINR =
    totalMonthlyUnits > 0 ? totalMonthlyBillINR / totalMonthlyUnits : 0;

  // Step 5: Plain language explanation
  let explanation = "";
  if (input.mode === "monthly_units") {
    if (input.tariffMode === "flat") {
      explanation = `Based on your entered consumption of ${formatUnits(totalMonthlyUnits)} units at ₹${input.flatRatePerUnitINR.toFixed(2)}/unit, your base energy charge is ₹${energyChargesINR.toFixed(2)}. Adding fixed charges (₹${fixedChargesINR.toFixed(2)}) and other charges (₹${additionalChargesINR.toFixed(2)}) brings the estimated monthly total to ₹${totalMonthlyBillINR.toFixed(2)}.`;
    } else {
      explanation = `Your ${formatUnits(totalMonthlyUnits)} units were billed across the progressive tariff slabs (total energy charge ₹${energyChargesINR.toFixed(2)}). Adding fixed charges (₹${fixedChargesINR.toFixed(2)}) and applicable taxes/duties (₹${additionalChargesINR.toFixed(2)}) gives an estimated monthly bill of ₹${totalMonthlyBillINR.toFixed(2)}.`;
    }
  } else {
    explanation = `We calculated the energy used by your ${input.appliances?.length || 0} household appliances to estimate ${formatUnits(totalMonthlyUnits)} total units per month. At your chosen tariff, energy charges come to ₹${energyChargesINR.toFixed(2)}, plus ₹${fixedChargesINR.toFixed(2)} fixed charges and ₹${additionalChargesINR.toFixed(2)} other fees, totaling ₹${totalMonthlyBillINR.toFixed(2)}/month.`;
  }

  return {
    totalMonthlyUnits,
    dailyAverageUnits,
    yearlyEstimatedUnits,
    energyChargesINR,
    fixedChargesINR,
    additionalChargesINR,
    fppasChargesINR,
    dutyChargesINR,
    totalMonthlyBillINR,
    yearlyEstimatedBillINR,
    dailyEstimatedBillINR,
    effectiveRatePerUnitINR,
    slabBreakdown,
    applianceBreakdown,
    highestConsumingAppliance,
    totalStandbyCostINR,
    explanation,
  };
}

/**
 * Calculates month-over-month consumption and bill comparison
 */
export function calculateMonthComparison(
  input: MonthComparisonInput,
): MonthComparisonResult {
  const prevU = Math.max(0, input.prevUnits || 0);
  const currU = Math.max(0, input.currUnits || 0);

  const unitsDifference = currU - prevU;
  const unitsPercentChange = prevU > 0 ? (unitsDifference / prevU) * 100 : 0;
  const isUnitsIncrease = unitsDifference >= 0;

  let billDifferenceINR: number | undefined;
  let billPercentChange: number | undefined;
  let isBillIncrease: boolean | undefined;

  if (input.prevBillINR !== undefined && input.currBillINR !== undefined) {
    const prevB = Math.max(0, input.prevBillINR);
    const currB = Math.max(0, input.currBillINR);
    billDifferenceINR = currB - prevB;
    billPercentChange = prevB > 0 ? (billDifferenceINR / prevB) * 100 : 0;
    isBillIncrease = billDifferenceINR >= 0;
  }

  return {
    unitsDifference,
    unitsPercentChange,
    isUnitsIncrease,
    billDifferenceINR,
    billPercentChange,
    isBillIncrease,
  };
}
