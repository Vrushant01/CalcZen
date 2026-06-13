import { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type PdfData = Record<string, unknown>;

type Props = {
  pdfData: PdfData;
  disabled?: boolean;
};

type ExportState = "idle" | "exporting" | "success";

export default function SavePDFButton({ pdfData, disabled }: Props) {
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitor system-wide reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  async function handleClick() {
    if (disabled || exportState !== "idle") return;

    setExportState("exporting");
    setProgress(0);

    // Natural progressive loading simulation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 12 + 4; // increment naturally
      if (currentProgress >= 92) {
        currentProgress = 92;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 90);

    try {
      const { generateCalculatorPDF } = await import("@/utils/generatePDF");
      await generateCalculatorPDF(pdfData);

      // Fast-forward progress to 100% on success
      clearInterval(progressInterval);
      setProgress(100);

      // Wait a brief moment to let progress finish smoothly before drawing checkmark
      setTimeout(() => {
        setExportState("success");
        // Reset back to idle after 2.2 seconds
        setTimeout(() => {
          setExportState("idle");
          setProgress(0);
        }, 2200);
      }, 180);
    } catch (err) {
      clearInterval(progressInterval);
      setExportState("idle");
      setProgress(0);
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  }

  // Define status messages for screen readers
  const getAriaLabel = () => {
    if (exportState === "exporting") return "Saving results as PDF, please wait";
    if (exportState === "success") return "PDF saved successfully";
    return "Save results as PDF";
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || exportState === "exporting"}
      aria-live="polite"
      aria-busy={exportState === "exporting"}
      aria-label={getAriaLabel()}
      // Smooth width layout updates driven by text change
      layout
      transition={
        prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }
      }
      whileHover={
        !disabled && exportState === "idle" && !prefersReducedMotion ? { scale: 1.01, y: -2 } : {}
      }
      whileTap={!disabled && exportState === "idle" && !prefersReducedMotion ? { scale: 0.97 } : {}}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-lg border px-5 py-2.5 text-sm font-semibold select-none cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",

        // IDLE STATE COLORS
        exportState === "idle" && "pdf-btn-idle",

        // EXPORTING STATE COLORS
        exportState === "exporting" && [
          "border-slate-200 bg-slate-50/70 text-slate-500 cursor-wait",
          "dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400",
        ],

        // SUCCESS STATE COLORS (with soft success glow pulse)
        exportState === "success" && [
          "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]",
          "dark:border-emerald-600 dark:bg-emerald-600 dark:text-white dark:shadow-[0_0_20px_rgba(16,185,129,0.45)]",
        ],

        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {/* Icon Wrapper (transitions between Down, Progress ring, and Checkmark) */}
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden shrink-0">
        <AnimatePresence mode="wait">
          {exportState === "idle" && (
            <motion.div
              key="idle"
              initial={prefersReducedMotion ? {} : { y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { y: 12, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <FileDown className="h-4.5 w-4.5" />
            </motion.div>
          )}

          {exportState === "exporting" && (
            <motion.div
              key="exporting"
              initial={prefersReducedMotion ? {} : { scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { scale: 0.75, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {/* Circular Progress Ring */}
              <svg className="w-5 h-5" viewBox="0 0 20 20">
                {/* Track circle */}
                <circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  fill="transparent"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="2"
                />
                {/* Active progress fill */}
                <motion.circle
                  cx="10"
                  cy="10"
                  r="7.5"
                  fill="transparent"
                  className="stroke-blue-500 dark:stroke-cyan-400"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={47.12} // 2 * Math.PI * 7.5
                  animate={{ strokeDashoffset: 47.12 - (progress / 100) * 47.12 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.1, ease: "linear" }
                  }
                  style={{ rotate: -90, transformOrigin: "50% 50%" }}
                />
              </svg>
            </motion.div>
          )}

          {exportState === "success" && (
            <motion.div
              key="success"
              initial={prefersReducedMotion ? {} : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 14 }
              }
              className="flex items-center justify-center"
            >
              {/* Self-drawing SVG checkmark */}
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <motion.path
                  d="M4.5 10l3.5 3.5L15.5 6.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.35, delay: 0.05 }
                  }
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button Text Transition */}
      <div className="relative overflow-hidden flex items-center justify-center font-semibold leading-none">
        <AnimatePresence mode="wait">
          {exportState === "idle" && (
            <motion.span
              key="idle"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              transition={{ duration: 0.16 }}
            >
              Save as PDF
            </motion.span>
          )}

          {exportState === "exporting" && (
            <motion.span
              key="exporting"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
              transition={{ duration: 0.16 }}
            >
              Saving PDF...
            </motion.span>
          )}

          {exportState === "success" && (
            <motion.span
              key="success"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
            >
              PDF Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
