import { useEffect, useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { useTheme } from "@/hooks/use-theme";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { 
  getStandardCalculatorHistory, 
  addStandardCalculatorHistory, 
  clearStandardCalculatorHistory, 
  type HistoryItem 
} from "@/utils/standardCalculatorHistory";
import { Calendar, Trash2, RotateCcw, HelpCircle, Delete, Clock, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Safe mathematical parser supporting advanced percentage calculations
function parseAndEvaluate(expr: string): string {
  let cleaned = expr.trim();
  
  // Replace mathematical display symbols with javascript equivalents
  cleaned = cleaned.replace(/×/g, "*").replace(/÷/g, "/");

  // Handle percentages for addition/subtraction: A + B% -> A + (A * B / 100)
  const percentAddSubRegex = /(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)\s*%/g;
  while (percentAddSubRegex.test(cleaned)) {
    cleaned = cleaned.replace(percentAddSubRegex, "$1 $2 ($1 * $3 / 100)");
  }

  // Handle percentages for multiplication/division: A * B% -> A * (B / 100)
  const percentMulDivRegex = /(\d+(?:\.\d+)?)\s*([\*\/])\s*(\d+(?:\.\d+)?)\s*%/g;
  while (percentMulDivRegex.test(cleaned)) {
    cleaned = cleaned.replace(percentMulDivRegex, "$1 $2 ($3 / 100)");
  }

  // Standalone percentage: e.g. "10%" -> "10 / 100"
  cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*%/g, "($1 / 100)");

  // Validate characters to completely prevent XSS or arbitrary injection exploits
  if (cleaned.length === 0) return "0";
  if (!/^[0-9+\-*/. ()]+$/.test(cleaned)) {
    throw new Error("Invalid characters");
  }

  // Evaluate safely inside a function sandbox
  const fn = new Function(`"use strict"; return (${cleaned})`);
  const result = fn();
  
  if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
    throw new Error("Calculation error");
  }
  
  // Correct standard floating-point precision issues (e.g. 0.1 + 0.2 = 0.3)
  return String(Math.round(result * 1e12) / 1e12);
}

