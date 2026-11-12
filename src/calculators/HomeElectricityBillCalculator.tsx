import { useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  HelpCircle,
  Lightbulb,
  Plus,
  Trash2,
  Building,
  Layers,
  ArrowRight,
  Calculator,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import {
  BillingInputMode,
  DiscomTariffProfile,
  HomeBillInput,
  TariffCalculationMode,
  TariffSlab,
  VERIFIED_DISCOM_PROFILES,
  calculateHomeElectricityBill,
  calculateMonthComparison,
  formatINR,
  formatUnits,
  validateHomeBillInput,
  APPLIANCE_PRESETS,
  createItemFromPreset,
  ApplianceItem,
  AppliancePreset,
} from "@/utils/homeElectricityBillUtils";

export function HomeElectricityBillCalculator() {
  const calc = getCalculator("home-electricity-bill-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mode: "monthly_units" (Method A - Recommended) or "appliances" (Method B)
  const [billingMode, setBillingMode] = useState<BillingInputMode>("monthly_units");

  // Method A Inputs
  const [monthlyUnitsInput, setMonthlyUnitsInput] = useState<number>(250);
  const [flatRateINR, setFlatRateINR] = useState<number>(8.0);
  const [fixedChargesINR, setFixedChargesINR] = useState<number>(50.0);
  const [additionalChargesINR, setAdditionalChargesINR] = useState<number>(0.0);

  // Method B Appliances State
  const [appliancesList, setAppliancesList] = useState<ApplianceItem[]>([
    (() => {
      const fan = createItemFromPreset(
        APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular")!,
      );
      fan.quantity = 2;
      fan.dailyHours = 8;
      return fan;
    })(),
    (() => {
      const bulb = createItemFromPreset(
        APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w")!,
      );
      bulb.quantity = 5;
      bulb.dailyHours = 6;
      return bulb;
    })(),
    (() => {
      const fridge = createItemFromPreset(
        APPLIANCE_PRESETS.find((p) => p.id === "refrigerator_frost_free")!,
      );
      fridge.annualKwh = 250;
      return fridge;
    })(),
  ]);

  // Tariff Configuration
  const [tariffMode, setTariffMode] = useState<TariffCalculationMode>("flat");
  const [selectedDiscomId, setSelectedDiscomId] = useState<string>("gujarat_gerc_rgp");

  // UI Accordions
  const [showAdvancedTariff, setShowAdvancedTariff] = useState<boolean>(false);
  const [showOptionalCharges, setShowOptionalCharges] = useState<boolean>(false);
  const [showComparisonTool, setShowComparisonTool] = useState<boolean>(false);
  const [showHowCalculated, setShowHowCalculated] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Month-over-Month Comparison Tool State
  const [prevMonthUnits, setPrevMonthUnits] = useState<number>(200);
  const [prevMonthBillINR, setPrevMonthBillINR] = useState<number>(1600);

  // Master Bill Input Object
  const currentBillInput: HomeBillInput = useMemo(() => {
    return {
      mode: billingMode,
      monthlyUnits: monthlyUnitsInput,
      appliances: appliancesList,
      tariffMode,
      flatRatePerUnitINR: flatRateINR,
      selectedDiscomId,
      fixedChargesINR,
      additionalChargesINR,
    };
  }, [
    billingMode,
    monthlyUnitsInput,
    appliancesList,
    tariffMode,
    flatRateINR,
    selectedDiscomId,
    fixedChargesINR,
    additionalChargesINR,
  ]);

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(currentBillInput);
  const activeBillInput = calculatedInputs || currentBillInput;

  // Calculation Result
  const calculationResult = useMemo(() => {
    const val = validateHomeBillInput(activeBillInput);
    if (!val.isValid) {
      return null;
    }
    return calculateHomeElectricityBill(activeBillInput);
  }, [activeBillInput]);

  // Month Comparison Result
  const comparisonResult = useMemo(() => {
    if (!calculationResult) return null;
    return calculateMonthComparison({
      prevUnits: prevMonthUnits,
      currUnits: calculationResult.totalMonthlyUnits,
      prevBillINR: prevMonthBillINR,
      currBillINR: calculationResult.totalMonthlyBillINR,
    });
  }, [prevMonthUnits, prevMonthBillINR, calculationResult]);

  // Handle Calculate Action
  const handleCalculate = () => {
    const val = validateHomeBillInput(currentBillInput);
    if (!val.isValid) {
      setValidationError(val.error || "Please verify your entered values.");
      return;
    }
    setValidationError(null);
    markCalculated();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Reset Functionality
  const handleReset = () => {
    setBillingMode("monthly_units");
    setMonthlyUnitsInput(250);
    setFlatRateINR(8.0);
    setFixedChargesINR(50.0);
    setAdditionalChargesINR(0.0);
    setTariffMode("flat");
    setSelectedDiscomId("gujarat_gerc_rgp");
    setAppliancesList([
      createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular")!),
      createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w")!),
    ]);
    setShowAdvancedTariff(false);
    setShowOptionalCharges(false);
    setShowComparisonTool(false);
    setShowHowCalculated(false);
    setValidationError(null);
    resetCalculated();
  };

  // Copy Summary to Clipboard
  const handleCopy = () => {
    if (!calculationResult) return;
    const text =
      `CalcZen Home Electricity Bill Estimate:\n` +
      `Estimated Monthly Bill: ${formatINR(calculationResult.totalMonthlyBillINR)}\n` +
      `Monthly Consumption: ${formatUnits(calculationResult.totalMonthlyUnits)} units (kWh)\n` +
      `Daily Average: ${formatUnits(calculationResult.dailyAverageUnits)} units/day (${formatINR(calculationResult.dailyEstimatedBillINR)}/day)\n` +
      `Energy Charges: ${formatINR(calculationResult.energyChargesINR)}\n` +
      `Fixed Charges: ${formatINR(calculationResult.fixedChargesINR)}\n` +
      `Additional Charges / Taxes: ${formatINR(calculationResult.additionalChargesINR)}\n` +
      `Yearly Estimated Bill: ${formatINR(calculationResult.yearlyEstimatedBillINR)}\n` +
      `Calculated via CalcZen.in`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Appliance List Helpers
  const handleAddAppliance = (presetId: string) => {
    const preset = APPLIANCE_PRESETS.find((p) => p.id === presetId) || APPLIANCE_PRESETS[0];
    setAppliancesList((prev) => [...prev, createItemFromPreset(preset)]);
  };

  const handleRemoveAppliance = (id: string) => {
    setAppliancesList((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateAppliance = (id: string, updates: Partial<ApplianceItem>) => {
    setAppliancesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  const selectedDiscomProfile = useMemo(() => {
    return (
      VERIFIED_DISCOM_PROFILES.find((p) => p.id === selectedDiscomId) ||
      VERIFIED_DISCOM_PROFILES[0]
    );
  }, [selectedDiscomId]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate your household electricity bill, calculate monthly units, and find out how much your appliances cost to run."
      formula={`Energy Charges = Monthly Units (kWh) × Electricity Rate (₹/kWh)\nTotal Electricity Bill = Energy Charges + Fixed Charges + Applicable Taxes & Surcharges\nFor slab tariffs: Each block of units is billed at its progressive slab rate.`}
      example={`For 250 monthly units at ₹5/unit with ₹50 fixed charges and ₹100 other charges:\nEnergy Charges = 250 × ₹5 = ₹1,250\nEstimated Monthly Bill = ₹1,250 + ₹50 + ₹100 = ₹1,400\nDaily Consumption = 250 ÷ 30 = 8.33 units/day`}
      faqs={HOME_BILL_FAQS}
      blog={<CalculatorBlog content={HOME_BILL_BLOG} />}
    >
      <div className="space-y-6">
        {/* Top Method Choice: Monthly Units vs Appliances */}
        <div className="bg-card border border-border/80 p-2 sm:p-2.5 rounded-2xl shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setBillingMode("monthly_units");
                setValidationError(null);
              }}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                billingMode === "monthly_units"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>I know my monthly units</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary-foreground/15 text-primary-foreground shrink-0 hidden md:inline">
                Recommended
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBillingMode("appliances");
                setValidationError(null);
              }}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                billingMode === "appliances"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Calculate using my appliances</span>
            </button>
          </div>
        </div>

        {/* ─── METHOD A: I KNOW MY MONTHLY UNITS ─── */}
        {billingMode === "monthly_units" && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  How many units did you use?
                </h2>
                <p className="text-xs text-muted-foreground">
                  You can find your monthly units (kWh) printed on your latest electricity bill
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                title="Reset inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Monthly Electricity Units (kWh)</span>
                  <span className="text-[11px] font-normal text-muted-foreground">e.g. 250 units</span>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={monthlyUnitsInput}
                    onChange={(e) =>
                      setMonthlyUnitsInput(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="text-base font-bold pl-3 pr-16 h-11"
                  />
                  <span className="absolute right-3 top-3 text-xs font-semibold text-muted-foreground">
                    units (kWh)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Electricity Price per Unit</span>
                  <span className="text-[11px] font-normal text-muted-foreground">₹/kWh</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-bold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.25"
                    value={flatRateINR}
                    onChange={(e) => setFlatRateINR(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="text-base font-bold pl-7 pr-16 h-11"
                  />
                  <span className="absolute right-3 top-3 text-xs font-semibold text-muted-foreground">
                    / unit
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Average domestic tariff in India is typically ₹6.50 – ₹9.50/unit
                </p>
              </div>
            </div>

            {/* Optional Charges Accordion */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowOptionalCharges(!showOptionalCharges)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-accent" />
                <span>Add Fixed Charges & Taxes (Optional)</span>
                {showOptionalCharges ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                )}
              </button>

              {showOptionalCharges && (
                <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Monthly Fixed Charge (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="5"
                        value={fixedChargesINR}
                        onChange={(e) =>
                          setFixedChargesINR(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="pl-7 text-sm font-semibold h-9"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Fixed meter charge billed regardless of consumption (e.g. ₹35 – ₹115)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Other Charges & Taxes (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="5"
                        value={additionalChargesINR}
                        onChange={(e) =>
                          setAdditionalChargesINR(Math.max(0, parseFloat(e.target.value) || 0))
                        }
                        className="pl-7 text-sm font-semibold h-9"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      FPPPA fuel surcharges, municipal taxes, electricity duty, etc.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Tariff Selection (Phase 5) */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowAdvancedTariff(!showAdvancedTariff)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-primary" />
                <span>Use My State DISCOM's Slab Tariff (Advanced)</span>
                {showAdvancedTariff ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-1" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                )}
              </button>

              {showAdvancedTariff && (
                <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Select Electricity Provider / Tariff Schedule
                    </Label>
                    <select
                      value={tariffMode === "discom" ? selectedDiscomId : "flat"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "flat") {
                          setTariffMode("flat");
                        } else {
                          setTariffMode("discom");
                          setSelectedDiscomId(val);
                          const prof = VERIFIED_DISCOM_PROFILES.find((p) => p.id === val);
                          if (prof) {
                            setFixedChargesINR(prof.fixedMonthlyChargesINR);
                          }
                        }
                      }}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="flat">Simple Flat Rate (₹{flatRateINR.toFixed(2)}/unit)</option>
                      {VERIFIED_DISCOM_PROFILES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.state} — {p.discomName} ({p.categoryName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {tariffMode === "discom" && (
                    <div className="p-3 bg-card border border-border/60 rounded-lg text-xs space-y-1.5">
                      <div className="font-semibold text-foreground flex items-center justify-between">
                        <span>{selectedDiscomProfile.discomName}</span>
                        <span className="text-[11px] text-primary font-mono">
                          Effective: {selectedDiscomProfile.effectiveDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Source: {selectedDiscomProfile.officialSource}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        {selectedDiscomProfile.slabs.map((s, idx) => (
                          <div key={idx} className="p-1.5 rounded bg-muted/40 text-center">
                            <span className="text-muted-foreground block">
                              {s.maxUnits ? `${s.minUnits}–${s.maxUnits} u` : `>${s.minUnits} u`}
                            </span>
                            <span className="font-bold text-foreground">₹{s.ratePerUnitINR}/unit</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full py-3 font-bold text-sm shadow-sm"
            >
              Calculate Electricity Bill
            </Button>
          </div>
        )}

        {/* ─── METHOD B: CALCULATE USING MY HOME APPLIANCES ─── */}
        {billingMode === "appliances" && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Select Your Household Appliances
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add appliances and specify daily hours to estimate your monthly units automatically
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Rate (₹/unit):</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={flatRateINR}
                  onChange={(e) => setFlatRateINR(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 h-8 text-xs font-bold text-center"
                />
              </div>
            </div>

            {/* Quick Add Presets Bar */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground">Quick Add Appliance:</span>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("ceiling_fan_regular")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Fan (75W)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("led_bulb_9w")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> LED Bulb (9W)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("refrigerator_frost_free")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Refrigerator (BEE)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("smart_tv_medium")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Smart TV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("air_conditioner_1_5_ton")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 1.5T AC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("storage_geyser")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Geyser (2kW)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAppliance("washing_machine_front")}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Washing Machine
                </Button>
              </div>
            </div>

            {/* Appliance List Items */}
            <div className="space-y-3">
              {appliancesList.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-muted/20 border border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-card border border-border/80 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{app.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {app.method === "method_a_power_hours" &&
                          `${app.powerWatts}W × ${app.dailyHours} hrs/day × ${app.daysPerMonth} days`}
                        {app.method === "method_b_cycle" &&
                          `${app.kwhPerCycle} kWh/cycle × ${app.cyclesPerWeek} cycles/week`}
                        {app.method === "method_c_annual_label" &&
                          `${app.annualKwh} kWh/year (Certified BEE Label)`}
                        {app.method === "method_d_standby" &&
                          `${app.activeWatts}W active (${app.activeHours}h) + ${app.standbyWatts}W standby (${app.standbyHours}h)`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground font-medium">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={app.quantity}
                        onChange={(e) =>
                          handleUpdateAppliance(app.id, {
                            quantity: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-12 bg-background border border-input rounded px-1.5 py-0.5 text-center text-xs font-bold text-foreground"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAppliance(app.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                      title="Remove appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full py-3 font-bold text-sm shadow-sm"
            >
              Calculate Total Bill
            </Button>
          </div>
        )}

        {validationError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ─── STEP 4: PROMINENT RESULTS DASHBOARD ─── */}
        {hasResult && calculationResult ? (
          <>
            {isOutdated && (
              <OutdatedResultBanner onCalculate={handleCalculate} />
            )}
            <div
              ref={resultsRef}
              className="bg-card border border-border/80 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6"
            >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Monthly Bill Estimate
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                  Your Estimated Electricity Charges
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Summary
                    </>
                  )}
                </Button>
                <CalculatorPdfExport
                  title="Home Electricity Bill Estimate"
                  filename="home-electricity-bill.pdf"
                  tables={[
                    {
                      title: "Monthly Bill Breakdown",
                      headers: ["Component", "Value", "Notes"],
                      rows: [
                        ["Monthly Consumption", `${formatUnits(calculationResult.totalMonthlyUnits)} units`, "Kilowatt-hours (kWh)"],
                        ["Energy Charges", formatINR(calculationResult.energyChargesINR), "Base unit consumption cost"],
                        ["Fixed Charges", formatINR(calculationResult.fixedChargesINR), "Monthly connection fee"],
                        ["Other Charges / Taxes", formatINR(calculationResult.additionalChargesINR), "Duties, surcharges & cess"],
                        ["Estimated Total Bill", formatINR(calculationResult.totalMonthlyBillINR), "Monthly bill total"],
                      ],
                    },
                  ]}
                />
              </div>
            </div>

            {/* Hero Card: Prominent Monthly Electricity Bill */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Your Estimated Monthly Electricity Bill
                </p>
                <div className="text-3xl sm:text-5xl font-black text-primary tracking-tight">
                  {formatINR(calculationResult.totalMonthlyBillINR)}
                  <span className="text-sm sm:text-lg font-normal text-muted-foreground ml-2">
                    / month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes {formatINR(calculationResult.energyChargesINR)} energy charges for{" "}
                  <strong>{formatUnits(calculationResult.totalMonthlyUnits)} units</strong>
                  {calculationResult.fixedChargesINR > 0 &&
                    ` + ${formatINR(calculationResult.fixedChargesINR)} fixed charges`}
                  {calculationResult.additionalChargesINR > 0 &&
                    ` + ${formatINR(calculationResult.additionalChargesINR)} taxes/surcharges`}
                  .
                </p>
              </div>

              <div className="shrink-0 bg-background/80 backdrop-blur-xs border border-border/80 px-5 py-3.5 rounded-xl text-center min-w-[150px]">
                <div className="text-xs text-muted-foreground font-medium">Monthly Units</div>
                <div className="text-3xl font-black text-foreground mt-0.5">
                  {formatUnits(calculationResult.totalMonthlyUnits)}
                </div>
                <div className="text-[11px] text-primary font-semibold">kWh (Units)</div>
              </div>
            </div>

            {/* Metric Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                <span className="text-muted-foreground font-medium">Daily Average</span>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {formatUnits(calculationResult.dailyAverageUnits)} units
                </div>
                <span className="text-[11px] text-muted-foreground">
                  ~{formatINR(calculationResult.dailyEstimatedBillINR)}/day
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                <span className="text-muted-foreground font-medium">Energy Charges</span>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(calculationResult.energyChargesINR)}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {calculationResult.effectiveRatePerUnitINR > 0
                    ? `avg ₹${calculationResult.effectiveRatePerUnitINR.toFixed(2)}/u`
                    : "Base charges"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                <span className="text-muted-foreground font-medium">Fixed Charges</span>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(calculationResult.fixedChargesINR)}
                </div>
                <span className="text-[11px] text-muted-foreground">Monthly standing fee</span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
                <span className="text-muted-foreground font-medium">Yearly Projected</span>
                <div className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(calculationResult.yearlyEstimatedBillINR)}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatUnits(calculationResult.yearlyEstimatedUnits)} units/year
                </span>
              </div>
            </div>

            {/* Slab Calculation Breakdown Table (if progressive slabs used) */}
            {calculationResult.slabBreakdown && calculationResult.slabBreakdown.length > 0 && (
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Telescopic Slab Breakdown</span>
                  <span className="text-[11px] font-normal text-primary">
                    Total Energy: {formatINR(calculationResult.energyChargesINR)}
                  </span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground">
                        <th className="pb-1.5 font-semibold">Consumption Slab</th>
                        <th className="pb-1.5 font-semibold text-center">Billed Units</th>
                        <th className="pb-1.5 font-semibold text-center">Slab Rate</th>
                        <th className="pb-1.5 font-semibold text-right">Charge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {calculationResult.slabBreakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="py-2 font-medium text-foreground">{item.slabLabel}</td>
                          <td className="py-2 text-center">{formatUnits(item.unitsInSlab)} u</td>
                          <td className="py-2 text-center font-mono">₹{item.ratePerUnit.toFixed(2)}</td>
                          <td className="py-2 text-right font-bold text-foreground">
                            {formatINR(item.costINR)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Appliance-Wise Breakdown (if appliance mode used) */}
            {billingMode === "appliances" &&
              calculationResult.applianceBreakdown &&
              calculationResult.applianceBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Appliance Consumption Breakdown
                  </h4>
                  <div className="space-y-2">
                    {calculationResult.applianceBreakdown.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-foreground">
                            {item.quantity > 1 ? `${item.quantity}× ` : ""}
                            {item.name}
                          </span>
                          <span className="text-muted-foreground font-mono">
                            {formatUnits(item.monthlyUnits)} units ({formatINR(item.monthlyCostINR)} • {item.percentageOfBill.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(2, item.percentageOfBill)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Usage Insights Box */}
            {billingMode === "appliances" && calculationResult.highestConsumingAppliance && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Appliance Insight:</span>{" "}
                  <span>
                    Your <strong>{calculationResult.highestConsumingAppliance.name}</strong> accounts for{" "}
                    <strong>{calculationResult.highestConsumingAppliance.percentage.toFixed(1)}%</strong> of your total electricity usage (~{formatINR(calculationResult.highestConsumingAppliance.monthlyCostINR)}/month). Reducing its operating time by just 1 hour each day can noticeably cut your bill.
                  </span>
                </div>
              </div>
            )}

            {/* Plain Language Explanation Accordion */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowHowCalculated(!showHowCalculated)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-accent" />
                <span>How did we calculate your bill?</span>
                {showHowCalculated ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showHowCalculated && (
                <div className="mt-3 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <p>{calculationResult.explanation}</p>
                  <p className="text-[11px] pt-1 border-t border-border/40 font-mono text-foreground/80">
                    Energy Charges = Units × Rate. Total Bill = Energy Charges + Fixed Charges + Additional Charges.
                  </p>
                </div>
              )}
            </div>
          </div>

        {/* ─── OPTIONAL FEATURE: MONTH-OVER-MONTH BILL COMPARISON (PHASE 8) ─── */}
        <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs space-y-4">
          <button
            type="button"
            onClick={() => setShowComparisonTool(!showComparisonTool)}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-foreground"
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span>Compare with Last Month's Bill (Optional)</span>
            </div>
            {showComparisonTool ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showComparisonTool && (
            <div className="pt-3 border-t border-border/60 space-y-4">
              <p className="text-xs text-muted-foreground">
                Enter your previous month's meter units and bill amount to analyze changes in consumption:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Previous Month's Units (kWh)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={prevMonthUnits}
                    onChange={(e) =>
                      setPrevMonthUnits(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="text-sm font-semibold h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Previous Month's Bill (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={prevMonthBillINR}
                    onChange={(e) =>
                      setPrevMonthBillINR(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="text-sm font-semibold h-9"
                  />
                </div>
              </div>

              {comparisonResult && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Consumption Change:</span>
                    <strong
                      className={`text-sm ${
                        comparisonResult.unitsDifference > 0
                          ? "text-destructive"
                          : comparisonResult.unitsDifference < 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                      }`}
                    >
                      {comparisonResult.unitsDifference > 0 ? "+" : ""}
                      {formatUnits(comparisonResult.unitsDifference)} units (
                      {comparisonResult.unitsPercentChange > 0 ? "+" : ""}
                      {comparisonResult.unitsPercentChange.toFixed(1)}%)
                    </strong>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Bill Amount Change:</span>
                    <strong
                      className={`text-sm ${
                        (comparisonResult.billDifferenceINR || 0) > 0
                          ? "text-destructive"
                          : (comparisonResult.billDifferenceINR || 0) < 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                      }`}
                    >
                      {(comparisonResult.billDifferenceINR || 0) > 0 ? "+" : ""}
                      {formatINR(comparisonResult.billDifferenceINR || 0)} (
                      {(comparisonResult.billPercentChange || 0) > 0 ? "+" : ""}
                      {(comparisonResult.billPercentChange || 0).toFixed(1)}%)
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    ) : (
      <EmptyResultPlaceholder
        onCalculate={handleCalculate}
        category="electricity"
      />
    )}
      </div>
    </CalculatorPageLayout>
  );
}

// Educational FAQs
const HOME_BILL_FAQS = [
  {
    q: "How do I calculate my home electricity bill?",
    a: "Your home electricity bill is calculated by multiplying your total monthly units (kWh) by your electricity rate per unit, then adding monthly fixed meter charges and government electricity duties/taxes. If your provider uses slab tariffs, each block of units is billed at its respective slab rate.",
  },
  {
    q: "What is one unit of electricity?",
    a: "In India, 1 unit of electricity equals 1 Kilowatt-hour (1 kWh). This represents drawing 1,000 Watts of electrical power continuously for 1 hour. For example, running a 1,000W iron for 1 hour uses exactly 1 electricity unit.",
  },
  {
    q: "How many units does a normal home use per month?",
    a: "In India, an average 1BHK or 2BHK apartment with basic appliances (fans, LED lights, TV, and refrigerator) consumes about 120 to 220 units per month. Adding a 1.5-ton AC running 8 hours a day adds approximately 240 to 360 units per month.",
  },
  {
    q: "How do I calculate electricity charges from units?",
    a: "For flat-rate billing: Energy Charges = Units × Rate per Unit. For example, 250 units at ₹5/unit equals ₹1,250. For telescopic slab billing: units are broken into tiers (e.g. first 100 units at ₹3, next 100 units at ₹5, remaining 50 units at ₹8 = ₹300 + ₹500 + ₹400 = ₹1,200).",
  },
  {
    q: "Why is my electricity bill higher than expected?",
    a: "Common reasons include: (1) Heavy summer AC usage pushing your consumption into higher, non-subsidized tariff slabs; (2) Inefficient appliances such as old induction fans or direct-cool fridges with worn gaskets; (3) Standby vampire power from set-top boxes and microwave clocks; (4) Seasonal fuel price adjustments (FPPPA/FPPAS) and electricity duty.",
  },
  {
    q: "What are fixed charges in an electricity bill?",
    a: "Fixed charges (or standing charges) are fees billed every month regardless of how much electricity you consume. They cover the DISCOM's costs of maintaining the grid infrastructure, poles, transformers, and meter testing.",
  },
  {
    q: "What is a slab-based electricity tariff?",
    a: "A slab tariff divides your consumption into tiers. Lower units (e.g. 0–100) are billed at lower, subsidized rates to help lower-income households. As your consumption rises into higher tiers (e.g. >200 units), the per-unit rate increases progressively.",
  },
  {
    q: "Does the electricity bill include taxes and surcharges?",
    a: "Yes. In addition to base energy charges and fixed charges, state electricity bills include Electricity Duty (typically 5% to 16% depending on your state) and fuel price adjustments (FPPPA or PPAC) to reflect fuel generation costs.",
  },
  {
    q: "How can I calculate electricity consumption using appliances?",
    a: "Multiply each appliance's rated wattage by the hours it runs each day, divide by 1,000 to find daily kWh, multiply by 30 days, and add all appliances together. Our 'Calculate using my appliances' tab automates this entire process with preloaded Indian presets.",
  },
  {
    q: "Is the calculator's estimated bill exactly the same as my DISCOM bill?",
    a: "Our calculator gives a transparent, technically accurate estimate of your energy charges and standard fixed fees. Actual DISCOM bills may have minor variations based on exact billing cycle meter-reading dates (28 to 32 days), arrears, delayed payment surcharges, or power factor penalties.",
  },
];

// Educational Blog Content
const HOME_BILL_BLOG: BlogContent = {
  primaryKeyword: "home electricity bill calculator",
  category: "Electricity",
  introText:
    "Understand how your residential electricity bill is calculated in India, how telescopic slab tariffs work, and how to identify high-consumption appliances to reduce your monthly expenses.",
  sections: [
    {
      title: "1. Understanding the Components of an Indian Electricity Bill",
      paragraphs: [
        "A residential electricity bill in India consists of multiple components beyond simple unit multiplication:",
        "1. Energy Charges: The cost of the actual electrical energy consumed in Kilowatt-hours (kWh). In many states, this is billed across progressive slabs.",
        "2. Fixed / Demand Charges: A monthly standing charge based on your sanctioned load (kW) to cover grid infrastructure maintenance.",
        "3. Fuel & Power Purchase Price Adjustment (FPPPA / FPPAS): A periodic surcharge reflecting fluctuating coal and natural gas prices incurred by power stations.",
        "4. Electricity Duty: A state government tax (typically 5% to 16%) levied on your energy charges.",
      ],
      callout: {
        type: "quickFact",
        title: "Bill Calculation Formula",
        text: "Total Bill = Energy Charges (Slabs) + Fixed Charges + FPPPA Surcharge + Electricity Duty.",
      },
    },
    {
      title: "2. How Progressive Telescopic Tariff Slabs Work",
      paragraphs: [
        "Most state electricity regulatory commissions (such as GERC in Gujarat, MERC in Maharashtra, and DERC in Delhi) employ telescopic progressive slabs to promote energy conservation.",
        "For example, under a 3-tier tariff (0–100 units @ ₹3, 101–200 units @ ₹5, and >200 units @ ₹8), consuming 250 units does NOT mean all 250 units are charged at ₹8. Instead:",
        "• First 100 units are charged at ₹3 = ₹300",
        "• Next 100 units are charged at ₹5 = ₹500",
        "• Remaining 50 units are charged at ₹8 = ₹400",
        "Total Energy Charge = ₹300 + ₹500 + ₹400 = ₹1,200.",
      ],
    },
    {
      title: "3. Top 5 Contributors to High Household Electricity Bills",
      paragraphs: [
        "1. Room Air Conditioners: A 1.5-ton AC draws 1,000W to 1,500W of electrical power. Running it for 8 hours daily adds 240 to 360 units per month, often pushing the household into the highest tariff slab.",
        "2. Electric Storage Geysers: A 2,000W geyser consumes 2 full electricity units for every single hour of heating.",
        "3. Old Induction Ceiling Fans: A house with 4 standard induction fans running 12 hours a day consumes ~108 units each month. Upgrading to 5-Star BLDC fans saves over 60 units monthly.",
        "4. Frost-Free Refrigerators with Damaged Gaskets: Air leakage forces compressors to run continuously.",
        "5. Vampire Standby Draw: DTH boxes, TVs, and microwave clocks draw 10W to 25W of phantom power 24 hours a day.",
      ],
    },
  ],
  internalLinks: [
    {
      text: "Calculate running costs for specific appliances with our",
      calculatorName: "Appliance Electricity Cost Calculator",
      href: "/calculator/appliance-electricity-cost-calculator",
    },
    {
      text: "Evaluate AC tonnage, inverter savings, and room cooling with our",
      calculatorName: "AC Electricity Cost Calculator",
      href: "/calculator/ac-electricity-cost-calculator",
    },
  ],
};

