import { createContext, useContext } from "react";
import * as THREE from "three";

/**
 * Mutable animation state shared by the whole scene. GSAP tweens these plain
 * numbers; components read them every frame in useFrame. Nothing here causes
 * React re-renders, which keeps the cinematic transition smooth.
 */
export type Director = {
  camera: THREE.Vector3; // camera position
  target: THREE.Vector3; // look-at point
  fov: number;
  shutter: number; // 0 closed → 1 rolled up
  lights: number; // interior lights 0 → 1
  pour: number; // chai pour 0 → 1 (kettle tilt, stream, cup fill)
  ownerWave: number; // 0..1 how strongly the owner waves
  lookAround: number; // 0..1 how much pointer/touch steers the camera
};

export function createDirector(): Director {
  return {
    camera: SHOTS.street.camera.clone(),
    target: SHOTS.street.target.clone(),
    fov: SHOTS.street.fov,
    shutter: 0,
    lights: 0,
    pour: 0,
    ownerWave: 0,
    lookAround: 0.35,
  };
}

export const DirectorContext = createContext<Director | null>(null);
export function useDirector(): Director {
  const d = useContext(DirectorContext);
  if (!d) throw new Error("useDirector must be used inside <OpeningScene>");
  return d;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Camera shots (landscape). Portrait screens get a wider lens in CameraRig. */
export const SHOTS = {
  street: { camera: v(0, 1.75, 9.2), target: v(-0.4, 1.7, -1), fov: 45 },
  doorway: { camera: v(0, 1.65, -1.6), target: v(0.2, 1.55, -8), fov: 50 },
  inside: { camera: v(0.4, 1.7, -6.6), target: v(1.15, 1.4, -11.4), fov: 50 },
  pour: { camera: v(1.95, 1.8, -10.05), target: v(1.32, 1.42, -11.45), fov: 40 },
  interior: { camera: v(-0.9, 2.35, -3.6), target: v(0.5, 1.0, -10.2), fov: 55 },
} as const;
