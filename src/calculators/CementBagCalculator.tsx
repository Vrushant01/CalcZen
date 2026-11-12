import { useMemo, useState, useRef } from "react";
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
  Building2,
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
  Boxes,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Hammer,
  Settings2,
  Info,
} from "lucide-react";
import {
  calculateCementBagEstimate,
  DEFAULT_CEMENT_INPUTS,
  formatINR,
  formatNumber,
  DRY_VOLUME_FACTORS,
  type CementCalculatorInputs,
  type ConstructionWorkType,
  type ConcreteElementItem,
  type DimensionUnit,
  type AreaUnit,
  type VolumeUnit,
} from "@/utils/cementCalculatorUtils";

type FriendlyWorkType = "concrete" | "plaster" | "flooring" | "brickwork" | "other";

const WORK_CATEGORIES: Array<{
  id: FriendlyWorkType;
  actualType: ConstructionWorkType;
  title: string;
  subtitle: string;
  icon: typeof Building2;
}> = [
  {
    id: "concrete",
    actualType: "concrete",
    title: "Concrete / RCC",
    subtitle: "Roof slabs, beams, pillars, footings",
    icon: Building2,
  },
  {
    id: "plaster",
    actualType: "plaster_wall",
    title: "Wall Plastering",
    subtitle: "Inside or outside walls & ceilings",
    icon: Layers,
  },
  {
    id: "flooring",
    actualType: "flooring_screed",
    title: "Floor Work",
    subtitle: "Tile bedding & floor screed",
    icon: Hammer,
  },
  {
    id: "brickwork",
    actualType: "brickwork",
    title: "Brickwork",
    subtitle: "Wall mortar & brick count",
    icon: Boxes,
  },
  {
    id: "other",
    actualType: "custom_volume",
    title: "Other Work",
    subtitle: "Direct volume in m³ or cu ft",
    icon: Settings2,
  },
];

