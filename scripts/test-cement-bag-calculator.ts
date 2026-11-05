import {
  calculateCementBagEstimate,
  DEFAULT_CEMENT_INPUTS,
  convertToMetres,
  convertAreaToM2,
  convertVolumeToM3,
  CementCalculatorInputs,
} from "../src/utils/cementCalculatorUtils";

function assertClose(actual: number, expected: number, tolerance: number = 0.01, testName: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`[FAIL] ${testName} | Actual: ${actual.toFixed(4)}, Expected: ${expected.toFixed(4)}, Diff: ${diff.toFixed(4)}`);
    process.exit(1);
  } else {
    console.log(`[PASS] ${testName} (Actual: ${actual.toFixed(4)}, Expected: ${expected.toFixed(4)})`);
  }
}

function assertEqual<T>(actual: T, expected: T, testName: string) {
  if (actual !== expected) {
    console.error(`[FAIL] ${testName} | Actual: ${actual}, Expected: ${expected}`);
    process.exit(1);
  } else {
    console.log(`[PASS] ${testName} (Actual: ${actual}, Expected: ${expected})`);
  }
}

console.log("==========================================================");
console.log("CALCZEN CEMENT BAG CALCULATOR TEST SUITE — RAW DATA TESTS");
console.log("==========================================================");

// --- TEST 1: CONCRETE 1:2:4 MIX ---
console.log("\n--- Test 1: Concrete 1:2:4 Mix (1 m³) ---");
const t1Inputs: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "concrete",
  concreteEntryMethod: "direct_volume",
  directConcreteVolume: 1,
  directConcreteVolumeUnit: "m3",
  mixRatio: { cement: 1, sand: 2, aggregate: 4 },
  dryVolumeFactor: 1.54,
  cementBulkDensity: 1440,
  cementBagMassKg: 50,
  wastagePercentage: 0,
};
const t1Result = calculateCementBagEstimate(t1Inputs);
assertClose(t1Result.dryVolumeM3, 1.54, 0.001, "Test 1 Dry Volume is 1.54 m³");
assertClose(t1Result.baseCementVolumeM3, 1.54 / 7, 0.001, "Test 1 Cement Volume is 0.22 m³");
assertClose(t1Result.baseCementMassKg, 316.8, 0.1, "Test 1 Cement Mass is 316.8 kg");
assertClose(t1Result.totalCementBagsExact, 6.336, 0.01, "Test 1 Exact Bags is 6.336");
assertEqual(t1Result.wholeBagsToPurchase, 7, "Test 1 Whole Bags to Purchase is 7");

// --- TEST 2: CONCRETE 1:1.5:3 MIX ---
console.log("\n--- Test 2: Concrete 1:1.5:3 Mix (1 m³) ---");
const t2Inputs: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "concrete",
  concreteEntryMethod: "direct_volume",
  directConcreteVolume: 1,
  directConcreteVolumeUnit: "m3",
  mixRatio: { cement: 1, sand: 1.5, aggregate: 3 },
  dryVolumeFactor: 1.54,
  cementBulkDensity: 1440,
  cementBagMassKg: 50,
  wastagePercentage: 0,
};
const t2Result = calculateCementBagEstimate(t2Inputs);
assertClose(t2Result.dryVolumeM3, 1.54, 0.001, "Test 2 Dry Volume is 1.54 m³");
assertClose(t2Result.baseCementVolumeM3, 1.54 / 5.5, 0.001, "Test 2 Cement Volume is 0.28 m³");
assertClose(t2Result.baseCementMassKg, 403.2, 0.1, "Test 2 Cement Mass is 403.2 kg");
assertClose(t2Result.totalCementBagsExact, 8.064, 0.01, "Test 2 Exact Bags is 8.064");
assertEqual(t2Result.wholeBagsToPurchase, 9, "Test 2 Whole Bags to Purchase is 9");

// --- TEST 3: CONCRETE WITH 5% WASTAGE ---
console.log("\n--- Test 3: Concrete with 5% Wastage ---");
const t3Inputs: CementCalculatorInputs = {
  ...t1Inputs,
  wastagePercentage: 5,
};
const t3Result = calculateCementBagEstimate(t3Inputs);
assertClose(t3Result.baseCementMassKg, 316.8, 0.1, "Test 3 Base Cement Mass is 316.8 kg");
assertClose(t3Result.wastageCementMassKg, 15.84, 0.1, "Test 3 Wastage Mass is 15.84 kg");
assertClose(t3Result.totalCementMassKg, 332.64, 0.1, "Test 3 Total Cement Mass is 332.64 kg");
assertClose(t3Result.totalCementBagsExact, 6.6528, 0.01, "Test 3 Exact Bags with Wastage is 6.6528");
assertEqual(t3Result.wholeBagsToPurchase, 7, "Test 3 Whole Bags to Purchase is 7");

