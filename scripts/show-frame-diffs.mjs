import fs from 'node:fs';

const targetFrame = process.argv[2];
const audit = JSON.parse(fs.readFileSync('scratch/real-dom-computed-audit.json', 'utf8'));

for (const f of audit.frames) {
  if (targetFrame && !f.frameName.toLowerCase().includes(targetFrame.toLowerCase()) && !f.frameId.includes(targetFrame)) {
    continue;
  }
  const failed = (f.nodes || []).filter(n => n.status === 'FAIL');
  const passed = (f.nodes || []).filter(n => n.status === 'PASS');
  console.log(`\n======================================================`);
  console.log(`FRAME: ${f.frameName} (${f.frameId}) -> ${passed.length} PASS, ${failed.length} FAIL`);
  console.log(`======================================================`);
  failed.forEach((node, idx) => {
    console.log(`\n[${idx + 1}] Text: "${node.text}" | Tag: <${node.tagName}>`);
    console.log(`    Figma: color=${node.figma.color}, size=${node.figma.fontSize}px, lh=${node.figma.lineHeight}px, weight=${node.figma.fontWeight}`);
    if (node.dom) {
      console.log(`    DOM:   color=${node.dom.color}, size=${node.dom.fontSize}px, lh=${node.dom.lineHeight}px, weight=${node.dom.fontWeight}, lines=${node.dom.lineCount}`);
    }
    console.log(`    Diffs:`);
    node.diffs.forEach(d => console.log(`      - ${d}`));
  });
}
