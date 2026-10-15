# CR MODEL — Phase C: body CR + priced abilities (generated 2026-10-15)

Two-stage legible model over 706 foes. **Fit:** body CR alone R² 0.93; with 98 priced ability tags (ridge λ=3) **R² 0.96, mean absolute error 1 CR**; intercept 0. predicted CR = body + Σ ability weights + intercept.

## The priced-ability table (what an ability is WORTH, in CR, corpus-wide)

| ability | CR worth | bearers |
|---|---|---|
| incorporeal traits | +2 | 8 |
| immunities | +1.9 | 19 |
| ooze traits | +1.9 | 12 |
| spells | +1.6 | 26 |
| undead traits | +1.3 | 38 |
| breath weapon | +1.2 | 31 |
| tongues | +1.1 | 12 |
| poison | +0.8 | 55 |
| vulnerability to fire | +0.8 | 13 |
| resistance to acid 10 | +0.7 | 11 |
| cold 10 | +0.7 | 11 |
| engulf | +0.7 | 11 |
| DR (per 10 points) | +0.7 | 168 |
| trip | +0.7 | 10 |
| acid | +0.6 | 9 |
| resistance to fire 10 | +0.6 | 8 |
| Quicken feat (fitted) | +0.5 | 6 |
| MD pressure (RULED: +1 per 2 forcing attacks, cap +3) | +0.5 | 187 |
| active defense (RULED: +0.5/rung above move, quality-gated, cap +1.5) | +0.5 | 60 |
| frightful presence | +0.4 | 114 |
| alternate form | +0.4 | 75 |
| blindsight 60 ft. | +0.4 | 10 |
| psi-like abilities | +0.4 | 15 |
| sr 30 | +0.3 | 8 |
| … | | |
| lowlight vision | -0.8 | 11 |
| earth glide | -0.8 | 9 |
| hive mind | -0.9 | 10 |
| damage reduction 5/slashing | -1 | 8 |
| single actions only | -1 | 8 |
| damage reduction 5/bludgeoning | -1 | 14 |
| fast healing 2 | -1 | 14 |
| icewalking | -1.2 | 12 |
| damage reduction 5/– | -1.4 | 11 |
| psychometabolism discipline | -1.4 | 12 |
| invincibility | -1.4 | 8 |
| damage reduction 10/– | -1.4 | 8 |

Negative weights read as "foes with this tag are PRICED BELOW their bodies" — usually a tag that rides along with a body already counted (e.g. a subtype marker), occasionally a genuine liability.

## The unexplained docket (|printed − predicted|, the true mis-rating candidates)

| foe | printed | body | abilities | predicted | residual |
|---|---|---|---|---|---|
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | 10.7 | 0 | 10.7 | +6.3 |
| WHISPERER IN THE DARK (p.500) | 12 | 4.8 | 1.3 | 6.1 | +5.9 |
| TARRASQUE (p.458) | 21 | 25 | 1.8 | 26.8 | -5.8 |
| MONGOLIAN DEATH WORM (p.369) | 8 | 1.7 | 0.9 | 2.6 | +5.4 |
| LEECHWALKER (p.329) | 10 | 5.2 | -0.3 | 4.9 | +5.1 |
| MAN-O’-WAR, GIANT (p.null) | 7 | 2 | 0.3 | 2.3 | +4.7 |
| THOUGHT SLAYER (p.463) | 13 | 8.4 | 0.4 | 8.8 | +4.2 |
| ELOHIM (p.232) | 8 | 2.7 | 1.4 | 4.1 | +3.9 |
| BODAK (p.125) | 10 | 3.9 | 2.2 | 6.1 | +3.9 |
| GARBAGE TOXYDERM — Garbage Toxyderm, Advanced (p.469) | 20 | 20.1 | 3.7 | 23.8 | -3.8 |
| MEDUSA (p.357) | 7 | 2.5 | 0.8 | 3.3 | +3.7 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | 2.4 | 4 | 6.4 | +3.6 |
| MARUT (p.318) | 15 | 10.4 | 1 | 11.4 | +3.6 |
| DARK NAGA (p.374) | 8 | 4.1 | 0.3 | 4.4 | +3.6 |
| DEMONIC AUTO/VEHICLE (p.165) | 13 | 9.4 | 0.1 | 9.5 | +3.5 |
| TOXIC SLUDGE — Toxic Sludge, Advanced (p.467) | 14 | 11 | 6.4 | 17.4 | -3.4 |
| STONE GIANT (p.272) | 9 | 11.6 | 0.6 | 12.2 | -3.2 |
| CHAOS BEAST (p.140) | 7 | 4 | 0 | 4 | +3 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 11 | 12.5 | 1.4 | 13.9 | -2.9 |
| HILL GIANT DIRE WEREBOAR — Hill Giant Dire Wereboar Hybrid Boar Form (p.345) | 14 | 16.2 | 0.7 | 16.9 | -2.9 |
| ANGEL — ANGEL, SOLAR (p.53) | 25 | 18.1 | 4 | 22.1 | +2.9 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | 11.3 | 1.8 | 13.1 | +2.9 |
| COUATS (p.146) | 10 | 6.4 | 0.8 | 7.2 | +2.8 |
| WEREWOLF LORD — Werewolf Lord, Dire Wolf Form (p.344) | 14 | 10.4 | 0.8 | 11.3 | +2.7 |

A POSITIVE residual = printed above what body + known abilities explain (the foe may own unpriced tech: unique abilities below the n≥8 tag floor, or a synergy premium). A NEGATIVE residual = printed below the model (candidate under-pricing, or a deliberate scaled-downward call).
