// extract_bestiary.mjs — harvest the Foe Folio bestiary into data/bestiary.json.
// v2 (2026-10-04, Adam's conflation report): the FF prints multi-tier families
// as COLUMNAR statblocks — parent heading, then K variant-name rows, then each
// label carrying exactly K value lines (i-th line → variant i). v1 mashed the
// columns into one unreadable entry; v2 unweaves them into {name, variants:[]}
// with the trailing prose (shared family abilities) attached to the parent.
// Usage: node tools/extract_bestiary.mjs "<FoeFolio.txt>" [data/bestiary.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { extractDragons } from './dragons.mjs';

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
// v0.5.0 closeout: the flow spells some labels differently — continuation
// tables print "BA / Grapple:" and "Saves:" (the Monstrous vermin), RAVID
// reverses its size label, and ~16 label lines drop their colon entirely
// ("Environment" bare — the Aboleth/Archon/Barghest/fiend Feats spills).
KEY['BA / Grapple:'] = KEY['BA / Grapple / Parry:'];
KEY['Saves:'] = KEY['Saves / Dodge:'];
KEY['Type & Size:'] = KEY['Size & Type:'];
LABELS.push('BA / Grapple:', 'Saves:', 'Type & Size:');
// v0.5.1: the Chapter II robots carry commerce + chassis labels of their own.
KEY['Frame / Armor:'] = 'frame_armor';
KEY['Locomotion:'] = 'locomotion';
KEY['Manipulators:'] = 'manipulators';
KEY['Accessories:'] = 'accessories';
KEY['Purchase DC (Restrict.):'] = 'purchase_dc';
KEY['Purchase DC:'] = 'purchase_dc';
KEY['Restriction (DC Mod.):'] = 'restriction';
LABELS.push('Frame / Armor:', 'Locomotion:', 'Manipulators:', 'Accessories:', 'Purchase DC (Restrict.):', 'Purchase DC:', 'Restriction (DC Mod.):');
// Short-valued terminal-zone labels (like Level Adjustment): keep only
// value-shaped lines, hand trailing prose to the body.
const SHORT_LABELS = new Set(['Purchase DC (Restrict.):', 'Purchase DC:', 'Restriction (DC Mod.):']);
const BARE = new Map(LABELS.map(l => [l.replace(/:$/, ''), l]));
const labelAt = l => LABELS.includes(l) ? l : (BARE.get(l) || null);
// v0.5.0: smart double quotes admitted (the “NUYU” DOPPELGANGER ROBOT heading).
const isCaps = l => /^[A-Z0-9À-ÿ‘’''“”(),\-\/ &.]+$/.test(l) && !/^\d+$/.test(l) && l.length >= 3 && l.length <= 60 && !LABELS.includes(l);
const isNameRow = l => /^[A-Z0-9“][A-Za-zÀ-ÿ‘’''“”0-9 ,.\-()\/]{2,60}$/.test(l) && !LABELS.includes(l) && !/[.:;]$/.test(l);

// v0.5.0: anchors accept the size label's misspellings (RAVID's "Type &
// Size:", SPECTRE's colonless "Size & Type") — and ORPHAN "Hit Dice:" lines
// whose block lost its size label entirely (Dust Mephit, Giant Wasp, the
// Gargantuan/Colossal Centipede continuation); vehicle statblocks (Crew:/
// Length / Weight:) are not bestiary and are excluded.
const SIZE_ANCHORS = new Set(['Size & Type:', 'Type & Size:', 'Size & Type', 'Type & Size']);
const anchors = [];
for (let i = 0; i < lines.length; i++) {
  if (SIZE_ANCHORS.has(lines[i])) { anchors.push(i); continue; }
  if (lines[i] === 'Hit Dice:') {
    let orphan = true;
    for (let b = Math.max(0, i - 14); b < i; b++) if (SIZE_ANCHORS.has(lines[b]) || lines[b] === 'Crew:' || lines[b] === 'Length / Weight:') { orphan = false; break; }
    if (orphan) anchors.push(i);
  }
}

