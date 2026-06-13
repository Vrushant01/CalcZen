export interface HistoryItem {
  id: string;
  timestamp: string;
  expression: string;
  result: string;
}

let sessionHistory: HistoryItem[] = [];

export function getStandardCalculatorHistory(): HistoryItem[] {
  return sessionHistory;
}

export function addStandardCalculatorHistory(expression: string, result: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Create a unique id for React keys
  const id = now.getTime().toString() + Math.random().toString(36).substring(2, 6);

  sessionHistory = [{ id, timestamp, expression, result }, ...sessionHistory].slice(0, 20);
}

export function clearStandardCalculatorHistory() {
  sessionHistory = [];
}
