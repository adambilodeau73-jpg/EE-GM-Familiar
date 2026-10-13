# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-13)

Two-stage legible model over 707 foes. **Fit:** body CR alone R² 0.93; with 98 priced ability tags (ridge λ=3) **R² 0.963, mean absolute error 1 CR**; intercept -0.5. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| ooze traits | +2.1 | 12 |
| immunities | +2 | 19 |
| incorporeal traits | +1.9 | 8 |
| spells | +1.6 | 26 |
| undead traits | +1.3 | 38 |
| breath weapon | +1.2 | 31 |
| tongues | +1 | 12 |
| poison | +0.8 | 55 |
| engulf | +0.8 | 11 |
| cold 10 | +0.7 | 11 |
| resistance to acid 10 | +0.7 | 11 |
| vulnerability to fire | +0.7 | 13 |
| acid | +0.7 | 9 |
| construct traits | +0.7 | 31 |
| DR (per 10 points) | +0.6 | 168 |
| trip | +0.6 | 10 |
| Quicken feat (fitted) | +0.6 | 6 |
| resistance to fire 10 | +0.5 | 8 |
| blindsight 60 ft. | +0.5 | 10 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| active-defense rung (fitted/rung) | +0.5 | 620 |
| frightful presence | +0.5 | 114 |
| alternate form | +0.4 | 75 |
| psi-like abilities | +0.4 | 15 |
| sr 30 | +0.4 | 8 |
| magic circle against evil | +0.3 | 10 |
| … | | |
| single actions only | -0.8 | 8 |
| lowlight vision | -0.8 | 11 |
| outsider traits | -0.8 | 11 |
| earth glide | -0.8 | 9 |
| ink cloud | -0.9 | 8 |
| hive mind | -1 | 10 |
| fast healing 2 | -1.1 | 14 |
| icewalking | -1.3 | 12 |
| invincibility | -1.4 | 8 |
| psychometabolism discipline | -1.4 | 12 |
| damage reduction 5/– | -1.4 | 11 |
| damage reduction 10/– | -1.5 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.7 | 0.5 | 10.7 | +6.3 |
| WHISPERER IN THE DARK (p.500) | 12 | 4.8 | 1.8 | 6 | +6 |
| TARRASQUE (p.458) | 21 | 25 | 2.2 | 26.6 | -5.6 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.7 | 1.4 | 2.6 | +5.4 |
| LEECHWALKER (p.329) | 10 | 5.1 | 0.2 | 4.8 | +5.2 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.8 | 2.3 | +4.7 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.9 | 8.8 | +4.2 |
| ELOHIM (p.232) | 8 | 2.7 | 1.8 | 4 | +4 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.1 | 4.2 | 23.7 | -3.7 |
| MEDUSA (p.357) | 7 | 2.5 | 1.3 | 3.3 | +3.7 |
| BODAK (p.125) | 10 | 3.9 | 3.1 | 6.5 | +3.5 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.4 | 4.8 | 6.6 | +3.4 |
| TOXIC SLUDGE — Toxic Sludge, Advanced (p.467) | 14 | 11 | 6.8 | 17.3 | -3.3 |
| MARUT (p.318) | 15 | 10.4 | 1.9 | 11.8 | +3.2 |
| STONE GIANT (p.272) | 9 | 11.6 | 1.1 | 12.2 | -3.2 |
| DARK NAGA (p.374) | 8 | 4.1 | 1.2 | 4.8 | +3.2 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 9.4 | 1.1 | 10 | +3 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.5 | 1.1 | 11.1 | +2.9 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 11 | 12.5 | 1.8 | 13.8 | -2.8 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 14 | 16.2 | 1.1 | 16.8 | -2.8 |
| MONSTROUS SCORPION — Monstrous Scorpion, Colossal (p.492) | 14 | 15.8 | 1.4 | 16.7 | -2.7 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.8 | 1 | 8.3 | +2.7 |
| MUMMY — Mummy Lord, 10th-Level Cleric (p.372) | 15 | 11 | 1.9 | 12.4 | +2.6 |
| ANGEL — ANGEL, SOLAR (p.53) | 25 | 18.1 | 4.8 | 22.4 | +2.6 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
