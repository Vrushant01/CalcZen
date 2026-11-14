import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCalculator } from "@/data/calculators";
import { useCalculatorState } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  Zap,
  RotateCcw,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Clock,
  TrendingDown,
  Sliders,
  Scale,
  Receipt,
  HelpCircle,
  ThermometerSnowflake,
  Lightbulb,
  Building,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  AcCalculationInputs,
  CalculationMethod,
  PowerUnit,
  AcType,
  TariffCalculationMode,
  INDIAN_DISCOM_PROFILES,
  TONNAGE_POWER_BENCHMARKS,
  masterCalculateAcCost,
  calculateAcComparison,
  formatINR,
  formatNumber,
} from "@/utils/acElectricityUtils";

// Default Preset Values
const DEFAULT_INPUTS: AcCalculationInputs = {
  method: "wattage",
  powerInput: 1500, // 1500 Watts (typical 1.5 Ton 3-star AC)
  powerUnit: "W",
  acType: "inverter",
  inverterPowerMode: "average_operating",
  inverterOperatingFactor: 0.7,
  tonnage: 1.5,
  starRating: 3,
  beeAnnualConsumptionKWh: 980,
  acCount: 1,
  dailyUsageHours: 8,
  operatingDaysPerMonth: 30,
  operatingMonthsPerYear: 12,
  tariffMode: "simple",
  simpleRatePerUnitINR: 8.0,
  selectedDiscomId: "gujarat_gerc",
  existingMonthlyHouseholdUnits: 150,
  customSlabs: [],
  customDutyPct: 15,
  customFuelSurchargePerUnitINR: 2.35,
};

// -------------------------------------------------------------
// SEO BLOG & EDUCATIONAL CONTENT
// -------------------------------------------------------------

