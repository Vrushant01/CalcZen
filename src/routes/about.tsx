import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CalcVerse — Our Mission & Story" },
      { name: "description", content: "Learn about CalcVerse — a calmer, more accurate way to do everyday math online." },
      { property: "og:title", content: "About CalcVerse" },
      { property: "og:description", content: "Learn about CalcVerse — a calmer, more accurate way to do everyday math online." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
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
