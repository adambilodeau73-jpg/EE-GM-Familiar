// harvest_cg.mjs — v0.4.0: lift the reference catalogs out of the Character
// Generator so both tools share one truth. Reads the CG's single-file build
// (the sibling repo clone) and emits data/refs.json: compact spell/power,
// feat, and skill entries for the GMF's hover layer.
// Usage: node tools/harvest_cg.mjs [path-to-CG-index.html]
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const src = process.argv[2] || '../EE-Character-Generator/index.html';
const html = readFileSync(src, 'utf8');

// SPELLS_DB: minified JSON, but it carries at least one literal newline —
// bracket-match from the opening '[' (string-aware) instead of trusting lines.
function matchArray(startMarker) {
  const at = html.indexOf(startMarker);
  const open = html.indexOf('[', at);
  let depth = 0, inStr = false, esc = false;
  for (let p = open; p < html.length; p++) {
    const c = html[p];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return html.slice(open, p + 1);
  }
  throw new Error('unterminated array after ' + startMarker);
}
const spellsFull = JSON.parse(matchArray('const SPELLS_DB = '));
const spells = spellsFull.map(s => ({ n: s.name, l: s._levelRaw || '', d: (s.d || '').slice(0, 650) + ((s.d || '').length > 650 ? '…' : '') }));

// FEATS_DB / SKILLS: JS object literals — evaluate the slices in a bare VM.
function sliceArray(marker) {
  const i = html.indexOf(marker);
  const j = html.indexOf('\n];', i);
  return html.slice(i + marker.length - 1, j + 2); // keep the brackets
}
const featsFull = vm.runInNewContext('(' + sliceArray('const FEATS_DB = [') + ')');
const feats = featsFull.map(f => ({ n: f.n, pre: f.prereqs_text || '', d: (f.d || '').slice(0, 500) + ((f.d || '').length > 500 ? '…' : '') }));
const skillsFull = vm.runInNewContext('(' + sliceArray('const SKILLS = [') + ')');
const skills = skillsFull.map(s => ({ n: s.n, k: s.k, req: s.req || '' }));

writeFileSync('data/refs.json', JSON.stringify({ _meta: { harvested: new Date().toISOString().slice(0, 10), from: 'EE-Character-Generator index.html' }, spells, feats, skills }, null, 0));
console.log(`refs.json: ${spells.length} spells/powers · ${feats.length} feats · ${skills.length} skills`);
