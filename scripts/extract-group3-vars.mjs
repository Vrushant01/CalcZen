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
  const calcPairs = [];
  for (const line of lines) {
    const m = line.match(/const\s+\[calc([A-Za-z0-9_]+),\s*setCalc\1\]\s*=\s*useState/);
    if (m) {
      const name = m[1];
      // lowercase first letter
      const rawName = name.charAt(0).toLowerCase() + name.slice(1);
      calcPairs.push({ calcVar: 'calc' + name, rawVar: rawName });
    }
  }
  console.log(`=== ${f} ===`);
  console.log(calcPairs.map(p => `${p.rawVar} !== ${p.calcVar}`).join(', '));
}

