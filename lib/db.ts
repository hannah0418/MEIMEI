/** The shared Neon Postgres store (ADR-0009). */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

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

let client: NeonQueryFunction<false, false> | undefined;

function sql(): NeonQueryFunction<false, false> {
  if (client) return client;
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return (client = neon(process.env.DATABASE_URL));
}

/** One-time setup used by `npm run seed`; deployments do not run migrations. */
export async function setupDatabase(): Promise<void> {
  await sql().query(`
    CREATE TABLE IF NOT EXISTS responses (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      persona_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      elapsed_ms INTEGER NOT NULL,
      answers TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  await sql().query(`
    CREATE TABLE IF NOT EXISTS knowledge_questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL UNIQUE,
      correct_answer TEXT NOT NULL,
      incorrect_answers TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      curated INTEGER NOT NULL DEFAULT 1
    )
  `);
}

/** Trims a self-declared Name to something a public board can hold. */
export function capName(name: string): string {
  return name.trim().slice(0, NAME_MAX_LENGTH);
}

export async function writeResponse(response: {
  name: string;
  personaId: PersonaId;
  score: number;
  elapsedMs: number;
  answers: unknown;
}): Promise<number> {
  const rows = (await sql().query(
    `INSERT INTO responses (name, persona_id, score, elapsed_ms, answers, created_at)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      capName(response.name),
      response.personaId,
      response.score,
      response.elapsedMs,
      JSON.stringify(response.answers),
      new Date().toISOString(),
    ],
  )) as { id: number }[];
  return Number(rows[0].id);
}

export async function factionBoard(): Promise<FactionBoardRow[]> {
  const rows = (await sql().query(
    `SELECT persona_id, COUNT(*)::int AS count FROM responses GROUP BY persona_id`,
  )) as { persona_id: string; count: number }[];
  const counts = new Map(rows.map((row) => [row.persona_id, Number(row.count)]));

  return PERSONAS.map((persona) => ({ persona, count: counts.get(persona.id) ?? 0 }));
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

export async function rankBoard(limit = RANK_BOARD_SIZE): Promise<RankBoardRow[]> {
  const rows = (await sql().query(`SELECT * FROM responses`)) as Record<string, unknown>[];
  return rankResponses(rows.map(toStoredResponse))
    .slice(0, limit)
    .map((response) => ({
      ...response,
      persona: PERSONAS.find((persona) => persona.id === response.personaId) ?? PERSONAS[0],
    }));
}

export async function deleteResponse(id: number): Promise<void> {
  await sql().query(`DELETE FROM responses WHERE id = $1`, [id]);
}

export async function clearResponses(): Promise<void> {
  await sql().query(`DELETE FROM responses`);
}

export async function drawKnowledgeQuestions(count: number): Promise<KnowledgeQuestion[]> {
  const rows = (await sql().query(
    `SELECT id, question, correct_answer, incorrect_answers, difficulty
     FROM knowledge_questions WHERE curated = 1 ORDER BY RANDOM() LIMIT $1`,
    [count],
  )) as Record<string, unknown>[];

  return rows.map((row) => ({
    id: Number(row.id),
    question: String(row.question),
    correctAnswer: String(row.correct_answer),
    incorrectAnswers: JSON.parse(String(row.incorrect_answers)) as string[],
    difficulty: String(row.difficulty) as KnowledgeQuestion["difficulty"],
  }));
}

export async function correctAnswersFor(ids: readonly number[]): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map();
  const rows = (await sql().query(
    `SELECT id, correct_answer FROM knowledge_questions WHERE id = ANY($1::integer[])`,
    [ids],
  )) as { id: number; correct_answer: string }[];
  return new Map(rows.map((row) => [Number(row.id), row.correct_answer]));
}

export async function seedKnowledgeQuestion(question: {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  difficulty: string;
}): Promise<boolean> {
  const rows = await sql().query(
    `INSERT INTO knowledge_questions
       (question, correct_answer, incorrect_answers, difficulty)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (question) DO NOTHING
     RETURNING id`,
    [
      question.question,
      question.correctAnswer,
      JSON.stringify(question.incorrectAnswers),
      question.difficulty,
    ],
  );
  return rows.length > 0;
}

export async function knowledgeQuestionCounts(): Promise<{ difficulty: string; count: number }[]> {
  return (await sql().query(
    `SELECT difficulty, COUNT(*)::int AS count
     FROM knowledge_questions GROUP BY difficulty`,
  )) as { difficulty: string; count: number }[];
}

export async function allKnowledgeQuestions(): Promise<
  { question: string; correct_answer: string; difficulty: string }[]
> {
  return (await sql().query(
    `SELECT question, correct_answer, difficulty FROM knowledge_questions
     ORDER BY difficulty, question`,
  )) as { question: string; correct_answer: string; difficulty: string }[];
}