// Each anchor's "block start" = where its heading/name rows begin (for prose bounds).
const blockStart = anchors.map(i0 => {
  let j = i0 - 1, taken = 0;
  while (j >= 0 && taken < 9 && isNameRow(lines[j]) && !isCaps(lines[j])) { j--; taken++; }
  if (j >= 0 && isCaps(lines[j])) j--;
  return j + 1;
});

const families = [];
const MISMATCH = [];
for (let a = 0; a < anchors.length; a++) {
  const i0 = anchors[a];
  // -- heading & variant-name rows --
  let j = i0 - 1;
  const nameRows = [];
  while (j >= 0 && nameRows.length < 9 && isNameRow(lines[j]) && !isCaps(lines[j])) { nameRows.unshift(lines[j]); j--; }
  let caps = (j >= 0 && isCaps(lines[j])) ? lines[j] : null;
  // v0.5.0: an ORPHAN anchor ("Hit Dice:" with no size label) carries its
  // size values between the name rows and the anchor — peel them off the
  // name scan (Dust Mephit "Small Outsider…", the Centipede continuation).
  let sizeVals = null;
  if (lines[i0] === 'Hit Dice:') {
    const SIZEW = /^(Fine|Diminutive|Tiny|Small|Medium(-size)?|Large|Huge|Gargantuan|Colossal)\b/;
    sizeVals = [];
    while (nameRows.length && SIZEW.test(nameRows[nameRows.length - 1])) sizeVals.unshift(nameRows.pop());
    if (!sizeVals.length) sizeVals = null;
  }
  // v0.5.0: with no caps heading, a ToC-known first "name row" IS the heading
  // (GNOME, Deep — previously duplicated itself as a phantom variant), and a
  // declared sub-head is a title row, not a variant (Viper Snake — which must
  // stay heading-less so the suffix-stem pass still folds it into SNAKE).
  const SUBHEADS = new Set(['Viper Snake']);
  if (!caps && nameRows.length >= 2) {
    if (pageOf.has(nameRows[0].toUpperCase())) caps = nameRows.shift();
    else if (SUBHEADS.has(nameRows[0])) nameRows.shift();
  }
  let parent, variantNames;
  if (nameRows.length >= 2) { parent = caps || nameRows[0]; variantNames = nameRows; }
  else { parent = caps || nameRows[0] || null; variantNames = [caps || nameRows[0] || 'UNNAMED']; }
  const K = variantNames.length;
  // -- unweave labels --
  const cols = Array.from({ length: K }, () => ({}));
  // v0.5.1: HARD BOUND at the next block's start — a statblock that never
  // prints "Level Adjustment:" (the robots) used to keep scanning and read
  // the NEXT entry's labels over its own (all three robots wore Ape's
  // Purchase DC).
  const bound = a + 1 < anchors.length ? blockStart[a + 1] : lines.length;
  let i = i0, guard = 0, end = i0;
  while (i < bound && guard++ < 160) {
    // v0.5.1: a chapter heading ends the statblock zone unconditionally —
    // Chapter III's mecha tables reuse "Purchase DC:" and were overwriting
    // Nuyu's own commerce lines.
    if (/^Chapter [IVX]+\b/.test(lines[i])) break;
    const lab = labelAt(lines[i]);
    if (!lab) { i++; continue; }
    let vals = [];
    let k = i + 1;
    while (k < bound && !labelAt(lines[k]) && vals.length < K + 3 && !(vals.length >= K && isCaps(lines[k]))) {
      // v0.5.0: a line opening with '(' continues the previous value — the
      // wrapped parenthetical variants ("(Lacedon: Any aquatic)").
      if (lines[k].startsWith('(') && vals.length) vals[vals.length - 1] += ' ' + lines[k];
      else vals.push(lines[k]);
      k++;
    }
    // v0.2.1 (Adam's Kobold catch): Level Adjustment is the TERMINAL label —
    // its values are short tokens (+N, —) and everything after them is the
    // entry's prose. Keep up to K LA-shaped lines; hand the rest to the body.
    if (lab === 'Level Adjustment:') {
      const laShape = t => t.trim().split(/\s+/).every(x => /^[+\-−–—-]?\d+$|^[—–−-]+$/.test(x));
      let keep = 0;
      while (keep < vals.length && keep < K && laShape(vals[keep])) keep++;
      if (keep === 0 && vals.length) keep = 1;
      k = i + 1 + keep;
      vals = vals.slice(0, keep);
    }
    // v0.5.1: the robots' commerce labels sit at block end with prose after —
    // keep only short value-shaped lines ("27 (Licensed; +1)", "Military (+3)").
    if (SHORT_LABELS.has(lab)) {
      let keep = 0;
      while (keep < vals.length && keep < K && vals[keep].length <= 40) keep++;
      if (keep === 0 && vals.length) keep = 1;
      k = i + 1 + keep;
      vals = vals.slice(0, keep);
    }
    if (vals.length === K) for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vals[c];
    else if (vals.length > K && vals.length % K === 0) { const per = vals.length / K; for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vals.slice(c * per, (c + 1) * per).join(' '); }
    else {
      // v0.2.1 (Adam's Kobold catch): K short values sometimes share ONE
      // physical line ("+0 +3" for two variants). If the single line splits
      // into exactly K whitespace tokens, deal them out per variant.
      const tokens = vals.length === 1 ? vals[0].split(/\s+/) : null;
      if (tokens && tokens.length === K && K > 1) for (let c = 0; c < K; c++) cols[c][KEY[lab]] = tokens[c];
      // Fewer value lines than declared variants: the surplus names belong to
      // a continuation table (the Viper Snakes) — deal what exists, in order;
      // ghost columns are dropped after the family assembles.
      else if (vals.length > 1 && vals.length < K) { for (let c = 0; c < vals.length; c++) cols[c][KEY[lab]] = vals[c]; }
      else { const vjoin = vals.join(' '); for (let c = 0; c < K; c++) cols[c][KEY[lab]] = vjoin; if (K > 1 && vals.length !== 1) MISMATCH.push(`${(caps||nameRows[0]||'?')} :: ${lab} :: K=${K} vals=${vals.length} [${vjoin.slice(0,60)}]`); }
      // vals === 1 with K > 1 is the lycanthropes' SHARED-line idiom (one
      // Feats/Organization line serving all three forms) — correct, not noise.
    }
    end = k;
    if (lab === 'Level Adjustment:') { i = k; break; }
    i = k;
  }
  // v0.5.0: orphan-anchored blocks take their peeled size values here.
  if (sizeVals) for (let c = 0; c < K && c < sizeVals.length; c++) if (!cols[c].size_type) cols[c].size_type = sizeVals[c];
  // Ghost columns (declared names whose table columns live in a continuation
  // table) carry no statline — drop them; their names return via that table.
  while (cols.length > 1 && !cols[cols.length - 1].size_type && !cols[cols.length - 1].hit_dice) { cols.pop(); variantNames.pop(); }
  // -- shared prose until the next family's block start --
  const stop = a + 1 < anchors.length ? blockStart[a + 1] : Math.min(lines.length, end + 220);
  const prose = [];
  // Stop at any ToC-known caps heading: the NEXT entry's intro prose belongs
  // to the next entry, not to this body (the Assassin-Vine-answers-for-
  // Astral-Construct bleed, v0.2.0).
  for (let k = end; k < stop && prose.join(' ').length < 7000; k++) {
    // v0.5.0: ALSO stop at ToC-known "(Template)" headings — their lowercase
    // suffix defeated isCaps, bleeding template tables into the preceding
    // creature's body (Leonal, Ettin, Stygilor, Magmin, Phasm, Shocker
    // Lizard — the whole debris long tail). Kept NARROW: a bare table header
    // like "Elemental" is ToC-known too, and must not truncate a body
    // (creature headings are already bounded by the next block start).
    const t = lines[k];
    if (pageOf.has(t.toUpperCase()) && (isCaps(t) || /\(Template\)/i.test(t))) break;
    if (/^Chapter [IVX]+\b/.test(t)) break; // chapter boundary ends any body
    prose.push(t);
  }
  const fam = {
    hadCaps: !!caps,
    parent: (parent || variantNames[0] || 'UNNAMED').trim(),
    variants: variantNames.map((vn, c) => ({ label: vn.trim(), ...cols[c] })),
    body: prose.join('\n'),
  };
  families.push(fam);
}

