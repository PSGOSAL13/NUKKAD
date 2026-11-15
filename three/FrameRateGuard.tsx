"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Watches the frame rate and calls `onDecline` once if the device can't keep
 * up (average below `minFps` over two consecutive sample windows), so the
 * opening can drop to the simplified scene. Ignores the first second, while
 * shaders compile.
 */
export function FrameRateGuard({
  onDecline,
  minFps = 40,
  windowSec = 1.5,
}: {
  onDecline: () => void;
  minFps?: number;
  windowSec?: number;
}) {
  const s = useRef({ elapsed: 0, frames: 0, warmup: 1, strikes: 0, done: false });
  useFrame((_, delta) => {
    const st = s.current;
    if (st.done) return;
    if (st.warmup > 0) {
      st.warmup -= delta;
      return;
    }
    st.elapsed += Math.min(delta, 0.25);
    st.frames += 1;
    if (st.elapsed >= windowSec) {
      const fps = st.frames / st.elapsed;
      st.strikes = fps < minFps ? st.strikes + 1 : 0;
      st.elapsed = 0;
      st.frames = 0;
      if (st.strikes >= 2) {
        st.done = true;
        onDecline();
      }
    }
  });
  return null;
}
