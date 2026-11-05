// Test script

const FLAMES_MEANINGS = {
  F: "Friends",
  L: "Love",
  A: "Affection",
  M: "Marriage",
  E: "Enemies",
  S: "Siblings",
};

function normalizeName(name) {
  return name.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function calculateFlames(nameA, nameB) {
  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);

  const freqA = {};
  const freqB = {};

  for (const char of normA) freqA[char] = (freqA[char] || 0) + 1;
  for (const char of normB) freqB[char] = (freqB[char] || 0) + 1;

  const allUniqueChars = Array.from(new Set([...normA.split(""), ...normB.split("")])).sort();
  let unmatchedCount = 0;
  for (const char of allUniqueChars) {
    const matched = Math.min(freqA[char] || 0, freqB[char] || 0);
    unmatchedCount += (freqA[char] || 0) + (freqB[char] || 0) - 2 * matched;
  }

  const letters = ["F", "L", "A", "M", "E", "S"];

  if (unmatchedCount === 0) return "F";

  let index = 0;
  while (letters.length > 1) {
    index = (index + unmatchedCount - 1) % letters.length;
    letters.splice(index, 1);
    if (index >= letters.length) index = 0;
  }
  return letters[0];
}

console.log("ALEX + JORDAN", calculateFlames("Alex", "Jordan"));
console.log("JORDAN + ALEX", calculateFlames("Jordan", "Alex"));
console.log("ANNA + ALAN", calculateFlames("Anna", "Alan"));
console.log("KRISH + TISHA", calculateFlames("Krish", "Tisha"));
console.log("O'CONNOR + OCONNOR", calculateFlames("O'Connor", "OConnor"));
console.log("ALEX + ALEX", calculateFlames("Alex", "Alex"));
