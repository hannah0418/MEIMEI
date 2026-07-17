---
status: superseded by ADR-0009
---

# MEI MEI runs on one offline booth laptop, on SQLite, with no accounts

MEI MEI exists for a single department org fair: one laptop on a table, students queueing to take the quiz one at a time. That constraint is invisible in the code but decides everything — there is no concurrency (the queue is the lock), and a few hundred Responses across one day. So: no auth, no hosting, and SQLite in a local file rather than a hosted database or a containerised MongoDB.

The venue does have internet, but nothing at runtime may depend on it. Venue wifi at a fair degrades exactly when the booth is busiest, and a network failure mid-quiz puts a spinner in front of a student with a queue behind them. Treat connectivity as a convenience for the people running the booth, never as a dependency of the app.

## Considered Options

- **Students' phones via QR + Vercel + hosted Postgres** — better throughput and a real share loop, rejected because the fair is a booth, not a campaign.
- **Docker + MongoDB via Mongoose** — rejected because a daemon, a container, and a volume are three things that can fail on fair day with no internet to debug them, in exchange for document-store flexibility this data never needs.
- **Google/Microsoft domain sign-in** — rejected with the phones option; a sign-in wall at a booth is how you get students to walk away.

## Consequences

Anyone reading this later will see an unauthenticated write endpoint and a local database file and assume they were shortcuts. They were choices — do not "fix" them without first checking the deployment is still one offline laptop. Because there are no accounts, the Faction Board counts Responses rather than students and rerolls are indistinguishable from new students; this is accepted, not overlooked. After the fair the entire dataset is one file that can be handed to the department on a USB stick.

The Reveal must carry the share loop that ADR-0003 assigned to sharing: it is a full-screen card, held until dismissed, designed to be photographed off the screen.
