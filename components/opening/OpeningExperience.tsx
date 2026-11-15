"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import type { GreetingLang, OpeningContent, OwnerCharacter } from "@/content/schema";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/cn";
import type { Stage } from "@/three/Choreography";
import {
  useAfterIdle,
  useDeviceTier,
  useInView,
  useOpeningAudio,
  useOpeningPrefs,
  useReducedMotion,
} from "./hooks";
import { BrewingLoader } from "./BrewingLoader";
import { OpeningPoster } from "./OpeningPoster";

// The 3D scene (three.js + R3F + GSAP) is a separate chunk, fetched only when used.
const OpeningScene = dynamic(() => import("@/three/OpeningScene"), { ssr: false });

export type OpeningExperienceProps = {
  labels: Dictionary["opening"];
  kicker: string;
  title: string;
  subtitle: string;
  greetings: OpeningContent["greetings"];
  /** Translation of the greeting in the page language (omitted when redundant). */
  translation?: string;
  defaultGreeting: GreetingLang;
  ambience?: string;
  owner: OwnerCharacter;
  /** id of the section to move to on Skip / Continue. */
  nextSectionId: string;
};

/**
 * NUKKAD cinematic opening — reusable, self-contained.
 *
 *   street   → the owner greets you (subtitles, optional voice)
 *   entering → shutter opens, camera flies in, chai is poured
 *   interior → the café revealed; Continue scrolls into the page
 *
 * Capable devices get the full 3D scene, weaker ones a simplified version,
 * and devices without WebGL (or with Data Saver) the illustrated 2D poster.
 * Shown on every visit; sound is off until the visitor turns it on, and both
 * the sound and greeting-language choices are remembered.
 */
