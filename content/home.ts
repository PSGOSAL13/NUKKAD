import type { z } from "zod";
import type { homeSchema } from "./schema";

/**
 * ✏️  EDIT ME — home page copy.
 * ⚠️ DRAFT COPY — a starting point; rewrite in your own voice.
 * Hindi expressions are written in Roman script so everyone can read them.
 */
export const homeData = {
  feeling: {
    en: "Somewhere between chai and conversations, you find your people.",
    ml: "ചായയ്ക്കും സംസാരത്തിനുമിടയിൽ എവിടെയോ, നിങ്ങൾ നിങ്ങളുടെ ആളുകളെ കണ്ടെത്തുന്നു.",
  },
  hero: {
    kicker: { en: "Aaiye, baithiye", ml: "വരൂ, ഇരിക്കൂ" },
    title: { en: "Apna Nukkad. Apne Log." },
    subtitle: {
      en: "Somewhere between chai and conversations, you find your people.",
      ml: "ചായയ്ക്കും സംസാരത്തിനുമിടയിൽ എവിടെയോ, നിങ്ങൾ നിങ്ങളുടെ ആളുകളെ കണ്ടെത്തുന്നു.",
    },
  },

  // 1 · Welcome
  welcome: {
    eyebrow: { en: "Come, Sit & Stay", ml: "വരൂ, ഇരിക്കൂ" },
    greeting: { en: "Arre, aao aao!" },
    title: { en: "A street corner where nobody stays a stranger for long." },
    body: [
      { en: "Every nukkad has a kettle that never quite goes cold and a bench with room for one more." },
      { en: "Pull up a stool — ek cutting ho jaaye?" },
    ],
    points: [
      {
        title: { en: "Walk in", ml: "നേരിട്ട് വരൂ" },
        body: { en: "No reservations. First come, first served.", ml: "റിസർവേഷൻ ഇല്ല. ആദ്യം വരുന്നവർക്ക് ആദ്യം." },
      },
      { title: { en: "Stay a while" }, body: { en: "One chai or five — the stool is yours." } },
      {
        title: { en: "Bring your people", ml: "നിങ്ങളുടെ ആളുകളെ കൂട്ടൂ" },
        body: {
          en: "Groups of 10 or more, just give us a call.",
          ml: "10-ഓ അതിലധികമോ പേർ? ഒന്ന് വിളിച്ചാൽ മതി.",
        },
      },
    ],
  },

  // 2 · Signature experience (items reference ids in content/menu.ts)
  signature: {
    eyebrow: { en: "The Nukkad Trio", ml: "നുക്കഡ് ത്രയം" },
    title: { en: "Chai, samosa, jalebi. The holy trinity.", ml: "ചായ, സമൂസ, ജിലേബി." },
    body: [
      { en: "If you only try three things, make it these.", ml: "മൂന്നെണ്ണം മാത്രം രുചിക്കുന്നുവെങ്കിൽ, ഇവ തന്നെ." },
    ],
    items: [
      {
        menuItemId: "masala-chai",
        illustration: "chai",
        note: { en: "Slow-boiled, poured from a height.", ml: "പതുക്കെ തിളപ്പിച്ച്, ഉയരത്തിൽ നിന്ന് ഒഴിച്ചത്." },
      },
      {
        menuItemId: "samosa",
        illustration: "samosa",
        note: { en: "Crisp, spiced, with two chutneys.", ml: "മൊരിഞ്ഞത്, രണ്ട് ചട്ണിയോടൊപ്പം." },
      },
      {
        menuItemId: "jalebi",
        illustration: "jalebi",
        note: { en: "Hot, syrupy spirals. Best with chai.", ml: "ചൂടുള്ള, മധുരമുള്ള ചുരുളുകൾ." },
      },
    ],
    previewTitle: { en: "Kya loge? More from the board", ml: "എന്ത് വേണം? ബോർഡിൽ നിന്ന് കൂടുതൽ" },
  },

  // 3 · Our story (teaser — the conversation lives in content/story.ts)
  story: {
    eyebrow: { en: "Our Story", ml: "ഞങ്ങളുടെ കഥ" },
    title: { en: "From the sea to the street corner" },
    body: [{ en: "Grab a chai and ask the founder anything. Here's how the conversation usually goes." }],
  },

  // 4 · Atmosphere
  atmosphere: {
    eyebrow: { en: "The Atmosphere" },
    title: { en: "A corner with character" },
    body: [{ en: "Old radios, painted signs, a bicycle by the wall and the smell of fresh chai." }],
  },

  // 5 · Nukkad Ki Baatein
  baatein: {
    eyebrow: { en: "Nukkad Ki Baatein" },
    title: { en: "Stories Beyond Chai", ml: "ചായയ്ക്കപ്പുറമുള്ള കഥകൾ" },
    body: [
      {
        en: "Now and then the owner pulls up a stool and tells a story — and guests and community groups host small gatherings of their own. Everyone's welcome to listen in.",
        ml: "ഇടയ്ക്കിടെ ഉടമ ഒരു കഥ പറയും — അതിഥികളും കൂട്ടായ്മകളും അവരുടേതായ ചെറിയ ഒത്തുചേരലുകളും നടത്തും.",
      },
    ],
  },

  // 6 · Events
  events: {
    eyebrow: { en: "Coming Up at the Nukkad", ml: "നുക്കഡിൽ വരുന്നത്" },
    title: { en: "Something's always brewing", ml: "എപ്പോഴും എന്തെങ്കിലും നടക്കുന്നു" },
    body: [{ en: "No tickets, no sign-ups. Just walk in.", ml: "ടിക്കറ്റില്ല, രജിസ്ട്രേഷനില്ല. നേരിട്ട് വരൂ." }],
  },

  // 7 · Location
  location: {
    eyebrow: { en: "Find Us", ml: "ഞങ്ങളെ കണ്ടെത്തൂ" },
    title: { en: "Milte hain nukkad pe!", ml: "നുക്കഡിൽ കാണാം!" },
    body: [{ en: "Follow the smell of chai — or the map.", ml: "ചായയുടെ മണം പിന്തുടരൂ — അല്ലെങ്കിൽ മാപ്പ്." }],
  },

  // 8 · Contact
  contact: {
    eyebrow: { en: "Baat karein?", ml: "സംസാരിക്കാം?" },
    title: { en: "Call us or drop a WhatsApp", ml: "വിളിക്കൂ അല്ലെങ്കിൽ വാട്ട്സ്ആപ്പ് ചെയ്യൂ" },
    body: [
      { en: "Questions, group bookings or just saying hello.", ml: "ചോദ്യങ്ങൾ, ഗ്രൂപ്പ് ബുക്കിംഗ്, അല്ലെങ്കിൽ ഒരു ഹലോ." },
    ],
  },
} satisfies z.input<typeof homeSchema>;
