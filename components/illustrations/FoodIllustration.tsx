import type { FoodIllustration as Kind } from "@/content/schema";
import { cn } from "@/lib/cn";

const C = {
  red: "#8F2925",
  redDark: "#72211E",
  yellow: "#E9B83E",
  cream: "#F6EBD3",
  paper: "#FBF5E8",
  ink: "#2B1D16",
  clay: "#B5653A",
  chai: "#B97A43",
  fry: "#D9963F",
  fryDark: "#A8652A",
  syrup: "#E8892B",
  green: "#4E7A3A",
};

/** Hand-drawn food illustrations (flat, vintage-label style). Decorative: pair with visible text. */
export function FoodIllustration({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="104" r="86" fill={C.yellow} opacity="0.35" />
      <ellipse cx="100" cy="172" rx="62" ry="9" fill={C.ink} opacity="0.12" />
      {kind === "chai" && <Chai />}
      {kind === "samosa" && <Samosa />}
      {kind === "jalebi" && <Jalebi />}
      {kind === "bun-maska" && <BunMaska />}
      {kind === "pakora" && <Pakora />}
    </svg>
  );
}

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke={C.ink} strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round">
      {[-16, 0, 16].map((dx) => (
        <path
          key={dx}
          d={`M${x + dx} ${y}c-8-10 8-16 0-26c-6-8 6-14 0-22`}
          className="motion-safe:animate-steam"
        />
      ))}
    </g>
  );
}

function Chai() {
  return (
    <g>
      <Steam x={100} y={66} />
      <path d="M56 78h88l-12 88H68z" fill={C.clay} />
      <ellipse cx="100" cy="78" rx="44" ry="10" fill={C.redDark} />
      <ellipse cx="100" cy="79" rx="37" ry="7" fill={C.chai} />
      <path d="M62 110c25 8 51 8 76 0" stroke={C.yellow} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M68 92l6 60" stroke={C.cream} strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Samosa() {
  return (
    <g>
      <path d="M100 40L162 160H38z" fill={C.fry} stroke={C.fryDark} strokeWidth="5" strokeLinejoin="round" />
      <path d="M100 40l-10 120M100 40l14 120" stroke={C.fryDark} strokeWidth="3" opacity="0.5" />
      {[
        [80, 120],
        [118, 135],
        [96, 92],
        [130, 150],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill={C.fryDark} opacity="0.6" />
      ))}
      <ellipse cx="166" cy="164" rx="18" ry="7" fill={C.green} />
      <ellipse cx="34" cy="166" rx="16" ry="6" fill={C.red} />
    </g>
  );
}

function Jalebi() {
  // A loose double spiral drawn as one thick stroke.
  const spiral = (cx: number, cy: number, turns: number, r: number) => {
    let d = "";
    const steps = turns * 24;
    for (let i = 0; i <= steps; i++) {
      const a = (i / 24) * Math.PI * 2;
      const rr = (r * i) / steps;
      d += `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    }
    return d;
  };
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse
        cx="100"
        cy="150"
        rx="70"
        ry="16"
        fill={C.paper}
        stroke={C.ink}
        strokeOpacity="0.2"
        strokeWidth="3"
      />
      <path d={spiral(78, 108, 3, 34)} stroke={C.syrup} strokeWidth="11" />
      <path d={spiral(128, 118, 2.5, 28)} stroke={C.syrup} strokeWidth="10" />
      <path d={spiral(78, 108, 3, 34)} stroke={C.yellow} strokeWidth="3" opacity="0.7" />
      <path d={spiral(128, 118, 2.5, 28)} stroke={C.yellow} strokeWidth="3" opacity="0.7" />
    </g>
  );
}

function BunMaska() {
  return (
    <g>
      <ellipse cx="100" cy="128" rx="64" ry="30" fill={C.fry} />
      <path d="M36 122c0-34 128-34 128 0" fill="#E6AE5C" />
      <rect x="52" y="116" width="96" height="12" rx="6" fill={C.cream} />
      <path
        d="M70 100c10-6 20-6 30 0"
        stroke={C.cream}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  );
}

function Pakora() {
  return (
    <g>
      {[
        [70, 120, 30],
        [118, 112, 34],
        [96, 146, 28],
      ].map(([x, y, r]) => (
        <path
          key={`${x}${y}`}
          d={`M${x - r} ${y}q6-${r} ${r}-${r}q${r} 4 ${r} ${r}q-6 ${r}-${r} ${r}q-${r}-4-${r}-${r}z`}
          fill={C.fry}
          stroke={C.fryDark}
          strokeWidth="4"
        />
      ))}
      <ellipse cx="160" cy="160" rx="18" ry="7" fill={C.green} />
    </g>
  );
}
