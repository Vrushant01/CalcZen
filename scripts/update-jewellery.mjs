import fs from 'fs';

// 1. JewelleryBudgetToWeightCalculator.tsx
function updateJewelleryBudget() {
  let code = fs.readFileSync('src/calculators/JewelleryBudgetToWeightCalculator.tsx', 'utf8');

  // Imports
  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  // Hook and calculation
  const targetCalc = `  const validation = useMemo(() => validateBudgetInputs(inputs), [inputs]);
  const result: BudgetToWeightResult = useMemo(
    () => calculateBudgetToWeight(inputs, 3),
    [inputs]
  );

  // Secondary Reverse Budget Calculation (Desired Weight -> Budget Needed)
  const reversePrice = useMemo(() => {
    return calculatePriceForWeight(Math.max(0, Number(desiredWeight) || 0), inputs);
  }, [desiredWeight, inputs]);`;

  const replaceCalc = `  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =
    useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;
  const validation = useMemo(() => validateBudgetInputs(inputs), [inputs]);
  const result: BudgetToWeightResult = useMemo(
    () => calculateBudgetToWeight(activeInputs, 3),
    [activeInputs]
  );

  // Secondary Reverse Budget Calculation (Desired Weight -> Budget Needed)
  const reversePrice = useMemo(() => {
    return calculatePriceForWeight(Math.max(0, Number(desiredWeight) || 0), activeInputs);
  }, [desiredWeight, activeInputs]);`;

  code = code.replace(targetCalc, replaceCalc);

  // handleReset
  code = code.replace(
    '    setShowFullBreakdown(false);\n  };',
    '    setShowFullBreakdown(false);\n    resetCalculated();\n  };'
  );

  // Wrap right column with hasResult
  const startTarget = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n        <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startTargetCRLF = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n        <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startReplacement = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">
        {hasResult ? (
          <>
            {isOutdated && (
              <OutdatedResultBanner onCalculate={handleCalculateClick} />
            )}
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetCRLF)) {
    code = code.replace(startTargetCRLF, startReplacement);
  }

  const endTarget = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  const endTargetCRLF = `                  <Button\r\n                    type="button"\r\n                    variant="ghost"\r\n                    size="sm"\r\n                    onClick={handleReset}\r\n                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"\r\n                  >\r\n                    <RotateCcw className="h-3 w-3 mr-1" />\r\n                    Reset to defaults\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>`;

  const endReplacement = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate jewellery weight"
            subMessage="Enter your budget, select metal and purity, then press Calculate My Jewellery Weight."
          />
        )}
        </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/JewelleryBudgetToWeightCalculator.tsx', code, 'utf8');
  console.log('✓ JewelleryBudgetToWeightCalculator updated');
}

// 2. GoldLoanAgainstJewelleryCalculator.tsx
function updateGoldLoan() {
  let code = fs.readFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { markCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const validation = useMemo(() => validateGoldLoanInputs(inputs), [inputs]);\n  const result: GoldLoanCalculationResult = useMemo(\n    () => calculateGoldLoan(inputs),\n    [inputs]\n  );',
    '  const validation = useMemo(() => validateGoldLoanInputs(inputs), [inputs]);\n  const result: GoldLoanCalculationResult = useMemo(\n    () => calculateGoldLoan(activeInputs),\n    [activeInputs]\n  );'
  );

  code = code.replace(
    '    setShowFullCalculation(false);\n  };',
    '    setShowFullCalculation(false);\n    resetCalculated();\n  };'
  );

  const startTarget = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startTargetCRLF = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  const startReplacement = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">
          {hasResult ? (
            <>
              {isOutdated && (
                <OutdatedResultBanner onCalculate={handleCalculateClick} />
              )}
              <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetCRLF)) {
    code = code.replace(startTargetCRLF, startReplacement);
  }

  const endTarget = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  const endTargetCRLF = `                  <Button\r\n                    type="button"\r\n                    variant="ghost"\r\n                    size="sm"\r\n                    onClick={handleReset}\r\n                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"\r\n                  >\r\n                    <RotateCcw className="h-3 w-3 mr-1" />\r\n                    Reset to defaults\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>`;

  const endReplacement = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to estimate gold loan"
            subMessage="Enter your gold weight and purity, then press Calculate Eligible Gold Loan to see regulatory loan amount, LTV, and repayment options."
          />
        )}
        </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/GoldLoanAgainstJewelleryCalculator.tsx', code, 'utf8');
  console.log('✓ GoldLoanAgainstJewelleryCalculator updated');
}

