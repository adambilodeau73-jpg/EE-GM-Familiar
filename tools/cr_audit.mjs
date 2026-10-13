// cr_audit.mjs — PHASE B of the CR audit (Adam, 2026-10-12): descriptive
// benchmarks per CR band + within-band outlier scoring over data/metrics.json.
// Outputs: data/benchmarks.json (the per-CR expectation table — the Forge's
// future "runs hot/cold" chips and the CR-calculus display feed) and
// docs/CR_AUDIT.md (the human report: curves, outlier docket, dragon
// self-consistency, ability-tag census).
import { readFileSync, writeFileSync } from 'node:fs';

const M = JSON.parse(readFileSync(new URL('../data/metrics.json', import.meta.url), 'utf8'));
const rows = M.rows.filter(r => !r.template);

const effHP = (r) => r.hp + (r.bonusHp ?? 0);
// HARDNESS-AS-MITIGATION (Adam, 2026-10-13): benchmarks and model must speak
// the SAME metric — mitigated HP = effHP x (1 + hardness / band-typical
// biggest hit). Two-pass: build the hit curve from the rows, then attach.
(function () {
  const pts = (() => {
    const by = new Map();
    for (const r of rows) { if (r.maxHitAvg == null) continue; const k = r.cr; if (!by.has(k)) by.set(k, []); by.get(k).push(r.maxHitAvg); }
    const out = [...by.entries()].filter(([, a]) => a.length >= 3)
      .map(([cr, a]) => { const s2 = [...a].sort((x, y) => x - y); return [cr, s2[Math.floor(s2.length / 2)]]; })
      .sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < out.length; i++) out[i][1] = Math.max(out[i][1], out[i - 1][1]);
    return out;
  })();
  const bandHit = (cr) => {
    if (!pts.length) return 12;
    if (cr <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (cr <= pts[i][0]) { const [c0, v0] = pts[i - 1], [c1, v1] = pts[i]; return v0 + (v1 - v0) * (cr - c0) / (c1 - c0); }
    return pts[pts.length - 1][1];
  };
  for (const r of rows) r._mitHP = Math.round(effHP(r) * (1 + (r.hardness || 0) / Math.max(6, bandHit(r.cr) || 12)));
})();
const q = (arr, p) => { const a = [...arr].sort((x, y) => x - y); if (!a.length) return null; const i = (a.length - 1) * p; const lo = Math.floor(i); return a[lo] + (a[Math.ceil(i)] - a[lo]) * (i - lo); };
const fmt = (x) => x == null ? '—' : (Math.round(x * 10) / 10).toString();

// ---- CR buckets ----
const byCR = new Map();
for (const r of rows) { const k = r.cr; if (!byCR.has(k)) byCR.set(k, []); byCR.get(k).push(r); }
const crKeys = [...byCR.keys()].sort((a, b) => a - b);

const METRICS = {
  effHP: { get: effHP, log: true },
  effHPmit: { get: r => r._mitHP, log: true },
  fullAC: { get: r => r.fullAC, log: false },
  touchAC: { get: r => r.touchAC, log: false },
  hardness: { get: r => r.hardness, log: false },
  bestAtk: { get: r => r.bestAtk, log: false },
  // Derived dragon routines (my canon reconstruction, not print) stay OUT of
  // the benchmarks and the offense score — their uniformity poisons the bands
  // they dominate; dragon offense is scored on the PRINTED melee bonus alone.
  routineAvg: { get: r => r.derivedRoutine ? null : r.routineAvg, log: true },
  dcMax: { get: r => r.dcMax, log: false },
  saveAvg: { get: r => r.fort != null ? Math.round(10 * (r.fort + r.ref + r.will) / 3) / 10 : null, log: false },
  maxHitAvg: { get: r => r.maxHitAvg, log: true },
  fort: { get: r => r.fort, log: false },
  ref: { get: r => r.ref, log: false },
  will: { get: r => r.will, log: false },
};

const bench = {};
for (const cr of crKeys) {
  const g = byCR.get(cr);
  bench[cr] = { n: g.length };
  for (const [name, m] of Object.entries(METRICS)) {
    const vals = g.map(m.get).filter(v => v != null && isFinite(v));
    bench[cr][name] = vals.length ? { p25: q(vals, .25), med: q(vals, .5), p75: q(vals, .75), n: vals.length } : null;
  }
}

