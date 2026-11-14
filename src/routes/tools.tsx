import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";

export const Route = createFileRoute("/tools")({
  head: () => {
    const title = "Tools - Coming Soon | CalcZen";
    const description = "We're building a set of free tools. Coming soon.";
    const url = "https://www.calczen.in/tools";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center select-none"
      >
        <h1 className="sr-only">Tools</h1>
        <p className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground">
          Coming Soon
        </p>
      </motion.div>
    </PageShell>
  );
}
