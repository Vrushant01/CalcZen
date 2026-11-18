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
  calculateBricks,
  type BrickCalculatorResult,
  type BrickDimensionUnit,
  type BrickPreset,
  type MortarRatio,
} from "@/lib/calc/brick-calculator";
import { brickCalculatorContent } from "@/data/content/brick-calculator";
import {
  Boxes,
  Building2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Layers,
  Info,
} from "lucide-react";

function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function BrickCalculator() {
  const calc = getCalculator("brick-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [wallLength, setWallLength] = useState<number | "">(10);
  const [wallHeight, setWallHeight] = useState<number | "">(3);
  const [wallThickness, setWallThickness] = useState<number | "">(0.23); // 230mm (9 inch)
  const [unit, setUnit] = useState<BrickDimensionUnit>("meters");
  const [openingsArea, setOpeningsArea] = useState<number | "">(3);
  const [brickPreset, setBrickPreset] = useState<BrickPreset>("modular");
  const [mortarRatio, setMortarRatio] = useState<MortarRatio>("1:5");
  const [wastagePct, setWastagePct] = useState<number | "">(5);
  const [brickRate, setBrickRate] = useState<number | "">(9);
  const [cementRate, setCementRate] = useState<number | "">(380);
  const [sandRate, setSandRate] = useState<number | "">(1200);

  // Snapshot State for Calculated Results
  const [calcWallLength, setCalcWallLength] = useState<number>(10);
  const [calcWallHeight, setCalcWallHeight] = useState<number>(3);
  const [calcWallThickness, setCalcWallThickness] = useState<number>(0.23);
  const [calcUnit, setCalcUnit] = useState<BrickDimensionUnit>("meters");
  const [calcOpeningsArea, setCalcOpeningsArea] = useState<number>(3);
  const [calcBrickPreset, setCalcBrickPreset] = useState<BrickPreset>("modular");
  const [calcMortarRatio, setCalcMortarRatio] = useState<MortarRatio>("1:5");
  const [calcWastagePct, setCalcWastagePct] = useState<number>(5);
  const [calcBrickRate, setCalcBrickRate] = useState<number>(9);
  const [calcCementRate, setCalcCementRate] = useState<number>(380);
  const [calcSandRate, setCalcSandRate] = useState<number>(1200);

  // Derived Calculation Result
  const result: BrickCalculatorResult = useMemo(() => {
    return calculateBricks({
      wallLength: Number(calcWallLength) || 0,
      wallHeight: Number(calcWallHeight) || 0,
      wallThickness: Number(calcWallThickness) || 0,
      unit: calcUnit,
      openingsAreaSqM: Number(calcOpeningsArea) || 0,
      brickPreset: calcBrickPreset,
      mortarRatio: calcMortarRatio,
      wastagePct: Number(calcWastagePct) || 0,
      brickRatePerPiece: Number(calcBrickRate) || 0,
      cementBagRate: Number(calcCementRate) || 0,
      sandRatePerTonne: Number(calcSandRate) || 0,
    });
  }, [
    calcWallLength,
    calcWallHeight,
    calcWallThickness,
    calcUnit,
    calcOpeningsArea,
    calcBrickPreset,
    calcMortarRatio,
    calcWastagePct,
    calcBrickRate,
    calcCementRate,
    calcSandRate,
  ]);

  const isOutdated =
    hasResult &&
    (Number(wallLength) !== calcWallLength ||
      Number(wallHeight) !== calcWallHeight ||
      Number(wallThickness) !== calcWallThickness ||
      unit !== calcUnit ||
      Number(openingsArea) !== calcOpeningsArea ||
      brickPreset !== calcBrickPreset ||
      mortarRatio !== calcMortarRatio ||
      Number(wastagePct) !== calcWastagePct ||
      Number(brickRate) !== calcBrickRate ||
      Number(cementRate) !== calcCementRate ||
      Number(sandRate) !== calcSandRate);

  const isButtonDisabled =
    !wallLength ||
    Number(wallLength) <= 0 ||
    !wallHeight ||
    Number(wallHeight) <= 0 ||
    !wallThickness ||
    Number(wallThickness) <= 0;

  const handleCalculate = () => {
    setCalcWallLength(Number(wallLength) || 0);
    setCalcWallHeight(Number(wallHeight) || 0);
    setCalcWallThickness(Number(wallThickness) || 0);
    setCalcUnit(unit);
    setCalcOpeningsArea(Number(openingsArea) || 0);
    setCalcBrickPreset(brickPreset);
    setCalcMortarRatio(mortarRatio);
    setCalcWastagePct(Number(wastagePct) || 0);
    setCalcBrickRate(Number(brickRate) || 0);
    setCalcCementRate(Number(cementRate) || 0);
    setCalcSandRate(Number(sandRate) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setWallLength(10);
    setWallHeight(3);
    setWallThickness(0.23);
    setUnit("meters");
    setOpeningsArea(3);
    setBrickPreset("modular");
    setMortarRatio("1:5");
    setWastagePct(5);
    setBrickRate(9);
    setCementRate(380);
    setSandRate(1200);
    resetCalculated();
  };

  const blogData: BlogContent = {
    title: brickCalculatorContent.h1,
    description: brickCalculatorContent.intro,
    articleHtml: `
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-foreground">How to Use This Brick &amp; Mortar Calculator</h2>
        <ol class="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${brickCalculatorContent.howToUseSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">Masonry Volume &amp; Mortar Formula</h2>
        <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">${brickCalculatorContent.formula}</p>
        <div class="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3">
          <h3 class="font-semibold text-foreground text-base">Worked Real-World Example</h3>
          <p class="text-sm text-muted-foreground">${brickCalculatorContent.workedExample.description}</p>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-border/60">
                  <th class="py-2 font-medium text-foreground">Parameter</th>
                  <th class="py-2 font-medium text-foreground">Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/40 text-muted-foreground">
                ${brickCalculatorContent.workedExample.table
                  .map(
                    (row) => `
                  <tr>
                    <td class="py-2">${row.label}</td>
                    <td class="py-2 font-medium text-foreground">${row.value}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">${brickCalculatorContent.quickReferenceTable.title}</h2>
        <div class="overflow-x-auto rounded-xl border border-border bg-card p-2 sm:p-4">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b border-border/60 text-foreground font-medium">
                ${brickCalculatorContent.quickReferenceTable.headers
                  .map((h) => `<th class="py-2.5 px-3">${h}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40 text-muted-foreground">
              ${brickCalculatorContent.quickReferenceTable.rows
                .map(
                  (r) => `
                <tr class="hover:bg-muted/40 transition-colors">
                  ${r.map((c, i) => `<td class="py-2.5 px-3 ${i === 0 ? "font-medium text-foreground" : ""}">${c}</td>`).join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">Common Brickwork Mistakes &amp; Precautions</h2>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${brickCalculatorContent.mistakes.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      </section>
    `,
    faqs: brickCalculatorContent.faqs,
  };

  return (
    <CalculatorPageLayout calc={calc}>
      <div className="space-y-6">
        {/* Input Form Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-semibold text-foreground">Wall Dimensions &amp; Brick Specifications</h2>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setUnit("meters")}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  unit === "meters" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                Metres
              </button>
              <button
                type="button"
                onClick={() => setUnit("feet")}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  unit === "feet" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                Feet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="wallLength" className="text-sm font-medium">
                Wall Length ({unit === "meters" ? "m" : "ft"})
              </Label>
              <Input
                id="wallLength"
                type="number"
                step="0.1"
                min={0.5}
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <Label htmlFor="wallHeight" className="text-sm font-medium">
                Wall Height ({unit === "meters" ? "m" : "ft"})
              </Label>
              <Input
                id="wallHeight"
                type="number"
                step="0.1"
                min={0.5}
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 3"
              />
            </div>

            <div>
              <Label htmlFor="wallThickness" className="text-sm font-medium">
                Wall Thickness ({unit === "meters" ? "m (e.g. 0.23m)" : "ft (e.g. 0.75ft / 9in)"})
              </Label>
              <Input
                id="wallThickness"
                type="number"
                step="0.01"
                min={0.05}
                value={wallThickness}
                onChange={(e) => setWallThickness(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 0.23"
              />
              <p className="text-xs text-muted-foreground mt-1">9 inch wall ≈ 0.23m (0.75 ft)</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Brick Type</Label>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => setBrickPreset("modular")}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                    brickPreset === "modular"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-card border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  Modular (190×90×90)
                </button>
                <button
                  type="button"
                  onClick={() => setBrickPreset("traditional")}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                    brickPreset === "traditional"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-card border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  Clay (230×110×70)
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Mortar Mix Ratio</Label>
              <div className="grid grid-cols-4 gap-1 mt-1.5">
                {(["1:3", "1:4", "1:5", "1:6"] as MortarRatio[]).map((mr) => (
                  <button
                    key={mr}
                    type="button"
                    onClick={() => setMortarRatio(mr)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      mortarRatio === mr
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {mr}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">1:4 (partitions) / 1:6 (9-inch walls)</p>
            </div>

            <div>
              <Label htmlFor="openingsArea" className="text-sm font-medium">
                Openings Deduction ({unit === "meters" ? "m²" : "sq ft"})
              </Label>
              <Input
                id="openingsArea"
                type="number"
                min={0}
                value={openingsArea}
                onChange={(e) => setOpeningsArea(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 3"
              />
              <p className="text-xs text-muted-foreground mt-1">Doors, windows, gates area</p>
            </div>
          </div>

          {/* Rates Section */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Material Rates (Optional Cost Estimation)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="brickRate" className="text-xs font-medium">
                  Brick Rate (₹ / piece)
                </Label>
                <Input
                  id="brickRate"
                  type="number"
                  min={0}
                  value={brickRate}
                  onChange={(e) => setBrickRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 9"
                />
              </div>

              <div>
                <Label htmlFor="cementRate" className="text-xs font-medium">
                  Cement Rate (₹ / 50kg bag)
                </Label>
                <Input
                  id="cementRate"
                  type="number"
                  min={0}
                  value={cementRate}
                  onChange={(e) => setCementRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 380"
                />
              </div>

              <div>
                <Label htmlFor="sandRate" className="text-xs font-medium">
                  Sand Rate (₹ / tonne)
                </Label>
                <Input
                  id="sandRate"
                  type="number"
                  min={0}
                  value={sandRate}
                  onChange={(e) => setSandRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 1200"
                />
              </div>

              <div>
                <Label htmlFor="wastage" className="text-xs font-medium">
                  Wastage Allowance (%)
                </Label>
                <Input
                  id="wastage"
                  type="number"
                  min={0}
                  max={20}
                  value={wastagePct}
                  onChange={(e) => setWastagePct(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <CalculateButton
              isOutdated={isOutdated}
              isDisabled={isButtonDisabled}
              onClick={handleCalculate}
            />
            <Button variant="outline" onClick={handleReset} className="gap-1.5 text-xs sm:text-sm">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Outdated Result Notification */}
        <OutdatedResultBanner isOutdated={isOutdated} onCalculate={handleCalculate} />

        {/* Results Section */}
        {!hasResult ? (
          <EmptyResultPlaceholder
            title="Estimate Brick, Cement &amp; Sand Requirements"
            description="Enter wall dimensions, brick style, and mortar mix ratio above, then click Calculate to compute required bricks, cement bags, sand weight, and total masonry material expenditure."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-amber-600/30 bg-amber-600/5 dark:bg-amber-600/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Bricks Needed
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.bricksWithWastage} Bricks
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Includes {calcWastagePct}% handling wastage</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cement Bags</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.cementBags} Bags</p>
                <p className="mt-1 text-xs text-muted-foreground">50 kg bags ({calcMortarRatio} mix)</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sand Required</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.sandWeightTonnes} Tonnes</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.sandVolumeM3} m³ (~{(result.sandVolumeM3 * 35.3147).toFixed(0)} cu ft)</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Cost</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.totalMaterialCost)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Bricks + Cement + Sand</p>
              </div>
            </div>

            {/* Bill of Quantities Breakdown Card */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground">Masonry Material Bill of Quantities (BOQ)</h3>
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Calculated Quantity</th>
                      <th className="py-2.5 px-3">Unit Rate</th>
                      <th className="py-2.5 px-3">Estimated Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-foreground">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Bricks ({calcBrickPreset})</td>
                      <td className="py-2.5 px-3">{result.bricksWithWastage} pcs ({result.grossBricksRequired} base)</td>
                      <td className="py-2.5 px-3">₹{calcBrickRate} / piece</td>
                      <td className="py-2.5 px-3 font-medium">{formatINR(result.brickCost)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Portland Cement (50kg bags)</td>
                      <td className="py-2.5 px-3">{result.cementBags} bags</td>
                      <td className="py-2.5 px-3">₹{calcCementRate} / bag</td>
                      <td className="py-2.5 px-3 font-medium">{formatINR(result.cementCost)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Masonry Sand</td>
                      <td className="py-2.5 px-3">{result.sandWeightTonnes} tonnes ({result.sandVolumeM3} m³)</td>
                      <td className="py-2.5 px-3">₹{calcSandRate} / tonne</td>
                      <td className="py-2.5 px-3 font-medium">{formatINR(result.sandCost)}</td>
                    </tr>
                    <tr className="bg-muted/30 font-bold">
                      <td className="py-2.5 px-3">Total Estimated Masonry Cost</td>
                      <td className="py-2.5 px-3" colSpan={2}>Net Wall Volume: {result.netWallVolumeM3} m³</td>
                      <td className="py-2.5 px-3 text-primary">{formatINR(result.totalMaterialCost)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rich SEO Content & FAQs Section */}
        <CalculatorBlog content={blogData} />
      </div>
    </CalculatorPageLayout>
  );
}

export default BrickCalculator;