const blogContent: any = {
  title: "Complete AC Electricity Cost & Power Consumption Guide (India)",
  primaryKeyword: "AC Electricity Cost Calculator",
  category: "Electricity",
  introText:
    "Air conditioners are the single largest contributors to household summer electricity bills in India. Whether you are running a 1-ton bedroom split AC or multiple 1.5-ton inverter units, understanding your air conditioner's wattage, daily units consumed, BEE star ratings, and state electricity tariff slabs helps you take control of your energy costs.",
  sections: [
    {
      title: "How Much Electricity Does an Air Conditioner Consume in India?",
      paragraphs: [
        "In Indian residential buildings, an air conditioner's power consumption depends primarily on its tonnage (cooling capacity), BEE star rating, compressor technology (inverter vs. non-inverter), set temperature, and daily operating hours.",
        "A typical 1.5-ton 3-star or 5-star inverter AC has a rated electrical input power between 1,150 W and 1,500 W. When running for 8 hours a day, it typically consumes between 6.5 and 10 electricity units (kWh) per day, resulting in a monthly bill impact of approximately ₹1,600 to ₹2,800 depending on local electricity rates.",
      ],
      callout: {
        type: "quickFact",
        title: "BEE Recommended 24°C Standard",
        text: "The Bureau of Energy Efficiency (BEE) and the Ministry of Power mandate a default temperature setting of 24°C on all room air conditioners in India. Increasing your AC temperature from 20°C to 24°C saves up to 24% of power.",
      },
    },
    {
      title: "Difference Between Cooling Capacity (Tonnage) and Electrical Power (Wattage)",
      paragraphs: [
        "A common misconception among homeowners is equating AC tonnage with electrical wattage. A '1.5-ton' AC does not consume 1.5 kilowatts (kW) of electricity automatically.",
        "One ton of refrigeration represents a cooling rate of 12,000 BTU/hr (approximately 3,517 thermal Watts of heat removal from the room). The electrical input power required by the compressor to remove this heat is significantly lower due to the refrigeration cycle efficiency.",
        "For example, a modern 5-star 1.5-ton inverter AC produces ~5,000 Watts of cooling while consuming only ~1,100 Watts of electrical power.",
      ],
      formulaBox: {
        title: "Basic Electricity Unit Formula",
        formula:
          "Power (kW) = Input Power (Watts) / 1,000\nDaily Units (kWh) = Power (kW) × Daily Operating Hours\nMonthly Cost (₹) = Daily Units × Operating Days × Electricity Rate (₹/unit)",
        variables: [
          { name: "1 kWh", desc: "1 unit of electricity registered on your electricity meter." },
          { name: "Power (kW)", desc: "Electrical power drawn by the AC compressor and fans." },
          { name: "Electricity Rate", desc: "Cost per unit charged by your state DISCOM." },
        ],
      },
    },
    {
      title: "Inverter vs Non-Inverter AC: Which Consumes Less Power?",
      paragraphs: [
        "- **Non-Inverter ACs (Fixed Speed):** The compressor runs at full 100% capacity until the room reaches the thermostat set point, turns off completely, and turns on again when the room warms up. This constant cycling creates power spikes and consumes more electricity.",
        "- **Inverter ACs (Variable Speed):** The compressor uses a Brushless DC (BLDC) motor that varies its motor speed continuously. Once your room reaches 24°C, the compressor slows down, consuming only 30% to 50% of its rated power to maintain the temperature steadily. This saves 30% to 40% on monthly electricity bills.",
      ],
    },
    {
      title: "What Does the BEE Star Label and ISEER Mean?",
      paragraphs: [
        "In India, the Bureau of Energy Efficiency (BEE) rates room air conditioners using the Indian Seasonal Energy Efficiency Ratio (ISEER).",
        "ISEER measures the total annual amount of heat removed from indoor air divided by the total annual amount of electrical energy consumed under standard temperature bins ranging from 24°C to 43°C.",
        "The label displays **'Electricity Consumption: XYZ Units per Year'**. This number is benchmarked for **1,600 operating hours** per year. If your household runs the AC for more than 4.5 hours a day on average, your actual annual consumption will be higher than the label figure.",
      ],
      formulaBox: {
        title: "ISEER Formula (BEE Schedule)",
        formula: "ISEER = Total Annual Cooling Load (CSEC) / Total Annual Energy Consumption (CSTLE)",
        variables: [
          { name: "5-Star Inverter", desc: "ISEER greater than 5.0 (Highest efficiency)." },
          { name: "3-Star Inverter", desc: "ISEER between 3.8 and 4.39." },
        ],
      },
    },
    {
      title: "How Electricity Tariff Slabs Impact Your AC Bill",
      paragraphs: [
        "Indian electricity distribution companies (DISCOMs like UGVCL, MSEDCL, BSES, BESCOM, TANGEDCO) charge residential consumers on progressive, telescopic tariff slabs.",
        "Because essential household appliances (refrigerator, lights, television, ceiling fans) already consume 100 to 150 units, those units fill your lower, subsidized tariff slabs (e.g. ₹3 to ₹4/unit).",
        "When you switch on an AC and add 300 units of consumption, all those 300 units are billed at your highest marginal tariff slab (often ₹7 to ₹11+ per unit). This is why running an AC appears to double or triple your electricity bill.",
      ],
    },
    {
      title: "7 Practical Tips to Reduce AC Electricity Bills",
      paragraphs: [
        "1. **Set Thermostat to 24°C–26°C:** Every 1°C increase saves ~6% on compressor electricity.",
        "2. **Use Ceiling Fans Simultaneously:** A ceiling fan produces wind-chill airflow, making 25°C feel as cool as 22°C while using only ~30 Watts.",
        "3. **Clean Filters Every 2 Weeks:** Clogged air filters restrict airflow, forcing the compressor to work harder and increasing power draw by up to 15%.",
        "4. **Seal Window & Door Gaps:** Prevent cool air leakage and hot ambient air infiltration with weatherstripping.",
        "5. **Use Timer / Sleep Mode at Night:** Sleep mode gradually raises the set temperature by 1°C every hour as ambient temperature drops, reducing midnight energy consumption.",
        "6. **Service Your Outdoor Unit (Condenser):** Ensure the outdoor condenser fins are free from dust, foliage, and direct afternoon sunlight.",
        "7. **Close Curtains During Peak Sun:** Heavy curtains block radiant solar heat gain, reducing the thermal load on your air conditioner.",
      ],
    },
  ],
  faqs: [
    {
      q: "How many electricity units does a 1.5-ton AC consume in 1 hour?",
      a: "A 1.5-ton 3-star or 5-star inverter AC typically consumes 0.7 to 1.1 units (kWh) per hour during continuous operation once the room reaches the set temperature. In initial cooldown mode, it may draw 1.3 to 1.5 units per hour. A non-inverter 1.5-ton AC averages 1.4 to 1.6 units per operating hour.",
    },
    {
      q: "How much electricity does a 1.5-ton AC use in 8 hours?",
      a: "In 8 hours of daily operation, a 1.5-ton inverter AC set at 24°C typically consumes between 6.5 and 9.5 electricity units (kWh). At an average tariff rate of ₹8 per unit, this costs approximately ₹52 to ₹76 per day, or ₹1,560 to ₹2,280 per month.",
    },
    {
      q: "What is the monthly electricity bill for a 1-ton AC in India?",
      a: "A 1-ton inverter AC running 8 hours daily for 30 days consumes approximately 160 to 220 units per month. At ₹8 per unit, the monthly electricity cost is approximately ₹1,280 to ₹1,760.",
    },
    {
      q: "Does an inverter AC really save 30% to 50% electricity?",
      a: "Yes. Inverter ACs save substantial electricity because their BLDC compressors modulate motor speed rather than turning completely on and off. Independent testing by BEE demonstrates that a 5-star inverter AC consumes 30% to 40% less energy than a 3-star fixed-speed non-inverter model under typical Indian room conditions.",
    },
    {
      q: "Why is setting the AC to 24°C recommended?",
      a: "Setting your AC to 24°C provides the ideal balance between thermal comfort and energy conservation. According to the Bureau of Energy Efficiency (BEE), every 1°C increase in AC temperature setting saves approximately 6% of electrical energy. Setting the temperature to 24°C instead of 18°C can reduce your AC electricity consumption by nearly 36%.",
    },
    {
      q: "Where can I find the rated wattage of my air conditioner?",
      a: "Rated electrical input power is printed on the silver specification sticker located on the side or underside of the indoor unit (IDU) and on the outdoor condenser unit (ODU). It is also listed under 'Power Input (Cooling)' in your AC's user manual or product specifications sheet.",
    },
    {
      q: "How does the BEE star label annual consumption figure work?",
      a: "The BEE star label displays annual electricity consumption in kWh benchmarked for 1,600 operating hours per year under standardized test conditions (IS 1391). If you run your AC for 8 hours a day for 6 months (approx. 1,440 hours), your consumption will be close to the label. If you run it 12 hours a day year-round, your consumption will be higher.",
    },
    {
      q: "What is the average cost of 1 electricity unit in India?",
      a: "Residential electricity tariffs in India vary by state and consumption slab, typically ranging from ₹3.50 to ₹10.50 per unit. States like Maharashtra and West Bengal have higher upper-slab tariffs (up to ₹12–₹17/unit), while states like Delhi and Tamil Nadu offer subsidies for lower consumption tiers.",
    },
  ],
};

