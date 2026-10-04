// extract_bestiary.mjs — harvest the Foe Folio bestiary into data/bestiary.json.
// v2 (2026-10-04, Adam's conflation report): the FF prints multi-tier families
// as COLUMNAR statblocks — parent heading, then K variant-name rows, then each
// label carrying exactly K value lines (i-th line → variant i). v1 mashed the
// columns into one unreadable entry; v2 unweaves them into {name, variants:[]}
// with the trailing prose (shared family abilities) attached to the parent.
// Usage: node tools/extract_bestiary.mjs "<FoeFolio.txt>" [data/bestiary.json]
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const out = process.argv[3] || 'data/bestiary.json';
const text = readFileSync(src, 'utf8').replace(/\r/g, '');
const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

// ---- ToC page map ("DRIDER219") ----
const pageOf = new Map();
for (const l of lines) {
  const m = l.match(/^([A-Z][A-Za-zÀ-ÿ''()&,\-\/ .]+?)(\d{1,3})$/);
  if (m) {
    const name = m[1].trim(), pg = Number(m[2]);
    if (pg >= 5 && pg <= 700 && name.length >= 3 && !pageOf.has(name.toUpperCase())) pageOf.set(name.toUpperCase(), pg);
  }
}

const LABELS = ['Size & Type:', 'Hit Dice:', 'T/AC System Adj:', 'Initiative / Speed:', 'Touch/Full AC (T/AC):', 'BA / Grapple / Parry:', 'Attack:', 'Full Attack:', 'Space/Reach:', 'Special Attacks:', 'Special Qualities:', 'Saves / Dodge:', 'Attributes:', 'Skills:', 'Feats:', 'Environment:', 'Organization:', 'Challenge Rating:', 'Treasure:', 'Alignment:', 'Advancement:', 'Level Adjustment:'];
const KEY = Object.fromEntries(LABELS.map(l => [l, l.replace(/[^A-Za-z]+/g, '_').replace(/_+$/, '').toLowerCase()]));
const isCaps = l => /^[A-Z0-9À-ÿ‘’''(),\-\/ &.]+$/.test(l) && !/^\d+$/.test(l) && l.length >= 3 && l.length <= 60 && !LABELS.includes(l);
const isNameRow = l => /^[A-Z0-9][A-Za-zÀ-ÿ‘’''0-9 ,.\-()\/]{2,60}$/.test(l) && !LABELS.includes(l) && !/[.:;]$/.test(l);

const anchors = [];
for (let i = 0; i < lines.length; i++) if (lines[i] === 'Size & Type:') anchors.push(i);

// Each anchor's "block start" = where its heading/name rows begin (for prose bounds).
const blockStart = anchors.map(i0 => {
  let j = i0 - 1, taken = 0;
  while (j >= 0 && taken < 9 && isNameRow(lines[j]) && !isCaps(lines[j])) { j--; taken++; }
  if (j >= 0 && isCaps(lines[j])) j--;
  return j + 1;
});

