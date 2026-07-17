/**
 * Persona and Trait domain data. Inert — no scoring logic lives here (see lib/grading.ts).
 *
 * CONTEXT.md is authoritative for names, signatures and Descriptors.
 */

export const TRAITS = [
  "Rigor",
  "Analysis",
  "Craft",
  "Novelty",
  "Command",
  "Grit",
  "Composure",
  "Speed",
  "Play",
  "Voice",
  "Nerve",
] as const;

export type Trait = (typeof TRAITS)[number];

export type PersonaId =
  | "diva-scrum-master"
  | "loop-legend"
  | "code-cutie"
  | "binary-babe"
  | "debug-master"
  | "syntax-superstar"
  | "cool-dev"
  | "spark-ui-designer";

/** Per-Persona colour treatment. The Reveal is photographed off a screen, so these carry it. */
export type Palette = {
  hood: string;
  body: string;
  bodyDark: string;
  blush: string;
  a: string;
  b: string;
};

export type Persona = {
  id: PersonaId;
  /** The stage name, exactly as CONTEXT.md spells it. */
  name: string;
  tagline: string;
  /**
   * Exactly three Traits — the tuple type is what enforces it. Equal signature size is
   * load-bearing (ADR-0005): a Persona's score is the plain sum of its three Trait scores,
   * so a larger signature would collect more points regardless of the answers.
   */
  traits: readonly [Trait, Trait, Trait];
  /** Printed on the Reveal. Descriptors print, Traits score — never conflate them (ADR-0002). */
  descriptors: readonly [string, string, string];
  /**
   * How many Personas each of this Persona's Traits feeds, summed (ADR-0005).
   * Lower is rarer and wins ties. Equal priorities are broken by position in PERSONAS.
   */
  rarityPriority: number;
  emoji: string;
  palette: Palette;
};

/**
 * Ordered by the ADR-0005 rarity order — rarest first. Ties on rarityPriority resolve
 * down this order, so the order itself is load-bearing. Do not sort this array.
 */
export const PERSONAS: readonly Persona[] = [
  {
    id: "diva-scrum-master",
    name: "Diva Scrum Master",
    tagline: "You lead the chaos into a masterpiece.",
    traits: ["Command", "Nerve", "Voice"],
    descriptors: ["Organized", "Charismatic", "Decisive"],
    rarityPriority: 7,
    emoji: "👑",
    palette: {
      hood: "#facc15",
      body: "#eab308",
      bodyDark: "#a16207",
      blush: "rgba(255,224,130,.5)",
      a: "#facc15",
      b: "#eab308",
    },
  },
  {
    id: "loop-legend",
    name: "Loop Legend",
    tagline: "You never break, you just iterate.",
    traits: ["Grit", "Composure", "Rigor"],
    descriptors: ["Persistent", "Patient", "Resilient"],
    rarityPriority: 7,
    emoji: "🔁",
    palette: {
      hood: "#34d399",
      body: "#059669",
      bodyDark: "#065f46",
      blush: "rgba(167,255,214,.5)",
      a: "#34d399",
      b: "#059669",
    },
  },
  {
    id: "code-cutie",
    name: "Code Cutie",
    tagline: "You bring the vibes to every commit.",
    traits: ["Play", "Voice", "Novelty"],
    descriptors: ["Playful", "Fun-loving", "Energetic"],
    rarityPriority: 7,
    emoji: "🍬",
    palette: {
      hood: "#fb7185",
      body: "#f472b6",
      bodyDark: "#be185d",
      blush: "rgba(255,182,206,.6)",
      a: "#fb7185",
      b: "#f472b6",
    },
  },
  {
    id: "binary-babe",
    name: "Binary Babe",
    tagline: "You think in ones, zeros, and pure logic.",
    // Speed against Composure is the only thing separating Binary Babe from Debug
    // Master, and it is deliberate. Do not tidy it.
    traits: ["Analysis", "Rigor", "Speed"],
    descriptors: ["Analytical", "Precise", "Sharp"],
    rarityPriority: 8,
    emoji: "💻",
    palette: {
      hood: "#22d3ee",
      body: "#0ea5e9",
      bodyDark: "#075985",
      blush: "rgba(147,236,255,.5)",
      a: "#22d3ee",
      b: "#0ea5e9",
    },
  },
  {
    id: "debug-master",
    name: "Debug Master",
    tagline: "Bugs fear you. Logic respects you.",
    traits: ["Analysis", "Rigor", "Composure"],
    descriptors: ["Analytical", "Calm", "Methodical"],
    rarityPriority: 8,
    emoji: "🐞",
    palette: {
      hood: "#818cf8",
      body: "#6366f1",
      bodyDark: "#3730a3",
      blush: "rgba(196,190,255,.5)",
      a: "#818cf8",
      b: "#6366f1",
    },
  },
  {
    id: "syntax-superstar",
    name: "Syntax Superstar",
    tagline: "You turn code into a whole performance.",
    traits: ["Voice", "Nerve", "Craft"],
    descriptors: ["Expressive", "Communicative", "Bold"],
    rarityPriority: 8,
    emoji: "🎤",
    palette: {
      hood: "#f97316",
      body: "#fb923c",
      bodyDark: "#c2410c",
      blush: "rgba(255,199,140,.55)",
      a: "#f97316",
      b: "#fb923c",
    },
  },
  {
    id: "cool-dev",
    name: "Cool Dev",
    tagline: "You break the rules to build the future.",
    traits: ["Novelty", "Nerve", "Speed"],
    descriptors: ["Innovative", "Bold", "Curious"],
    rarityPriority: 8,
    emoji: "🚀",
    palette: {
      hood: "#e2e8f0",
      body: "#38bdf8",
      bodyDark: "#0369a1",
      blush: "rgba(210,240,255,.5)",
      a: "#38bdf8",
      b: "#94a3b8",
    },
  },
  {
    id: "spark-ui-designer",
    name: "Spark UI Designer",
    tagline: "You design. You code. You sparkle.",
    traits: ["Craft", "Rigor", "Novelty"],
    descriptors: ["Creative", "Detail-Oriented", "Innovative"],
    rarityPriority: 9,
    emoji: "🎨",
    palette: {
      hood: "#ff4fa3",
      body: "#a855f7",
      bodyDark: "#6d28d9",
      blush: "rgba(255,143,196,.5)",
      a: "#ff4fa3",
      b: "#a855f7",
    },
  },
];

export function personaById(id: PersonaId): Persona {
  const persona = PERSONAS.find((p) => p.id === id);
  if (!persona) throw new Error(`Unknown Persona: ${id}`);
  return persona;
}

/** How many Personas a Trait feeds. Every Trait feeds at least one; Command, Grit and Play feed exactly one. */
export function personasFedBy(trait: Trait): readonly Persona[] {
  return PERSONAS.filter((p) => p.traits.includes(trait));
}
