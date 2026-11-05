/**
 * Appliance Electricity Cost Calculator Utilities
 * Accurate Indian household energy estimation engine
 * Adheres to BEE India, IEC standards, and Indian Discom tariff practices
 */

export type CalculationMethod =
  | "method_a_power_hours" // Power (W) & Daily Operating Hours
  | "method_b_cycle" // Energy per cycle (kWh) & Cycles per week/month
  | "method_c_annual_label" // Annual kWh from BEE energy label / manufacturer
  | "method_d_standby"; // Active power + Standby power consumption

export type ApplianceCategoryGroup =
  | "cooling"
  | "lighting"
  | "kitchen"
  | "entertainment"
  | "work"
  | "household"
  | "custom";

export interface AppliancePreset {
  id: string;
  name: string;
  category: ApplianceCategoryGroup;
  categoryLabel: string;
  defaultMethod: CalculationMethod;
  defaultPowerWatts?: number;
  defaultDailyHours?: number;
  defaultDaysPerMonth?: number;
  defaultKwhPerCycle?: number;
  defaultCyclesPerWeek?: number;
  defaultAnnualKwh?: number;
  defaultActiveWatts?: number;
  defaultActiveHours?: number;
  defaultStandbyWatts?: number;
  defaultStandbyHours?: number;
  typicalRangeDescription: string;
  tip?: string;
}

export interface ApplianceItem {
  id: string;
  name: string;
  category: ApplianceCategoryGroup;
  method: CalculationMethod;
  quantity: number;
  // Method A (Power & Hours)
  powerWatts: number;
  dailyHours: number;
  daysPerMonth: number;
  dutyCyclePct?: number; // Optional 0-100% duty cycle
  // Method B (Cycle)
  kwhPerCycle: number;
  cyclesPerWeek: number;
  // Method C (Annual Label)
  annualKwh: number;
  // Method D (Standby)
  activeWatts: number;
  activeHours: number;
  standbyWatts: number;
  standbyHours: number;
}

export interface ApplianceCalculationResult {
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  // Detailed standby breakdown where applicable
  activeDailyKwh?: number;
  standbyDailyKwh?: number;
  monthlyActiveCost?: number;
  monthlyStandbyCost?: number;
  standbyCostPercentage?: number;
  // Cycle stats where applicable
  yearlyCycles?: number;
  monthlyCycles?: number;
  costPerCycle?: number;
  // Summary formula text
  formulaExplanation: string;
}

export interface MultiApplianceSummaryResult {
  totalDailyKwh: number;
  totalMonthlyKwh: number;
  totalYearlyKwh: number;
  totalDailyCost: number;
  totalMonthlyCost: number;
  totalYearlyCost: number;
  itemBreakdown: Array<{
    id: string;
    name: string;
    quantity: number;
    monthlyKwh: number;
    monthlyCost: number;
    percentOfTotalCost: number;
  }>;
}

