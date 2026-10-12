# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.93; with 98 priced ability tags (ridge λ=3) **R² 0.961, mean absolute error 0.9 CR**; intercept 0.1. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.2 | 26 |
| immunities | +2 | 19 |
| ooze traits | +1.8 | 12 |
| incorporeal traits | +1.7 | 8 |
| undead traits | +1.5 | 38 |
| breath weapon | +1.3 | 31 |
| frightful presence | +0.7 | 114 |
| sr 30 | +0.7 | 8 |
| sr 27 | +0.7 | 9 |
| poison | +0.7 | 55 |
| trip | +0.6 | 10 |
| sr 28 | +0.6 | 10 |
| sr 24 | +0.6 | 11 |
| psi-like abilities | +0.5 | 15 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| vulnerability to fire | +0.5 | 13 |
| DR (per 10 points) | +0.5 | 168 |
| damage reduction 10/magic | +0.5 | 16 |
| engulf | +0.4 | 11 |
| construct traits | +0.4 | 31 |
| sr 25 | +0.4 | 13 |
| alternate form | +0.3 | 75 |
| … | | |
| ink cloud | -0.8 | 8 |
| hive mind | -0.9 | 10 |
| rock catching | -0.9 | 8 |
| invincibility | -1 | 8 |
| single actions only | -1 | 8 |
| damage reduction 5/slashing | -1 | 8 |
| damage reduction 5/bludgeoning | -1 | 14 |
| icewalking | -1.1 | 12 |
| lowlight vision | -1.1 | 11 |
| psychometabolism discipline | -1.2 | 12 |
| damage reduction 5/– | -1.3 | 11 |
| damage reduction 10/– | -1.9 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4 | 1.5 | 5.6 | +6.4 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.8 | 0.6 | 2.5 | +5.5 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 6.8 | 0.9 | 7.8 | +5.2 |
| TARRASQUE (p.458) | 20 | 23.2 | 1.6 | 24.9 | -4.9 |
| MARUT (p.318) | 15 | 9.1 | 1 | 10.2 | +4.8 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.2 | 2.3 | +4.7 |
| LEECHWALKER (p.329) | 10 | 5.5 | -0.2 | 5.4 | +4.6 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.4 | 8.9 | +4.1 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 13.1 | 0.9 | 14.1 | -4.1 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.8 | 2.1 | 13 | +4 |
| ELOHIM (p.232) | 8 | 2.8 | 1.2 | 4 | +4 |
| BODAK (p.125) | 10 | 4 | 2.1 | 6.2 | +3.8 |
| MEDUSA (p.357) | 7 | 2.6 | 0.6 | 3.3 | +3.7 |
| CHEMICAL TOXYDERM — Chemical Toxyderm (p.469) | 15 | 14.7 | 3.9 | 18.6 | -3.6 |
| OGRE MAGE (p.388) | 8 | 4.4 | 0 | 4.5 | +3.5 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.6 | 7.6 | +3.4 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.6 | -0.1 | 7.6 | +3.4 |
| ROC (p.416) | 9 | 11.2 | 1 | 12.3 | -3.3 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.7 | 4 | 6.8 | +3.2 |
| HORNED DEVIL (CORNUGON) (p.174) | 16 | 16.9 | 2.2 | 19.2 | -3.2 |
| ASTRAL CONSTRUCT — 8TH-LEVEL ASTRAL CONSTRUCT (p.111) | 9 | 11.2 | 0.9 | 12.2 | -3.2 |
| SALAMANDER — Noble Salamander (p.419) | 10 | 11 | 2.1 | 13.1 | -3.1 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.5 | 1.3 | 12.9 | +3.1 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.6 | 0.2 | 10.9 | +3.1 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
