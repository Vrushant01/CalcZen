import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Calculator Use & Limitations | CalcZen" },
      { name: "description", content: "Read the CalcZen disclaimer regarding our free online calculators. Understand the limitations, informational intent, and terms of calculator results." },
      { property: "og:title", content: "CalcZen Disclaimer" },
      { property: "og:description", content: "Read the CalcZen disclaimer regarding our free online calculators. Understand the limitations, informational intent, and terms of calculator results." },
      { name: "twitter:description", content: "Read the CalcZen disclaimer regarding our free online calculators. Understand the limitations, informational intent, and terms of calculator results." },
      { property: "og:url", content: "https://calczen.com/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.com/disclaimer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Disclaimer — Calculator Use & Limitations | CalcZen",
          "description": "Read the CalcZen disclaimer regarding our free online calculators. Understand the limitations, informational intent, and terms of calculator results.",
          "url": "https://calczen.com/disclaimer"
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://calczen.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Disclaimer",
              "item": "https://calczen.com/disclaimer"
            }
          ]
        }),
      }
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PageShell>
      <LegalArticle
        title="Disclaimer"
        lastUpdated="May 2026"
        intro="CalcZen calculators help you estimate and learn—they are not a substitute for professional advice. Please read these limits before using finance, health, or math tools on this site."
      >
        <LegalSection title="Informational use only">
          <p>
            All calculators and content are for <strong>general information and education</strong>.
            They help you explore scenarios and understand formulas—not personalized professional
            guidance.
          </p>
          <p>
            By using CalcZen, you agree to this Disclaimer, our{" "}
            <Link to="/terms">Terms of Service</Link>, and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </LegalSection>

        <LegalSection title="Not professional advice">
          <p>Calculator results do not constitute:</p>
          <ul>
            <li>Financial, investment, tax, or accounting advice</li>
            <li>Medical, nutritional, or mental health advice</li>
            <li>Legal advice or any regulated professional service</li>
          </ul>
          <p>
            Consult a qualified professional—financial adviser, accountant, physician, dietitian, or
            attorney—before important decisions in those areas.
          </p>
        </LegalSection>

        <LegalSection title="Accuracy and limitations">
          <p>We use recognized formulas and clear explanations, but:</p>
          <ul>
            <li>Results depend on the values you enter</li>
            <li>Fees, taxes, regional rules, and personal circumstances may differ</li>
            <li>Health estimates are population-level guides, not diagnoses</li>
            <li>Occasional software or browser issues may affect output</li>
          </ul>
          <p>
            We do not guarantee completeness or suitability for your situation.{" "}
            <strong>Verify important figures independently.</strong>
          </p>
        </LegalSection>

        <LegalSection title="Finance calculators">
          <p>
            Mortgage, loan EMI, and compound interest tools produce planning estimates. They may
            omit insurance, closing costs, variable rates, penalties, or tax treatment. Do not rely
            solely on CalcZen for binding financial commitments.
          </p>
        </LegalSection>

        <LegalSection title="Health calculators">
          <p>
            BMI, BMR, calorie, and water tools are not medical devices. Individual needs vary.
            Speak with a healthcare provider for medical conditions, pregnancy, or major diet or
            fitness changes.
          </p>
        </LegalSection>

        <LegalSection title="Math and everyday tools">
          <p>
            Math and general calculators are convenience aids. Double-check when precision
            matters—contracts, billing, payroll, or compliance.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, CalcZen disclaims liability for loss or harm
            from use of the site or reliance on results—including financial, health, or business
            outcomes. Use is at your own risk.
          </p>
        </LegalSection>

        <LegalSection title="External links">
          <p>
            Third-party links are for convenience. We do not endorse or control external content,
            products, or services.
          </p>
        </LegalSection>

        <LegalSection title="Updates and contact">
          <p>
            We may revise this Disclaimer; the date above reflects the latest version. Continued use
            means you accept updates.
          </p>
          <p>
            Questions? <Link to="/contact">Contact us</Link> or read{" "}
            <Link to="/about">About CalcZen</Link>.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
