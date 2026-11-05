/**
 * CalcZen RCC Price Calculator Utilities (India)
 * Authoritative References:
 * - Bureau of Indian Standards: IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)
 * - Bureau of Indian Standards: IS 10262:2019 (Concrete Mix Proportioning Guidelines)
 * - Bureau of Indian Standards: IS 1786:2008 (High Strength Deformed Steel Bars and Wires)
 * - Central Public Works Department (CPWD Delhi Schedule of Rates & Analysis of Rates)
 */

export type DimensionUnit = "m" | "ft" | "in" | "cm" | "mm";
export type VolumeUnit = "m3" | "cft";
export type WeightUnit = "kg" | "tonne" | "quintal";
export type MaterialQuantityUnit = "m3" | "cft" | "tonne";

export type RccElementType =
  | "slab"
  | "beam"
  | "column"
  | "footing"
  | "staircase"
  | "lintel"
  | "custom";

export type ConcreteGrade =
  | "M10"
  | "M15"
  | "M20"
  | "M25"
  | "M30"
  | "M35"
  | "M40"
  | "custom";

export type ConcreteSupplyMethod = "site_mix" | "rmc";
export type SiteMixMethod = "nominal" | "design";

export type SteelInputMode = "preliminary" | "bbs";
export type ShutteringInputMode = "auto" | "manual";
export type LabourInputMode = "lump_sum" | "per_volume" | "per_area" | "crew";

// Standard bulk densities (kg/m3) per CPWD / IS codes
export const BULK_DENSITIES = {
  cement: 1440, // kg/m³ (1 bag of 50 kg = 50 / 1440 ≈ 0.03472 m³ ≈ 1.226 cft)
  riverSand: 1600, // kg/m³
  mSand: 1650, // kg/m³
  coarseAggregate: 1520, // kg/m³ (10mm - 20mm blue granite metal)
  steel: 7850, // kg/m³
} as const;

// Volume of standard 50 kg cement bag in cubic metres
export const CEMENT_BAG_VOLUME_M3 = 50 / BULK_DENSITIES.cement; // 0.0347222 m³
export const CEMENT_BAG_VOLUME_CFT = CEMENT_BAG_VOLUME_M3 * 35.3146667; // ~1.226 cu ft

// Conversion constant: 1 cubic metre in cubic feet
export const CFT_PER_CUBIC_METRE = 35.3146667;

// Conversion factors to metres
export const UNIT_TO_METRE_FACTORS: Record<DimensionUnit, number> = {
  m: 1,
  ft: 0.3048,
  in: 0.0254,
  cm: 0.01,
  mm: 0.001,
};

// Nominal Mix Default Proportions (Cement : Sand : Coarse Aggregate)
export interface NominalMixRatio {
  cement: number;
  sand: number;
  aggregate: number;
  label: string;
  charStrengthNmm2: number;
  recommendedUse: string;
}

export const NOMINAL_MIX_PRESETS: Record<ConcreteGrade, NominalMixRatio> = {
  M10: {
    cement: 1,
    sand: 3,
    aggregate: 6,
    label: "1 : 3 : 6 (M10)",
    charStrengthNmm2: 10,
    recommendedUse: "PCC leveling course, bedding under footings",
  },
  M15: {
    cement: 1,
    sand: 2,
    aggregate: 4,
    label: "1 : 2 : 4 (M15)",
    charStrengthNmm2: 15,
    recommendedUse: "PCC, pathways, light non-structural flooring",
  },
  M20: {
    cement: 1,
    sand: 1.5,
    aggregate: 3,
    label: "1 : 1.5 : 3 (M20)",
    charStrengthNmm2: 20,
    recommendedUse: "General residential RCC slabs, beams, columns (IS 456 min for RCC)",
  },
  M25: {
    cement: 1,
    sand: 1,
    aggregate: 2,
    label: "1 : 1 : 2 (M25)",
    charStrengthNmm2: 25,
    recommendedUse: "Heavy loaded columns, commercial slabs, water tanks, coastal areas",
  },
  M30: {
    cement: 1,
    sand: 0.75,
    aggregate: 1.5,
    label: "Design Mix (M30)",
    charStrengthNmm2: 30,
    recommendedUse: "Multi-storey frames, high-strength columns (IS 10262 design mix required)",
  },
  M35: {
    cement: 1,
    sand: 0.65,
    aggregate: 1.3,
    label: "Design Mix (M35)",
    charStrengthNmm2: 35,
    recommendedUse: "Commercial high-rise foundations, bridges, heavy load bearing members",
  },
  M40: {
    cement: 1,
    sand: 0.55,
    aggregate: 1.1,
    label: "Design Mix (M40)",
    charStrengthNmm2: 40,
    recommendedUse: "Prestressed concrete, industrial floors, heavy civil infrastructure",
  },
  custom: {
    cement: 1,
    sand: 1.5,
    aggregate: 3,
    label: "Custom Ratio",
    charStrengthNmm2: 20,
    recommendedUse: "User specified volumetric or mass proportion",
  },
};

// Preliminary Steel Guidelines (kg/m3 of concrete) per CPWD / SP 34
export const TYPICAL_STEEL_KG_PER_M3: Record<RccElementType, { min: number; max: number; default: number }> = {
  slab: { min: 70, max: 95, default: 80 }, // ~1.0% steel by volume
  beam: { min: 100, max: 150, default: 120 }, // ~1.5% steel by volume
  column: { min: 130, max: 200, default: 160 }, // ~2.0% steel by volume
  footing: { min: 60, max: 95, default: 75 }, // ~0.8% steel by volume
  staircase: { min: 95, max: 130, default: 110 }, // ~1.3% steel by volume
  lintel: { min: 75, max: 110, default: 90 }, // ~1.0% steel by volume
  custom: { min: 60, max: 180, default: 100 },
};

// Standard TMT Bar Sizes and Unit Weights (d² / 162 kg/m)
export interface RebarSizeInfo {
  diameterMm: number;
  unitWeightKgPerM: number;
  label: string;
}

export const STANDARD_REBAR_SIZES: RebarSizeInfo[] = [
  { diameterMm: 6, unitWeightKgPerM: 36 / 162, label: "6 mm (Tie / Stirrup)" },
  { diameterMm: 8, unitWeightKgPerM: 64 / 162, label: "8 mm (Slab Distribution / Stirrup)" },
  { diameterMm: 10, unitWeightKgPerM: 100 / 162, label: "10 mm (Slab Main / Column Ties)" },
  { diameterMm: 12, unitWeightKgPerM: 144 / 162, label: "12 mm (Slab / Beam / Column Main)" },
  { diameterMm: 16, unitWeightKgPerM: 256 / 162, label: "16 mm (Beam / Column Main)" },
  { diameterMm: 20, unitWeightKgPerM: 400 / 162, label: "20 mm (Heavy Column / Beam Main)" },
  { diameterMm: 25, unitWeightKgPerM: 625 / 162, label: "25 mm (Footing / Heavy Column)" },
  { diameterMm: 32, unitWeightKgPerM: 1024 / 162, label: "32 mm (Foundation / Heavy Infrastructure)" },
];

