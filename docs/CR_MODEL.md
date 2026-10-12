# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.916; with 98 priced ability tags (ridge λ=3) **R² 0.954, mean absolute error 1 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.6 | 26 |
| immunities | +2.1 | 19 |
| incorporeal traits | +1.8 | 8 |
| undead traits | +1.8 | 38 |
| ooze traits | +1.6 | 12 |
| breath weapon | +1.5 | 31 |
| trip | +0.8 | 10 |
| sr 30 | +0.8 | 8 |
| sr 24 | +0.7 | 11 |
| damage reduction 10/magic | +0.7 | 16 |
| tongues | +0.7 | 12 |
| sr 27 | +0.7 | 9 |
| psi-like abilities | +0.7 | 15 |
| poison | +0.6 | 55 |
| sr 28 | +0.6 | 10 |
| engulf | +0.6 | 11 |
| telepathy 100 ft. | +0.6 | 26 |
| frightful presence | +0.5 | 114 |
| vulnerability to fire | +0.4 | 13 |
| blindsight 60 ft. | +0.4 | 10 |
| fear aura | +0.4 | 14 |
| wild empathy | +0.4 | 8 |
| sr 25 | +0.3 | 13 |
| summon demon | +0.3 | 10 |
| psychokinesis discipline | +0.3 | 12 |
| web | +0.3 | 9 |
| elemental traits | +0.3 | 39 |
| sr 23 | +0.3 | 8 |
| alternate form | +0.3 | 75 |
| … | | |
| earth glide | -0.9 | 9 |
| single actions only | -1 | 8 |
| damage reduction 5/slashing | -1 | 8 |
| lowlight vision | -1 | 11 |
| invincibility | -1.1 | 8 |
| hive mind | -1.1 | 10 |
| rock catching | -1.1 | 8 |
| sr 19 | -1.1 | 9 |
| damage reduction 10/– | -1.2 | 8 |
| damage reduction 5/– | -1.2 | 11 |
| psychometabolism discipline | -1.3 | 12 |
| icewalking | -1.4 | 12 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 3.4 | 1.8 | 5.2 | +6.8 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.5 | 0.6 | 2 | +6 |
| LEECHWALKER (p.329) | 10 | 4.4 | -0.3 | 4.1 | +5.9 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 7.7 | 0.1 | 7.8 | +5.2 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0 | 2 | +5 |
| ELOHIM (p.232) | 8 | 1.8 | 1.4 | 3.2 | +4.8 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 9.3 | 2.4 | 11.6 | +4.4 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.4 | 2.5 | 12.9 | +4.1 |
| ATHACH (p.118) | 8 | 11.6 | 0.5 | 12.1 | -4.1 |
| THOUGHT SLAYER (p.463) | 13 | 8.3 | 0.6 | 8.9 | +4.1 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 11 | 15.3 | -0.4 | 14.9 | -3.9 |
| PLATONIC (p.404) | 17 | 12.1 | 1 | 13.1 | +3.9 |
| MEDUSA (p.357) | 7 | 2.7 | 0.5 | 3.1 | +3.9 |
| OGRE MAGE (p.388) | 8 | 4.3 | -0.1 | 4.2 | +3.8 |
| BODAK (p.125) | 10 | 4.6 | 1.6 | 6.2 | +3.8 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.6 | 1.6 | 7.2 | +3.8 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 9.8 | 0.5 | 10.3 | +3.7 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | 5 | 2.3 | 7.3 | +3.7 |
| GEAR GOLEM (p.285) | 7 | 10.9 | -0.4 | 10.4 | -3.4 |
| CHAOS BEAST (p.140) | 7 | 3.7 | -0.1 | 3.6 | +3.4 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.9 | 3.8 | 6.6 | +3.4 |
| ETOILE (p.235) | 2 | 5 | 0.3 | 5.2 | -3.2 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 14.6 | -1.4 | 13.2 | -3.2 |
| BLACK DRAGON — Adult (p.190) | 11 | 14 | 0.2 | 14.2 | -3.2 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
