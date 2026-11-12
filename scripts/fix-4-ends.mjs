import fs from 'fs';

const files = [
  'CreditCardEMICalculator.tsx',
  'FDCalculator.tsx',
  'CompoundInterestCalculator.tsx',
  'InflationCalculator.tsx',
];

for (const f of files) {
  const filePath = 'src/calculators/' + f;
  let code = fs.readFileSync(filePath, 'utf-8');

  // Regex to match </motion.div>\s*\)}\s*</div>\s*</CalculatorPageLayout>
  const re = /(<\/motion\.div>\s*)\)\}(\s*<\/div>\s*<\/CalculatorPageLayout>)/;
  if (re.test(code)) {
    code = code.replace(re, `$1) : (
          <EmptyResultPlaceholder
            onCalculate={handleCalculate}
            category="finance"
          />
        )}$2`);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log(`Fixed end of ${f}`);
  } else {
    console.error(`Could not regex match end of ${f}`);
  }
}

