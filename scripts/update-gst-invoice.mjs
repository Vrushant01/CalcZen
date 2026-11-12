import fs from 'fs';

let content = fs.readFileSync('src/calculators/GstInvoiceCalculator.tsx', 'utf-8');

// 1. Imports
content = content.replace(
  `import { useHasCalculated } from "@/hooks/use-has-calculated";`,
  `import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";`
);

// 2. Remove hook call at line 55
content = content.replace(
  `  const { markCalculated, resetCalculated } = useHasCalculated();\n  const resultsRef = useRef<HTMLDivElement>(null);`,
  `  const resultsRef = useRef<HTMLDivElement>(null);`
);

// 3. Update singleResult & add useCalculatorState + handleCalculate
const targetSingle = `  // Mode A Calculation Result\n  const singleResult: SingleGstResult = useMemo(() => {\n    return calculateSingleGst(singleInput);\n  }, [singleInput]);`;
const replSingle = `  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =\n    useCalculatorState(singleInput);\n  const activeSingleInput = calculatedInputs || singleInput;\n\n  // Mode A Calculation Result\n  const singleResult: SingleGstResult = useMemo(() => {\n    return calculateSingleGst(activeSingleInput);\n  }, [activeSingleInput]);\n\n  const handleCalculate = () => {\n    if (!validation.isValid) return;\n    markCalculated();\n    setTimeout(() => {\n      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });\n    }, 100);\n  };`;

content = content.replace(targetSingle, replSingle);

// 4. Remove all markCalculated() calls except in handleCalculate
// Let's check each call:
// Preset:
content = content.replace(`    setSupplyType("intra_state");\n    markCalculated();`, `    setSupplyType("intra_state");`);
// Line items:
content = content.replace(`    setLineItems([...lineItems, newItem]);\n    markCalculated();`, `    setLineItems([...lineItems, newItem]);`);
content = content.replace(`    setLineItems(lineItems.filter((it) => it.id !== id));\n    markCalculated();`, `    setLineItems(lineItems.filter((it) => it.id !== id));`);
content = content.replace(`    setLineItems(lineItems.map((it) => (it.id === id ? { ...it, ...updates } : it)));\n    markCalculated();`, `    setLineItems(lineItems.map((it) => (it.id === id ? { ...it, ...updates } : it)));`);
// Tabs:
content = content.replace(`                  setActiveMode("single");\n                  markCalculated();`, `                  setActiveMode("single");`);
content = content.replace(`                  setActiveMode("invoice");\n                  markCalculated();`, `                  setActiveMode("invoice");`);
// Inputs:
content = content.replace(`                        setAmount(e.target.value === "" ? 0 : Number(e.target.value));\n                        markCalculated();`, `                        setAmount(e.target.value === "" ? 0 : Number(e.target.value));`);
content = content.replace(`                          setIsCustomRate(false);\n                          setGstRate(rateObj.value);\n                          markCalculated();`, `                          setIsCustomRate(false);\n                          setGstRate(rateObj.value);`);
content = content.replace(`                            setCustomRateInput(e.target.value);\n                            markCalculated();`, `                            setCustomRateInput(e.target.value);`);
content = content.replace(`                        setPriceType("exclusive");\n                        markCalculated();`, `                        setPriceType("exclusive");`);
content = content.replace(`                        setPriceType("inclusive");\n                        markCalculated();`, `                        setPriceType("inclusive");`);
content = content.replace(`                        setSupplyType("intra_state");\n                        markCalculated();`, `                        setSupplyType("intra_state");`);
content = content.replace(`                        setSupplyType("inter_state");\n                        markCalculated();`, `                        setSupplyType("inter_state");`);
content = content.replace(`                                setDiscountValue(Number(e.target.value) || 0);\n                                markCalculated();`, `                                setDiscountValue(Number(e.target.value) || 0);`);

// 5. Calculate Button
const targetBtn = `                <Button\n                  type="button"\n                  onClick={() => {\n                    markCalculated();\n                    resultsRef.current?.scrollIntoView({ behavior: "smooth" });\n                  }}\n                  className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-2"\n                >`;
const replBtn = `                <Button\n                  type="button"\n                  onClick={handleCalculate}\n                  className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-2"\n                >`;
content = content.replace(targetBtn, replBtn);

// 6. Wrap Mode A Right Column
const targetCol = `            {/* RIGHT COLUMN: Results Dashboard */}\n            <div ref={resultsRef} className="lg:col-span-5 space-y-6">\n              <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5 lg:sticky lg:top-24">`;
const replCol = `            {/* RIGHT COLUMN: Results Dashboard */}\n            <div ref={resultsRef} className="lg:col-span-5 space-y-6">\n              {hasResult ? (\n                <>\n                  {isOutdated && (\n                    <OutdatedResultBanner onCalculate={handleCalculate} />\n                  )}\n                  <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-5 lg:sticky lg:top-24">`;
content = content.replace(targetCol, replCol);

const targetColEnd = `                      <RotateCcw className="h-4 w-4" />\n                    </Button>\n                  </div>\n                </div>\n              </div>\n            </div>`;
const replColEnd = `                      <RotateCcw className="h-4 w-4" />\n                    </Button>\n                  </div>\n                </div>\n              </div>\n            </>\n          ) : (\n            <EmptyResultPlaceholder\n              onCalculate={handleCalculate}\n              category="finance"\n            />\n          )}\n        </div>`;
content = content.replace(targetColEnd, replColEnd);

fs.writeFileSync('src/calculators/GstInvoiceCalculator.tsx', content, 'utf-8');
console.log('Updated GstInvoiceCalculator.tsx successfully');

