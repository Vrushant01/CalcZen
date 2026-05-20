import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | CalcVerse" },
      { name: "description", content: "The terms governing your use of CalcVerse calculators." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>By using CalcVerse you agree to use our calculators responsibly. Results are estimates intended for informational purposes; they are not financial, medical or legal advice.</p>
          <p>You may not scrape, redistribute, or republish CalcVerse content without permission. The CalcVerse name, logo and design are owned by CalcVerse.</p>
          <p>We may update these terms from time to time. Continued use of the site after changes means you accept the new terms.</p>
        </div>
      </div>
    </PageShell>
  ),
});