// 3. DiamondJewelleryPriceCalculator.tsx
function updateDiamondJewellery() {
  let code = fs.readFileSync('src/calculators/DiamondJewelleryPriceCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { markCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const validation = useMemo(() => validateDiamondInputs(inputs), [inputs]);\n  const result: DiamondJewelleryResult = useMemo(() => calculateDiamondJewelleryPrice(inputs), [inputs]);',
    '  const validation = useMemo(() => validateDiamondInputs(inputs), [inputs]);\n  const result: DiamondJewelleryResult = useMemo(() => calculateDiamondJewelleryPrice(activeInputs), [activeInputs]);'
  );

  code = code.replace(
    '    setShowFullBreakdown(false);\n  };',
    '    setShowFullBreakdown(false);\n    resetCalculated();\n  };'
  );

  const startTarget = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startTargetCRLF = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

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
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetCRLF)) {
    code = code.replace(startTargetCRLF, startReplacement);
  }

  const endTarget = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  const endTargetCRLF = `                  <Button\r\n                    type="button"\r\n                    variant="ghost"\r\n                    size="sm"\r\n                    onClick={handleReset}\r\n                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"\r\n                  >\r\n                    <RotateCcw className="h-3 w-3 mr-1" />\r\n                    Reset to defaults\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>`;

  const endReplacement = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate diamond jewellery price"
            subMessage="Enter diamond details, metal weight, and making charges, then press Calculate Jewellery Price."
          />
        )}
        </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/DiamondJewelleryPriceCalculator.tsx', code, 'utf8');
  console.log('✓ DiamondJewelleryPriceCalculator updated');
}