// ---- within-band robust z (median/IQR; log-space for the growth metrics) ----
function zOf(r, name) {
  const b = bench[r.cr]?.[name];
  if (!b || b.n < 5) return null;
  const m = METRICS[name];
  let v = m.get(r); if (v == null || !isFinite(v)) return null;
  let med = b.med, iqr = b.p75 - b.p25;
  if (m.log) { v = Math.log(Math.max(1, v)); med = Math.log(Math.max(1, b.med)); iqr = Math.log(Math.max(1.0001, b.p75)) - Math.log(Math.max(1, b.p25)); }
  // Floor σ: homogeneous bands (same-family runs) otherwise explode tiny
  // absolute differences into double-digit z.
  const sigma = Math.max(iqr / 1.35, m.log ? 0.2 : 1.5);
  return (v - med) / sigma;
}
const scored = rows.map(r => {
  const dz = [zOf(r, 'effHP'), zOf(r, 'fullAC')].filter(x => x != null);
  const oz = [zOf(r, 'bestAtk'), zOf(r, 'routineAvg')].filter(x => x != null);
  const def = dz.length ? dz.reduce((a, b) => a + b) / dz.length : null;
  const off = oz.length ? oz.reduce((a, b) => a + b) / oz.length : null;
  const overall = def != null && off != null ? (def + off) / 2 : null;
  return { r, def, off, overall };
}).filter(s => s.overall != null && bench[s.r.cr].n >= 5);
scored.sort((a, b) => b.overall - a.overall);
const hot = scored.slice(0, 20);
const cold = scored.slice(-20).reverse();

// ---- dragon age-ladder self-consistency ----
const dragons = new Map();
for (const r of rows) if (r.type === 'Dragon' && /DRAGON/.test(r.fam)) { if (!dragons.has(r.fam)) dragons.set(r.fam, []); dragons.get(r.fam).push(r); }
const inversions = [];
for (const [fam, list] of dragons) {
  list.sort((a, b) => a.cr - b.cr);
  for (let i = 1; i < list.length; i++) {
    if (effHP(list[i]) < effHP(list[i - 1])) inversions.push(`${fam}: effHP falls ${effHP(list[i - 1])}→${effHP(list[i])} at CR ${list[i - 1].cr}→${list[i].cr} (${list[i - 1].label}→${list[i].label})`);
    if (list[i].routineAvg != null && list[i - 1].routineAvg != null && list[i].routineAvg < list[i - 1].routineAvg)
      inversions.push(`${fam}: routine falls ${list[i - 1].routineAvg}→${list[i].routineAvg} at CR ${list[i - 1].cr}→${list[i].cr}`);
  }
}

// ---- ability-tag census (the Phase C feature seed + "valuable abilities") ----
const tagStat = new Map();
for (const r of rows) for (const t of [...r.sa, ...r.sq]) {
  if (!tagStat.has(t)) tagStat.set(t, { n: 0, crSum: 0 });
  const s = tagStat.get(t); s.n++; s.crSum += r.cr;
}
const tagRows = [...tagStat.entries()].filter(([, s]) => s.n >= 5)
  .map(([t, s]) => ({ t, n: s.n, meanCR: s.crSum / s.n }))
  .sort((a, b) => b.n - a.n);

// ---- write benchmarks.json ----
writeFileSync(new URL('../data/benchmarks.json', import.meta.url), JSON.stringify({
  _meta: { generated: M._meta.generated, rows: rows.length, note: 'per-CR p25/med/p75 for the CR-calculus display and Forge hot/cold chips' },
  bench,
}, null, 1));