/**
 * Calculates standard unit weight of steel rebar per metre
 * Formula: d² / 162 kg/m (standard IS 1786 formula: density 7850 kg/m³ * π/4 * d² * 10^-6 = d² / 162.28)
 */
export function getRebarUnitWeightKgPerM(diameterMm: number): number {
  if (diameterMm <= 0) return 0;
  return (diameterMm * diameterMm) / 162;
}

// RCC Structural Member in the multi-element bill
export interface RccElementItem {
  id: string;
  name: string;
  type: RccElementType;
  count: number;
  length: number;
  width: number;
  depth: number; // thickness / height / depth
  unit: DimensionUnit;
  widthUnit?: DimensionUnit;
  depthUnit?: DimensionUnit;
  manualVolumeM3?: number; // optional manual override
  estimatedSteelKgPerM3?: number; // optional override for this member
}

// BBS Bar Item
export interface BbsBarItem {
  id: string;
  description: string;
  barDiameterMm: number;
  numberOfBars: number;
  cuttingLengthMetres: number;
  numberOfMembers: number;
  lapLengthAllowanceM?: number;
}

// Labour Crew Member Item
export interface LabourCrewItem {
  id: string;
  role: string;
  workerCount: number;
  numberOfDays: number;
  dailyWageINR: number;
}

// Machinery Item
export interface MachineryItem {
  id: string;
  name: string;
  quantity: number;
  daysOrHours: number;
  rateINR: number;
  unit: "days" | "hours" | "flat";
}

// Full Calculator Inputs Interface
export interface RccCalculatorInputs {
  // Mode selection
  calculationMode: "quick" | "detailed";

  // Elements
  elements: RccElementItem[];
  overlapDeductionMethod: "gross" | "net_beam_slab"; // deduct beam-slab junction volume

  // Concrete Supply & Mix
  concreteSupplyMethod: ConcreteSupplyMethod;
  concreteGrade: ConcreteGrade;

  // Site Mix configuration
  siteMixMethod: SiteMixMethod;
  dryVolumeFactor: number; // default 1.54 per CPWD
  cementBagVolumeM3: number; // default 0.0347 m³
  customMixRatio: {
    cement: number;
    sand: number;
    aggregate: number;
  };

  // Design Mix configuration (kg/m3)
  designMix: {
    cementKgPerM3: number;
    fineAggregateKgPerM3: number;
    coarseAggregateKgPerM3: number;
    waterLitresPerM3: number;
    admixtureKgPerM3: number;
  };

  // RMC configuration
  rmcRatePerM3: number;
  rmcPumpingChargePerM3: number;
  rmcTransitChargeFlat: number;

  // Steel Reinforcement
  steelInputMode: SteelInputMode;
  preliminarySteelKgPerM3: number; // used in quick mode or as fallback
  bbsBars: BbsBarItem[];
  steelRatePerKg: number;
  steelTransportChargePerKg: number;

  // Binding Wire & Accessories
  bindingWireEstimateMode: "percentage_of_steel" | "direct_kg";
  bindingWirePercentage: number; // default 1.0% (10 kg / tonne)
  bindingWireDirectKg: number;
  bindingWireRatePerKg: number;
  coverBlocksLumpSumINR: number;
  admixtureCostINR: number;

  // Shuttering / Formwork
  shutteringMode: ShutteringInputMode;
  manualShutteringAreaSqFt: number;
  shutteringRatePerSqFt: number;
  shutteringRateUnit: "sqft" | "sqm";

  // Labour
  labourMode: LabourInputMode;
  labourRatePerM3: number;
  labourRatePerSqFt: number;
  labourLumpSumINR: number;
  labourCrew: LabourCrewItem[];

  // Machinery & Equipment
  includeMachinery: boolean;
  machineryItems: MachineryItem[];

  // Rates for Site-Mix Materials
  materialRates: {
    cementPerBagINR: number; // ₹ / 50kg bag
    sandRateINR: number; // ₹ / unit
    sandUnit: MaterialQuantityUnit; // m3, cft, tonne
    aggregateRateINR: number; // ₹ / unit
    aggregateUnit: MaterialQuantityUnit; // m3, cft, tonne
    waterCostLumpSumINR: number;
  };

  // Wastage allowances (%)
  wastagePct: {
    cement: number; // default 3%
    sand: number; // default 5%
    aggregate: number; // default 5%
    steel: number; // default 3%
  };

  // Additional Overheads & Profit
  overheadsPct: number; // default 0% or 5% (CPWD allows 5-10%)
  contractorProfitPct: number; // default 0% or 10%
  contingencyPct: number; // default 0% or 3%
  gstPct: number; // default 0% or 18% for works contract
}

// Single BOQ Item
export interface BoqItem {
  id: string;
  category: "Material" | "Steel" | "Formwork" | "Labour" | "Machinery" | "Overhead";
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  description?: string;
}

// Calculation Output Interface
export interface RccEstimateResult {
  // Volumes
  totalConcreteVolumeM3: number;
  totalConcreteVolumeCft: number;
  elementVolumes: Array<{
    id: string;
    name: string;
    type: RccElementType;
    volumeM3: number;
    volumeCft: number;
    shutteringAreaSqFt: number;
    steelKg: number;
    shareOfVolumePct: number;
  }>;
  totalFloorAreaSqFt: number; // relevant for slabs / plinth

  // Site-mix / RMC quantities
  cementBagsRequired: number;
  cementMetricTonnes: number;
  sandVolumeM3: number;
  sandVolumeCft: number;
  sandMetricTonnes: number;
  aggregateVolumeM3: number;
  aggregateVolumeCft: number;
  aggregateMetricTonnes: number;
  waterLitresEstimated: number;

  // Wastage quantities (isolated)
  wastage: {
    cementBags: number;
    sandM3: number;
    aggregateM3: number;
    steelKg: number;
  };

  // Steel
  totalSteelWeightKg: number;
  totalSteelWeightTonnes: number;
  bindingWireKg: number;

  // Shuttering
  totalShutteringAreaSqFt: number;
  totalShutteringAreaSqM: number;

