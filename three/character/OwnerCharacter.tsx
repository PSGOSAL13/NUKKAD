"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { OwnerCharacter as OwnerConfig } from "@/content/schema";
import { useDirector } from "../director";
import { ModelSlot } from "../models/ModelSlot";
import { PALETTE as P } from "../palette";
import { useMat, useQuality } from "../quality";
import { Kulhad, Steam, useGeo } from "../shared";

type GroupProps = React.JSX.IntrinsicElements["group"];

/**
 * Cartoon owner, built from simple shapes and driven entirely by
 * content/owner-character.ts. Swapped for /models/owner.glb when registered.
 * Shown only on the street (opening) shot.
 */
export function Owner({ config, ...props }: { config: OwnerConfig } & GroupProps) {
  const d = useDirector();
  const root = useRef<THREE.Group>(null);
  useFrame(() => {
    // Hidden once the camera has passed through the doorway.
    if (root.current) root.current.visible = d.camera.z > -1.5;
  });
  return (
    <group ref={root} {...props}>
      <ModelSlot id="owner">
        <CodedOwner c={config} />
      </ModelSlot>
    </group>
  );
}

const KURTA_PROFILE = [
  [0.27, 0],
  [0.25, 0.22],
  [0.21, 0.5],
  [0.215, 0.68],
  [0.19, 0.76],
  [0.07, 0.82],
].map(([x, y]) => new THREE.Vector2(x, y));

