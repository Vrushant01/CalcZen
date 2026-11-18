import fs from 'fs';
import path from 'path';

// Load calculators
const calcFile = fs.readFileSync('src/data/calculators.ts', 'utf8');
const calcArrayText = calcFile.slice(calcFile.indexOf('export const calculators: CalculatorMeta[] = ['));
const slugMatches = [...calcArrayText.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
const uniqueSlugs = [...new Set(slugMatches)];

// Load categories for each calc
const calcCategories = {};
for (const slug of uniqueSlugs) {
  const reg = new RegExp(`slug:\\s*"${slug}"[\\s\\S]*?category:\\s*"([^"]+)"`);
  const m = calcFile.match(reg);
  if (m) {
    calcCategories[slug] = m[1];
  }
}

// Load popular / featured from home
const homeContentFile = fs.readFileSync('src/data/homeContent.ts', 'utf8');
const featuredMatch = homeContentFile.match(/featuredCalculatorSlugs\s*=\s*\[([\s\S]*?)\]/);
const featuredSlugs = featuredMatch ? [...featuredMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]) : [];

// Check popular in calculators.ts
const popularSlugs = [];
for (const slug of uniqueSlugs) {
  const reg = new RegExp(`slug:\\s*"${slug}"[\\s\\S]*?popular:\\s*(true|false)`);
  const m = calcFile.match(reg);
  if (m && m[1] === 'true') {
    popularSlugs.push(slug);
  }
}

// Extract SEMANTIC_RELATION_MAP from CalculatorPageLayout.tsx
const layoutFile = fs.readFileSync('src/components/CalculatorPageLayout.tsx', 'utf8');
const mapStart = layoutFile.indexOf('const SEMANTIC_RELATION_MAP');
const mapEnd = layoutFile.indexOf('};', mapStart);
const mapText = layoutFile.slice(mapStart, mapEnd + 2);

// Evaluate or parse map
const semanticMap = {};
const keyBlocks = [...mapText.matchAll(/"([^"]+)":\s*\[([\s\S]*?)\]/g)];
for (const kb of keyBlocks) {
  const key = kb[1];
  const targets = [...kb[2].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  semanticMap[key] = targets;
}

// For each calculator, compute what its "Related Calculators" component links to:
function getRelatedForCalc(slug) {
  const cat = calcCategories[slug];
  const semantic = semanticMap[slug] || [];
  const semanticItems = semantic.filter(s => uniqueSlugs.includes(s) && s !== slug);
  const categoryMatches = uniqueSlugs.filter(s => calcCategories[s] === cat && s !== slug && !semanticItems.includes(s));
  return [...semanticItems, ...categoryMatches].slice(0, 5);
}

// Count inbound links for every calculator:
// 1. Homepage: popular (top 8) or featured
// 2. Category page: 1 link from its category page
// 3. Related calculators: from other calculators' related list
const inbound = {};
for (const slug of uniqueSlugs) {
  inbound[slug] = {
    total: 0,
    fromHome: false,
    fromCategory: true, // each belongs to a category
    fromRelated: [],
  };
}

for (const slug of uniqueSlugs) {
  if (popularSlugs.includes(slug) || featuredSlugs.includes(slug)) {
    inbound[slug].fromHome = true;
    inbound[slug].total += 1;
  }
  // 1 from category page
  inbound[slug].total += 1;
}

// Related component on each calculator page
for (const sourceSlug of uniqueSlugs) {
  const relList = getRelatedForCalc(sourceSlug);
  for (const targetSlug of relList) {
    if (inbound[targetSlug]) {
      inbound[targetSlug].fromRelated.push(sourceSlug);
      inbound[targetSlug].total += 1;
    }
  }
}

console.log(`Audited ${uniqueSlugs.length} calculators for inbound links:\n`);
const lowInbound = [];
for (const slug of uniqueSlugs) {
  const data = inbound[slug];
  if (data.total < 3) {
    lowInbound.push({ slug, ...data });
  }
  console.log(`${slug.padEnd(42)}: total=${data.total} (home=${data.fromHome}, cat=${data.fromCategory}, relatedFrom=${data.fromRelated.length})`);
}

console.log(`\n========================================`);
console.log(`Calculators with fewer than 3 inbound links: ${lowInbound.length}`);
lowInbound.forEach(l => console.log(`- ${l.slug}: total=${l.total} (related: ${l.fromRelated.join(', ') || 'none'})`));
