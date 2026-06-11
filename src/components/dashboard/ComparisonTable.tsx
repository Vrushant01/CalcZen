import { cn } from "@/lib/utils";

type Row = {
  label: string;
  values: string[];
  highlight?: boolean;
  isHeader?: boolean;
};

type Props = {
  headers: string[];
  rows: Row[];
  highlightColIndex?: number; // column index to accent (0-based, after label col)
  caption?: string;
};

export function ComparisonTable({ headers, rows, highlightColIndex, caption }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-card shadow-soft">
      {caption && (
        <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {caption}
        </div>
      )}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            {headers.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  i > 0 && "text-right",
                  highlightColIndex !== undefined && i === highlightColIndex + 1 &&
                    "text-accent"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={cn(
                "border-b border-border/30 transition-colors last:border-0",
                row.highlight
                  ? "bg-accent/8 font-semibold"
                  : "hover:bg-muted/20"
              )}
            >
              <td className="px-4 py-2.5 text-sm font-medium text-foreground">{row.label}</td>
              {row.values.map((v, vi) => (
                <td
                  key={vi}
                  className={cn(
                    "px-4 py-2.5 text-right tabular-nums",
                    row.highlight ? "text-foreground font-bold" : "text-muted-foreground",
                    highlightColIndex !== undefined && vi === highlightColIndex &&
                      "text-accent font-semibold"
                  )}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
