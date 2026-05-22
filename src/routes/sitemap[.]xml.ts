import { createFileRoute } from "@tanstack/react-router";
import { calculators, categories } from "@/data/calculators";

<<<<<<< HEAD
const STATIC_PATHS = [
  "/",
  "/calculators",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/disclaimer",
] as const;
=======
const BASE_URL = "";
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
<<<<<<< HEAD
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
=======
      GET: async () => {
        const entries: { path: string; changefreq: string; priority: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/calculators", changefreq: "weekly", priority: "0.9" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
          ...categories.map((c) => ({ path: `/category/${c.slug}`, changefreq: "weekly", priority: "0.8" })),
          ...calculators.map((c) => ({ path: `/calculator/${c.slug}`, changefreq: "weekly", priority: "0.8" })),
        ];

        const urls = entries.map((e) =>
          `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
>>>>>>> 645b623128585f49216b5fc01c339c8c31f4f4c3
        });
      },
    },
  },
});
