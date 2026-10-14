// cr_model.mjs — PHASE C of the CR audit (Adam: "The word is given", 2026-10-12).
// A deliberately LEGIBLE two-stage model, because the product requirement is a
// CR *calculus* the GM can read beside the statblock, not a black box:
//   Stage 1 — BODY CR: invert the Phase B benchmark curves. For each core
//     measurable (effHP, full AC, best attack, routine damage), find the CR
//     whose band median the foe's value matches (monotone interpolation).
//     defense CR = mean(hpCR, acCR); offense CR = mean(atkCR, dmgCR);
//     body CR = their mean. "HP says 9, AC says 7, damage says 11" — readable.
//   Stage 2 — ABILITY PRICING: ridge-regress the residual (printed − body)
//     on ability-tag indicators (SA/SQ tags, n ≥ 8). Each learned weight is
//     that ability's CR worth across the corpus — the first-order estimate of
//     Adam's synergy multipliers. predicted = body + Σ tag weights + intercept.
// Outputs: data/crcalc.json (per-foe calculus for the Bestiary display),
//          docs/CR_MODEL.md (fit, the priced-ability table, the unexplained docket).
import { readFileSync, writeFileSync } from 'node:fs';

const M = JSON.parse(readFileSync(new URL('../data/metrics.json', import.meta.url), 'utf8'));
const BENCH = JSON.parse(readFileSync(new URL('../data/benchmarks.json', import.meta.url), 'utf8')).bench;
const rows = M.rows.filter(r => !r.template);
const effHP = (r) => r.hp + (r.bonusHp ?? 0);

