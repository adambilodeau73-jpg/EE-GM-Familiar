// harvest_stage.mjs — v0.7.0 THE STAGE, THE LIBRARY & THE ACADEMY (Adam's
// gavels, 2026-10-13): three curated-card harvests from the fresh book dumps.
//   STAGE (Environs): GMG pp.~104-134 — movement/terrain/weather/extreme
//     effects/dungeon terrains, by ToC heading.
//   LIBRARY: the FF SPECIAL ABILITIES glossary (p.519 → tail) — caps-headed
//     entries; doubles as hover data for every statblock (the Lammasu lesson
//     generalized).
//   ACADEMY: GMG The Hero/Basic/Advanced/Prestige Classes commentary (p.191+)
//     as per-class cards, + the HH Attribute-Based Roles (singles and the
//     fifteen pairings) for the role-first "casting director" view.
// Usage: node tools/harvest_stage.mjs [extractionDir]
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = process.argv[2] || 'C:/Users/adam_/OneDrive/Desktop/E&E/extraction';
const read = (f) => readFileSync(`${DIR}/${f}`, 'utf8').replace(/\r/g, '');
const gmg = read('gmg_text.txt').split('\n');
const ff = read('ff_text.txt').split('\n');
const hh = read('hh_text.txt').split('\n');

const pageAt = (lines) => { // line index -> printed page
  const out = new Array(lines.length); let p = null;
  for (let i = 0; i < lines.length; i++) { const m = lines[i].match(/^===== PAGE (\d+) =====/); if (m) p = +m[1]; out[i] = p; }
  return out;
};
const gmgPage = pageAt(gmg), ffPage = pageAt(ff), hhPage = pageAt(hh);
const clean = (s) => s.replace(/^===== PAGE \d+ =====$/,'').trim();

// ---- STAGE: harvest by the ToC's own heading names ----
const STAGE_HEADS = [
  ['Movement & Travel','Tactical Movement'],['Movement & Travel','Overland Movement'],
  ['Movement & Travel','Navigation and Getting Lost'],
  ['Terrain','Different Types of Terrain'],['Terrain','Aquatic Terrain'],
  ['Terrain','Badland / Desert / Tundra Terrain'],['Terrain','Forest / Jungle Terrain'],
  ['Terrain','Hills Terrain'],['Terrain','Marsh / Swamp Terrain'],['Terrain','Mountain Terrain'],
  ['Terrain','Plains Terrain'],
  ['Weather','Weather'],
  ['Extreme Effects','Extreme Environmental Effects'],['Extreme Effects','Acid Effects'],
  ['Extreme Effects','Cold Dangers'],['Extreme Effects','Darkness'],['Extreme Effects','Falling'],
  ['Extreme Effects','Gravity Variations'],['Extreme Effects','Heat Dangers'],
  ['Extreme Effects','Lava Effects'],['Extreme Effects','Radiation Exposure'],
  ['Extreme Effects','Smoke Effects'],['Extreme Effects','Starvation and Thirst'],
  ['Extreme Effects','Suffocation'],['Extreme Effects','Vacuum Exposure'],['Extreme Effects','Water Dangers'],
  ['Dungeons','Artificial Terrains'],['Dungeons','Dungeon Types'],['Dungeons','Dungeon Terrain'],['Dungeons','Rooms'],
];
const stageNames = new Set(STAGE_HEADS.map(([,n]) => n));
const environs = [];
{
  // body text only (skip the ToC itself: headings there end in dot-leaders)
  let cur = null;
  for (let i = 400; i < gmg.length; i++) {
    const L = gmg[i].trim();
    if (stageNames.has(L)) {
      if (cur) environs.push(cur);
      const tag = STAGE_HEADS.find(([, n]) => n === L)[0];
      cur = { t: L, tag, cite: 'GMG p.' + (gmgPage[i] ?? '?'), d: [] };
      continue;
    }
    if (cur) {
      if (cur.d.join(' ').length > 9000) { environs.push(cur); cur = null; continue; }
      const c = clean(gmg[i]);
      if (c) cur.d.push(c);
    }
  }
  if (cur) environs.push(cur);
  for (const e of environs) e.d = e.d.join('\n');
}

