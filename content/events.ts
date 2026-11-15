import type { z } from "zod";
import type { eventsSchema } from "./schema";

/**
 * ✏️  EDIT ME — events shown on the home page.
 * Informational only: there is no online registration — people just walk in.
 * One-off events: add `endsOn: "YYYY-MM-DD"` and they disappear after that date
 * (the next time the site is rebuilt).
 * ⚠️ SAMPLE EVENTS — replace with real ones.
 */
export const eventsData = [
  {
    id: "antakshari-nights",
    title: { en: "Antakshari Nights" },
    description: { en: "Old songs, loud singing, no judgement. SAMPLE." },
    schedule: { en: "Every Friday, 7 pm" },
  },
  {
    id: "open-mic-adda",
    title: { en: "Open Mic Adda" },
    description: {
      en: "Poetry, stories, a little music. Put your name on the board when you arrive. SAMPLE.",
    },
    schedule: { en: "Last Sunday of the month, 5 pm" },
  },
] satisfies z.input<typeof eventsSchema>;
