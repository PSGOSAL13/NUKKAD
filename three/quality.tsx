"use client";

import { createContext, useContext } from "react";
import * as THREE from "three";

/**
 * Rendering quality.
 *  high — standard (PBR) materials, shadows, more lights and particles.
 *  low  — Lambert materials, no shadows, emissive "fake" lights, fewer props.
 */
export type Quality = "high" | "low";

export const QualityContext = createContext<Quality>("high");
export const useQuality = () => useContext(QualityContext);

type MatOptions = {
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  side?: THREE.Side;
  /** Self-lit (bulbs, flames, lit windows): always bright, ignores lighting. */
  glow?: boolean;
};

const cache = new Map<string, THREE.Material>();

/**
 * Shared, cached materials: one material per colour/options/quality, so the
 * whole scene uses a handful of shader programs and very little memory.
 *
 * Metalness is capped: there is deliberately no environment map (it would
 * cost a large download), and fully metallic surfaces render almost black
 * without one. A little metalness plus low roughness reads as steel/brass.
 */
export function mat(quality: Quality, color: string, o: MatOptions = {}): THREE.Material {
  const key = `${quality}|${color}|${JSON.stringify(o)}`;
  let m = cache.get(key);
  if (!m && o.glow) {
    m = new THREE.MeshBasicMaterial({ color, toneMapped: false, fog: false });
    cache.set(key, m);
  }
  if (!m) {
    const common = {
      color,
      emissive: o.emissive ?? "#000000",
      emissiveIntensity: o.emissiveIntensity ?? 1,
      side: o.side ?? THREE.FrontSide,
    };
    m =
      quality === "high"
        ? new THREE.MeshStandardMaterial({
            ...common,
            roughness: o.roughness ?? 0.85,
            metalness: Math.min(o.metalness ?? 0, 0.35),
          })
        : new THREE.MeshLambertMaterial(common);
    cache.set(key, m);
  }
  return m;
}

/** Hook form of `mat` for components. */
export function useMat(color: string, o?: MatOptions) {
  return mat(useQuality(), color, o);
}

/** Free GPU memory when the opening unmounts. */
export function disposeMaterials() {
  cache.forEach((m) => m.dispose());
  cache.clear();
}
