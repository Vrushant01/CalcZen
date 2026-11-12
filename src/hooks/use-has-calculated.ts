import { useCallback, useState, useMemo } from "react";

/**
 * Hook to manage calculator result state, tracking whether a calculation
 * has been executed and whether the displayed result is outdated compared to current inputs.
 */
export function useHasCalculated(isOutdatedParam?: boolean) {
  const [hasResult, setHasResult] = useState(false);
  const markCalculated = useCallback(() => setHasResult(true), []);
  const resetCalculated = useCallback(() => setHasResult(false), []);

  return {
    hasResult,
    isOutdated: Boolean(hasResult && isOutdatedParam),
    markCalculated,
    resetCalculated,
  };
}

/**
 * Enhanced hook that automatically tracks input freshness.
 * Calculates `isOutdated` by comparing `currentInputs` with `calculatedInputs`.
 */
export function useCalculatorState<TInputs extends Record<string, any>>(currentInputs: TInputs) {
  const [hasResult, setHasResult] = useState(false);
  const [calculatedInputs, setCalculatedInputs] = useState<TInputs | null>(null);

  const markCalculated = useCallback(
    (inputs?: TInputs) => {
      setHasResult(true);
      setCalculatedInputs(inputs !== undefined ? { ...inputs } : { ...currentInputs });
    },
    [currentInputs]
  );

  const resetCalculated = useCallback(() => {
    setHasResult(false);
    setCalculatedInputs(null);
  }, []);

  const isOutdated = useMemo(() => {
    if (!hasResult || calculatedInputs === null) return false;
    try {
      return JSON.stringify(currentInputs) !== JSON.stringify(calculatedInputs);
    } catch {
      return false;
    }
  }, [hasResult, currentInputs, calculatedInputs]);

  return {
    hasResult,
    isOutdated,
    calculatedInputs,
    markCalculated,
    resetCalculated,
  };
}
