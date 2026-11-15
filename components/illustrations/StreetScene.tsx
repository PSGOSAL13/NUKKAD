import { cn } from "@/lib/cn";

/**
 * Small vintage street-scene strip for the footer: rooftops, a chai stall,
 * a lamp, a bicycle and festoon lights, drawn in cream and yellow on red.
 */
export function StreetScene({ className }: { className?: string }) {
  const bulbs = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 1200 170"
      preserveAspectRatio="xMidYMax slice"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* rooftops */}
      <path
        d="M0 170 V96 H70 V70 H150 V100 H210 V60 H300 V90 H340 V170 Z M820 170 V80 H900 V54 H990 V92 H1050 V66 H1130 V100 H1200 V170 Z"
        fill="#72211E"
      />
      {[
        [96, 84],
        [236, 76],
        [870, 98],
        [1080, 82],
      ].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="22" height="26" fill="#FFD38A" opacity="0.85" />
      ))}

      {/* the shop */}
      <rect x="430" y="58" width="340" height="112" fill="#72211E" />
      <rect x="470" y="70" width="260" height="30" rx="4" fill="#4E2E1A" stroke="#E9B83E" strokeWidth="3" />
      <text
        x="600"
        y="92"
        textAnchor="middle"
        fontSize="20"
        fill="#F6EBD3"
        style={{ fontFamily: "var(--font-yatra), serif" }}
      >
        NUKKAD | नुक्कड
      </text>
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} fill={i % 2 ? "#E9B83E" : "#F6EBD3"}>
          <rect x={500 + i * 20} y="106" width="20" height="14" />
          <circle cx={510 + i * 20} cy="120" r="10" />
        </g>
      ))}
      <rect x="530" y="132" width="140" height="38" fill="#FFC27A" opacity="0.9" />

      {/* chai stall */}
      <rect x="350" y="126" width="74" height="44" fill="#2F7F7A" />
      <rect x="346" y="120" width="82" height="8" fill="#A0693F" />
      <rect x="360" y="104" width="20" height="16" rx="3" fill="#A7ADB0" />
      <path
        d="M366 98c-4-6 4-8 0-14M374 98c-4-6 4-8 0-14"
        stroke="#F6EBD3"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className="motion-safe:animate-steam"
      />

      {/* lamp */}
      <rect x="300" y="60" width="5" height="110" fill="#2B1D16" />
      <circle cx="318" cy="64" r="26" fill="#FFD38A" opacity="0.25" />
      <path d="M302 62 q8 -8 16 -4" stroke="#2B1D16" strokeWidth="4" fill="none" />
      <rect x="312" y="58" width="12" height="14" rx="2" fill="#FFD38A" />

      {/* bicycle */}
      <g stroke="#F6EBD3" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <circle cx="796" cy="150" r="17" />
        <circle cx="848" cy="150" r="17" />
        <path d="M796 150 h22 l-9 -24 h30 l9 24 M818 150 l26 -24 M834 116 l6 10" />
      </g>

      {/* festoon lights */}
      <path d="M180 40 Q600 90 1020 40" stroke="#2B1D16" strokeWidth="2" fill="none" />
      {bulbs.map((i) => {
        const t = (i + 0.5) / bulbs.length;
        const x = 180 + 840 * t;
        const y = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 90 + t * t * 40 + 6;
        return <circle key={i} cx={x} cy={y} r="4.5" fill="#FFD38A" />;
      })}

      {/* street */}
      <rect x="0" y="166" width="1200" height="4" fill="#E9B83E" />
    </svg>
  );
}
