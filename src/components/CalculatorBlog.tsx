import { Link } from "@tanstack/react-router";
import { Lightbulb, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from "lucide-react";

export interface BlogContent {
  primaryKeyword: string;
  h2Heading: string;
  h3Heading: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  h2Body: string;
  h3Body: string;
  paragraph4: string;
  closingParagraph: string;
  internalLinks: {
    text: string;
    calculatorName: string;
    href: string;
  }[];
  // --- New Premium Engagement Additions (Optional for robust backward-compatibility) ---
  didYouKnow?: string;
  proTip?: string;
  scenarioTitle?: string;
  scenarioText?: string;
  scenarioMath?: string;
  scenarioTakeaway?: string;
  commonMistakesTitle?: string;
  commonMistakes?: string[];
}

type Props = {
  content: BlogContent;
};

export default function CalculatorBlog({ content }: Props) {
  return (
    <article className="mt-12 pt-10 border-t border-border/80 w-full">
      {/* Visual Badge/Header */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
        <BookOpen className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.08em]">
          Educational Guide
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
        Understanding {content.primaryKeyword}
      </h2>

      {/* Intro paragraph with slightly elevated styling */}
      <p 
        className="text-[15px] sm:text-[16px] text-muted-foreground leading-[1.8] mb-6 font-normal"
        dangerouslySetInnerHTML={{ __html: content.paragraph1 }}
      />

      {/* 1. Pro Tip & Did You Know Cards (Responsive Grid) */}
      {(content.didYouKnow || content.proTip) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {content.didYouKnow && (
            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 p-5 shadow-sm transition-all duration-300 hover:border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Did You Know?
                </span>
              </div>
              <p 
                className="text-[13px] text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.didYouKnow }}
              />
            </div>
          )}

          {content.proTip && (
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/35 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500/90">
                  Pro Strategy
                </span>
              </div>
              <p 
                className="text-[13px] text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.proTip }}
              />
            </div>
          )}
        </div>
      )}

      {/* Main body content */}
      <p className={pClass} dangerouslySetInnerHTML={{ __html: content.paragraph2 }} />
      <p className={pClass} dangerouslySetInnerHTML={{ __html: content.paragraph3 }} />

      {/* H2 Heading with left accent indicator */}
      <h3 className={h2Class}>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full"></span>
        {content.h2Heading}
      </h3>
      <p className={pClass} dangerouslySetInnerHTML={{ __html: content.h2Body }} />

      {/* 2. Real-World Scenario callout card */}
      {content.scenarioTitle && (
        <div className="relative my-8 overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 sm:p-6">
          <div className="absolute right-4 top-4 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
            Case Study
          </div>
          
          <h4 className="text-base font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {content.scenarioTitle}
          </h4>
          
          <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">
            {content.scenarioText}
          </p>

          {content.scenarioMath && (
            <div className="bg-muted/40 rounded-lg border border-border/30 p-3.5 my-3.5 overflow-x-auto">
              <pre className="font-mono text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {content.scenarioMath}
              </pre>
            </div>
          )}

          {content.scenarioTakeaway && (
            <div className="text-[13px] font-medium text-foreground bg-muted/30 rounded-lg px-3 py-2 border-l-2 border-primary/60 flex items-start gap-2">
              <span className="text-primary font-bold text-xs uppercase tracking-wide mt-0.5">Result:</span>
              <span className="text-muted-foreground">{content.scenarioTakeaway}</span>
            </div>
          )}
        </div>
      )}

      {/* H3 Heading with left accent indicator */}
      <h4 className={h3Class}>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary/80 rounded-full"></span>
        {content.h3Heading}
      </h4>
      <p className={pClass} dangerouslySetInnerHTML={{ __html: content.h3Body }} />

      {/* 3. Common Mistakes to Avoid list card */}
      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <div className="my-8 rounded-xl border border-destructive/15 bg-destructive/5 p-5">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3.5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            {content.commonMistakesTitle || "Pitfalls & Mistakes to Avoid"}
          </h4>
          <ul className="space-y-2.5">
            {content.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
                <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/60 mt-2"></span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className={pClass} dangerouslySetInnerHTML={{ __html: content.paragraph4 }} />
      <p 
        className="text-[14.5px] sm:text-base text-muted-foreground leading-[1.8] mb-8 font-normal"
        dangerouslySetInnerHTML={{ __html: content.closingParagraph }}
      />


    </article>
  );
}

const pClass = "text-[14.5px] sm:text-base text-muted-foreground leading-[1.8] mb-5 font-normal";
const h2Class = "relative text-lg sm:text-xl font-bold text-foreground mt-8 mb-4 pl-4";
const h3Class = "relative text-base sm:text-lg font-bold text-foreground mt-7 mb-3.5 pl-4";
