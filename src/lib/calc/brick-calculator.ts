export type BrickDimensionUnit = "meters" | "feet";
export type BrickPreset = "modular" | "traditional" | "custom";
export type MortarRatio = "1:3" | "1:4" | "1:5" | "1:6";

export interface BrickCalculatorInputs {
  wallLength: number; // in m or ft
  wallHeight: number; // in m or ft
  wallThickness: number; // in m or inches/ft
  unit: BrickDimensionUnit;
  openingsAreaSqM?: number; // deductions for doors/windows
  brickPreset: BrickPreset;
  customBrickLengthMm?: number;
  customBrickWidthMm?: number;
  customBrickHeightMm?: number;
  mortarRatio: MortarRatio;
  wastagePct?: number; // default 5%
  dryVolumeFactor?: number; // default 1.27
  brickRatePerPiece?: number; // ₹ per brick
  cementBagRate?: number; // ₹ per 50kg bag
  sandRatePerTonne?: number; // ₹ per tonne
}

export interface BrickCalculatorResult {
  netWallVolumeM3: number;
  grossBricksRequired: number;
  bricksWithWastage: number;
  mortarWetVolumeM3: number;
  mortarDryVolumeM3: number;
  cementBags: number;
  sandVolumeM3: number;
  sandWeightTonnes: number;
  brickCost: number;
  cementCost: number;
  sandCost: number;
  totalMaterialCost: number;
}

export function calculateBricks(inputs: BrickCalculatorInputs): BrickCalculatorResult {
  const unit = inputs.unit || "meters";
  const rawL = Math.max(0, Number(inputs.wallLength) || 0);
  const rawH = Math.max(0, Number(inputs.wallHeight) || 0);
  const rawT = Math.max(0, Number(inputs.wallThickness) || 0);

  // Convert wall dimensions to metres
  let lengthM = rawL;
  let heightM = rawH;
  let thicknessM = rawT;

  if (unit === "feet") {
    lengthM = rawL * 0.3048;
    heightM = rawH * 0.3048;
    thicknessM = rawT * 0.3048;
  }

  const grossWallVolumeM3 = lengthM * heightM * thicknessM;
  const openingsSqM = Math.max(0, Number(inputs.openingsAreaSqM) || 0);
  const openingsVolM3 = openingsSqM * thicknessM;
  const netWallVolumeM3 = Math.max(0, grossWallVolumeM3 - openingsVolM3);

  // Brick dimensions in mm
  let brickL = 190;
  let brickW = 90;
  let brickH = 90;
  let mortarJointMm = 10;

  if (inputs.brickPreset === "traditional") {
    brickL = 230;
    brickW = 110;
    brickH = 70;
  } else if (inputs.brickPreset === "custom") {
    brickL = Math.max(50, Number(inputs.customBrickLengthMm) || 190);
    brickW = Math.max(50, Number(inputs.customBrickWidthMm) || 90);
    brickH = Math.max(50, Number(inputs.customBrickHeightMm) || 90);
  }

  // Volume of single brick without mortar (m3)
  const volBrickWithoutMortar = (brickL / 1000) * (brickW / 1000) * (brickH / 1000);
  // Volume of single brick with mortar (m3)
  const nominalL = (brickL + mortarJointMm) / 1000;
  const nominalW = (brickW + mortarJointMm) / 1000;
  const nominalH = (brickH + mortarJointMm) / 1000;
  const volBrickWithMortar = nominalL * nominalW * nominalH;

  // Standard civil formula: Bricks = Net Wall Volume / Volume of one nominal brick with mortar
  const rawBricks = volBrickWithMortar > 0 ? netWallVolumeM3 / volBrickWithMortar : 0;
  const grossBricks = Math.round(rawBricks);

  const wastagePct = inputs.wastagePct !== undefined ? Math.max(0, Number(inputs.wastagePct)) : 5;
  const bricksWithWastage = Math.round(grossBricks * (1 + wastagePct / 100));

  // Wet mortar volume = Net wall volume - (gross bricks * volume of single brick without mortar)
  const mortarWetVolumeM3 = Math.max(0, netWallVolumeM3 - grossBricks * volBrickWithoutMortar);

  // Dry mortar volume = Wet mortar * dry volume factor (standard 1.27 to 1.33 to account for void filling & shrinkage)
  const dryFactor = inputs.dryVolumeFactor !== undefined ? Math.max(1.0, Number(inputs.dryVolumeFactor)) : 1.27;
  const mortarDryVolumeM3 = mortarWetVolumeM3 * dryFactor;

  // Mortar ratio: 1:3, 1:4, 1:5, 1:6
  const ratioParts: Record<MortarRatio, number> = {
    "1:3": 3,
    "1:4": 4,
    "1:5": 5,
    "1:6": 6,
  };
  const sandPart = ratioParts[inputs.mortarRatio] || 5;
  const totalParts = 1 + sandPart;

  // Cement volume in m3 = Dry volume * (1 / totalParts)
  const cementVolM3 = mortarDryVolumeM3 * (1 / totalParts);
  // Volume of one 50kg bag of cement = 0.0347 m3 (standard Indian density 1440 kg/m3)
  const cementBags = cementVolM3 > 0 ? Math.ceil(cementVolM3 / 0.0347) : 0;

  // Sand volume in m3 = Dry volume * (sandPart / totalParts)
  const sandVolumeM3 = mortarDryVolumeM3 * (sandPart / totalParts);
  // Sand density ~1600 kg/m3 = 1.6 tonnes/m3
  const sandWeightTonnes = sandVolumeM3 * 1.6;

  // Costs
  const brickRate = Math.max(0, Number(inputs.brickRatePerPiece) || 0);
  const cementRate = Math.max(0, Number(inputs.cementBagRate) || 0);
  const sandRate = Math.max(0, Number(inputs.sandRatePerTonne) || 0);

  const brickCost = Math.round(bricksWithWastage * brickRate);
  const cementCost = Math.round(cementBags * cementRate);
  const sandCost = Math.round(sandWeightTonnes * sandRate);
  const totalMaterialCost = brickCost + cementCost + sandCost;

  return {
    netWallVolumeM3: Number(netWallVolumeM3.toFixed(3)),
    grossBricksRequired: grossBricks,
    bricksWithWastage,
    mortarWetVolumeM3: Number(mortarWetVolumeM3.toFixed(3)),
    mortarDryVolumeM3: Number(mortarDryVolumeM3.toFixed(3)),
    cementBags,
    sandVolumeM3: Number(sandVolumeM3.toFixed(3)),
    sandWeightTonnes: Number(sandWeightTonnes.toFixed(2)),
    brickCost,
    cementCost,
    sandCost,
    totalMaterialCost,
  };
}
