"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useDirector } from "../director";
import { ModelSlot } from "../models/ModelSlot";
import { PALETTE as P } from "../palette";
import { useMat, useQuality } from "../quality";
import { Kulhad, Steam, Tube, useTex } from "../shared";
import { FACADE_Z, SIDEWALK_Y } from "../street/Street";
import {
  carromTexture,
  chalkboardTexture,
  floorTexture,
  ludoTexture,
  nostalgiaTexture,
  plasterTexture,
} from "../textures";

/** Room bounds. */
const X = 4.9;
const BACK = -13;
const FRONT = FACADE_Z - 0.2;
const CEIL = 4.2;
const FLOOR = SIDEWALK_Y;
/** Counter top height (world y) and where the pour happens. */
export const COUNTER_TOP = FLOOR + 1.11;
export const POUR_CUP: [number, number, number] = [1.25, COUNTER_TOP, -11.45];

type GroupProps = React.JSX.IntrinsicElements["group"];

export function Interior() {
  return (
    <group>
      <Room />
      <ModelSlot id="interiorCounter">
        <Counter />
      </ModelSlot>
      <ChaiPour />
      <CommunalTable position={[-1.6, FLOOR, -6.6]} />
      <CommunalTable position={[-1.6, FLOOR, -9.4]} />
      <SmallTable position={[2.55, FLOOR, -5.4]} game="carrom" />
      <SmallTable position={[2.4, FLOOR, -8.6]} game="ludo" />
      <ModelSlot id="bookshelf">
        <Bookshelf position={[X - 0.2, FLOOR, -10.3]} rotation-y={-Math.PI / 2} />
      </ModelSlot>
      <ModelSlot id="radio">
        <RadioCorner position={[X - 0.35, FLOOR, -7.0]} rotation-y={-Math.PI / 2} />
      </ModelSlot>
      <NostalgiaWall />
      <HangingBulbs />
    </group>
  );
}

function Room() {
  const floorTex = useTex(floorTexture);
  const wallTex = useTex(() => plasterTexture("#E9C994"));
  const floor = useMemo(() => new THREE.MeshLambertMaterial({ map: floorTex }), [floorTex]);
  const wall = useMemo(() => new THREE.MeshLambertMaterial({ map: wallTex }), [wallTex]);
  useEffect(() => () => [floor, wall].forEach((m) => m.dispose()), [floor, wall]);
  const ceiling = useMat(P.woodDark);
  const beam = useMat(P.wood);
  const dado = useMat(P.redDark);
  const depth = FRONT - BACK;
  const midZ = (FRONT + BACK) / 2;
  const chalk = useTex(chalkboardTexture);
  const frame = useMat(P.woodLight);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR + 0.002, midZ]} material={floor}>
        <planeGeometry args={[X * 2, depth]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, CEIL, midZ]} material={ceiling}>
        <planeGeometry args={[X * 2, depth]} />
      </mesh>
      {[-3, 0, 3].map((z) => (
        <mesh key={z} position={[0, CEIL - 0.12, midZ + z]} material={beam}>
          <boxGeometry args={[X * 2, 0.22, 0.22]} />
        </mesh>
      ))}
      {/* walls */}
      <mesh position={[0, CEIL / 2, BACK]} material={wall}>
        <planeGeometry args={[X * 2, CEIL]} />
      </mesh>
      <mesh rotation-y={Math.PI / 2} position={[-X, CEIL / 2, midZ]} material={wall}>
        <planeGeometry args={[depth, CEIL]} />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[X, CEIL / 2, midZ]} material={wall}>
        <planeGeometry args={[depth, CEIL]} />
      </mesh>
      {/* painted dado band */}
      <mesh rotation-y={Math.PI / 2} position={[-X + 0.01, 1.0, midZ]} material={dado}>
        <planeGeometry args={[depth, 0.12]} />
      </mesh>
      <mesh rotation-y={-Math.PI / 2} position={[X - 0.01, 1.0, midZ]} material={dado}>
        <planeGeometry args={[depth, 0.12]} />
      </mesh>
      {/* "Chai & Conversations" chalkboard wall above the counter */}
      <group position={[0.4, 2.75, BACK + 0.03]}>
        <mesh material={frame}>
          <boxGeometry args={[4.6, 2.1, 0.05]} />
        </mesh>
        <mesh position-z={0.03}>
          <planeGeometry args={[4.4, 1.9]} />
          <meshLambertMaterial map={chalk} />
        </mesh>
      </group>
    </group>
  );
}

