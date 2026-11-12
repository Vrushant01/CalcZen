import fs from 'fs';

const configs = [
  {
    file: 'BMICalculator.tsx',
    outdatedExpr: 'hasResult && (unit !== calcUnit || Number(heightCm) !== calcHeightCm || Number(weightKg) !== calcWeightKg || Number(heightIn) !== calcHeightIn || Number(weightLb) !== calcWeightLb)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'BMRCalculator.tsx',
    outdatedExpr: 'hasResult && (sex !== calcSex || Number(age) !== calcAge || Number(heightCm) !== calcHeightCm || Number(weightKg) !== calcWeightKg)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'CalorieCalculator.tsx',
    outdatedExpr: 'hasResult && (sex !== calcSex || Number(age) !== calcAge || Number(heightCm) !== calcHeightCm || Number(weightKg) !== calcWeightKg || activity !== calcActivity || goal !== calcGoal)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'BodyFatCalculator.tsx',
    outdatedExpr: 'hasResult && Boolean(calcState && JSON.stringify(state) !== JSON.stringify(calcState))',
    startPattern: '{hasResult && calcState && (',
    startReplacement: '{hasResult && calcState ? (',
  },
  {
    file: 'ProteinCalculator.tsx',
    outdatedExpr: 'hasResult && (unit !== calcUnit || Number(weightKg) !== calcWeightKg || Number(weightLb) !== calcWeightLb || goal !== calcGoal || activity !== calcActivity)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'WaterIntakeCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(weightKg) !== calcWeightKg || Number(activityMin) !== calcActivityMin)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'PregnancyDueDateCalculator.tsx',
    outdatedExpr: 'hasResult && (lmp !== calcLmp)',
    startPattern: '{hasResult && (',
  },
];

for (const cfg of configs) {
  const filePath = 'src/calculators/' + cfg.file;
  let code = fs.readFileSync(filePath, 'utf-8');

  // 1. Imports
  if (!code.includes('OutdatedResultBanner')) {
    code = `import { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";\n` + code;
  }

  // 2. Add isOutdated
  if (!code.includes('const isOutdated =')) {
    const hookMarker = 'useHasCalculated();';
    const outdatedDef = `useHasCalculated();\n  const isOutdated = ${cfg.outdatedExpr};`;
    code = code.replace(hookMarker, outdatedDef);
  }

  // 3. Update start of results & insert banner
  const startPat = cfg.startPattern;
  const startRepl = cfg.startReplacement || '{hasResult ? (';
  if (code.includes(startPat)) {
    const startIdx = code.indexOf(startPat);
    const motionDivIdx = code.indexOf('<motion.div', startIdx);
    const motionDivCloseIdx = code.indexOf('>', motionDivIdx);

    const beforeStart = code.slice(0, startIdx);
    const between = code.slice(startIdx + startPat.length, motionDivCloseIdx + 1);
    const rest = code.slice(motionDivCloseIdx + 1);

    code = beforeStart + startRepl + between + `\n            {isOutdated && (\n              <OutdatedResultBanner onCalculate={handleCalculate} />\n            )}` + rest;
  }

  // 4. Update end of results using regex
  const re = /(<\/motion\.div>\s*)\)\}(\s*<\/div>\s*<\/CalculatorPageLayout>)/;
  if (re.test(code)) {
    code = code.replace(re, `$1) : (
          <EmptyResultPlaceholder
            onCalculate={handleCalculate}
            category="health"
          />
        )}$2`);
  } else {
    console.warn(`Could not find end regex in ${cfg.file}`);
  }

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Successfully updated ${cfg.file}`);
}