  // Cost Breakdowns
  costSummary: {
    cementCost: number;
    sandCost: number;
    aggregateCost: number;
    waterCost: number;
    totalConcreteMaterialCost: number; // site-mix materials or RMC
    rmcSupplyCost: number;
    steelCost: number;
    bindingWireCost: number;
    accessoriesCost: number;
    totalMaterialCost: number; // concrete + steel + wire + accessories
    shutteringCost: number;
    labourCost: number;
    machineryCost: number;
    baseSubtotalCost: number; // direct cost before contractor overheads
    overheadsCost: number;
    profitCost: number;
    contingencyCost: number;
    gstAmount: number;
    grandTotalEstimatedCost: number;
  };

  // Unit Rates
  costPerCubicMetre: number;
  costPerCubicFoot: number;
  costPerSquareFootSlab: number; // applicable when slab area is present

  // BOQ Table
  boqItems: BoqItem[];

  // Distribution for Charts
  costDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
}

// Dynamic Insight Interface
export interface RccInsight {
  type: "positive" | "info" | "warning";
  title: string;
  text: string;
}

// -------------------------------------------------------------
// CORE CALCULATION ENGINES
// -------------------------------------------------------------

/**
 * Converts any length dimension into standard SI Metres
 */
export function convertDimensionToMetres(val: number, unit: DimensionUnit): number {
  if (isNaN(val) || val <= 0) return 0;
  return val * UNIT_TO_METRE_FACTORS[unit];
}

/**
 * Calculates exposed shuttering/formwork area for standard RCC members (in sq metres)
 */
export function calculateElementFormworkAreaSqM(el: RccElementItem): number {
  const L = convertDimensionToMetres(el.length, el.unit);
  const W = convertDimensionToMetres(el.width, el.widthUnit || el.unit);
  const D = convertDimensionToMetres(el.depth, el.depthUnit || el.unit);
  const count = Math.max(1, el.count || 1);

  if (L <= 0 || W <= 0 || count <= 0) return 0;

  switch (el.type) {
    case "slab":
      // Bottom soffit + 4 edge faces
      return (L * W + 2 * (L + W) * D) * count;
    case "beam":
      // Soffit bottom + 2 vertical sides
      return (L * W + 2 * L * D) * count;
    case "column":
      // 4 vertical side perimeter faces
      return (2 * (L + W) * D) * count;
    case "footing":
      // 4 perimeter side faces
      return (2 * (L + W) * D) * count;
    case "staircase":
      // Inclined waist soffit + side stringers + riser faces approx
      return (L * W * 1.35) * count;
    case "lintel":
      // Bottom soffit + 2 sides
      return (L * W + 2 * L * D) * count;
    case "custom":
    default:
      // Approx surface area factor
      return (2 * (L * W + L * D + W * D)) * count;
  }
}

/**
 * Calculates raw concrete volume of an element in cubic metres
 */
export function calculateElementVolumeM3(el: RccElementItem): number {
  if (el.manualVolumeM3 && el.manualVolumeM3 > 0) {
    return el.manualVolumeM3 * Math.max(1, el.count || 1);
  }

  const L = convertDimensionToMetres(el.length, el.unit);
  const W = convertDimensionToMetres(el.width, el.widthUnit || el.unit);
  const D = convertDimensionToMetres(el.depth, el.depthUnit || el.unit);
  const count = Math.max(1, el.count || 1);

  if (L <= 0 || W <= 0 || D <= 0 || count <= 0) return 0;

  return L * W * D * count;
}

/**
 * Calculates steel weight from a Bar Bending Schedule (BBS)
 */
export function calculateSteelWeightFromBbs(bars: BbsBarItem[]): number {
  let totalKg = 0;
  for (const bar of bars) {
    if (bar.barDiameterMm > 0 && bar.numberOfBars > 0 && bar.cuttingLengthMetres > 0) {
      const unitWeight = getRebarUnitWeightKgPerM(bar.barDiameterMm);
      const totalBarLength =
        (bar.cuttingLengthMetres + (bar.lapLengthAllowanceM || 0)) *
        bar.numberOfBars *
        Math.max(1, bar.numberOfMembers || 1);
      totalKg += totalBarLength * unitWeight;
    }
  }
  return totalKg;
}

/**
 * Master calculation function for the CalcZen RCC Price Calculator
 */
