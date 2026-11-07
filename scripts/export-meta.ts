import { writeFileSync } from "node:fs";
import { calculators, categories } from "../src/data/calculators.ts";

const calcMap: Record<string, { title: string; description: string }> = {};
calculators.forEach((c) => {
  calcMap[c.slug] = {
    title: c.metaTitle || `${c.name} - Free Online Calculator | CalcZen`,
    description: c.metaDescription || c.description,
  };
});

const catMap: Record<string, { title: string; description: string }> = {};
categories.forEach((c) => {
  catMap[c.slug] = {
    title: `${c.name} Calculators - Free Online Tools | CalcZen`,
    description: c.description,
  };
});

const content = `/** Auto-generated from src/data/calculators.ts */
export const calculatorMeta: Record<string, { title: string; description: string }> = ${JSON.stringify(calcMap, null, 2)};

export const categoryMeta: Record<string, { title: string; description: string }> = ${JSON.stringify(catMap, null, 2)};
`;

writeFileSync("server/src/config/metaData.ts", content, "utf8");
console.log("Written server/src/config/metaData.ts successfully.");

