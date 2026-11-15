# Environment variables

The site is fully static and has **no secrets**. All four variables are
optional and public by design (they end up in the website, which is fine —
they are links, not passwords). Set them in the hosting dashboard; for local
builds put them in `.env.local` (never committed — `.env*` is git-ignored).

| Variable                           | Required               | Example                                                                         | What it does                                                                                                                                                                                                  |
| ---------------------------------- | ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | **Yes, before launch** | `https://nukkad.in`                                                             | The site's own address. Used for canonical links, language alternates (hreflang), `sitemap.xml`, `robots.txt` and social sharing previews. Until it is set the build warns and uses `https://nukkad.example`. |
| `NEXT_PUBLIC_MENU_SHEET_CSV_URL`   | No                     | `https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv`   | The Google Sheet **Menu** tab, published as CSV. Synced at build time and refreshed live in visitors' browsers. Not set → `content/menu.ts`.                                                                  |
| `NEXT_PUBLIC_EVENTS_SHEET_CSV_URL` | No                     | `https://docs.google.com/spreadsheets/d/e/…/pub?gid=123&single=true&output=csv` | The **Events** tab, published as CSV. Not set → `content/events.ts`.                                                                                                                                          |
| `NODE_VERSION`                     | Host-dependent         | `24`                                                                            | Tells the host which Node.js to build with (Cloudflare Pages needs it; Vercel reads `engines` in package.json).                                                                                               |

For the end-to-end tests only: `CHROME_PATH` (path to Chrome/Edge if it
isn't found automatically).

## Rules

- Anything starting with `NEXT_PUBLIC_` is visible to every visitor. **Never**
  put a password, API key or private link in one.
- The published Google Sheet link is read-only, but anyone with it can read
  every row — including draft events. Keep private notes out of the sheet.
- Changing a variable needs a new deploy to take effect.
