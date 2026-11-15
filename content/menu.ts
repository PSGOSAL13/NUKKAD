import type { z } from "zod";
import type { menuSchema } from "./schema";

/**
 * BUILT-IN MENU — used when no Google Sheet is connected (see OWNER-GUIDE.md),
 * and as the safety fallback if the sheet can't be read.
 *
 * ⚠️ SAMPLE CONTENT: every product, description and price below is a
 *    stand-in (`sample: true`). Replace with the real menu before launch.
 *
 * Fields
 *  - status: "available" | "sold-out" (shown with a Sold Out label) | "hidden" (not shown)
 *  - tags (highlights): signature | bestseller | new | spicy | seasonal
 *  - featured: true → part of the rotating six on the home page
 *  - photo: a file name from photos/menu/ (without extension) or an https:// URL
 *  - diet (optional): veg | vegan | egg | nonveg
 */
export const menuData = [
  {
    id: "chai-coffee",
    name: { en: "Chai & Coffee", ml: "ചായയും കാപ്പിയും" },
    description: {
      en: "Boiled the slow way, the way the tapri does it.",
      ml: "തപ്രിയിലെ പോലെ, പതുക്കെ തിളപ്പിച്ചത്.",
    },
    illustration: "chai",
    items: [
      {
        id: "masala-chai",
        name: { en: "Masala Chai", ml: "മസാല ചായ" },
        description: {
          en: "Ginger, cardamom, clove and a pinch of pepper.",
          ml: "ഇഞ്ചി, ഏലയ്ക്ക, ഗ്രാമ്പൂ, അൽപം കുരുമുളക്.",
        },
        details: {
          en: "Our house chai: tea leaves, milk and whole spices simmered slowly, then poured from a height for a little froth. Sample description.",
        },
        price: 30,
        diet: "veg",
        tags: ["signature"],
        featured: true,
        photo: "masala-chai",
        photoAlt: { en: "Chai being poured from a steel pot into small copper tumblers" },
        sample: true,
      },
      {
        id: "cutting-chai",
        name: { en: "Cutting Chai", ml: "കട്ടിംഗ് ചായ" },
        description: { en: "Half a glass, full strength.", ml: "പകുതി ഗ്ലാസ്, മുഴുവൻ കടുപ്പം." },
        price: 20,
        diet: "veg",
        tags: ["bestseller"],
        featured: true,
        photo: "cutting-chai",
        photoAlt: { en: "Chai being poured into a small glass" },
        sample: true,
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
        featured: true,
        photo: "kulhad-chai",
        photoAlt: { en: "Rows of clay kulhad cups, one filled with chai" },
        sample: true,
      },
      {
        id: "elaichi-chai",
        name: { en: "Elaichi Chai", ml: "ഏലയ്ക്ക ചായ" },
        description: { en: "Fragrant with green cardamom.", ml: "ഏലയ്ക്കയുടെ സുഗന്ധം." },
        price: 25,
        diet: "veg",
        photo: "elaichi-chai",
        photoAlt: { en: "A tray of glasses of milky chai" },
        sample: true,
      },
      {
        id: "adrak-chai",
        name: { en: "Adrak Chai", ml: "ഇഞ്ചി ചായ" },
        description: { en: "Plenty of fresh ginger.", ml: "ധാരാളം ഇഞ്ചി." },
        price: 25,
        diet: "veg",
        sample: true,
      },
      {
        id: "kulhad-coffee",
        name: { en: "Kulhad Coffee", ml: "കുൽഹട് കാപ്പി" },
        description: { en: "Frothy, milky coffee in a clay cup.", ml: "മൺകപ്പിൽ നുരയുള്ള കാപ്പി." },
        price: 40,
        diet: "veg",
        tags: ["new"],
        featured: true,
        photo: "kulhad-coffee",
        photoAlt: { en: "Frothy coffee in a clay cup on a wooden table" },
        sample: true,
      },
    ],
  },
  {
    id: "samosa-snacks",
    name: { en: "Samosa & Snacks", ml: "സമൂസയും പലഹാരങ്ങളും" },
    description: { en: "Hot from the kadhai.", ml: "കടായിയിൽ നിന്ന് ചൂടോടെ." },
    illustration: "samosa",
    items: [
      {
        id: "samosa",
        name: { en: "Samosa", ml: "സമൂസ" },
        description: { en: "Spiced potato, crisp pastry, two chutneys.", ml: "മസാല ഉരുളക്കിഴങ്ങ്, രണ്ട് ചട്ണി." },
        details: {
          en: "Hand-folded and fried to order, with green and tamarind chutney. Sample description.",
        },
        price: 25,
        diet: "vegan",
        tags: ["signature"],
        featured: true,
        photo: "samosa",
        photoAlt: { en: "Three golden samosas with green chilli and pomegranate seeds" },
        sample: true,
      },
      {
        id: "pakode",
        name: { en: "Pakode", ml: "പക്കോട" },
        description: {
          en: "Crunchy gram-flour fritters with a squeeze of lime.",
          ml: "നാരങ്ങ പിഴിഞ്ഞ കടലമാവ് പക്കോട.",
        },
        price: 40,
        diet: "veg",
        tags: ["spicy"],
        featured: true,
        photo: "pakode",
        photoAlt: { en: "A plate of golden pakoras with a lime wedge" },
        sample: true,
      },
      {
        id: "bun-maska",
        name: { en: "Bun Maska", ml: "ബൺ മസ്ക" },
        description: { en: "Soft bun, generous butter. Made for dunking.", ml: "മൃദുവായ ബൺ, ധാരാളം വെണ്ണ." },
        price: 40,
        diet: "veg",
        illustration: "bun-maska",
        sample: true,
      },
      {
        id: "bread-pakora",
        name: { en: "Bread Pakora", ml: "ബ്രെഡ് പക്കോട" },
        description: { en: "Stuffed, battered, fried — a street classic.", ml: "തെരുവിലെ ക്ലാസിക്." },
        price: 35,
        diet: "veg",
        illustration: "pakora",
        sample: true,
      },
    ],
  },
  {
    id: "sweets-desserts",
    name: { en: "Sweets & Desserts", ml: "മധുരങ്ങൾ" },
    description: { en: "Kuch meetha ho jaaye?", ml: "ഒരു മധുരം ആയാലോ?" },
    illustration: "jalebi",
    items: [
      {
        id: "jalebi",
        name: { en: "Jalebi", ml: "ജിലേബി" },
        description: { en: "Hot, crisp spirals soaked in saffron syrup.", ml: "കുങ്കുമപ്പൂ സിറപ്പിൽ മുക്കിയ ചുരുളുകൾ." },
        details: {
          en: "Fried fresh through the evening and dipped warm. Best with a cutting chai. Sample description.",
        },
        price: 40,
        diet: "veg",
        tags: ["signature"],
        featured: true,
        photo: "jalebi",
        photoAlt: { en: "A stack of golden jalebi garnished with rose and pistachio" },
        sample: true,
      },
      {
        id: "imarti",
        name: { en: "Imarti", ml: "ഇമർത്തി" },
        description: { en: "Jalebi's floral cousin, made with urad dal.", ml: "ഉഴുന്ന് കൊണ്ടുള്ള മധുരം." },
        price: 45,
        diet: "veg",
        photo: "imarti",
        photoAlt: { en: "Imarti stacked at a sweet stall" },
        sample: true,
      },
      {
        id: "kulhad-lassi",
        name: { en: "Kulhad Lassi", ml: "കുൽഹട് ലസ്സി" },
        description: { en: "Thick sweet lassi in a clay cup.", ml: "മൺകപ്പിൽ കട്ടിയുള്ള മധുര ലസ്സി." },
        price: 60,
        diet: "veg",
        tags: ["seasonal"],
        // Example of a product that is temporarily out: shown with a "Sold Out" label.
        status: "sold-out",
        photo: "kulhad-lassi",
        photoAlt: { en: "Two clay cups of lassi" },
        sample: true,
      },
      {
        id: "gulab-jamun",
        name: { en: "Gulab Jamun", ml: "ഗുലാബ് ജാമുൻ" },
        description: { en: "Warm, soft and soaked in rose syrup.", ml: "റോസ് സിറപ്പിൽ മുക്കിയത്." },
        price: 40,
        diet: "veg",
        // Example of a product that is not offered right now: not shown at all.
        status: "hidden",
        sample: true,
      },
    ],
  },
] satisfies z.input<typeof menuSchema>;
