// build.mjs — inject data/bestiary.json into the template → gmf.html (single-file doctrine).
import { readFileSync, writeFileSync } from 'node:fs';
const tpl = readFileSync('src/gmf.template.html', 'utf8');
const data = JSON.parse(readFileSync('data/bestiary.json', 'utf8'));
const refs = JSON.parse(readFileSync('data/refs.json', 'utf8'));
const crcalc = JSON.parse(readFileSync('data/crcalc.json', 'utf8'));
// Adam's CR errata (hot-45 review): the DISPLAY follows the ruling too —
// the card's chips and filters price at the ruled CR, with provenance in
// the challenge-rating line and the calculus row's errata chip.
const errata = JSON.parse(readFileSync('data/errata.json', 'utf8')).cr;
for (const [key, e] of Object.entries(errata)) {
  const [fam, vi] = [key.slice(0, key.lastIndexOf('#')), +key.slice(key.lastIndexOf('#') + 1)];
  const f = data.entries.find(x => x.parent === fam);
  const v = f?.variants[vi];
  if (!v) { console.warn(`errata key not found: ${key}`); continue; }
  v.cr = e.cr;
  v.challenge_rating = `${e.cr} (Adam's errata ${e.ruled}; FF prints ${e.was})`;
  f.crMin = Math.min(...f.variants.map(x => x.cr).filter(x => x != null));
  f.crMax = Math.max(...f.variants.map(x => x.cr).filter(x => x != null));
}
const payload = JSON.stringify(data.entries);
const refPayload = JSON.stringify({ spells: refs.spells, feats: refs.feats, skills: refs.skills });
const calcPayload = JSON.stringify({ meta: crcalc._meta, calc: crcalc.calc });
// v0.6.2 THE ADVANCER: compact monotone benchmark curves (cr -> band median)
// so the page can re-price an advanced creature with the same inversion the
// Phase C model uses. ~1KB.
const bench = JSON.parse(readFileSync('data/benchmarks.json', 'utf8')).bench;
const curves = {};
for (const m of ['effHP', 'fullAC', 'bestAtk', 'routineAvg', 'saveAvg', 'dcMax']) {
  const pts = Object.entries(bench).filter(([, b]) => b[m] && b[m].n >= 3)
    .map(([cr, b]) => [parseFloat(cr), Math.round(b[m].med * 10) / 10]).sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < pts.length; i++) pts[i][1] = Math.max(pts[i][1], pts[i - 1][1]);
  curves[m] = pts;
}
const benchPayload = JSON.stringify(curves);
const out = tpl.replace('/*__BESTIARY__*/[]', payload).replace('/*__REFS__*/{spells:[],feats:[],skills:[]}', refPayload).replace('/*__CRCALC__*/{meta:{},calc:{}}', calcPayload).replace('/*__BENCH__*/{}', benchPayload);
writeFileSync('gmf.html', out);
writeFileSync('index.html', out); // the bare domain serves the Familiar too (deploy nicety, 2026-10-12)
console.log(`gmf.html built: ${(out.length/1024/1024).toFixed(2)} MB, ${data.entries.length} foes, ${refs.spells.length + refs.feats.length + refs.skills.length} refs embedded`);