export function OpeningExperience(props: OpeningExperienceProps) {
  const {
    labels,
    kicker,
    title,
    subtitle,
    greetings,
    translation,
    defaultGreeting,
    ambience,
    owner,
    nextSectionId,
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const reducedMotion = useReducedMotion();
  const [tier, setTier] = useDeviceTier();
  const use3D = tier === "high" || tier === "low";
  const idle = useAfterIdle(use3D);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("street");
  const { soundOn, setSoundOn, greeting, setGreeting } = useOpeningPrefs(defaultGreeting);

  const [greetPulse, setGreetPulse] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- wave again when the greeting changes
    if (ready) setGreetPulse((p) => p + 1);
  }, [ready, greeting]);

  const { speaking } = useOpeningAudio({
    soundOn,
    voiceSrc: greetings[greeting].voice,
    ambienceSrc: ambience,
    playKey: greeting,
    active: inView && stage === "street",
  });

  const goToNext = useCallback(() => {
    const el = document.getElementById(nextSectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, [nextSectionId, reducedMotion]);

  const show3D = use3D && idle;
  const sceneVisible = show3D && ready;

  const comeIn = () => {
    if (sceneVisible) setStage("entering");
    else goToNext();
  };
  const skip = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setStage("interior");
    goToNext();
  };

  const g = greetings[greeting];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="opening-title"
      className="relative isolate h-[calc(100svh-4rem)] max-h-[60rem] min-h-[36rem] overflow-hidden bg-ink sm:h-[calc(100svh-5rem)]"
    >
      {/* 2D poster: instant first paint, and the fallback */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          sceneVisible ? "opacity-0" : "opacity-100",
        )}
      >
        <OpeningPoster owner={owner} />
      </div>

      {show3D && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            sceneVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <OpeningScene
            stage={stage}
            quality={tier === "high" ? "high" : "low"}
            reducedMotion={reducedMotion}
            owner={owner}
            greetPulse={greetPulse}
            active={inView}
            onReady={() => setReady(true)}
            onEntered={() => setStage("interior")}
            onDecline={() => setTier("low")}
            onFail={() => {
              setReady(false);
              setTier("none");
            }}
          />
        </div>
      )}

      <p className="sr-only">{stage === "interior" ? labels.interiorDescription : labels.sceneDescription}</p>

      {/* legibility scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/75 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink/80 to-transparent"
      />

      {/* overlay UI */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between gap-4 p-4 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-display text-lg text-yellow sm:text-2xl">{kicker}</p>
            <h1
              id="opening-title"
              className="font-display text-4xl leading-[1.05] text-cream drop-shadow-[0_2px_0_rgb(43_29_22/0.6)] sm:text-6xl"
            >
              {title}
            </h1>
            {stage === "interior" && <p className="mt-3 max-w-md text-lg text-cream/90">{subtitle}</p>}
            {use3D && !ready && (
              <div className="mt-3 inline-flex">
                <BrewingLoader
                  label={labels.loading}
                  skipLabel={labels.useSimpleView}
                  onSkip={() => setTier("none")}
                />
              </div>
            )}
          </div>
          <SoundButton on={soundOn} onToggle={() => setSoundOn(!soundOn)} labels={labels} />
        </div>

        {stage === "street" && (
          <GreetingCard
            labels={labels}
            greetings={greetings}
            greeting={greeting}
            onGreeting={setGreeting}
            text={g.text}
            translation={
              translation && !(greeting === "ml" && defaultGreeting === "ml") ? translation : undefined
            }
            speaking={speaking}
            onComeIn={comeIn}
            onSkip={skip}
            nextSectionId={nextSectionId}
          />
        )}

        {stage === "entering" && (
          <div className="pointer-events-auto flex justify-end">
            <a
              href={`#${nextSectionId}`}
              onClick={skip}
              className={buttonClasses({ variant: "outline", className: "bg-cream/90" })}
            >
              {labels.skip}
            </a>
          </div>
        )}

        {stage === "interior" && (
          <div className="pointer-events-auto flex flex-wrap items-center gap-4">
            <button type="button" onClick={goToNext} className={buttonClasses({ size: "lg" })}>
              {labels.continue}
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M10 4v12M5 11l5 5 5-5" />
              </svg>
            </button>
            {sceneVisible && <p className="text-sm text-cream/80">{labels.lookAround}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function SoundButton({
  on,
  onToggle,
  labels,
}: {
  on: boolean;
  onToggle: () => void;
  labels: Dictionary["opening"];
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={on ? labels.mute : labels.unmute}
      title={on ? labels.mute : labels.unmute}
      className="pointer-events-auto grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream text-ink shadow-print-sm transition-colors hover:bg-yellow"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M16 9a4 4 0 0 1 0 6" />
            <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9l5 6M21 9l-5 6" />
        )}
      </svg>
    </button>
  );
}

function GreetingCard({
  labels,
  greetings,
  greeting,
  onGreeting,
  text,
  translation,
  speaking,
  onComeIn,
  onSkip,
  nextSectionId,
}: {
  labels: Dictionary["opening"];
  greetings: OpeningContent["greetings"];
  greeting: GreetingLang;
  onGreeting: (g: GreetingLang) => void;
  text: string;
  translation?: string;
  speaking: boolean;
  onComeIn: () => void;
  onSkip: (e?: React.MouseEvent) => void;
  nextSectionId: string;
}) {
  return (
    <div className="pointer-events-auto relative w-full max-w-lg rounded-xl border-2 border-ink bg-paper texture-paper p-5 shadow-print sm:p-6 lg:max-w-md lg:self-end">
      {/* speech-bubble tail pointing up at the owner */}
      <span
        aria-hidden="true"
        className="absolute -top-[11px] left-16 size-5 rotate-45 border-t-2 border-l-2 border-ink bg-paper sm:left-24 lg:top-16 lg:-left-[11px] lg:border-t-0 lg:border-b-2"
      />
      <div role="group" aria-label={labels.greetingLanguage} className="flex gap-2">
        {(Object.keys(greetings) as GreetingLang[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={greeting === key}
            onClick={() => onGreeting(key)}
            lang={key === "ml" ? "ml" : "en"}
            className={cn(
              "rounded-md border-2 px-3 py-1 font-heading text-sm font-semibold transition-colors",
              greeting === key
                ? "border-ink bg-red text-cream"
                : "border-cream-dark text-ink hover:border-ink",
            )}
          >
            {greetings[key].label}
          </button>
        ))}
      </div>

      {/* subtitles */}
      <div aria-live="polite" className="mt-4 flex items-start gap-3">
        <p
          lang={greeting === "ml" ? "ml" : "hi-Latn"}
          className="font-display text-2xl leading-snug text-red sm:text-3xl"
        >
          “{text}”
        </p>
        {speaking && <SpeakingBars />}
      </div>
      {translation && <p className="mt-2 text-ink-muted">{translation}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onComeIn} className={buttonClasses({ size: "lg" })}>
          {labels.comeSitStay}
        </button>
        <a href={`#${nextSectionId}`} onClick={onSkip} className={buttonClasses({ variant: "ghost" })}>
          {labels.skip}
        </a>
      </div>
    </div>
  );
}

function SpeakingBars() {
  return (
    <span aria-hidden="true" className="mt-2 flex h-5 items-end gap-0.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1 rounded-full bg-red motion-safe:animate-[speak_700ms_ease-in-out_infinite]"
          style={{ height: "100%", animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
