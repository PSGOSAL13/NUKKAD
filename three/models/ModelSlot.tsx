"use client";

import { useEffect, useState, type ReactNode } from "react";
import type * as THREE from "three";
import { modelRegistry, type ModelEntry, type ModelId } from "./registry";

/**
 * Renders the GLB for `id` if one is registered, otherwise the coded
 * fallback (children). The coded version also shows while the file loads and
 * if it fails, so a bad file never breaks the opening.
 *
 * The GLTF loader (and Meshopt decoder) are imported only when a model is
 * actually registered, so they cost nothing until real models exist.
 */
export function ModelSlot({ id, children }: { id: ModelId; children: ReactNode }) {
  const entry = modelRegistry[id];
  const model = useGltf(entry);
  if (!entry.src || !model) return <>{children}</>;
  return <primitive object={model} position={entry.position} rotation={entry.rotation} scale={entry.scale} />;
}

const cache = new Map<string, Promise<THREE.Group>>();

function loadGltf(src: string): Promise<THREE.Group> {
  let p = cache.get(src);
  if (!p) {
    p = Promise.all([
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/libs/meshopt_decoder.module.js"),
    ]).then(async ([{ GLTFLoader }, { MeshoptDecoder }]) => {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(src);
      return gltf.scene;
    });
    cache.set(src, p);
  }
  return p;
}

function useGltf(entry: ModelEntry): THREE.Object3D | null {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (!entry.src) return;
    let cancelled = false;
    loadGltf(entry.src).then(
      (scene) => !cancelled && setModel(scene.clone(true)),
      (err) => console.warn(`[NUKKAD] could not load ${entry.src}, using coded model`, err),
    );
    return () => {
      cancelled = true;
    };
  }, [entry.src]);
  return model;
}
