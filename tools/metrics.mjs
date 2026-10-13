// metrics.mjs — PHASE A of the CR audit (Adam, 2026-10-12): normalize every
// bestiary variant's statline into numeric measurables + ability tags.
// Output: data/metrics.json (one row per variant that yields core numbers,
// with a coverage report of what didn't parse and why).
// The downstream consumers: the Phase B descriptive audit (cr_audit.mjs),
// the Phase C regression/CR-calculator, and the Bestiary's "CR calculus"
// display (Adam's requirement: justify the CR, surface the valuable abilities).
import { readFileSync, writeFileSync } from 'node:fs';

const B = JSON.parse(readFileSync(new URL('../data/bestiary.json', import.meta.url), 'utf8'));
// Adam's CR errata (the hot-45 review): the model prices against the RULED CR.
const ERRATA = JSON.parse(readFileSync(new URL('../data/errata.json', import.meta.url), 'utf8')).cr;

const avgDice = (n, d, mod = 0) => n * (d + 1) / 2 + mod;
const DICE_RX = /(\d+)d(\d+)(?:\s*([+−-])\s*(\d+))?/g;
/** Average of every dice expression in a string, summed (damage clauses). */
function avgDamage(expr) {
  let sum = 0, m;
  DICE_RX.lastIndex = 0;
  while ((m = DICE_RX.exec(expr))) sum += avgDice(+m[1], +m[2], m[3] ? (m[3] === '+' ? +m[4] : -m[4]) : 0);
  return sum;
}
const num = (s) => { const m = String(s ?? '').match(/[+−-]?\d+/); return m ? parseInt(m[0].replace('−', '-'), 10) : null; };
/** CR strings may be fractional ("1/2") per the fmtCR rule. */
const crNum = (s) => {
  const t = String(s ?? '').trim();
  const frac = t.match(/^(\d+)\s*\/\s*(\d+)/);
  if (frac) return +frac[1] / +frac[2];
  const m = t.match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

/** "4 tentacles +12 melee (1d6+8 plus slime) and 2 claws +7 melee (2d4+4)" →
 * attacks [{n, bonus, avg}] + routine totals. The leading count defaults 1. */
function parseFullAttack(s) {
  if (!s) return null;
  // ALTERNATIVE ROUTINES first ("Greatclub …; or 2 claws …"): a foe uses ONE
  // branch per round — take the best branch, never the sum (the 2026-10-12
  // hot-44 review caught the summing bug inflating every or-statted bruiser).
  let best = null;
  for (const routine of String(s).split(/;?\s+or\s+/i)) {
    const out = [];
    // Within a branch, " and " / ", and " join simultaneous clauses:
    // read each "N name +B[/+B2/…] type (damage)" clause; iteratives count as
    // attacks at full damage (the PF1 all-attacks-hit convention).
    for (const clause of routine.split(/,?\s+and\s+/i)) {
      // v0.6.10 (the Kobold Inquest): NPC-style lines omit melee/ranged —
      // accept "name +N (dice)" when the dice parenthetical anchors it.
      const m = clause.match(/^(?:(\d+)\s+)?.*?([+−-]\d+)(?:\/[+−-]\d+)*\s+(?:melee|ranged|touch)/i)
        || clause.match(/^(?:(\d+)\s+)?[^(]*?([+−-]\d+)(?:\/[+−-]\d+)*\s*\(\d+d\d+/i);
      const dmg = clause.match(/\(([^)]*)\)/);
      if (!m) continue;
      const bonus = parseInt(m[2].replace('−', '-'), 10);
      const iteratives = (clause.match(/\/[+−-]\d+/g) ?? []).length;
      out.push({ n: (m[1] ? +m[1] : 1) + iteratives, bonus, avg: dmg ? avgDamage(dmg[1]) : 0 });
    }
    if (!out.length) continue;
    const cand = {
      attacks: out,
      bestAtk: Math.max(...out.map(a => a.bonus)),
      routineAvg: out.reduce((t, a) => t + a.n * a.avg, 0),
    };
    if (!best || cand.routineAvg > best.routineAvg) best = cand;
  }
  return best;
}

/** Comma-split an SA/SQ line into lowercase tags, parentheticals stripped. */
const tags = (s) => String(s ?? '').split(/,\s*/).map(t => t.replace(/\([^)]*\)/g, '').trim().toLowerCase()).filter(t => t && t !== '—' && t !== '-');

const rows = [], skipped = {};
const skip = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };

