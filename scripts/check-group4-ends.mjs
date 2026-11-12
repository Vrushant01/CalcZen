import fs from 'fs';

const group4Files = [
  'BMICalculator.tsx',
  'BMRCalculator.tsx',
  'CalorieCalculator.tsx',
  'BodyFatCalculator.tsx',
  'ProteinCalculator.tsx',
  'WaterIntakeCalculator.tsx',
  'SleepCalculator.tsx',
  'PregnancyDueDateCalculator.tsx',
];

for (const f of group4Files) {
  const content = fs.readFileSync('src/calculators/' + f, 'utf-8');
  const lines = content.split('\n');
  const layoutIdx = lines.findIndex(l => l.includes('</CalculatorPageLayout>'));
  console.log(`=== ${f} === (layout at line ${layoutIdx + 1})`);
  console.log(lines.slice(Math.max(0, layoutIdx - 6), layoutIdx + 2).join('\n'));
}

