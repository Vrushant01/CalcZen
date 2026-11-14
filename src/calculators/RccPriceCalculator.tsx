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
  Wrench,
  AlertTriangle,
  FileSpreadsheet,
  Receipt,
  Scale,
} from "lucide-react";
import {
  RccCalculatorInputs,
  RccElementItem,
  RccElementType,
  ConcreteGrade,
  DimensionUnit,
  BbsBarItem,
  calculateElementVolumeM3,
  calculateMasterRccEstimate,
  calculateSteelWeightFromBbs,
  generateRccInsights,
  getRebarUnitWeightKgPerM,
  formatINR,
  formatNumber,
  NOMINAL_MIX_PRESETS,
  STANDARD_REBAR_SIZES,
  TYPICAL_STEEL_KG_PER_M3,
  PRESET_SAMPLE_ROOF_SLAB,
  PRESET_SAMPLE_VILLA_FRAME,
  CEMENT_BAG_VOLUME_M3,
  CFT_PER_CUBIC_METRE,
  UNIT_TO_METRE_FACTORS,
} from "@/utils/rccCalculatorUtils";

type QuickWorkType = "slab" | "slab_beams" | "columns" | "footings" | "full_frame" | "custom_volume";

const QUICK_WORK_TYPES: Array<{
  id: QuickWorkType;
  title: string;
  subtitle: string;
  icon: typeof Building2;
}> = [
  { id: "slab", title: "Roof Slab", subtitle: "Standard floor or terrace slab", icon: Building2 },
  { id: "slab_beams", title: "Slab + Beams", subtitle: "Slab cast with supporting beams", icon: Layers },
  { id: "columns", title: "Columns (Pillars)", subtitle: "Vertical structural columns", icon: Building2 },
  { id: "footings", title: "Footings", subtitle: "Underground foundation footings", icon: Hammer },
  { id: "full_frame", title: "Complete RCC Frame", subtitle: "Slabs, beams, columns & footings", icon: Boxes },
  { id: "custom_volume", title: "Custom RCC Work", subtitle: "Enter known volume in m³ or cu ft", icon: Settings2 },
];

// Helper: Convert unit values smoothly without silently reinterpreting
function convertUnitValue(val: number, fromUnit: DimensionUnit, toUnit: DimensionUnit): number {
  if (val <= 0 || isNaN(val)) return 0;
  const inM = val * (UNIT_TO_METRE_FACTORS[fromUnit] || 1);
  const toFactor = UNIT_TO_METRE_FACTORS[toUnit] || 1;
  const converted = inM / toFactor;
  return Math.round(converted * 100) / 100;
}

// -------------------------------------------------------------
// SEO BLOG & EDUCATIONAL CONTENT
// -------------------------------------------------------------

