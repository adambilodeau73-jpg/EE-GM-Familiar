// mdsim.mjs — PHASE D: the Massive Damage calibration sim (Adam: "The word is
// given for Phase D", 2026-10-12). The question the regression could not
// answer (the FF print charges ZERO for MD pressure): what is a Massive
// Damage check WORTH, in CR?
//
// Method — the HELM way, scoped to the core loop:
//   A benchmark party of 4 adventurers at level L (statted from OUR OWN
//   corpus curves — GMG p.40: a PC's CR is their ECL, so a level-L PC is
//   statistically a CR-L creature: median effHP/AC/attack/routine/saves
//   from data/benchmarks.json; Con 14, the typical adventurer our MD wire
//   assumes) fights the foe to the death, n trials per cell, seeded LCG.
//   Deterministic damage (per-hit averages), random d20s. No crits, no
//   riders (poison/engulf/breath stay out of BOTH arms) — the A/B isolates
//   the weapon-routine MD channel alone, so the DELTA is clean even though
//   absolute win rates run hot for the party.
//   E&E MD RULE (HH): a single hit >= the target's current Con forces a
//   Fort save, DC 15; failure drops the target to dying. Both sides.
// Output per foe: party win% by level, MD off vs on; the foe's EFFECTIVE
// CR under MD = the level where the MD-ON curve crosses the MD-OFF curve's
// value at L = printed CR; MD CR-worth = effective − printed.
// Usage: node tools/mdsim.mjs [--n 2000]
import { readFileSync } from 'node:fs';

const M = JSON.parse(readFileSync(new URL('../data/metrics.json', import.meta.url), 'utf8'));
const BENCH = JSON.parse(readFileSync(new URL('../data/benchmarks.json', import.meta.url), 'utf8')).bench;
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1]);
const N = Number(args.get('n') ?? 2000);

const rows = Object.fromEntries(M.rows.map(r => [`${r.fam}#${r.vi}`, r]));
const FOES = ['MONSTROUS SCORPION#6', 'GARBAGE TOXYDERM#1', 'TOXIC SLUDGE#1'];

// Smooth benchmark stat at L: monotone running-max medians, linearly
// interpolated (nearest-band picking made the first run's curves jagged).
function smooth(name) {
  const pts = Object.entries(BENCH).filter(([, b]) => b[name] && b[name].n >= 3)
    .map(([cr, b]) => [parseFloat(cr), b[name].med]).sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < pts.length; i++) pts[i][1] = Math.max(pts[i][1], pts[i - 1][1]);
  return (L) => {
    if (L <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (L <= pts[i][0]) {
      const [c0, v0] = pts[i - 1], [c1, v1] = pts[i];
      return v0 + (v1 - v0) * (L - c0) / (c1 - c0);
    }
    return pts[pts.length - 1][1];
  };
}
const S = { hp: smooth('effHP'), ac: smooth('fullAC'), atk: smooth('bestAtk'), dmg: smooth('routineAvg') };
// Party of four: body from the corpus curves; FORT from the d20 PC rules
// (the corpus is foe-biased on saves) — two good-Fort members (2 + L/2 + 2
// ability) and two poor (L/3 + 1): the mixed party the MD rule actually meets.
const partyAt = (L) => [0, 1, 2, 3].map(i => ({
  hp: S.hp(L), maxhp: S.hp(L), ac: S.ac(L), atk: S.atk(L),
  hits: [S.dmg(L) / 2, S.dmg(L) / 2],
  fort: i < 2 ? 2 + Math.floor(L / 2) + 2 : Math.floor(L / 3) + 1,
  con: 14,
}));

// Seeded LCG d20.
function roller(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 16) % 20 + 1; }; }

