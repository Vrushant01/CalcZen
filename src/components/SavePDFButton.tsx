import { useState } from "react";
import { Check, FileDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type PdfData = Record<string, unknown>;

type Props = {
  pdfData: PdfData;
  disabled?: boolean;
};

export default function SavePDFButton({ pdfData, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (disabled || loading) return;
    setLoading(true);
    try {
      const { generateCalculatorPDF } = await import("@/utils/generatePDF");
      await generateCalculatorPDF(pdfData);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
        "border-emerald-700/80 bg-background text-emerald-800 hover:bg-emerald-50",
        "dark:border-emerald-500/70 dark:bg-emerald-950/80 dark:text-emerald-50 dark:hover:bg-emerald-900/80",
        done &&
          "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-600",
        (disabled || loading) && "cursor-not-allowed opacity-50",
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Generating PDF…
        </>
      ) : done ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Downloaded!
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" aria-hidden />
          Save as PDF
        </>
      )}
    </button>
  );
}
