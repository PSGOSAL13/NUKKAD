import type { OwnerCharacter } from "@/content/schema";
import { cn } from "@/lib/cn";

/**
 * Flat illustrated version of the street-corner scene (SVG, ~6 KB).
 * Shown instantly while the 3D scene loads, and permanently when WebGL is
 * unavailable or Data Saver is on. Same composition and palette as the 3D.
 */
export function OpeningPoster({ owner, className }: { owner: OwnerCharacter; className?: string }) {
  const stripes = Array.from({ length: 12 }, (_, i) => i);
  const bulbs = Array.from({ length: 15 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="op-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B2950" />
          <stop offset="0.55" stopColor="#8C4A63" />
          <stop offset="1" stopColor="#E58A4E" />
        </linearGradient>
        <radialGradient id="op-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD38A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFD38A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="op-inside" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC27A" />
          <stop offset="1" stopColor="#B5653A" />
        </linearGradient>
        <pattern id="op-shutter" width="20" height="14" patternUnits="userSpaceOnUse">
          <rect width="20" height="14" fill="#8E9A90" />
          <rect y="10" width="20" height="4" fill="#5E6A62" />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#op-sky)" />
      {/* far rooftops */}
      <path d="M0 420h120v-60h90v40h110v-90h80v110H0z" fill="#2B1D16" opacity="0.35" />
      <path d="M1180 400h90v-80h120v50h100v-70h110v100h-420z" fill="#2B1D16" opacity="0.35" />

      {/* neighbour buildings */}
      <rect x="0" y="300" width="470" height="480" fill="#C98E6B" />
      <rect x="1130" y="380" width="470" height="400" fill="#6F8F9A" />
      {[90, 290].map((x) => (
        <rect key={x} x={x} y="380" width="90" height="120" fill="#FFD38A" stroke="#F6EBD3" strokeWidth="8" />
      ))}
      {[1200, 1360, 1500].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="440"
          width="80"
          height="110"
          fill={i === 1 ? "#2B1D16" : "#FFD38A"}
          stroke="#F6EBD3"
          strokeWidth="8"
        />
      ))}

      {/* shopfront */}
      <rect x="470" y="210" width="660" height="570" fill="#D9A75B" />
      <rect x="455" y="196" width="690" height="22" fill="#72211E" />
      {/* doorway: warm interior + half-rolled shutter */}
      <rect x="650" y="500" width="300" height="280" fill="url(#op-inside)" />
      <rect x="650" y="460" width="300" height="80" fill="url(#op-shutter)" />
      <rect x="640" y="440" width="320" height="26" fill="#5E6A62" />
      {/* signboard */}
      <rect x="575" y="250" width="450" height="96" rx="6" fill="#7A4A2A" stroke="#E9B83E" strokeWidth="6" />
      <image
        href="/brand/nukkad-secondary-reverse.svg"
        x="610"
        y="262"
        width="380"
        height="72"
        preserveAspectRatio="xMidYMid meet"
      />
      {/* awning with scallops */}
      {stripes.map((i) => (
        <g key={i} fill={i % 2 ? "#E9B83E" : "#8F2925"}>
          <rect x={620 + i * 30} y="372" width="30" height="46" />
          <circle cx={635 + i * 30} cy="418" r="15" />
        </g>
      ))}
      {/* posters */}
      <rect x="975" y="520" width="62" height="86" fill="#E9B83E" transform="rotate(3 1006 563)" />
      <rect x="1050" y="510" width="62" height="86" fill="#8F2925" transform="rotate(-4 1081 553)" />
      <rect x="500" y="430" width="62" height="86" fill="#F6EBD3" transform="rotate(-3 531 473)" />

      {/* string lights */}
      <path d="M470 190 Q800 255 1130 190" fill="none" stroke="#2B1D16" strokeWidth="3" />
      {bulbs.map((i) => {
        const t = (i + 0.5) / bulbs.length;
        const x = 470 + 660 * t;
        const y = (1 - t) * (1 - t) * 190 + 2 * (1 - t) * t * 255 + t * t * 190 + 8;
        return <circle key={i} cx={x} cy={y} r="7" fill="#FFD38A" />;
      })}

      {/* sidewalk + road */}
      <rect x="0" y="780" width="1600" height="40" fill="#BDAE94" />
      <rect x="0" y="820" width="1600" height="80" fill="#3A312C" />

      {/* chai counter */}
      <rect x="420" y="640" width="200" height="140" fill="#2F7F7A" />
      <rect x="420" y="640" width="200" height="16" fill="#E9B83E" />
      <rect x="410" y="628" width="220" height="14" fill="#A0693F" />
      <text
        x="520"
        y="725"
        textAnchor="middle"
        fill="#F6EBD3"
        fontSize="28"
        style={{ fontFamily: "var(--font-yatra), serif" }}
      >
        Garam Chai
      </text>
      <rect x="450" y="590" width="40" height="38" rx="6" fill="#A7ADB0" />
      <path
        d="M470 580c-8-14 8-22 0-36M482 582c-6-12 6-18 0-30"
        stroke="#F6EBD3"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className="motion-safe:animate-steam"
      />
      {[540, 565, 590].map((x) => (
        <path key={x} d={`M${x - 10} 604h20l-4 24h-12z`} fill="#B5653A" />
      ))}

      {/* owner */}
      <g transform="translate(700 600)">
        <rect x="-26" y="120" width="20" height="62" rx="9" fill={owner.trousers} />
        <rect x="6" y="120" width="20" height="62" rx="9" fill={owner.trousers} />
        <path d="M-46 130 L-36 30 Q0 14 36 30 L46 130 Z" fill={owner.kurta.color} />
        {owner.vest.enabled && (
          <path
            d="M-34 36 Q-18 26 -6 30 L-8 100 L-38 100 Z M34 36 Q18 26 6 30 L8 100 L38 100 Z"
            fill={owner.vest.color}
          />
        )}
        <path
          d="M36 34 Q70 10 66 -30"
          stroke={owner.kurta.color}
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="66" cy="-36" r="10" fill={owner.skinTone} />
        <path
          d="M-36 34 Q-46 70 -14 74"
          stroke={owner.kurta.color}
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M-24 58h22l-3 22h-16z" fill="#B5653A" />
        <path d="M-14 52c-5-9 5-13 0-22" stroke="#F6EBD3" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="-6" r="30" fill={owner.skinTone} />
        <path
          d="M-30 -10 Q-28 -40 0 -38 Q28 -40 30 -12 Q20 -28 0 -28 Q-18 -28 -30 -10Z"
          fill={owner.hair.color}
        />
        <circle cx="-10" cy="-6" r="3.5" fill="#2B1D16" />
        <circle cx="10" cy="-6" r="3.5" fill="#2B1D16" />
        {owner.facialHair !== "none" && owner.facialHair !== "stubble" && (
          <path d="M-14 6 Q0 0 14 6 Q0 10 -14 6Z" fill={owner.hair.color} />
        )}
        <path d="M-9 13 Q0 20 9 13" stroke="#72211E" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* bench + bicycle */}
      <rect x="980" y="728" width="150" height="12" fill="#7A4A2A" />
      <rect x="990" y="740" width="10" height="40" fill="#4E2E1A" />
      <rect x="1110" y="740" width="10" height="40" fill="#4E2E1A" />
      <g stroke="#2B1D16" strokeWidth="6" fill="none">
        <circle cx="1210" cy="735" r="42" />
        <circle cx="1330" cy="735" r="42" />
        <path d="M1210 735 L1260 735 L1240 680 L1310 680 L1330 735 M1260 735 L1310 680 M1300 660 L1316 680" />
      </g>

      {/* street lamp */}
      <circle cx="268" cy="358" r="110" fill="url(#op-glow)" />
      <rect x="196" y="370" width="12" height="410" fill="#2B1D16" />
      <path d="M202 380 Q240 350 268 352" stroke="#2B1D16" strokeWidth="8" fill="none" />
      <rect x="254" y="352" width="28" height="34" rx="4" fill="#FFD38A" />
    </svg>
  );
}
