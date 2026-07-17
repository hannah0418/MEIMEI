"use client";

import { useState } from "react";

import { Avatar } from "@/components/avatar";
import { PERSONAS } from "@/lib/personas";

type View = "home" | "how" | "personas";

export function Landing({ onStart, onBoards }: { onStart: () => void; onBoards: () => void }) {
  const [view, setView] = useState<View>("home");

  const go = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="landing">
      <nav className="topnav" aria-label="Main navigation">
        <div className="topnav-inner">
          <button className="brand" onClick={() => go("home")}>
            <span>♥</span> <b className="pixel">MEI MEI</b>
          </button>
          <div className="navlinks">
            <button className={view === "home" ? "active" : ""} onClick={() => go("home")}>
              Home
            </button>
            <button className={view === "how" ? "active" : ""} onClick={() => go("how")}>
              How to Play
            </button>
            <button
              className={view === "personas" ? "active" : ""}
              onClick={() => go("personas")}
            >
              Personas
            </button>
            <button onClick={onBoards}>Boards</button>
          </div>
          <button className="btn btn-primary nav-start" onClick={onStart}>
            Start Quiz
          </button>
        </div>
      </nav>

      {view === "home" && <Home onStart={onStart} onHow={() => go("how")} />}
      {view === "how" && <HowToPlay onStart={onStart} />}
      {view === "personas" && <Personas onStart={onStart} />}

      <footer className="landing-footer">
        <b className="pixel">♥ MEI MEI</b>
        <span>CODE. PLAY. EXPRESS. — College of Computer Studies</span>
      </footer>
    </div>
  );
}

function Home({ onStart, onHow }: { onStart: () => void; onHow: () => void }) {
  const coolDev = PERSONAS.find((persona) => persona.id === "cool-dev") ?? PERSONAS[0];
  return (
    <main className="shell home-hero">
      <div>
        <span className="home-heart">♥</span>
        <h1 className="home-title pixel">MEI MEI</h1>
        <p className="home-sub pixel">CODE. PLAY. EXPRESS.</p>
        <p className="home-tag">
          Discover your creative coding Persona, then prove your IT/CS knowledge on the Rank
          Board.
        </p>
        <div className="home-icons">
          <span>❓<small>Persona Round</small></span>
          <span>💻<small>Knowledge Round</small></span>
          <span>👤<small>Reveal a Persona</small></span>
          <span>🏆<small>Climb the Rank Board</small></span>
        </div>
        <div className="home-actions">
          <button className="btn btn-primary" onClick={onStart}>
            Start Quiz →
          </button>
          <button className="btn btn-ghost" onClick={onHow}>
            How to Play
          </button>
        </div>
        <p className="home-credit">Made by CCS students, for creative coders.</p>
      </div>
      <div className="hero-stage" aria-hidden="true">
        <span className="star one">✦</span>
        <span className="star two">✦</span>
        <span className="star three">✦</span>
        <div className="hero-avatar">
          <Avatar persona={coolDev} />
        </div>
      </div>
    </main>
  );
}

function HowToPlay({ onStart }: { onStart: () => void }) {
  const steps = [
    ["01", "✍️", "Enter the Name you want shown on the Rank Board."],
    ["02", "✨", "Answer 12 Persona Round questions. There are no wrong answers."],
    ["03", "💻", "Answer 12 timed IT/CS questions to earn your Score."],
    ["04", "🏆", "Photograph your Reveal and watch both boards update."],
  ] as const;

  return (
    <main className="shell info-page">
      <header className="page-head">
        <span className="eyebrow pixel">CCS × P-POP</span>
        <h1 className="page-title pixel">HOW TO PLAY</h1>
        <p>Two Rounds keep an honest Persona match separate from the scored competition.</p>
      </header>
      <div className="steps-grid">
        {steps.map(([number, icon, text]) => (
          <article className="panel step-card" key={number}>
            <b className="pixel">{number}</b>
            <span>{icon}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="page-action">
        <button className="btn btn-primary" onClick={onStart}>
          Start Quiz →
        </button>
      </div>
    </main>
  );
}

function Personas({ onStart }: { onStart: () => void }) {
  return (
    <main className="shell info-page">
      <header className="page-head">
        <span className="eyebrow pixel">MEET THE LINE-UP</span>
        <h1 className="page-title pixel">8 CREATIVE PERSONAS</h1>
        <p>Your answers reveal one identity. A Persona is a match, never a ranking.</p>
      </header>
      <div className="personas-grid">
        {PERSONAS.map((persona) => (
          <article
            className="panel persona-card"
            style={{ "--persona-a": persona.palette.a } as React.CSSProperties}
            key={persona.id}
          >
            <Avatar persona={persona} />
            <h2 className="pixel">{persona.name}</h2>
            <p>{persona.tagline}</p>
            <div>
              {persona.descriptors.map((descriptor) => (
                <span key={descriptor}>{descriptor}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="page-action">
        <button className="btn btn-primary" onClick={onStart}>
          Find Your Persona →
        </button>
      </div>
    </main>
  );
}
