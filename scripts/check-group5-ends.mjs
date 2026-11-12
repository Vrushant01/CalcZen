import fs from 'fs';

const group5Files = [
  'AgeCalculator.tsx',
  'PercentageCalculator.tsx',
  'CGPACalculator.tsx',
  'AttendanceCalculator.tsx',
  'TipCalculator.tsx',
  'SalaryCalculator.tsx',
  'JobOfferCalculator.tsx',
  'LoveCalculator.tsx',
  'FlamesCalculator.tsx',
  'CoupleAgeDifferenceCalculator.tsx',
];

for (const f of group5Files) {
  const content = fs.readFileSync('src/calculators/' + f, 'utf-8');
  const lines = content.split('\n');
  const layoutIdx = lines.findIndex(l => l.includes('</CalculatorPageLayout>'));
  console.log(`=== ${f} === (layout at line ${layoutIdx + 1})`);
  console.log(lines.slice(Math.max(0, layoutIdx - 7), layoutIdx + 2).join('\n'));
}

