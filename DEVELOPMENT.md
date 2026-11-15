# Development guide

For developers maintaining NUKKAD. Owners: see ADMIN_GUIDE.md instead.

## Stack

Next.js 16 (App Router, **static export** — `out/` is plain HTML/CSS/JS) ·
React 19 · TypeScript (strict) · Tailwind CSS 4 · Zod 4 (content validation) ·
three.js + React Three Fiber + GSAP (3D opening) · sharp (photos, logos).
No backend, no database, no runtime secrets.

## Project structure

```
app/[lang]/          pages: home, menu, our-story, nukkad-ki-baatein, location, contact, brand (style guide, noindex)
app/(root)/          "/" → remembered language (inline script) or /en/
app/sitemap.ts, robots.ts
components/          ui/ (Button, Tag…), layout/ (Header, Footer, AnnouncementBar), sections/, menu/, events/,
                     opening/ (3D opening UI + 2D fallback), illustrations/ (hand-drawn SVGs), brand/, seo/
content/             ✏️ all editable content + schema.ts (Zod rules) + generated/ (photo manifests, sheet copies)
i18n/                locales (en, ml), fallback, interface dictionaries
lib/                 content loading, sheets (CSV ⇄ data), events/menu helpers, formatting, SEO, photos
three/               3D scene: street/, interior/, character/, models/ (GLB slots), Choreography (GSAP), quality tiers
brand/               logo masters, generator (brand/tools/build-logos.mjs), guidelines
photos/              source photos (menu/, events/) → optimised by scripts/build-photos.mjs
scripts/             build-photos, sync-sheets, fix-export-segments (Windows), serve-out (preview)
tests/e2e.mjs        browser tests (puppeteer-core + axe-core)
public/              static files (_headers = security/caching headers)
```

## Commands

| Command                   | What it does                                                                 |
| ------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`             | Dev server (runs photo pipeline + sheet sync first)                          |
| `npm run build`           | Static build → `out/` (photos + sheet sync before, Windows export fix after) |
| `npm run preview`         | Serve `out/` with production headers                                         |
| `npm run check`           | Lint + types + formatting + build                                            |
| `npm run test:e2e`        | 21 browser checks against `out/`                                             |
| `npm run brand:logos`     | Regenerate logos, favicons, OG image                                         |
| `npm run sheets:template` | Export built-in menu/events as CSVs for Google Sheets                        |
| `npm run format`          | Prettier                                                                     |

## How content flows

1. `content/*.ts` (or a synced Google Sheet copy in `content/generated/`) →
2. validated by `content/schema.ts` in `lib/content.ts` at build time (a bad
   value stops the build with a readable error) →
3. rendered to static HTML.
4. In the browser, the menu and events re-fetch the published sheet
   (`lib/use-live-menu.ts`, `lib/use-live-events.ts`) so prices, Sold Out and
   event changes show without a rebuild. Parsing code is lazy-loaded only
   when a sheet is configured.

`next.config.ts` prints the placeholder report once per build.

## Common tasks

- **Add a menu item** (no sheet): append to an `items` array in `content/menu.ts`.
  With a sheet: add a row (ADMIN_GUIDE.md §2).
- **Add an event**: `content/events.ts` or the sheet's Events tab.
- **Change contact details / hours**: `content/site.ts`.
- **Add a page**: `app/[lang]/<slug>/page.tsx` + entry in `lib/routes.ts` +
  labels in `i18n/dictionaries/{en,ml}.ts` + `alternatesFor()` in its metadata.
- **New interface text**: add the key to `en.ts`; TypeScript forces `ml.ts` to match.
- **Swap in a Blender model**: put the optimised GLB in `public/models/`, set
  `src` in `three/models/registry.ts`.

## Conventions

- Never hard-code café data in components — it belongs in `content/`.
- Colours only from the Tailwind theme (`styles/globals.css`); the default
  palette is disabled on purpose.
- Every interactive element must work with a keyboard and pass axe
  (`npm run test:e2e` enforces WCAG 2.2 AA).
- React Compiler lint rules are strict: don't mutate hook return values; use
  refs or the frame callback's own `state`.
- `next/font` self-hosts fonts; only Yatra One and Mukta are preloaded.

## Known quirks

- **Windows builds**: Next.js 16.4 writes static-export prefetch files into
  nested folders on Windows; `scripts/fix-export-segments.mjs` (postbuild)
  flattens them. No-op on Linux/macOS hosts.
- `cacheComponents` is off — incompatible with `dynamicParams=false` and not
  useful for a static export.
- `experimental.inlineCss` was measured and gave no reliable gain; left off.
