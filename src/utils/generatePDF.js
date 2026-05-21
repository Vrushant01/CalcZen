// This file is the single source of truth for all PDF generation
// Every calculator calls this with its own data — nothing else changes

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generateCalculatorPDF({
  calculatorName,
  calculatorSlug,
  siteName,
  siteUrl,
  inputs,
  results,
  summary,
  tableData,
  chartElementId,
  disclaimer,
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const teal = [15, 158, 117];
  const navy = [26, 26, 46];
  const lightGray = [245, 245, 248];
  const midGray = [120, 120, 140];
  const white = [255, 255, 255];
  const highlightBg = [225, 245, 238];

  function setFont(weight, size, color) {
    doc.setFont("helvetica", weight === "bold" ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(color || navy));
  }

  function drawLine(yPos, color) {
    doc.setDrawColor(...(color || [220, 220, 230]));
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  }

  function addNewPageIfNeeded(spaceNeeded) {
    if (y + spaceNeeded > pageHeight - 25) {
      addFooter();
      doc.addPage();
      y = 20;
      addPageHeader();
    }
  }

  function addPageHeader() {
    setFont("bold", 9, teal);
    doc.text(`${siteName} — ${calculatorName}`, margin, y);
    setFont("normal", 8, midGray);
    doc.text(`${siteUrl}`, pageWidth - margin, y, { align: "right" });
    y += 6;
    drawLine(y, [200, 200, 210]);
    y += 6;
  }

  function addFooter() {
    const footerY = pageHeight - 14;
    drawLine(footerY - 3, [220, 220, 230]);
    setFont("normal", 7, midGray);
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on ${date} · ${siteUrl} · Free online calculators`, margin, footerY);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - margin, footerY, {
      align: "right",
    });
  }

  doc.setFillColor(...teal);
  doc.rect(0, 0, pageWidth, 42, "F");

  setFont("bold", 22, white);
  doc.text(siteName, margin, 16);

  setFont("normal", 9, [180, 230, 215]);
  doc.text(`Free Online Calculators · ${siteUrl}`, margin, 23);

  doc.setFillColor(10, 100, 80);
  doc.roundedRect(margin, 28, contentWidth, 10, 2, 2, "F");
  setFont("bold", 11, white);
  doc.text(calculatorName.toUpperCase(), margin + 4, 34.5);

  setFont("normal", 8, [180, 230, 215]);
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, 34.5, { align: "right" });

  y = 52;

  setFont("bold", 10, teal);
  doc.text("YOUR INPUTS", margin, y);
  y += 5;
  drawLine(y);
  y += 5;

  const colW = (contentWidth - 6) / 2;
  inputs.forEach((inp, i) => {
    const col = i % 2;
    const xPos = margin + col * (colW + 6);
    const rowY = y + Math.floor(i / 2) * 10;

    doc.setFillColor(...lightGray);
    doc.roundedRect(xPos, rowY - 4, colW, 9, 1.5, 1.5, "F");

    setFont("normal", 7.5, midGray);
    doc.text(inp.label, xPos + 3, rowY);
    setFont("bold", 9, navy);
    doc.text(String(inp.value), xPos + colW - 3, rowY, { align: "right" });
  });

  y += Math.ceil(inputs.length / 2) * 10 + 8;

  addNewPageIfNeeded(40);

  setFont("bold", 10, teal);
  doc.text("YOUR RESULTS", margin, y);
  y += 5;
  drawLine(y);
  y += 5;

  results.forEach((res) => {
    addNewPageIfNeeded(14);
    if (res.highlight) {
      doc.setFillColor(...highlightBg);
      doc.roundedRect(margin, y - 5, contentWidth, 13, 2, 2, "F");
      doc.setDrawColor(...teal);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y - 5, contentWidth, 13, 2, 2, "S");
      setFont("normal", 8.5, [15, 80, 60]);
      doc.text(res.label, margin + 4, y + 2);
      setFont("bold", 14, teal);
      doc.text(String(res.value), pageWidth - margin - 4, y + 2, { align: "right" });
      y += 16;
    } else {
      doc.setFillColor(...lightGray);
      doc.roundedRect(margin, y - 4, contentWidth, 10, 1.5, 1.5, "F");
      setFont("normal", 8, midGray);
      doc.text(res.label, margin + 3, y + 1.5);
      setFont("bold", 9, navy);
      doc.text(String(res.value), pageWidth - margin - 3, y + 1.5, { align: "right" });
      y += 12;
    }
  });

  y += 4;

  if (summary) {
    addNewPageIfNeeded(30);

    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, contentWidth, 28, 2, 2, "F");
    doc.setDrawColor(186, 117, 23);
    doc.setLineWidth(0.4);
    doc.line(margin + 1, y, margin + 1, y + 28);

    setFont("bold", 8.5, [133, 79, 11]);
    doc.text("WHAT THIS MEANS FOR YOU", margin + 5, y + 7);

    setFont("normal", 8.5, [80, 60, 20]);
    const summaryLines = doc.splitTextToSize(summary, contentWidth - 10);
    doc.text(summaryLines, margin + 5, y + 14);

    y += 34;
  }

  if (chartElementId) {
    const chartEl = document.getElementById(chartElementId);
    if (chartEl) {
      addNewPageIfNeeded(80);
      setFont("bold", 10, teal);
      doc.text("CHART", margin, y);
      y += 5;
      drawLine(y);
      y += 5;

      const canvas = await html2canvas(chartEl, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const maxImgHeight = 80;
      const finalHeight = Math.min(imgHeight, maxImgHeight);
      doc.addImage(imgData, "PNG", margin, y, contentWidth, finalHeight);
      y += finalHeight + 8;
    }
  }

  if (tableData && tableData.rows.length > 0) {
    addNewPageIfNeeded(30);
    setFont("bold", 10, teal);
    doc.text(tableData.title || "DETAILED BREAKDOWN", margin, y);
    y += 5;
    drawLine(y);
    y += 5;

    const colCount = tableData.headers.length;
    const colWidths = tableData.headers.map(() => contentWidth / colCount);

    doc.setFillColor(...navy);
    doc.rect(margin, y - 3, contentWidth, 8, "F");
    setFont("bold", 7.5, white);
    tableData.headers.forEach((h, i) => {
      const xPos = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(h, xPos + 2, y + 1.5);
    });
    y += 9;

    const maxRows = 20;
    const rowsToShow = tableData.rows.slice(0, maxRows);
    rowsToShow.forEach((row, rowIdx) => {
      addNewPageIfNeeded(9);
      if (rowIdx % 2 === 0) {
        doc.setFillColor(...lightGray);
        doc.rect(margin, y - 3, contentWidth, 8, "F");
      }
      setFont("normal", 7.5, navy);
      row.forEach((cell, i) => {
        const xPos = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(String(cell), xPos + 2, y + 1.5);
      });
      y += 8;
    });

    if (tableData.rows.length > maxRows) {
      setFont("normal", 7.5, midGray);
      doc.text(
        `... and ${tableData.rows.length - maxRows} more rows. Visit ${siteUrl} to see the full table.`,
        margin,
        y + 4,
      );
      y += 10;
    }

    y += 6;
  }

  addNewPageIfNeeded(24);
  doc.setFillColor(248, 248, 252);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");
  setFont("bold", 7, midGray);
  doc.text("DISCLAIMER", margin + 4, y + 6);
  setFont("normal", 6.5, midGray);
  const disc =
    disclaimer ||
    `This calculation is provided for informational and educational purposes only. It is not financial, legal, or tax advice. ` +
      `Results are estimates based on the inputs provided and may not reflect actual rates, fees, or real-world outcomes. ` +
      `Always consult a qualified financial advisor, accountant, or legal professional before making financial decisions. ` +
      `${siteName} (${siteUrl}) is not responsible for decisions made based on these calculations.`;
  const discLines = doc.splitTextToSize(disc, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 11);
  y += 26;

  addNewPageIfNeeded(18);
  doc.setFillColor(...teal);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  setFont("bold", 9, white);
  doc.text(`More free calculators at ${siteUrl}`, pageWidth / 2, y + 6, { align: "center" });
  setFont("normal", 7.5, [180, 230, 215]);
  doc.text(
    "Mortgage · Tax · BMI · Compound Interest · Tip Calculator · Unit Converter · and more",
    pageWidth / 2,
    y + 11,
    { align: "center" },
  );

  addFooter();

  const fileName = `${calculatorSlug}-result-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
