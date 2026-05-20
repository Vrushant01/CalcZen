import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer | CalcVerse" },
      { name: "description", content: "Important information about how CalcVerse calculators should be used." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
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
