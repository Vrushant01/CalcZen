import fs from 'fs';

let content = fs.readFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);

// 1. Insert {hasResult ? (<> at line 727
const openIdx = lines.findIndex(l => l.includes('<div ref={resultsRef} className="lg:col-span-5 space-y-6">'));
console.log('openIdx:', openIdx + 1);

const openReplacement = [
  '          <div ref={resultsRef} className="lg:col-span-5 space-y-6">',
  '            {hasResult ? (',
  '              <>',
  '                {isOutdated && (',
  '                  <OutdatedResultBanner',
  '                    onCalculate={() => {',
  '                      markCalculated();',
  '                      resultsRef.current?.scrollIntoView({ behavior: "smooth" });',
  '                    }}',
  '                  />',
  '                )}'
];
lines.splice(openIdx, 1, ...openReplacement);

// 2. Fix the closing at the end
const resetIdx = lines.findIndex(l => l.includes('Reset to defaults'));
console.log('resetIdx:', resetIdx + 1);

const closeReplacement = [
  '                </div>',
  '              </div>',
  '            </div>',
  '          </>',
  '        ) : (',
  '          <EmptyResultPlaceholder',
  '            message="Ready to calculate old gold exchange value"',
  '            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."',
  '          />',
  '        )}',
  '        </div>',
  '      </div>',
  '    </CalculatorPageLayout>',
  '  );',
  '}'
];

// from resetIdx + 2 to the end of the component
const layoutCloseIdx = lines.findIndex((l, i) => i > resetIdx && l.includes('</CalculatorPageLayout>'));
console.log('layoutCloseIdx:', layoutCloseIdx + 1);

lines.splice(resetIdx + 2, (layoutCloseIdx + 3) - (resetIdx + 2), ...closeReplacement);

fs.writeFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Successfully fixed OldGoldExchangeValueCalculator.tsx');