// ---- write the report ----
const L = [];
L.push('# CR AUDIT — Phase B: the descriptive benchmarks (generated ' + M._meta.generated + ')');
L.push('');
L.push(`Corpus: ${rows.length} non-template variants with CR (${M._meta.rows} harvested; coverage — AC ${M._meta.coverage.ac}, saves ${M._meta.coverage.saves}, offense ${M._meta.coverage.offense}). Method: per-CR percentile bands; outliers scored by robust within-band z (median/IQR, log-space for HP and damage), defense = mean z(effHP, fullAC), offense = mean z(bestAtk, routine), overall = their mean. Bands with n < 5 are reported but not scored.`);
L.push('');
L.push('## The benchmark table (median [p25–p75])');
L.push('');
L.push('| CR | n | eff HP | full AC | touch AC | best atk | routine dmg | Fort/Ref/Will |');
L.push('|---|---|---|---|---|---|---|---|');
for (const cr of crKeys) {
  const b = bench[cr];
  const c = (name) => b[name] ? `${fmt(b[name].med)} [${fmt(b[name].p25)}–${fmt(b[name].p75)}]` : '—';
  const sv = ['fort', 'ref', 'will'].map(s => b[s] ? fmt(b[s].med) : '—').join('/');
  L.push(`| ${cr} | ${b.n} | ${c('effHP')} | ${c('fullAC')} | ${c('touchAC')} | ${c('bestAtk')} | ${c('routineAvg')} | ${sv} |`);
}
L.push('');
L.push('## The outlier docket — HOT (over-statted for their CR: candidates for a CR raise or a deliberate-terror note)');
L.push('');
L.push('| foe | CR | overall z | def z | off z | eff HP | AC | routine |');
L.push('|---|---|---|---|---|---|---|---|');
for (const s of hot) L.push(`| ${s.r.fam}${s.r.label && s.r.label !== s.r.fam ? ' — ' + s.r.label : ''} (p.${s.r.page}) | ${s.r.cr} | ${fmt(s.overall)} | ${fmt(s.def)} | ${fmt(s.off)} | ${effHP(s.r)} | ${s.r.fullAC} | ${fmt(s.r.routineAvg)} |`);
L.push('');
L.push('## The outlier docket — COLD (under-statted: candidates for a CR cut or an ability-tax explanation)');
L.push('');
L.push('| foe | CR | overall z | def z | off z | eff HP | AC | routine |');
L.push('|---|---|---|---|---|---|---|---|');
for (const s of cold) L.push(`| ${s.r.fam}${s.r.label && s.r.label !== s.r.fam ? ' — ' + s.r.label : ''} (p.${s.r.page}) | ${s.r.cr} | ${fmt(s.overall)} | ${fmt(s.def)} | ${fmt(s.off)} | ${effHP(s.r)} | ${s.r.fullAC} | ${fmt(s.r.routineAvg)} |`);
L.push('');
L.push('**Reading the docket:** a COLD foe whose body is weak for its CR usually carries its price in abilities the statline cannot show (the synergy problem) — the docket is therefore also a ranked list of WHERE the ability multipliers live, which is exactly the Phase C feature-engineering queue. A HOT foe with no compensating ability tax is a genuine mis-rating candidate.');
L.push('');
L.push('## Dragon age-ladder self-consistency (16 internal CR ladders)');
L.push('');
if (inversions.length) { for (const i of inversions) L.push('- ⚠ ' + i); } else L.push('No inversions: every dragon family\'s effective HP and attack routine rise monotonically with CR across all twelve ages. The Wyrm-pass data is internally consistent.');
L.push('');
L.push('## Ability-tag census (n ≥ 5 — the Phase C feature seed and the "valuable abilities" vocabulary)');
L.push('');
L.push('| tag | n | mean CR |');
L.push('|---|---|---|');
for (const t of tagRows.slice(0, 40)) L.push(`| ${t.t} | ${t.n} | ${fmt(t.meanCR)} |`);
L.push('');
L.push(`(${tagRows.length} tags total at n ≥ 5; full set in data/metrics.json rows. A tag whose bearers' mean CR runs far above the corpus mean while their BODIES score cold is a high-value ability — the first crude synergy signal, formalized in Phase C.)`);
L.push('');
writeFileSync(new URL('../docs/CR_AUDIT.md', import.meta.url), L.join('\n'));
console.log(`bands ${crKeys.length}, scored ${scored.length}, hot/cold 20/20, dragon inversions ${inversions.length}, tags ${tagRows.length}`);
console.log('hot #1:', hot[0].r.fam, hot[0].r.label, 'CR', hot[0].r.cr, 'z', fmt(hot[0].overall));
console.log('cold #1:', cold[0].r.fam, cold[0].r.label, 'CR', cold[0].r.cr, 'z', fmt(cold[0].overall));
