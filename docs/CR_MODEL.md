# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-13)

Two-stage legible model over 706 foes. **Fit:** body CR alone R² 0.934; with 98 priced ability tags (ridge λ=3) **R² 0.965, mean absolute error 0.9 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.1 | 26 |
| immunities | +1.9 | 19 |
| incorporeal traits | +1.9 | 8 |
| ooze traits | +1.8 | 12 |
| undead traits | +1.2 | 38 |
| breath weapon | +1.1 | 31 |
| engulf | +0.7 | 11 |
| vulnerability to fire | +0.7 | 13 |
| DR (per 10 points) | +0.7 | 168 |
| tongues | +0.7 | 12 |
| trip | +0.7 | 10 |
| poison | +0.6 | 55 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| acid | +0.5 | 9 |
| psi-like abilities | +0.4 | 15 |
| construct traits | +0.4 | 31 |
| sr 30 | +0.4 | 8 |
| frightful presence | +0.4 | 114 |
| resistance to acid 10 | +0.4 | 11 |
| cold 10 | +0.4 | 11 |
| damage reduction 10/magic | +0.4 | 16 |
| alternate form | +0.4 | 75 |
| +2 turn resistance | +0.3 | 8 |
| … | | |
| lowlight vision | -0.7 | 11 |
| sr 21 | -0.7 | 13 |
| fast healing 2 | -0.7 | 14 |
| hive mind | -0.8 | 10 |
| damage reduction 5/slashing | -0.9 | 8 |
| single actions only | -0.9 | 8 |
| damage reduction 5/bludgeoning | -1 | 14 |
| icewalking | -1.2 | 12 |
| psychometabolism discipline | -1.3 | 12 |
| invincibility | -1.4 | 8 |
| damage reduction 5/– | -1.4 | 11 |
| damage reduction 10/– | -1.6 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4.9 | 1.2 | 6.1 | +5.9 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.6 | 2.4 | +5.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.9 | 0.7 | 7.6 | +5.4 |
| TARRASQUE (p.458) | 21 | 24.9 | 1.3 | 26.2 | -5.2 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.3 | 2.3 | +4.7 |
| LEECHWALKER (p.329) | 10 | 5.5 | -0.1 | 5.4 | +4.6 |
| THOUGHT SLAYER (p.463) | 13 | 8.5 | 0.3 | 8.7 | +4.3 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.6 | 3.5 | 24.1 | -4.1 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.9 | 2 | 12.9 | +4.1 |
| KOBOLD — Drakkin Leader, 6th-level Sorcerer (p.323) | 5 | 5.9 | 3.1 | 8.9 | -3.9 |
| MEDUSA (p.357) | 7 | 2.6 | 0.5 | 3.1 | +3.9 |
| BODAK (p.125) | 10 | 4 | 2.1 | 6.1 | +3.9 |
| ELOHIM (p.232) | 8 | 2.8 | 1.6 | 4.3 | +3.7 |
| MARUT (p.318) | 15 | 10.3 | 1.1 | 11.4 | +3.6 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 3.9 | 6.6 | +3.4 |
| TOXIC SLUDGE — Toxic Sludge, Advanced (p.467) | 14 | 11.1 | 6.2 | 17.3 | -3.3 |
| CHAOS BEAST (p.140) | 7 | 4 | -0.1 | 3.9 | +3.1 |
| STONE GIANT (p.272) | 9 | 11.6 | 0.5 | 12.1 | -3.1 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.4 | 1.5 | 12.9 | +3.1 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.6 | 0.4 | 11 | +3 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 6.5 | 1.5 | 8 | +3 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 14 | 16.2 | 0.8 | 17 | -3 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 8.2 | -0.1 | 8.1 | +2.9 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 11 | 12.2 | 1.6 | 13.8 | -2.8 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
