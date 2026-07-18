"use client";

import { useEffect, useRef, useState } from "react";

import type { ServedQuestion } from "@/app/actions";
import { KNOWLEDGE_SECONDS } from "@/lib/constants";

const LETTERS = ["A", "B", "C", "D"];

export type GivenAnswer = { questionId: number; given: string | null };

/**
 * The Knowledge Round: real IT/CS questions that have real answers. The only Round that can
 * be won, and it is signposted as a different thing so no student thinks their Persona was
 * scored.
 *
 * Thirty seconds per question with the timer visible. A timeout counts as wrong and
 * auto-advances — a stuck student must not stall the queue. The timer is legitimate here
 * and only here: mashing a question with a right answer gets you zero, so speed only helps
 * students who actually know the material.
 */
export function KnowledgeRound({
  questions,
  onDone,
}: {
  questions: ServedQuestion[];
  onDone: (answers: GivenAnswer[], elapsedMs: number) => void;
}) {
  const [index, setIndex] = useState(0);
  // Tagged with the question it belongs to, so a new question reads as a full clock during
  // render rather than needing the effect to reset it.
  const [tick, setTick] = useState({ index: 0, remaining: KNOWLEDGE_SECONDS });
  const answers = useRef<GivenAnswer[]>([]);
  // Elapsed runs across the whole Round, so time burnt on a timed-out question still counts.
  const startedAt = useRef<number | null>(null);

  const question = questions[index];
  const remaining = tick.index === index ? tick.remaining : KNOWLEDGE_SECONDS;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const answer = (given: string | null) => {
    if (answers.current.length > index) return;
    answers.current = [...answers.current, { questionId: question.id, given }];

    if (answers.current.length === questions.length) {
      onDone(answers.current, Date.now() - (startedAt.current ?? Date.now()));
      return;
    }
    setIndex((current) => current + 1);
  };

  // The interval must survive re-renders without restarting the countdown, so it reads the
  // latest answer handler through a ref rather than depending on it.
  const timeout = useRef<() => void>(() => {});
  useEffect(() => {
    timeout.current = () => answer(null);
  });

  useEffect(() => {
    const deadline = Date.now() + KNOWLEDGE_SECONDS * 1000;

    const ticker = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTick({ index, remaining: left });
      if (left === 0) {
        clearInterval(ticker);
        timeout.current();
      }
    }, 200);

    return () => clearInterval(ticker);
  }, [index]);

  const low = remaining <= 5;

  return (
    <div className="round round-knowledge">
      <div className="round-top">
        <span className="round-label">KNOWLEDGE ROUND</span>
        <div className="timer">
          <span className="timer-track">
            <span
              className={`timer-fill${low ? " low" : ""}`}
              style={{ width: `${(remaining / KNOWLEDGE_SECONDS) * 100}%` }}
            />
          </span>
          <span className={`timer-count${low ? " low" : ""}`} aria-live="off">
            {remaining}s
          </span>
        </div>
        <span className="round-counter">
          {index + 1} of {questions.length}
        </span>
      </div>

      <div className="progress-track">
        {questions.map((q, i) => (
          <span key={q.id} className={`progress-seg${i < index ? " done" : ""}`} />
        ))}
      </div>

      <div className="knowledge-banner">
        THIS ONE YOU CAN WIN
        <span>
          Real answers, real Score, thirty seconds each. This is the part that ranks — your
          Persona has nothing to do with it.
        </span>
      </div>

      <p className="q-text">{question.question}</p>

      {question.options.map((option, i) => (
        <button key={option} className="opt" onClick={() => answer(option)}>
          <span className="opt-letter">{LETTERS[i]}</span>
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}
