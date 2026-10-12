# CR AUDIT — Phase B: the descriptive benchmarks (generated 2026-10-12)

Corpus: 718 non-template variants with CR (718 harvested; coverage — AC 704, saves 688, offense 704). Method: per-CR percentile bands; outliers scored by robust within-band z (median/IQR, log-space for HP and damage), defense = mean z(effHP, fullAC), offense = mean z(bestAtk, routine), overall = their mean. Bands with n < 5 are reported but not scored.

## The benchmark table (median [p25–p75])

| CR | n | eff HP | full AC | touch AC | best atk | routine dmg | Fort/Ref/Will |
|---|---|---|---|---|---|---|---|
| 0.16666666666666666 | 2 | 12.5 [8.3–16.8] | 13 [13–13] | 12 [11.5–12.5] | 2.5 [1.8–3.3] | 1.8 [1.6–1.9] | 3/4/0.5 |
| 0.25 | 2 | 17.5 [15.8–19.3] | 15 [14–16] | 13 [12–14] | 5 [5–5] | 2.5 [2.5–2.5] | 3/4.5/1 |
| 0.3333333333333333 | 7 | 11 [9.5–15] | 15 [15–15.5] | 12 [11.5–14] | 2 [1.5–3] | 3.5 [2.5–4.3] | 2/4/2 |
| 0.5 | 22 | 12.5 [5.3–23.8] | 15 [13–16] | 12 [11–13] | 3 [2–4] | 4.5 [3.5–5.4] | 3/4/1 |
| 1 | 51 | 25 [21–35] | 15 [14–16] | 12 [10–13] | 3 [2–4] | 5 [3.5–7.5] | 3/3/1 |
| 2 | 55 | 38 [27.5–48] | 16 [14–17] | 12 [11–13] | 5 [4–6] | 7.5 [4.5–11.5] | 4/4.5/3 |
| 3 | 85 | 49 [36–64] | 16 [15–18] | 12 [11–13] | 6 [4–7] | 9 [5.5–16.5] | 5/4.5/4 |
| 4 | 51 | 82 [61–105] | 17 [15–18] | 10 [10–11] | 9 [6–10] | 15.3 [8.8–22.6] | 6/5/5 |
| 5 | 53 | 83 [75–113] | 17 [15–19] | 11 [10–11.3] | 10 [8–11] | 17 [11.8–27.5] | 8/6/5 |
| 6 | 34 | 103 [92.3–131] | 18.5 [17–20] | 10 [9–12] | 11 [10–13] | 25.5 [19.3–32.5] | 8/7/6 |
| 7 | 51 | 129 [81–165] | 18 [16.5–21] | 10 [9–12] | 13 [10–15] | 22.8 [11.6–32.5] | 9/7/7.5 |
| 8 | 37 | 147 [104–187] | 20 [18–22] | 10 [9–12] | 15 [12–17] | 21 [15–37.5] | 10/8/7 |
| 9 | 31 | 179 [140–233] | 22 [19–24.5] | 10 [9–11] | 18 [14–19] | 28 [23.9–46.9] | 12/9/9 |
| 10 | 29 | 220 [177–269] | 22.5 [19.8–24] | 9 [8–10] | 18 [14–22] | 32 [18.4–45] | 12/9/9 |
| 11 | 27 | 208 [160–309] | 25 [22.3–25] | 9 [9–10.8] | 18 [15–22.5] | 32.5 [26.9–50.6] | 13/10/11 |
| 12 | 21 | 240 [197–290] | 23 [18–26] | 9 [8–10] | 23 [20–25] | 40 [33–51] | 15/9/10 |
| 13 | 14 | 301 [204–378.3] | 26.5 [26–27.8] | 9 [8–9.8] | 22.5 [20–25.5] | 25.5 [21.8–56.8] | 15/11/13 |
| 14 | 20 | 267 [237–385] | 27 [25.5–29] | 8 [8–10.5] | 24 [21–28] | 57 [36.8–83] | 17/11.5/13 |
| 15 | 14 | 441 [200.8–458] | 28.5 [28–29] | 8 [8–9.5] | 27 [22.5–28] | 51 [23.6–64.5] | 17/12/16 |
| 16 | 11 | 474 [334.5–482.5] | 30 [30–32] | 8 [8–10.5] | 30 [26–31.5] | 70.5 [46.3–70.5] | 18/13/16 |
| 17 | 10 | 336 [288–470] | 31 [27.5–32] | 8 [8–12.3] | 29 [24.3–31.8] | 56 [47–105.5] | 19/14/17 |
| 18 | 12 | 553.5 [503–596.5] | 33 [32–35] | 8 [8–8] | 34 [31.8–35.3] | 114 [114–114] | 20.5/15/19 |
| 19 | 14 | 601 [579.3–640.5] | 35 [34–36.8] | 8 [8–8] | 36 [35–38.8] | 91.5 [73.3–109.8] | 22/16/20 |
| 20 | 13 | 638 [610–687] | 36 [34–37] | 8 [6–8] | 39 [36–41] | 112 [103.5–112.3] | 23/17/21 |
| 21 | 12 | 737 [666.5–750.5] | 37 [36–38] | 6 [6–7] | 40 [39–40.3] | 105 [105–105] | 25/17.5/23 |
| 22 | 10 | 762 [755–827] | 38 [38–40] | 6 [6–6] | 42 [41–44] | 112 [112–112] | 26/18/24.5 |
| 23 | 10 | 842 [769.5–872] | 39.5 [39–41] | 6 [6–6] | 44 [42.3–45] | 205 [205–205] | 28/19/25.5 |
| 24 | 8 | 911 [872–937.3] | 42 [41–42.3] | 6 [6–6] | 47.5 [46.5–48] | — | 29/20/27 |
| 25 | 5 | 930 [911–930] | 44 [43–44] | 6 [6–6] | 49 [47–49] | 142.5 [142.5–142.5] | 29/21/27 |
| 26 | 1 | 930 [930–930] | 44 [44–44] | 6 [6–6] | 49 [49–49] | — | 29/21/27 |
| 27 | 1 | 987 [987–987] | 39 [39–39] | 2 [2–2] | 47 [47–47] | — | 31/21/31 |
| 28 | 4 | 1030 [978–1030] | 41 [36.3–41] | 2 [2–3] | 49 [48.8–51.8] | 152 [152–152] | 32/22/30 |
| 30 | 1 | 1117 [1117–1117] | 42 [42–42] | 2 [2–2] | 51 [51–51] | — | 33/22/33 |

