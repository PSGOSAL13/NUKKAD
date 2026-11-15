"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useDirector } from "../director";
import { ModelSlot } from "../models/ModelSlot";
import { PALETTE as P } from "../palette";
import { useMat, useQuality } from "../quality";
import { useGeo, useTex } from "../shared";
import {
  awningTexture,
  plasterTexture,
  posterTexture,
  shutterTexture,
  signboardTexture,
  skyTexture,
} from "../textures";

/** Facade sits at z = −2.5; the doorway is x ∈ [−1.6, 1.6], y ∈ [0.15, 3.0]. */
export const FACADE_Z = -2.5;
export const SIDEWALK_Y = 0.15;

export function Street() {
  return (
    <group>
      <Sky />
      <Ground />
      <NeighbourBuildings />
      <ModelSlot id="shopfront">
        <Shopfront />
      </ModelSlot>
      <StringLights />
      <OverheadWires />
    </group>
  );
}

function Sky() {
  const tex = useTex(skyTexture);
  return (
    <mesh position={[0, 9, -32]} userData={{ noShadow: true }}>
      <planeGeometry args={[140, 40]} />
      <meshBasicMaterial map={tex} fog={false} />
    </mesh>
  );
}

function Ground() {
  const asphalt = useMat(P.asphalt, { roughness: 0.95 });
  const stone = useMat(P.stone, { roughness: 0.9 });
  const kerb = useMat(P.creamDark, { roughness: 0.9 });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 8]} material={asphalt}>
        <planeGeometry args={[80, 24]} />
      </mesh>
      {/* sidewalk */}
      <mesh position={[0, SIDEWALK_Y / 2, -0.7]} material={stone}>
        <boxGeometry args={[30, SIDEWALK_Y, 3.8]} />
      </mesh>
      <mesh position={[0, SIDEWALK_Y / 2, 1.25]} material={kerb}>
        <boxGeometry args={[30, SIDEWALK_Y + 0.01, 0.12]} />
      </mesh>
    </group>
  );
}