// ---- Stage 1: monotone benchmark curves (CR → median), inverted ----
function curve(name) {
  const pts = Object.entries(BENCH)
    .filter(([, b]) => b[name] && b[name].n >= 3)
    .map(([cr, b]) => [parseFloat(cr), b[name].med])
    .sort((a, b) => a[0] - b[0]);
  // Enforce monotone non-decreasing medians (running max) so inversion is sane.
  for (let i = 1; i < pts.length; i++) pts[i][1] = Math.max(pts[i][1], pts[i - 1][1]);
  return pts;
}
function invert(pts, v) {
  if (v == null || !pts.length) return null;
  if (v <= pts[0][1]) return pts[0][0];
  for (let i = 1; i < pts.length; i++) {
    if (v <= pts[i][1]) {
      const [c0, v0] = pts[i - 1], [c1, v1] = pts[i];
      return v1 === v0 ? (c0 + c1) / 2 : c0 + (c1 - c0) * (v - v0) / (v1 - v0);
    }
  }
  // Beyond the table: extrapolate on the last segment's slope, capped at +6.
  const [c0, v0] = pts[pts.length - 2], [c1, v1] = pts[pts.length - 1];
  const slope = v1 > v0 ? (c1 - c0) / (v1 - v0) : 0;
  return Math.min(c1 + 6, c1 + slope * (v - v1));
}
const C = { hp: curve('effHPmit'), ac: curve('fullAC'), atk: curve('bestAtk'), dmg: curve('routineAvg'), dc: curve('dcMax'), sv: curve('saveAvg'), hit: curve('maxHitAvg') };
// Forward interpolation (cr -> band-typical value) for the mitigation math.
function interp(pts, cr) {
  if (!pts || !pts.length || cr == null) return null;
  if (cr <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (cr <= pts[i][0]) {
    const [c0, v0] = pts[i - 1], [c1, v1] = pts[i];
    return v0 + (v1 - v0) * (cr - c0) / (c1 - c0);
  }
  return pts[pts.length - 1][1];
}
const NOTES = JSON.parse(readFileSync(new URL('../data/cr_notes.json', import.meta.url), 'utf8')).notes;
const r1 = (x) => x == null ? null : Math.round(x * 10) / 10;

function bodyOf(r) {
  // HARDNESS-AS-MITIGATION (Adam's gavel, 2026-10-13): the T/AC rider's +HP
  // is already in effHP; the per-hit SOAK was the last unmodeled defense.
  // Mitigated HP = effHP x (1 + hardness / band-typical biggest hit) - vs a
  // band hitting ~30 per swing, Hardness 10 is a third more staying power;
  // vs chip damage it approaches immunity. ATTRIBUTABLE: a T/AC-system term.
  const bandHit = Math.max(6, interp(C.hit, r.cr) || 12);
  const mitHP = Math.round(effHP(r) * (1 + (r.hardness || 0) / bandHit));
  const hpCR = invert(C.hp, mitHP);
  const acCR = invert(C.ac, r.fullAC);
  const atkCR = invert(C.atk, r.bestAtk);
  const dmgCR = invert(C.dmg, r.routineAvg);
  // PF1's benchmark lesson: the primary ability DC is a first-class offense
  // number — the save-or-suffer channel the attack/damage pair cannot see.
  const dcCR = invert(C.dc, r.dcMax);
  // Saves join the defense mean (Adam's gavel, 2026-10-12) — the glass-saves
  // construct finally pays for its 6/6/6. SR joins when present, priced by
  // PF1 canon: appropriate SR = CR + 11, so srCR = SR − 11 (floored at 0).
  const svCR = invert(C.sv, r.fort != null ? (r.fort + r.ref + r.will) / 3 : null);
  const srCR = r.srValue != null ? Math.max(0, r.srValue - 11) : null;
  // THE CL COMPONENT (Adam, 2026-10-13): access gates the price, CL caps it
  // — spellCR = min(CL, 2 × highest spell level). A Heritage-feat chassis
  // (CL high, access 1st) prices its casting at 2, not its character level.
  const spCR = r.cl != null ? Math.min(r.cl, r.sMax != null ? 2 * r.sMax : r.cl) : null;
  const def = [hpCR, acCR, svCR, srCR].filter(x => x != null);
  const off = [atkCR, dmgCR, dcCR, spCR].filter(x => x != null);
  if (!def.length || !off.length) return null;
  const defCR = def.reduce((a, b) => a + b) / def.length;
  const offCR = off.reduce((a, b) => a + b) / off.length;
  return { hpCR: r1(hpCR), acCR: r1(acCR), svCR: r1(svCR), srCR: r1(srCR), atkCR: r1(atkCR), dmgCR: r1(dmgCR), dcCR: r1(dcCR), spCR: r1(spCR), defCR: r1(defCR), offCR: r1(offCR), body: (defCR + offCR) / 2 };
}

// ---- Stage 2: ridge regression of (printed − body) on ability tags ----
const tagCount = new Map();
for (const r of rows) for (const t of new Set([...r.sa, ...r.sq])) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
const TAGS = [...tagCount.entries()].filter(([, n]) => n >= 8).map(([t]) => t).sort();
const ti = new Map(TAGS.map((t, i) => [t, i]));
// Numeric feature: DR value (per 10 points) — structured, not string-fragmented (Adam, 2026-10-12).
const DR_COL = TAGS.length;
// The Quicken offense flag stays FITTED (the caster sim will rule it later).
// The defense-cost RUNG left the ridge 2026-10-13: it is now a RULED term
// (the Kobold lesson — a ruled term and its fitted shadow never coexist).
const QK_COL = TAGS.length + 1;
// MASSIVE DAMAGE is NOT a fitted feature: the regression proved the print
// charges zero for it, so it is priced by RULING (Adam, 2026-10-12, Phase D
// calibrated): +1 CR per 2 effectively-100%-forcing attacks/round, cap +3.
// ACTIVE DEFENSE is likewise RULED (Adam, 2026-10-13, defsim-calibrated:
// docs/DEFENSE_SIM.md): +0.5 CR per rung ABOVE move (swift/free/immediate),
// cap +1.5, GATED on quality — counts only while the printed Parry or Dodge
// modifier >= the foe's own band attack benchmark - 2 (a decorative dodge
// prices at zero). One attempt per round at every tier (Adam's A1 ruling);
// the sim showed the rung's worth is the ACTION REFUND, so move-rung
// defense (mitigation paid from the foe's own offense) nets zero.
const P = TAGS.length + 3; // + DR, quicken columns + intercept

const fit = [];
for (const r of rows) {
  const b = bodyOf(r);
  if (!b) continue;
  const x = new Float64Array(P); x[P - 1] = 1;
  // v0.6.10 (the Kobold Inquest): when the CL component carries a foe's
  // casting (spCR live), the 'spells' tag is SUPPRESSED for that foe — the
  // component supersedes the tag (attribution applied inward); the tag
  // refits to price only the casters the harvest could not level.
  for (const t of new Set([...r.sa, ...r.sq])) { if (t === 'spells' && r.cl != null) continue; const i = ti.get(t); if (i != null) x[i] = 1; }
  if (r.drValue) x[DR_COL] = r.drValue / 10;
  if (r.quickenFeat) x[QK_COL] = 1;
  fit.push({ r, b, x, y: r.cr - b.body });
}
// Normal equations with ridge λ (intercept unpenalized).
const L = 3;
const A = Array.from({ length: P }, () => new Float64Array(P));
const g = new Float64Array(P);
for (const f of fit) {
  for (let i = 0; i < P; i++) {
    if (!f.x[i]) continue;
    g[i] += f.x[i] * f.y;
    for (let j = 0; j < P; j++) if (f.x[j]) A[i][j] += f.x[i] * f.x[j];
  }
}
for (let i = 0; i < P - 1; i++) A[i][i] += L;
// (DR column penalized like the tags; only the intercept rides free.)
// Gaussian elimination.
const w = (() => {
  const a = A.map((row, i) => [...row, g[i]]);
  for (let col = 0; col < P; col++) {
    let piv = col;
    for (let i = col + 1; i < P; i++) if (Math.abs(a[i][col]) > Math.abs(a[piv][col])) piv = i;
    [a[col], a[piv]] = [a[piv], a[col]];
    if (Math.abs(a[col][col]) < 1e-9) continue;
    for (let i = 0; i < P; i++) {
      if (i === col) continue;
      const f = a[i][col] / a[col][col];
      if (!f) continue;
      for (let j = col; j <= P; j++) a[i][j] -= f * a[col][j];
    }
  }
  return a.map((row, i) => Math.abs(row[i]) < 1e-9 ? 0 : row[P] / row[i]);
})();
const intercept = w[P - 1];

// ---- score, fit stats, calculus ----
let se = 0, ae = 0, seBody = 0;
const calc = {};
for (const f of fit) {
  const contribs = [];
  for (const t of new Set([...f.r.sa, ...f.r.sq])) {
    if (t === 'spells' && f.r.cl != null) continue; // superseded by spCR
    const i = ti.get(t);
    if (i != null && Math.abs(w[i]) >= 0.05) contribs.push({ t, w: r1(w[i]) });
  }
  if (f.r.drValue && Math.abs(w[DR_COL] * f.r.drValue / 10) >= 0.05) contribs.push({ t: `DR ${f.r.drValue}`, w: r1(w[DR_COL] * f.r.drValue / 10) });
  if (f.r.quickenFeat && Math.abs(w[QK_COL]) >= 0.05) contribs.push({ t: 'Quicken', w: r1(w[QK_COL]) });
  // The Phase D ruled term: +1 CR per 2 forcing attacks (avg >= 18), cap +3.
  const ruledMd = f.r.mdHits ? Math.min(3, Math.floor(f.r.mdHits / 2)) : 0;
  if (ruledMd) contribs.push({ t: `MD pressure ×${f.r.mdHits} (ruled)`, w: ruledMd });
  // THE ACTIVE-DEFENSE RULED TERM (Adam, 2026-10-13; defsim-calibrated):
  // +0.5/rung above move, cap +1.5, gated on the printed maneuver quality
  // vs the foe's OWN band attack benchmark (Adam's gavel: own band).
  const adRungs = Math.max(0, (f.r.defRung || 0) - 1);
  const adMod = Math.max(f.r.parryMod ?? -99, f.r.dodgeMod ?? -99);
  const bandAtk = interp(C.atk, f.r.cr);
  const ruledAd = (adRungs > 0 && bandAtk != null && adMod >= bandAtk - 2) ? Math.min(1.5, 0.5 * adRungs) : 0;
  if (ruledAd) contribs.push({ t: `active defense ×${adRungs} (ruled)`, w: ruledAd });
  contribs.sort((a, b) => Math.abs(b.w) - Math.abs(a.w));
  const abil = contribs.reduce((s, c) => s + c.w, 0);
  const pred = f.b.body + abil + intercept;
  const resid = f.r.cr - pred;
  se += resid * resid; ae += Math.abs(resid); seBody += f.y * f.y;
  // Adam (2026-10-12): "trusts its tricks" is not enough — name the tricks.
  // The unpriced tags (below the n≥8 corpus floor, so the model holds no
  // weight for them) are the residual's prime suspects: list them, SA first.
  const known = new Set(contribs.map(c => c.t));
  const unpriced = [
    ...f.r.sa.filter(t => !ti.has(t) || (!known.has(t) && Math.abs(w[ti.get(t)]) < 0.05)),
    ...f.r.sq.filter(t => !ti.has(t) || (!known.has(t) && Math.abs(w[ti.get(t)]) < 0.05)),
  ].filter((t, i, a) => a.indexOf(t) === i).slice(0, 4);
  // SYNTHETIC NOTABLES (Adam, 2026-10-12, the Alicorn ruling): a body
  // component towering over the printed CR is itself a trick worth naming
  // at a glance - Exceptional Saves, Magic Resistant, Fortress AC.
  const notable = [];
  if (f.b.svCR != null && f.b.svCR - f.r.cr >= 4) notable.push('Exceptional Saves');
  if (f.b.srCR != null && f.b.srCR - f.r.cr >= 4) notable.push(`Magic Resistant (SR ${f.r.srValue})`);
  if (f.b.acCR != null && f.b.acCR - f.r.cr >= 5) notable.push('Fortress AC');
  calc[`${f.r.fam}#${f.r.vi}`] = {
    printed: f.r.cr, body: r1(f.b.body), def: f.b.defCR, off: f.b.offCR,
    hpCR: f.b.hpCR, acCR: f.b.acCR, svCR: f.b.svCR, srCR: f.b.srCR, atkCR: f.b.atkCR, dmgCR: f.b.dmgCR, dcCR: f.b.dcCR, spCR: f.b.spCR,
    abil: r1(abil), contribs: contribs.slice(0, 6), unpriced, pred: r1(pred), resid: r1(resid),
    derived: !!f.r.derivedRoutine,
    ...(notable.length ? { notable } : {}),
    ...(f.r.mdHits ? { mdHits: f.r.mdHits, maxHit: f.r.maxHitAvg } : {}),
    ...(f.r.crWas != null ? { was: f.r.crWas } : {}),
    ...(NOTES[`${f.r.fam}#${f.r.vi}`] ? { note: NOTES[`${f.r.fam}#${f.r.vi}`] } : {}),
  };
  f.pred = pred; f.resid = resid;
}
const n = fit.length;
const meanCR = fit.reduce((s, f) => s + f.r.cr, 0) / n;
const ssTot = fit.reduce((s, f) => s + (f.r.cr - meanCR) ** 2, 0);
const stats = {
  n, tags: TAGS.length, lambda: L, intercept: r1(intercept),
  r2: Math.round((1 - se / ssTot) * 1000) / 1000,
  r2BodyOnly: Math.round((1 - seBody / ssTot) * 1000) / 1000,
  mae: r1(ae / n),
};

writeFileSync(new URL('../data/crcalc.json', import.meta.url), JSON.stringify({
  _meta: { generated: new Date().toISOString().slice(0, 10), ...stats },
  weights: Object.fromEntries(TAGS.map((t, i) => [t, r1(w[i])]).filter(([, v]) => Math.abs(v) >= 0.05)),
  calc,
}, null, 1));

// ---- the report ----
const priced = [...TAGS.map((t, i) => ({ t, w: w[i], n: tagCount.get(t) })), { t: 'DR (per 10 points)', w: w[DR_COL], n: fit.filter(f => f.r.drValue).length }, { t: 'MD pressure (RULED: +1 per 2 forcing attacks, cap +3)', w: 0.5, n: fit.filter(f => f.r.mdHits).length }, { t: 'active defense (RULED: +0.5/rung above move, quality-gated, cap +1.5)', w: 0.5, n: fit.filter(f => Math.max(0, (f.r.defRung || 0) - 1) > 0 && Math.max(f.r.parryMod ?? -99, f.r.dodgeMod ?? -99) >= (interp(C.atk, f.r.cr) ?? 99) - 2).length }, { t: 'Quicken feat (fitted)', w: w[QK_COL], n: fit.filter(f => f.r.quickenFeat).length }].sort((a, b) => b.w - a.w);
const docket = [...fit].sort((a, b) => Math.abs(b.resid) - Math.abs(a.resid)).slice(0, 24);
const out = [];
out.push(`# CR MODEL — Phase C: body CR + priced abilities (generated ${new Date().toISOString().slice(0, 10)})`);
out.push('');
out.push(`Two-stage legible model over ${n} foes. **Fit:** body CR alone R² ${stats.r2BodyOnly}; with ${stats.tags} priced ability tags (ridge λ=${L}) **R² ${stats.r2}, mean absolute error ${stats.mae} CR**; intercept ${stats.intercept}. predicted CR = body + Σ ability weights + intercept.`);
out.push('');
out.push('## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)');
out.push('');
out.push('| ability | CR worth | bearers |');
out.push('|---|---|---|');
for (const p of priced.filter(p => p.w >= 0.3).slice(0, 30)) out.push(`| ${p.t} | +${r1(p.w)} | ${p.n} |`);
out.push('| … | | |');
for (const p of priced.filter(p => p.w <= -0.3).slice(-12)) out.push(`| ${p.t} | ${r1(p.w)} | ${p.n} |`);
out.push('');
out.push('Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.');
out.push('');
out.push('## The unexplained docket (|printed − predicted|, the true mis-rating candidates)');
out.push('');
out.push('| foe | printed | body | abilities | predicted | residual |');
out.push('|---|---|---|---|---|---|');
for (const f of docket) out.push(`| ${f.r.fam}${f.r.label && f.r.label !== f.r.fam ? ' — ' + f.r.label : ''} (p.${f.r.page}) | ${f.r.cr} | ${r1(f.b.body)} | ${r1(f.pred - f.b.body - intercept)} | ${r1(f.pred)} | ${f.resid > 0 ? '+' : ''}${r1(f.resid)} |`);
out.push('');
out.push('A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).');
out.push('');
writeFileSync(new URL('../docs/CR_MODEL.md', import.meta.url), out.join('\n'));
console.log(JSON.stringify(stats));
console.log('top abilities:', priced.slice(0, 8).map(p => `${p.t} +${r1(p.w)}`).join(', '));
