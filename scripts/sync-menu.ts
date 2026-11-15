/**
 * Pulls the menu from the owner's Google Sheet at build time.
 * Runs automatically before `npm run build` (and `npm run dev`).
 *
 *  - NEXT_PUBLIC_MENU_SHEET_CSV_URL not set → nothing to do; the site uses content/menu.ts.
 *  - Sheet read and valid → saved to content/generated/menu-from-sheet.json (used by the build).
 *  - Sheet unreachable or has mistakes → the problems are listed, and the
 *    last good copy (or content/menu.ts) is kept. The build never breaks
 *    because of a typo in the sheet.
 *
 * Usage:  node scripts/sync-menu.ts            (Node 24 runs TypeScript directly)
 *         node scripts/sync-menu.ts --template (write content/menu-sheet-template.csv)
 */
import fs from "node:fs";
import path from "node:path";
import { menuSchema } from "../content/schema.ts";
import { menuFromCsv, menuToCsv } from "../lib/menu-sheet.ts";

const root = path.resolve(import.meta.dirname, "..");
const outFile = path.join(root, "content", "generated", "menu-from-sheet.json");

if (process.argv.includes("--template")) {
  // Export the built-in menu as a CSV the owner can import into Google Sheets.
  const { menuData } = await import("../content/menu.ts");
  const csv = menuToCsv(menuSchema.parse(menuData));
  const target = path.join(root, "content", "menu-sheet-template.csv");
  fs.writeFileSync(target, csv);
  console.log(`menu: wrote ${path.relative(root, target)}`);
  process.exit(0);
}

loadEnvLocal();
const url = process.env.NEXT_PUBLIC_MENU_SHEET_CSV_URL?.trim();
if (!url) {
  if (fs.existsSync(outFile)) fs.rmSync(outFile);
  console.log("menu: no Google Sheet connected — using content/menu.ts");
  process.exit(0);
}

try {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const result = menuFromCsv(await res.text());
  if (!result.ok) {
    console.warn(
      `\n⚠  menu: the Google Sheet has ${result.errors.length} problem(s) — keeping the previous menu:`,
    );
    for (const e of result.errors.slice(0, 20)) console.warn(`   • ${e}`);
    console.warn("");
  } else {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(result.menu, null, 2) + "\n");
    const items = result.menu.reduce((n, c) => n + c.items.length, 0);
    console.log(`menu: synced ${items} product(s) from the Google Sheet.`);
  }
} catch (err) {
  console.warn(
    `\n⚠  menu: could not read the Google Sheet (${(err as Error).message}) — keeping the previous menu.\n`,
  );
}

/** Minimal .env.local reader so local builds see the same setting as the host. */
function loadEnvLocal() {
  const f = path.join(root, ".env.local");
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
