"use client";

import { useEffect, useState } from "react";
import { eventsFromCsv, type EventsData } from "./events-sheet";
import { nowInIndia } from "./events-shared";

const SHEET_URL = process.env.NEXT_PUBLIC_EVENTS_SHEET_CSV_URL;

/**
 * Events baked in at build time, refreshed from the live Google Sheet (if
 * connected) so new, edited, unpublished or deleted events show without a
 * rebuild. Any problem → keep what we have.
 */
export function useLiveEvents(initial: EventsData): EventsData {
  const [events, setEvents] = useState(initial);
  useEffect(() => {
    if (!SHEET_URL) return;
    const ctrl = new AbortController();
    fetch(SHEET_URL, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((csv) => {
        const result = eventsFromCsv(csv);
        if (result.ok) setEvents(result.events);
        else console.warn("[NUKKAD] live events ignored — sheet has problems:", result.errors);
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") console.warn("[NUKKAD] live events unavailable:", e);
      });
    return () => ctrl.abort();
  }, []);
  return events;
}

/**
 * "Now" in India. Starts from the build-time value (so server HTML and the
 * first client render match), then switches to the visitor's real clock —
 * that is what makes past events drop off even on an old build.
 */
export function useIndiaNow(buildNow: { date: string; time: string }) {
  const [now, setNow] = useState(buildNow);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- switch from build time to the real clock after mount
    setNow(nowInIndia());
    const id = window.setInterval(() => setNow(nowInIndia()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
