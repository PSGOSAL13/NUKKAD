/**
 * Pulls the menu and events from the owner's Google Sheet at build time.
 * Runs automatically before `npm run build` and `npm run dev`.
 *
 * For each of:
 *   NEXT_PUBLIC_MENU_SHEET_CSV_URL    → content/generated/menu-from-sheet.json
 *   NEXT_PUBLIC_EVENTS_SHEET_CSV_URL  → content/generated/events-from-sheet.json
 *
 *  - not set → nothing to do; the site uses content/menu.ts / content/events.ts.
 *  - read and valid → saved and used by the build.
 *  - unreachable or has mistakes → problems listed (with sheet row numbers),
 *    and the last good copy (or the built-in file) is kept. A typo in the
 *    sheet never breaks the build.
 *
 * Usage:  node scripts/sync-sheets.ts              (Node 24 runs TypeScript directly)
 *         node scripts/sync-sheets.ts --template   (write the CSV templates to import into Google Sheets)
 */
import fs from "node:fs";
import path from "node:path";
import { eventsSchema, menuSchema } from "../content/schema.ts";
import { eventsFromCsv, eventsToCsv } from "../lib/events-sheet.ts";
import { menuFromCsv, menuToCsv } from "../lib/menu-sheet.ts";

const root = path.resolve(import.meta.dirname, "..");
const generated = (f: string) => path.join(root, "content", "generated", f);

if (process.argv.includes("--template")) {
  const { menuData } = await import("../content/menu.ts");
  const { eventsData } = await import("../content/events.ts");
  fs.writeFileSync(
    path.join(root, "content", "menu-sheet-template.csv"),
    menuToCsv(menuSchema.parse(menuData)),
  );
  fs.writeFileSync(
    path.join(root, "content", "events-sheet-template.csv"),
    eventsToCsv(eventsSchema.parse(eventsData)),
  );
  console.log("sheets: wrote content/menu-sheet-template.csv and content/events-sheet-template.csv");
  process.exit(0);
}

loadEnvLocal();

await sync({
  label: "menu",
  envVar: "NEXT_PUBLIC_MENU_SHEET_CSV_URL",
  outFile: generated("menu-from-sheet.json"),
  fallback: "content/menu.ts",
  convert: (csv) => {
    const r = menuFromCsv(csv);
    return r.ok ? { ok: true, data: r.menu, count: r.menu.reduce((n, c) => n + c.items.length, 0) } : r;
  },
});
await sync({
  label: "events",
  envVar: "NEXT_PUBLIC_EVENTS_SHEET_CSV_URL",
  outFile: generated("events-from-sheet.json"),
  fallback: "content/events.ts",
  convert: (csv) => {
    const r = eventsFromCsv(csv);
    return r.ok ? { ok: true, data: r.events, count: r.events.length } : r;
  },
});

type Converted = { ok: true; data: unknown; count: number } | { ok: false; errors: string[] };

async function sync(o: {
  label: string;
  envVar: string;
  outFile: string;
  fallback: string;
  convert: (csv: string) => Converted;
}) {
  const url = process.env[o.envVar]?.trim();
  if (!url) {
    if (fs.existsSync(o.outFile)) fs.rmSync(o.outFile);
    console.log(`${o.label}: no Google Sheet connected — using ${o.fallback}`);
    return;
  }
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = o.convert(await res.text());
    if (!result.ok) {
      console.warn(
        `\n⚠  ${o.label}: the Google Sheet has ${result.errors.length} problem(s) — keeping the previous ${o.label}:`,
      );
      for (const e of result.errors.slice(0, 20)) console.warn(`   • ${e}`);
      console.warn("");
      return;
    }
    fs.mkdirSync(path.dirname(o.outFile), { recursive: true });
    fs.writeFileSync(o.outFile, JSON.stringify(result.data, null, 2) + "\n");
    console.log(`${o.label}: synced ${result.count} row(s) from the Google Sheet.`);
  } catch (err) {
    console.warn(
      `\n⚠  ${o.label}: could not read the Google Sheet (${(err as Error).message}) — keeping the previous ${o.label}.\n`,
    );
  }
}

/** Minimal .env.local reader so local builds see the same settings as the host. */
function loadEnvLocal() {
  const f = path.join(root, ".env.local");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
