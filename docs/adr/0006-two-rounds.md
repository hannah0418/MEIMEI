---
status: accepted (amends ADR-0003)
---

# The quiz is two Rounds: matching and scoring cannot share a question

The fair needs a ranking with student names on it, and Personas cannot supply one. The moment an option in a "how do you debug?" question is marked correct, students stop answering honestly and start answering what the room rewards: the student who genuinely would ship it and laugh picks "dig in calmly" instead, because that is obviously the right answer at a CS department booth. Code Cutie then stops existing — not because nobody is Code Cutie, but because nobody will admit to it with points on the line. So the quiz splits: a **Persona Round** of twelve questions with no right answers, which produces the Persona, and a **Knowledge Round** of real IT/CS questions with an answer key, which produces the Score and the ranking.

## Considered Options

- **One question set doing both** — rejected: this is the failure above. Persona data would not merely get noisy, it would converge on whatever the roster considers virtuous, and the Faction Board would fill with Debug Master and Loop Legend all day.
- **Drop the Personas, ship straight CS trivia with a leaderboard** — cheaper and it works, rejected because the Personas are the reason anyone walks up to the booth.
- **Drop the ranking** (ADR-0003 as originally written) — rejected by the department: the fair wants a competition.

## Consequences

ADR-0003's reasoning survives — a Persona match is still never an achievement and is never ranked — but its conclusion that no student is ever ranked is now wrong. Two boards exist: the **Faction Board** (Teams by Response count) and the **Rank Board** (Names by Score). They must stay visibly separate, or students will read their Persona as a verdict.

Two question sets now need authoring, and the Knowledge Round needs an answer key the department will argue about. The quiz also gets longer — twelve plus roughly eight questions is about four minutes, and at one laptop that is roughly fifteen students an hour. If throughput hurts, the Persona Round is what shrinks, and any cut below twelve questions requires re-checking that every Persona is still reachable under ADR-0005's coverage rule.

Cheating narrows to the Knowledge Round, where a student could reroll and memorise the answers. Accepted for a one-day booth; if it matters, serve a random subset per run.
