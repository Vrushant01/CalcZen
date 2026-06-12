import { useEffect, useState, useMemo, useRef } from "react";
import { CalculatorPageLayout } from "@/components/CalculatorPageLayout";
import CalculatorBlog from "@/components/CalculatorBlog";
import { blogContent } from "@/data/blogContent";
import { getCalculator } from "@/data/calculators";
import { useHasCalculated } from "@/hooks/use-has-calculated";
import { PDF_SITE_NAME, PDF_SITE_URL } from "@/constants/pdfBrand";
import { getScientificCalculatorHistory, 
  addScientificCalculatorHistory, 
  clearScientificCalculatorHistory, 
  type ScientificHistoryItem 
} from "@/utils/scientificCalculatorHistory";
import { HelpCircle, Delete, Clock, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { CalculatorPdfExport } from "@/components/CalculatorPdfExport";


// Helper to balance missing closing parentheses and validate their order
function validateAndBalanceParentheses(expr: string): string {
  let openCount = 0;
  for (let char of expr) {
    if (char === '(') openCount++;
    if (char === ')') {
      openCount--;
      if (openCount < 0) {
        throw new Error("Parenthesis imbalance");
      }
    }
  }
  
  let balanced = expr;
  if (openCount > 0) {
    balanced += ")".repeat(openCount);
  }
  return balanced;
}

// Preprocessor to inject implicit multiplication operations
function preprocessExpression(expr: string): string {
  let s = expr.trim();
  
  // Normalize spaces
  s = s.replace(/\s+/g, "");

  // 1. Parenthesis followed by parenthesis: )( -> )*(
  s = s.replace(/\)\(/g, ")*(");

  // 2. Number followed by parenthesis: 5( -> 5*(
  s = s.replace(/(\d)\(/g, "$1*(");

  // 3. Parenthesis followed by number/constant: )5 -> )*5, )π -> )*π, )e -> )*e
  s = s.replace(/\)([\dπe])/g, ")*$1");

  // 4. Number/constant followed by constants: 2π -> 2*π, 2e -> 2*e, πe -> π*e, eπ -> e*π, etc.
  s = s.replace(/(\d)(π|e)\b/g, "$1*$2");
  s = s.replace(/(\d)(π)/g, "$1*$2");
  s = s.replace(/(π|e)(\d)/g, "$1*$2");
  s = s.replace(/(π)(e)/g, "$1*$2");
  s = s.replace(/(e)(π)/g, "$1*$2");

  // 5. Number/constant followed by a function name: 2sin(30) -> 2*sin(30)
  const funcs = "sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs|exp|fact|yroot|rand";
  const funcRegex = new RegExp(`(\\d|π|e)(${funcs})`, "g");
  s = s.replace(funcRegex, "$1*$2");

  return s;
}

// Safe scientific mathematical parser supporting degree/radian mode and whitelisted functions
function parseAndEvaluate(expr: string, angleMode: "deg" | "rad"): string {
  let cleaned = expr.trim();
  if (cleaned.length === 0) return "0";

  // Normalize mathematical symbols before parentheses validation and preprocessing
  cleaned = cleaned.replace(/√/g, "sqrt").replace(/∛/g, "cbrt");

  // Validate parentheses balance
  try {
    cleaned = validateAndBalanceParentheses(cleaned);
  } catch (err) {
    throw new Error("Invalid Expression");
  }

  // Preprocess auto-multiplication
  cleaned = preprocessExpression(cleaned);

  // Replace mathematical display symbols with javascript equivalents
  cleaned = cleaned.replace(/×/g, "*").replace(/÷/g, "/").replace(/mod/gi, "%");
  cleaned = cleaned.replace(/π/g, "Math.PI");
  // Replace standalone 'e' constant - must NOT be part of a function name like exp, exp10, etc.
  // Use negative lookahead/lookbehind to ensure 'e' is a standalone token
  cleaned = cleaned.replace(/(?<![a-zA-Z])e(?![a-zA-Z0-9_])/g, "Math.E");

  // Replace power ^ with **
  cleaned = cleaned.replace(/\^/g, "**");

  // Factorial loop: e.g. "5!" -> "fact(5)"
  const factorialRegex = /(\d+(?:\.\d+)?|\((?:[^()]+|\([^()]*\))*\))!/g;
  while (factorialRegex.test(cleaned)) {
    cleaned = cleaned.replace(factorialRegex, "fact($1)");
  }

  // Validate characters to completely prevent XSS or arbitrary injection exploits
  // Allowed: digits, operators (+,-,*,/,%), decimal, spaces, parentheses, commas, letters (for Math.PI, Math.E, function names)
  if (!/^[0-9+\-%*/. (),a-z]+$/i.test(cleaned)) {
    throw new Error("Invalid Expression");
  }

  // Evaluate safely inside a function sandbox
  let fn;
  try {
    fn = new Function(
      "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "abs", "exp", "fact", "yroot", "rand",
      `"use strict"; 
       const Math = globalThis.Math;
       return (${cleaned});`
    );
  } catch (err) {
    throw new Error("Invalid Expression");
  }

  // Define sandbox variables
  const fact = (n: number) => {
    if (n < 0 || !Number.isInteger(n)) throw new Error("Invalid Factorial");
    if (n > 170) throw new Error("Math Domain Error");
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const sinFn = (x: number) => angleMode === "deg" ? Math.sin(x * Math.PI / 180) : Math.sin(x);
  const cosFn = (x: number) => angleMode === "deg" ? Math.cos(x * Math.PI / 180) : Math.cos(x);
  const tanFn = (x: number) => {
    if (angleMode === "deg" && (Math.abs(x) - 90) % 180 === 0) {
      throw new Error("Math Domain Error");
    }
    return angleMode === "deg" ? Math.tan(x * Math.PI / 180) : Math.tan(x);
  };
  const asinFn = (x: number) => {
    if (x < -1 || x > 1) throw new Error("Math Domain Error");
    return angleMode === "deg" ? Math.asin(x) * 180 / Math.PI : Math.asin(x);
  };
  const acosFn = (x: number) => {
    if (x < -1 || x > 1) throw new Error("Math Domain Error");
    return angleMode === "deg" ? Math.acos(x) * 180 / Math.PI : Math.acos(x);
  };
  const atanFn = (x: number) => angleMode === "deg" ? Math.atan(x) * 180 / Math.PI : Math.atan(x);
  
  const logFn = (x: number) => {
    if (x <= 0) throw new Error("Math Domain Error");
    return Math.log10(x);
  };
  const lnFn = (x: number) => {
    if (x <= 0) throw new Error("Math Domain Error");
    return Math.log(x);
  };
  const sqrtFn = (x: number) => {
    if (x < 0) throw new Error("Math Domain Error");
    return Math.sqrt(x);
  };
  const cbrtFn = (x: number) => Math.cbrt(x);
  const absFn = (x: number) => Math.abs(x);
  const expFn = (x: number) => Math.exp(x);
  const yrootFn = (x: number, y: number) => {
    if (y === 0) throw new Error("Cannot Divide by Zero");
    if (x < 0 && y % 2 === 0) throw new Error("Math Domain Error");
    return Math.pow(x, 1 / y);
  };
  const randFn = () => Math.random();

  let result;
  try {
    result = fn(
      sinFn, cosFn, tanFn, asinFn, acosFn, atanFn, logFn, lnFn, sqrtFn, cbrtFn, absFn, expFn, fact, yrootFn, randFn
    );
  } catch (err: any) {
    if (err.message && (err.message.includes("Divide") || err.message.includes("Factorial") || err.message.includes("Domain"))) {
      throw err;
    }
    throw new Error("Invalid Expression");
  }

  if (typeof result !== "number" || isNaN(result)) {
    throw new Error("Invalid Expression");
  }
  if (!isFinite(result)) {
    if (expr.includes("/") || expr.includes("÷")) {
      throw new Error("Cannot Divide by Zero");
    }
    throw new Error("Math Domain Error");
  }

  // Floating-point precision adjustments & number formatting
  const precise = Math.round(result * 1e12) / 1e12;
  // Format very large or very small numbers in exponential notation
  if (Math.abs(precise) >= 1e15 || (Math.abs(precise) < 1e-9 && precise !== 0)) {
    return precise.toExponential(6);
  }
  // Trim trailing zeros for decimal results
  const str = String(precise);
  return str;
}

export function ScientificCalculator() {
  const calc = getCalculator("scientific-calculator")!;
  const { isDark } = useTheme();
  const { hasResult, markCalculated, resetCalculated } = useHasCalculated();
  const expressionRef = useRef<HTMLDivElement>(null);
  
  // In-memory sync state
  const [history, setHistory] = useState<ScientificHistoryItem[]>(getScientificCalculatorHistory());
  
  // Calculator display & mode state
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [isResetOnNext, setIsResetOnNext] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const showHistory = true;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const numberKeyClass = "calc-btn calc-btn-number h-10 text-xs sm:text-sm";
  const operatorKeyClass = "calc-btn calc-btn-operator h-10 text-xs sm:text-sm";
  const functionKeyClass = "calc-btn calc-btn-function h-10 text-xs sm:text-sm font-mono";
  const equalKeyClass = "calc-btn calc-btn-equal col-span-4 h-10 text-sm";

  // Sync state on initialization
  useEffect(() => {
    setHistory(getScientificCalculatorHistory());
  }, []);

  // Auto-scroll the equation display to the right when it changes
  useEffect(() => {
    if (expressionRef.current) {
      expressionRef.current.scrollLeft = expressionRef.current.scrollWidth;
    }
  }, [equation]);

  // Helper to append content to the active equation string
  function appendToEquation(text: string, autoMultiply = false) {
    setErrorMsg("");
    let toInsert = text;
    if (autoMultiply && equation.length > 0) {
      const charBefore = equation[equation.length - 1];
      if (/[0-9)eπ!]/.test(charBefore)) {
        toInsert = "×" + text;
      }
    }
    setEquation((prev) => prev + toInsert);
  }

  // Keyboard support event listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      // Ignore shortcut key combinations
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const key = e.key;
      
      if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEqual();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (key === "Escape" || key.toLowerCase() === "c" || key === "Delete") {
        e.preventDefault();
        handleClear();
      } else if (key.length === 1 && /^[0-9+\-%*/. (),a-z√∛!^]$/i.test(key)) {
        e.preventDefault();
        setErrorMsg("");
        
        let charToInsert = key;
        if (key === "*") charToInsert = "×";
        else if (key === "/") charToInsert = "÷";
        
        if (isResetOnNext) {
          if (/^[+\-%*/]/.test(key)) {
            setEquation(display + charToInsert);
            setDisplay("");
          } else {
            setEquation(charToInsert);
            setDisplay(charToInsert === "π" ? "3.14159265359" : charToInsert === "e" ? "2.71828182846" : charToInsert);
          }
          setIsResetOnNext(false);
        } else {
          let autoMultiply = false;
          if (/^[a-z√∛(]/.test(charToInsert) && equation.length > 0) {
            const charBefore = equation[equation.length - 1];
            if (/[0-9)eπ!]/.test(charBefore)) {
              autoMultiply = true;
            }
          }
          appendToEquation(charToInsert, autoMultiply);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [equation, display, isResetOnNext, angleMode]);

  // Keypad click handlers
  function handleDigit(digit: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(digit);
      setDisplay(digit === "π" ? "3.14159265359" : digit === "e" ? "2.71828182846" : digit);
      setIsResetOnNext(false);
      return;
    }
    appendToEquation(digit);
  }

  function handleOperator(op: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(display + op);
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    appendToEquation(op);
  }

  // Percent operation handler
  function handlePercent() {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(display + "%");
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    appendToEquation("%");
  }

  // Dedicated parenthesis handler
  function handleParenthesis(char: "(" | ")") {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(char);
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    if (char === "(") {
      appendToEquation("(", true);
    } else {
      appendToEquation(")");
    }
  }

  // Scientific function append handler
  function handleFunc(fnName: string) {
    setErrorMsg("");
    let insertVal = fnName + "(";
    if (fnName === "sqrt") {
      insertVal = "√(";
    } else if (fnName === "cbrt") {
      insertVal = "∛(";
    }
    
    if (isResetOnNext) {
      setEquation(insertVal);
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    appendToEquation(insertVal, true);
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
    appendToEquation(sym, true);
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
    if (isResetOnNext) {
      setEquation("1/(" + display + ")");
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    setEquation((prev) => "1/(" + prev + ")");
  }

  // Random number triggers
  function handleRand() {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation("rand()");
      setDisplay("");
      setIsResetOnNext(false);
      return;
    }
    appendToEquation("rand()", true);
  }

  // Backspace click handler
  function handleBackspace() {
    setErrorMsg("");
    if (isResetOnNext) {
      handleClear();
      return;
    }
    setEquation((prev) => prev.slice(0, -1));
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
      setIsResetOnNext(true);
      
      // Sync local component lists
      setHistory(getScientificCalculatorHistory());
      markCalculated();
    } catch (err: any) {
      console.warn("Scientific Calculator evaluation error:", err);
      setErrorMsg(err.message || "Invalid Expression");
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

  // Append a history result value to the current active equation
  function handleReuseResult(resultVal: string) {
    setErrorMsg("");
    if (isResetOnNext) {
      setEquation(resultVal);
      setDisplay(resultVal);
      setIsResetOnNext(false);
      return;
    }
    const lastChar = equation.trim().slice(-1);
    if (/[0-9)eπ]/.test(lastChar)) {
      setEquation((prev) => prev + " × " + resultVal);
    } else {
      setEquation((prev) => prev + resultVal);
    }
    setDisplay(resultVal);
  }

  // Map PDF export schemas
  const pdfData = useMemo(() => {
    const hasCurrent = hasResult && display !== "0" && display !== "Error" && !errorMsg;
    const hasHistory = history.length > 0;

    if (!hasCurrent && !hasHistory) return null;

    const formattedEq = equation.includes("=") ? equation.split("=")[0].trim() : equation;

    return {
      calculatorName: "Scientific Calculator",
      calculatorSlug: "scientific-calculator",
      siteName: PDF_SITE_NAME,
      siteUrl: PDF_SITE_URL,
      inputs: hasCurrent ? [
        { label: "Expression Evaluated", value: formattedEq || "0" },
        { label: "Angle Mode Used", value: angleMode.toUpperCase() },
      ] : [],
      results: hasCurrent ? [
        { label: "Final Result", value: display, highlight: true },
      ] : [],
      summary: hasCurrent 
        ? `A high-precision scientific calculation completed on CalcZen. Target formula: ${formattedEq || "0"} = ${display} using the ${angleMode.toUpperCase()} angle system. Complete calculation history details are included in the tabular report below.`
        : `A scientific calculator calculation session on CalcZen. Complete calculation history details are included in the tabular report below.`,
      tableData: hasHistory ? {
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
  }, [hasResult, display, equation, history, angleMode, errorMsg]);

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
        { q: "What functions does a scientific calculator support?", a: "A scientific calculator supports a wide range of advanced mathematical operations including trigonometry (sin, cos, tan), inverse trigonometry, logarithmic functions (log, ln), exponents, roots, factorials, and mathematical constants like Pi and e. It handles multi-step equations and algebraic order of operations (PEMDAS) for complex academic, scientific, or engineering calculations, making math much easier." },
        { q: "Can it solve trigonometric equations?", a: "Yes, it can easily evaluate trigonometric functions and inverse trigonometric equations for any given angle parameter. You must ensure the calculator is set to the correct active mode (Degree or Radian) depending on the equation's formatting to prevent calculation errors. If you need simple arithmetic, use our <a href=\"/calculator/standard-calculator\" class=\"text-primary hover:underline\">Standard Calculator</a>." },
        { q: "Does it support radians and degrees?", a: "Yes, our online scientific calculator features a convenient toggle switch to transition between Degree (DEG) and Radian (RAD) modes. Degree mode is standard for basic geometry, trigonometry, and physics, while Radian mode is essential for calculus, advanced physics, and engineering equations that involve circular motion and wave functions, ensuring accuracy." },
        { q: "What is scientific notation?", a: "Scientific notation is a mathematical method of writing very large or very small numbers using powers of 10 (for example, 6.02 x 10^23). It simplifies calculations in chemistry, physics, and astronomy, allowing scientists, engineers, and students to write values without long, cumbersome strings of placeholder zeros, which improves overall calculation clarity." },
        { q: "Can students use it for exams?", a: "Yes, online scientific calculators are excellent study tools for homework, test preparation, and exams in courses like algebra, chemistry, and calculus. However, for physical classroom exams, standard academic rules typically require standalone physical hardware for security. Check percentage ratios for test grading with our <a href=\"/calculator/percentage-calculator\" class=\"text-primary hover:underline\">Percentage Calculator</a> to track academic performance." },
        { q: "What is the difference between log and ln?", a: "Log (common logarithm) calculates exponents using a base of 10, whereas Ln (natural logarithm) calculates exponents using the mathematical constant e (approximately 2.718). Common logarithms are standard in everyday scaling like pH or decibels, while natural logarithms are vital in calculus, physics, and natural growth modeling across various scientific and engineering disciplines." },
        { q: "How do parentheses affect the order of operations?", a: "Parentheses tell the calculator to evaluate the enclosed mathematical expression first, overriding standard algebraic precedence rules (PEMDAS). Using parentheses is critical when grouping multiple terms in fraction numerators or exponent bases to ensure the calculator evaluates the mathematical expression exactly as you intended, preventing common computation errors in your academic and professional work." },
        { q: "Does this calculator preserve calculation history?", a: "Yes, our scientific calculator features an interactive session history panel that logs your equations and results. You can easily reuse previous calculations or copy results directly to your clipboard. This prevents manual copy errors during multi-step science or math problems, letting you focus entirely on solving the complex equations without distraction." }
      ]}
      blog={<CalculatorBlog content={blogContent.scientific} />}
    >
      <div className="flex flex-col xl:flex-row gap-6 w-full items-stretch justify-start">
        
        {/* LEFT COLUMN: CALCULATOR CARD */}
        <div className="w-full xl:w-[760px] shrink-0">
          <div className={`calc-input-column flex flex-col min-w-0 rounded-2xl p-5 select-none h-full justify-between transition-colors duration-200 ${
            isDark 
              ? "bg-[#111827] border border-white/[0.08] shadow-sm" 
              : "bg-[#f0f0f0] border border-[#d4d4d4] shadow-[6px_6px_18px_rgba(0,0,0,0.14),-4px_-4px_12px_rgba(255,255,255,0.9)]"
          }`}>
            <div>
              {/* LCD Calculator Screen */}
              <div className="relative bg-slate-900 border border-border/40 rounded-xl py-3.5 px-4 text-right font-mono h-[105px] flex flex-col justify-between mb-3.5 shadow-inner overflow-hidden">
                {/* Angle mode indicator positioned top-left */}
                <div className="absolute left-3 top-3 select-none">
                  <span className="text-[8px] tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase">
                    {angleMode}
                  </span>
                </div>

                {/* Expression display */}
                <div
                  ref={expressionRef}
                  className="min-h-[1.5rem] pl-16 text-right flex justify-end items-center overflow-x-auto scrollbar-none whitespace-nowrap text-xs sm:text-sm text-slate-300 font-normal font-mono select-none"
                >
                  {equation}
                </div>
                
                {/* Result display */}
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight select-text text-right mt-2 leading-none transition-colors overflow-x-auto scrollbar-none whitespace-nowrap ${
                  errorMsg ? "text-destructive" : "text-white"
                }`}>
                  {errorMsg || display || "0"}
                </div>
              </div>

              {/* Mode Selectors Row */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className={`flex items-center gap-1 flex-1 max-w-[150px] rounded-lg p-0.5 transition-colors ${
                  isDark ? "bg-white/[0.05]" : "bg-[#e2e8f0]"
                }`}>
                  <button
                    onClick={() => setAngleMode("deg")}
                    type="button"
                    className={`flex-1 h-7 rounded-md text-[10px] font-bold transition-all duration-150 active:scale-[0.97] ${
                      angleMode === "deg"
                        ? "bg-[#0ea5e9] text-white shadow-sm"
                        : isDark
                          ? "text-[#94a3b8] hover:text-white"
                          : "text-[#64748b] hover:text-[#334155]"
                    }`}
                  >
                    DEG
                  </button>
                  <button
                    onClick={() => setAngleMode("rad")}
                    type="button"
                    className={`flex-1 h-7 rounded-md text-[10px] font-bold transition-all duration-150 active:scale-[0.97] ${
                      angleMode === "rad"
                        ? "bg-[#0ea5e9] text-white shadow-sm"
                        : isDark
                          ? "text-[#94a3b8] hover:text-white"
                          : "text-[#64748b] hover:text-[#334155]"
                    }`}
                  >
                    RAD
                  </button>
                </div>
              </div>

              {/* Keypad Grid split in two side-by-side columns on tablet/desktop, stacked on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Left Column: Scientific Functions & Constants */}
                <div className="space-y-4">
                  {/* SECTION 1: Scientific Functions */}
                  <div>
                    <span className="text-[9px] font-extrabold text-[#64748b] dark:text-[#94a3b8]/60 tracking-wider block mb-1.5 uppercase select-none">
                      Scientific Functions
                    </span>
                    <div className="grid grid-cols-3 gap-[5px] font-mono">
                      <button onClick={() => handleFunc("sin")} type="button" className={functionKeyClass}>sin</button>
                      <button onClick={() => handleFunc("cos")} type="button" className={functionKeyClass}>cos</button>
                      <button onClick={() => handleFunc("tan")} type="button" className={functionKeyClass}>tan</button>
                      <button onClick={() => handleFunc("asin")} type="button" className={functionKeyClass}>asin</button>
                      <button onClick={() => handleFunc("acos")} type="button" className={functionKeyClass}>acos</button>
                      <button onClick={() => handleFunc("atan")} type="button" className={functionKeyClass}>atan</button>
                      <button onClick={() => handleFunc("ln")} type="button" className={functionKeyClass}>ln</button>
                      <button onClick={() => handleFunc("log")} type="button" className={functionKeyClass}>log</button>
                      <button onClick={() => handleFunc("exp")} type="button" className={functionKeyClass}>eˣ</button>
                      <button onClick={() => handleDigit("^2")} type="button" className={functionKeyClass}>x²</button>
                      <button onClick={() => handleDigit("^3")} type="button" className={functionKeyClass}>x³</button>
                      <button onClick={() => handleDigit("^")} type="button" className={functionKeyClass}>xʸ</button>
                      <button onClick={() => handleFunc("sqrt")} type="button" className={functionKeyClass}>√x</button>
                      <button onClick={() => handleFunc("cbrt")} type="button" className={functionKeyClass}>∛x</button>
                      <button onClick={handleReciprocal} type="button" className={functionKeyClass}>1/x</button>
                      <button onClick={() => handleFunc("yroot")} type="button" className={functionKeyClass}>y√x</button>
                      <button onClick={() => handleDigit("!")} type="button" className={functionKeyClass}>n!</button>
                      <button onClick={handleAbs} type="button" className={functionKeyClass}>|x|</button>
                    </div>
                  </div>

                  {/* SECTION 2: Constants */}
                  <div>
                    <span className="text-[9px] font-extrabold text-[#64748b] dark:text-[#94a3b8]/60 tracking-wider block mb-1.5 uppercase select-none">
                      Constants
                    </span>
                    <div className="grid grid-cols-4 gap-[5px] font-mono">
                      <button onClick={() => handleConstant("π")} type="button" className={functionKeyClass}>π</button>
                      <button onClick={() => handleConstant("e")} type="button" className={functionKeyClass}>e</button>
                      <button onClick={handleRand} type="button" className={functionKeyClass}>Rand</button>
                      <button onClick={handleMod} type="button" className={functionKeyClass}>mod</button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Standard Calculator */}
                <div>
                  <span className="text-[9px] font-extrabold text-[#64748b] dark:text-[#94a3b8]/60 tracking-wider block mb-1.5 uppercase select-none">
                    Standard Calculator
                  </span>
                  <div className="grid grid-cols-4 gap-[5px] font-mono">
                    {/* Row 1: C, ⌫, (, ) */}
                    <button
                      onClick={handleClear}
                      type="button"
                      className="calc-btn calc-btn-clear h-10 text-xs sm:text-sm"
                    >
                      C
                    </button>
                    <button
                      onClick={handleBackspace}
                      type="button"
                      className="calc-btn calc-btn-utility h-10 text-xs sm:text-sm flex items-center justify-center"
                    >
                      <Delete className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleParenthesis("(")} type="button" className={numberKeyClass}>(</button>
                    <button onClick={() => handleParenthesis(")")} type="button" className={numberKeyClass}>)</button>

                    {/* Row 2 */}
                    <button onClick={() => handleDigit("7")} type="button" className={numberKeyClass}>7</button>
                    <button onClick={() => handleDigit("8")} type="button" className={numberKeyClass}>8</button>
                    <button onClick={() => handleDigit("9")} type="button" className={numberKeyClass}>9</button>
                    <button onClick={() => handleOperator("÷")} type="button" className={operatorKeyClass}>÷</button>

                    {/* Row 3 */}
                    <button onClick={() => handleDigit("4")} type="button" className={numberKeyClass}>4</button>
                    <button onClick={() => handleDigit("5")} type="button" className={numberKeyClass}>5</button>
                    <button onClick={() => handleDigit("6")} type="button" className={numberKeyClass}>6</button>
                    <button onClick={() => handleOperator("×")} type="button" className={operatorKeyClass}>×</button>

                    {/* Row 4 */}
                    <button onClick={() => handleDigit("1")} type="button" className={numberKeyClass}>1</button>
                    <button onClick={() => handleDigit("2")} type="button" className={numberKeyClass}>2</button>
                    <button onClick={() => handleDigit("3")} type="button" className={numberKeyClass}>3</button>
                    <button onClick={() => handleOperator("-")} type="button" className={operatorKeyClass}>-</button>

                    {/* Row 5 */}
                    <button onClick={() => handleDigit("0")} type="button" className={numberKeyClass}>0</button>
                    <button onClick={() => handleDigit(".")} type="button" className={numberKeyClass}>.</button>
                    <button onClick={handlePercent} type="button" className={numberKeyClass}>%</button>
                    <button onClick={() => handleOperator("+")} type="button" className={operatorKeyClass}>+</button>

                    {/* Equal Button */}
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
          </div>
        </div>

        {/* RIGHT COLUMN: SESSION HISTORY SIDEBAR */}
        <div className="flex-1 min-w-0 sm:min-w-[350px]">
          <div className={`w-full h-full flex flex-col min-w-0 border rounded-[24px] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:shadow-sm select-text justify-between transition-colors duration-200 ${
            isDark
              ? "bg-card border-border text-card-foreground"
              : "bg-white border-[#e5e7eb] text-[#0f172a]"
          }`}>
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
                <div className="overflow-y-auto max-h-[22rem] pr-1 space-y-2.5 scrollbar-none flex-1 min-h-0">
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
                            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                              <span>{item.timestamp}</span>
                              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 uppercase text-[8px] tracking-wider font-extrabold">
                                {item.angleMode}
                              </span>
                            </span>
                            
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
                </div>
              </div>

              {/* Branded PDF Download Button */}
              <div className="mt-3 border-t border-border/35 pt-3 flex flex-col select-none shrink-0">
                <CalculatorPdfExport pdfData={pdfData} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </CalculatorPageLayout>
  );
}
