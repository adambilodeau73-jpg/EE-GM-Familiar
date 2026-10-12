# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.931; with 98 priced ability tags (ridge λ=3) **R² 0.966, mean absolute error 0.9 CR**; intercept 0.1. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.2 | 26 |
| immunities | +1.9 | 19 |
| ooze traits | +1.7 | 12 |
| incorporeal traits | +1.7 | 8 |
| undead traits | +1.5 | 38 |
| breath weapon | +1.2 | 31 |
| sr 30 | +0.7 | 8 |
| frightful presence | +0.7 | 114 |
| sr 27 | +0.7 | 9 |
| poison | +0.6 | 55 |
| trip | +0.6 | 10 |
| sr 28 | +0.6 | 10 |
| sr 24 | +0.6 | 11 |
| DR (per 10 points) | +0.5 | 168 |
| psi-like abilities | +0.5 | 15 |
| vulnerability to fire | +0.5 | 13 |
| damage reduction 10/magic | +0.4 | 16 |
| construct traits | +0.4 | 31 |
| blindsight 60 ft. | +0.4 | 10 |
| sr 25 | +0.4 | 13 |
| alternate form | +0.3 | 75 |
| engulf | +0.3 | 11 |
| … | | |
| ink cloud | -0.8 | 8 |
| hive mind | -0.9 | 10 |
| rock catching | -0.9 | 8 |
| damage reduction 5/slashing | -1 | 8 |
| single actions only | -1 | 8 |
| damage reduction 5/bludgeoning | -1 | 14 |
| invincibility | -1 | 8 |
| lowlight vision | -1.1 | 11 |
| icewalking | -1.1 | 12 |
| psychometabolism discipline | -1.2 | 12 |
| damage reduction 5/– | -1.3 | 11 |
| damage reduction 10/– | -1.8 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4 | 1.5 | 5.6 | +6.4 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.5 | 2.4 | +5.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.8 | 0.9 | 7.8 | +5.2 |
| MARUT (p.318) | 15 | 9.1 | 1 | 10.2 | +4.8 |
| LEECHWALKER (p.329) | 10 | 5.5 | -0.3 | 5.3 | +4.7 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.3 | 2.4 | +4.6 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.4 | 8.9 | +4.1 |
| ELOHIM (p.232) | 8 | 2.8 | 1.1 | 4 | +4 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.8 | 2.1 | 13 | +4 |
| TARRASQUE (p.458) | 20 | 23.3 | 0.4 | 23.8 | -3.8 |
| MEDUSA (p.357) | 7 | 2.6 | 0.5 | 3.2 | +3.8 |
| BODAK (p.125) | 10 | 4 | 2.2 | 6.3 | +3.7 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.4 | 7.4 | +3.6 |
| OGRE MAGE (p.388) | 8 | 4.4 | 0 | 4.5 | +3.5 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.5 | -0.1 | 7.5 | +3.5 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 3.8 | 6.6 | +3.4 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.5 | 1.3 | 12.9 | +3.1 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.6 | 0.2 | 10.9 | +3.1 |
| CHAOS BEAST (p.140) | 7 | 4 | -0.1 | 4 | +3 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | 5.2 | 2.8 | 8.1 | +2.9 |
| MONSTROUS SCORPION — Monstrous Scorpion, Colossal (p.492) | 12 | 15 | -0.2 | 14.8 | -2.8 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 12.7 | -0.1 | 12.7 | -2.7 |
| SPIDER EATER (p.444) | 5 | 3.3 | -1.1 | 2.3 | +2.7 |
| PLATONIC (p.404) | 17 | 12.8 | 1.5 | 14.4 | +2.6 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
