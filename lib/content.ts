import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { baateinData } from "@/content/baatein";
import { eventsData } from "@/content/events";
import { galleryData } from "@/content/gallery";
import { homeData } from "@/content/home";
import { locationData } from "@/content/location";
import { menuData } from "@/content/menu";
import {
  baateinSchema,
  eventsSchema,
  gallerySchema,
  homeSchema,
  locationSchema,
  menuSchema,
  type MenuItem,
  openingSchema,
  ownerCharacterSchema,
  siteSchema,
  storySchema,
} from "@/content/schema";
import { openingData } from "@/content/opening";
import { ownerCharacterData } from "@/content/owner-character";
import { siteData } from "@/content/site";
import { storyData } from "@/content/story";

/**
 * Validated content. Parsing happens once at build time; any mistake in
 * /content stops the build with a readable error listing what is wrong.
 */
function load<T extends z.ZodType>(name: string, schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in content/${name}.ts:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const site = load("site", siteSchema, siteData);
/**
 * Menu source: the Google Sheet copy saved by scripts/sync-menu.ts if one
 * exists, otherwise the built-in content/menu.ts.
 */
const sheetMenuFile = path.join(process.cwd(), "content", "generated", "menu-from-sheet.json");
export const menuOrigin: "sheet" | "file" = fs.existsSync(sheetMenuFile) ? "sheet" : "file";
export const menu = load(
  menuOrigin === "sheet" ? "generated/menu-from-sheet.json (Google Sheet)" : "menu",
  menuSchema,
  menuOrigin === "sheet" ? JSON.parse(fs.readFileSync(sheetMenuFile, "utf8")) : menuData,
);
export const home = load("home", homeSchema, homeData);
export const story = load("story", storySchema, storyData);
export const baatein = load("baatein", baateinSchema, baateinData);
export const gallery = load("gallery", gallerySchema, galleryData);
export const opening = load("opening", openingSchema, openingData);
export const ownerCharacter = load("owner-character", ownerCharacterSchema, ownerCharacterData);
export const location = load("location", locationSchema, locationData);

const menuById = new Map(menu.flatMap((c) => c.items).map((i) => [i.id, i] as const));

type SignatureEntry = (typeof home.signature.items)[number];

/**
 * The three signature items, resolved against the current menu. An item that
 * is missing (e.g. removed from the sheet) or hidden is left out with a
 * warning rather than breaking the build.
 */
export const signatureItems: {
  item: MenuItem;
  illustration: SignatureEntry["illustration"];
  note: SignatureEntry["note"];
}[] = home.signature.items.flatMap((s) => {
  const item = menuById.get(s.menuItemId);
  if (!item || item.status === "hidden") {
    console.warn(
      `⚠  signature item "${s.menuItemId}" is ${item ? "hidden" : "not on the menu"} — left out of the home page trio.`,
    );
    return [];
  }
  return [{ item, illustration: s.illustration, note: s.note }];
});

const today = new Date().toISOString().slice(0, 10);
/** Events still current at build time. */
export const events = load("events", eventsSchema, eventsData).filter((e) => !e.endsOn || e.endsOn >= today);