function CodedOwner({ c }: { c: OwnerConfig }) {
  const d = useDirector();
  const quality = useQuality();
  const seg = quality === "high" ? 24 : 14;

  const skin = useMat(c.skinTone, { roughness: 0.7 });
  const skinShade = useMat(shade(c.skinTone, -0.06), { roughness: 0.7 });
  const hair = useMat(c.hair.color, { roughness: 0.9 });
  const kurta = useMat(c.kurta.color);
  const trim = useMat(c.kurta.trim);
  const vest = useMat(c.vest.color);
  const trousers = useMat(c.trousers);
  const shoes = useMat(c.shoes);
  const white = useMat("#FFFFFF", { roughness: 0.3 });
  const ink = useMat(P.ink, { roughness: 0.3 });
  const mouth = useMat(P.redDark);

  const kurtaGeo = useGeo(() => new THREE.LatheGeometry(KURTA_PROFILE, seg), seg);
  const vestGeo = useGeo(
    () =>
      new THREE.LatheGeometry(
        KURTA_PROFILE.slice(2).map((p) => new THREE.Vector2(p.x * 1.06, p.y)),
        seg,
        0.42,
        Math.PI * 2 - 0.84,
      ),
    seg,
  );

  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const waveShoulder = useRef<THREE.Group>(null);
  const waveElbow = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (body.current) body.current.scale.y = 1 + Math.sin(t * 1.8) * 0.008;
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, state.pointer.x * 0.35, 0.05);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -state.pointer.y * 0.12, 0.05);
      head.current.rotation.z = Math.sin(t * 0.9) * 0.04 + d.ownerWave * 0.08;
    }
    if (eyes.current) {
      const blink = t % 4 < 0.12 ? 0.1 : 1;
      eyes.current.scale.y = THREE.MathUtils.lerp(eyes.current.scale.y, blink, 0.5);
    }
    const w = d.ownerWave;
    if (waveShoulder.current) waveShoulder.current.rotation.z = THREE.MathUtils.lerp(0.12, 2.55, w);
    if (waveElbow.current) waveElbow.current.rotation.z = w * (0.35 + Math.sin(t * 9) * 0.35);
  });

  const sx = c.build.width;
  const sy = c.build.height;

  return (
    <group scale={[sx, sy, sx]}>
      {/* legs + shoes */}
      {[-0.1, 0.1].map((x) => (
        <group key={x} position-x={x}>
          <mesh position-y={0.36} material={trousers}>
            <capsuleGeometry args={[0.07, 0.56, 4, 10]} />
          </mesh>
          <mesh position={[0, 0.04, 0.05]} material={shoes}>
            <boxGeometry args={[0.13, 0.08, 0.26]} />
          </mesh>
        </group>
      ))}

      <group ref={body} position-y={0.52}>
        {/* kurta (flattened front-to-back) */}
        <mesh geometry={kurtaGeo} material={kurta} scale={[1, 1, 0.78]} />
        {/* placket + buttons */}
        <mesh position={[0, 0.66, 0.165]} material={trim}>
          <boxGeometry args={[0.035, 0.24, 0.01]} />
        </mesh>
        {c.vest.enabled && <mesh geometry={vestGeo} material={vest} position-y={0.0} scale={[1, 1, 0.8]} />}
        {[0.6, 0.67, 0.74].map((y) => (
          <mesh key={y} position={[0, y, 0.172]} material={ink}>
            <sphereGeometry args={[0.012, 6, 4]} />
          </mesh>
        ))}

        {/* neck + head */}
        <mesh position-y={0.86} material={skin}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 10]} />
        </mesh>
        <group ref={head} position-y={1.04}>
          <mesh scale={[1, 1.08, 0.95]} material={skin}>
            <sphereGeometry args={[0.165, seg, seg]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.163, -0.005, -0.01]} scale={[0.6, 1, 0.8]} material={skin}>
              <sphereGeometry args={[0.04, 10, 8]} />
            </mesh>
          ))}
          <Hair c={c} material={hair} seg={seg} />
          {/* eyes */}
          <group ref={eyes} position-y={0.03}>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.058, 0, 0.135]}>
                <mesh material={white} scale={[1, 1.15, 0.6]}>
                  <sphereGeometry args={[0.024, 12, 10]} />
                </mesh>
                <mesh position-z={0.013} material={ink}>
                  <sphereGeometry args={[0.015, 10, 8]} />
                </mesh>
              </group>
            ))}
          </group>
          {/* eyebrows — slightly raised: friendly */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.06, 0.088, 0.148]} rotation-z={s * -0.18} material={hair}>
              <boxGeometry args={[0.068, 0.019, 0.014]} />
            </mesh>
          ))}
          {/* nose */}
          <mesh position={[0, -0.01, 0.165]} scale={[0.9, 1, 0.9]} material={skinShade}>
            <sphereGeometry args={[0.03, 10, 8]} />
          </mesh>
          {/* smile */}
          <mesh position={[0, -0.07, 0.158]} rotation-z={Math.PI} material={mouth}>
            <torusGeometry args={[0.048, 0.009, 6, 16, Math.PI]} />
          </mesh>
          <FacialHair c={c} material={hair} skinShade={skinShade} />
          {c.glasses && <Glasses material={ink} />}
        </group>

        {/* right arm (viewer's left) — holding the kulhad in front of the chest */}
        <group position={[-0.215, 0.74, 0]} rotation={[-0.35, 0, -0.12]}>
          <mesh position-y={-0.15} material={kurta}>
            <capsuleGeometry args={[0.058, 0.22, 4, 8]} />
          </mesh>
          <group position-y={-0.3} rotation={[-1.75, 0, 0.35]}>
            <mesh position-y={-0.12} material={kurta}>
              <capsuleGeometry args={[0.052, 0.18, 4, 8]} />
            </mesh>
            <mesh position-y={-0.27} material={skin}>
              <sphereGeometry args={[0.052, 10, 8]} />
            </mesh>
            {/* kulhad held upright in world space */}
            <group position={[0, -0.3, 0.02]} rotation={[1.75 + 0.35, 0, -0.35]}>
              <Kulhad scale={1.5} position-y={-0.02} />
              <Steam position-y={0.12} height={0.32} size={0.06} intensity={0.35} />
            </group>
          </group>
        </group>

        {/* left arm (viewer's right) — waves when greeting */}
        <group ref={waveShoulder} position={[0.215, 0.74, 0]}>
          <mesh position-y={-0.15} material={kurta}>
            <capsuleGeometry args={[0.058, 0.22, 4, 8]} />
          </mesh>
          <group ref={waveElbow} position-y={-0.3}>
            <mesh position-y={-0.12} material={kurta}>
              <capsuleGeometry args={[0.052, 0.18, 4, 8]} />
            </mesh>
            <mesh position-y={-0.27} material={skin}>
              <sphereGeometry args={[0.055, 10, 8]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Hair({ c, material, seg }: { c: OwnerConfig; material: THREE.Material; seg: number }) {
  const curls = useCurls();
  if (c.hair.style === "bald") {
    return (
      <mesh position-y={-0.01} rotation-x={0.2} material={material}>
        <torusGeometry args={[0.15, 0.025, 6, 20, Math.PI]} />
      </mesh>
    );
  }
  if (c.hair.style === "curly") {
    return (
      <group>
        {curls.map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} material={material}>
            <sphereGeometry args={[0.05, 8, 6]} />
          </mesh>
        ))}
      </group>
    );
  }
  if (c.hair.style === "tousled") {
    // Short, thick hair with volume swept up on top.
    return (
      <group>
        <group rotation={[-0.35, 0, 0]}>
          <mesh scale={[1.05, 1.1, 1.02]} material={material}>
            <sphereGeometry args={[0.168, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
          </mesh>
        </group>
        {TOUSLE.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} scale={[1, 0.75, 1]} material={material}>
            <sphereGeometry args={[r, 10, 8]} />
          </mesh>
        ))}
      </group>
    );
  }
  const cap = c.hair.style === "short" ? 0.42 : 0.5;
  return (
    <group rotation={[-0.35, 0, c.hair.style === "side-part" ? 0.12 : 0]}>
      <mesh scale={[1.05, 1.1, 1.02]} material={material}>
        <sphereGeometry args={[0.168, seg, seg, 0, Math.PI * 2, 0, Math.PI * cap]} />
      </mesh>
      {c.hair.style === "side-part" && (
        <mesh position={[0.06, 0.15, 0.06]} rotation-z={-0.5} scale={[1.6, 0.6, 1]} material={material}>
          <sphereGeometry args={[0.06, 10, 8]} />
        </mesh>
      )}
    </group>
  );
}

