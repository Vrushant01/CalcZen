import { calculators } from "../src/data/calculators.ts";

const targets = [
  "loan-emi-calculator",
  "age-calculator",
  "water-intake-calculator",
  "gold-making-charges-calculator",
  "calorie-calculator",
];

const titles = new Set();
const descs = new Set();
let duplicates = 0;

for (const c of calculators) {
  if (titles.has(c.metaTitle)) {
    console.error(`Duplicate title: ${c.metaTitle}`);
    duplicates++;
  }
  titles.add(c.metaTitle);

  if (descs.has(c.metaDescription)) {
    console.error(`Duplicate desc: ${c.metaDescription}`);
    duplicates++;
  }
  descs.add(c.metaDescription);
}

console.log(`Checked ${calculators.length} calculators for duplicate titles/descriptions. Duplicates: ${duplicates}`);

console.log("\nTarget Pages Check:");
console.log("-------------------------------------------------------------------------------------------------------------------");
console.log(
  "Slug".padEnd(32) +
  "Title (Length)".padEnd(65) +
  "Desc (Length)"
);
console.log("-------------------------------------------------------------------------------------------------------------------");

for (const slug of targets) {
  const c = calculators.find((x) => x.slug === slug);
  console.log(
    c.slug.padEnd(32) +
    `${c.metaTitle} (${c.metaTitle.length})`.padEnd(65) +
    `${c.metaDescription.length}`
  );
}
