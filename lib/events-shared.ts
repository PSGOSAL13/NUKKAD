/**
 * Event helpers for server and client (no React hooks here — the live-sheet
 * hook is in lib/use-live-events.ts). All dates are Indian Standard Time.
 */
import type { CafeEvent } from "@/content/schema";
import type { Locale } from "@/i18n/config";
import { dateFormat } from "./intl";
import type { Dictionary } from "@/i18n/dictionaries/en";

export type { CafeEvent };
export type EventLabels = Dictionary["events"];

const TZ = "Asia/Kolkata";
const intlLocale: Record<Locale, string> = { en: "en-IN", ml: "ml-IN" };

/** Today's date and time in Trivandrum: { date: "2026-11-15", time: "14:05" }. */
export function nowInIndia(at: Date = new Date()): { date: string; time: string } {
  const parts = Object.fromEntries(
    dateFormat("en-GB", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

/** Published events that haven't finished yet, soonest first. */
export function upcomingEvents(events: CafeEvent[], now: { date: string; time: string }): CafeEvent[] {
  return events
    .filter((e) => e.status === "published")
    .filter((e) => e.date > now.date || (e.date === now.date && (e.end ?? e.start) >= now.time))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}

/** A calendar date (no time zone shifting): "2026-12-05" → Date at noon UTC. */
const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function formatEventDate(iso: string, locale: Locale, style: "long" | "short" = "long"): string {
  return dateFormat(intlLocale[locale], {
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    timeZone: "UTC",
  }).format(asDate(iso));
}

export function formatMonth(year: number, month: number, locale: Locale): string {
  return dateFormat(intlLocale[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month, 1, 12)));
}

/** Short weekday names, Monday first. */
export function weekdayNames(locale: Locale): string[] {
  const f = dateFormat(intlLocale[locale], { weekday: "short", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2024, 0, 1 + i, 12)))); // 1 Jan 2024 was a Monday
}

/** Weeks of a month for a Monday-first grid; days outside the month are null. */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}
