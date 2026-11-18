export type SteelLengthUnit = "meters" | "feet";

export interface SteelWeightInputs {
  diameterMm: number; // e.g. 12
  length: number; // in meters or feet
  lengthUnit: SteelLengthUnit;
  numberOfBars: number; // e.g. 50
  ratePerKg?: number; // e.g. 65 (₹ per kg)
}

export interface StandardBarRef {
  diameterMm: number;
  weightPerMeterKg: number;
  weightPer12mBarKg: number;
  barsPerTonne: number;
  tolerancePct: string;
}

export interface SteelWeightResult {
  diameterMm: number;
  weightPerMeterKg: number;
  barLengthMeters: number;
  weightPerBarKg: number;
  numberOfBars: number;
  totalWeightKg: number;
  totalWeightTonne: number;
  twelveMeterBarsEquivalent: number;
  ratePerKg: number;
  totalCost: number;
  standardReferenceTable: StandardBarRef[];
}

export const STANDARD_DIAMETERS = [6, 8, 10, 12, 16, 20, 25, 28, 32] as const;

export function calculateTmtSteelWeight(inputs: SteelWeightInputs): SteelWeightResult {
  const d = Math.max(1, Number(inputs.diameterMm) || 12);
  const rawLength = Math.max(0.1, Number(inputs.length) || 12);
  const unit = inputs.lengthUnit || "meters";
  // Convert length to meters (1 ft = 0.3048 m)
  const lengthMeters = unit === "feet" ? rawLength * 0.3048 : rawLength;
  const count = Math.max(1, Math.round(Number(inputs.numberOfBars) || 1));
  const rate = Math.max(0, Number(inputs.ratePerKg) || 0);

  // Standard civil engineering formula: d^2 / 162 (derived from 7850 kg/m3 steel density)
  // More exact: (pi / 4) * (d/1000)^2 * 1 * 7850 = 0.00616537 * d^2 = d^2 / 162.162
  // Industry standard benchmark IS 1786 uses d^2 / 162:
  const weightPerMeter = (d * d) / 162;
  const weightPerBar = weightPerMeter * lengthMeters;
  const totalWeightKg = weightPerBar * count;
  const totalWeightTonne = totalWeightKg / 1000;

  // Standard 12m commercial bar equivalent
  const single12mBarWeight = weightPerMeter * 12;
  const twelveMeterBarsEquivalent = single12mBarWeight > 0 ? totalWeightKg / single12mBarWeight : 0;

  const totalCost = Math.round(totalWeightKg * rate);

  // Standard diameter reference table per IS 1786
  const standardReferenceTable: StandardBarRef[] = STANDARD_DIAMETERS.map((dia) => {
    const wPerM = (dia * dia) / 162;
    const w12m = wPerM * 12;
    const bPerTonne = w12m > 0 ? Math.round(1000 / w12m) : 0;
    let tol = "±7%";
    if (dia >= 10 && dia <= 16) tol = "±5%";
    else if (dia > 16) tol = "±3%";

    return {
      diameterMm: dia,
      weightPerMeterKg: Number(wPerM.toFixed(3)),
      weightPer12mBarKg: Number(w12m.toFixed(2)),
      barsPerTonne: bPerTonne,
      tolerancePct: tol,
    };
  });

  return {
    diameterMm: d,
    weightPerMeterKg: Number(weightPerMeter.toFixed(3)),
    barLengthMeters: Number(lengthMeters.toFixed(2)),
    weightPerBarKg: Number(weightPerBar.toFixed(2)),
    numberOfBars: count,
    totalWeightKg: Number(totalWeightKg.toFixed(2)),
    totalWeightTonne: Number(totalWeightTonne.toFixed(3)),
    twelveMeterBarsEquivalent: Math.round(twelveMeterBarsEquivalent),
    ratePerKg: rate,
    totalCost,
    standardReferenceTable,
  };
}
