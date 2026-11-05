export type FlamesResultLetter = "F" | "L" | "A" | "M" | "E" | "S";

export interface FlamesEliminationStep {
  before: string[];
  removed: string;
  after: string[];
}

export interface FlamesCalculationResult {
  normalizedNameA: string;
  normalizedNameB: string;
  matchedLetters: string[];
  unmatchedCount: number;
  eliminationSteps: FlamesEliminationStep[];
  resultLetter: FlamesResultLetter;
  resultName: string;
  resultDescription: string;
}

export const FLAMES_MEANINGS: Record<FlamesResultLetter, { name: string; desc: string }> = {
  F: {
    name: "Friends",
    desc: "A fun friendship-style result. Maybe you're better partners in crime than partners in romance.",
  },
  L: {
    name: "Love",
    desc: "The classic romantic FLAMES result. Take it as a playful sign and enjoy the moment.",
  },
  A: {
    name: "Affection",
    desc: "A warm and caring connection — a playful result suggesting fondness and affection.",
  },
  M: {
    name: "Marriage",
    desc: "The dramatic FLAMES classic — a playful marriage result, not a prediction of the future.",
  },
  E: {
    name: "Enemies",
    desc: "The spicy result! Treat it as part of the game, not a real judgment about your relationship.",
  },
  S: {
    name: "Siblings",
    desc: "A familiar, comfortable bond — the traditional sibling-style FLAMES result.",
  },
};

export function normalizeName(name: string): string {
  return name.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

export function calculateFlames(nameA: string, nameB: string): FlamesCalculationResult {
  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);

  const freqA: Record<string, number> = {};
  const freqB: Record<string, number> = {};

  for (const char of normA) {
    freqA[char] = (freqA[char] || 0) + 1;
  }
  for (const char of normB) {
    freqB[char] = (freqB[char] || 0) + 1;
  }

  const matchedLetters: string[] = [];
  const allUniqueChars = Array.from(new Set([...normA.split(""), ...normB.split("")])).sort();

  let unmatchedCount = 0;

  for (const char of allUniqueChars) {
    const countA = freqA[char] || 0;
    const countB = freqB[char] || 0;
    const matched = Math.min(countA, countB);

    for (let i = 0; i < matched; i++) {
      matchedLetters.push(char);
    }

    unmatchedCount += countA + countB - 2 * matched;
  }

  const letters = ["F", "L", "A", "M", "E", "S"];
  const steps: FlamesEliminationStep[] = [];
  let resultLetter: FlamesResultLetter;

  if (unmatchedCount === 0) {
    resultLetter = "F";
  } else {
    let index = 0;
    while (letters.length > 1) {
      index = (index + unmatchedCount - 1) % letters.length;
      const before = [...letters];
      const removed = letters[index];
      letters.splice(index, 1);

      steps.push({
        before,
        removed,
        after: [...letters],
      });

      if (index >= letters.length) {
        index = 0;
      }
    }
    resultLetter = letters[0] as FlamesResultLetter;
  }

  return {
    normalizedNameA: normA,
    normalizedNameB: normB,
    matchedLetters,
    unmatchedCount,
    eliminationSteps: steps,
    resultLetter,
    resultName: FLAMES_MEANINGS[resultLetter].name,
    resultDescription: FLAMES_MEANINGS[resultLetter].desc,
  };
}
