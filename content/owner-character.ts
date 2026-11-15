import type { z } from "zod";
import type { ownerCharacterSchema } from "./schema";

/**
 * ✏️  EDIT ME — the cartoon owner character in the opening scene.
 *
 * Tuned from the founder's photograph (2026-11-15): warm medium-brown skin,
 * short thick near-black hair with volume on top, full short beard joined to
 * the moustache, strong dark eyebrows, no glasses.
 *
 * FULL LIKENESS (optional, later): have a 3D artist sculpt a stylised
 * character from the photo in Blender, export GLB (≤ 1.5 MB, ≤ 25k
 * triangles, baked textures), place it at /public/models/owner.glb and set
 * `owner.src` in three/models/registry.ts. The coded character is then
 * replaced automatically, and remains as the fallback.
 *
 * Colours are hex values. The character appears only on the opening screen.
 */
export const ownerCharacterData = {
  skinTone: "#9C6646",
  hair: { color: "#17110E", style: "tousled" }, // "short" | "side-part" | "tousled" | "curly" | "bald"
  facialHair: "beard", // "none" | "moustache" | "beard" | "stubble"
  glasses: false,
  build: { height: 1.0, width: 1.0 }, // 0.85 – 1.15 relative proportions
  kurta: { color: "#F6EBD3", trim: "#8F2925" },
  vest: { enabled: true, color: "#8F2925" }, // Nehru-style waistcoat
  trousers: "#3B2A20",
  shoes: "#4E2E1A",
} satisfies z.input<typeof ownerCharacterSchema>;
