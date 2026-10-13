# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-13)

Two-stage legible model over 706 foes. **Fit:** body CR alone R² 0.929; with 98 priced ability tags (ridge λ=3) **R² 0.963, mean absolute error 0.9 CR**; intercept -0.5. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| ooze traits | +2.1 | 12 |
| spells | +2.1 | 26 |
| immunities | +2 | 19 |
| incorporeal traits | +1.9 | 8 |
| undead traits | +1.3 | 38 |
| breath weapon | +1.1 | 31 |
| engulf | +0.9 | 11 |
| construct traits | +0.8 | 31 |
| acid | +0.7 | 9 |
| vulnerability to fire | +0.7 | 13 |
| tongues | +0.6 | 12 |
| poison | +0.6 | 55 |
| trip | +0.6 | 10 |
| DR (per 10 points) | +0.6 | 168 |
| Quicken feat (fitted) | +0.6 | 6 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| cold 10 | +0.5 | 11 |
| resistance to acid 10 | +0.5 | 11 |
| frightful presence | +0.5 | 114 |
| active-defense rung (fitted/rung) | +0.5 | 619 |
| blindsight 60 ft. | +0.5 | 10 |
| psi-like abilities | +0.4 | 15 |
| alternate form | +0.4 | 75 |
| damage reduction 10/magic | +0.4 | 16 |
| sr 30 | +0.4 | 8 |
| vermin traits | +0.3 | 30 |
| … | | |
| single actions only | -0.7 | 8 |
| damage reduction 5/bludgeoning | -0.8 | 14 |
| earth glide | -0.8 | 9 |
| ink cloud | -0.8 | 8 |
| lowlight vision | -0.8 | 11 |
| fast healing 2 | -0.8 | 14 |
| hive mind | -1 | 10 |
| icewalking | -1.3 | 12 |
| invincibility | -1.4 | 8 |
| psychometabolism discipline | -1.4 | 12 |
| damage reduction 10/– | -1.5 | 8 |
| damage reduction 5/– | -1.5 | 11 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| WHISPERER IN THE DARK (p.500) | 12 | 4.8 | 1.8 | 6.1 | +5.9 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.7 | 1.1 | 2.3 | +5.7 |
| TARRASQUE (p.458) | 21 | 25 | 2.1 | 26.6 | -5.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 7 | 1.4 | 7.8 | +5.2 |
| LEECHWALKER (p.329) | 10 | 5.1 | 0.3 | 4.9 | +5.1 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.8 | 2.3 | +4.7 |
| KOBOLD — Drakkin Leader, 6th-level Sorcerer (p.323) | 5 | 5.9 | 4 | 9.3 | -4.3 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.8 | 8.7 | +4.3 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.7 | 2.5 | 12.7 | +4.3 |
| MEDUSA (p.357) | 7 | 2.5 | 1 | 3 | +4 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.1 | 4.2 | 23.8 | -3.8 |
| ELOHIM (p.232) | 8 | 2.7 | 2.1 | 4.3 | +3.7 |
| BODAK (p.125) | 10 | 3.9 | 2.9 | 6.3 | +3.7 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.4 | 4.8 | 6.7 | +3.3 |
| MARUT (p.318) | 15 | 10.4 | 1.8 | 11.7 | +3.3 |
| TOXIC SLUDGE — Toxic Sludge, Advanced (p.467) | 14 | 11 | 6.8 | 17.3 | -3.3 |
| STONE GIANT (p.272) | 9 | 11.6 | 1 | 12.1 | -3.1 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.3 | 2.2 | 13 | +3 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.5 | 1.1 | 11.1 | +2.9 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 14 | 16.2 | 1.2 | 16.9 | -2.9 |
| HARPY — Harpy Archer, 7th-Level Fighter (p.304) | 11 | 7.8 | 0.8 | 8.1 | +2.9 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 11 | 12.5 | 1.8 | 13.8 | -2.8 |
| OGRE MAGE (p.388) | 8 | 5.2 | 0.5 | 5.2 | +2.8 |
| CHAOS BEAST (p.140) | 7 | 4 | 0.8 | 4.3 | +2.7 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
