import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CalcZen — Free Online Calculators for Finance, Health & Math" },
      {
        name: "description",
        content:
          "About CalcZen: free, accurate online calculators for finance, health, math, and everyday use. Transparent formulas and a clean experience on any device.",
      },
      { property: "og:title", content: "About CalcZen — Free Online Calculators" },
      {
        property: "og:description",
        content:
          "Learn how CalcZen delivers fast, accurate calculator tools with clear methods and a distraction-free experience.",
      },
      { property: "og:url", content: "https://calczen.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <LegalArticle
        title="About CalcZen"
        intro="CalcZen is a free calculator platform for everyday financial, health, and math questions—built to be fast, accurate, and clear about how every result is calculated."
      >
        <LegalSection title="Our mission">
          <p>
            Calculator sites are often cluttered or opaque. CalcZen focuses on what matters: a
            clean interface, standard formulas, and results you can understand—not just copy.
          </p>
          <p>
            Whether you estimate a mortgage payment, check calorie needs, or solve a quick
            percentage, we aim to deliver reliable online calculators that respect your time.
          </p>
        </LegalSection>

        <LegalSection title="What we offer">
          <p>Free calculator tools across four areas:</p>
          <ul>
            <li>
              <strong>Finance</strong> — mortgages, loans, EMI, compound interest, and related
              planning tools
            </li>
            <li>
              <strong>Health</strong> — BMI, calories, BMR, water intake, and wellness estimates
            </li>
            <li>
              <strong>Math</strong> — percentages, ratios, and practical number problems
            </li>
            <li>
              <strong>Everyday</strong> — tips, dates, and other daily helpers
            </li>
          </ul>
          <p>
            See everything on our <Link to="/calculators">all calculators</Link> page or browse by
            category from the homepage.
          </p>
        </LegalSection>

        <LegalSection title="Accuracy and transparency">
          <p>
            Each tool uses widely accepted formulas. Where helpful, we show the math, worked
            examples, and FAQs so you can verify the logic.
          </p>
          <p>
            Results are estimates. Taxes, fees, health conditions, and personal circumstances can
            change real outcomes. Use CalcZen as a starting point—not a substitute for
            professional advice when stakes are high.
          </p>
        </LegalSection>

        <LegalSection title="Built for you">
          <ul>
            <li>
              <strong>Fast</strong> — instant updates as you type, without unnecessary reloads
            </li>
            <li>
              <strong>Mobile-friendly</strong> — works well on phone, tablet, and desktop
            </li>
            <li>
              <strong>No account</strong> — use any calculator immediately; inputs stay in your
              browser during a session
            </li>
            <li>
              <strong>Educational</strong> — we explain the math, especially for finance and health
              topics where context matters
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="How we stay free">
          <p>
            CalcZen is supported by advertising and privacy-conscious analytics. We do not sell
            your personal data. Details on cookies, Google Analytics, and Google AdSense are in our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </LegalSection>

        <LegalSection title="Get in touch">
          <p>
            Suggestions, bug reports, and feedback are welcome on our{" "}
            <Link to="/contact">contact page</Link>. For use limitations, see our{" "}
            <Link to="/disclaimer">Disclaimer</Link> and <Link to="/terms">Terms of Service</Link>.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
