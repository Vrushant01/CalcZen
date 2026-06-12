import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { CalculatorCard } from "@/components/CalculatorCard";
import { calculatorsByCategory, getCategory } from "@/data/calculators";
import { ChevronRight } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return {};
    const title = `${cat.name} Calculators | CalcZen`;
    const desc = `${cat.description}. Free online ${cat.name.toLowerCase()} calculators with formulas, examples and instant results.`;
    const url = `https://calczen.com/category/${cat.slug}`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { name: "twitter:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <PageContainer className="py-16 sm:py-24 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Category not found</h1>
        <Link to="/calculators" className="mt-6 inline-flex min-h-[2.75rem] items-center text-accent">
          Browse all calculators
        </Link>
      </PageContainer>
    </PageShell>
  ),
});

// Category landing page copy database
const CATEGORY_LANDING_DATA: Record<
  string,
  {
    intro: string;
    faqs: Array<{ q: string; a: string }>;
    relatedCategories: Array<{ slug: string; name: string }>;
  }
> = {
  finance: {
    intro: "Welcome to our comprehensive suite of personal finance, home loan, and investment calculators. These educational tools are designed to help you analyze loan payouts, estimate compound growth curves, calculate monthly EMI payouts, and plan for your long-term wealth goals. Every tool includes transparent mathematical formulas, step-by-step examples, and expert explanations to simplify your calculations.",
    faqs: [
      {
        q: "What is an EMI and how is it calculated?",
        a: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is the principal loan amount, R is the monthly interest rate, and N is the monthly loan tenure.",
      },
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is calculated solely on the principal amount of a loan or deposit. Compound interest is calculated on the principal amount plus any accumulated interest from previous periods, allowing your savings or investment to grow exponentially over time.",
      },
      {
        q: "How does inflation affect my investments?",
        a: "Inflation reduces the purchasing power of your money over time. When evaluating investment returns, you should calculate the 'real rate of return' by subtracting the annual inflation rate from your nominal investment yield to understand its true growth.",
      },
    ],
    relatedCategories: [
      { slug: "math", name: "Math Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  health: {
    intro: "Take control of your wellness, nutrition, and fitness goals with our scientific health calculators. Based on clinical formulas (such as the Harris-Benedict BMR equation and body mass index formulas), these tools enable you to estimate daily calorie requirements, compute your BMI category, determine optimal hydration, and track pregnancy milestones with ease. Always consult a healthcare professional for personalized medical advice.",
    faqs: [
      {
        q: "What is a healthy Body Mass Index (BMI) range?",
        a: "For most adults, a healthy BMI ranges between 18.5 and 24.9. A BMI below 18.5 is categorized as underweight, 25 to 29.9 is considered overweight, and 30 or above is categorized as obese. Note that BMI is an estimate and does not distinguish between muscle mass and fat.",
      },
      {
        q: "What is Basal Metabolic Rate (BMR) and TDEE?",
        a: "BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic life-sustaining functions at rest. TDEE (Total Daily Energy Expenditure) is an estimate of how many calories you burn per day once physical activity is added. Eating fewer calories than your TDEE will result in weight loss.",
      },
      {
        q: "How much water should I drink daily?",
        a: "While a general guideline is eight 8-ounce glasses (about 2 liters) per day, optimal hydration depends on your body weight, activity level, climate, and overall health. Our Water Intake Calculator provides a personalized estimation.",
      },
    ],
    relatedCategories: [
      { slug: "everyday", name: "Everyday Calculators" },
      { slug: "finance", name: "Finance Calculators" },
    ],
  },
  math: {
    intro: "Solve everyday math problems, calculate percentage ratios, and find exact age calculations instantly using our fast math calculators. Designed for students, professionals, and daily problem-solving, these educational math tools take the complexity out of calculations. From fractional percentage increases to exact interval analysis, CalcZen makes math simple and accessible.",
    faqs: [
      {
        q: "How do I calculate a percentage increase?",
        a: "To calculate a percentage increase, subtract the original value from the new value, divide the result by the original value, and then multiply by 100. Formula: Percentage Increase = [(New Value - Original Value) / Original Value] * 100.",
      },
      {
        q: "How do I calculate age exactly?",
        a: "Exact age is calculated by comparing your birth date against the current date, accounting for leap years, variable days in calendar months, and time zones. Our Age Calculator provides your age in years, months, days, hours, and even total minutes.",
      },
      {
        q: "Why are percentage calculators useful?",
        a: "Percentage calculations are used daily in budgeting, tax estimations, sales discounts, scientific metrics, interest rates, and data comparison. They convert raw comparisons into easy-to-understand fractional values.",
      },
    ],
    relatedCategories: [
      { slug: "finance", name: "Finance Calculators" },
      { slug: "everyday", name: "Everyday Calculators" },
    ],
  },
  everyday: {
    intro: "Make quick lifestyle calculations, split restaurant bills, and structure everyday decisions using our highly intuitive lifestyle calculators. Whether you are managing restaurant tipping etiquette, splitting standard group costs, or evaluating daily metrics, these tools are built to save time and prevent calculation stress.",
    faqs: [
      {
        q: "What is the standard tipping rate at restaurants?",
        a: "In the United States and many other regions, a standard tip ranges between 15% and 20% of the pre-tax bill, depending on the quality of service. For exceptional service, 22% or more is common.",
      },
      {
        q: "How can I easily split a bill among friends?",
        a: "Split a bill by dividing the total bill (including tax and tip) by the number of people. Our Tip Calculator handles variable split counts and tip percentages dynamically to make bill-splitting simple.",
      },
      {
        q: "Are lifestyle calculations secure?",
        a: "Yes, all lifestyle calculations on CalcZen are executed locally in your browser. None of your private transaction amounts, billing details, or parameters are sent to our servers, ensuring complete privacy.",
      },
    ],
    relatedCategories: [
      { slug: "health", name: "Health Calculators" },
      { slug: "math", name: "Math Calculators" },
    ],
  },
};

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const list = calculatorsByCategory(cat.slug);
  const data = CATEGORY_LANDING_DATA[cat.slug] || {
    intro: cat.description,
    faqs: [],
    relatedCategories: [],
  };

  return (
    <PageShell>
      <PageContainer>
        <nav
          aria-label="Breadcrumb"
          className="scroll-touch-x flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4"
        >
          <Link to="/" className="shrink-0 hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="text-foreground font-medium truncate">{cat.name}</span>
        </nav>

        <header className="mb-6 sm:mb-8 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {cat.slug === "finance" 
              ? "Personal Finance, Investment, and Loan Calculators"
              : cat.slug === "health"
                ? "Scientific Health, Fitness, and Wellness Calculators"
                : cat.slug === "math"
                  ? "Free Math, Percentage, and Everyday Arithmetic Calculators"
                  : "Useful Lifestyle, Bill Splitting, and Date Calculators"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-4xl leading-relaxed">
            {data.intro}
          </p>
        </header>

        {/* Dynamic Calculator Grid */}
        <section className="min-w-0" aria-label={`${cat.name} Tools`}>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Available {cat.name} Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            {list.map((c, i) => (
              <CalculatorCard key={c.slug} calc={c} index={i} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {data.faqs.length > 0 && (
          <section className="surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 min-w-0 mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              {cat.name} Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={data.faqs} />
          </section>
        )}

        {/* Cross-Category Internal Linking */}
        {data.relatedCategories.length > 0 && (
          <section className="min-w-0 mt-8 sm:mt-12 pt-6 border-t border-border/40">
            <h2 className="font-semibold text-sm sm:text-base text-foreground mb-3">
              Explore More Categories
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {data.relatedCategories.map((rc) => (
                <Link
                  key={rc.slug}
                  to="/category/$slug"
                  params={{ slug: rc.slug }}
                  className="rounded-lg px-4 py-2 text-xs font-semibold border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  {rc.name} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </PageContainer>

      {/* JSON-LD Schemas (FAQPage & BreadcrumbList) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": `https://calczen.com/category/${cat.slug}#webpage`,
                "name": `${cat.name} Calculators | CalcZen`,
                "description": `Browse free online ${cat.name} calculators. Fast, accurate, and easy to use with step-by-step solutions.`,
                "url": `https://calczen.com/category/${cat.slug}`
              },
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "@id": `https://calczen.com/category/${cat.slug}#collection`,
                "name": `${cat.name} Calculators`,
                "description": `Browse our complete list of free online ${cat.name} calculators.`,
                "url": `https://calczen.com/category/${cat.slug}`
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "@id": `https://calczen.com/category/${cat.slug}#faq`,
                "mainEntity": data.faqs.map((f) => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a,
                  },
                })),
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "@id": `https://calczen.com/category/${cat.slug}#breadcrumb`,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://calczen.com",
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": cat.name,
                    "item": `https://calczen.com/category/${cat.slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />
    </PageShell>
  );
}
