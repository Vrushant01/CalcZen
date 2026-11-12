import fs from 'fs';

const reg = fs.readFileSync('src/calculators/registry.ts', 'utf8');
const regex = /"([^"]+)":\s*lazy\(\(\)\s*=>\s*import\("@\/calculators\/([^"]+)"\)/g;
let m;
const registered = [];
while ((m = regex.exec(reg)) !== null) {
  registered.push({ slug: m[1], file: m[2] });
}
console.log('Total registered routes in registry.ts:', registered.length);
const uniqueFiles = new Set(registered.map(r => r.file));
console.log('Unique files registered:', uniqueFiles.size);
console.log(Array.from(uniqueFiles).sort());