export function CementBagCalculator() {
  const calc = getCalculator("cement-bag-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Core State
  const [inputs, setInputs] = useState<CementCalculatorInputs>(DEFAULT_CEMENT_INPUTS);
  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;
  const [friendlyType, setFriendlyType] = useState<FriendlyWorkType>("concrete");
  const [concreteMode, setConcreteMode] = useState<"dimensions" | "volume">("dimensions");
  const [isCopied, setIsCopied] = useState(false);

  // Accordion Toggles
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHowCalculated, setShowHowCalculated] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Concrete Mix Preset Selection
  const [concretePreset, setConcretePreset] = useState<"standard" | "strong" | "foundation" | "custom">("standard");

  // Calculate live results
  const result = useMemo(() => {
    return calculateCementBagEstimate(activeInputs);
  }, [activeInputs]);

  // Helpers to update inputs safely
  const updateInputs = (patch: Partial<CementCalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  // Switch Work Type
  const handleSelectWorkCategory = (catId: FriendlyWorkType) => {
    setFriendlyType(catId);
    let workType: ConstructionWorkType = "concrete";
    let newMix = { cement: 1, sand: 1.5, aggregate: 3 };
    let newDryFactor = DRY_VOLUME_FACTORS.concrete;

    if (catId === "concrete") {
      workType = "concrete";
      newMix = { cement: 1, sand: 1.5, aggregate: 3 };
      newDryFactor = DRY_VOLUME_FACTORS.concrete;
      setConcretePreset("standard");
    } else if (catId === "plaster") {
      workType = "plaster_wall";
      newMix = { cement: 1, sand: 6, aggregate: 0 };
      newDryFactor = DRY_VOLUME_FACTORS.mortar;
    } else if (catId === "flooring") {
      workType = "flooring_screed";
      newMix = { cement: 1, sand: 4, aggregate: 0 };
      newDryFactor = DRY_VOLUME_FACTORS.mortar;
    } else if (catId === "brickwork") {
      workType = "brickwork";
      newMix = { cement: 1, sand: 6, aggregate: 0 };
      newDryFactor = DRY_VOLUME_FACTORS.mortar;
    } else {
      workType = "custom_volume";
      newMix = { cement: 1, sand: 2, aggregate: 4 };
      newDryFactor = DRY_VOLUME_FACTORS.concrete;
    }

    setInputs((prev) => ({
      ...prev,
      workType,
      mixRatio: newMix,
      dryVolumeFactor: newDryFactor,
    }));
  };

  // Concrete Preset Selector
  const handleConcretePresetChange = (preset: "standard" | "strong" | "foundation" | "custom") => {
    setConcretePreset(preset);
    if (preset === "standard") {
      updateInputs({ mixRatio: { cement: 1, sand: 1.5, aggregate: 3 } });
    } else if (preset === "strong") {
      updateInputs({ mixRatio: { cement: 1, sand: 1, aggregate: 2 } });
    } else if (preset === "foundation") {
      updateInputs({ mixRatio: { cement: 1, sand: 2, aggregate: 4 } });
    }
  };

  // Quick Preset Samples
  const handleApplyPreset = (sample: "slab_1000" | "room_plaster" | "wall_brick" | "room_floor") => {
    if (sample === "slab_1000") {
      setFriendlyType("concrete");
      setConcreteMode("dimensions");
      setConcretePreset("standard");
      setInputs({
        ...DEFAULT_CEMENT_INPUTS,
        workType: "concrete",
        concreteEntryMethod: "dimensions",
        concreteElements: [
          {
            id: "slab-1",
            name: "Roof Slab",
            count: 1,
            length: 40,
            lengthUnit: "ft",
            width: 25,
            widthUnit: "ft",
            depth: 5,
            depthUnit: "in",
          },
        ],
        mixRatio: { cement: 1, sand: 1.5, aggregate: 3 },
        dryVolumeFactor: 1.54,
        wastagePercentage: 5,
      });
    } else if (sample === "room_plaster") {
      setFriendlyType("plaster");
      setInputs({
        ...DEFAULT_CEMENT_INPUTS,
        workType: "plaster_wall",
        plasterAreaInputMode: "area",
        plasterArea: 400, // 4 walls of 10x10
        plasterAreaUnit: "sqft",
        plasterThicknessMm: 12,
        mixRatio: { cement: 1, sand: 6, aggregate: 0 },
        dryVolumeFactor: 1.33,
        wastagePercentage: 5,
      });
    } else if (sample === "wall_brick") {
      setFriendlyType("brickwork");
      setInputs({
        ...DEFAULT_CEMENT_INPUTS,
        workType: "brickwork",
        brickworkMethod: "wall_dimensions",
        wallLength: 10,
        wallLengthUnit: "ft",
        wallHeight: 10,
        wallHeightUnit: "ft",
        wallThickness: 9,
        wallThicknessUnit: "in",
        wallCount: 1,
        mixRatio: { cement: 1, sand: 6, aggregate: 0 },
        dryVolumeFactor: 1.33,
        wastagePercentage: 5,
      });
    } else if (sample === "room_floor") {
      setFriendlyType("flooring");
      setInputs({
        ...DEFAULT_CEMENT_INPUTS,
        workType: "flooring_screed",
        flooringAreaInputMode: "area",
        flooringArea: 100,
        flooringAreaUnit: "sqft",
        screedThicknessMm: 40,
        mixRatio: { cement: 1, sand: 4, aggregate: 0 },
        dryVolumeFactor: 1.33,
        wastagePercentage: 5,
      });
    }

    markCalculated();
  };

  // Reset to default state
  const handleReset = () => {
    setInputs(DEFAULT_CEMENT_INPUTS);
    setFriendlyType("concrete");
    setConcreteMode("dimensions");
    setConcretePreset("standard");
    setShowAdvanced(false);
    setShowHowCalculated(false);
    setShowTechnicalDetails(false);
    resetCalculated();
  };

  // Primary Action: Calculate button click
  const handleCalculateClick = () => {
    markCalculated();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Copy Summary
  const handleCopySummary = () => {
    const text = [
      `CalcZen Cement Bag Estimate`,
      `---------------------------------`,
      `Work: ${WORK_CATEGORIES.find((c) => c.id === friendlyType)?.title}`,
      `Total Cement Bags Needed: ${result.wholeBagsToPurchase} bags (${result.cementBagMassKg} kg each)`,
      `Exact Requirement: ${result.totalCementBagsExact.toFixed(2)} bags (${result.totalCementMassKg.toFixed(1)} kg)`,
      `Sand Required: ${result.sandVolumeCft.toFixed(1)} cu ft (${result.sandBrass.toFixed(2)} Brass)`,
      result.aggregateVolumeM3 > 0
        ? `Stone Chips: ${result.aggregateVolumeCft.toFixed(1)} cu ft (${result.aggregateBrass.toFixed(2)} Brass)`
        : "",
      `Estimated Cement Cost: ${formatINR(result.costs.cementPurchaseCost)} (@ ₹${inputs.rates.cementPricePerBag}/bag)`,
      `Total Materials Cost: ${formatINR(result.costs.totalMaterialCost)}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Find out how many cement bags you need for your construction work. Enter a few simple details and get your estimate instantly."
      formula={`Dry Volume (m³) = Wet Volume × 1.54 (Concrete) or 1.33 (Mortar)\nCement Volume (m³) = Dry Volume × (Cement Part / Sum of Ratio Parts)\nCement Mass (kg) = Cement Volume × 1,440 kg/m³\nExact Bags = Cement Mass (kg) / 50 kg\nPurchase Bags = ⌈Exact Bags × (1 + Wastage %)⌉`}
      example={`For a 1,000 sq ft (40' × 25' × 5") roof slab in M20 concrete (1:1.5:3):\nConcrete Volume = 11.80 m³ (416.7 cu ft)\nDry Volume = 18.17 m³ (with 1.54 factor)\nCement Required = 4,757 kg\nPurchase Bags = 100 Bags (50 kg each)\nSand = 175 cu ft (1.75 Brass)\nStone Chips = 350 cu ft (3.50 Brass)`}
      faqs={CEMENT_BAG_BLOG_CONTENT.faqs!}
      blog={<CalculatorBlog content={CEMENT_BAG_BLOG_CONTENT} />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* TOP BAR: QUICK PRESET SAMPLES & ACTIONS                   */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/70 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Quick Examples:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset("slab_1000")}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              1,000 sq ft Roof Slab
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("room_plaster")}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              Room Plastering
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("wall_brick")}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              9-inch Brick Wall
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("room_floor")}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              Floor Screed
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs h-8 gap-1.5 border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN CALCULATOR CONTAINER (STEP-BY-STEP VERTICAL FLOW)    */}
        {/* ========================================================= */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* STEP 1: WHAT ARE YOU BUILDING? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base sm:text-lg font-bold text-foreground">
                Step 1: What are you building?
              </Label>
              <span className="text-xs text-muted-foreground font-medium">Select your construction work</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {WORK_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = friendlyType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectWorkCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-md font-semibold ring-2 ring-amber-400/30"
                        : "bg-muted/20 hover:bg-muted/50 border-border/60 text-foreground"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-white" : "text-amber-500"}`} />
                    <span className="text-sm font-semibold leading-tight">{cat.title}</span>
                    <span
                      className={`text-[11px] mt-1 line-clamp-1 ${
                        isSelected ? "text-amber-100" : "text-muted-foreground"
                      }`}
                    >
                      {cat.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: ENTER YOUR MEASUREMENTS */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label className="text-base sm:text-lg font-bold text-foreground">
                  Step 2: Enter your measurements
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {friendlyType === "concrete"
                    ? "Enter the length, width, and thickness of your concrete area."
                    : friendlyType === "plaster"
                    ? "Enter the surface area or dimensions of the walls to be plastered."
                    : friendlyType === "flooring"
                    ? "Enter the floor area and thickness of the bedding screed."
                    : friendlyType === "brickwork"
                    ? "Enter your wall dimensions to calculate mortar and brick requirement."
                    : "Enter your known volume directly."}
                </p>
              </div>

              {friendlyType === "concrete" && (
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/60 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setConcreteMode("dimensions");
                      updateInputs({ concreteEntryMethod: "dimensions" });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      concreteMode === "dimensions"
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Enter Dimensions
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConcreteMode("volume");
                      updateInputs({ concreteEntryMethod: "direct_volume" });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      concreteMode === "volume"
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    I already know the volume
                  </button>
                </div>
              )}
            </div>

            {/* DYNAMIC MEASUREMENT INPUTS */}
            {/* 1. CONCRETE: DIMENSIONS */}
            {friendlyType === "concrete" && concreteMode === "dimensions" && (
              <div className="space-y-3">
                {inputs.concreteElements.map((el, idx) => (
                  <div
                    key={el.id}
                    className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {inputs.concreteElements.length > 1 ? `Member ${idx + 1}: ${el.name}` : "Concrete Member Dimensions"}
                      </span>
                      {inputs.concreteElements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (inputs.concreteElements.length <= 1) return;
                            updateInputs({
                              concreteElements: inputs.concreteElements.filter((item) => item.id !== el.id),
                            });
                          }}
                          className="text-xs text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-foreground">Length</Label>
                        <div className="flex mt-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={el.length}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, length: parseFloat(e.target.value) || 0 } : item
                                ),
                              })
                            }
                            className="h-11 text-base rounded-r-none"
                          />
                          <select
                            value={el.lengthUnit}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, lengthUnit: e.target.value as DimensionUnit } : item
                                ),
                              })
                            }
                            className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs sm:text-sm font-medium text-foreground focus:outline-none"
                          >
                            <option value="ft">ft</option>
                            <option value="m">m</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-foreground">Width</Label>
                        <div className="flex mt-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={el.width}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, width: parseFloat(e.target.value) || 0 } : item
                                ),
                              })
                            }
                            className="h-11 text-base rounded-r-none"
                          />
                          <select
                            value={el.widthUnit}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, widthUnit: e.target.value as DimensionUnit } : item
                                ),
                              })
                            }
                            className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs sm:text-sm font-medium text-foreground focus:outline-none"
                          >
                            <option value="ft">ft</option>
                            <option value="m">m</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-foreground">Thickness / Depth</Label>
                        <div className="flex mt-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={el.depth}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, depth: parseFloat(e.target.value) || 0 } : item
                                ),
                              })
                            }
                            className="h-11 text-base rounded-r-none"
                          />
                          <select
                            value={el.depthUnit}
                            onChange={(e) =>
                              updateInputs({
                                concreteElements: inputs.concreteElements.map((item) =>
                                  item.id === el.id ? { ...item, depthUnit: e.target.value as DimensionUnit } : item
                                ),
                              })
                            }
                            className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs sm:text-sm font-medium text-foreground focus:outline-none"
                          >
                            <option value="in">inches (5" or 6")</option>
                            <option value="ft">ft</option>
                            <option value="mm">mm</option>
                            <option value="m">m</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs sm:text-sm font-semibold text-foreground">Quantity / Count</Label>
                        <Input
                          type="number"
                          min="1"
                          value={el.count}
                          onChange={(e) =>
                            updateInputs({
                              concreteElements: inputs.concreteElements.map((item) =>
                                item.id === el.id ? { ...item, count: parseInt(e.target.value) || 1 } : item
                              ),
                            })
                          }
                          className="h-11 mt-1.5 text-base"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newEl: ConcreteElementItem = {
                      id: `el-${Date.now()}`,
                      name: `Member #${inputs.concreteElements.length + 1}`,
                      count: 1,
                      length: 10,
                      lengthUnit: "ft",
                      width: 1,
                      widthUnit: "ft",
                      depth: 1,
                      depthUnit: "ft",
                    };
                    updateInputs({ concreteElements: [...inputs.concreteElements, newEl] });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline pt-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add another slab, beam, or pillar</span>
                </button>
              </div>
            )}

            {/* 2. CONCRETE: DIRECT VOLUME */}
            {friendlyType === "concrete" && concreteMode === "volume" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Total Concrete Volume</Label>
                  <div className="flex mt-1.5">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.directConcreteVolume}
                      onChange={(e) => updateInputs({ directConcreteVolume: parseFloat(e.target.value) || 0 })}
                      className="h-12 text-lg rounded-r-none"
                    />
                    <select
                      value={inputs.directConcreteVolumeUnit}
                      onChange={(e) => updateInputs({ directConcreteVolumeUnit: e.target.value as VolumeUnit })}
                      className="h-12 px-4 bg-muted border border-l-0 border-input rounded-r-md text-sm font-semibold text-foreground focus:outline-none"
                    >
                      <option value="m3">m³</option>
                      <option value="cft">cu ft</option>
                      <option value="litres">Litres</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground">
                  <span>
                    Tip: 1 cubic metre (m³) is equal to approximately <strong>35.31 cubic feet</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* 3. WALL PLASTERING */}
            {friendlyType === "plaster" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Total Plaster Area</Label>
                  <div className="flex mt-1.5">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={inputs.plasterArea}
                      onChange={(e) => updateInputs({ plasterArea: parseFloat(e.target.value) || 0 })}
                      className="h-12 text-lg rounded-r-none"
                    />
                    <select
                      value={inputs.plasterAreaUnit}
                      onChange={(e) => updateInputs({ plasterAreaUnit: e.target.value as AreaUnit })}
                      className="h-12 px-4 bg-muted border border-l-0 border-input rounded-r-md text-sm font-semibold text-foreground focus:outline-none"
                    >
                      <option value="sqft">sq ft</option>
                      <option value="sqm">m²</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Plaster Thickness</Label>
                  <select
                    value={inputs.plasterThicknessMm}
                    onChange={(e) => updateInputs({ plasterThicknessMm: parseInt(e.target.value) || 12 })}
                    className="h-12 mt-1.5 w-full px-3.5 bg-background border border-input rounded-md text-sm font-medium text-foreground focus:outline-none"
                  >
                    <option value="12">12 mm — Standard inside wall plaster</option>
                    <option value="15">15 mm — Rough uneven wall plaster</option>
                    <option value="20">20 mm — Outside wall weather plaster</option>
                    <option value="6">6 mm — Ceiling plaster</option>
                  </select>
                </div>
              </div>
            )}

            {/* 4. FLOOR WORK */}
            {friendlyType === "flooring" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Floor Area</Label>
                  <div className="flex mt-1.5">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={inputs.flooringArea}
                      onChange={(e) => updateInputs({ flooringArea: parseFloat(e.target.value) || 0 })}
                      className="h-12 text-lg rounded-r-none"
                    />
                    <select
                      value={inputs.flooringAreaUnit}
                      onChange={(e) => updateInputs({ flooringAreaUnit: e.target.value as AreaUnit })}
                      className="h-12 px-4 bg-muted border border-l-0 border-input rounded-r-md text-sm font-semibold text-foreground focus:outline-none"
                    >
                      <option value="sqft">sq ft</option>
                      <option value="sqm">m²</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Bedding Thickness</Label>
                  <select
                    value={inputs.screedThicknessMm}
                    onChange={(e) => updateInputs({ screedThicknessMm: parseInt(e.target.value) || 40 })}
                    className="h-12 mt-1.5 w-full px-3.5 bg-background border border-input rounded-md text-sm font-medium text-foreground focus:outline-none"
                  >
                    <option value="40">40 mm (~1.5 inch) — Standard tile bedding screed</option>
                    <option value="50">50 mm (~2 inch) — Heavy granite or marble slab bedding</option>
                    <option value="25">25 mm (~1 inch) — Thin adhesive leveling layer</option>
                  </select>
                </div>
              </div>
            )}

            {/* 5. BRICKWORK */}
            {friendlyType === "brickwork" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-foreground">Wall Length</Label>
                    <div className="flex mt-1.5">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={inputs.wallLength}
                        onChange={(e) => updateInputs({ wallLength: parseFloat(e.target.value) || 0 })}
                        className="h-11 text-base rounded-r-none"
                      />
                      <select
                        value={inputs.wallLengthUnit}
                        onChange={(e) => updateInputs({ wallLengthUnit: e.target.value as DimensionUnit })}
                        className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs font-semibold text-foreground focus:outline-none"
                      >
                        <option value="ft">ft</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-foreground">Wall Height</Label>
                    <div className="flex mt-1.5">
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={inputs.wallHeight}
                        onChange={(e) => updateInputs({ wallHeight: parseFloat(e.target.value) || 0 })}
                        className="h-11 text-base rounded-r-none"
                      />
                      <select
                        value={inputs.wallHeightUnit}
                        onChange={(e) => updateInputs({ wallHeightUnit: e.target.value as DimensionUnit })}
                        className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs font-semibold text-foreground focus:outline-none"
                      >
                        <option value="ft">ft</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-foreground">Wall Thickness</Label>
                    <div className="flex mt-1.5">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={inputs.wallThickness}
                        onChange={(e) => updateInputs({ wallThickness: parseFloat(e.target.value) || 0 })}
                        className="h-11 text-base rounded-r-none"
                      />
                      <select
                        value={inputs.wallThicknessUnit}
                        onChange={(e) => updateInputs({ wallThicknessUnit: e.target.value as DimensionUnit })}
                        className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs font-semibold text-foreground focus:outline-none"
                      >
                        <option value="in">inches (9" or 4.5")</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-foreground">Brick Type</Label>
                    <select
                      value={inputs.brickType}
                      onChange={(e) => {
                        const t = e.target.value as typeof inputs.brickType;
                        if (t === "standard_modular") {
                          updateInputs({ brickType: t, brickLengthMm: 190, brickWidthMm: 90, brickHeightMm: 90 });
                        } else if (t === "traditional_clay") {
                          updateInputs({ brickType: t, brickLengthMm: 230, brickWidthMm: 115, brickHeightMm: 75 });
                        } else if (t === "aac_block") {
                          updateInputs({ brickType: t, brickLengthMm: 600, brickWidthMm: 200, brickHeightMm: 150 });
                        }
                      }}
                      className="h-11 mt-1.5 w-full px-3.5 bg-background border border-input rounded-md text-xs sm:text-sm font-medium text-foreground focus:outline-none"
                    >
                      <option value="standard_modular">Standard Modular Red Brick (190 × 90 × 90 mm)</option>
                      <option value="traditional_clay">Traditional Clay Brick (9" × 4.5" × 3")</option>
                      <option value="aac_block">AAC Lightweight Block (600 × 200 × 150 mm)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-foreground">Mortar Joint Thickness</Label>
                    <select
                      value={inputs.mortarJointThicknessMm}
                      onChange={(e) => updateInputs({ mortarJointThicknessMm: parseInt(e.target.value) || 10 })}
                      className="h-11 mt-1.5 w-full px-3.5 bg-background border border-input rounded-md text-xs sm:text-sm font-medium text-foreground focus:outline-none"
                    >
                      <option value="10">10 mm (Standard mortar joint)</option>
                      <option value="12">12 mm (Rough traditional brickwork)</option>
                      <option value="4">4 mm (AAC block thin joint)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 6. OTHER WORK (DIRECT KNOWN VOLUME) */}
            {friendlyType === "other" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Total Wet Volume</Label>
                  <div className="flex mt-1.5">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inputs.customWetVolume}
                      onChange={(e) => updateInputs({ customWetVolume: parseFloat(e.target.value) || 0 })}
                      className="h-12 text-lg rounded-r-none"
                    />
                    <select
                      value={inputs.customVolumeUnit}
                      onChange={(e) => updateInputs({ customVolumeUnit: e.target.value as VolumeUnit })}
                      className="h-12 px-4 bg-muted border border-l-0 border-input rounded-r-md text-sm font-semibold text-foreground focus:outline-none"
                    >
                      <option value="m3">m³</option>
                      <option value="cft">cu ft</option>
                      <option value="litres">Litres</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Material Type</Label>
                  <select
                    value={inputs.dryVolumeFactor}
                    onChange={(e) => updateInputs({ dryVolumeFactor: parseFloat(e.target.value) || 1.54 })}
                    className="h-12 mt-1.5 w-full px-3.5 bg-background border border-input rounded-md text-sm font-medium text-foreground focus:outline-none"
                  >
                    <option value="1.54">Concrete with Stone Chips (1.54 extra material factor)</option>
                    <option value="1.33">Mortar or Plaster without stones (1.33 factor)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: CEMENT MIX */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <Label className="text-base sm:text-lg font-bold text-foreground">
                Step 3: Select Cement Mix
              </Label>
              <span className="text-xs text-muted-foreground font-medium">Cement : Sand : Stone Chips</span>
            </div>

            {friendlyType === "concrete" ? (
              <div className="space-y-3">
                <select
                  value={concretePreset}
                  onChange={(e) =>
                    handleConcretePresetChange(e.target.value as "standard" | "strong" | "foundation" | "custom")
                  }
                  className="h-12 w-full px-4 bg-background border border-input rounded-xl text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="standard">Standard Concrete (1 : 1.5 : 3) — Recommended for roof slabs & beams</option>
                  <option value="strong">Strong Concrete (1 : 1 : 2) — Heavy pillars, commercial slabs & water tanks</option>
                  <option value="foundation">Foundation Base (1 : 2 : 4) — Flooring base, ground bed & pathways</option>
                  <option value="custom">Custom Mix Ratio — Enter your engineer's exact mix</option>
                </select>

                {concretePreset === "custom" && (
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                    <span className="text-xs font-semibold text-foreground block">Enter Mix Proportion Parts:</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Cement</Label>
                        <Input
                          type="number"
                          value={inputs.mixRatio.cement}
                          onChange={(e) =>
                            updateInputs({
                              mixRatio: { ...inputs.mixRatio, cement: parseFloat(e.target.value) || 1 },
                            })
                          }
                          className="h-10 mt-1 text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Sand</Label>
                        <Input
                          type="number"
                          value={inputs.mixRatio.sand}
                          onChange={(e) =>
                            updateInputs({
                              mixRatio: { ...inputs.mixRatio, sand: parseFloat(e.target.value) || 1.5 },
                            })
                          }
                          className="h-10 mt-1 text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Stone Chips</Label>
                        <Input
                          type="number"
                          value={inputs.mixRatio.aggregate}
                          onChange={(e) =>
                            updateInputs({
                              mixRatio: { ...inputs.mixRatio, aggregate: parseFloat(e.target.value) || 3 },
                            })
                          }
                          className="h-10 mt-1 text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-muted-foreground leading-relaxed">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> For structural roof slabs and columns, always verify and follow the approved mix ratio specified by your licensed structural engineer.
                  </span>
                </div>
              </div>
            ) : friendlyType === "plaster" ? (
              <select
                value={`${inputs.mixRatio.cement}:${inputs.mixRatio.sand}`}
                onChange={(e) => {
                  const [c, s] = e.target.value.split(":").map(Number);
                  updateInputs({ mixRatio: { cement: c || 1, sand: s || 6, aggregate: 0 } });
                }}
                className="h-12 w-full px-4 bg-background border border-input rounded-xl text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="1:6">1 : 6 Mix — Standard for internal brick walls</option>
                <option value="1:4">1 : 4 Mix — Recommended for ceilings & external plaster</option>
                <option value="1:5">1 : 5 Mix — General masonry plaster</option>
                <option value="1:3">1 : 3 Mix — Rich waterproof coat for damp areas</option>
              </select>
            ) : friendlyType === "flooring" ? (
              <select
                value={`${inputs.mixRatio.cement}:${inputs.mixRatio.sand}`}
                onChange={(e) => {
                  const [c, s] = e.target.value.split(":").map(Number);
                  updateInputs({ mixRatio: { cement: c || 1, sand: s || 4, aggregate: 0 } });
                }}
                className="h-12 w-full px-4 bg-background border border-input rounded-xl text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="1:4">1 : 4 Mix — Standard for vitrified tile bedding & leveling</option>
                <option value="1:3">1 : 3 Mix — Heavy duty Indian Patent Stone (IPS) flooring</option>
                <option value="1:5">1 : 5 Mix — Lean dry bedding for marble or granite</option>
              </select>
            ) : friendlyType === "brickwork" ? (
              <select
                value={`${inputs.mixRatio.cement}:${inputs.mixRatio.sand}`}
                onChange={(e) => {
                  const [c, s] = e.target.value.split(":").map(Number);
                  updateInputs({ mixRatio: { cement: c || 1, sand: s || 6, aggregate: 0 } });
                }}
                className="h-12 w-full px-4 bg-background border border-input rounded-xl text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="1:6">1 : 6 Mortar — Standard for 9-inch load bearing walls</option>
                <option value="1:4">1 : 4 Mortar — Strong mix for 4.5-inch partition walls</option>
                <option value="1:5">1 : 5 Mortar — General masonry</option>
              </select>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Cement</Label>
                  <Input
                    type="number"
                    value={inputs.mixRatio.cement}
                    onChange={(e) =>
                      updateInputs({ mixRatio: { ...inputs.mixRatio, cement: parseFloat(e.target.value) || 1 } })
                    }
                    className="h-11 mt-1 text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sand</Label>
                  <Input
                    type="number"
                    value={inputs.mixRatio.sand}
                    onChange={(e) =>
                      updateInputs({ mixRatio: { ...inputs.mixRatio, sand: parseFloat(e.target.value) || 2 } })
                    }
                    className="h-11 mt-1 text-base font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Stone Chips</Label>
                  <Input
                    type="number"
                    value={inputs.mixRatio.aggregate}
                    onChange={(e) =>
                      updateInputs({ mixRatio: { ...inputs.mixRatio, aggregate: parseFloat(e.target.value) || 4 } })
                    }
                    className="h-11 mt-1 text-base font-semibold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: EXTRA MATERIAL (WASTAGE ALLOWANCE) */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base sm:text-lg font-bold text-foreground">
                  Step 4: Extra material for wastage
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Covers paper bag tearing, mixer residue, and on-site handling spillage.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                +{result.wastageCementMassKg.toFixed(1)} kg cement
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[0, 3, 5, 10].map((pct) => {
                const isSelected = inputs.wastagePercentage === pct;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => updateInputs({ wastagePercentage: pct })}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted border-border/60"
                    }`}
                  >
                    {pct}% {pct === 5 && <span className="hidden sm:inline font-normal">(Standard)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ADVANCED SETTINGS ACCORDION (COLLAPSIBLE) */}
          <div className="pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/60 text-xs sm:text-sm font-semibold text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-500" />
                <span>Advanced Settings</span>
                <span className="text-xs text-muted-foreground font-normal hidden sm:inline">
                  (Adjust bag weight, density, and local material prices)
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Cement Bag Weight</Label>
                    <select
                      value={inputs.cementBagMassKg}
                      onChange={(e) => updateInputs({ cementBagMassKg: parseInt(e.target.value) || 50 })}
                      className="h-10 mt-1.5 w-full px-3 bg-background border border-input rounded-md text-xs font-medium text-foreground"
                    >
                      <option value="50">50 kg (Standard India)</option>
                      <option value="25">25 kg (Retail pack)</option>
                      <option value="40">40 kg (Special packaging)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Cement Bulk Density</Label>
                    <div className="flex mt-1.5">
                      <Input
                        type="number"
                        value={inputs.cementBulkDensity}
                        onChange={(e) => updateInputs({ cementBulkDensity: parseFloat(e.target.value) || 1440 })}
                        className="h-10 text-xs rounded-r-none"
                      />
                      <span className="h-10 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs flex items-center text-muted-foreground">
                        kg/m³
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Dry Material Factor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputs.dryVolumeFactor}
                      onChange={(e) => updateInputs({ dryVolumeFactor: parseFloat(e.target.value) || 1.54 })}
                      className="h-10 mt-1.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/40">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Cement Price (₹ / Bag)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs.rates.cementPricePerBag}
                      onChange={(e) =>
                        updateInputs({
                          rates: { ...inputs.rates, cementPricePerBag: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-10 mt-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Sand Price (₹ / cu ft)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs.rates.sandPrice}
                      onChange={(e) =>
                        updateInputs({
                          rates: { ...inputs.rates, sandPrice: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-10 mt-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Stone Chips Price (₹ / cu ft)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={inputs.rates.aggregatePrice}
                      onChange={(e) =>
                        updateInputs({
                          rates: { ...inputs.rates, aggregatePrice: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-10 mt-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: ONE LARGE PRIMARY ACTION BUTTON */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleCalculateClick}
              className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995]"
            >
              Calculate Cement Bags
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RESULTS SECTION (SIMPLE, CLEAR, READABLE)                 */}
        {/* ========================================================= */}
        <div ref={resultsRef} className="space-y-6 pt-2">
          {/* RESULT CARD 1: MAIN ANSWER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/40 shadow-xl space-y-5 text-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                You need approximately
              </span>
              <div className="flex flex-wrap items-baseline justify-center gap-3">
                <span className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight">
                  {result.wholeBagsToPurchase}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
                  Cement Bags
                </span>
              </div>
              <span className="inline-block text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 mt-1">
                {result.cementBagMassKg} kg per bag
              </span>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your estimated cement requirement is{" "}
              <strong className="text-foreground">{formatNumber(result.totalCementMassKg, 1)} kg</strong>, including{" "}
              {inputs.wastagePercentage}% extra material for on-site handling.
            </p>

            {/* TWO IMPORTANT VALUES (EXACT VS PURCHASE) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-4 border-t border-border/60 max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-left">
                <span className="text-xs text-muted-foreground block font-medium">Exact requirement</span>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {formatNumber(result.totalCementBagsExact, 2)} bags
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">Mathematical takeoff</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-left">
                <span className="text-xs text-amber-700 dark:text-amber-300 block font-semibold">Bags to purchase</span>
                <span className="text-lg sm:text-xl font-extrabold text-foreground">
                  {result.wholeBagsToPurchase} bags
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">Rounded up for full bags</span>
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
                <span>{isCopied ? "Summary Copied!" : "Copy Summary"}</span>
              </Button>

              <CalculatorPdfExport
                fileName="calczen-cement-bag-estimate"
                buttonLabel="Save as PDF"
                calculatorName="Cement Bag Quantity & Cost Estimate"
              />
            </div>
          </div>

          {/* RESULT SECTION 2: SIMPLE MATERIAL BREAKDOWN */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Simple Material Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* CEMENT */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Cement
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {result.wholeBagsToPurchase} <span className="text-sm font-normal text-muted-foreground">bags</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {formatNumber(result.totalCementMassKg, 0)} kg ({result.totalCementBagsExact.toFixed(2)} exact)
                </div>
              </div>

              {/* SAND */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Sand
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatNumber(result.sandVolumeCft, 1)} <span className="text-sm font-normal text-muted-foreground">cu ft</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {formatNumber(result.sandBrass, 2)} Brass ({formatNumber(result.sandMassTonnes, 1)} Tonnes)
                </div>
              </div>

              {/* STONE CHIPS (IF CONCRETE) OR BRICKS (IF BRICKWORK) OR WATER */}
              {result.aggregateVolumeM3 > 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                    Stone Chips (Gitti)
                  </span>
                  <div className="text-2xl font-extrabold text-foreground">
                    {formatNumber(result.aggregateVolumeCft, 1)}{" "}
                    <span className="text-sm font-normal text-muted-foreground">cu ft</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ {formatNumber(result.aggregateBrass, 2)} Brass ({formatNumber(result.aggregateMassTonnes, 1)} Tonnes)
                  </div>
                </div>
              ) : result.masonry ? (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                    Estimated Bricks
                  </span>
                  <div className="text-2xl font-extrabold text-foreground">
                    {formatNumber(result.masonry.estimatedBrickCount, 0)}{" "}
                    <span className="text-sm font-normal text-muted-foreground">Nos.</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Wet mortar volume: {formatNumber(result.masonry.wetMortarVolumeM3, 2)} m³
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                    Water Required
                  </span>
                  <div className="text-2xl font-extrabold text-foreground">
                    {formatNumber(result.waterLitresEstimated, 0)}{" "}
                    <span className="text-sm font-normal text-muted-foreground">Litres</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Clean potable mixing water</div>
                </div>
              )}
            </div>
          </div>

          {/* RESULT SECTION 3: ESTIMATED MATERIAL COST */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Estimated Material Cost</h3>
              <span className="text-xs text-muted-foreground">Based on current rates</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Cement Cost</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costs.cementPurchaseCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {result.wholeBagsToPurchase} bags × ₹{inputs.rates.cementPricePerBag}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Sand Cost</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costs.sandCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {formatNumber(result.sandVolumeCft, 0)} cft × ₹{inputs.rates.sandPrice}
                </span>
              </div>

              {result.costs.aggregateCost > 0 ? (
                <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                  <span className="text-xs text-muted-foreground block font-medium">Stone Chips Cost</span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {formatINR(result.costs.aggregateCost)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {formatNumber(result.aggregateVolumeCft, 0)} cft × ₹{inputs.rates.aggregatePrice}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                  <span className="text-xs text-muted-foreground block font-medium">Water Estimate</span>
                  <span className="text-base sm:text-lg font-bold text-foreground">
                    {formatNumber(result.waterLitresEstimated, 0)} L
                  </span>
                  <span className="text-[11px] text-muted-foreground block">Potable source</span>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs text-amber-700 dark:text-amber-300 block font-semibold">Total Materials</span>
                <span className="text-lg sm:text-xl font-extrabold text-foreground">
                  {formatINR(result.costs.totalMaterialCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">All materials combined</span>
              </div>
            </div>
          </div>

          {/* RESULT SECTION 4: HOW WE CALCULATED IT (ACCORDION) */}
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
                    How did we calculate this?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step breakdown using your actual measurements
                  </p>
                </div>
              </div>
              {showHowCalculated ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showHowCalculated && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">1. Concrete Volume:</strong>
                  Your wet concrete volume is <strong>{result.wetVolumeM3.toFixed(3)} m³</strong> (or{" "}
                  {result.wetVolumeCft.toFixed(1)} cubic feet).
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">2. Extra Material Allowance (Dry Factor):</strong>
                  Dry ingredients contain air spaces between stones and sand grains. We multiplied by the standard{" "}
                  <strong>{inputs.dryVolumeFactor} factor</strong> to get a dry volume of{" "}
                  <strong>{result.dryVolumeM3.toFixed(3)} m³</strong>.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">3. Cement Share in Mix:</strong>
                  With your selected ratio, cement accounts for{" "}
                  <strong>{result.baseCementVolumeM3.toFixed(3)} m³</strong> of the dry ingredients.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">4. Cement Weight in kg:</strong>
                  Standard cement weighs 1,440 kg per cubic metre, giving a net cement requirement of{" "}
                  <strong>{result.baseCementMassKg.toFixed(1)} kg</strong>.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">5. Number of Bags:</strong>
                  Dividing by {result.cementBagMassKg} kg per bag gives{" "}
                  <strong>{result.baseCementBagsExact.toFixed(2)} bags</strong>.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">6. Wastage Allowance:</strong>
                  Adding {inputs.wastagePercentage}% extra material brings the total to{" "}
                  <strong>{result.totalCementBagsExact.toFixed(2)} bags</strong> ({result.totalCementMassKg.toFixed(1)} kg).
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground font-semibold">
                  7. Therefore, you should order <strong>{result.wholeBagsToPurchase} whole bags</strong> so you never run out midway.
                </div>
              </div>
            )}
          </div>

          {/* RESULT SECTION 5: TECHNICAL CALCULATION DETAILS (ACCORDION) */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    Technical Calculation Details
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Formulas, Indian Standards (IS 456 & CPWD), and exact decimal figures
                  </p>
                </div>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">
                {result.steps.map((st) => (
                  <div key={st.stepNumber} className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Step {st.stepNumber}: {st.title}</span>
                      <span className="text-amber-600 dark:text-amber-400">{st.resultString}</span>
                    </div>
                    <div className="text-muted-foreground">{st.formula}</div>
                    <div className="text-foreground/90 font-medium">{st.substitution}</div>
                  </div>
                ))}

                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 font-sans text-xs text-muted-foreground leading-relaxed">
                  <strong>Specifications:</strong> Calculated using standard density 1,440 kg/m³ per IS 456:2000, 1.54 dry factor for concrete, and 1.33 for masonry mortars per CPWD DSR norms.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}

// -------------------------------------------------------------
// SEO BLOG & COMPREHENSIVE GUIDE CONTENT
// -------------------------------------------------------------

const CEMENT_BAG_BLOG_CONTENT: BlogContent = {
  primaryKeyword: "Cement Bag Calculator",
  category: "Home Construction",
  introText:
    "Accurately estimating cement bag requirements is one of the most critical steps in Indian home construction, renovation, and structural casting. Buying too few bags risks disastrous cold joints during slab pours, while over-ordering leads to hydration lump wastage. This comprehensive guide covers the technical and practical math governing cement quantities across concrete, plaster, masonry, and flooring per IS 456 and CPWD guidelines.",
  sections: [
    {
      title: "1. The Fundamental Cement Bag Formula",
      paragraphs: [
        "In civil engineering estimation, cement quantity is derived from compacted wet volume converted into dry bulk volume.",
        "Dry Volume = Wet Volume × Dry Volume Factor (1.54 for Concrete, 1.33 for Mortar).",
        "Cement Volume (m³) = Dry Volume × (Cement Part / Sum of Ratio Parts).",
        "Cement Mass (kg) = Cement Volume × 1,440 kg/m³ (standard IS 456 cement bulk density).",
        "Whole Bags to Order = ⌈Cement Mass (kg) / 50 kg × (1 + Wastage %)⌉.",
      ],
      callout: {
        type: "expertInsight",
        title: "Standard Cement Bulk Density",
        text: "Per IS 456:2000, the bulk density of ordinary Portland cement (OPC) and Portland Pozzolana Cement (PPC) is 1,440 kg/m³ (90 lbs/cu ft). One standard 50 kg bag has a volume of ~0.0347 m³ (1.226 cu ft).",
      },
      formulaBox: {
        title: "Master Cement Bag Formula",
        formula: "Dry Volume (m³) = Wet Volume × Factor\nCement Mass (kg) = Dry Vol × (Cement Ratio / Total Mix Parts) × 1,440\nPurchase Bags = ⌈Cement Mass / 50 kg × (1 + Wastage %)⌉",
        variables: [
          { name: "Factor", desc: "1.54 for concrete; 1.33 for plaster and masonry mortar." },
          { name: "1,440", desc: "Standard bulk density of cement in kg/m³." },
          { name: "50 kg", desc: "Weight of one standard Indian cement bag." },
        ],
      },
    },
    {
      title: "2. Why Dry Volume Multipliers (1.54 vs 1.33) are Essential",
      paragraphs: [
        "When dry cement, sand, and coarse aggregates are mixed with water, the fine sand slips into the microscopic voids between coarse aggregate stones, and cement paste coats every particle.",
        "In concrete, the combined voids in dry stone aggregate and sand total approximately 54%. Therefore, 1.54 m³ of dry materials are required to yield 1.0 m³ of wet compacted concrete.",
        "In mortar and plaster, where coarse stone aggregate is absent, the dry void factor is 1.33 (33% volume shrinkage), as established by CPWD Analysis of Rates.",
      ],
      callout: {
        type: "commonMistake",
        title: "Never Multiply Ratios by Wet Volume",
        text: "Calculating cement directly from wet volume without applying the dry volume multiplier (1.54 for concrete or 1.33 for mortar) will result in a 30% to 50% material shortage on site.",
      },
    },
    {
      title: "3. Case Study: 1,000 sq ft Roof Slab Cement Calculation",
      paragraphs: [
        "Consider a standard residential roof slab measuring 1,000 sq ft with 5 inches (125 mm) thickness using M20 concrete (1:1.5:3):",
        "Step 1: Wet Volume = 1,000 sq ft × (5 / 12) ft = 416.7 cu ft = 11.799 m³.",
        "Step 2: Dry Volume = 11.799 m³ × 1.54 = 18.17 m³.",
        "Step 3: Cement Volume = 18.17 × (1 / 5.5) = 3.304 m³.",
        "Step 4: Cement Mass = 3.304 m³ × 1,440 kg/m³ = 4,757.3 kg.",
        "Step 5: Net Bags = 4,757.3 / 50 = 95.15 bags.",
        "Step 6: Adding 5% on-site handling wastage = 95.15 × 1.05 = 99.9 bags ≈ 100 whole bags.",
      ],
      exampleBox: {
        title: "1,000 sq ft Roof Slab Takeoff",
        inputs: [
          { name: "Area", val: "1,000 sq ft" },
          { name: "Thickness", val: "5 inches (125 mm)" },
          { name: "Mix", val: "M20 (1 : 1.5 : 3)" },
        ],
        steps: [
          "Wet Volume = 11.8 m³ (417 cu ft)",
          "Dry Volume = 18.17 m³ (1.54×)",
          "Cement Mass = 4,757 kg",
        ],
        result: "100 Bags (50kg each) + 175 cu ft Sand + 350 cu ft Coarse Aggregate",
      },
    },
    {
      title: "4. Wall & Ceiling Plastering Cement Takeoff",
      paragraphs: [
        "Plaster thickness varies depending on whether it is applied to ceilings or interior/exterior walls:",
        "- Ceiling Plaster (6mm, 1:4 mix): ~0.35 bags of cement per 100 sq ft.",
        "- Internal Wall Plaster (12mm, 1:6 mix): ~0.47 bags of cement per 100 sq ft.",
        "- Internal Wall Plaster (15mm, 1:6 mix): ~0.59 bags of cement per 100 sq ft.",
        "- External Sand-Faced Plaster (20mm double coat, 1:4 base + 1:3 finish): ~1.15 to 1.25 bags per 100 sq ft.",
        "Always allow for 5% to 10% rebound wastage during plaster application.",
      ],
      callout: {
        type: "proTip",
        title: "Rebound Allowance",
        text: "Ceiling and vertical wall plastering incur significant mortar drop (rebound). While clean dropped mortar can be re-tempered within 30 minutes, dirty floor drops must be discarded.",
      },
    },
    {
      title: "5. Brickwork Mortar Consumption Rules",
      paragraphs: [
        "In standard brick masonry, mortar joints account for 25% to 30% of total wall volume.",
        "For a 9-inch thick brick wall measuring 10 × 10 ft (100 sq ft surface, 75 cu ft volume):",
        "- Estimated Bricks Required: ~1,150 to 1,200 bricks (including breakage).",
        "- Wet Mortar Volume: ~19 to 22 cu ft.",
        "- Cement Bags (1:6 mix): ~3.5 to 4 bags (50kg each).",
        "- Sand Required: ~20 to 22 cu ft.",
      ],
    },
  ],
  faqs: [
    {
      q: "How many cement bags are needed for a 1,000 sq ft roof slab?",
      a: "For a standard 1,000 sq ft residential roof slab of 5 inches (125 mm) thickness using M20 concrete (1:1.5:3 nominal proportion), the wet volume is approximately 11.8 m³ (417 cu ft). Applying the IS 456 standard dry volume factor of 1.54, you require approximately 95 to 100 cement bags of 50 kg each (including 5% handling wastage).",
    },
    {
      q: "Why is dry volume multiplied by 1.54 for concrete and 1.33 for mortar?",
      a: "Dry ingredients contain substantial air voids between stones and sand particles. When water is added, sand fills the voids between coarse aggregate, and cement paste fills the voids between sand grains. Compacted wet concrete shrinks, so 1.54 m³ of dry materials are needed for 1.0 m³ of wet concrete. In mortar (no coarse stone), voids are lower, so a 1.33 dry factor is standard per CPWD.",
    },
    {
      q: "What is the standard bulk density of cement in India?",
      a: "Per IS 456:2000, standard cement bulk density is 1,440 kg/m³ (90 lbs/cu ft). One standard 50 kg cement bag occupies a volume of approximately 0.0347 m³ (1.226 cu ft).",
    },
    {
      q: "How much cement is required for 100 sq ft of 12mm wall plaster?",
      a: "For 100 sq ft (9.29 m²) of 12mm internal wall plaster using standard 1:6 cement-sand mortar, you require approximately 0.47 to 0.50 bags of cement and 3.5 to 4 cu ft of plastering sand (including rebound wastage).",
    },
    {
      q: "How many cement bags are required for 100 cu ft of 9-inch brickwork?",
      a: "In 9-inch brick masonry, mortar occupies approximately 25% to 30% of total wall volume. For 100 cu ft of brickwork using 1:6 mortar, you need approximately 4.5 to 5 cement bags and 27 to 30 cu ft of sand, along with roughly 1,350 to 1,400 modular bricks.",
    },
    {
      q: "Why should I always purchase whole bags with a wastage allowance?",
      a: "Cement cannot be bought in fractions at retail supply stores. Additionally, 3% to 5% loss occurs naturally on site from paper bag tearing, transport, residue in mixer hoppers, and mortar dropping. Ordering whole bags prevents catastrophic pouring pauses midway through slab casting.",
    },
  ],
};
