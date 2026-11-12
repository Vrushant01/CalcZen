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
  const startLines = [];
  const endLines = [];
  lines.forEach((l, idx) => {
    if (l.includes('{hasResult && (') || l.includes('{hasResult && retirementResults && (') || l.includes('{hasResult && results401k && (')) {
      startLines.push(idx + 1);
    }
  });
  console.log(`${f}: starts at line ${startLines.join(', ')}`);
}

