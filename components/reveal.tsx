"use client";

import { Avatar } from "@/components/avatar";
import { KNOWLEDGE_QUESTION_COUNT } from "@/lib/constants";
import type { Persona } from "@/lib/personas";

/**
 * The Reveal — the only thing that leaves the booth. There are no phones in this design, no
 * second screen and no share link: the student photographs this off the laptop. If it is
 * not worth photographing, MEI MEI has no reach beyond the table.
 *
 * The Name is prominent because that is the entire share mechanic — it turns the photo from
 * "someone got Loop Legend" into "*I* got Loop Legend".
 *
 * Descriptors print, Traits do not. Traits are machinery and mean nothing to a student
 * (ADR-0002).
 */
export function Reveal({
  name,
  persona,
  score,
  onDismiss,
}: {
  name: string;
  persona: Persona;
  score: number;
  onDismiss: () => void;
}) {
  return (
    <div
      className="reveal"
      style={
        {
          "--reveal-a": persona.palette.a,
          "--reveal-b": persona.palette.b,
          "--reveal-glow": persona.palette.blush,
        } as React.CSSProperties
      }
    >
      <div className="reveal-card">
        <h1 className="reveal-name">{name}</h1>
        <p className="reveal-eyebrow">you are</p>

        <div className="reveal-body">
          <div className="reveal-avatar">
            <Avatar persona={persona} />
          </div>

          <div className="reveal-main">
            <h2 className="reveal-persona">
              {persona.emoji} {persona.name}
            </h2>
            <p className="reveal-tagline">{persona.tagline}</p>
            <div className="descriptors">
              {persona.descriptors.map((descriptor) => (
                <span key={descriptor} className="descriptor">
                  {descriptor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/*
          Persona and Score are two separate facts, behind a rule and a label of their own.
          A student must never read their Persona as something they scored (ADR-0006).
        */}
        <div className="reveal-score">
          <span className="reveal-score-label">Knowledge Round</span>
          <span className="reveal-score-value">
            {score}/{KNOWLEDGE_QUESTION_COUNT}
          </span>
        </div>
        <p className="reveal-score-note">
          Your Score is the CS questions, not your Persona. Nobody is ranked on who they are.
        </p>

        <div className="reveal-foot">
          <p className="reveal-hint">📸 Take the photo — this page is not saved anywhere.</p>
          <button className="btn btn-primary" onClick={onDismiss}>
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
