/**
 * Seeds the Knowledge Round pool from Open Trivia DB (ADR-0007).
 *
 * A build-time script. Run it once, on good internet, well before the fair:
 *
 *   npm run seed
 *
 * The app never calls this API at runtime, even though the venue has internet. Venue wifi
 * degrades exactly when the booth is busiest, and a fetch failure would put a spinner in
 * front of a student with a queue behind them. Seeding cannot fail at the booth because
 * there is nothing there to fail.
 *
 * Source: category 18 "Science: Computers", no API key. The category reports 192 verified
 * questions, but a third of those are true/false: the Knowledge Round serves four options,
 * so this asks for type=multiple only and lands nearer 114.
 *
 * Licence CC BY-SA 4.0; the credit goes on the boards.
 */

import { getDb } from "../lib/db";

const CATEGORY_COMPUTERS = 18;
/** The API caps a single request at 50 questions. */
const BATCH_SIZE = 50;
/** Open Trivia DB documents a rate limit of one request every five seconds. */
const RATE_LIMIT_MS = 5_000;

type ApiQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty: string;
};

type ApiResponse = { response_code: number; results?: ApiQuestion[] };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Asking the API for url3986 keeps HTML entities out of the payload entirely: text arrives
 * percent-encoded, so `&quot;` and `&#039;` never appear and decodeURIComponent is the whole
 * decoder. Skip this and questions render as garbage on screen.
 */
const decode = (text: string) => decodeURIComponent(text);

async function getJson(url: string): Promise<ApiResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Trivia DB returned HTTP ${response.status} for ${url}`);
  }
  return (await response.json()) as ApiResponse;
}

/** A session token makes the API hand out each question once, so batches do not overlap. */
async function requestToken(): Promise<string> {
  const data = (await getJson("https://opentdb.com/api_token.php?command=request")) as {
    token?: string;
  } & ApiResponse;
  if (!data.token) throw new Error("Open Trivia DB refused a session token");
  return data.token;
}

async function fetchAllQuestions(): Promise<ApiQuestion[]> {
  const token = await requestToken();
  const questions: ApiQuestion[] = [];
  let batch = BATCH_SIZE;

  for (;;) {
    await sleep(RATE_LIMIT_MS);

    const data = await getJson(
      `https://opentdb.com/api.php?amount=${batch}&category=${CATEGORY_COMPUTERS}` +
        `&type=multiple&token=${token}&encode=url3986`,
    );

    // Rate limited — wait it out rather than dropping questions.
    if (data.response_code === 5) {
      console.warn("  rate limited, waiting…");
      continue;
    }

    // 1 = not enough questions left to fill this batch, 4 = token exhausted. The API
    // reports both when fewer than `batch` remain, so shrink the batch and drain the
    // tail rather than walking away from the last questions in the category.
    if (data.response_code === 1 || data.response_code === 4) {
      if (batch === 1) break;
      batch = Math.max(1, Math.floor(batch / 2));
      continue;
    }

    if (data.response_code !== 0 || !data.results?.length) {
      throw new Error(`Open Trivia DB response_code ${data.response_code}`);
    }

    questions.push(...data.results);
    console.log(`  fetched ${questions.length} questions…`);
  }

  return questions;
}

async function main() {
  console.log("Fetching Science: Computers from Open Trivia DB…");
  const questions = await fetchAllQuestions();

  const db = getDb();
  // Re-running must not duplicate rows: question text is UNIQUE and this ignores collisions,
  // so a re-run after a curation pass leaves the curated flags alone.
  const insert = db.prepare(
    `INSERT OR IGNORE INTO knowledge_questions
       (question, correct_answer, incorrect_answers, difficulty)
     VALUES (?, ?, ?, ?)`,
  );

  let added = 0;
  for (const q of questions) {
    const result = insert.run(
      decode(q.question),
      decode(q.correct_answer),
      JSON.stringify(q.incorrect_answers.map(decode)),
      decode(q.difficulty),
    );
    if (result.changes > 0) added++;
  }

  const total = (
    db
      .prepare(
        `SELECT difficulty, COUNT(*) AS count FROM knowledge_questions GROUP BY difficulty`,
      )
      .all() as { difficulty: string; count: number }[]
  )
    .map((row) => `${row.difficulty} ${row.count}`)
    .join(", ");

  console.log(`\nSeeded ${added} new questions (${questions.length} fetched).`);
  console.log(`Pool now holds: ${total}`);
  console.log(
    "\nEvery question is in the pool (curated = 1). Curation to ~50 is issue 07 —\n" +
      "the org's call, not the script's: it is the answer key, and it needs department\n" +
      "buy-in before a student challenges it at the table.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