// v0.5.0: the book's "how to read a statblock" explainer contains the
// literal anchor label — documentation, not a creature.
{
  const SIZEW0 = /^(Fine|Diminutive|Tiny|Small|Medium|Large|Huge|Gargantuan|Colossal)/i;
  const drop = families.findIndex(f => f.parent === 'UNNAMED' && !SIZEW0.test(f.variants[0].size_type || ''));
  if (drop >= 0) families.splice(drop, 1);
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


// ---- pass 2 (v0.2.0, Adam's sift report): SUFFIX-STEM consolidation.
// Continuation tables without the comma idiom ("4th-lvl Vivilor" after
// VIVILOR, the leveled Astral Constructs, the sample Skeletons) share a
// common TRAILING word run with their neighbors; consecutive families whose
// parents share a tail merge, and the family takes the shared tail as its
// name ("SKELETON" from Human Warrior/Troll/Advanced Megaraptor Skeleton).
const ALIAS = { 'TYPES OF ZOMBIES': 'ZOMBIE' };
const commonTail = (a, b) => {
  // Parentheticals are epithets, not lineage — strip before comparing
  // (prevents distinct entries chaining on a shared bracketed suffix).
  a = a.replace(/\([^)]*\)?/g, ' ').trim();
  b = b.replace(/\([^)]*\)?/g, ' ').trim();
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

