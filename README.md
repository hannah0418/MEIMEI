# MEI MEI

A creativity quiz for the College of Computer Studies, run from one laptop at a department
org fair. Students answer twelve questions about how they work and are matched to one of
eight **Personas**; then they answer twelve real CS questions for a **Score** and a place on
the **Rank Board**.

`CONTEXT.md` is the glossary and is authoritative. `docs/adr/` holds the decisions.

## Before the fair (needs internet, once)

```bash
npm install
npm run seed     # fetches the Knowledge Round pool from Open Trivia DB
```

`npm run seed` is the only thing that ever touches the network. It writes the question pool
into `data/meimei.db`. Re-running it is safe — it will not duplicate rows.

## At the booth (no internet needed)

```bash
npm run build
npm start        # then open http://localhost:3000 and go full-screen (F11)
```

Setup is opening a browser. Nothing to log in to, nothing to orchestrate, and the app never
calls out to the network at runtime — venue wifi degrades exactly when the booth is busiest.

The kiosk runs itself between students: **boards (idle) → START → Name → Persona Round →
Knowledge Round → Reveal → boards**. The Reveal returns to the boards after sixty seconds,
and an abandoned half-finished run returns after three minutes without writing anything.

## Booth staff

**Removing a name from the board** (a slur, or someone typing "Dean Reyes"): press and hold
the **MEI MEI** title on the boards for two seconds. A ✕ appears on each Rank Board row —
one tap removes that Response from both boards. Tap **Done** to hide it again. Students
tapping around during the idle loop will not find it.

**Handing over the data:** the whole day is one file, `data/meimei.db`. Copy it to a USB
stick. There is no export step.

> ⚠️ **Undecided:** that file contains the Names students typed, which is PII on a laptop
> that goes home with someone. Low stakes, but the org should decide *before* the fair
> whether the handed-over copy keeps the Names or strips them, so that it is a decision
> rather than an accident. Stripping them is `UPDATE responses SET name = '';` on the copy.

## Development

```bash
npm test         # Vitest — the grading rules and the question-set invariants
npm run typecheck
npm run dev
```

Two things are tested, because both failures they catch are **silent**:

- `lib/grading.test.ts` — the rules that decide the Persona, the Score and the Rank Board
  order. A reversed sort key ships looking completely fine.
- `lib/persona-questions.test.ts` — the authored Persona Round data. A starved Trait makes a
  Persona unmatchable all day, and the only symptom is an empty bar on the board.

The SQLite insert and the Faction Board count are deliberately not tested — the board on
screen is the test, and fixtures there would cost more than they catch.

## Still open

- **Issue 03 — the twelve Persona Round questions are a draft.** They pass both authoring
  rules, but they have to sound like the College, and the org has to stand behind them.
- **Issue 07 — the Knowledge Round pool is not curated.** All 149 questions are live
  (`curated = 1`). Roughly a third of Open Trivia DB's computer category is date
  memorisation or gotchas — the "kilobytes in a gigabyte (decimal)" question marks
  `1000000` correct with `1024` as a trap, and half the department will argue about it at
  your own table. Curating to ~50 (near 40% easy / 45% medium / 15% hard) is an afternoon
  with the org: `UPDATE knowledge_questions SET curated = 0 WHERE id = ...`.

Questions from [Open Trivia DB](https://opentdb.com), CC BY-SA 4.0.
