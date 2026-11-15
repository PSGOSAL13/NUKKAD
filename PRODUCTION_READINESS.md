# NUKKAD — Production-readiness report

_Date: 15 November 2026 · Build: Next.js 16.4.6 static export · Not deployed._

## Verdict

**Technically ready, not yet launch-ready.**

- ✅ Code, build, accessibility, security headers and automated tests are in
  place and passing (21/21 end-to-end checks, 0 accessibility violations).
- ⛔ **Content is not final:** 50 placeholders remain — the address (premises
  unconfirmed), phone/WhatsApp (dummy number), Instagram, the real menu and
  prices, real events and photos (all current ones are samples), parts of
  the founder story, and the site's domain. Launching now would show sample
  food photos and a dummy phone number.
- ⚠️ **Real-device testing has not been done** (see §4). Required before launch.

## 1. Functional testing

Automated in `tests/e2e.mjs` (`npm run test:e2e`, runs against the production
build with the real security headers; every check uses a fresh browser
profile and fails on any console error, CSP violation or HTTP error).
**Last run: 21/21 passed.**

| Area (Prompt 10)                                    | Result         | How it was tested                                                                                                                                                           |
| --------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage                                            | ✅             | All 12 pages (en + ml) load with exactly one h1, no errors                                                                                                                  |
| Navigation                                          | ✅             | All 6 main links resolve (desktop)                                                                                                                                          |
| Mobile navigation                                   | ✅             | Opens, shows all links, Escape closes (390 px phone)                                                                                                                        |
| EN/ML language switching                            | ✅             | Switch keeps the current page (`/en/menu/` → `/ml/menu/`)                                                                                                                   |
| Language preference persistence                     | ✅             | Choice stored; visiting `/` later opens Malayalam                                                                                                                           |
| Audio preference persistence                        | ✅             | Off by default; turning on survives reload; nothing autoplays                                                                                                               |
| Welcome animation / subtitles                       | ✅             | Hindi + Malayalam subtitles; greeting language remembered                                                                                                                   |
| Skip and Continue                                   | ✅             | Skip focuses the welcome section; Continue appears after the transition                                                                                                     |
| 3D camera transition                                | ✅             | "Come, Sit & Stay" plays to the interior (low quality, real GPU)                                                                                                            |
| Reduced motion                                      | ✅             | Transition cuts straight to the interior (< 3 s)                                                                                                                            |
| 2D fallback (no WebGL)                              | ✅             | Illustrated opening works without a canvas                                                                                                                                  |
| Loading animation                                   | ✅ implemented | Branded kulhad loader, delayed 0.5 s, "Use simple view" skip (verified visually, not asserted in e2e)                                                                       |
| Menu categories                                     | ✅             | 3 tabs, keyboard (End key) selects the last one                                                                                                                             |
| Menu prices                                         | ✅             | Exact ₹ prices on the board and in details                                                                                                                                  |
| Sold-out status                                     | ✅             | "Sold Out" stamp shown; hidden items absent                                                                                                                                 |
| Item details                                        | ✅             | Dialog opens; Escape closes; no ordering form anywhere                                                                                                                      |
| Rotating six on home                                | ✅             | Exactly six available products                                                                                                                                              |
| Events calendar                                     | ✅             | Calendar rendered; list (or empty message)                                                                                                                                  |
| Upcoming event list                                 | ✅             | Every event card has "Call to enquire"; no registration inputs                                                                                                              |
| Call buttons                                        | ✅             | `tel:` links present (number is still a placeholder)                                                                                                                        |
| WhatsApp pre-filled message                         | ✅             | `wa.me/…?text=` with a localized greeting                                                                                                                                   |
| Google Maps directions                              | ✅             | Official Maps URL; placeholder text never sent to Google                                                                                                                    |
| Google Sheet sync + live refresh                    | ✅ (manual)    | Tested in M6/M7 with a stand-in sheet: build-time sync, live price/Sold Out change, create / edit / re-date / unpublish events. Not in the automated suite (needs a sheet). |
| Photo pipeline ("uploads")                          | ✅ (manual)    | `photos/` → 240/480/960 WebP, EXIF stripped, samples overridden by real photos                                                                                              |
| Admin login · admin content updates · image uploads | **N/A**        | No admin dashboard exists — the owner chose "Keep Google Sheets only" (Prompt 8). The e2e suite verifies `/admin`, `/login`, `/api` do not exist.                           |

## 2. Security review

