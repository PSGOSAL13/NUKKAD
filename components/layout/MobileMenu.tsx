"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NavLinks, type NavItem } from "./NavLinks";

/** Full-width drop-down navigation for small screens. */
export function MobileMenu({
  items,
  openLabel,
  closeLabel,
}: {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-md border-2 border-ink bg-yellow shadow-print-sm"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h11" />}
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-y-2 border-ink bg-paper texture-paper px-4 py-4 shadow-[0_8px_0_0_rgb(43_29_22/0.12)]"
      >
        <NavLinks items={items} orientation="vertical" onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
