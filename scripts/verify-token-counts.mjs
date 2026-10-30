import fs from 'node:fs';

function countFigmaVars(obj, path = '') {
  const vars = [];
  function walk(node, currentPath) {
    if (!node || typeof node !== 'object') return;
    if ('$type' in node || '$value' in node) {
      vars.push({ path: currentPath, type: node.$type, value: node.$value });
      return;
    }
    for (const key of Object.keys(node)) {
      if (key.startsWith('$')) continue;
      walk(node[key], currentPath ? `${currentPath}.${key}` : key);
    }
  }
  walk(obj, path);
  return vars;
}

const base = JSON.parse(fs.readFileSync('design/tokens/Base/Mode 1.tokens.json', 'utf8'));
const semantic = JSON.parse(fs.readFileSync('design/tokens/Semantic/Mode 1.tokens.json', 'utf8'));
const typo = JSON.parse(fs.readFileSync('design/tokens/Typography/Value.tokens.json', 'utf8'));

const baseVars = countFigmaVars(base);
const semanticVars = countFigmaVars(semantic);
const typoVars = countFigmaVars(typo);

console.log('--- FIGMA TOKENS COUNT ---');
console.log('Base collection:', baseVars.length);
console.log('Semantic collection:', semanticVars.length);
console.log('Typography collection:', typoVars.length);
console.log('TOTAL FIGMA VARIABLES:', baseVars.length + semanticVars.length + typoVars.length);

const mainCss = fs.readFileSync('app/assets/css/main.css', 'utf8');

// Check Spacing variables
console.log('\n--- SPACING MAPPING ---');
const sizes = semanticVars.filter(v => v.path.startsWith('sizes.'));
console.log(`Found ${sizes.length} Semantic spacing variables:`, sizes.map(s => `${s.path.replace('sizes.', '')}=${s.value}px`).join(', '));

// Check Colors in Base
console.log('\n--- COLOR COMPARISON (Base -> CSS) ---');
const baseColors = baseVars.filter(v => v.type === 'color');
console.log(`Found ${baseColors.length} Base colors.`);
let missingColors = 0;
for (const c of baseColors) {
  const cssVarName = '--' + c.path.replace(/\./g, '-');
  if (!mainCss.includes(cssVarName)) {
    console.log(`Missing base color in CSS: ${cssVarName}`);
    missingColors++;
  }
}
if (missingColors === 0) console.log('All Base colors are 100% matched in main.css!');

// Check Semantic Colors
console.log('\n--- SEMANTIC COLOR COMPARISON (Semantic -> CSS) ---');
const semanticColors = semanticVars.filter(v => v.type === 'color');
console.log(`Found ${semanticColors.length} Semantic colors.`);
let missingSemantic = 0;
for (const sc of semanticColors) {
  const cssVarName = '--color-' + sc.path.replace(/\./g, '-').replace('color-', '');
  if (!mainCss.includes(cssVarName)) {
    console.log(`Missing semantic color in CSS: ${cssVarName}`);
    missingSemantic++;
  }
}
if (missingSemantic === 0) console.log('All Semantic colors are 100% matched in main.css!');
