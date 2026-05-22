<<<<<<< HEAD
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — How CalcZen Handles Your Data" },
      {
        name: "description",
        content:
          "CalcZen Privacy Policy: what data we collect, cookies, Google Analytics, Google AdSense, your rights, and how we protect information when you use our free online calculators.",
      },
      { property: "og:title", content: "CalcZen Privacy Policy" },
      {
        property: "og:description",
        content: "How CalcZen handles data, cookies, analytics, and advertising on our calculator platform.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <LegalArticle
        title="Privacy Policy"
        lastUpdated="May 2026"
        intro="This policy explains how CalcZen collects, uses, and protects information when you use our website and free online calculators. We aim to be transparent and handle data responsibly."
      >
        <LegalSection title="Overview">
          <p>
            You can use CalcZen without an account. Calculator inputs are processed in your
            browser; we do not require you to submit personal financial or health data to use our
            tools.
          </p>
          <p>
            Like most websites, we use limited technical data and cookies to operate the site,
            understand usage, and (where enabled) display advertising that helps keep our calculators
            free.
          </p>
        </LegalSection>

        <LegalSection title="Information we collect">
          <h3>What you provide</h3>
          <ul>
            <li>Name, email, and message when you use our contact form</li>
            <li>Email if you subscribe to a newsletter (unsubscribe anytime)</li>
          </ul>

          <h3>What is collected automatically</h3>
          <p>We or our providers may receive:</p>
          <ul>
            <li>Browser, device, and operating system type</li>
            <li>Pages viewed, referral source, and general usage patterns</li>
            <li>IP address (often truncated or anonymized by analytics)</li>
            <li>Cookie identifiers, where applicable</li>
          </ul>
          <p>
            We do not intentionally collect sensitive personal data through calculator use. Avoid
            entering information you do not want processed in your browser session.
          </p>
        </LegalSection>

        <LegalSection title="How we use information">
          <ul>
            <li>Operate and improve CalcZen and our accurate calculator tools</li>
            <li>Respond to contact and newsletter requests</li>
            <li>Understand which calculators are most useful (analytics)</li>
            <li>Display and measure advertising, where applicable</li>
            <li>Protect against abuse, fraud, and technical issues</li>
            <li>Meet legal obligations</li>
          </ul>
          <p>
            <strong>We do not sell your personal information</strong> to third parties for their
            marketing purposes.
          </p>
        </LegalSection>

        <LegalSection title="Cookies">
          <p>
            Cookies are small files stored on your device. CalcZen and partners may use them for
            preferences, traffic measurement, and advertising.
          </p>
          <ul>
            <li>
              <strong>Essential</strong> — basic functionality (e.g. theme or security features)
            </li>
            <li>
              <strong>Analytics</strong> — aggregated understanding of how the site is used
            </li>
            <li>
              <strong>Advertising</strong> — deliver and measure ads; may support relevance in some
              cases
            </li>
          </ul>
          <p>
            Control or delete cookies in your browser settings. Blocking some cookies may limit
            certain features.
          </p>
        </LegalSection>

        <LegalSection title="Analytics">
          <p>
            We may use <strong>Google Analytics</strong> or similar services for aggregated usage
            statistics—such as which finance, health, or math calculator pages are visited.
          </p>
          <p>
            Data is used in summary form to improve content and performance. Where supported, we
            use settings intended to reduce individual identification (e.g. IP anonymization).
          </p>
        </LegalSection>

        <LegalSection title="Advertising and Google AdSense">
          <p>
            CalcZen may show ads from <strong>Google AdSense</strong> or other partners to help
            cover costs. Partners may use cookies to:
          </p>
          <ul>
            <li>Serve ads on CalcZen and other sites you visit</li>
            <li>Measure performance and prevent fraud</li>
            <li>Show more relevant ads depending on your settings</li>
          </ul>
          <p>
            Google and its partners may use advertising cookies based on your visit here and
            elsewhere. Learn more via Google’s privacy and ads settings; you may opt out of
            personalized ads through your Google Account or industry tools where available.
          </p>
          <p>Ad vendors are responsible for their own practices—review their policies when relevant.</p>
        </LegalSection>

        <LegalSection title="Third-party services">
          <p>
            We may use providers for hosting, analytics, email, and advertising. They process data
            on our behalf under their terms and applicable law.
          </p>
          <p>
            External links are not under our control. Review their privacy policies before sharing
            personal information.
          </p>
        </LegalSection>

        <LegalSection title="Retention and security">
          <p>
            We keep information only as long as needed—for example, contact messages for a
            reasonable response period, or analytics in aggregated form for trends.
          </p>
          <p>
            We apply reasonable measures against unauthorized access or misuse. No internet
            transmission is completely secure; we cannot guarantee absolute security.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access, correct, or delete certain personal information</li>
            <li>Object to or restrict some processing</li>
            <li>Withdraw consent (e.g. marketing emails)</li>
          </ul>
          <p>
            Contact us via the <Link to="/contact">contact page</Link>. We respond within a
            reasonable timeframe.
          </p>
        </LegalSection>

        <LegalSection title="Children and international visitors">
          <p>
            CalcZen is for a general audience. We do not knowingly collect personal information
            from children under 13 (or the applicable age in your region). Contact us if you believe
            a child has submitted data.
          </p>
          <p>
            If you access the site from abroad, data may be processed where our providers operate,
            subject to this policy.
          </p>
        </LegalSection>

        <LegalSection title="Policy updates and contact">
          <p>
            We may update this policy; the date above will change. Continued use after updates means
            you accept the revised policy.
          </p>
          <p>
            Privacy questions: <Link to="/contact">contact us</Link>. Use of the site is also
            governed by our <Link to="/terms">Terms of Service</Link>.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  );
}
=======
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

const make = (title: string, desc: string, body: React.ReactNode, slug: string) =>
  createFileRoute(slug as never)({
    head: () => ({
      meta: [
        { title: `${title} | CalcVerse` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: slug },
      ],
      links: [{ rel: "canonical", href: slug }],
    }),
    component: () => (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">{body}</div>
        </div>
      </PageShell>
    ),
  });

export const Route = make(
  "Privacy Policy",
  "How CalcVerse handles data, cookies and analytics.",
  <>
    <p>CalcVerse respects your privacy. We don't require an account to use any calculator, and inputs you enter stay in your browser unless you choose to share a result.</p>
    <p>We use privacy-friendly analytics to understand which calculators are most useful and a small number of advertising partners (such as Google AdSense) to keep CalcVerse free. These partners may set cookies in your browser; you can control them through your browser settings or our cookie banner.</p>
    <p>Email addresses submitted through our newsletter form are stored securely and used only to send the CalcVerse newsletter. You can unsubscribe at any time.</p>
    <p>For questions about your data, contact us via the <a href="/contact" className="text-accent">contact page</a>.</p>
  </>,
  "/privacy",
);
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