const blogContent: any = {
  title: "Complete RCC Price & Concrete Quantity Calculation Guide (India)",
  primaryKeyword: "RCC Price Calculator",
  category: "Home Construction",
  introText:
    "Reinforced Cement Concrete (RCC) is the backbone of Indian civil construction. Whether you are casting a 1,000 sq ft residential roof slab, building plinth beams, or pouring foundation footings, accurately estimating concrete volume, cement bags, sand, coarse aggregate, and TMT rebar is essential to control costs and prevent site shortages.",
  sections: [
    {
      title: "What is Reinforced Cement Concrete (RCC)?",
      paragraphs: [
        "Reinforced Cement Concrete (RCC) is a composite civil engineering material combining plain cement concrete with high-tensile steel reinforcement bars (TMT rebar).",
        "Plain concrete possesses immense compressive strength but very low tensile strength (only about 10% of its compressive capacity). Steel reinforcement absorbs all tensile, flexural, and shear stresses, enabling modern structural frames, cantilevers, and floor slabs to span large distances safely without brittle cracking.",
      ],
      callout: {
        type: "quickFact",
        title: "IS 456:2000 Minimum Grade Rule",
        text: "Per Clause 6.1.2 of IS 456:2000, concrete of grade lower than M20 shall not be used in reinforced concrete work under standard exposure conditions.",
      },
    },
    {
      title: "Why is the Dry Volume Factor 1.54 Used in Concrete Estimation?",
      paragraphs: [
        "When dry cement, dry sand, and coarse aggregates are mixed with water, the fine sand particles fill the microscopic voids between coarse aggregates, and cement paste fills the voids between sand particles. Furthermore, entrained air escapes during compaction and mechanical vibration.",
        "Civil engineers standardly apply a dry volume factor of 1.52 to 1.57 (with 1.54 being the gold standard adopted by the Central Public Works Department / CPWD). This means 1 cubic metre of compacted wet concrete requires approximately 1.54 cubic metres of dry raw ingredients.",
      ],
      formulaBox: {
        title: "Standard Dry Volume Formula",
        formula: "Dry Volume (m³) = Wet Compacted Volume (m³) × 1.54\nCement Volume = Dry Volume × (Cement Ratio / Total Mix Parts)\nCement Bags = Cement Volume / 0.0347 m³",
        variables: [
          { name: "1.54", desc: "CPWD standard dry-void compaction factor for concrete." },
          { name: "0.0347 m³", desc: "Standard volume of one 50kg cement bag (density 1,440 kg/m³)." },
        ],
      },
    },
    {
      title: "Understanding Concrete Grades: M15, M20, M25, and Beyond",
      paragraphs: [
        "In the Indian Standards designation (e.g., M20), 'M' stands for Mix and the number denotes the characteristic compressive strength in N/mm² (MPa) after 28 days of curing on a standard 150mm test cube:",
        "- **M10 (1:3:6):** Suitable for plain cement concrete (PCC) leveling courses and bedding beneath footings.",
        "- **M15 (1:2:4):** Used for non-structural pathways, boundary wall foundations, and light floors.",
        "- **M20 (1:1.5:3):** The standard benchmark for residential slabs, beams, lintels, and columns.",
        "- **M25 (1:1:2):** Mandated for heavily loaded multi-storey columns, water-retaining structures, and coastal zones.",
        "- **M30 and Above:** High-strength concrete prepared via laboratory design mix (IS 10262) for high-rise frames and bridges.",
      ],
    },
    {
      title: "How to Estimate Reinforcement Steel (TMT Bars)",
      paragraphs: [
        "Reinforcement steel can be estimated through two distinct civil engineering methodologies:",
        "1. **Preliminary Empirical Estimation:** Based on volume of concrete (Slabs: 70–90 kg/m³, Beams: 100–140 kg/m³, Columns: 130–180 kg/m³, Footings: 60–90 kg/m³).",
        "2. **Detailed Bar Bending Schedule (BBS):** Calculated bar-by-bar using structural drawings and the theoretical rebar weight formula.",
      ],
      formulaBox: {
        title: "Rebar Unit Weight Formula (IS 1786)",
        formula: "Weight per Metre (kg/m) = d² / 162\nTotal Steel Weight (kg) = Total Bar Length (m) × (d² / 162)",
        variables: [
          { name: "d", desc: "Nominal bar diameter in millimetres (8mm, 10mm, 12mm, 16mm, etc.)." },
          { name: "162", desc: "Constant derived from steel density (7,850 kg/m³) × π/4 × 10^-6." },
        ],
      },
    },
    {
      title: "Site-Mix Concrete vs Ready-Mix Concrete (RMC)",
      paragraphs: [
        "For small residential projects with narrow road access, site-mix concrete prepared with a 10/7 mechanical mixer remains common and cost-effective for pours under 15 m³.",
        "For larger slabs (above 1,500 sq ft) or urban multi-storey structures, Ready-Mix Concrete (RMC) batched under computer-controlled conditions in dedicated batching plants offers superior quality consistency, eliminating on-site raw material congestion and dramatically speeding up casting times.",
      ],
      callout: {
        type: "proTip",
        title: "Curing Practice",
        text: "Begin water curing as soon as the concrete surface hardens (within 24 hours). Ponding or wet hessian curing must continue uninterrupted for a minimum of 7 to 10 days (14 days for mineral admixtures) to attain full 28-day design strength.",
      },
    },
  ],
  faqs: [
    {
      q: "How many cement bags are required for 1 m³ of M20 concrete?",
      a: "For 1 cubic metre of M20 concrete (nominal mix 1:1.5:3) with a standard dry volume factor of 1.54, the cement volume required is 1.54 / (1 + 1.5 + 3) = 0.28 m³. Since one 50kg bag of cement has a volume of approximately 0.0347 m³ (density 1,440 kg/m³), you require approximately 8.07 bags (rounded to 8.2 – 8.5 bags including handling wastage).",
    },
    {
      q: "What is the standard formula to calculate steel bar weight per metre in India?",
      a: "The standard theoretical unit weight of steel rebar is given by the formula: Weight (kg/m) = d² / 162, where 'd' is the nominal diameter of the TMT bar in millimetres. For example: 8mm = 0.395 kg/m; 10mm = 0.617 kg/m; 12mm = 0.889 kg/m; 16mm = 1.580 kg/m; 20mm = 2.469 kg/m.",
    },
    {
      q: "What is the typical cost of RCC roof slab casting per square foot in India?",
      a: "In India, the all-inclusive cost of RCC roof slab casting (including cement, sand, coarse aggregate, TMT steel, shuttering/centering, and concreting labour) typically ranges between ₹180 and ₹260 per square foot for a standard 5-inch thick slab, depending on local steel and sand rates.",
    },
    {
      q: "How much binding wire is needed for 1 ton (1,000 kg) of steel?",
      a: "As a standard civil engineering rule of thumb, binding wire requirement is approximately 1% of the total reinforcement steel weight. For 1 ton (1,000 kg) of TMT steel, you will need approximately 8 kg to 12 kg of 18-gauge annealed GI binding wire.",
    },
    {
      q: "What is the minimum grade of concrete for RCC work per IS 456:2000?",
      a: "Per Clause 6.1.2 of IS 456:2000, concrete of grade lower than M20 shall not be used in reinforced concrete work under standard exposure conditions. Plain concrete (PCC) may use M10 or M15.",
    },
    {
      q: "Why do civil engineers avoid double-counting beam and slab overlaps?",
      a: "In a beam-and-slab floor system, the top portion of the beam is monolithic with the floor slab. If the slab volume is calculated across the full footprint area, and beam depths are measured from the top of the slab rather than the underside of the slab, the concrete volume at the junction will be double-counted. Quantity surveyors measure beams below the slab soffit to avoid over-ordering concrete.",
    },
    {
      q: "What is the difference between Nominal Mix and Design Mix concrete?",
      a: "Nominal mix concrete relies on standardized volumetric proportions (such as 1:1.5:3 for M20) suitable for non-critical or low-rise residential works up to M20. Design mix concrete (mandated for M25 and above per IS 10262) calculates precise weight proportions based on actual laboratory testing of cement strength, aggregate grading, moisture content, and chemical admixtures.",
    },
    {
      q: "How much shuttering area is required for an RCC slab?",
      a: "For a simple rectangular roof slab, the formwork area equals the bottom soffit area (Length × Width) plus the 4 perimeter edge side faces (2 × (Length + Width) × Thickness). For a 1,000 sq ft slab (40' × 25' × 5\"), the bottom area is 1,000 sq ft and the edge formwork is approximately 54 sq ft, giving a total of ~1,054 sq ft.",
    },
    {
      q: "How long should RCC shuttering remain in place before stripping?",
      a: "Per IS 456:2000 Clause 11.3: Column and vertical beam sides can be stripped after 16–24 hours; slab soffit formwork (props left under) after 3 days; slab props under 4.5m span after 7 days; and beam soffit props after 14 to 21 days depending on span and cement type.",
    },
  ],
};