## The outlier docket — HOT (over-statted for their CR: candidates for a CR raise or a deliberate-terror note)

| foe | CR | overall z | def z | off z | eff HP | AC | routine |
|---|---|---|---|---|---|---|---|
| TARRASQUE (p.458) | 20 | 3 | 1.1 | 4.9 | 1008 | 36 | 112.5 |
| WHITE DRAGON — Great wyrm (p.196) | 21 | 2.1 | 0.8 | 3.3 | 872 | null | 98 |
| BLUE DRAGON — Young (p.191) | 6 | 1.9 | 1.9 | 1.8 | 207 | 21 | 23.5 |
| WHITE DRAGON — Juvenile (p.196) | 6 | 1.8 | 1.9 | 1.8 | 205 | 21 | 23.5 |
| BLACK DRAGON — Great wyrm (p.190) | 22 | 1.8 | 1.7 | 1.8 | 891 | 42 | 98 |
| WHITE DRAGON — Ancient (p.196) | 18 | 1.7 | 1.4 | 1.9 | 670 | 37 | 75 |
| ASTRAL CONSTRUCT — 4TH-LEVEL ASTRAL CONSTRUCT (p.111) | 3 | 1.7 | 2.2 | 1.1 | 97 | 22 | 13.5 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 1.6 | 2 | 1.1 | 269 | 33 | 46 |
| WHITE DRAGON — Wyrm (p.196) | 19 | 1.6 | 1.3 | 1.8 | 755 | 38 | 97 |
| ETOILE (p.235) | 2 | 1.5 | 2 | 0.9 | 56 | 23 | 10.5 |
| ASTRAL CONSTRUCT — 2ND-LEVEL ASTRAL CONSTRUCT (p.111) | 1 | 1.4 | 2.2 | 0.7 | 61 | 18 | 7.5 |
| ASTRAL CONSTRUCT — 5TH-LEVEL ASTRAL CONSTRUCT (p.111) | 5 | 1.4 | 1.8 | 1 | 133 | 23 | 27 |
| FLESHRAKER (Knife Fiend) — Knife Fiend (p.240) | 3 | 1.4 | 2.2 | 0.5 | 71 | 24 | 7 |
| XORN — Minor Xorn (p.509) | 3 | 1.3 | 2.2 | 0.5 | 82 | 23 | 20 |
| ASTRAL CONSTRUCT — 3RD-LEVEL ASTRAL CONSTRUCT (p.111) | 2 | 1.3 | 1.7 | 0.9 | 76 | 20 | 10.5 |
| XORN — Elder Xorn (p.509) | 8 | 1.3 | 1.3 | 1.4 | 210 | 25 | 44.5 |
| TOPAZ DRAGON — Great wyrm (p.207) | 22 | 1.3 | 0.8 | 1.8 | 891 | null | 98 |
| WHITE DRAGON — Mature adult (p.196) | 12 | 1.3 | 1.5 | 1.1 | 441 | 28 | 67 |
| UNICORN — Unicorn (p.479) | 3 | 1.3 | 0.9 | 1.7 | 72 | 18 | 21.5 |
| BLACK DRAGON — Ancient (p.190) | 19 | 1.3 | 1.1 | 1.4 | 687 | 38 | 75 |

