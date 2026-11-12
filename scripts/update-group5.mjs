import fs from 'fs';

const configs = [
  {
    file: 'AgeCalculator.tsx',
    outdatedExpr: 'hasResult && (dob !== calcDob || on !== calcOn)',
    startPattern: '{hasResult && (',
    category: 'everyday',
  },
  {
    file: 'PercentageCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(a) !== calcA || Number(b) !== calcB || Number(x) !== calcX || Number(y) !== calcY || Number(from) !== calcFrom || Number(to) !== calcTo)',
    startPattern: '{hasResult && (',
    category: 'math',
  },
  {
    file: 'AttendanceCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(conducted) !== calcConducted || Number(attended) !== calcAttended)',
    startPattern: '{hasResult && (',
    category: 'math',
  },
  {
    file: 'TipCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(bill) !== calcBill || Number(tip) !== calcTip || Number(people) !== calcPeople)',
    startPattern: '{hasResult && (',
    category: 'everyday',
  },
  {
    file: 'SalaryCalculator.tsx',
    outdatedExpr: 'hasResult && Boolean(calcParams && JSON.stringify(params) !== JSON.stringify(calcParams))',
    startPattern: '{hasResult && (',
    category: 'salary-and-employment',
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
  const startRepl = '{hasResult ? (';
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
            category="${cfg.category}"
          />
        )}$2`);
  } else {
    console.warn(`Could not find end regex in ${cfg.file}`);
  }

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Successfully updated ${cfg.file}`);
}

