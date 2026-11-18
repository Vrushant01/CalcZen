export type StandardUnit =
  | 'sqFt'
  | 'sqM'
  | 'sqYd' // Gaj
  | 'acre'
  | 'hectare'
  | 'guntha'
  | 'cent'
  | 'ground'
  | 'kanal'
  | 'marla'
  | 'biswa'
  | 'bigha';

export type BighaType =
  | 'up_pucca' // 27,225 sq ft
  | 'bengal' // 14,400 sq ft
  | 'assam' // 14,400 sq ft
  | 'gujarat' // 17,424 sq ft
  | 'mp' // 12,000 sq ft
  | 'custom';

export interface LandAreaInput {
  value: number;
  fromUnit: StandardUnit;
  bighaType?: BighaType;
  customBighaSqFt?: number;
}

export interface UnitConversionResult {
  sqFt: number;
  sqM: number;
  sqYd: number; // Gaj
  acre: number;
  hectare: number;
  guntha: number;
  cent: number;
  ground: number;
  kanal: number;
  marla: number;
  biswa: number;
  bigha: number;
  bighaType: BighaType;
  bighaSqFtUsed: number;
}

export const BIGHA_SQ_FT: Record<Exclude<BighaType, 'custom'>, number> = {
  up_pucca: 27225, // UP, Bihar, Punjab, Haryana Pucca Bigha (3025 sq yd)
  bengal: 14400, // West Bengal (1600 sq yd / 1/3 acre)
  assam: 14400, // Assam (5 katha)
  gujarat: 17424, // Gujarat Vigha (approx 1618.7 sq m)
  mp: 12000, // Madhya Pradesh standard
};

// Base conversion factor to Square Feet (1 unit in sq ft)
export function getFactorToSqFt(unit: StandardUnit, bighaType: BighaType = 'up_pucca', customBighaSqFt?: number): number {
  switch (unit) {
    case 'sqFt':
      return 1;
    case 'sqM':
      return 10.7639104; // 1 m² = 10.7639104 sq ft
    case 'sqYd': // Gaj
      return 9; // 1 sq yd / gaj = 9 sq ft
    case 'acre':
      return 43560; // 1 acre = 43,560 sq ft
    case 'hectare':
      return 107639.104; // 1 hectare = 10,000 m² = 107,639.104 sq ft
    case 'guntha':
      return 1089; // 1 guntha = 121 sq yd = 1,089 sq ft (Maharashtra, Karnataka, Gujarat)
    case 'cent':
      return 435.6; // 1 cent = 1/100 acre = 435.6 sq ft (Kerala, Tamil Nadu, AP, Telangana)
    case 'ground':
      return 2400; // 1 ground = 2,400 sq ft (Tamil Nadu)
    case 'kanal':
      return 5445; // 1 kanal = 1/8 acre = 5,445 sq ft (Punjab, Haryana, HP, J&K)
    case 'marla':
      return 272.25; // 1 marla = 1/20 kanal = 272.25 sq ft
    case 'biswa': {
      // 1 biswa is 1/20 of a bigha in North India
      const bighaBase = bighaType === 'custom' && customBighaSqFt && customBighaSqFt > 0
        ? customBighaSqFt
        : BIGHA_SQ_FT[bighaType as Exclude<BighaType, 'custom'>] || BIGHA_SQ_FT.up_pucca;
      return bighaBase / 20;
    }
    case 'bigha':
      if (bighaType === 'custom' && customBighaSqFt && customBighaSqFt > 0) {
        return customBighaSqFt;
      }
      return BIGHA_SQ_FT[bighaType as Exclude<BighaType, 'custom'>] || BIGHA_SQ_FT.up_pucca;
  }
}

export function convertLandArea(input: LandAreaInput): UnitConversionResult {
  const rawVal = Math.max(0, Number(input.value) || 0);
  const bighaType: BighaType = input.bighaType || 'up_pucca';
  const customSqFt = input.customBighaSqFt;

  const factorToSqFt = getFactorToSqFt(input.fromUnit, bighaType, customSqFt);
  const totalSqFt = rawVal * factorToSqFt;

  const bighaSqFt = getFactorToSqFt('bigha', bighaType, customSqFt);
  const biswaSqFt = bighaSqFt / 20;

  return {
    sqFt: Number(totalSqFt.toFixed(2)),
    sqM: Number((totalSqFt / 10.7639104).toFixed(3)),
    sqYd: Number((totalSqFt / 9).toFixed(2)), // Gaj
    acre: Number((totalSqFt / 43560).toFixed(4)),
    hectare: Number((totalSqFt / 107639.104).toFixed(4)),
    guntha: Number((totalSqFt / 1089).toFixed(3)),
    cent: Number((totalSqFt / 435.6).toFixed(3)),
    ground: Number((totalSqFt / 2400).toFixed(3)),
    kanal: Number((totalSqFt / 5445).toFixed(3)),
    marla: Number((totalSqFt / 272.25).toFixed(2)),
    biswa: Number((totalSqFt / biswaSqFt).toFixed(3)),
    bigha: Number((totalSqFt / bighaSqFt).toFixed(4)),
    bighaType,
    bighaSqFtUsed: bighaSqFt,
  };
}
