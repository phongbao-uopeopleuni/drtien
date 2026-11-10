import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const { profile } = JSON.parse(readFileSync(new URL('../src/data/portfolio-content.seed.json', import.meta.url), 'utf8'));
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const words = profile.name.split(' ');
const lines = [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f8f7f2"/>
<rect x="900" y="45" width="260" height="540" rx="130" fill="#e5e9df" stroke="#d9dfd0"/>
<circle cx="1030" cy="268" r="95" fill="none" stroke="#bdc6b4"/>
<circle cx="1030" cy="268" r="86" fill="none" stroke="#cbd2c1"/>
<circle cx="78" cy="79" r="5" fill="#738567"/>
<text x="101" y="84" font-family="Arial,sans-serif" font-size="15" letter-spacing="2" fill="#606b60">A RESEARCH PORTFOLIO</text>
<text x="67" y="230" font-family="Georgia,serif" font-size="83" fill="#263c32">${escape(lines[0])}</text>
<text x="67" y="330" font-family="Georgia,serif" font-size="92" font-style="italic" fill="#728168">${escape(lines[1])}<tspan fill="#79613e">.</tspan></text>
<rect x="72" y="375" width="192" height="43" rx="21.5" fill="#e5e9df" stroke="#cdd5c3"/>
<text x="87" y="403" font-family="Arial,sans-serif" font-size="20" fill="#42533b">${escape(profile.currentTitle)}</text>
<text x="72" y="457" font-family="Arial,sans-serif" font-size="19" fill="#4e5b53">${escape(profile.tagline)}</text>
<path d="M72 502h737" stroke="#dedfd4"/>
<text x="72" y="544" font-family="Arial,sans-serif" font-size="16" fill="#606b60">${escape(profile.affiliation)}</text>
<text x="1030" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" letter-spacing="2" fill="#5b695b">INFECTION BIOLOGY</text>
<text x="1020" y="314" text-anchor="middle" font-family="Georgia,serif" font-size="132" letter-spacing="-9" fill="#263c32">bt<tspan fill="#8f7854">.</tspan></text>
<text x="1030" y="420" text-anchor="middle" font-family="Georgia,serif" font-size="27" fill="#263c32">Host. Virus.</text>
<text x="1030" y="455" text-anchor="middle" font-family="Georgia,serif" font-size="27" font-style="italic" fill="#68775b">Response.</text>
<path d="M965 490h130" stroke="#bdc6b4"/>
<text x="1030" y="522" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="1.5" fill="#5b695b">RESEARCH FOLIO / 01</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('../public/social-card.png', import.meta.url)));
console.log('Generated public/social-card.png (1200 × 630).');
