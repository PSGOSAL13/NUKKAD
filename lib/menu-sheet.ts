/**
 * Google Sheet ⇄ menu conversion. Used by:
 *  - scripts/sync-menu.ts   (at build time, Node)
 *  - the live menu refresh  (in the browser)
 * Keep this file free of Next.js / "@/" imports so plain Node can run it.
 *
 * Sheet layout: one row per product. Category columns only need filling on
 * the first row of each category. See OWNER-GUIDE.md for the owner's guide.
 */
import { z } from "zod";
import { menuSchema } from "../content/schema.ts";

export type MenuData = z.infer<typeof menuSchema>;
type MenuInput = z.input<typeof menuSchema>;

export const SHEET_COLUMNS = [
  "category_id",
  "category_en",
  "category_ml",
  "category_description_en",
  "category_description_ml",
  "category_illustration",
  "id",
  "name_en",
  "name_ml",
  "description_en",
  "description_ml",
  "details_en",
  "details_ml",
  "price",
  "diet",
  "highlights",
  "status",
  "featured",
  "photo",
  "photo_alt_en",
  "photo_alt_ml",
  "illustration",
  "sample",
] as const;
type Column = (typeof SHEET_COLUMNS)[number];

// ---------- CSV ----------

/** RFC 4180 CSV parser (quotes, escaped quotes, commas and newlines in cells). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function csvCell(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

// ---------- Sheet → menu ----------

const clean = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return t === "" ? undefined : t;
};
const localized = (en?: string, ml?: string) => (en ? { en, ...(ml ? { ml } : {}) } : undefined);
const yes = (v?: string) => !!v && /^(y|yes|true|1|✓|x)$/i.test(v);
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function normaliseStatus(v?: string) {
  if (!v) return undefined;
  const s = v.toLowerCase().replace(/[\s_]+/g, "-");
  if (/^(sold-?out|out|finished|khatam)$/.test(s)) return "sold-out";
  if (/^(hide|hidden|off|no)$/.test(s)) return "hidden";
  if (/^(available|yes|on|in-stock)$/.test(s)) return "available";
  return s; // let validation report it
}

export type SheetResult = { ok: true; menu: MenuData } | { ok: false; errors: string[] };

/** Convert sheet CSV text into a validated menu. Row numbers in errors match the sheet. */
export function menuFromCsv(text: string): SheetResult {
  const rows = parseCsv(text);
  if (rows.length < 2)
    return { ok: false, errors: ["The sheet is empty (needs a header row and at least one product)."] };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = (["category_id", "name_en", "price"] as Column[]).filter((c) => !header.includes(c));
  if (missing.length) return { ok: false, errors: [`Missing column(s): ${missing.join(", ")}`] };
  const get = (r: string[], c: Column) => clean(r[header.indexOf(c)]);

  const categories: (MenuInput[number] & { _row: number })[] = [];
  const errors: string[] = [];
  rows.slice(1).forEach((r, i) => {
    const rowNo = i + 2;
    const catId = get(r, "category_id");
    if (!catId) {
      errors.push(`Row ${rowNo}: category_id is empty.`);
      return;
    }
    let cat = categories.find((c) => c.id === catId);
    if (!cat) {
      cat = {
        _row: rowNo,
        id: catId,
        name: localized(get(r, "category_en") ?? catId, get(r, "category_ml"))!,
        description: localized(get(r, "category_description_en"), get(r, "category_description_ml")),
        illustration: (get(r, "category_illustration") ?? "chai") as never,
        items: [],
      };
      categories.push(cat);
    }
    const name = get(r, "name_en");
    const priceRaw = get(r, "price");
    const price = priceRaw ? Number(priceRaw.replace(/[^\d.]/g, "")) : NaN;
    if (!priceRaw || Number.isNaN(price) || priceRaw.replace(/[^\d.]/g, "") === "") {
      errors.push(`Row ${rowNo}: price "${priceRaw ?? ""}" is not a number (write it like 30 or ₹30).`);
      return;
    }
    cat.items.push({
      id: get(r, "id") ?? slugify(name ?? `row-${rowNo}`),
      name: localized(name ?? "", get(r, "name_ml"))!,
      description: localized(get(r, "description_en"), get(r, "description_ml")),
      details: localized(get(r, "details_en"), get(r, "details_ml")),
      price,
      diet: get(r, "diet")?.toLowerCase() as never,
      tags: (get(r, "highlights") ?? "")
        .split(/[,;]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean) as never,
      status: normaliseStatus(get(r, "status")) as never,
      featured: yes(get(r, "featured")),
      photo: get(r, "photo"),
      photoAlt: localized(get(r, "photo_alt_en"), get(r, "photo_alt_ml")),
      illustration: get(r, "illustration") as never,
      sample: yes(get(r, "sample")),
    });
  });
  if (errors.length) return { ok: false, errors };

  const input = categories.map(({ _row, ...c }) => {
    void _row;
    return c;
  });
  const parsed = menuSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((iss) => {
        // Translate "[c].items[i].field" into a sheet row number where possible.
        const [ci, , ii, ...rest] = iss.path;
        const cat = typeof ci === "number" ? categories[ci] : undefined;
        if (cat && typeof ii === "number") {
          const row = rowOfItem(rows, header, cat.id, ii);
          return `Row ${row}: ${rest.join(".") || "item"} — ${iss.message}`;
        }
        return `${iss.path.join(".")}: ${iss.message}`;
      }),
    };
  }
  return { ok: true, menu: parsed.data };
}

function rowOfItem(rows: string[][], header: string[], catId: string, index: number): number {
  let n = -1;
  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][header.indexOf("category_id")] ?? "").trim() === catId && ++n === index) return i + 1;
  }
  return 0;
}

// ---------- menu → sheet (template export) ----------

export function menuToCsv(menu: MenuData): string {
  const lines = [SHEET_COLUMNS.join(",")];
  for (const c of menu) {
    c.items.forEach((it, i) => {
      const first = i === 0;
      const v: Record<Column, string> = {
        category_id: c.id,
        category_en: first ? c.name.en : "",
        category_ml: first ? (c.name.ml ?? "") : "",
        category_description_en: first ? (c.description?.en ?? "") : "",
        category_description_ml: first ? (c.description?.ml ?? "") : "",
        category_illustration: first ? c.illustration : "",
        id: it.id,
        name_en: it.name.en,
        name_ml: it.name.ml ?? "",
        description_en: it.description?.en ?? "",
        description_ml: it.description?.ml ?? "",
        details_en: it.details?.en ?? "",
        details_ml: it.details?.ml ?? "",
        price: String(it.price),
        diet: it.diet ?? "",
        highlights: it.tags.join(", "),
        status: it.status,
        featured: it.featured ? "yes" : "",
        photo: it.photo ?? "",
        photo_alt_en: it.photoAlt?.en ?? "",
        photo_alt_ml: it.photoAlt?.ml ?? "",
        illustration: it.illustration ?? "",
        sample: it.sample ? "yes" : "",
      };
      lines.push(SHEET_COLUMNS.map((col) => csvCell(v[col])).join(","));
    });
  }
  return lines.join("\n") + "\n";
}
