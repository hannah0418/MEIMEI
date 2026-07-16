/**
 * The Response store — SQLite in a local file (ADR-0004).
 *
 * One laptop, one student at a time, the queue is the lock. No concurrency, no pool, no
 * network, nothing to start before opening the laptop. The whole dataset is one file that
 * can be copied to a USB stick and handed to the department — there is no export step.
 *
 * Uses node:sqlite, which ships with Node itself, so seeding and running need no native
 * build and no service. No Docker, no MongoDB, no hosted database — all three were
 * considered and rejected in ADR-0004. Read it before "improving" this.
 *
 * Deliberately not unit-tested (see spec): one insert and one count against a local file
 * with no concurrency, where the board on screen is the test. The ordering that *is* worth
 * testing lives in lib/grading.ts as a pure function, not in SQL.
 */

import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { NAME_MAX_LENGTH, RANK_BOARD_SIZE } from "./constants";
import { rankResponses } from "./grading";
import { PERSONAS, type Persona, type PersonaId } from "./personas";

export type StoredResponse = {
  id: number;
  name: string;
  personaId: PersonaId;
  score: number;
  elapsedMs: number;
  createdAt: string;
};

export type FactionBoardRow = { persona: Persona; count: number };

export type RankBoardRow = StoredResponse & { persona: Persona };

export type KnowledgeQuestion = {
  id: number;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: "easy" | "medium" | "hard";
};

const DB_PATH =
  process.env.MEIMEI_DB_PATH ?? path.join(process.cwd(), "data", "meimei.db");

let db: DatabaseSync | undefined;

export function getDb(): DatabaseSync {
  if (db) return db;

  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);

  // The day's data has to survive a laptop reboot: a crash at lunchtime must not erase
  // the morning. WAL plus a full sync keeps committed Responses on disk.
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA synchronous = FULL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      persona_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      elapsed_ms INTEGER NOT NULL,
      answers TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL UNIQUE,
      correct_answer TEXT NOT NULL,
      incorrect_answers TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      curated INTEGER NOT NULL DEFAULT 1
    );
  `);

  return db;
}

/** Trims a self-declared Name to something a public board can hold. */
export function capName(name: string): string {
  return name.trim().slice(0, NAME_MAX_LENGTH);
}

/** Writes one completed run. Called once, at the end — a partial run writes nothing. */
export function writeResponse(response: {
  name: string;
  personaId: PersonaId;
  score: number;
  elapsedMs: number;
  answers: unknown;
}): number {
  const result = getDb()
    .prepare(
      `INSERT INTO responses (name, persona_id, score, elapsed_ms, answers, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      capName(response.name),
      response.personaId,
      response.score,
      response.elapsedMs,
      JSON.stringify(response.answers),
      new Date().toISOString(),
    );

  return Number(result.lastInsertRowid);
}

/**
 * How many Responses matched each Persona. All eight Teams are always present, including
 * zeroes — otherwise the board looks broken every morning.
 */
export function factionBoard(): FactionBoardRow[] {
  const counts = new Map<string, number>();
  for (const row of getDb()
    .prepare(`SELECT persona_id, COUNT(*) AS count FROM responses GROUP BY persona_id`)
    .all() as { persona_id: string; count: number }[]) {
    counts.set(row.persona_id, Number(row.count));
  }

  return PERSONAS.map((persona) => ({
    persona,
    count: counts.get(persona.id) ?? 0,
  }));
}

function toStoredResponse(row: Record<string, unknown>): StoredResponse {
  return {
    id: Number(row.id),
    name: String(row.name),
    personaId: String(row.persona_id) as PersonaId,
    score: Number(row.score),
    elapsedMs: Number(row.elapsed_ms),
    createdAt: String(row.created_at),
  };
}

/**
 * The top ten Names by Score. The ordering comes from lib/grading.ts, not from SQL, so the
 * rule that decides the board is the one covered by tests. A few hundred Responses across
 * one day is nothing to sort in memory.
 */
export function rankBoard(limit = RANK_BOARD_SIZE): RankBoardRow[] {
  const responses = (
    getDb().prepare(`SELECT * FROM responses`).all() as Record<string, unknown>[]
  ).map(toStoredResponse);

  return rankResponses(responses)
    .slice(0, limit)
    .map((response) => ({
      ...response,
      persona:
        PERSONAS.find((p) => p.id === response.personaId) ?? PERSONAS[0],
    }));
}

/**
 * Removes a Response outright — off the Rank Board and out of the Faction Board count.
 * A slur or an impersonated name has to be gone in seconds, in front of a queue.
 */
export function deleteResponse(id: number): void {
  getDb().prepare(`DELETE FROM responses WHERE id = ?`).run(id);
}

/**
 * Twelve questions drawn at random per Response from the curated pool, so consecutive
 * students rarely see the same set and rerolling gains little (ADR-0007).
 */
export function drawKnowledgeQuestions(count: number): KnowledgeQuestion[] {
  const rows = getDb()
    .prepare(
      `SELECT id, question, correct_answer, incorrect_answers, difficulty
       FROM knowledge_questions WHERE curated = 1 ORDER BY RANDOM() LIMIT ?`,
    )
    .all(count) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: Number(row.id),
    question: String(row.question),
    correctAnswer: String(row.correct_answer),
    incorrectAnswers: JSON.parse(String(row.incorrect_answers)) as string[],
    difficulty: String(row.difficulty) as KnowledgeQuestion["difficulty"],
  }));
}

/**
 * The correct answers for the questions a student was served, read back at submit time.
 * The Score is graded here, from the pool, rather than from anything the browser sends.
 */
export function correctAnswersFor(ids: readonly number[]): Map<number, string> {
  if (ids.length === 0) return new Map();

  const placeholders = ids.map(() => "?").join(",");
  const rows = getDb()
    .prepare(
      `SELECT id, correct_answer FROM knowledge_questions WHERE id IN (${placeholders})`,
    )
    .all(...ids) as { id: number; correct_answer: string }[];

  return new Map(rows.map((row) => [Number(row.id), String(row.correct_answer)]));
}