function Counter() {
  const wood = useMat(P.wood);
  const top = useMat(P.woodLight);
  const steel = useMat(P.steel, { metalness: 0.8, roughness: 0.3 });
  const brass = useMat("#C9973A", { metalness: 0.7, roughness: 0.35 });
  const z = -11.75;
  const h = COUNTER_TOP - FLOOR - 0.06;
  return (
    <group position={[0.4, FLOOR, z]}>
      <mesh position-y={h / 2} material={wood}>
        <boxGeometry args={[4.2, h, 0.9]} />
      </mesh>
      {/* front planks */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-2.0 + i * 0.36, h / 2, 0.455]} material={i % 2 ? wood : top}>
          <boxGeometry args={[0.34, h - 0.1, 0.02]} />
        </mesh>
      ))}
      <mesh position-y={h + 0.03} material={top}>
        <boxGeometry args={[4.4, 0.06, 1.0]} />
      </mesh>
      {/* brass chai boiler */}
      <group position={[-1.4, h + 0.06, -0.1]}>
        <mesh position-y={0.3} material={brass}>
          <cylinderGeometry args={[0.24, 0.27, 0.6, 18]} />
        </mesh>
        <mesh position-y={0.66} material={brass}>
          <sphereGeometry args={[0.24, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <Steam position={[0, 0.85, 0]} height={0.5} size={0.14} />
      </group>
      {/* steel tumblers + kulhad stacks */}
      {[-0.6, -0.45, -0.3].map((x) => (
        <mesh key={x} position={[x, h + 0.13, 0.1]} material={steel}>
          <cylinderGeometry args={[0.04, 0.032, 0.14, 10]} />
        </mesh>
      ))}
      {[1.5, 1.68].map((x, i) =>
        Array.from({ length: 4 - i }, (_, k) => (
          <Kulhad key={`${x}${k}`} fill={0} scale={1.3} position={[x, h + 0.06 + k * 0.09, -0.15]} />
        )),
      )}
    </group>
  );
}

