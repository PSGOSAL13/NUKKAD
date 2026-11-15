"use client";

import { useEffect, useState } from "react";
import { MenuItemCard, type MenuItemView } from "./MenuItemCard";

const VISIBLE = 6;
const INTERVAL_MS = 6000;

/**
 * Shows six featured items. If more than six are featured, one card rotates
 * every few seconds. Rotation pauses on hover/focus, can be paused with the
 * button (WCAG 2.2.2), and never runs for reduced-motion users.
 */
export function RotatingMenuPreview({
  items,
  pauseLabel,
  playLabel,
  controlClassName = "text-ink-muted hover:text-red",
}: {
  items: MenuItemView[];
  pauseLabel: string;
  playLabel: string;
  /** Colours for the pause/play control (depends on the section background). */
  controlClassName?: string;
}) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rotates = items.length > VISIBLE;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!rotates || paused || hovering || reducedMotion) return;
    const id = window.setInterval(() => setOffset((o) => (o + 1) % items.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [rotates, paused, hovering, reducedMotion, items.length]);

  const visible = Array.from(
    { length: Math.min(VISIBLE, items.length) },
    (_, i) => items[(offset + i) % items.length],
  );

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <ul
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-live={rotates && !paused ? "off" : undefined}
      >
        {visible.map((item) => (
          <li key={item.id} className="motion-safe:animate-[fade-in_400ms_var(--ease-pour)]">
            <MenuItemCard item={item} layout="card" />
          </li>
        ))}
      </ul>
      {rotates && !reducedMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className={`mt-4 text-sm font-semibold underline underline-offset-4 ${controlClassName}`}
        >
          {paused ? playLabel : pauseLabel}
        </button>
      )}
    </div>
  );
}
