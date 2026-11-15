import type { z } from "zod";
import type { gallerySchema } from "./schema";

/**
 * ✏️  EDIT ME — café atmosphere: photographs and illustrations.
 *
 * Each tile shows its photo if `src` is set, otherwise its illustration.
 * Put photos in /public/images/gallery/ and set `src`
 * (e.g. "/images/gallery/counter.jpg"). Every tile needs `alt` text
 * describing it (for screen readers and Google).
 *
 * illustration: counter | radio | bicycle | lamps | books | carrom
 */
export const galleryData = [
  {
    id: "counter",
    illustration: "counter",
    alt: { en: "The chai counter with kettles on the boil" },
    caption: { en: "The counter" },
  },
  {
    id: "radio-corner",
    illustration: "radio",
    alt: { en: "A vintage radio on a wooden shelf" },
    caption: { en: "Radio corner" },
  },
  {
    id: "bicycle-wall",
    illustration: "bicycle",
    alt: { en: "An old bicycle leaning against a painted wall" },
    caption: { en: "The bicycle wall" },
  },
  {
    id: "evening-lamps",
    illustration: "lamps",
    alt: { en: "Warm bulbs glowing over the seating at dusk" },
    caption: { en: "Evenings" },
  },
  {
    id: "bookshelf",
    illustration: "books",
    alt: { en: "A bookshelf of well-thumbed books" },
    caption: { en: "Take a book, stay a while" },
  },
  {
    id: "carrom",
    illustration: "carrom",
    alt: { en: "A carrom board mid-game on a small table" },
    caption: { en: "One more game?" },
  },
] satisfies z.input<typeof gallerySchema>;
