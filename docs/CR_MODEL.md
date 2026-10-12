# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.93; with 98 priced ability tags (ridge λ=3) **R² 0.964, mean absolute error 0.9 CR**; intercept 0.1. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.3 | 26 |
| immunities | +2 | 19 |
| ooze traits | +1.8 | 12 |
| incorporeal traits | +1.7 | 8 |
| undead traits | +1.5 | 38 |
| breath weapon | +1.4 | 31 |
| frightful presence | +0.7 | 114 |
| engulf | +0.7 | 11 |
| DR (per 10 points) | +0.7 | 168 |
| poison | +0.6 | 55 |
| trip | +0.6 | 10 |
| sr 30 | +0.6 | 8 |
| sr 27 | +0.6 | 9 |
| vulnerability to fire | +0.6 | 13 |
| sr 24 | +0.5 | 11 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| acid | +0.5 | 9 |
| psi-like abilities | +0.5 | 15 |
| sr 28 | +0.4 | 10 |
| alternate form | +0.4 | 75 |
| construct traits | +0.4 | 31 |
| spell-like abilities | +0.3 | 78 |
| … | | |
| sr 19 | -0.8 | 9 |
| fast healing 2 | -0.8 | 14 |
| hive mind | -0.9 | 10 |
| invincibility | -1 | 8 |
| single actions only | -1 | 8 |
| damage reduction 5/slashing | -1 | 8 |
| damage reduction 5/bludgeoning | -1.1 | 14 |
| lowlight vision | -1.1 | 11 |
| icewalking | -1.2 | 12 |
| psychometabolism discipline | -1.3 | 12 |
| damage reduction 5/– | -1.4 | 11 |
| damage reduction 10/– | -1.6 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4.1 | 1.5 | 5.7 | +6.3 |
| TARRASQUE (p.458) | 20 | 24.1 | 1.5 | 25.7 | -5.7 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.6 | 2.5 | +5.5 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.9 | 0.8 | 7.7 | +5.3 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.3 | 2.4 | +4.6 |
| MARUT (p.318) | 15 | 9 | 1.4 | 10.4 | +4.6 |
| LEECHWALKER (p.329) | 10 | 5.5 | -0.1 | 5.5 | +4.5 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 13.1 | 1.2 | 14.4 | -4.4 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.4 | 8.8 | +4.2 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.1 | 3.7 | 23.9 | -3.9 |
| MEDUSA (p.357) | 7 | 2.6 | 0.5 | 3.2 | +3.8 |
| ELOHIM (p.232) | 8 | 2.8 | 1.4 | 4.2 | +3.8 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 11 | 2.2 | 13.3 | +3.7 |
| ASTRAL CONSTRUCT — 8TH-LEVEL ASTRAL CONSTRUCT (p.111) | 9 | 11.4 | 1.2 | 12.6 | -3.6 |
| ROC (p.416) | 9 | 11.4 | 1.1 | 12.5 | -3.5 |
| BODAK (p.125) | 10 | 4 | 2.4 | 6.5 | +3.5 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 4 | 6.7 | +3.3 |
| ANGEL — ANGEL, PLANETAR (p.53) | 16 | 14.8 | 4.4 | 19.2 | -3.2 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.8 | 7.8 | +3.2 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.9 | -0.1 | 7.8 | +3.2 |
| OGRE MAGE (p.388) | 8 | 4.4 | 0.4 | 4.9 | +3.1 |
| CHAOS BEAST (p.140) | 7 | 4 | -0.1 | 3.9 | +3.1 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.6 | 0.4 | 11 | +3 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.4 | 1.6 | 13.1 | +2.9 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
