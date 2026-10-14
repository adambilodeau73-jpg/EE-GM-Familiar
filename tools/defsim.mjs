// defsim.mjs — THE ACTIVE-DEFENSE SIM (TODO §128 phase 3; the personal-combat
// engine's first hat). Audits the ridge-fitted +0.5/rung price with real combat
// math, prices the maneuver itself, and calibrates on the Jumping Jack.
//
// RULES AS PRINTED (HH pp.373-378, 360, 17148/17235 dump lines):
//   Dodge attempt  = 1d20 + Ref save mod + Defense bonus + dodge AC bonuses
//   Parry attempt  = 1d20 + BAB + Str mod + Defense bonus + shield AC bonus
//   DC = the incoming attack roll; >= means the attack MISSES.
//   Nat-20 attacks can only be answered by a nat-20 defense roll.
//   Ready costs: move (universal baseline) / swift (Dodge, DMA) /
//   free (Improved) / declare-as-immediate-free (Advanced tier, innate).
//   A readied maneuver names ONE opponent; it resolves as an immediate free
//   action when that opponent's attack would otherwise HIT. Advanced tier
//   needs no ready, so it answers ANY attacker. Immediate actions are denied
//   while flat-footed (improved uncanny dodge restores them).
//
// SIM ASSUMPTIONS (flagged for the gavel, conservative where the book is silent):
//   A1. One resolved attempt per round per maneuver, all rungs (the printed
//       class features that exceed this say so explicitly: "one FREE Dodge or
//       Parry each round" — the ceiling norm). Advanced tier's only edge here
//       is covering undeclared/any attackers.
//   A2. The attempt fires on the FIRST would-be hit from a covered attacker.
//   A3. Round budget: standard + move + swift. Full attack = standard + move.
//       Ready-at-move ⇒ the defender's own routine drops to a single attack.
//
// OUTPUTS: per cell — damage-intake reduction, survival (effHP) multiplier,
// CR-equivalent via the benchmark effHP curve; the offense ledger per rung;
// the Jumping Jack case study at its printed numbers.
import { readFileSync } from 'node:fs';

const TRIALS = 4000;
const d20 = () => 1 + Math.floor(Math.random() * 20);

// ---- benchmark curves (same inversion the calculus uses) ----
const bench = JSON.parse(readFileSync(new URL('../data/benchmarks.json', import.meta.url), 'utf8')).bench;
function curve(metric) {
  const pts = Object.entries(bench).filter(([, b]) => b[metric] && b[metric].n >= 3)
    .map(([cr, b]) => [parseFloat(cr), b[metric].med]).sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < pts.length; i++) pts[i][1] = Math.max(pts[i][1], pts[i - 1][1]);
  return pts;
}
const interp = (pts, x) => {
  if (!pts.length) return null;
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }
};
const invert = (pts, y) => {
  if (!pts.length) return null;
  if (y <= pts[0][1]) return pts[0][0];
  if (y >= pts[pts.length - 1][1]) return pts[pts.length - 1][0];
  for (let i = 1; i < pts.length; i++) if (y <= pts[i][1]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y1 === y0 ? x1 : x0 + (x1 - x0) * (y - y0) / (y1 - y0);
  }
};
const C = { effHP: curve('effHPmit'), ac: curve('fullAC'), atk: curve('bestAtk'), rtn: curve('routineAvg') };

// ---- one combat: N attackers vs the defender, count rounds to drop ----
// Defender: {hp, ac, defMod (dodge or parry roll modifier), rung, covered}
//   rung: 'none' | 'move' | 'swift' | 'free' | 'immediate'
//   covered: how many attacker STREAMS the declaration can answer
//            (1 for readied rungs, all for 'immediate').
// Attacker: {atk, hits: [bonus,...], dmgPerHit}
function fight(defender, attackers) {
  let hp = defender.hp, rounds = 0, intake = 0;
  while (hp > 0 && rounds < 200) {
    rounds++;
    let attemptLeft = defender.rung === 'none' ? 0 : 1; // A1
    for (let a = 0; a < attackers.length; a++) {
      const covered = defender.rung === 'immediate' ? true : a === 0; // declared = stream 0
      for (const bonus of attackers[a].hits) {
        const roll = d20();
        const total = roll + bonus;
        const hit = roll === 20 || (roll !== 1 && total >= defender.ac);
        if (!hit) continue;
        if (attemptLeft > 0 && covered) {
          attemptLeft--;
          const dRoll = d20();
          const dodged = roll === 20 ? dRoll === 20 : (dRoll === 20 || dRoll + defender.defMod >= total);
          if (dodged) continue; // the attack misses
        }
        hp -= attackers[a].dmgPerHit;
        intake += attackers[a].dmgPerHit;
        if (hp <= 0) break;
      }
      if (hp <= 0) break;
    }
  }
  return rounds;
}

function cell(defender, attackers) {
  let sum = 0;
  for (let t = 0; t < TRIALS; t++) sum += fight(defender, attackers);
  return sum / TRIALS;
}

// ---- the matrix: band-typical defender at CR, maneuver quality & rung ----
function bandDefender(cr) {
  return { hp: Math.round(interp(C.effHP, cr)), ac: Math.round(interp(C.ac, cr)) };
}
function bandAttackers(cr, n) {
  const atk = Math.round(interp(C.atk, cr));
  const rtn = interp(C.rtn, cr);
  // two swings per attacker, primary + iterative, routine split between them
  const hits = [atk, atk - 5];
  // expected hits/round vs band AC ≈ p1+p2; normalize dmgPerHit so the no-defense
  // intake matches the band routine
  const ac = Math.round(interp(C.ac, cr));
  const p = b => Math.min(0.95, Math.max(0.05, (21 + b - ac) / 20));
  const eHits = p(hits[0]) + p(hits[1]);
  const dmgPerHit = rtn / Math.max(0.5, eHits);
  return Array.from({ length: n }, () => ({ hits, dmgPerHit }));
}