// Comprehensive database of appliances common in Indian homes
export const APPLIANCE_PRESETS: AppliancePreset[] = [
  // Cooling & Ventilation
  {
    id: "ceiling_fan_regular",
    name: "Ceiling Fan (Standard Induction)",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 75,
    defaultDailyHours: 8,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "65W – 80W (Most common in Indian homes)",
    tip: "A standard induction ceiling fan typically consumes 70–75W at top speed (speed 5).",
  },
  {
    id: "ceiling_fan_bldc",
    name: "BLDC Ceiling Fan (5-Star Energy Saver)",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 30,
    defaultDailyHours: 8,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "26W – 35W (Saves up to 60% electricity compared to regular fans)",
    tip: "5-Star BLDC fans use brushless DC motors that draw just 28–32W at maximum speed.",
  },
  {
    id: "table_fan",
    name: "Table / Pedestal Fan",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 55,
    defaultDailyHours: 6,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "45W – 60W depending on blade sweep and oscillation",
  },
  {
    id: "air_cooler",
    name: "Desert / Room Air Cooler",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 180,
    defaultDailyHours: 8,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "150W – 250W (Includes fan motor and water submersible pump)",
    tip: "Air coolers consume ~80% less electricity than room air conditioners.",
  },
  {
    id: "refrigerator_frost_free",
    name: "Refrigerator (Frost-Free, 240–300 Litres)",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_c_annual_label",
    defaultAnnualKwh: 250,
    typicalRangeDescription: "200 – 320 kWh/year on official BEE star label",
    tip: "Check the big yellow BEE Energy Rating label on the front door for exact annual kWh.",
  },
  {
    id: "refrigerator_direct_cool",
    name: "Refrigerator (Single Door Direct Cool, ~190L)",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_c_annual_label",
    defaultAnnualKwh: 170,
    typicalRangeDescription: "130 – 210 kWh/year (Highly energy efficient single door)",
    tip: "Direct cool refrigerators don't have electric heating defrost cycles, using less power.",
  },
  {
    id: "air_conditioner_1_5_ton",
    name: "Air Conditioner (1.5 Ton Inverter)",
    category: "cooling",
    categoryLabel: "Cooling & Ventilation",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1100, // Average operating input power
    defaultDailyHours: 8,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "800W – 1500W average operating power depending on room insulation",
    tip: "For advanced inverter compressor modulation and state tariff slabs, use our dedicated AC Calculator.",
  },

  // Lighting
  {
    id: "led_bulb_9w",
    name: "LED Bulb (9 Watt)",
    category: "lighting",
    categoryLabel: "Lighting",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 9,
    defaultDailyHours: 6,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "7W – 12W (Most popular residential room lighting)",
    tip: "A 9W LED provides equivalent luminous brightness to an old 60W incandescent bulb.",
  },
  {
    id: "led_tube_light_20w",
    name: "LED Batten / Tube Light (20 Watt)",
    category: "lighting",
    categoryLabel: "Lighting",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 20,
    defaultDailyHours: 6,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "18W – 24W (Replaces old 40W fluorescent chokes)",
  },
  {
    id: "cfl_bulb",
    name: "CFL Spiral Bulb (25 Watt)",
    category: "lighting",
    categoryLabel: "Lighting",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 25,
    defaultDailyHours: 5,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "18W – 28W",
  },
  {
    id: "incandescent_bulb",
    name: "Incandescent Filament Bulb (60 Watt)",
    category: "lighting",
    categoryLabel: "Lighting",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 60,
    defaultDailyHours: 4,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "40W, 60W, or 100W yellow filament bulbs",
    tip: "Switching a 60W filament bulb to a 9W LED saves over 85% on that light's electricity cost.",
  },

  // Kitchen
  {
    id: "microwave_oven",
    name: "Microwave Oven",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1200,
    defaultDailyHours: 0.5, // 30 minutes
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "800W – 1400W electrical draw (higher than microwave cooking power)",
    tip: "Electrical input power is higher than cavity heating output (e.g. 1200W electrical for 800W cooking).",
  },
  {
    id: "electric_kettle",
    name: "Electric Kettle",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1500,
    defaultDailyHours: 0.3, // ~18 minutes (boiling 3-4 times/day)
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "1200W – 1800W (Fast boiling heating element)",
  },
  {
    id: "mixer_grinder",
    name: "Mixer Grinder / Blender",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 750,
    defaultDailyHours: 0.25, // 15 minutes/day
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "500W – 1000W motor rating",
  },
  {
    id: "induction_cooktop",
    name: "Induction Cooktop",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1800,
    defaultDailyHours: 1.5,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "1400W – 2100W during active heating",
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_b_cycle",
    defaultKwhPerCycle: 1.1,
    defaultCyclesPerWeek: 5,
    typicalRangeDescription: "0.9 – 1.4 kWh per normal wash cycle",
    tip: "Heating the wash water accounts for over 80% of a dishwasher's electrical consumption.",
  },
  {
    id: "bread_toaster",
    name: "Pop-up Bread Toaster",
    category: "kitchen",
    categoryLabel: "Kitchen",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 800,
    defaultDailyHours: 0.15, // ~9 minutes/day
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "700W – 1000W",
  },

  // Entertainment
  {
    id: "smart_tv_medium",
    name: "Smart LED Television (43″ – 55″)",
    category: "entertainment",
    categoryLabel: "Entertainment",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 80,
    defaultActiveHours: 4,
    defaultStandbyWatts: 1.0,
    defaultStandbyHours: 20,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "60W – 110W active, 0.5W – 2W standby",
    tip: "Modern Smart TVs consume 0.5W–2W in standby to listen for remote and Wi-Fi signals.",
  },
  {
    id: "smart_tv_large",
    name: "Large Smart TV (65″+ QLED / OLED)",
    category: "entertainment",
    categoryLabel: "Entertainment",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 150,
    defaultActiveHours: 4,
    defaultStandbyWatts: 1.5,
    defaultStandbyHours: 20,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "120W – 220W active, 1W – 3W standby",
  },
  {
    id: "set_top_box",
    name: "Set-top Box / DTH Receiver",
    category: "entertainment",
    categoryLabel: "Entertainment",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 18,
    defaultActiveHours: 6,
    defaultStandbyWatts: 12, // Many DTH boxes stay hot in standby!
    defaultStandbyHours: 18,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "15W – 25W active, 8W – 15W idle/standby",
    tip: "Notice: Many Indian set-top boxes draw nearly full power in standby unless turned off at the wall switch.",
  },
  {
    id: "gaming_console",
    name: "Gaming Console (PS5 / Xbox Series X)",
    category: "entertainment",
    categoryLabel: "Entertainment",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 200,
    defaultActiveHours: 2,
    defaultStandbyWatts: 2,
    defaultStandbyHours: 22,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "160W – 220W during heavy gaming, 1W – 3W resting",
  },
  {
    id: "soundbar_speaker",
    name: "Soundbar / Home Theatre Speaker",
    category: "entertainment",
    categoryLabel: "Entertainment",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 50,
    defaultActiveHours: 3,
    defaultStandbyWatts: 1.0,
    defaultStandbyHours: 21,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "30W – 100W active, 0.5W – 2W standby",
  },

  // Work & Electronics
  {
    id: "laptop_computer",
    name: "Laptop Computer",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 50,
    defaultActiveHours: 8,
    defaultStandbyWatts: 1.0,
    defaultStandbyHours: 16,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "35W – 65W for office laptops; up to 120W for gaming laptops",
    tip: "Laptops consume 60–80% less power than desktop towers due to optimized mobile chipsets.",
  },
  {
    id: "desktop_computer",
    name: "Desktop PC (Tower + Monitor)",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_d_standby",
    defaultActiveWatts: 180,
    defaultActiveHours: 6,
    defaultStandbyWatts: 3.0,
    defaultStandbyHours: 18,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "120W – 350W active, 2W – 5W sleep",
  },
  {
    id: "computer_monitor",
    name: "Computer Monitor (24″ – 27″)",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 30,
    defaultDailyHours: 7,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "22W – 40W active, <0.5W standby",
  },
  {
    id: "wifi_router",
    name: "Wi-Fi Router & Fiber ONT (24×7)",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 10,
    defaultDailyHours: 24,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "7W – 15W constant continuous draw",
    tip: "Because Wi-Fi routers run 24 hours a day, a 10W router uses ~7.2 electricity units each month.",
  },
  {
    id: "mobile_charger",
    name: "Smartphone Fast Charger",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 25,
    defaultDailyHours: 2,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "15W – 65W during active charging (<0.1W idle)",
  },
  {
    id: "printer",
    name: "Laser / Ink Tank Printer",
    category: "work",
    categoryLabel: "Work & Electronics",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 100,
    defaultDailyHours: 0.2, // ~12 minutes
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "Inkjet: 15W–30W; Laser heating: 300W–500W during printing",
  },

  // Household & Water
  {
    id: "washing_machine_front",
    name: "Washing Machine (Front Load)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_b_cycle",
    defaultKwhPerCycle: 0.8,
    defaultCyclesPerWeek: 5,
    typicalRangeDescription: "0.6 – 1.2 kWh per cycle (higher if using hot water heater)",
    tip: "Running wash cycles with normal/cold water cuts energy use by more than half.",
  },
  {
    id: "washing_machine_top",
    name: "Washing Machine (Top Load)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_b_cycle",
    defaultKwhPerCycle: 0.5,
    defaultCyclesPerWeek: 5,
    typicalRangeDescription: "0.3 – 0.7 kWh per cycle",
  },
  {
    id: "clothes_dryer",
    name: "Clothes Tumble Dryer",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_b_cycle",
    defaultKwhPerCycle: 2.5,
    defaultCyclesPerWeek: 3,
    typicalRangeDescription: "2.0 – 3.5 kWh per drying cycle",
  },
  {
    id: "storage_geyser",
    name: "Electric Storage Water Geyser (15–25 Litres)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 2000,
    defaultDailyHours: 1.0,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "2000W – 3000W heating element",
    tip: "A 2000W geyser consumes 2 full electricity units for every 1 hour it is heating.",
  },
  {
    id: "instant_geyser",
    name: "Instant Water Heater (3 Litres)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 3000,
    defaultDailyHours: 0.5,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "3000W – 4500W high-speed heating",
  },
  {
    id: "electric_iron",
    name: "Electric Steam / Dry Iron",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1200,
    defaultDailyHours: 0.5,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "1000W – 1600W (Thermostat cycles heating element on and off)",
  },
  {
    id: "water_pump",
    name: "Water Pump / Monoblock Submersible (1 HP)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 750, // 1 HP = ~746W
    defaultDailyHours: 0.75, // 45 minutes
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "0.5 HP (375W) to 1.5 HP (1100W)",
    tip: "1 Horsepower (HP) is approximately 746 Watts of electrical motor draw.",
  },
  {
    id: "vacuum_cleaner",
    name: "Vacuum Cleaner",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 1400,
    defaultDailyHours: 0.3,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "1000W – 1800W suction motor",
  },
  {
    id: "room_heater",
    name: "Room Heater (Convector / Oil Radiator)",
    category: "household",
    categoryLabel: "Household",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 2000,
    defaultDailyHours: 4.0,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "1000W – 2400W heating rods",
    tip: "Running a 2000W room heater for 4 hours uses 8 electricity units (~₹64 per night at ₹8/unit).",
  },
  // Custom Appliance Option
  {
    id: "custom_appliance",
    name: "Custom / Other Appliance",
    category: "custom",
    categoryLabel: "Custom",
    defaultMethod: "method_a_power_hours",
    defaultPowerWatts: 100,
    defaultDailyHours: 4,
    defaultDaysPerMonth: 30,
    typicalRangeDescription: "Enter custom power rating and usage pattern",
  },
];