for (const fam of B.entries) {
  for (let vi = 0; vi < fam.variants.length; vi++) {
    const v = fam.variants[vi];
    const cr = crNum(v.cr ?? v.challenge_rating);
    if (cr == null) { skip('no CR'); continue; }
    const hpM = String(v.hit_dice ?? '').match(/\((\d+)\s*hp\)/i);
    const hdM = String(v.hit_dice ?? '').match(/(\d+)d(\d+)/);
    if (!hpM || !hdM) { skip('no hit dice/hp'); continue; }
    // v0.6.10 (the Kobold Inquest): "1d10+1 plus 6d4+6" is 7 HD, not 1 —
    // plus-joined pools sum (29 statblocks).
    const hdTotal = [...String(v.hit_dice).matchAll(/(\d+)d\d+/g)].reduce((t, mm) => t + +mm[1], 0) || +hdM[1];
    const acM = String(v.touch_full_ac_t_ac ?? v.touch_full_ac ?? '').match(/(\d+)\s*\/\s*(\d+)/);
    const flatM = String(v.touch_full_ac_t_ac ?? '').match(/flat-footed\s+(\d+)/i);
    const hardM = String(v.t_ac_system_adj ?? '').match(/Hardness\s+(\d+)/i);
    const bonusHpM = String(v.t_ac_system_adj ?? '').match(/\+(\d+)\s*HP/i);
    const bgp = String(v.ba_grapple_parry ?? '').match(/([+−-]?\d+)\s*\/\s*([+−-]?\d+)(?:\s*\/\s*([+−-]?\d+))?/);
    const savesM = String(v.saves_dodge ?? '').match(/Fort\s+([+−-]?\d+).*?Ref\s+([+−-]?\d+).*?Will\s+([+−-]?\d+)/i);
    const atk = parseFullAttack(v.full_attack) ?? parseFullAttack(v.attack);
    const attrs = {};
    for (const am of String(v.attributes ?? '').matchAll(/(Str|Dex|Con|Int|Wis|Cha)\s+(\d+|—|-)/gi)) attrs[am[1].toLowerCase()] = /\d/.test(am[2]) ? +am[2] : null;
    const speedM = String(v.initiative_speed ?? '').match(/;\s*(.*)$/);
    const speeds = {};
    if (speedM) for (const sm of speedM[1].matchAll(/(?:^|,\s*)(?:(\w+)\s+)?(\d+)\s*ft\./g)) speeds[sm[1]?.toLowerCase() ?? 'land'] = +sm[2];

    // TRUE DRAGONS (the Wyrm-pass records): the age tables carry no saves line
    // and the melee routine points at the shared Combat section — derive both
    // from canon. All three saves are good (2 + HD/2 + ability mod); the
    // natural routine is bite + 2 claws + 2 wings (+ tail slap at Large+),
    // dice by size per the shared dragon rules (3.5-mirrored), Str to bite,
    // half-Str to secondaries at −5.
    let dFort = savesM ? parseInt(savesM[1].replace('−', '-'), 10) : null;
    let dRef = savesM ? parseInt(savesM[2].replace('−', '-'), 10) : null;
    let dWill = savesM ? parseInt(savesM[3].replace('−', '-'), 10) : null;
    let dAtk = atk;
    if (v.type === 'Dragon' && !savesM && attrs.con != null) {
      const good = 2 + Math.floor(+hdM[1] / 2);
      const mod = (a) => Math.floor((a - 10) / 2);
      dFort = good + mod(attrs.con); dRef = good + mod(attrs.dex ?? 10); dWill = good + mod(attrs.wis ?? 10);
    }
    if (v.type === 'Dragon' && (!atk || atk.routineAvg === 0)) {
      const meleeM = String(v.attack ?? '').match(/([+−-]\d+)\s+melee/);
      const strMod = attrs.str != null ? Math.floor((attrs.str - 10) / 2) : 0;
      const DICE = { Tiny: [[1,4],[1,3],[1,2]], Small: [[1,6],[1,4],[1,3]], Medium: [[1,8],[1,6],[1,4]], Large: [[2,6],[1,8],[1,6],[1,8]], Huge: [[2,8],[2,6],[1,8],[2,6]], Gargantuan: [[4,6],[2,8],[2,6],[2,8]], Colossal: [[4,8],[4,6],[2,8],[4,6]] }[v.size];
      if (meleeM && DICE) {
        const b = parseInt(meleeM[1].replace('−', '-'), 10);
        const [bite, claw, wing, tail] = DICE;
        const half = Math.floor(strMod / 2);
        const list = [
          { n: 1, bonus: b, avg: avgDice(bite[0], bite[1], strMod) },
          { n: 2, bonus: b - 5, avg: avgDice(claw[0], claw[1], half) },
          { n: 2, bonus: b - 5, avg: avgDice(wing[0], wing[1], half) },
          ...(tail ? [{ n: 1, bonus: b - 5, avg: avgDice(tail[0], tail[1], half) }] : []),
        ];
        dAtk = { attacks: list, bestAtk: b, routineAvg: list.reduce((s, a) => s + a.n * a.avg, 0), derived: true };
      }
    }

    rows.push({
      fam: fam.parent, vi, label: v.label, page: fam.page,
      cr: ERRATA[`${fam.parent}#${vi}`]?.cr ?? cr,
      crWas: ERRATA[`${fam.parent}#${vi}`] ? cr : undefined,
      size: v.size ?? null, type: v.type ?? null,
      // Structured defensive riders (Adam, 2026-10-12): DR value and SR/PR
      // value pulled from the raw SQ/SA lines (the tags fragment by bypass).
      drValue: (() => { const m = String(v.special_qualities ?? '').match(/damage reduction\s+(\d+)\//i); return m ? +m[1] : null; })(),
      srValue: (() => { const m = String((v.special_qualities ?? '') + ' ' + (v.special_attacks ?? '')).match(/(?:spell resistance|power resistance|\bSR\b|\bPR\b)\s+(\d+)/i); return m ? +m[1] : null; })(),
      la: num(v.level_adjustment),
      hd: hdTotal, hdDie: +hdM[2], hp: +hpM[1],
      bonusHp: bonusHpM ? +bonusHpM[1] : 0,
      hardness: hardM ? +hardM[1] : 0,
      touchAC: acM ? +acM[1] : null, fullAC: acM ? +acM[2] : null, flatAC: flatM ? +flatM[1] : null,
      ba: bgp ? parseInt(bgp[1].replace('−', '-'), 10) : null,
      grapple: bgp && bgp[2] ? parseInt(bgp[2].replace('−', '-'), 10) : null,
      fort: dFort, ref: dRef, will: dWill,
      bestAtk: dAtk?.bestAtk ?? null, routineAvg: dAtk ? Math.round(dAtk.routineAvg * 10) / 10 : null,
      derivedRoutine: !!dAtk?.derived,
      attacks: dAtk?.attacks ?? [],
      speeds, attrs,
      sa: tags(v.special_attacks), sq: tags(v.special_qualities),
      // THE SWIFT-ACTION LEDGER (Adam, 2026-10-13): the active-defense cost
      // ladder — a printed Parry/Dodge declares as a MOVE action (rung 1);
      // Dodge/Defensive Martial Arts upgrade to swift (rung 2); the Improved
      // feats to free (rung 3). Plus the Quicken offense flags.
      defRung: (() => {
        const f = String(v.feats || '');
        if (/Improved (Dodge|Defensive Martial Arts)/i.test(f)) return 3;
        if (/\bDodge\b|Defensive Martial Arts/i.test(f)) return 2;
        const hasParry = /\/\s*[+−-]?\d+\s*$/.test(String(v.ba_grapple_parry || '')) && String(v.ba_grapple_parry || '').split('/').length >= 3;
        const hasDodgeSv = /Dodge\s*[+−-]?\d/i.test(String(v.saves_dodge || ''));
        return (hasParry || hasDodgeSv) ? 1 : 0;
      })(),
      quickenFeat: /Quicken (Spell|Power)/i.test(String(v.feats || '')) ? 1 : 0,
      // E&E MASSIVE DAMAGE pressure (Adam, 2026-10-12): MDT = the target's
      // current Con (HH), Fort DC 15. A typical adventurer Con is ~14, so
      // every attack in the routine averaging >=14 on a single connect
      // forces a Massive Damage check. mdHits = such attacks per round.
      maxHitAvg: dAtk ? Math.round(Math.max(...dAtk.attacks.map(a => a.avg)) * 10) / 10 : null,
      // "Effectively-100% MD-forcing" (Adam's calculus, 2026-10-12): an attack
      // averaging >= 18 forces the check on virtually every adventurer Con.
      mdHits: dAtk ? dAtk.attacks.filter(a => a.avg >= 18).reduce((t, a) => t + a.n, 0) : null,
      // THE CL COMPONENT (Adam's gavel, 2026-10-13): caster level from the
      // classed label ("10th-Level Wizard") or, for casting-tagged variants,
      // the family body ("Caster Level Nth"); highest spell level from the
      // printed spell-list markers ("6th—Blade Barrier"). Access gates the
      // price: spellCR = min(CL, 2 × S) in the model.
      cl: (() => {
        const lm = String(v.label || '').match(/(\d+)(?:st|nd|rd|th)-Level/i);
        if (lm) return +lm[1];
        const castish = /spells|spell-like|psionics|manifest/i.test(String(v.special_attacks || '') + ' ' + String(v.special_qualities || ''));
        if (!castish) return null;
        const bm = String(fam.body || '').match(/Caster Level[:\s]+(\d+)|Manifester level[:\s]+(\d+)|CL\s+(\d+)(?:st|nd|rd|th)|as an? (\d+)(?:st|nd|rd|th)-level (?:caster|manifester|cleric|wizard|sorcerer|druid|psion|wilder)/i);
        return bm ? +(bm[1] || bm[2] || bm[3] || bm[4]) : null;
      })(),
      sMax: (() => {
        let mx = null;
        for (const m of String(fam.body || '').matchAll(/\b(\d)(?:st|nd|rd|th)\s*[—–-]/g)) mx = Math.max(mx ?? 0, +m[1]);
        return mx;
      })(),
      // PF1's benchmark lesson (2026-10-12): the primary ability DC is a
      // first-class offense number — harvest the highest DC printed anywhere
      // in the special-attack/quality lines.
      dcMax: Math.max(0, ...[...String(v.special_attacks ?? '').matchAll(/DC\s+(\d+)/gi), ...String(v.special_qualities ?? '').matchAll(/DC\s+(\d+)/gi)].map(m => +m[1])) || null,
      template: !!fam.template,
    });
  }
}

const meta = {
  generated: new Date().toISOString().slice(0, 10),
  source: B._meta,
  rows: rows.length, skipped,
  coverage: {
    ac: rows.filter(r => r.fullAC != null).length,
    saves: rows.filter(r => r.fort != null).length,
    offense: rows.filter(r => r.routineAvg != null).length,
  },
};
writeFileSync(new URL('../data/metrics.json', import.meta.url), JSON.stringify({ _meta: meta, rows }, null, 1));
console.log(JSON.stringify(meta, null, 2));