const families = [];
for (let a = 0; a < anchors.length; a++) {
  const i0 = anchors[a];
  // -- heading & variant-name rows --
  let j = i0 - 1;
  const nameRows = [];
  while (j >= 0 && nameRows.length < 9 && isNameRow(lines[j]) && !isCaps(lines[j])) { nameRows.unshift(lines[j]); j--; }
  const caps = (j >= 0 && isCaps(lines[j])) ? lines[j] : null;
  let parent, variantNames;
  if (nameRows.length >= 2) { parent = caps || nameRows[0]; variantNames = nameRows; }
  else { parent = caps || nameRows[0] || null; variantNames = [caps || nameRows[0] || 'UNNAMED']; }
  const K = variantNames.length;
  // -- unweave labels --
  const cols = Array.from({ length: K }, () => ({}));
  let i = i0, guard = 0, end = i0;
  while (i < lines.length && guard++ < 160) {
    const lab = LABELS.includes(lines[i]) ? lines[i] : null;
    if (!lab) { i++; continue; }
    const vals = [];
    let k = i + 1;
    while (k < lines.length && !LABELS.includes(lines[k]) && vals.length < K + 3 && !(vals.length >= K && isCaps(lines[k]))) { vals.push(lines[k]); k++; }
    if (vals.length === K) for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vals[c];
    else if (vals.length > K && vals.length % K === 0) { const per = vals.length / K; for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vals.slice(c * per, (c + 1) * per).join(' '); }
    else { const vjoin = vals.join(' '); for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vjoin; }
    end = k;
    if (lab === 'Level Adjustment:') { i = k; break; }
    i = k;
  }
  // -- shared prose until the next family's block start --
  const stop = a + 1 < anchors.length ? blockStart[a + 1] : Math.min(lines.length, end + 220);
  const prose = [];
  // Stop at any ToC-known caps heading: the NEXT entry's intro prose belongs
  // to the next entry, not to this body (the Assassin-Vine-answers-for-
  // Astral-Construct bleed, v0.2.0).
  for (let k = end; k < stop && prose.join(' ').length < 7000; k++) {
    if (isCaps(lines[k]) && pageOf.has(lines[k].toUpperCase())) break;
    prose.push(lines[k]);
  }
  const fam = {
    hadCaps: !!caps,
    parent: (parent || variantNames[0] || 'UNNAMED').trim(),
    variants: variantNames.map((vn, c) => ({ label: vn.trim(), ...cols[c] })),
    body: prose.join('\n'),
  };
  families.push(fam);
}

// ---- merge consecutive families with the SAME parent or the same comma-stem
// ("Air Elemental, Huge" continues AIR ELEMENTAL — the second table prints no
// repeated caps heading; the book's "Name, Tier" idiom IS the family marker) ----
const stem = s => s.replace(/,.*$/, '').trim().toUpperCase();
const merged = [];
for (const f of families) {
  const prev = merged[merged.length - 1];
  if (prev && (prev.parent === f.parent || stem(prev.parent) === stem(f.parent))) {
    prev.variants.push(...f.variants);
    prev.body = [prev.body, f.body].filter(Boolean).join('\n');
    if (stem(prev.parent) === prev.parent.toUpperCase() ? false : prev.parent !== stem(prev.parent)) { /* keep caps parent */ }
    if (!/^[A-Z0-9'',\-()\/ &.]+$/.test(prev.parent) || prev.parent.includes(',')) prev.parent = stem(prev.parent);
  }
  else merged.push(f);
}

// ---- derived fields per variant; entry-level rollups ----
for (const f of merged) {
  f.page = pageOf.get(f.parent.toUpperCase()) ?? pageOf.get((f.variants[0]?.label || '').toUpperCase()) ?? null;
  f.template = /\(Template\)/i.test(f.parent);
  for (const v of f.variants) {
    const st = v.size_type || '';
    v.size = (st.match(/^(Fine|Diminutive|Tiny|Small|Medium|Large|Huge|Gargantuan|Colossal)/i) || [null])[0];
    v.type = (st.match(/(Aberration|Animal|Construct|Dragon|Elemental|Fey|Giant|Humanoid|Magical Beast|Monstrous Humanoid|Ooze|Outsider|Plant|Undead|Vermin)/i) || [null])[0];
    const cr = (v.challenge_rating || '').match(/^(\d+)(?:\/(\d+))?/);
    v.cr = cr ? (cr[2] ? Number(cr[1]) / Number(cr[2]) : Number(cr[1])) : null;
  }
  f.types = [...new Set(f.variants.map(v => v.type).filter(Boolean))];
  f.sizes = [...new Set(f.variants.map(v => v.size).filter(Boolean))];
  f.crMin = Math.min(...f.variants.map(v => v.cr).filter(n => n != null).concat([Infinity]));
  f.crMax = Math.max(...f.variants.map(v => v.cr).filter(n => n != null).concat([-Infinity]));
  if (!isFinite(f.crMin)) { f.crMin = null; f.crMax = null; }
}

