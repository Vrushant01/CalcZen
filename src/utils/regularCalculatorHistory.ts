export interface HistoryItem {
  id: string;
  timestamp: string;
  expression: string;
  result: string;
}

let sessionHistory: HistoryItem[] = [];

export function getRegularCalculatorHistory(): HistoryItem[] {
  return sessionHistory;
}

export function addRegularCalculatorHistory(expression: string, result: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit" 
  });
  
  // Create a unique id for React keys
  const id = now.getTime().toString() + Math.random().toString(36).substring(2, 6);
  
  sessionHistory = [
    { id, timestamp, expression, result },
    ...sessionHistory
  ];
}

export function clearRegularCalculatorHistory() {
  sessionHistory = [];
}
