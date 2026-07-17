# MEI MEI

MEI MEI is a two-Round creativity and IT/CS quiz for a College of Computer Studies org
fair. Students match with one of eight **Personas**, earn a Knowledge Round **Score**, and
join two live boards.

The app runs as one Vercel deployment backed by one Neon Postgres database. `CONTEXT.md`
defines the domain language; `docs/adr/` records the decisions behind it.

## Quiz flow

**Home → Name → Persona Round → Knowledge Round → Reveal → Boards**

- Home links to How to Play, Personas, and the live boards.
- The Persona Round has 12 untimed questions with no correct answers.
- The Knowledge Round has 12 timed IT/CS questions and produces the Score.
- An abandoned run writes nothing. The Reveal returns to the boards after 60 seconds.

## Deploy to Vercel

1. Import this repository as a Vercel project.
2. From the Vercel Marketplace, create and connect a Neon Postgres database. Connect the
   same database to Production and Development so both receive `DATABASE_URL`.
3. Add a strong `ADMIN_PASSWORD` to both Vercel environments.
4. Pull the environment variables and seed the database once:

```bash
npm install
npx vercel link
npx vercel env pull .env.local
npm run seed
```

5. Deploy from the Vercel dashboard or run:

```bash
npx vercel --prod
```

`npm run seed` creates both tables and fills the Knowledge Question pool from Open Trivia
DB. It is safe to rerun: existing question text and curation flags are preserved.

## Run locally

Local development intentionally uses the same Neon database as production.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Clear test Responses before the fair using Staff Mode.

## Staff Mode

On the boards, press and hold **MEI MEI** for two seconds, then enter `ADMIN_PASSWORD`.

- **✕** permanently removes one Response from both boards.
- **Clear Boards** permanently removes every Response, including Names and answers.
- Knowledge Questions are never removed.
- Refreshing or closing the tab relocks Staff Mode.
- If `ADMIN_PASSWORD` is missing or incorrect, the quiz still runs but Staff Mode stays
  locked.

## Fair-day setup

1. Open the production Vercel URL on the booth laptop.
2. Enter full-screen mode.
3. Confirm the boards load and complete one test Response.
4. Clear the test Response before students begin.

The booth needs internet access because both Vercel and Neon are hosted services.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Questions come from [Open Trivia DB](https://opentdb.com), CC BY-SA 4.0. Persona Round
wording and Knowledge Question curation still require final review by the organization.
