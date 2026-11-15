import "server-only";
import { z } from "zod";
import { baateinData } from "@/content/baatein";
import { eventsData } from "@/content/events";
import { galleryData } from "@/content/gallery";
import { homeData } from "@/content/home";
import { menuData } from "@/content/menu";
import {
  baateinSchema,
  eventsSchema,
  gallerySchema,
  homeSchema,
  menuSchema,
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
export const menu = load("menu", menuSchema, menuData);
export const home = load("home", homeSchema, homeData);
export const story = load("story", storySchema, storyData);
export const baatein = load("baatein", baateinSchema, baateinData);
export const gallery = load("gallery", gallerySchema, galleryData);
export const opening = load("opening", openingSchema, openingData);
export const ownerCharacter = load("owner-character", ownerCharacterSchema, ownerCharacterData);

const today = new Date().toISOString().slice(0, 10);
/** Events still current at build time. */
export const events = load("events", eventsSchema, eventsData).filter((e) => !e.endsOn || e.endsOn >= today);

/** Available items marked `featured`, for the home page preview. */
export const featuredMenuItems = menu.flatMap((c) => c.items).filter((i) => i.featured && i.available);
