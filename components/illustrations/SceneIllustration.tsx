import type { SceneIllustration as Kind } from "@/content/schema";
import { cn } from "@/lib/cn";

const C = {
  red: "#8F2925",
  redDark: "#72211E",
  yellow: "#E9B83E",
  cream: "#F6EBD3",
  creamDark: "#E5D8BF",
  paper: "#FBF5E8",
  ink: "#2B1D16",
  clay: "#B5653A",
  wood: "#7A4A2A",
  woodLight: "#A0693F",
  teal: "#2F7F7A",
  steel: "#A7ADB0",
  bulb: "#FFD38A",
};

/** Atmosphere tiles: vintage illustrated corners of the café (4:5). */
export function SceneIllustration({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`dots-${kind}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.1" fill={C.ink} opacity="0.12" />
        </pattern>
      </defs>
      <rect width="240" height="300" fill={BG[kind]} />
      <rect width="240" height="300" fill={`url(#dots-${kind})`} />
      {kind === "counter" && <Counter />}
      {kind === "radio" && <Radio />}
      {kind === "bicycle" && <Bicycle />}
      {kind === "lamps" && <Lamps />}
      {kind === "books" && <Books />}
      {kind === "carrom" && <Carrom />}
    </svg>
  );
}

const BG: Record<Kind, string> = {
  counter: "#E9C994",
  radio: "#F0D9A8",
  bicycle: "#C98E6B",
  lamps: "#3B2A3E",
  books: "#E3CAC9",
  carrom: "#FAEDCF",
};

function Counter() {
  return (
    <g>
      <rect x="0" y="190" width="240" height="110" fill={C.teal} />
      <rect x="0" y="180" width="240" height="14" fill={C.woodLight} />
      <rect x="0" y="194" width="240" height="10" fill={C.yellow} />
      <text
        x="120"
        y="262"
        textAnchor="middle"
        fill={C.cream}
        fontSize="28"
        style={{ fontFamily: "var(--font-yatra), serif" }}
      >
        Garam Chai
      </text>
      <rect x="44" y="132" width="52" height="48" rx="8" fill={C.steel} />
      <path d="M96 150l22-10" stroke={C.steel} strokeWidth="7" strokeLinecap="round" />
      <path
        d="M62 120c-8-12 8-18 0-30M78 120c-8-12 8-18 0-30"
        stroke={C.paper}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        className="motion-safe:animate-steam"
      />
      {[140, 166, 192].map((x, i) => (
        <g key={x}>
          {Array.from({ length: 3 - (i % 2) }, (_, k) => (
            <path key={k} d={`M${x - 11} ${172 - k * 14}h22l-3 14h-16z`} fill={C.clay} />
          ))}
        </g>
      ))}
    </g>
  );
}

function Radio() {
  return (
    <g>
      <rect x="0" y="210" width="240" height="90" fill={C.wood} />
      <rect
        x="40"
        y="110"
        width="160"
        height="100"
        rx="16"
        fill={C.woodLight}
        stroke={C.ink}
        strokeWidth="4"
      />
      <rect x="54" y="124" width="74" height="72" rx="8" fill={C.creamDark} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M58 ${134 + i * 11}h66`} stroke={C.wood} strokeWidth="3" opacity="0.5" />
      ))}
      <circle cx="164" cy="146" r="22" fill={C.yellow} stroke={C.ink} strokeWidth="3" />
      <path d="M164 146l12-10" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="190" r="7" fill={C.ink} />
      <circle cx="178" cy="190" r="7" fill={C.ink} />
      <g stroke={C.red} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M200 90q12 10 0 20" />
        <path d="M212 80q20 20 0 40" />
      </g>
      <text x="40" y="80" fill={C.red} fontSize="22" style={{ fontFamily: "var(--font-yatra), serif" }}>
        ♪ Purane gaane
      </text>
    </g>
  );
}

function Bicycle() {
  return (
    <g>
      <rect x="0" y="236" width="240" height="64" fill={C.redDark} opacity="0.5" />
      <rect x="150" y="40" width="64" height="88" fill={C.yellow} transform="rotate(4 182 84)" />
      <text
        x="182"
        y="92"
        textAnchor="middle"
        fill={C.red}
        fontSize="16"
        transform="rotate(4 182 84)"
        style={{ fontFamily: "var(--font-yatra), serif" }}
      >
        CHAI
      </text>
      <g stroke={C.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="62" cy="206" r="40" />
        <circle cx="180" cy="206" r="40" />
        <path d="M62 206l52 0-20-56h70l16 56M114 206l60-56M150 136l14 14M86 150h-18" />
      </g>
      <rect x="160" y="128" width="40" height="22" fill="#C89A5B" />
    </g>
  );
}

function Lamps() {
  return (
    <g>
      {[60, 128, 196].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 0v${70 + i * 18}`} stroke={C.ink} strokeWidth="3" />
          <circle cx={x} cy={84 + i * 18} r="40" fill={C.bulb} opacity="0.18" />
          <circle cx={x} cy={84 + i * 18} r="13" fill={C.bulb} />
        </g>
      ))}
      <rect x="20" y="220" width="200" height="12" fill={C.woodLight} />
      <rect x="36" y="232" width="10" height="68" fill={C.wood} />
      <rect x="194" y="232" width="10" height="68" fill={C.wood} />
      {[70, 120, 166].map((x) => (
        <g key={x}>
          <path d={`M${x - 10} 204h20l-3 16h-14z`} fill={C.clay} />
          <path
            d={`M${x} 198c-5-8 5-12 0-20`}
            stroke={C.cream}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      ))}
    </g>
  );
}

function Books() {
  const colors = [C.red, C.yellow, C.teal, C.cream, C.clay, C.redDark, "#2E5E8C", C.ink];
  return (
    <g>
      {[60, 140, 220].map((y, s) => (
        <g key={y}>
          <rect x="16" y={y} width="208" height="8" fill={C.wood} />
          {Array.from({ length: 9 }, (_, i) => {
            const h = 44 + ((i * 7 + s * 5) % 22);
            return (
              <rect
                key={i}
                x={22 + i * 22}
                y={y - h}
                width={18}
                height={h}
                fill={colors[(i + s * 3) % colors.length]}
                transform={i === 8 ? `rotate(-12 ${22 + i * 22} ${y})` : undefined}
              />
            );
          })}
        </g>
      ))}
      <path d="M150 270h44l-4 22h-36z" fill={C.clay} />
    </g>
  );
}

function Carrom() {
  return (
    <g transform="rotate(-8 120 150)">
      <rect x="28" y="58" width="184" height="184" rx="10" fill={C.wood} />
      <rect x="42" y="72" width="156" height="156" fill="#E7C98F" />
      {[
        [50, 80],
        [190, 80],
        [50, 220],
        [190, 220],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="9" fill={C.ink} />
      ))}
      <circle cx="120" cy="150" r="30" fill="none" stroke={C.red} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx={120 + Math.cos((i / 6) * Math.PI * 2) * 14}
          cy={150 + Math.sin((i / 6) * Math.PI * 2) * 14}
          r="7"
          fill={i % 2 ? C.ink : C.cream}
          stroke={C.ink}
          strokeWidth="1"
        />
      ))}
      <circle cx="120" cy="150" r="7" fill={C.red} />
      <circle cx="96" cy="206" r="9" fill={C.paper} stroke={C.ink} strokeWidth="2" />
    </g>
  );
}
