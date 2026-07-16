"use server";

import { revalidatePath } from "next/cache";

import { KNOWLEDGE_QUESTION_COUNT, PERSONA_QUESTION_COUNT } from "@/lib/constants";
import {
  correctAnswersFor,
  deleteResponse,
  drawKnowledgeQuestions,
  writeResponse,
} from "@/lib/db";
import { gradeResponse } from "@/lib/grading";
import { PERSONA_QUESTIONS } from "@/lib/persona-questions";
import { TRAITS, type PersonaId, type Trait } from "@/lib/personas";

/** A Knowledge Round question as the student sees it: four options, none of them flagged. */
export type ServedQuestion = {
  id: number;
  question: string;
  options: string[];
  difficulty: string;
};

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draws this student's twelve Knowledge Round questions from the curated pool, so
 * consecutive students rarely see the same set and rerolling gains little (ADR-0007).
 *
 * The correct answer is not marked and not sent — the browser is told four options and
 * nothing else. Grading happens in submitResponse, against the pool.
 */
export async function startRun(): Promise<ServedQuestion[]> {
  return drawKnowledgeQuestions(KNOWLEDGE_QUESTION_COUNT).map((question) => ({
    id: question.id,
    question: question.question,
    options: shuffle([question.correctAnswer, ...question.incorrectAnswers]),
    difficulty: question.difficulty,
  }));
}

export type SubmitResult = {
  responseId: number;
  personaId: PersonaId;
  score: number;
};

/**
 * Writes one completed run and returns what the Reveal needs.
 *
 * Server Functions are reachable by direct POST, not just through the kiosk, so nothing
 * here trusts the caller: the Score is graded from the pool rather than accepted, and the
 * Traits are checked against the authored questions. There is no auth by design (ADR-0004)
 * — a forged Response is a row staff can delete (issue 13), not an exploit.
 */
export async function submitResponse(input: {
  name: string;
  personaAnswers: { trait: string }[];
  knowledgeAnswers: { questionId: number; given: string | null }[];
  elapsedMs: number;
}): Promise<SubmitResult> {
  const personaAnswers = input.personaAnswers
    .filter((answer): answer is { trait: Trait } =>
      (TRAITS as readonly string[]).includes(answer.trait),
    )
    .slice(0, PERSONA_QUESTION_COUNT);

  if (personaAnswers.length !== PERSONA_QUESTIONS.length) {
    throw new Error("A Response needs an answer to every Persona Round question");
  }

  const given = input.knowledgeAnswers.slice(0, KNOWLEDGE_QUESTION_COUNT);
  const correct = correctAnswersFor(given.map((answer) => answer.questionId));
  const knowledgeAnswers = given.flatMap((answer) => {
    const expected = correct.get(answer.questionId);
    // A question the pool has never heard of scores nothing rather than throwing: a
    // student mid-Reveal must not lose their run to a stale id.
    return expected === undefined ? [] : [{ given: answer.given, correct: expected }];
  });

  const { persona, score } = gradeResponse({ personaAnswers, knowledgeAnswers });

  const responseId = writeResponse({
    name: input.name,
    personaId: persona.id,
    score,
    elapsedMs: Math.max(0, Math.round(input.elapsedMs)),
    answers: {
      persona: personaAnswers.map((answer) => answer.trait),
      knowledge: given,
    },
  });

  revalidatePath("/");
  return { responseId, personaId: persona.id, score };
}

/** Booth staff removing a slur or an impersonated name. One tap, gone — speed is the feature. */
export async function removeResponse(id: number): Promise<void> {
  deleteResponse(id);
  revalidatePath("/");
}