// 4. OldGoldExchangeValueCalculator.tsx
function updateOldGold() {
  let code = fs.readFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const validation = useMemo(() => validateOldGoldInputs(inputs), [inputs]);\n  const result = useMemo(() => calculateOldGoldExchangeValue(inputs), [inputs]);',
    '  const validation = useMemo(() => validateOldGoldInputs(inputs), [inputs]);\n  const result = useMemo(() => calculateOldGoldExchangeValue(activeInputs), [activeInputs]);'
  );

  const startTarget = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startTargetCRLF = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n            <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

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
                <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetCRLF)) {
    code = code.replace(startTargetCRLF, startReplacement);
  }

  const endTarget = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  const endTargetCRLF = `                  <Button\r\n                    type="button"\r\n                    variant="ghost"\r\n                    size="sm"\r\n                    onClick={handleReset}\r\n                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"\r\n                  >\r\n                    <RotateCcw className="h-3 w-3 mr-1" />\r\n                    Reset to defaults\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>`;

  const endReplacement = `                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to defaults
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate old gold exchange value"
            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."
          />
        )}
        </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', code, 'utf8');
  console.log('✓ OldGoldExchangeValueCalculator updated');
}

// 5. GoldPurityKaratConverter.tsx
function updateGoldPurityConverter() {
  let code = fs.readFileSync('src/calculators/GoldPurityKaratConverter.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  const targetState = `  // Core user state
  const [inputMode, setInputMode] = useState<GoldInputMode>("karat");
  const [inputValue, setInputValue] = useState<number>(22);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Validation
  const validation = useMemo(
    () => validateGoldPurityInput(inputMode, inputValue),
    [inputMode, inputValue]
  );

  // Conversion calculations
  const result: GoldConversionResult = useMemo(() => {
    if (!validation.isValid || inputValue <= 0) {
      return convertGoldPurity(inputMode, 22);
    }
    return convertGoldPurity(inputMode, Number(inputValue));
  }, [inputMode, inputValue, validation.isValid]);`;

  const replaceState = `  // Core user state
  const [inputMode, setInputMode] = useState<GoldInputMode>("karat");
  const [inputValue, setInputValue] = useState<number>(22);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const inputs = useMemo(() => ({ inputMode, inputValue: Number(inputValue) || 0 }), [inputMode, inputValue]);
  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);
  const activeInputs = calculatedInputs || inputs;

  // Validation
  const validation = useMemo(
    () => validateGoldPurityInput(inputMode, inputValue),
    [inputMode, inputValue]
  );

  // Conversion calculations
  const result: GoldConversionResult = useMemo(() => {
    if (!validation.isValid || activeInputs.inputValue <= 0) {
      return convertGoldPurity(activeInputs.inputMode, 22);
    }
    return convertGoldPurity(activeInputs.inputMode, Number(activeInputs.inputValue));
  }, [activeInputs, validation.isValid]);`;

  code = code.replace(targetState, replaceState);

  // Remove markCalculated from handleModeChange
  code = code.replace(
    '    else setInputValue(916);\n    markCalculated();\n  };',
    '    else setInputValue(916);\n  };'
  );

  const startTarget = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\n          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;
  const startTargetCRLF = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">\r\n          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  const startReplacement = `<div ref={resultsRef} className="lg:col-span-5 space-y-6">
          {hasResult ? (
            <>
              {isOutdated && (
                <OutdatedResultBanner
                  onCalculate={() => {
                    markCalculated();
                    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  message="Your input has changed. Press Convert to update your result."
                />
              )}
              <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-5 lg:sticky lg:top-24">`;

  if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
  } else if (code.includes(startTargetCRLF)) {
    code = code.replace(startTargetCRLF, startReplacement);
  }

  const endTarget = `                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to 22K standard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  const endTargetCRLF = `                <div className="flex justify-end">\r\n                  <Button\r\n                    type="button"\r\n                    variant="ghost"\r\n                    size="sm"\r\n                    onClick={handleReset}\r\n                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"\r\n                  >\r\n                    <RotateCcw className="h-3 w-3 mr-1" />\r\n                    Reset to 22K standard\r\n                  </Button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>`;

  const endReplacement = `                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleReset();
                      resetCalculated();
                    }}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to 22K standard
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to convert gold purity"
            subMessage="Select your input type, enter a karat or fineness, then press Convert Purity."
          />
        )}
        </div>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplacement);
  }

  fs.writeFileSync('src/calculators/GoldPurityKaratConverter.tsx', code, 'utf8');
  console.log('✓ GoldPurityKaratConverter updated');
}

// 6. GoldMakingChargesCalculator.tsx
function updateGoldMakingCharges() {
  let code = fs.readFileSync('src/calculators/GoldMakingChargesCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useHasCalculated } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  // Line 285: const hasResult = hasCalculated || (Number(goldWeight) > 0 && Number(goldRate) > 0);
  code = code.replace(
    '  const hasResult = hasCalculated || (Number(goldWeight) > 0 && Number(goldRate) > 0);',
    '  const hasResult = hasCalculated;'
  );

  // Reset: remove markCalculated() from handleReset
  code = code.replace(
    '    resetCalculated();\n    markCalculated();\n  };',
    '    resetCalculated();\n  };'
  );

  fs.writeFileSync('src/calculators/GoldMakingChargesCalculator.tsx', code, 'utf8');
  console.log('✓ GoldMakingChargesCalculator updated');
}

// 7. GoldJewelleryBillCalculator.tsx
function updateGoldJewelleryBill() {
  let code = fs.readFileSync('src/calculators/GoldJewelleryBillCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useHasCalculated } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  // Remove markCalculated() from handleLoadSample or handleReset
  code = code.replace(
    '    setHallmarkingCharge(45);\n    markCalculated();\n  };',
    '    setHallmarkingCharge(45);\n  };'
  );

  // Add EmptyResultPlaceholder when !hasResult
  const targetDashboard = `        {/* RESULTS PRESENTATION DASHBOARD */}
        {hasResult && (`;
  const targetDashboardCRLF = `        {/* RESULTS PRESENTATION DASHBOARD */}\r\n        {hasResult && (`;

  const replaceDashboard = `        {/* RESULTS PRESENTATION DASHBOARD */}
        {hasResult ? (`;

  if (code.includes(targetDashboard)) {
    code = code.replace(targetDashboard, replaceDashboard);
  } else if (code.includes(targetDashboardCRLF)) {
    code = code.replace(targetDashboardCRLF, replaceDashboard);
  }

  // Find close of hasResult and add EmptyResultPlaceholder
  const endTarget = `            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
            </div>
          </motion.div>
        )}
      </div>
    </CalculatorPageLayout>`;
  const endTargetCRLF = `            <div className="flex flex-col">\r\n              <CalculatorPdfExport pdfData={pdfData} />\r\n            </div>\r\n          </motion.div>\r\n        )}\r\n      </div>\r\n    </CalculatorPageLayout>`;

  const endReplace = `            <div className="flex flex-col">
              <CalculatorPdfExport pdfData={pdfData} />
            </div>
          </motion.div>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate gold jewellery bill"
            subMessage="Enter gold weight, purity, and rate, then press Calculate Jewellery Bill to see full tax invoice breakdown."
          />
        )}
      </div>
    </CalculatorPageLayout>`;

  if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplace);
  } else if (code.includes(endTargetCRLF)) {
    code = code.replace(endTargetCRLF, endReplace);
  }

  fs.writeFileSync('src/calculators/GoldJewelleryBillCalculator.tsx', code, 'utf8');
  console.log('✓ GoldJewelleryBillCalculator updated');
}

updateJewelleryBudget();
updateGoldLoan();
updateDiamondJewellery();
updateOldGold();
updateGoldPurityConverter();
updateGoldMakingCharges();
updateGoldJewelleryBill();

