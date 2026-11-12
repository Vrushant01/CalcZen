import fs from 'fs';

let content = fs.readFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);

const idx = lines.findIndex((l) => l.includes('Reset to defaults'));

const replacement = [
  '                </div>',
  '              </div>',
  '            </div>',
  '          </>',
  '        ) : (',
  '          <EmptyResultPlaceholder',
  '            message="Ready to estimate gold loan"',
  '            subMessage="Enter your gold weight and purity, then press Calculate Eligible Gold Loan to see regulatory loan amount, LTV, and repayment options."',
  '          />',
  '        )}',
  '        </div>',
  '      </div>',
  '    </CalculatorPageLayout>',
  '  );',
  '}'
];

// From idx+2 (after </Button>) to idx+16 (the closing of CalculatorPageLayout)
lines.splice(idx + 2, 15, ...replacement);

fs.writeFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Fixed GoldLoanAgainstJewelleryCalculator closing tags properly.');