export function StandardCalculator() {
  const calc = getCalculator("standard-calculator")!;
  const { isDark } = useTheme();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  
  // In-memory sync state
  const [history, setHistory] = useState<HistoryItem[]>(getStandardCalculatorHistory());
  
  // Calculator display state machine
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isResetOnNext, setIsResetOnNext] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const numberKeyClass = "calc-btn calc-btn-number h-11 text-sm sm:text-base"
  const operatorKeyClass = "calc-btn calc-btn-operator h-11 text-base"
  const equalKeyClass = "calc-btn calc-btn-equal col-span-4 h-11 text-sm sm:text-base"

  // Sync state with singleton store on initialization
  useEffect(() => {
    setHistory(getStandardCalculatorHistory());
  }, []);

  // Keyboard support event listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleDigit(key);
      } else if (key === ".") {
        handleDigit(".");
      } else if (key === "+") {
        handleOperator("+");
      } else if (key === "-") {
        handleOperator("-");
      } else if (key === "*") {
        handleOperator("×");
      } else if (key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (key === "%") {
        handlePercent();
      } else if (key === "(" || key === ")") {
        handleDigit(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEqual();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        handleClear();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [equation, display, isResetOnNext]);

  // Click digit handler
  function handleDigit(digit: string) {
    setErrorMsg("");
    
    if (isResetOnNext) {
      setDisplay(digit);
      setEquation(digit);
      setIsResetOnNext(false);
      return;
    }

    // Decimals validation
    if (digit === "." && display.includes(".")) return;

    // Limit inputs to 16 digits to prevent numerical precision loss and visual overflow
    const numericPart = display.replace(/[^0-9]/g, "");
    if (numericPart.length >= 16 && /[0-9]/.test(digit)) {
      return;
    }

    if (display === "0" && digit !== ".") {
      setDisplay(digit);
      // Replace last '0' character in equation
      setEquation(equation.slice(0, -1) + digit);
    } else {
      setDisplay((prev) => (prev === "0" && digit === "." ? "0." : prev + digit));
      setEquation((prev) => prev + digit);
    }
  }

  // Click operator handler
  function handleOperator(op: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(display + " " + op + " ");
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }

    const trimmed = equation.trim();
    if (trimmed.length === 0) {
      setEquation("0 " + op + " ");
      setDisplay("");
      return;
    }

    // Replace previous operator if clicked consecutively
    const lastChar = trimmed.slice(-1);
    if (["+", "-", "×", "÷"].includes(lastChar)) {
      setEquation(trimmed.slice(0, -1).trim() + " " + op + " ");
      return;
    }

    setEquation((prev) => prev + " " + op + " ");
    setDisplay("");
  }

  // Handle percentages %
  function handlePercent() {
    setErrorMsg("");
    if (isResetOnNext || display === "" || display.endsWith("%")) return;

    setDisplay((prev) => prev + "%");
    setEquation((prev) => prev + "%");
  }

  // Smart Parenthesis handler (Auto-multiplies or closes matching tabs)
  function handleParenthesis() {
    setErrorMsg("");
    const openCount = (equation.match(/\(/g) || []).length;
    const closeCount = (equation.match(/\)/g) || []).length;
    const lastChar = equation.trim().slice(-1);

    if (openCount > closeCount && (/[0-9)]/.test(lastChar) || display.endsWith("%"))) {
      handleDigit(")");
    } else {
      // If preceding character is a number, auto-insert "× ("
      if (/[0-9)]/.test(lastChar) || display.endsWith("%")) {
        handleOperator("×");
      }
      handleDigit("(");
    }
  }

  // Backspace click handler
  function handleBackspace() {
    setErrorMsg("");
    if (isResetOnNext) {
      handleClear();
      return;
    }

    if (display.length > 0) {
      setDisplay((prev) => prev.slice(0, -1));
      setEquation((prev) => prev.slice(0, -1));
    } else {
      const trimmed = equation.trim();
      // If equation ends with an operator and spaces, delete operator
      if (trimmed.length > 0) {
        const lastChar = trimmed.slice(-1);
        if (["+", "-", "×", "÷"].includes(lastChar)) {
          const undone = trimmed.slice(0, -1).trim();
          setEquation(undone);
          // Set display back to the preceding digit group
          const parts = undone.split(/\s+/);
          const lastPart = parts[parts.length - 1] || "";
          if (/^[0-9.%()]+$/.test(lastPart)) {
            setDisplay(lastPart);
          } else {
            setDisplay("");
          }
        }
      }
    }
  }

  // Clear/Reset click handler (Does NOT delete session history)
  function handleClear() {
    setErrorMsg("");
    setDisplay("0");
    setEquation("");
    setIsResetOnNext(false);
    resetCalculated();
  }

  // Equal evaluation handler
  function handleEqual() {
    if (!equation.trim()) return;
    setErrorMsg("");

    try {
      const result = parseAndEvaluate(equation);
      
      // Save expression to singleton store list
      addStandardCalculatorHistory(equation, result);
      
      // Update displays
      setDisplay(result);
      setEquation((prev) => prev + " = ");
      setIsResetOnNext(true);
      
      // Update local react components
      setHistory(getStandardCalculatorHistory());
      markCalculated();
    } catch (err) {
      console.warn("Calculator evaluation failed:", err);
      setErrorMsg("Error");
      setDisplay("0");
      setIsResetOnNext(true);
    }
  }

  // Wipes history completely directly without confirmation
  function handleClearHistory() {
    clearStandardCalculatorHistory();
    setHistory([]);
    resetCalculated();
  }

  // Load a historical calculation back into the screen
  function handleLoadHistoryItem(item: HistoryItem) {
    setErrorMsg("");
    setEquation(item.expression);
    setDisplay(item.result);
    setIsResetOnNext(true);
  }

  // PDF Download parameters mapping
  const pdfData = useMemo(() => {
    const hasCurrent = hasResult && display !== "0" && display !== "Error";
    const hasHistory = history.length > 0;

    if (!hasCurrent && !hasHistory) return null;

    const formattedEq = equation.includes("=") ? equation.split("=")[0].trim() : equation;
    
    return {
      calculatorName: "Standard Calculator",
      calculatorSlug: "standard-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: hasCurrent ? [
        { label: "Expression Evaluated", value: formattedEq || "0" },
      ] : [],
      results: hasCurrent ? [
        { label: "Final Result", value: display, highlight: true },
      ] : [],
      summary: hasCurrent 
        ? `A standard calculator calculation performed on CalcZen. Current formula: ${formattedEq || "0"} = ${display}. Complete calculation history details are included in the tabular report below.`
        : `A standard calculator calculation session on CalcZen. Complete calculation history details are included in the tabular report below.`,
      tableData: hasHistory ? {
        title: "CALCULATION HISTORY (CURRENT SESSION)",
        headers: ["Timestamp", "Expression", "Result"],
        rows: history.map((item) => [
          item.timestamp,
          item.expression,
          item.result
        ])
      } : null,
    };
  }, [hasResult, display, equation, history]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Standard mathematical calculator for rapid addition, subtraction, multiplication, division, fractions, and percentage operations with session persistence."
      formula={`Result = SafeEvaluate(Expression)
Percentage addition = A + (A × B ÷ 100)
Percentage multiplication = A × (B ÷ 100)`}
      example={`50 + 10% = 55
(12 + 5) × 3 = 51
7.5 ÷ 2.5 = 3`}
      faqs={[
        { q: "Does the calculation history persist?", a: "Yes. All calculation history is preserved in-memory as you navigate other sections of the website. It is fully wiped upon closing the browser tab or performing an F5 refresh for privacy." },
        { q: "How do keyboard key mappings work?", a: "Simply focus anywhere on the calculator page and press numbers, decimal (.), operators (+, -, *, /), backspace, enter (=) or escape (C) to compute." },
        { q: "How do percentage calculations work?", a: "Adding or subtracting a percentage calculates relatively (e.g. 50 + 10% adds 10% of 50, resulting in 55). Multiplication or division acts proportionally (e.g. 50 * 10% returns 5)." },
        { q: "Does resetting the calculator clear the history?", a: "No. Clicking the Reset button (C) clears your current displays, but leaves your sidebar calculation history completely visible and intact." }
      ]}
      blog={<CalculatorBlog content={blogContent.standard} />}
    >
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch justify-start">
        
        {/* LEFT COLUMN: CALCULATOR CARD */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className={`calc-input-column flex flex-col min-w-0 rounded-2xl p-5 select-none h-full justify-between transition-colors duration-200 ${
            isDark 
              ? "bg-[#111827] border border-white/[0.08] shadow-sm" 
              : "bg-[#f0f0f0] border border-[#d4d4d4] shadow-[6px_6px_18px_rgba(0,0,0,0.14),-4px_-4px_12px_rgba(255,255,255,0.9)]"
          }`}>
            <div>
              {/* LCD Calculator Screen */}
              <div className="bg-slate-900 border border-border/40 rounded-xl py-3.5 px-4 text-right font-mono h-[100px] flex flex-col justify-between mb-3.5 shadow-inner overflow-hidden">
                {/* Expression top line */}
                <div className="text-xs sm:text-sm text-slate-300 break-all select-text font-normal min-h-[1.25rem]">
                  {equation || <span className="opacity-0">0</span>}
                </div>
                {/* Current value bottom line */}
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight select-text overflow-x-auto scrollbar-none whitespace-nowrap ${errorMsg ? "text-destructive" : "text-white"}`}>
                  {errorMsg || display || "0"}
                </div>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2 font-mono">
                {/* Row 1 */}
                <button
                  onClick={handleClear}
                  type="button"
                  className="calc-btn calc-btn-clear h-11 text-sm sm:text-base"
                >
                  C
                </button>
                <button
                  onClick={handleBackspace}
                  type="button"
                  className="calc-btn calc-btn-utility h-11 text-sm sm:text-base flex items-center justify-center"
                  aria-label="Backspace"
                >
                  <Delete className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={handlePercent}
                  type="button"
                  className={operatorKeyClass}
                >
                  %
                </button>
                <button
                  onClick={() => handleOperator("÷")}
                  type="button"
                  className={operatorKeyClass}
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  onClick={() => handleDigit("7")}
                  type="button"
                  className={numberKeyClass}
                >
                  7
                </button>
                <button
                  onClick={() => handleDigit("8")}
                  type="button"
                  className={numberKeyClass}
                >
                  8
                </button>
                <button
                  onClick={() => handleDigit("9")}
                  type="button"
                  className={numberKeyClass}
                >
                  9
                </button>
                <button
                  onClick={() => handleOperator("×")}
                  type="button"
                  className={operatorKeyClass}
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  onClick={() => handleDigit("4")}
                  type="button"
                  className={numberKeyClass}
                >
                  4
                </button>
                <button
                  onClick={() => handleDigit("5")}
                  type="button"
                  className={numberKeyClass}
                >
                  5
                </button>
                <button
                  onClick={() => handleDigit("6")}
                  type="button"
                  className={numberKeyClass}
                >
                  6
                </button>
                <button
                  onClick={() => handleOperator("-")}
                  type="button"
                  className={operatorKeyClass}
                >
                  -
                </button>

                {/* Row 4 */}
                <button
                  onClick={() => handleDigit("1")}
                  type="button"
                  className={numberKeyClass}
                >
                  1
                </button>
                <button
                  onClick={() => handleDigit("2")}
                  type="button"
                  className={numberKeyClass}
                >
                  2
                </button>
                <button
                  onClick={() => handleDigit("3")}
                  type="button"
                  className={numberKeyClass}
                >
                  3
                </button>
                <button
                  onClick={() => handleOperator("+")}
                  type="button"
                  className={operatorKeyClass}
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  onClick={handleParenthesis}
                  type="button"
                  className={numberKeyClass}
                >
                  ( )
                </button>
                <button
                  onClick={() => handleDigit("0")}
                  type="button"
                  className={numberKeyClass}
                >
                  0
                </button>
                <button
                  onClick={() => handleDigit(".")}
                  type="button"
                  className={numberKeyClass}
                >
                  .
                </button>
                <button
                  onClick={handleEqual}
                  type="button"
                  className={equalKeyClass}
                >
                  =
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SESSION HISTORY SIDEBAR */}
        <div className="flex-1 min-w-0 sm:min-w-[350px]">
          <div className="w-full h-full flex flex-col min-w-0 bg-card border border-border rounded-[24px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:shadow-sm select-text justify-between">
            <div className="flex flex-col h-full justify-between flex-1 min-h-0">
              <div className="flex flex-col flex-1 min-h-0">
                <header className="flex items-center justify-between pb-3 border-b border-border mb-3 select-none shrink-0">
                  <h3 className="font-bold text-xs tracking-tight text-card-foreground">
                    Recent Calculations
                  </h3>
                  
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      type="button"
                      className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all"
                    >
                      Clear
                    </button>
                  )}
                </header>

                {/* History Item Entries (Animated) */}
                <div className="overflow-y-auto max-h-[20rem] pr-1 space-y-2.5 scrollbar-none flex-1 min-h-0">
                  <AnimatePresence initial={false}>
                    {history.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center select-none py-12"
                      >
                        <Clock className="h-7 w-7 text-muted-foreground opacity-60 mb-2.5" />
                        <h4 className="font-bold text-xs text-card-foreground">
                          No calculations yet
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-normal leading-relaxed mt-1 max-w-[170px] mx-auto">
                          Start calculating to build your history.
                        </p>
                      </motion.div>
                    ) : (
                      history.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10, y: -2 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: idx * 0.02 }}
                          onClick={() => handleLoadHistoryItem(item)}
                          className="p-4 bg-muted/40 border border-border/40 hover:border-accent/30 hover:bg-accent/[0.01] transition-all rounded-[14px] text-left flex flex-col justify-between shadow-sm select-copy cursor-pointer active:scale-[0.98] group relative"
                        >
                          <div className="text-[11px] text-muted-foreground truncate font-mono select-copy pr-8">
                            {item.expression}
                          </div>
                          <div className="text-xs font-bold text-card-foreground mt-0.5 font-mono select-copy">
                            = {item.result}
                          </div>
                          <div className="flex items-center justify-between mt-3 min-h-[16px] select-none text-[10px] font-bold">
                            <span className="text-muted-foreground font-medium">{item.timestamp}</span>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLoadHistoryItem(item);
                                }}
                                type="button"
                                className="text-accent hover:text-accent/80"
                              >
                                Reuse
                              </button>
                              <span className="text-border">|</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.id, item.result);
                                }}
                                type="button"
                                className="text-accent hover:text-accent/80 flex items-center gap-0.5"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="h-2.5 w-2.5" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-2.5 w-2.5" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>              </div>
              </div>

              {/* Branded PDF Download Button */}
              <div className="mt-3 border-t border-border/35 pt-3 flex flex-col select-none shrink-0">
                <CalculatorPdfExport pdfData={pdfData} />
              </div>
            </div>
          </div>
        </div>
      </CalculatorPageLayout>
  );
}
