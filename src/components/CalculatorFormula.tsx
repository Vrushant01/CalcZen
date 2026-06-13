import { FunctionSquare } from "lucide-react";

type ParsedLine =
  | { kind: "title"; text: string }
  | { kind: "eq"; label?: string; expr: string }
  | { kind: "var"; symbol: string; desc: string }
  | { kind: "text"; text: string };

function isMathExpression(s: string): boolean {
  return /[=×+\-^/()]/.test(s) || /\d/.test(s);
}

function parseVarPair(part: string): { symbol: string; desc: string } | null {
  const m = part.trim().match(/^([A-Za-z&]+)\s*=\s*(.+)$/);
  return m ? { symbol: m[1], desc: m[2] } : null;
}

function parseFormulaText(raw: string): ParsedLine[] {
  const result: ParsedLine[] = [];
  let inLegend = false;

  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t) continue;

    if (/^where:?$/i.test(t)) {
      inLegend = true;
      continue;
    }

    if (inLegend) {
      if (t.includes(",") && t.includes("=")) {
        for (const part of t.split(/,\s*/)) {
          const v = parseVarPair(part);
          if (v) result.push({ kind: "var", ...v });
        }
        continue;
      }
      const single = parseVarPair(t);
      if (single && !isMathExpression(single.desc)) {
        result.push({ kind: "var", ...single });
        continue;
      }
      inLegend = false;
    }

    const colonIdx = t.indexOf(":");
    if (colonIdx > 0 && colonIdx < t.length - 1) {
      const label = t.slice(0, colonIdx).trim();
      const rest = t.slice(colonIdx + 1).trim();
      if (rest && (rest.includes("=") || isMathExpression(rest))) {
        result.push({ kind: "eq", label, expr: rest });
        continue;
      }
    }

    if (t.includes("=")) {
      result.push({ kind: "eq", expr: t });
      continue;
    }

    result.push({ kind: "text", text: t });
  }

  return result;
}

function formatMath(text: string): string {
  return text.replace(/\*/g, "×").replace(/\-/g, "−").replace(/sqrt/g, "√");
}

type Props = {
  formula: string;
};

export function CalculatorFormula({ formula }: Props) {
  const lines = parseFormulaText(formula);
  const equations = lines.filter((l) => l.kind === "eq");
  const variables = lines.filter((l) => l.kind === "var");
  const extras = lines.filter((l) => l.kind === "title" || l.kind === "text");

  return (
    <section className="calc-formula-section" aria-labelledby="calc-formula-heading">
      <div className="calc-formula-header">
        <span className="calc-formula-icon" aria-hidden>
          <FunctionSquare className="h-5 w-5" />
        </span>
        <h2 id="calc-formula-heading" className="calc-formula-title">
          Formula Used
        </h2>
      </div>

      {equations.length > 0 && (
        <div className="calc-formula-equations">
          {equations.map((line, i) =>
            line.kind === "eq" ? (
              <div key={i} className="calc-formula-equation">
                {line.label && <span className="calc-formula-label">{line.label}</span>}
                <code className="calc-formula-expr">{formatMath(line.expr)}</code>
              </div>
            ) : null,
          )}
        </div>
      )}

      {variables.length > 0 && (
        <div className="calc-formula-legend">
          <p className="calc-formula-legend-title">Variables</p>
          <dl className="calc-formula-vars">
            {variables.map((line, i) =>
              line.kind === "var" ? (
                <div key={i} className="calc-formula-var">
                  <dt>{line.symbol}</dt>
                  <dd>{line.desc}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      )}

      {extras.length > 0 && (
        <ul className="calc-formula-notes">
          {extras.map((line, i) => (
            <li key={i}>{line.kind === "title" || line.kind === "text" ? line.text : ""}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
