import type { z } from "zod";
import type { storySchema } from "./schema";

/**
 * ✏️  EDIT ME — Our Story, told as a conversation over chai.
 *
 * Written ONLY from what the founder has shared (Prem Prajeesh Nair: served in
 * the Indian Navy; best friends, new ideas, fun moments and travel plans made
 * over chai and snacks; "it's not just chai, it's a place to bond"; curiosity
 * about navigation and submarines; North Indian warmth in Trivandrum).
 * Remaining PLACEHOLDERs are for the founder's own words — please don't fill
 * them with invented details.
 * ⚠️ Malayalam text is a DRAFT — have a native speaker review it.
 */
export const storyData = {
  intro: {
    eyebrow: { en: "Our Story", ml: "ഞങ്ങളുടെ കഥ" },
    title: { en: "From the sea to the street corner", ml: "കടലിൽ നിന്ന് തെരുവോരത്തേക്ക്" },
    body: [
      {
        en: "Meet Prem — spreading love and happiness at the nukkad. The best stories here aren't told; they come out over a second cup of chai. So pull up a stool, and ask away.",
        ml: "പ്രേമിനെ പരിചയപ്പെടൂ — നുക്കഡിൽ സ്നേഹവും സന്തോഷവും പകരുന്നയാൾ. ഒരു സ്റ്റൂൾ എടുത്ത് ചോദിച്ചോളൂ.",
      },
    ],
  },
  founder: {
    name: { en: "Prem Prajeesh Nair", ml: "പ്രേം പ്രജീഷ് നായർ" },
    role: {
      en: "Founder · spreading love and happiness at the nukkad",
      ml: "സ്ഥാപകൻ · നുക്കഡിൽ സ്നേഹവും സന്തോഷവും പകരുന്നു",
    },
  },
  conversation: [
    {
      id: "before-nukkad",
      question: { en: "So, what were you doing before all this chai?", ml: "ഈ ചായയ്ക്ക് മുമ്പ് എന്തായിരുന്നു?" },
      answer: [
        { en: "I served in the Indian Navy.", ml: "ഞാൻ ഇന്ത്യൻ നാവികസേനയിൽ സേവനമനുഷ്ഠിച്ചു." },
        { en: "PLACEHOLDER — in your own words: when you served and what your work involved." },
      ],
    },
    {
      id: "navy-days",
      question: {
        en: "What stayed with you from those Navy years?",
        ml: "നാവികസേനാ വർഷങ്ങളിൽ നിന്ന് എന്താണ് കൂടെയുള്ളത്?",
      },
      answer: [
        {
          en: "The people. I made my best friends in the Navy — and so many new ideas, fun moments and travel plans were made over a cup of chai and some snacks.",
          ml: "ആളുകൾ. എന്റെ ഏറ്റവും നല്ല സുഹൃത്തുക്കളെ ഞാൻ നാവികസേനയിൽ കണ്ടെത്തി — പുതിയ ആശയങ്ങളും രസകരമായ നിമിഷങ്ങളും യാത്രാ പദ്ധതികളും ഒരു കപ്പ് ചായയ്ക്കും പലഹാരത്തിനുമൊപ്പം ഉണ്ടായി.",
        },
      ],
    },
    {
      id: "the-idea",
      question: { en: "So why a chai café?", ml: "അപ്പോൾ എന്തുകൊണ്ട് ഒരു ചായക്കട?" },
      answer: [
        {
          en: "Because it's not just chai — it's a place to bond.",
          ml: "കാരണം ഇത് വെറും ചായയല്ല — ഒത്തുചേരാനുള്ള ഒരിടമാണ്.",
        },
        {
          en: "That's what I want NUKKAD to be: come for chai, stay for the conversations, and leave feeling you belong.",
          ml: "നുക്കഡ് അതാകണം: ചായയ്ക്കായി വരൂ, സംസാരത്തിനായി ഇരിക്കൂ.",
        },
      ],
    },
    {
      id: "curiosity",
      question: { en: "Is it true you can talk about submarines all night?" },
      answer: [
        { en: "Navigation, submarines and how the world works have always made me curious." },
        { en: "PLACEHOLDER — what fascinates you about them, in your words." },
      ],
    },
    {
      id: "why-trivandrum",
      question: { en: "And why here, in Trivandrum?", ml: "എന്തുകൊണ്ട് തിരുവനന്തപുരം?" },
      answer: [
        {
          en: "To bring a little North Indian warmth to Trivandrum.",
          ml: "തിരുവനന്തപുരത്തേക്ക് അൽപം ഉത്തരേന്ത്യൻ ഊഷ്മളത കൊണ്ടുവരാൻ.",
        },
        { en: "PLACEHOLDER — your connection to the city, in your words." },
      ],
    },
  ],
} satisfies z.input<typeof storySchema>;
