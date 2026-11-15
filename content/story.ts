import type { z } from "zod";
import type { storySchema } from "./schema";

/**
 * ✏️  EDIT ME — the Our Story page.
 * ⚠️ DRAFT COPY — replace with the real story of NUKKAD.
 */
export const storyData = {
  intro: {
    eyebrow: { en: "Our Story" },
    title: { en: "Every city needs a nukkad" },
    body: [
      {
        en: "In the lanes of North India, the nukkad — the street corner — is where the day begins and ends. Someone is always boiling chai, someone is always arguing about cricket, and nobody is ever really a stranger.",
      },
    ],
  },
  chapters: [
    {
      id: "the-idea",
      title: { en: "The idea" },
      body: [{ en: "PLACEHOLDER — how and why NUKKAD started." }],
    },
    {
      id: "why-trivandrum",
      title: { en: "Why Trivandrum" },
      body: [{ en: "PLACEHOLDER — the connection between the founders and the city." }],
    },
    {
      id: "for-everyone",
      title: { en: "Chai for everyone" },
      body: [
        {
          en: "PLACEHOLDER — keeping prices honest and the door open to students, workers and families alike.",
        },
      ],
    },
  ],
} satisfies z.input<typeof storySchema>;
