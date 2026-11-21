import type { CalculatorEducationalContent } from "./content-types";

// Vite eager glob import for all calculator educational content
const contentModules = import.meta.glob<{ default: CalculatorEducationalContent }>(
  "./content/*.ts",
  { eager: true }
);

export const educationalContentMap: Record<string, CalculatorEducationalContent> = {};

for (const filePath in contentModules) {
  const match = filePath.match(/\/([^/]+)\.ts$/);
  if (match && contentModules[filePath].default) {
    educationalContentMap[match[1]] = contentModules[filePath].default;
  }
}

export function getEducationalContent(slug: string): CalculatorEducationalContent | null {
  return educationalContentMap[slug] || null;
}
