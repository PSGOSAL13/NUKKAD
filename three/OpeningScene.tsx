"use client";

import { FrameRateGuard } from "./FrameRateGuard";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OwnerCharacter } from "@/content/schema";
import { Owner } from "./character/OwnerCharacter";
import { CameraRig, Choreography, type Stage } from "./Choreography";
import { createDirector, DirectorContext, SHOTS } from "./director";
import { Deferred } from "./Deferred";
import { Interior } from "./interior/Interior";
import { PALETTE as P } from "./palette";
import { disposeMaterials, QualityContext, type Quality } from "./quality";
import { FACADE_Z, SIDEWALK_Y, Street } from "./street/Street";
import { StreetProps } from "./street/StreetProps";

export type OpeningSceneProps = {
  stage: Stage;
  quality: Quality;
  reducedMotion: boolean;
  owner: OwnerCharacter;
  /** Increment to make the owner wave (e.g. when the greeting plays). */
  greetPulse: number;
  /** False when the opening is scrolled out of view: rendering pauses. */
  active: boolean;
  onReady: () => void;
  onEntered: () => void;
  /** Frame rate is struggling — parent should switch to low quality. */
  onDecline: () => void;
  /** WebGL context lost — parent should show the 2D fallback. */
  onFail: () => void;
};

/**
 * The cinematic 3D opening. Loaded on demand (code-split) by
 * components/opening/OpeningExperience.tsx, never on the server.
 */
export default function OpeningScene(props: OpeningSceneProps) {
  const { quality, active, onFail } = props;
  const [director] = useState(createDirector);
  // Render only after every shader has been compiled in the background (see <Precompile>).
  const [warm, setWarm] = useState(false);
  useEffect(() => () => disposeMaterials(), []);

  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      shadows={quality === "high"}
      frameloop={active && warm ? "always" : "never"}
      camera={{ position: SHOTS.street.camera.toArray(), fov: SHOTS.street.fov, near: 0.05, far: 90 }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false }}
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onFail();
          },
          { once: true },
        );
      }}
    >
      <DirectorContext.Provider value={director}>
        <QualityContext.Provider value={quality}>
          <SceneContents {...props} />
          <Precompile onDone={() => setWarm(true)} />
        </QualityContext.Provider>
      </DirectorContext.Provider>
    </Canvas>
  );
}

function SceneContents({
  stage,
  quality,
  reducedMotion,
  owner,
  greetPulse,
  onReady,
  onEntered,
  onDecline,
}: OpeningSceneProps) {
  return (
    <>
      <color attach="background" args={[P.skyTop]} />
      <fog attach="fog" args={[P.skyMid, 18, 46]} />
      <Lights quality={quality} />
      <Street />
      <StreetProps />
      <Owner config={owner} position={[-1.35, SIDEWALK_Y, FACADE_Z + 1.55]} rotation-y={0.28} scale={1.15} />
      {/* The interior is behind the shutter: build it once the street is on screen. */}
      <Deferred>
        <Interior />
        {quality === "high" && <ShadowSetup />}
      </Deferred>
      <CameraRig />
      <Choreography
        stage={stage}
        reducedMotion={reducedMotion}
        greetPulse={greetPulse}
        onEntered={onEntered}
      />
      {quality === "high" && <FrameRateGuard onDecline={onDecline} />}
      {quality === "high" && <ShadowSetup />}
      <ReadySignal onReady={onReady} />
    </>
  );
}

/**
 * Compiles every shader before the first frame — in the background where the
 * browser supports parallel compilation (KHR_parallel_shader_compile) — so
 * starting the 3D scene does not freeze the page on phones. The illustrated
 * street stays on screen meanwhile. Stops waiting after 4 seconds.
 */
function Precompile({ onDone }: { onDone: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      done.current();
    };
    gl.compileAsync(scene, camera).then(finish, finish);
    const timer = window.setTimeout(finish, 4000);
    return () => window.clearTimeout(timer);
  }, [gl, scene, camera]);
  return null;
}

/** Warm evening: purple-blue sky fill, low orange sun, plus the practical lights in the props. */
function Lights({ quality }: { quality: Quality }) {
  return (
    <>
      <hemisphereLight args={["#8C7BB8", "#5A3A2A", quality === "high" ? 1.1 : 1.5]} />
      <directionalLight
        position={[-7, 7, 7]}
        color={P.skyLow}
        intensity={quality === "high" ? 1.6 : 1.8}
        castShadow={quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={7}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0006}
      />
    </>
  );
}

/** Enable shadows on everything except glows, sky and particles (userData.noShadow). */
function ShadowSetup() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !o.userData.noShadow) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);
  return null;
}

/** Tell the page the scene has actually drawn (so the 2D poster can fade out). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}
