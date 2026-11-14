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
  Tv,
  Wind,
  Flame,
  Laptop,
  Layers,
  Search,
} from "lucide-react";
import {
  ApplianceItem,
  AppliancePreset,
  APPLIANCE_PRESETS,
  CalculationMethod,
  calculateApplianceItem,
  calculateMultiAppliance,
  createItemFromPreset,
  formatINR,
  formatUnits,
  validateApplianceItem,
} from "@/utils/applianceElectricityUtils";

export function ApplianceElectricityCostCalculator() {
  const calc = getCalculator("appliance-electricity-cost-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mode: "single" for 1-appliance fast calculation, "multi" for combined household bill
  const [activeMode, setActiveMode] = useState<"single" | "multi">("single");

  // Electricity Tariff Rate (Shared across calculations)
  const [ratePerKWh, setRatePerKWh] = useState<number>(8.0);

  // Selected Preset for Single Mode
  const [selectedPresetId, setSelectedPresetId] = useState<string>("ceiling_fan_regular");
  const [applianceSearch, setApplianceSearch] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Single Appliance Item State
  const initialSingleItem = useMemo(() => {
    const preset =
      APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular") || APPLIANCE_PRESETS[0];
    return createItemFromPreset(preset);
  }, []);
  const [singleItem, setSingleItem] = useState<ApplianceItem>(initialSingleItem);

  // Multi-Appliance List State
  const [multiItems, setMultiItems] = useState<ApplianceItem[]>([
    createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular")!),
    createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w")!),
  ]);

  // UI State toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showHowCalculated, setShowHowCalculated] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (preset: AppliancePreset) => {
    setSelectedPresetId(preset.id);
    const newItem = createItemFromPreset(preset);
    setSingleItem(newItem);
    setValidationError(null);
    setIsSearchOpen(false);
    setApplianceSearch("");
  };

  // Filtered Presets for Search
  const filteredPresets = useMemo(() => {
    if (!applianceSearch.trim()) return APPLIANCE_PRESETS;
    const query = applianceSearch.toLowerCase();
    return APPLIANCE_PRESETS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.typicalRangeDescription.toLowerCase().includes(query),
    );
  }, [applianceSearch]);

  // Current selected preset object
  const currentPreset = useMemo(() => {
    return APPLIANCE_PRESETS.find((p) => p.id === selectedPresetId) || APPLIANCE_PRESETS[0];
  }, [selectedPresetId]);

  const currentInputs = useMemo(
    () => ({
      activeMode,
      ratePerKWh,
      singleItem,
      multiItems,
    }),
    [activeMode, ratePerKWh, singleItem, multiItems],
  );

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(currentInputs);
  const activeInputs = calculatedInputs || currentInputs;

  // Single Calculation Result
  const singleResult = useMemo(() => {
    const val = validateApplianceItem(activeInputs.singleItem, activeInputs.ratePerKWh);
    if (!val.isValid) {
      return null;
    }
    return calculateApplianceItem(activeInputs.singleItem, activeInputs.ratePerKWh);
  }, [activeInputs.singleItem, activeInputs.ratePerKWh]);

  // Multi Calculation Result
  const multiResult = useMemo(() => {
    if (activeInputs.multiItems.length === 0) return null;
    return calculateMultiAppliance(activeInputs.multiItems, activeInputs.ratePerKWh);
  }, [activeInputs.multiItems, activeInputs.ratePerKWh]);

  // Calculate Action Click
  const handleCalculate = () => {
    if (activeMode === "single") {
      const val = validateApplianceItem(singleItem, ratePerKWh);
      if (!val.isValid) {
        setValidationError(val.error || "Please check your inputs.");
        return;
      }
    } else {
      if (multiItems.length === 0) {
        setValidationError("Please add at least one appliance.");
        return;
      }
    }
    setValidationError(null);
    markCalculated();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Reset Functionality
  const handleReset = () => {
    const defPreset =
      APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular") || APPLIANCE_PRESETS[0];
    setSelectedPresetId(defPreset.id);
    setSingleItem(createItemFromPreset(defPreset));
    setRatePerKWh(8.0);
    setMultiItems([
      createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular")!),
      createItemFromPreset(APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w")!),
    ]);
    setShowAdvanced(false);
    setShowHowCalculated(false);
    setValidationError(null);
    resetCalculated();
  };

  // Copy Summary to Clipboard
  const handleCopy = () => {
    let text = "";
    if (activeMode === "single" && singleResult) {
      text =
        `CalcZen Appliance Electricity Estimate:\n` +
        `Appliance: ${singleItem.name} (Qty: ${singleItem.quantity})\n` +
        `Estimated Monthly Cost: ${formatINR(singleResult.monthlyCost)}\n` +
        `Daily Cost: ${formatINR(singleResult.dailyCost)} (${formatUnits(singleResult.dailyKwh)} units/day)\n` +
        `Monthly Units: ${formatUnits(singleResult.monthlyKwh)} kWh\n` +
        `Yearly Cost: ${formatINR(singleResult.yearlyCost)} (${formatUnits(singleResult.yearlyKwh)} kWh/yr)\n` +
        `Electricity Rate: ₹${ratePerKWh.toFixed(2)}/kWh\n` +
        `Calculated via CalcZen.in`;
    } else if (activeMode === "multi" && multiResult) {
      text =
        `CalcZen Household Appliance Electricity Estimate:\n` +
        `Total Appliances: ${multiItems.length}\n` +
        `Total Monthly Cost: ${formatINR(multiResult.totalMonthlyCost)}\n` +
        `Total Monthly Units: ${formatUnits(multiResult.totalMonthlyKwh)} kWh\n` +
        `Total Daily Cost: ${formatINR(multiResult.totalDailyCost)}\n` +
        `Total Yearly Cost: ${formatINR(multiResult.totalYearlyCost)}\n` +
        `Electricity Rate: ₹${ratePerKWh.toFixed(2)}/kWh\n` +
        `Calculated via CalcZen.in`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Add Item to Multi-Appliance List
  const handleAddMultiAppliance = (preset: AppliancePreset) => {
    setMultiItems((prev) => [...prev, createItemFromPreset(preset)]);
  };

  const handleRemoveMultiAppliance = (id: string) => {
    setMultiItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateMultiItem = (id: string, updates: Partial<ApplianceItem>) => {
    setMultiItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  // Helper icon for preset categories
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "cooling":
        return <Wind className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case "lighting":
        return <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case "kitchen":
        return <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />;
      case "entertainment":
        return <Tv className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
      case "work":
        return <Laptop className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Find out how much electricity your appliances use and how much they add to your electricity bill."
      formula={`Daily Energy (kWh) = [Power (Watts) / 1,000] × Operating Hours × Quantity\nMonthly Energy = Daily Energy × Days Used Per Month\nYearly Energy = Daily Energy × 365\nRunning Cost = Energy (kWh) × Electricity Rate (₹/kWh)`}
      example={`For a 75W ceiling fan running 8 hours/day for 30 days at ₹8/unit (quantity: 2):\nDaily Energy = (75W / 1,000) × 8 hrs × 2 = 1.2 kWh (units)\nMonthly Energy = 1.2 kWh × 30 days = 36 kWh\nYearly Energy = 1.2 kWh × 365 days = 438 kWh\nMonthly Cost = 36 kWh × ₹8 = ₹288/month\nYearly Cost = 438 kWh × ₹8 = ₹3,504/year`}
      faqs={APPLIANCE_FAQS}
      blog={<CalculatorBlog content={APPLIANCE_CALCULATOR_BLOG} />}
    >
      <div className="space-y-6">
        {/* Navigation & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border/70 p-1.5 sm:p-2 rounded-xl shadow-xs">
          <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setActiveMode("single");
                setValidationError(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeMode === "single"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Zap className="w-4 h-4" />
              Single Appliance
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode("multi");
                setValidationError(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeMode === "multi"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              Combined Bill ({multiItems.length})
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 px-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground border-border/80"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>

        {/* ─── SINGLE APPLIANCE MODE ─── */}
        {activeMode === "single" && (
          <div className="space-y-6">
            {/* Step 1: Appliance Selection Card */}
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Which appliance do you want to calculate?
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Choose from common Indian household presets or enter custom specs
                    </p>
                  </div>
                </div>
              </div>

              {/* Searchable Appliance Selector */}
              <div className="relative">
                <div
                  className="flex items-center justify-between bg-background border border-input rounded-lg p-2.5 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-muted/60 flex items-center justify-center">
                      {getCategoryIcon(currentPreset.category)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{singleItem.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {currentPreset.typicalRangeDescription}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isSearchOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isSearchOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl p-3 max-h-96 overflow-y-auto space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search fan, TV, fridge, geyser, bulb..."
                        value={applianceSearch}
                        onChange={(e) => setApplianceSearch(e.target.value)}
                        className="pl-9 text-sm h-10"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1 pt-1">
                      {filteredPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm transition-colors ${
                            selectedPresetId === preset.id
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getCategoryIcon(preset.category)}
                            <div>
                              <div>{preset.name}</div>
                              <div className="text-xs text-muted-foreground font-normal">
                                {preset.typicalRangeDescription}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted/60 text-muted-foreground shrink-0 ml-2">
                            {preset.categoryLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Informative Tip Box if available */}
              {currentPreset.tip && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="leading-relaxed">{currentPreset.tip}</p>
                </div>
              )}
            </div>

            {/* Step 2: Appliance Specifications & Usage Card */}
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Usage & Power Details
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pre-filled with typical values — adjust to match your actual model
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={singleItem.quantity}
                    onChange={(e) =>
                      setSingleItem({
                        ...singleItem,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-12 bg-background border border-input rounded px-1.5 py-0.5 text-center text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* METHOD A: Power in Watts + Hours Used */}
              {singleItem.method === "method_a_power_hours" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Power Rating (Watts)
                      <span className="text-muted-foreground font-normal">(W)</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={singleItem.powerWatts}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          powerWatts: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Look at the specification sticker on the appliance
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Daily Usage (Hours/day)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.25"
                      value={singleItem.dailyHours}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          dailyHours: Math.max(0, Math.min(24, parseFloat(e.target.value) || 0)),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      E.g. 8 hrs for fans, 0.5 hrs for kettles
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Days Used per Month
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={singleItem.daysPerMonth}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          daysPerMonth: Math.max(1, Math.min(31, parseInt(e.target.value) || 30)),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">Standard 30 days/month</p>
                  </div>
                </div>
              )}

              {/* METHOD B: Energy per Cycle (Washing machine, Dishwasher) */}
              {singleItem.method === "method_b_cycle" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Energy Consumption per Cycle (kWh)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.05"
                      value={singleItem.kwhPerCycle}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          kwhPerCycle: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Typical wash cycle uses 0.5 – 1.2 units (kWh)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Cycles Run per Week
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={singleItem.cyclesPerWeek}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          cyclesPerWeek: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      E.g. 5 washes/week = ~21.7 washes/month
                    </p>
                  </div>
                </div>
              )}

              {/* METHOD C: Annual Energy Consumption from Label (Refrigerator) */}
              {singleItem.method === "method_c_annual_label" && (
                <div className="space-y-4">
                  <div className="max-w-md space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Annual Electricity Consumption (kWh / year)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={singleItem.annualKwh}
                      onChange={(e) =>
                        setSingleItem({
                          ...singleItem,
                          annualKwh: Math.max(0, parseFloat(e.target.value) || 0),
                        })
                      }
                      className="text-sm font-semibold"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Shown prominently on the official yellow BEE Star Rating sticker
                    </p>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
                    💡 <strong>Why Annual kWh?</strong> Refrigerator compressors cycle on and off
                    throughout the day and night based on internal cooling demand. Multiplying rated
                    watts by 24 hours creates massive inaccuracy. The BEE star label's certified
                    annual kWh is the standardized, engineering-tested metric.
                  </div>
                </div>
              )}

              {/* METHOD D: Running and Standby Power (TV, PC, Console, Set-top box) */}
              {singleItem.method === "method_d_standby" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Active */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-3">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Active Watching / Use
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Active Power (Watts)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={singleItem.activeWatts}
                          onChange={(e) =>
                            setSingleItem({
                              ...singleItem,
                              activeWatts: Math.max(0, parseFloat(e.target.value) || 0),
                            })
                          }
                          className="text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Active Hours / Day
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={singleItem.activeHours}
                          onChange={(e) => {
                            const act = Math.max(0, Math.min(24, parseFloat(e.target.value) || 0));
                            setSingleItem({
                              ...singleItem,
                              activeHours: act,
                              standbyHours: Math.min(singleItem.standbyHours, 24 - act),
                            });
                          }}
                          className="text-sm font-semibold"
                        />
                      </div>
                    </div>

                    {/* Standby */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-3">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Idle / Standby Sleep
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Standby Power (Watts)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={singleItem.standbyWatts}
                          onChange={(e) =>
                            setSingleItem({
                              ...singleItem,
                              standbyWatts: Math.max(0, parseFloat(e.target.value) || 0),
                            })
                          }
                          className="text-sm font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Standby Hours / Day
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max={24 - singleItem.activeHours}
                          step="0.5"
                          value={singleItem.standbyHours}
                          onChange={(e) =>
                            setSingleItem({
                              ...singleItem,
                              standbyHours: Math.max(
                                0,
                                Math.min(
                                  24 - singleItem.activeHours,
                                  parseFloat(e.target.value) || 0,
                                ),
                              ),
                            })
                          }
                          className="text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Total hours: {singleItem.activeHours + singleItem.standbyHours} / 24 hrs. (Active
                    hours + Standby hours must not exceed 24).
                  </p>
                </div>
              )}

              {/* Advanced Settings Accordion */}
              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-accent" />
                  <span>Advanced Options (Duty Cycle & Method Switch)</span>
                  {showAdvanced ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-1" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 rounded-xl bg-muted/20 border border-border/50 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Change Calculation Method</Label>
                        <select
                          value={singleItem.method}
                          onChange={(e) =>
                            setSingleItem({
                              ...singleItem,
                              method: e.target.value as CalculationMethod,
                            })
                          }
                          className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="method_a_power_hours">
                            Method A: Rated Watts & Operating Hours
                          </option>
                          <option value="method_b_cycle">
                            Method B: Energy per Complete Cycle (kWh)
                          </option>
                          <option value="method_c_annual_label">
                            Method C: Certified Annual kWh (BEE Label)
                          </option>
                          <option value="method_d_standby">
                            Method D: Active + Standby Vampire Power
                          </option>
                        </select>
                      </div>

                      {singleItem.method === "method_a_power_hours" && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold flex items-center justify-between">
                            <span>Estimated Duty Cycle / Active %</span>
                            <span className="text-primary font-bold">
                              {singleItem.dutyCyclePct ?? 100}%
                            </span>
                          </Label>
                          <Input
                            type="number"
                            min="10"
                            max="100"
                            value={singleItem.dutyCyclePct ?? 100}
                            onChange={(e) =>
                              setSingleItem({
                                ...singleItem,
                                dutyCyclePct: Math.max(
                                  1,
                                  Math.min(100, parseInt(e.target.value) || 100),
                                ),
                              })
                            }
                            className="text-xs font-semibold"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            100% = draws rated power continuously. Thermostats (heaters/irons) often
                            cycle at 60–80%.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Electricity Tariff & Action */}
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-sm">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                      ₹
                    </span>
                    Electricity Price per Unit (₹/kWh)
                  </Label>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Check your latest electricity bill for your actual per-unit rate (typically
                    ₹6.50 – ₹9.50/unit in India).
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-36">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="0.5"
                      step="0.25"
                      value={ratePerKWh}
                      onChange={(e) => setRatePerKWh(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="pl-7 text-sm font-bold text-foreground"
                    />
                  </div>
                  <Button
                    onClick={handleCalculate}
                    className="w-full sm:w-auto px-6 py-2.5 font-bold shadow-sm"
                  >
                    Calculate Cost
                  </Button>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
                  {validationError}
                </div>
              )}
            </div>

            {/* Step 4: Prominent Results Dashboard */}
            {hasResult && singleResult ? (
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
                      <Sparkles className="w-3.5 h-3.5" /> Calculation Output
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                      {singleItem.quantity > 1 ? `${singleItem.quantity} × ` : ""}
                      {singleItem.name}
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
                      title={`${singleItem.name} Electricity Cost Estimate`}
                      filename="appliance-electricity-cost.pdf"
                      tables={[
                        {
                          title: "Appliance Consumption Summary",
                          headers: ["Metric", "Electricity Consumption", "Estimated Cost"],
                          rows: [
                            [
                              "Daily Running",
                              `${formatUnits(singleResult.dailyKwh)} units`,
                              formatINR(singleResult.dailyCost),
                            ],
                            [
                              "Monthly Running",
                              `${formatUnits(singleResult.monthlyKwh)} units`,
                              formatINR(singleResult.monthlyCost),
                            ],
                            [
                              "Yearly Running",
                              `${formatUnits(singleResult.yearlyKwh)} units`,
                              formatINR(singleResult.yearlyCost),
                            ],
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Hero Metric: Monthly Cost */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Estimated Monthly Electricity Cost
                    </p>
                    <div className="text-3xl sm:text-5xl font-black text-primary tracking-tight">
                      {formatINR(singleResult.monthlyCost)}
                      <span className="text-sm sm:text-lg font-normal text-muted-foreground ml-2">
                        / month
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {formatUnits(singleResult.monthlyKwh)} units (kWh) consumed per month
                      at ₹{ratePerKWh.toFixed(2)}/unit.
                    </p>
                  </div>

                  <div className="shrink-0 bg-background/80 backdrop-blur-xs border border-border/80 px-4 py-3 rounded-xl text-center min-w-[140px]">
                    <div className="text-xs text-muted-foreground font-medium">Monthly Units</div>
                    <div className="text-2xl font-extrabold text-foreground mt-0.5">
                      {formatUnits(singleResult.monthlyKwh)}
                    </div>
                    <div className="text-[11px] text-primary font-semibold">kWh (Units)</div>
                  </div>
                </div>

                {/* 3-Column Metrics Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Daily */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" /> Daily Cost & Units
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {formatINR(singleResult.dailyCost)}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {formatUnits(singleResult.dailyKwh)} units / day
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Monthly Cost & Units
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {formatINR(singleResult.monthlyCost)}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {formatUnits(singleResult.monthlyKwh)} units / month
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> Yearly Cost & Units
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {formatINR(singleResult.yearlyCost)}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {formatUnits(singleResult.yearlyKwh)} units / year
                    </div>
                  </div>
                </div>

                {/* Method D Standby Breakdown Card */}
                {singleItem.method === "method_d_standby" &&
                  singleResult.standbyDailyKwh !== undefined && (
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
                        <span>Active vs Standby Consumption Share</span>
                        <span>
                          Standby Waste: {singleResult.standbyCostPercentage?.toFixed(1)}% of total
                          bill
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden flex">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{ width: `${100 - (singleResult.standbyCostPercentage || 0)}%` }}
                          title="Active usage"
                        />
                        <div
                          className="bg-amber-500 h-full transition-all"
                          style={{ width: `${singleResult.standbyCostPercentage || 0}%` }}
                          title="Standby phantom draw"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-muted-foreground font-medium">Active Use:</span>{" "}
                          <strong className="text-foreground">
                            {formatINR(singleResult.monthlyActiveCost || 0)}
                          </strong>
                          /mo
                        </div>
                        <div>
                          <span className="text-muted-foreground font-medium">Standby Draw:</span>{" "}
                          <strong className="text-amber-600 dark:text-amber-400">
                            {formatINR(singleResult.monthlyStandbyCost || 0)}
                          </strong>
                          /mo
                        </div>
                      </div>
                    </div>
                  )}

                {/* Method B Cycle Breakdown Card */}
                {singleItem.method === "method_b_cycle" &&
                  singleResult.costPerCycle !== undefined && (
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground font-medium">Cost per Wash Cycle</div>
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatINR(singleResult.costPerCycle)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground font-medium">
                          Average Monthly Cycles
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {singleResult.monthlyCycles?.toFixed(1)} cycles
                        </div>
                      </div>
                    </div>
                  )}

                {/* Step-by-Step Explanation Accordion */}
                <div className="pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setShowHowCalculated(!showHowCalculated)}
                    className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-accent" />
                    <span>How did we calculate this?</span>
                    {showHowCalculated ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {showHowCalculated && (
                    <div className="mt-3 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2 leading-relaxed">
                      <p>{singleResult.formulaExplanation}</p>
                      <div className="text-[11px] pt-1 border-t border-border/40 font-mono text-foreground/80">
                        1 electricity unit = 1 kWh = (Watts × Operating Hours) ÷ 1,000. Total Cost =
                        Units × Electricity Rate.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <EmptyResultPlaceholder />
          )}
          </div>
        )}

        {/* ─── MULTI-APPLIANCE HOUSEHOLD MODE ─── */}
        {activeMode === "multi" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Combined Household Bill Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Add multiple appliances to model your entire home's monthly electricity
                    consumption
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Rate (₹/kWh):
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={ratePerKWh}
                    onChange={(e) => setRatePerKWh(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-24 h-8 text-xs font-bold text-center"
                  />
                </div>
              </div>

              {/* Multi Appliance Items List */}
              <div className="space-y-3">
                {multiItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/20 border border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-card border border-border/80 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.method === "method_a_power_hours" &&
                            `${item.powerWatts}W × ${item.dailyHours} hrs/day`}
                          {item.method === "method_b_cycle" &&
                            `${item.kwhPerCycle} kWh/cycle × ${item.cyclesPerWeek} cycles/wk`}
                          {item.method === "method_c_annual_label" &&
                            `${item.annualKwh} kWh/year (BEE Label)`}
                          {item.method === "method_d_standby" &&
                            `${item.activeWatts}W active (${item.activeHours}h) + ${item.standbyWatts}W standby (${item.standbyHours}h)`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-border/40">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground font-medium">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateMultiItem(item.id, {
                              quantity: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-12 bg-background border border-input rounded px-1.5 py-0.5 text-center text-xs font-bold text-foreground"
                        />
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="text-sm font-extrabold text-foreground">
                          {formatINR(calculateApplianceItem(item, ratePerKWh).monthlyCost)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatUnits(calculateApplianceItem(item, ratePerKWh).monthlyKwh)} units/mo
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMultiAppliance(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                        title="Remove appliance"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Appliance Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-semibold text-muted-foreground mr-1">
                  Quick Add Appliance:
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(
                      APPLIANCE_PRESETS.find((p) => p.id === "ceiling_fan_regular")!,
                    )
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Fan (75W)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(APPLIANCE_PRESETS.find((p) => p.id === "led_bulb_9w")!)
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> LED Bulb (9W)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(
                      APPLIANCE_PRESETS.find((p) => p.id === "smart_tv_medium")!,
                    )
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> TV (80W)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(
                      APPLIANCE_PRESETS.find((p) => p.id === "refrigerator_frost_free")!,
                    )
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Refrigerator
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(
                      APPLIANCE_PRESETS.find((p) => p.id === "washing_machine_front")!,
                    )
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Washing Machine
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddMultiAppliance(
                      APPLIANCE_PRESETS.find((p) => p.id === "storage_geyser")!,
                    )
                  }
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Geyser (2000W)
                </Button>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full py-3 font-bold text-sm shadow-sm"
              >
                Calculate Combined Cost
              </Button>
            </div>

            {/* Combined Multi-Appliance Results Dashboard */}
            {hasResult && multiResult ? (
              <>
                {isOutdated && (
                  <OutdatedResultBanner onCalculate={handleCalculate} />
                )}
                <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Combined Household Estimate
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                      Total Consumption across {multiItems.length} Appliances
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
                      title="Household Appliance Electricity Bill Estimate"
                      filename="household-electricity-cost.pdf"
                      tables={[
                        {
                          title: "Appliance-Wise Cost Breakdown",
                          headers: [
                            "Appliance",
                            "Quantity",
                            "Monthly Consumption",
                            "Monthly Cost",
                            "% Share",
                          ],
                          rows: multiResult.itemBreakdown.map((b) => [
                            b.name,
                            String(b.quantity),
                            `${formatUnits(b.monthlyKwh)} kWh`,
                            formatINR(b.monthlyCost),
                            `${b.percentOfTotalCost.toFixed(1)}%`,
                          ]),
                        },
                        {
                          title: "Overall Totals",
                          headers: ["Period", "Electricity Units", "Estimated Total Cost"],
                          rows: [
                            [
                              "Daily",
                              `${formatUnits(multiResult.totalDailyKwh)} units`,
                              formatINR(multiResult.totalDailyCost),
                            ],
                            [
                              "Monthly",
                              `${formatUnits(multiResult.totalMonthlyKwh)} units`,
                              formatINR(multiResult.totalMonthlyCost),
                            ],
                            [
                              "Yearly",
                              `${formatUnits(multiResult.totalYearlyKwh)} units`,
                              formatINR(multiResult.totalYearlyCost),
                            ],
                          ],
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Hero Total Card */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Combined Monthly Running Cost
                    </p>
                    <div className="text-3xl sm:text-5xl font-black text-primary tracking-tight">
                      {formatINR(multiResult.totalMonthlyCost)}
                      <span className="text-sm sm:text-lg font-normal text-muted-foreground ml-2">
                        / month
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total consumption: {formatUnits(multiResult.totalMonthlyKwh)} units per month @
                      ₹{ratePerKWh.toFixed(2)}/unit.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center min-w-[220px]">
                    <div className="p-3 rounded-lg bg-background/80 border border-border/80">
                      <div className="text-[11px] text-muted-foreground font-medium">Daily Cost</div>
                      <div className="text-lg font-bold text-foreground">
                        {formatINR(multiResult.totalDailyCost)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background/80 border border-border/80">
                      <div className="text-[11px] text-muted-foreground font-medium">
                        Yearly Cost
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {formatINR(multiResult.totalYearlyCost)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appliance-Wise Share Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Appliance Budget Breakdown (% of total monthly bill)
                  </h4>
                  <div className="space-y-2">
                    {multiResult.itemBreakdown.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-foreground">
                            {item.quantity > 1 ? `${item.quantity}× ` : ""}
                            {item.name}
                          </span>
                          <span className="text-muted-foreground font-mono">
                            {formatINR(item.monthlyCost)} ({item.percentOfTotalCost.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(2, item.percentOfTotalCost)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyResultPlaceholder />
          )}
          </div>
        )}
      </div>
    </CalculatorPageLayout>
  );
}

// Educational FAQs
const APPLIANCE_FAQS = [
  {
    q: "How do I calculate electricity consumption of an appliance?",
    a: "To calculate an appliance's electricity consumption, multiply its power rating in Watts by the hours it runs each day, then divide by 1,000 to get electricity units (kWh). For example, a 75W fan running for 8 hours uses (75 × 8) ÷ 1,000 = 0.6 units per day. Multiply by your local electricity rate per unit to find the running cost.",
  },
  {
    q: "What is one unit of electricity?",
    a: "In India and worldwide, 1 unit of electricity equals 1 Kilowatt-hour (1 kWh). It is the amount of electrical energy consumed by a 1,000-Watt appliance running continuously for 1 hour.",
  },
  {
    q: "How do I calculate the monthly electricity cost of a fan?",
    a: "A standard ceiling fan uses 75 Watts. If you run it for 8 hours daily, it uses (75 × 8) ÷ 1,000 = 0.6 units/day. For a 30-day month, that is 18 units. At ₹8 per unit, the monthly electricity cost is 18 × 8 = ₹144. Upgrading to a 30W 5-Star BLDC fan reduces this to just ₹57.60 per month.",
  },
  {
    q: "How much electricity does a refrigerator use?",
    a: "A standard 250-litre frost-free refrigerator in India consumes between 200 and 300 units (kWh) per year, which is about 17 to 25 units per month (~₹136 to ₹200/month at ₹8/unit). A smaller direct-cool single-door model typically uses only 130 to 180 units per year.",
  },
  {
    q: "How do I calculate electricity cost using watts?",
    a: "Convert watts to kilowatts by dividing by 1,000, then multiply by daily operating hours, monthly days, and your tariff rate: Cost (₹) = (Watts ÷ 1,000) × Hours/Day × Days/Month × Rate per kWh.",
  },
  {
    q: "Does standby mode consume electricity?",
    a: "Yes. Devices like smart televisions, set-top boxes, Wi-Fi routers, game consoles, and microwave clocks draw 'phantom' or 'vampire' standby power even when turned off by remote. In an average Indian home, standby power can quietly add ₹80 to ₹250 to each monthly bill.",
  },
  {
    q: "Is appliance power consumption the same as electricity units?",
    a: "No. Power consumption is the instantaneous rate of electricity draw measured in Watts (W) or Kilowatts (kW). Electricity units represent energy consumed over time, measured in Kilowatt-hours (kWh). A 1,000W appliance running for 1 hour consumes 1 unit.",
  },
  {
    q: "Where can I find my electricity price per unit?",
    a: "Check your most recent physical or digital DISCOM electricity bill. Look for 'Energy Charges' or 'Tariff Rate (₹/kWh)'. In most Indian states, residential domestic rates range between ₹6.50 and ₹9.50 per unit depending on consumption slabs.",
  },
  {
    q: "Can I calculate the cost of multiple appliances together?",
    a: "Yes! Switch to the 'Combined Bill' tab in our calculator to add fans, lights, refrigerator, television, and water geyser together. The calculator automatically combines their energy usage and gives you an item-by-item breakdown of your estimated total household bill.",
  },
  {
    q: "Are the calculator results exact?",
    a: "The calculations provide realistic, technically transparent estimates based on the wattage and usage you enter. Actual DISCOM bills also include fixed meter charges, municipal electricity duty, and fuel surcharges, which can vary by state and DISCOM.",
  },
];

// Educational Blog Content
const APPLIANCE_CALCULATOR_BLOG: BlogContent = {
  primaryKeyword: "appliance electricity cost calculator",
  category: "Electricity",
  introText:
    "Learn how household appliances consume electricity in India, how to calculate power draw in units (kWh) and rupees, and how to identify phantom standby power to cut your monthly DISCOM bill.",
  sections: [
    {
      title: "1. The Fundamental Rule: 1 kWh = 1 Electricity Unit",
      paragraphs: [
        "When your electricity distribution company (such as Tata Power, Adani Electricity, BESCOM, MSEDCL, or BSES) bills you for monthly consumption, they charge you per 'Unit'.",
        "In electrical engineering and Indian utility billing, 1 electricity unit is exactly equal to 1 Kilowatt-hour (1 kWh). One kilowatt equals 1,000 Watts, which means drawing 1,000 Watts of electrical power continuously for 1 hour consumes exactly 1 unit.",
        "For example, if you run a 1,000W electric iron or microwave for 1 hour, it consumes exactly 1.0 unit. At an average domestic tariff of ₹8 per unit, that single hour costs ₹8.00.",
      ],
      callout: {
        type: "quickFact",
        title: "Key Formula",
        text: "Units (kWh) = (Watts × Operating Hours) ÷ 1,000. Running Cost (₹) = Units × Rate per kWh.",
      },
    },
    {
      title: "2. Why Different Appliances Require Different Calculation Methods",
      paragraphs: [
        "A common mistake made by generic calculators is assuming every appliance draws rated power continuously. In real life, appliances function under very different electrical dynamics:",
        "• Continuous Fixed-Power Loads (Fans, Bulbs, Heaters, Pumps): These draw steady electrical wattage while switched on. A 75W ceiling fan running for 8 hours consumes (75 × 8) ÷ 1,000 = 0.6 units per day.",
        "• Cycle-Based Appliances (Washing Machines, Dishwashers): A washing machine motor agitates intermittently, and water heating only occurs during specific wash phases. Therefore, energy is accurately measured per complete wash cycle (typically 0.5 to 1.1 kWh/cycle).",
        "• Thermostat-Cycled Compressors (Refrigerators): Refrigerators run 24 hours a day, but the compressor cycles on and off. Multiplying compressor wattage by 24 hours produces three times the actual consumption. The certified annual kWh on the Bureau of Energy Efficiency (BEE) star label gives the standardized, lab-tested yearly consumption.",
        "• Active vs. Standby Devices (Smart TVs, Set-Top Boxes, Computers): Modern electronics stay plugged in and consume electricity even in sleep mode (listening for remote controls or Wi-Fi wakeups). Accounting for standby power is essential for accurate budgeting.",
      ],
      table: {
        headers: ["Appliance Type", "Typical Power / Energy", "Best Calculation Method"],
        rows: [
          ["Ceiling Fan (Induction)", "70W – 80W", "Method A: Power (Watts) & Operating Hours"],
          ["BLDC Ceiling Fan", "28W – 32W (Saves 60%)", "Method A: Power (Watts) & Operating Hours"],
          ["LED Bulb", "7W – 12W", "Method A: Power (Watts) & Operating Hours"],
          ["Refrigerator (Frost Free 250L)", "200 – 280 kWh / year", "Method C: Certified Annual kWh (BEE Label)"],
          ["Washing Machine", "0.5 – 1.1 kWh / cycle", "Method B: Energy per Complete Cycle"],
          ["Smart TV & Set-Top Box", "80W active, 1W–12W standby", "Method D: Active + Standby Running"],
          ["Storage Geyser (25L)", "2,000W – 3,000W", "Method A: Power (Watts) & Operating Hours"],
        ],
      },
    },
    {
      title: "3. Standby 'Vampire' Power: The Hidden Drain in Indian Homes",
      paragraphs: [
        "Many electronic devices in modern homes never truly turn off when switched off by remote control. They enter an idle standby mode known as phantom load or vampire power.",
        "Notable examples: older set-top boxes (DTH) often draw 12W to 18W in standby mode—nearly identical to when you are actively watching television. Running 18 hours in standby draws ~0.25 units daily (~₹60/month just for sitting idle).",
        "Simple habit: Turn off the physical wall switch for set-top boxes, entertainment consoles, and computer power strips before going to sleep.",
      ],
      callout: {
        type: "proTip",
        title: "Phantom Power Reduction",
        text: "Switching off televisions, DTH boxes, and microwave ovens at the main wall switch can save ₹100 to ₹250 every month without sacrificing convenience.",
      },
    },
    {
      title: "4. Practical Tips to Lower Your Household Electricity Bill",
      paragraphs: [
        "1. Upgrade to 5-Star BLDC ceiling fans: Replacing standard 75W induction fans with 30W BLDC models saves ~55 units per month across 3 fans (~₹440/month savings).",
        "2. Replace incandescent and CFL bulbs with 9W LEDs: LEDs consume 85% less electricity than incandescent bulbs and last 5 times longer.",
        "3. Set your AC thermostat to 24°C: Every 1°C increase saves ~6% on compressor electricity.",
        "4. Use cold or normal wash cycles in washing machines: Over 80% of a washing machine's electrical consumption goes toward heating water.",
        "5. Clean refrigerator condenser coils and air cooler pads: Dust buildup forces motors and compressors to work significantly harder, increasing power draw.",
      ],
    },
  ],
  internalLinks: [
    {
      text: "Calculate dedicated AC running costs and inverter savings with our",
      calculatorName: "AC Electricity Cost Calculator",
      href: "/calculator/ac-electricity-cost-calculator",
    },
    {
      text: "Perform quick ratio shifts and percentage calculations with our",
      calculatorName: "Percentage Calculator",
      href: "/calculator/percentage-calculator",
    },
  ],
};
