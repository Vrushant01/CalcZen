export interface ScientificHistoryItem {
  id: string;
  timestamp: string;
  expression: string;
  result: string;
  angleMode: "deg" | "rad";
}

let sessionHistory: ScientificHistoryItem[] = [];

export function getScientificCalculatorHistory(): ScientificHistoryItem[] {
  return sessionHistory;
}

export function addScientificCalculatorHistory(expression: string, result: string, angleMode: "deg" | "rad") {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit" 
  });
  
  const id = now.getTime().toString() + Math.random().toString(36).substring(2, 6);
  
  sessionHistory = [
    { id, timestamp, expression, result, angleMode },
    ...sessionHistory
  ];
}

export function clearScientificCalculatorHistory() {
  sessionHistory = [];
}
