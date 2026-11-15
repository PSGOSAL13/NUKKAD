import type { z } from "zod";
import type { baateinSchema } from "./schema";

/**
 * ✏️  EDIT ME — Nukkad Ki Baatein: short stories, chai thoughts and
 * neighbourhood notes written by the café. (Not customer submissions.)
 * ⚠️ DRAFT ENTRIES — replace with your own.
 */
export const baateinData = {
  intro: {
    eyebrow: { en: "Nukkad Ki Baatein" },
    title: { en: "Talk of the corner" },
    body: [{ en: "What we overhear, what we remember, and what we think about while the chai boils." }],
  },
  entries: [
    {
      id: "why-cutting",
      title: { en: "Why is it called cutting chai?" },
      excerpt: { en: "Half a glass, twice the conversation." },
      body: [
        {
          en: "In Mumbai's tapris, a 'cutting' is half a glass — cheaper, quicker, and an excuse to come back for another. DRAFT.",
        },
      ],
    },
    {
      id: "the-kulhad",
      title: { en: "The humble kulhad" },
      excerpt: { en: "A clay cup with a long memory." },
      body: [{ en: "PLACEHOLDER — a short piece about kulhads and why we use them." }],
    },
  ],
} satisfies z.input<typeof baateinSchema>;
