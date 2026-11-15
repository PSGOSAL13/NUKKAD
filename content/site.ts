import type { z } from "zod";
import type { siteSchema } from "./schema";

/**
 * ✏️  EDIT ME — café details used across the whole site.
 *
 * Text fields take { en, hi, ml }. English is required; if hi or ml is
 * missing, the English text is shown on that language's pages.
 *
 * ⚠️ Values marked PLACEHOLDER must be replaced before launch.
 */
export const siteData = {
  name: {
    en: "Nukkad",
    // Brand spelling to confirm: "नुक्कड" (as briefed) vs standard Hindi "नुक्कड़" (with nukta).
    hi: "नुक्कड",
    ml: "നുക്കഡ്",
  },
  tagline: {
    en: "Apna Nukkad. Apne Log.",
    hi: "अपना नुक्कड। अपने लोग।",
    ml: "അപ്നാ നുക്കഡ്. അപ്നേ ലോഗ്.",
  },
  description: {
    en: "A North Indian street-corner café in Trivandrum. Come for chai, stay for conversations, leave feeling you belong.",
  },
  address: {
    line1: { en: "PLACEHOLDER street address" },
    city: { en: "Thiruvananthapuram", hi: "तिरुवनंतपुरम", ml: "തിരുവനന്തപുരം" },
    state: { en: "Kerala", hi: "केरल", ml: "കേരളം" },
    postalCode: "695001", // PLACEHOLDER
    country: "IN",
  },
  // geo: { lat: 8.5241, lng: 76.9366 },          // add exact café coordinates
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
  // fssaiLicence: "00000000000000",
} satisfies z.input<typeof siteSchema>;
