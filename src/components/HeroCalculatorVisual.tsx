import { useState, useId } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Coins, Heart, Percent, Calendar } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface HeroCalculatorVisualProps {
  layout?: "desktop" | "mobile";
}

export function HeroCalculatorVisual({ layout = "desktop" }: HeroCalculatorVisualProps = {}) {
  const componentId = useId();
  const { isDark } = useTheme();

  // State for realistic interactive calculator (starts with demo math 2,400 × 5.2 = 12,480)
  const [displayValue, setDisplayValue] = useState<string>("12,480");
  const [expression, setExpression] = useState<string>("2,400 × 5.2");
  const [mode, setMode] = useState<"STANDARD" | "CALC">("STANDARD");
  const [currentVal, setCurrentVal] = useState<string>("");
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [justCalculated, setJustCalculated] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Key press handler for interactive calculator
  const handleKeyClick = (key: string) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);

    // AC (All Clear): Instantly resets calculator display to 0 and clears memory
    if (key === "AC") {
      setDisplayValue("0");
      setExpression("");
      setCurrentVal("");
      setPrevVal(null);
      setPendingOp(null);
      setJustCalculated(false);
      setMode("STANDARD");
      return;
    }

    // Toggle positive / negative
    if (key === "±") {
      if (displayValue === "0" || displayValue === "Error") return;
      if (displayValue.startsWith("-")) {
        const next = displayValue.slice(1);
        setDisplayValue(next);
        if (currentVal) setCurrentVal(next);
      } else {
        const next = "-" + displayValue;
        setDisplayValue(next);
        if (currentVal) setCurrentVal(next);
      }
      return;
    }

    // Percentage
    if (key === "%") {
      const num = parseFloat(displayValue.replace(/,/g, ""));
      if (!isNaN(num)) {
        const result = num / 100;
        const formatted = Number.isInteger(result)
          ? result.toLocaleString()
          : parseFloat(result.toFixed(6)).toString();
        setDisplayValue(formatted);
        setExpression(`${num} % =`);
        setCurrentVal(formatted);
        setJustCalculated(true);
      }
      return;
    }

    // Operators: +, −, ×, ÷
    if (["÷", "×", "−", "+"].includes(key)) {
      setMode("CALC");
      const currentNum = parseFloat(displayValue.replace(/,/g, "")) || 0;

      // If user had a pending operation and already entered a new number, calculate intermediate result first
      if (prevVal !== null && pendingOp && currentVal !== "" && !justCalculated) {
        let res = 0;
        if (pendingOp === "+") res = prevVal + currentNum;
        if (pendingOp === "−") res = prevVal - currentNum;
        if (pendingOp === "×") res = prevVal * currentNum;
        if (pendingOp === "÷") res = currentNum !== 0 ? prevVal / currentNum : 0;

        const formatted = Number.isInteger(res)
          ? res.toLocaleString()
          : parseFloat(res.toFixed(4)).toString();

        setPrevVal(res);
        setDisplayValue(formatted);
        setPendingOp(key);
        setExpression(`${formatted} ${key}`);
        setCurrentVal("");
        setJustCalculated(false);
        return;
      }

      setPrevVal(currentNum);
      setPendingOp(key);
      setExpression(`${currentNum.toLocaleString()} ${key}`);
      setCurrentVal("");
      setJustCalculated(false);
      return;
    }

    // Equals: =
    if (key === "=") {
      if (prevVal !== null && pendingOp) {
        const curNum =
          currentVal !== ""
            ? parseFloat(currentVal)
            : parseFloat(displayValue.replace(/,/g, "")) || 0;
        let res = 0;
        if (pendingOp === "+") res = prevVal + curNum;
        if (pendingOp === "−") res = prevVal - curNum;
        if (pendingOp === "×") res = prevVal * curNum;
        if (pendingOp === "÷") {
          if (curNum === 0) {
            setDisplayValue("Error");
            setExpression("Cannot divide by 0");
            setPrevVal(null);
            setPendingOp(null);
            setCurrentVal("");
            setJustCalculated(true);
            return;
          }
          res = prevVal / curNum;
        }

        const formatted = Number.isInteger(res)
          ? res.toLocaleString()
          : parseFloat(res.toFixed(4)).toString();

        setDisplayValue(formatted);
        setExpression(`${prevVal.toLocaleString()} ${pendingOp} ${curNum.toLocaleString()} =`);
        setPrevVal(null);
        setPendingOp(null);
        setCurrentVal("");
        setJustCalculated(true);
      }
      return;
    }

    // Digit (0-9) or Decimal point (.)
    setMode("CALC");

    // If starting fresh right after calculation or when display is default
    if (justCalculated) {
      setJustCalculated(false);
      setExpression("");
      if (key === ".") {
        setCurrentVal("0.");
        setDisplayValue("0.");
      } else {
        setCurrentVal(key);
        setDisplayValue(key);
      }
      return;
    }

    // Decimal point handling
    if (key === ".") {
      if (!currentVal.includes(".")) {
        const next = currentVal ? currentVal + "." : "0.";
        setCurrentVal(next);
        setDisplayValue(next);
      }
      return;
    }

    // Leading zero handling
    if (currentVal === "0" && key === "0") {
      return;
    }

    const nextVal = currentVal === "0" ? key : currentVal + key;
    setCurrentVal(nextVal);

    // Format display for large numbers while typing, preserving trailing decimal if any
    if (nextVal.includes(".")) {
      const [intPart, decPart] = nextVal.split(".");
      const formattedInt = parseInt(intPart, 10).toLocaleString();
      setDisplayValue(`${formattedInt}.${decPart}`);
    } else {
      const num = parseInt(nextVal, 10);
      setDisplayValue(isNaN(num) ? nextVal : num.toLocaleString());
    }
  };

  const isMobileLayout = layout === "mobile";

  return (
    <div
      className={
        isMobileLayout
          ? "relative w-full max-w-[340px] xs:max-w-[350px] select-none mx-auto"
          : "relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] xl:max-w-[460px] select-none mx-auto lg:[perspective:1400px]"
      }
    >
      {/* Outer Floating Stage */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full"
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className={`absolute -inset-4 sm:-inset-8 rounded-[50px] blur-2xl opacity-90 -z-10 pointer-events-none transition-all duration-300 ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_center,rgba(79,131,255,0.22)_0%,rgba(34,184,216,0.12)_40%,transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,rgba(34,184,216,0.05)_40%,transparent_70%)]"
          }`}
        />

        {/* ─── DESKTOP ONLY: 4 Corner Floating Badges (Identical to Baseline Desktop Screenshot) ─── */}
        {!isMobileLayout && (
          <>
            {/* 1. Desktop Top-Left: Finance */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:block absolute -top-7 sm:-top-8 -left-4 sm:-left-8 lg:-left-10 z-30"
            >
              <Link
                to="/calculator/loan-emi-calculator"
                className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 border flex items-center gap-2 sm:gap-2.5 transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                title="Explore Finance Calculators"
              >
                <div className="cz-hero-badge-icon-finance h-7 w-7 sm:h-8 sm:w-8 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                  <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none mb-1">
                    <span className="cz-hero-badge-title-finance text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Finance
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-extrabold leading-none whitespace-nowrap">
                    EMI · ₹24,750/mo
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 2. Desktop Top-Right: Health */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="hidden lg:block absolute -top-7 sm:-top-8 -right-4 sm:-right-8 lg:-right-10 z-30"
            >
              <Link
                to="/calculator/bmi-calculator"
                className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 border flex items-center gap-2 sm:gap-2.5 transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                title="Explore Health Calculators"
              >
                <div className="cz-hero-badge-icon-health h-7 w-7 sm:h-8 sm:w-8 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                  <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none mb-1">
                    <span className="cz-hero-badge-title-health text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Health
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-extrabold leading-none whitespace-nowrap">
                    BMI · 21.4 Ideal
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 3. Desktop Bottom-Left: Everyday */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [3, -5, 3] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              className="hidden lg:block absolute -bottom-6 sm:-bottom-7 -left-4 sm:-left-8 lg:-left-10 z-30"
            >
              <Link
                to="/calculator/age-calculator"
                className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 border flex items-center gap-2 sm:gap-2.5 transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                title="Explore Everyday Calculators"
              >
                <div className="cz-hero-badge-icon-everyday h-6 w-6 sm:h-7 sm:w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none mb-0.5">
                    <span className="cz-hero-badge-title-everyday text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Everyday
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-extrabold leading-none whitespace-nowrap">
                    Age · 24 Years
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 4. Desktop Bottom-Right: Maths */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-3, 5, -3] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="hidden lg:block absolute -bottom-6 sm:-bottom-7 -right-4 sm:-right-8 lg:-right-10 z-30"
            >
              <Link
                to="/calculator/percentage-calculator"
                className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 border flex items-center gap-2 sm:gap-2.5 transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                title="Explore Math Calculators"
              >
                <div className="cz-hero-badge-icon-maths h-6 w-6 sm:h-7 sm:w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors font-bold text-xs">
                  <Percent className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none mb-0.5">
                    <span className="cz-hero-badge-title-maths text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      Maths
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] sm:text-xs font-extrabold leading-none whitespace-nowrap">
                    Percentage · 18% GST
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop-Only Subtle Mathematical Floating Elements */}
            <motion.div
              animate={{ y: [-4, 6, -4], rotate: [-2, 4, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:block absolute -top-8 left-1/3 text-[#2563EB]/25 dark:text-blue-400/25 font-mono font-bold text-xl select-none pointer-events-none"
            >
              +
            </motion.div>
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [3, -3, 3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="hidden lg:block absolute top-1/4 -left-6 text-[#8878E8]/25 dark:text-violet-400/25 font-mono font-bold text-lg select-none pointer-events-none"
            >
              −
            </motion.div>
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-4, 2, -4] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="hidden lg:block absolute top-1/2 -right-6 text-[#22B8D8]/30 dark:text-cyan-400/25 font-mono font-bold text-xl select-none pointer-events-none"
            >
              ÷
            </motion.div>
            <motion.div
              animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
              className="hidden lg:block absolute -bottom-10 right-1/4 text-[#2563EB]/25 dark:text-blue-400/25 font-mono font-bold text-lg select-none pointer-events-none"
            >
              =
            </motion.div>
          </>
        )}

        {/* ─── Physical Calculator Device Presentation ─── */}
        <motion.div
          animate={isMobileLayout ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={
            isMobileLayout
              ? "relative"
              : "relative transform-gpu transition-transform duration-700 ease-out lg:[transform:rotateY(-6deg)_rotateX(5deg)_rotateZ(1deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)_rotateZ(0deg)]"
          }
        >
          {/* Diffuse Ground Shadow */}
          <div className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2 w-[85%] h-8 sm:h-9 bg-[#111A30]/10 dark:bg-black/60 blur-xl rounded-full -z-10 pointer-events-none transition-colors duration-300" />

          {/* Calculator Casing Body: Pure tactile white surface in Light Mode, deep navy in Dark Mode */}
          <div className="cz-hero-calc-body relative rounded-[28px] xs:rounded-[32px] sm:rounded-[36px] p-3.5 xs:p-4.5 sm:p-6 sm:pb-7 border transition-all duration-200">
            {/* Top Bar: Brand Typography & Solar Sensor */}
            <div className="flex items-center justify-between mb-3.5 sm:mb-4 px-1">
              <div className="flex items-center gap-1.5">
                <span className="cz-hero-text font-[Outfit] text-[10px] xs:text-[11px] font-bold tracking-[0.16em] uppercase transition-colors duration-200">
                  CalcZen
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              </div>

              {/* Realistic Solar Photovoltaic Strip */}
              <div
                className={`flex items-center h-4.5 px-1.5 rounded-sm border shadow-inner gap-1 transition-colors ${
                  isDark
                    ? "bg-gradient-to-b from-[#221c17] via-[#141210] to-[#241e18] border-black/50"
                    : "bg-gradient-to-b from-[#2E2721] via-[#1C1714] to-[#2B241E] border-slate-300/80"
                }`}
                title="CalcZen Solar Sensor"
              >
                <div className="w-2.5 h-3 bg-amber-950/80 rounded-[1px] border-r border-amber-500/20" />
                <div className="w-2.5 h-3 bg-amber-950/80 rounded-[1px] border-r border-amber-500/20" />
                <div className="w-2.5 h-3 bg-amber-950/80 rounded-[1px] border-r border-amber-500/20" />
                <div className="w-2.5 h-3 bg-amber-950/80 rounded-[1px]" />
              </div>
            </div>

            {/* Calculator Display Surface: Crisp #111827 LCD in Light Mode, Sleek #050B18 OLED in Dark Mode */}
            <div className="cz-hero-calc-display relative rounded-2xl p-3.5 xs:p-4 sm:p-5 border mb-3.5 sm:mb-5 overflow-hidden transition-all duration-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
              {/* Subtle Glass Surface Glare */}
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-white/15" />

              {/* Metadata Subheader */}
              <div className="flex items-center justify-between text-[10px] xs:text-[11px] mb-1.5 font-mono">
                <span className="px-1.5 py-0.5 rounded font-bold tracking-wider text-[9px] xs:text-[10px] uppercase transition-colors bg-[#2563EB]/20 text-[#60A5FA]">
                  {mode === "STANDARD" ? "CALCZEN · PRODUCT" : "LIVE MATH"}
                </span>
                <span className="truncate max-w-[150px] xs:max-w-[170px] text-right font-medium transition-colors text-slate-300 min-h-[1.25rem] inline-block">
                  {expression || "\u00A0"}
                </span>
              </div>

              {/* Main Calculation Result: High-contrast crisp white digits */}
              <div className="text-right py-0.5 sm:py-1">
                <span className="font-[Outfit] font-extrabold text-2xl xs:text-3xl sm:text-4xl tracking-tight tabular-nums block text-white">
                  {displayValue}
                </span>
              </div>

              {/* Display Status Micro-Bar */}
              <div className="flex items-center justify-between pt-1.5 border-t border-white/10 mt-1 text-[8px] xs:text-[9px] font-mono uppercase tracking-widest text-slate-400">
                <span>RAD</span>
                <span>PRECISION 64-BIT</span>
                <span>INSTANT</span>
              </div>
            </div>

            {/* Tactile Calculator Keypad: Fully exposed with zero overlapping badges */}
            <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-2.5">
              {/* Row 1 */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleKeyClick("AC");
                }}
                className={`cz-hero-calc-ac h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border select-none ${
                  activeKey === "AC" ? "translate-y-0.5 scale-95" : ""
                }`}
                aria-label="All Clear"
              >
                AC
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick("±")}
                className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "±" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick("%")}
                className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "%" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick("÷")}
                className={`cz-hero-calc-op h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "÷" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                ÷
              </button>

              {/* Row 2 */}
              {["7", "8", "9"].map((num) => (
                <button
                  key={`${componentId}-key-${num}`}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                    activeKey === num ? "translate-y-0.5 scale-95" : ""
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeyClick("×")}
                className={`cz-hero-calc-op h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "×" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                ×
              </button>

              {/* Row 3 */}
              {["4", "5", "6"].map((num) => (
                <button
                  key={`${componentId}-key-${num}`}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                    activeKey === num ? "translate-y-0.5 scale-95" : ""
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeyClick("−")}
                className={`cz-hero-calc-op h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "−" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                −
              </button>

              {/* Row 4 */}
              {["1", "2", "3"].map((num) => (
                <button
                  key={`${componentId}-key-${num}`}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                    activeKey === num ? "translate-y-0.5 scale-95" : ""
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeyClick("+")}
                className={`cz-hero-calc-op h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "+" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                +
              </button>

              {/* Row 5 */}
              <button
                type="button"
                onClick={() => handleKeyClick("0")}
                className={`cz-hero-calc-key col-span-2 h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-start pl-4 xs:pl-5 cursor-pointer shadow-xs border ${
                  activeKey === "0" ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick(".")}
                className={`cz-hero-calc-key h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer shadow-xs border ${
                  activeKey === "." ? "translate-y-0.5 scale-95" : ""
                }`}
              >
                .
              </button>

              {/* Equals Key: Primary Brand Blue */}
              <button
                type="button"
                onClick={() => handleKeyClick("=")}
                className={`cz-hero-calc-equals h-10 xs:h-11 sm:h-12 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all duration-150 active:translate-y-0.5 flex items-center justify-center cursor-pointer ${
                  activeKey === "=" ? "scale-95" : ""
                }`}
              >
                =
              </button>
            </div>
          </div>
        </motion.div>

        {/* ─── MOBILE ONLY: All 4 Category Cards in a Clean 2-Column Grid Below Calculator ─── */}
        {isMobileLayout && (
          <div className="grid grid-cols-2 gap-2 xs:gap-2.5 w-full mt-4 sm:mt-5">
            {/* 1. Mobile Finance Badge */}
            <Link
              to="/calculator/loan-emi-calculator"
              className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-2.5 py-2.5 border flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer min-w-0"
              title="Explore Finance Calculators"
            >
              <div className="cz-hero-badge-icon-finance h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                <Coins className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 leading-none mb-1">
                  <span className="cz-hero-badge-title-finance text-[9px] font-black uppercase tracking-wider">
                    Finance
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] font-extrabold leading-none truncate">
                  EMI · ₹24,750/mo
                </div>
              </div>
            </Link>

            {/* 2. Mobile Health Badge */}
            <Link
              to="/calculator/bmi-calculator"
              className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-2.5 py-2.5 border flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer min-w-0"
              title="Explore Health Calculators"
            >
              <div className="cz-hero-badge-icon-health h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                <Heart className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 leading-none mb-1">
                  <span className="cz-hero-badge-title-health text-[9px] font-black uppercase tracking-wider">
                    Health
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] font-extrabold leading-none truncate">
                  BMI · 21.4 Ideal
                </div>
              </div>
            </Link>

            {/* 3. Mobile Everyday Badge */}
            <Link
              to="/calculator/age-calculator"
              className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-2.5 py-2.5 border flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer min-w-0"
              title="Explore Everyday Calculators"
            >
              <div className="cz-hero-badge-icon-everyday h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 leading-none mb-1">
                  <span className="cz-hero-badge-title-everyday text-[9px] font-black uppercase tracking-wider">
                    Everyday
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] font-extrabold leading-none truncate">
                  Age · 24 Years
                </div>
              </div>
            </Link>

            {/* 4. Mobile Maths Badge */}
            <Link
              to="/calculator/percentage-calculator"
              className="cz-hero-badge group backdrop-blur-xl rounded-2xl px-2.5 py-2.5 border flex items-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer min-w-0"
              title="Explore Math Calculators"
            >
              <div className="cz-hero-badge-icon-maths h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-colors">
                <Percent className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 leading-none mb-1">
                  <span className="cz-hero-badge-title-maths text-[9px] font-black uppercase tracking-wider">
                    Maths
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="cz-hero-badge-subtext text-slate-900 dark:text-slate-100 text-[11px] font-extrabold leading-none truncate">
                  Percentage · 18% GST
                </div>
              </div>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
