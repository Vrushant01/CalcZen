import fs from 'fs';

let content = fs.readFileSync('src/calculators/GoldJewelleryBillCalculator.tsx', 'utf8');
const lines = content.split(/\r?\n/);

const idx = lines.findIndex((l) => l.includes('calculatorName="Gold Jewellery Bill Estimate"'));
console.log('PDF export at line:', idx + 1);

// Find the closing of motion.div and hasResult
const closeMotionIdx = lines.findIndex((l, i) => i > idx && l.includes('</motion.div>'));
console.log('closeMotionIdx:', closeMotionIdx + 1);

const replacement = [
  '          </motion.div>',
  '        ) : (',
  '          <EmptyResultPlaceholder',
  '            message="Ready to calculate gold jewellery bill"',
  '            subMessage="Enter gold weight, purity, and rate, then press Calculate Jewellery Bill to see full tax invoice breakdown."',
  '          />',
  '        )}'
];

lines.splice(closeMotionIdx, 2, ...replacement);

fs.writeFileSync('src/calculators/GoldJewelleryBillCalculator.tsx', lines.join('\r\n'), 'utf8');
console.log('Successfully updated GoldJewelleryBillCalculator.tsx');

