"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { clearBoards, removeResponse, unlockStaff } from "@/app/actions";
import type { FactionBoardRow, RankBoardRow } from "@/lib/db";
import type { PersonaId } from "@/lib/personas";

export type BoardsData = {
  faction: FactionBoardRow[];
  rank: RankBoardRow[];
};

/** How long staff hold the title before the delete affordance appears. */
const STAFF_HOLD_MS = 2_000;

/**
 * The app's resting state and the thing that pulls students to the booth (ADR-0008). Not a
 * landing page with a start button — a screen showing live Team standings is what makes a
 * student walk over.
 *
 * The two boards share the one screen and must read as visibly separate things: the
 * Faction Board ranks Personas, the Rank Board ranks students, and a student who blurs the
 * two reads their Persona as a verdict on how good a programmer they are (ADR-0003/0006).
 */
export function Boards({
  data,
  highlightId,
  highlightPersonaId,
  onHome,
  onStart,
}: {
  data: BoardsData;
  /** The Response that just finished, if it placed in the top ten. */
  highlightId?: number;
  /**
   * The Team that Response joined — tracked separately from highlightId on purpose. Most
   * students never reach the Rank Board, and every one of them should still watch their own
   * Team's bar grow: that is the payoff for answering honestly.
   */
  highlightPersonaId?: PersonaId;
  onHome: () => void;
  onStart: () => void;
}) {
  const router = useRouter();
  const [staffPassword, setStaffPassword] = useState<string>();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const staffMode = staffPassword !== undefined;

  const openStaffMode = async () => {
    const password = window.prompt("Staff password");
    if (password === null) return;
    if (await unlockStaff(password)) setStaffPassword(password);
    else window.alert("Incorrect staff password.");
  };

  const startHold = () => {
    holdTimer.current = setTimeout(() => void openStaffMode(), STAFF_HOLD_MS);
  };
  const cancelHold = () => clearTimeout(holdTimer.current);

  useEffect(() => cancelHold, []);

  const busiest = Math.max(1, ...data.faction.map((row) => row.count));
  const totalResponses = data.faction.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="boards shell">
      <div className="boards-head">
        <h1
          className="boards-brand"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
        >
          MEI MEI
        </h1>
        <p className="boards-sub">
          Which one are you? · College of Computer Studies
        </p>
      </div>

      {staffMode && (
        <div className="staff-bar">
          <span>Staff mode — tap ✕ to remove a Response. One tap, gone.</span>
          <div className="staff-actions">
            <button
              className="btn staff-clear"
              onClick={async () => {
                if (!window.confirm("Permanently delete every Response and clear both boards?"))
                  return;
                await clearBoards(staffPassword);
                router.refresh();
              }}
            >
              Clear Boards
            </button>
            <button className="btn btn-ghost" onClick={() => setStaffPassword(undefined)}>
              Done
            </button>
          </div>
        </div>
      )}

      <div className="boards-grid">
        <section className="board board-faction">
          <h2 className="board-title">THE FACTION BOARD</h2>
          <p className="board-note">
            How many of us are each Persona. This ranks Personas, never students — a match
            is not an achievement. Rare ✦ is a flex.
          </p>

          {data.faction.map((row) => (
            <div
              key={row.persona.id}
              className={[
                "team-row",
                row.persona.rarityPriority === 7 ? "rare" : "",
                highlightPersonaId === row.persona.id ? "grown" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="team-emoji">{row.persona.emoji}</span>
              <span className="team-name">{row.persona.name}</span>
              <span className="team-track">
                <span
                  className="team-fill"
                  style={{
                    width: `${(row.count / busiest) * 100}%`,
                    background: `linear-gradient(90deg, ${row.persona.palette.a}, ${row.persona.palette.b})`,
                  }}
                />
              </span>
              <span className="team-count">{row.count}</span>
            </div>
          ))}
        </section>

        <section className="board board-rank">
          <h2 className="board-title">THE RANK BOARD</h2>
          <p className="board-note">
            Top ten on the Knowledge Round. Ranked on CS answers alone — never on your
            Persona.
          </p>

          {data.rank.length === 0 && (
            <p className="rank-empty">Nobody yet. The first name here is going to be easy.</p>
          )}

          {data.rank.map((row, index) => (
            <div
              key={row.id}
              className={[
                "rank-row",
                index < 3 ? "top" : "",
                row.id === highlightId ? "you" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="rank-place">{index + 1}</span>
              <span className="rank-name">
                {row.name}
                <span className="sub">
                  {row.persona.emoji} {row.persona.name}
                </span>
              </span>
              <span className="rank-score">{row.score}/12</span>
              {staffMode && (
                <button
                  className="staff-del"
                  aria-label={`Remove ${row.name}`}
                  onClick={async () => {
                    await removeResponse(row.id, staffPassword);
                    router.refresh();
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </section>
      </div>

      <div className="boards-foot">
        <div className="boards-actions">
          <button className="btn btn-ghost" onClick={onHome}>
            Home
          </button>
          <button className="btn btn-primary start-btn" onClick={onStart}>
            START
          </button>
        </div>
        <p className="credit">
          {totalResponses} played today · Questions from Open Trivia DB (CC BY-SA 4.0)
        </p>
      </div>
    </div>
  );
}
