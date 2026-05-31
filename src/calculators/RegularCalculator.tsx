import { useEffect, useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { 
  getRegularCalculatorHistory, 
  addRegularCalculatorHistory, 
  clearRegularCalculatorHistory, 
  type HistoryItem 
} from "@/utils/regularCalculatorHistory";
import { Calendar, Trash2, RotateCcw, HelpCircle, Delete } from "lucide-react";
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

export function RegularCalculator() {
  const calc = getCalculator("regular-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  
  // In-memory sync state
  const [history, setHistory] = useState<HistoryItem[]>(getRegularCalculatorHistory());
  
  // Calculator display state machine
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isResetOnNext, setIsResetOnNext] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state with singleton store on initialization
  useEffect(() => {
    setHistory(getRegularCalculatorHistory());
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
      addRegularCalculatorHistory(equation, result);
      
      // Update displays
      setDisplay(result);
      setEquation((prev) => prev + " = ");
      setIsResetOnNext(true);
      
      // Update local react components
      setHistory(getRegularCalculatorHistory());
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
    clearRegularCalculatorHistory();
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
    if (!hasResult || display === "0" || display === "Error") return null;

    const formattedEq = equation.includes("=") ? equation.split("=")[0].trim() : equation;
    
    return {
      calculatorName: "Regular Calculator",
      calculatorSlug: "regular-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Expression Evaluated", value: formattedEq || "0" },
      ],
      results: [
        { label: "Final Result", value: display, highlight: true },
      ],
      summary: `A standard calculator calculation performed on CalcZen. Current formula: ${formattedEq || "0"} = ${display}. Complete calculation history details are included in the tabular report below.`,
      tableData: history.length > 0 ? {
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
      blog={<CalculatorBlog content={blogContent.regular} />}
    >
      <div className="calc-layout-grid">
        
        {/* LEFT PANEL: KEYPAD & DISPLAY (lg:col-span-6) */}
        <div className="flex flex-col min-w-0 bg-card/25 border border-border/70 rounded-2xl p-4 sm:p-5 shadow-card select-none">
          
          {/* LCD Calculator Screen */}
          <div className="bg-slate-950/70 border border-border/40 rounded-xl p-4.5 sm:p-5 text-right font-mono min-h-[6.5rem] flex flex-col justify-between mb-4.5 shadow-inner">
            {/* Expression top line */}
            <div className="text-xs sm:text-sm text-slate-400 break-all select-text font-normal min-h-[1.25rem]">
              {equation || <span className="opacity-0">0</span>}
            </div>
            {/* Current value bottom line */}
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight select-text ${errorMsg ? "text-destructive" : "text-white"}`}>
              {errorMsg || display || "0"}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 font-mono">
            {/* Row 1 */}
            <button
              onClick={handleClear}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all duration-150 active:scale-[0.96]"
            >
              C
            </button>
            <button
              onClick={handleBackspace}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/40 border border-border/30 text-foreground hover:bg-muted/60 transition-all duration-150 active:scale-[0.96] flex items-center justify-center"
              aria-label="Backspace"
            >
              <Delete className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={handlePercent}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-accent/10 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.96]"
            >
              %
            </button>
            <button
              onClick={() => handleOperator("÷")}
              type="button"
              className="h-12 rounded-xl text-base font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.96]"
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleDigit("7")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              7
            </button>
            <button
              onClick={() => handleDigit("8")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              8
            </button>
            <button
              onClick={() => handleDigit("9")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              9
            </button>
            <button
              onClick={() => handleOperator("×")}
              type="button"
              className="h-12 rounded-xl text-base font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.96]"
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleDigit("4")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              4
            </button>
            <button
              onClick={() => handleDigit("5")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              5
            </button>
            <button
              onClick={() => handleDigit("6")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              6
            </button>
            <button
              onClick={() => handleOperator("-")}
              type="button"
              className="h-12 rounded-xl text-base font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.96]"
            >
              -
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleDigit("1")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              1
            </button>
            <button
              onClick={() => handleDigit("2")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              2
            </button>
            <button
              onClick={() => handleDigit("3")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              3
            </button>
            <button
              onClick={() => handleOperator("+")}
              type="button"
              className="h-12 rounded-xl text-base font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.96]"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={handleParenthesis}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/40 border border-border/30 text-foreground hover:bg-muted/60 transition-all duration-150 active:scale-[0.96]"
            >
              ( )
            </button>
            <button
              onClick={() => handleDigit("0")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              0
            </button>
            <button
              onClick={() => handleDigit(".")}
              type="button"
              className="h-12 rounded-xl text-sm sm:text-base font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.96]"
            >
              .
            </button>
            <button
              onClick={handleEqual}
              type="button"
              className="h-12 rounded-xl text-base font-extrabold bg-accent text-accent-foreground border border-accent hover:bg-accent/90 shadow-glow transition-all duration-150 active:scale-[0.96]"
            >
              =
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: SESSION HISTORY SIDEBAR & PDF (lg:col-span-4) */}
        <div className="flex flex-col min-w-0 bg-card/25 border border-border/70 rounded-2xl p-4 sm:p-5 shadow-card select-text">
          <header className="flex items-center justify-between pb-3.5 border-b border-border/30 mb-4 select-none">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent shrink-0" />
              Session History
            </h3>
            
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                type="button"
                className="text-[11px] font-bold text-destructive flex items-center gap-1 min-h-[2.25rem] px-2 py-0.5 rounded bg-destructive/10 border border-destructive/20 hover:bg-destructive hover:text-white transition-all"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            )}
          </header>

          {/* History Item Entries (Animated) */}
          <div className="flex-1 overflow-y-auto max-h-[16rem] sm:max-h-[18rem] md:max-h-[22rem] pr-1 space-y-3 scrollbar-none">
            <AnimatePresence initial={false}>
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center flex flex-col items-center gap-2 select-none"
                >
                  <HelpCircle className="h-7 w-7 text-muted-foreground opacity-60" />
                  <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                    No calculations performed during this session yet.
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
                    className="p-3 bg-muted/10 border border-border/40 hover:border-accent/50 hover:bg-accent/5 transition-all rounded-xl text-left flex flex-col justify-between shadow-soft select-copy cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground select-none mb-1 uppercase tracking-wider">
                      <span>Entry #{history.length - idx}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <div className="text-xs text-muted-foreground/95 truncate font-mono select-copy">
                      {item.expression}
                    </div>
                    <div className="text-sm font-extrabold text-foreground mt-0.5 font-mono select-copy">
                      = {item.result}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Branded PDF Download Button */}
          <div className="mt-5 border-t border-border/30 pt-4 flex flex-col">
            <CalculatorPdfExport hasResult={hasResult} pdfData={pdfData} />
          </div>

        </div>

      </div>
    </CalculatorPageLayout>
  );
}
