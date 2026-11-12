import * as fs from "fs";
import * as path from "path";

const registryContent = fs.readFileSync("src/calculators/registry.ts", "utf8");
const regex = /import\("@\/calculators\/([^"]+)"\)/g;
const uniqueFiles = new Set<string>();
let match;
while ((match = regex.exec(registryContent)) !== null) {
  uniqueFiles.add(match[1]);
}

console.log("File, UsesCalculateButton, UsesHasCalculated, StateStyle");
for (const file of Array.from(uniqueFiles).sort()) {
  const filePath = path.join("src", "calculators", `${file}.tsx`);
  const content = fs.readFileSync(filePath, "utf8");

  const usesCalculateBtn = content.includes("CalculateButton");
  const usesHasCalculated = content.includes("useHasCalculated");
  const hasCalcPrefix = /calc[A-Z]/.test(content); // e.g. calcPrincipal, calcHeight
  const hasHasResult = content.includes("hasResult");

  let style = "direct-auto";
  if (hasCalcPrefix && hasHasResult) style = "calc-prefix-gate";
  else if (hasHasResult) style = "has-result-gate";
  else if (usesCalculateBtn) style = "button-no-gate";

  console.log(`${file}: ${style} (btn: ${usesCalculateBtn}, hook: ${usesHasCalculated})`);
}