function Building({
  x,
  width,
  height,
  color,
  z = FACADE_Z - 0.6,
  windows = 2,
}: {
  x: number;
  width: number;
  height: number;
  color: string;
  z?: number;
  windows?: number;
}) {
  const tex = useTex(() => plasterTexture(color), color);
  const wall = useMemo(() => new THREE.MeshLambertMaterial({ map: tex }), [tex]);
  useEffect(() => () => wall.dispose(), [wall]);
  const lit = useMat("#F2C27A", { glow: true });
  const dark = useMat(P.ink);
  const frame = useMat(P.cream);
  return (
    <group position={[x, 0, z]}>
      <mesh position-y={height / 2} material={wall}>
        <boxGeometry args={[width, height, 1]} />
      </mesh>
      {Array.from({ length: windows }, (_, i) => {
        const wx = -width / 2 + ((i + 1) * width) / (windows + 1);
        return (
          <group key={i} position={[wx, height * 0.72, 0.51]}>
            <mesh material={frame}>
              <boxGeometry args={[1.0, 1.3, 0.05]} />
            </mesh>
            <mesh position-z={0.03} material={i % 2 ? dark : lit} userData={{ noShadow: true }}>
              <planeGeometry args={[0.8, 1.1]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function NeighbourBuildings() {
  return (
    <group>
      <Building x={-9} width={7.6} height={7.2} color={P.plasterAlt} />
      <Building x={9} width={7.6} height={5.6} color={P.plasterBlue} windows={3} />
      {/* distant rooftops */}
      <Building x={-16} width={6} height={9} color="#8C6A5A" z={-9} windows={1} />
      <Building x={15} width={6} height={8} color="#7A6A78" z={-9} windows={1} />
    </group>
  );
}

function Shopfront() {
  const plaster = useTex(() => plasterTexture(P.plaster));
  const wall = useMemo(() => new THREE.MeshLambertMaterial({ map: plaster }), [plaster]);
  const trim = useMat(P.redDark);
  const w = 10;
  const h = 6;
  const d = 0.4;
  const doorW = 3.2;
  const doorTop = 3.0;
  const side = (w - doorW) / 2;
  return (
    <group position-z={FACADE_Z}>
      {/* pillars + lintel around the doorway */}
      <mesh position={[-(doorW / 2 + side / 2), h / 2, 0]} material={wall}>
        <boxGeometry args={[side, h, d]} />
      </mesh>
      <mesh position={[doorW / 2 + side / 2, h / 2, 0]} material={wall}>
        <boxGeometry args={[side, h, d]} />
      </mesh>
      <mesh position={[0, doorTop + (h - doorTop) / 2, 0]} material={wall}>
        <boxGeometry args={[doorW, h - doorTop, d]} />
      </mesh>
      {/* painted cornice and door frame */}
      <mesh position={[0, h + 0.08, 0.05]} material={trim}>
        <boxGeometry args={[w + 0.3, 0.2, d + 0.2]} />
      </mesh>
      <mesh position={[0, doorTop + 0.05, 0.22]} material={trim}>
        <boxGeometry args={[doorW + 0.2, 0.1, 0.06]} />
      </mesh>
      <Signboard />
      <Awning />
      <Shutter width={doorW} height={doorTop - SIDEWALK_Y} />
      <Posters />
    </group>
  );
}

function Signboard() {
  const tex = useTex(signboardTexture);
  const wood = useMat(P.woodDark);
  return (
    <group position={[0, 4.15, 0.3]}>
      <mesh material={wood}>
        <boxGeometry args={[4.6, 1.0, 0.12]} />
      </mesh>
      <mesh position-z={0.062}>
        <planeGeometry args={[4.5, 0.95]} />
        <meshLambertMaterial map={tex} />
      </mesh>
      {/* brackets */}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} position={[x, 0.62, -0.05]} material={wood}>
          <boxGeometry args={[0.08, 0.3, 0.2]} />
        </mesh>
      ))}
    </group>
  );
}

function Awning() {
  const tex = useTex(awningTexture);
  const material = useMemo(
    () => new THREE.MeshLambertMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide }),
    [tex],
  );
  // Slopes down and out: top edge against the wall, scalloped edge in front.
  return (
    <mesh position={[0, 3.15, 0.7]} rotation-x={-1.15} material={material}>
      <planeGeometry args={[4.2, 1.05]} />
    </mesh>
  );
}

/** Rolling shutter: scales up toward its drum as director.shutter goes 0 → 1. */
function Shutter({ width, height }: { width: number; height: number }) {
  const d = useDirector();
  const roll = useRef<THREE.Group>(null);
  const tex = useTex(shutterTexture);
  const housing = useMat("#5E6A62", { metalness: 0.4, roughness: 0.6 });
  useFrame(() => {
    if (!roll.current) return;
    const s = Math.max(0.02, 1 - d.shutter);
    roll.current.scale.y = s;
    roll.current.visible = d.shutter < 0.99;
  });
  return (
    <group position={[0, SIDEWALK_Y + height, 0.1]}>
      <mesh position={[0, 0.12, 0.05]} material={housing}>
        <boxGeometry args={[width + 0.2, 0.26, 0.3]} />
      </mesh>
      <group ref={roll}>
        <mesh position-y={-height / 2}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={tex} metalness={0.35} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

function Posters() {
  const tex = useMemo(() => [0, 1, 2, 3].map((i) => posterTexture(i)), []);
  useEffect(() => () => tex.forEach((t) => t.dispose()), [tex]);
  const spots: { x: number; y: number; r: number; i: number }[] = [
    { x: 2.45, y: 1.85, r: 0.04, i: 1 },
    { x: 3.45, y: 2.0, r: -0.05, i: 0 },
    { x: 4.35, y: 1.75, r: 0.03, i: 2 },
    { x: -2.6, y: 2.35, r: -0.03, i: 3 },
  ];
  return (
    <group position-z={0.205}>
      {spots.map((s) => (
        <mesh key={s.x} position={[s.x, s.y, 0]} rotation-z={s.r}>
          <planeGeometry args={[0.62, 0.86]} />
          <meshLambertMaterial map={tex[s.i]} />
        </mesh>
      ))}
    </group>
  );
}

/** Festoon bulbs on a sagging wire across the facade (1 draw call for bulbs). */
function StringLights() {
  const quality = useQuality();
  const n = quality === "high" ? 26 : 14;
  const curve = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-5.2, 5.05, FACADE_Z + 0.35),
        new THREE.Vector3(0, 4.45, FACADE_Z + 0.9),
        new THREE.Vector3(5.2, 5.05, FACADE_Z + 0.35),
      ),
    [],
  );
  const wireGeo = useGeo(() => new THREE.TubeGeometry(curve, 32, 0.01, 4), curve);
  const wire = useMat(P.ink);
  const bulb = useMat(P.bulb, { glow: true });
  const ref = useRef<THREE.InstancedMesh>(null);
  const placed = useRef(false);
  useFrame(() => {
    if (placed.current || !ref.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const p = curve.getPoint((i + 0.5) / n);
      m.makeTranslation(p.x, p.y - 0.06, p.z);
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    placed.current = true;
  });
  return (
    <group>
      <mesh geometry={wireGeo} material={wire} userData={{ noShadow: true }} />
      <instancedMesh ref={ref} args={[undefined, bulb, n]} userData={{ noShadow: true }}>
        <sphereGeometry args={[0.045, 8, 6]} />
      </instancedMesh>
    </group>
  );
}

function OverheadWires() {
  const wire = useMat(P.ink);
  const curves = useMemo(
    () =>
      [6.4, 6.9, 7.3].map(
        (y, i) =>
          new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-14, y, 2 + i),
            new THREE.Vector3(0, y - 0.7, 1 + i * 0.5),
            new THREE.Vector3(14, y + 0.3, -1 + i),
          ),
      ),
    [],
  );
  return (
    <group userData={{ noShadow: true }}>
      {curves.map((c, i) => (
        <mesh key={i} material={wire} userData={{ noShadow: true }}>
          <tubeGeometry args={[c, 40, 0.012, 3]} />
        </mesh>
      ))}
    </group>
  );
}
