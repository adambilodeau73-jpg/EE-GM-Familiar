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
| 7 | 57 | 130 [90–165] | 18 [17–21] | 10 [9–12] | 13 [10–16] | 24.5 [14.3–38.3] | 9/7/7 |
| 8 | 33 | 140 [100–186] | 20 [18–22] | 10 [9–12] | 15 [11.8–17] | 19 [14–32.5] | 10/8/8 |
| 9 | 35 | 197 [145.5–233.5] | 22 [20–24] | 9 [9–11] | 18 [14–20] | 29.8 [24–43] | 12/9/9 |
| 10 | 28 | 187.5 [146–277.3] | 22 [19.5–24] | 9 [8–9.5] | 18 [13.8–22.3] | 30 [17–46] | 11.5/7.5/9 |
| 11 | 31 | 240 [192.5–302.5] | 25 [23–26] | 9 [9–13.3] | 20 [17–24] | 40 [28.3–51.4] | 14/10/10.5 |
| 12 | 15 | 275 [202–349] | 26 [17.5–27] | 8 [6–9] | 21 [20–24.5] | 34 [29.8–39.5] | 15/9/8 |
| 13 | 19 | 259 [220–362] | 26.5 [25.3–27] | 8.5 [8–10] | 23 [20–26] | 63.8 [24.8–86.1] | 16/11/13 |
| 14 | 15 | 238 [186.5–390] | 28 [26–29] | 9 [8–13.5] | 23 [21–27] | 44.3 [31.5–52.9] | 17/12/13 |
| 15 | 12 | 441 [396–458] | 29 [28–29.5] | 8 [8–8] | 27 [26.3–28.8] | 41.8 [11.6–81] | 17.5/12/16.5 |
| 16 | 14 | 457.5 [272.3–474] | 30.5 [30–32] | 8 [8–12.3] | 29.5 [25–31.8] | 66.3 [50–70.5] | 18/13/16 |
| 17 | 8 | 351.5 [261.3–491] | 31 [29–32.5] | 9 [8–13.3] | 30.5 [24–31.3] | 89 [46–130.3] | 19/14/17 |
| 18 | 13 | 553 [507–592] | 33 [32–35] | 8 [8–8] | 34 [32–36] | 83.5 [69.3–97.8] | 21/14/19 |
| 19 | 12 | 618.5 [592–655.5] | 35.5 [34–37.3] | 8 [8–8] | 37 [35–39.3] | — | 22/16/20 |
| 20 | 14 | 638 [596.5–676.5] | 36 [34.3–37.8] | 8 [6–8] | 36.5 [35.3–39.8] | 108.5 [102.5–112.1] | 23/17/21 |
| 21 | 12 | 737 [666.5–750.5] | 37 [36–38] | 6 [6–7] | 40 [39–40.3] | 205 [205–205] | 25/17/23 |
| 22 | 9 | 769 [755–827] | 38.5 [38–40] | 6 [6–6] | 43 [41–44] | — | 26/18/25 |
| 23 | 10 | 842 [769.5–872] | 39.5 [39–41] | 6 [6–6] | 44 [42.3–45] | 142.5 [142.5–142.5] | 28/19/25.5 |
| 24 | 8 | 911 [872–937.3] | 42 [41–42.3] | 6 [6–6] | 47.5 [46.5–48] | — | 29/20/27 |
| 25 | 5 | 930 [930–930] | 44 [43–44] | 6 [6–6] | 49 [47–49] | — | 29/21/29 |
| 26 | 5 | 1030 [930–1030] | 41 [41–41] | 2 [2–6] | 49 [49–49] | 152 [152–152] | 32/22/30 |
| 27 | 1 | 1117 [1117–1117] | 42 [42–42] | 2 [2–2] | 51 [51–51] | — | 33/22/33 |

## The outlier docket — HOT (over-statted for their CR: candidates for a CR raise or a deliberate-terror note)