/** Close-up moment: kettle tilts, a stream of chai fills the kulhad, steam rises. */
function ChaiPour() {
  const d = useDirector();
  const kettle = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const fill = useRef<THREE.Mesh>(null);
  const steel = useMat("#B9BEC0", { metalness: 0.35, roughness: 0.3 });
  const handle = useMat(P.ink);
  const chai = useMat(P.chai, { roughness: 0.25, emissive: "#3A1A08", emissiveIntensity: 0.4 });
  const [cx, cy, cz] = POUR_CUP;
  const cupScale = 1.6;
  const tmp = useMemo(
    () => ({
      tip: new THREE.Vector3(),
      surface: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
    }),
    [],
  );

  useFrame((state) => {
    const p = d.pour;
    // 0–0.25 lift + tilt · 0.25–0.8 pour · 0.8–1 settle back
    const tilt = smooth(0, 0.25, p) - smooth(0.8, 1, p);
    const f = smooth(0.25, 0.8, p);
    const surfaceY = cy + (0.012 + f * 0.07) * cupScale;
    const k = kettle.current;
    if (k) {
      k.rotation.z = tilt * 0.95;
      k.position.y = COUNTER_TOP + tilt * 0.3;
      k.updateMatrixWorld();
    }
    const s = stream.current;
    if (s && k) {
      const flowing = p > 0.22 && p < 0.84;
      s.visible = flowing;
      if (flowing) {
        // Stream runs from the spout tip down to the rising chai surface.
        k.localToWorld(tmp.tip.copy(SPOUT_TIP));
        tmp.surface.set(cx, surfaceY, cz);
        tmp.dir.copy(tmp.surface).sub(tmp.tip);
        const len = tmp.dir.length();
        s.position.copy(tmp.tip).addScaledVector(tmp.dir, 0.5);
        s.quaternion.setFromUnitVectors(tmp.up, tmp.dir.normalize());
        const wobble = 1 + Math.sin(state.clock.elapsedTime * 40) * 0.12;
        s.scale.set(wobble, len, wobble);
      }
    }
    if (fill.current) {
      fill.current.visible = f > 0.01;
      fill.current.position.y = surfaceY;
      fill.current.scale.setScalar(0.75 + f * 0.25);
    }
  });

  return (
    <group>
      {/* the kulhad being filled (empty cup + rising chai disk) */}
      <Kulhad fill={0} scale={cupScale} position={[cx, cy, cz]} />
      <mesh ref={fill} rotation-x={-Math.PI / 2} position={[cx, cy, cz]} material={chai}>
        <circleGeometry args={[0.043 * cupScale, 18]} />
      </mesh>
      {/* a second kulhad already poured, waiting to be served */}
      <Kulhad scale={cupScale} position={[cx - 0.22, cy, cz + 0.08]} />
      {/* stream (unit height, stretched every frame) */}
      <mesh ref={stream} material={chai} visible={false} userData={{ noShadow: true }}>
        <cylinderGeometry args={[0.008, 0.011, 1, 6]} />
      </mesh>
      {/* kettle: pivots at its base on the right of the cup, spout faces −x */}
      <group ref={kettle} position={[cx + 0.32, COUNTER_TOP, cz]}>
        <mesh position-y={0.13} material={steel}>
          <cylinderGeometry args={[0.1, 0.12, 0.24, 18]} />
        </mesh>
        <mesh position-y={0.27} material={steel}>
          <cylinderGeometry args={[0.04, 0.1, 0.05, 18]} />
        </mesh>
        <mesh position={[-0.15, 0.2, 0]} rotation-z={0.95} material={steel}>
          <cylinderGeometry args={[0.012, 0.025, 0.18, 8]} />
        </mesh>
        <mesh position={[0.12, 0.15, 0]} rotation-y={Math.PI / 2} material={handle}>
          <torusGeometry args={[0.07, 0.012, 6, 14, Math.PI]} />
        </mesh>
      </group>
      <Steam
        position={[cx, cy + 0.14, cz]}
        height={0.35}
        size={0.06}
        intensity={0.28}
        active={() => d.pour > 0.45}
      />
    </group>
  );
}

/** Spout tip in the kettle's local space (spout centre + half its length along its axis). */
const SPOUT_TIP = new THREE.Vector3(-0.15 - Math.sin(0.95) * 0.09, 0.2 + Math.cos(0.95) * 0.09, 0);

