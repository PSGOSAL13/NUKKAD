import type { OwnerCharacter } from "@/content/schema";
import { cn } from "@/lib/cn";

/**
 * Cartoon portrait of the founder, drawn from the same settings as the 3D
 * owner character (content/owner-character.ts), framed like an old stamp.
 * The small anchor nods to the founder's years in the Indian Navy.
 */
export function FounderPortrait({
  owner,
  className,
  label,
}: {
  owner: OwnerCharacter;
  className?: string;
  label: string;
}) {
  const hair = owner.hair.color;
  return (
    <svg viewBox="0 0 300 340" className={cn("h-auto w-full", className)} role="img" aria-label={label}>
      <defs>
        <clipPath id="fp-frame">
          <rect x="22" y="22" width="256" height="296" rx="18" />
        </clipPath>
        <pattern id="fp-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#8F2925" opacity="0.18" />
        </pattern>
      </defs>
      {/* stamp-style frame */}
      <rect
        x="8"
        y="8"
        width="284"
        height="324"
        rx="24"
        fill="#F6EBD3"
        stroke="#2B1D16"
        strokeWidth="4"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <rect x="22" y="22" width="256" height="296" rx="18" fill="#E9B83E" />
      <g clipPath="url(#fp-frame)">
        <rect x="22" y="22" width="256" height="296" fill="url(#fp-dots)" />
        {/* sea horizon */}
        <path d="M22 236 q32 -10 64 0 t64 0 t64 0 t64 0 V318 H22z" fill="#2F7F7A" opacity="0.35" />

        {/* shoulders: kurta + waistcoat */}
        <path d="M46 318 Q56 238 150 230 Q244 238 254 318 Z" fill={owner.kurta.color} />
        {owner.vest.enabled && (
          <>
            <path d="M58 318 Q66 252 128 238 L140 318 Z" fill={owner.vest.color} />
            <path d="M242 318 Q234 252 172 238 L160 318 Z" fill={owner.vest.color} />
          </>
        )}
        <path d="M150 236 v82" stroke={owner.kurta.trim} strokeWidth="5" />
        {[258, 280, 302].map((y) => (
          <circle key={y} cx="150" cy={y} r="3.5" fill="#2B1D16" />
        ))}

        {/* neck + head */}
        <rect x="132" y="196" width="36" height="42" rx="12" fill={owner.skinTone} />
        <ellipse cx="150" cy="150" rx="62" ry="70" fill={owner.skinTone} />
        <ellipse cx="88" cy="156" rx="11" ry="16" fill={owner.skinTone} />
        <ellipse cx="212" cy="156" rx="11" ry="16" fill={owner.skinTone} />

        {/* hair */}
        {owner.hair.style !== "bald" && (
          <path d="M88 142 Q84 76 150 74 Q216 76 212 142 Q200 104 150 102 Q100 104 88 142Z" fill={hair} />
        )}
        {owner.hair.style === "tousled" && (
          <g fill={hair}>
            <circle cx="110" cy="84" r="22" />
            <circle cx="146" cy="72" r="26" />
            <circle cx="184" cy="82" r="22" />
            <circle cx="128" cy="78" r="18" />
            <circle cx="168" cy="74" r="18" />
          </g>
        )}
        {owner.hair.style === "curly" && (
          <g fill={hair}>
            {[96, 116, 136, 156, 176, 198].map((x, i) => (
              <circle key={x} cx={x} cy={i % 2 ? 80 : 90} r="18" />
            ))}
          </g>
        )}

        {/* brows + eyes */}
        <path
          d="M110 128 q16 -8 30 -2 M160 126 q14 -6 30 2"
          stroke={hair}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="126" cy="148" rx="7" ry="8" fill="#2B1D16" />
        <ellipse cx="174" cy="148" rx="7" ry="8" fill="#2B1D16" />
        <circle cx="128" cy="145" r="2.2" fill="#FBF5E8" />
        <circle cx="176" cy="145" r="2.2" fill="#FBF5E8" />
        {owner.glasses && (
          <g fill="none" stroke="#2B1D16" strokeWidth="4">
            <circle cx="126" cy="148" r="17" />
            <circle cx="174" cy="148" r="17" />
            <path d="M143 148h14" />
          </g>
        )}
        {/* nose */}
        <path
          d="M150 156 q-8 18 2 22"
          stroke="#2B1D16"
          strokeOpacity="0.35"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* beard / moustache + smile */}
        {owner.facialHair === "beard" && (
          <path d="M90 150 Q92 222 150 228 Q208 222 210 150 Q200 196 150 200 Q100 196 90 150Z" fill={hair} />
        )}
        {owner.facialHair === "stubble" && (
          <path
            d="M92 160 Q96 220 150 224 Q204 220 208 160 Q198 200 150 204 Q102 200 92 160Z"
            fill={hair}
            opacity="0.25"
          />
        )}
        {(owner.facialHair === "beard" || owner.facialHair === "moustache") && (
          <path d="M120 184 Q150 170 180 184 Q164 192 150 186 Q136 192 120 184Z" fill={hair} />
        )}
        <path
          d="M130 194 Q150 208 170 194"
          stroke="#72211E"
          strokeWidth="5"
          fill="#F6EBD3"
          strokeLinecap="round"
        />
      </g>

      {/* anchor badge */}
      <g transform="translate(244 286)">
        <circle r="26" fill="#8F2925" stroke="#2B1D16" strokeWidth="3" />
        <g stroke="#F6EBD3" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <circle cx="0" cy="-12" r="4" />
          <path d="M0 -8 V14 M-9 -3 H9 M-13 6 Q-12 16 0 16 Q12 16 13 6" />
        </g>
      </g>
    </svg>
  );
}
