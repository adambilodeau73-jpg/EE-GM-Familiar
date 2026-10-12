# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.92; with 98 priced ability tags (ridge λ=3) **R² 0.956, mean absolute error 1 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.6 | 26 |
| immunities | +2.1 | 19 |
| incorporeal traits | +1.8 | 8 |
| undead traits | +1.7 | 38 |
| ooze traits | +1.5 | 12 |
| breath weapon | +1.4 | 31 |
| trip | +0.8 | 10 |
| tongues | +0.7 | 12 |
| damage reduction 10/magic | +0.7 | 16 |
| sr 24 | +0.7 | 11 |
| sr 27 | +0.6 | 9 |
| psi-like abilities | +0.6 | 15 |
| poison | +0.6 | 55 |
| sr 30 | +0.6 | 8 |
| telepathy 100 ft. | +0.6 | 26 |
| engulf | +0.5 | 11 |
| sr 28 | +0.5 | 10 |
| blindsight 60 ft. | +0.4 | 10 |
| vulnerability to fire | +0.4 | 13 |
| fear aura | +0.4 | 14 |
| alternate form | +0.4 | 75 |
| web | +0.3 | 9 |
| summon demon | +0.3 | 10 |
| wild empathy | +0.3 | 8 |
| sr 23 | +0.3 | 8 |
| … | | |
| fast healing 2 | -0.9 | 14 |
| earth glide | -0.9 | 9 |
| single actions only | -0.9 | 8 |
| damage reduction 5/slashing | -0.9 | 8 |
| lowlight vision | -1 | 11 |
| hive mind | -1 | 10 |
| invincibility | -1 | 8 |
| rock catching | -1.1 | 8 |
| damage reduction 10/– | -1.2 | 8 |
| damage reduction 5/– | -1.2 | 11 |
| psychometabolism discipline | -1.3 | 12 |
| icewalking | -1.4 | 12 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 3.4 | 1.7 | 5.1 | +6.9 |
| LEECHWALKER (p.329) | 10 | 4.4 | -0.3 | 4.1 | +5.9 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.9 | 0.6 | 2.5 | +5.5 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 7.7 | 0.1 | 7.9 | +5.1 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0 | 2 | +5 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 9.6 | 2.1 | 11.7 | +4.3 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | 4.4 | 2.3 | 6.8 | +4.2 |
| ATHACH (p.118) | 8 | 11.6 | 0.5 | 12.1 | -4.1 |
| THOUGHT SLAYER (p.463) | 13 | 8.3 | 0.5 | 8.9 | +4.1 |
| ELOHIM (p.232) | 8 | 2.5 | 1.4 | 3.9 | +4.1 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.4 | 2.5 | 12.9 | +4.1 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 11 | 15.3 | -0.3 | 15.1 | -4.1 |
| BODAK (p.125) | 10 | 4.6 | 1.5 | 6.1 | +3.9 |
| PLATONIC (p.404) | 17 | 12.1 | 1 | 13.1 | +3.9 |
| MEDUSA (p.357) | 7 | 2.7 | 0.5 | 3.2 | +3.8 |
| OGRE MAGE (p.388) | 8 | 4.3 | -0.1 | 4.2 | +3.8 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.9 | 1.4 | 7.3 | +3.7 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 9.8 | 0.6 | 10.4 | +3.6 |
| GEAR GOLEM (p.285) | 7 | 10.9 | -0.4 | 10.5 | -3.5 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.9 | 3.7 | 6.6 | +3.4 |
| CHAOS BEAST (p.140) | 7 | 3.7 | -0.1 | 3.6 | +3.4 |
| ETOILE (p.235) | 2 | 5 | 0.3 | 5.3 | -3.3 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 14.6 | -1.4 | 13.3 | -3.3 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 8 | -0.1 | 7.9 | +3.1 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
