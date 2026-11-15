import type { z } from "zod";
import type { menuSchema } from "./schema";

/**
 * ✏️  EDIT ME — the menu.
 *
 * - `id`: lowercase-with-dashes, unique across the whole menu.
 * - `price`: whole rupees (25 means ₹25).
 * - `diet`: "veg" | "vegan" | "egg" | "nonveg".
 * - `tags`: any of "signature", "new", "spicy", "seasonal".
 * - `available: false` hides an item without deleting it.
 *
 * ⚠️ SAMPLE ITEMS — replace with the real menu.
 */
export const menuData = [
  {
    id: "chai",
    name: { en: "Chai", hi: "चाय", ml: "ചായ" },
    items: [
      {
        id: "cutting-chai",
        name: { en: "Cutting Chai", hi: "कटिंग चाय", ml: "കട്ടിംഗ് ചായ" },
        description: { en: "Half glass, full strength. SAMPLE." },
        price: 20,
        diet: "veg",
        tags: ["signature"],
      },
      {
        id: "kulhad-chai",
        name: { en: "Kulhad Chai", hi: "कुल्हड़ चाय", ml: "കുൽഹട് ചായ" },
        description: { en: "Slow-brewed and served in clay. SAMPLE." },
        price: 35,
        diet: "veg",
      },
    ],
  },
  {
    id: "snacks",
    name: { en: "Snacks", hi: "नाश्ता", ml: "പലഹാരങ്ങൾ" },
    items: [
      {
        id: "samosa",
        name: { en: "Samosa", hi: "समोसा", ml: "സമൂസ" },
        price: 25,
        diet: "vegan",
      },
    ],
  },
] satisfies z.input<typeof menuSchema>;
