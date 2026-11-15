import type { z } from "zod";
import type { siteSchema } from "./schema";

/**
 * ✏️  EDIT ME — café details used across the whole site.
 *
 * Text fields take { en, ml }. English is required; if ml is missing, the
 * English text is shown on the Malayalam pages.
 *
 * ⚠️ Values marked PLACEHOLDER must be replaced before launch.
 * ⚠️ Malayalam text is a DRAFT — have a native speaker review it.
 */
export const siteData = {
  name: { en: "Nukkad", ml: "നുക്കഡ്" },
  // Brand spelling to confirm: "नुक्कड" (as briefed) vs standard Hindi "नुक्कड़" (with nukta).
  nameDevanagari: "नुक्कड",
  tagline: { en: "Apna Nukkad. Apne Log." },
  description: {
    en: "A North Indian street-corner café in Trivandrum. Come for chai, stay for conversations, leave feeling you belong.",
    ml: "തിരുവനന്തപുരത്തെ ഒരു ഉത്തരേന്ത്യൻ തെരുവോര കഫേ. ചായയ്ക്കായി വരൂ, സംസാരത്തിനായി ഇരിക്കൂ.",
  },
  address: {
    line1: { en: "PLACEHOLDER street address" },
    city: { en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം" },
    state: { en: "Kerala", ml: "കേരളം" },
    postalCode: "695001", // PLACEHOLDER
    country: "IN",
  },
  // landmark: { en: "Opposite …", ml: "… എതിർവശം" },
  // geo: { lat: 8.5241, lng: 76.9366 },          // exact café coordinates
  // mapsUrl: "https://maps.app.goo.gl/…",        // Google Maps share link
  // phone: "+91XXXXXXXXXX",
  // whatsapp: "+91XXXXXXXXXX",
  // email: "hello@yourdomain.in",
  social: [],
  hours: [
    // PLACEHOLDER hours
    { days: ["mon", "tue", "wed", "thu", "fri"], open: "07:00", close: "22:00" },
    { days: ["sat", "sun"], open: "07:00", close: "23:00" },
  ],
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
