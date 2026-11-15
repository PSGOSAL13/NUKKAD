import type { z } from "zod";
import type { locationSchema } from "./schema";

/**
 * ✏️  EDIT ME — location and the illustrated map.
 *
 * ⚠️ The premises are NOT confirmed. Everything below is a PLACEHOLDER.
 * When the café's location is final:
 *  1. Set `confirmed: true`.
 *  2. Put the address in content/site.ts and add `geo` and/or `mapsUrl` there
 *     (that makes "Get directions" open the exact spot in Google Maps).
 *  3. Replace the landmarks with real nearby places (max 8) and move the pins.
 *     x / y are positions on the illustrated map in % (0 = left/top, 100 = right/bottom).
 *     kind: temple | church | mosque | bus | rail | college | park | beach | market | hospital
 */
export const locationData = {
  confirmed: false,
  cafe: { x: 52, y: 50 },
  landmarks: [
    { id: "landmark-1", label: { en: "PLACEHOLDER — bus stop" }, kind: "bus", x: 24, y: 30 },
    { id: "landmark-2", label: { en: "PLACEHOLDER — college" }, kind: "college", x: 78, y: 26 },
    { id: "landmark-3", label: { en: "PLACEHOLDER — temple" }, kind: "temple", x: 20, y: 74 },
    { id: "landmark-4", label: { en: "PLACEHOLDER — park" }, kind: "park", x: 80, y: 72 },
    { id: "landmark-5", label: { en: "PLACEHOLDER — railway station" }, kind: "rail", x: 50, y: 14 },
  ],
  directions: {
    en: "PLACEHOLDER — a one-line direction, e.g. 'Two minutes' walk from the bus stop, opposite the …'",
  },
} satisfies z.input<typeof locationSchema>;