// ---- pass 2 (v0.2.0, Adam's sift report): SUFFIX-STEM consolidation.
// Continuation tables without the comma idiom ("4th-lvl Vivilor" after
// VIVILOR, the leveled Astral Constructs, the sample Skeletons) share a
// common TRAILING word run with their neighbors; consecutive families whose
// parents share a tail merge, and the family takes the shared tail as its
// name ("SKELETON" from Human Warrior/Troll/Advanced Megaraptor Skeleton).
const ALIAS = { 'TYPES OF ZOMBIES': 'ZOMBIE' };
const commonTail = (a, b) => {
  const A = a.trim().split(/\s+/), B = b.trim().split(/\s+/);
  const t = [];
  while (A.length && B.length && A[A.length - 1].toLowerCase() === B[B.length - 1].toLowerCase()) { t.unshift(A.pop()); B.pop(); }
  return t.join(' ');
};
const merged2 = [];
for (const f of merged) {
  f.parent = ALIAS[f.parent.toUpperCase()] || f.parent;
  const prev = merged2[merged2.length - 1];
  const tail = prev ? commonTail(prev.parent.replace(/,.*$/, ''), f.parent.replace(/,.*$/, '')) : '';
  // Merge only true CONTINUATIONS: a table with no caps heading of its own
  // (the sample Skeletons/Zombies/Hydra heads), an ordinal-led caps block
  // (1ST-LEVEL ASTRAL CONSTRUCT), or an exact parent repeat. Distinct kin
  // with their own headings (EARTH ELEMENTAL after AIR, the giants) stand.
  const continuation = !f.hadCaps || /^\d+(st|nd|rd|th)\b/i.test(f.parent) || f.parent.toUpperCase() === (prev ? prev.parent.toUpperCase() : '');
  if (prev && tail && tail.length >= 4 && continuation) {
    prev.variants.push(...f.variants);
    prev.body = [prev.body, f.body].filter(Boolean).join('\n');
    prev.parent = tail.toUpperCase();
  } else merged2.push(f);
}
merged.length = 0; merged.push(...merged2);

// ---- environment facet tokens (v0.2.0: random-encounter search by terrain) ----
const ENV_TOKENS = [['Underground', /underground|cavern/i], ['Forest', /forest|wood/i], ['Hills', /\bhills?\b/i], ['Mountains', /mountain/i], ['Plains', /plain|savanna|steppe/i], ['Desert', /desert|waste/i], ['Marsh/Swamp', /marsh|swamp|bog/i], ['Aquatic', /aquatic|ocean|sea|lake|river|water(?!\s*elemental)/i], ['Cold', /\bcold\b|arctic|frost|tundra/i], ['Temperate', /temperate/i], ['Warm/Tropical', /\bwarm\b|tropic|jungle/i], ['Urban', /urban|city|settlement/i], ['Planar', /plane of|planar|astral|ethereal|abyss|hell|baator|celestia|limbo|elemental plane|outer plane|heaven/i], ['Space', /space|vacuum|orbit|asteroid/i], ['Any', /\bany\b/i]];
for (const f of merged) {
  const envs = f.variants.map(v => v.environment || '').join(' | ');
  f.env = ENV_TOKENS.filter(([, re]) => re.test(envs)).map(([t]) => t);
}

const multi = merged.filter(f => f.variants.length > 1);
const vtotal = merged.reduce((s, f) => s + f.variants.length, 0);
writeFileSync(out, JSON.stringify({ _meta: { source: 'E&E Foe Folio (flow dump)', extracted: new Date().toISOString().slice(0, 10), families: merged.length, variants: vtotal }, entries: merged }, null, 1));
console.log(`families: ${merged.length} | variants: ${vtotal} | multi-variant families: ${multi.length} | with page: ${merged.filter(f => f.page).length} | with CR: ${merged.filter(f => f.crMin != null).length}`);
const ae = merged.find(f => f.parent === 'AIR ELEMENTAL');
console.log('AIR ELEMENTAL variants:', ae?.variants.map(v => `${v.label} [CR ${v.challenge_rating}]`).join(' | '));
const al = merged.find(f => f.parent === 'ALICORN');
console.log('ALICORN variants:', al?.variants.map(v => v.label).join(' | '));
