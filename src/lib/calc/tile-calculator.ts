export type TileDimensionUnit = "feet" | "meters";
export type TilePreset = "1x1ft" | "2x2ft" | "2x4ft" | "600x600mm" | "800x800mm" | "custom";

export interface TileCalculatorInputs {
  roomLength: number; // in ft or m
  roomWidth: number; // in ft or m
  unit: TileDimensionUnit;
  deductionAreaSqFt?: number; // deductions (e.g. kitchen island, pillars)
  tilePreset: TilePreset;
  customTileLengthMm?: number;
  customTileWidthMm?: number;
  wastagePct?: number; // default 10%
  tilesPerBox?: number; // e.g. 4 tiles/box for 2x2ft
  pricePerTile?: number; // ₹ per tile piece
  pricePerSqFt?: number; // ₹ per sq ft
}

export interface TileCalculatorResult {
  roomAreaSqFt: number;
  roomAreaSqM: number;
  tileAreaSqFt: number;
  rawTilesNeeded: number;
  tilesWithWastage: number;
  tilesPerBox: number;
  boxesNeeded: number;
  totalCost: number;
}

const TILE_PRESET_DIMS_MM: Record<TilePreset, [number, number]> = {
  "1x1ft": [304.8, 304.8], // 1 ft x 1 ft
  "2x2ft": [609.6, 609.6], // 2 ft x 2 ft
  "2x4ft": [609.6, 1219.2], // 2 ft x 4 ft (600x1200mm)
  "600x600mm": [600, 600],
  "800x800mm": [800, 800],
  custom: [600, 600],
};

export function calculateTiles(inputs: TileCalculatorInputs): TileCalculatorResult {
  const unit = inputs.unit || "feet";
  const rawL = Math.max(0, Number(inputs.roomLength) || 0);
  const rawW = Math.max(0, Number(inputs.roomWidth) || 0);

  // Convert to sq ft
  let grossAreaSqFt = rawL * rawW;
  if (unit === "meters") {
    // 1 sq m = 10.76391 sq ft
    grossAreaSqFt = rawL * rawW * 10.76391;
  }

  const deductionSqFt = Math.max(0, Number(inputs.deductionAreaSqFt) || 0);
  const roomAreaSqFt = Math.max(0, grossAreaSqFt - deductionSqFt);
  const roomAreaSqM = roomAreaSqFt / 10.76391;

  // Tile dimensions in mm
  let tileLengthMm = 609.6;
  let tileWidthMm = 609.6;

  if (inputs.tilePreset === "custom") {
    tileLengthMm = Math.max(50, Number(inputs.customTileLengthMm) || 600);
    tileWidthMm = Math.max(50, Number(inputs.customTileWidthMm) || 600);
  } else {
    const dims = TILE_PRESET_DIMS_MM[inputs.tilePreset] || TILE_PRESET_DIMS_MM["2x2ft"];
    tileLengthMm = dims[0];
    tileWidthMm = dims[1];
  }

  // Tile area in sq ft
  // 1 mm = 0.00328084 ft
  const tileLengthFt = tileLengthMm / 304.8;
  const tileWidthFt = tileWidthMm / 304.8;
  const tileAreaSqFt = tileLengthFt * tileWidthFt;

  // Raw tiles needed
  const rawTiles = tileAreaSqFt > 0 ? roomAreaSqFt / tileAreaSqFt : 0;
  const rawTilesNeeded = Math.ceil(rawTiles);

  // Wastage (default 10%)
  const wastagePct = inputs.wastagePct !== undefined ? Math.max(0, Number(inputs.wastagePct)) : 10;
  const tilesWithWastage = Math.ceil(rawTilesNeeded * (1 + wastagePct / 100));

  // Boxes
  const perBox = Math.max(1, Math.round(Number(inputs.tilesPerBox) || 4));
  const boxesNeeded = Math.ceil(tilesWithWastage / perBox);

  // Cost calculation (either per tile or per sq ft)
  let totalCost = 0;
  if (inputs.pricePerTile && Number(inputs.pricePerTile) > 0) {
    totalCost = Math.round(tilesWithWastage * Number(inputs.pricePerTile));
  } else if (inputs.pricePerSqFt && Number(inputs.pricePerSqFt) > 0) {
    // Total purchased area with wastage
    const totalPurchasedSqFt = tilesWithWastage * tileAreaSqFt;
    totalCost = Math.round(totalPurchasedSqFt * Number(inputs.pricePerSqFt));
  }

  return {
    roomAreaSqFt: Number(roomAreaSqFt.toFixed(2)),
    roomAreaSqM: Number(roomAreaSqM.toFixed(2)),
    tileAreaSqFt: Number(tileAreaSqFt.toFixed(3)),
    rawTilesNeeded,
    tilesWithWastage,
    tilesPerBox: perBox,
    boxesNeeded,
    totalCost,
  };
}
