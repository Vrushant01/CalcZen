import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Using CalcZen Calculators" },
      {
        name: "description",
        content:
          "CalcZen Terms of Service: rules for using our free online calculators, including educational use, accuracy limits, intellectual property, and liability.",
      },
      { property: "og:title", content: "CalcZen Terms of Service" },
      {
        property: "og:description",
        content: "Terms governing your use of CalcZen free finance, health, and math calculator tools.",
      },
      { property: "og:url", content: "https://calczen.com/terms" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <LegalArticle
        title="Terms of Service"
        lastUpdated="May 2026"
        intro="These Terms govern your use of CalcZen—including all free online calculators and related content. By using the site, you agree to these Terms."
      >
        <LegalSection title="About CalcZen">
          <p>
            CalcZen provides free calculator tools for finance, health, math, and everyday use,
            for informational and educational purposes. These Terms apply to all visitors.
          </p>
        </LegalSection>

        <LegalSection title="Acceptable use">
          <p>You agree to use CalcZen lawfully. You must not:</p>
          <ul>
            <li>Violate applicable laws or regulations</li>
            <li>Disrupt, overload, scrape, or reverse-engineer the site without permission</li>
            <li>Redistribute substantial content or tools commercially without authorization</li>
            <li>Use automated extraction that harms performance or other users</li>
            <li>Introduce malware or attempt unauthorized access</li>
          </ul>
        </LegalSection>

        <LegalSection title="Educational purpose">
          <p>
            Calculators produce <strong>estimates from your inputs</strong> and standard formulas on
            each page. They help you explore scenarios—not replace professional judgment.
          </p>
          <p>
            Nothing on CalcZen is financial, investment, tax, legal, or medical advice. See our{" "}
            <Link to="/disclaimer">Disclaimer</Link>.
          </p>
        </LegalSection>

        <LegalSection title="Accuracy">
          <p>
            We work to keep formulas and logic correct, but we do not warrant that any calculator or
            result is complete, error-free, or right for your situation.
          </p>
          <p>
            Verify important results and seek professional advice when decisions have significant
            financial, legal, or health consequences.
          </p>
        </LegalSection>

        <LegalSection title="Your responsibility">
          <p>
            You are responsible for how you use CalcZen and any decisions based on calculator
            output. Confirm critical figures independently before acting on them.
          </p>
        </LegalSection>

        <LegalSection title="Intellectual property">
          <p>
            Site content—text, design, branding, layout, and calculator presentation—is protected by
            applicable intellectual property laws unless otherwise noted.
          </p>
          <p>
            Personal, non-commercial use is permitted in line with these Terms. Commercial copying,
            modification, or distribution requires prior written permission, except as allowed by law.
          </p>
          <p>
            Third-party names and trademarks belong to their owners. References to analytics or ad
            providers do not imply endorsement.
          </p>
        </LegalSection>

        <LegalSection title="Third-party links">
          <p>
            External links and services (analytics, advertising, etc.) are not controlled by
            CalcZen. Use them at your own risk under their terms and policies.
          </p>
        </LegalSection>

        <LegalSection title="Availability">
          <p>
            We aim for reliable access but do not guarantee uninterrupted service. We may modify,
            suspend, or remove any calculator or feature without notice. Maintenance or events
            beyond our control may affect availability.
          </p>
        </LegalSection>

        <LegalSection title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, CalcZen is not liable for indirect, incidental,
            special, consequential, or punitive damages from your use—including loss of profits,
            data, or goodwill—even if advised of the possibility.
          </p>
          <p>
            Total liability for any claim shall not exceed the greater of (a) amounts you paid us in
            the twelve months before the claim (typically zero) or (b) one hundred U.S. dollars
            (USD $100), where permitted.
          </p>
        </LegalSection>

        <LegalSection title="Indemnification">
          <p>
            You agree to indemnify CalcZen from claims arising from your misuse of the site or
            violation of these Terms, to the extent permitted by law.
          </p>
        </LegalSection>

        <LegalSection title="Privacy">
          <p>
            Data practices are described in our <Link to="/privacy">Privacy Policy</Link>, incorporated
            into these Terms by reference.
          </p>
        </LegalSection>

        <LegalSection title="Changes, governing law, and contact">
          <p>
            We may update these Terms; the date above reflects the latest version. Continued use
            means acceptance. Material changes may be noted on the site where practical.
          </p>
          <p>
            These Terms are governed by applicable laws where CalcZen operates, without regard to
            conflict-of-law rules, subject to mandatory consumer protections in your country.
          </p>
          <p>
            Questions? Visit our <Link to="/contact">contact page</Link>.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