// v0.5.1 (Adam's OCD alert): the three quoted-heading robots regroup under
// one ROBOT family, nicknames preserved as parentheticals, Adam's spellings.
{
  const ROBOT_NAMES = {
    '“APE” ARMED POLICE ESCORT ROBOT (TS 6)': "Robot, Armed Police Escort ('Ape')",
    '“NUYU” DOPPELGANGER ROBOT (TS 7)': "Robot, Doppelganger ('Nuyu')",
    '“SPOT” SECURITY BIOMORPH ROBOT (TS 6)': "Robot, Security Biomorph ('Spot')",
  };
  const bots = merged.filter(f => ROBOT_NAMES[f.parent]);
  if (bots.length) {
    const fam = { hadCaps: true, parent: 'ROBOT', variants: [], body: '', page: 573 };
    for (const f of bots) {
      for (const v of f.variants) { v.label = ROBOT_NAMES[f.parent]; fam.variants.push(v); }
      if (f.body) fam.body += (fam.body ? '\n' : '') + `[${ROBOT_NAMES[f.parent]}]\n` + f.body;
    }
    fam.variants.sort((a, b) => a.label.localeCompare(b.label));
    merged.splice(merged.indexOf(bots[0]), 0, fam);
    for (const f of bots) merged.splice(merged.indexOf(f), 1);
  }
}

extractDragons({ lines, pageOf, isCaps, merged, MISMATCH });

