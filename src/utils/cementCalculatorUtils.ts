/**
 * CalcZen Cement Bag Calculator Utilities (India)
 * Authoritative Indian Civil Engineering References:
 * - Bureau of Indian Standards: IS 456:2000 (Plain and Reinforced Concrete - Code of Practice)
 * - Bureau of Indian Standards: IS 10262:2019 (Concrete Mix Proportioning Guidelines)
 * - Bureau of Indian Standards: IS 2250:1981 (Preparation and Use of Masonry Mortars)
 * - Bureau of Indian Standards: IS 1542:1992 (Sand for Plaster)
 * - Central Public Works Department (CPWD Delhi Schedule of Rates & Analysis of Rates)
 */

export type ConstructionWorkType =
  | "concrete"
  | "plaster_wall"
  | "plaster_ceiling"
  | "brickwork"
  | "blockwork"
  | "flooring_screed"
  | "custom_volume";

export type DimensionUnit = "m" | "ft" | "in" | "cm" | "mm";
export type AreaUnit = "sqft" | "sqm";
export type VolumeUnit = "m3" | "cft" | "litres";
export type MaterialPriceUnit = "bag" | "kg" | "cft" | "m3" | "brass" | "tonne";

export type ConcreteMixMethod = "nominal" | "design";
export type BrickworkInputMethod = "wall_dimensions" | "direct_mortar";

// Standard Constants
export const STANDARD_CEMENT_BULK_DENSITY = 1440; // kg/m³ per IS 456 / CPWD
export const STANDARD_CEMENT_BAG_MASS_KG = 50; // 50 kg per standard Indian cement bag
export const CFT_PER_CUBIC_METRE = 35.3146667;
export const BRASS_IN_CFT = 100; // 1 Brass = 100 cu ft in Indian construction
export const SQFT_PER_SQM = 10.7639104;

// Default Dry Volume Factors per CPWD Norms
export const DRY_VOLUME_FACTORS = {
  concrete: 1.54, // 54% void allowance for coarse aggregate, sand & cement voids
  mortar: 1.33, // 33% void shrinkage for sand and cement paste
} as const;

// Conversion factors to standard SI Metres
export const LENGTH_CONVERSIONS_TO_METRES: Record<DimensionUnit, number> = {
  m: 1,
  ft: 0.3048,
  in: 0.0254,
  cm: 0.01,
  mm: 0.001,
};

// Conversions from volume units to m3
export const VOLUME_CONVERSIONS_TO_M3: Record<VolumeUnit, number> = {
  m3: 1,
  cft: 1 / CFT_PER_CUBIC_METRE, // 0.0283168 m³
  litres: 0.001,
};

// Conversions from area units to m2
export const AREA_CONVERSIONS_TO_M2: Record<AreaUnit, number> = {
  sqm: 1,
  sqft: 1 / SQFT_PER_SQM, // 0.092903 m²
};

// Work-specific Ratio Presets
export interface MixRatioPreset {
  id: string;
  label: string;
  cement: number;
  sand: number;
  aggregate: number; // 0 for mortars
  recommendedUse: string;
  isPopular?: boolean;
}

export const CONCRETE_RATIO_PRESETS: MixRatioPreset[] = [
  {
    id: "m20",
    label: "1 : 1.5 : 3 (M20 Nominal)",
    cement: 1,
    sand: 1.5,
    aggregate: 3,
    recommendedUse: "Standard residential roof slabs, beams, columns (IS 456 min RCC)",
    isPopular: true,
  },
  {
    id: "m25",
    label: "1 : 1 : 2 (M25 Nominal)",
    cement: 1,
    sand: 1,
    aggregate: 2,
    recommendedUse: "Heavy columns, commercial slabs, water tanks",
    isPopular: false,
  },
  {
    id: "m15",
    label: "1 : 2 : 4 (M15 Nominal)",
    cement: 1,
    sand: 2,
    aggregate: 4,
    recommendedUse: "Plain concrete, flooring base, pathways, boundary foundations",
    isPopular: false,
  },
  {
    id: "m10",
    label: "1 : 3 : 6 (M10 Nominal)",
    cement: 1,
    sand: 3,
    aggregate: 6,
    recommendedUse: "PCC leveling course below foundations and footings",
    isPopular: false,
  },
];