function battle(foeRow, L, mdOn, seed) {
  const d20 = roller(seed);
  const foe = {
    hp: foeRow.hp + (foeRow.bonusHp ?? 0), ac: foeRow.fullAC,
    attacks: foeRow.attacks.flatMap(a => Array.from({ length: a.n }, () => ({ bonus: a.bonus, dmg: a.avg }))),
    fort: foeRow.fort ?? 5, con: foeRow.attrs?.con ?? 14,
  };
  const party = partyAt(L);
  const mdCheck = (fort) => d20() + fort >= 15; // Fort DC 15
  for (let round = 0; round < 100; round++) {
    // party swings
    for (const pc of party) {
      if (pc.hp <= 0) continue;
      for (const dmg of pc.hits) {
        const nat = d20();
        if (nat === 1) continue;
        if (nat === 20 || nat + pc.atk >= foe.ac) {
          foe.hp -= dmg;
          if (mdOn && dmg >= foe.con && !mdCheck(foe.fort)) foe.hp = 0;
        }
      }
    }
    if (foe.hp <= 0) return { win: true, rounds: round + 1, lost: party.filter(p => p.hp <= 0).length, toll: 1 - party.reduce((t, p) => t + Math.max(0, p.hp), 0) / party.reduce((t, p) => t + p.maxhp, 0) };
    // foe swings — spread across live PCs round-robin
    const live = () => party.filter(p => p.hp > 0);
    let ti = 0;
    for (const a of foe.attacks) {
      const ts = live(); if (!ts.length) break;
      const t = ts[ti++ % ts.length];
      const nat = d20();
      if (nat === 1) continue;
      if (nat === 20 || nat + a.bonus >= t.ac) {
        t.hp -= a.dmg;
        if (mdOn && a.dmg >= t.con && !mdCheck(t.fort)) t.hp = 0;
      }
    }
    if (!party.some(p => p.hp > 0)) return { win: false, rounds: round + 1, lost: 4, toll: 1 };
  }
  return { win: foe.hp < party.reduce((t, p) => t + Math.max(0, p.hp), 0), rounds: 100, lost: party.filter(p => p.hp <= 0).length, toll: 1 - party.reduce((t, p) => t + Math.max(0, p.hp), 0) / party.reduce((t, p) => t + p.maxhp, 0) };
}

const pct = (x) => (100 * x).toFixed(0).padStart(4);
for (const key of FOES) {
  const r = rows[key];
  const printed = r.cr;
  console.log(`\n== ${key} (${r.label ?? ''}) — printed CR ${printed}, foe Con ${r.attrs?.con ?? '?'} , MD-forcing attacks/rd: ${r.mdHits} ==`);
  console.log('party level | win% MD-OFF | win% MD-ON | PCs lost OFF→ON | HP toll OFF→ON | mean rds OFF→ON');
  const curves = { off: {}, on: {} };
  for (let L = printed - 3; L <= printed + 2; L++) {
    const cell = {};
    for (const md of [false, true]) {
      let w = 0, lost = 0, rds = 0, toll = 0;
      for (let i = 0; i < N; i++) { const b = battle(r, L, md, 1234567 + i * 7919 + L * 104729 + (md ? 7 : 0)); w += b.win ? 1 : 0; lost += b.lost; rds += b.rounds; toll += b.toll; }
      cell[md ? 'on' : 'off'] = { w: w / N, lost: lost / N, rds: rds / N, toll: toll / N };
      curves[md ? 'on' : 'off'][L] = { w: w / N, lost: lost / N };
    }
    console.log(`     ${String(L).padStart(2)}     |    ${pct(cell.off.w)}%    |   ${pct(cell.on.w)}%    |  ${cell.off.lost.toFixed(2)} → ${cell.on.lost.toFixed(2)}  |  ${pct(cell.off.toll)}% → ${pct(cell.on.toll)}%  |  ${cell.off.rds.toFixed(1)} → ${cell.on.rds.toFixed(1)}`);
  }
  // Effective CR under MD: match PCS LOST (the lethality instrument — win%
  // saturates at 100 in a 4-vs-1). Find the level where MD-ON lethality
  // falls to the MD-OFF lethality at L = printed.
  const target = curves.off[printed].lost;
  let eff = null;
  for (let L = printed - 3; L <= printed + 2; L++) {
    if (curves.on[L].lost <= target + 0.05) {
      const prev = curves.on[L - 1];
      eff = prev && prev.lost > curves.on[L].lost ? L - (target + 0.05 - curves.on[L].lost) / (prev.lost - curves.on[L].lost) : L;
      break;
    }
  }
  console.log(eff != null
    ? `>> MD-OFF loses ${target.toFixed(2)} PCs at printed CR ${printed}. MD-ON lethality falls to that at party level ≈ ${eff.toFixed(1)} — EFFECTIVE CR under Massive Damage ≈ ${eff.toFixed(1)} (worth ${(eff - printed) >= 0 ? '+' : ''}${(eff - printed).toFixed(1)} CR).`
    : `>> MD-ON lethality never falls to the MD-OFF baseline inside the window — worth > +2 CR here.`);
}
