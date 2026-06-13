import { Link } from "@tanstack/react-router";
import { ChevronRight, Share2 } from "lucide-react";
import { CalculatorExample } from "@/components/CalculatorExample";
import { CalculatorFormula } from "@/components/CalculatorFormula";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";
import { CalculatorCard } from "@/components/CalculatorCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { calculators, getCategory, type CalculatorMeta } from "@/data/calculators";
import { motion } from "framer-motion";
type FAQ = { q: string; a: string };

const CONTEXTUAL_LINKS_DICT: Record<string, Record<string, string>> = {
  "mortgage-calculator": {
    "loan-emi-calculator": "Compare home loans and monthly installments with our [Loan EMI Calculator](/calculator/loan-emi-calculator).",
    "compound-interest-calculator": "Estimate interest accumulation and investment growth using the [Compound Interest Calculator](/calculator/compound-interest-calculator).",
    "percentage-calculator": "Perform quick ratio shifts and percentage calculations with the [Percentage Calculator](/calculator/percentage-calculator).",
    "retirement-calculator": "Plan your long-term retirement savings and corpus targets using our [Retirement Calculator](/calculator/retirement-calculator).",
    "401k-calculator": "Optimize retirement savings and pre-tax contributions using the [401(k) Calculator](/calculator/401k-calculator)."
  },
  "compound-interest-calculator": {
    "loan-emi-calculator": "Determine borrowing installments and compare loan options with our [Loan EMI Calculator](/calculator/loan-emi-calculator).",
    "mortgage-calculator": "Calculate monthly home loan amortizations using the [Mortgage Calculator](/calculator/mortgage-calculator).",
    "percentage-calculator": "Examine compound growth ratios and percent shifts using our [Percentage Calculator](/calculator/percentage-calculator).",
    "retirement-calculator": "Estimate retirement corpus targets and nest eggs using the [Retirement Calculator](/calculator/retirement-calculator).",
    "401k-calculator": "Model pre-tax growth and employer matching with our [401(k) Calculator](/calculator/401k-calculator)."
  },
  "loan-emi-calculator": {
    "mortgage-calculator": "Estimate your monthly property payments using the [Mortgage Calculator](/calculator/mortgage-calculator).",
    "compound-interest-calculator": "Foresee long-term investment growth and compound returns with the [Compound Interest Calculator](/calculator/compound-interest-calculator).",
    "tip-calculator": "Divide dining expenditures and calculate gratuity with our [Tip Calculator](/calculator/tip-calculator).",
    "retirement-calculator": "Secure your long-term savings goals and nest egg using the [Retirement Calculator](/calculator/retirement-calculator).",
    "401k-calculator": "Determine pre-tax contributions and employer match with our [401(k) Calculator](/calculator/401k-calculator)."
  },
  "retirement-calculator": {
    "401k-calculator": "Optimize employer matching and contribution limits using the [401(k) Calculator](/calculator/401k-calculator).",
    "compound-interest-calculator": "Project investment compounding over time with our [Compound Interest Calculator](/calculator/compound-interest-calculator).",
    "loan-emi-calculator": "Calculate borrowing costs and personal loan EMIs using our [Loan EMI Calculator](/calculator/loan-emi-calculator).",
    "mortgage-calculator": "Simulate home purchase financing costs using the [Mortgage Calculator](/calculator/mortgage-calculator).",
    "percentage-calculator": "Track savings growth ratios using the [Percentage Calculator](/calculator/percentage-calculator)."
  },
  "401k-calculator": {
    "retirement-calculator": "Secure your financial future by planning corpus goals using the [Retirement Calculator](/calculator/retirement-calculator).",
    "compound-interest-calculator": "Forecast long-term savings growth using our [Compound Interest Calculator](/calculator/compound-interest-calculator).",
    "loan-emi-calculator": "Determine monthly loan installments with the [Loan EMI Calculator](/calculator/loan-emi-calculator).",
    "mortgage-calculator": "Calculate home buying payment plans using our [Mortgage Calculator](/calculator/mortgage-calculator).",
    "percentage-calculator": "Track compound growth ratios using the [Percentage Calculator](/calculator/percentage-calculator)."
  },
  "bmi-calculator": {
    "calorie-calculator": "To better understand your daily energy and calorie needs, try our [Calorie Calculator](/calculator/calorie-calculator).",
    "bmr-calculator": "Use the [BMR Calculator](/calculator/bmr-calculator) to estimate your basal metabolic rate and resting energy expenditure.",
    "water-intake-calculator": "Track hydration and calculate optimal fluid needs using our [Water Intake Calculator](/calculator/water-intake-calculator).",
    "pregnancy-due-date-calculator": "Plan gestational milestones and estimate your due date with the [Pregnancy Due Date Calculator](/calculator/pregnancy-due-date-calculator)."
  },
  "calorie-calculator": {
    "bmr-calculator": "Establish your basal metabolic rate as a baseline using the [BMR Calculator](/calculator/bmr-calculator).",
    "bmi-calculator": "Analyze your body weight index relative to height using our [BMI Calculator](/calculator/bmi-calculator).",
    "water-intake-calculator": "Determine daily hydration needs matching your activity levels with our [Water Intake Calculator](/calculator/water-intake-calculator).",
    "pregnancy-due-date-calculator": "Track pregnancy progress and gestational milestones using the [Pregnancy Due Date Calculator](/calculator/pregnancy-due-date-calculator)."
  },
  "water-intake-calculator": {
    "calorie-calculator": "Verify daily energy goals and macronutrient needs using our [Calorie Calculator](/calculator/calorie-calculator).",
    "bmi-calculator": "Keep track of weight indexes and health targets with our [BMI Calculator](/calculator/bmi-calculator).",
    "bmr-calculator": "Estimate metabolic rates and baseline resting energy expenditure using the [BMR Calculator](/calculator/bmr-calculator).",
    "pregnancy-due-date-calculator": "Hydrate appropriately throughout pregnancy and track due dates using the [Pregnancy Due Date Calculator](/calculator/pregnancy-due-date-calculator)."
  },
  "bmr-calculator": {
    "calorie-calculator": "Translate resting metabolism into custom daily targets with our [Calorie Calculator](/calculator/calorie-calculator).",
    "bmi-calculator": "Evaluate body weight status relative to height using the [BMI Calculator](/calculator/bmi-calculator).",
    "water-intake-calculator": "Track optimal daily fluid consumption and hydration using the [Water Intake Calculator](/calculator/water-intake-calculator).",
    "pregnancy-due-date-calculator": "Plan obstetric milestones and track pregnancy progress with the [Pregnancy Due Date Calculator](/calculator/pregnancy-due-date-calculator)."
  },
  "pregnancy-due-date-calculator": {
    "water-intake-calculator": "Stay hydrated throughout pregnancy by calculating targets with the [Water Intake Calculator](/calculator/water-intake-calculator).",
    "bmi-calculator": "Assess weight ranges and monitor overall physical fitness with our [BMI Calculator](/calculator/bmi-calculator).",
    "calorie-calculator": "Calculate nutritional energy requirements and calorie needs with the [Calorie Calculator](/calculator/calorie-calculator).",
    "bmr-calculator": "Determine resting energy expenditure during pregnancy using the [BMR Calculator](/calculator/bmr-calculator)."
  },
  "percentage-calculator": {
    "tip-calculator": "Determine dining bill divisions and tip rates using our [Tip Calculator](/calculator/tip-calculator).",
    "age-calculator": "Perform chronological calculations and birth countdowns with the [Age Calculator](/calculator/age-calculator).",
    "compound-interest-calculator": "Examine compound growth percentages over time using the [Compound Interest Calculator](/calculator/compound-interest-calculator).",
    "scientific-calculator": "Solve technical math and logarithmic expressions with our [Scientific Calculator](/calculator/scientific-calculator).",
    "standard-calculator": "Solve simple everyday arithmetic operations using our [Standard Calculator](/calculator/standard-calculator)."
  },
  "age-calculator": {
    "percentage-calculator": "Evaluate ratios, differences, and percentage shifts using the [Percentage Calculator](/calculator/percentage-calculator).",
    "tip-calculator": "Splits restaurant dining tabs and gratuity with our [Tip Calculator](/calculator/tip-calculator).",
    "pregnancy-due-date-calculator": "Track gestational timelines and baby due dates with the [Pregnancy Due Date Calculator](/calculator/pregnancy-due-date-calculator).",
    "standard-calculator": "Compute basic math additions and divisions with our [Standard Calculator](/calculator/standard-calculator)."
  },
  "tip-calculator": {
    "percentage-calculator": "Evaluate bill discounts, price markups, and percent shifts using our [Percentage Calculator](/calculator/percentage-calculator).",
    "loan-emi-calculator": "Assess personal borrowing costs and monthly repayments with the [Loan EMI Calculator](/calculator/loan-emi-calculator).",
    "age-calculator": "Track birthday countdowns and exact dates using the [Age Calculator](/calculator/age-calculator).",
    "standard-calculator": "Run simple arithmetic calculations and bill audits using the [Standard Calculator](/calculator/standard-calculator)."
  },
  "scientific-calculator": {
    "standard-calculator": "Perform basic arithmetic, addition, and division using our [Standard Calculator](/calculator/standard-calculator).",
    "percentage-calculator": "Solve percent shifts, increases, and ratio math with the [Percentage Calculator](/calculator/percentage-calculator).",
    "age-calculator": "Count exact days, months, and years using the [Age Calculator](/calculator/age-calculator)."
  },
  "standard-calculator": {
    "scientific-calculator": "Resolve advanced trigonometric, logarithmic, and root functions with our [Scientific Calculator](/calculator/scientific-calculator).",
    "percentage-calculator": "Determine percent shifts and ratio math equations with the [Percentage Calculator](/calculator/percentage-calculator).",
    "tip-calculator": "Split restaurant tabs and calculate gratuity percentages with the [Tip Calculator](/calculator/tip-calculator)."
  }
};

