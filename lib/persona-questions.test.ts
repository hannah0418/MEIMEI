/**
 * Seam 2 — invariants over the authored Persona Round data.
 *
 * Both failures caught here are silent. An unmatchable Persona looks completely normal
 * until the fair is over and one bar on the Faction Board is empty all day. Failure
 * messages name the Trait and the Persona it erases, because whoever hits this is
 * mid-authoring and needs to know what they broke.
 */

import { describe, expect, it } from "vitest";

import { matchPersona, type PersonaAnswer } from "./grading";
import { PERSONA_QUESTIONS, TRAIT_SLOT_TOTAL } from "./persona-questions";
import { PERSONAS, TRAITS, personasFedBy, type Persona, type Trait } from "./personas";

const allOptions = PERSONA_QUESTIONS.flatMap((q) => q.options);

const slotsFor = (trait: Trait) =>
  allOptions.filter((option) => option.trait === trait).length;

/** Which Personas vanish if this Trait is starved — the point of the coverage rule. */
const erases = (trait: Trait) =>
  personasFedBy(trait)
    .map((p) => p.name)
    .join(", ");

describe("the authored Persona Round", () => {
  it("asks twelve questions", () => {
    expect(PERSONA_QUESTIONS).toHaveLength(12);
  });

  it("offers four options on every question", () => {
    for (const question of PERSONA_QUESTIONS) {
      expect(question.options, `"${question.prompt}" must offer four options`).toHaveLength(4);
    }
  });

  it("offers 48 option slots in total", () => {
    expect(allOptions).toHaveLength(TRAIT_SLOT_TOTAL);
  });

  it("tags every option with exactly one Trait", () => {
    for (const option of allOptions) {
      expect(TRAITS, `"${option.text}" is tagged with an unknown Trait`).toContain(
        option.trait,
      );
    }
  });

  it("gives no option a correct answer", () => {
    // The moment an option is correct, students answer what the room rewards instead
    // of the truth, and Code Cutie stops existing (ADR-0006).
    for (const option of allOptions) {
      expect(option).not.toHaveProperty("correct");
    }
  });
});

describe("Trait coverage", () => {
  it.each(TRAITS)("gives %s roughly 4-5 of the 48 option slots", (trait) => {
    const slots = slotsFor(trait);
    expect(
      slots,
      `${trait} holds ${slots} of 48 option slots, outside the 4-5 the authoring rule allows. ` +
        `Starving ${trait} makes this unmatchable, all day, with an empty bar as the only symptom: ${erases(trait)}.`,
    ).toBeGreaterThanOrEqual(4);
    expect(
      slots,
      `${trait} holds ${slots} of 48 option slots, outside the 4-5 the authoring rule allows. ` +
        `Over-feeding ${trait} skews the board toward: ${erases(trait)}.`,
    ).toBeLessThanOrEqual(5);
  });

  it("keeps Command, Grit and Play fed — each is owned by exactly one Persona", () => {
    for (const trait of ["Command", "Grit", "Play"] as const) {
      const owners = personasFedBy(trait);
      expect(owners, `${trait} must be owned by exactly one Persona`).toHaveLength(1);
      expect(
        slotsFor(trait),
        `${trait} is starved, which erases ${owners[0].name} outright.`,
      ).toBeGreaterThanOrEqual(4);
    }
  });
});

/**
 * The Personas a question hands its whole signature to.
 *
 * ADR-0005 puts the rule as "within a single question, the four options must pull toward
 * four different Personas", and its example is a question offering
 * Analysis / Rigor / Speed / Composure — which is just asking "Binary Babe or Debug
 * Master?", because those four options contain both of those Personas entirely.
 *
 * Note the threshold is three, not four: a signature is only three Traits long, so "four
 * options belonging to the same Persona" can never happen and testing for it asserts
 * nothing. A question that offers a Persona's whole signature is already asking the student
 * to pick that Persona rather than answer.
 */