// ---- derived fields per variant; entry-level rollups ----
for (const f of merged) {
  f.page = f.page ?? pageOf.get(f.parent.toUpperCase()) ?? pageOf.get((f.variants[0]?.label || '').toUpperCase()) ?? null;
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

// ---- environment facet tokens (v0.2.0: random-encounter search by terrain) ----
const ENV_TOKENS = [['Underground', /underground|cavern/i], ['Forest', /forest|wood/i], ['Hills', /\bhills?\b/i], ['Mountains', /mountain/i], ['Plains', /plain|savanna|steppe/i], ['Desert', /desert|waste/i], ['Marsh/Swamp', /marsh|swamp|bog/i], ['Aquatic', /aquatic|ocean|sea|lake|river|water(?!\s*elemental)/i], ['Cold', /\bcold\b|arctic|frost|tundra/i], ['Temperate', /temperate/i], ['Warm/Tropical', /\bwarm\b|tropic|jungle/i], ['Urban', /urban|city|settlement/i], ['Planar', /plane of|planar|astral|ethereal|abyss|hell|baator|celestia|limbo|elemental plane|outer plane|heaven/i], ['Space', /space|vacuum|orbit|asteroid/i], ['Any', /\bany\b/i]];
for (const f of merged) {
  const envs = f.variants.map(v => v.environment || '').join(' | ');
  f.env = ENV_TOKENS.filter(([, re]) => re.test(envs)).map(([t]) => t);
}

// ---- v0.2.2 (Adam's Whirlwind report): SIZE-SCALED SUB-TABLE DISENTANGLER.
// The FF prints per-form ability tables (the elementals' Whirlwind) that the
// flow dump renders as runs of 1-3-token lines. Where a debris run's rows
// anchor on tokens matching this family's variant labels, zip the row's
// cells with the column headers, attach the result to the matching variant,
// and strip the debris from the body. Unclaimed debris runs are FLAGGED
// (f.debris) — the triage list for the long tail.
const short = l => l.split(/\s+/).length <= 3;
const BANNER = /^[—–—–\- ]*([A-Za-z''\/ ]{3,40}?)[—–—–\- ]*$/;
for (const f of merged) {
  if (!f.body) continue;
  const lines = f.body.split('\n');
  // per-variant anchor tokens: the label minus the family-stem words
  const stemWords = new Set(f.parent.toLowerCase().split(/[\s,]+/));
  const anchorsOf = f.variants.map(v => {
    const toks = v.label.replace(/[(),]/g, ' ').split(/\s+/).filter(w => w && !stemWords.has(w.toLowerCase()));
    return (toks.join(' ') || v.label).toLowerCase();
  });
  const matchVariant = line => {
    const t = line.trim().toLowerCase();
    let best = -1;
    anchorsOf.forEach((a, i) => { if (a && (t === a || a.startsWith(t) || t === a.split(' ')[0]) && t.length >= 3) { if (best < 0) best = i; } });
    return best;
  };
  const keep = [];
  let i = 0, claimed = 0, debris = 0;
  while (i < lines.length) {
    if (!short(lines[i])) { keep.push(lines[i]); i++; continue; }
    let j = i; while (j < lines.length && short(lines[j])) j++;
    const run = lines.slice(i, j);
    if (run.length < 6) { keep.push(...run); i = j; continue; }
    // find the first variant-anchored row inside the run
    let first = run.findIndex(l => matchVariant(l) >= 0);
    if (first < 1) { debris++; f.debris = (f.debris || 0) + 1; keep.push(...run); i = j; continue; }
    // title: the dashed banner line ("—— Whirlwind ——"); headers: the
    // pre-anchor lines minus banners and minus the anchor-column header
    // (which names the family stem, e.g. "Elemental").
    const isBanner = l => /[—–\-]{2,}/.test(l) && /[A-Za-z]/.test(l);
    let title = '';
    for (let k2 = first - 1; k2 >= 0; k2--) if (isBanner(run[k2])) { title = run[k2].replace(/[—–\-]+/g, ' ').trim(); break; }
    const headers = run.slice(0, first).map(l => l.trim())
      .filter(l => !isBanner(l))
      .filter(l => !l.split(/\s+/).some(w => stemWords.has(w.toLowerCase().replace(/[^a-z']/g, ''))));
    // rows: anchor line + cells until the next anchor
    const rows = [];
    for (let k2 = first; k2 < run.length; k2++) {
      const vi = matchVariant(run[k2]);
      if (vi >= 0) rows.push({ vi, cells: [] });
      else if (rows.length) rows[rows.length - 1].cells.push(run[k2].trim());
    }
    const hdr = headers; // the anchor-column header was dropped by the stem filter
    let attached = 0;
    for (const r of rows) {
      if (!r.cells.length) continue;
      const pairs = r.cells.map((c, ci) => (hdr[ci % hdr.length] ? `${hdr[ci % hdr.length]} ${c}` : c));
      const v = f.variants[r.vi];
      if (v) { v.scaled = v.scaled || []; v.scaled.push({ title: title || 'By form', text: pairs.join(' · ') }); attached++; }
    }
    if (attached >= 2) { claimed++; keep.push(title ? `[${title} — per-form values attached to each form's statblock above]` : '[per-form table attached to the forms above]'); }
    else { f.debris = (f.debris || 0) + 1; keep.push(...run); }
    i = j;
  }
  if (claimed) f.body = keep.join('\n');
}
// v0.5.0: the Nuclear Toxyderm reprints the RADIATION RULES as two flow-
// shredded tables — exposure-scaled, not variant-scaled, so the disentangler
// rightly declines them. Reflow them into readable colon-led rows instead.
for (const f of merged) {
  const b = f.body ? f.body.split('\n') : [];
  const i0 = b.indexOf('Table: Radiation Exposure');
  if (i0 < 0) continue;
  const SEV = new Set(['mild', 'low', 'moderate', 'high', 'severe']);
  const out2 = b.slice(0, i0);
  out2.push('Table: Radiation Exposure — severity by time of exposure (1 round / 1 min / 10 min / 1 hour / 1 day)');
  let i = i0 + 8; // past the title + seven header lines
  while (i < b.length && b[i] !== 'Table: Radiation Sickness') {
    const t = b[i];
    if (/:$/.test(t)) { out2.push(t); i++; continue; } // section line
    const cells = b.slice(i + 1, i + 6);
    if (cells.length === 5 && cells.every(c => SEV.has(c))) { out2.push(`${t}: ${cells.join(' / ')}`); i += 6; }
    else { out2.push(t); i++; }
  }
  if (b[i] === 'Table: Radiation Sickness') {
    out2.push('Table: Radiation Sickness — Fort save DC and damage by degree of exposure');
    i += 4; // title + 'Degree of Exposure' + 'Fort Save DC' + 'Damage'
    while (i + 2 < b.length && /^(Mild|Low|Moderate|High|Severe)$/.test(b[i])) { out2.push(`${b[i]}: Fort DC ${b[i + 1]} — ${b[i + 2]}`); i += 3; }
  }
  out2.push(...b.slice(i));
  f.body = out2.join('\n');
  delete f.debris;
}

const flagged = merged.filter(f => f.debris);
console.log(`sub-tables disentangled in ${merged.filter(f => f.variants.some(v => v.scaled)).length} families | debris-flagged: ${flagged.length}`);
console.log('  flagged:', flagged.slice(0, 25).map(f => `${f.parent}(${f.debris})`).join(' · '));

const multi = merged.filter(f => f.variants.length > 1);
const vtotal = merged.reduce((s, f) => s + f.variants.length, 0);
writeFileSync(out, JSON.stringify({ _meta: { source: 'E&E Foe Folio (flow dump)', extracted: new Date().toISOString().slice(0, 10), families: merged.length, variants: vtotal }, entries: merged }, null, 1));
console.log(`join-fallback mismatches: ${MISMATCH.length}`);
for (const m of MISMATCH.slice(0, 40)) console.log('  ⚠', m);
console.log(`families: ${merged.length} | variants: ${vtotal} | multi-variant families: ${multi.length} | with page: ${merged.filter(f => f.page).length} | with CR: ${merged.filter(f => f.crMin != null).length}`);
const ae = merged.find(f => f.parent === 'AIR ELEMENTAL');
console.log('AIR ELEMENTAL variants:', ae?.variants.map(v => `${v.label} [CR ${v.challenge_rating}]`).join(' | '));
const al = merged.find(f => f.parent === 'ALICORN');
console.log('ALICORN variants:', al?.variants.map(v => v.label).join(' | '));