function renderContextualSentence(sentence: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(sentence)) !== null) {
    const text = match[1];
    const to = match[2];
    const index = match.index;
    
    if (index > lastIndex) {
      parts.push(sentence.substring(lastIndex, index));
    }
    
    parts.push(
      <Link
        key={index}
        to={to as any}
        className="text-primary hover:underline font-medium"
      >
        {text}
      </Link>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < sentence.length) {
    parts.push(sentence.substring(lastIndex));
  }
  
  return parts;
}

const AUTHORITY_CITATIONS_DICT: Record<string, { name: string; url: string }[]> = {
  "mortgage-calculator": [
    { name: "Consumer Financial Protection Bureau Mortgage Guide", url: "https://www.consumerfinance.gov/owning-a-home/" },
    { name: "Federal Reserve Board Mortgage Calculator Resources", url: "https://www.federalreserve.gov/consumerscommunities/mortgagecalculator.htm" }
  ],
  "compound-interest-calculator": [
    { name: "SEC Investor.gov Compound Interest Calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
    { name: "FINRA Guide on Compound Interest", url: "https://www.finra.org/investors/insights/power-of-compound-interest" }
  ],
  "loan-emi-calculator": [
    { name: "Consumer Financial Protection Bureau Loan Toolkits", url: "https://www.consumerfinance.gov/consumer-tools/loans/" },
    { name: "Federal Reserve Board Consumer Loans Guide", url: "https://www.federalreserve.gov/consumerscommunities/personal-loans.htm" }
  ],
  "retirement-calculator": [
    { name: "Social Security Administration Retirement Planner", url: "https://www.ssa.gov/prepare/plan-retirement" },
    { name: "IRS Retirement Plans Guidelines", url: "https://www.irs.gov/retirement-plans" }
  ],
  "401k-calculator": [
    { name: "IRS 401(k) Plan Contribution Limits", url: "https://www.irs.gov/retirement-plans/401k-plans" },
    { name: "US Department of Labor 401(k) Plan Information", url: "https://www.dol.gov/agencies/ebsa/key-topics/retirement/401k-plans" }
  ],
  "bmi-calculator": [
    { name: "World Health Organization Obesity and Overweight Guidelines", url: "https://www.who.int/europe/news-room/fact-sheets/item/obesity-and-overweight" },
    { name: "CDC Body Mass Index Criteria", url: "https://www.cdc.gov/bmi/index.html" },
    { name: "NIH Weight Management Resources", url: "https://www.nhlbi.nih.gov/health/educational/lose_wt/index.htm" }
  ],
  "calorie-calculator": [
    { name: "NIH Body Weight Planner & Calorie Guidelines", url: "https://www.nih.gov/news-events/nih-research-matters/weight-loss-planner-launched" },
    { name: "USDA Dietary Guidelines for Americans", url: "https://www.dietaryguidelines.gov" }
  ],
  "water-intake-calculator": [
    { name: "National Academies Report on Daily Water Requirements", url: "https://www.nationalacademies.org/news/2004/02/report-sets-dietary-intake-levels-for-water-salt-and-potassium-to-maintain-health-and-reduce-chronic-disease-risk" },
    { name: "Mayo Clinic Hydration Advice", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256" }
  ],
  "bmr-calculator": [
    { name: "NIH Basal Metabolic Rate Standard Studies", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/" },
    { name: "Academy of Nutrition and Dietetics Standards", url: "https://www.eatright.org" }
  ],
  "pregnancy-due-date-calculator": [
    { name: "ACOG Gestational Age Milestone Standards", url: "https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy" },
    { name: "NIH Pregnancy Milestone and Due Date Guidelines", url: "https://www.nichd.nih.gov/health/topics/pregnancy/conditioninfo/default" }
  ],
  "percentage-calculator": [
    { name: "Wolfram MathWorld Percentage Reference", url: "https://mathworld.wolfram.com/Percentage.html" },
    { name: "NIST Metrics and Decimal Ratios Guide", url: "https://www.nist.gov/pml/owm/metric-si/si-units" }
  ],
  "age-calculator": [
    { name: "NIST Time and Frequency Division Standards", url: "https://www.nist.gov/pml/time-and-frequency-division" },
    { name: "US Naval Observatory Time Standards", url: "https://www.usno.navy.mil/USNO" }
  ],
  "standard-calculator": [
    { name: "Wolfram MathWorld Arithmetic Standards", url: "https://mathworld.wolfram.com/Arithmetic.html" },
    { name: "NIST Physical Measurement Reference", url: "https://www.nist.gov/pml" }
  ],
  "tip-calculator": [
    { name: "Cornell University Gratuity and Tipping Research", url: "https://sha.cornell.edu/about/directory/instructors/mlm15/" },
    { name: "Consumer Reports Service Gratuity Guidelines", url: "https://www.consumerreports.org/tipping-service-workers/gratuity-guide-a2795863994/" }
  ],
  "scientific-calculator": [
    { name: "NIST Reference on Physics Constants and Units", url: "https://physics.nist.gov/cuu/Constants/" },
    { name: "Wolfram MathWorld Mathematical Function Reference", url: "https://mathworld.wolfram.com/" }
  ]
};

type Props = {
  calc: CalculatorMeta;
  intro: string;
  formula?: string;
  example?: string;
  faqs: FAQ[];
  children: React.ReactNode;
  blog?: React.ReactNode;
};

export function CalculatorPageLayout({ calc, intro, formula, example, faqs, children, blog }: Props) {
  const category = getCategory(calc.category);

  // Dynamic high-relevance semantic internal linking dictionary for programmatic SEO
  const SEMANTIC_RELATION_MAP: Record<string, string[]> = {
    "mortgage-calculator": ["loan-emi-calculator", "compound-interest-calculator", "percentage-calculator"],
    "compound-interest-calculator": ["loan-emi-calculator", "mortgage-calculator", "percentage-calculator"],
    "loan-emi-calculator": ["mortgage-calculator", "compound-interest-calculator", "tip-calculator"],
    "bmi-calculator": ["calorie-calculator", "bmr-calculator", "water-intake-calculator"],
    "calorie-calculator": ["bmr-calculator", "bmi-calculator", "water-intake-calculator"],
    "water-intake-calculator": ["calorie-calculator", "bmi-calculator", "bmr-calculator"],
    "bmr-calculator": ["calorie-calculator", "bmi-calculator", "water-intake-calculator"],
    "pregnancy-due-date-calculator": ["water-intake-calculator", "bmi-calculator", "calorie-calculator"],
    "percentage-calculator": ["tip-calculator", "age-calculator", "compound-interest-calculator"],
    "age-calculator": ["percentage-calculator", "tip-calculator", "pregnancy-due-date-calculator"],
    "tip-calculator": ["percentage-calculator", "loan-emi-calculator", "age-calculator"],
  };

  const getRelatedCalculators = (): typeof calculators => {
    const semanticSlugs = SEMANTIC_RELATION_MAP[calc.slug] || [];
    const semanticItems = semanticSlugs
      .map((slug) => calculators.find((c) => c.slug === slug))
      .filter((c): c is CalculatorMeta => !!c);

    // Backfill with category matching items to ensure exactly 3-5 high-relevance links
    const categoryMatches = calculators.filter(
      (c) => c.category === calc.category && c.slug !== calc.slug && !semanticSlugs.includes(c.slug)
    );

    return [...semanticItems, ...categoryMatches].slice(0, 5);
  };

  const related = getRelatedCalculators();

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: calc.name, url });
      } catch {
        /* cancelled */
      }
    } else if (typeof navigator !== "undefined") {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        /* unavailable */
      }
    }
  };

  return (
    <PageContainer spacing="tight" className="lg:py-10">
      <nav
        aria-label="Breadcrumb"
        className="scroll-touch-x flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 -mx-1 px-1"
      >
        <Link to="/" className="shrink-0 hover:text-foreground py-1">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {category && (
          <>
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="shrink-0 hover:text-foreground py-1 max-w-[5rem] sm:max-w-none truncate"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </>
        )}
        <span className="text-foreground font-medium truncate min-w-0 py-1">{calc.name}</span>
      </nav>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 sm:mb-6"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance leading-tight">
          {calc.h1}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl leading-relaxed">
          {intro}
        </p>
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={share}
            className="gap-2 min-h-10 sm:min-h-9"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </motion.header>

      <div className="w-full min-w-0 space-y-5 sm:space-y-8">
        <section className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 min-w-0 overflow-hidden">
          <div className="calc-container-inner">{children}</div>
        </section>

        {blog && (
          <div className="w-full min-w-0">
            {blog}
          </div>
        )}

        {formula && (
          <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
            <CalculatorFormula formula={formula} />
          </div>
        )}

        {example && (
          <div className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0">
            <CalculatorExample example={example} />
          </div>
        )}


        <section id="faq-section" className="scroll-mt-20 surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0 text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 border-b border-border/40 pb-3">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-foreground flex items-start gap-2">
                  <span className="text-primary font-bold">Q.</span>
                  {faq.q}
                </h3>
                <p 
                  className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed pl-5"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="min-w-0 surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-left mt-5 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 border-b border-border/40 pb-3">Related Calculators</h2>
            
            {/* Contextual links paragraph */}
            <div className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed mb-6 space-y-2.5">
              {related.map((c) => {
                const sentence = CONTEXTUAL_LINKS_DICT[calc.slug]?.[c.slug];
                if (!sentence) return null;
                return (
                  <p key={c.slug}>
                    {renderContextualSentence(sentence)}
                  </p>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {related.map((c, i) => (
                <CalculatorCard key={c.slug} calc={c} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES SECTION */}
        {(() => {
          const citations = AUTHORITY_CITATIONS_DICT[calc.slug] || [];
          if (citations.length === 0) return null;
          return (
            <section className="min-w-0 surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-left mt-5 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 border-b border-border/40 pb-3">References</h2>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-muted-foreground/90">
                {citations.map((c, i) => (
                  <li key={i}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })()}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `https://calczen.in/calculator/${calc.slug}#webpage`,
                "name": calc.metaTitle || `${calc.name} - Free Online Calculator | CalcZen`,
                "description": calc.metaDescription || calc.description,
                "url": `https://calczen.in/calculator/${calc.slug}`
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "@id": `https://calczen.in/calculator/${calc.slug}#software`,
                "name": calc.name,
                "applicationCategory": "CalculatorApplication",
                "operatingSystem": "Web"
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": `https://calczen.in/calculator/${calc.slug}#faq`,
                "mainEntity": faqs.map((f) => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                  }
                }))
              },
              ...(category ? [{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "@id": `https://calczen.in/calculator/${calc.slug}#breadcrumb`,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://calczen.in"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": category.name,
                    "item": `https://calczen.in/category/${category.slug}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": calc.name,
                    "item": `https://calczen.in/calculator/${calc.slug}`
                  }
                ]
              }] : [])
            ]
          }),
        }}
      />
    </PageContainer>
  );
}
