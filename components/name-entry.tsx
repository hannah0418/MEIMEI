"use client";

import { useEffect, useRef, useState } from "react";

import { NAME_MAX_LENGTH } from "@/lib/constants";

/**
 * One field, one button. Nothing else stands between the student and the quiz — no account,
 * no sign-in, no email (ADR-0004).
 *
 * The Name is length-capped because it lands on a public Rank Board, and a wall of text
 * pushes the board around. The cap is enforced again at write in lib/db.ts.
 */
export function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trimmed = name.trim();
  const submit = () => {
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="center-wrap">
      <div className="panel name-card">
        <h1 className="name-title">WHAT DO WE CALL YOU?</h1>
        <p className="name-sub">Goes on your Reveal and on the board. That&rsquo;s it.</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <input
            ref={inputRef}
            className="name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={NAME_MAX_LENGTH}
            placeholder="Your name"
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="go"
            aria-label="Your name"
          />
          <p className="name-count">
            {name.length}/{NAME_MAX_LENGTH}
          </p>
          <button className="btn btn-primary" type="submit" disabled={!trimmed}>
            LET&rsquo;S GO
          </button>
        </form>
      </div>
    </div>
  );
}