| foe | CR | overall z | def z | off z | eff HP | AC | routine |
|---|---|---|---|---|---|---|---|
| TARRASQUE (p.458) | 20 | 3.6 | 1.1 | 6.2 | 1008 | 36 | 112.5 |
| WHITE DRAGON — Great wyrm (p.196) | 21 | 2.1 | 0.8 | 3.3 | 872 | null | 98 |
| MONSTROUS SCORPION — Monstrous Scorpion, Colossal (p.492) | 12 | 1.9 | 0.5 | 3.2 | 425 | 26 | 57 |
| BLUE DRAGON — Young (p.191) | 6 | 1.9 | 1.9 | 1.8 | 207 | 21 | 23.5 |
| WHITE DRAGON — Juvenile (p.196) | 6 | 1.8 | 1.9 | 1.8 | 205 | 21 | 23.5 |
| ASTRAL CONSTRUCT — 4TH-LEVEL ASTRAL CONSTRUCT (p.111) | 3 | 1.7 | 2.2 | 1.1 | 97 | 22 | 13.5 |
| ASTRAL CONSTRUCT — 9TH-LEVEL ASTRAL CONSTRUCT (p.111) | 10 | 1.6 | 2 | 1.1 | 269 | 33 | 46 |
| WHITE DRAGON — Old (p.196) | 15 | 1.5 | 0.9 | 2.2 | 491 | 31 | 68 |
| WHITE DRAGON — Ancient (p.196) | 18 | 1.5 | 1.4 | 1.7 | 670 | 37 | 75 |
| ETOILE (p.235) | 2 | 1.5 | 2 | 0.9 | 56 | 23 | 10.5 |
| BLACK DRAGON — Great wyrm (p.190) | 22 | 1.4 | 1.5 | 1.4 | 891 | 42 | 98 |
| ASTRAL CONSTRUCT — 2ND-LEVEL ASTRAL CONSTRUCT (p.111) | 1 | 1.4 | 2.2 | 0.7 | 61 | 18 | 7.5 |
| ASTRAL CONSTRUCT — 5TH-LEVEL ASTRAL CONSTRUCT (p.111) | 5 | 1.4 | 1.8 | 1 | 133 | 23 | 27 |
| FLESHRAKER (Knife Fiend) — Knife Fiend (p.240) | 3 | 1.4 | 2.2 | 0.5 | 71 | 24 | 7 |
| XORN — Elder Xorn (p.509) | 8 | 1.4 | 1.3 | 1.5 | 210 | 25 | 44.5 |
| BLACK DRAGON — Wyrm (p.190) | 20 | 1.4 | 1.1 | 1.7 | 774 | 39 | 97 |
| TOPAZ DRAGON — Wyrm (p.207) | 20 | 1.4 | 1.1 | 1.7 | 774 | 39 | 97 |
| XORN — Minor Xorn (p.509) | 3 | 1.3 | 2.2 | 0.5 | 82 | 23 | 20 |
| ASTRAL CONSTRUCT — 3RD-LEVEL ASTRAL CONSTRUCT (p.111) | 2 | 1.3 | 1.7 | 0.9 | 76 | 20 | 10.5 |
| ASTRAL CONSTRUCT — 7TH-LEVEL ASTRAL CONSTRUCT (p.111) | 8 | 1.3 | 1.5 | 1.1 | 186 | 27 | 33 |

## The outlier docket — COLD (under-statted: candidates for a CR cut or an ability-tax explanation)

