export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface LoveCalculationResult {
  overallScore: number;
  nameScore: number;
  numerologyScore: number;
  astrologyScore: number;
  personA: {
    name: string;
    dateOfBirth: string;
    nameNumber: number;
    lifePathNumber: number;
    zodiacSign: ZodiacSign;
  };
  personB: {
    name: string;
    dateOfBirth: string;
    nameNumber: number;
    lifePathNumber: number;
    zodiacSign: ZodiacSign;
  };
  relationshipStatus: string;
  interpretation: string;
  insight: string;
  numerologyInsight: string;
  astrologyInsight: string;
}

// Name compatibility (Layer 1)
export function calculateNameCompatibility(nameA: string, nameB: string): number {
  const normA = nameA.toLowerCase().replace(/[^a-z]/g, "");
  const normB = nameB.toLowerCase().replace(/[^a-z]/g, "");
  const combined = [normA, normB].sort().join("");

  const letters = "trueloves";
  let seq = Array.from(letters).map((char) => combined.split("").filter((c) => c === char).length);
  seq = seq.map(String).join("").split("").map(Number);

  while (seq.length > 2) {
    const nextSeq: number[] = [];
    while (seq.length > 1) {
      const first = seq.shift()!;
      const last = seq.pop()!;
      const sum = first + last;
      nextSeq.push(...String(sum).split("").map(Number));
    }
    if (seq.length === 1) nextSeq.push(seq[0]);
    seq = nextSeq;
  }
  let p = parseInt(seq.join(""), 10);
  if (isNaN(p) || p < 1) p = 1;
  if (p > 99) p = 99;
  return p;
}

// Numerology Helpers
function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = String(num)
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
}

const pythagoreanMap: Record<string, number> = {
  a: 1,
  j: 1,
  s: 1,
  b: 2,
  k: 2,
  t: 2,
  c: 3,
  l: 3,
  u: 3,
  d: 4,
  m: 4,
  v: 4,
  e: 5,
  n: 5,
  w: 5,
  f: 6,
  o: 6,
  x: 6,
  g: 7,
  p: 7,
  y: 7,
  h: 8,
  q: 8,
  z: 8,
  i: 9,
  r: 9,
};

export function calculateNameNumber(name: string): number {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  let sum = 0;
  for (const char of clean) {
    sum += pythagoreanMap[char] || 0;
  }
  return reduceToSingleDigit(sum);
}

export function calculateLifePathNumber(dob: string): number {
  const digits = dob.replace(/[^0-9]/g, "");
  let sum = 0;
  for (const d of digits) sum += parseInt(d, 10);
  return reduceToSingleDigit(sum);
}

// Deterministic symmetric matrix for numerology (1-9)
// Generates scores between 40 and 99
function getNumerologyScore(num1: number, num2: number): number {
  const sorted = [num1, num2].sort((a, b) => a - b);
  const key = `${sorted[0]}-${sorted[1]}`;
  // Hardcode a few complementary pairs, mathematically generate the rest to ensure determinism
  const baseScores: Record<string, number> = {
    "1-1": 85,
    "1-5": 95,
    "1-7": 88,
    "2-2": 90,
    "2-4": 92,
    "2-8": 95,
    "3-3": 85,
    "3-6": 92,
    "3-9": 96,
    "4-4": 80,
    "4-8": 90,
    "4-6": 88,
    "5-5": 85,
    "5-7": 92,
    "5-3": 89,
    "6-6": 95,
    "6-9": 92,
    "6-2": 88,
    "7-7": 80,
    "7-9": 85,
    "7-4": 82,
    "8-8": 75,
    "8-2": 95,
    "8-6": 88,
    "9-9": 85,
    "9-3": 96,
    "9-6": 92,
  };
  if (baseScores[key]) return baseScores[key];

  // Deterministic fallback based on difference
  const diff = Math.abs(num1 - num2);
  let score = 70 - diff * 5 + ((num1 + num2) % 5) * 4;
  if (score < 40) score = 40 + (score % 20);
  if (score > 99) score = 95;
  return score;
}

// Astrology Helpers
export function getZodiacSign(dob: string): ZodiacSign {
  // DOB format: YYYY-MM-DD
  const parts = dob.split("-");
  if (parts.length !== 3) return "Aries"; // Fallback
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricorn";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius";
  return "Pisces";
}

const zodiacElements: Record<ZodiacSign, string> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

function getAstrologyScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const el1 = zodiacElements[sign1];
  const el2 = zodiacElements[sign2];

  // Element compatibility logic
  if (el1 === el2) return 92; // Same element = great
  if ((el1 === "Fire" && el2 === "Air") || (el1 === "Air" && el2 === "Fire")) return 88;
  if ((el1 === "Earth" && el2 === "Water") || (el1 === "Water" && el2 === "Earth")) return 88;

  if ((el1 === "Fire" && el2 === "Water") || (el1 === "Water" && el2 === "Fire")) return 55;
  if ((el1 === "Earth" && el2 === "Air") || (el1 === "Air" && el2 === "Earth")) return 58;

  if ((el1 === "Fire" && el2 === "Earth") || (el1 === "Earth" && el2 === "Fire")) return 65;
  if ((el1 === "Air" && el2 === "Water") || (el1 === "Water" && el2 === "Air")) return 68;

  return 70; // Fallback
}

