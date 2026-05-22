import SavePDFButton, { type PdfData } from "@/components/SavePDFButton";

type Props = {
  hasResult: boolean;
  pdfData: PdfData | null;
};

export function CalculatorPdfExport({ hasResult, pdfData }: Props) {
  if (!hasResult || !pdfData) return null;

  return (
    <div className="calc-pdf-export">
      <SavePDFButton pdfData={pdfData} disabled={!hasResult} />
      <p className="calc-pdf-export-text">
        Save your result as a clean PDF — share with your bank, accountant, or family
      </p>
    </div>
  );
}
