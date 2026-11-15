import type { z } from "zod";
import type { homeSchema } from "./schema";

/**
 * ✏️  EDIT ME — home page copy.
 * ⚠️ DRAFT COPY — written as a starting point; rewrite in your own voice.
 * Hindi expressions are written in Roman script so everyone can read them.
 */
export const homeData = {
  hero: {
    kicker: { en: "Aaiye, baithiye", ml: "വരൂ, ഇരിക്കൂ" },
    title: { en: "Apna Nukkad. Apne Log." },
    subtitle: {
      en: "A North Indian street corner, right here in Trivandrum. Come for chai, stay for conversations.",
      ml: "തിരുവനന്തപുരത്ത് ഒരു ഉത്തരേന്ത്യൻ തെരുവോരം. ചായയ്ക്കായി വരൂ, സംസാരത്തിനായി ഇരിക്കൂ.",
    },
  },
  owner: {
    name: { en: "PLACEHOLDER — owner character name" },
    role: { en: "Keeper of the kettle" },
    greeting: { en: "Arre, aao aao!" },
    message: [
      {
        en: "Every nukkad has someone who knows your order before you say it. Here, that's us.",
      },
      {
        en: "Pull up a stool, ek cutting ho jaaye? The kettle has been on since morning.",
      },
    ],
  },
  sitAndStay: {
    eyebrow: { en: "Come, Sit & Stay" },
    title: { en: "No rush. Koi jaldi nahi." },
    body: [
      {
        en: "Nukkad is a corner to linger in — with friends, with a book, or with strangers who won't stay strangers for long.",
      },
    ],
    points: [
      { title: { en: "Walk in" }, body: { en: "No reservations. First come, first served." } },
      { title: { en: "Stay a while" }, body: { en: "One chai or five — the stool is yours." } },
      { title: { en: "Bring your people" }, body: { en: "Groups of 10 or more, just give us a call." } },
    ],
  },
  signatureChai: {
    eyebrow: { en: "Signature Chai" },
    title: { en: "Chai pe charcha" },
    body: [
      {
        en: "Our chai is boiled the long way, poured from a height and served in kulhads made of Indian clay.",
      },
    ],
    ritual: [
      {
        title: { en: "The boil" },
        body: { en: "Leaves, milk and spices simmer until the colour turns just right." },
      },
      { title: { en: "The pour" }, body: { en: "A long pour from above for that little froth on top." } },
      {
        title: { en: "The kulhad" },
        body: { en: "Clay cups that cool the chai gently and smell of earth." },
      },
    ],
  },
  menuPreview: {
    eyebrow: { en: "From the counter", ml: "കൗണ്ടറിൽ നിന്ന്" },
    title: { en: "Kya loge?", ml: "എന്ത് വേണം?" },
    body: [{ en: "A few favourites from the board.", ml: "ബോർഡിലെ ചില പ്രിയപ്പെട്ടവ." }],
  },
  story: {
    eyebrow: { en: "Our Story" },
    title: { en: "How a street corner came south" },
    body: [
      {
        en: "Nukkad started with a simple idea: bring the warmth of a North Indian chai tapri to Trivandrum, and keep it affordable for everyone.",
      },
    ],
  },
  baatein: {
    eyebrow: { en: "Nukkad Ki Baatein" },
    title: { en: "Talk of the corner" },
    body: [{ en: "Little stories, chai thoughts and neighbourhood notes from behind the counter." }],
  },
  events: {
    eyebrow: { en: "At the Nukkad" },
    title: { en: "Something's always happening" },
    body: [{ en: "No tickets, no sign-ups. Just walk in." }],
  },
  gallery: {
    eyebrow: { en: "The Atmosphere" },
    title: { en: "A corner with character" },
    body: [{ en: "Old radios, painted signs, a bicycle by the wall and the smell of fresh chai." }],
  },
  visit: {
    eyebrow: { en: "Find Us", ml: "ഞങ്ങളെ കണ്ടെത്തൂ" },
    title: { en: "Milte hain nukkad pe!", ml: "നുക്കഡിൽ കാണാം!" },
    body: [
      { en: "We're easy to find and always open the door wide.", ml: "എളുപ്പത്തിൽ കണ്ടെത്താം, എപ്പോഴും സ്വാഗതം." },
    ],
  },
} satisfies z.input<typeof homeSchema>;
