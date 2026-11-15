import type { z } from "zod";
import type { gallerySchema } from "./schema";

/**
 * ✏️  EDIT ME — café atmosphere photos for the home page.
 * Put photos in /public/images/gallery/ and set `src`. Items without `src`
 * show an illustrated placeholder tile until the photo is added.
 * Every photo needs `alt` text describing it (for screen readers and Google).
 */
export const galleryData = [
  { id: "counter", alt: { en: "The chai counter with kettles on the boil" }, caption: { en: "The counter" } },
  { id: "radio-corner", alt: { en: "A vintage radio on a wooden shelf" }, caption: { en: "Radio corner" } },
  {
    id: "bicycle-wall",
    alt: { en: "An old bicycle leaning against a painted wall" },
    caption: { en: "The bicycle wall" },
  },
  {
    id: "evening-lamps",
    alt: { en: "Street lamps glowing over the seating area at dusk" },
    caption: { en: "Evenings" },
  },
] satisfies z.input<typeof gallerySchema>;
