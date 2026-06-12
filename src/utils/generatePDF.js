// Upgraded global PDF generation engine with automatic DOM scraping
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export async function generateCalculatorPDF(pdfData = {}) {
  if (typeof window === "undefined") {
    throw new Error("PDF generation is only available in the browser.");
  }

  // 1. Establish basic variables
  const siteName = pdfData.siteName || "CalcZen";
  const siteUrl = pdfData.siteUrl || "www.calczen.in";
  
  // Try to find the calculator name from the DOM first, fallback to pdfData, then default
  const docTitle = document.querySelector("h1")?.innerText.trim();
  const calculatorName = pdfData.calculatorName || docTitle || "Calculator";
  const calculatorSlug = pdfData.calculatorSlug || "calculator";

  const container = document.querySelector(".calc-container-inner") || document;

  // 2. SCRAPE INPUTS FROM DOM
  const scrapedInputs = [];
  container.querySelectorAll("input, select").forEach((el) => {
    // Skip hidden or button-like inputs
    if (el.type === "hidden" || el.type === "submit" || el.type === "button") return;
    if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;

    let labelText = "";
    if (el.id) {
      const labelEl = document.querySelector(`label[for="${el.id}"]`);
      if (labelEl) labelText = labelEl.innerText.trim();
    }
    if (!labelText) {
      const parent = el.closest("div");
      if (parent) {
        const label = parent.querySelector("label");
        if (label) labelText = label.innerText.trim();
      }
    }
    if (!labelText) {
      let prev = el.previousElementSibling;
      while (prev) {
        if (prev.tagName.toLowerCase() === "label" || prev.classList.contains("Label")) {
          labelText = prev.innerText.trim();
          break;
        }
        prev = prev.previousElementSibling;
      }
    }
    if (!labelText) {
      labelText = el.name || el.placeholder || "Value";
    }

    labelText = labelText.replace(/:$/, "").trim();

    let suffix = "";
    const parent = el.parentElement;
    if (parent) {
      const suffixEl = parent.querySelector("span:not([aria-hidden])");
      if (suffixEl && suffixEl !== el) {
        suffix = " " + suffixEl.innerText.trim();
      }
    }

    let val = el.value;
    if (el.tagName.toLowerCase() === "select") {
      val = el.options[el.selectedIndex]?.text || el.value;
    }

    if (labelText && val !== undefined && val !== "") {
      scrapedInputs.push({ label: labelText, value: `${val}${suffix}`.trim() });
    }
  });

  // Scrape button toggles
  container.querySelectorAll(".inline-flex.rounded-lg.bg-muted, .flex.rounded-lg.bg-muted").forEach((group) => {
    const activeButton = group.querySelector(".bg-background, .bg-card, [class*='active']");
    if (activeButton) {
      let labelText = "";
      const parent = group.parentElement;
      if (parent) {
        const label = parent.querySelector("label");
        if (label) labelText = label.innerText.trim();
      }
      if (!labelText) labelText = "Option";
      scrapedInputs.push({
        label: labelText.replace(/:$/, "").trim(),
        value: activeButton.innerText.trim()
      });
    }
  });

  // Merge scraped inputs with pdfData.inputs
  const finalInputs = [...(pdfData.inputs || [])];
  scrapedInputs.forEach((sInp) => {
    const exists = finalInputs.some(
      (fInp) => fInp.label.toLowerCase() === sInp.label.toLowerCase()
    );
    if (!exists) {
      finalInputs.push(sInp);
    }
  });

  // 3. SCRAPE RESULTS FROM DOM
  const scrapedResults = [];
  
  // Hero Metrics
  container.querySelectorAll(".dashboard-hero-metric").forEach((hero) => {
    const labelEl = hero.querySelector(".dashboard-hero-label");
    const valueEl = hero.querySelector(".dashboard-hero-value");
    const subEl = hero.querySelector(".dashboard-hero-sub");
    const badgeEl = hero.querySelector(".dashboard-hero-badge");
    
    if (labelEl && valueEl) {
      const badgeText = badgeEl ? ` (${badgeEl.innerText.trim()})` : "";
      scrapedResults.push({
        label: labelEl.innerText.trim(),
        value: valueEl.innerText.trim() + badgeText,
        sub: subEl ? subEl.innerText.trim() : "",
        highlight: true
      });
    }
  });

  // Stat Cards
  container.querySelectorAll(".dashboard-stat-card").forEach((card) => {
    const labelEl = card.querySelector(".dashboard-stat-label");
    const valueEl = card.querySelector(".dashboard-stat-value");
    const subEl = card.querySelector(".dashboard-stat-sub, .text-muted-foreground, [class*='text-xs']");
    const badgeEl = card.querySelector(".dashboard-stat-badge");
    
    if (labelEl && valueEl) {
      const badgeText = badgeEl ? ` (${badgeEl.innerText.trim()})` : "";
      scrapedResults.push({
        label: labelEl.innerText.trim(),
        value: valueEl.innerText.trim() + badgeText,
        sub: subEl ? subEl.innerText.trim() : "",
        highlight: false
      });
    }
  });

  // Merge scraped results with pdfData.results
  const finalResults = [...(pdfData.results || [])];
  scrapedResults.forEach((sRes) => {
    const exists = finalResults.some(
      (fRes) => fRes.label.toLowerCase() === sRes.label.toLowerCase()
    );
    if (!exists) {
      finalResults.push(sRes);
    } else {
      const match = finalResults.find((fRes) => fRes.label.toLowerCase() === sRes.label.toLowerCase());
      if (match) {
        if (!match.sub && sRes.sub) match.sub = sRes.sub;
        if (sRes.highlight) match.highlight = true;
      }
    }
  });

  // 4. SCRAPE INSIGHTS
  const scrapedInsights = [];
  container.querySelectorAll(".dashboard-insight-card").forEach((card) => {
    const textEl = card.querySelector(".dashboard-insight-text");
    if (textEl) {
      scrapedInsights.push({
        text: textEl.innerText.trim(),
        tone: card.getAttribute("data-tone") || "info"
      });
    }
  });

  // 5. SCRAPE RECOMMENDATIONS
  const scrapedRecs = [];
  container.querySelectorAll(".dashboard-recommendation-item").forEach((item) => {
    const titleEl = item.querySelector(".dashboard-recommendation-title");
    const descEl = item.querySelector(".dashboard-recommendation-description");
    if (titleEl && descEl) {
      scrapedRecs.push({
        title: titleEl.innerText.trim(),
        description: descEl.innerText.trim()
      });
    }
  });

  // 6. SCRAPE CHARTS
  const chartElements = [];
  if (pdfData.chartElementId) {
    const el = document.getElementById(pdfData.chartElementId);
    if (el) chartElements.push({ id: pdfData.chartElementId, el });
  }
  container.querySelectorAll(".recharts-responsive-container, .recharts-wrapper").forEach((el) => {
    if (!chartElements.some((c) => c.el === el || c.el.contains(el))) {
      chartElements.push({ id: null, el });
    }
  });

  const capturedCharts = [];
  for (let i = 0; i < chartElements.length; i++) {
    const { el } = chartElements[i];
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        onclone: (_doc, clonedEl) => {
          clonedEl.style.background = "#ffffff";
          clonedEl.style.color = "#1a1a2e";
          clonedEl.style.padding = "10px";
        },
      });
      const imgData = canvas.toDataURL("image/png");
      capturedCharts.push({ imgData, width: canvas.width, height: canvas.height });
    } catch (err) {
      console.warn("Chart capture failed:", err);
    }
  }

  // 7. SCRAPE TABLES
  const finalTables = [];
  if (pdfData.tableData && pdfData.tableData.rows && pdfData.tableData.rows.length > 0) {
    finalTables.push(pdfData.tableData);
  }

  container.querySelectorAll("table").forEach((tableEl) => {
    const headers = [];
    tableEl.querySelectorAll("thead th").forEach((th) => {
      headers.push(th.innerText.trim());
    });

    const rows = [];
    tableEl.querySelectorAll("tbody tr").forEach((tr) => {
      const row = [];
      tr.querySelectorAll("td").forEach((td) => {
        row.push(td.innerText.trim());
      });
      if (row.length > 0) {
        rows.push(row);
      }
    });

    if (headers.length > 0 && rows.length > 0) {
      // Check for duplicate tables by checking if headers are identical
      const isDuplicate = finalTables.some((t) => 
        t.headers.length === headers.length &&
        t.headers.every((h, idx) => h.toLowerCase() === headers[idx].toLowerCase())
      );

      if (!isDuplicate) {
        const titleEl = tableEl.closest(".dashboard-section")?.querySelector(".dashboard-section-title") 
          || tableEl.closest("section")?.querySelector("h2, h3");
        const title = titleEl ? titleEl.innerText.trim() : "DETAILED BREAKDOWN";
        finalTables.push({ title, headers, rows });
      }
    }
  });

  // 8. PDF DRAWING ENGINE
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
    const pageNum =
      typeof doc.getCurrentPageInfo === "function"
        ? doc.getCurrentPageInfo().pageNumber
        : doc.getNumberOfPages();
    doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, {
      align: "right",
    });
  }

  function addNewPageIfNeeded(spaceNeeded, isTable = false, tableHeaders = null, colWidths = null) {
    if (y + spaceNeeded > pageHeight - 25) {
      addFooter();
      doc.addPage();
      y = 20;
      addPageHeader();

      if (isTable && tableHeaders && colWidths) {
        doc.setFillColor(...navy);
        doc.rect(margin, y - 3, contentWidth, 8, "F");
        setFont("bold", 7.5, white);
        tableHeaders.forEach((h, i) => {
          const xPos = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.text(h, xPos + 2, y + 2.2);
        });
        y += 9;
      }
    }
  }

  // PAGE 1 BRANDED HEADER
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

  // INPUTS SECTION
  if (finalInputs.length > 0) {
    addNewPageIfNeeded(25);
    setFont("bold", 10, teal);
    doc.text("YOUR INPUTS", margin, y);
    y += 5;
    drawLine(y);
    y += 6;

    const colW = (contentWidth - 6) / 2;
    finalInputs.forEach((inp, i) => {
      if (i % 2 === 0) {
        addNewPageIfNeeded(12);
      }
      const col = i % 2;
      const xPos = margin + col * (colW + 6);
      const rowY = y + Math.floor(i / 2) * 10;

      doc.setFillColor(...lightGray);
      doc.roundedRect(xPos, rowY - 4, colW, 9, 1.5, 1.5, "F");

      setFont("normal", 7.5, midGray);
      doc.text(inp.label, xPos + 3, rowY + 1.2);
      setFont("bold", 9, navy);
      doc.text(String(inp.value), xPos + colW - 3, rowY + 1.2, { align: "right" });
    });
    y += Math.ceil(finalInputs.length / 2) * 10 + 6;
  }

  // RESULTS SECTION
  if (finalResults.length > 0) {
    addNewPageIfNeeded(25);
    setFont("bold", 10, teal);
    doc.text("YOUR RESULTS", margin, y);
    y += 5;
    drawLine(y);
    y += 6;

    finalResults.forEach((res) => {
      if (res.highlight) {
        const hasSub = !!res.sub;
        const cardHeight = hasSub ? 18 : 13;
        addNewPageIfNeeded(cardHeight + 4);

        doc.setFillColor(...highlightBg);
        doc.roundedRect(margin, y - 5, contentWidth, cardHeight, 2, 2, "F");
        doc.setDrawColor(...teal);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y - 5, contentWidth, cardHeight, 2, 2, "S");

        setFont("normal", 8.5, [15, 80, 60]);
        doc.text(res.label, margin + 4, y + 1.5);

        setFont("bold", 13, teal);
        doc.text(String(res.value), pageWidth - margin - 4, y + 1.5, { align: "right" });

        if (hasSub) {
          setFont("normal", 7.5, midGray);
          doc.text(res.sub, margin + 4, y + 8);
        }
        y += cardHeight + 5;
      } else {
        addNewPageIfNeeded(12);
        doc.setFillColor(...lightGray);
        doc.roundedRect(margin, y - 4, contentWidth, 10, 1.5, 1.5, "F");

        setFont("normal", 8, midGray);
        doc.text(res.label, margin + 3, y + 1.8);

        setFont("bold", 9, navy);
        doc.text(String(res.value), pageWidth - margin - 3, y + 1.8, { align: "right" });
        y += 12;
      }
    });
    y += 4;
  }

  // SUMMARY BLOCK
  if (pdfData.summary) {
    setFont("normal", 8.5, [80, 60, 20]);
    const summaryLines = doc.splitTextToSize(pdfData.summary, contentWidth - 10);
    const lineCount = summaryLines.length;
    const cardHeight = 12 + lineCount * 4.5;

    addNewPageIfNeeded(cardHeight + 10);
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "F");
    doc.setDrawColor(186, 117, 23);
    doc.setLineWidth(0.4);
    doc.line(margin + 1, y, margin + 1, y + cardHeight);

    setFont("bold", 8.5, [133, 79, 11]);
    doc.text("SUMMARY INSIGHT", margin + 5, y + 6);

    setFont("normal", 8.5, [80, 60, 20]);
    doc.text(summaryLines, margin + 5, y + 12);
    y += cardHeight + 8;
  }

  // SMART INSIGHTS SECTION
  if (scrapedInsights.length > 0) {
    addNewPageIfNeeded(25);
    setFont("bold", 10, teal);
    doc.text("SMART INSIGHTS", margin, y);
    y += 5;
    drawLine(y);
    y += 6;

    scrapedInsights.forEach((ins) => {
      setFont("normal", 8.5, navy);
      const lines = doc.splitTextToSize(ins.text, contentWidth - 14);
      const boxHeight = lines.length * 4.5 + 6;

      addNewPageIfNeeded(boxHeight + 4);

      let bg = lightGray;
      let border = [220, 220, 230];
      if (ins.tone === "success") {
        bg = [240, 253, 244];
        border = [187, 247, 208];
      } else if (ins.tone === "warning") {
        bg = [254, 242, 242];
        border = [254, 226, 226];
      } else if (ins.tone === "tip") {
        bg = [254, 249, 195];
        border = [253, 224, 71];
      }

      doc.setFillColor(...bg);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, "F");
      doc.setDrawColor(...border);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, "S");

      doc.text(lines, margin + 5, y + 5);
      y += boxHeight + 4;
    });
    y += 2;
  }

  // RECOMMENDATIONS SECTION
  if (scrapedRecs.length > 0) {
    addNewPageIfNeeded(25);
    setFont("bold", 10, teal);
    doc.text("RECOMMENDATIONS", margin, y);
    y += 5;
    drawLine(y);
    y += 6;

    scrapedRecs.forEach((rec) => {
      setFont("bold", 8.5, navy);
      const titleLines = doc.splitTextToSize(rec.title, contentWidth - 10);
      setFont("normal", 8, midGray);
      const descLines = doc.splitTextToSize(rec.description, contentWidth - 10);

      const totalHeight = titleLines.length * 4 + descLines.length * 4 + 4;
      addNewPageIfNeeded(totalHeight + 4);

      doc.setFillColor(...teal);
      doc.circle(margin + 3, y + 2, 1, "F");

      setFont("bold", 8.5, navy);
      doc.text(titleLines, margin + 7, y + 3.5);

      setFont("normal", 8, midGray);
      doc.text(descLines, margin + 7, y + 4 + titleLines.length * 4);

      y += totalHeight + 4;
    });
    y += 2;
  }

  // CHARTS SECTION
  if (capturedCharts.length > 0) {
    for (let cIdx = 0; cIdx < capturedCharts.length; cIdx++) {
      const chart = capturedCharts[cIdx];
      const imgHeight = (chart.height * contentWidth) / chart.width;
      const finalHeight = Math.min(imgHeight, 85);

      addNewPageIfNeeded(finalHeight + 20);

      setFont("bold", 10, teal);
      doc.text(capturedCharts.length > 1 ? `VISUALIZATION ${cIdx + 1}` : "VISUALIZATION", margin, y);
      y += 5;
      drawLine(y);
      y += 5;

      doc.addImage(chart.imgData, "PNG", margin, y, contentWidth, finalHeight);
      y += finalHeight + 8;
    }
  }

  // TABLES SECTION (Repeats headers on page split & renders all rows)
  if (finalTables.length > 0) {
    finalTables.forEach((table) => {
      addNewPageIfNeeded(25);
      setFont("bold", 10, teal);
      doc.text(table.title || "DETAILED BREAKDOWN", margin, y);
      y += 5;
      drawLine(y);
      y += 5;

      const colCount = table.headers.length;
      const colWidths = table.headers.map(() => contentWidth / colCount);

      doc.setFillColor(...navy);
      doc.rect(margin, y - 3, contentWidth, 8, "F");
      setFont("bold", 7.5, white);
      table.headers.forEach((h, i) => {
        const xPos = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(h, xPos + 2, y + 2.2);
      });
      y += 9;

      table.rows.forEach((row, rowIdx) => {
        addNewPageIfNeeded(9, true, table.headers, colWidths);

        if (rowIdx % 2 === 0) {
          doc.setFillColor(...lightGray);
          doc.rect(margin, y - 3, contentWidth, 8, "F");
        }
        setFont("normal", 7.5, navy);
        row.forEach((cell, i) => {
          const xPos = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          doc.text(String(cell), xPos + 2, y + 2.2);
        });
        y += 8;
      });
      y += 6;
    });
  }

  // DISCLAIMER BLOCK
  addNewPageIfNeeded(26);
  doc.setFillColor(248, 248, 252);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");
  setFont("bold", 7, midGray);
  doc.text("DISCLAIMER", margin + 4, y + 6);

  setFont("normal", 6.5, midGray);
  const disc = pdfData.disclaimer ||
    `This calculation is provided for informational and educational purposes only. It is not financial, legal, or tax advice. ` +
    `Results are estimates based on the inputs provided and may not reflect actual rates, fees, or real-world outcomes. ` +
    `Always consult a qualified financial advisor, accountant, or legal professional before making financial decisions. ` +
    `${siteName} (${siteUrl}) is not responsible for decisions made based on these calculations.`;
  const discLines = doc.splitTextToSize(disc, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 11);
  y += 26;

  // PROMO BANNER AT BOTTOM
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

  // Save the generated document
  const fileName = `${calculatorSlug}-result-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