/** Tufts for the "tousled" style: [x, y, z, radius] in head space. */
const TOUSLE: [number, number, number, number][] = [
  [-0.085, 0.15, 0.07, 0.065],
  [0.0, 0.175, 0.085, 0.07],
  [0.085, 0.15, 0.065, 0.065],
  [-0.045, 0.19, 0.0, 0.07],
  [0.05, 0.19, -0.01, 0.07],
  [-0.12, 0.11, -0.01, 0.055],
  [0.12, 0.11, -0.01, 0.055],
  [0.0, 0.16, -0.08, 0.07],
];

function useCurls(): [number, number, number][] {
  return useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const ring = i % 3;
      pts.push([
        Math.cos(a) * (0.13 - ring * 0.03),
        0.1 + ring * 0.04,
        Math.sin(a) * (0.12 - ring * 0.03) - 0.02,
      ]);
    }
    return pts;
  }, []);
}

function FacialHair({
  c,
  material,
  skinShade,
}: {
  c: OwnerConfig;
  material: THREE.Material;
  skinShade: THREE.Material;
}) {
  if (c.facialHair === "none") return null;
  if (c.facialHair === "stubble") {
    return (
      <mesh position={[0, -0.075, 0.02]} scale={[1, 0.65, 0.95]} material={skinShade}>
        <sphereGeometry args={[0.16, 16, 10, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
      </mesh>
    );
  }
  const moustache = (
    <group position={[0, -0.042, 0.155]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position-x={s * 0.035} rotation-z={s * 0.35} material={material}>
          <capsuleGeometry args={[0.011, 0.048, 4, 8]} />
        </mesh>
      ))}
    </group>
  );
  if (c.facialHair === "moustache") return moustache;
  return (
    <group>
      {moustache}
      <mesh position={[0, -0.09, 0.0]} scale={[1.0, 0.62, 1.07]} material={material}>
        <sphereGeometry args={[0.165, 16, 10, 0, Math.PI * 2, Math.PI * 0.63, Math.PI * 0.37]} />
      </mesh>
      {/* fuller chin */}
      <mesh position={[0, -0.168, 0.075]} scale={[1.0, 0.7, 0.75]} material={material}>
        <sphereGeometry args={[0.055, 10, 8]} />
      </mesh>
    </group>
  );
}

function Glasses({ material }: { material: THREE.Material }) {
  return (
    <group position={[0, 0.03, 0.16]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position-x={s * 0.058} material={material}>
          <torusGeometry args={[0.038, 0.006, 6, 18]} />
        </mesh>
      ))}
      <mesh material={material}>
        <boxGeometry args={[0.04, 0.008, 0.008]} />
      </mesh>
    </group>
  );
}

/** Lighten (amount > 0) or darken (< 0) a hex colour. */
function shade(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + amount, 0, 1));
  return `#${c.getHexString()}`;
}
