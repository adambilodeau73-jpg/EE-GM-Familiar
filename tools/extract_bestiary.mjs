// extract_bestiary.mjs — harvest the Foe Folio bestiary into data/bestiary.json.
// Reads a FLOW-ORDER text dump of the FF (docx-extracted; the book itself stays
// private — only the OGL-derived statblock data ships). The FF statblock shape
// is label-line/value-line pairs anchored by "Size & Type:" and closed by
// "Level Adjustment:"; prose + COMBAT abilities trail until the next entry.
// Page numbers come from the book's own ToC lines ("DRIDER219").
// Usage: node tools/extract_bestiary.mjs "<FoeFolio.txt>" [data/bestiary.json]
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const out = process.argv[3] || 'data/bestiary.json';
const text = readFileSync(src, 'utf8').replace(/\r/g, '');
const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

// ---- 1. ToC page map: "NAME###" runs (the big index at the book's head) ----
const pageOf = new Map();
for (const l of lines) {
  const m = l.match(/^([A-Z][A-Za-z��'()&,\-\/ .]+?)(\d{1,3})$/);
  if (m && m[1] === m[1].toUpperCase() === false) continue; // noop guard
  if (m) {
    const name = m[1].trim();
    const pg = Number(m[2]);
    if (pg >= 5 && pg <= 700 && name.length >= 3 && !pageOf.has(name.toUpperCase())) pageOf.set(name.toUpperCase(), pg);
  }
}

// ---- 2. Statblocks ----
const LABELS = ['Size & Type:', 'Hit Dice:', 'T/AC System Adj:', 'Initiative / Speed:', 'Touch/Full AC (T/AC):', 'BA / Grapple / Parry:', 'Attack:', 'Full Attack:', 'Space/Reach:', 'Special Attacks:', 'Special Qualities:', 'Saves / Dodge:', 'Attributes:', 'Skills:', 'Feats:', 'Environment:', 'Organization:', 'Challenge Rating:', 'Treasure:', 'Alignment:', 'Advancement:', 'Level Adjustment:'];
const KEY = Object.fromEntries(LABELS.map(l => [l, l.replace(/[^A-Za-z]+/g, '_').replace(/_+$/, '').toLowerCase()]));
const isHeading = l => /^[A-Z0-9��'(),\-\/ &.]+$/.test(l) && !/^\d+$/.test(l) && l.length >= 3 && l.length <= 60 && !LABELS.includes(l);

const anchors = [];
for (let i = 0; i < lines.length; i++) if (lines[i] === 'Size & Type:') anchors.push(i);

const entries = [];
for (let a = 0; a < anchors.length; a++) {
  const i0 = anchors[a];
  // heading = nearest preceding all-caps line within 4 lines
  let name = null;
  for (let j = i0 - 1; j >= Math.max(0, i0 - 4); j--) {
    if (isHeading(lines[j])) { name = lines[j]; break; }
  }
  const fields = {};
  let i = i0;
  let guard = 0;
  while (i < lines.length && guard++ < 80) {
    const lab = LABELS.includes(lines[i]) ? lines[i] : null;
    if (!lab) { i++; continue; }
    // value = following lines until the next label (usually exactly one line)
    let v = [];
    let k = i + 1;
    while (k < lines.length && !LABELS.includes(lines[k]) && v.length < 6 && !(v.length && isHeading(lines[k]))) { v.push(lines[k]); k++; }
    fields[KEY[lab]] = v.join(' ');
    if (lab === 'Level Adjustment:') { i = k; break; }
    i = k;
  }
  // trailing prose/abilities until the next entry's heading (or next anchor)
  const stop = a + 1 < anchors.length ? anchors[a + 1] - 4 : Math.min(lines.length, i + 200);
  const prose = [];
  for (let k = i; k < stop && prose.join(' ').length < 6000; k++) prose.push(lines[k]);
  // Variant sub-blocks (a second statblock under one heading — size tiers,
  // elites) inherit the parent heading; mixed-case sub-heads are tried first.
  if (!name) {
    for (let j = i0 - 1; j >= Math.max(0, i0 - 3); j--) {
      const l = lines[j];
      if (/^[A-Z][A-Za-z��' \-,()\/]{2,50}$/.test(l) && !LABELS.includes(l) && !/[.:;]$/.test(l)) { name = l; break; }
    }
  }
  if (!name && entries.length) name = entries[entries.length - 1].name.replace(/ \(variant \d+\)$/, '') + ` (variant ${(entries[entries.length - 1]._v || 1) + 1})`;
  const nm = (name || 'UNNAMED').trim();
  entries.push({
    _v: (nm.match(/\(variant (\d+)\)/) || [])[1] ? Number(nm.match(/\(variant (\d+)\)/)[1]) : undefined,
    name: nm,
    page: pageOf.get(nm.toUpperCase()) ?? null,
    template: /\(Template\)/i.test(nm),
    ...fields,
    body: prose.join('\n'),
  });
}

// ---- 3. Derived filters ----
for (const e of entries) {
  const st = e.size_type || '';
  e.size = (st.match(/^(Fine|Diminutive|Tiny|Small|Medium|Large|Huge|Gargantuan|Colossal)/i) || [null])[0];
  e.type = (st.match(/(Aberration|Animal|Construct|Dragon|Elemental|Fey|Giant|Humanoid|Magical Beast|Monstrous Humanoid|Ooze|Outsider|Plant|Undead|Vermin)/i) || [null])[0];
  const cr = (e.challenge_rating || '').match(/^(\d+)(?:\/(\d+))?/);
  e.cr = cr ? (cr[2] ? Number(cr[1]) / Number(cr[2]) : Number(cr[1])) : null;
  const hd = (e.hit_dice || '').match(/^(\d+)d/);
  e.hd = hd ? Number(hd[1]) : null;
}

const named = entries.filter(e => e.name !== 'UNNAMED');
const paged = named.filter(e => e.page != null);
const typed = named.filter(e => e.type != null);
const crd = named.filter(e => e.cr != null);
writeFileSync(out, JSON.stringify({ _meta: { source: 'E&E Foe Folio (flow dump)', extracted: new Date().toISOString().slice(0, 10), count: entries.length }, entries }, null, 1));
console.log(`entries: ${entries.length} | named: ${named.length} | with page: ${paged.length} | with type: ${typed.length} | with CR: ${crd.length}`);
console.log('unnamed anchors:', entries.length - named.length);
console.log('sample:', JSON.stringify(entries.find(e => e.name === 'DRIDER'), null, 1)?.slice(0, 500));
