"use client";

import { ModelSlot } from "../models/ModelSlot";
import { PALETTE as P } from "../palette";
import { useMat, useQuality } from "../quality";
import { Kulhad, Steam, Tube, useTex } from "../shared";
import { counterFrontTexture } from "../textures";
import { FACADE_Z, SIDEWALK_Y } from "./Street";

export function StreetProps() {
  return (
    <group>
      <ModelSlot id="chaiCounter">
        <ChaiCounter position={[-3.35, SIDEWALK_Y, FACADE_Z + 0.95]} />
      </ModelSlot>
      <ModelSlot id="streetLamp">
        <StreetLamp position={[-6.1, SIDEWALK_Y, 0.55]} />
      </ModelSlot>
      <ModelSlot id="bicycle">
        <Bicycle position={[4.25, SIDEWALK_Y, FACADE_Z + 0.65]} rotation-y={-0.32} />
      </ModelSlot>
      <ModelSlot id="bench">
        <Bench position={[2.35, SIDEWALK_Y, -0.55]} rotation-y={-0.12} />
        <Bench position={[6.4, SIDEWALK_Y, -0.9]} rotation-y={0.2} length={1.4} />
      </ModelSlot>
      <Stool position={[-2.0, SIDEWALK_Y, -0.35]} />
      <Tulsi position={[1.95, SIDEWALK_Y, FACADE_Z + 0.4]} />
    </group>
  );
}

type GroupProps = React.JSX.IntrinsicElements["group"];

