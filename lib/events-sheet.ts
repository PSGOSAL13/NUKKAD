/**
 * Google Sheet "Events" tab ⇄ events. Used at build time (Node) and for the
 * live refresh in the browser. No Next.js / "@/" imports, so plain Node can run it.
 * One row per event; delete a row to delete the event. See OWNER-GUIDE.md.
 */
import { z } from "zod";
import { eventsSchema } from "../content/schema.ts";
import { parseCsv } from "./menu-sheet.ts";

export type EventsData = z.infer<typeof eventsSchema>;

export const EVENT_COLUMNS = [
  "id",
  "status",
  "type",
  "theme",
  "title_en",
  "title_ml",
  "description_en",
  "description_ml",
  "date",
  "start",
  "end",
  "host_en",
  "host_ml",
  "photo",
  "photo_alt_en",
  "photo_alt_ml",
  "sample",
] as const;
type Column = (typeof EVENT_COLUMNS)[number];

const clean = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return t === "" ? undefined : t;
};
const localized = (en?: string, ml?: string) => (en ? { en, ...(ml ? { ml } : {}) } : undefined);
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const pad = (n: number | string) => String(n).padStart(2, "0");

/** "2026-12-05", "05/12/2026", "5-12-2026" (day first, as in India) → "2026-12-05". */
export function normaliseDate(v?: string): string | undefined {
  if (!v) return undefined;
  const iso = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return `${iso[1]}-${pad(iso[2])}-${pad(iso[3])}`;
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) return `${dmy[3]}-${pad(dmy[2])}-${pad(dmy[1])}`;
  return v; // let validation explain
}

/** "18:00", "6:00 PM", "6 pm", "6.30pm" → "18:00" / "18:30". */
export function normaliseTime(v?: string): string | undefined {
  if (!v) return undefined;
  const m = v
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/);
  if (!m) return v;
  let h = Number(m[1]);
  if (m[3] === "pm" && h < 12) h += 12;
  if (m[3] === "am" && h === 12) h = 0;
  return `${pad(h)}:${m[2] ?? "00"}`;
}

function normaliseStatus(v?: string) {
  if (!v) return undefined;
  if (/^(published|publish|yes|live|on|show)$/i.test(v)) return "published";
  if (/^(draft|unpublished|unpublish|no|off|hidden|hide)$/i.test(v)) return "draft";
  return v.toLowerCase();
}

function normaliseType(v?: string) {
  if (!v) return undefined;
  if (/^(storytelling|story|stories|owner)$/i.test(v)) return "storytelling";
  if (/^(community|guest|group)$/i.test(v)) return "community";
  if (/^(cafe|café|other)$/i.test(v)) return "cafe";
  return v.toLowerCase();
}

export type EventsSheetResult = { ok: true; events: EventsData } | { ok: false; errors: string[] };

export function eventsFromCsv(text: string): EventsSheetResult {
  const rows = parseCsv(text);
  if (rows.length < 1)
    return { ok: false, errors: ["The events sheet is empty (needs at least a header row)."] };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = (["title_en", "date", "start"] as Column[]).filter((c) => !header.includes(c));
  if (missing.length) return { ok: false, errors: [`Missing column(s): ${missing.join(", ")}`] };
  const get = (r: string[], c: Column) => clean(r[header.indexOf(c)]);

  const input = rows.slice(1).map((r, i) => {
    const title = get(r, "title_en") ?? "";
    const date = normaliseDate(get(r, "date"));
    const theme = get(r, "theme");
    return {
      id: get(r, "id") ?? slugify(`${title}-${date ?? i + 2}`),
      status: normaliseStatus(get(r, "status")),
      type: normaliseType(get(r, "type")) ?? (theme ? "storytelling" : "community"),
      theme: theme ? slugify(theme) : undefined,
      title: localized(title, get(r, "title_ml")),
      description: localized(get(r, "description_en"), get(r, "description_ml")),
      date,
      start: normaliseTime(get(r, "start")),
      end: normaliseTime(get(r, "end")),
      host: localized(get(r, "host_en"), get(r, "host_ml")),
      photo: get(r, "photo"),
      photoAlt: localized(get(r, "photo_alt_en"), get(r, "photo_alt_ml")),
      sample: /^(y|yes|true|1)$/i.test(get(r, "sample") ?? ""),
    };
  });

  const parsed = eventsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((iss) => {
        const [i, ...rest] = iss.path;
        return typeof i === "number"
          ? `Row ${i + 2}: ${rest.join(".") || "event"} — ${iss.message}`
          : `${iss.path.join(".")}: ${iss.message}`;
      }),
    };
  }
  return { ok: true, events: parsed.data };
}

export function eventsToCsv(events: EventsData): string {
  const cell = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [EVENT_COLUMNS.join(",")];
  for (const e of events) {
    const v: Record<Column, string> = {
      id: e.id,
      status: e.status,
      type: e.type,
      theme: e.theme ?? "",
      title_en: e.title.en,
      title_ml: e.title.ml ?? "",
      description_en: e.description.en,
      description_ml: e.description.ml ?? "",
      date: e.date,
      start: e.start,
      end: e.end ?? "",
      host_en: e.host?.en ?? "",
      host_ml: e.host?.ml ?? "",
      photo: e.photo ?? "",
      photo_alt_en: e.photoAlt?.en ?? "",
      photo_alt_ml: e.photoAlt?.ml ?? "",
      sample: e.sample ? "yes" : "",
    };
    lines.push(EVENT_COLUMNS.map((c) => cell(v[c])).join(","));
  }
  return lines.join("\n") + "\n";
}
