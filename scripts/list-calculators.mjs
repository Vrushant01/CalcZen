import fs from 'fs';
import path from 'path';

const reg = fs.readFileSync('src/calculators/registry.ts', 'utf-8');
const lines = reg.split('\n');
const files = new Set();
for (const line of lines) {
  const m = line.match(/@\/calculators\/([A-Za-z0-9_-]+)/);
  if (m) {
    files.add(m[1] + '.tsx');
  }
}

const list = [...files].sort();
console.log(`Found ${list.length} unique calculator files in registry:`);

const statusReport = [];

for (const f of list) {
  const p = path.join('src/calculators', f);
  if (!fs.existsSync(p)) {
    statusReport.push({ file: f, exists: false });
    continue;
  }
  const content = fs.readFileSync(p, 'utf-8');
  const hasHook = content.includes('useHasCalculated') || content.includes('useCalculatorState');
  const usesCalculatorState = content.includes('useCalculatorState');
  const hasEmptyPlaceholder = content.includes('EmptyResultPlaceholder');
  const hasOutdatedBanner = content.includes('OutdatedResultBanner');

  statusReport.push({
    file: f,
    usesCalculatorState,
    hasEmptyPlaceholder,
    hasOutdatedBanner,
  });
}

console.table(statusReport);
