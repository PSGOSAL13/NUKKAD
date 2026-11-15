import type { z } from "zod";
import type { storySchema } from "./schema";

/**
 * ✏️  EDIT ME — Our Story, told as a conversation over chai.
 *
 * The answers below contain ONLY what the founder has shared so far
 * (Indian Navy, life at sea, curiosity about navigation, submarines and the
 * world, the idea of NUKKAD, North Indian warmth in Trivandrum). Everything
 * else is a clearly marked PLACEHOLDER for the founder's own words — please
 * don't fill these with invented details.
 */
export const storyData = {
  intro: {
    eyebrow: { en: "Our Story", ml: "ഞങ്ങളുടെ കഥ" },
    title: { en: "From the sea to the street corner" },
    body: [
      {
        en: "The best stories at a nukkad aren't told — they come out over a second cup of chai. So pull up a stool, and ask away.",
      },
    ],
  },
  founder: {
    name: { en: "PLACEHOLDER — founder's name" },
    role: { en: "Founder, NUKKAD" },
  },
  conversation: [
    {
      id: "before-nukkad",
      question: { en: "So, what were you doing before all this chai?" },
      answer: [
        { en: "I served in the Indian Navy." },
        { en: "PLACEHOLDER — in your own words: when you served and what your work involved." },
      ],
    },
    {
      id: "life-at-sea",
      question: { en: "What does a life at sea teach you?" },
      answer: [{ en: "PLACEHOLDER — your experiences and the lessons you carried home from the sea." }],
    },
    {
      id: "curiosity",
      question: { en: "Is it true you can talk about submarines all night?" },
      answer: [
        { en: "Navigation, submarines and how the world works have always made me curious." },
        { en: "PLACEHOLDER — what fascinates you about them, in your words." },
      ],
    },
    {
      id: "the-idea",
      question: { en: "Why a chai café?" },
      answer: [{ en: "PLACEHOLDER — the idea behind NUKKAD and how it started." }],
    },
    {
      id: "why-trivandrum",
      question: { en: "And why here, in Trivandrum?" },
      answer: [
        { en: "To bring a little North Indian warmth to Trivandrum." },
        { en: "PLACEHOLDER — your connection to the city, in your words." },
      ],
    },
  ],
} satisfies z.input<typeof storySchema>;