| Check                          | Result                                                                                                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication / authorisation | N/A — no login, accounts or admin area by design; nothing to break into                                                                                                                                                                                    |
| Public API exposure            | None — static files only; no API routes (verified 404)                                                                                                                                                                                                     |
| Environment variables          | Only 3 `NEXT_PUBLIC_*` values, all public by design (site URL, published sheet links). No secrets exist.                                                                                                                                                   |
| Secrets in the build           | Automated scan of `out/` for keys/tokens: none                                                                                                                                                                                                             |
| Input validation               | Every content value (files and Google Sheet rows) validated with Zod; bad rows are rejected with row numbers and the last good data kept. Rendered through React (escaped). JSON-LD escapes `<`.                                                           |
| Links from content             | Photo and announcement links restricted to `https://` or site paths; external links use `rel="noopener noreferrer"`                                                                                                                                        |
| File uploads                   | No upload endpoint. Photos enter only via the repository; the build re-encodes them (sharp) and strips metadata.                                                                                                                                           |
| Drafts                         | Draft/past events never reach page HTML (fixed in M7). Note: the published sheet itself contains draft rows (documented).                                                                                                                                  |
| HTTP headers                   | CSP (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`), `X-Content-Type-Options`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, HSTS — in `public/_headers` and `vercel.json`; verified by e2e with zero CSP violations |
| Known trade-off                | CSP allows `'unsafe-inline'` scripts: a static export can't use per-request nonces, and Next.js injects inline bootstrap scripts. Mitigated by having no user-generated HTML.                                                                              |
| Dependencies                   | `npm audit --omit=dev`: 0 production vulnerabilities (dev-tool advisories only)                                                                                                                                                                            |

## 3. Performance (Lighthouse 12, local production preview with gzip)

Mobile = Lighthouse's simulated mid-range phone (slow 4G, 4× CPU slowdown).
Mobile scores vary run to run; LCP/TBT are medians of 3 runs where noted.

| Page              | Mobile perf | Mobile LCP | Mobile TBT                    | Desktop perf | A11y | Best pr. | SEO | CLS |
| ----------------- | ----------- | ---------- | ----------------------------- | ------------ | ---- | -------- | --- | --- |
| Home (en)         | 47–53       | 4.6 s*     | 0.6 s* (cold run up to 3.9 s) | 98–99        | 100  | 100      | 100 | 0   |
| Home (ml)         | 50–51       | 4.7–5.0 s  | 1.6–2.0 s                     | 90–92        | 100  | 100      | 100 | 0   |
| Menu              | 79–81       | 4.7 s*     | 30 ms*                        | 99           | 100  | 100      | 100 | ~0  |
| Nukkad Ki Baatein | 84          | 4.3 s*     | 30 ms*                        | 99           | 100  | 100      | 100 | 0   |

\* median of 3 runs. **Before the Prompt 9 pass:** home mobile 51, Baatein 63
(TBT 850 ms), SEO 91, 3 accessibility issue types.

What was done: background shader precompilation, interior built after the
street appears, cheaper procedural textures, lazy-loaded sheet parsers,
cached formatters, a 240 px photo size, fewer preloaded fonts, per-page
canonical/hreflang, sitemap, structured data, caching headers.

Payload: initial JS ≈ 194 KB gzip (React/Next + site). The 3D opening adds
≈ 285 KB gzip (≈ 240 KB brotli), loaded **after** the page is interactive
and only on devices that get 3D. Menu photos 10–28 KB (thumbnails).

**Honest assessment:** desktop is excellent. On a slow simulated phone,
pages take ~4.5 s to finish rendering their main text (web-font and network
bound), and the home page has a further CPU hit when the 3D scene starts.
The cinematic experience was deliberately kept (brief: don't remove it for
scores); phones Lighthouse would class as weak get the simplified scene or
the 2D version automatically.

## 4. Accessibility

- axe-core (WCAG 2.0/2.1/2.2 A + AA + best practices): **0 violations** on all
  12 pages × phone and desktop (automated in e2e).
- Lighthouse accessibility: 100 on every audited page.
- Keyboard: skip link first, visible focus ring everywhere, tabs with arrow
  keys, dialogs with focus trap + Escape, calendar buttons labelled with full
  dates.
- Reduced motion respected (3D cuts, rotation off, animations disabled).
- Subtitles for the welcome; audio never autoplays; mute is always visible.
- Colour contrast checked for every text/background pair (≥ 4.5:1).

## 5. Devices

| Device                                 | Status                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Desktop Chrome, Windows, Intel UHD GPU | ✅ tested (full 3D ≈ 115–145 fps)                                                  |
| Phone layouts (390 px, 360 px)         | ✅ tested in Chrome device emulation                                               |
| Simulated mid-range Android            | ✅ Lighthouse mobile emulation (above)                                             |
| **Real mid-range Android**             | ❌ not tested — no device available here                                           |
| **iPhone / Safari**                    | ❌ not tested — needs an iPhone or Mac                                             |
| **Older phones**                       | ❌ not tested on hardware (2D/low-quality paths verified via `?opening-quality=low | 2d`) |

Before launch: open the `*.pages.dev` preview on 2–3 real phones (one
iPhone, one budget Android) and check the opening, menu and events. Use
`?opening-quality=high|low|2d` to compare.

## 6. Known limitations

1. No admin dashboard (owner decision). Café info and page text are edited
   in `content/*.ts` (GitHub web editor works; see ADMIN_GUIDE.md §7).
2. Sheet changes appear after Google's publish cache (~5 min); new photos
   and the search-engine copy need a deploy.
3. Voice recordings and street ambience not provided — the sound button has
   nothing to play yet.
4. 3D scene is built in code (no Blender models yet); the owner character is
   a stylised likeness from one photograph.
5. Malayalam text is a draft not yet reviewed by a native speaker; untranslated sections fall back
   to English.
6. Mobile performance as described in §3; real-device testing pending.
7. CSP needs `'unsafe-inline'` scripts (static export limitation).
8. Windows-only Next.js export bug worked around by a post-build script.

## 7. Remaining placeholders (50)

Printed by every build. Summary:

- `content/site.ts`: street address, phone, WhatsApp, Instagram URL
- `content/menu.ts`: all 14 products and prices (samples)
- 10 sample menu photos, 5 sample event photos (Unsplash, credited)
- `content/events.ts`: 6 sample events
- `content/story.ts`: years of service, the sea and submarines, why Trivandrum
- `content/location.ts`: 5 landmarks + directions (premises unconfirmed)
- `content/baatein.ts`: one draft chai note
- Hosting: `NEXT_PUBLIC_SITE_URL` (domain)

Also pending (not counted): Hindi spelling decision (नुक्कड vs नुक्कड़),
Malayalam review, FSSAI number.

## 8. Running costs

≈ **₹50–110 per month** (domain only) on Cloudflare Pages Free + Google
Sheets. With Vercel Pro: + ≈ ₹1,700/month. Details in DEPLOYMENT.md.
