/**
 * Gold Purity & Karat Converter Utility
 * Mathematically rigorous gold fineness, karat, and percentage conversions.
 * References Bureau of Indian Standards (BIS) IS 1417 standards.
 */

export type GoldInputMode = "karat" | "percentage" | "fineness";

export interface HallmarkReferenceGrade {
  karat: string;
  fineness: number;
  percentage: number;
  gradeCode: string;
  name: string;
  description: string;
}

export const BIS_IS1417_GRADES: HallmarkReferenceGrade[] = [
  {
    karat: "9K",
    fineness: 375,
    percentage: 37.5,
    gradeCode: "9K375",
    name: "9 Karat Gold",
    description: "Contains at least 37.5% pure gold. Popular for affordable everyday jewellery and international exports.",
  },
  {
    karat: "14K",
    fineness: 585,
    percentage: 58.5,
    gradeCode: "14K585",
    name: "14 Karat Gold",
    description: "Contains at least 58.5% pure gold. Highly durable and widely used in diamond and gemstone-studded jewellery.",
  },
  {
    karat: "18K",
    fineness: 750,
    percentage: 75.0,
    gradeCode: "18K750",
    name: "18 Karat Gold",
    description: "Contains 75.0% pure gold. The premium standard for diamond jewellery, bridal bands, and luxury watches.",
  },
  {
    karat: "20K",
    fineness: 833,
    percentage: 83.3,
    gradeCode: "20K833",
    name: "20 Karat Gold",
    description: "Contains at least 83.3% pure gold. Traditionally used in specific regional Indian antique and temple jewellery.",
  },
  {
    karat: "22K",
    fineness: 916,
    percentage: 91.6,
    gradeCode: "22K916",
    name: "22 Karat Gold",
    description: "Contains at least 91.6% pure gold. The most popular standard for traditional Indian gold jewellery and chains.",
  },
  {
    karat: "23K",
    fineness: 958,
    percentage: 95.8,
    gradeCode: "23K958",
    name: "23 Karat Gold",
    description: "Contains at least 95.8% pure gold. High-purity craftsmanship gold popular for delicate traditional Indian ornaments.",
  },
  {
    karat: "24KS",
    fineness: 995,
    percentage: 99.5,
    gradeCode: "24K995 (Standard)",
    name: "24 Karat Standard Gold",
    description: "Standard commercial 24K pure gold, commonly minted into gold coins and investment bars.",
  },
  {
    karat: "24KF",
    fineness: 999,
    percentage: 99.9,
    gradeCode: "24K999 (Fine Gold)",
    name: "24 Karat Fine Gold",
    description: "Ultra-pure investment grade gold bullion (99.9%+ pure) used by central banks and mints.",
  },
];

export interface GoldConversionResult {
  // Input summary
  inputMode: GoldInputMode;
  inputValue: number;
  inputDisplay: string;

  // Exact mathematical conversion values
  karatExact: number;
  karatDisplay: string; // e.g. "22.00K" or "21.98K"

  percentageExact: number;
  percentageDisplay: string; // e.g. "91.67%" or "91.60%"

  finenessExact: number;
  finenessDisplay: string; // e.g. "916.67" or "916.00"

  alloyPercentageExact: number;
  alloyPercentageDisplay: string; // e.g. "8.33%"

  // BIS Hallmark Reference Grade matching
  nearestGrade: HallmarkReferenceGrade | null;
  hallmarkGradeReference: string; // e.g. "22K916" or "Non-standard grade"
  hallmarkNote: string;

  // Plain-language explanation for consumers
  consumerExplanation: string;
}

export interface GoldPurityValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Validate user input based on selected conversion mode
 */
export function validateGoldPurityInput(
  mode: GoldInputMode,
  value: number | string | undefined | null
): GoldPurityValidation {
  if (value === undefined || value === null || value === "") {
    return { isValid: false, error: "Please enter a value to convert." };
  }

  const num = typeof value === "number" ? value : Number(value);

  if (isNaN(num)) {
    return { isValid: false, error: "Please enter a valid numeric value." };
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: `${mode === "karat" ? "Karat" : mode === "percentage" ? "Purity percentage" : "Fineness"} must be greater than 0.`,
    };
  }

  if (mode === "karat") {
    if (num > 24) {
      return { isValid: false, error: "Gold karat cannot exceed 24K (pure gold reference)." };
    }
  } else if (mode === "percentage") {
    if (num > 100) {
      return { isValid: false, error: "Purity percentage cannot exceed 100%." };
    }
  } else if (mode === "fineness") {
    if (num > 1000) {
      return { isValid: false, error: "Gold fineness cannot exceed 1,000 (parts per thousand)." };
    }
  }

  return { isValid: true };
}

/**
 * Format helper for numbers to fixed decimals without trailing zeroes when exact
 */
