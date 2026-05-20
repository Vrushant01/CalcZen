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
