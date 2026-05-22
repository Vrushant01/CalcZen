<<<<<<< HEAD
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";
=======
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
<<<<<<< HEAD
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
=======
      { title: "About CalcVerse — Our Mission & Story" },
      { name: "description", content: "Learn about CalcVerse — a calmer, more accurate way to do everyday math online." },
      { property: "og:title", content: "About CalcVerse" },
      { property: "og:description", content: "Learn about CalcVerse — a calmer, more accurate way to do everyday math online." },
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
<<<<<<< HEAD
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
=======
  component: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About CalcVerse</h1>
        <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
          <p>CalcVerse exists because the internet's calculators have grown noisy. Pop-ups, paywalls, and pages buried under ads make it hard to get a clean answer to a simple question: <em>What will my mortgage cost? Am I drinking enough water? How much should I tip?</em></p>
          <p>We build calculators that load fast, show their work, and respect your time. Every tool publishes its formula and an example, so you can trust the result and learn the math behind it.</p>
          <p>We're a small team of engineers and designers based across the US and UK, and we're adding new tools every week.</p>
        </div>
      </div>
    </PageShell>
  ),
});
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
