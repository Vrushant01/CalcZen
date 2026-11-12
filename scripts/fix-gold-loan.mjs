import fs from 'fs';

let content = fs.readFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);

const idx = lines.findIndex((l) => l.includes('Reset to defaults'));
console.log('Reset to defaults at line:', idx + 1);

// Look ahead for the closing divs
// line idx+1: </Button>
// line idx+2: </div> (toolbar)
// line idx+3: </div> (sticky card)
// line idx+4: </div> (resultsRef)
// line idx+5: </div> (12-col grid)
// line idx+6: </CalculatorPageLayout>

console.log('Lines around it:');
for (let i = idx; i <= idx + 8; i++) {
  console.log(i + 1, lines[i]);
}

const replacement = [
  '          </>',
  '        ) : (',
  '          <EmptyResultPlaceholder',
  '            message="Ready to estimate gold loan"',
  '            subMessage="Enter your gold weight and purity, then press Calculate Eligible Gold Loan to see regulatory loan amount, LTV, and repayment options."',
  '          />',
  '        )}',
  '        </div>',
  '      </div>',
  '    </CalculatorPageLayout>'
];

// Replace from idx+4 (which was the closing </div> of resultsRef)
lines.splice(idx + 4, 3, ...replacement);

fs.writeFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Successfully updated GoldLoanAgainstJewelleryCalculator.tsx');
