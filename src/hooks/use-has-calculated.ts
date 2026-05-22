import { useCallback, useState } from "react";

export function useHasCalculated() {
  const [hasResult, setHasResult] = useState(false);
  const markCalculated = useCallback(() => setHasResult(true), []);
  const resetCalculated = useCallback(() => setHasResult(false), []);
  return { hasResult, markCalculated, resetCalculated };
}
