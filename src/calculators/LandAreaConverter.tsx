import { useMemo, useState } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog, { type BlogContent } from "@/components/CalculatorBlog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalculateButton } from "@/components/CalculateButton";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";
import { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";
import {
  convertLandArea,
  type BighaType,
  type StandardUnit,
  type UnitConversionResult,
  BIGHA_SQ_FT,
} from "@/lib/calc/land-area-converter";
import { landAreaConverterContent } from "@/data/content/land-area-converter";
import {
  Maximize2,
  Compass,
  RotateCcw,
  Sparkles,
  MapPin,
  Table,
  Layers,
  Info,
} from "lucide-react";

const UNIT_LABELS: Record<StandardUnit, { name: string; region: string }> = {
  acre: { name: "Acre", region: "Pan-India Standard" },
  guntha: { name: "Guntha", region: "MH, KA, GJ" },
  cent: { name: "Cent", region: "TN, KL, AP, TS" },
  sqFt: { name: "Square Feet (sq ft)", region: "Universal Construction" },
  sqYd: { name: "Gaj / Sq Yard", region: "North & Central India" },
  sqM: { name: "Square Meter (m²)", region: "Metric / Govt Survey" },
  hectare: { name: "Hectare", region: "Revenue & Forestry" },
  ground: { name: "Ground", region: "Tamil Nadu (Chennai)" },
  kanal: { name: "Kanal", region: "Punjab, Haryana, HP" },
  marla: { name: "Marla", region: "North India (1/20 Kanal)" },
  bigha: { name: "Bigha", region: "State-specific" },
  biswa: { name: "Biswa", region: "1/20 of local Bigha" },
};

export function LandAreaConverter() {
  const calc = getCalculator("land-area-converter")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [inputValue, setInputValue] = useState<number | "">(1);
  const [fromUnit, setFromUnit] = useState<StandardUnit>("acre");
  const [bighaType, setBighaType] = useState<BighaType>("up_pucca");
  const [customBighaSqFt, setCustomBighaSqFt] = useState<number | "">(27225);

  // Snapshot State for Calculated Results
  const [calcValue, setCalcValue] = useState<number>(1);
  const [calcFromUnit, setCalcFromUnit] = useState<StandardUnit>("acre");
  const [calcBighaType, setCalcBighaType] = useState<BighaType>("up_pucca");
  const [calcCustomBighaSqFt, setCalcCustomBighaSqFt] = useState<number>(27225);

  // Derived Calculation Result
  const result: UnitConversionResult = useMemo(() => {
    return convertLandArea({
      value: calcValue,
      fromUnit: calcFromUnit,
      bighaType: calcBighaType,
      customBighaSqFt: calcCustomBighaSqFt,
    });
  }, [calcValue, calcFromUnit, calcBighaType, calcCustomBighaSqFt]);

  // Outdated change detection
  const isOutdated =
    hasResult &&
    (inputValue !== calcValue ||
      fromUnit !== calcFromUnit ||
      bighaType !== calcBighaType ||
      customBighaSqFt !== calcCustomBighaSqFt);

  const handleCalculate = () => {
    setCalcValue(Number(inputValue) || 0);
    setCalcFromUnit(fromUnit);
    setCalcBighaType(bighaType);
    setCalcCustomBighaSqFt(Number(customBighaSqFt) || 27225);
    markCalculated();
  };

  const handleReset = () => {
    setInputValue(1);
    setFromUnit("acre");
    setBighaType("up_pucca");
    setCustomBighaSqFt(27225);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={landAreaConverterContent.intro}
      formula={landAreaConverterContent.formula}
      example={
        landAreaConverterContent.workedExample
          ? `${landAreaConverterContent.workedExample.description}\n\n` +
            landAreaConverterContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={landAreaConverterContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Land Area Converter</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {landAreaConverterContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{landAreaConverterContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {landAreaConverterContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {landAreaConverterContent.quickReferenceTable.rows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-muted/40 transition-colors">
                      {row.map((cell, ci) => (
                        <td key={ci} className={`py-2.5 px-3 ${ci === 0 ? "font-medium text-foreground" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Land Measurement Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {landAreaConverterContent.mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-6 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Compass className="w-5 h-5 text-primary" />
              Land Parcel Input
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>

          {/* Area Value */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Land Measurement Value
            </Label>
            <Input
              type="number"
              step="any"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 2.5"
              className="font-medium text-base"
            />
          </div>

          {/* From Unit Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-foreground">
              Select Starting Unit
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  "acre",
                  "guntha",
                  "cent",
                  "sqFt",
                  "sqYd",
                  "sqM",
                  "bigha",
                  "ground",
                  "kanal",
                ] as StandardUnit[]
              ).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setFromUnit(u)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    fromUnit === u
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/60 hover:border-border text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="block text-xs font-semibold">{UNIT_LABELS[u].name}</span>
                  <span className="block text-[10px] text-muted-foreground">{UNIT_LABELS[u].region}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bigha Definition Selector */}
          <div className="space-y-3 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Regional Bigha Standard
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {bighaType === "custom"
                  ? `${customBighaSqFt} sq ft`
                  : `${BIGHA_SQ_FT[bighaType as Exclude<BighaType, "custom">]} sq ft`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                type="button"
                variant={bighaType === "up_pucca" ? "default" : "outline"}
                size="sm"
                className="justify-start text-xs h-9"
                onClick={() => setBighaType("up_pucca")}
              >
                UP / Bihar (27,225 sq ft)
              </Button>
              <Button
                type="button"
                variant={bighaType === "bengal" ? "default" : "outline"}
                size="sm"
                className="justify-start text-xs h-9"
                onClick={() => setBighaType("bengal")}
              >
                Bengal / Assam (14,400 sq ft)
              </Button>
              <Button
                type="button"
                variant={bighaType === "gujarat" ? "default" : "outline"}
                size="sm"
                className="justify-start text-xs h-9"
                onClick={() => setBighaType("gujarat")}
              >
                Gujarat Vigha (17,424 sq ft)
              </Button>
              <Button
                type="button"
                variant={bighaType === "mp" ? "default" : "outline"}
                size="sm"
                className="justify-start text-xs h-9"
                onClick={() => setBighaType("mp")}
              >
                MP Bigha (12,000 sq ft)
              </Button>
            </div>
          </div>

          <CalculateButton onClick={handleCalculate} />
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {isOutdated && <OutdatedResultBanner onCalculate={handleCalculate} />}

          {!hasResult ? (
            <EmptyResultPlaceholder
              message="Simultaneous Multi-Unit Conversion"
              subMessage="Enter your land area and choose your base unit, then click Convert to view instant equivalents across Acres, Gunthas, Cents, Gaj, Square Feet, and regional Bighas."
            />
          ) : (
            <div className="space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-foreground">
                  <span className="text-[11px] font-semibold text-primary block uppercase tracking-wider">
                    Square Feet (Sq Ft)
                  </span>
                  <span className="text-2xl font-extrabold text-foreground block mt-1">
                    {result.sqFt.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">Standard Indian Plot Size</span>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-foreground">
                  <span className="text-[11px] font-semibold text-primary block uppercase tracking-wider">
                    Square Yards (Gaj)
                  </span>
                  <span className="text-2xl font-extrabold text-foreground block mt-1">
                    {result.sqYd.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">1 Gaj = 9 Square Feet</span>
                </div>

                <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 text-foreground">
                  <span className="text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                    Acre
                  </span>
                  <span className="text-xl font-bold text-foreground block mt-1">
                    {result.acre.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">43,560 Sq Ft</span>
                </div>

                <div className="bg-muted/40 border border-border/80 rounded-2xl p-4 text-foreground">
                  <span className="text-[11px] font-semibold text-muted-foreground block uppercase tracking-wider">
                    Square Meters (m²)
                  </span>
                  <span className="text-xl font-bold text-foreground block mt-1">
                    {result.sqM.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">Government Revenue Metric</span>
                </div>
              </div>

              {/* Complete Multi-Unit Table */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Table className="w-4 h-4 text-primary" />
                  Complete Land Unit Equivalents
                </h3>

                <div className="divide-y divide-border/40 text-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Guntha (Maharashtra, Karnataka):</span>
                    <span className="font-bold text-foreground">{result.guntha} Guntha</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Cent (Kerala, Tamil Nadu, AP, Telangana):</span>
                    <span className="font-bold text-foreground">{result.cent} Cent</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Ground (Tamil Nadu / Chennai):</span>
                    <span className="font-bold text-foreground">{result.ground} Ground</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Bigha ({UNIT_LABELS.bigha.name}):</span>
                    <span className="font-bold text-foreground">{result.bigha} Bigha</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Biswa (1/20 Bigha):</span>
                    <span className="font-bold text-foreground">{result.biswa} Biswa</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Kanal (Punjab, Haryana, HP):</span>
                    <span className="font-bold text-foreground">{result.kanal} Kanal</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Marla (1/20 Kanal):</span>
                    <span className="font-bold text-foreground">{result.marla} Marla</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-medium">Hectare (Metric):</span>
                    <span className="font-bold text-foreground">{result.hectare} Hectare</span>
                  </div>
                </div>
              </div>

              {/* Advisory Callout */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-start gap-3">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Revenue record note:</strong> While imperial formulas (e.g. 1 Acre = 43,560 sq ft) are nationwide legal standards, local revenue sub-registrar offices (tehsil / patwari records) may register land in 7/12 extracts or Khatoni in metric hectares or local biswa. Always reconcile contract deeds against state survey maps before land settlement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