export function calculateMasterRccEstimate(inputs: RccCalculatorInputs): RccEstimateResult {
  // 1. Calculate Element Volumes
  let rawVolumeM3 = 0;
  let totalFloorAreaSqFt = 0;
  let autoShutteringAreaSqM = 0;

  const elementVolumes: RccEstimateResult["elementVolumes"] = [];

  for (const el of inputs.elements) {
    const volM3 = calculateElementVolumeM3(el);
    const formworkSqM = calculateElementFormworkAreaSqM(el);
    const formworkSqFt = formworkSqM * 10.7639104;

    rawVolumeM3 += volM3;
    autoShutteringAreaSqM += formworkSqM;

    // Track slab surface area for sq ft metrics
    if (el.type === "slab") {
      const L_m = convertDimensionToMetres(el.length, el.unit);
      const W_m = convertDimensionToMetres(el.width, el.widthUnit || el.unit);
      totalFloorAreaSqFt += L_m * W_m * Math.max(1, el.count || 1) * 10.7639104;
    }

    // Element-specific steel estimate
    const steelRatePerM3 =
      el.estimatedSteelKgPerM3 && el.estimatedSteelKgPerM3 > 0
        ? el.estimatedSteelKgPerM3
        : inputs.preliminarySteelKgPerM3 && inputs.preliminarySteelKgPerM3 > 0
        ? inputs.preliminarySteelKgPerM3
        : TYPICAL_STEEL_KG_PER_M3[el.type]?.default || 80;

    elementVolumes.push({
      id: el.id,
      name: el.name,
      type: el.type,
      volumeM3: volM3,
      volumeCft: volM3 * CFT_PER_CUBIC_METRE,
      shutteringAreaSqFt: formworkSqFt,
      steelKg: volM3 * steelRatePerM3,
      shareOfVolumePct: 0, // populated after total
    });
  }

  // Overlap deduction (beam-slab junction volume deduction)
  let totalConcreteVolumeM3 = rawVolumeM3;
  if (inputs.overlapDeductionMethod === "net_beam_slab" && rawVolumeM3 > 0) {
    // Standard quantity surveying deduction: beams that support slabs share the slab depth.
    // Typical net deduction factor is approx 3% - 5% on beam volume if modeled to slab top
    const beamElements = inputs.elements.filter((e) => e.type === "beam");
    let beamDeductionM3 = 0;
    for (const b of beamElements) {
      const bVol = calculateElementVolumeM3(b);
      beamDeductionM3 += bVol * 0.15; // beam top 15% overlap with slab
    }
    totalConcreteVolumeM3 = Math.max(0, rawVolumeM3 - beamDeductionM3);
  }

  const totalConcreteVolumeCft = totalConcreteVolumeM3 * CFT_PER_CUBIC_METRE;

  // Populate share of volume
  for (const ev of elementVolumes) {
    ev.shareOfVolumePct =
      totalConcreteVolumeM3 > 0 ? (ev.volumeM3 / totalConcreteVolumeM3) * 100 : 0;
  }

  // 2. Concrete Mix & Material Quantities
  let cementBagsRequired = 0;
  let sandVolumeM3 = 0;
  let aggregateVolumeM3 = 0;
  let waterLitresEstimated = 0;

  const dryVolumeFactor = inputs.dryVolumeFactor > 0 ? inputs.dryVolumeFactor : 1.54;
  const cementBagVolM3 = inputs.cementBagVolumeM3 > 0 ? inputs.cementBagVolumeM3 : CEMENT_BAG_VOLUME_M3;

  let baseCementBags = 0;
  let baseSandM3 = 0;
  let baseAggM3 = 0;

  if (inputs.concreteSupplyMethod === "site_mix") {
    if (inputs.siteMixMethod === "nominal") {
      const preset =
        inputs.concreteGrade === "custom"
          ? {
              cement: inputs.customMixRatio.cement || 1,
              sand: inputs.customMixRatio.sand || 1.5,
              aggregate: inputs.customMixRatio.aggregate || 3,
            }
          : NOMINAL_MIX_PRESETS[inputs.concreteGrade] || NOMINAL_MIX_PRESETS.M20;

      const totalParts = preset.cement + preset.sand + preset.aggregate;
      const dryVolumeM3 = totalConcreteVolumeM3 * dryVolumeFactor;

      if (totalParts > 0 && dryVolumeM3 > 0) {
        const cementVolM3 = (dryVolumeM3 * preset.cement) / totalParts;
        baseSandM3 = (dryVolumeM3 * preset.sand) / totalParts;
        baseAggM3 = (dryVolumeM3 * preset.aggregate) / totalParts;

        baseCementBags = cementVolM3 / cementBagVolM3;

        // Water estimate: standard nominal mix water-cement ratio is approx 0.50 (25 L / 50kg bag)
        waterLitresEstimated = baseCementBags * 25;
      }
    } else {
      // Design Mix (kg/m3)
      const dm = inputs.designMix;
      const totalCementKg = totalConcreteVolumeM3 * dm.cementKgPerM3;
      baseCementBags = totalCementKg / 50;

      // Convert fine & coarse aggregate from kg to m³ using standard densities
      baseSandM3 = (totalConcreteVolumeM3 * dm.fineAggregateKgPerM3) / BULK_DENSITIES.riverSand;
      baseAggM3 = (totalConcreteVolumeM3 * dm.coarseAggregateKgPerM3) / BULK_DENSITIES.coarseAggregate;
      waterLitresEstimated = totalConcreteVolumeM3 * dm.waterLitresPerM3;
    }

    // Apply Material Wastages
    const cementWastageFactor = 1 + (inputs.wastagePct.cement || 0) / 100;
    const sandWastageFactor = 1 + (inputs.wastagePct.sand || 0) / 100;
    const aggWastageFactor = 1 + (inputs.wastagePct.aggregate || 0) / 100;

    cementBagsRequired = baseCementBags * cementWastageFactor;
    sandVolumeM3 = baseSandM3 * sandWastageFactor;
    aggregateVolumeM3 = baseAggM3 * aggWastageFactor;
  }

  // Wastage isolated quantities
  const wastage = {
    cementBags: Math.max(0, cementBagsRequired - baseCementBags),
    sandM3: Math.max(0, sandVolumeM3 - baseSandM3),
    aggregateM3: Math.max(0, aggregateVolumeM3 - baseAggM3),
    steelKg: 0,
  };

  const cementMetricTonnes = (cementBagsRequired * 50) / 1000;
  const sandVolumeCft = sandVolumeM3 * CFT_PER_CUBIC_METRE;
  const sandMetricTonnes = (sandVolumeM3 * BULK_DENSITIES.riverSand) / 1000;
  const aggregateVolumeCft = aggregateVolumeM3 * CFT_PER_CUBIC_METRE;
  const aggregateMetricTonnes = (aggregateVolumeM3 * BULK_DENSITIES.coarseAggregate) / 1000;

  // 3. Steel Reinforcement Calculations
  let baseSteelKg = 0;
  if (inputs.steelInputMode === "bbs" && inputs.bbsBars.length > 0) {
    baseSteelKg = calculateSteelWeightFromBbs(inputs.bbsBars);
  } else {
    // Preliminary rule of thumb: sum of element steel or general rate
    baseSteelKg = elementVolumes.reduce((acc, el) => acc + el.steelKg, 0);
    if (baseSteelKg <= 0 && totalConcreteVolumeM3 > 0) {
      baseSteelKg = totalConcreteVolumeM3 * (inputs.preliminarySteelKgPerM3 || 80);
    }
  }

  const steelWastageFactor = 1 + (inputs.wastagePct.steel || 0) / 100;
  const totalSteelWeightKg = baseSteelKg * steelWastageFactor;
  wastage.steelKg = Math.max(0, totalSteelWeightKg - baseSteelKg);
  const totalSteelWeightTonnes = totalSteelWeightKg / 1000;

  // 4. Binding Wire
  let bindingWireKg = 0;
  if (inputs.bindingWireEstimateMode === "percentage_of_steel") {
    // Default 1% of steel (approx 10 kg / tonne)
    const pct = inputs.bindingWirePercentage > 0 ? inputs.bindingWirePercentage : 1.0;
    bindingWireKg = totalSteelWeightKg * (pct / 100);
  } else {
    bindingWireKg = inputs.bindingWireDirectKg || 0;
  }

  // 5. Formwork / Shuttering Area
  let totalShutteringAreaSqFt = 0;
  if (inputs.shutteringMode === "manual" && inputs.manualShutteringAreaSqFt > 0) {
    totalShutteringAreaSqFt = inputs.manualShutteringAreaSqFt;
  } else {
    totalShutteringAreaSqFt = autoShutteringAreaSqM * 10.7639104;
  }
  const totalShutteringAreaSqM = totalShutteringAreaSqFt / 10.7639104;

  // 6. Costs Calculations
  let cementCost = 0;
  let sandCost = 0;
  let aggregateCost = 0;
  let rmcSupplyCost = 0;

  if (inputs.concreteSupplyMethod === "site_mix") {
    // Cement
    cementCost = cementBagsRequired * (inputs.materialRates.cementPerBagINR || 0);

    // Sand
    if (inputs.materialRates.sandUnit === "cft") {
      sandCost = sandVolumeCft * (inputs.materialRates.sandRateINR || 0);
    } else if (inputs.materialRates.sandUnit === "tonne") {
      sandCost = sandMetricTonnes * (inputs.materialRates.sandRateINR || 0);
    } else {
      sandCost = sandVolumeM3 * (inputs.materialRates.sandRateINR || 0);
    }

    // Aggregate
    if (inputs.materialRates.aggregateUnit === "cft") {
      aggregateCost = aggregateVolumeCft * (inputs.materialRates.aggregateRateINR || 0);
    } else if (inputs.materialRates.aggregateUnit === "tonne") {
      aggregateCost = aggregateMetricTonnes * (inputs.materialRates.aggregateRateINR || 0);
    } else {
      aggregateCost = aggregateVolumeM3 * (inputs.materialRates.aggregateRateINR || 0);
    }
  } else {
    // Ready-Mix Concrete (RMC)
    const rmcBase = totalConcreteVolumeM3 * (inputs.rmcRatePerM3 || 0);
    const rmcPumping = totalConcreteVolumeM3 * (inputs.rmcPumpingChargePerM3 || 0);
    const rmcTransit = inputs.rmcTransitChargeFlat || 0;
    rmcSupplyCost = rmcBase + rmcPumping + rmcTransit;
  }

  const waterCost = inputs.materialRates.waterCostLumpSumINR || 0;
  const totalConcreteMaterialCost =
    inputs.concreteSupplyMethod === "site_mix"
      ? cementCost + sandCost + aggregateCost + waterCost
      : rmcSupplyCost;

  // Steel Cost
  const steelCost =
    totalSteelWeightKg *
    ((inputs.steelRatePerKg || 0) + (inputs.steelTransportChargePerKg || 0));

  // Binding Wire & Accessories
  const bindingWireCost = bindingWireKg * (inputs.bindingWireRatePerKg || 0);
  const accessoriesCost =
    (inputs.coverBlocksLumpSumINR || 0) + (inputs.admixtureCostINR || 0);

  const totalMaterialCost =
    totalConcreteMaterialCost + steelCost + bindingWireCost + accessoriesCost;

  // Shuttering Cost
  let shutteringCost = 0;
  if (inputs.shutteringRateUnit === "sqm") {
    shutteringCost = totalShutteringAreaSqM * (inputs.shutteringRatePerSqFt || 0);
  } else {
    shutteringCost = totalShutteringAreaSqFt * (inputs.shutteringRatePerSqFt || 0);
  }

  // Labour Cost
  let labourCost = 0;
  if (inputs.labourMode === "per_volume") {
    labourCost = totalConcreteVolumeM3 * (inputs.labourRatePerM3 || 0);
  } else if (inputs.labourMode === "per_area") {
    const area = totalFloorAreaSqFt > 0 ? totalFloorAreaSqFt : totalShutteringAreaSqFt;
    labourCost = area * (inputs.labourRatePerSqFt || 0);
  } else if (inputs.labourMode === "crew") {
    labourCost = inputs.labourCrew.reduce(
      (sum, c) => sum + (c.workerCount || 0) * (c.numberOfDays || 0) * (c.dailyWageINR || 0),
      0
    );
  } else {
    labourCost = inputs.labourLumpSumINR || 0;
  }

  // Machinery Cost
  let machineryCost = 0;
  if (inputs.includeMachinery && inputs.machineryItems.length > 0) {
    for (const m of inputs.machineryItems) {
      if (m.unit === "flat") {
        machineryCost += m.rateINR || 0;
      } else {
        machineryCost += (m.quantity || 1) * (m.daysOrHours || 1) * (m.rateINR || 0);
      }
    }
  }

  // Base Subtotal (Direct Construction Cost)
  const baseSubtotalCost =
    totalMaterialCost + shutteringCost + labourCost + machineryCost;

  // Overheads, Profit & Contingency
  const overheadsCost = baseSubtotalCost * ((inputs.overheadsPct || 0) / 100);
  const profitCost = baseSubtotalCost * ((inputs.contractorProfitPct || 0) / 100);
  const contingencyCost = baseSubtotalCost * ((inputs.contingencyPct || 0) / 100);

  const preTaxCost =
    baseSubtotalCost + overheadsCost + profitCost + contingencyCost;
  const gstAmount = preTaxCost * ((inputs.gstPct || 0) / 100);
  const grandTotalEstimatedCost = preTaxCost + gstAmount;

  // Unit Rates
  const costPerCubicMetre =
    totalConcreteVolumeM3 > 0 ? grandTotalEstimatedCost / totalConcreteVolumeM3 : 0;
  const costPerCubicFoot =
    totalConcreteVolumeCft > 0 ? grandTotalEstimatedCost / totalConcreteVolumeCft : 0;
  const costPerSquareFootSlab =
    totalFloorAreaSqFt > 0 ? grandTotalEstimatedCost / totalFloorAreaSqFt : 0;

  // 7. Generate Bill of Quantities (BOQ) Items
  const boqItems: BoqItem[] = [];

  if (inputs.concreteSupplyMethod === "site_mix") {
    if (cementBagsRequired > 0) {
      boqItems.push({
        id: "boq-cement",
        category: "Material",
        name: "Ordinary / Pozzolana Cement (50kg Bags)",
        quantity: Math.ceil(cementBagsRequired),
        unit: "Bags",
        rate: inputs.materialRates.cementPerBagINR,
        amount: cementCost,
        description: `Incl. ${inputs.wastagePct.cement}% handling wastage`,
      });
    }

    if (sandVolumeM3 > 0) {
      const isCft = inputs.materialRates.sandUnit === "cft";
      const isTonne = inputs.materialRates.sandUnit === "tonne";
      boqItems.push({
        id: "boq-sand",
        category: "Material",
        name: "River Sand / M-Sand (Zone II)",
        quantity: isCft
          ? Math.round(sandVolumeCft * 10) / 10
          : isTonne
          ? Math.round(sandMetricTonnes * 100) / 100
          : Math.round(sandVolumeM3 * 100) / 100,
        unit: isCft ? "cu ft" : isTonne ? "Tonnes" : "m³",
        rate: inputs.materialRates.sandRateINR,
        amount: sandCost,
        description: `Concrete fine aggregate`,
      });
    }

    if (aggregateVolumeM3 > 0) {
      const isCft = inputs.materialRates.aggregateUnit === "cft";
      const isTonne = inputs.materialRates.aggregateUnit === "tonne";
      boqItems.push({
        id: "boq-agg",
        category: "Material",
        name: "Coarse Aggregate (10mm - 20mm graded)",
        quantity: isCft
          ? Math.round(aggregateVolumeCft * 10) / 10
          : isTonne
          ? Math.round(aggregateMetricTonnes * 100) / 100
          : Math.round(aggregateVolumeM3 * 100) / 100,
        unit: isCft ? "cu ft" : isTonne ? "Tonnes" : "m³",
        rate: inputs.materialRates.aggregateRateINR,
        amount: aggregateCost,
        description: `Crushed granite stone aggregate`,
      });
    }
  } else {
    boqItems.push({
      id: "boq-rmc",
      category: "Material",
      name: `Ready-Mix Concrete (${inputs.concreteGrade})`,
      quantity: Math.round(totalConcreteVolumeM3 * 100) / 100,
      unit: "m³",
      rate: inputs.rmcRatePerM3,
      amount: rmcSupplyCost,
      description: `Commercial transit RMC concrete`,
    });
  }

  if (totalSteelWeightKg > 0) {
    boqItems.push({
      id: "boq-steel",
      category: "Steel",
      name: "TMT Reinforcement Steel (Fe 500D / 550D)",
      quantity: Math.round(totalSteelWeightKg),
      unit: "kg",
      rate: inputs.steelRatePerKg + inputs.steelTransportChargePerKg,
      amount: steelCost,
      description: `${Math.round(totalSteelWeightTonnes * 100) / 100} Metric Tonnes`,
    });
  }

  if (bindingWireKg > 0) {
    boqItems.push({
      id: "boq-wire",
      category: "Steel",
      name: "GI Binding Wire (18 Gauge)",
      quantity: Math.round(bindingWireKg * 10) / 10,
      unit: "kg",
      rate: inputs.bindingWireRatePerKg,
      amount: bindingWireCost,
      description: "Tying reinforcement rebar joints",
    });
  }

  if (accessoriesCost > 0) {
    boqItems.push({
      id: "boq-accessories",
      category: "Material",
      name: "Cover Blocks, Spacers & Admixtures",
      quantity: 1,
      unit: "Lump Sum",
      rate: accessoriesCost,
      amount: accessoriesCost,
      description: "Concrete cover blocks & placement aids",
    });
  }

  if (totalShutteringAreaSqFt > 0) {
    boqItems.push({
      id: "boq-shuttering",
      category: "Formwork",
      name: "Centering & Shuttering (Plywood / Steel Plates)",
      quantity: Math.round(totalShutteringAreaSqFt),
      unit: "sq ft",
      rate: inputs.shutteringRatePerSqFt,
      amount: shutteringCost,
      description: "Props, runners, staging & formwork stripping",
    });
  }

  if (labourCost > 0) {
    boqItems.push({
      id: "boq-labour",
      category: "Labour",
      name: "Concreting, Masons & Steel Fixing Labour",
      quantity: 1,
      unit: "Job",
      rate: labourCost,
      amount: labourCost,
      description: `Mixing, placing, vibrating and curing work`,
    });
  }

  if (machineryCost > 0) {
    boqItems.push({
      id: "boq-machinery",
      category: "Machinery",
      name: "Equipment & Mixer / Vibrator / Pump Hire",
      quantity: 1,
      unit: "Job",
      rate: machineryCost,
      amount: machineryCost,
      description: "Plant & machinery operating costs",
    });
  }

  if (overheadsCost > 0) {
    boqItems.push({
      id: "boq-overhead",
      category: "Overhead",
      name: `Contractor Overhead (${inputs.overheadsPct}%)`,
      quantity: inputs.overheadsPct,
      unit: "%",
      rate: baseSubtotalCost,
      amount: overheadsCost,
      description: "Supervision, office & site establishment",
    });
  }

  if (profitCost > 0) {
    boqItems.push({
      id: "boq-profit",
      category: "Overhead",
      name: `Contractor Profit (${inputs.contractorProfitPct}%)`,
      quantity: inputs.contractorProfitPct,
      unit: "%",
      rate: baseSubtotalCost,
      amount: profitCost,
      description: "Contractor margin & risk allowance",
    });
  }

  if (contingencyCost > 0) {
    boqItems.push({
      id: "boq-contingency",
      category: "Overhead",
      name: `Site Contingency (${inputs.contingencyPct}%)`,
      quantity: inputs.contingencyPct,
      unit: "%",
      rate: baseSubtotalCost,
      amount: contingencyCost,
      description: "Unforeseen site variations",
    });
  }

  if (gstAmount > 0) {
    boqItems.push({
      id: "boq-gst",
      category: "Overhead",
      name: `GST on Works Contract (${inputs.gstPct}%)`,
      quantity: inputs.gstPct,
      unit: "%",
      rate: preTaxCost,
      amount: gstAmount,
      description: "Applicable indirect tax",
    });
  }

  // 8. Cost Distribution for Recharts
  const rawSegments = [
    { name: "Concrete Materials", value: totalConcreteMaterialCost, color: "#3B82F6" },
    { name: "Steel Rebar & Wire", value: steelCost + bindingWireCost, color: "#F59E0B" },
    { name: "Shuttering / Formwork", value: shutteringCost, color: "#10B981" },
    { name: "Labour Charges", value: labourCost, color: "#8B5CF6" },
    { name: "Machinery & Equipment", value: machineryCost, color: "#EC4899" },
    {
      name: "Overheads & Profit",
      value: overheadsCost + profitCost + contingencyCost + gstAmount + accessoriesCost,
      color: "#6B7280",
    },
  ].filter((s) => s.value > 0);

  const costDistribution = rawSegments.map((s) => ({
    ...s,
    percentage:
      grandTotalEstimatedCost > 0
        ? Math.round((s.value / grandTotalEstimatedCost) * 1000) / 10
        : 0,
  }));

  return {
    totalConcreteVolumeM3,
    totalConcreteVolumeCft,
    elementVolumes,
    totalFloorAreaSqFt,
    cementBagsRequired,
    cementMetricTonnes,
    sandVolumeM3,
    sandVolumeCft,
    sandMetricTonnes,
    aggregateVolumeM3,
    aggregateVolumeCft,
    aggregateMetricTonnes,
    waterLitresEstimated,
    wastage,
    totalSteelWeightKg,
    totalSteelWeightTonnes,
    bindingWireKg,
    totalShutteringAreaSqFt,
    totalShutteringAreaSqM,
    costSummary: {
      cementCost,
      sandCost,
      aggregateCost,
      waterCost,
      totalConcreteMaterialCost,
      rmcSupplyCost,
      steelCost,
      bindingWireCost,
      accessoriesCost,
      totalMaterialCost,
      shutteringCost,
      labourCost,
      machineryCost,
      baseSubtotalCost,
      overheadsCost,
      profitCost,
      contingencyCost,
      gstAmount,
      grandTotalEstimatedCost,
    },
    costPerCubicMetre,
    costPerCubicFoot,
    costPerSquareFootSlab,
    boqItems,
    costDistribution,
  };
}

