# The Active-Defense Sim: Audition Report
**2026-10-13 · tools/defsim.mjs · 4,000 trials/cell · TODO §128 Phase 3, first hat of the personal-combat engine**

## The rules as simulated (HH pp.373–378, 360)
- **Dodge** = 1d20 + Ref + DB + dodge bonuses vs the attack roll (any attack-roll attack); **Parry** = 1d20 + BAB + Str + DB + shield (melee only). ≥ means the attack misses; nat-20 answers only nat-20.
- Ready rungs: **move** (universal statblock baseline) → **swift** (Dodge / DMA) → **free** (Improved) → **immediate free, no ready** (Advanced, innate). A readied maneuver names ONE opponent; the Advanced tier answers anyone. Flat-footed denies immediates (improved uncanny dodge restores them).
- Sim assumptions flagged for the gavel: **A1** one resolved attempt per maneuver per round at every rung (the printed "one FREE Dodge or Parry each round" class features read as the ceiling norm); **A2** it fires on the first would-be hit from a covered attacker; **A3** round budget standard+move+swift, full attack = standard+move.

## Finding 1 — the mitigation lives in the MODIFIER and the ATTACKER COUNT, not the rung
Survival multipliers (defender at band effHP/AC, attackers at band attack/routine):

| vs | mod = atk−2 | mod = atk+3 | mod = atk+8 |
|---|---|---|---|
| 1 attacker | ×1.27–1.31 | ×1.58–1.63 | ×1.86–2.16 |
| 2 attackers | ×1.12 | ×1.21–1.23 | ×1.29–1.34 |
| 4 attackers | ×1.05 | ×1.09–1.12 | ×1.13–1.15 |

The four rungs produce **identical mitigation** under A1 — one negated hit per round is one negated hit per round. The rung changes what the round *costs*, not what it *saves*.

## Finding 2 — the rung price is the ACTION REFUND, and it audits the ridge
A move-rung defender drops to a single attack (~55% of a two-swing routine) every round it defends: its mitigation is paid for out of its own offense, **net ≈ 0**. That is exactly why ~500 statblocks with printed Parry/Dodge lines fitted at zero in the ridge. The swift rung restores the full routine (price: the quicken lane); the free rung restores the swift. **The fitted +0.5/rung is hereby AUDITED and CONFIRMED as the action-refund price** — with one amendment the ridge couldn't see: it should be **gated on quality**. A dodge modifier far below the band's attack bonus almost never wins the opposed roll; the rung refund on a defense that doesn't function is decorative.

## Finding 3 — party-facing CR-equivalent (the calculus seat)
At trained quality (mod = band atk+3), converting the survival multiplier through the effHP benchmark curve:
- vs **4 attackers** (the Forge's pricing context): **+0.2 to +0.5 CR**
- vs **2 attackers**: +0.7 to +1.4
- vs **1 attacker** (the duel): **+2 to +3.7**

Active defense is a **duelist's weapon**. Against a full party its CR weight is modest; in single combat it is worth whole bands. This is the same action-economy asymmetry as the solo-boss warning, seen from the foe's side.

## Finding 4 — the Jumping Jack, calibrated (printed CR 11, a trusts-its-tricks case: model ≈ 8.5)
*(Direction corrected post-audition: the Jack's print sits ABOVE the model — the CR assumes its tactics — not below it. The channel math is unchanged.)* At its printed numbers (Dodge +19 ≈ band atk+0, swift rung, hp 80, hardness 3, DR 10/silver, defensive roll, improved uncanny dodge), vs a pair of band-11 foes: dodge channel ×1.14, with the defensive-roll rider ≈ ×1.43 → **+0.6 CR-equivalent**. The newly priced channel explains part of the trust gap; the rest is an **encounter property** — the printed COMBAT doctrine (leaping ambush, hit-and-run, the merry chase on ruinous ground) is dragon-style tactics pricing, and vs 1–2 pursuers (its preferred fight) the dodge channel alone is worth +1 to +2. Ruled (Adam, 2026-10-13): GM note, not errata: *"reads over-priced in a stand-up fight; it earns its printed 11 as written — ambush, attrition, and a dodge that answers the lone pursuer."*

## Finding 5 — the swift market, quantified
A caster-defender spending the swift on defense lives ×1.20 longer but forgoes a quickened spell every round. The Improved feats' real product is the **action refund** — returning the swift to the quicken lane — which is why manifester builds take them. (Super-Power quickening makes high-MS casters the heaviest buyers in this market; MS-beside-CL refinement already queued.)

## PROPOSED RULED TERM (awaiting Adam's gavel — NOT yet wired)
**Active-defense term, party-facing:** a foe with a live defense channel prices
`+0.5 × (rungs above move)`, capped at +1.5, **gated**: counts only while the printed Parry or Dodge modifier ≥ its band's attack-bonus benchmark − 2.
- Harvest: defRung (shipped) + parse the printed `Parry +N` / `Dodge +N` statblock lines (new metric columns).
- Attributable: E&E-native (SRD has no opposed-roll defense) — the lens backs it out entirely.
- Forge rider: a tray foe with a live channel gets a **duelist chip** — "fights 1–2 bands above its number in single combat" (feeds spec §1.4b and the outnumbered-actions design session).

**Gavel questions:**
1. A1 — does the Advanced/innate tier resolve one attempt per ROUND (sim's conservative read) or one per ATTACKER? Per-attacker would multiply the immediate tier's worth vs parties (+0.3 → +1-ish) and deserves its own rung price.
2. The quality gate's reference: the foe's own band benchmark (proposed) or the party CR at the table (a Forge-dynamic variant)?
3. The Jumping Jack: GM note (recommended) or re-rate?