function getZodiacInsight(sign1: ZodiacSign, sign2: ZodiacSign): string {
  const el1 = zodiacElements[sign1];
  const el2 = zodiacElements[sign2];
  if (el1 === el2)
    return `You share the same ${el1} element, fostering deep mutual understanding and a natural harmony in how you approach life.`;
  if ((el1 === "Fire" && el2 === "Air") || (el1 === "Air" && el2 === "Fire"))
    return "Fire and Air naturally fuel each other, creating a dynamic, highly communicative, and exciting relationship.";
  if ((el1 === "Earth" && el2 === "Water") || (el1 === "Water" && el2 === "Earth"))
    return "Earth and Water support one another beautifully, offering a blend of emotional depth and practical stability.";
  if ((el1 === "Fire" && el2 === "Water") || (el1 === "Water" && el2 === "Fire"))
    return "Fire and Water can be intensely passionate but may require effort to balance emotion with action.";
  if ((el1 === "Earth" && el2 === "Air") || (el1 === "Air" && el2 === "Earth"))
    return "Earth brings grounding while Air brings ideas. This pairing works best when you appreciate your different perspectives.";
  if ((el1 === "Fire" && el2 === "Earth") || (el1 === "Earth" && el2 === "Fire"))
    return "Fire’s bold energy meets Earth’s steady patience. It’s a powerful combination if you respect each other's pacing.";
  if ((el1 === "Air" && el2 === "Water") || (el1 === "Water" && el2 === "Air"))
    return "Air's logic and Water's emotion can create a unique balance, teaching each other to blend mind and heart.";
  return "Your signs bring unique perspectives that can create a well-rounded and interesting connection.";
}

function getNumerologyInsight(lp1: number, lp2: number): string {
  const diff = Math.abs(lp1 - lp2);
  if (diff === 0)
    return "You share the exact same Life Path number, indicating highly aligned life goals and a profound mutual understanding.";
  if (diff === 1 || diff === 2)
    return "Your Life Path numbers are adjacent or close, suggesting a complementary connection where you easily support each other’s growth.";
  if (diff >= 5)
    return "Your numerology profiles show a fascinating mix of contrasting energies, offering great opportunities to learn from one another.";
  return "Your numbers blend nicely, bringing both harmony and dynamic differences to your relationship path.";
}

export function getRelationshipInsight(score: number, status: string): string {
  let band = "";
  if (score >= 80) band = "deep and exceptional harmony";
  else if (score >= 60) band = "strong and promising connection";
  else if (score >= 40) band = "developing and interesting bond";
  else band = "unique and unpredictable dynamic";

  let statusText = "";
  switch (status) {
    case "Crush":
      statusText =
        "This reading is a fun way to explore your initial spark and see how your names and dates align.";
      break;
    case "Dating":
      statusText =
        "Your reading highlights areas of natural ease and potential growth as your connection continues to develop.";
      break;
    case "In a Relationship":
      statusText =
        "This compatibility breakdown reflects the balance and unique energies you bring to your ongoing partnership.";
      break;
    case "Engaged":
      statusText =
        "As you plan your future together, this fun reading highlights the complementary traits that make your bond special.";
      break;
    case "Married":
      statusText =
        "Your reading reflects the deep, intertwined energies of your marriage and highlights areas of lasting harmony.";
      break;
    case "Long Distance":
      statusText =
        "While distance separates you physically, your numbers and signs show how your unique energies stay connected.";
      break;
    case "It's Complicated":
      statusText =
        "Relationships have many layers. This reading offers a playful look at the underlying astrological and numerical ties between you.";
      break;
    default:
      statusText =
        "This reading is a fun way to explore the connection between your names and birth dates.";
  }

  return `Based on our multi-layer calculation, your relationship shows signs of a ${band}. ${statusText}`;
}

export function getScoreInterpretation(percentage: number) {
  if (percentage >= 95) return "Exceptional Connection";
  if (percentage >= 80) return "Deep Compatibility";
  if (percentage >= 60) return "Strong Connection";
  if (percentage >= 40) return "Promising Connection";
  if (percentage >= 20) return "Growing Connection";
  return "A New Beginning";
}

export function calculateLoveCompatibilityV2(
  name1: string,
  dob1: string,
  name2: string,
  dob2: string,
  relationshipStatus: string,
): LoveCalculationResult {
  // Layer 1
  const nameScore = calculateNameCompatibility(name1, name2);

  // Layer 2
  const nn1 = calculateNameNumber(name1);
  const nn2 = calculateNameNumber(name2);
  const lp1 = calculateLifePathNumber(dob1);
  const lp2 = calculateLifePathNumber(dob2);

  const nameNumScore = getNumerologyScore(nn1, nn2);
  const lpNumScore = getNumerologyScore(lp1, lp2);
  const numerologyScore = Math.round(nameNumScore * 0.4 + lpNumScore * 0.6);

  // Layer 3
  const z1 = getZodiacSign(dob1);
  const z2 = getZodiacSign(dob2);
  const astrologyScore = getAstrologyScore(z1, z2);

  // Overall
  let overallScore = Math.round(nameScore * 0.3 + numerologyScore * 0.4 + astrologyScore * 0.3);
  if (overallScore < 1) overallScore = 1;
  if (overallScore > 99) overallScore = 99;

  return {
    overallScore,
    nameScore,
    numerologyScore,
    astrologyScore,
    personA: {
      name: name1,
      dateOfBirth: dob1,
      nameNumber: nn1,
      lifePathNumber: lp1,
      zodiacSign: z1,
    },
    personB: {
      name: name2,
      dateOfBirth: dob2,
      nameNumber: nn2,
      lifePathNumber: lp2,
      zodiacSign: z2,
    },
    relationshipStatus,
    interpretation: getScoreInterpretation(overallScore),
    insight: getRelationshipInsight(overallScore, relationshipStatus),
    numerologyInsight: getNumerologyInsight(lp1, lp2),
    astrologyInsight: getZodiacInsight(z1, z2),
  };
}