/**
 * Generates dynamic, realistic civil engineering insights
 */
export function generateRccInsights(result: RccEstimateResult): RccInsight[] {
  const insights: RccInsight[] = [];
  const cost = result.costSummary;
  const grandTotal = cost.grandTotalEstimatedCost;

  if (grandTotal <= 0 || result.totalConcreteVolumeM3 <= 0) {
    return [
      {
        type: "info",
        title: "Ready to Estimate",
        text: "Enter your RCC member dimensions, concrete grade, and material rates to generate an authoritative quantity takeoff and cost estimate.",
      },
    ];
  }

  // Steel % Insight
  const steelCostTotal = cost.steelCost + cost.bindingWireCost;
  const steelPct = Math.round((steelCostTotal / grandTotal) * 100);
  if (steelPct > 0) {
    insights.push({
      type: "info",
      title: `Steel Constitutes ${steelPct}% of Total RCC Cost`,
      text: `Reinforcement steel is typically the single largest material expenditure in RCC construction. You need approx ${Math.round(
        result.totalSteelWeightKg
      ).toLocaleString("en-IN")} kg (${(result.totalSteelWeightTonnes).toFixed(
        2
      )} MT) of TMT steel. Fluctuations in steel market rates will directly impact your budget.`,
    });
  }

  // Cement Bags Takeoff
  if (result.cementBagsRequired > 0) {
    insights.push({
      type: "positive",
      title: `${Math.ceil(result.cementBagsRequired)} Cement Bags (${(
        result.cementMetricTonnes
      ).toFixed(2)} MT) Required`,
      text: `Based on your concrete volume of ${result.totalConcreteVolumeM3.toFixed(
        2
      )} m³ (${result.totalConcreteVolumeCft.toFixed(
        1
      )} ft³) and standard dry-volume density factor (1.54), ensure cement is purchased in fresh batches and stored in a moisture-free dry shed.`,
    });
  }

  // Unit Cost Benchmark
  if (result.costPerCubicMetre > 0) {
    const cpwdLow = 7500;
    const cpwdHigh = 12500;
    const currentRate = Math.round(result.costPerCubicMetre);

    let statusText = `Your calculated rate of ₹${currentRate.toLocaleString(
      "en-IN"
    )}/m³ (₹${Math.round(result.costPerCubicFoot).toLocaleString(
      "en-IN"
    )}/ft³) aligns well with standard Indian residential construction norms (typically ₹8,000 – ₹12,000/m³ including materials, steel, formwork, and labour).`;

    if (currentRate < cpwdLow) {
      statusText = `Your calculated rate of ₹${currentRate.toLocaleString(
        "en-IN"
      )}/m³ is on the lower side. Verify whether contractor overheads, crane/pump hire, shuttering staging, or steel transport charges are accounted for.`;
    } else if (currentRate > cpwdHigh) {
      statusText = `Your calculated rate of ₹${currentRate.toLocaleString(
        "en-IN"
      )}/m³ reflects heavy reinforcement, high formwork complexity, or comprehensive contractor profit and contingency.`;
    }

    insights.push({
      type: currentRate < cpwdLow ? "warning" : "info",
      title: `Unit Cost: ₹${currentRate.toLocaleString("en-IN")} per m³`,
      text: statusText,
    });
  }

  // Slab Area Metric if applicable
  if (result.costPerSquareFootSlab > 0) {
    insights.push({
      type: "info",
      title: `Roof Slab Cost: ₹${Math.round(result.costPerSquareFootSlab).toLocaleString(
        "en-IN"
      )} per sq ft`,
      text: `For a total slab area of ${Math.round(
        result.totalFloorAreaSqFt
      ).toLocaleString(
        "en-IN"
      )} sq ft, your all-inclusive RCC casting budget is ₹${Math.round(
        result.costPerSquareFootSlab
      )}/sq ft (concrete + steel + shuttering + labour). This is consistent with Indian metro and tier-2 contractor quotations (typically ₹180 – ₹250/sq ft for RCC casting only).`,
    });
  }

  // Shuttering Impact
  const formworkPct = Math.round((cost.shutteringCost / grandTotal) * 100);
  if (formworkPct >= 12) {
    insights.push({
      type: "positive",
      title: `Formwork & Centering: ${formworkPct}% of Budget`,
      text: `Shuttering accounts for ₹${Math.round(
        cost.shutteringCost
      ).toLocaleString(
        "en-IN"
      )} (${Math.round(result.totalShutteringAreaSqFt)} sq ft). Using waterproof ply shuttering yields a smoother ceiling finish, significantly reducing subsequent plastering mortar and labour costs.`,
    });
  }

  return insights;
}

