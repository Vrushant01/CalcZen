import fs from 'fs';

const html = fs.readFileSync('dist/tools/index.html', 'utf8');
const robots = html.match(/<meta\s+name=["']robots["'][^>]*>/i);
const jsonLd = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>/i);
const canonical = html.match(/<link\s+rel=["']canonical["'][^>]*>/i);
const hasAds = html.includes('adsbygoogle') || html.includes('data-ad-slot');

console.log('Tools robots tag:', robots ? robots[0] : 'NONE');
console.log('Tools JSON-LD script:', jsonLd ? jsonLd[0] : 'NONE (Clean)');
console.log('Tools canonical tag:', canonical ? canonical[0] : 'NONE');
console.log('Tools has ads:', hasAds);
