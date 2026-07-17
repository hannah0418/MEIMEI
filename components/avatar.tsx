import type { Persona } from "@/lib/personas";

/**
 * Blocky retro chibi bust, recoloured per Persona. Carried over from the original MEI MEI
 * concept page — eight identical cards with swapped text is not a reveal.
 */
export function Avatar({ persona }: { persona: Persona }) {
  const pal = persona.palette;
  return (
    <svg viewBox="0 0 120 130" shapeRendering="crispEdges" aria-hidden="true">
      <rect x={20} y={6} width={80} height={26} rx={4} fill={pal.hood} />
      <rect x={8} y={26} width={16} height={34} rx={3} fill={pal.hood} />
      <rect x={96} y={26} width={16} height={34} rx={3} fill={pal.hood} />
      <rect x={6} y={34} width={16} height={26} rx={4} fill="#12121f" />
      <rect x={98} y={34} width={16} height={26} rx={4} fill="#12121f" />
      <rect x={10} y={38} width={8} height={18} rx={3} fill={pal.bodyDark} />
      <rect x={102} y={38} width={8} height={18} rx={3} fill={pal.bodyDark} />
      <rect x={28} y={30} width={64} height={46} rx={10} fill="#f4c9a0" />
      <rect x={40} y={52} width={10} height={6} rx={2} fill="#1a1a2e" />
      <rect x={70} y={52} width={10} height={6} rx={2} fill="#1a1a2e" />
      <rect x={42} y={66} width={8} height={5} rx={2} fill={pal.blush} />
      <rect x={70} y={66} width={8} height={5} rx={2} fill={pal.blush} />
      <rect x={48} y={70} width={24} height={4} rx={2} fill="#c98a5c" opacity={0.5} />
      <polygon points="14,112 106,112 118,130 2,130" fill={pal.body} />
      <rect x={18} y={82} width={84} height={30} rx={8} fill={pal.body} />
      <rect x={44} y={90} width={32} height={20} rx={6} fill={pal.bodyDark} />
      <rect x={52} y={78} width={16} height={10} rx={4} fill={pal.bodyDark} />
    </svg>
  );
}
