import fs from 'fs';

// 1. CementBagCalculator.tsx
let cement = fs.readFileSync('src/calculators/CementBagCalculator.tsx', 'utf-8');

cement = cement.replace(
  `import { useHasCalculated } from "@/hooks/use-has-calculated";`,
  `import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";`
);

cement = cement.replace(
  `  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();`,
  `  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =\n    useCalculatorState(inputs);\n  const activeInputs = calculatedInputs || inputs;`
);

cement = cement.replace(
  `  const result = useMemo(() => {\n    return calculateCementBagEstimate(inputs);\n  }, [inputs]);`,
  `  const result = useMemo(() => {\n    return calculateCementBagEstimate(activeInputs);\n  }, [activeInputs]);`
);

cement = cement.replace(
  `    markCalculated();\n  };\n\n  // Reset to default state`,
  `  };\n\n  // Reset to default state`
);

const cementResultStart = `        {/* ========================================================= */}\n        {/* RESULTS SECTION (SIMPLE, CLEAR, READABLE)                 */}\n        {/* ========================================================= */}\n        <div ref={resultsRef} className="space-y-6 pt-2">\n          {/* RESULT CARD 1: MAIN ANSWER */}`;
const cementResultStartRepl = `        {/* ========================================================= */}\n        {/* RESULTS SECTION (SIMPLE, CLEAR, READABLE)                 */}\n        {/* ========================================================= */}\n        <div ref={resultsRef} className="space-y-6 pt-2">\n          {hasResult ? (\n            <>\n              {isOutdated && (\n                <OutdatedResultBanner onCalculate={handleCalculateClick} />\n              )}\n              {/* RESULT CARD 1: MAIN ANSWER */}`;
cement = cement.replace(cementResultStart, cementResultStartRepl);

const cementResultEnd = `            {showTechnicalDetails && (\n              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">\n                {result.steps.map((st) => (\n                  <div key={st.stepNumber} className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">\n                    <div className="flex items-center justify-between font-bold text-foreground">\n                      <span>Step {st.stepNumber}: {st.title}</span>\n                      <span className="text-amber-600 dark:text-amber-400">{st.resultString}</span>\n                    </div>\n                    <div className="text-muted-foreground">{st.formula}</div>\n                    <div className="text-foreground/90 font-medium">{st.substitution}</div>\n                  </div>\n                ))}\n\n                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 font-sans text-xs text-muted-foreground leading-relaxed">\n                  <strong>Specifications:</strong> Calculated using standard density 1,440 kg/m³ per IS 456:2000, 1.54 dry factor for concrete, and 1.33 for masonry mortars per CPWD DSR norms.\n                </div>\n              </div>\n            )}\n          </div>\n        </div>`;

const cementResultEndRepl = `            {showTechnicalDetails && (\n              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">\n                {result.steps.map((st) => (\n                  <div key={st.stepNumber} className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">\n                    <div className="flex items-center justify-between font-bold text-foreground">\n                      <span>Step {st.stepNumber}: {st.title}</span>\n                      <span className="text-amber-600 dark:text-amber-400">{st.resultString}</span>\n                    </div>\n                    <div className="text-muted-foreground">{st.formula}</div>\n                    <div className="text-foreground/90 font-medium">{st.substitution}</div>\n                  </div>\n                ))}\n\n                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 font-sans text-xs text-muted-foreground leading-relaxed">\n                  <strong>Specifications:</strong> Calculated using standard density 1,440 kg/m³ per IS 456:2000, 1.54 dry factor for concrete, and 1.33 for masonry mortars per CPWD DSR norms.\n                </div>\n              </div>\n            )}\n          </div>\n            </>\n          ) : (\n            <EmptyResultPlaceholder\n              onCalculate={handleCalculateClick}\n              category="everyday"\n            />\n          )}\n        </div>`;

cement = cement.replace(cementResultEnd, cementResultEndRepl);
fs.writeFileSync('src/calculators/CementBagCalculator.tsx', cement, 'utf-8');
console.log('Updated CementBagCalculator.tsx successfully');

// 2. RccPriceCalculator.tsx
let rcc = fs.readFileSync('src/calculators/RccPriceCalculator.tsx', 'utf-8');

rcc = rcc.replace(
  `import { useHasCalculated } from "@/hooks/use-has-calculated";`,
  `import { useCalculatorState } from "@/hooks/use-has-calculated";\nimport { OutdatedResultBanner } from "@/components/OutdatedResultBanner";\nimport { EmptyResultPlaceholder } from "@/components/EmptyResultPlaceholder";`
);

rcc = rcc.replace(
  `  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();`,
  `  const currentInputs = useMemo(() => ({\n    inputs,\n    directVolumeMode,\n    directVolume,\n    directVolumeUnit,\n    estimateMode,\n    includeShuttering,\n    includeLabour,\n    steelEntryMode,\n    customSteelTotalKg,\n    bbsBars,\n  }), [\n    inputs,\n    directVolumeMode,\n    directVolume,\n    directVolumeUnit,\n    estimateMode,\n    includeShuttering,\n    includeLabour,\n    steelEntryMode,\n    customSteelTotalKg,\n    bbsBars,\n  ]);\n\n  const { hasResult, isOutdated, calculatedInputs, markCalculated, resetCalculated } =\n    useCalculatorState(currentInputs);\n  const activeInputs = calculatedInputs || currentInputs;`
);

