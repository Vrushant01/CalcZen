import { calculators, categories, SLUG_ALIASES } from '../src/data/calculators.ts';

console.log('Categories Count:', categories.length);
categories.forEach(c => console.log(`- ${c.slug}: ${c.name}`));

console.log('\nCalculators Count:', calculators.length);
calculators.forEach((c, idx) => console.log(`${idx + 1}. [${c.category}] ${c.slug}: ${c.name}`));

console.log('\nSlug Aliases Count:', Object.keys(SLUG_ALIASES).length);