/** The colourful open chai counter outside the shop. */
function ChaiCounter(props: GroupProps) {
  const front = useTex(counterFrontTexture);
  const body = useMat(P.teal);
  const top = useMat(P.woodLight);
  const steel = useMat(P.steel, { metalness: 0.8, roughness: 0.3 });
  const glass = useMat(P.paper, { roughness: 0.2 });
  const stove = useMat(P.ink);
  const flame = useMat("#FF8A2A", { glow: true });
  const lidRed = useMat(P.red);
  const lidYellow = useMat(P.yellow);
  const quality = useQuality();
  const H = 1.0;
  return (
    <group {...props}>
      <mesh position-y={H / 2} material={body}>
        <boxGeometry args={[2.2, H, 0.8]} />
      </mesh>
      <mesh position={[0, H / 2, 0.401]}>
        <planeGeometry args={[2.2, H]} />
        <meshLambertMaterial map={front} />
      </mesh>
      <mesh position-y={H + 0.04} material={top}>
        <boxGeometry args={[2.36, 0.08, 0.9]} />
      </mesh>
      {/* stove + kettle */}
      <group position={[-0.55, H + 0.08, 0]}>
        <mesh position-y={0.05} material={stove}>
          <cylinderGeometry args={[0.16, 0.18, 0.1, 16]} />
        </mesh>
        <mesh position-y={0.105} rotation-x={-Math.PI / 2} material={flame} userData={{ noShadow: true }}>
          <ringGeometry args={[0.06, 0.1, 16]} />
        </mesh>
        <group position-y={0.11}>
          <mesh position-y={0.13} material={steel}>
            <cylinderGeometry args={[0.13, 0.15, 0.26, 18]} />
          </mesh>
          <mesh position={[0.17, 0.2, 0]} rotation-z={-0.9} material={steel}>
            <cylinderGeometry args={[0.018, 0.03, 0.18, 8]} />
          </mesh>
          <mesh position-y={0.32} rotation-x={Math.PI / 2} material={steel}>
            <torusGeometry args={[0.1, 0.012, 6, 16, Math.PI]} />
          </mesh>
          <Steam position={[0.24, 0.28, 0]} height={0.45} size={0.09} />
        </group>
        {quality === "high" && (
          <pointLight position={[0, 0.2, 0.3]} color="#FF9A4A" intensity={1.6} distance={2.2} />
        )}
      </group>
      {/* stacked kulhads */}
      {[0.25, 0.45, 0.65].map((x, i) =>
        Array.from({ length: 3 + i }, (_, k) => (
          <Kulhad
            key={`${x}-${k}`}
            fill={0}
            position={[x, H + 0.08 + k * 0.075, -0.15 + i * 0.05]}
            scale={1.1}
          />
        )),
      )}
      {/* two filled kulhads waiting */}
      <Kulhad position={[0.1, H + 0.08, 0.25]} scale={1.15} />
      <Kulhad position={[0.32, H + 0.08, 0.28]} scale={1.15} />
      {/* biscuit jars */}
      {[0.85, 1.0].map((x, i) => (
        <group key={x} position={[x, H + 0.08, 0.05 - i * 0.18]}>
          <mesh position-y={0.11} material={glass}>
            <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
          </mesh>
          <mesh position-y={0.23} material={i ? lidRed : lidYellow}>
            <cylinderGeometry args={[0.075, 0.075, 0.03, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StreetLamp(props: GroupProps) {
  const iron = useMat(P.ink, { metalness: 0.5, roughness: 0.5 });
  const glow = useMat(P.bulb, { glow: true });
  const quality = useQuality();
  return (
    <group {...props}>
      <mesh position-y={0.15} material={iron}>
        <cylinderGeometry args={[0.14, 0.18, 0.3, 10]} />
      </mesh>
      <mesh position-y={2.1} material={iron}>
        <cylinderGeometry args={[0.05, 0.065, 4.0, 10]} />
      </mesh>
      <Tube from={[0, 3.9, 0]} to={[0.75, 4.2, 0]} radius={0.03} material={iron} />
      <group position={[0.78, 3.95, 0]}>
        <mesh position-y={0.28} material={iron}>
          <coneGeometry args={[0.26, 0.2, 8]} />
        </mesh>
        <mesh position-y={0.05} material={glow} userData={{ noShadow: true }}>
          <cylinderGeometry args={[0.13, 0.09, 0.3, 8]} />
        </mesh>
        <pointLight
          position-y={-0.1}
          color={P.lampLight}
          intensity={quality === "high" ? 26 : 18}
          distance={11}
          decay={1.6}
        />
      </group>
    </group>
  );
}

/** A classic black roadster with a rear carrier and a cane basket. */
function Bicycle(props: GroupProps) {
  const black = useMat(P.ink, { metalness: 0.4, roughness: 0.45 });
  const tyre = useMat("#1A1412");
  const cane = useMat("#C89A5B");
  const seat = useMat(P.woodDark);
  const r = 0.34;
  const rear: [number, number, number] = [-0.55, r, 0];
  const front: [number, number, number] = [0.55, r, 0];
  const crank: [number, number, number] = [-0.05, r - 0.02, 0];
  const seatTop: [number, number, number] = [-0.18, 0.92, 0];
  const head: [number, number, number] = [0.42, 0.9, 0];
  return (
    <group {...props} rotation-z={0.05}>
      {[rear, front].map((p, i) => (
        <group key={i} position={p}>
          <mesh material={tyre}>
            <torusGeometry args={[r, 0.028, 8, 32]} />
          </mesh>
          {Array.from({ length: 8 }, (_, k) => (
            <mesh key={k} rotation-z={(k * Math.PI) / 8} material={black}>
              <boxGeometry args={[r * 2 - 0.04, 0.006, 0.006]} />
            </mesh>
          ))}
        </group>
      ))}
      <Tube from={rear} to={crank} radius={0.018} material={black} />
      <Tube from={crank} to={seatTop} radius={0.02} material={black} />
      <Tube from={seatTop} to={head} radius={0.02} material={black} />
      <Tube from={crank} to={[0.4, 0.82, 0]} radius={0.02} material={black} />
      <Tube from={rear} to={seatTop} radius={0.015} material={black} />
      <Tube from={head} to={front} radius={0.02} material={black} />
      <Tube from={head} to={[0.36, 1.08, 0]} radius={0.02} material={black} />
      <Tube from={[0.36, 1.08, -0.28]} to={[0.36, 1.08, 0.28]} radius={0.016} material={black} />
      <mesh position={[-0.2, 0.97, 0]} material={seat}>
        <boxGeometry args={[0.22, 0.05, 0.12]} />
      </mesh>
      {/* rear carrier */}
      <mesh position={[-0.52, 0.72, 0]} material={black}>
        <boxGeometry args={[0.42, 0.02, 0.16]} />
      </mesh>
      {/* basket */}
      <mesh position={[0.62, 0.98, 0]} material={cane}>
        <boxGeometry args={[0.26, 0.2, 0.3]} />
      </mesh>
    </group>
  );
}

function Bench({ length = 1.8, ...props }: { length?: number } & GroupProps) {
  const wood = useMat(P.wood);
  const dark = useMat(P.woodDark);
  return (
    <group {...props}>
      {[-0.13, 0, 0.13].map((z) => (
        <mesh key={z} position={[0, 0.46, z]} material={wood}>
          <boxGeometry args={[length, 0.05, 0.11]} />
        </mesh>
      ))}
      {[-length / 2 + 0.15, length / 2 - 0.15].map((x) =>
        [-0.14, 0.14].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.22, z]} material={dark}>
            <boxGeometry args={[0.07, 0.44, 0.07]} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Stool(props: GroupProps) {
  const wood = useMat(P.woodLight);
  return (
    <group {...props}>
      <mesh position-y={0.45} material={wood}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 14]} />
      </mesh>
      {[0, 2.1, 4.2].map((a) => (
        <Tube
          key={a}
          from={[Math.cos(a) * 0.08, 0.43, Math.sin(a) * 0.08]}
          to={[Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17]}
          radius={0.025}
          material={wood}
        />
      ))}
    </group>
  );
}

function Tulsi(props: GroupProps) {
  const pot = useMat(P.clay);
  const leaf = useMat("#4E7A3A");
  return (
    <group {...props}>
      <mesh position-y={0.2} material={pot}>
        <cylinderGeometry args={[0.22, 0.16, 0.4, 12]} />
      </mesh>
      {[
        [0, 0.6, 0, 0.2],
        [0.1, 0.52, 0.05, 0.14],
        [-0.1, 0.5, -0.04, 0.13],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} material={leaf}>
          <icosahedronGeometry args={[s, 0]} />
        </mesh>
      ))}
    </group>
  );
}
