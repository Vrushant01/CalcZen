import { useEffect, useState, useMemo } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { 
  getScientificCalculatorHistory, 
  addScientificCalculatorHistory, 
  clearScientificCalculatorHistory, 
  type ScientificHistoryItem 
} from "@/utils/scientificCalculatorHistory";
import { Calendar, Trash2, HelpCircle, Delete } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Safe scientific mathematical parser supporting degree/radian mode and whitelisted functions
function parseAndEvaluate(expr: string, angleMode: "deg" | "rad"): string {
  let cleaned = expr.trim();
  
  // Replace mathematical display symbols with javascript equivalents
  cleaned = cleaned.replace(/×/g, "*").replace(/÷/g, "/").replace(/mod/gi, "%");
  cleaned = cleaned.replace(/π/g, "Math.PI");
  cleaned = cleaned.replace(/\be\b/g, "Math.E");

  // Factorial loop: e.g. "5!" -> "fact(5)"
  const factorialRegex = /(\d+(?:\.\d+)?|\((?:[^()]+|\([^()]*\))*\))!/g;
  while (factorialRegex.test(cleaned)) {
    cleaned = cleaned.replace(factorialRegex, "fact($1)");
  }

  // Replace power ^ with **
  cleaned = cleaned.replace(/\^/g, "**");

  if (cleaned.length === 0) return "0";
  
  // Validate characters to completely prevent XSS or arbitrary injection exploits
  if (!/^[0-9+\-*/. (),*a-z]+$/i.test(cleaned)) {
    throw new Error("Invalid characters");
  }

  // Evaluate safely inside a function sandbox
  const fn = new Function(
    "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "abs", "exp", "fact", "yroot", "rand",
    `"use strict"; 
     const Math = globalThis.Math;
     return (${cleaned});`
  );

  // Define sandbox variables
  const fact = (n: number) => {
    if (n < 0) throw new Error("Negative factorial");
    if (!Number.isInteger(n)) throw new Error("Non-integer factorial");
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const sinFn = (x: number) => angleMode === "deg" ? Math.sin(x * Math.PI / 180) : Math.sin(x);
  const cosFn = (x: number) => angleMode === "deg" ? Math.cos(x * Math.PI / 180) : Math.cos(x);
  const tanFn = (x: number) => angleMode === "deg" ? Math.tan(x * Math.PI / 180) : Math.tan(x);
  const asinFn = (x: number) => angleMode === "deg" ? Math.asin(x) * 180 / Math.PI : Math.asin(x);
  const acosFn = (x: number) => angleMode === "deg" ? Math.acos(x) * 180 / Math.PI : Math.acos(x);
  const atanFn = (x: number) => angleMode === "deg" ? Math.atan(x) * 180 / Math.PI : Math.atan(x);
  
  const logFn = (x: number) => Math.log10(x);
  const lnFn = (x: number) => Math.log(x);
  const sqrtFn = (x: number) => Math.sqrt(x);
  const cbrtFn = (x: number) => Math.cbrt(x);
  const absFn = (x: number) => Math.abs(x);
  const expFn = (x: number) => Math.exp(x);
  const yrootFn = (x: number, y: number) => Math.pow(x, 1 / y);
  const randFn = () => Math.random();

  const result = fn(
    sinFn, cosFn, tanFn, asinFn, acosFn, atanFn, logFn, lnFn, sqrtFn, cbrtFn, absFn, expFn, fact, yrootFn, randFn
  );

  if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
    throw new Error("Calculation error");
  }

  // Floating-point precision adjustments
  return String(Math.round(result * 1e12) / 1e12);
}

