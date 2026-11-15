"use client";

import { useEffect, useState } from "react";

/**
 * Branded loading indicator for the 3D opening: the kulhad with rising steam.
 * Appears only if loading takes longer than ~half a second (no flash on fast
 * devices), never blocks anything (the illustrated street and the greeting
 * are already usable), and can be skipped to stay on the simple version.
 */
export function BrewingLoader({
  label,
  skipLabel,
  onSkip,
}: {
  label: string;
  skipLabel: string;
  onSkip: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 500);
    return () => window.clearTimeout(id);
  }, []);
  if (!visible) return null;
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-2 rounded-full border-2 border-ink bg-cream/95 py-1 pr-1.5 pl-2 shadow-print-sm motion-safe:animate-[fade-in_300ms_ease-out]"
    >
      <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
        <g fill="none" stroke="#8F2925" strokeWidth="2.5" strokeLinecap="round">
          {[14, 20, 26].map((x, i) => (
            <path
              key={x}
              d={`M${x} 17c-3-3 3-5 0-8`}
              className="motion-safe:animate-steam"
              style={{ animationDelay: `${i * 0.35}s`, transformBox: "fill-box", transformOrigin: "bottom" }}
            />
          ))}
        </g>
        <path d="M9 19h22l-3 16H12z" fill="#8F2925" />
        <ellipse cx="20" cy="19" rx="11" ry="2.6" fill="#72211E" />
        <ellipse cx="20" cy="19.3" rx="9" ry="1.8" fill="#E9B83E" />
        <path d="M10.5 25.5q9.5 3 19 0" stroke="#E9B83E" strokeWidth="1.6" fill="none" />
      </svg>
      <span className="font-heading text-sm font-semibold text-ink">{label}</span>
      <button
        type="button"
        onClick={onSkip}
        className="rounded-full px-2 py-1 text-xs font-semibold text-red underline underline-offset-2 hover:bg-yellow-soft"
      >
        {skipLabel}
      </button>
    </div>
  );
}
