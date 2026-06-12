import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { LegalArticle } from "@/components/LegalArticle";
import { LegalSection } from "@/components/LegalSection";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — How CalcZen Handles Your Data" },
      { name: "description", content: "Read the CalcZen Privacy Policy to learn how we handle cookies, Google Analytics, Google AdSense, data protection, and your personal privacy rights." },
      { property: "og:title", content: "CalcZen Privacy Policy" },
      { property: "og:description", content: "Read the CalcZen Privacy Policy to learn how we handle cookies, Google Analytics, Google AdSense, data protection, and your personal privacy rights." },
      { name: "twitter:description", content: "Read the CalcZen Privacy Policy to learn how we handle cookies, Google Analytics, Google AdSense, data protection, and your personal privacy rights." },
      { property: "og:url", content: "https://calczen.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://calczen.com/privacy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy — How CalcZen Handles Your Data",
          "description": "Read the CalcZen Privacy Policy to learn how we handle cookies, Google Analytics, Google AdSense, data protection, and your personal privacy rights.",
          "url": "https://calczen.com/privacy"
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
              "name": "Privacy Policy",
              "item": "https://calczen.com/privacy"
            }
          ]
        }),
      }
    ],
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