export function ScientificCalculator() {
  const calc = getCalculator("scientific-calculator")!;
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  
  // In-memory sync state
  const [history, setHistory] = useState<ScientificHistoryItem[]>(getScientificCalculatorHistory());
  
  // Calculator display & mode state
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [isResetOnNext, setIsResetOnNext] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "scientific">("basic");

  // Sync state on initialization
  useEffect(() => {
    setHistory(getScientificCalculatorHistory());
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
        handleParenthesis(key as "(" | ")");
      } else if (key === "^") {
        handleDigit("^");
      } else if (key === "!") {
        handleDigit("!");
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
  }, [equation, display, isResetOnNext, angleMode]);

  // Click digit or standard parenthesis handler
  function handleDigit(digit: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setDisplay(digit);
      setEquation(digit);
      setIsResetOnNext(false);
      return;
    }

    if (digit === "." && display.includes(".")) return;

    if (display === "0" && digit !== "." && !["^", "!"].includes(digit)) {
      setDisplay(digit);
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

    const lastChar = trimmed.slice(-1);
    if (["+", "-", "×", "÷"].includes(lastChar)) {
      setEquation(trimmed.slice(0, -1).trim() + " " + op + " ");
      return;
    }

    setEquation((prev) => prev + " " + op + " ");
    setDisplay("");
  }

  // Percent operation handler
  function handlePercent() {
    setErrorMsg("");
    if (isResetOnNext || display === "" || display.endsWith("%")) return;
    setDisplay((prev) => prev + "%");
    setEquation((prev) => prev + "%");
  }

  // Dedicated parenthesis handler
  function handleParenthesis(char: "(" | ")") {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(char);
      setDisplay(char === "(" ? "" : "0");
      setIsResetOnNext(false);
      return;
    }

    if (char === "(") {
      const lastChar = equation.trim().slice(-1);
      // Auto-insert multiplication if preceding char is a digit, constant, or parenthesis
      if (/[0-9)eπ]/.test(lastChar)) {
        setEquation((prev) => prev + " × (");
      } else {
        setEquation((prev) => prev + "(");
      }
      setDisplay("");
    } else {
      const openCount = (equation.match(/\(/g) || []).length;
      const closeCount = (equation.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        setEquation((prev) => prev + ")");
        // Display remains the same to avoid "5)" bug
      }
    }
  }

  // Scientific function append handler
  function handleFunc(fnName: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(fnName + "(");
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    
    const lastChar = equation.trim().slice(-1);
    // If preceding character is a number or parenthesis, auto-multiply
    if (/[0-9)eπ]/.test(lastChar)) {
      setEquation((prev) => prev + " × " + fnName + "(");
    } else {
      setEquation((prev) => prev + fnName + "(");
    }
    setDisplay("");
  }

  // Append scientific constants
  function handleConstant(sym: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(sym);
      setDisplay(sym === "π" ? "3.14159265359" : "2.71828182846");
      setIsResetOnNext(false);
      return;
    }

    const lastChar = equation.trim().slice(-1);
    if (/[0-9)eπ]/.test(lastChar)) {
      setEquation((prev) => prev + " × " + sym);
    } else {
      setEquation((prev) => prev + sym);
    }
    setDisplay(sym === "π" ? "3.14159265359" : "2.71828182846");
  }

  // Abs value |x| helper
  function handleAbs() {
    handleFunc("abs");
  }

  // Modulo trigger
  function handleMod() {
    handleOperator("mod");
  }

  // Reciprocal 1/x trigger
  function handleReciprocal() {
    setErrorMsg("");
    if (display === "0" || display === "") return;
    setEquation((prev) => "1 / (" + prev + ")");
    setIsResetOnNext(true);
    handleEqual();
  }

  // Random number triggers
  function handleRand() {
    setErrorMsg("");
    const randVal = String(Math.random());
    if (isResetOnNext) {
      setEquation("rand()");
      setDisplay(randVal);
      setIsResetOnNext(false);
      return;
    }
    setEquation((prev) => prev + "rand()");
    setDisplay(randVal);
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
      if (trimmed.length > 0) {
        const lastChar = trimmed.slice(-1);
        if (["+", "-", "×", "÷"].includes(lastChar)) {
          const undone = trimmed.slice(0, -1).trim();
          setEquation(undone);
          const parts = undone.split(/\s+/);
          const lastPart = parts[parts.length - 1] || "";
          if (/^[0-9.%()a-z]+$/i.test(lastPart)) {
            setDisplay(lastPart);
          } else {
            setDisplay("");
          }
        }
      }
    }
  }

  // Clear/Reset current display
  function handleClear() {
    setErrorMsg("");
    setDisplay("0");
    setEquation("");
    setIsResetOnNext(false);
    resetCalculated();
  }

  // Equal evaluation trigger
  function handleEqual() {
    if (!equation.trim()) return;
    setErrorMsg("");

    try {
      const result = parseAndEvaluate(equation, angleMode);
      
      // Save calculation to independent history singleton
      addScientificCalculatorHistory(equation, result, angleMode);
      
      // Update display states
      setDisplay(result);
      setEquation((prev) => prev + " = ");
      setIsResetOnNext(true);
      
      // Sync local component lists
      setHistory(getScientificCalculatorHistory());
      markCalculated();
    } catch (err) {
      console.warn("Scientific Calculator evaluation error:", err);
      setErrorMsg("Error");
      setDisplay("0");
      setIsResetOnNext(true);
    }
  }

  // Wipe history cleanly instantly
  function handleClearHistory() {
    clearScientificCalculatorHistory();
    setHistory([]);
    resetCalculated();
  }

  // Load a past session history item back onto the screen
  function handleLoadHistoryItem(item: ScientificHistoryItem) {
    setErrorMsg("");
    setEquation(item.expression);
    setDisplay(item.result);
    setAngleMode(item.angleMode);
    setIsResetOnNext(true);
  }

  // Map PDF export schemas
  const pdfData = useMemo(() => {
    if (!hasResult || display === "0" || display === "Error") return null;

    const formattedEq = equation.includes("=") ? equation.split("=")[0].trim() : equation;

    return {
      calculatorName: "Scientific Calculator",
      calculatorSlug: "scientific-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: [
        { label: "Expression Evaluated", value: formattedEq || "0" },
        { label: "Angle Mode Used", value: angleMode.toUpperCase() },
      ],
      results: [
        { label: "Final Result", value: display, highlight: true },
      ],
      summary: `A high-precision scientific calculation completed on CalcZen. Target formula: ${formattedEq || "0"} = ${display} using the ${angleMode.toUpperCase()} angle system. A comprehensive tabular grid of session history is included below.`,
      tableData: history.length > 0 ? {
        title: "CALCULATION HISTORY (CURRENT SESSION)",
        headers: ["Timestamp", "Angle Mode", "Expression", "Result"],
        rows: history.map((item) => [
          item.timestamp,
          item.angleMode.toUpperCase(),
          item.expression,
          item.result
        ])
      } : null,
    };
  }, [hasResult, display, equation, history, angleMode]);

  return (
    <CalculatorPageLayout
      calc={calc}
      intro="Advanced high-precision scientific calculator supporting complex trigonometric, logarithmic, exponential, algebraic, and constant operations with isolated session histories."
      formula={`Trigonometry (DEG) = sin(x × π ÷ 180)
Trigonometry (RAD) = sin(x)
Logarithm = log10(x) / ln(x)
Exponentiation = x ** y`}
      example={`sin(30) = 0.5 (DEG mode)
ln(e) = 1
5^3 = 125
5! = 120`}
      faqs={[
        { q: "What is the difference between Degree (DEG) and Radian (RAD) mode?", a: "Degree mode evaluates angles in standard geometry scale (0 to 360), which is widely used in physics and navigation. Radian mode evaluates angles naturally relative to circle radius coordinates, standard in calculus and engineering." },
        { q: "How are factorials computed?", a: "Clicking the '!' button appends a factorial operator which computes the product of all positive integers less than or equal to that base (e.g. 5! = 120)." },
        { q: "Does the calculation history survive browser navigations?", a: "Yes. All calculation history remains fully accessible as you navigate CalcZen pages and calculators. It will be naturally wiped upon page reload (F5) or closing the tab for security." },
        { q: "Does resetting the calculator clear my history?", a: "No. Clicking 'C' clears the display screen but preserves the calculation history panel completely intact." }
      ]}
      blog={<CalculatorBlog content={blogContent.scientific} />}
    >
      <div className="calc-layout-grid">
        
        {/* LEFT PANEL: KEYPAD & DISPLAY */}
        <div className="flex flex-col min-w-0 bg-card/25 border border-border/70 rounded-2xl p-4 sm:p-5 shadow-card select-none">
          
          {/* LCD Screen Display */}
          <div className="bg-slate-950/70 border border-border/40 rounded-xl p-4.5 sm:p-5 text-right font-mono min-h-[7rem] flex flex-col justify-between mb-4.5 shadow-inner relative">
            
            {/* Expression top line */}
            <div className="text-xs sm:text-sm text-slate-400 break-all select-text font-normal min-h-[1.5rem] pr-10">
              {equation || <span className="opacity-0">0</span>}
            </div>

            {/* Current value bottom line & angle mode indicator */}
            <div className="flex items-end justify-between mt-2 select-text">
              <span className="text-[10px] tracking-widest font-extrabold px-1.5 py-0.5 rounded bg-accent/20 border border-accent/30 text-accent uppercase select-none">
                {angleMode}
              </span>
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight select-text ${errorMsg ? "text-destructive" : "text-white"}`}>
                {errorMsg || display || "0"}
              </span>
            </div>

          </div>

          {/* Toggle for DEG/RAD Angle Mode */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setAngleMode("deg")}
              type="button"
              className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all border duration-150 active:scale-[0.98] ${
                angleMode === "deg"
                  ? "bg-accent text-accent-foreground border-accent shadow-soft"
                  : "bg-muted/20 text-muted-foreground border-border/40 hover:bg-muted/40"
              }`}
            >
              DEGREE (DEG)
            </button>
            <button
              onClick={() => setAngleMode("rad")}
              type="button"
              className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all border duration-150 active:scale-[0.98] ${
                angleMode === "rad"
                  ? "bg-accent text-accent-foreground border-accent shadow-soft"
                  : "bg-muted/20 text-muted-foreground border-border/40 hover:bg-muted/40"
              }`}
            >
              RADIAN (RAD)
            </button>
          </div>

          {/* Responsive Mobile Tabs: Basic vs Scientific Keypad */}
          <div className="flex md:hidden border-b border-border/30 mb-4 select-none">
            <button
              onClick={() => setActiveTab("basic")}
              type="button"
              className={`flex-1 pb-2.5 text-xs font-bold tracking-wider transition-all border-b-2 ${
                activeTab === "basic" 
                  ? "border-accent text-accent" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              BASIC KEYS
            </button>
            <button
              onClick={() => setActiveTab("scientific")}
              type="button"
              className={`flex-1 pb-2.5 text-xs font-bold tracking-wider transition-all border-b-2 ${
                activeTab === "scientific" 
                  ? "border-accent text-accent" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              SCIENTIFIC KEYS
            </button>
          </div>

          {/* Dynamic Scientific & Standard Grid Dashboard Layout */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
            
            {/* Scientific keys section: 6-cols wide on md screens */}
            <div className={`md:col-span-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2.5 font-mono ${
              activeTab === "scientific" ? "grid" : "hidden md:grid"
            }`}>
              
              {/* Trigonometry */}
              <button
                onClick={() => handleFunc("sin")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                sin
              </button>
              <button
                onClick={() => handleFunc("cos")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                cos
              </button>
              <button
                onClick={() => handleFunc("tan")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                tan
              </button>
              <button
                onClick={() => handleFunc("asin")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                asin
              </button>
              <button
                onClick={() => handleFunc("acos")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                acos
              </button>
              <button
                onClick={() => handleFunc("atan")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                atan
              </button>

              {/* Exponentials & Logs */}
              <button
                onClick={() => handleFunc("ln")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                ln
              </button>
              <button
                onClick={() => handleFunc("log")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                log
              </button>
              <button
                onClick={() => handleFunc("exp")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                eˣ
              </button>
              <button
                onClick={handleReciprocal}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                1/x
              </button>

              {/* Powers & Roots */}
              <button
                onClick={() => handleDigit("^2")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                x²
              </button>
              <button
                onClick={() => handleDigit("^3")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                x³
              </button>
              <button
                onClick={() => handleDigit("^")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                xʸ
              </button>
              <button
                onClick={() => handleFunc("sqrt")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                √x
              </button>
              <button
                onClick={() => handleFunc("cbrt")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                ∛x
              </button>
              <button
                onClick={() => handleFunc("yroot")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
                aria-label="n-th root"
              >
                y√x
              </button>

              {/* Constants & Custom Operations */}
              <button
                onClick={() => handleConstant("π")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                π
              </button>
              <button
                onClick={() => handleConstant("e")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                e
              </button>
              <button
                onClick={() => handleDigit("!")}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                n!
              </button>
              <button
                onClick={handleAbs}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                |x|
              </button>
              <button
                onClick={handleMod}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                mod
              </button>
              <button
                onClick={handleRand}
                type="button"
                className="h-10 rounded-xl text-xs font-bold bg-accent/10 border border-accent/20 text-foreground hover:bg-accent/25 transition-all duration-150 active:scale-[0.95]"
              >
                Rand
              </button>

            </div>

            {/* Standard keys section: 4-cols wide on md screens */}
            <div className={`md:col-span-4 grid grid-cols-4 gap-2.5 font-mono ${
              activeTab === "basic" ? "grid" : "hidden md:grid"
            }`}>
              
              {/* Row 1 */}
              <button
                onClick={handleClear}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-destructive/10 border border-destructive/25 text-destructive hover:bg-destructive hover:text-white transition-all duration-150 active:scale-[0.95]"
              >
                C
              </button>
              <button
                onClick={handleBackspace}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/40 border border-border/30 text-foreground hover:bg-muted/60 transition-all duration-150 active:scale-[0.95] flex items-center justify-center"
              >
                <Delete className="h-4 w-4" />
              </button>
              <button
                onClick={handlePercent}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-accent/10 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.95]"
              >
                %
              </button>
              <button
                onClick={() => handleOperator("÷")}
                type="button"
                className="h-10 rounded-xl text-sm font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.95]"
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => handleDigit("7")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                7
              </button>
              <button
                onClick={() => handleDigit("8")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                8
              </button>
              <button
                onClick={() => handleDigit("9")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                9
              </button>
              <button
                onClick={() => handleOperator("×")}
                type="button"
                className="h-10 rounded-xl text-sm font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.95]"
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => handleDigit("4")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                4
              </button>
              <button
                onClick={() => handleDigit("5")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                5
              </button>
              <button
                onClick={() => handleDigit("6")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                6
              </button>
              <button
                onClick={() => handleOperator("-")}
                type="button"
                className="h-10 rounded-xl text-sm font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.95]"
              >
                -
              </button>

              {/* Row 4 */}
              <button
                onClick={() => handleDigit("1")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                1
              </button>
              <button
                onClick={() => handleDigit("2")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                2
              </button>
              <button
                onClick={() => handleDigit("3")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                3
              </button>
              <button
                onClick={() => handleOperator("+")}
                type="button"
                className="h-10 rounded-xl text-sm font-bold bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-150 active:scale-[0.95]"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => handleParenthesis("(")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/30 border border-border/30 text-foreground hover:bg-muted/50 transition-all duration-150 active:scale-[0.95]"
              >
                (
              </button>
              <button
                onClick={() => handleParenthesis(")")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/30 border border-border/30 text-foreground hover:bg-muted/50 transition-all duration-150 active:scale-[0.95]"
              >
                )
              </button>
              <button
                onClick={() => handleDigit("0")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                0
              </button>
              <button
                onClick={() => handleDigit(".")}
                type="button"
                className="h-10 rounded-xl text-xs sm:text-sm font-bold bg-muted/20 border border-border/30 text-foreground hover:bg-muted/40 transition-all duration-150 active:scale-[0.95]"
              >
                .
              </button>

              {/* Double-width equal key */}
              <button
                onClick={handleEqual}
                type="button"
                className="col-span-4 h-10 rounded-xl text-sm font-extrabold bg-accent text-accent-foreground border border-accent hover:bg-accent/90 shadow-glow transition-all duration-150 active:scale-[0.95]"
              >
                =
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL: SESSION HISTORY SIDEBAR & PDF */}
        <div className="flex flex-col min-w-0 bg-card/25 border border-border/70 rounded-2xl p-4 sm:p-5 shadow-card select-text">
          <header className="flex items-center justify-between pb-3.5 border-b border-border/30 mb-4 select-none">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent shrink-0" />
              Scientific History
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
                    No scientific operations performed during this session.
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
                      <span className="flex items-center gap-1">
                        Entry #{history.length - idx}
                        <span className="text-[8px] font-extrabold px-1 rounded bg-accent/15 border border-accent/20 text-accent uppercase">
                          {item.angleMode}
                        </span>
                      </span>
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
