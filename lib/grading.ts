/**
 * The one module that decides everything: which Persona a student is matched to, what
 * their Score is, and how the Rank Board is ordered.
 *
 * Pure by design — no React, no database, no clock, no randomness. Everything ADR-0005
 * decided lives here, so the rule that decides everything can be tested on its own.
 */

import { PERSONAS, type Persona, type Trait } from "./personas";

/** One Persona Round answer. Every option scores exactly one Trait by +1 — no fractional weights. */
export type PersonaAnswer = { trait: Trait };

/** One Knowledge Round answer. A timeout arrives as `given: null` and counts as wrong. */
export type KnowledgeAnswer = { given: string | null; correct: string };

export type Grade = { persona: Persona; score: number };

export type RankableResponse = { score: number; elapsedMs: number };

/**
 * Sums the Traits the answers scored and returns the Persona sitting highest on them.
 *
 * Ties resolve to the rarer Persona, never at random: students compare answers at the
 * booth, and identical answers producing different Personas reads as broken, publicly.
 * Equal rarity resolves down the documented order in PERSONAS.
 */
export function matchPersona(answers: readonly PersonaAnswer[]): Persona {
  const traitScores = new Map<Trait, number>();
  for (const { trait } of answers) {
    traitScores.set(trait, (traitScores.get(trait) ?? 0) + 1);
  }

  const scoreOf = (persona: Persona) =>
    persona.traits.reduce((sum, trait) => sum + (traitScores.get(trait) ?? 0), 0);

  let best = PERSONAS[0];
  let bestScore = scoreOf(best);

  for (const persona of PERSONAS.slice(1)) {
    const score = scoreOf(persona);
    if (score > bestScore) {
      best = persona;
      bestScore = score;
    } else if (score === bestScore && persona.rarityPriority < best.rarityPriority) {
      best = persona;
    }
  }

  return best;
}

/** Counts the Knowledge Round answers that were right. A timeout counts as wrong. */
export function scoreKnowledge(answers: readonly KnowledgeAnswer[]): number {
  return answers.filter(({ given, correct }) => given !== null && given === correct)
    .length;
}

/**
 * Grades one completed run. The Persona Round never contributes to Score and the
 * Knowledge Round never contributes to the Persona (ADR-0006).
 */
export function gradeResponse({
  personaAnswers,
  knowledgeAnswers,
}: {
  personaAnswers: readonly PersonaAnswer[];
  knowledgeAnswers: readonly KnowledgeAnswer[];
}): Grade {
  return {
    persona: matchPersona(personaAnswers),
    score: scoreKnowledge(knowledgeAnswers),
  };
}

/**
 * Orders Responses for the Rank Board: Score descending, then elapsed ascending.
 *
 * Timing is legitimate here and only here — mashing a question with a right answer gets
 * you zero, so speed only helps students who know the material.
 */
export function rankResponses<T extends RankableResponse>(
  responses: readonly T[],
): T[] {
  return [...responses].sort(
    (a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs,
  );
}