// --- TEST 4: PLASTER CALCULATION ---
console.log("\n--- Test 4: Wall Plastering 20 m² × 12 mm @ 1:6 Mix ---");
const t4Inputs: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "plaster_wall",
  plasterAreaInputMode: "area",
  plasterArea: 20,
  plasterAreaUnit: "sqm",
  plasterThicknessMm: 12, // 0.012 m
  mixRatio: { cement: 1, sand: 6, aggregate: 0 },
  dryVolumeFactor: 1.33,
  cementBulkDensity: 1440,
  cementBagMassKg: 50,
  wastagePercentage: 0,
};
const t4Result = calculateCementBagEstimate(t4Inputs);
assertClose(t4Result.wetVolumeM3, 0.24, 0.001, "Test 4 Wet Plaster Volume is 0.24 m³");
assertClose(t4Result.dryVolumeM3, 0.3192, 0.001, "Test 4 Dry Mortar Volume is 0.3192 m³");
assertClose(t4Result.baseCementVolumeM3, 0.3192 / 7, 0.001, "Test 4 Cement Volume is 0.0456 m³");
assertClose(t4Result.totalCementMassKg, 65.664, 0.1, "Test 4 Cement Mass is 65.664 kg");
assertClose(t4Result.totalCementBagsExact, 1.31328, 0.01, "Test 4 Exact Bags is 1.31328");
assertEqual(t4Result.wholeBagsToPurchase, 2, "Test 4 Whole Bags to Purchase is 2");

// --- TEST 5: FLOOR SCREED ---
console.log("\n--- Test 5: Floor Screed 100 sq ft × 40 mm @ 1:4 Mix ---");
const t5Inputs: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "flooring_screed",
  flooringAreaInputMode: "area",
  flooringArea: 100,
  flooringAreaUnit: "sqft",
  screedThicknessMm: 40, // 0.04 m
  mixRatio: { cement: 1, sand: 4, aggregate: 0 },
  dryVolumeFactor: 1.33,
  cementBulkDensity: 1440,
  cementBagMassKg: 50,
  wastagePercentage: 0,
};
const t5Result = calculateCementBagEstimate(t5Inputs);
assertClose(t5Result.wetVolumeM3, 0.37161, 0.01, "Test 5 Wet Screed Volume ≈ 0.3716 m³");
assertClose(t5Result.dryVolumeM3, 0.49424, 0.01, "Test 5 Dry Screed Volume ≈ 0.4942 m³");
assertClose(t5Result.totalCementMassKg, 142.34, 1.0, "Test 5 Cement Mass ≈ 142.34 kg");
assertClose(t5Result.totalCementBagsExact, 2.8468, 0.05, "Test 5 Exact Bags ≈ 2.85");
assertEqual(t5Result.wholeBagsToPurchase, 3, "Test 5 Whole Bags to Purchase is 3");

// --- TEST 6: BAG SIZE VARIATION ---
console.log("\n--- Test 6: Custom Cement Bag Sizes (200 kg Cement) ---");
const baseInputs200kg: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "custom_volume",
  customWetVolume: 200 / (1440 * (1.54 / 5.5)), // yields 200 kg cement
  customVolumeUnit: "m3",
  mixRatio: { cement: 1, sand: 1.5, aggregate: 3 },
  dryVolumeFactor: 1.54,
  cementBulkDensity: 1440,
  wastagePercentage: 0,
};
const t6_50kg = calculateCementBagEstimate({ ...baseInputs200kg, cementBagMassKg: 50 });
assertClose(t6_50kg.totalCementBagsExact, 4.0, 0.01, "200 kg with 50kg bags = 4 bags");
const t6_25kg = calculateCementBagEstimate({ ...baseInputs200kg, cementBagMassKg: 25 });
assertClose(t6_25kg.totalCementBagsExact, 8.0, 0.01, "200 kg with 25kg bags = 8 bags");
const t6_40kg = calculateCementBagEstimate({ ...baseInputs200kg, cementBagMassKg: 40 });
assertClose(t6_40kg.totalCementBagsExact, 5.0, 0.01, "200 kg with 40kg bags = 5 bags");

// --- TEST 7: DIRECT VOLUME CONVERSION ---
console.log("\n--- Test 7: Direct Unit Conversions ---");
assertClose(convertVolumeToM3(35.3146667, "cft"), 1.0, 0.001, "35.3147 cft = 1 m³");
assertClose(convertVolumeToM3(1, "cft"), 0.0283168, 0.0001, "1 cft = 0.0283168 m³");
assertClose(convertVolumeToM3(1000, "litres"), 1.0, 0.001, "1000 litres = 1 m³");
assertClose(convertToMetres(1, "ft"), 0.3048, 0.0001, "1 ft = 0.3048 m");
assertClose(convertToMetres(1, "in"), 0.0254, 0.0001, "1 in = 0.0254 m (25.4 mm)");

