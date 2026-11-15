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
  /** Required: the Call and WhatsApp buttons depend on these. */
  phone: phoneE164,
  whatsapp: phoneE164,
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

// ---------- Illustrations (hand-drawn SVGs in components/illustrations) ----------

export const foodIllustration = z.enum(["chai", "samosa", "jalebi", "bun-maska", "pakora"]);
export type FoodIllustration = z.infer<typeof foodIllustration>;
export const sceneIllustration = z.enum(["counter", "radio", "bicycle", "lamps", "books", "carrom"]);
export type SceneIllustration = z.infer<typeof sceneIllustration>;

// ---------- Home page copy ----------

export const homeSchema = z.strictObject({
  /** The feeling the whole page communicates. */
  feeling: localizedSchema,
  hero: z.strictObject({ kicker: localizedSchema, title: localizedSchema, subtitle: localizedSchema }),
  /** 1 · Welcome: owner's greeting + how the café works. */
  welcome: sectionCopy.extend({
    greeting: localizedSchema,
    points: z.array(z.strictObject({ title: localizedSchema, body: localizedSchema })).min(1),
  }),
  /** 2 · Signature experience: three hero items (by menu id) + the rotating preview. */
  signature: sectionCopy.extend({
    items: z
      .array(z.strictObject({ menuItemId: slug, illustration: foodIllustration, note: localizedSchema }))
      .length(3),
    previewTitle: localizedSchema,
  }),
  story: sectionCopy,
  atmosphere: sectionCopy,
  baatein: sectionCopy,
  events: sectionCopy,
  location: sectionCopy,
  contact: sectionCopy,
});
export type HomeContent = z.infer<typeof homeSchema>;

// ---------- Our Story (told as a conversation over chai) ----------

export const storySchema = z.strictObject({
  intro: sectionCopy,
  founder: z.strictObject({ name: localizedSchema, role: localizedSchema }),
  /** Questions a guest might ask over chai, answered by the founder. */
  conversation: z
    .array(z.strictObject({ id: slug, question: localizedSchema, answer: paragraphs }))
    .min(1)
    .superRefine(uniqueIds),
});

// ---------- Location & illustrated map ----------

export const locationSchema = z.strictObject({
  /** False until the premises are final — shows an "address to be confirmed" note. */
  confirmed: z.boolean(),
  /** Café pin on the illustrated map, in % of map width/height. */
  cafe: z.strictObject({ x: z.number().min(5).max(95), y: z.number().min(5).max(95) }),
  landmarks: z
    .array(
      z.strictObject({
        id: slug,
        label: localizedSchema,
        kind: z.enum([
          "temple",
          "church",
          "mosque",
          "bus",
          "rail",
          "college",
          "park",
          "beach",
          "market",
          "hospital",
        ]),
        x: z.number().min(3).max(97),
        y: z.number().min(3).max(97),
        /** Walking time to the café, e.g. "5 min walk". */
        distance: localizedSchema.optional(),
      }),
    )
    .max(8)
    .superRefine(uniqueIds),
  directions: localizedSchema.optional(),
});
export type LocationContent = z.infer<typeof locationSchema>;

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
      /** Illustration shown when there is no photo (or alongside photos as a mix). */
      illustration: sceneIllustration,
      alt: localizedSchema,
      caption: localizedSchema.optional(),
    }),
  )
  .superRefine(uniqueIds);

// ---------- Cinematic opening ----------

const audioPath = z
  .string()
  .regex(/^\/audio\/[\w.-]+\.(mp3|m4a|aac|ogg|opus|webm)$/i, "put audio in /public/audio/");
const greeting = z.strictObject({ label: text, text, voice: audioPath.optional() });

export const openingSchema = z.strictObject({
  greetings: z.strictObject({ hi: greeting, ml: greeting }),
  translation: localizedSchema,
  ambience: audioPath.optional(),
});
export type OpeningContent = z.infer<typeof openingSchema>;
export type GreetingLang = keyof OpeningContent["greetings"];

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex colour like #8F2925");
const proportion = z.number().min(0.85).max(1.15);

export const ownerCharacterSchema = z.strictObject({
  skinTone: hex,
  hair: z.strictObject({ color: hex, style: z.enum(["short", "side-part", "tousled", "curly", "bald"]) }),
  facialHair: z.enum(["none", "moustache", "beard", "stubble"]),
  glasses: z.boolean(),
  build: z.strictObject({ height: proportion, width: proportion }),
  kurta: z.strictObject({ color: hex, trim: hex }),
  vest: z.strictObject({ enabled: z.boolean(), color: hex }),
  trousers: hex,
  shoes: hex,
});
export type OwnerCharacter = z.infer<typeof ownerCharacterSchema>;
