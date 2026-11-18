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
  calculateTiles,
  type TileCalculatorResult,
  type TileDimensionUnit,
  type TilePreset,
} from "@/lib/calc/tile-calculator";
import { tileCalculatorContent } from "@/data/content/tile-calculator";
import {
  Grid,
  Building2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Package,
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

export function TileCalculator() {
  const calc = getCalculator("tile-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [roomLength, setRoomLength] = useState<number | "">(12);
  const [roomWidth, setRoomWidth] = useState<number | "">(10);
  const [unit, setUnit] = useState<TileDimensionUnit>("feet");
  const [deductionSqFt, setDeductionSqFt] = useState<number | "">(0);
  const [tilePreset, setTilePreset] = useState<TilePreset>("2x2ft");
  const [wastagePct, setWastagePct] = useState<number | "">(10);
  const [tilesPerBox, setTilesPerBox] = useState<number | "">(4);
  const [pricePerSqFt, setPricePerSqFt] = useState<number | "">(55);

  // Snapshot State for Calculated Results
  const [calcRoomLength, setCalcRoomLength] = useState<number>(12);
  const [calcRoomWidth, setCalcRoomWidth] = useState<number>(10);
  const [calcUnit, setCalcUnit] = useState<TileDimensionUnit>("feet");
  const [calcDeductionSqFt, setCalcDeductionSqFt] = useState<number>(0);
  const [calcTilePreset, setCalcTilePreset] = useState<TilePreset>("2x2ft");
  const [calcWastagePct, setCalcWastagePct] = useState<number>(10);
  const [calcTilesPerBox, setCalcTilesPerBox] = useState<number>(4);
  const [calcPricePerSqFt, setCalcPricePerSqFt] = useState<number>(55);

  // Derived Calculation Result
  const result: TileCalculatorResult = useMemo(() => {
    return calculateTiles({
      roomLength: Number(calcRoomLength) || 0,
      roomWidth: Number(calcRoomWidth) || 0,
      unit: calcUnit,
      deductionAreaSqFt: Number(calcDeductionSqFt) || 0,
      tilePreset: calcTilePreset,
      wastagePct: Number(calcWastagePct) || 10,
      tilesPerBox: Number(calcTilesPerBox) || 4,
      pricePerSqFt: Number(calcPricePerSqFt) || 0,
    });
  }, [
    calcRoomLength,
    calcRoomWidth,
    calcUnit,
    calcDeductionSqFt,
    calcTilePreset,
    calcWastagePct,
    calcTilesPerBox,
    calcPricePerSqFt,
  ]);

  const isOutdated =
    hasResult &&
    (Number(roomLength) !== calcRoomLength ||
      Number(roomWidth) !== calcRoomWidth ||
      unit !== calcUnit ||
      Number(deductionSqFt) !== calcDeductionSqFt ||
      tilePreset !== calcTilePreset ||
      Number(wastagePct) !== calcWastagePct ||
      Number(tilesPerBox) !== calcTilesPerBox ||
      Number(pricePerSqFt) !== calcPricePerSqFt);

  const isButtonDisabled =
    !roomLength || Number(roomLength) <= 0 || !roomWidth || Number(roomWidth) <= 0;

  const handleCalculate = () => {
    setCalcRoomLength(Number(roomLength) || 0);
    setCalcRoomWidth(Number(roomWidth) || 0);
    setCalcUnit(unit);
    setCalcDeductionSqFt(Number(deductionSqFt) || 0);
    setCalcTilePreset(tilePreset);
    setCalcWastagePct(Number(wastagePct) || 10);
    setCalcTilesPerBox(Number(tilesPerBox) || 4);
    setCalcPricePerSqFt(Number(pricePerSqFt) || 0);
    markCalculated();
  };

  const handleReset = () => {
    setRoomLength(12);
    setRoomWidth(10);
    setUnit("feet");
    setDeductionSqFt(0);
    setTilePreset("2x2ft");
    setWastagePct(10);
    setTilesPerBox(4);
    setPricePerSqFt(55);
    resetCalculated();
  };

  const blogData: BlogContent = {
    title: tileCalculatorContent.h1,
    description: tileCalculatorContent.intro,
    articleHtml: `
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-foreground">How to Use This Floor &amp; Wall Tile Calculator</h2>
        <ol class="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${tileCalculatorContent.howToUseSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>

      <section class="space-y-4 mt-8">
        <h2 class="text-xl font-bold text-foreground">Tile Coverage &amp; Box Formula</h2>
        <p class="text-muted-foreground text-sm sm:text-base leading-relaxed">${tileCalculatorContent.formula}</p>
        <div class="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3">
          <h3 class="font-semibold text-foreground text-base">Worked Real-World Example</h3>
          <p class="text-sm text-muted-foreground">${tileCalculatorContent.workedExample.description}</p>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="border-b border-border/60">
                  <th class="py-2 font-medium text-foreground">Parameter</th>
                  <th class="py-2 font-medium text-foreground">Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/40 text-muted-foreground">
                ${tileCalculatorContent.workedExample.table
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
        <h2 class="text-xl font-bold text-foreground">${tileCalculatorContent.quickReferenceTable.title}</h2>
        <div class="overflow-x-auto rounded-xl border border-border bg-card p-2 sm:p-4">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b border-border/60 text-foreground font-medium">
                ${tileCalculatorContent.quickReferenceTable.headers
                  .map((h) => `<th class="py-2.5 px-3">${h}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody class="divide-y divide-border/40 text-muted-foreground">
              ${tileCalculatorContent.quickReferenceTable.rows
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
        <h2 class="text-xl font-bold text-foreground">Common Tiling Mistakes &amp; Precautions</h2>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
          ${tileCalculatorContent.mistakes.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      </section>
    `,
    faqs: tileCalculatorContent.faqs,
  };

  return (
    <CalculatorPageLayout calc={calc}>
      <div className="space-y-6">
        {/* Input Form Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Grid className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base font-semibold text-foreground">Room Dimensions &amp; Tile Format</h2>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setUnit("feet")}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  unit === "feet" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                Feet
              </button>
              <button
                type="button"
                onClick={() => setUnit("meters")}
                className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  unit === "meters" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"
                }`}
              >
                Metres
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Standard Tile Size</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-1.5">
              {[
                { id: "2x2ft", label: "2×2 Ft (600×600)" },
                { id: "2x4ft", label: "2×4 Ft (600×1200)" },
                { id: "1x1ft", label: "1×1 Ft (300×300)" },
                { id: "800x800mm", label: "800×800 mm" },
                { id: "600x600mm", label: "600×600 mm" },
              ].map((tp) => (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => setTilePreset(tp.id as TilePreset)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors ${
                    tilePreset === tp.id
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-card border-border hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="roomLength" className="text-sm font-medium">
                Room Length ({unit === "feet" ? "ft" : "m"})
              </Label>
              <Input
                id="roomLength"
                type="number"
                step="0.5"
                min={1}
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <Label htmlFor="roomWidth" className="text-sm font-medium">
                Room Width ({unit === "feet" ? "ft" : "m"})
              </Label>
              <Input
                id="roomWidth"
                type="number"
                step="0.5"
                min={1}
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 10"
              />
            </div>

            <div>
              <Label htmlFor="deduction" className="text-sm font-medium">
                Deduction Area ({unit === "feet" ? "sq ft" : "m²"})
              </Label>
              <Input
                id="deduction"
                type="number"
                min={0}
                value={deductionSqFt}
                onChange={(e) => setDeductionSqFt(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 0"
              />
              <p className="text-xs text-muted-foreground mt-1">Built-in wardrobes, island offsets</p>
            </div>

            <div>
              <Label htmlFor="wastagePct" className="text-sm font-medium">
                Cutting Wastage (%)
              </Label>
              <Input
                id="wastagePct"
                type="number"
                min={0}
                max={30}
                value={wastagePct}
                onChange={(e) => setWastagePct(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 10"
              />
              <p className="text-xs text-muted-foreground mt-1">10% straight grid, 15% diagonal</p>
            </div>

            <div>
              <Label htmlFor="tilesPerBox" className="text-sm font-medium">
                Tiles per Box
              </Label>
              <Input
                id="tilesPerBox"
                type="number"
                min={1}
                max={25}
                value={tilesPerBox}
                onChange={(e) => setTilesPerBox(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 4"
              />
              <p className="text-xs text-muted-foreground mt-1">Typically 4 pcs for 2×2 ft, 2 pcs for 2×4 ft</p>
            </div>

            <div>
              <Label htmlFor="pricePerSqFt" className="text-sm font-medium">
                Tile Price (₹ / sq ft optional)
              </Label>
              <Input
                id="pricePerSqFt"
                type="number"
                min={0}
                value={pricePerSqFt}
                onChange={(e) => setPricePerSqFt(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1.5"
                placeholder="e.g. 55"
              />
              <p className="text-xs text-muted-foreground mt-1">Standard vitrified tiles: ₹45 - ₹85/sq ft</p>
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
            title="Calculate Tiles, Boxes &amp; Renovation Cost"
            description="Enter room dimensions and choose tile size above, then click Calculate to view required tiles with cutting allowance, packaging box counts, and estimated cost."
          />
        ) : (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-amber-600/30 bg-amber-600/5 dark:bg-amber-600/10 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Total Tiles Needed
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.tilesWithWastage} Pieces
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Includes {calcWastagePct}% cutting wastage</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commercial Boxes</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.boxesNeeded} Boxes</p>
                <p className="mt-1 text-xs text-muted-foreground">{calcTilesPerBox} tiles per box</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Floor Area</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{result.roomAreaSqFt} Sq Ft</p>
                <p className="mt-1 text-xs text-muted-foreground">{result.roomAreaSqM} m²</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimated Cost</span>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">{formatINR(result.totalCost)}</p>
                <p className="mt-1 text-xs text-muted-foreground">At ₹{calcPricePerSqFt}/sq ft</p>
              </div>
            </div>

            {/* Packaging & Coverage Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Tile Packaging &amp; Surface Coverage Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
                <div>
                  <span className="text-xs text-muted-foreground">Base Tile Count:</span>
                  <p className="font-semibold text-foreground">{result.rawTilesNeeded} Tiles</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Wastage Tiles Added:</span>
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    +{result.tilesWithWastage - result.rawTilesNeeded} Tiles
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total Tiles Ordered:</span>
                  <p className="font-semibold text-foreground">{result.boxesNeeded * result.tilesPerBox} Pieces ({result.boxesNeeded} Boxes)</p>
                </div>
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

export default TileCalculator;

