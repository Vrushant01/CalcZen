import fs from 'fs';

let content = fs.readFileSync('src/calculators/DiamondJewelleryPriceCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);

const idx = lines.findIndex((l) => l.includes('</CalculatorPageLayout>'));
console.log('</CalculatorPageLayout> at line:', idx + 1);

lines.splice(idx, 0, '        </div>');

fs.writeFileSync('src/calculators/DiamondJewelleryPriceCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Added missing closing div in DiamondJewelleryPriceCalculator.tsx');

