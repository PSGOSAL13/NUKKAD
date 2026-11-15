import type { StoryTheme } from "@/content/schema";
import { cn } from "@/lib/cn";

export type ThemeKind = StoryTheme | "community";

const BG: Record<ThemeKind, string> = {
  "beyond-the-uniform": "#F0D9A8",
  "stories-of-the-sea": "#9CC3C0",
  "stories-over-chai": "#3B2A3E",
  community: "#FAEDCF",
};

/** Hand-drawn emblems for the storytelling themes (and community events). Decorative. */
export function ThemeIllustration({ kind, className }: { kind: ThemeKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="240" height="180" fill={BG[kind]} />
      {kind === "beyond-the-uniform" && <Uniform />}
      {kind === "stories-of-the-sea" && <Sea />}
      {kind === "stories-over-chai" && <Chai />}
      {kind === "community" && <Community />}
    </svg>
  );
}

function Uniform() {
  // A folded naval cap beside a kulhad: service, then civilian life.
  return (
    <g>
      <ellipse cx="96" cy="128" rx="58" ry="12" fill="#2B1D16" opacity="0.12" />
      <path
        d="M44 106 Q96 74 150 106 L144 120 Q96 104 50 120Z"
        fill="#FBF5E8"
        stroke="#2B1D16"
        strokeWidth="3"
      />
      <path d="M50 120 Q96 104 144 120 L140 128 Q96 116 54 128Z" fill="#2B1D16" />
      <circle cx="97" cy="98" r="9" fill="#E9B83E" stroke="#2B1D16" strokeWidth="2" />
      <path d="M97 92v12M92 97h10" stroke="#8F2925" strokeWidth="2" />
      <path d="M168 92h34l-5 38h-24z" fill="#B5653A" />
      <ellipse cx="185" cy="92" rx="17" ry="4" fill="#72211E" />
      <path
        d="M178 84c-4-7 4-10 0-17M190 84c-4-7 4-10 0-17"
        stroke="#8F2925"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Sea() {
  return (
    <g>
      <circle cx="190" cy="40" r="18" fill="#FBF5E8" opacity="0.8" />
      <path d="M40 98 h132 q16 0 16 12 q0 12 -16 12 h-132 q-16 0 -16 -12 q0 -12 16 -12z" fill="#2B1D16" />
      <rect x="92" y="78" width="30" height="22" rx="4" fill="#2B1D16" />
      <path d="M108 78 v-20 h10" stroke="#2B1D16" strokeWidth="5" fill="none" strokeLinecap="round" />
      {[52, 72, 140, 160].map((x) => (
        <circle key={x} cx={x} cy="110" r="3" fill="#E9B83E" />
      ))}
      {[124, 146, 168].map((y, i) => (
        <path
          key={y}
          d={`M0 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}
          stroke="#2F7F7A"
          strokeWidth="4"
          fill="none"
          opacity={1 - i * 0.25}
        />
      ))}
    </g>
  );
}

function Chai() {
  // A kulhad under a night sky of stars and a tiny orbit: astrology, science, curiosity.
  return (
    <g>
      {[
        [30, 30],
        [70, 18],
        [200, 26],
        [168, 56],
        [44, 70],
        [214, 84],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y - 6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2z`} fill="#E9B83E" />
      ))}
      <ellipse
        cx="120"
        cy="58"
        rx="46"
        ry="14"
        fill="none"
        stroke="#F6EBD3"
        strokeWidth="2"
        opacity="0.6"
        transform="rotate(-12 120 58)"
      />
      <circle cx="120" cy="58" r="9" fill="#E9B83E" />
      <circle cx="160" cy="48" r="4" fill="#F6EBD3" />
      <path d="M92 104h56l-8 58h-40z" fill="#B5653A" />
      <ellipse cx="120" cy="104" rx="28" ry="6" fill="#72211E" />
      <ellipse cx="120" cy="105" rx="23" ry="4" fill="#B97A43" />
      <path
        d="M112 96c-5-8 5-11 0-19M128 96c-5-8 5-11 0-19"
        stroke="#F6EBD3"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Community() {
  // Three stools around a small table with kulhads.
  return (
    <g>
      <ellipse cx="120" cy="96" rx="56" ry="16" fill="#A0693F" />
      <rect x="114" y="100" width="12" height="52" fill="#4E2E1A" />
      {[96, 120, 144].map((x) => (
        <path key={x} d={`M${x - 7} 78h14l-2 12h-10z`} fill="#B5653A" />
      ))}
      {[
        [48, 128],
        [192, 128],
        [120, 162],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <ellipse cx={x} cy={y} rx="20" ry="6" fill="#8F2925" />
          <rect x={x - 3} y={y} width="6" height="18" fill="#4E2E1A" />
        </g>
      ))}
      <path
        d="M58 40 q12 -14 24 0 M150 34 q12 -14 24 0"
        stroke="#8F2925"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="70" cy="28" r="10" fill="#E9B83E" />
      <circle cx="162" cy="22" r="10" fill="#E9B83E" />
    </g>
  );
}
