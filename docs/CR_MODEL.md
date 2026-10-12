# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-12)

Two-stage legible model over 704 foes. **Fit:** body CR alone R² 0.919; with 98 priced ability tags (ridge λ=3) **R² 0.956, mean absolute error 1 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| spells | +2.7 | 26 |
| immunities | +2.2 | 19 |
| incorporeal traits | +1.9 | 8 |
| undead traits | +1.7 | 38 |
| ooze traits | +1.5 | 12 |
| breath weapon | +1.2 | 31 |
| trip | +0.8 | 10 |
| sr 27 | +0.7 | 9 |
| poison | +0.7 | 55 |
| sr 30 | +0.6 | 8 |
| psi-like abilities | +0.6 | 15 |
| damage reduction 10/magic | +0.6 | 16 |
| sr 24 | +0.6 | 11 |
| tongues | +0.6 | 12 |
| engulf | +0.5 | 11 |
| telepathy 100 ft. | +0.5 | 26 |
| sr 28 | +0.5 | 10 |
| blindsight 60 ft. | +0.5 | 10 |
| vulnerability to fire | +0.5 | 13 |
| spell-like abilities | +0.4 | 78 |
| alternate form | +0.4 | 75 |
| summon demon | +0.3 | 10 |
| fear aura | +0.3 | 14 |
| web | +0.3 | 9 |
| acid | +0.3 | 9 |
| … | | |
| sr 19 | -0.9 | 9 |
| hive mind | -0.9 | 10 |
| earth glide | -0.9 | 9 |
| single actions only | -0.9 | 8 |
| damage reduction 5/slashing | -0.9 | 8 |
| lowlight vision | -1.1 | 11 |
| rock catching | -1.1 | 8 |
| invincibility | -1.1 | 8 |
| damage reduction 5/– | -1.2 | 11 |
| damage reduction 10/– | -1.2 | 8 |
| icewalking | -1.3 | 12 |
| psychometabolism discipline | -1.4 | 12 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 3.5 | 1.7 | 5.2 | +6.8 |
| LEECHWALKER (p.329) | 10 | 4.6 | -0.3 | 4.3 | +5.7 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.9 | 0.7 | 2.5 | +5.5 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 7.8 | 0 | 7.8 | +5.2 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0 | 2 | +5 |
| MARUT (p.318) | 15 | 9.9 | 0.3 | 10.2 | +4.8 |
| ELOHIM (p.232) | 8 | 2.5 | 1.3 | 3.7 | +4.3 |
| MEDUSA (p.357) | 7 | 2.2 | 0.6 | 2.8 | +4.2 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 9.6 | 2.2 | 11.8 | +4.2 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.5 | 8.9 | +4.1 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | 4.7 | 2.4 | 7.1 | +3.9 |
| BODAK (p.125) | 10 | 4.6 | 1.5 | 6.1 | +3.9 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | 5.8 | 1.4 | 7.2 | +3.8 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 15 | -1.3 | 13.7 | -3.7 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.7 | 2.6 | 13.3 | +3.7 |
| GEAR GOLEM (p.285) | 7 | 10.9 | -0.2 | 10.7 | -3.7 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.5 | -0.1 | 7.4 | +3.6 |
| OGRE MAGE (p.388) | 8 | 4.4 | 0 | 4.4 | +3.6 |
| PLATONIC (p.404) | 17 | 12.5 | 1 | 13.5 | +3.5 |
| ETOILE (p.235) | 2 | 5 | 0.4 | 5.4 | -3.4 |
| CHAOS BEAST (p.140) | 7 | 3.7 | -0.1 | 3.6 | +3.4 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 9.8 | 0.8 | 10.6 | +3.4 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.9 | 3.9 | 6.8 | +3.2 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 11 | 14.3 | -0.2 | 14.1 | -3.1 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
