import fs from 'fs';

const group3Files = [
  'LoanEMICalculator.tsx',
  'LoanEligibilityCalculator.tsx',
  'CreditCardEMICalculator.tsx',
  'MortgageCalculator.tsx',
  'GSTCalculator.tsx',
  'SIPCalculator.tsx',
  'FDCalculator.tsx',
  'CompoundInterestCalculator.tsx',
  'InflationCalculator.tsx',
  'RetirementCalculator.tsx',
  '401kCalculator.tsx',
];

for (const f of group3Files) {
  const content = fs.readFileSync('src/calculators/' + f, 'utf-8');
  const lines = content.split('\n');
  const layoutIdx = lines.findIndex(l => l.includes('</CalculatorPageLayout>'));
  console.log(`=== ${f} === (layout at line ${layoutIdx + 1})`);
  console.log(lines.slice(Math.max(0, layoutIdx - 6), layoutIdx + 2).join('\n'));
}

