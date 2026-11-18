export interface PaintCalculatorInputs {
  roomLengthFt: number;
  roomWidthFt: number;
  roomHeightFt: number;
  doorsCount?: number; // default 1 (approx 21 sq ft per door: 3ft x 7ft)
  doorAreaSqFt?: number; // default 21
  windowsCount?: number; // default 2 (approx 15 sq ft per window: 3ft x 5ft)
  windowAreaSqFt?: number; // default 15
  includeCeiling: boolean;
  numberOfCoats: number; // default 2
  coverageSqFtPerLiterPerCoat?: number; // default 100 sq ft / L / coat
  applyPrimer: boolean;
  primerCoverageSqFtPerLiter?: number; // default 120 sq ft / L
  pricePerLiter?: number; // e.g. ₹350
  primerPricePerLiter?: number; // e.g. ₹180
}

export interface CanBreakdown {
  twentyLiter: number;
  tenLiter: number;
  fourLiter: number;
  oneLiter: number;
  totalCansPurchasedLiters: number;
}

export interface PaintCalculatorResult {
  grossWallAreaSqFt: number;
  ceilingAreaSqFt: number;
  deductionsSqFt: number;
  netPaintableAreaSqFt: number;
  exactPaintLiters: number;
  recommendedPaintLiters: number;
  exactPrimerLiters: number;
  recommendedPrimerLiters: number;
  paintCans: CanBreakdown;
  primerCans: CanBreakdown;
  paintCost: number;
  primerCost: number;
  totalCost: number;
}

export function computeCanCombination(liters: number): CanBreakdown {
  let remaining = Math.ceil(liters);
  const twenty = Math.floor(remaining / 20);
  remaining %= 20;

  const ten = Math.floor(remaining / 10);
  remaining %= 10;

  const four = Math.floor(remaining / 4);
  remaining %= 4;

  const one = remaining;

  return {
    twentyLiter: twenty,
    tenLiter: ten,
    fourLiter: four,
    oneLiter: one,
    totalCansPurchasedLiters: twenty * 20 + ten * 10 + four * 4 + one * 1,
  };
}

export function calculatePaint(inputs: PaintCalculatorInputs): PaintCalculatorResult {
  const l = Math.max(0, Number(inputs.roomLengthFt) || 0);
  const w = Math.max(0, Number(inputs.roomWidthFt) || 0);
  const h = Math.max(0, Number(inputs.roomHeightFt) || 0);

  // Perimeter * height = 2 * (L + W) * H
  const grossWallAreaSqFt = 2 * (l + w) * h;
  const ceilingAreaSqFt = inputs.includeCeiling ? l * w : 0;

  const dCount = Math.max(0, Number(inputs.doorsCount ?? 1));
  const dArea = Math.max(0, Number(inputs.doorAreaSqFt ?? 21));
  const wCount = Math.max(0, Number(inputs.windowsCount ?? 2));
  const winArea = Math.max(0, Number(inputs.windowAreaSqFt ?? 15));

  const deductionsSqFt = dCount * dArea + wCount * winArea;
  const netPaintableAreaSqFt = Math.max(0, grossWallAreaSqFt + ceilingAreaSqFt - deductionsSqFt);

  const coats = Math.max(1, Math.round(Number(inputs.numberOfCoats) || 2));
  const coverage = Math.max(10, Number(inputs.coverageSqFtPerLiterPerCoat) || 100);

  // Exact paint in liters = (Net Area * Coats) / Coverage
  const exactPaintLiters = (netPaintableAreaSqFt * coats) / coverage;
  const recommendedPaintLiters = Math.ceil(exactPaintLiters);

  // Primer (1 coat standard)
  let exactPrimerLiters = 0;
  if (inputs.applyPrimer) {
    const primerCoverage = Math.max(10, Number(inputs.primerCoverageSqFtPerLiter) || 120);
    exactPrimerLiters = netPaintableAreaSqFt / primerCoverage;
  }
  const recommendedPrimerLiters = Math.ceil(exactPrimerLiters);

  const paintCans = computeCanCombination(exactPaintLiters);
  const primerCans = computeCanCombination(exactPrimerLiters);

  const paintRate = Math.max(0, Number(inputs.pricePerLiter) || 0);
  const primerRate = Math.max(0, Number(inputs.primerPricePerLiter) || 0);

  const paintCost = Math.round(paintCans.totalCansPurchasedLiters * paintRate);
  const primerCost = Math.round(primerCans.totalCansPurchasedLiters * primerRate);
  const totalCost = paintCost + primerCost;

  return {
    grossWallAreaSqFt: Number(grossWallAreaSqFt.toFixed(1)),
    ceilingAreaSqFt: Number(ceilingAreaSqFt.toFixed(1)),
    deductionsSqFt: Number(deductionsSqFt.toFixed(1)),
    netPaintableAreaSqFt: Number(netPaintableAreaSqFt.toFixed(1)),
    exactPaintLiters: Number(exactPaintLiters.toFixed(2)),
    recommendedPaintLiters,
    exactPrimerLiters: Number(exactPrimerLiters.toFixed(2)),
    recommendedPrimerLiters,
    paintCans,
    primerCans,
    paintCost,
    primerCost,
    totalCost,
  };
}