export function formatFloat(val: number, maxDecimals: number = 2): string {
  const rounded = Math.round(val * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  // Keep consistent two decimal places for currency/percentage displays if decimal exists
  return rounded.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Helper to round to specific precision
 */
export function roundTo(val: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Finds the corresponding or closest BIS IS 1417 Hallmark Grade
 */
export function findHallmarkGrade(karat: number, fineness: number): {
  grade: HallmarkReferenceGrade | null;
  referenceCode: string;
  note: string;
} {
  // Check exact or common hallmark grade thresholds
  // 1. 24K checks
  if (karat >= 23.95 || fineness >= 995) {
    if (fineness >= 999) {
      return {
        grade: BIS_IS1417_GRADES.find((g) => g.karat === "24KF") || null,
        referenceCode: "24K999 (Fine Gold)",
        note: "Under Indian standards, 24KF represents minimum 99.9% fine gold bullion.",
      };
    }
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "24KS") || null,
      referenceCode: "24K995 (Standard)",
      note: "Under Indian standards, 24KS represents commercial 24K standard gold (99.5% minimum).",
    };
  }

  // 2. 23K (958)
  if (Math.abs(karat - 23) < 0.2 || Math.abs(fineness - 958) < 15) {
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "23K") || null,
      referenceCode: "23K958",
      note: "Common Indian hallmark grade 23K958 specifies a minimum fineness of 958 parts per thousand (95.8%).",
    };
  }

  // 3. 22K (916)
  if (Math.abs(karat - 22) < 0.25 || Math.abs(fineness - 916) < 15) {
    const isExactMath = Math.abs(karat - 22) < 0.001;
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "22K") || null,
      referenceCode: "22K916",
      note: isExactMath
        ? "Indian hallmark standard 22K916 requires a minimum fineness of 916.0, while mathematical 22/24 is approximately 916.67."
        : "Corresponds to the popular Indian 22K916 hallmark grade (minimum 91.6% pure gold).",
    };
  }

  // 4. 20K (833)
  if (Math.abs(karat - 20) < 0.25 || Math.abs(fineness - 833) < 15) {
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "20K") || null,
      referenceCode: "20K833",
      note: "Indian hallmark standard 20K833 requires a minimum fineness of 833 parts per thousand (83.3%).",
    };
  }

  // 5. 18K (750)
  if (Math.abs(karat - 18) < 0.25 || Math.abs(fineness - 750) < 15) {
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "18K") || null,
      referenceCode: "18K750",
      note: "Standard 18K gold exactly matches the 18K750 hallmark grade (75.0% pure gold, 750 fineness).",
    };
  }

  // 6. 14K (585)
  if (Math.abs(karat - 14) < 0.25 || Math.abs(fineness - 585) < 15) {
    const isExactMath = Math.abs(karat - 14) < 0.001;
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "14K") || null,
      referenceCode: "14K585",
      note: isExactMath
        ? "Mathematical conversion of 14K is approximately 583.33 fineness, whereas the BIS hallmark standard 14K585 requires 585 minimum fineness."
        : "Corresponds to the 14K585 hallmark grade commonly used for diamond jewellery.",
    };
  }

  // 7. 9K (375)
  if (Math.abs(karat - 9) < 0.25 || Math.abs(fineness - 375) < 15) {
    return {
      grade: BIS_IS1417_GRADES.find((g) => g.karat === "9K") || null,
      referenceCode: "9K375",
      note: "Standard 9K gold matches the 9K375 hallmark standard with 37.5% pure gold.",
    };
  }

  return {
    grade: null,
    referenceCode: "Custom / Non-Standard",
    note: "This value does not directly align with standard Indian BIS hallmark jewellery grades (IS 1417).",
  };
}

/**
 * Main Conversion Function
 * All mathematical calculations reference 24K as pure gold.
 */
export function convertGoldPurity(mode: GoldInputMode, rawValue: number): GoldConversionResult {
  let karatExact = 0;
  let percentageExact = 0;
  let finenessExact = 0;
  let inputDisplay = "";

  if (mode === "karat") {
    karatExact = rawValue;
    percentageExact = (rawValue / 24) * 100;
    finenessExact = (rawValue / 24) * 1000;
    inputDisplay = `${roundTo(rawValue, 2)}K`;
  } else if (mode === "percentage") {
    percentageExact = rawValue;
    karatExact = (rawValue / 100) * 24;
    finenessExact = rawValue * 10;
    inputDisplay = `${roundTo(rawValue, 2)}%`;
  } else if (mode === "fineness") {
    finenessExact = rawValue;
    percentageExact = rawValue / 10;
    karatExact = (rawValue / 1000) * 24;
    inputDisplay = `${roundTo(rawValue, 2)}`;
  }

  const alloyPercentageExact = Math.max(0, 100 - percentageExact);
  const { grade, referenceCode, note } = findHallmarkGrade(karatExact, finenessExact);

  // Friendly consumer explanation
  const roundedKarat = roundTo(karatExact, 2);
  const roundedPct = roundTo(percentageExact, 2);
  const roundedAlloy = roundTo(alloyPercentageExact, 2);

  let explanation = "";
  if (roundedPct >= 99.9) {
    explanation = `24K represents 100% pure gold. In practical jewellery and bullion standards, commercial pure gold is marked 995 (24KS) or 999 (24KF).`;
  } else {
    explanation = `${roundedKarat}K gold contains approximately ${roundedPct}% pure gold. The remaining ${roundedAlloy}% consists of alloy metals (such as copper, silver, or zinc) added to provide durability and strength for jewellery.`;
  }

  return {
    inputMode: mode,
    inputValue: rawValue,
    inputDisplay,

    karatExact,
    karatDisplay: `${roundTo(karatExact, 2)}K`,

    percentageExact,
    percentageDisplay: `${roundTo(percentageExact, 2)}%`,

    finenessExact,
    finenessDisplay: `${roundTo(finenessExact, 2)}`,

    alloyPercentageExact,
    alloyPercentageDisplay: `${roundTo(alloyPercentageExact, 2)}%`,

    nearestGrade: grade,
    hallmarkGradeReference: referenceCode,
    hallmarkNote: note,

    consumerExplanation: explanation,
  };
}