// -------------------------------------------------------------
// PRESETS FOR QUICK LOADING
// -------------------------------------------------------------

export const PRESET_SAMPLE_ROOF_SLAB: RccCalculatorInputs = {
  calculationMode: "quick",
  elements: [
    {
      id: "slab-1",
      name: "Residential Roof Slab",
      type: "slab",
      count: 1,
      length: 40,
      width: 25,
      depth: 5, // 5 inches
      unit: "ft",
      depthUnit: "in",
      estimatedSteelKgPerM3: 80,
    },
    {
      id: "beam-1",
      name: "Supporting Plinth & Roof Beams",
      type: "beam",
      count: 6,
      length: 25,
      width: 9, // 9 inches
      depth: 12, // 12 inches
      unit: "ft",
      widthUnit: "in",
      depthUnit: "in",
      estimatedSteelKgPerM3: 120,
    },
  ],
  overlapDeductionMethod: "gross",
  concreteSupplyMethod: "site_mix",
  concreteGrade: "M20",
  siteMixMethod: "nominal",
  dryVolumeFactor: 1.54,
  cementBagVolumeM3: CEMENT_BAG_VOLUME_M3,
  customMixRatio: { cement: 1, sand: 1.5, aggregate: 3 },
  designMix: {
    cementKgPerM3: 380,
    fineAggregateKgPerM3: 680,
    coarseAggregateKgPerM3: 1180,
    waterLitresPerM3: 180,
    admixtureKgPerM3: 3.5,
  },
  rmcRatePerM3: 4200,
  rmcPumpingChargePerM3: 350,
  rmcTransitChargeFlat: 2000,
  steelInputMode: "preliminary",
  preliminarySteelKgPerM3: 85,
  bbsBars: [],
  steelRatePerKg: 62,
  steelTransportChargePerKg: 2,
  bindingWireEstimateMode: "percentage_of_steel",
  bindingWirePercentage: 1.0,
  bindingWireDirectKg: 15,
  bindingWireRatePerKg: 80,
  coverBlocksLumpSumINR: 1500,
  admixtureCostINR: 1200,
  shutteringMode: "auto",
  manualShutteringAreaSqFt: 1200,
  shutteringRatePerSqFt: 38,
  shutteringRateUnit: "sqft",
  labourMode: "per_volume",
  labourRatePerM3: 1600,
  labourRatePerSqFt: 45,
  labourLumpSumINR: 25000,
  labourCrew: [
    { id: "c-1", role: "Head Mason", workerCount: 2, numberOfDays: 2, dailyWageINR: 950 },
    { id: "c-2", role: "Concreting Helpers", workerCount: 8, numberOfDays: 2, dailyWageINR: 650 },
    { id: "c-3", role: "Bar Benders / Steel Fixers", workerCount: 3, numberOfDays: 2, dailyWageINR: 800 },
  ],
  includeMachinery: true,
  machineryItems: [
    { id: "m-1", name: "Concrete Mixer Machine (10/7 Cft)", quantity: 1, daysOrHours: 2, rateINR: 1800, unit: "days" },
    { id: "m-2", name: "Needle Needle Vibrator", quantity: 2, daysOrHours: 2, rateINR: 500, unit: "days" },
  ],
  materialRates: {
    cementPerBagINR: 390,
    sandRateINR: 1650,
    sandUnit: "m3",
    aggregateRateINR: 1500,
    aggregateUnit: "m3",
    waterCostLumpSumINR: 1000,
  },
  wastagePct: {
    cement: 3,
    sand: 5,
    aggregate: 5,
    steel: 3,
  },
  overheadsPct: 0,
  contractorProfitPct: 0,
  contingencyPct: 2,
  gstPct: 0,
};

