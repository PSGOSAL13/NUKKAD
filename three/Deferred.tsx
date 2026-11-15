"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Mounts its children only after the browser has painted the first frames
 * and is idle — so heavy, not-yet-visible parts of the scene (the café
 * interior behind the shutter) don't block the opening from appearing or the
 * page from responding.
 */
export function Deferred({ children, timeout = 1500 }: { children: ReactNode; timeout?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    // Two animation frames → the first scene frame has been drawn; then wait for idle.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (w.requestIdleCallback) w.requestIdleCallback(() => !cancelled && setReady(true), { timeout });
        else window.setTimeout(() => !cancelled && setReady(true), 200);
      }),
    );
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [timeout]);
  return ready ? <>{children}</> : null;
}
