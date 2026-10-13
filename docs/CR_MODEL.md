# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-13)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.931; with 98 priced ability tags (ridge λ=3) **R² 0.963, mean absolute error 0.9 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.2 | 26 |
| immunities | +2 | 19 |
| ooze traits | +1.8 | 12 |
| incorporeal traits | +1.7 | 8 |
| undead traits | +1.5 | 38 |
| breath weapon | +1.3 | 31 |
| DR (per 10 points) | +0.7 | 168 |
| poison | +0.7 | 55 |
| trip | +0.7 | 10 |
| engulf | +0.6 | 11 |
| vulnerability to fire | +0.5 | 13 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| psi-like abilities | +0.5 | 15 |
| acid | +0.4 | 9 |
| sr 30 | +0.4 | 8 |
| construct traits | +0.4 | 31 |
| alternate form | +0.4 | 75 |
| frightful presence | +0.4 | 114 |
| damage reduction 10/magic | +0.3 | 16 |
| … | | |
| fast healing 2 | -0.8 | 14 |
| rock catching | -0.8 | 8 |
| hive mind | -0.8 | 10 |
| lowlight vision | -1 | 11 |
| single actions only | -1 | 8 |
| damage reduction 5/slashing | -1 | 8 |
| damage reduction 5/bludgeoning | -1.2 | 14 |
| icewalking | -1.2 | 12 |
| psychometabolism discipline | -1.3 | 12 |
| invincibility | -1.3 | 8 |
| damage reduction 5/– | -1.4 | 11 |
| damage reduction 10/– | -1.6 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4.1 | 1.5 | 5.7 | +6.3 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.6 | 2.4 | +5.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.9 | 0.6 | 7.6 | +5.4 |
| TARRASQUE (p.458) | 21 | 24.9 | 1.3 | 26.2 | -5.2 |
| MARUT (p.318) | 15 | 9 | 1.3 | 10.3 | +4.7 |
| LEECHWALKER (p.329) | 10 | 5.5 | -0.2 | 5.3 | +4.7 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.3 | 2.4 | +4.6 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.6 | 3.5 | 24.2 | -4.2 |
| THOUGHT SLAYER (p.463) | 13 | 8.5 | 0.4 | 8.9 | +4.1 |
| ELOHIM (p.232) | 8 | 2.8 | 1.3 | 4.1 | +3.9 |
| MEDUSA (p.357) | 7 | 2.6 | 0.6 | 3.3 | +3.7 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 11.2 | 2.1 | 13.4 | +3.6 |
| BODAK (p.125) | 10 | 4 | 2.3 | 6.4 | +3.6 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 11 | 13.1 | 1.3 | 14.4 | -3.4 |
| OGRE MAGE (p.388) | 8 | 4.4 | 0.1 | 4.6 | +3.4 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.7 | 7.7 | +3.3 |
| TOXIC SLUDGE — Toxic Sludge, Advanced (p.467) | 14 | 11.1 | 6.1 | 17.3 | -3.3 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 4 | 6.7 | +3.3 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.9 | -0.1 | 7.8 | +3.2 |
| ANGEL — ANGEL, PLANETAR (p.53) | 17 | 15.9 | 4.2 | 20.1 | -3.1 |
| CHAOS BEAST (p.140) | 7 | 4 | -0.1 | 3.9 | +3.1 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 14 | 16.2 | 0.8 | 17 | -3 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.4 | 1.5 | 13 | +3 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.6 | 0.4 | 11 | +3 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
