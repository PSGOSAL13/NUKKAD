import type { z } from "zod";
import type { ownerCharacterSchema } from "./schema";

/**
 * ✏️  EDIT ME — the cartoon owner character in the opening scene.
 *
 * REFINING FROM YOUR PHOTOGRAPH
 *  1. Quick likeness: adjust the values below (skin tone, hair, facial hair,
 *     glasses, build, clothing colours) to match the photo. No 3D skills needed.
 *  2. Full likeness: have a 3D artist sculpt a stylised character from the photo
 *     in Blender, export GLB (≤ 1.5 MB, ≤ 25k triangles, baked textures),
 *     place it at /public/models/owner.glb and set `owner.src` in
 *     three/models/registry.ts. The coded character is then replaced
 *     automatically, and remains as the fallback.
 *
 * Colours are hex values. The character appears only on the opening screen.
 */
export const ownerCharacterData = {
  skinTone: "#B07A52",
  hair: { color: "#1E1612", style: "side-part" }, // "short" | "side-part" | "curly" | "bald"
  facialHair: "moustache", // "none" | "moustache" | "beard" | "stubble"
  glasses: false,
  build: { height: 1.0, width: 1.0 }, // 0.85 – 1.15 relative proportions
  kurta: { color: "#F6EBD3", trim: "#8F2925" },
  vest: { enabled: true, color: "#8F2925" }, // Nehru-style waistcoat
  trousers: "#3B2A20",
  shoes: "#4E2E1A",
} satisfies z.input<typeof ownerCharacterSchema>;
