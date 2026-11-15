import { z } from "zod";

/**
 * Validation rules for everything in /content.
 * If a content file breaks a rule (missing English text, negative price,
 * bad phone number…), `npm run build` fails with a clear message instead of
 * publishing a broken page.
 */

const text = z.string().trim().min(1);

/** { en, ml? } — strict, so typos like `ml_` or a stray `hi` key are caught. */
export const localizedSchema = z.strictObject({
  en: text,
  ml: text.optional(),
});
const paragraphs = z.array(localizedSchema).min(1);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase-words-with-dashes");
const time24h = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'use 24-hour "HH:MM", e.g. "07:30"');
const isoDate = z.iso.date(); // "2026-12-31"
/** International format without spaces, e.g. +919876543210 */
const phoneE164 = z.string().regex(/^\+[1-9]\d{7,14}$/, "use +91XXXXXXXXXX format");

export const dayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
export type Day = z.infer<typeof dayEnum>;

/** A simple block of copy: optional small heading, title and body paragraphs. */
const sectionCopy = z.strictObject({
  eyebrow: localizedSchema.optional(),
  title: localizedSchema,
  body: paragraphs,
});

function uniqueIds<T extends { id: string }>(items: T[], ctx: z.RefinementCtx) {
  const seen = new Set<string>();
  for (const { id } of items) {
    if (seen.has(id)) ctx.addIssue({ code: "custom", message: `Duplicate id "${id}"` });
    seen.add(id);
  }
}

// ---------- Site / business details ----------

export const siteSchema = z.strictObject({
  name: localizedSchema,
  nameDevanagari: text,
  tagline: localizedSchema,
  description: localizedSchema,
  address: z.strictObject({
    line1: localizedSchema,
    line2: localizedSchema.optional(),
    city: localizedSchema,
    state: localizedSchema,
    postalCode: z.string().regex(/^\d{6}$/, "6-digit PIN code"),
    country: z.literal("IN"),
  }),
  geo: z.strictObject({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
  mapsUrl: z.url().optional(),
  landmark: localizedSchema.optional(),
  phone: phoneE164.optional(),
  whatsapp: phoneE164.optional(),
  email: z.email().optional(),
  social: z
    .array(
      z.strictObject({
        platform: z.enum(["instagram", "facebook", "youtube", "x", "google"]),
        url: z.url(),
      }),
    )
    .default([]),
  hours: z.array(z.strictObject({ days: z.array(dayEnum).min(1), open: time24h, close: time24h })).min(1),
  seating: localizedSchema,
  groupBooking: z.strictObject({
    minPeople: z.number().int().min(2),
    note: localizedSchema,
  }),
  fssaiLicence: z
    .string()
    .regex(/^\d{14}$/, "14-digit FSSAI number")
    .optional(),
});
export type SiteContent = z.infer<typeof siteSchema>;

// ---------- Menu ----------

export const menuItemSchema = z.strictObject({
  id: slug,
  name: localizedSchema,
  description: localizedSchema.optional(),
  /** Price in whole rupees. */
  price: z.number().int().positive(),
  diet: z.enum(["veg", "vegan", "egg", "nonveg"]),
  tags: z.array(z.enum(["signature", "new", "spicy", "seasonal"])).default([]),
  /** Show in the rotating preview on the home page. */
  featured: z.boolean().default(false),
  /** Set to false to hide an item temporarily without deleting it. */
  available: z.boolean().default(true),
});

export const menuCategorySchema = z.strictObject({
  id: slug,
  name: localizedSchema,
  description: localizedSchema.optional(),
  items: z.array(menuItemSchema).min(1),
});

export const menuSchema = z
  .array(menuCategorySchema)
  .min(1)
  .superRefine((categories, ctx) => {
    uniqueIds(categories, ctx);
    uniqueIds(
      categories.flatMap((c) => c.items),
      ctx,
    );
  });
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;

// ---------- Home page copy ----------

export const homeSchema = z.strictObject({
  hero: z.strictObject({ kicker: localizedSchema, title: localizedSchema, subtitle: localizedSchema }),
  owner: z.strictObject({
    name: localizedSchema,
    role: localizedSchema,
    greeting: localizedSchema,
    message: paragraphs,
  }),
  sitAndStay: sectionCopy.extend({
    points: z.array(z.strictObject({ title: localizedSchema, body: localizedSchema })).min(1),
  }),
  signatureChai: sectionCopy.extend({
    ritual: z.array(z.strictObject({ title: localizedSchema, body: localizedSchema })).min(1),
  }),
  menuPreview: sectionCopy,
  story: sectionCopy,
  baatein: sectionCopy,
  events: sectionCopy,
  gallery: sectionCopy,
  visit: sectionCopy,
});
export type HomeContent = z.infer<typeof homeSchema>;

// ---------- Our Story ----------

export const storySchema = z.strictObject({
  intro: sectionCopy,
  chapters: z.array(z.strictObject({ id: slug, title: localizedSchema, body: paragraphs })).min(1),
});

// ---------- Nukkad Ki Baatein (stories & conversations written by the café) ----------

export const baateinSchema = z.strictObject({
  intro: sectionCopy,
  entries: z
    .array(
      z.strictObject({
        id: slug,
        title: localizedSchema,
        excerpt: localizedSchema,
        body: paragraphs,
        date: isoDate.optional(),
      }),
    )
    .superRefine(uniqueIds),
});

// ---------- Events (informational only — no registration) ----------

export const eventsSchema = z
  .array(
    z.strictObject({
      id: slug,
      title: localizedSchema,
      description: localizedSchema,
      /** Human-readable timing, e.g. "Every Friday, 7 pm". */
      schedule: localizedSchema,
      /** For one-off events: hidden automatically after this date (on the next build). */
      endsOn: isoDate.optional(),
    }),
  )
  .superRefine(uniqueIds);

// ---------- Café atmosphere gallery ----------

export const gallerySchema = z
  .array(
    z.strictObject({
      id: slug,
      /** Path under /public, e.g. "/images/gallery/evening-counter.jpg". Leave out until the photo exists. */
      src: z
        .string()
        .regex(/^\/[\w/.-]+\.(jpe?g|png|webp|avif)$/i)
        .optional(),
      alt: localizedSchema,
      caption: localizedSchema.optional(),
    }),
  )
  .superRefine(uniqueIds);
