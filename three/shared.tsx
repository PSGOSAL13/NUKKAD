"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PALETTE as P } from "./palette";
import { useMat, useQuality } from "./quality";
import { puffTexture } from "./textures";

/**
 * Create a texture once per component (or again when `key` changes) and
 * dispose it on unmount.
 */
export function useTex<T extends THREE.Texture>(factory: () => T, key: unknown = 0): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate only when `key` changes
  const tex = useMemo(() => factory(), [key]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Same as useTex, for geometries. */
export function useGeo<T extends THREE.BufferGeometry>(factory: () => T, key: unknown = 0): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate only when `key` changes
  const geo = useMemo(() => factory(), [key]);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

/** A cylinder stretched between two points — poles, bicycle tubes, cords. */
export function Tube({
  from,
  to,
  radius = 0.02,
  color,
  material,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color?: string;
  material?: THREE.Material;
}) {
  const fallback = useMat(color ?? P.ink, { roughness: 0.5, metalness: 0.3 });
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: a.add(b).multiplyScalar(0.5), quaternion: q, length: dir.length() };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={material ?? fallback}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
    </mesh>
  );
}

/** Profile of a kulhad (clay cup), revolved into 3D. Height ≈ 0.09 at scale 1. */
const KULHAD_PROFILE = [
  [0, 0],
  [0.031, 0],
  [0.035, 0.006],
  [0.049, 0.084],
  [0.052, 0.09],
  [0.046, 0.09],
  [0.043, 0.082],
  [0.03, 0.01],
  [0, 0.01],
].map(([x, y]) => new THREE.Vector2(x, y));

/** A kulhad, optionally filled with chai (fill 0..1). */
export function Kulhad({
  fill = 0.85,
  scale = 1,
  ...props
}: { fill?: number; scale?: number } & Omit<React.JSX.IntrinsicElements["group"], "scale">) {
  const quality = useQuality();
  const geo = useGeo(() => new THREE.LatheGeometry(KULHAD_PROFILE, quality === "high" ? 20 : 12), quality);
  const clay = useMat(P.clay, { roughness: 0.95 });
  const chai = useMat(P.chai, { roughness: 0.3 });
  const band = useMat(P.yellow);
  return (
    <group scale={scale} {...props}>
      <mesh geometry={geo} material={clay} />
      <mesh position-y={0.05} material={band}>
        <torusGeometry args={[0.0425, 0.003, 4, 20]} />
      </mesh>
      {fill > 0 && (
        <mesh position-y={0.012 + fill * 0.07} rotation-x={-Math.PI / 2} material={chai}>
          <circleGeometry args={[0.031 + fill * 0.012, 16]} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Rising steam: camera-facing soft puffs on one instanced mesh (1 draw call).
 * Additive blending fades puffs by darkening their colour, so no per-puff
 * transparency sorting is needed.
 */
export function Steam({
  count,
  height = 0.35,
  spread = 0.03,
  size = 0.09,
  intensity = 0.3,
  active = true,
  ...props
}: {
  count?: number;
  height?: number;
  spread?: number;
  size?: number;
  intensity?: number;
  active?: boolean | (() => boolean);
} & React.JSX.IntrinsicElements["group"]) {
  const quality = useQuality();
  const n = count ?? (quality === "high" ? 14 : 6);
  const ref = useRef<THREE.InstancedMesh>(null);
  const tex = useTex(puffTexture);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
      }),
    [tex],
  );
  useEffect(() => () => material.dispose(), [material]);
  const seeds = useMemo(
    // Golden-angle offsets: evenly varied, and deterministic (pure render).
    () => Array.from({ length: n }, (_, i) => ({ o: i / n, w: (i * 2.39996) % (Math.PI * 2) })),
    [n],
  );
  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), s: new THREE.Vector3(), c: new THREE.Color() }),
    [],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const on = typeof active === "function" ? active() : active;
    mesh.visible = on;
    if (!on) return;
    const t = state.clock.elapsedTime;
    const q = state.camera.quaternion;
    seeds.forEach((sd, i) => {
      const life = (t * 0.35 + sd.o) % 1;
      tmp.p.set(
        Math.sin(t * 1.3 + sd.w) * spread * (0.3 + life),
        life * height,
        Math.cos(t + sd.w) * spread * 0.5,
      );
      const s = size * (0.4 + life * 1.4);
      tmp.s.set(s, s, s);
      tmp.m.compose(tmp.p, q, tmp.s);
      mesh.setMatrixAt(i, tmp.m);
      const fade = Math.sin(life * Math.PI) * intensity;
      mesh.setColorAt(i, tmp.c.setRGB(fade, fade * 0.97, fade * 0.92));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group {...props}>
      <instancedMesh
        ref={ref}
        args={[undefined, material, n]}
        frustumCulled={false}
        userData={{ noShadow: true }}
      >
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
    </group>
  );
}