## The outlier docket — COLD (under-statted: candidates for a CR cut or an ability-tax explanation)

| foe | CR | overall z | def z | off z | eff HP | AC | routine |
|---|---|---|---|---|---|---|---|
| ANGEL — ANGEL, SOLAR (p.53) | 25 | -7.2 | -5 | -9.3 | 314 | 37 | 142.5 |
| NUCLEAR TOXYDERM — Nuclear Toxyderm (p.470) | 22 | -6 | -7.4 | -4.5 | 380 | 21 | 112 |
| PIT FIEND (p.178) | 21 | -3.8 | -0.9 | -6.7 | 340 | 40 | 105 |
| SATANIC ICHOR — Satanic Ichor (p.423) | 4 | -3 | -3 | -3 | 21 | 11 | 1.5 |
| WHISPERER IN THE DARK (p.500) | 12 | -3 | -2.9 | -3.1 | 71 | 14 | 28 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | -2.9 | -4.6 | -1.2 | 198 | 21 | 22 |
| MONTAUK MONSTER — Montauk Monster, Advanced (p.370) | 15 | -2.9 | -5.1 | -0.7 | 215 | 15 | 48 |
| MONGOLIAN DEATH WORM (p.369) | 8 | -2.9 | -2.4 | -3.3 | 32 | 16 | 1.5 |
| FROST GIANT — Frost Giant Jarl, 8th-Level Blackguard (p.269) | 19 | -2.8 | -3.4 | -2.2 | 276 | 29 | 128 |
| TITAN (p.464) | 23 | -2.7 | -2 | -3.4 | 465 | 38 | 205 |
| GRAY OOZE (p.391) | 4 | -2.7 | -3.9 | -1.5 | 31 | 5 | 8 |
| UNBODIED (p.477) | 5 | -2.6 | -2.9 | -2.4 | 22 | 13 | 3.5 |
| ELOHIM (p.232) | 8 | -2.6 | -1.7 | -3.5 | 72 | 15 | 0 |
| SATANIC ICHOR — Satanic Ichor, Advanced (p.423) | 10 | -2.6 | -3.3 | -1.9 | 90 | 11 | 7.5 |
| SEWER SLUDGE — Sewer Sludge (p.427) | 5 | -2.5 | -2.6 | -2.4 | 36 | 10 | 4.5 |
| HORNED DEVIL (CORNUGON) (p.174) | 18 | -2.4 | -1.4 | -3.5 | 267 | 35 | 114 |
| VARGOUILLE (p.485) | 2 | -2.4 | -3.4 | -1.5 | 5 | 12 | 2.5 |
| PIXIE (p.447) | 4 | -2.3 | -2.9 | -1.7 | 8 | 17 | 3.5 |
| Sidhe, Dreamghast — Sidhe, Faun (p.null) | 4 | -2.1 | -2.1 | -2.2 | 27 | 14 | 3.5 |
| SHADOW — Greater Shadow (p.428) | 8 | -2.1 | -1.9 | -2.3 | 58 | 15 | 4.5 |

