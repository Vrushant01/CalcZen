<<<<<<< HEAD
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";
=======
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
<<<<<<< HEAD
      { title: "Disclaimer — Calculator Use & Limitations | CalcZen" },
      {
        name: "description",
        content:
          "CalcZen Disclaimer: free online calculators are for informational use only—not financial, medical, or legal advice. Read before relying on results.",
      },
      { property: "og:title", content: "CalcZen Disclaimer" },
      {
        property: "og:description",
        content: "Important limits on how CalcZen finance, health, and math calculator results should be used.",
      },
=======
      { title: "Disclaimer | CalcVerse" },
      { name: "description", content: "Important information about how CalcVerse calculators should be used." },
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
<<<<<<< HEAD
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
=======
  component: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Disclaimer</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>CalcVerse calculators are provided for informational and educational purposes only. While we strive for accuracy, results should not be relied upon as a substitute for professional advice.</p>
          <p>For financial decisions, consult a licensed financial planner or accountant. For health-related questions, talk to a qualified healthcare provider. CalcVerse is not liable for any decisions made based on the calculators on this site.</p>
        </div>
      </div>
    </PageShell>
  ),
});
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
