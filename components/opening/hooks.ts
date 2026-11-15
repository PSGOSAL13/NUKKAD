"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GreetingLang } from "@/content/schema";

// ---------- Remembered preferences ----------

const AUDIO_KEY = "nukkad-audio";
const GREETING_KEY = "nukkad-greeting-lang";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: preference simply isn't remembered.
  }
}

/**
 * Sound on/off (muted by default for first-time visitors) and greeting
 * language (Hindi / Malayalam). Both are remembered for the next visit.
 * Values are read after mount so server HTML and first client render match.
 */
export function useOpeningPrefs(defaultGreeting: GreetingLang) {
  const [soundOn, setSoundOnState] = useState(false);
  const [greeting, setGreetingState] = useState<GreetingLang>(defaultGreeting);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setSoundOnState(read(AUDIO_KEY) === "on");
    const g = read(GREETING_KEY);
    if (g === "hi" || g === "ml") setGreetingState(g);
  }, []);

  const setSoundOn = useCallback((on: boolean) => {
    setSoundOnState(on);
    write(AUDIO_KEY, on ? "on" : "off");
  }, []);
  const setGreeting = useCallback((g: GreetingLang) => {
    setGreetingState(g);
    write(GREETING_KEY, g);
  }, []);

  return { soundOn, setSoundOn, greeting, setGreeting };
}

// ---------- Device capability ----------

/** "high" | "low" = 3D quality; "none" = 2D illustrated fallback; null = still checking. */
export type Tier = "high" | "low" | "none";

type NavigatorExtras = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function detectTier(): Tier {
  // Manual override for testing on real devices: ?opening-quality=high | low | 2d
  const forced = new URLSearchParams(location.search).get("opening-quality");
  if (forced === "high" || forced === "low") return forced;
  if (forced === "2d") return "none";

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return "none"; // respect Data Saver: skip the 3D download
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  try {
    const canvas = document.createElement("canvas");
    gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  } catch {
    gl = null;
  }
  if (!gl) return "none";
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const weakGpu =
    /Mali-[2-4]\d{2}|Mali-T|Adreno \(TM\) [2-5]\d{2}|PowerVR|SwiftShader|llvmpipe|Software/i.test(renderer);
  if (memory <= 4 || cores <= 4 || weakGpu) return "low";
  return "high";
}

export function useDeviceTier(): [Tier | null, (t: Tier) => void] {
  const [tier, setTier] = useState<Tier | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check must run in the browser
    setTier(detectTier());
  }, []);
  return [tier, setTier];
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element is at least partly on screen. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>): boolean {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** Resolves after the page has loaded and the browser is idle — 3D never competes with first paint. */
export function useAfterIdle(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const go = () => {
      const idle = (
        window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
      ).requestIdleCallback;
      if (idle) idle(() => !cancelled && setReady(true), { timeout: 1200 });
      else window.setTimeout(() => !cancelled && setReady(true), 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
    };
  }, [enabled]);
  return ready;
}

// ---------- Audio ----------

/**
 * Plays the greeting voice (once per language selection) and an optional
 * ambience loop while sound is on. Browsers block audio until the visitor
 * interacts, so if playback is refused it retries on the next tap/click.
 */
export function useOpeningAudio({
  soundOn,
  voiceSrc,
  ambienceSrc,
  playKey,
  active,
}: {
  soundOn: boolean;
  voiceSrc?: string;
  ambienceSrc?: string;
  /** Changes whenever the greeting should be (re)spoken. */
  playKey: string;
  /** False when the opening is off-screen or finished. */
  active: boolean;
}) {
  const voice = useRef<HTMLAudioElement | null>(null);
  const ambience = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const safePlay = useCallback((el: HTMLAudioElement) => {
    el.play().catch(() => {
      const retry = () => {
        el.play().catch(() => {});
      };
      window.addEventListener("pointerdown", retry, { once: true });
      window.addEventListener("keydown", retry, { once: true });
    });
  }, []);

  // Greeting voice
  useEffect(() => {
    if (!soundOn || !active || !voiceSrc) {
      voice.current?.pause();
      return;
    }
    const el = voice.current ?? new Audio();
    voice.current = el;
    el.src = voiceSrc;
    el.currentTime = 0;
    const onPlay = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);
    el.addEventListener("playing", onPlay);
    el.addEventListener("ended", onEnd);
    el.addEventListener("pause", onEnd);
    safePlay(el);
    return () => {
      el.removeEventListener("playing", onPlay);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("pause", onEnd);
      el.pause();
    };
  }, [soundOn, active, voiceSrc, playKey, safePlay]);

  // Ambience loop
  useEffect(() => {
    if (!soundOn || !active || !ambienceSrc) {
      ambience.current?.pause();
      return;
    }
    const el = ambience.current ?? new Audio(ambienceSrc);
    ambience.current = el;
    el.loop = true;
    el.volume = 0.35;
    safePlay(el);
    return () => el.pause();
  }, [soundOn, active, ambienceSrc, safePlay]);

  // Pause everything when the tab is hidden.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        voice.current?.pause();
        ambience.current?.pause();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return { speaking };
}
