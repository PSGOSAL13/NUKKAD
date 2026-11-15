import type { z } from "zod";
import type { openingSchema } from "./schema";

/**
 * ✏️  EDIT ME — the cinematic opening (welcome from the owner).
 *
 * VOICE RECORDINGS (not yet provided):
 *   Record each line in a quiet room, warm and unhurried, ~3–4 seconds.
 *   Export as MP3 (mono, 96–128 kbps) or M4A/AAC, peak around −3 dB,
 *   trim silence, then save to /public/audio/ and set `voice` below:
 *     /public/audio/welcome-hi.mp3   "Namaste! NUKKAD mein aapka swagat hai. Chai piyenge?"
 *     /public/audio/welcome-ml.mp3   "നമസ്കാരം! നുക്കഡിലേക്ക് സ്വാഗതം. ഒരു ചായ കുടിക്കാമോ?"
 *   Optional street ambience loop (kettle, distant chatter, a bicycle bell),
 *   20–40 s, seamless loop, ~64 kbps: /public/audio/street-ambience.mp3
 *   Only use recordings you own or have licensed.
 */
export const openingData = {
  greetings: {
    hi: {
      label: "Hindi",
      text: "Namaste! NUKKAD mein aapka swagat hai. Chai piyenge?",
      // voice: "/audio/welcome-hi.mp3",
    },
    ml: {
      label: "മലയാളം",
      text: "നമസ്കാരം! നുക്കഡിലേക്ക് സ്വാഗതം. ഒരു ചായ കുടിക്കാമോ?",
      // voice: "/audio/welcome-ml.mp3",
    },
  },
  /** Shown under the subtitle so every visitor understands the greeting. */
  translation: {
    en: "Hello! Welcome to NUKKAD. Will you have some chai?",
    ml: "ഹലോ! നുക്കഡിലേക്ക് സ്വാഗതം. ചായ കുടിക്കുന്നോ?",
  },
  // ambience: "/audio/street-ambience.mp3",
} satisfies z.input<typeof openingSchema>;
