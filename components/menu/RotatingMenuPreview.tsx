"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { featuredItems, type MenuData, type MenuLabels } from "@/lib/menu-shared";
import { useLiveMenu } from "@/lib/use-live-menu";
import { MenuItemCard } from "./MenuItemCard";

const VISIBLE = 6;
const INTERVAL_MS = 6000;

/**
 * The home page's rotating selection of six products: items marked
 * `featured` that are currently available (sold-out and hidden items are
 * skipped). If more than six are featured, one card rotates every few
 * seconds. Rotation pauses on hover/focus, has a pause button (WCAG 2.2.2),
 * and never runs for reduced-motion users. Follows the live Google Sheet.
 */
export function RotatingMenuPreview({
  initialMenu,
  locale,
  labels,
  pauseLabel,
  playLabel,
  controlClassName = "text-ink-muted hover:text-red",
}: {
  initialMenu: MenuData;
  locale: Locale;
  labels: MenuLabels;
  pauseLabel: string;
  playLabel: string;
  /** Colours for the pause/play control (depends on the section background). */
  controlClassName?: string;
}) {
  const menu = useLiveMenu(initialMenu);
  const items = featuredItems(menu);
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

  if (items.length === 0) return null;
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
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ item, illustration }) => (
          <li key={item.id} className="motion-safe:animate-[fade-in_400ms_var(--ease-pour)]">
            <MenuItemCard item={item} illustration={illustration} locale={locale} labels={labels} />
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
