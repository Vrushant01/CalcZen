import fs from "fs";

const clusters = {
  jewellery: [
    "gold-making-charges-calculator",
    "gold-jewellery-bill-calculator",
    "old-gold-exchange-value-calculator",
    "gold-loan-against-jewellery-calculator",
    "diamond-jewellery-price-calculator",
    "silver-jewellery-bill-calculator",
    "jewellery-budget-to-weight-calculator",
    "gold-purity-karat-converter",
  ],
  construction: ["rcc-price-calculator", "cement-bag-calculator"],
  electricity: [
    "appliance-electricity-cost-calculator",
    "home-electricity-bill-calculator",
    "ac-electricity-cost-calculator",
  ],
  finance: [
    "loan-emi-calculator",
    "mortgage-calculator",
    "compound-interest-calculator",
    "sip-calculator",
    "fd-calculator",
  ],
};

for (const [cluster, slugs] of Object.entries(clusters)) {
  console.log(`=== Cluster: ${cluster} ===`);
  for (const slug of slugs) {
    const file = `src/data/content/${slug}.ts`;
    if (!fs.existsSync(file)) {
      console.log(`  [MISSING FILE] ${slug}`);
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    const matches = [
      ...text.matchAll(/href=["'](\/calculator\/[^"']+)["']/g),
    ].map((m) => m[1]);
    console.log(`  ${slug} -> ${matches.length} links: ${matches.join(", ")}`);
  }
}
