import SavePDFButton, { type PdfData } from "@/components/SavePDFButton";

type Props = {
  pdfData?: PdfData | null;
  fileName?: string;
  filename?: string;
  buttonLabel?: string;
  calculatorName?: string;
  calculatorTitle?: string;
  calculatorCategory?: string;
  category?: string;
  title?: string;
  tables?: any[];
  sections?: any[];
  inputs?: any[];
  results?: any[];
  accentColor?: string;
  hasResult?: boolean;
};

export function CalculatorPdfExport({
  pdfData,
  fileName,
  filename,
  buttonLabel,
  calculatorName,
  title,
}: Props) {
  const isButtonDisabled = !pdfData && !fileName && !filename && !title;
  const fallbackPdfData: PdfData = pdfData || {
    calculatorName: calculatorName || title || "Standard Calculator",
    calculatorSlug: fileName || filename || "standard-calculator",
    siteName: "CalcZen",
    siteUrl: "https://www.calczen.in",
    inputs: [],
    results: [],
  };

  return (
    <div className="calc-pdf-export">
      <SavePDFButton pdfData={fallbackPdfData} disabled={isButtonDisabled} />
      <p className="calc-pdf-export-text">
        {isButtonDisabled
          ? "(No calculations available)"
          : "Save your calculations as a clean PDF report"}
      </p>
    </div>
  );
}
