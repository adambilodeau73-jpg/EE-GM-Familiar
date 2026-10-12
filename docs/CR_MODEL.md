# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.927; with 98 priced ability tags (ridge λ=3) **R² 0.962, mean absolute error 0.9 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.3 | 26 |
| immunities | +2 | 19 |
| ooze traits | +1.8 | 12 |
| incorporeal traits | +1.8 | 8 |
| undead traits | +1.5 | 38 |
| breath weapon | +1.2 | 31 |
| sr 30 | +0.7 | 8 |
| frightful presence | +0.7 | 114 |
| sr 27 | +0.7 | 9 |
| sr 24 | +0.7 | 11 |
| trip | +0.6 | 10 |
| sr 28 | +0.6 | 10 |
| poison | +0.5 | 55 |
| construct traits | +0.5 | 31 |
| psi-like abilities | +0.5 | 15 |
| DR (per 10 points) | +0.4 | 168 |
| vulnerability to fire | +0.4 | 13 |
| sr 25 | +0.4 | 13 |
| blindsight 60 ft. | +0.3 | 10 |
| damage reduction 10/magic | +0.3 | 16 |
| alternate form | +0.3 | 75 |
| sr 23 | +0.3 | 8 |
| … | | |
| hive mind | -0.8 | 10 |
| ink cloud | -0.8 | 8 |
| rock catching | -0.9 | 8 |
| damage reduction 5/bludgeoning | -0.9 | 14 |
| damage reduction 5/slashing | -0.9 | 8 |
| single actions only | -0.9 | 8 |
| lowlight vision | -0.9 | 11 |
| invincibility | -1 | 8 |
| icewalking | -1 | 12 |
| psychometabolism discipline | -1.2 | 12 |
| damage reduction 5/– | -1.2 | 11 |
| damage reduction 10/– | -1.6 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 3.9 | 1.5 | 5.4 | +6.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.8 | 0 | 6.8 | +6.2 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.4 | 2.2 | +5.8 |
| MARUT (p.318) | 15 | 8.9 | 1 | 9.9 | +5.1 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.2 | 2.3 | +4.7 |
| LEECHWALKER (p.329) | 10 | 5.4 | -0.1 | 5.4 | +4.6 |
| THOUGHT SLAYER (p.463) | 13 | 8.3 | 0.4 | 8.7 | +4.3 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.7 | 2.2 | 13 | +4 |
| ELOHIM (p.232) | 8 | 2.7 | 1.2 | 4 | +4 |
| MEDUSA (p.357) | 7 | 2.6 | 0.4 | 3.1 | +3.9 |
| BODAK (p.125) | 10 | 4.1 | 2.1 | 6.2 | +3.8 |
| TARRASQUE (p.458) | 20 | 23.3 | 0.4 | 23.8 | -3.8 |
| MONSTROUS SCORPION — Monstrous Scorpion, Colossal (p.492) | 12 | 15.7 | 0 | 15.7 | -3.7 |
| OGRE MAGE (p.388) | 8 | 4.5 | -0.1 | 4.4 | +3.6 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.5 | 7.4 | +3.6 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.6 | -0.1 | 7.5 | +3.5 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.3 | 1.3 | 12.7 | +3.3 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.4 | 0.3 | 10.8 | +3.2 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 4.1 | 6.8 | +3.2 |
| VIVILOR — 9th-lvl Vivilor (p.497) | 11 | 14.3 | -0.1 | 14.2 | -3.2 |
| CHAOS BEAST (p.140) | 7 | 3.9 | -0.1 | 3.8 | +3.2 |
| PLATONIC (p.404) | 17 | 12.4 | 1.4 | 13.9 | +3.1 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | 5 | 2.9 | 7.9 | +3.1 |
| VIVILOR — 8th-lvl Vivilor (p.497) | 10 | 13.1 | -0.1 | 13 | -3 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