function personasOfferedWhole(traits: readonly Trait[]) {
  return PERSONAS.filter((persona) =>
    persona.traits.every((trait) => traits.includes(trait)),
  );
}

describe("the same-Persona rule", () => {
  it("catches the question ADR-0005 says must never ship", () => {
    // Guards the rule itself. The obvious reading of "four options belonging to the same
    // Persona" is unfalsifiable against a three-Trait signature, and a rule that cannot
    // fail is the same as no rule.
    const offenders = personasOfferedWhole([
      "Analysis",
      "Rigor",
      "Speed",
      "Composure",
    ]).map((p) => p.name);

    expect(offenders).toContain("Binary Babe");
    expect(offenders).toContain("Debug Master");
  });

  it("never offers a Persona's whole signature in one question", () => {
    for (const question of PERSONA_QUESTIONS) {
      const traits = question.options.map((o) => o.trait);
      const offered = personasOfferedWhole(traits);

      expect(
        offered.map((p) => p.name),
        `"${question.prompt}" offers every Trait of ${offered.map((p) => p.name).join(" and ")} ` +
          `in one question, so answering it is picking a Persona rather than answering. ` +
          `Swap an option for a Trait outside that signature.`,
      ).toEqual([]);
    }
  });
});

/**
 * Builds an answer set for one Persona the way a student who genuinely is that Persona
 * would answer: take your own Traits where offered, and where they are not, give the
 * point away as cheaply as possible. Constructive, because 4^12 is far too many to
 * enumerate.
 */
function answersReaching(persona: Persona): PersonaAnswer[] {
  const scores = new Map<Trait, number>();
  const scoreOf = (p: Persona) =>
    p.traits.reduce((sum, trait) => sum + (scores.get(trait) ?? 0), 0);
  const rivalMax = () =>
    Math.max(
      ...PERSONAS.filter((p) => p.id !== persona.id).map((p) => scoreOf(p)),
    );

  const picks: Trait[] = [];
  const take = (trait: Trait) => {
    scores.set(trait, (scores.get(trait) ?? 0) + 1);
    picks.push(trait);
  };

  const own: typeof PERSONA_QUESTIONS = [];
  const foreign: typeof PERSONA_QUESTIONS = [];
  for (const question of PERSONA_QUESTIONS) {
    const hasOwn = question.options.some((o) => persona.traits.includes(o.trait));
    (hasOwn ? own : foreign).push(question);
  }

  // Take every point that is genuinely yours first.
  for (const question of own) {
    const mine = question.options.filter((o) => persona.traits.includes(o.trait));
    const cheapest = mine.reduce((best, o) =>
      personasFedBy(o.trait).length < personasFedBy(best.trait).length ? o : best,
    );
    take(cheapest.trait);
  }

  // Where none of your Traits are offered you still have to answer. Give the point
  // to whichever option leaves the strongest rival weakest.
  for (const question of foreign) {
    let best = question.options[0];
    let bestRival = Infinity;
    for (const option of question.options) {
      scores.set(option.trait, (scores.get(option.trait) ?? 0) + 1);
      const rival = rivalMax();
      scores.set(option.trait, (scores.get(option.trait) ?? 0) - 1);
      if (rival < bestRival) {
        bestRival = rival;
        best = option;
      }
    }
    take(best.trait);
  }

  return picks.map((trait) => ({ trait }));
}

describe("every Persona is reachable", () => {
  it.each(PERSONAS.map((p) => [p.name, p] as const))(
    "%s can be matched by some set of answers",
    (name, persona) => {
      const given = answersReaching(persona);
      expect(given, `${name} must be answerable across all twelve questions`).toHaveLength(
        12,
      );

      const matched = matchPersona(given);
      expect(
        matched.name,
        `No set of answers reaches ${name}. It is unmatchable, and the only symptom at ` +
          `the fair is an empty bar on the Faction Board. Its signature is ` +
          `${persona.traits.join(", ")} — check those Traits have question slots. ` +
          `Answers built for ${name} matched ${matched.name} instead.`,
      ).toBe(name);
    },
  );
});
