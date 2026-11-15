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
  /** Optional strip at the top of every page. Disappears by itself after `until`. */
  announcement: z
    .strictObject({
      text: localizedSchema,
      /** Optional link: a page on this site ("/menu/") or a full https:// URL. */
      link: z.union([z.string().regex(/^\/[\w\-/#]*$/), z.url({ protocol: /^https$/ })]).optional(),
      linkLabel: localizedSchema.optional(),
      /** Last day to show it, "YYYY-MM-DD" (Indian time). */
      until: isoDate.optional(),
    })
    .optional(),
  /** Optional delivery-platform pages (external — NUKKAD's own site has no ordering). */
  delivery: z
    .strictObject({
      swiggy: z.url({ protocol: /^https$/ }).optional(),
      zomato: z.url({ protocol: /^https$/ }).optional(),
    })
    .optional(),
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

// ---------- Illustrations (hand-drawn SVGs in components/illustrations) ----------

export const foodIllustration = z.enum(["chai", "samosa", "jalebi", "bun-maska", "pakora"]);
export type FoodIllustration = z.infer<typeof foodIllustration>;
export const sceneIllustration = z.enum(["counter", "radio", "bicycle", "lamps", "books", "carrom"]);
export type SceneIllustration = z.infer<typeof sceneIllustration>;

// ---------- Menu ----------

export const menuStatus = z.enum(["available", "sold-out", "hidden"]);
export const menuHighlight = z.enum(["signature", "bestseller", "new", "spicy", "seasonal"]);
export const dietEnum = z.enum(["veg", "vegan", "egg", "nonveg"]);

/** A photo name from photos/menu/ (e.g. "masala-chai") or a full https:// image URL. */
const photoRef = z.union([slug, z.url({ protocol: /^https$/ })]);

export const menuItemSchema = z.strictObject({
  id: slug,
  name: localizedSchema,
  /** One line, shown on the board. */
  description: localizedSchema.optional(),
  /** Longer text, shown when the item is opened. */
  details: localizedSchema.optional(),
  /** Exact price in whole rupees. */
  price: z.number().int().positive(),
  /** Optional food mark per item (the café itself is never labelled veg-only or non-veg-only). */
  diet: dietEnum.optional(),
  tags: z.array(menuHighlight).default([]),
  /**
   * available — shown normally
   * sold-out  — shown with a "Sold Out" label
   * hidden    — not shown at all
   */
  status: menuStatus.default("available"),
  /** Include in the rotating six on the home page. */
  featured: z.boolean().default(false),
  photo: photoRef.optional(),
  photoAlt: localizedSchema.optional(),
  /** Illustration used when there is no photo (defaults to the category's). */
  illustration: foodIllustration.optional(),
  /** Marks sample content that must be replaced before launch. */
  sample: z.boolean().default(false),
});

export const menuCategorySchema = z.strictObject({
  id: slug,
  name: localizedSchema,
  description: localizedSchema.optional(),
  /** Hand-drawn illustration for the category header and for items without a photo. */
  illustration: foodIllustration,
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

// ---------- Nukkad Ki Baatein — Stories Beyond Chai ----------

/** The owner's three storytelling themes. The owner chooses; visitors never pick a topic. */
export const storyTheme = z.enum(["beyond-the-uniform", "stories-of-the-sea", "stories-over-chai"]);
export type StoryTheme = z.infer<typeof storyTheme>;

export const baateinSchema = z.strictObject({
  intro: sectionCopy,
  /** Owner-led storytelling sessions. */
  storytelling: sectionCopy.extend({
    /** e.g. "30–45 minutes · topic chosen by the host". */
    format: localizedSchema,
    themes: z
      .array(z.strictObject({ id: storyTheme, title: localizedSchema, body: localizedSchema }))
      .length(3),
  }),
  events: sectionCopy,
  /** Customers and community groups proposing their own small events. */
  community: sectionCopy.extend({ examples: z.array(localizedSchema).max(6) }),
  groupBooking: sectionCopy.extend({ customMenus: localizedSchema }),
  /** Short written pieces from the café ("chai notes"). */
  notes: sectionCopy.extend({
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
  }),
});

// ---------- Events (informational only — no registration, no seat booking) ----------

export const eventSchema = z
  .strictObject({
    id: slug,
    /** storytelling = hosted by the owner · community = proposed by guests/groups · cafe = anything else */
    type: z.enum(["storytelling", "community", "cafe"]),
    /** Required for storytelling sessions, not used otherwise. */
    theme: storyTheme.optional(),
    title: localizedSchema,
    description: localizedSchema,
    /** "2026-12-05" */
    date: isoDate,
    /** 24-hour "18:30" (Indian Standard Time) */
    start: time24h,
    end: time24h.optional(),
    /** Who is hosting (for community events). */
    host: localizedSchema.optional(),
    photo: photoRef.optional(),
    photoAlt: localizedSchema.optional(),
    /** draft = not shown on the site */
    status: z.enum(["published", "draft"]).default("published"),
    sample: z.boolean().default(false),
  })
  .superRefine((e, ctx) => {
    if (e.type === "storytelling" && !e.theme) {
      ctx.addIssue({ code: "custom", path: ["theme"], message: "storytelling sessions need a theme" });
    }
    if (e.type !== "storytelling" && e.theme) {
      ctx.addIssue({ code: "custom", path: ["theme"], message: "only storytelling sessions have a theme" });
    }
    if (e.end && e.end <= e.start) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "end time must be after the start time" });
    }
  });
export type CafeEvent = z.infer<typeof eventSchema>;

export const eventsSchema = z.array(eventSchema).superRefine(uniqueIds);

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
