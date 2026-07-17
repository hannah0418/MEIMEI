/**
 * The twelve Persona Round questions — twelve questions, four options each, 48 slots,
 * every option tagged with exactly one Trait.
 *
 * DRAFT — needs the org to stand behind it before the fair (issue 03 is ready-for-human).
 * The questions have to sound like the College of Computer Studies, and an agent can only
 * draft that.
 *
 * Two authoring rules, enforced by lib/persona-questions.test.ts, not by review (ADR-0005):
 *   1. Each of the eleven Traits gets roughly 4-5 of the 48 option slots. Command, Grit
 *      and Play are owned by exactly one Persona each — starve one and Diva Scrum Master,
 *      Loop Legend or Code Cutie becomes unmatchable, with an empty bar as the only symptom.
 *   2. No question may hand a Persona its whole signature. ADR-0005 puts this as "the four
 *      options must pull toward four different Personas", and its example is a question
 *      offering Analysis / Rigor / Speed / Composure — which contains all of Binary Babe
 *      and all of Debug Master, so answering it is picking between those two rather than
 *      answering. No question below gives any Persona more than two of its three Traits.
 *
 * Nothing here is correct or incorrect. The moment an option is correct, students answer
 * what the room rewards instead of the truth (ADR-0006). Every option is meant to be
 * something a real student would own up to — the trap is four options that map neatly to
 * four Traits but read as obviously-virtuous versus obviously-silly.
 */

import type { Trait } from "./personas";

export type PersonaOption = {
  text: string;
  /** The one Trait this option scores by +1. No fractional weights (ADR-0005). */
  trait: Trait;
};

export type PersonaQuestion = {
  id: string;
  prompt: string;
  /** Four options, in a stable order — never shuffled (ADR-0005). */
  options: readonly [PersonaOption, PersonaOption, PersonaOption, PersonaOption];
};

/** Twelve questions x four options. */
export const TRAIT_SLOT_TOTAL = 48;

