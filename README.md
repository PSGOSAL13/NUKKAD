# NUKKAD | नुक्कड — website

_Apna Nukkad. Apne Log._ — a North Indian street-corner café in Trivandrum.

Fully static Next.js site in English and Malayalam (`/en/`, `/ml/`). The visitor's language choice is remembered.

## Requirements

- Node.js 24 (`nvm use 24`; see `.nvmrc`)

## Commands

| Command               | What it does                                                   |
| --------------------- | -------------------------------------------------------------- |
| `npm install`         | Install dependencies                                           |
| `npm run dev`         | Local dev server at http://localhost:3000                      |
| `npm run build`       | Build the static site into `out/` (upload this folder to host) |
| `npm run check`       | Lint + type check + formatting + build — run before deploying  |
| `npm run format`      | Auto-format all files                                          |
| `npm run brand:logos` | Regenerate all logo files from `brand/tools/build-logos.mjs`   |

## Editing café information

All editable information lives in **`content/`** — never in components.

| File                         | Contains                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `content/site.ts`            | Name, tagline, address, phone, WhatsApp, hours, socials                                   |
| `content/menu.ts`            | Built-in **sample** menu (used until a Google Sheet is connected — see **MENU-GUIDE.md**) |
| `content/home.ts`            | Home page copy (all 10 sections)                                                          |
| `content/story.ts`           | Our Story page                                                                            |
| `content/baatein.ts`         | Nukkad Ki Baatein entries                                                                 |
| `content/events.ts`          | Events (informational, walk-in only)                                                      |
| `content/gallery.ts`         | Atmosphere photos                                                                         |
| `content/location.ts`        | Illustrated map: café pin, nearby landmarks, `confirmed` flag                             |
| `content/placeholders.ts`    | Dummy phone / Instagram values used until real ones exist                                 |
| `content/opening.ts`         | Opening greeting (Hindi / Malayalam), voice + ambience files                              |
| `content/owner-character.ts` | Look of the cartoon owner in the 3D opening                                               |

Text is written as `{ en: "…", ml: "…" }`. English is required; missing
Malayalam falls back to English.

**Placeholders:** every build prints a list of content still marked
`PLACEHOLDER` (or using the dummy phone number / Instagram link). The list
should be empty before launch.

The rules for every field are in `content/schema.ts`. If something is wrong
(e.g. a negative price or a badly formatted phone number), `npm run build`
stops and tells you exactly which field to fix.

Interface labels (navigation, buttons, day names) are in `i18n/dictionaries/`.

## Menu

The owner edits the menu in a **Google Sheet** — no code. See **MENU-GUIDE.md**.
Photos go in `photos/menu/` (named after the product); `npm run build` optimises them.
`npm run menu:template` re-exports the built-in menu as a CSV to import into the sheet.

## Cinematic 3D opening

`components/opening/OpeningExperience.tsx` is a self-contained, reusable
component: street scene → owner's greeting → "Come, Sit & Stay" → shutter
opens, camera enters, chai is poured → café interior → Continue.

- **Quality is automatic.** Capable devices get full 3D (shadows, more
  lights); weaker devices get simplified 3D; no WebGL or Data Saver gets an
  illustrated 2D version. If the frame rate drops, it steps down by itself.
  Reduced-motion users get cuts instead of camera flights.
- **Loaded last.** The 3D code (~185 KB gzipped) downloads only after the
  page has loaded, and only on devices that will use it. Rendering pauses when
  the opening is scrolled out of view.
- **Sound** is off for first-time visitors; the choice and the greeting
  language are remembered. Voice files go in `public/audio/` — see
  `content/opening.ts` for the recording spec.
- **Test a quality level** on any device: add `?opening-quality=high`,
  `low` or `2d` to the home page URL.
- **Blender models:** everything is built in code today. To swap in a GLB,
  see `three/models/registry.ts` (budgets and the optimisation command).

## Project structure

```
app/            routes — app/[lang]/ holds every page, app/(root)/ sends "/" to the remembered language
brand/          brand guidelines, master logo files, logo tools  (see brand/README.md)
components/     brand/ (Logo), ui/ (Button, Tag…), layout/ (Header, Footer), sections/, menu/, opening/
content/        ✏️ editable café data + validation schema
i18n/           languages, fallback logic, interface translations
lib/            helpers (content loading, SEO, formatting)
scripts/        build helpers (post-build fix for a Next.js Windows export bug)
styles/         global CSS + design tokens
three/          3D opening scene: street/, interior/, character/, models/ (GLB slots)
public/         static files served as-is
```

## Security notes

- The site is fully static; there is no server or database.
- Never put secrets in `NEXT_PUBLIC_*` variables — they are visible to every visitor.
- See `.env.example`.
