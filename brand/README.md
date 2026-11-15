# NUKKAD | नुक्कड — Brand Guidelines

_Apna Nukkad. Apne Log._

A nostalgic North Indian street corner, brought to Trivandrum as an honest,
affordable café. The identity should feel **hand-painted, warm and lived-in**,
never luxurious, never clip-art.

Live preview of everything here: run `npm run dev` and open `/en/brand/`.

---

## 1. Logo

All files are in `brand/logo/` and are **generated** — edit
`brand/tools/build-logos.mjs`, then run `npm run brand:logos`.

| File                           | Use                                                |
| ------------------------------ | -------------------------------------------------- |
| `nukkad-primary-*.svg`         | Default. Stacked kulhad + NUKKAD + नुक्कड.           |
| `nukkad-primary-tagline-*.svg` | Menus, posters, packaging where there's room.      |
| `nukkad-secondary-*.svg`       | Horizontal. Website header, narrow fascia signage. |
| `nukkad-symbol-*.svg`          | Kulhad alone. Cup sleeves, stamps, social avatars. |
| `nukkad-app-icon.svg`          | Favicon / app icon (red tile).                     |
| `png/*-2048.png`               | For tools that can't take SVG.                     |

**Colour versions** — every logo comes in four:

- `full` — on Cream or light backgrounds. The default.
- `reverse` — on Deep Red.
- `mono-ink` — one colour, for rubber stamps, one-colour print, embossing.
- `mono-cream` — one colour, for dark backgrounds or engraving.

**Construction.** The symbol is a kulhad (clay cup) with a painted yellow band,
golden chai at the rim and three rising lines of steam. The wordmark is set in
_Yatra One_ (hand-painted signboard lettering, SIL OFL licence), converted to
outlines with correct Devanagari shaping (the क्क conjunct), so the logo never
depends on an installed font.

**Clear space:** keep empty space around the logo at least the height of the
kulhad's rim (the yellow chai ellipse) on all sides.

**Minimum size:** primary 120 px / 30 mm wide; secondary 140 px / 35 mm wide;
symbol 16 px / 6 mm (use the app icon below 24 px).

**Don't:** stretch or rotate it, recolour it outside the four versions, add
shadows or outlines, place `full` on photos or busy backgrounds (use a cream
panel or `reverse` on a red panel), or retype the wordmark in another font.

> **Open decision:** the Devanagari is currently "नुक्कड" as in the brief. Standard
> Hindi spelling is "नुक्कड़" (with the nukta dot). Both are pre-outlined; switch with
> the `DEVANAGARI` constant in `build-logos.mjs`.

> **Recommended next step:** this is a production-ready vector identity. For
> large physical signage, a sign painter or lettering artist can hand-trace the
> outlines to add brush texture. The proportions and colours here remain the spec.

---

## 2. Colour

| Token          | Hex                   | Role                                          |
| -------------- | --------------------- | --------------------------------------------- |
| `red`          | `#8F2925`             | **Primary.** Signage, headings, key surfaces. |
| `yellow`       | `#E9B83E`             | **Primary.** Highlights, buttons, fills.      |
| `cream`        | `#F6EBD3`             | **Primary.** The page / paper.                |
| `ink`          | `#2B1D16`             | Body text — "chai-patti" brown-black.         |
| `red-dark`     | `#72211E`             | Hover/pressed states, kulhad rim.             |
| `paper`        | `#FBF5E8`             | Cards on cream.                               |
| `cream-dark`   | `#E5D8BF`             | Borders, dividers.                            |
| `yellow-soft`  | `#FAEDCF`             | Highlighted panels.                           |
| `red-soft`     | `#E3CAC9`             | Tinted panels, image placeholders.            |
| `ink-muted`    | `#6B5848`             | Secondary text.                               |
| `clay`         | `#B5653A`             | Illustration only (terracotta).               |
| `veg`/`nonveg` | `#2A6E2E` / `#7A3E1D` | Food marks only.                              |

Supporting colours were added only where the three primaries can't do the job
(readable body text, hover states, borders, legally expected diet marks).

**Contrast (WCAG):**

| Pair               | Ratio  | Verdict                      |
| ------------------ | ------ | ---------------------------- |
| Ink on Cream       | 13.7:1 | ✅ any text                  |
| Ink on Yellow      | 8.8:1  | ✅ any text — button default |
| Red on Cream       | 7.1:1  | ✅ any text                  |
| Cream on Red       | 7.1:1  | ✅ any text                  |
| Ink-muted on Cream | 5.7:1  | ✅ secondary text            |
| Red on Yellow      | 4.5:1  | ⚠️ large text only           |
| Yellow on Cream    | 1.6:1  | ❌ **never for text**        |

**Print:** colours are specified for screen. Before printing signage,
packaging or menus, ask the printer for a physical proof and match to these
swatches (cream and yellow shift the most on uncoated paper).

---

## 3. Typography

All Google Fonts, SIL Open Font License — free for web, print and signage.

