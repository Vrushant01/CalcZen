import SavePDFButton from "@/components/SavePDFButton";

type PdfData = Record<string, unknown>;

type Props = {
  hasResult: boolean;
  pdfData: PdfData | null;
};

export function CalculatorPdfExport({ hasResult, pdfData }: Props) {
  if (!hasResult || !pdfData) return null;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 p-4 rounded-[10px] bg-[#f0faf6] border border-[#9FE1CB]"
    >
      <SavePDFButton pdfData={pdfData} disabled={!hasResult} />
      <p className="m-0 text-xs text-[#0F6E56] leading-relaxed">
        Save your result as a clean PDF — share with your bank, accountant, or family
      </p>
    </div>
  );
}
