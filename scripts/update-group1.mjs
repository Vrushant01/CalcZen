import fs from 'fs';

// 1. Update SilverJewelleryBillCalculator.tsx
function updateSilverJewelleryBillCalculator() {
  let code = fs.readFileSync('src/calculators/SilverJewelleryBillCalculator.tsx', 'utf8');

  // Update imports
  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  // Update hook call
  code = code.replace(
    '  const { markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  // Update calculation
  code = code.replace(
    '  const validation = useMemo(() => validateSilverJewelleryInputs(inputs), [inputs]);\n  const result = useMemo(() => calculateSilverJewelleryBill(inputs), [inputs]);',
    '  const validation = useMemo(() => validateSilverJewelleryInputs(inputs), [inputs]);\n  const result = useMemo(() => calculateSilverJewelleryBill(activeInputs), [activeInputs]);'
  );

  // Remove unwanted markCalculated in onChange
  const lines = code.split('\n');
  const cleaned = lines.map((l, i) => {
    if (l.trim() === 'markCalculated();' && !lines.slice(Math.max(0, i - 4), i + 4).some(sub => sub.includes('Calculate Price'))) {
      return null;
    }
    return l;
  }).filter(l => l !== null);
  code = cleaned.join('\n');

  // Wrap right column with hasResult check
  const startTarget = '<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n            <div className="p-6 bg-card';
  const startTargetLF = '<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n            <div className="p-6 bg-card';
  const startReplacement = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">
            {hasResult ? (
              <>
                {isOutdated && (
                  <OutdatedResultBanner
                    onCalculate={() => {
                      markCalculated();
                      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                )}
                <div className="p-6 bg-card`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetLF)) {
    code = code.replace(startTargetLF, startReplacement);
  }

  const endTarget = `Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>`;
  const endTargetCRLF = `Reset to defaults\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>`;

  const endReplacement = `Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
              </>
            ) : (
              <EmptyResultPlaceholder
                message="Ready to calculate silver jewellery bill"
                subMessage="Enter your weight, purity, and rate, then press Calculate Price to see your itemized bill estimate."
              />
            )}
          </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/SilverJewelleryBillCalculator.tsx', code, 'utf8');
  console.log('✓ SilverJewelleryBillCalculator updated');
}

updateSilverJewelleryBillCalculator();

