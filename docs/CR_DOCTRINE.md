# CR DOCTRINE — the 3.5/PF1 critique, its validity, and the E&E answers
(Adam's commission, 2026-10-12: validate the internet's gripes, find root causes, address them.)

## The gripes, graded

**1. "CR chronically over-estimates — monsters are weaker than advertised." LARGELY VALID,
with a design caveat.** The 3.5-era target was never a coin-flip: CR N = a challenge that a
four-PC party of level N survives ~90%+ of the time while paying ~20-25% of daily resources.
Much internet disappointment is measuring against the wrong target. BUT the valid core:
monster power per CR genuinely decays at high CR (community analyses find low-CR monsters
delivering ~2× the damage-per-CR of high-CR ones, with marquee special abilities over-credited
for toughness they don't deliver), system-mastery/wealth scaling on the PC side widens the gap
every level, and the mis-rating variance WITHIN a CR band is large. **E&E inherits a milder
form**: the GMG scales FF CRs downward ON PURPOSE (p.39 — margin of error in the PCs' favor),
so "under-powered vs the naive reading" is partly doctrine here, not defect. The audit measures
against the intended bias.

**2. "A single CR-equal monster is no challenge at all." VALID — but it is an ENCOUNTER
property, not a statblock property.** Four PCs out-act one monster ~4:1; a lone boss either
folds before it matters or is statted so hot it deletes a PC per round (the death-spiral
dilemma). No per-foe CR number can fix arithmetic about action counts. 5e's answer was
legendary/lair actions; the community's is boss-plus-minions. **E&E answers in the Forge**
(see the spec amendment): a solo-boss warning with the minion prescription, and a design lane
flagged for Adam — an E&E-native "extra actions for the outnumbered" mechanic (UCS candidate).

**3. "Special abilities are mis-priced — casters and save-or-die monsters most of all."
VALID, and the most actionable.** This is the synergy problem by another name. PF1's partial
fix was the Bestiary's monster-statistics-by-CR benchmark table — including a PRIMARY ABILITY
DC column, acknowledging that the save-or-suffer channel is first-class offense. **E&E's
answers, shipped v0.5.2-v0.5.3:** (a) our benchmark table is generated EMPIRICALLY from the
corpus (data/benchmarks.json) rather than decreed; (b) the max special-ability DC is now a
body-CR offense component beside attack and damage; (c) abilities are corpus-priced (98 tags,
ridge-fitted — spells +2.6 CR, immunities +2.1, incorporeal +1.8…); (d) what the model CANNOT
price is named to the GM explicitly ("+3.8 in tricks: petrifying gaze") instead of hiding in
an aggregate. The residual is a radar, not a shrug.

**4. "CR ignores context — terrain, party composition, encounter frequency." VALID AND
PERMANENT.** No single number carries it. E&E's layering: the statblock carries body + priced
abilities + named tricks (this doc's machinery); the FORGE carries party-aware context (actual
roster, size, attribute-generation bonus, environment facets, the solo-boss warning); TABLE
OPS telemetry (Phase E) eventually carries the table's own history — the three-layer answer
to a one-number problem.

## The instrument, current form
predicted CR = body + Σ priced abilities + named residual, where
body = mean(defense, offense); defense = mean(HP-CR, AC-CR); offense = mean(Atk-CR, Dmg-CR,
DC-CR when present); every component CR is the corpus benchmark curve inverted (monotone
interpolation of per-CR medians). Fit at v0.5.3: body alone R² 0.920; with priced abilities
R² 0.956, MAE 1.0 CR, n=704. Forward-compatibility: any future mechanically-measurable threat
(a vehicle, a HELM hull, a homebrew horror) prices through the same curves the moment its
measurables are harvested — the instrument is corpus-relative by construction.

## Open lanes
- Phase D sim spot-checks of the unexplained docket (Athach −4.1, the Wereboar template stack).
- The within-band variance finding (gripe 1) argues for eventually surfacing the Forge's
  difficulty bands with the FOE's hot/cold chip factored in, not just raw CR.
- The E&E solo-boss mechanic (gripe 2): GMG CORE per Adam (2026-10-12) — too crucial for
  a would-be GM to live outside core; design session pending. The GMG also owes the CR
  CALCULUS GLOSSARY (letter banked on Adam’s TODO): the Familiar does the heavy lifting,
  the GMG explains the reading.
