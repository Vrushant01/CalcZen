import {
  calculateHomeElectricityBill,
  calculateSlabEnergyCharges,
  calculateMonthComparison,
  createItemFromPreset,
  APPLIANCE_PRESETS,
  VERIFIED_DISCOM_PROFILES,
} from "../src/utils/homeElectricityBillUtils.js";

function verifyModule() {
  console.log("Verifying TypeScript module exports...");

  // Test 1 Flat
  const res1 = calculateHomeElectricityBill({
    mode: "monthly_units",
    monthlyUnits: 250,
    appliances: [],
    tariffMode: "flat",
    flatRatePerUnitINR: 5,
    fixedChargesINR: 50,
    additionalChargesINR: 100,
  });
  console.log("Test 1 res:", res1.energyChargesINR, res1.totalMonthlyBillINR);
  if (res1.energyChargesINR !== 1250 || res1.totalMonthlyBillINR !== 1400) {
    throw new Error("Test 1 failed");
  }

  // Test 3 Progressive
  const testPreset = VERIFIED_DISCOM_PROFILES.find((p) => p.id === "test_progressive_preset");
  const res3 = calculateHomeElectricityBill({
    mode: "monthly_units",
    monthlyUnits: 250,
    appliances: [],
    tariffMode: "slab",
    flatRatePerUnitINR: 8,
    customSlabs: testPreset.slabs,
    fixedChargesINR: 0,
    additionalChargesINR: 0,
  });
  console.log("Test 3 res:", res3.energyChargesINR);
  if (res3.energyChargesINR !== 1200) {
    throw new Error("Test 3 failed");
  }

  // Test 7 Appliances
  const fan = createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular"));
  fan.quantity = 2;
  fan.powerWatts = 75;
  fan.dailyHours = 8;
  fan.daysPerMonth = 30;

  const bulb = createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w"));
  bulb.quantity = 5;
  bulb.powerWatts = 9;
  bulb.dailyHours = 6;
  bulb.daysPerMonth = 30;

  const fridge = createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "refrigerator_frost_free"));
  fridge.quantity = 1;
  fridge.annualKwh = 250;

  const res7 = calculateHomeElectricityBill({
    mode: "appliances",
    monthlyUnits: 0,
    appliances: [fan, bulb, fridge],
    tariffMode: "flat",
    flatRatePerUnitINR: 8,
    fixedChargesINR: 0,
    additionalChargesINR: 0,
  });
  console.log("Test 7 res:", res7.totalMonthlyUnits, res7.energyChargesINR);
  if (Math.abs(res7.totalMonthlyUnits - 64.933333) > 0.001 || Math.abs(res7.energyChargesINR - 519.466664) > 0.001) {
    throw new Error("Test 7 failed");
  }

  console.log("Module export verification passed!");
}

verifyModule();
