import { Link } from "@/components/ui/Link";
import {
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export interface BlogContent {
  primaryKeyword: string;
  category: string;
  introText: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
    callout?: {
      type: "didYouKnow" | "proTip" | "quickFact" | "commonMistake" | "expertInsight";
      title?: string;
      text: string;
    };
    table?: {
      headers: string[];
      rows: string[][];
    };
    formulaBox?: {
      title?: string;
      formula: string;
      variables: Array<{ name: string; desc: string }>;
    };
    exampleBox?: {
      title: string;
      inputs: Array<{ name: string; val: string }>;
      steps: string[];
      result: string;
    };
  }>;
  faqs?: Array<{ q: string; a: string }>;
  internalLinks?: Array<{ text: string; calculatorName: string; href: string }>;
}

type Props = {
  content: BlogContent;
};

export default function CalculatorBlog({ content }: Props) {
  return (
    <article className="mt-20 sm:mt-24 pt-16 border-t border-border/40 w-full min-w-0 max-w-none text-left">
      {/* 1. Header Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5 select-none">
        <BookOpen className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.08em]">
          Knowledge Base & Insights
        </span>
      </div>

      {/* 2. Main Article Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
        Understanding {content.primaryKeyword}
      </h2>

      {/* 3. Dynamic elevated intro paragraph */}
      <p
        className="text-[15px] sm:text-[16px] text-muted-foreground/90 leading-[1.8] mb-10 font-normal w-full"
        dangerouslySetInnerHTML={{ __html: content.introText }}
      />

      {/* 4. Table of Contents / Scannability index */}
      {content.sections.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 sm:p-5 mt-6 mb-16 w-full select-none">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Quick Navigation Index
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            {content.sections.map((s, idx) => (
              <li key={idx}>
                <a
                  href={`#section-${idx}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(`section-${idx}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", `#section-${idx}`);
                    }
                  }}
                  className="text-primary hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight size={12} className="shrink-0 text-primary/70" />
                  <span className="truncate">{s.title}</span>
                </a>
              </li>
            ))}
            {content.faqs && content.faqs.length > 0 && (
              <li>
                <a
                  href="#faq-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("faq-section");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", "#faq-section");
                    }
                  }}
                  className="text-primary hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight size={12} className="shrink-0 text-primary/70" />
                  <span>Frequently Asked Questions</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* 5. Dynamically iterate content sections */}
      <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-20">
        {content.sections.map((s, idx) => (
          <section key={idx} className="scroll-mt-20">
            {/* Section H3 Title */}
            <h3
              id={`section-${idx}`}
              className="relative text-xl sm:text-2xl font-bold text-foreground mb-6 pl-4.5 flex items-center"
            >
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full" />
              {s.title}
            </h3>

            {/* Paragraph elements */}
            <div className="space-y-6 w-full">
              {s.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[15px] sm:text-[16px] text-muted-foreground/90 leading-[1.8] font-normal"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>

            {/* Optional Callout Block */}
            {s.callout && (
              <div
                className={`relative overflow-hidden rounded-xl border p-5 my-10 shadow-sm border-l-4 transition-all duration-300 w-full ${
                  s.callout.type === "commonMistake"
                    ? "border-destructive/20 border-l-destructive bg-destructive/5"
                    : s.callout.type === "proTip"
                      ? "border-emerald-500/20 border-l-emerald-500 bg-emerald-500/5"
                      : "border-primary/20 border-l-primary bg-muted/15"
                }`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      s.callout.type === "commonMistake"
                        ? "bg-destructive/10 text-destructive"
                        : s.callout.type === "proTip"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {s.callout.type === "commonMistake" ? (
                      <AlertCircle size={15} />
                    ) : s.callout.type === "proTip" ? (
                      <Lightbulb size={15} />
                    ) : s.callout.type === "didYouKnow" ? (
                      <HelpCircle size={15} />
                    ) : s.callout.type === "quickFact" ? (
                      <BookOpen size={15} />
                    ) : (
                      <Sparkles size={15} />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider select-none ${
                      s.callout.type === "commonMistake"
                        ? "text-destructive"
                        : s.callout.type === "proTip"
                          ? "text-emerald-500"
                          : "text-muted-foreground/80"
                    }`}
                  >
                    {s.callout.title || s.callout.type.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
                <p
                  className="text-[13.5px] text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.callout.text }}
                />
              </div>
            )}

            {/* Optional Tabular Block */}
            {s.table && (
              <div className="my-10 border border-border/80 rounded-xl overflow-hidden shadow-soft w-full">
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-muted/40 border-b border-border/80">
                      <tr>
                        {s.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4.5 py-3 font-semibold text-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {s.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-muted/20 transition-colors odd:bg-card/30 even:bg-muted/10"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="px-4.5 py-3 text-muted-foreground/90 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: cell }}
                            />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Optional Step-by-Step Example Box */}
            {s.exampleBox && (
              <div className="my-10 rounded-xl border border-border bg-card/45 p-6 sm:p-8 w-full shadow-soft">
                <div className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2 mb-5 border-b border-border/40 pb-3">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  {s.exampleBox.title}
                </div>

                {/* Inputs list */}
                <div className="text-xs sm:text-sm text-muted-foreground mb-6">
                  <div className="font-semibold text-foreground mb-3 select-none">
                    Example Parameters:
                  </div>
                  <ul className="list-disc list-inside space-y-2.5 pl-2">
                    {s.exampleBox.inputs.map((inp, iIdx) => (
                      <li key={iIdx}>
                        <strong>{inp.name}</strong>: {inp.val}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Calculation steps */}
                <div className="text-xs sm:text-sm text-muted-foreground mb-8">
                  <div className="font-semibold text-foreground mb-3 select-none">
                    Sequential Steps:
                  </div>
                  <ol className="list-decimal list-inside space-y-3 pl-2 leading-relaxed">
                    {s.exampleBox.steps.map((st, sIdx) => (
                      <li key={sIdx} dangerouslySetInnerHTML={{ __html: st }} />
                    ))}
                  </ol>
                </div>

                {/* Final outcome banner */}
                <div className="text-xs sm:text-sm font-medium text-foreground bg-muted/40 rounded-xl p-5 border-l-4 border-l-primary flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                  <span className="text-primary font-bold text-xs uppercase tracking-wide shrink-0 select-none mt-0.5">
                    Takeaway Result:
                  </span>
                  <span
                    className="text-muted-foreground/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: s.exampleBox.result }}
                  />
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
