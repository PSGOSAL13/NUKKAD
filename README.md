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

| File                 | Contains                                                     |
| -------------------- | ------------------------------------------------------------ |
| `content/site.ts`    | Name, tagline, address, phone, WhatsApp, hours, socials      |
| `content/menu.ts`    | Menu categories, items, prices, diet flags, `featured` items |
| `content/home.ts`    | Home page copy (all 10 sections)                             |
| `content/story.ts`   | Our Story page                                               |
| `content/baatein.ts` | Nukkad Ki Baatein entries                                    |
| `content/events.ts`  | Events (informational, walk-in only)                         |
| `content/gallery.ts` | Atmosphere photos                                            |

Text is written as `{ en: "…", ml: "…" }`. English is required; missing
Malayalam falls back to English.

The rules for every field are in `content/schema.ts`. If something is wrong
(e.g. a negative price or a badly formatted phone number), `npm run build`
stops and tells you exactly which field to fix.

Interface labels (navigation, buttons, day names) are in `i18n/dictionaries/`.

## Project structure

```
app/            routes — app/[lang]/ holds every page, app/(root)/ sends "/" to the remembered language
brand/          brand guidelines, master logo files, logo tools  (see brand/README.md)
components/     brand/ (Logo), ui/ (Button, Tag…), layout/ (Header, Footer), sections/, menu/
content/        ✏️ editable café data + validation schema
i18n/           languages, fallback logic, interface translations
lib/            helpers (content loading, SEO, formatting)
styles/         global CSS + design tokens
public/         static files served as-is
```

## Security notes

- The site is fully static; there is no server or database.
- Never put secrets in `NEXT_PUBLIC_*` variables — they are visible to every visitor.
- See `.env.example`.
