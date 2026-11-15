import type { LocationContent } from "@/content/schema";
import { cn } from "@/lib/cn";

type Landmark = LocationContent["landmarks"][number];

const W = 800;
const H = 560;

/**
 * Hand-drawn, not-to-scale neighbourhood map. Landmarks and the café pin are
 * positioned from content/location.ts (x/y in %). Labels are real text so
 * they translate and stay readable for screen readers via the legend.
 */
export function VintageMap({
  cafe,
  landmarks,
  labels,
  className,
}: {
  cafe: LocationContent["cafe"];
  landmarks: (Landmark & { text: string })[];
  labels: { cafe: string; notToScale: string; north: string };
  className?: string;
}) {
  const px = (x: number) => (x / 100) * W;
  const py = (y: number) => (y / 100) * H;
  const cx = px(cafe.x);
  const cy = py(cafe.y);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="map-grain" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.9" fill="#7A4A2A" opacity="0.12" />
        </pattern>
        <filter id="map-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>

      {/* aged paper */}
      <rect width={W} height={H} rx="18" fill="#F3E2BE" />
      <rect width={W} height={H} rx="18" fill="url(#map-grain)" />
      <rect
        x="10"
        y="10"
        width={W - 20}
        height={H - 20}
        rx="12"
        fill="none"
        stroke="#7A4A2A"
        strokeWidth="3"
        strokeDasharray="10 6"
      />

      {/* sea to the west (Trivandrum is on the coast) */}
      <path
        d={`M0 0 H86 Q60 140 92 280 Q120 420 70 ${H} H0Z`}
        fill="#9CC3C0"
        opacity="0.7"
        filter="url(#map-rough)"
      />
      <g stroke="#2F7F7A" strokeWidth="2" fill="none" opacity="0.6">
        {[90, 200, 330, 450].map((y) => (
          <path key={y} d={`M18 ${y} q10 -6 20 0 t20 0`} />
        ))}
      </g>

      {/* green patches */}
      <g fill="#B9C98F" opacity="0.7" filter="url(#map-rough)">
        <ellipse cx="650" cy="430" rx="90" ry="50" />
        <ellipse cx="300" cy="110" rx="70" ry="34" />
      </g>

      {/* roads: hand-drawn, through the café */}
      <g filter="url(#map-rough)" strokeLinecap="round" fill="none">
        <path
          d={`M100 ${cy + 30} Q${W / 2} ${cy - 30} ${W - 30} ${cy + 20}`}
          stroke="#FBF5E8"
          strokeWidth="26"
        />
        <path
          d={`M${cx + 20} 30 Q${cx - 40} ${H / 2} ${cx + 30} ${H - 30}`}
          stroke="#FBF5E8"
          strokeWidth="22"
        />
        <path d={`M150 60 Q400 160 ${W - 60} 110`} stroke="#FBF5E8" strokeWidth="14" />
        <path d={`M140 ${H - 70} Q420 ${H - 150} ${W - 40} ${H - 60}`} stroke="#FBF5E8" strokeWidth="14" />
        <g stroke="#7A4A2A" strokeWidth="2" opacity="0.45" strokeDasharray="12 10">
          <path d={`M100 ${cy + 30} Q${W / 2} ${cy - 30} ${W - 30} ${cy + 20}`} />
          <path d={`M${cx + 20} 30 Q${cx - 40} ${H / 2} ${cx + 30} ${H - 30}`} />
        </g>
      </g>

      {/* landmarks */}
      {landmarks.map((l) => (
        <g key={l.id} transform={`translate(${px(l.x)} ${py(l.y)})`}>
          <circle r="22" fill="#FBF5E8" stroke="#2B1D16" strokeWidth="3" />
          <LandmarkIcon kind={l.kind} />
          <text
            y="42"
            textAnchor="middle"
            fontSize="17"
            fill="#2B1D16"
            style={{ fontFamily: "var(--font-heading-stack)" }}
            fontWeight="600"
          >
            {truncate(l.text, 26)}
          </text>
        </g>
      ))}

      {/* café pin: a kulhad on a red marker */}
      <g transform={`translate(${cx} ${cy})`}>
        <circle r="46" fill="#E9B83E" opacity="0.35" className="motion-safe:animate-pulse" />
        <path
          d="M0 26 C-30 -6 -28 -44 0 -44 C28 -44 30 -6 0 26Z"
          fill="#8F2925"
          stroke="#2B1D16"
          strokeWidth="3"
        />
        <path d="M-12 -30 h24 l-4 22 h-16z" fill="#F6EBD3" />
        <path
          d="M-6 -34 c-4 -6 4 -8 0 -14 M6 -34 c-4 -6 4 -8 0 -14"
          stroke="#F6EBD3"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="-62"
          y="34"
          width="124"
          height="34"
          rx="8"
          fill="#8F2925"
          stroke="#2B1D16"
          strokeWidth="2.5"
        />
        <text
          y="58"
          textAnchor="middle"
          fontSize="20"
          fill="#F6EBD3"
          style={{ fontFamily: "var(--font-yatra), serif" }}
        >
          {labels.cafe}
        </text>
      </g>

      {/* compass */}
      <g transform={`translate(${W - 70} 70)`}>
        <circle r="34" fill="#FBF5E8" stroke="#2B1D16" strokeWidth="2.5" />
        <path d="M0 -28 L8 0 L0 28 L-8 0Z" fill="#8F2925" />
        <path d="M0 0 L8 0 L0 28 L-8 0Z" fill="#2B1D16" opacity="0.8" />
        <text y="-38" textAnchor="middle" fontSize="16" fontWeight="700" fill="#2B1D16">
          {labels.north}
        </text>
      </g>
      <text x={W - 24} y={H - 22} textAnchor="end" fontSize="14" fill="#7A4A2A" fontStyle="italic">
        {labels.notToScale}
      </text>
    </svg>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function LandmarkIcon({ kind }: { kind: Landmark["kind"] }) {
  const s = {
    stroke: "#2B1D16",
    strokeWidth: 2.5,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "temple":
      return <path {...s} d="M-10 10 V-2 L0 -12 L10 -2 V10 Z M-4 10 V3 H4 V10 M0 -12 V-16" />;
    case "church":
      return <path {...s} d="M-9 10 V-2 L0 -9 L9 -2 V10 Z M0 -9 V-17 M-4 -13 H4" />;
    case "mosque":
      return <path {...s} d="M-10 10 V0 Q-10 -10 0 -12 Q10 -10 10 0 V10 Z M0 -12 V-16" />;
    case "bus":
      return <path {...s} d="M-11 -9 H11 V7 H-11 Z M-11 -1 H11 M-6 7 V11 M6 7 V11" />;
    case "rail":
      return <path {...s} d="M-8 -11 H8 V5 H-8 Z M-8 -3 H8 M-5 5 L-9 11 M5 5 L9 11" />;
    case "college":
      return <path {...s} d="M-12 -4 L0 -11 L12 -4 L0 3 Z M-7 -1 V6 Q0 10 7 6 V-1" />;
    case "park":
      return <path {...s} d="M0 11 V0 M-8 0 Q-10 -12 0 -13 Q10 -12 8 0 Z" />;
    case "beach":
      return <path {...s} d="M-11 8 q5 -4 11 0 t11 0 M-2 4 L4 -12 M-8 -8 Q4 -16 12 -6" />;
    case "market":
      return <path {...s} d="M-11 -4 H11 L8 -11 H-8 Z M-9 -4 V10 H9 V-4 M-3 10 V3 H3 V10" />;
    case "hospital":
      return <path {...s} d="M-3 -10 H3 V-3 H10 V3 H3 V10 H-3 V3 H-10 V-3 H-3 Z" />;
  }
}