export const PERSONA_QUESTIONS: PersonaQuestion[] = [
  {
    id: "runtime-error",
    prompt: "Your code throws a runtime error five minutes before the demo.",
    options: [
      { text: "Read the stack trace properly. I want to know exactly which line lied to me.", trait: "Rigor" },
      { text: "Breathe. It's a bug. Panicking has never once fixed one.", trait: "Composure" },
      { text: "I already know what this is. Fix, rerun, move.", trait: "Speed" },
      { text: "Call the team over and split it — someone takes the data, someone takes the UI.", trait: "Command" },
    ],
  },
  {
    id: "blank-file",
    prompt: "New screen, blank file. What's the first thing you actually do?",
    options: [
      { text: "Work out what the screen has to do before I draw a single box.", trait: "Analysis" },
      { text: "Get the spacing and the type right. If it feels cheap, nothing else matters.", trait: "Craft" },
      { text: "Try that layout I've never seen anyone pull off.", trait: "Novelty" },
      { text: "Pick the colours that make me laugh, then build around the vibe.", trait: "Play" },
    ],
  },
  {
    id: "project-behind",
    prompt: "Your group project is three days behind and the chat has gone quiet.",
    options: [
      { text: "I hand out the parts out loud and set a deadline nobody can pretend they missed.", trait: "Command" },
      { text: "I start grinding through my section. It gets done because I'll do it.", trait: "Grit" },
      { text: "I don't spiral. Three days is fixable — re-plan, keep working.", trait: "Composure" },
      { text: "I get the energy back first. Dead chat, dead project.", trait: "Play" },
    ],
  },
  {
    id: "inherited-code",
    prompt: "Someone hands you 400 lines of undocumented code. It works.",
    options: [
      { text: "Line by line. 'Works' and 'correct' are not the same word.", trait: "Rigor" },
      { text: "Trace the data through it until the shape of the thing clicks.", trait: "Analysis" },
      { text: "Write the comments it should have had, so the next person isn't stuck like me.", trait: "Voice" },
      { text: "Say it out loud: this should be rewritten. And say who should do it.", trait: "Nerve" },
    ],
  },
  {
    id: "hackathon-role",
    prompt: "Hackathon night. Pick your seat at the table.",
    options: [
      { text: "The one making it look like a product instead of a project.", trait: "Craft" },
      { text: "The one making calls fast so we're not still debating at 3am.", trait: "Speed" },
      { text: "The one on the mic at the pitch, selling what we built.", trait: "Voice" },
      { text: "The one running the board, keeping four people pointed the same way.", trait: "Command" },
    ],
  },
  {
    id: "eleventh-attempt",
    prompt: "Same bug. Eleventh attempt. Nothing has worked.",
    options: [
      { text: "Twelfth attempt.", trait: "Grit" },
      { text: "Step away, come back level. The bug isn't personal.", trait: "Composure" },
      { text: "Bin the whole approach and come at it from somewhere else entirely.", trait: "Novelty" },
      { text: "Pull someone in and run it as a two-person hunt.", trait: "Command" },
    ],
  },
  {
    id: "eleven-pm",
    prompt: "It's 11pm and the work is actually done. What are you doing?",
    options: [
      { text: "Playlist on, messing with something silly that has no deadline.", trait: "Play" },
      { text: "Redesigning something that already works, because it could look better.", trait: "Craft" },
      { text: "Reading about a framework I have no reason to learn yet.", trait: "Novelty" },
      { text: "Nothing. I closed the laptop at nine — I finished early.", trait: "Speed" },
    ],
  },
  {
    id: "group-chat",
    prompt: "In the org group chat, you're the one who…",
    options: [
      { text: "keeps it alive. Memes, hype, chaos.", trait: "Play" },
      { text: "says the thing everyone is thinking and nobody is typing.", trait: "Nerve" },
      { text: "explains it properly when the whole chat is confused.", trait: "Voice" },
      { text: "stays level when it turns into a 200-message argument.", trait: "Composure" },
    ],
  },
  {
    id: "tests-green",
    prompt: "After six hours, the tests finally go green.",
    options: [
      { text: "Happy dance. At my desk. Loudly.", trait: "Play" },
      { text: "Quiet nod. That one owed me.", trait: "Grit" },
      { text: "Write the test that would have caught it in ten minutes.", trait: "Rigor" },
      { text: "Sit there working out why it works now. I'm not shipping a mystery.", trait: "Analysis" },
    ],
  },
  {
    id: "new-tool",
    prompt: "New language, new tool. Your first hour with it.",
    options: [
      { text: "Build the smallest good-looking thing, so I can feel how it handles.", trait: "Craft" },
      { text: "Read how it actually works underneath before I touch it.", trait: "Analysis" },
      { text: "Push it into something real immediately and find out the hard way.", trait: "Nerve" },
      { text: "Go straight for the weird feature nobody uses.", trait: "Novelty" },
    ],
  },
  {
    id: "come-to-you-for",
    prompt: "What do people in the org actually come to you for?",
    options: [
      { text: "Making their thing look like it belongs on a stage.", trait: "Craft" },
      { text: "Turning a mess of people into an actual plan.", trait: "Command" },
      { text: "Being the one still on it at 2am when everyone else has gone.", trait: "Grit" },
      { text: "Saying the unpopular thing in the meeting.", trait: "Nerve" },
    ],
  },
  {
    id: "deadline-ninety",
    prompt: "Deadline in an hour. It's 90% done.",
    options: [
      { text: "The last 10% is where the bugs live. I'm checking it.", trait: "Rigor" },
      { text: "I don't hand in unfinished work. I'll use every minute of that hour.", trait: "Grit" },
      { text: "Ship the 90%. Done beats perfect.", trait: "Speed" },
      { text: "Write the readme, so what it does is obvious even where it's rough.", trait: "Voice" },
    ],
  },
];