rcc = rcc.replace(
  `    let finalInputs: RccCalculatorInputs = { ...inputs };`,
  `    let finalInputs: RccCalculatorInputs = { ...activeInputs.inputs };`
);

rcc = rcc.replace(
  `    if (estimateMode === "quick") {`,
  `    if (activeInputs.estimateMode === "quick") {`
);

rcc = rcc.replace(
  `      if (directVolumeMode && directVolume > 0) {`,
  `      if (activeInputs.directVolumeMode && activeInputs.directVolume > 0) {`
);

rcc = rcc.replace(
  `        const volM3 = directVolumeUnit === "cft" ? directVolume * 0.0283168 : directVolume;`,
  `        const volM3 = activeInputs.directVolumeUnit === "cft" ? activeInputs.directVolume * 0.0283168 : activeInputs.directVolume;`
);

rcc = rcc.replace(
  `      if (!includeShuttering) {`,
  `      if (!activeInputs.includeShuttering) {`
);

rcc = rcc.replace(
  `      if (!includeLabour) {`,
  `      if (!activeInputs.includeLabour) {`
);

rcc = rcc.replace(
  `      if (steelEntryMode === "bbs" && bbsBars.length > 0) {\n        finalInputs = { ...finalInputs, steelInputMode: "bbs", bbsBars };\n      } else if (steelEntryMode === "actual_weight" && customSteelTotalKg > 0) {`,
  `      if (activeInputs.steelEntryMode === "bbs" && activeInputs.bbsBars.length > 0) {\n        finalInputs = { ...finalInputs, steelInputMode: "bbs", bbsBars: activeInputs.bbsBars };\n      } else if (activeInputs.steelEntryMode === "actual_weight" && activeInputs.customSteelTotalKg > 0) {`
);

rcc = rcc.replace(
  `          finalInputs = { ...finalInputs, preliminarySteelKgPerM3: customSteelTotalKg / rawVolM3 };`,
  `          finalInputs = { ...finalInputs, preliminarySteelKgPerM3: activeInputs.customSteelTotalKg / rawVolM3 };`
);

rcc = rcc.replace(
  `  }, [\n    inputs,\n    directVolumeMode,\n    directVolume,\n    directVolumeUnit,\n    estimateMode,\n    includeShuttering,\n    includeLabour,\n    steelEntryMode,\n    customSteelTotalKg,\n    bbsBars,\n  ]);`,
  `  }, [activeInputs]);`
);

rcc = rcc.replace(
  `    markCalculated();\n  };\n\n  // Reset to default`,
  `  };\n\n  // Reset to default`
);

const rccResultStart = `        {/* ========================================================= */}\n        {/* RESULTS DASHBOARD (PROFESSIONAL & CLEAN)                  */}\n        {/* ========================================================= */}\n        <div ref={resultsRef} className="space-y-6 pt-2">`;
const rccResultStartRepl = `        {/* ========================================================= */}\n        {/* RESULTS DASHBOARD (PROFESSIONAL & CLEAN)                  */}\n        {/* ========================================================= */}\n        <div ref={resultsRef} className="space-y-6 pt-2">\n          {hasResult ? (\n            <>\n              {isOutdated && (\n                <OutdatedResultBanner onCalculate={handleCalculateClick} />\n              )}`;
rcc = rcc.replace(rccResultStart, rccResultStartRepl);

const rccResultEnd = `            {showTechnicalDetails && (\n              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Standard Steel Weight Formula (IS 1786):</div>\n                  <div className="text-muted-foreground">Weight per metre (kg/m) = d² / 162 (where d is rebar diameter in mm).</div>\n                </div>\n\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Dry Volume Void Shrinkage Factor:</div>\n                  <div className="text-muted-foreground">Dry Volume = Wet Volume × 1.54 (accounting for 54% void shrinkage between coarse stones & sand).</div>\n                </div>\n\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Cement Bulk Density:</div>\n                  <div className="text-muted-foreground">1,440 kg/m³ per IS 456. One 50 kg bag occupies ~0.0347 m³ (1.226 cu ft).</div>\n                </div>\n              </div>\n            )}\n          </div>\n        </div>`;

const rccResultEndRepl = `            {showTechnicalDetails && (\n              <div className="mt-5 pt-4 border-t border-border/60 space-y-3 font-mono text-xs">\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Standard Steel Weight Formula (IS 1786):</div>\n                  <div className="text-muted-foreground">Weight per metre (kg/m) = d² / 162 (where d is rebar diameter in mm).</div>\n                </div>\n\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Dry Volume Void Shrinkage Factor:</div>\n                  <div className="text-muted-foreground">Dry Volume = Wet Volume × 1.54 (accounting for 54% void shrinkage between coarse stones & sand).</div>\n                </div>\n\n                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">\n                  <div className="font-bold text-foreground mb-1">Cement Bulk Density:</div>\n                  <div className="text-muted-foreground">1,440 kg/m³ per IS 456. One 50 kg bag occupies ~0.0347 m³ (1.226 cu ft).</div>\n                </div>\n              </div>\n            )}\n          </div>\n            </>\n          ) : (\n            <EmptyResultPlaceholder\n              onCalculate={handleCalculateClick}\n              category="everyday"\n            />\n          )}\n        </div>`;

rcc = rcc.replace(rccResultEnd, rccResultEndRepl);
fs.writeFileSync('src/calculators/RccPriceCalculator.tsx', rcc, 'utf-8');
console.log('Updated RccPriceCalculator.tsx successfully');

