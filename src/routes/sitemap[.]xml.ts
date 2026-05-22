import { createFileRoute } from "@tanstack/react-router";
import { calculators, categories } from "@/data/calculators";

const STATIC_PATHS = [
  "/",
  "/calculators",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/disclaimer",
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const paths = [
          ...STATIC_PATHS,
          ...categories.map((c) => `/category/${c.slug}`),
          ...calculators.map((c) => `/calculator/${c.slug}`),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
