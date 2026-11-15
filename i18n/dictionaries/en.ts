/**
 * Interface text (navigation, labels, buttons) — not business content.
 * Business content (menu, hours, address, page copy) lives in /content.
 *
 * en.ts defines the shape; ml.ts must provide every key.
 */
export const en = {
  nav: {
    home: "Home",
    menu: "Menu",
    story: "Our Story",
    baatein: "Nukkad Ki Baatein",
    location: "Location",
    contact: "Contact",
  },
  common: {
    language: "Language",
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    backHome: "Back to home",
    hours: "Opening hours",
    address: "Address",
    callUs: "Call us",
    whatsappUs: "WhatsApp us",
    directions: "Get directions",
    viewFullMenu: "See the full menu",
    readOurStory: "Read our story",
    readMore: "Read more",
    allBaatein: "All Nukkad Ki Baatein",
    pauseRotation: "Pause",
    playRotation: "Play",
    jumpTo: "Jump to",
    dietLegend: "Food marks",
    walkInTitle: "Walk-in seating",
    groupBookingTitle: "Group bookings",
    noRegistration: "No registration — just walk in.",
    translationPending: "Shown in English",
    rupee: "₹",
  },
  pages: {
    menuTitle: "The Menu",
    menuIntro: "Everything on the board, at street-corner prices.",
    locationTitle: "Location",
    contactTitle: "Contact",
    contactIntro: "The quickest way to reach us is a call or a WhatsApp message.",
    notFoundTitle: "Arre! Wrong turn.",
    notFoundBody: "This corner doesn't exist. Let's get you back to the chai.",
  },
  footer: {
    rights: "All rights reserved.",
    fssai: "FSSAI Lic. No.",
    madeWith: "Made with chai in Trivandrum.",
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
  tags: {
    signature: "Signature",
    new: "New",
    spicy: "Spicy",
    seasonal: "Seasonal",
  },
};

export type Dictionary = typeof en;
