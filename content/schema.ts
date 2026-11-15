import { z } from "zod";

/**
 * Validation rules for everything in /content.
 * If a content file breaks a rule (missing English text, negative price,
 * bad phone number…), `npm run build` fails with a clear message instead of
 * publishing a broken page.
 */

const text = z.string().trim().min(1);

export const localizedSchema = z.object({
  en: text,
  hi: text.optional(),
  ml: text.optional(),
});

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase-words-with-dashes");

const time24h = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'use 24-hour "HH:MM", e.g. "07:30"');

/** International format without spaces, e.g. +919876543210 */
const phoneE164 = z.string().regex(/^\+[1-9]\d{7,14}$/, "use +91XXXXXXXXXX format");

export const dayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
export type Day = z.infer<typeof dayEnum>;

// ---------- Site / business details ----------

export const siteSchema = z.object({
  name: localizedSchema,
  tagline: localizedSchema,
  description: localizedSchema,
  address: z.object({
    line1: localizedSchema,
    line2: localizedSchema.optional(),
    city: localizedSchema,
    state: localizedSchema,
    postalCode: z.string().regex(/^\d{6}$/, "6-digit PIN code"),
    country: z.literal("IN"),
  }),
  geo: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
  mapsUrl: z.url().optional(),
  phone: phoneE164.optional(),
  whatsapp: phoneE164.optional(),
  email: z.email().optional(),
  social: z
    .array(
      z.object({
        platform: z.enum(["instagram", "facebook", "youtube", "x", "google"]),
        url: z.url(),
      }),
    )
    .default([]),
  hours: z
    .array(
      z.object({
        days: z.array(dayEnum).min(1),
        open: time24h,
        close: time24h,
      }),
    )
    .min(1),
  fssaiLicence: z
    .string()
    .regex(/^\d{14}$/, "14-digit FSSAI number")
    .optional(),
});

export type SiteContent = z.infer<typeof siteSchema>;

// ---------- Menu ----------

export const menuItemSchema = z.object({
  id: slug,
  name: localizedSchema,
  description: localizedSchema.optional(),
  /** Price in whole rupees. */
  price: z.number().int().positive(),
  diet: z.enum(["veg", "vegan", "egg", "nonveg"]),
  tags: z.array(z.enum(["signature", "new", "spicy", "seasonal"])).default([]),
  /** Set to false to hide an item temporarily without deleting it. */
  available: z.boolean().default(true),
});

export const menuCategorySchema = z.object({
  id: slug,
  name: localizedSchema,
  description: localizedSchema.optional(),
  items: z.array(menuItemSchema).min(1),
});

export const menuSchema = z
  .array(menuCategorySchema)
  .min(1)
  .superRefine((categories, ctx) => {
    const seen = new Set<string>();
    for (const id of categories.flatMap((c) => [`category:${c.id}`, ...c.items.map((i) => `item:${i.id}`)])) {
      if (seen.has(id)) ctx.addIssue({ code: "custom", message: `Duplicate id "${id}"` });
      seen.add(id);
    }
  });

export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
