/**
 * GLB model slots. Every major object in the opening is built in code today.
 * When a Blender model is ready:
 *   1. Optimise it:  npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp
 *   2. Put it in /public/models/
 *   3. Set `src` below (and adjust position/rotation/scale if needed).
 * The coded version is used automatically if the file fails to load.
 *
 * Budgets (keep the whole opening ≤ ~2 MB of models):
 *   owner ≤ 1.5 MB / 25k tris · each prop ≤ 300 KB / 5k tris · baked lighting.
 */
export type ModelId =
  | "owner"
  | "shopfront"
  | "chaiCounter"
  | "bicycle"
  | "streetLamp"
  | "bench"
  | "interiorCounter"
  | "radio"
  | "bookshelf";

export type ModelEntry = {
  src?: `/models/${string}.glb`;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export const modelRegistry: Record<ModelId, ModelEntry> = {
  owner: {},
  shopfront: {},
  chaiCounter: {},
  bicycle: {},
  streetLamp: {},
  bench: {},
  interiorCounter: {},
  radio: {},
  bookshelf: {},
};
