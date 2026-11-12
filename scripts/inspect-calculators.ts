import * as fs from "fs";
import * as path from "path";
import { calculators } from "../src/data/calculators";

const registryContent = fs.readFileSync("src/calculators/registry.ts", "utf8");
const regex = /import\("@\/calculators\/([^"]+)"\)/g;
const uniqueFiles = new Set<string>();
let match;
while ((match = regex.exec(registryContent)) !== null) {
  uniqueFiles.add(match[1]);
}

interface CalcAudit {
  file: string;
  hasCalculateButtonImport: boolean;
  hasUseHasCalculatedImport: boolean;
  hasCalculateButtonInJSX: boolean;
  hasHasResultCheck: boolean;
  autoCalculatesOnLoad: boolean;
  tracksInputChanges: boolean;
  category: string;
  slug: string;
}

const auditResults: CalcAudit[] = [];

for (const file of Array.from(uniqueFiles).sort()) {
  const filePath = path.join("src", "calculators", `${file}.tsx`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf8");

  const calcMeta = calculators.find((c) => {
    // Check if slug maps to this file
    const regLine = `import("@/calculators/${file}")`;
    return registryContent.includes(`"${c.slug}": lazy(() =>\n    ${regLine}`) ||
           registryContent.includes(`"${c.slug}": lazy(() =>\r\n    ${regLine}`);
  });

  const hasCalculateButtonImport = content.includes("CalculateButton");
  const hasUseHasCalculatedImport = content.includes("useHasCalculated");
  const hasCalculateButtonInJSX =
    content.includes("<CalculateButton") ||
    /Button[^>]*>[^<]*Calculate/i.test(content) ||
    /Button[^>]*>[^<]*Convert/i.test(content);
  const hasHasResultCheck =
    content.includes("hasResult") ||
    content.includes("isCalculated") ||
    content.includes("hasCalculated") ||
    content.includes("showResults");
  
  // Checks if result is computed via useMemo directly and displayed unconditionally
  // or if wrapped in conditional
  const autoCalculatesOnLoad = !hasHasResultCheck;
  const tracksInputChanges = content.includes("inputsChanged") || content.includes("isOutdated") || content.includes("outdated");

  auditResults.push({
    file,
    slug: calcMeta?.slug || "alias-or-unmatched",
    category: calcMeta?.category || "unknown",
    hasCalculateButtonImport,
    hasUseHasCalculatedImport,
    hasCalculateButtonInJSX,
    hasHasResultCheck,
    autoCalculatesOnLoad,
    tracksInputChanges,
  });
}

console.log("\n================ FULL AUDIT OF 46 CALCULATORS ================");
console.table(auditResults.map(a => ({
  file: a.file,
  category: a.category,
  hasBtn: a.hasCalculateButtonInJSX,
  hasResultGate: a.hasHasResultCheck,
  autoOnLoad: a.autoCalculatesOnLoad,
  tracksChanges: a.tracksInputChanges,
})));

const needsResultGate = auditResults.filter(a => a.autoCalculatesOnLoad);
const hasGateNoChangeTrack = auditResults.filter(a => a.hasHasResultCheck && !a.tracksChanges);
const fullCompliance = auditResults.filter(a => a.hasHasResultCheck && a.tracksChanges);

console.log(`\nSummary:`);
console.log(`Total calculators: ${auditResults.length}`);
console.log(`Calculators with auto-calculation on load (needs gate + button): ${needsResultGate.length}`);
console.log(`Calculators with gate but no change tracking (needs input change detection): ${hasGateNoChangeTrack.length}`);
console.log(`Calculators with full compliance: ${fullCompliance.length}`);