// ---- LIBRARY: the FF glossary (caps-headed entries from SPECIAL ABILITIES) ----
const library = [];
{
  const start = ff.findIndex((l, i) => i > 1000 && l.trim() === 'SPECIAL ABILITIES');
  const isHead = (l) => /^[A-Z][A-Z \/&,'-]+$/.test(l) && l.length >= 4 && l.length <= 48 && !/^PAGE /.test(l);
  let cur = { t: 'SPECIAL ABILITIES', cite: 'FF p.' + (ffPage[start] ?? 519), d: [] };
  for (let i = start + 1; i < ff.length; i++) {
    const L = ff[i].trim();
    if (isHead(L)) { library.push(cur); cur = { t: L, cite: 'FF p.' + (ffPage[i] ?? '?'), d: [] }; continue; }
    const c = clean(ff[i]);
    if (c) cur.d.push(c);
    if (cur.d.join(' ').length > 9000) { library.push(cur); cur = null; for (; i < ff.length && !isHead(ff[i].trim()); i++); i--; cur = null; }
    if (!cur) { cur = { t: '(cont)', cite: '', d: [] }; }
  }
  if (cur && cur.t !== '(cont)') library.push(cur);
  for (const e of library) e.d = e.d.join('\n');
}
const libraryClean = library.filter(e => e.d.length > 40 && e.t !== '(cont)');

// ---- ACADEMY: GMG class commentary + HH roles ----
const academyClasses = [];
{
  const start = gmg.findIndex((l, i) => i > 5000 && l.trim() === 'The Hero Classes');
  const SECTION = /^The (Hero|Basic|Advanced|Prestige) Classes$/;
  const end = (() => { for (let i = start + 1; i < gmg.length; i++) { if (/^The GM'?s|^Running|^Chapter/.test(gmg[i].trim()) && (gmgPage[i] ?? 0) > 197) return i; } return Math.min(gmg.length, start + 1200); })();
  let tier = 'Hero', cur = null;
  const isClassLead = (l) => /^[A-Z][A-Za-z' \/]+:\s+\S/.test(l) && l.indexOf(':') <= 30;
  for (let i = start; i < end; i++) {
    const L = gmg[i].trim();
    const sm = L.match(SECTION);
    if (sm) { if (cur) academyClasses.push(cur); cur = { t: 'The ' + sm[1] + ' Classes — overview', tier: sm[1], cite: 'GMG p.' + (gmgPage[i] ?? '?'), d: [] }; tier = sm[1]; continue; }
    if (isClassLead(L)) { if (cur) academyClasses.push(cur); cur = { t: L.slice(0, L.indexOf(':')), tier, cite: 'GMG p.' + (gmgPage[i] ?? '?'), d: [L.slice(L.indexOf(':') + 1).trim()] }; continue; }
    if (cur) { const c = clean(gmg[i]); if (c) cur.d.push(c); }
  }
  if (cur) academyClasses.push(cur);
  for (const e of academyClasses) e.d = e.d.join('\n');
  // drop table-header artifacts and stray colon-led crumbs
  for (let i = academyClasses.length - 1; i >= 0; i--) {
    const e = academyClasses[i];
    if (e.d.length < 80 || /^(Class|Table|Note)$/i.test(e.t)) academyClasses.splice(i, 1);
  }
}
const academyRoles = [];
{
  const start = hh.findIndex(l => l.trim() === 'Attribute-Based Roles');
  const stop = hh.findIndex((l, i) => i > start && /^Starting Occupation/i.test(l.trim()));
  const end = stop > 0 ? stop : start + 90;
  let cur = null;
  const lead = /^((?:Strong|Fast|Tough|Smart|Dedicated|Charismatic)(?:\s*\/\s*(?:Strong|Fast|Tough|Smart|Dedicated|Charismatic))?):\s*(.*)$/;
  for (let i = start; i < end; i++) {
    const m = hh[i].trim().match(lead);
    if (m) { if (cur) academyRoles.push(cur); cur = { t: m[1].replace(/\s*\/\s*/, ' / '), cite: 'HH p.' + (hhPage[i] ?? '?'), d: [m[2]] }; continue; }
    if (cur) { const c = clean(hh[i]); if (c && !/^={3,}/.test(c)) cur.d.push(c); }
  }
  if (cur) academyRoles.push(cur);
  for (const e of academyRoles) e.d = e.d.join(' ');
}

const out = {
  _meta: { generated: new Date().toISOString().slice(0, 10), environs: environs.length, library: libraryClean.length, classes: academyClasses.length, roles: academyRoles.length },
  environs, library: libraryClean, academy: { classes: academyClasses, roles: academyRoles },
};
writeFileSync(new URL('../data/stage.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out._meta));
console.log('environs sample:', environs.slice(0, 3).map(e => e.t + ' (' + e.d.length + 'ch)'));
console.log('library sample:', libraryClean.slice(0, 6).map(e => e.t));
console.log('classes sample:', academyClasses.slice(0, 8).map(e => `${e.tier}:${e.t}`));
console.log('roles sample:', academyRoles.slice(0, 8).map(e => e.t));
