import fs from "fs";

const pages = [
  "loan-emi-calculator",
  "age-calculator",
  "water-intake-calculator",
  "gold-making-charges-calculator",
  "calorie-calculator",
];

for (const slug of pages) {
  const filePath = `dist/calculator/${slug}/index.html`;
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING: ${filePath}`);
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "NONE";

  const descMatch = html.match(
    /<meta name="description" content="([^"]+)"\s*\/?>/
  );
  const desc = descMatch ? descMatch[1] : "NONE";

  const canonicalMatch = html.match(
    /<link rel="canonical" href="([^"]+)"\s*\/?>/
  );
  const canonical = canonicalMatch ? canonicalMatch[1] : "NONE";

  const ldJsonMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  );
  let faqSchemaValid = false;
  let faqCount = 0;
  if (ldJsonMatch) {
    for (const tag of ldJsonMatch) {
      const inner = tag
        .replace('<script type="application/ld+json">', "")
        .replace("</script>", "");
      try {
        const parsed = JSON.parse(inner);
        if (parsed["@type"] === "FAQPage") {
          faqSchemaValid = true;
          faqCount = parsed.mainEntity ? parsed.mainEntity.length : 0;
        }
      } catch (e) {
        console.error(`Invalid JSON-LD in ${slug}:`, e.message);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Slug: ${slug}`);
  console.log(`Title (${title.length} chars): ${title}`);
  console.log(`Desc (${desc.length} chars): ${desc}`);
  console.log(`Canonical: ${canonical}`);
  console.log(
    `FAQPage Schema Valid: ${faqSchemaValid} (${faqCount} questions)`
  );
  console.log(
    `Has article/FAQ content: ${html.includes("Frequently Asked Questions")}`
  );
}