| foe | CR | overall z | def z | off z | eff HP | AC | routine |
|---|---|---|---|---|---|---|---|
| ANGEL — ANGEL, SOLAR (p.53) | 23 | -3.9 | -3.3 | -4.4 | 314 | 37 | 142.5 |
| ALICORN — Advanced Alicorn Champion of Good (p.50) | 16 | -3.4 | -4.2 | -2.6 | 198 | 21 | 22 |
| SATANIC ICHOR — Satanic Ichor (p.423) | 4 | -3 | -3 | -3 | 21 | 11 | 1.5 |
| MONGOLIAN DEATH WORM (p.369) | 8 | -2.8 | -2.3 | -3.3 | 32 | 16 | 1.5 |
| NUCLEAR TOXYDERM — Nuclear Toxyderm (p.470) | 20 | -2.8 | -4.2 | -1.3 | 380 | 21 | 112 |
| WHISPERER IN THE DARK (p.500) | 12 | -2.8 | -2.5 | -3 | 71 | 14 | 28 |
| GRAY OOZE (p.391) | 4 | -2.7 | -3.9 | -1.5 | 31 | 5 | 8 |
| UNBODIED (p.477) | 5 | -2.6 | -2.9 | -2.4 | 22 | 13 | 3.5 |
| MUMMY — Mummy Lord, 10th-Level Cleric (p.372) | 15 | -2.6 | -1.4 | -3.8 | 147 | 33 | 15.5 |
| ELOHIM (p.232) | 8 | -2.5 | -1.6 | -3.5 | 72 | 15 | 0 |
| MONTAUK MONSTER — Montauk Monster (p.370) | 11 | -2.5 | -4 | -1 | 87 | 14 | 35 |
| SEWER SLUDGE — Sewer Sludge (p.427) | 5 | -2.5 | -2.6 | -2.4 | 36 | 10 | 4.5 |
| VARGOUILLE (p.485) | 2 | -2.4 | -3.4 | -1.5 | 5 | 12 | 2.5 |
| ABOLETH — Aboleth Mage, 10th-Level Wizard (p.48) | 17 | -2.4 | -2.5 | -2.3 | 212 | 21 | 50 |
| PIXIE (p.447) | 4 | -2.3 | -2.9 | -1.7 | 8 | 17 | 3.5 |
| JUMPING JACK (Blood Fiend) — Jumping Jack, 9th-Level Fast Villain (p.243) | 11 | -2.2 | -1.6 | -2.7 | 80 | 25 | 9 |
| Sidhe, Dreamghast — Sidhe, Faun (p.null) | 4 | -2.1 | -2.1 | -2.2 | 27 | 14 | 3.5 |
| TOXIC SLUDGE — Toxic Sludge (p.467) | 7 | -2.1 | -2.7 | -1.5 | 60 | 7 | 10 |
| CALLER IN DARKNESS (p.129) | 9 | -2.1 | -2.8 | -1.3 | 71 | 14 | 28 |
| SHADOW — Greater Shadow (p.428) | 8 | -2.1 | -1.8 | -2.3 | 58 | 15 | 4.5 |

**Reading the docket:** a COLD foe whose body is weak for its CR usually carries its price in abilities the statline cannot show (the synergy problem) — the docket is therefore also a ranked list of WHERE the ability multipliers live, which is exactly the Phase C feature-engineering queue. A HOT foe with no compensating ability tax is a genuine mis-rating candidate.

## Dragon age-ladder self-consistency (16 internal CR ladders)

- ⚠ BRASS DRAGON: effHP falls 458→407 at CR 15→17 (Mature adult→Old)

## Ability-tag census (n ≥ 5 — the Phase C feature seed and the "valuable abilities" vocabulary)

| tag | n | mean CR |
|---|---|---|
| darkvision 60 ft. | 327 | 6.4 |
| low-light vision | 190 | 5.5 |
| scent | 137 | 4.9 |
| frightful presence | 114 | 18.4 |
| improved grab | 86 | 6.9 |
| spell-like abilities | 78 | 8.9 |
| alternate form | 75 | 11.5 |
| immunity to fire | 74 | 12.1 |
| poison | 55 | 5.7 |
| immunity to acid | 51 | 12.5 |
| elemental traits | 39 | 7.5 |
| undead traits | 38 | 6 |
| vulnerability to cold | 36 | 9 |
| construct traits | 31 | 7.2 |
| breath weapon | 31 | 8.5 |
| vermin traits | 30 | 3.9 |
| immunity to cold | 29 | 9.1 |
| spells | 26 | 11 |
| telepathy 100 ft. | 26 | 10.2 |
| immunity to electricity | 24 | 10.8 |
| tremorsense 60 ft. | 23 | 6.2 |
| immunities | 19 | 7.2 |
| water breathing | 19 | 11.3 |
| damage reduction 10/silver | 17 | 6.2 |
| pounce | 16 | 6.5 |
| damage reduction 5/magic | 16 | 4.1 |
| damage reduction 10/magic | 16 | 7.9 |
| speak with animals | 16 | 11.7 |
| immunity to poison | 15 | 6.9 |
| psi-like abilities | 15 | 5.5 |
| fear aura | 14 | 8.2 |
| damage reduction 5/bludgeoning | 14 | 4.4 |
| fast healing 2 | 14 | 3.4 |
| curse of lycanthropy | 14 | 6.4 |
| immunity to acid and cold | 14 | 14 |
| vulnerability to fire | 13 | 7.2 |
| sr 21 | 13 | 14.2 |
| sr 25 | 13 | 19.2 |
| tongues | 12 | 12 |
| ooze traits | 12 | 7.1 |

(173 tags total at n ≥ 5; full set in data/metrics.json rows. A tag whose bearers' mean CR runs far above the corpus mean while their BODIES score cold is a high-value ability — the first crude synergy signal, formalized in Phase C.)
