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
  const usesHasCalculated = content.includes('useHasCalculated');
  const calcVars = [...content.matchAll(/const\s+\[calc([A-Za-z0-9_]+),\s*setCalc\1\]/g)].map(m => m[1]);
  const hasResultCheck = content.includes('hasResult');
  console.log(`${f}: usesHasCalculated=${usesHasCalculated}, hasResultCheck=${hasResultCheck}, calcVars=[${calcVars.join(', ')}]`);
}