const RUNGS = ['none', 'move', 'swift', 'free', 'immediate'];
console.log('=== MATRIX: survival multiplier (rounds-to-drop vs rung=none) ===');
console.log('CR | attackers | defMod rel. attacker atk | ' + RUNGS.slice(1).join(' | ') + '  [immediate covers all streams]');
const CRS = [5, 11, 17];
const results = {};
for (const cr of CRS) {
  const def0 = bandDefender(cr);
  const atkBonus = Math.round(interp(C.atk, cr));
  for (const nAtk of [1, 2, 4]) {
    const attackers = bandAttackers(cr, nAtk);
    const base = cell({ ...def0, rung: 'none', defMod: 0 }, attackers);
    for (const rel of [-2, +3, +8]) {
      const defMod = atkBonus + rel;
      const row = RUNGS.slice(1).map(rung =>
        (cell({ ...def0, rung, defMod }, attackers) / base).toFixed(2));
      results[`${cr}|${nAtk}|${rel}`] = row.map(Number);
      console.log(`CR ${String(cr).padStart(2)} | ${nAtk} | atk${rel >= 0 ? '+' : ''}${rel} (mod ${defMod}) | ${row.join(' | ')}`);
    }
  }
}

// ---- CR-equivalent of the mitigation (effHP multiplier through the curve) ----
console.log('\n=== CR-EQUIVALENT of the defense channel (defMod = atk+3, the trained case) ===');
for (const cr of CRS) {
  const def0 = bandDefender(cr);
  const line = [1, 2, 4].map(nAtk => {
    const mults = results[`${cr}|${nAtk}|3`];
    // move rung also costs the defender offense; CR-equiv here prices DEFENSE only
    return RUNGS.slice(1).map((r, i) => {
      const dCR = invert(C.effHP, def0.hp * mults[i]) - cr;
      return `${r}:+${dCR.toFixed(1)}`;
    }).join(' ');
  });
  console.log(`CR ${cr}:  1 atk → ${line[0]}\n        2 atk → ${line[1]}\n        4 atk → ${line[2]}`);
}

// ---- the offense ledger (what each rung costs/returns the defender) ----
console.log('\n=== OFFENSE LEDGER (fraction of own routine kept while defending) ===');
console.log('move: single attack only (~55% of a 2-swing routine)  swift: full routine, quickened casting forgone  free: everything  immediate: everything + reactive');

// ---- JUMPING JACK CASE STUDY (printed numbers, FF p.244-245, 9th-level) ----
console.log('\n=== JUMPING JACK (9th-lvl, printed CR 11, model was -2.4 hot) ===');
const jack = { hp: 80, ac: 25, hardness: 3, dr: 10 }; // 65+15 T/AC HP; DR 10/silver vs unsilvered
const jackCR = 11;
const jAtk = bandAttackers(jackCR, 2); // pair of band foes, unsilvered
// hardness+DR soak per hit:
for (const a of jAtk) a.dmgPerHit = Math.max(1, a.dmgPerHit - jack.hardness - jack.dr);
const jBase = cell({ hp: jack.hp, ac: jack.ac, rung: 'none', defMod: 0 }, jAtk);
// Dodge +19, swift rung (Dodge+DMA feats), improved uncanny dodge = never flat-footed
const jDodge = cell({ hp: jack.hp, ac: jack.ac, rung: 'swift', defMod: 19 }, jAtk);
// defensive roll (Fast villain talent): on the killing blow, Dodge to halve — model as
// one extra life-saving halving ≈ +25% effHP (conservative rider, printed talent)
const jMult = (jDodge / jBase) * 1.25;
const silvered = bandAttackers(jackCR, 2);
for (const a of silvered) a.dmgPerHit = Math.max(1, a.dmgPerHit - jack.hardness);
const jBaseS = cell({ hp: jack.hp, ac: jack.ac, rung: 'none', defMod: 0 }, silvered);
const jDodgeS = cell({ hp: jack.hp, ac: jack.ac, rung: 'swift', defMod: 19 }, silvered);
console.log(`unsilvered foes: base ${jBase.toFixed(1)} rds → dodge ${jDodge.toFixed(1)} rds; ×${(jDodge / jBase).toFixed(2)} (+defensive roll ≈ ×${jMult.toFixed(2)})`);
console.log(`silvered foes:   base ${jBaseS.toFixed(1)} rds → dodge ${jDodgeS.toFixed(1)} rds; ×${(jDodgeS / jBaseS).toFixed(2)}`);
const jEffHP = 80; // its mitigated-HP metric seat
const jCRdelta = invert(C.effHP, jEffHP * jMult) - invert(C.effHP, jEffHP);
console.log(`CR-equivalent of the live dodge channel (unsilvered, w/ defensive roll): +${jCRdelta.toFixed(1)}  (residual was -2.4)`);

// ---- the swift-token market vignette ----
console.log('\n=== SWIFT MARKET: caster-defender, quicken vs defend (CR 11, 2 attackers) ===');
const mDef = bandDefender(11);
const mAtk = bandAttackers(11, 2);
const mBase = cell({ ...mDef, rung: 'none', defMod: interp(C.atk, 11) + 3 }, mAtk);
const mDefend = cell({ ...mDef, rung: 'swift', defMod: interp(C.atk, 11) + 3 }, mAtk);
console.log(`defend with the swift: lives ${(mDefend / mBase).toFixed(2)}× longer but forgoes a quickened spell each round;`);
console.log(`Improved feat (free rung) returns the swift to the quicken lane — the ACTION REFUND is the feat's real product.`);
