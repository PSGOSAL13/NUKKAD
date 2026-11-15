import type { z } from "zod";
import { PLACEHOLDER_INSTAGRAM, PLACEHOLDER_PHONE } from "./placeholders";
import type { siteSchema } from "./schema";

/**
 * ✏️  EDIT ME — café details used across the whole site.
 *
 * Text fields take { en, ml }. English is required; if ml is missing, the
 * English text is shown on the Malayalam pages.
 *
 * ⚠️ Values marked PLACEHOLDER must be replaced before launch — the build
 *    prints a list of any that remain.
 * ⚠️ Malayalam text is a DRAFT — have a native speaker review it.
 */
export const siteData = {
  name: { en: "Nukkad", ml: "നുക്കഡ്" },
  // Brand spelling to confirm: "नुक्कड" (as briefed) vs standard Hindi "नुक्कड़" (with nukta).
  nameDevanagari: "नुक्कड",
  tagline: { en: "Apna Nukkad. Apne Log." },
  description: {
    en: "A North Indian street-corner café in Trivandrum. Somewhere between chai and conversations, you find your people.",
    ml: "തിരുവനന്തപുരത്തെ ഒരു ഉത്തരേന്ത്യൻ തെരുവോര കഫേ. ചായയ്ക്കും സംസാരത്തിനുമിടയിൽ, നിങ്ങൾ നിങ്ങളുടെ ആളുകളെ കണ്ടെത്തുന്നു.",
  },
  // Premises not yet confirmed — see also content/location.ts (`confirmed: false`).
  address: {
    line1: { en: "PLACEHOLDER — street address (premises to be confirmed)" },
    city: { en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം" },
    state: { en: "Kerala", ml: "കേരളം" },
    postalCode: "695001", // PLACEHOLDER
    country: "IN",
  },
  // geo: { lat: 8.5241, lng: 76.9366 },          // exact café coordinates (enables the map embed + precise directions)
  // mapsUrl: "https://maps.app.goo.gl/…",        // Google Maps share link (preferred for "Get directions")
  phone: PLACEHOLDER_PHONE, // PLACEHOLDER — e.g. "+919876543210"
  whatsapp: PLACEHOLDER_PHONE, // PLACEHOLDER — WhatsApp number, same format
  // email: "hello@yourdomain.in",
  social: [{ platform: "instagram", url: PLACEHOLDER_INSTAGRAM }], // PLACEHOLDER — your Instagram profile URL
  hours: [{ days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], open: "08:00", close: "20:00" }],
  seating: {
    en: "Walk in any time — seating is first come, first served. No reservations needed.",
    ml: "എപ്പോൾ വേണമെങ്കിലും വരാം — ആദ്യം വരുന്നവർക്ക് ആദ്യം ഇരിപ്പിടം. റിസർവേഷൻ ആവശ്യമില്ല.",
  },
  groupBooking: {
    minPeople: 10,
    note: {
      en: "Coming as a group of 10 or more? Give us a call and we'll keep the corner ready for you.",
      ml: "10-ഓ അതിലധികമോ പേരുള്ള സംഘമാണോ? ഞങ്ങളെ വിളിക്കൂ, നിങ്ങൾക്കായി ഇടം ഒരുക്കാം.",
    },
  },
  // fssaiLicence: "00000000000000",
} satisfies z.input<typeof siteSchema>;