/**
 * Creates an ApplianceItem from a preset
 */
export function createItemFromPreset(preset: AppliancePreset): ApplianceItem {
  return {
    id: `${preset.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: preset.name,
    category: preset.category,
    method: preset.defaultMethod,
    quantity: 1,
    powerWatts: preset.defaultPowerWatts ?? 100,
    dailyHours: preset.defaultDailyHours ?? 4,
    daysPerMonth: preset.defaultDaysPerMonth ?? 30,
    dutyCyclePct: 100,
    kwhPerCycle: preset.defaultKwhPerCycle ?? 0.8,
    cyclesPerWeek: preset.defaultCyclesPerWeek ?? 5,
    annualKwh: preset.defaultAnnualKwh ?? 250,
    activeWatts: preset.defaultActiveWatts ?? 100,
    activeHours: preset.defaultActiveHours ?? 4,
    standbyWatts: preset.defaultStandbyWatts ?? 1,
    standbyHours: preset.defaultStandbyHours ?? 20,
  };
}

/**
 * Validation function for single appliance item
 */
export function validateApplianceItem(
  item: ApplianceItem,
  rate: number,
): { isValid: boolean; error?: string } {
  if (rate < 0) {
    return { isValid: false, error: "Electricity rate cannot be negative." };
  }
  if (!item.quantity || item.quantity < 1) {
    return { isValid: false, error: "Quantity must be at least 1." };
  }

  switch (item.method) {
    case "method_a_power_hours": {
      if (item.powerWatts < 0) {
        return { isValid: false, error: "Appliance power cannot be negative." };
      }
      if (item.dailyHours < 0 || item.dailyHours > 24) {
        return { isValid: false, error: "Daily usage cannot be more than 24 hours." };
      }
      if (item.daysPerMonth < 0 || item.daysPerMonth > 31) {
        return { isValid: false, error: "Days per month must be between 0 and 31." };
      }
      if (
        item.dutyCyclePct !== undefined &&
        (item.dutyCyclePct < 0 || item.dutyCyclePct > 100)
      ) {
        return { isValid: false, error: "Duty cycle must be between 0% and 100%." };
      }
      break;
    }
    case "method_b_cycle": {
      if (item.kwhPerCycle < 0) {
        return { isValid: false, error: "Energy per cycle cannot be negative." };
      }
      if (item.cyclesPerWeek < 0) {
        return { isValid: false, error: "Cycles per week cannot be negative." };
      }
      break;
    }
    case "method_c_annual_label": {
      if (item.annualKwh < 0) {
        return { isValid: false, error: "Annual energy consumption cannot be negative." };
      }
      break;
    }
    case "method_d_standby": {
      if (item.activeWatts < 0 || item.standbyWatts < 0) {
        return { isValid: false, error: "Power consumption cannot be negative." };
      }
      if (item.activeHours < 0 || item.activeHours > 24) {
        return { isValid: false, error: "Active hours cannot be more than 24 hours." };
      }
      if (item.standbyHours < 0 || item.standbyHours > 24) {
        return { isValid: false, error: "Standby hours cannot be more than 24 hours." };
      }
      if (item.activeHours + item.standbyHours > 24) {
        return {
          isValid: false,
          error: "Standby hours and active hours cannot exceed 24 hours.",
        };
      }
      if (item.daysPerMonth < 0 || item.daysPerMonth > 31) {
        return { isValid: false, error: "Days per month must be between 0 and 31." };
      }
      break;
    }
  }

  return { isValid: true };
}

/**
 * Core calculation function for a single appliance
 * Computes results with full precision
 */
export function calculateApplianceItem(
  item: ApplianceItem,
  ratePerKWh: number,
): ApplianceCalculationResult {
  const qty = Math.max(1, Math.floor(item.quantity || 1));
  const rate = Math.max(0, ratePerKWh || 0);

  let dailyKwh = 0;
  let monthlyKwh = 0;
  let yearlyKwh = 0;
  let formulaExplanation = "";

  let activeDailyKwh: number | undefined;
  let standbyDailyKwh: number | undefined;
  let monthlyActiveCost: number | undefined;
  let monthlyStandbyCost: number | undefined;
  let standbyCostPercentage: number | undefined;

  let yearlyCycles: number | undefined;
  let monthlyCycles: number | undefined;
  let costPerCycle: number | undefined;

  switch (item.method) {
    case "method_a_power_hours": {
      const dutyFactor =
        item.dutyCyclePct !== undefined ? Math.max(0, Math.min(100, item.dutyCyclePct)) / 100 : 1;
      const effectiveWatts = item.powerWatts * dutyFactor;
      const hours = Math.max(0, Math.min(24, item.dailyHours));
      const days = Math.max(0, Math.min(31, item.daysPerMonth));

      dailyKwh = (effectiveWatts / 1000) * hours * qty;
      monthlyKwh = dailyKwh * days;
      yearlyKwh = dailyKwh * 365;

      const singleUnitPerDay = (effectiveWatts / 1000) * hours;
      formulaExplanation = `Your ${qty > 1 ? `${qty} appliances` : item.name} draw ${effectiveWatts.toFixed(effectiveWatts % 1 === 0 ? 0 : 1)}W for ${hours} hrs/day (${singleUnitPerDay.toFixed(3)} units/day per unit). At ₹${rate.toFixed(2)}/unit, this equals ₹${(dailyKwh * rate).toFixed(2)}/day and ₹${(monthlyKwh * rate).toFixed(2)} for ${days} days.`;
      break;
    }

    case "method_b_cycle": {
      const kwhCycle = Math.max(0, item.kwhPerCycle);
      const cyclesWeek = Math.max(0, item.cyclesPerWeek);

      // Formulas as specified:
      // Yearly cycles = cycles per week * 365 / 7
      // Yearly energy = kWh per cycle * cycles per week * 365 / 7 * Quantity
      // Monthly energy = kWh per cycle * cycles per week * 365 / 12 / 7 * Quantity
      yearlyCycles = (cyclesWeek * 365) / 7;
      monthlyCycles = yearlyCycles / 12;

      yearlyKwh = kwhCycle * yearlyCycles * qty;
      monthlyKwh = (kwhCycle * cyclesWeek * 365) / 12 / 7 * qty;
      dailyKwh = yearlyKwh / 365;
      costPerCycle = kwhCycle * rate;

      formulaExplanation = `At ${kwhCycle} kWh per cycle and ${cyclesWeek} cycles/week (~${monthlyCycles.toFixed(1)} cycles/month), total monthly consumption is ${monthlyKwh.toFixed(2)} units. At ₹${rate.toFixed(2)}/unit, each cycle costs ₹${costPerCycle.toFixed(2)}.`;
      break;
    }

    case "method_c_annual_label": {
      const annual = Math.max(0, item.annualKwh);
      yearlyKwh = annual * qty;
      monthlyKwh = yearlyKwh / 12;
      dailyKwh = yearlyKwh / 365;

      formulaExplanation = `Based on the BEE energy label's certified annual consumption of ${annual} kWh (~${monthlyKwh.toFixed(2)} units/month), the estimated monthly cost is ₹${(monthlyKwh * rate).toFixed(2)} at ₹${rate.toFixed(2)}/unit.`;
      break;
    }

    case "method_d_standby": {
      const actWatts = Math.max(0, item.activeWatts);
      const actHours = Math.max(0, Math.min(24, item.activeHours));
      const stbyWatts = Math.max(0, item.standbyWatts);
      const stbyHours = Math.max(0, Math.min(24 - actHours, item.standbyHours));
      const days = Math.max(0, Math.min(31, item.daysPerMonth));

      // Formulas as specified:
      // Active daily kWh = Active watts * Active hours ÷ 1000
      // Standby daily kWh = Standby watts * Standby hours ÷ 1000
      // Total daily kWh = (Active daily kWh + Standby daily kWh) * Quantity
      const singleActiveDailyKwh = (actWatts * actHours) / 1000;
      const singleStandbyDailyKwh = (stbyWatts * stbyHours) / 1000;

      activeDailyKwh = singleActiveDailyKwh * qty;
      standbyDailyKwh = singleStandbyDailyKwh * qty;
      dailyKwh = activeDailyKwh + standbyDailyKwh;

      const monthlyActiveKwh = activeDailyKwh * days;
      const monthlyStandbyKwh = standbyDailyKwh * days;
      monthlyKwh = dailyKwh * days;
      yearlyKwh = dailyKwh * 365;

      monthlyActiveCost = monthlyActiveKwh * rate;
      monthlyStandbyCost = monthlyStandbyKwh * rate;
      const totalMonthlyCost = monthlyKwh * rate;

      standbyCostPercentage =
        totalMonthlyCost > 0 ? (monthlyStandbyCost / totalMonthlyCost) * 100 : 0;

      formulaExplanation = `Active use (${actWatts}W × ${actHours}h = ${singleActiveDailyKwh.toFixed(2)} kWh/day) costs ₹${monthlyActiveCost.toFixed(2)}/month. Standby draw (${stbyWatts}W × ${stbyHours}h = ${singleStandbyDailyKwh.toFixed(2)} kWh/day) costs ₹${monthlyStandbyCost.toFixed(2)}/month (${standbyCostPercentage.toFixed(1)}% of total). Total = ₹${totalMonthlyCost.toFixed(2)}/month.`;
      break;
    }
  }

  const dailyCost = dailyKwh * rate;
  const monthlyCost = monthlyKwh * rate;
  const yearlyCost = yearlyKwh * rate;

  return {
    dailyKwh,
    monthlyKwh,
    yearlyKwh,
    dailyCost,
    monthlyCost,
    yearlyCost,
    activeDailyKwh,
    standbyDailyKwh,
    monthlyActiveCost,
    monthlyStandbyCost,
    standbyCostPercentage,
    yearlyCycles,
    monthlyCycles,
    costPerCycle,
    formulaExplanation,
  };
}

