import fs from 'fs';

const configs = [
  {
    file: 'LoanEMICalculator.tsx',
    outdatedExpr: 'hasResult && (Number(amount) !== calcAmount || Number(rate) !== calcRate || Number(months) !== calcMonths)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'LoanEligibilityCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(income) !== calcIncome || Number(existingEmi) !== calcExistingEmi || Number(rate) !== calcRate || Number(years) !== calcYears)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'CreditCardEMICalculator.tsx',
    outdatedExpr: 'hasResult && (Number(principal) !== calcPrincipal || Number(rate) !== calcRate || Number(months) !== calcMonths)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'MortgageCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(price) !== calcPrice || Number(down) !== calcDown || Number(rate) !== calcRate || Number(years) !== calcYears || Number(tax) !== calcTax || Number(ins) !== calcIns || Number(hoa) !== calcHoa)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'GSTCalculator.tsx',
    outdatedExpr: 'hasResult && (mode !== calcMode || Number(amount) !== calcAmount || Number(rate) !== calcRate)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'SIPCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(monthly) !== calcMonthly || Number(rate) !== calcRate || Number(years) !== calcYears)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'FDCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(principal) !== calcPrincipal || Number(rate) !== calcRate || Number(years) !== calcYears || Number(months) !== calcMonths || frequency !== calcFrequency)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'CompoundInterestCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(principal) !== calcPrincipal || Number(monthly) !== calcMonthly || Number(rate) !== calcRate || Number(years) !== calcYears)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'InflationCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(amount) !== calcAmount || Number(rate) !== calcRate || Number(years) !== calcYears)',
    startPattern: '{hasResult && (',
  },
  {
    file: 'RetirementCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(currentAge) !== calcCurrentAge || Number(retirementAge) !== calcRetirementAge || Number(lifeExpectancy) !== calcLifeExpectancy || Number(currentSavings) !== calcCurrentSavings || Number(monthlyContribution) !== calcMonthlyContribution || Number(expectedReturn) !== calcExpectedReturn || Number(inflationRate) !== calcInflationRate || Number(desiredIncome) !== calcDesiredIncome || Number(pension) !== calcPension || Number(socialSecurity) !== calcSocialSecurity || Number(rentalIncome) !== calcRentalIncome || Number(otherIncome) !== calcOtherIncome || Number(federalTax) !== calcFederalTax || Number(stateTax) !== calcStateTax || inflationScenario !== calcInflationScenario || marketPerformance !== calcMarketPerformance)',
    startPattern: '{hasResult && retirementResults && (',
    startReplacement: '{hasResult && retirementResults ? (',
  },
  {
    file: '401kCalculator.tsx',
    outdatedExpr: 'hasResult && (Number(currentAge) !== calcCurrentAge || Number(retirementAge) !== calcRetirementAge || Number(currentSavings) !== calcCurrentSavings || Number(salary) !== calcSalary || Number(employeeContrPct) !== calcEmployeeContrPct || Number(employerMatchPct) !== calcEmployerMatchPct || Number(employerLimitPct) !== calcEmployerLimitPct || Number(salaryGrowthPct) !== calcSalaryGrowthPct || Number(expectedReturn) !== calcExpectedReturn || Number(inflationRate) !== calcInflationRate || inflationScenario !== calcInflationScenario || marketPerformance !== calcMarketPerformance)',
    startPattern: '{hasResult && results401k && (',
    startReplacement: '{hasResult && results401k ? (',
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

  // 3. Update start of results
  const startPat = cfg.startPattern;
  const startRepl = cfg.startReplacement || '{hasResult ? (';
  if (code.includes(startPat)) {
    // We want to insert the banner right after <motion.div ... >
    const startIdx = code.indexOf(startPat);
    const motionDivIdx = code.indexOf('<motion.div', startIdx);
    const motionDivCloseIdx = code.indexOf('>', motionDivIdx);

    const beforeStart = code.slice(0, startIdx);
    const between = code.slice(startIdx + startPat.length, motionDivCloseIdx + 1);
    const rest = code.slice(motionDivCloseIdx + 1);

    code = beforeStart + startRepl + between + `\n            {isOutdated && (\n              <OutdatedResultBanner onCalculate={handleCalculate} />\n            )}` + rest;
  }

  // 4. Update end of results
  const endPattern = `          </motion.div>\n        )}\n      </div>\n    </CalculatorPageLayout>`;
  const endRepl = `          </motion.div>\n        ) : (\n          <EmptyResultPlaceholder\n            onCalculate={handleCalculate}\n            category="finance"\n          />\n        )}\n      </div>\n    </CalculatorPageLayout>`;

  if (code.includes(endPattern)) {
    code = code.replace(endPattern, endRepl);
  } else {
    console.warn(`Could not find endPattern in ${cfg.file}`);
  }

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Successfully updated ${cfg.file}`);
}