export const PLASTER_RATIO_PRESETS: MixRatioPreset[] = [
  {
    id: "p_1_4",
    label: "1 : 4 (Rich Mortar)",
    cement: 1,
    sand: 4,
    aggregate: 0,
    recommendedUse: "Ceiling plaster, external walls, damp areas",
    isPopular: true,
  },
  {
    id: "p_1_5",
    label: "1 : 5 (Medium Mortar)",
    cement: 1,
    sand: 5,
    aggregate: 0,
    recommendedUse: "Internal wall plastering (standard Indian finish)",
    isPopular: false,
  },
  {
    id: "p_1_6",
    label: "1 : 6 (Lean Mortar)",
    cement: 1,
    sand: 6,
    aggregate: 0,
    recommendedUse: "General internal plaster on quality clay brick surfaces",
    isPopular: false,
  },
  {
    id: "p_1_3",
    label: "1 : 3 (Extra Rich)",
    cement: 1,
    sand: 3,
    aggregate: 0,
    recommendedUse: "Repairs, drip course, grooves, and waterproofing base",
    isPopular: false,
  },
];

export const BRICKWORK_RATIO_PRESETS: MixRatioPreset[] = [
  {
    id: "b_1_6",
    label: "1 : 6 (Standard Masonry)",
    cement: 1,
    sand: 6,
    aggregate: 0,
    recommendedUse: "9-inch exterior and load-bearing brick walls",
    isPopular: true,
  },
  {
    id: "b_1_4",
    label: "1 : 4 (Partition Walls)",
    cement: 1,
    sand: 4,
    aggregate: 0,
    recommendedUse: "4.5-inch half-brick partition walls & reinforced masonry",
    isPopular: false,
  },
  {
    id: "b_1_5",
    label: "1 : 5 (General Masonry)",
    cement: 1,
    sand: 5,
    aggregate: 0,
    recommendedUse: "Foundation brickwork and perimeter compound walls",
    isPopular: false,
  },
  {
    id: "b_1_3",
    label: "1 : 3 (High Strength)",
    cement: 1,
    sand: 3,
    aggregate: 0,
    recommendedUse: "Manholes, inspection chambers, water-retaining masonry",
    isPopular: false,
  },
];

export const FLOORING_RATIO_PRESETS: MixRatioPreset[] = [
  {
    id: "f_1_4",
    label: "1 : 4 (Standard Screed)",
    cement: 1,
    sand: 4,
    aggregate: 0,
    recommendedUse: "Floor leveling screed beneath ceramic/vitrified tiles",
    isPopular: true,
  },
  {
    id: "f_1_3",
    label: "1 : 3 (IPS / Heavy Duty)",
    cement: 1,
    sand: 3,
    aggregate: 0,
    recommendedUse: "Indian Patent Stone (IPS) flooring, industrial floors, terraces",
    isPopular: false,
  },
  {
    id: "f_1_5",
    label: "1 : 5 (Bedding Screed)",
    cement: 1,
    sand: 5,
    aggregate: 0,
    recommendedUse: "Dry-mix bedding for granite and marble slabs",
    isPopular: false,
  },
];

// Structural Member Item for Concrete / RCC
export interface ConcreteElementItem {
  id: string;
  name: string;
  count: number;
  length: number;
  lengthUnit: DimensionUnit;
  width: number;
  widthUnit: DimensionUnit;
  depth: number;
  depthUnit: DimensionUnit;
}

// Full Calculator Inputs Interface
export interface CementCalculatorInputs {
  workType: ConstructionWorkType;
  calculationMode: "quick" | "advanced";

  // Concrete Specific
  concreteEntryMethod: "dimensions" | "direct_volume";
  concreteElements: ConcreteElementItem[];
  directConcreteVolume: number;
  directConcreteVolumeUnit: VolumeUnit;
  concreteMixMethod: ConcreteMixMethod;
  concreteDesignMix: {
    cementKgPerM3: number;
    sandKgPerM3: number;
    aggregateKgPerM3: number;
    waterLitresPerM3: number;
  };

  // Plaster Specific
  plasterAreaInputMode: "area" | "dimensions";
  plasterArea: number;
  plasterAreaUnit: AreaUnit;
  plasterLength: number;
  plasterLengthUnit: DimensionUnit;
  plasterHeight: number;
  plasterHeightUnit: DimensionUnit;
  plasterWallCount: number;
  plasterThicknessMm: number; // e.g. 6, 10, 12, 15, 18, 20

  // Brickwork Specific
  brickworkMethod: BrickworkInputMethod;
  directMortarVolume: number;
  directMortarVolumeUnit: VolumeUnit;
  wallLength: number;
  wallLengthUnit: DimensionUnit;
  wallHeight: number;
  wallHeightUnit: DimensionUnit;
  wallThickness: number;
  wallThicknessUnit: DimensionUnit;
  wallCount: number;
  brickType: "standard_modular" | "traditional_clay" | "aac_block" | "custom";
  brickLengthMm: number;
  brickWidthMm: number;
  brickHeightMm: number;
  mortarJointThicknessMm: number;

