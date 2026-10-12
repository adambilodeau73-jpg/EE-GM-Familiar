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
const C = { hp: curve('effHP'), ac: curve('fullAC'), atk: curve('bestAtk'), dmg: curve('routineAvg') };
const r1 = (x) => x == null ? null : Math.round(x * 10) / 10;

function bodyOf(r) {
  const hpCR = invert(C.hp, effHP(r));
  const acCR = invert(C.ac, r.fullAC);
  const atkCR = invert(C.atk, r.bestAtk);
  const dmgCR = invert(C.dmg, r.routineAvg);
  const def = [hpCR, acCR].filter(x => x != null);
  const off = [atkCR, dmgCR].filter(x => x != null);
  if (!def.length || !off.length) return null;
  const defCR = def.reduce((a, b) => a + b) / def.length;
  const offCR = off.reduce((a, b) => a + b) / off.length;
  return { hpCR: r1(hpCR), acCR: r1(acCR), atkCR: r1(atkCR), dmgCR: r1(dmgCR), defCR: r1(defCR), offCR: r1(offCR), body: (defCR + offCR) / 2 };
}

// ---- Stage 2: ridge regression of (printed − body) on ability tags ----
const tagCount = new Map();
for (const r of rows) for (const t of new Set([...r.sa, ...r.sq])) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
const TAGS = [...tagCount.entries()].filter(([, n]) => n >= 8).map(([t]) => t).sort();
const ti = new Map(TAGS.map((t, i) => [t, i]));
const P = TAGS.length + 1; // + intercept

const fit = [];
for (const r of rows) {
  const b = bodyOf(r);
  if (!b) continue;
  const x = new Float64Array(P); x[P - 1] = 1;
  for (const t of new Set([...r.sa, ...r.sq])) { const i = ti.get(t); if (i != null) x[i] = 1; }
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
    const i = ti.get(t);
    if (i != null && Math.abs(w[i]) >= 0.05) contribs.push({ t, w: r1(w[i]) });
  }
  contribs.sort((a, b) => Math.abs(b.w) - Math.abs(a.w));
  const abil = contribs.reduce((s, c) => s + c.w, 0);
  const pred = f.b.body + abil + intercept;
  const resid = f.r.cr - pred;
  se += resid * resid; ae += Math.abs(resid); seBody += f.y * f.y;
  calc[`${f.r.fam}#${f.r.vi}`] = {
    printed: f.r.cr, body: r1(f.b.body), def: f.b.defCR, off: f.b.offCR,
    hpCR: f.b.hpCR, acCR: f.b.acCR, atkCR: f.b.atkCR, dmgCR: f.b.dmgCR,
    abil: r1(abil), contribs: contribs.slice(0, 6), pred: r1(pred), resid: r1(resid),
    derived: !!f.r.derivedRoutine,
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
const priced = TAGS.map((t, i) => ({ t, w: w[i], n: tagCount.get(t) })).sort((a, b) => b.w - a.w);
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
