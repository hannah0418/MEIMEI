import { describe, expect, it } from "vitest";

import {
  gradeResponse,
  matchPersona,
  rankResponses,
  scoreKnowledge,
  type KnowledgeAnswer,
  type PersonaAnswer,
} from "./grading";
import { PERSONAS, type Trait } from "./personas";

const answers = (...traits: Trait[]): PersonaAnswer[] =>
  traits.map((trait) => ({ trait }));

/** Twelve answers weighted toward one Persona's signature, the way a real run arrives. */
const answersFor = (traits: readonly Trait[], count = 12): PersonaAnswer[] =>
  Array.from({ length: count }, (_, i) => ({ trait: traits[i % traits.length] }));

describe("matchPersona", () => {
  it("matches the Persona whose Traits the answers actually scored", () => {
    // Command, Nerve, Voice — Diva Scrum Master's signature, and nobody else's.
    expect(matchPersona(answersFor(["Command", "Nerve", "Voice"])).id).toBe(
      "diva-scrum-master",
    );
    expect(matchPersona(answersFor(["Play", "Voice", "Novelty"])).id).toBe(
      "code-cutie",
    );
    expect(matchPersona(answersFor(["Grit", "Composure", "Rigor"])).id).toBe(
      "loop-legend",
    );
  });

  it("separates Binary Babe from Debug Master on Speed against Composure alone", () => {
    // The two share Analysis and Rigor; the tempo axis is the whole difference.
    const shared: Trait[] = ["Analysis", "Analysis", "Rigor", "Rigor"];
    expect(matchPersona(answers(...shared, "Speed", "Speed")).id).toBe(
      "binary-babe",
    );
    expect(matchPersona(answers(...shared, "Composure", "Composure")).id).toBe(
      "debug-master",
    );
  });

  it("gives no Persona an advantage from signature size", () => {
    // A Persona's score is a plain sum of its three Trait scores, so an unequal
    // signature would collect points by arithmetic rather than by the answers.
    for (const persona of PERSONAS) {
      expect(persona.traits).toHaveLength(3);
    }
  });

  it("resolves a tie to the rarer Persona", () => {
    // One point to each of Diva Scrum Master's Traits and each of Spark UI Designer's:
    // both sum to 3. Diva (rarity 7) is rarer than Spark (rarity 9).
    const tied = answers(
      "Command",
      "Nerve",
      "Voice",
      "Craft",
      "Rigor",
      "Novelty",
    );
    expect(matchPersona(tied).id).toBe("diva-scrum-master");
  });

  it("resolves a tie down the documented rarity order when priorities are equal", () => {
    // Binary Babe and Debug Master both sum to 3 and both sit at rarity 8.
    // Binary Babe comes first in the documented order.
    const tied = answers("Analysis", "Rigor", "Speed", "Composure");
    const winner = matchPersona(tied);
    expect(winner.id).toBe("binary-babe");
    expect(winner.rarityPriority).toBe(8);
  });

  it("keeps PERSONAS in the documented rarity order", () => {
    // Diva Scrum Master, Loop Legend and Code Cutie all sit at rarity 7, so nothing but
    // this order separates them when they tie. Reordering the array silently rewrites the
    // tie-break that ADR-0005 fixed — which is exactly the kind of change that looks fine
    // and skews the board all day.
    expect(PERSONAS.map((p) => p.id)).toEqual([
      "diva-scrum-master",
      "loop-legend",
      "code-cutie",
      "binary-babe",
      "debug-master",
      "syntax-superstar",
      "cool-dev",
      "spark-ui-designer",
    ]);
    expect(PERSONAS.map((p) => p.rarityPriority)).toEqual([7, 7, 7, 8, 8, 8, 8, 9]);
  });

  it("returns the same Persona for the same answers, every time", () => {
    // Students take this together and compare. Identical answers producing different
    // Personas reads as a broken app, publicly, and makes bugs unreproducible.
    const given = answersFor(["Command", "Nerve", "Voice", "Craft"]);
    const first = matchPersona(given);
    for (let i = 0; i < 50; i++) {
      expect(matchPersona(given).id).toBe(first.id);
    }
  });

  it("does not depend on the order the answers arrive in", () => {
    const given = answers("Play", "Voice", "Novelty", "Rigor", "Speed", "Craft");
    const reversed = [...given].reverse();
    expect(matchPersona(reversed).id).toBe(matchPersona(given).id);
  });
});

describe("scoreKnowledge", () => {
  const answered = (given: string | null): KnowledgeAnswer => ({
    given,
    correct: "yes",
  });

  it("counts correct answers", () => {
    expect(
      scoreKnowledge([answered("yes"), answered("yes"), answered("no")]),
    ).toBe(2);
  });

  it("counts a timeout as wrong", () => {
    // A timeout arrives as no answer given at all.
    expect(scoreKnowledge([answered("yes"), answered(null), answered(null)])).toBe(
      1,
    );
  });

  it("scores an untouched Round as zero", () => {
    expect(scoreKnowledge([])).toBe(0);
  });
});

describe("gradeResponse", () => {
  it("keeps the two Rounds apart", () => {
    // The Persona Round never contributes to Score; the Knowledge Round never
    // contributes to the Persona (ADR-0006).
    const personaAnswers = answersFor(["Command", "Nerve", "Voice"]);
    const allWrong: KnowledgeAnswer[] = Array.from({ length: 12 }, () => ({
      given: null,
      correct: "a",
    }));
    const allRight: KnowledgeAnswer[] = Array.from({ length: 12 }, () => ({
      given: "a",
      correct: "a",
    }));

    const failed = gradeResponse({ personaAnswers, knowledgeAnswers: allWrong });
    const aced = gradeResponse({ personaAnswers, knowledgeAnswers: allRight });

    expect(failed.persona.id).toBe(aced.persona.id);
    expect(failed.score).toBe(0);
    expect(aced.score).toBe(12);
  });
});

describe("rankResponses", () => {
  it("orders by Score descending, then elapsed ascending", () => {
    // This assert exists specifically because `elapsed desc` ships looking fine.
    const ranked = rankResponses([
      { name: "slow-and-right", score: 9, elapsedMs: 90_000 },
      { name: "quick-and-wrong", score: 2, elapsedMs: 1_000 },
      { name: "quick-and-right", score: 9, elapsedMs: 30_000 },
    ]);

    expect(ranked.map((r) => r.name)).toEqual([
      "quick-and-right",
      "slow-and-right",
      "quick-and-wrong",
    ]);
  });

  it("rewards speed only among students who know the material", () => {
    // Mashing a question with a right answer gets you zero, so a fast low Score
    // never outranks a slow high one.
    const ranked = rankResponses([
      { name: "masher", score: 0, elapsedMs: 500 },
      { name: "thinker", score: 1, elapsedMs: 300_000 },
    ]);
    expect(ranked[0].name).toBe("thinker");
  });

  it("does not mutate the Responses it was given", () => {
    const responses = [
      { score: 1, elapsedMs: 10 },
      { score: 5, elapsedMs: 10 },
    ];
    rankResponses(responses);
    expect(responses[0].score).toBe(1);
  });
});
