// harvest_skills.mjs — v0.4.1: the CG carries no skill prose, so skill hover
// text comes from the Hero's Handbook itself. Reads the HH page-text dump,
// parses the Skill Descriptions chapter (p.150+: "Name (Key Ability; quals)"
// headings, general description, Check: paragraph), and enriches
// data/refs.json skills with {q: full qualifier line, d: desc+check ≤650}.
// Parametrized CG skills (Craft/Knowledge/Perform/Profession (X)) share their
// base entry; base names + the book's "Decipher Script" are appended so FF
// statblock spellings match too.
// Usage: node tools/harvest_skills.mjs <hh_pages.txt> [data/refs.json]
import { readFileSync, writeFileSync } from 'node:fs';

const hhPath = process.argv[2];
const refsPath = process.argv[3] || 'data/refs.json';
const raw = readFileSync(hhPath, 'utf8').replace(/\r/g, '').split('\n')
  .map(l => l.trim())
  .filter(l => l && !/^===== PAGE \d+ =====$/.test(l) && !/^\d{1,3}$/.test(l));

const start = raw.indexOf('Skill Descriptions');
if (start < 0) throw new Error('Skill Descriptions chapter not found');

const HEAD = /^([A-Z][A-Za-z'’\/ -]{2,40}) \(((?:Str|Dex|Con|Int|Wis|Cha|None)[^)]*)\)$/;
const KNOWN = new Set(['Appraise','Autohypnosis','Balance','Bluff','Climb','Computer Use','Concentration','Craft','Decipher Script','Demolitions','Diplomacy','Disable Device','Disguise','Drive','Escape Artist','Forgery','Gamble','Gather Information','Handle Animal','Heal','Hide','Intimidate','Investigate','Jump','Knowledge','Listen','Move Silently','Navigate','Open Lock','Perform','Pilot','Profession','Psicraft','Read/Write/Speak Language','Repair','Research','Ride','Search','Sense Motive','Sleight of Hand','Spellcraft','Spot','Survival','Swim','Treat Injury','Tumble','Use Magic Device','Use Psionic Device','Use Rope']);
const SECTION = /^(Action|Try Again|Special|Synergy|Restriction|Untrained|Time):/;

// locate headings
const heads = [];
for (let i = start; i < raw.length; i++) {
  const m = raw[i].match(HEAD);
  if (m && KNOWN.has(m[1])) heads.push({ i, name: m[1], qual: m[2] });
  if (heads.length && /^Chapter [IVX]+/.test(raw[i])) break;
}

const book = new Map();
for (let h = 0; h < heads.length; h++) {
  const { i, name, qual } = heads[h];
  const end = h + 1 < heads.length ? heads[h + 1].i : Math.min(i + 120, raw.length);
  const block = raw.slice(i + 1, end);
  const ck = block.findIndex(l => /^Check(s)?:/.test(l));
  const desc = block.slice(0, ck < 0 ? 2 : ck).join(' ');
  let check = '';
  if (ck >= 0) {
    for (let k = ck; k < block.length; k++) {
      if (k > ck && SECTION.test(block[k])) break;
      check += (check ? ' ' : '') + block[k];
    }
  }
  const d = (desc + (check ? '\n' + check : '')).trim();
  book.set(name, { q: qual, d: d.length > 650 ? d.slice(0, 650) + '…' : d });
}
console.log(`HH skill entries parsed: ${book.size} of ${KNOWN.size} known`);

// enrich refs.json
const refs = JSON.parse(readFileSync(refsPath, 'utf8'));
const ALIAS = { 'Decipher Code': 'Decipher Script' };
let hit = 0, miss = [];
for (const s of refs.skills) {
  const base = ALIAS[s.n] || s.n.replace(/\s*\(.*$/, '');
  const e = book.get(base);
  if (e) { s.q = e.q; s.d = e.d; hit++; } else miss.push(s.n);
}
// FF statblocks print book spellings — add the shared bases + Decipher Script.
const have = new Set(refs.skills.map(s => s.n.toLowerCase()));
const EXTRA = [['Craft', 'INT'], ['Knowledge', 'INT'], ['Perform', 'CHA'], ['Profession', 'WIS'], ['Decipher Script', 'INT']];
for (const [n, k] of EXTRA) {
  if (have.has(n.toLowerCase())) continue;
  const e = book.get(n);
  if (e) refs.skills.push({ n, k, req: '', q: e.q, d: e.d });
}
writeFileSync(refsPath, JSON.stringify(refs, null, 0));
console.log(`skills enriched: ${hit}/${refs.skills.length}${miss.length ? ' | no prose: ' + miss.join(', ') : ''}`);