  // Flooring Specific
  flooringAreaInputMode: "area" | "dimensions";
  flooringArea: number;
  flooringAreaUnit: AreaUnit;
  flooringLength: number;
  flooringLengthUnit: DimensionUnit;
  flooringWidth: number;
  flooringWidthUnit: DimensionUnit;
  flooringRoomsCount: number;
  screedThicknessMm: number; // e.g. 25, 40, 50 mm

  // Custom Volume Specific
  customWetVolume: number;
  customVolumeUnit: VolumeUnit;

  // Mix Ratios
  mixRatio: {
    cement: number;
    sand: number;
    aggregate: number; // 0 for plaster, brickwork, screed
  };

  // Technical Configuration (Configurable in Advanced Mode)
  dryVolumeFactor: number; // default 1.54 for concrete, 1.33 for mortar
  cementBulkDensity: number; // default 1440 kg/m³
  cementBagMassKg: number; // default 50 kg (support 25kg, 40kg)
  wastagePercentage: number; // default 5%

  // Water Calculation
  enableWaterEstimate: boolean;
  waterCementRatio: number; // default 0.50 (mass based)

  // Material Rates
  rates: {
    cementPricePerBag: number;
    sandPrice: number;
    sandPriceUnit: "m3" | "cft" | "brass" | "tonne";
    aggregatePrice: number;
    aggregatePriceUnit: "m3" | "cft" | "brass" | "tonne";
  };
}

// Step-by-Step Working Record
export interface CalculationStep {
  stepNumber: number;
  title: string;
  formula: string;
  substitution: string;
  resultString: string;
  notes?: string;
}

// Master Output Interface
export interface CementEstimateResult {
  workType: ConstructionWorkType;
  wetVolumeM3: number;
  wetVolumeCft: number;
  dryVolumeM3: number;
  dryVolumeCft: number;

  // Cement Quantities
  baseCementVolumeM3: number;
  baseCementMassKg: number;
  wastageCementMassKg: number;
  totalCementMassKg: number;
  baseCementBagsExact: number;
  totalCementBagsExact: number; // fractional with wastage
  wholeBagsToPurchase: number; // ceiling rounded
  cementBagMassKg: number;

  // Sand Quantities
  sandVolumeM3: number;
  sandVolumeCft: number;
  sandBrass: number; // 1 Brass = 100 cu ft
  sandMassTonnes: number;

  // Coarse Aggregate Quantities (when applicable)
  aggregateVolumeM3: number;
  aggregateVolumeCft: number;
  aggregateBrass: number;
  aggregateMassTonnes: number;

  // Water Quantity (when enabled)
  waterLitresEstimated: number;

  // Brickwork / Masonry specific metrics
  masonry?: {
    grossWallVolumeM3: number;
    brickVolumeWithoutMortarM3: number;
    estimatedBrickCount: number;
    wetMortarVolumeM3: number;
    mortarSharePercentage: number;
  };

  // Cost Estimates
  costs: {
    cementExactConsumptionCost: number;
    cementPurchaseCost: number;
    sandCost: number;
    aggregateCost: number;
    totalMaterialCost: number;
  };

  // Step-by-step working
  steps: CalculationStep[];

  // Dynamic civil engineering tips
  insights: Array<{
    type: "positive" | "info" | "warning";
    title: string;
    text: string;
  }>;
}

// -------------------------------------------------------------
// CORE CONVERSION & VOLUME UTILITIES
// -------------------------------------------------------------

export function convertToMetres(val: number, unit: DimensionUnit): number {
  if (isNaN(val) || val <= 0) return 0;
  return val * (LENGTH_CONVERSIONS_TO_METRES[unit] || 1);
}

export function convertAreaToM2(area: number, unit: AreaUnit): number {
  if (isNaN(area) || area <= 0) return 0;
  return area * (AREA_CONVERSIONS_TO_M2[unit] || 1);
}

export function convertVolumeToM3(vol: number, unit: VolumeUnit): number {
  if (isNaN(vol) || vol <= 0) return 0;
  return vol * (VOLUME_CONVERSIONS_TO_M3[unit] || 1);
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount <= 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val)) return "0";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

// -------------------------------------------------------------
// CALCULATION ENGINE
// -------------------------------------------------------------

/**
 * Master calculation function for CalcZen Cement Bag Calculator
 */
