"use client";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SHOTS, useDirector, type Director } from "./director";

export type Stage = "street" | "entering" | "interior";

/** Put the director straight into a shot (no animation). */
function jumpTo(
  d: Director,
  shot: keyof typeof SHOTS,
  extra: Partial<Pick<Director, "shutter" | "lights" | "pour">>,
) {
  d.camera.copy(SHOTS[shot].camera);
  d.target.copy(SHOTS[shot].target);
  d.fov = SHOTS[shot].fov;
  Object.assign(d, extra);
}

/**
 * Drives the cinematic sequence with a GSAP timeline:
 * shutter rolls up → lights come on → camera glides through the doorway →
 * close-up of chai pouring into a kulhad → pull back to reveal the interior.
 * Reduced motion: cuts straight to the interior instead.
 */
export function Choreography({
  stage,
  reducedMotion,
  greetPulse,
  onEntered,
}: {
  stage: Stage;
  reducedMotion: boolean;
  greetPulse: number;
  onEntered: () => void;
}) {
  // The director is a mutable object by design (GSAP writes to it); hold it in a ref.
  const director = useRef(useDirector());
  const tl = useRef<gsap.core.Timeline | null>(null);
  const entered = useRef(onEntered);
  useEffect(() => {
    entered.current = onEntered;
  }, [onEntered]);

  useEffect(() => {
    const d = director.current;
    if (stage === "street") {
      tl.current?.kill();
      jumpTo(d, "street", { shutter: 0, lights: 0, pour: 0 });
      d.lookAround = reducedMotion ? 0.15 : 0.35;
      return;
    }
    if (stage === "interior") {
      // Skip, or arriving after the transition: finish instantly.
      if (tl.current && tl.current.progress() < 1) tl.current.progress(1);
      tl.current?.kill();
      tl.current = null;
      jumpTo(d, "interior", { shutter: 1, lights: 1, pour: 0 });
      d.lookAround = reducedMotion ? 0.15 : 0.6;
      return;
    }
    // entering
    if (reducedMotion) {
      jumpTo(d, "interior", { shutter: 1, lights: 1, pour: 0 });
      const id = window.setTimeout(() => entered.current(), 50);
      return () => window.clearTimeout(id);
    }
    d.lookAround = 0;
    const t = gsap.timeline({ onComplete: () => entered.current() });
    const shot = (name: keyof typeof SHOTS, at: number, duration: number, ease: string) => {
      const s = SHOTS[name];
      t.to(d.camera, { x: s.camera.x, y: s.camera.y, z: s.camera.z, duration, ease }, at);
      t.to(d.target, { x: s.target.x, y: s.target.y, z: s.target.z, duration, ease }, at);
      t.to(d, { fov: s.fov, duration, ease }, at);
    };
    t.to(d, { ownerWave: 0, duration: 0.3 }, 0);
    t.to(d, { shutter: 1, duration: 1.4, ease: "power2.inOut" }, 0);
    t.to(d, { lights: 1, duration: 1.4, ease: "power1.in" }, 0.5);
    shot("doorway", 1.1, 1.7, "power2.in");
    shot("inside", 2.8, 1.1, "none");
    shot("pour", 3.9, 1.3, "power2.out");
    t.to(d, { pour: 1, duration: 2.2, ease: "none" }, 4.9);
    shot("interior", 7.1, 1.9, "power2.inOut");
    t.to(d, { lookAround: 0.6, duration: 0.6 }, 8.6);
    tl.current = t;
    return () => {
      t.kill();
    };
  }, [stage, reducedMotion]);

  // Owner waves whenever the greeting is (re)played.
  useEffect(() => {
    if (greetPulse === 0 || stage !== "street") return;
    const d = director.current;
    const t = gsap
      .timeline()
      .to(d, { ownerWave: 1, duration: reducedMotion ? 0 : 0.45, ease: "back.out(2)" })
      .to(d, { ownerWave: 0, duration: reducedMotion ? 0 : 0.6, ease: "power2.inOut" }, "+=1.8");
    return () => {
      t.kill();
    };
  }, [greetPulse, stage, reducedMotion]);

  return null;
}

/** Applies the director to the real camera, plus gentle pointer/touch look-around. */
export function CameraRig() {
  const d = useDirector();
  const look = useRef(new THREE.Vector2());
  const tmp = useMemo(
    () => ({ right: new THREE.Vector3(), target: new THREE.Vector3(), fwd: new THREE.Vector3() }),
    [],
  );

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    // Portrait phones: widen the lens so the whole shot still fits.
    const widen = aspect < 1 ? Math.min(1.8, Math.pow(1 / aspect, 0.7)) : 1;
    const fov = Math.min(88, d.fov * widen);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    look.current.lerp(state.pointer, 0.04);
    tmp.fwd.copy(d.target).sub(d.camera).normalize();
    tmp.right.crossVectors(tmp.fwd, camera.up).normalize();
    const k = d.lookAround;
    camera.position.copy(d.camera).addScaledVector(tmp.right, look.current.x * 0.25 * k);
    tmp.target
      .copy(d.target)
      .addScaledVector(tmp.right, look.current.x * 1.4 * k)
      .addScaledVector(camera.up, look.current.y * 0.5 * k);
    // Portrait: aim a little lower so the scene sits in the upper half, above the UI card.
    if (widen > 1) tmp.target.setY(tmp.target.y - (widen - 1) * 0.9 * (1 - d.lights * 0.6));
    camera.lookAt(tmp.target);
  });
  return null;
}
