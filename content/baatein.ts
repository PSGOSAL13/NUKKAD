import type { z } from "zod";
import type { baateinSchema } from "./schema";

/**
 * ✏️  EDIT ME — the "Nukkad Ki Baatein — Stories Beyond Chai" page.
 * Events themselves live in the Google Sheet (or content/events.ts) — see ADMIN_GUIDE.md.
 * ⚠️ DRAFT COPY — rewrite in your own voice. Theme descriptions only restate the
 *    brief; personal details are for the owner to add.
 */
export const baateinData = {
  intro: {
    eyebrow: { en: "Nukkad Ki Baatein", ml: "Nukkad Ki Baatein" },
    title: { en: "Stories Beyond Chai", ml: "ചായയ്ക്കപ്പുറമുള്ള കഥകൾ" },
    body: [
      {
        en: "Every nukkad has its storytellers. Here, sometimes it's the owner, and sometimes it's you — a corner where stories, curiosity and good company are always on the menu.",
        ml: "ഓരോ നുക്കഡിനും അതിന്റെ കഥപറച്ചിലുകാരുണ്ട്. ചിലപ്പോൾ ഉടമ, ചിലപ്പോൾ നിങ്ങൾ.",
      },
    ],
  },
  storytelling: {
    eyebrow: { en: "Storytelling with the owner", ml: "ഉടമയോടൊപ്പം കഥപറച്ചിൽ" },
    title: { en: "Pull up a stool. Kahani shuru hoti hai.", ml: "ഒരു സ്റ്റൂൾ എടുക്കൂ. കഥ തുടങ്ങുന്നു." },
    body: [
      {
        en: "Now and then, Prem — the owner — hosts a small, informal storytelling session over chai. He chooses the story; you just bring your curiosity.",
        ml: "ഇടയ്ക്കിടെ, ഉടമ ചായയ്‌ക്കൊപ്പം ഒരു ചെറിയ കഥപറച്ചിൽ സംഘടിപ്പിക്കുന്നു. കഥ ഉടമ തിരഞ്ഞെടുക്കും.",
      },
    ],
    format: {
      en: "Intimate sessions of 30–45 minutes · topic chosen by the host · free to listen, just walk in",
      ml: "30–45 മിനിറ്റ് · വിഷയം ഉടമ തിരഞ്ഞെടുക്കും · നേരിട്ട് വരൂ",
    },
    themes: [
      {
        id: "beyond-the-uniform",
        title: { en: "Beyond the Uniform", ml: "യൂണിഫോമിനപ്പുറം" },
        body: {
          en: "Life and lessons beyond naval service.",
          ml: "നാവികസേവനത്തിനപ്പുറമുള്ള ജീവിതവും പാഠങ്ങളും.",
        },
      },
      {
        id: "stories-of-the-sea",
        title: { en: "Stories of the Sea", ml: "കടലിന്റെ കഥകൾ" },
        body: {
          en: "Submarines, navigation and experiences at sea.",
          ml: "അന്തർവാഹിനികൾ, നാവിഗേഷൻ, കടലിലെ അനുഭവങ്ങൾ.",
        },
      },
      {
        id: "stories-over-chai",
        title: { en: "Stories Over Chai", ml: "ചായയ്‌ക്കൊപ്പം കഥകൾ" },
        body: {
          en: "Astrology, science, curiosity and everyday conversations.",
          ml: "ജ്യോതിഷം, ശാസ്ത്രം, ജിജ്ഞാസ, ദൈനംദിന സംസാരങ്ങൾ.",
        },
      },
    ],
  },
  events: {
    eyebrow: { en: "What's coming up", ml: "വരാനിരിക്കുന്നത്" },
    title: { en: "At the Nukkad", ml: "നുക്കഡിൽ" },
    body: [
      {
        en: "No tickets, no registration, no seat booking. Just walk in — and call us if you'd like to know more.",
        ml: "ടിക്കറ്റില്ല, രജിസ്ട്രേഷനില്ല, സീറ്റ് ബുക്കിംഗില്ല. നേരിട്ട് വരൂ — കൂടുതൽ അറിയാൻ വിളിക്കൂ.",
      },
    ],
  },
  community: {
    eyebrow: { en: "Your nukkad too", ml: "നിങ്ങളുടെയും നുക്കഡ്" },
    title: { en: "Got something to share? Host it here.", ml: "പങ്കുവെക്കാൻ എന്തെങ്കിലുമുണ്ടോ? ഇവിടെ നടത്താം." },
    body: [
      {
        en: "NUKKAD is a public café, and guests and community groups are welcome to propose their own small gatherings. Give us a call with your idea — we'll say yes whenever we can, depending on space and the café's everyday rhythm.",
        ml: "നുക്കഡ് ഒരു പൊതു കഫേയാണ്. അതിഥികൾക്കും കൂട്ടായ്മകൾക്കും ചെറിയ ഒത്തുചേരലുകൾ നിർദ്ദേശിക്കാം. നിങ്ങളുടെ ആശയവുമായി വിളിക്കൂ — സ്ഥലസൗകര്യം അനുസരിച്ച്, ഉടമയുടെ അനുമതിയോടെ.",
      },
      {
        en: "We're a café first — not an event hall — so gatherings stay small, friendly and open to everyone around.",
        ml: "ഞങ്ങൾ ആദ്യം ഒരു കഫേയാണ്, ഇവന്റ് ഹാളല്ല.",
      },
    ],
    examples: [
      { en: "Book circles", ml: "പുസ്തക കൂട്ടായ്മകൾ" },
      { en: "Board-game evenings", ml: "ബോർഡ് ഗെയിം സന്ധ്യകൾ" },
      { en: "Poetry and music adda", ml: "കവിതയും സംഗീതവും" },
      { en: "Language-exchange chats", ml: "ഭാഷാ വിനിമയ സംസാരങ്ങൾ" },
      { en: "Small community meet-ups", ml: "ചെറിയ കൂട്ടായ്മകൾ" },
    ],
  },
  groupBooking: {
    eyebrow: { en: "Coming as a group?", ml: "സംഘമായി വരുന്നോ?" },
    title: { en: "Group bookings for 10 or more", ml: "10-ഓ അതിലധികമോ പേർക്ക് ഗ്രൂപ്പ് ബുക്കിംഗ്" },
    body: [
      {
        en: "Regular seating is walk-in, first come, first served. For groups of 10 or more, call the owner and we'll keep the corner ready.",
        ml: "സാധാരണ ഇരിപ്പിടം ആദ്യം വരുന്നവർക്ക്. 10-ഓ അതിലധികമോ പേരുണ്ടെങ്കിൽ ഉടമയെ വിളിക്കൂ.",
      },
    ],
    customMenus: {
      en: "Want a customised menu for your group? Talk it through with the owner on the phone.",
      ml: "നിങ്ങളുടെ സംഘത്തിന് പ്രത്യേക മെനു വേണോ? ഫോണിൽ ഉടമയുമായി സംസാരിക്കൂ.",
    },
  },
  notes: {
    eyebrow: { en: "Chai notes", ml: "ചായ കുറിപ്പുകൾ" },
    title: { en: "Little stories from the counter" },
    body: [{ en: "What we overhear, what we remember, and what we think about while the chai boils." }],
    entries: [
      {
        id: "why-cutting",
        title: { en: "Why is it called cutting chai?" },
        excerpt: { en: "Half a glass, twice the conversation." },
        body: [
          {
            en: "In Mumbai's tapris, a 'cutting' is half a glass — cheaper, quicker, and an excuse to come back for another. DRAFT.",
          },
        ],
      },
      {
        id: "the-kulhad",
        title: { en: "The humble kulhad" },
        excerpt: { en: "A clay cup with a long memory." },
        body: [{ en: "PLACEHOLDER — a short piece about kulhads and why we use them." }],
      },
    ],
  },
} satisfies z.input<typeof baateinSchema>;