export const PRESET_SAMPLE_VILLA_FRAME: RccCalculatorInputs = {
  calculationMode: "detailed",
  elements: [
    { id: "f-1", name: "Isolated Column Footings", type: "footing", count: 12, length: 1.5, width: 1.5, depth: 0.45, unit: "m", estimatedSteelKgPerM3: 75 },
    { id: "col-1", name: "Ground Floor Columns", type: "column", count: 12, length: 0.3, width: 0.3, depth: 3.2, unit: "m", estimatedSteelKgPerM3: 160 },
    { id: "pl-1", name: "Plinth Beams", type: "beam", count: 14, length: 4.5, width: 0.23, depth: 0.45, unit: "m", estimatedSteelKgPerM3: 120 },
    { id: "sl-1", name: "First Floor Slab", type: "slab", count: 1, length: 12, width: 9, depth: 0.125, unit: "m", estimatedSteelKgPerM3: 80 },
    { id: "st-1", name: "Doglegged Staircase", type: "staircase", count: 1, length: 4, width: 1.2, depth: 0.15, unit: "m", estimatedSteelKgPerM3: 110 },
  ],
  overlapDeductionMethod: "net_beam_slab",
  concreteSupplyMethod: "site_mix",
  concreteGrade: "M25",
  siteMixMethod: "nominal",
  dryVolumeFactor: 1.54,
  cementBagVolumeM3: CEMENT_BAG_VOLUME_M3,
  customMixRatio: { cement: 1, sand: 1, aggregate: 2 },
  designMix: {
    cementKgPerM3: 410,
    fineAggregateKgPerM3: 650,
    coarseAggregateKgPerM3: 1150,
    waterLitresPerM3: 185,
    admixtureKgPerM3: 4.0,
  },
  rmcRatePerM3: 4500,
  rmcPumpingChargePerM3: 400,
  rmcTransitChargeFlat: 2500,
  steelInputMode: "preliminary",
  preliminarySteelKgPerM3: 110,
  bbsBars: [],
  steelRatePerKg: 64,
  steelTransportChargePerKg: 2,
  bindingWireEstimateMode: "percentage_of_steel",
  bindingWirePercentage: 1.0,
  bindingWireDirectKg: 35,
  bindingWireRatePerKg: 85,
  coverBlocksLumpSumINR: 3500,
  admixtureCostINR: 2500,
  shutteringMode: "auto",
  manualShutteringAreaSqFt: 2800,
  shutteringRatePerSqFt: 40,
  shutteringRateUnit: "sqft",
  labourMode: "crew",
  labourRatePerM3: 1750,
  labourRatePerSqFt: 50,
  labourLumpSumINR: 65000,
  labourCrew: [
    { id: "c-1", role: "Master Mason", workerCount: 3, numberOfDays: 5, dailyWageINR: 1000 },
    { id: "c-2", role: "Concreting Helpers", workerCount: 10, numberOfDays: 5, dailyWageINR: 700 },
    { id: "c-3", role: "Bar Benders / Fitters", workerCount: 4, numberOfDays: 5, dailyWageINR: 850 },
    { id: "c-4", role: "Shuttering Carpenters", workerCount: 4, numberOfDays: 5, dailyWageINR: 900 },
  ],
  includeMachinery: true,
  machineryItems: [
    { id: "m-1", name: "Diesel Concrete Mixer", quantity: 1, daysOrHours: 5, rateINR: 2000, unit: "days" },
    { id: "m-2", name: "Needle Vibrators (Electric/Petrol)", quantity: 2, daysOrHours: 5, rateINR: 600, unit: "days" },
  ],
  materialRates: {
    cementPerBagINR: 410,
    sandRateINR: 1700,
    sandUnit: "m3",
    aggregateRateINR: 1550,
    aggregateUnit: "m3",
    waterCostLumpSumINR: 2500,
  },
  wastagePct: {
    cement: 3,
    sand: 5,
    aggregate: 5,
    steel: 3,
  },
  overheadsPct: 5,
  contractorProfitPct: 10,
  contingencyPct: 3,
  gstPct: 18,
};

// -------------------------------------------------------------
// FORMATTING HELPERS
// -------------------------------------------------------------

export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return (
    "₹" +
    Math.round(val).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

export function formatINRWithDecimals(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0.00";
  return (
    "₹" +
    val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return "0";
  return val.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
