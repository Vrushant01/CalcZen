import fs from 'fs';

const files = [
  'CreditCardEMICalculator.tsx',
  'FDCalculator.tsx',
  'CompoundInterestCalculator.tsx',
  'InflationCalculator.tsx',
];

for (const f of files) {
  const content = fs.readFileSync('src/calculators/' + f, 'utf-8');
  const lines = content.split('\n');
  const layoutIdx = lines.findIndex(l => l.includes('</CalculatorPageLayout>'));
  console.log(`=== ${f} === (layout at line ${layoutIdx + 1})`);
  console.log(lines.slice(Math.max(0, layoutIdx - 7), layoutIdx + 2).join('\n'));
}

