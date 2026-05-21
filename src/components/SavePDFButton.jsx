import { useState } from "react";
import { generateCalculatorPDF } from "@/utils/generatePDF";

export default function SavePDFButton({ pdfData, disabled }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (disabled || loading) return;
    setLoading(true);
    try {
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: done ? "#1D9E75" : loading ? "#f0f0f0" : "#ffffff",
        color: done ? "#ffffff" : "#0F6E56",
        border: `1.5px solid ${done ? "#1D9E75" : "#0F6E56"}`,
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid #0F6E56",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Generating PDF...
        </>
      ) : done ? (
        <> Downloaded!</>
      ) : (
        <> Save as PDF</>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
