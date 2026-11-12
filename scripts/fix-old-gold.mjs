import fs from 'fs';

let content = fs.readFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);
const idx = lines.findIndex(l => l.includes('Reset to defaults'));

console.log('Reset to defaults at line:', idx + 1);
for (let i = idx; i < lines.length && i < idx + 25; i++) {
  console.log(i + 1, lines[i]);
}

const replacement = [
  '                </div>',
  '              </div>',
  '            </div>',
  '            </div>',
  '          </>',
  '        ) : (',
  '          <EmptyResultPlaceholder',
  '            message="Ready to calculate old gold exchange value"',
  '            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."',
  '          />',
  '        )}',
  '        </div>',
  '        </div>',
  '      </div>',
  '    </CalculatorPageLayout>',
  '  );',
  '}'
];

lines.splice(idx + 2, 15, ...replacement);

fs.writeFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Fixed OldGoldExchangeValueCalculator.tsx');