/**
 * Calculates combined total for multiple appliances
 */
export function calculateMultiAppliance(
  items: ApplianceItem[],
  ratePerKWh: number,
): MultiApplianceSummaryResult {
  let totalDailyKwh = 0;
  let totalMonthlyKwh = 0;
  let totalYearlyKwh = 0;
  let totalDailyCost = 0;
  let totalMonthlyCost = 0;
  let totalYearlyCost = 0;

  const itemDetails: Array<{
    id: string;
    name: string;
    quantity: number;
    monthlyKwh: number;
    monthlyCost: number;
  }> = [];

  for (const item of items) {
    const res = calculateApplianceItem(item, ratePerKWh);
    totalDailyKwh += res.dailyKwh;
    totalMonthlyKwh += res.monthlyKwh;
    totalYearlyKwh += res.yearlyKwh;
    totalDailyCost += res.dailyCost;
    totalMonthlyCost += res.monthlyCost;
    totalYearlyCost += res.yearlyCost;

    itemDetails.push({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      monthlyKwh: res.monthlyKwh,
      monthlyCost: res.monthlyCost,
    });
  }

  const itemBreakdown = itemDetails.map((detail) => ({
    ...detail,
    percentOfTotalCost:
      totalMonthlyCost > 0 ? (detail.monthlyCost / totalMonthlyCost) * 100 : 0,
  }));

  return {
    totalDailyKwh,
    totalMonthlyKwh,
    totalYearlyKwh,
    totalDailyCost,
    totalMonthlyCost,
    totalYearlyCost,
    itemBreakdown,
  };
}

/**
 * Formatting helpers
 */
export function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: val % 1 === 0 ? 0 : 2,
  }).format(val);
}

export function formatUnits(val: number, decimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: val % 1 === 0 ? 0 : decimals,
  }).format(val);
}