export function RccPriceCalculator() {
  const calc = getCalculator("rcc-price-calculator")!;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mode: Quick Estimate (default) vs Detailed Estimate
  const [estimateMode, setEstimateMode] = useState<"quick" | "detailed">("quick");
  const [quickWorkType, setQuickWorkType] = useState<QuickWorkType>("slab");
  const [directVolumeMode, setDirectVolumeMode] = useState<boolean>(false);
  const [directVolume, setDirectVolume] = useState<number>(15);
  const [directVolumeUnit, setDirectVolumeUnit] = useState<"m3" | "cft">("m3");

  // Options toggles in Quick Mode
  const [includeShuttering, setIncludeShuttering] = useState<boolean>(true);
  const [includeLabour, setIncludeLabour] = useState<boolean>(true);
  const [steelEntryMode, setSteelEntryMode] = useState<"quick_rate" | "actual_weight" | "bbs">("quick_rate");
  const [customSteelTotalKg, setCustomSteelTotalKg] = useState<number>(0);
  const [bbsBars, setBbsBars] = useState<any[]>([
    {
      id: "bar-1",
      memberDescription: "Roof Slab Main Reinforcement",
      barMark: "T1",
      diameterMm: 10,
      numberOfMembers: 1,
      barsPerMember: 65,
      totalBarsCount: 65,
      lengthPerBarM: 7.6,
      totalLengthM: 494,
      shapeType: "straight",
    },
    {
      id: "bar-2",
      memberDescription: "Roof Slab Distribution Bars",
      barMark: "T2",
      diameterMm: 8,
      numberOfMembers: 1,
      barsPerMember: 80,
      totalBarsCount: 80,
      lengthPerBarM: 12.2,
      totalLengthM: 976,
      shapeType: "straight",
    },
  ]);

  // Accordion Toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showHowCalculated, setShowHowCalculated] = useState<boolean>(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [showBoqTable, setShowBoqTable] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Master Calculator Inputs State
  const [inputs, setInputs] = useState<RccCalculatorInputs>(PRESET_SAMPLE_ROOF_SLAB);

  const currentInputs = useMemo(() => ({
    inputs,
    directVolumeMode,
    directVolume,
    directVolumeUnit,
    estimateMode,
    includeShuttering,
    includeLabour,
    steelEntryMode,
    customSteelTotalKg,
    bbsBars,
  }), [
    inputs,
    directVolumeMode,
    directVolume,
    directVolumeUnit,
    estimateMode,
    includeShuttering,
    includeLabour,
    steelEntryMode,
    customSteelTotalKg,
    bbsBars,
  ]);

  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(currentInputs);
  const activeInputs = calculatedInputs || currentInputs;

  // Update inputs safely
  const updateInputs = (patch: Partial<RccCalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  // Elements update helper
  const updateElement = (id: string, patch: Partial<RccElementItem>) => {
    setInputs((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    }));
  };

  // Synchronize elements when user selects a Quick Work Type
  const handleSelectQuickWorkType = (type: QuickWorkType) => {
    setQuickWorkType(type);
    setDirectVolumeMode(type === "custom_volume");

    if (type === "slab") {
      setInputs((prev) => ({
        ...prev,
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
            estimatedSteelKgPerM3: 85,
          },
        ],
      }));
    } else if (type === "slab_beams") {
      setInputs((prev) => ({
        ...prev,
        elements: [
          {
            id: "slab-1",
            name: "Residential Roof Slab",
            type: "slab",
            count: 1,
            length: 40,
            width: 25,
            depth: 5,
            unit: "ft",
            depthUnit: "in",
            estimatedSteelKgPerM3: 80,
          },
          {
            id: "beam-1",
            name: "Plinth & Roof Beams",
            type: "beam",
            count: 6,
            length: 25,
            width: 9,
            depth: 12,
            unit: "ft",
            widthUnit: "in",
            depthUnit: "in",
            estimatedSteelKgPerM3: 120,
          },
        ],
      }));
    } else if (type === "columns") {
      setInputs((prev) => ({
        ...prev,
        elements: [
          {
            id: "col-1",
            name: "RCC Columns (Pillars)",
            type: "column",
            count: 8,
            length: 12,
            width: 9,
            depth: 10,
            unit: "in",
            depthUnit: "ft", // 10 ft height
            estimatedSteelKgPerM3: 150,
          },
        ],
      }));
    } else if (type === "footings") {
      setInputs((prev) => ({
        ...prev,
        elements: [
          {
            id: "foot-1",
            name: "Isolated Foundation Footings",
            type: "footing",
            count: 8,
            length: 4,
            width: 4,
            depth: 12,
            unit: "ft",
            depthUnit: "in", // 12 in depth
            estimatedSteelKgPerM3: 80,
          },
        ],
      }));
    } else if (type === "full_frame") {
      setInputs(PRESET_SAMPLE_VILLA_FRAME);
    }
  };

  // Apply Sample Presets
  const handleApplyPreset = (preset: "slab_sample" | "villa_frame") => {
    if (preset === "slab_sample") {
      handleSelectQuickWorkType("slab");
    } else {
      handleSelectQuickWorkType("full_frame");
    }
    markCalculated();
  };

  // Reset to default
  const handleReset = () => {
    setInputs(PRESET_SAMPLE_ROOF_SLAB);
    setEstimateMode("quick");
    setQuickWorkType("slab");
    setDirectVolumeMode(false);
    setIncludeShuttering(true);
    setIncludeLabour(true);
    setSteelEntryMode("quick_rate");
    setCustomSteelTotalKg(0);
    setShowAdvanced(false);
    setShowHowCalculated(false);
    setShowTechnicalDetails(false);
    setShowBoqTable(false);
    resetCalculated();
  };

  // Active Calculation Result
  const result = useMemo(() => {
    // If direct volume mode is active, simulate a single element with direct volume
    let finalInputs = { ...inputs };

    if (directVolumeMode) {
      const volM3 = directVolumeUnit === "cft" ? directVolume / CFT_PER_CUBIC_METRE : directVolume;
      finalInputs = {
        ...finalInputs,
        elements: [
          {
            id: "direct-vol-1",
            name: "Direct Volume Concrete",
            type: "custom",
            count: 1,
            length: 1,
            width: 1,
            depth: 1,
            unit: "m",
            manualVolumeM3: volM3,
            estimatedSteelKgPerM3: inputs.preliminarySteelKgPerM3 || 85,
          },
        ],
      };
    }

    // Quick / Detailed mode options overrides
    if (activeInputs.estimateMode === "quick") {
      if (!activeInputs.includeShuttering) {
        finalInputs = { ...finalInputs, shutteringRatePerSqFt: 0 };
      }
      if (!activeInputs.includeLabour) {
        finalInputs = { ...finalInputs, labourRatePerM3: 0, labourRatePerSqFt: 0 };
      }
      if (steelEntryMode === "actual_weight" && customSteelTotalKg > 0) {
        // Adjust preliminary steel rate to match entered kg
        const rawVolM3 = finalInputs.elements.reduce((acc, el) => acc + calculateElementVolumeM3(el), 0);
        if (rawVolM3 > 0) {
          finalInputs = { ...finalInputs, preliminarySteelKgPerM3: activeInputs.customSteelTotalKg / rawVolM3 };
        }
      }
    } else {
      // Detailed Mode overrides
      if (steelEntryMode === "bbs" && bbsBars.length > 0) {
        finalInputs = { ...finalInputs, steelInputMode: "bbs", bbsBars };
      } else if (steelEntryMode === "actual_weight" && customSteelTotalKg > 0) {
        const rawVolM3 = finalInputs.elements.reduce((acc, el) => acc + calculateElementVolumeM3(el), 0);
        if (rawVolM3 > 0) {
          finalInputs = { ...finalInputs, preliminarySteelKgPerM3: customSteelTotalKg / rawVolM3 };
        }
      }
    }

    return calculateMasterRccEstimate(finalInputs);
  }, [
    inputs,
    directVolumeMode,
    directVolume,
    directVolumeUnit,
    estimateMode,
    includeShuttering,
    includeLabour,
    steelEntryMode,
    customSteelTotalKg,
    bbsBars,
  ]);

  // Expert Civil Engineering Insights
  const insights = useMemo(() => generateRccInsights(result), [result]);

  // Primary Action: Calculate Click
  const handleCalculateClick = () => {
    markCalculated();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Copy Summary
  const handleCopySummary = () => {
    const text = [
      `CalcZen RCC Construction Cost Estimate`,
      `---------------------------------------`,
      `Total Estimated Cost: ${formatINR(result.costSummary.grandTotalEstimatedCost)}`,
      result.costPerSquareFootSlab > 0 ? `Estimated Cost / sq ft: ₹${Math.round(result.costPerSquareFootSlab)}/sq ft` : ``,
      `Estimated Cost / m³: ₹${Math.round(result.costPerCubicMetre)}/m³`,
      `Total Concrete Volume: ${result.totalConcreteVolumeM3.toFixed(2)} m³ (${result.totalConcreteVolumeCft.toFixed(1)} cu ft)`,
      `Cement Required: ${Math.round(result.cementBagsRequired)} Bags (50kg each)`,
      `Steel Rebar: ${Math.round(result.totalSteelWeightKg)} kg (${result.totalSteelWeightTonnes.toFixed(2)} Tonnes)`,
      `Sand Required: ${result.sandVolumeCft.toFixed(1)} cu ft (${(result.sandVolumeCft / 100).toFixed(2)} Brass)`,
      `Stone Chips: ${result.aggregateVolumeCft.toFixed(1)} cu ft (${(result.aggregateVolumeCft / 100).toFixed(2)} Brass)`,
      `Shuttering Area: ${Math.round(result.totalShutteringAreaSqFt)} sq ft`,
      `Standards: IS 456:2000, IS 10262:2019, CPWD DSR`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Slab Thickness Warning Check
  const slabElement = inputs.elements.find((e) => e.type === "slab");
  const slabDepthWarning = useMemo(() => {
    if (!slabElement || directVolumeMode) return null;
    const depthInInches = slabElement.depth * (UNIT_TO_METRE_FACTORS[slabElement.depthUnit || slabElement.unit] || 1) / 0.0254;
    if (depthInInches > 24) {
      return `${slabElement.depth} ${slabElement.depthUnit || slabElement.unit} (${Math.round(depthInInches)} inches) is unusually thick for a typical residential roof slab. Residential slabs are typically 5 to 6 inches. Did you mean ${Math.round(slabElement.depth)} inches?`;
    }
    return null;
  }, [slabElement, directVolumeMode]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Estimate the cost of concrete, steel, cement, labour and shuttering for your construction project. Built following IS 456:2000, IS 10262:2019, and CPWD specifications."
      formula={`Wet Volume (m³) = Length × Width × Depth × Quantity\nDry Concrete Volume = Wet Volume × 1.54 (CPWD void factor)\nCement Bags = (Dry Vol × Cement Ratio / Total Ratio Parts) / 0.0347 m³\nSteel Weight (kg) = Total Bar Length (m) × (d² / 162) or Empirical Volume Rate\nTotal Cost = Materials + Steel + Shuttering + Labour + Machinery + Margins`}
      example={`For a 1,000 sq ft (40' × 25' × 5") roof slab in M20 concrete (1:1.5:3):\nConcrete Volume = 11.80 m³ (416.7 cu ft)\nCement Required = ~98 to 100 Bags (50 kg each)\nSand = ~145 cu ft (~1.45 Brass)\nStone Chips = ~290 cu ft (~2.90 Brass)\nSteel Rebar (~85 kg/m³) = ~1,003 kg (~1 Tonne)\nEstimated Casting Cost = ~₹2,00,000 to ₹2,40,000 (~₹200 to ₹240 / sq ft)`}
      faqs={blogContent.faqs!}
      blog={<CalculatorBlog content={blogContent} />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ========================================================= */}
        {/* TOP BAR: MODE SELECTOR & PRESETS                          */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/70 shadow-sm">
          {/* Two Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/50">
            <button
              type="button"
              onClick={() => setEstimateMode("quick")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                estimateMode === "quick"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quick Estimate
            </button>
            <button
              type="button"
              onClick={() => setEstimateMode("detailed")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                estimateMode === "detailed"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Detailed Estimate
            </button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset("slab_sample")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              1,000 sq ft Roof Slab
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("villa_frame")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors cursor-pointer border border-border/50"
            >
              Full Villa Frame
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
        {/* MAIN CALCULATOR CONTAINER (VERTICAL USER JOURNEY)         */}
        {/* ========================================================= */}
        <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* STEP 1: WHAT ARE YOU BUILDING? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base sm:text-lg font-bold text-foreground">
                Step 1: What are you building?
              </Label>
              <span className="text-xs text-muted-foreground font-medium">Select your RCC work</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {QUICK_WORK_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = quickWorkType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectQuickWorkType(type.id)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 shadow-md font-semibold ring-2 ring-amber-400/30"
                        : "bg-muted/20 hover:bg-muted/50 border-border/60 text-foreground"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-white" : "text-amber-500"}`} />
                    <span className="text-xs sm:text-sm font-semibold leading-tight">{type.title}</span>
                    <span className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? "text-amber-100" : "text-muted-foreground"}`}>
                      {type.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: ENTER YOUR DIMENSIONS */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label className="text-base sm:text-lg font-bold text-foreground">
                  Step 2: Enter your dimensions
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Enter length, width, and thickness. Thickness standardly defaults to inches.
                </p>
              </div>

              {quickWorkType === "slab" && (
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setDirectVolumeMode(false)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      !directVolumeMode
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Enter Dimensions
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectVolumeMode(true)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      directVolumeMode
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    I know the concrete volume
                  </button>
                </div>
              )}
            </div>

            {/* ABNORMAL SLAB THICKNESS WARNING */}
            {slabDepthWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{slabDepthWarning}</span>
              </div>
            )}

            {/* DIRECT VOLUME INPUT MODE */}
            {directVolumeMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold text-foreground">Total Concrete Volume</Label>
                  <div className="flex mt-1.5">
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={directVolume}
                      onChange={(e) => setDirectVolume(parseFloat(e.target.value) || 0)}
                      className="h-11 text-base rounded-r-none"
                    />
                    <select
                      value={directVolumeUnit}
                      onChange={(e) => setDirectVolumeUnit(e.target.value as "m3" | "cft")}
                      className="h-11 px-3 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground"
                    >
                      <option value="m3">m³</option>
                      <option value="cft">cu ft</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Standard residential 1,000 sq ft slab (5" thick) requires approximately <strong>11.8 m³ (417 cu ft)</strong> of concrete.</span>
                </div>
              </div>
            ) : (
              /* MEMBER DIMENSION CARDS */
              <div className="space-y-3">
                {inputs.elements.map((el, idx) => (
                  <div key={el.id} className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {el.name} ({el.type.toUpperCase()})
                      </span>
                      {inputs.elements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (inputs.elements.length <= 1) return;
                            setInputs((prev) => ({
                              ...prev,
                              elements: prev.elements.filter((item) => item.id !== el.id),
                            }));
                          }}
                          className="text-xs text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {/* COUNT */}
                      <div>
                        <Label className="text-xs font-semibold text-foreground">Quantity / Count</Label>
                        <Input
                          type="number"
                          min="1"
                          value={el.count}
                          onChange={(e) => updateElement(el.id, { count: parseInt(e.target.value) || 1 })}
                          className="h-11 mt-1 text-sm font-semibold"
                        />
                      </div>

                      {/* LENGTH */}
                      <div>
                        <Label className="text-xs font-semibold text-foreground">Length</Label>
                        <div className="flex mt-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={el.length}
                            onChange={(e) => updateElement(el.id, { length: parseFloat(e.target.value) || 0 })}
                            className="h-11 text-sm font-semibold rounded-r-none"
                          />
                          <select
                            value={el.unit}
                            onChange={(e) => {
                              const newUnit = e.target.value as DimensionUnit;
                              const converted = convertUnitValue(el.length, el.unit, newUnit);
                              updateElement(el.id, { length: converted, unit: newUnit });
                            }}
                            className="h-11 px-2.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground"
                          >
                            <option value="ft">ft</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                          </select>
                        </div>
                      </div>

                      {/* WIDTH */}
                      <div>
                        <Label className="text-xs font-semibold text-foreground">Width</Label>
                        <div className="flex mt-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={el.width}
                            onChange={(e) => updateElement(el.id, { width: parseFloat(e.target.value) || 0 })}
                            className="h-11 text-sm font-semibold rounded-r-none"
                          />
                          <select
                            value={el.widthUnit || el.unit}
                            onChange={(e) => {
                              const newUnit = e.target.value as DimensionUnit;
                              const currentUnit = el.widthUnit || el.unit;
                              const converted = convertUnitValue(el.width, currentUnit, newUnit);
                              updateElement(el.id, { width: converted, widthUnit: newUnit });
                            }}
                            className="h-11 px-2.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground"
                          >
                            <option value="ft">ft</option>
                            <option value="in">in</option>
                            <option value="m">m</option>
                          </select>
                        </div>
                      </div>

                      {/* DEPTH / THICKNESS (DEFAULTS TO INCHES!) */}
                      <div>
                        <Label className="text-xs font-semibold text-foreground">
                          {el.type === "slab" ? "Slab Thickness" : "Depth / Thickness"}
                        </Label>
                        <div className="flex mt-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={el.depth}
                            onChange={(e) => updateElement(el.id, { depth: parseFloat(e.target.value) || 0 })}
                            className="h-11 text-sm font-semibold rounded-r-none"
                          />
                          <select
                            value={el.depthUnit || "in"}
                            onChange={(e) => {
                              const newUnit = e.target.value as DimensionUnit;
                              const currentUnit = el.depthUnit || "in";
                              const converted = convertUnitValue(el.depth, currentUnit, newUnit);
                              updateElement(el.id, { depth: converted, depthUnit: newUnit });
                            }}
                            className="h-11 px-2.5 bg-muted border border-l-0 border-input rounded-r-md text-xs font-bold text-foreground"
                          >
                            <option value="in">in (inches)</option>
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="ft">ft</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ADD ANOTHER MEMBER BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    const newEl: RccElementItem = {
                      id: `member-${Date.now()}`,
                      name: `New Member #${inputs.elements.length + 1}`,
                      type: "beam",
                      count: 1,
                      length: 20,
                      width: 9,
                      depth: 12,
                      unit: "ft",
                      widthUnit: "in",
                      depthUnit: "in",
                      estimatedSteelKgPerM3: 100,
                    };
                    setInputs((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline pt-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add another RCC member (beam, column, or footing)</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: CONCRETE GRADE & MIX */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <Label className="text-base sm:text-lg font-bold text-foreground">
                Step 3: Concrete Grade
              </Label>
              <span className="text-xs text-muted-foreground font-medium">IS 456 Benchmark Mix</span>
            </div>

            <div className="space-y-2.5">
              <select
                value={inputs.concreteGrade}
                onChange={(e) => updateInputs({ concreteGrade: e.target.value as ConcreteGrade })}
                className="h-12 w-full px-4 bg-background border border-input rounded-xl text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="M20">M20 (1 : 1.5 : 3) — Standard for residential slabs, beams & columns (IS 456 minimum)</option>
                <option value="M25">M25 (1 : 1 : 2) — High-strength mix for heavy pillars, commercial floors & water tanks</option>
                <option value="M30">M30 — Heavy duty structural concrete</option>
                <option value="M15">M15 (1 : 2 : 4) — Non-structural plain concrete, foundation bed & flooring</option>
                <option value="custom">Custom Mix — Enter engineer-specified ratio</option>
              </select>

              {inputs.concreteGrade === "custom" && (
                <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                  <span className="text-xs font-semibold text-foreground block">Enter Mix Proportion (Cement : Sand : Stone Chips):</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Cement</Label>
                      <Input
                        type="number"
                        value={inputs.customMixRatio.cement}
                        onChange={(e) =>
                          updateInputs({
                            customMixRatio: { ...inputs.customMixRatio, cement: parseFloat(e.target.value) || 1 },
                          })
                        }
                        className="h-10 mt-1 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Sand</Label>
                      <Input
                        type="number"
                        value={inputs.customMixRatio.sand}
                        onChange={(e) =>
                          updateInputs({
                            customMixRatio: { ...inputs.customMixRatio, sand: parseFloat(e.target.value) || 1.5 },
                          })
                        }
                        className="h-10 mt-1 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Stone Chips</Label>
                      <Input
                        type="number"
                        value={inputs.customMixRatio.aggregate}
                        onChange={(e) =>
                          updateInputs({
                            customMixRatio: { ...inputs.customMixRatio, aggregate: parseFloat(e.target.value) || 3 },
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
                  <strong>Advisory:</strong> Nominal mixes (such as 1:1.5:3 for M20) are standard planning assumptions. Always consult your structural engineer's approved design mix for actual casting.
                </span>
              </div>
            </div>
          </div>

          {/* STEP 4: MATERIAL RATES */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base sm:text-lg font-bold text-foreground">
                  Step 4: Local Material Rates
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">Editable market prices for your location</p>
              </div>
              <span className="text-xs text-muted-foreground">INR (₹)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs font-semibold text-foreground">Cement (₹ / 50kg bag)</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.materialRates.cementPerBagINR}
                  onChange={(e) =>
                    updateInputs({
                      materialRates: { ...inputs.materialRates, cementPerBagINR: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="h-11 mt-1 text-sm font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Sand (₹ / cu ft)</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.materialRates.sandRateINR}
                  onChange={(e) =>
                    updateInputs({
                      materialRates: { ...inputs.materialRates, sandRateINR: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="h-11 mt-1 text-sm font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">Stone Chips (₹ / cu ft)</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.materialRates.aggregateRateINR}
                  onChange={(e) =>
                    updateInputs({
                      materialRates: { ...inputs.materialRates, aggregateRateINR: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="h-11 mt-1 text-sm font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground">TMT Steel (₹ / kg)</Label>
                <Input
                  type="number"
                  min="0"
                  value={inputs.steelRatePerKg}
                  onChange={(e) => updateInputs({ steelRatePerKg: parseFloat(e.target.value) || 0 })}
                  className="h-11 mt-1 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: STEEL, SHUTTERING & LABOUR OPTIONS */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <Label className="text-base sm:text-lg font-bold text-foreground block">
              Step 5: Steel, Shuttering & Labour Setup
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* STEEL SETTING */}
              <div className={`p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2 ${steelEntryMode === "bbs" ? "sm:col-span-3" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground block">Steel Reinforcement</span>
                  {steelEntryMode === "bbs" && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                      {Math.round(calculateSteelWeightFromBbs(bbsBars))} kg rebar calculated
                    </span>
                  )}
                </div>

                <div className="flex gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSteelEntryMode("quick_rate")}
                    className={`flex-1 py-1 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${
                      steelEntryMode === "quick_rate"
                        ? "bg-amber-500 text-white border-amber-600 font-semibold"
                        : "bg-background text-muted-foreground border-border/60"
                    }`}
                  >
                    Quick (~85 kg/m³)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSteelEntryMode("actual_weight")}
                    className={`flex-1 py-1 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${
                      steelEntryMode === "actual_weight"
                        ? "bg-amber-500 text-white border-amber-600 font-semibold"
                        : "bg-background text-muted-foreground border-border/60"
                    }`}
                  >
                    Enter kg
                  </button>
                  {estimateMode === "detailed" && (
                    <button
                      type="button"
                      onClick={() => setSteelEntryMode("bbs")}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${
                        steelEntryMode === "bbs"
                          ? "bg-amber-500 text-white border-amber-600 font-semibold"
                          : "bg-background text-muted-foreground border-border/60"
                      }`}
                    >
                      BBS Schedule
                    </button>
                  )}
                </div>

                {steelEntryMode === "actual_weight" && (
                  <div className="pt-1">
                    <Label className="text-[11px] text-muted-foreground">Total TMT Steel (kg)</Label>
                    <Input
                      type="number"
                      value={customSteelTotalKg || Math.round(result.totalSteelWeightKg)}
                      onChange={(e) => setCustomSteelTotalKg(parseFloat(e.target.value) || 0)}
                      className="h-9 mt-1 text-xs font-semibold"
                    />
                  </div>
                )}

                {/* DETAILED BBS TABLE */}
                {steelEntryMode === "bbs" && (
                  <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                          <tr>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2">Diameter</th>
                            <th className="py-2 px-2">No. of Bars</th>
                            <th className="py-2 px-2">Length (m)</th>
                            <th className="py-2 px-2 text-right">Wt (kg)</th>
                            <th className="py-2 px-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-mono">
                          {bbsBars.map((bar) => {
                            const barWt = (bar.totalBarsCount || 1) * (bar.lengthPerBarM || 0) * getRebarUnitWeightKgPerM(bar.diameterMm);
                            return (
                              <tr key={bar.id} className="hover:bg-muted/10 font-sans">
                                <td className="py-1.5 px-2 font-medium">
                                  <Input
                                    type="text"
                                    value={bar.memberDescription}
                                    onChange={(e) =>
                                      setBbsBars((prev) =>
                                        prev.map((b) => (b.id === bar.id ? { ...b, memberDescription: e.target.value } : b))
                                      )
                                    }
                                    className="h-8 text-xs min-w-[140px]"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <select
                                    value={bar.diameterMm}
                                    onChange={(e) =>
                                      setBbsBars((prev) =>
                                        prev.map((b) => (b.id === bar.id ? { ...b, diameterMm: parseInt(e.target.value) || 10 } : b))
                                      )
                                    }
                                    className="h-8 px-2 bg-background border border-input rounded text-xs font-bold font-mono"
                                  >
                                    {[8, 10, 12, 16, 20, 25].map((d) => (
                                      <option key={d} value={d}>{d} mm</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-1.5 px-2">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={bar.totalBarsCount}
                                    onChange={(e) => {
                                      const count = parseInt(e.target.value) || 1;
                                      setBbsBars((prev) =>
                                        prev.map((b) =>
                                          b.id === bar.id
                                            ? { ...b, totalBarsCount: count, barsPerMember: count, totalLengthM: count * b.lengthPerBarM }
                                            : b
                                        )
                                      );
                                    }}
                                    className="h-8 w-16 text-xs font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <Input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={bar.lengthPerBarM}
                                    onChange={(e) => {
                                      const len = parseFloat(e.target.value) || 0;
                                      setBbsBars((prev) =>
                                        prev.map((b) =>
                                          b.id === bar.id
                                            ? { ...b, lengthPerBarM: len, totalLengthM: b.totalBarsCount * len }
                                            : b
                                        )
                                      );
                                    }}
                                    className="h-8 w-16 text-xs font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2 text-right font-mono font-bold text-foreground">
                                  {Math.round(barWt)} kg
                                </td>
                                <td className="py-1.5 px-2 text-right">
                                  {bbsBars.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setBbsBars((prev) => prev.filter((b) => b.id !== bar.id))}
                                      className="text-muted-foreground hover:text-red-500 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newBar: any = {
                          id: `bar-${Date.now()}`,
                          memberDescription: `Rebar Mark #${bbsBars.length + 1}`,
                          barMark: `T${bbsBars.length + 1}`,
                          diameterMm: 12,
                          numberOfMembers: 1,
                          barsPerMember: 20,
                          totalBarsCount: 20,
                          lengthPerBarM: 6.0,
                          totalLengthM: 120.0,
                          shapeType: "straight",
                        };
                        setBbsBars((prev) => [...prev, newBar]);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline pt-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add rebar mark to schedule</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SHUTTERING SETTING */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <span className="text-xs font-bold text-foreground block">Shuttering / Formwork</span>
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeShuttering}
                    onChange={(e) => setIncludeShuttering(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Include Shuttering (@ ₹{inputs.shutteringRatePerSqFt}/sq ft)</span>
                </label>
                <span className="text-[11px] text-muted-foreground block">
                  Plywood, steel props, centering & staging
                </span>
              </div>

              {/* LABOUR SETTING */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                <span className="text-xs font-bold text-foreground block">Concreting Labour</span>
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeLabour}
                    onChange={(e) => setIncludeLabour(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Include Concreting Labour (@ ₹{inputs.labourRatePerM3}/m³)</span>
                </label>
                <span className="text-[11px] text-muted-foreground block">
                  Mixing, lifting, placing, compacting & curing
                </span>
              </div>
            </div>
          </div>

          {/* ADVANCED SETTINGS ACCORDION */}
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
                  (Dry factor, steel ratios, contractor margins & overlap deduction)
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Dry Volume Factor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={inputs.dryVolumeFactor}
                      onChange={(e) => updateInputs({ dryVolumeFactor: parseFloat(e.target.value) || 1.54 })}
                      className="h-10 mt-1 text-xs font-semibold"
                    />
                    <span className="text-[10px] text-muted-foreground">Standard 1.54 per CPWD</span>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Beam-Slab Overlap Method</Label>
                    <select
                      value={inputs.overlapDeductionMethod}
                      onChange={(e) => updateInputs({ overlapDeductionMethod: e.target.value as "gross" | "net_beam_slab" })}
                      className="h-10 mt-1 w-full px-3 bg-background border border-input rounded-md text-xs font-medium text-foreground"
                    >
                      <option value="gross">Gross Element Volume (Standard)</option>
                      <option value="net_beam_slab">Net Volume (Deduct 15% beam top)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Concrete Supply Method</Label>
                    <select
                      value={inputs.concreteSupplyMethod}
                      onChange={(e) => updateInputs({ concreteSupplyMethod: e.target.value as "site_mix" | "rmc" })}
                      className="h-10 mt-1 w-full px-3 bg-background border border-input rounded-md text-xs font-medium text-foreground"
                    >
                      <option value="site_mix">Site-Mix (Mixer Machine)</option>
                      <option value="rmc">Ready-Mix Concrete (RMC Transit)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/40">
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Contractor Profit (%)</Label>
                    <Input
                      type="number"
                      value={inputs.contractorProfitPct}
                      onChange={(e) => updateInputs({ contractorProfitPct: parseFloat(e.target.value) || 0 })}
                      className="h-10 mt-1 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Overheads (%)</Label>
                    <Input
                      type="number"
                      value={inputs.overheadsPct}
                      onChange={(e) => updateInputs({ overheadsPct: parseFloat(e.target.value) || 0 })}
                      className="h-10 mt-1 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-foreground">Contingency (%)</Label>
                    <Input
                      type="number"
                      value={inputs.contingencyPct}
                      onChange={(e) => updateInputs({ contingencyPct: parseFloat(e.target.value) || 0 })}
                      className="h-10 mt-1 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 6: BIG PRIMARY ACTION BUTTON */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleCalculateClick}
              className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995]"
            >
              Calculate RCC Construction Cost
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RESULTS SECTION (CLEAN, PROMINENT, UNCLUTTERED)           */}
        {/* ========================================================= */}
        <div ref={resultsRef} className="space-y-6 pt-2">
          {/* RESULT 1: TOTAL ESTIMATED COST HERO CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/40 shadow-xl space-y-5 text-center relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                Estimated RCC Construction Cost
              </span>
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-7xl font-extrabold text-foreground tracking-tight">
                  {formatINR(result.costSummary.grandTotalEstimatedCost)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                Based on your dimensions, material rates, and selected estimating assumptions.
              </p>
            </div>

            {/* SUPPORTING UNIT RATES (COST PER SQ FT & COST PER M3) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-4 border-t border-border/60 max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 text-left">
                <span className="text-xs text-muted-foreground block font-medium">Estimated Cost / sq ft</span>
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  {result.costPerSquareFootSlab > 0 ? `₹${Math.round(result.costPerSquareFootSlab)}` : `₹${Math.round(result.costPerCubicFoot * 0.42)}`}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">Slab casting rate</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-left">
                <span className="text-xs text-amber-700 dark:text-amber-300 block font-semibold">Unit Cost / m³</span>
                <span className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {formatINR(result.costPerCubicMetre)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">All-inclusive RCC volume</span>
              </div>
            </div>

            {/* ACTION BUTTONS: COPY, PDF, BOQ */}
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
                fileName="calczen-rcc-cost-estimate"
                buttonLabel="Save as PDF"
                calculatorName="RCC Construction Cost & Material Estimate"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBoqTable(!showBoqTable)}
                className="h-9 px-4 gap-2 text-xs sm:text-sm font-medium border-border/70 hover:bg-muted"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{showBoqTable || estimateMode === "detailed" ? "Hide BOQ Table" : "View Itemized BOQ"}</span>
              </Button>
            </div>
          </div>

          {/* EXPERT CIVIL ENGINEERING INSIGHTS & CHECKS */}
          {insights.length > 0 && (
            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Civil Engineering Insights & Guidelines
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Authoritative checks adhering to IS 456:2000 and CPWD Delhi Schedule of Rates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {insights.map((ins, i) => {
                  const isPositive = ins.type === "positive";
                  const isWarning = (ins.type as string) === "warning" || (ins.type as string) === "critical";
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                        isWarning
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                          : isPositive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                          : "bg-muted/20 border-border/60 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        {isWarning ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : isPositive ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                        <span>{ins.title}</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed pt-0.5">
                        {ins.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RESULT 2: WHAT YOU WILL NEED (MATERIAL TAKEOFF) */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              What You Will Need (Material & Labour Takeoff)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* CONCRETE VOLUME */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                  Concrete Volume
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {result.totalConcreteVolumeM3.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m³</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {result.totalConcreteVolumeCft.toFixed(0)} cu ft wet volume
                </div>
              </div>

              {/* CEMENT */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Cement Required
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {Math.round(result.cementBagsRequired)} <span className="text-sm font-normal text-muted-foreground">bags</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {result.cementMetricTonnes.toFixed(1)} MT (50 kg bags)
                </div>
              </div>

              {/* STEEL REBAR */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                  TMT Steel Rebar
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatNumber(result.totalSteelWeightKg, 0)} <span className="text-sm font-normal text-muted-foreground">kg</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {result.totalSteelWeightTonnes.toFixed(2)} MT + {Math.round(result.bindingWireKg)} kg wire
                </div>
              </div>

              {/* SAND */}
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-1">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider block">
                  Sand (Fine Agg)
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatNumber(result.sandVolumeCft, 0)} <span className="text-sm font-normal text-muted-foreground">cu ft</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {(result.sandVolumeCft / 100).toFixed(2)} Brass ({result.sandMetricTonnes.toFixed(1)} MT)
                </div>
              </div>

              {/* STONE CHIPS */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                  Stone Chips (Gitti)
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatNumber(result.aggregateVolumeCft, 0)} <span className="text-sm font-normal text-muted-foreground">cu ft</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {(result.aggregateVolumeCft / 100).toFixed(2)} Brass ({result.aggregateMetricTonnes.toFixed(1)} MT)
                </div>
              </div>

              {/* SHUTTERING AREA */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                  Shuttering Area
                </span>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatNumber(result.totalShutteringAreaSqFt, 0)} <span className="text-sm font-normal text-muted-foreground">sq ft</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {result.totalShutteringAreaSqM.toFixed(1)} m² formwork
                </div>
              </div>
            </div>
          </div>

          {/* RESULT 3: COST BREAKDOWN LIST */}
          <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Cost Breakdown</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Concrete Materials</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costSummary.totalConcreteMaterialCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">Cement, sand & stone chips</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Steel & Wire</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costSummary.steelCost + result.costSummary.bindingWireCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">TMT rebar & binding wire</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Shuttering / Formwork</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costSummary.shutteringCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">Props, plywood & staging</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/50">
                <span className="text-xs text-muted-foreground block font-medium">Labour & Machinery</span>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {formatINR(result.costSummary.labourCost + result.costSummary.machineryCost)}
                </span>
                <span className="text-[11px] text-muted-foreground block">Concreting crew & mixer</span>
              </div>
            </div>
          </div>

          {/* RESULT 4: MEMBER BREAKDOWN (IF MULTIPLE ELEMENTS PRESENT) */}
          {result.elementVolumes.length > 1 && (
            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Cost by Structural Member</h3>
              <div className="space-y-2.5">
                {result.elementVolumes.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-foreground block">{ev.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ev.volumeM3.toFixed(2)} m³ ({ev.volumeCft.toFixed(0)} cu ft) • ~{Math.round(ev.steelKg)} kg steel
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-foreground block">
                        {ev.shareOfVolumePct.toFixed(0)}% volume share
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(ev.shutteringAreaSqFt)} sq ft formwork
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ITEMIZED MASTER BOQ TABLE (COLLAPSIBLE / EXPANDABLE) */}
          {(showBoqTable || estimateMode === "detailed") && (
            <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">Master Itemized Bill of Quantities (BOQ)</h4>
                  <p className="text-xs text-muted-foreground">Consolidated quantity takeoff and financial rates per CPWD schedule</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {result.boqItems.length} Bill Items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {result.boqItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-medium text-foreground">{item.description}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{item.category}</td>
                        <td className="py-2.5 px-3 font-mono">{item.quantityFormatted}</td>
                        <td className="py-2.5 px-3 font-mono">{formatINR(item.unitRateINR || item.rate || 0)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                          {formatINR(item.totalCostINR || item.amount || 0)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-amber-500/10 font-bold">
                      <td colSpan={4} className="py-3 px-3 text-foreground text-sm">Grand Total RCC Estimate:</td>
                      <td className="py-3 px-3 text-right text-base text-amber-700 dark:text-amber-300 font-extrabold font-mono">
                        {formatINR(result.costSummary.grandTotalEstimatedCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESULT 5: HOW WE CALCULATED IT (ACCORDION) */}
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
                    How did we calculate your estimate?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step breakdown using your actual dimensions
                  </p>
                </div>
              </div>
              {showHowCalculated ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showHowCalculated && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">1. Concrete Volume:</strong>
                  Your total wet concrete volume across all members is <strong>{result.totalConcreteVolumeM3.toFixed(2)} m³</strong> ({result.totalConcreteVolumeCft.toFixed(0)} cu ft).
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">2. Dry Material Allowance:</strong>
                  To fill voids between stones and sand, we multiplied wet volume by the standard <strong>1.54 factor</strong> = <strong>{(result.totalConcreteVolumeM3 * 1.54).toFixed(2)} m³</strong> dry ingredients.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">3. Cement, Sand & Aggregate:</strong>
                  Using the {inputs.concreteGrade} mix, you require <strong>{Math.round(result.cementBagsRequired)} bags of cement</strong>, <strong>{formatNumber(result.sandVolumeCft, 0)} cu ft of sand</strong>, and <strong>{formatNumber(result.aggregateVolumeCft, 0)} cu ft of stone chips</strong>.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">4. Steel Reinforcement:</strong>
                  Based on standard civil rule-of-thumb ratios (~80–120 kg/m³), you need approximately <strong>{formatNumber(result.totalSteelWeightKg, 0)} kg of TMT steel</strong> ({result.totalSteelWeightTonnes.toFixed(2)} Tonnes) plus {Math.round(result.bindingWireKg)} kg binding wire.
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <strong className="text-foreground block mb-0.5">5. Formwork & Concreting Labour:</strong>
                  Shuttering area equals <strong>{formatNumber(result.totalShutteringAreaSqFt, 0)} sq ft</strong> ({formatINR(result.costSummary.shutteringCost)}), and concreting labour equals <strong>{formatINR(result.costSummary.labourCost)}</strong>.
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground font-semibold">
                  6. Adding material, steel, shuttering, labour, machinery and overheads yields a final estimated construction budget of <strong>{formatINR(result.costSummary.grandTotalEstimatedCost)}</strong>.
                </div>
              </div>
            )}
          </div>

          {/* RESULT 6: TECHNICAL CALCULATION DETAILS (ACCORDION) */}
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
                    IS 456:2000, IS 10262:2019, IS 1786 rebar formulas & CPWD norms
                  </p>
                </div>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="font-bold text-foreground mb-1">Standard Steel Weight Formula (IS 1786):</div>
                  <div className="text-muted-foreground">Weight per metre (kg/m) = d² / 162 (where d is rebar diameter in mm).</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="font-bold text-foreground mb-1">Dry Volume Void Shrinkage Factor:</div>
                  <div className="text-muted-foreground">Dry Volume = Wet Volume × 1.54 (accounting for 54% void shrinkage between coarse stones & sand).</div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="font-bold text-foreground mb-1">Cement Bulk Density:</div>
                  <div className="text-muted-foreground">1,440 kg/m³ per IS 456. One 50 kg bag occupies ~0.0347 m³ (1.226 cu ft).</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
