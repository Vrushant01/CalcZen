import fs from 'fs';

const files = [
  'AgeCalculator.tsx',
  'PercentageCalculator.tsx',
  'CGPACalculator.tsx',
  'AttendanceCalculator.tsx',
  'TipCalculator.tsx',
  'SalaryCalculator.tsx',
  'JobOfferCalculator.tsx',
];

for (const f of files) {
  const content = fs.readFileSync('src/calculators/' + f, 'utf-8');
  const lines = content.split('\n');
  const calcPairs = [];
  for (const line of lines) {
    const m = line.match(/const\s+\[calc([A-Za-z0-9_]+),\s*setCalc\1\]\s*=\s*useState/);
    if (m) {
      const name = m[1];
      const rawName = name.charAt(0).toLowerCase() + name.slice(1);
      calcPairs.push({ calcVar: 'calc' + name, rawVar: rawName });
    }
  }
  const hasResultLines = lines.filter(l => l.includes('hasResult'));
  console.log(`=== ${f} ===`);
  console.log('Calc vars:', calcPairs.map(p => `${p.rawVar} !== ${p.calcVar}`).join(', '));
  console.log('hasResult occurrences:', hasResultLines.map(l => l.trim()).slice(0, 3));
}

