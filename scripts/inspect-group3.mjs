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
  const usesHasCalculated = content.includes('useHasCalculated');
  const calcVars = [...content.matchAll(/const\s+\[calc([A-Za-z0-9_]+),\s*setCalc\1\]/g)].map(m => m[1]);
  const hasResultCheck = content.includes('{hasResult && (');
  console.log(`${f}: usesHasCalculated=${usesHasCalculated}, hasResultCheck=${hasResultCheck}, calcVars=[${calcVars.join(', ')}]`);
}

