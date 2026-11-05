import SavePDFButton, { type PdfData } from "@/components/SavePDFButton";

type Props = {
  pdfData: PdfData | null;
};

export function CalculatorPdfExport({ pdfData }: Props) {
  const isButtonDisabled = !pdfData;
  const fallbackPdfData: PdfData = pdfData || {
    calculatorName: "Standard Calculator",
<<<<<<< HEAD
    calculatorSlug: "regular-calculator",
=======
    calculatorSlug: "standard-calculator",
>>>>>>> 529569b (Deploy CalcZen V2)
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