| Role    | Latin & Devanagari | Malayalam           | Use                                           |
| ------- | ------------------ | ------------------- | --------------------------------------------- |
| Display | Yatra One          | (Baloo Chettan 2)   | Logo, signboards, kickers, big Hindi phrases. |
| Heading | Baloo 2            | Baloo Chettan 2     | Titles, buttons, navigation.                  |
| Body    | Mukta              | Noto Sans Malayalam | Paragraphs, menus, small print.               |

Baloo 2 and Baloo Chettan 2 are the same design family (Ek Type), so English
and Malayalam headings look like siblings.

Rules: display face only for short phrases (≤ 6 words). Hindi expressions are
written in Roman script in running copy ("ek cutting ho jaaye?") so everyone can
read them; Devanagari is reserved for the logo and occasional display moments.

---

## 4. Buttons & interaction

Buttons are painted shop signs: solid colour, 2 px ink outline, hard offset
"screen-print" shadow (no blur).

- **Primary** — Yellow, ink text. The main action on a screen.
- **Secondary** — Deep Red, cream text.
- **Outline** — transparent, red outline and red shadow.
- **Ghost** — underlined red text for low-emphasis links.

Interaction: hover lifts the sign 1 px and grows the shadow; press pushes it
flat (shadow disappears) like a rubber stamp. Focus is always a thick yellow
ring with an ink halo. All motion is disabled for users who prefer reduced
motion. Minimum touch target 44 px.

---

## 5. Illustration style

Think **vintage Indian matchbox labels and hand-painted tapri boards**, not
clip art.

- Flat shapes in the brand palette plus `clay`; no gradients.
- Slightly imperfect hand-drawn edges; rounded line ends.
- Line weight consistent with the kulhad's steam.
- Subjects drawn from the street corner: kettles, kulhads, the bicycle, street
  lamps, the transistor radio, the handwritten menu board, the awning, stools.
- People shown as warm, simple figures — never caricatures.
- Avoid: mandalas, paisley overload, elephants/Taj Mahal clichés, generic
  coffee beans and latte art.

The 3D street-corner scene (Blender) follows the same palette and should look
like this illustration world built in clay and wood.

---

## 6. Photography direction

- **Light:** warm, natural; golden-hour and tungsten bulbs. Avoid cold daylight
  and flash.
- **Subjects:** hands around kulhads, the pour, steam, people mid-conversation,
  the counter, details (chipped enamel, the radio dial, chalk on the board).
- **People:** real customers and staff, candid, diverse ages; always get
  consent from identifiable people.
- **Framing:** close and intimate; leave cream space for text where needed.
- **Grading:** slightly warm, gentle contrast, lifted blacks — like an old
  print. No heavy filters.
- **Avoid:** stock photos, staged "café flat-lays", luxury styling.

---

## 7. Textures

All CSS-only (zero image downloads), available as utilities:

| Utility            | Look                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------- |
| `texture-paper`    | Aged-paper grain over any background.                                                  |
| `texture-halftone` | Vintage print dots (follows text colour).                                              |
| `texture-awning`   | Striped chai-stall canopy with hanging flaps. Colours via `--awning-a` / `--awning-b`. |
| `hand-underline`   | Yellow brush stroke under a word.                                                      |

For print, use real paper stock (uncoated, off-white) rather than printing the
grain.

---

## 8. Design tokens in code

`styles/globals.css` → `@theme` is the single source of truth. Components use
Tailwind utilities generated from it (`bg-red`, `text-ink`, `font-display`,
`shadow-print`, `rounded-lg`, `ease-pour` …). Tailwind's default palette is
switched off, so off-brand colours can't creep in.

| Group  | Tokens                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------- |
| Colour | see §2                                                                                            |
| Fonts  | `font-display`, `font-heading`, `font-sans`                                                       |
| Radius | `rounded-sm` 4 px · `rounded-md` 8 px (buttons) · `rounded-lg` 14 px (cards) · `rounded-xl` 24 px |
| Shadow | `shadow-print-sm` · `shadow-print` · `shadow-print-lg` · `shadow-print-red`                       |
| Easing | `ease-pour` (smooth settle) · `ease-bounce` (playful overshoot)                                   |

---

## 9. Applying the identity

- **Website** — implemented in this repository.
- **Menu board** — Deep Red or ink board, cream/yellow lettering in Yatra One for
  headings and Mukta for items; FSSAI veg/non-veg marks next to every item.
- **Packaging** — kraft or cream stock; `mono-ink` or `full` symbol; tagline
  lockup on bags; the awning stripe as a tape/sticker pattern.
- **Cups & kulhads** — `symbol` stamped in `mono-ink` or red.
- **Fascia signage** — `secondary` (horizontal) on Deep Red, or `full` on a cream
  painted board; hand-painting encouraged, following the outlines.

---

## 10. Tools

- `brand/tools/build-logos.mjs` — builds every logo, PNG, favicon and the web copies.
- `brand/tools/outline-text.mjs` — converts text in a font to outlined SVG paths
  with HarfBuzz (needed only to change the lettering). It needs HarfBuzz, which
  is deliberately not a project dependency:
  `npm install --no-save harfbuzzjs`, then
  `node brand/tools/outline-text.mjs node_modules/harfbuzzjs <font.ttf> <out.json> "TEXT"`.
