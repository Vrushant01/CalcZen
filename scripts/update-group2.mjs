import fs from 'fs';

// 1. AcElectricityCostCalculator.tsx
function updateAcCalc() {
  let code = fs.readFileSync('src/calculators/AcElectricityCostCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const result = useMemo(() => {\n    return masterCalculateAcCost(inputs);\n  }, [inputs]);',
    '  const result = useMemo(() => {\n    return masterCalculateAcCost(activeInputs);\n  }, [activeInputs]);'
  );

  // Wrap right column with hasResult
  const lines = code.split(/\r?\n/);
  const openIdx = lines.findIndex(l => l.includes('{/* RIGHT: Results Presentation Dashboard */}'));
  console.log('AcCalc openIdx:', openIdx + 1);

  // lines[openIdx + 1] is <div ref={resultsRef} ...
  // We want to insert after <div ref={resultsRef} className="lg:col-span-5 space-y-6">
  const divIdx = lines.findIndex((l, i) => i >= openIdx && l.includes('<div ref={resultsRef}'));
  lines.splice(divIdx + 1, 0,
    '          {hasResult ? (',
    '            <>',
    '              {isOutdated && (',
    '                <OutdatedResultBanner onCalculate={handleCalculateClick} />',
    '              )}'
  );

  // Now find the end of the right column (before FAQ/blog or closing tags)
  const resetBtnIdx = lines.findIndex(l => l.includes('Reset to default inputs'));
  console.log('AcCalc resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = lines.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('AcCalc layoutCloseIdx:', layoutCloseIdx + 1);

  // Before </CalculatorPageLayout>, there are closing divs for resultsRef, grid, container
  // Replace the closing of resultsRef with the end of hasResult
  const closeReplacement = [
    '              </div>',
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate AC running cost"',
    '            subMessage="Select your AC specs, daily usage, and electricity rate, then press Calculate AC Running Cost & Units."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  // From resetBtnIdx + 3 (after </Button>) to layoutCloseIdx
  lines.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/AcElectricityCostCalculator.tsx', lines.join('\r\n'), 'utf8');
  console.log('✓ AcElectricityCostCalculator updated');
}

// 2. ApplianceElectricityCostCalculator.tsx
function updateApplianceCalc() {
  let code = fs.readFileSync('src/calculators/ApplianceElectricityCostCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  const lines = code.split(/\r?\n/);
  // Add inputs definition before useCalculatorState
  const hookIdx = lines.findIndex(l => l.includes('const { markCalculated, resetCalculated } = useHasCalculated();'));
  const replacementHook = [
    '  const inputs = useMemo(() => ({ activeMode, ratePerKWh, singleItem, multiItems }), [activeMode, ratePerKWh, singleItem, multiItems]);',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);',
    '  const activeInputs = calculatedInputs || inputs;'
  ];
  lines.splice(hookIdx, 1, ...replacementHook);

  // Update calculations to use activeInputs
  let newCode = lines.join('\r\n');
  newCode = newCode.replace(
    'const singleResult = useMemo(() => {\n    if (activeMode !== "single") return null;\n    return calculateApplianceCost(singleItem, ratePerKWh);\n  }, [activeMode, singleItem, ratePerKWh]);',
    'const singleResult = useMemo(() => {\n    if (activeInputs.activeMode !== "single") return null;\n    return calculateApplianceCost(activeInputs.singleItem, activeInputs.ratePerKWh);\n  }, [activeInputs]);'
  );
  newCode = newCode.replace(
    'const multiResult = useMemo(() => {\n    if (activeMode !== "multi") return null;\n    return calculateMultipleAppliances(multiItems, ratePerKWh);\n  }, [activeMode, multiItems, ratePerKWh]);',
    'const multiResult = useMemo(() => {\n    if (activeInputs.activeMode !== "multi") return null;\n    return calculateMultipleAppliances(activeInputs.multiItems, activeInputs.ratePerKWh);\n  }, [activeInputs]);'
  );

  // Wrap resultsRef
  const lines2 = newCode.split(/\r?\n/);
  const resIdx = lines2.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('ApplianceCalc resIdx:', resIdx + 1);

  lines2.splice(resIdx + 1, 0,
    '        {hasResult ? (',
    '          <>',
    '            {isOutdated && (',
    '              <OutdatedResultBanner onCalculate={handleCalculate} />',
    '            )}'
  );

  const resetBtnIdx = lines2.findIndex(l => l.includes('Reset to Default Values'));
  console.log('ApplianceCalc resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = lines2.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('ApplianceCalc layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate appliance electricity cost"',
    '            subMessage="Select your appliance wattage, daily usage hours, and electricity rate, then press Calculate Cost."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  lines2.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/ApplianceElectricityCostCalculator.tsx', lines2.join('\r\n'), 'utf8');
  console.log('✓ ApplianceElectricityCostCalculator updated');
}

// 3. HomeElectricityBillCalculator.tsx
function updateHomeCalc() {
  let code = fs.readFileSync('src/calculators/HomeElectricityBillCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  const lines = code.split(/\r?\n/);
  const hookIdx = lines.findIndex(l => l.includes('const { markCalculated, resetCalculated } = useHasCalculated();'));
  const replacementHook = [
    '  const inputs = useMemo(() => ({ billingMode, monthlyUnitsInput, flatRateINR, fixedChargesINR, additionalChargesINR, appliancesList, tariffMode, selectedDiscomId }), [billingMode, monthlyUnitsInput, flatRateINR, fixedChargesINR, additionalChargesINR, appliancesList, tariffMode, selectedDiscomId]);',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);',
    '  const activeInputs = calculatedInputs || inputs;'
  ];
  lines.splice(hookIdx, 1, ...replacementHook);

  let newCode = lines.join('\r\n');
  newCode = newCode.replace(
    '  const result = useMemo(() => {\n    return calculateHomeBill(currentBillInput);\n  }, [currentBillInput]);',
    '  const result = useMemo(() => {\n    return calculateHomeBill(currentBillInput);\n  }, [currentBillInput]);'
  );

  const lines2 = newCode.split(/\r?\n/);
  const resIdx = lines2.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('HomeCalc resIdx:', resIdx + 1);

  lines2.splice(resIdx + 1, 0,
    '        {hasResult ? (',
    '          <>',
    '            {isOutdated && (',
    '              <OutdatedResultBanner onCalculate={handleCalculate} />',
    '            )}'
  );

  const resetBtnIdx = lines2.findIndex(l => l.includes('Reset to Default Values'));
  console.log('HomeCalc resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = lines2.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('HomeCalc layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate electricity bill"',
    '            subMessage="Enter your monthly units or choose appliances, then press Calculate Electricity Bill."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  lines2.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/HomeElectricityBillCalculator.tsx', lines2.join('\r\n'), 'utf8');
  console.log('✓ HomeElectricityBillCalculator updated');
}

// 4. ProductProfitCalculator.tsx
function updateProductProfitCalc() {
  let code = fs.readFileSync('src/calculators/ProductProfitCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(calculationInput);\n  const activeInputs = calculatedInputs || calculationInput;'
  );

  code = code.replace(
    '  const result = useMemo(() => {\n    return calculateProductProfit(calculationInput);\n  }, [calculationInput]);',
    '  const result = useMemo(() => {\n    return calculateProductProfit(activeInputs);\n  }, [activeInputs]);'
  );

  // Remove unwanted markCalculated in inputs
  const lines = code.split(/\r?\n/);
  const cleaned = lines.map((l, i) => {
    if (l.trim() === 'markCalculated();' && !lines.slice(Math.max(0, i - 4), i + 4).some(sub => sub.includes('Calculate Profit'))) {
      return null;
    }
    return l;
  }).filter(l => l !== null);

  const resIdx = cleaned.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('ProductProfit resIdx:', resIdx + 1);

  cleaned.splice(resIdx + 1, 0,
    '            {hasResult ? (',
    '              <>',
    '                {isOutdated && (',
    '                  <OutdatedResultBanner onCalculate={() => { markCalculated(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }} />',
    '                )}'
  );

  const resetBtnIdx = cleaned.findIndex(l => l.includes('Reset to defaults'));
  console.log('ProductProfit resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = cleaned.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('ProductProfit layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '                </div>',
    '              </div>',
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate profit"',
    '            subMessage="Enter cost price, selling price, and quantity, then press Calculate Profit."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  cleaned.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/ProductProfitCalculator.tsx', cleaned.join('\r\n'), 'utf8');
  console.log('✓ ProductProfitCalculator updated');
}

// 5. GstInvoiceCalculator.tsx
function updateGstInvoiceCalc() {
  let code = fs.readFileSync('src/calculators/GstInvoiceCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  const lines = code.split(/\r?\n/);
  const hookIdx = lines.findIndex(l => l.includes('const { markCalculated, resetCalculated } = useHasCalculated();'));
  const replacementHook = [
    '  const inputs = useMemo(() => ({ activeMode, amount, gstRate, isCustomRate, customRateInput, priceType, supplyType, hasDiscount, discountType, discountValue, invoiceSupplyType, applyRounding }), [activeMode, amount, gstRate, isCustomRate, customRateInput, priceType, supplyType, hasDiscount, discountType, discountValue, invoiceSupplyType, applyRounding]);',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);',
    '  const activeInputs = calculatedInputs || inputs;'
  ];
  lines.splice(hookIdx, 1, ...replacementHook);

  // Remove unwanted markCalculated in inputs
  const cleaned = lines.map((l, i) => {
    if (l.trim() === 'markCalculated();' && !lines.slice(Math.max(0, i - 4), i + 4).some(sub => sub.includes('Calculate GST') || sub.includes('Calculate Invoice'))) {
      return null;
    }
    return l;
  }).filter(l => l !== null);

  const resIdx = cleaned.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('GstInvoice resIdx:', resIdx + 1);

  cleaned.splice(resIdx + 1, 0,
    '            {hasResult ? (',
    '              <>',
    '                {isOutdated && (',
    '                  <OutdatedResultBanner onCalculate={() => { markCalculated(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }} />',
    '                )}'
  );

  const resetBtnIdx = cleaned.findIndex(l => l.includes('Reset to defaults'));
  console.log('GstInvoice resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = cleaned.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('GstInvoice layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '                </div>',
    '              </div>',
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate GST"',
    '            subMessage="Enter your base amount and select GST slab, then press Calculate GST to see itemized tax breakdown."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  cleaned.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/GstInvoiceCalculator.tsx', cleaned.join('\r\n'), 'utf8');
  console.log('✓ GstInvoiceCalculator updated');
}

// 6. CementBagCalculator.tsx
function updateCementBagCalc() {
  let code = fs.readFileSync('src/calculators/CementBagCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const result = useMemo(() => {\n    return calculateCementBagEstimate(inputs);\n  }, [inputs]);',
    '  const result = useMemo(() => {\n    return calculateCementBagEstimate(activeInputs);\n  }, [activeInputs]);'
  );

  const lines = code.split(/\r?\n/);
  const resIdx = lines.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('CementBag resIdx:', resIdx + 1);

  lines.splice(resIdx + 1, 0,
    '        {hasResult ? (',
    '          <>',
    '            {isOutdated && (',
    '              <OutdatedResultBanner onCalculate={() => { markCalculated(); resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />',
    '            )}'
  );

  const resetBtnIdx = lines.findIndex(l => l.includes('Reset to Standard Defaults'));
  console.log('CementBag resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = lines.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('CementBag layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '              </div>',
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate cement bags"',
    '            subMessage="Enter your construction dimensions or volume, then press Calculate Cement Bags."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  lines.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/CementBagCalculator.tsx', lines.join('\r\n'), 'utf8');
  console.log('✓ CementBagCalculator updated');
}

// 7. RccPriceCalculator.tsx
function updateRccPriceCalc() {
  let code = fs.readFileSync('src/calculators/RccPriceCalculator.tsx', 'utf8');

  code = code.replace(
    'import { useHasCalculated } from "@/hooks/use-has-calculated";',
    'import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";'
  );

  code = code.replace(
    '  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();',
    '  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } = useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;'
  );

  code = code.replace(
    '  const result = useMemo(() => {\n    return calculateRccConstructionPrice(inputs);\n  }, [inputs]);',
    '  const result = useMemo(() => {\n    return calculateRccConstructionPrice(activeInputs);\n  }, [activeInputs]);'
  );

  const lines = code.split(/\r?\n/);
  const resIdx = lines.findIndex(l => l.includes('<div ref={resultsRef}'));
  console.log('RccPrice resIdx:', resIdx + 1);

  lines.splice(resIdx + 1, 0,
    '        {hasResult ? (',
    '          <>',
    '            {isOutdated && (',
    '              <OutdatedResultBanner onCalculate={() => { markCalculated(); resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />',
    '            )}'
  );

  const resetBtnIdx = lines.findIndex(l => l.includes('Reset to Standard Defaults'));
  console.log('RccPrice resetBtnIdx:', resetBtnIdx + 1);
  const layoutCloseIdx = lines.findIndex((l, i) => i > resetBtnIdx && l.includes('</CalculatorPageLayout>'));
  console.log('RccPrice layoutCloseIdx:', layoutCloseIdx + 1);

  const closeReplacement = [
    '              </div>',
    '            </div>',
    '          </>',
    '        ) : (',
    '          <EmptyResultPlaceholder',
    '            message="Ready to calculate RCC construction price"',
    '            subMessage="Enter built-up area and select structural specifications, then press Calculate RCC Estimate."',
    '          />',
    '        )}',
    '        </div>',
    '      </div>',
    '    </CalculatorPageLayout>'
  ];

  lines.splice(resetBtnIdx + 3, (layoutCloseIdx + 1) - (resetBtnIdx + 3), ...closeReplacement);

  fs.writeFileSync('src/calculators/RccPriceCalculator.tsx', lines.join('\r\n'), 'utf8');
  console.log('✓ RccPriceCalculator updated');
}

updateAcCalc();
updateApplianceCalc();
updateHomeCalc();
updateProductProfitCalc();
updateGstInvoiceCalc();
updateCementBagCalc();
updateRccPriceCalc();

