import type { z } from "zod";
import type { eventsSchema } from "./schema";

/**
 * BUILT-IN EVENTS — used when no Google Sheet "Events" tab is connected
 * (see OWNER-GUIDE.md), and as the safety fallback if it can't be read.
 *
 * ⚠️ SAMPLE EVENTS (`sample: true`) — replace with real ones.
 *
 * - type: "storytelling" (hosted by the owner; needs a theme) | "community" | "cafe"
 * - theme: "beyond-the-uniform" | "stories-of-the-sea" | "stories-over-chai"
 * - date "YYYY-MM-DD", start / end "HH:MM" (24-hour, Indian Standard Time)
 * - status: "published" (shown) | "draft" (not shown)
 * - Past events disappear from the site automatically.
 * - No registration or seat booking — people just walk in or call.
 */
export const eventsData = [
  {
    id: "beyond-the-uniform-nov",
    type: "storytelling",
    theme: "beyond-the-uniform",
    title: { en: "Beyond the Uniform", ml: "യൂണിഫോമിനപ്പുറം" },
    description: {
      en: "An evening of stories about life and lessons beyond naval service. 30–45 minutes, over chai. Sample event.",
      ml: "നാവികസേവനത്തിനപ്പുറമുള്ള ജീവിതത്തെക്കുറിച്ചുള്ള കഥകൾ. 30–45 മിനിറ്റ്.",
    },
    date: "2026-11-21",
    start: "18:00",
    end: "18:45",
    photo: "beyond-the-uniform",
    photoAlt: { en: "A sextant, watch and dividers on a nautical chart" },
    sample: true,
  },
  {
    id: "board-game-evening",
    type: "community",
    title: { en: "Board-Game Evening", ml: "ബോർഡ് ഗെയിം സന്ധ്യ" },
    description: {
      en: "Carrom, ludo and a few new favourites. Bring a friend or make one. Sample event.",
      ml: "കാരംസ്, ലൂഡോ, പിന്നെ പുതിയ ചിലതും.",
    },
    host: { en: "PLACEHOLDER — community group name" },
    date: "2026-11-26",
    start: "17:30",
    end: "19:30",
    photo: "community-games",
    photoAlt: { en: "Friends laughing over coffee" },
    sample: true,
  },
  {
    id: "stories-of-the-sea-dec",
    type: "storytelling",
    theme: "stories-of-the-sea",
    title: { en: "Stories of the Sea", ml: "കടലിന്റെ കഥകൾ" },
    description: {
      en: "Submarines, navigation and experiences at sea — told over a cutting chai. 30–45 minutes. Sample event.",
      ml: "അന്തർവാഹിനികൾ, നാവിഗേഷൻ, കടലിലെ അനുഭവങ്ങൾ.",
    },
    date: "2026-12-05",
    start: "18:00",
    end: "18:40",
    photo: "stories-of-the-sea",
    photoAlt: { en: "A submarine docked at a harbour at sunset" },
    sample: true,
  },
  {
    id: "language-exchange",
    type: "community",
    title: { en: "Hindi–Malayalam Chai Chat", ml: "ഹിന്ദി–മലയാളം ചായ ചാറ്റ്" },
    description: {
      en: "Swap a few words of Hindi and Malayalam over chai. All levels welcome. Sample event.",
      ml: "ചായയ്‌ക്കൊപ്പം കുറച്ച് ഹിന്ദിയും മലയാളവും.",
    },
    host: { en: "PLACEHOLDER — host name" },
    date: "2026-12-10",
    start: "17:00",
    end: "18:30",
    photo: "community-conversations",
    photoAlt: { en: "Friends talking over cups of tea at a café table" },
    sample: true,
  },
  {
    id: "stories-over-chai-dec",
    type: "storytelling",
    theme: "stories-over-chai",
    title: { en: "Stories Over Chai", ml: "ചായയ്‌ക്കൊപ്പം കഥകൾ" },
    description: {
      en: "Astrology, science, curiosity and everyday conversations. 30–45 minutes. Sample event.",
      ml: "ജ്യോതിഷം, ശാസ്ത്രം, ജിജ്ഞാസ.",
    },
    date: "2026-12-19",
    start: "18:00",
    end: "18:45",
    photo: "stories-over-chai",
    photoAlt: { en: "Close-up of an antique globe" },
    sample: true,
  },
  {
    // Example of an unpublished event: saved, but not shown on the site.
    id: "book-swap-morning",
    type: "community",
    title: { en: "Book Swap Morning" },
    description: { en: "Bring a book, take a book. Sample event (draft — not shown)." },
    date: "2026-12-27",
    start: "10:00",
    end: "12:00",
    status: "draft",
    sample: true,
  },
] satisfies z.input<typeof eventsSchema>;