export function AcElectricityCostCalculator() {
  const calc = getCalculator("ac-electricity-cost-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Master Inputs State
  const [inputs, setInputs] = useState<AcCalculationInputs>(DEFAULT_INPUTS);
  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // UI Accordion & Section Toggles
  const [showTonnageHelper, setShowTonnageHelper] = useState<boolean>(false);
  const [showCompareTool, setShowCompareTool] = useState<boolean>(false);
  const [showHowCalculated, setShowHowCalculated] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Compare Tool State
  const [compareModelA, setCompareModelA] = useState({
    name: "Current AC (3-Star)",
    watts: 1500,
  });
  const [compareModelB, setCompareModelB] = useState({
    name: "New 5-Star Inverter AC",
    watts: 950,
  });

  // Update inputs safely
  const updateInputs = (patch: Partial<AcCalculationInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  // Preset Handlers
  const handleApplyPreset = (preset: "1_5_ton" | "1_ton" | "multi_ac") => {
    if (preset === "1_5_ton") {
      setInputs((prev) => ({
        ...prev,
        method: "wattage",
        powerInput: 1500,
        powerUnit: "W",
        acType: "inverter",
        inverterPowerMode: "average_operating",
        dailyUsageHours: 8,
        operatingDaysPerMonth: 30,
        operatingMonthsPerYear: 12,
        acCount: 1,
        simpleRatePerUnitINR: 8,
      }));
    } else if (preset === "1_ton") {
      setInputs((prev) => ({
        ...prev,
        method: "wattage",
        powerInput: 980,
        powerUnit: "W",
        acType: "inverter",
        inverterPowerMode: "average_operating",
        dailyUsageHours: 6,
        operatingDaysPerMonth: 30,
        operatingMonthsPerYear: 12,
        acCount: 1,
        simpleRatePerUnitINR: 8,
      }));
    } else if (preset === "multi_ac") {
      setInputs((prev) => ({
        ...prev,
        method: "wattage",
        powerInput: 1400,
        powerUnit: "W",
        acType: "inverter",
        inverterPowerMode: "average_operating",
        dailyUsageHours: 10,
        operatingDaysPerMonth: 30,
        operatingMonthsPerYear: 12,
        acCount: 2,
        simpleRatePerUnitINR: 8,
      }));
    }
  };

  // Reset Handler
  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setShowTonnageHelper(false);
    setShowCompareTool(false);
    setShowHowCalculated(false);
    resetCalculated();
  };

  // Active Calculation Result
  const result = useMemo(() => {
    return masterCalculateAcCost(activeInputs);
  }, [activeInputs]);

  // Comparison Result
  const comparisonResult = useMemo(() => {
    return calculateAcComparison({
      acAName: compareModelA.name,
      acAPowerWatts: compareModelA.watts,
      acAIsBee: false,
      acBName: compareModelB.name,
      acBPowerWatts: compareModelB.watts,
      acBIsBee: false,
      dailyHours: inputs.dailyUsageHours,
      operatingDaysPerMonth: inputs.operatingDaysPerMonth,
      operatingMonthsPerYear: inputs.operatingMonthsPerYear,
      electricityRateINR: result.effectiveCostPerUnitINR,
    });
  }, [compareModelA, compareModelB, inputs, result.effectiveCostPerUnitINR]);

  // Handle Calculate Click
  const handleCalculateClick = () => {
    markCalculated();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Copy Summary
  const handleCopySummary = () => {
    const summary = [
      `CalcZen AC Electricity Cost Estimate (India)`,
      `--------------------------------------------`,
      `Monthly Running Cost: ${formatINR(result.monthlyCostINR)} / month`,
      `Daily Running Cost: ${formatINR(result.dailyCostINR)} / day`,
      `Annual Running Cost: ${formatINR(result.annualCostINR)} / year`,
      `Daily Units: ${result.dailyUnits.toFixed(2)} units (kWh)`,
      `Monthly Units: ${Math.round(result.monthlyUnits)} units (kWh)`,
      `Annual Units: ${Math.round(result.annualUnits)} units (kWh)`,
      `AC Power: ${result.effectivePowerWatts} W (${result.effectivePowerKW} kW)`,
      `Daily Hours: ${inputs.dailyUsageHours} hrs/day (${inputs.operatingDaysPerMonth} days/mo)`,
      `Electricity Tariff Rate: ₹${result.effectiveCostPerUnitINR.toFixed(2)} / unit`,
      result.isTariffModeActive
        ? `Tariff Bill Impact: +₹${Math.round(result.incrementalMonthlyAcCostINR)} on household bill (${result.discomProfileName})`
        : ``,
      `Potential Savings (1 hr less/day): ${formatINR(result.savings1HourPerDayMonthlyINR)} / month`,
      `24°C Thermostat Savings: ${formatINR(result.thermostatOptimizationSavingsMonthlyINR)} / month`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Calculate how many electricity units your air conditioner uses, how much it costs per day, month, and year, and how it impacts your household electricity bill across Indian states."
      formula={`Daily Units (kWh) = [Power (Watts) / 1,000] × Daily Hours × Number of ACs\nMonthly Units = Daily Units × Operating Days per Month\nMonthly Cost = Monthly Units × Electricity Rate (₹/kWh)\nIncremental Bill Impact = Bill(Household Units + AC Units) - Bill(Household Units)`}
      example={`For a 1.5-ton AC drawing 1,500 W (1.5 kW), running 8 hours/day for 30 days at ₹8/unit:\nDaily Units = 1.5 kW × 8 hrs = 12 units/day\nMonthly Units = 12 × 30 = 360 units/month\nDaily Running Cost = 12 × ₹8 = ₹96/day\nMonthly Running Cost = 360 × ₹8 = ₹2,880/month\nAnnual Running Cost = ₹34,560/year`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* ========================================================= */}
        {/* TOP BAR: METHOD SELECTOR & PRESETS                        */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/70 shadow-sm">
          {/* Method Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/50">
            <button
              type="button"
              onClick={() => updateInputs({ method: "wattage" })}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                inputs.method === "wattage"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quick Wattage Mode
            </button>
            <button
              type="button"
              onClick={() => updateInputs({ method: "bee_label" })}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                inputs.method === "bee_label"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BEE Star Label Mode
            </button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset("1_5_ton")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              1.5 Ton (8 hrs)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("1_ton")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              1.0 Ton (6 hrs)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("multi_ac")}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              2 ACs Villa
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-7 gap-1 border-border/70 hover:bg-muted text-muted-foreground"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: AC POWER CONSUMPTION & TECHNOLOGY                 */}
        {/* ========================================================= */}
        <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold shrink-0">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {inputs.method === "bee_label"
                    ? "BEE Star Label Annual Consumption"
                    : "How much electricity does your AC use?"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 ml-8">
                {inputs.method === "bee_label"
                  ? "Enter the annual electricity consumption (kWh/year) printed on your AC's star label sticker."
                  : "You can find rated electrical input power on your AC specification sticker or user manual."}
              </p>
            </div>

            {inputs.method === "wattage" && (
              <button
                type="button"
                onClick={() => setShowTonnageHelper(!showTonnageHelper)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors cursor-pointer ml-8 sm:ml-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showTonnageHelper ? "Hide Tonnage Guide" : "Select by Tonnage (1, 1.5, 2 Ton)"}</span>
              </button>
            )}
          </div>

          {/* METHOD B: BEE LABEL INPUT */}
          {inputs.method === "bee_label" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  BEE Annual Electricity Consumption (kWh / year)
                </Label>
                <div className="flex">
                  <Input
                    type="number"
                    min="100"
                    max="5000"
                    step="10"
                    value={inputs.beeAnnualConsumptionKWh}
                    onChange={(e) => updateInputs({ beeAnnualConsumptionKWh: parseFloat(e.target.value) || 0 })}
                    className="h-12 text-base font-semibold rounded-r-none"
                  />
                  <span className="h-12 px-3.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground flex items-center">
                    kWh / yr
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Found on the official BEE Star Label sticker on the indoor/outdoor unit
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>BEE Benchmark Standard:</strong> The label figure is benchmarked under IS 1391 for <strong>1,600 annual hours</strong>. If you run your AC more or fewer hours, actual consumption scales accordingly.
                </div>
              </div>
            </div>
          ) : (
            /* METHOD A: POWER WATTAGE / KW INPUT */
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Power Input with Unit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Electrical Input Power</Label>
                    <span className="text-[11px] text-muted-foreground">Compressor + Fan</span>
                  </div>

                  <div className="flex">
                    <Input
                      type="number"
                      min="50"
                      max="10000"
                      step="10"
                      value={inputs.powerInput}
                      onChange={(e) => updateInputs({ powerInput: parseFloat(e.target.value) || 0 })}
                      className="h-12 text-base font-bold rounded-r-none"
                    />
                    <select
                      value={inputs.powerUnit}
                      onChange={(e) => updateInputs({ powerUnit: e.target.value as PowerUnit })}
                      className="h-12 px-3.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground cursor-pointer focus:outline-none"
                    >
                      <option value="W">Watts (W)</option>
                      <option value="kW">kW</option>
                    </select>
                  </div>

                  {/* Quick Wattage Preset Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mr-1">
                      Quick:
                    </span>
                    {[
                      { label: "850 W (1T 5★)", val: 850 },
                      { label: "1,150 W (1.5T 5★)", val: 1150 },
                      { label: "1,450 W (1.5T 3★)", val: 1450 },
                      { label: "1,850 W (2T)", val: 1850 },
                    ].map((pill) => (
                      <button
                        key={pill.val}
                        type="button"
                        onClick={() => updateInputs({ powerInput: pill.val, powerUnit: "W" })}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          inputs.powerInput === pill.val && inputs.powerUnit === "W"
                            ? "bg-amber-500 text-white border-amber-600 font-semibold"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AC Type Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">AC Compressor Technology</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateInputs({ acType: "inverter" })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        inputs.acType === "inverter"
                          ? "bg-amber-500/15 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30"
                          : "bg-muted/20 hover:bg-muted/50 border-border/60"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">Inverter AC</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Variable speed, energy saving</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateInputs({ acType: "non_inverter" })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        inputs.acType === "non_inverter"
                          ? "bg-amber-500/15 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30"
                          : "bg-muted/20 hover:bg-muted/50 border-border/60"
                      }`}
                    >
                      <div className="text-xs font-bold text-foreground">Non-Inverter</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Fixed speed on/off cycling</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Inverter Explanation & Segmented Power Mode */}
              {inputs.acType === "inverter" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2.5">
                  <div className="flex items-start gap-2.5 text-foreground leading-relaxed">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Inverter Modulation:</strong> Inverter ACs modulate power. Once the room reaches the set temperature, the compressor slows down, consuming ~30%–50% less power than maximum capacity.
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/20 text-xs">
                    <span className="text-muted-foreground font-medium">Entered power is:</span>
                    <div className="flex items-center gap-1.5 bg-background p-1 rounded-lg border border-border/60">
                      <button
                        type="button"
                        onClick={() => updateInputs({ inverterPowerMode: "average_operating" })}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                          inputs.inverterPowerMode === "average_operating"
                            ? "bg-amber-500 text-white"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Average Operating Power (Typical)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateInputs({ inverterPowerMode: "rated_max" })}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                          inputs.inverterPowerMode === "rated_max"
                            ? "bg-amber-500 text-white"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Sticker Max Power (Applies ~70% factor)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TONNAGE APPROXIMATION HELPER */}
              {showTonnageHelper && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Select AC Model by Tonnage</span>
                    <span className="text-[11px] text-muted-foreground">Approximate electrical wattage guide</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { ton: 1.0, name: "1.0 Ton", cooling: "~3,500 W", rated3: 980, rated5: 820 },
                      { ton: 1.5, name: "1.5 Ton", cooling: "~5,275 W", rated3: 1450, rated5: 1180 },
                      { ton: 2.0, name: "2.0 Ton", cooling: "~7,000 W", rated3: 1980, rated5: 1650 },
                    ].map((item) => {
                      const isSelected = inputs.tonnage === item.ton;
                      return (
                        <div
                          key={item.ton}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-background border-amber-500 ring-2 ring-amber-400/20"
                              : "bg-background/80 hover:bg-background border-border/60"
                          }`}
                          onClick={() => {
                            const watts =
                              inputs.starRating === 5
                                ? item.rated5
                                : item.rated3;
                            updateInputs({ tonnage: item.ton, powerInput: watts, powerUnit: "W" });
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{item.cooling}</span>
                          </div>
                          <div className="mt-2 space-y-1 text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateInputs({ tonnage: item.ton, starRating: 3, powerInput: item.rated3, powerUnit: "W" });
                              }}
                              className={`w-full py-1 px-2 rounded flex items-center justify-between text-[11px] font-semibold border ${
                                inputs.tonnage === item.ton && inputs.starRating === 3
                                  ? "bg-amber-500 text-white border-amber-600"
                                  : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/40"
                              }`}
                            >
                              <span>3-Star Model</span>
                              <span>~{item.rated3} W</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateInputs({ tonnage: item.ton, starRating: 5, powerInput: item.rated5, powerUnit: "W" });
                              }}
                              className={`w-full py-1 px-2 rounded flex items-center justify-between text-[11px] font-semibold border ${
                                inputs.tonnage === item.ton && inputs.starRating === 5
                                  ? "bg-amber-500 text-white border-amber-600"
                                  : "bg-muted/40 text-muted-foreground hover:text-foreground border-border/40"
                              }`}
                            >
                              <span>5-Star Model</span>
                              <span>~{item.rated5} W</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* STEP 2: OPERATING HOURS & USAGE PATTERN                   */}
        {/* ========================================================= */}
        <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Operating Hours & Usage Pattern
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Set how long you run the AC each day, active days per month, and operating months per year.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-1">
            {/* DAILY RUNNING HOURS (HERO DIAL) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Daily AC Running Hours</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">Adjust slider or click quick hour pills below</span>
                </div>
                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-border/60 font-mono font-bold text-lg text-foreground shadow-xs">
                  <span>{inputs.dailyUsageHours}</span>
                  <span className="text-xs font-normal text-muted-foreground font-sans">hrs / day</span>
                </div>
              </div>

              {/* Radix Slider */}
              <div className="py-2">
                <Slider
                  value={[inputs.dailyUsageHours]}
                  onValueChange={([val]) => updateInputs({ dailyUsageHours: val })}
                  min={1}
                  max={24}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Quick Hour Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mr-1">
                  Preset:
                </span>
                {[
                  { label: "4 hrs (Quick cool)", hrs: 4 },
                  { label: "6 hrs (Evening)", hrs: 6 },
                  { label: "8 hrs (Standard)", hrs: 8 },
                  { label: "10 hrs (Night)", hrs: 10 },
                  { label: "12 hrs (All night)", hrs: 12 },
                  { label: "16 hrs (Day+Night)", hrs: 16 },
                ].map((item) => (
                  <button
                    key={item.hrs}
                    type="button"
                    onClick={() => updateInputs({ dailyUsageHours: item.hrs })}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                      inputs.dailyUsageHours === item.hrs
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MONTHLY & SEASONAL USAGE ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Operating Days */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Days per Month</Label>
                  <span className="text-xs font-mono font-bold text-foreground">{inputs.operatingDaysPerMonth} days</span>
                </div>
                <div className="flex gap-1.5 text-xs">
                  {[20, 25, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateInputs({ operatingDaysPerMonth: d })}
                      className={`flex-1 py-1 px-2 rounded-lg border font-semibold text-center transition-all cursor-pointer ${
                        inputs.operatingDaysPerMonth === d
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-background text-muted-foreground border-border/60"
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Months */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Months per Year</Label>
                  <span className="text-xs font-mono font-bold text-foreground">{inputs.operatingMonthsPerYear} mo</span>
                </div>
                <div className="flex gap-1.5 text-xs">
                  {[
                    { label: "4 mo (Summer)", mo: 4 },
                    { label: "6 mo (Extended)", mo: 6 },
                    { label: "12 mo (Full Year)", mo: 12 },
                  ].map((m) => (
                    <button
                      key={m.mo}
                      type="button"
                      onClick={() => updateInputs({ operatingMonthsPerYear: m.mo })}
                      className={`flex-1 py-1 px-1.5 rounded-lg border font-semibold text-center text-[11px] transition-all cursor-pointer ${
                        inputs.operatingMonthsPerYear === m.mo
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-background text-muted-foreground border-border/60"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of AC Units */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Number of ACs</Label>
                  <span className="text-xs font-mono font-bold text-foreground">{inputs.acCount} unit(s)</span>
                </div>
                <div className="flex items-center justify-between bg-background p-1 rounded-xl border border-border/60">
                  <button
                    type="button"
                    onClick={() => updateInputs({ acCount: Math.max(1, inputs.acCount - 1) })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {inputs.acCount} {inputs.acCount === 1 ? "AC" : "ACs"}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateInputs({ acCount: inputs.acCount + 1 })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STEP 3: ELECTRICITY TARIFF RATE                           */}
        {/* ========================================================= */}
        <div className="bg-card border border-border/70 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold shrink-0">
                3
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Electricity Tariff Rate
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Choose a simple flat rate or calculate real incremental impact under Indian state tariff slabs.
                </p>
              </div>
            </div>

            {/* Segmented Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => updateInputs({ tariffMode: "simple" })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  inputs.tariffMode === "simple"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Simple Flat Rate
              </button>
              <button
                type="button"
                onClick={() => updateInputs({ tariffMode: "tariff_slab" })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  inputs.tariffMode === "tariff_slab"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                State Tariff Slabs (Incremental)
              </button>
            </div>
          </div>

          {inputs.tariffMode === "simple" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Electricity Price (₹ per unit / kWh)
                </Label>
                <div className="flex">
                  <span className="h-12 px-4 bg-muted border border-r-0 border-input rounded-l-md text-base font-bold text-foreground flex items-center">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="1"
                    max="25"
                    step="0.25"
                    value={inputs.simpleRatePerUnitINR}
                    onChange={(e) => updateInputs({ simpleRatePerUnitINR: parseFloat(e.target.value) || 0 })}
                    className="h-12 text-base font-bold rounded-l-none"
                  />
                </div>

                {/* Quick Indian Tariff Rate Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mr-1">
                    Typical:
                  </span>
                  {[6.5, 7.5, 8.0, 9.5, 11.0].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateInputs({ simpleRatePerUnitINR: r })}
                      className={`text-xs px-2.5 py-0.5 rounded-md border font-mono font-semibold transition-colors cursor-pointer ${
                        inputs.simpleRatePerUnitINR === r
                          ? "bg-amber-500 text-white border-amber-600 font-bold"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                      }`}
                    >
                      ₹{r.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs text-muted-foreground flex items-center leading-relaxed">
                <div>
                  <strong>Indian Electricity Rates:</strong> Average residential electricity tariffs in India range between <strong>₹6.50 and ₹9.50 per unit</strong>. You can check your exact per-unit charge on your latest electricity bill.
                </div>
              </div>
            </div>
          ) : (
            /* TARIFF SLAB MODE */
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Select State / Electricity DISCOM</Label>
                  <select
                    value={inputs.selectedDiscomId}
                    onChange={(e) => updateInputs({ selectedDiscomId: e.target.value })}
                    className="h-12 w-full px-3.5 bg-background border border-input rounded-md text-xs sm:text-sm font-semibold text-foreground cursor-pointer focus:outline-none"
                  >
                    {INDIAN_DISCOM_PROFILES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.state} — {p.discomName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      Base Household Units (Without AC)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Fans, fridge, lights</span>
                  </div>
                  <div className="flex">
                    <Input
                      type="number"
                      min="0"
                      step="10"
                      value={inputs.existingMonthlyHouseholdUnits}
                      onChange={(e) =>
                        updateInputs({ existingMonthlyHouseholdUnits: parseFloat(e.target.value) || 0 })
                      }
                      className="h-12 text-base font-bold rounded-r-none"
                    />
                    <span className="h-12 px-3.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground flex items-center">
                      units / mo
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Why Marginal Slabs Matter:</strong> Your basic household appliances already consume {inputs.existingMonthlyHouseholdUnits} units, filling the cheaper lower slabs. Adding an AC pushes consumption into higher tariff brackets (often ₹7 to ₹11+ per unit).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* PRIMARY ACTION BUTTON                                     */}
        {/* ========================================================= */}
        <div>
          <Button
            type="button"
            onClick={handleCalculateClick}
            className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995]"
          >
            <Zap className="w-5 h-5 mr-2" />
            Calculate AC Running Cost & Units
          </Button>
        </div>

        {/* ========================================================= */}
        {/* RESULTS DASHBOARD                                         */}
        {/* ========================================================= */}
        <div ref={resultsRef} className="space-y-6 pt-2">
          {hasResult ? (
            <>
              {isOutdated && (
                <OutdatedResultBanner onCalculate={handleCalculateClick} />
              )}
              {/* RESULT 1: HERO CARD - MONTHLY AC COST */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/40 shadow-xl space-y-5 text-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                Estimated AC Electricity Running Cost
              </span>
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight">
                  {formatINR(result.monthlyCostINR)}
                </span>
                <span className="text-lg sm:text-2xl font-semibold text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                Based on {result.effectivePowerKW} kW power, {inputs.dailyUsageHours} hours daily, {inputs.operatingDaysPerMonth} operating days, and ₹{result.effectiveCostPerUnitINR.toFixed(2)} per unit.
              </p>
            </div>

            {/* SUPPORTING METRICS (DAILY COST & YEARLY COST) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-4 border-t border-border/60 max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-left">
                <span className="text-xs text-muted-foreground block font-medium">Daily Running Cost</span>
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  {formatINR(result.dailyCostINR)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">Per day of usage</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-left">
                <span className="text-xs text-amber-700 dark:text-amber-300 block font-semibold">Annual AC Cost</span>
                <span className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {formatINR(result.annualCostINR)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  Across {inputs.operatingMonthsPerYear} months/year
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS: COPY & PDF */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="h-9 px-4 gap-2 text-xs sm:text-sm font-medium border-border/70 hover:bg-muted"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? "Estimate Copied!" : "Copy Summary"}</span>
              </Button>

              <CalculatorPdfExport
                fileName="calczen-ac-electricity-cost-estimate"
                buttonLabel="Save as PDF"
                calculatorName="AC Electricity Consumption & Cost Estimate"
              />
            </div>
          </div>

          {/* RESULT 2: ELECTRICITY UNITS CONSUMPTION */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Electricity Units (kWh) Consumption
            </h3>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Daily Units
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.dailyUnits.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[11px] text-muted-foreground">units per day</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Monthly Units
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {Math.round(result.monthlyUnits)} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[11px] text-muted-foreground">units per month</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                  Annual Units
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {Math.round(result.annualUnits)} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                </div>
                <div className="text-[11px] text-muted-foreground">units per year</div>
              </div>
            </div>
          </div>

          {/* RESULT 3: HOUSEHOLD BILL IMPACT (ONLY IF TARIFF SLAB MODE) */}
          {result.isTariffModeActive && (
            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    Household Electricity Bill Impact
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tariff slabs for {result.discomProfileName}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                  Telescopic Slabs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-1">
                  <span className="text-xs text-muted-foreground block font-medium">Estimated Bill Without AC</span>
                  <div className="text-2xl font-bold text-foreground">
                    {formatINR(result.householdBaseBillINR)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    For {result.householdBaseUnits} baseline units
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-1">
                  <span className="text-xs text-muted-foreground block font-medium">Estimated Bill With AC</span>
                  <div className="text-2xl font-bold text-foreground">
                    {formatINR(result.householdWithAcBillINR)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    For {Math.round(result.householdWithAcUnits)} total units
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-1">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">Extra AC Bill Increase</span>
                  <div className="text-2xl font-extrabold text-foreground">
                    +{formatINR(result.incrementalMonthlyAcCostINR)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Effective marginal rate: <strong>₹{result.effectiveMarginalRateINR.toFixed(2)}/unit</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RESULT 4: USAGE HOURS SENSITIVITY & POTENTIAL SAVINGS */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Running Hours Comparison & Potential Savings
                </h3>
                <p className="text-xs text-muted-foreground">
                  See how your monthly bill changes with different daily running hours
                </p>
              </div>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>

            {/* Savings Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  <TrendingDown className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 Hour Less Daily = Save {formatINR(result.savings1HourPerDayMonthlyINR)} / mo</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Reducing AC usage by just 1 hour every day saves approximately{" "}
                  <strong>{formatINR(result.savings1HourPerDayMonthlyINR * 12)} per year</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 text-sm">
                  <ThermometerSnowflake className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Set 24°C Thermostat = Save ~{formatINR(result.thermostatOptimizationSavingsMonthlyINR)} / mo</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  BEE recommends setting AC at <strong>24°C</strong>. Every 1°C increase saves ~6% compressor power.
                </p>
              </div>
            </div>

            {/* Scenarios Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="py-2.5 px-3">Daily Hours</th>
                    <th className="py-2.5 px-3">Daily Units</th>
                    <th className="py-2.5 px-3">Monthly Units</th>
                    <th className="py-2.5 px-3">Daily Cost</th>
                    <th className="py-2.5 px-3 text-right">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {result.scenarios.map((sc) => {
                    const isCurrent = sc.hoursPerDay === inputs.dailyUsageHours;
                    return (
                      <tr
                        key={sc.hoursPerDay}
                        onClick={() => updateInputs({ dailyUsageHours: sc.hoursPerDay })}
                        className={`cursor-pointer transition-colors ${
                          isCurrent
                            ? "bg-amber-500/15 font-bold"
                            : "hover:bg-muted/30 font-medium"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-foreground font-sans flex items-center gap-1.5">
                          <span>{sc.hoursPerDay} hrs / day</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-bold">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">{sc.dailyUnits.toFixed(1)} kWh</td>
                        <td className="py-2.5 px-3">{sc.monthlyUnits} kWh</td>
                        <td className="py-2.5 px-3">{formatINR(sc.dailyCostINR)}</td>
                        <td className="py-2.5 px-3 text-right text-foreground font-bold">
                          {formatINR(sc.monthlyCostINR)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RESULT 5: COMPARE TWO ACs (EXPANDABLE) */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm">
            <button
              type="button"
              onClick={() => setShowCompareTool(!showCompareTool)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    Compare Two AC Models (Old vs New 5-Star)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Calculate monthly and 5-year savings between different star ratings or ACs
                  </p>
                </div>
              </div>
              {showCompareTool ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showCompareTool && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Model A */}
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                    <span className="text-xs font-bold text-foreground block">Model A (Current AC)</span>
                    <Input
                      type="text"
                      value={compareModelA.name}
                      onChange={(e) => setCompareModelA((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Old 3-Star Non-Inverter"
                      className="h-9 text-xs"
                    />
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Power Consumption (Watts)</Label>
                      <Input
                        type="number"
                        value={compareModelA.watts}
                        onChange={(e) => setCompareModelA((prev) => ({ ...prev, watts: parseFloat(e.target.value) || 0 }))}
                        className="h-9 mt-1 text-xs font-semibold"
                      />
                    </div>
                    <div className="text-xs pt-1 text-muted-foreground">
                      Monthly Cost: <strong>{formatINR(comparisonResult.acAMonthlyCostINR)}</strong>
                    </div>
                  </div>

                  {/* Model B */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <span className="text-xs font-bold text-foreground block">Model B (New AC to Compare)</span>
                    <Input
                      type="text"
                      value={compareModelB.name}
                      onChange={(e) => setCompareModelB((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. New 5-Star Inverter"
                      className="h-9 text-xs"
                    />
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Power Consumption (Watts)</Label>
                      <Input
                        type="number"
                        value={compareModelB.watts}
                        onChange={(e) => setCompareModelB((prev) => ({ ...prev, watts: parseFloat(e.target.value) || 0 }))}
                        className="h-9 mt-1 text-xs font-semibold"
                      />
                    </div>
                    <div className="text-xs pt-1 text-foreground">
                      Monthly Cost: <strong>{formatINR(comparisonResult.acBMonthlyCostINR)}</strong>
                    </div>
                  </div>
                </div>

                {/* Comparison Result Banner */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      {comparisonResult.cheaperModelName} saves {comparisonResult.percentageSavings}% on electricity
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Difference: <strong>{formatINR(Math.abs(comparisonResult.monthlyCostDifferenceINR))} / month</strong> (
                      {formatINR(Math.abs(comparisonResult.annualCostDifferenceINR))} / year)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">5-Year Cumulative Savings:</span>
                    <span className="text-lg font-extrabold text-foreground font-mono">
                      {formatINR(Math.abs(comparisonResult.fiveYearCostDifferenceINR))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RESULT 6: HOW WE CALCULATED IT (COLLAPSIBLE) */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm">
            <button
              type="button"
              onClick={() => setShowHowCalculated(!showHowCalculated)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    How did we calculate your AC electricity cost?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step mathematical breakdown with your exact inputs substituted
                  </p>
                </div>
              </div>
              {showHowCalculated ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showHowCalculated && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">
                {result.calculationSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-1 font-sans">
                    <strong className="text-foreground text-sm block">{step.title}</strong>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    <div className="p-2.5 mt-1 rounded-lg bg-background border border-border/60 font-mono text-xs space-y-0.5">
                      <div className="text-muted-foreground">Formula: {step.formula}</div>
                      <div className="text-muted-foreground">Substitution: {step.substitution}</div>
                      <div className="text-amber-600 dark:text-amber-400 font-bold">Result = {step.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </>
          ) : (
            <EmptyResultPlaceholder
              message="Ready to calculate AC running cost"
              subMessage="Select your AC specs, daily usage, and electricity rate, then press Calculate AC Running Cost & Units."
             />
          )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
