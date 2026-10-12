# Pillars 2 & 4 — The Encounter Forge and Chronicler-Ready Table Ops

Spec ratified for build (Adam: "let's make the Familiar omni-functional!", 2026-10-12).
Grounded in the 2026-10-12 competitive scout: BattleCast proves demand for simulation-backed
difficulty; the session-recap market ($9–13/mo: Saga20, Tabletop Arc, Archivist, GM Assistant)
pays ~60% of its costs transcribing audio; Quest Portal's credit tiers + Library Link validate
the GMF two-layer model. Our play: **the Table Ops event log IS the Chronicler's transcript** —
structured at the source, zero transcription cost, zero speaker-ID ambiguity, perfect mechanical
accuracy, styled by the campaign's own canon. Nobody else owns both the tracker and the lore.

---

## 0. Shared data contracts

### 0.1 Roster import (the party, from the CG)
The CG's save format is the array `chars` (its Save All export = `JSON.stringify(chars, null, 1)`).
The Forge/Table Ops **roster adapter** reads a tolerant subset — unknown fields pass through
untouched so CG version drift never breaks import:

```json
{ "name": "...", "race": "...", "classes": [{"cls": "...", "lvl": N}], ...rest }
```

Derived per PC: **ECL** (sum of class levels + racial level modifier when present) — the PC's CR
per GMG p.40 ("Every player character's Challenge Rating is equal to their Effective Character
Level"). Roster persists at `localStorage gmf_roster` + file import/export; a roster is a named
party ("The Lonely Corridor crew") with an attribute-generation flag (see 1.1).

### 0.2 Foe references
A foe in any Forge/Table Ops structure is `{"fam": "<parent>", "v": <variant index>}` against
`data/bestiary.json` — never a copied statblock. Page numbers ride along for the citation line
(the Adjudicator discipline, everywhere).

---

## 1. Pillar 2 — THE ENCOUNTER FORGE (🔨)

### 1.1 F0: the party CR calculator (GMG pp.39–40, book-native)
- Party CR = **average ECL** of the roster (GMG: a 5-5-5-4 or 5-5-5-6 party is still CR 5).
- **+1 per member beyond four** (GMG p.39).
- **+1 if attribute generation was "Favored" or "Heroic"** (GMG p.39) — the roster's flag.
- GM fine-tune dial: ±1 ("adjust the party's CR accordingly... to fine-tune", GMG p.40).

### 1.2 F1: the difficulty dial — the XP table IS the ladder
The GMG's Experience Point Awards table (p.39) already names the five bands; the Forge adopts
them as its difficulty dial so the book and the tool never disagree:

| Dial | Band vs party CR | GMG's own words |
|---|---|---|
| Trivial | CR −3 or lower | "much lower" |
| Easy | CR −2 to −1 | "lower... easily" |
| Standard | CR ±1 | "roughly equal... some difficulty" |
| Sub-boss | CR +2 to +3 | "sub-boss type" |
| Boss | CR +4 | "big boss type" |

The Forge previews the **XP award range** straight off that table (band × CR), and the
**treasure row** off the Treasure Values per Encounter table (GMG pp.40–41, treasure level =
encounter CR) with a one-click roller for coins/goods/items per the monster's treasure rating.

### 1.3 Multi-foe Encounter Level — ⚖ BOOK GAP, GAVEL REQUIRED
The GMG's "Using Base Challenge Ratings to Calculate Encounter Level" table (p.40) prints a
single row ("Base CR of the group or encounter — Base CR = average") — there is **no printed
rule for combining multiple foes into one EL**, though the traps passage (GMG ~p.XXX, "use
their CRs to determine their combined Encounter Level as though they were monsters") assumes
one exists. **Forge default pending Adam's ruling, per house design philosophy (reuse 3.5
canon):** two foes of equal CR = EL +2 (a doubling is one step of +2; mixed groups fold
pairwise from the top: EL ≈ max CR + 2·log₂(Σ 2^((CRᵢ−max)/2))). Flag the one-row table as a
GMG letter candidate once ruled. UI shows the computed EL beside the band it lands in.

### 1.4 The picker
Facet reuse from the Bestiary (type / size / CR / environment / search) + a build tray:
add family → variant select (the existing CR-per-option machinery) → count stepper. Live EL +
band meter as the tray changes (the D&D Beyond/BattleCast table stakes). Environment facet
pre-filterable from the scenario (a Cold-terrain scenario forges from Cold 23 by default).

### 1.4b The action-economy warning (added 2026-10-12, per the CR doctrine)
A lone foe at EL ≈ party CR against a 4+ PC roster draws the SOLO-BOSS warning: "the party
out-acts this encounter ~N:1 — a lone CR-equal foe historically under-performs its EL; consider
minions (spread the party's attacks) or the Sub-boss/Boss band." The warning cites
docs/CR_DOCTRINE.md gripe 2. Design lane flagged for Adam: an E&E-native mechanic granting the
badly-outnumbered extra actions (the 5e legendary-action niche) — UCS candidate, his word.

### 1.5 The encounter card (output)
`{name, scenario, foes: [{fam, v, n}], el, band, xpPreview, treasure, notes}` — saved to
`localStorage gmf_encounters`, exportable, and **sendable to Table Ops** as pre-seeded
combatants (the Forge's output is the tracker's input; the pillars interlock).

### 1.6 F2: the SKIRMISH hook (interface now, engine later)
`skirmish(encounterCard, roster) → {winPct, survivalPct, meanRounds, casualtiesByPC}` — the
HELM-method moat. The Forge ships with the button present and labeled as the Awakened/engine
lane (BattleCast's 10k-trial Monte Carlo proves the demand; our edge = the ACTUAL party via
0.1, and E&E exclusivity). No engine work in v0.6.

---

## 2. Pillar 4 — TABLE OPS (⚔), the Chronicler-ready event log

### 2.1 The session document
```json
{
  "id": "s-<ulid>", "campaign": "The Lonely Corridor", "title": "Session 12 — Mortmain",
  "date": "2026-10-12", "scenario": "Mortmain Station",
  "registers": ["gothic", "industrial-horror"],
  "rosterSnapshot": [ ...0.1 records at session start... ],
  "encounters": [ ...1.5 cards... ],
  "events": [ ...2.2... ]
}
```
`registers` are the setting's tone tags — the "styled to the scenario" dial the recap market
lacks; the three Lonely Corridor world docs are each one or two registers.

### 2.2 The event — one shape, enumerated kinds
```json
{ "seq": N, "t": "ISO-8601", "kind": "...", "actor": ref?, "target": ref?,
  "data": {...per kind...}, "note": "GM free text", "ic": "in-character quote?" }
```
Actor/target refs: `"pc:<name>"` (roster), `"foe:<fam>#<v>#<instance>"` (bestiary), or
`"x:<label>"` (ad hoc). Kinds and their payloads:

| kind | data | renders as |
|---|---|---|
| `scene` | {title, where} | chapter break / location prose |
| `round` | {n, encounter} | pacing beat (mostly silent in prose) |
| `initiative` | {order:[refs]} | "battle was joined..." |
| `attack` | {roll, vs, hit, weapon} | the strike, hit or miss |
| `damage` | {amount, type, remaining?} | the wound, scaled adjectives by % taken |
| `heal` | {amount} | respite prose |
| `save`/`check` | {what, dc, roll, ok} | the close call / the feat of skill |
| `condition` | {name, on}| the turn of fortune |
| `death` | {} | the fall (foe or PC — register-weighted) |
| `loot` | {items:[...], treasureRoll?} | the spoils |
| `xp` | {amount, why} | (GM-view only) |
| `npc` | {name, disposition} | introductions, parley |
| `quote` | {} + `ic` | verbatim table gold, attributed |
| `note` | {} + `note` | GM color, woven in |
| `rest`/`travel`/`custom` | {…} | connective tissue |
| `amend` | {seq, patch} | **edits are events** — the log is append-only |
| `voice` | {text, speaker?} | future: transcript drops into the SAME log |

Append-only + `amend` keeps the log auditable (a recap you can trust is a recap whose source
was never silently rewritten); `voice` reserves the competitors' entire input mode as one more
event kind, later, optional.

### 2.3 The tracker UI (what the GM touches in play)
Initiative rail (from an encounter card or ad hoc), per-combatant HP/conditions with
one-tap damage/heal (each tap EMITS the event — the GM tracks the fight; the log writes
itself), quick buttons for quote/note/scene, session timer. localStorage autosave per keypress;
export `.gmfsession.json`.

### 2.4 The Chronicler rendering contract
- **GMF-Static ships a template renderer**: events → competent plain chronicle (deterministic
  string templates per kind, register-flavored adjective tables). Free tier, offline, no AI.
- **GMF-Awakened renders prose**: the session document + registers + bestiary/Adjudicator
  grounding → styled narrative. Two outputs, both always: **player-safe recap** (no GM-only
  kinds: xp, note-flagged-private, unrevealed foes render by description not name) and
  **GM continuity report** (everything, with seq-citations back into the log — the Tabletop
  Arc idea, done at the structured layer where it's trivial instead of the audio layer where
  it's their whole product).

---

## 3. Build order
| Version | Ships |
|---|---|
| v0.6.0 | Forge F0+F1: roster import, party CR, dial, picker, EL (default rule flagged), card |
| v0.6.x | Treasure roller; encounter→Table Ops handoff stub |
| v0.7.0 | Table Ops: tracker + full event log + autosave/export |
| v0.7.x | Static Chronicler (template renderer, both views) |
| v0.8.x | Battery debt: build a CG-style probe battery for GMF (overdue) |
| v0.9.x | SKIRMISH engine lane opens (post-Forge telemetry informs the model) |

## 4. Open gavels (Adam)
1. **Multi-foe EL rule** (§1.3) — 3.5 doubling (+2) as the house rule? Book letter follows.
2. **Difficulty band names** (§1.2) — the GMG's own five, or house names?
3. XP auto-award suggestion on by default in Table Ops? (The GMG table's roleplay rows argue
   the GM should stay the author — proposal: suggest, never auto-commit.)
4. Registers vocabulary — free tags, or a curated list seeded from the world docs?