function smooth(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Long shared table with a bench on each side. */
function CommunalTable(props: GroupProps) {
  const wood = useMat(P.wood);
  const dark = useMat(P.woodDark);
  const L = 3.2;
  return (
    <group {...props}>
      <mesh position-y={0.76} material={wood}>
        <boxGeometry args={[L, 0.06, 0.9]} />
      </mesh>
      {[-L / 2 + 0.2, L / 2 - 0.2].map((x) => (
        <mesh key={x} position={[x, 0.37, 0]} material={dark}>
          <boxGeometry args={[0.08, 0.74, 0.7]} />
        </mesh>
      ))}
      {[-0.75, 0.75].map((z) => (
        <group key={z} position-z={z}>
          <mesh position-y={0.45} material={wood}>
            <boxGeometry args={[L, 0.05, 0.32]} />
          </mesh>
          {[-L / 2 + 0.2, L / 2 - 0.2].map((x) => (
            <mesh key={x} position={[x, 0.22, 0]} material={dark}>
              <boxGeometry args={[0.07, 0.44, 0.25]} />
            </mesh>
          ))}
        </group>
      ))}
      <Kulhad position={[-0.6, 0.79, 0.15]} scale={1.3} />
      <Kulhad position={[0.4, 0.79, -0.2]} scale={1.3} />
      <Kulhad position={[0.9, 0.79, 0.25]} scale={1.3} fill={0.3} />
    </group>
  );
}

function SmallTable({ game, ...props }: { game: "carrom" | "ludo" } & GroupProps) {
  const wood = useMat(P.woodLight);
  const dark = useMat(P.woodDark);
  const tex = useTex(game === "carrom" ? carromTexture : ludoTexture, game);
  return (
    <group {...props}>
      <mesh position-y={0.72} material={wood}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 24]} />
      </mesh>
      <mesh position-y={0.36} material={dark}>
        <cylinderGeometry args={[0.06, 0.1, 0.72, 10]} />
      </mesh>
      <mesh position-y={0.755} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={game === "carrom" ? [0.62, 0.62] : [0.5, 0.5]} />
        <meshLambertMaterial map={tex} />
      </mesh>
      {game === "carrom" && (
        <mesh position-y={0.75} rotation-y={0.3} material={dark}>
          <boxGeometry args={[0.7, 0.04, 0.7]} />
        </mesh>
      )}
      {[0, Math.PI].map((a) => (
        <group key={a} position={[Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85]}>
          <mesh position-y={0.45} material={wood}>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 14]} />
          </mesh>
          <mesh position-y={0.22} material={dark}>
            <cylinderGeometry args={[0.04, 0.06, 0.44, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Bookshelf with instanced books (1 draw call). */
function Bookshelf(props: GroupProps) {
  const quality = useQuality();
  const wood = useMat(P.woodDark);
  const book = useMat("#FFFFFF", { roughness: 0.8 });
  const ref = useRef<THREE.InstancedMesh>(null);
  const W = 2.2;
  const H = 2.3;
  const shelves = 4;
  const perShelf = quality === "high" ? 18 : 10;
  const count = shelves * perShelf;
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const colors = [P.red, P.yellow, P.teal, P.cream, P.clay, P.redDark, "#2E5E8C", P.ink];
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    let i = 0;
    for (let s = 0; s < shelves; s++) {
      let x = -W / 2 + 0.08;
      for (let b = 0; b < perShelf && i < count; b++, i++) {
        const w = 0.04 + Math.random() * 0.05;
        const h = 0.24 + Math.random() * 0.14;
        const lean = b === perShelf - 1 ? 0.25 : 0;
        m.compose(
          new THREE.Vector3(x + w / 2, 0.18 + s * (H / shelves) + h / 2, 0),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -lean)),
          new THREE.Vector3(w, h, 0.22),
        );
        mesh.setMatrixAt(i, m);
        mesh.setColorAt(i, c.set(colors[(s * 7 + b * 3) % colors.length]));
        x += w + 0.008;
        if (x > W / 2 - 0.12) break;
      }
    }
    mesh.count = i;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, perShelf]);
  return (
    <group {...props}>
      {/* frame */}
      <mesh position={[0, H / 2, -0.16]} material={wood}>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>
      {[-W / 2, W / 2].map((x) => (
        <mesh key={x} position={[x, H / 2, 0]} material={wood}>
          <boxGeometry args={[0.05, H, 0.34]} />
        </mesh>
      ))}
      {Array.from({ length: shelves + 1 }, (_, s) => (
        <mesh key={s} position={[0, 0.15 + s * (H / shelves), 0]} material={wood}>
          <boxGeometry args={[W, 0.04, 0.34]} />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[undefined, book, count]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </group>
  );
}

/** Vintage valve radio on a side table. */
function RadioCorner(props: GroupProps) {
  const wood = useMat(P.woodLight);
  const dark = useMat(P.woodDark);
  const cloth = useMat(P.creamDark);
  const dial = useMat(P.yellow, { emissive: P.yellow, emissiveIntensity: 0.6 });
  const knob = useMat(P.ink);
  const games = [useMat(P.red), useMat(P.teal), useMat(P.yellow)];
  return (
    <group {...props}>
      <mesh position-y={0.4} material={dark}>
        <boxGeometry args={[1.3, 0.8, 0.5]} />
      </mesh>
      {/* stacked board-game boxes */}
      {games.map((m, i) => (
        <mesh key={i} position={[0.42, 0.83 + i * 0.055, 0]} rotation-y={(i - 1) * 0.15} material={m}>
          <boxGeometry args={[0.36, 0.05, 0.3]} />
        </mesh>
      ))}
      <group position={[-0.25, 0.98, 0]}>
        <mesh material={wood}>
          <boxGeometry args={[0.62, 0.36, 0.26]} />
        </mesh>
        <mesh position={[-0.1, 0.02, 0.131]} material={cloth}>
          <planeGeometry args={[0.32, 0.26]} />
        </mesh>
        <mesh position={[0.2, 0.06, 0.132]} material={dial}>
          <circleGeometry args={[0.065, 18]} />
        </mesh>
        {[0.14, 0.26].map((x) => (
          <mesh key={x} position={[x, -0.1, 0.14]} rotation-x={Math.PI / 2} material={knob}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 10]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Left wall: framed, illustrated sepia memories of old North India. */
function NostalgiaWall() {
  const frame = useMat(P.woodDark);
  const tex = useMemo(() => [0, 1, 2, 3, 4].map((i) => nostalgiaTexture(i)), []);
  useEffect(() => () => tex.forEach((t) => t.dispose()), [tex]);
  const frames: { z: number; y: number; w: number; i: number }[] = [
    { z: -4.4, y: 2.3, w: 0.9, i: 0 },
    { z: -5.7, y: 2.0, w: 0.7, i: 1 },
    { z: -6.9, y: 2.45, w: 1.1, i: 2 },
    { z: -8.4, y: 2.1, w: 0.8, i: 3 },
    { z: -9.8, y: 2.35, w: 1.0, i: 4 },
  ];
  return (
    <group position-x={-X + 0.04} rotation-y={Math.PI / 2}>
      {frames.map((f) => (
        <group key={f.z} position={[-f.z, f.y, 0]}>
          <mesh material={frame}>
            <boxGeometry args={[f.w + 0.1, f.w * 0.78 + 0.1, 0.04]} />
          </mesh>
          <mesh position-z={0.025}>
            <planeGeometry args={[f.w, f.w * 0.78]} />
            <meshLambertMaterial map={tex[f.i]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HangingBulbs() {
  const d = useDirector();
  const quality = useQuality();
  const bulbs: [number, number, number][] = [
    [-1.6, 3.15, -6.6],
    [-1.6, 3.15, -9.4],
    [1.4, 3.25, -11.0],
    [2.5, 3.2, -6.8],
  ];
  const glow = useMat(P.bulb, { glow: true });
  const cord = useMat(P.ink);
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  useFrame(() => {
    lights.current.forEach((l) => {
      if (l) l.intensity = d.lights * (quality === "high" ? 9 : 14);
    });
  });
  const lit =
    quality === "high" ? bulbs : bulbs.slice(0, 1).map(() => [0, 3.1, -8] as [number, number, number]);
  return (
    <group>
      {bulbs.map(([x, y, z], i) => (
        <group key={i}>
          <Tube from={[x, CEIL, z]} to={[x, y + 0.08, z]} radius={0.006} material={cord} />
          <mesh position={[x, y, z]} material={glow} userData={{ noShadow: true }}>
            <sphereGeometry args={[0.07, 12, 10]} />
          </mesh>
        </group>
      ))}
      {lit.map(([x, y, z], i) => (
        <pointLight
          key={i}
          ref={(l) => {
            lights.current[i] = l;
          }}
          position={[x, y - 0.12, z]}
          color={P.interiorLight}
          intensity={0}
          distance={quality === "high" ? 7 : 14}
          decay={1.5}
        />
      ))}
    </group>
  );
}