export function calculateCementBagEstimate(inputs: CementCalculatorInputs): CementEstimateResult {
  const steps: CalculationStep[] = [];
  let stepIndex = 1;

  // 1. Calculate Wet Volume (m³) based on selected work type
  let wetVolumeM3 = 0;
  let masonryMetrics: CementEstimateResult["masonry"] = undefined;

  const bagMass = inputs.cementBagMassKg > 0 ? inputs.cementBagMassKg : STANDARD_CEMENT_BAG_MASS_KG;
  const bulkDensity = inputs.cementBulkDensity > 0 ? inputs.cementBulkDensity : STANDARD_CEMENT_BULK_DENSITY;
  const wastageMultiplier = 1 + Math.max(0, inputs.wastagePercentage || 0) / 100;

  switch (inputs.workType) {
    case "concrete": {
      if (inputs.concreteEntryMethod === "direct_volume") {
        wetVolumeM3 = convertVolumeToM3(inputs.directConcreteVolume, inputs.directConcreteVolumeUnit);
        steps.push({
          stepNumber: stepIndex++,
          title: "Wet Concrete Volume (Direct Entry)",
          formula: "Wet Volume = User Entered Volume",
          substitution: `${inputs.directConcreteVolume} ${inputs.directConcreteVolumeUnit} = ${wetVolumeM3.toFixed(3)} m³`,
          resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
        });
      } else {
        // Multi-element dimension calculation
        let totalM3 = 0;
        const details: string[] = [];

        for (const el of inputs.concreteElements) {
          const L_m = convertToMetres(el.length, el.lengthUnit);
          const W_m = convertToMetres(el.width, el.widthUnit);
          const D_m = convertToMetres(el.depth, el.depthUnit);
          const count = Math.max(1, el.count || 1);
          const volM3 = L_m * W_m * D_m * count;
          totalM3 += volM3;
          details.push(`${el.name}: ${count} × (${L_m.toFixed(2)}m × ${W_m.toFixed(2)}m × ${D_m.toFixed(3)}m) = ${volM3.toFixed(3)} m³`);
        }

        wetVolumeM3 = totalM3;
        steps.push({
          stepNumber: stepIndex++,
          title: "Total Wet Concrete Volume from Members",
          formula: "Wet Volume = ∑ (Length × Width × Depth × Count)",
          substitution: details.join(" + ") || "0 m³",
          resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
        });
      }
      break;
    }

    case "plaster_wall":
    case "plaster_ceiling": {
      let areaM2 = 0;
      let areaSub = "";
      if (inputs.plasterAreaInputMode === "area") {
        areaM2 = convertAreaToM2(inputs.plasterArea, inputs.plasterAreaUnit);
        areaSub = `${inputs.plasterArea} ${inputs.plasterAreaUnit} = ${areaM2.toFixed(2)} m²`;
      } else {
        const L_m = convertToMetres(inputs.plasterLength, inputs.plasterLengthUnit);
        const H_m = convertToMetres(inputs.plasterHeight, inputs.plasterHeightUnit);
        const count = Math.max(1, inputs.plasterWallCount || 1);
        areaM2 = L_m * H_m * count;
        areaSub = `${count} walls × (${L_m.toFixed(2)}m × ${H_m.toFixed(2)}m) = ${areaM2.toFixed(2)} m²`;
      }

      const thicknessM = (inputs.plasterThicknessMm || 12) / 1000;
      wetVolumeM3 = areaM2 * thicknessM;

      steps.push({
        stepNumber: stepIndex++,
        title: "Wet Plaster Mortar Volume",
        formula: "Wet Volume = Plaster Area × Thickness (in metres)",
        substitution: `${areaM2.toFixed(2)} m² × ${thicknessM.toFixed(4)} m (${inputs.plasterThicknessMm} mm)`,
        resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
        notes: areaSub,
      });
      break;
    }

    case "brickwork":
    case "blockwork": {
      if (inputs.brickworkMethod === "direct_mortar") {
        wetVolumeM3 = convertVolumeToM3(inputs.directMortarVolume, inputs.directMortarVolumeUnit);
        steps.push({
          stepNumber: stepIndex++,
          title: "Wet Mortar Volume (Direct Entry)",
          formula: "Wet Volume = User Entered Mortar Volume",
          substitution: `${inputs.directMortarVolume} ${inputs.directMortarVolumeUnit} = ${wetVolumeM3.toFixed(3)} m³`,
          resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
        });
      } else {
        // Wall dimensions & brick unit calculation
        const L_m = convertToMetres(inputs.wallLength, inputs.wallLengthUnit);
        const H_m = convertToMetres(inputs.wallHeight, inputs.wallHeightUnit);
        const T_m = convertToMetres(inputs.wallThickness, inputs.wallThicknessUnit);
        const count = Math.max(1, inputs.wallCount || 1);
        const grossWallVolM3 = L_m * H_m * T_m * count;

        // Brick dimensions
        const bL_m = (inputs.brickLengthMm || 190) / 1000;
        const bW_m = (inputs.brickWidthMm || 90) / 1000;
        const bH_m = (inputs.brickHeightMm || 90) / 1000;
        const jointM = (inputs.mortarJointThicknessMm || 10) / 1000;

        const nominalL = bL_m + jointM;
        const nominalW = bW_m + jointM;
        const nominalH = bH_m + jointM;

        const nominalBrickVolM3 = nominalL * nominalW * nominalH;
        const actualBrickVolM3 = bL_m * bW_m * bH_m;

        const estBrickCount = nominalBrickVolM3 > 0 ? Math.ceil(grossWallVolM3 / nominalBrickVolM3) : 0;
        const totalBricksVolM3 = estBrickCount * actualBrickVolM3;
        wetVolumeM3 = Math.max(0, grossWallVolM3 - totalBricksVolM3);

        const sharePct = grossWallVolM3 > 0 ? (wetVolumeM3 / grossWallVolM3) * 100 : 25;

        masonryMetrics = {
          grossWallVolumeM3: grossWallVolM3,
          brickVolumeWithoutMortarM3: totalBricksVolM3,
          estimatedBrickCount: estBrickCount,
          wetMortarVolumeM3: wetVolumeM3,
          mortarSharePercentage: sharePct,
        };

        steps.push({
          stepNumber: stepIndex++,
          title: "Masonry Wall Volume & Brick Count Takeoff",
          formula: "Gross Volume = Wall L × H × T × Count; Brick Count = Gross Vol / (Brick + Joint)",
          substitution: `${count} × (${L_m.toFixed(2)}m × ${H_m.toFixed(2)}m × ${T_m.toFixed(2)}m) = ${grossWallVolM3.toFixed(3)} m³; Bricks: ${estBrickCount.toLocaleString("en-IN")} units`,
          resultString: `Wet Mortar Volume = ${wetVolumeM3.toFixed(3)} m³ (${sharePct.toFixed(1)}% of wall volume)`,
        });
      }
      break;
    }

    case "flooring_screed": {
      let areaM2 = 0;
      let areaSub = "";
      if (inputs.flooringAreaInputMode === "area") {
        areaM2 = convertAreaToM2(inputs.flooringArea, inputs.flooringAreaUnit);
        areaSub = `${inputs.flooringArea} ${inputs.flooringAreaUnit} = ${areaM2.toFixed(2)} m²`;
      } else {
        const L_m = convertToMetres(inputs.flooringLength, inputs.flooringLengthUnit);
        const W_m = convertToMetres(inputs.flooringWidth, inputs.flooringWidthUnit);
        const count = Math.max(1, inputs.flooringRoomsCount || 1);
        areaM2 = L_m * W_m * count;
        areaSub = `${count} rooms × (${L_m.toFixed(2)}m × ${W_m.toFixed(2)}m) = ${areaM2.toFixed(2)} m²`;
      }

      const thicknessM = (inputs.screedThicknessMm || 40) / 1000;
      wetVolumeM3 = areaM2 * thicknessM;

      steps.push({
        stepNumber: stepIndex++,
        title: "Wet Flooring Screed Volume",
        formula: "Wet Volume = Floor Area × Screed Thickness (in metres)",
        substitution: `${areaM2.toFixed(2)} m² × ${thicknessM.toFixed(3)} m (${inputs.screedThicknessMm} mm)`,
        resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
        notes: areaSub,
      });
      break;
    }

    case "custom_volume":
    default: {
      wetVolumeM3 = convertVolumeToM3(inputs.customWetVolume, inputs.customVolumeUnit);
      steps.push({
        stepNumber: stepIndex++,
        title: "Custom Wet Volume",
        formula: "Wet Volume = Entered Volume converted to m³",
        substitution: `${inputs.customWetVolume} ${inputs.customVolumeUnit} = ${wetVolumeM3.toFixed(3)} m³`,
        resultString: `${wetVolumeM3.toFixed(3)} m³ (${(wetVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
      });
      break;
    }
  }

  // 2. Determine Dry Volume Factor
  // Concrete defaults to 1.54, Mortar / Plaster / Screed / Brickwork defaults to 1.33
  const defaultDryFactor =
    inputs.workType === "concrete"
      ? DRY_VOLUME_FACTORS.concrete
      : DRY_VOLUME_FACTORS.mortar;

  const dryFactor =
    inputs.dryVolumeFactor && inputs.dryVolumeFactor > 0
      ? inputs.dryVolumeFactor
      : defaultDryFactor;

  const dryVolumeM3 = wetVolumeM3 * dryFactor;

  steps.push({
    stepNumber: stepIndex++,
    title: "Dry Volume Calculation (Compaction & Void Allowance)",
    formula: "Dry Volume = Wet Volume × Dry Volume Factor",
    substitution: `${wetVolumeM3.toFixed(3)} m³ × ${dryFactor}`,
    resultString: `${dryVolumeM3.toFixed(3)} m³ (${(dryVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft)`,
    notes:
      inputs.workType === "concrete"
        ? "Standard CPWD Factor: 1.54 accounts for coarse aggregate voids, sand compaction, and entrained air loss."
        : "Standard CPWD Factor: 1.33 accounts for fine sand shrinkage and void filling by cement paste.",
  });

  // 3. Proportioning & Material Volumes
  let baseCementMassKg = 0;
  let baseCementVolumeM3 = 0;
  let sandVolumeM3 = 0;
  let aggregateVolumeM3 = 0;

  if (inputs.workType === "concrete" && inputs.concreteMixMethod === "design") {
    // Mass-based design mix (kg/m3)
    const dm = inputs.concreteDesignMix;
    baseCementMassKg = wetVolumeM3 * dm.cementKgPerM3;
    baseCementVolumeM3 = bulkDensity > 0 ? baseCementMassKg / bulkDensity : 0;
    const sandMassKg = wetVolumeM3 * dm.sandKgPerM3;
    const aggMassKg = wetVolumeM3 * dm.aggregateKgPerM3;
    sandVolumeM3 = sandMassKg / 1600; // sand density ~1600 kg/m³
    aggregateVolumeM3 = aggMassKg / 1520; // aggregate density ~1520 kg/m³

    steps.push({
      stepNumber: stepIndex++,
      title: "Design Mix Mass Calculation",
      formula: "Cement kg = Wet Volume × Cement kg/m³ (Approved Mix Design)",
      substitution: `${wetVolumeM3.toFixed(3)} m³ × ${dm.cementKgPerM3} kg/m³`,
      resultString: `${baseCementMassKg.toFixed(1)} kg`,
    });
  } else {
    // Volumetric Nominal Ratio
    const cPart = Math.max(0, inputs.mixRatio.cement || 1);
    const sPart = Math.max(0, inputs.mixRatio.sand || 0);
    const aPart = Math.max(0, inputs.mixRatio.aggregate || 0);
    const totalParts = cPart + sPart + aPart;

    if (totalParts > 0 && cPart > 0) {
      baseCementVolumeM3 = (dryVolumeM3 * cPart) / totalParts;
      baseCementMassKg = baseCementVolumeM3 * bulkDensity;
      sandVolumeM3 = (dryVolumeM3 * sPart) / totalParts;
      aggregateVolumeM3 = (dryVolumeM3 * aPart) / totalParts;

      steps.push({
        stepNumber: stepIndex++,
        title: "Cement Volume & Mass from Mix Proportion",
        formula: "Cement Vol = Dry Vol × (Cement / Total Parts); Cement kg = Vol × Bulk Density",
        substitution: `${dryVolumeM3.toFixed(3)} m³ × (${cPart} / ${totalParts}) = ${baseCementVolumeM3.toFixed(4)} m³; Mass: ${baseCementVolumeM3.toFixed(4)} m³ × ${bulkDensity} kg/m³`,
        resultString: `${baseCementMassKg.toFixed(1)} kg (${baseCementVolumeM3.toFixed(3)} m³)`,
        notes: `Cement Bulk Density: ${bulkDensity} kg/m³ (IS 456 standard benchmark)`,
      });

      if (sPart > 0) {
        steps.push({
          stepNumber: stepIndex++,
          title: "Sand Volume Requirement",
          formula: "Sand Vol = Dry Vol × (Sand / Total Parts)",
          substitution: `${dryVolumeM3.toFixed(3)} m³ × (${sPart} / ${totalParts})`,
          resultString: `${sandVolumeM3.toFixed(3)} m³ (${(sandVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft / ${(sandVolumeM3 * CFT_PER_CUBIC_METRE / 100).toFixed(2)} Brass)`,
        });
      }

      if (aPart > 0) {
        steps.push({
          stepNumber: stepIndex++,
          title: "Coarse Aggregate Volume Requirement",
          formula: "Aggregate Vol = Dry Vol × (Aggregate / Total Parts)",
          substitution: `${dryVolumeM3.toFixed(3)} m³ × (${aPart} / ${totalParts})`,
          resultString: `${aggregateVolumeM3.toFixed(3)} m³ (${(aggregateVolumeM3 * CFT_PER_CUBIC_METRE).toFixed(1)} cu ft / ${(aggregateVolumeM3 * CFT_PER_CUBIC_METRE / 100).toFixed(2)} Brass)`,
        });
      }
    }
  }

  // 4. Wastage & Final Bags
  const wastageCementMassKg = baseCementMassKg * (Math.max(0, inputs.wastagePercentage || 0) / 100);
  const totalCementMassKg = baseCementMassKg + wastageCementMassKg;

  const baseCementBagsExact = bagMass > 0 ? baseCementMassKg / bagMass : 0;
  const totalCementBagsExact = bagMass > 0 ? totalCementMassKg / bagMass : 0;
  const wholeBagsToPurchase = Math.ceil(totalCementBagsExact);

  steps.push({
    stepNumber: stepIndex++,
    title: `Cement Bags & Handling Wastage (${inputs.wastagePercentage || 0}%)`,
    formula: "Total Bags = (Base Cement Mass × (1 + Wastage%)) / Bag Mass (50 kg)",
    substitution: `(${baseCementMassKg.toFixed(1)} kg × ${wastageMultiplier.toFixed(2)}) / ${bagMass} kg = ${totalCementMassKg.toFixed(1)} kg / ${bagMass} kg`,
    resultString: `${totalCementBagsExact.toFixed(2)} Bags → Whole Bags to Purchase: ${wholeBagsToPurchase} Bags`,
    notes: `Exact required: ${baseCementBagsExact.toFixed(2)} bags (${baseCementMassKg.toFixed(1)} kg) + ${wastageCementMassKg.toFixed(1)} kg wastage allowance.`,
  });

  // Apply wastage to sand & aggregate quantities
  const sandVolumeCft = sandVolumeM3 * CFT_PER_CUBIC_METRE * wastageMultiplier;
  const sandBrass = sandVolumeCft / BRASS_IN_CFT;
  const sandMassTonnes = (sandVolumeM3 * wastageMultiplier * 1600) / 1000;

  const aggregateVolumeCft = aggregateVolumeM3 * CFT_PER_CUBIC_METRE * wastageMultiplier;
  const aggregateBrass = aggregateVolumeCft / BRASS_IN_CFT;
  const aggregateMassTonnes = (aggregateVolumeM3 * wastageMultiplier * 1520) / 1000;

  // 5. Water Estimation (when enabled)
  let waterLitresEstimated = 0;
  if (inputs.enableWaterEstimate && inputs.waterCementRatio > 0 && totalCementMassKg > 0) {
    waterLitresEstimated = totalCementMassKg * inputs.waterCementRatio;
    steps.push({
      stepNumber: stepIndex++,
      title: "Estimated Potable Mixing Water",
      formula: "Water (Litres) = Cement Mass (kg) × Water-Cement Ratio",
      substitution: `${totalCementMassKg.toFixed(1)} kg × ${inputs.waterCementRatio}`,
      resultString: `~${Math.round(waterLitresEstimated).toLocaleString("en-IN")} Litres`,
      notes: "Theoretical value. Site adjustments are required for aggregate moisture, absorption, and workability slump.",
    });
  }

  // 6. Cost Calculation
  const cementRate = inputs.rates.cementPricePerBag || 0;
  const cementExactConsumptionCost = totalCementBagsExact * cementRate;
  const cementPurchaseCost = wholeBagsToPurchase * cementRate;

  // Sand cost calculation based on selected unit
  let sandCost = 0;
  if (inputs.rates.sandPrice > 0) {
    switch (inputs.rates.sandPriceUnit) {
      case "cft":
        sandCost = sandVolumeCft * inputs.rates.sandPrice;
        break;
      case "m3":
        sandCost = sandVolumeM3 * wastageMultiplier * inputs.rates.sandPrice;
        break;
      case "brass":
        sandCost = sandBrass * inputs.rates.sandPrice;
        break;
      case "tonne":
        sandCost = sandMassTonnes * inputs.rates.sandPrice;
        break;
    }
  }

  // Aggregate cost calculation based on selected unit
  let aggregateCost = 0;
  if (inputs.rates.aggregatePrice > 0) {
    switch (inputs.rates.aggregatePriceUnit) {
      case "cft":
        aggregateCost = aggregateVolumeCft * inputs.rates.aggregatePrice;
        break;
      case "m3":
        aggregateCost = aggregateVolumeM3 * wastageMultiplier * inputs.rates.aggregatePrice;
        break;
      case "brass":
        aggregateCost = aggregateBrass * inputs.rates.aggregatePrice;
        break;
      case "tonne":
        aggregateCost = aggregateMassTonnes * inputs.rates.aggregatePrice;
        break;
    }
  }

  const totalMaterialCost = cementPurchaseCost + sandCost + aggregateCost;

  // Dynamic Insights
  const insights: CementEstimateResult["insights"] = [];

  if (wholeBagsToPurchase > 0) {
    insights.push({
      type: "positive",
      title: "Whole Bags Purchase Recommendation",
      text: `Based on your net requirement of ${totalCementBagsExact.toFixed(2)} bags (${totalCementMassKg.toFixed(1)} kg), purchase ${wholeBagsToPurchase} full ${bagMass}kg bags to prevent on-site pour interruptions.`,
    });
  }

  if (inputs.workType === "concrete") {
    insights.push({
      type: "info",
      title: "IS 456 Structural Concrete Rule",
      text: "Per IS 456:2000 Clause 6.1.2, concrete of grade lower than M20 (1:1.5:3 nominal proportion) shall not be used in reinforced cement concrete (RCC) works.",
    });
  } else if (inputs.workType === "plaster_wall" || inputs.workType === "plaster_ceiling") {
    insights.push({
      type: "info",
      title: "Plastering Thickness Guideline",
      text: "Ceilings generally require 6mm (1:3 or 1:4 mix), internal brick walls require 12mm (1:5 or 1:6 mix), and exterior walls require 18–20mm double-coat sand-faced plaster (1:4 base + 1:3 finish).",
    });
  }

  if (inputs.wastagePercentage === 0) {
    insights.push({
      type: "warning",
      title: "Zero Wastage Selected",
      text: "You have set 0% handling wastage. Cement bags frequently suffer 3%–5% loss through bag handling, transit tearing, mixer residue, and rebound during plastering.",
    });
  }

  return {
    workType: inputs.workType,
    wetVolumeM3,
    wetVolumeCft: wetVolumeM3 * CFT_PER_CUBIC_METRE,
    dryVolumeM3,
    dryVolumeCft: dryVolumeM3 * CFT_PER_CUBIC_METRE,
    baseCementVolumeM3,
    baseCementMassKg,
    wastageCementMassKg,
    totalCementMassKg,
    baseCementBagsExact,
    totalCementBagsExact,
    wholeBagsToPurchase,
    cementBagMassKg: bagMass,
    sandVolumeM3: sandVolumeM3 * wastageMultiplier,
    sandVolumeCft,
    sandBrass,
    sandMassTonnes,
    aggregateVolumeM3: aggregateVolumeM3 * wastageMultiplier,
    aggregateVolumeCft,
    aggregateBrass,
    aggregateMassTonnes,
    waterLitresEstimated,
    masonry: masonryMetrics,
    costs: {
      cementExactConsumptionCost,
      cementPurchaseCost,
      sandCost,
      aggregateCost,
      totalMaterialCost,
    },
    steps,
    insights,
  };
}

// -------------------------------------------------------------
// DEFAULT PRESETS FOR INSTANT LOADING
// -------------------------------------------------------------

export const DEFAULT_CEMENT_INPUTS: CementCalculatorInputs = {
  workType: "concrete",
  calculationMode: "quick",
  concreteEntryMethod: "dimensions",
  concreteElements: [
    {
      id: "slab-1",
      name: "Roof Slab (1000 sq ft)",
      count: 1,
      length: 40,
      lengthUnit: "ft",
      width: 25,
      widthUnit: "ft",
      depth: 5,
      depthUnit: "in",
    },
  ],
  directConcreteVolume: 1,
  directConcreteVolumeUnit: "m3",
  concreteMixMethod: "nominal",
  concreteDesignMix: {
    cementKgPerM3: 380,
    sandKgPerM3: 680,
    aggregateKgPerM3: 1180,
    waterLitresPerM3: 180,
  },
  plasterAreaInputMode: "area",
  plasterArea: 100,
  plasterAreaUnit: "sqft",
  plasterLength: 10,
  plasterLengthUnit: "ft",
  plasterHeight: 10,
  plasterHeightUnit: "ft",
  plasterWallCount: 1,
  plasterThicknessMm: 12,
  brickworkMethod: "wall_dimensions",
  directMortarVolume: 1,
  directMortarVolumeUnit: "m3",
  wallLength: 20,
  wallLengthUnit: "ft",
  wallHeight: 10,
  wallHeightUnit: "ft",
  wallThickness: 9,
  wallThicknessUnit: "in",
  wallCount: 1,
  brickType: "standard_modular",
  brickLengthMm: 190,
  brickWidthMm: 90,
  brickHeightMm: 90,
  mortarJointThicknessMm: 10,
  flooringAreaInputMode: "area",
  flooringArea: 100,
  flooringAreaUnit: "sqft",
  flooringLength: 10,
  flooringLengthUnit: "ft",
  flooringWidth: 10,
  flooringWidthUnit: "ft",
  flooringRoomsCount: 1,
  screedThicknessMm: 40,
  customWetVolume: 1,
  customVolumeUnit: "m3",
  mixRatio: { cement: 1, sand: 1.5, aggregate: 3 }, // M20
  dryVolumeFactor: 1.54,
  cementBulkDensity: STANDARD_CEMENT_BULK_DENSITY,
  cementBagMassKg: STANDARD_CEMENT_BAG_MASS_KG,
  wastagePercentage: 5,
  enableWaterEstimate: true,
  waterCementRatio: 0.5,
  rates: {
    cementPricePerBag: 390,
    sandPrice: 45,
    sandPriceUnit: "cft",
    aggregatePrice: 42,
    aggregatePriceUnit: "cft",
  },
};