**Reading the docket:** a COLD foe whose body is weak for its CR usually carries its price in abilities the statline cannot show (the synergy problem) — the docket is therefore also a ranked list of WHERE the ability multipliers live, which is exactly the Phase C feature-engineering queue. A HOT foe with no compensating ability tax is a genuine mis-rating candidate.

## Dragon age-ladder self-consistency (16 internal CR ladders)

- ⚠ BRASS DRAGON: effHP falls 458→407 at CR 15→17 (Mature adult→Old)

## Ability-tag census (n ≥ 5 — the Phase C feature seed and the "valuable abilities" vocabulary)

| tag | n | mean CR |
|---|---|---|
| darkvision 60 ft. | 327 | 6.5 |
| low-light vision | 190 | 5.6 |
| scent | 137 | 4.9 |
| frightful presence | 114 | 18.5 |
| improved grab | 86 | 7 |
| spell-like abilities | 78 | 9.1 |
| alternate form | 75 | 11.7 |
| immunity to fire | 74 | 12.3 |
| poison | 55 | 5.7 |
| immunity to acid | 51 | 12.6 |
| elemental traits | 39 | 8 |
| undead traits | 38 | 6.1 |
| vulnerability to cold | 36 | 9.3 |
| construct traits | 31 | 7.4 |
| breath weapon | 31 | 8.9 |
| vermin traits | 30 | 3.9 |
| immunity to cold | 29 | 9.3 |
| spells | 26 | 11.2 |
| telepathy 100 ft. | 26 | 10.3 |
| immunity to electricity | 24 | 10.9 |
| tremorsense 60 ft. | 23 | 6.4 |
| immunities | 19 | 7.3 |
| water breathing | 19 | 11.4 |
| damage reduction 10/silver | 17 | 6.4 |
| pounce | 16 | 6.5 |
| damage reduction 5/magic | 16 | 4.1 |
| damage reduction 10/magic | 16 | 7.9 |
| speak with animals | 16 | 11.7 |
| immunity to poison | 15 | 6.9 |
| psi-like abilities | 15 | 5.5 |
| fear aura | 14 | 8.4 |
| damage reduction 5/bludgeoning | 14 | 4.5 |
| fast healing 2 | 14 | 3.4 |
| curse of lycanthropy | 14 | 6.6 |
| immunity to acid and cold | 14 | 14.1 |
| vulnerability to fire | 13 | 7.5 |
| sr 21 | 13 | 14.2 |
| sr 25 | 13 | 19.2 |
| tongues | 12 | 12.3 |
| ooze traits | 12 | 7.3 |

(173 tags total at n ≥ 5; full set in data/metrics.json rows. A tag whose bearers' mean CR runs far above the corpus mean while their BODIES score cold is a high-value ability — the first crude synergy signal, formalized in Phase C.)
