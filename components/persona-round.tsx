"use client";

import { useState } from "react";

import { PERSONA_QUESTIONS } from "@/lib/persona-questions";
import type { Trait } from "@/lib/personas";

const LETTERS = ["A", "B", "C", "D"];

/**
 * The Persona Round: twelve questions about how the student works, one at a time.
 *
 * Untimed, on purpose. Timing here would corrupt the honest answer we match on (ADR-0006).
 * Nothing in this Round mentions Score, points, correct, or the Knowledge Round — and no
 * option is styled or ordered to look preferable, because the moment one looks like the
 * right answer the Round is broken.
 */
export function PersonaRound({
  onDone,
}: {
  onDone: (answers: { trait: Trait }[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ trait: Trait }[]>([]);

  const question = PERSONA_QUESTIONS[index];

  const pick = (trait: Trait) => {
    const next = [...answers, { trait }];
    setAnswers(next);

    if (next.length === PERSONA_QUESTIONS.length) {
      onDone(next);
      return;
    }
    setIndex(index + 1);
  };

  return (
    <div className="round round-persona">
      <div className="round-top">
        <span className="round-label">PERSONA ROUND</span>
        <span className="round-counter">
          {index + 1} of {PERSONA_QUESTIONS.length}
        </span>
      </div>

      <div className="progress-track">
        {PERSONA_QUESTIONS.map((q, i) => (
          <span key={q.id} className={`progress-seg${i < index ? " done" : ""}`} />
        ))}
      </div>

      <div className="no-wrong">
        NO WRONG ANSWERS HERE
        <span>Nothing here is scored. Just pick the one that&rsquo;s actually you.</span>
      </div>

      <p className="q-text">{question.prompt}</p>

      {/* Options keep their authored order — never shuffled (ADR-0005). */}
      {question.options.map((option, i) => (
        <button
          key={option.text}
          className="opt"
          onClick={() => pick(option.trait)}
        >
          <span className="opt-letter">{LETTERS[i]}</span>
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}
