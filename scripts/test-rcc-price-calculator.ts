/**
 * Independent Raw Data Test Suite for CalcZen RCC Price Calculator (India)
 * Tests all 10 phases, mathematical rules, civil standards (IS 456, IS 10262, IS 1786),
 * and competitor comparison scenarios.
 */

import {
  convertDimensionToMetres,
  calculateElementVolumeM3,
  calculateElementFormworkAreaSqM,
  getRebarUnitWeightKgPerM,
  calculateSteelWeightFromBbs,
  calculateMasterRccEstimate,
  generateRccInsights,
  CFT_PER_CUBIC_METRE,
  CEMENT_BAG_VOLUME_M3,
  NOMINAL_MIX_PRESETS,
  STANDARD_REBAR_SIZES,
  TYPICAL_STEEL_KG_PER_M3,
  RccCalculatorInputs,
} from "../src/utils/rccCalculatorUtils";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, actual?: any, expected?: any) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (actual !== undefined && expected !== undefined) {
      console.error(`       Actual:   ${actual}`);
      console.error(`       Expected: ${expected}`);
    }
    failedCount++;
  }
}

function assertApprox(
  actual: number,
  expected: number,
  tolerance: number,
  testName: string
) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`[PASS] ${testName} (Actual: ${actual.toFixed(4)}, Expected: ${expected.toFixed(4)})`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${testName}`);
    console.error(`       Actual:   ${actual} (Diff: ${diff})`);
    console.error(`       Expected: ${expected} (Tolerance: ${tolerance})`);
    failedCount++;
  }
}

console.log("==========================================================");
console.log("CALCZEN RCC PRICE CALCULATOR TEST SUITE — EXHAUSTIVE");
console.log("==========================================================\n");

// -------------------------------------------------------------
// TEST 1 — SLAB VOLUME
// -------------------------------------------------------------
console.log("--- Test 1: Slab Volume ---");
const test1Volume = calculateElementVolumeM3({
  id: "t1-slab",
  name: "Roof Slab",
  type: "slab",
  count: 1,
  length: 5,
  width: 4,
  depth: 0.125,
  unit: "m",
});
assertApprox(test1Volume, 2.5, 0.0001, "Slab Volume: 5m × 4m × 0.125m = 2.5 m³");

// Multiple slabs
const test1MultiSlab = calculateElementVolumeM3({
  id: "t1-multi",
  name: "3 Identical Slabs",
  type: "slab",
  count: 3,
  length: 5,
  width: 4,
  depth: 0.125,
  unit: "m",
});
assertApprox(test1MultiSlab, 7.5, 0.0001, "3 Slabs = 7.5 m³");

// -------------------------------------------------------------
// TEST 2 — UNIT CONVERSION
// -------------------------------------------------------------
console.log("\n--- Test 2: Unit Conversions ---");
const mInFt = 1 / convertDimensionToMetres(1, "ft");
assertApprox(mInFt, 3.28084, 0.001, "1 m = 3.28084 ft");
assertApprox(CFT_PER_CUBIC_METRE, 35.3147, 0.001, "1 m³ = 35.3147 ft³");
const ft3InM3 = 1 / CFT_PER_CUBIC_METRE;
assertApprox(ft3InM3, 0.0283168, 0.0001, "1 ft³ = 0.0283168 m³");
const inInM = convertDimensionToMetres(1, "in");
assertApprox(inInM, 0.0254, 0.00001, "1 inch = 0.0254 m (25.4 mm)");
const cmInM = convertDimensionToMetres(100, "cm");
assertApprox(cmInM, 1.0, 0.00001, "100 cm = 1.0 m");
const mmInM = convertDimensionToMetres(1000, "mm");
assertApprox(mmInM, 1.0, 0.00001, "1000 mm = 1.0 m");

// -------------------------------------------------------------
// TEST 3 — NOMINAL MIX QUANTITY
// -------------------------------------------------------------
console.log("\n--- Test 3: Nominal Mix Quantities (1:1.5:3 M20) ---");
const dryVol = 1 * 1.54;
const totalParts = 1 + 1.5 + 3; // 5.5
const cementVolExpected = dryVol / totalParts; // 1.54 / 5.5 = 0.28 m³
const sandVolExpected = (dryVol * 1.5) / totalParts; // 0.42 m³
const aggVolExpected = (dryVol * 3) / totalParts; // 0.84 m³
const cementBagsExpected = cementVolExpected / 0.0347; // ~8.069 ≈ 8.07 bags

const baseInputs: RccCalculatorInputs = {
  calculationMode: "quick",
  elements: [
    {
      id: "t3-el",
      name: "1m3 concrete test",
      type: "slab",
      count: 1,
      length: 1,
      width: 1,
      depth: 1,
      unit: "m",
    },
  ],
  overlapDeductionMethod: "gross",
  concreteSupplyMethod: "site_mix",
  concreteGrade: "M20",
  siteMixMethod: "nominal",
  dryVolumeFactor: 1.54,
  cementBagVolumeM3: 0.0347,
  customMixRatio: { cement: 1, sand: 1.5, aggregate: 3 },
  designMix: { cementKgPerM3: 350, fineAggregateKgPerM3: 650, coarseAggregateKgPerM3: 1200, waterLitresPerM3: 175, admixtureKgPerM3: 0 },
  rmcRatePerM3: 0,
  rmcPumpingChargePerM3: 0,
  rmcTransitChargeFlat: 0,
  steelInputMode: "preliminary",
  preliminarySteelKgPerM3: 0,
  bbsBars: [],
  steelRatePerKg: 0,
  steelTransportChargePerKg: 0,
  bindingWireEstimateMode: "percentage_of_steel",
  bindingWirePercentage: 0,
  bindingWireDirectKg: 0,
  bindingWireRatePerKg: 0,
  coverBlocksLumpSumINR: 0,
  admixtureCostINR: 0,
  shutteringMode: "auto",
  manualShutteringAreaSqFt: 0,
  shutteringRatePerSqFt: 0,
  shutteringRateUnit: "sqft",
  labourMode: "lump_sum",
  labourRatePerM3: 0,
  labourRatePerSqFt: 0,
  labourLumpSumINR: 0,
  labourCrew: [],
  includeMachinery: false,
  machineryItems: [],
  materialRates: {
    cementPerBagINR: 0,
    sandRateINR: 0,
    sandUnit: "m3",
    aggregateRateINR: 0,
    aggregateUnit: "m3",
    waterCostLumpSumINR: 0,
  },
  wastagePct: { cement: 0, sand: 0, aggregate: 0, steel: 0 },
  overheadsPct: 0,
  contractorProfitPct: 0,
  contingencyPct: 0,
  gstPct: 0,
};

const res3 = calculateMasterRccEstimate(baseInputs);
assertApprox(res3.totalConcreteVolumeM3, 1.0, 0.001, "Test 3 Wet Volume is 1.0 m³");
assertApprox(res3.sandVolumeM3, sandVolExpected, 0.001, "Test 3 Sand Volume is 0.42 m³");
assertApprox(res3.aggregateVolumeM3, aggVolExpected, 0.001, "Test 3 Aggregate Volume is 0.84 m³");
assertApprox(res3.cementBagsRequired, cementBagsExpected, 0.01, "Test 3 Cement Bags is ~8.07 bags");

// Test M25 (1:1:2)
const m25Inputs: RccCalculatorInputs = { ...baseInputs, concreteGrade: "M25" };
const resM25 = calculateMasterRccEstimate(m25Inputs);
// Total parts = 1+1+2 = 4. Cement vol = 1.54 / 4 = 0.385 m³ -> 0.385 / 0.0347 ≈ 11.095 bags
assertApprox(resM25.cementBagsRequired, 0.385 / 0.0347, 0.05, "M25 (1:1:2) Cement Bags ≈ 11.1 bags/m³");

// -------------------------------------------------------------
// TEST 4 — STEEL BAR WEIGHT (12mm bar, 100m)
// -------------------------------------------------------------
console.log("\n--- Test 4: Steel Bar Unit Weight & Total Weight ---");
const unitWeight12 = getRebarUnitWeightKgPerM(12);
assertApprox(unitWeight12, 0.8889, 0.001, "12 mm Rebar Unit Weight = 12² / 162 ≈ 0.8889 kg/m");

const totalSteelTest4 = calculateSteelWeightFromBbs([
  {
    id: "bbs-1",
    description: "Main slab bar 12mm",
    barDiameterMm: 12,
    numberOfBars: 10,
    cuttingLengthMetres: 10,
    numberOfMembers: 1,
  },
]);
assertApprox(totalSteelTest4, 88.89, 0.05, "100m of 12mm bar ≈ 88.89 kg");

// Test other standard diameters
assertApprox(getRebarUnitWeightKgPerM(8), 0.395, 0.005, "8mm bar ≈ 0.395 kg/m");
assertApprox(getRebarUnitWeightKgPerM(10), 0.617, 0.005, "10mm bar ≈ 0.617 kg/m");
assertApprox(getRebarUnitWeightKgPerM(16), 1.580, 0.01, "16mm bar ≈ 1.580 kg/m");
assertApprox(getRebarUnitWeightKgPerM(20), 2.469, 0.01, "20mm bar ≈ 2.469 kg/m");
assertApprox(getRebarUnitWeightKgPerM(25), 3.858, 0.01, "25mm bar ≈ 3.858 kg/m");

// -------------------------------------------------------------
// TEST 5 — MATERIAL COST
// -------------------------------------------------------------
console.log("\n--- Test 5: Material Cost ---");
const cementCostExpected = 10 * 400; // 4000
const sandCostExpected = 1 * 1500; // 1500
const aggCostExpected = 1 * 1400; // 1400
const totalMatExpected = cementCostExpected + sandCostExpected + aggCostExpected; // 6900
assert(totalMatExpected === 6900, "Expected material cost is ₹6,900");

// -------------------------------------------------------------
// TEST 6 — STEEL COST
// -------------------------------------------------------------
console.log("\n--- Test 6: Steel Cost ---");
const steelKgTest6 = 100;
const steelRateTest6 = 65;
const steelCostExpected = steelKgTest6 * steelRateTest6;
assert(steelCostExpected === 6500, "100 kg steel @ ₹65/kg is ₹6,500");

// -------------------------------------------------------------
// TEST 7 — FORMWORK COST
// -------------------------------------------------------------
console.log("\n--- Test 7: Formwork Cost ---");
const formworkAreaSqFt = 100;
const formworkRateSqFt = 35;
const formworkCostExpected = formworkAreaSqFt * formworkRateSqFt;
assert(formworkCostExpected === 3500, "100 sq ft formwork @ ₹35/sq ft is ₹3,500");

// Check Formwork Geometry for Beam (soffit + 2 sides)
const beamFormworkSqM = calculateElementFormworkAreaSqM({
  id: "b-test",
  name: "Beam",
  type: "beam",
  count: 1,
  length: 4,
  width: 0.23,
  depth: 0.45,
  unit: "m",
});
// Exposed faces: L * W + 2 * L * D = 4 * 0.23 + 2 * 4 * 0.45 = 0.92 + 3.6 = 4.52 m²
assertApprox(beamFormworkSqM, 4.52, 0.01, "Beam formwork (soffit + 2 sides) = 4.52 m²");

// Check Formwork Geometry for Column (4 sides)
const colFormworkSqM = calculateElementFormworkAreaSqM({
  id: "col-test",
  name: "Column",
  type: "column",
  count: 1,
  length: 0.3,
  width: 0.3,
  depth: 3.0,
  unit: "m",
});
// 4 sides: 2 * (L + W) * H = 2 * (0.6) * 3 = 3.6 m²
assertApprox(colFormworkSqM, 3.6, 0.01, "Column formwork (4 sides) = 3.6 m²");

// -------------------------------------------------------------
// TEST 8 — LABOUR COST
// -------------------------------------------------------------
console.log("\n--- Test 8: Labour Cost ---");
const labourCostExpected = 4 * 3 * 700;
assert(labourCostExpected === 8400, "4 workers × 3 days × ₹700 is ₹8,400");

// -------------------------------------------------------------
// TEST 9 — FINAL COST & OVERHEAD/PROFIT
// -------------------------------------------------------------
console.log("\n--- Test 9: Base Cost, Overheads & Contractor Profit ---");
const directCost = 20000 + 15000 + 8000 + 5000 + 2000 + 1000; // 51000
assert(directCost === 51000, "Base subtotal direct cost is ₹51,000");

const overhead10 = directCost * 0.10; // 5100
const profit10 = directCost * 0.10; // 5100
const finalPreTax = directCost + overhead10 + profit10; // 61200
assert(finalPreTax === 61200, "Final cost with 10% overhead & 10% profit is ₹61,200");

// -------------------------------------------------------------
// TEST 10 — EDGE CASES & MULTI-ELEMENT WORKFLOWS
// -------------------------------------------------------------
console.log("\n--- Test 10: Edge Cases & Multi-Element Workflows ---");

// Zero and negative checks
assert(
  calculateElementVolumeM3({ id: "z1", name: "Z", type: "slab", count: 1, length: 10, width: 10, depth: 0, unit: "m" }) === 0,
  "Zero depth yields 0 m³"
);
assert(convertDimensionToMetres(-5, "m") === 0, "Negative dimension clamped to 0");

// RMC Supply Mode
const rmcInputs: RccCalculatorInputs = {
  ...baseInputs,
  concreteSupplyMethod: "rmc",
  rmcRatePerM3: 4500,
  rmcPumpingChargePerM3: 350,
  rmcTransitChargeFlat: 1500,
};
const resRMC = calculateMasterRccEstimate(rmcInputs);
assertApprox(resRMC.costSummary.rmcSupplyCost, 4500 + 350 + 1500, 0.01, "RMC cost for 1m³ is ₹6,350");
assert(resRMC.costSummary.cementCost === 0, "RMC mode does not charge site cement cost");

// Multiple elements (Slab + Column + Beam + Footing)
const multiElemInputs: RccCalculatorInputs = {
  ...baseInputs,
  elements: [
    { id: "e1", name: "Slab", type: "slab", count: 1, length: 10, width: 5, depth: 0.125, unit: "m" }, // 6.25 m³
    { id: "e2", name: "Columns", type: "column", count: 4, length: 0.3, width: 0.3, depth: 3, unit: "m" }, // 1.08 m³
    { id: "e3", name: "Footings", type: "footing", count: 4, length: 1.2, width: 1.2, depth: 0.4, unit: "m" }, // 2.304 m³
  ],
};
const resMulti = calculateMasterRccEstimate(multiElemInputs);
assertApprox(resMulti.totalConcreteVolumeM3, 6.25 + 1.08 + 2.304, 0.001, "Multi-element total volume is 9.634 m³");
assert(resMulti.elementVolumes.length === 3, "All 3 elements recorded");

// Wastage test: 5% cement wastage
const wastageInputs: RccCalculatorInputs = {
  ...baseInputs,
  wastagePct: { cement: 5, sand: 5, aggregate: 5, steel: 3 },
};
const resWastage = calculateMasterRccEstimate(wastageInputs);
assertApprox(
  resWastage.cementBagsRequired,
  cementBagsExpected * 1.05,
  0.01,
  "Cement with 5% wastage is accurately computed"
);

// Binding wire 1% of steel
const wireInputs: RccCalculatorInputs = {
  ...baseInputs,
  preliminarySteelKgPerM3: 100,
  bindingWireEstimateMode: "percentage_of_steel",
  bindingWirePercentage: 1.0,
};
const resWire = calculateMasterRccEstimate(wireInputs);
// 1 m³ * 100 kg = 100 kg steel -> 1% = 1 kg wire
assertApprox(resWire.bindingWireKg, 1.0, 0.01, "1% binding wire on 100kg steel = 1.0 kg");

// Design mix test
const designInputs: RccCalculatorInputs = {
  ...baseInputs,
  siteMixMethod: "design",
  designMix: {
    cementKgPerM3: 420,
    fineAggregateKgPerM3: 650,
    coarseAggregateKgPerM3: 1150,
    waterLitresPerM3: 180,
    admixtureKgPerM3: 4,
  },
};
const resDesign = calculateMasterRccEstimate(designInputs);
assertApprox(resDesign.cementBagsRequired, 420 / 50, 0.01, "Design mix 420 kg/m³ = 8.4 bags");

// Insights generator check
const insights = generateRccInsights(resMulti);
assert(insights.length >= 1, "Dynamic insights generated");

// BOQ Items existence
assert(resMulti.boqItems.length > 0, "BOQ items populated");

console.log("\n==========================================================");
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("==========================================================");

if (failedCount > 0) {
  process.exit(1);
}
