# NUKKAD | नुक्कड — website

_Apna Nukkad. Apne Log._ — a North Indian street-corner café in Trivandrum.

Fully static Next.js site in English, Hindi and Malayalam (`/en/`, `/hi/`, `/ml/`).

## Requirements

- Node.js 24 (`nvm use 24`; see `.nvmrc`)

## Commands

| Command          | What it does                                                   |
| ---------------- | -------------------------------------------------------------- |
| `npm install`    | Install dependencies                                           |
| `npm run dev`    | Local dev server at http://localhost:3000                      |
| `npm run build`  | Build the static site into `out/` (upload this folder to host) |
| `npm run check`  | Lint + type check + formatting + build — run before deploying  |
| `npm run format` | Auto-format all files                                          |

## Editing café information

All editable information lives in **`content/`** — never in components.

| File              | Contains                                                |
| ----------------- | ------------------------------------------------------- |
| `content/site.ts` | Name, tagline, address, phone, WhatsApp, hours, socials |
| `content/menu.ts` | Menu categories, items, prices, diet flags              |

Text is written as `{ en: "…", hi: "…", ml: "…" }`. English is required; a
missing Hindi or Malayalam text falls back to English.

The rules for every field are in `content/schema.ts`. If something is wrong
(e.g. a negative price or a badly formatted phone number), `npm run build`
stops and tells you exactly which field to fix.

Interface labels (navigation, buttons, day names) are in `i18n/dictionaries/`.

## Project structure

```
app/            routes — app/[lang]/ holds every page, app/(root)/ redirects "/" → "/en/"
components/     reusable UI (from M1)
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