// --- TEST 8: COST CALCULATION ---
console.log("\n--- Test 8: Cost Calculation (Purchase vs Exact) ---");
const t8Inputs: CementCalculatorInputs = {
  ...t1Inputs,
  rates: {
    ...DEFAULT_CEMENT_INPUTS.rates,
    cementPricePerBag: 400,
  },
};
const t8Result = calculateCementBagEstimate(t8Inputs);
assertEqual(t8Result.costs.cementPurchaseCost, 2800, "Purchase Cost is 7 bags × ₹400 = ₹2,800");
assertClose(t8Result.costs.cementExactConsumptionCost, 2534.40, 1.0, "Consumption Cost is 6.336 × ₹400 = ₹2,534.40");

// --- TEST 9: CUSTOM MIX (2 m³, 1:3:6) ---
console.log("\n--- Test 9: Custom Mix (2 m³, 1:3:6, dry factor 1.54) ---");
const t9Inputs: CementCalculatorInputs = {
  ...DEFAULT_CEMENT_INPUTS,
  workType: "custom_volume",
  customWetVolume: 2,
  customVolumeUnit: "m3",
  mixRatio: { cement: 1, sand: 3, aggregate: 6 },
  dryVolumeFactor: 1.54,
  cementBulkDensity: 1440,
  cementBagMassKg: 50,
  wastagePercentage: 0,
};
const t9Result = calculateCementBagEstimate(t9Inputs);
assertClose(t9Result.dryVolumeM3, 3.08, 0.001, "Test 9 Dry Volume is 3.08 m³");
assertClose(t9Result.baseCementVolumeM3, 0.308, 0.001, "Test 9 Cement Volume is 0.308 m³");
assertClose(t9Result.totalCementMassKg, 443.52, 0.1, "Test 9 Cement Mass is 443.52 kg");
assertClose(t9Result.totalCementBagsExact, 8.8704, 0.01, "Test 9 Exact Bags is 8.8704");
assertEqual(t9Result.wholeBagsToPurchase, 9, "Test 9 Whole Bags to Purchase is 9");

// --- TEST 10: EDGE CASES & BRICKWORK MASONRY ---
console.log("\n--- Test 10: Edge Cases & Brickwork Mortar ---");
// 10A: Zero volume
const t10Zero = calculateCementBagEstimate({
  ...DEFAULT_CEMENT_INPUTS,
  workType: "custom_volume",
  customWetVolume: 0,
});
assertEqual(t10Zero.totalCementMassKg, 0, "Zero volume yields 0 kg cement");
assertEqual(t10Zero.wholeBagsToPurchase, 0, "Zero volume yields 0 whole bags");

// 10B: Design Mix Concrete
const t10Design = calculateCementBagEstimate({
  ...DEFAULT_CEMENT_INPUTS,
  workType: "concrete",
  concreteMixMethod: "design",
  directConcreteVolume: 2,
  directConcreteVolumeUnit: "m3",
  concreteEntryMethod: "direct_volume",
  concreteDesignMix: {
    cementKgPerM3: 400,
    sandKgPerM3: 700,
    aggregateKgPerM3: 1100,
    waterLitresPerM3: 180,
  },
  wastagePercentage: 0,
});
assertEqual(t10Design.baseCementMassKg, 800, "2 m³ @ 400 kg/m³ = 800 kg cement");
assertEqual(t10Design.wholeBagsToPurchase, 16, "800 kg / 50kg = 16 bags");

// 10C: Brickwork Mortar
const t10Brick = calculateCementBagEstimate({
  ...DEFAULT_CEMENT_INPUTS,
  workType: "brickwork",
  brickworkMethod: "wall_dimensions",
  wallLength: 10,
  wallLengthUnit: "m",
  wallHeight: 3,
  wallHeightUnit: "m",
  wallThickness: 0.2, // 200 mm
  wallThicknessUnit: "m",
  wallCount: 1,
  brickLengthMm: 190,
  brickWidthMm: 90,
  brickHeightMm: 90,
  mortarJointThicknessMm: 10,
  mixRatio: { cement: 1, sand: 6, aggregate: 0 },
});
assertEqual(t10Brick.masonry !== undefined, true, "Brickwork metrics populated");
assertEqual((t10Brick.masonry?.estimatedBrickCount || 0) > 0, true, "Bricks estimated");
assertEqual(t10Brick.wholeBagsToPurchase > 0, true, "Mortar cement bags calculated");

console.log("\n==========================================================");
console.log("TEST RESULTS: ALL 10 MANDATORY TEST SUITES PASSED (100%)");
console.log("==========================================================");
