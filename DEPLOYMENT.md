# Deployment

> **Status: not deployed.** Nothing has been published. Deploy only after the
> owner approves (and ideally after the placeholder list is empty).

## Recommendation

The site is a **static export** (`out/`): HTML, CSS, JS, images. It needs no
server, database or storage service — photos, fonts and (future) 3D models
are served from the same CDN as the pages.

| Option                      | Cost                                 | Commercial use         | Verdict                                                                                  |
| --------------------------- | ------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare Pages** (Free) | ₹0                                   | ✅ allowed             | **Recommended** — free, unlimited bandwidth, Indian edge locations, `_headers` supported |
| Vercel Hobby                | ₹0                                   | ❌ non-commercial only | Not allowed for a café business                                                          |
| Vercel Pro                  | ~US$20 (≈ ₹1,700) / month per member | ✅                     | Fine technically; `vercel.json` is ready                                                 |
| Netlify Free                | ₹0                                   | ✅ (with limits)       | Also works; `_headers` supported                                                         |

The brief preferred Vercel. Vercel's free plan forbids commercial sites, so
for an economical setup **Cloudflare Pages** is recommended. Both are
configured — switching later is just connecting the repository elsewhere.

Supabase and separate image storage are **not needed** (owner chose Google
Sheets instead of an admin dashboard).

## One-time setup — Cloudflare Pages

1. Put the project in a **private GitHub repository** (it must not include
   `.env.local` — already git-ignored).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**
   → choose the repository.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
4. Environment variables (Production and Preview):
   - `NODE_VERSION` = `24`
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-domain>`
   - `NEXT_PUBLIC_MENU_SHEET_CSV_URL`, `NEXT_PUBLIC_EVENTS_SHEET_CSV_URL` (if the sheet is ready)
5. Save and deploy. You get a `*.pages.dev` preview address — check it.
6. **Custom domain**: Pages project → Custom domains → add `nukkad.in` (or
   chosen domain). Buying the domain through Cloudflare Registrar is at cost.
7. Optional: Cloudflare **Web Analytics** (free, no cookies) — no code needed.

`public/_headers` applies the Content Security Policy, frame/sniffing
protection, referrer and permissions policies, HSTS, and caching
(`/_next/static` immutable for a year; photos/brand/audio/models 1 day +
stale-while-revalidate).

## Alternative — Vercel (Pro)

Import the repository. `vercel.json` sets the Framework Preset to **Other**
(`"framework": null`) — required, because the site is a static export and
Vercel's Next.js preset would look for `routes-manifest.json` and fail. In
Project Settings → Build & Deployment, leave Framework Preset, Build Command
and Output Directory **un-overridden** so `vercel.json` applies. It also sets
the build command, `out` directory
and the same headers. Add the same environment variables. Node 24 is taken
from `engines` in `package.json`.

## Deploying updates

- **Code or content-file changes**: push to the main branch (or edit on
  GitHub) → the host rebuilds automatically (~2 minutes). A failing build
  never replaces the live site.
- **Google Sheet changes** (prices, Sold Out, events): live within minutes
  without a deploy. A deploy refreshes the copy that search engines see —
  optionally schedule a daily rebuild with a Cloudflare **deploy hook** +
  the GitHub Action in `.github/workflows/scheduled-rebuild.yml` (set the
  `CF_DEPLOY_HOOK_URL` repository secret).
- **New photos**: add them to `photos/menu/` or `photos/events/` and push.

## Pre-launch checklist

- [ ] Placeholder list printed by `npm run build` is empty (or accepted)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] Malayalam reviewed by a native speaker
- [ ] Real menu, prices and photos; sample photos deleted
- [ ] `npm run check` and `npm run test:e2e` pass
- [ ] Spot-check on a real Android phone and an iPhone (see the readiness report)
- [ ] Google Business Profile created and linked to the site
- [ ] Owner approves → connect the domain

## Estimated running costs

| Item                                             | Monthly                                     |
| ------------------------------------------------ | ------------------------------------------- |
| Hosting (Cloudflare Pages Free)                  | ₹0                                          |
| Google Sheets                                    | ₹0                                          |
| Domain (.in ≈ ₹600–900/yr, .com ≈ ₹900–1,300/yr) | ≈ ₹50–110                                   |
| **Total**                                        | **≈ ₹50–110 / month** (≈ ₹600–1,300 / year) |

With Vercel Pro instead: add ≈ ₹1,700 / month.
