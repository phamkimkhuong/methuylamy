import fs from 'node:fs';
const specs = JSON.parse(fs.readFileSync('scratch/portfolio-koc-detailed-specs.json', 'utf8'));

specs.forEach(s => {
  s.texts.forEach(t => {
    const txt = t.characters.trim();
    if (txt.toLowerCase().includes('liên') || txt.toLowerCase().includes('hợp tác')) {
      console.log(`[${s.name} - ${s.id}] "${txt}" | size: ${t.fontSize}px, color: ${t.color}, lh: ${t.lineHeightPx}px, w: ${t.fontWeight}`);
    }
  });
});
