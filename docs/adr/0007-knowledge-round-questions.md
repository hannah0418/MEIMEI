# Knowledge Round questions are curated from Open Trivia DB and seeded at build time

Writing and defending an original CS answer key is more work than the fair is worth, so the Knowledge Round draws on Open Trivia DB's "Science: Computers" category (192 questions — 66 easy, 83 medium, 43 hard; four options each, matching the Persona Round's shape; free, no API key). A build-time script fetches the set and seeds it into SQLite; the app never calls the API at runtime, even though the venue has internet. Roughly a third of the set is date memorisation and gotchas — the "how many kilobytes in one gigabyte (in decimal)?" question marks `1000000` correct with `1024` as a trap, which will start an argument at our own table — so the org curates down to about 50, aiming for a mix near 40% easy / 45% medium / 15% hard so Scores spread without leaning on the timer.

## Considered Options

- **Live API calls during the fair** — possible now that the venue has internet, rejected: venue wifi degrades exactly when the booth is busiest, a fetch failure puts a spinner in front of a student with a queue behind them, and OpenTDB's 1-request-per-5-seconds limit means batching anyway. Seeding cannot fail because there is nothing to fail.
- **Writing our own questions** — rejected on effort, though curating the 50 recreates the useful half of that work: the argument about which questions are fair is the answer key getting department buy-in before a student challenges it.
- **Shipping all 192 raw** — rejected: the junk third makes a CS department booth look like a Facebook quiz.

## Consequences

Each run serves 12 random questions from the curated pool, so consecutive students rarely see the same set and rerolling gains little. Each question is capped at 30 seconds; the Persona Round stays untimed, because honesty needs room and a timeout there would cost a Trait point and eat into ADR-0005's reachability math. A timeout in the Knowledge Round counts as wrong.

OpenTDB returns HTML-escaped text (`&quot;`, `&#039;`) which must be decoded at seed time. The set is CC BY-SA 4.0, so the board carries a "Questions from Open Trivia DB" credit.
