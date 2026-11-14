import fs from "fs";
import path from "path";
import { calculators } from "../src/data/calculators.ts";

const validSlugs = new Set(calculators.map((c) => c.slug));

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

const files = [...walk("src/data"), ...walk("src/calculators")];
const linkRegex = /href=["'](\/calculator\/([^"'/]+))["']/g;
const broken = [];
const allLinks = [];

for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const fullHref = match[1];
    const slug = match[2];
    allLinks.push({ file: f, href: fullHref, slug });
    if (!validSlugs.has(slug)) {
      broken.push({ file: f, href: fullHref, slug });
    }
  }
}

console.log(`Total calculator links found: ${allLinks.length}`);
console.log(`Broken links count: ${broken.length}`);
if (broken.length > 0) {
  console.log("Broken links:", broken);
}
console.log("\nSample links found (first 20):");
for (const l of allLinks.slice(0, 20)) {
  console.log(`[${path.basename(l.file)}] ${l.href}`);
}
