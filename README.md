# The Game Master's Familiar

**Rules, foes, and adjudication at the GM's fingertips** — for the Epics & Epochs (E&E) tabletop RPG. A single-file tool in the house doctrine: open `gmf.html` in any browser, online or off. *The Familiar serves until you're familiar.*

## v0.1.0 — the Bestiary & the Adjudicator (pillars 1 & 3 of six)

- **🐾 Bestiary** — 418 foes extracted from the E&E Foe Folio as live data: full-text search, type/size/CR filters, complete statblocks with abilities and page citations.
- **⚖ Adjudicator** — ruling cards with citations: the Horror save flow, Massive Damage, grapple, declared stances, DR overlap doctrine, Mutant classification, perpetual Buffs, the Orders/Helm/Guns stellar round, and growing.

## The Six-Pillar road

1. Bestiary Engine ✅ v0.1 · 2. Encounter Forge (party-aware EL; CG roster JSON import) · 3. Adjudicator ✅ v0.1 seed · 4. Table Ops (GM-side initiative/condition tracker) · 5. Genesis Tools (Scales-native generators) · 6. Scales Console — with simulation-backed encounter difficulty (the HELM method at personal scale) as the long moat.

## Building

`node tools/extract_bestiary.mjs <FoeFolio-flow-dump.txt> data/bestiary.json` then `node tools/build.mjs` → `gmf.html`. The book's text dump stays private; only Open Game Content statblock data ships.

**Known extraction gaps (v0.2 targets):** true dragons (age-category table format), swarm/table-form entries; template entries parse partially by design.

Bestiary data is derived from the E&E Foe Folio and constitutes Open Game Content under OGL 1.0a. Epics & Epochs © Adam Bilodeau, Gamer's Pair O' Dice.
