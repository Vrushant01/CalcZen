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
  calculatePaint,
  type PaintCalculatorInputs,
  type PaintCalculatorResult,
} from "@/lib/calc/paint-calculator";
import { paintCalculatorContent } from "@/data/content/paint-calculator";
import {
  Paintbrush,
  Droplet,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function formatINR(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function PaintCalculator() {
  const calc = getCalculator("paint-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();

  // Primary State Declarations
  const [roomLengthFt, setRoomLengthFt] = useState<number | "">(14);
  const [roomWidthFt, setRoomWidthFt] = useState<number | "">(12);
  const [roomHeightFt, setRoomHeightFt] = useState<number | "">(10);
  const [doorsCount, setDoorsCount] = useState<number | "">(1);
  const [doorAreaSqFt, setDoorAreaSqFt] = useState<number | "">(21);
  const [windowsCount, setWindowsCount] = useState<number | "">(2);
  const [windowAreaSqFt, setWindowAreaSqFt] = useState<number | "">(15);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [numberOfCoats, setNumberOfCoats] = useState<number | "">(2);
  const [coverageSqFtPerLiter, setCoverageSqFtPerLiter] = useState<number | "">(100);
  const [applyPrimer, setApplyPrimer] = useState<boolean>(true);
  const [primerCoverageSqFt, setPrimerCoverageSqFt] = useState<number | "">(120);
  const [pricePerLiter, setPricePerLiter] = useState<number | "">(380);
  const [primerPricePerLiter, setPrimerPricePerLiter] = useState<number | "">(180);

  // Snapshot State for Calculated Results
  const [calcInputs, setCalcInputs] = useState<PaintCalculatorInputs>({
    roomLengthFt: 14,
    roomWidthFt: 12,
    roomHeightFt: 10,
    doorsCount: 1,
    doorAreaSqFt: 21,
    windowsCount: 2,
    windowAreaSqFt: 15,
    includeCeiling: true,
    numberOfCoats: 2,
    coverageSqFtPerLiterPerCoat: 100,
    applyPrimer: true,
    primerCoverageSqFtPerLiter: 120,
    pricePerLiter: 380,
    primerPricePerLiter: 180,
  });

  // Derived Calculation Result
  const result: PaintCalculatorResult = useMemo(() => {
    return calculatePaint(calcInputs);
  }, [calcInputs]);

  // Outdated change detection
  const isOutdated =
    hasResult &&
    (roomLengthFt !== calcInputs.roomLengthFt ||
      roomWidthFt !== calcInputs.roomWidthFt ||
      roomHeightFt !== calcInputs.roomHeightFt ||
      doorsCount !== calcInputs.doorsCount ||
      doorAreaSqFt !== calcInputs.doorAreaSqFt ||
      windowsCount !== calcInputs.windowsCount ||
      windowAreaSqFt !== calcInputs.windowAreaSqFt ||
      includeCeiling !== calcInputs.includeCeiling ||
      numberOfCoats !== calcInputs.numberOfCoats ||
      coverageSqFtPerLiter !== calcInputs.coverageSqFtPerLiterPerCoat ||
      applyPrimer !== calcInputs.applyPrimer ||
      primerCoverageSqFt !== calcInputs.primerCoverageSqFtPerLiter ||
      pricePerLiter !== calcInputs.pricePerLiter ||
      primerPricePerLiter !== calcInputs.primerPricePerLiter);

  const handleCalculate = () => {
    setCalcInputs({
      roomLengthFt: Number(roomLengthFt) || 0,
      roomWidthFt: Number(roomWidthFt) || 0,
      roomHeightFt: Number(roomHeightFt) || 0,
      doorsCount: Number(doorsCount) || 0,
      doorAreaSqFt: Number(doorAreaSqFt) || 21,
      windowsCount: Number(windowsCount) || 0,
      windowAreaSqFt: Number(windowAreaSqFt) || 15,
      includeCeiling,
      numberOfCoats: Number(numberOfCoats) || 2,
      coverageSqFtPerLiterPerCoat: Number(coverageSqFtPerLiter) || 100,
      applyPrimer,
      primerCoverageSqFtPerLiter: Number(primerCoverageSqFt) || 120,
      pricePerLiter: Number(pricePerLiter) || 0,
      primerPricePerLiter: Number(primerPricePerLiter) || 0,
    });
    markCalculated();
  };

  const handleReset = () => {
    setRoomLengthFt(14);
    setRoomWidthFt(12);
    setRoomHeightFt(10);
    setDoorsCount(1);
    setDoorAreaSqFt(21);
    setWindowsCount(2);
    setWindowAreaSqFt(15);
    setIncludeCeiling(true);
    setNumberOfCoats(2);
    setCoverageSqFtPerLiter(100);
    setApplyPrimer(true);
    setPrimerCoverageSqFt(120);
    setPricePerLiter(380);
    setPrimerPricePerLiter(180);
    resetCalculated();
  };

  return (
    <CalculatorPageLayout
      calc={calc}
      intro={paintCalculatorContent.intro}
      formula={paintCalculatorContent.formula}
      example={
        paintCalculatorContent.workedExample
          ? `${paintCalculatorContent.workedExample.description}\n\n` +
            paintCalculatorContent.workedExample.table
              .map((r) => `${r.label}: ${r.value}`)
              .join("\n")
          : undefined
      }
      faqs={paintCalculatorContent.faqs}
      blog={
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">How to Use This Paint Calculator</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {paintCalculatorContent.howToUseSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground">{paintCalculatorContent.quickReferenceTable.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-foreground font-semibold">
                    {paintCalculatorContent.quickReferenceTable.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted-foreground">
                  {paintCalculatorContent.quickReferenceTable.rows.map((row, ri) => (
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
            <h2 className="text-xl font-bold text-foreground">Things to Know &amp; Common Painting Mistakes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
              {paintCalculatorContent.mistakes.map((m, idx) => (
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
              <Paintbrush className="w-5 h-5 text-primary" />
              Room & Paint Parameters
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

          {/* Room Dimensions */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              Room Dimensions (Feet)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Length (ft)</Label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={roomLengthFt}
                  onChange={(e) => setRoomLengthFt(e.target.value === "" ? "" : Number(e.target.value))}
                  className="font-medium"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Width (ft)</Label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={roomWidthFt}
                  onChange={(e) => setRoomWidthFt(e.target.value === "" ? "" : Number(e.target.value))}
                  className="font-medium"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Height (ft)</Label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={roomHeightFt}
                  onChange={(e) => setRoomHeightFt(e.target.value === "" ? "" : Number(e.target.value))}
                  className="font-medium"
                />
              </div>
            </div>
          </div>

          {/* Ceiling & Deductions */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground">Paint the Ceiling?</Label>
                <p className="text-xs text-muted-foreground">Add {Number(roomLengthFt || 0) * Number(roomWidthFt || 0)} sq ft ceiling area</p>
              </div>
              <Button
                type="button"
                variant={includeCeiling ? "default" : "outline"}
                size="sm"
                onClick={() => setIncludeCeiling(!includeCeiling)}
                className="text-xs h-8"
              >
                {includeCeiling ? "Included" : "Exclude"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1 block">
                  Doors (Avg 21 sq ft each)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={doorsCount}
                  onChange={(e) => setDoorsCount(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1 block">
                  Windows (Avg 15 sq ft each)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={windowsCount}
                  onChange={(e) => setWindowsCount(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Coats & Coverage */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1 block">
                  Number of Coats
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant={numberOfCoats === c ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setNumberOfCoats(c)}
                    >
                      {c} {c === 1 ? "Coat" : "Coats"}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-foreground mb-1 block">
                  Coverage (Sq Ft / L / Coat)
                </Label>
                <Input
                  type="number"
                  min="40"
                  max="200"
                  value={coverageSqFtPerLiter}
                  onChange={(e) =>
                    setCoverageSqFtPerLiter(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* Primer Option */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-foreground">Include Primer Coat?</Label>
                <p className="text-xs text-muted-foreground">Recommended for fresh plaster or dark-to-light paint</p>
              </div>
              <Button
                type="button"
                variant={applyPrimer ? "default" : "outline"}
                size="sm"
                onClick={() => setApplyPrimer(!applyPrimer)}
                className="text-xs h-8"
              >
                {applyPrimer ? "Yes (1 Coat)" : "No"}
              </Button>
            </div>
          </div>

          {/* Optional Pricing */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <Label className="text-xs font-semibold text-foreground block">
              Budgeting / Cost per Liter (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Paint Rate (₹/Liter)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5000"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Primer Rate (₹/Liter)</Label>
                <Input
                  type="number"
                  min="0"
                  max="2000"
                  disabled={!applyPrimer}
                  value={primerPricePerLiter}
                  onChange={(e) =>
                    setPrimerPricePerLiter(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          <CalculateButton onClick={handleCalculate} />
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {isOutdated && <OutdatedResultBanner onCalculate={handleCalculate} />}

          {!hasResult ? (
            <EmptyResultPlaceholder
              message="Paint Volume & Can Breakdown"
              subMessage="Enter your room size and number of coats, then click Calculate to view net paintable area, exact paint liters, commercial tin pack sizes, and total expense."
            />
          ) : (
            <div className="space-y-6">
              {/* Top Summary Card */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-foreground relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Recommended Paint Purchase
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {result.netPaintableAreaSqFt} sq ft Net Area
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Paint Volume Needed</span>
                    <span className="text-3xl font-extrabold text-foreground">
                      {result.recommendedPaintLiters} <span className="text-lg font-semibold text-muted-foreground">Liters</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Exact theoretical: {result.exactPaintLiters} L
                    </span>
                  </div>

                  {calcInputs.applyPrimer && (
                    <div>
                      <span className="text-xs text-muted-foreground block">Primer Volume (1 Coat)</span>
                      <span className="text-3xl font-extrabold text-foreground">
                        {result.recommendedPrimerLiters} <span className="text-lg font-semibold text-muted-foreground">Liters</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Exact theoretical: {result.exactPrimerLiters} L
                      </span>
                    </div>
                  )}
                </div>

                {result.totalCost > 0 && (
                  <div className="mt-4 pt-4 border-t border-primary/15 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Estimated Material Cost:</span>
                    <span className="text-xl font-bold text-foreground">{formatINR(result.totalCost)}</span>
                  </div>
                )}
              </div>

              {/* Commercial Can Breakdown */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Recommended Commercial Can Combination
                </h3>
                <p className="text-xs text-muted-foreground">
                  Minimizes waste and per-liter cost by packing required volume into standard Indian container sizes:
                </p>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-lg font-bold text-foreground block">{result.paintCans.twentyLiter}</span>
                    <span className="text-[11px] text-muted-foreground">20L Drum</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-lg font-bold text-foreground block">{result.paintCans.tenLiter}</span>
                    <span className="text-[11px] text-muted-foreground">10L Bucket</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-lg font-bold text-foreground block">{result.paintCans.fourLiter}</span>
                    <span className="text-[11px] text-muted-foreground">4L Can</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="text-lg font-bold text-foreground block">{result.paintCans.oneLiter}</span>
                    <span className="text-[11px] text-muted-foreground">1L Tin</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Total Cans Purchased:</span>
                  <span className="font-semibold text-foreground">
                    {result.paintCans.totalCansPurchasedLiters} Liters
                  </span>
                </div>
              </div>

              {/* Surface Area Breakdown */}
              <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Surface Area Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Gross Wall Perimeter Area:</span>
                    <span className="font-semibold text-foreground">{result.grossWallAreaSqFt} sq ft</span>
                  </div>
                  {calcInputs.includeCeiling && (
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ceiling Surface Area:</span>
                      <span className="font-semibold text-foreground">{result.ceilingAreaSqFt} sq ft</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Doors & Windows Deducted:</span>
                    <span className="font-semibold text-destructive">−{result.deductionsSqFt} sq ft</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                    <span className="text-foreground">Net Paintable Surface:</span>
                    <span className="text-primary">{result.netPaintableAreaSqFt} sq ft</span>
                  </div>
                </div>
              </div>

              {/* Site Tip */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-start gap-3">
                <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Painter tip:</strong> Keep any unopened leftover 1-liter tins in a cool, dry spot. You will inevitably need touch-up paint within the first 6 months following electrical, curtain rod, or furniture installations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorPageLayout>
  );
}
