import type { z } from "zod";
import type { menuSchema } from "./schema";

/**
 * ✏️  EDIT ME — the menu.
 *
 * - `id`: lowercase-with-dashes, unique across the whole menu.
 * - `price`: whole rupees (25 means ₹25).
 * - `diet`: "veg" | "vegan" | "egg" | "nonveg".
 * - `tags`: any of "signature", "new", "spicy", "seasonal".
 * - `featured: true` puts the item in the rotating home-page preview.
 * - `available: false` hides an item without deleting it.
 *
 * ⚠️ SAMPLE ITEMS AND PRICES — replace with the real menu.
 * ⚠️ Malayalam text is a DRAFT — have a native speaker review it.
 */
export const menuData = [
  {
    id: "chai",
    name: { en: "Chai", ml: "ചായ" },
    description: {
      en: "Boiled the slow way, the way the tapri does it.",
      ml: "തപ്രിയിലെ പോലെ, പതുക്കെ തിളപ്പിച്ചത്.",
    },
    items: [
      {
        id: "cutting-chai",
        name: { en: "Cutting Chai", ml: "കട്ടിംഗ് ചായ" },
        description: { en: "Half a glass, full strength.", ml: "പകുതി ഗ്ലാസ്, മുഴുവൻ കടുപ്പം." },
        price: 20,
        diet: "veg",
        tags: ["signature"],
        featured: true,
      },
      {
        id: "kulhad-chai",
        name: { en: "Kulhad Chai", ml: "കുൽഹട് ചായ" },
        description: {
          en: "Served in a clay cup that adds its own earthy note.",
          ml: "മൺകപ്പിൽ വിളമ്പുന്ന ചായ.",
        },
        price: 35,
        diet: "veg",
        tags: ["signature"],
        featured: true,
      },
      {
        id: "masala-chai",
        name: { en: "Masala Chai", ml: "മസാല ചായ" },
        description: {
          en: "Ginger, cardamom, clove and a little pepper.",
          ml: "ഇഞ്ചി, ഏലയ്ക്ക, ഗ്രാമ്പൂ, അൽപം കുരുമുളക്.",
        },
        price: 30,
        diet: "veg",
        featured: true,
      },
      {
        id: "adrak-chai",
        name: { en: "Adrak Chai", ml: "ഇഞ്ചി ചായ" },
        price: 25,
        diet: "veg",
      },
    ],
  },
  {
    id: "snacks",
    name: { en: "Nukkad Snacks", ml: "നുക്കഡ് പലഹാരങ്ങൾ" },
    items: [
      {
        id: "bun-maska",
        name: { en: "Bun Maska", ml: "ബൺ മസ്ക" },
        description: { en: "Soft bun, generous butter. Made for dunking.", ml: "മൃദുവായ ബൺ, ധാരാളം വെണ്ണ." },
        price: 40,
        diet: "veg",
        featured: true,
      },
      {
        id: "samosa",
        name: { en: "Samosa", ml: "സമൂസ" },
        description: { en: "Spiced potato, crisp pastry, two chutneys.", ml: "മസാല ഉരുളക്കിഴങ്ങ്, രണ്ട് ചട്ണി." },
        price: 25,
        diet: "vegan",
        featured: true,
      },
      {
        id: "bread-pakora",
        name: { en: "Bread Pakora", ml: "ബ്രെഡ് പക്കോട" },
        price: 35,
        diet: "veg",
        tags: ["spicy"],
        featured: true,
      },
      {
        id: "masala-omelette-pav",
        name: { en: "Masala Omelette Pav", ml: "മസാല ഓംലെറ്റ് പാവ്" },
        price: 60,
        diet: "egg",
      },
    ],
  },
] satisfies z.input<typeof menuSchema>;
