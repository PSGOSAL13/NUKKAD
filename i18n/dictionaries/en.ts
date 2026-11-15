/**
 * Interface text (navigation, labels, buttons) — not business content.
 * Business content (menu, hours, address…) lives in /content.
 *
 * en.ts defines the shape; hi.ts and ml.ts must provide every key.
 */
export const en = {
  nav: {
    home: "Home",
    menu: "Menu",
    story: "Our Story",
    visit: "Visit Us",
    gallery: "Gallery",
  },
  common: {
    language: "Language",
    openNow: "Open now",
    closedNow: "Closed now",
    hours: "Opening hours",
    address: "Address",
    callUs: "Call us",
    whatsappUs: "WhatsApp us",
    directions: "Get directions",
    closed: "Closed",
  },
  days: {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  },
  diet: {
    veg: "Vegetarian",
    vegan: "Vegan",
    egg: "Contains egg",
    nonveg: "Non-vegetarian",
  },
};

export type Dictionary = typeof en;
