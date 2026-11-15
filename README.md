# NUKKAD | नुक्कड — website

_Apna Nukkad. Apne Log._ — a North Indian street-corner café in Trivandrum.
"Somewhere between chai and conversations, you find your people."

A fast, fully static website in **English and Malayalam** with a cinematic
3D street-corner opening, a hand-chalked menu board, owner-led storytelling
and community events. The owner updates the menu and events from a Google
Sheet — no login, no database, no running server.

## Documentation

| Read this                                            | If you want to…                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md)                     | **Owner:** change the menu, prices, Sold Out, events, photos, contact details, announcements |
| [INSTALLATION.md](INSTALLATION.md)                   | Run the site on a computer                                                                   |
| [DEVELOPMENT.md](DEVELOPMENT.md)                     | Change the code; project structure and conventions                                           |
| [DEPLOYMENT.md](DEPLOYMENT.md)                       | Put it online (hosting choice, steps, costs)                                                 |
| [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) | Settings for the host                                                                        |
| [ASSET_REQUIREMENTS.md](ASSET_REQUIREMENTS.md)       | Photos, recordings, models and text still needed                                             |
| [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)   | Test results, audits, known limitations, remaining placeholders                              |
| [brand/README.md](brand/README.md)                   | Logo, colours, typography, illustration and photo direction                                  |

## Quick start

```bash
nvm use 24
npm install
npm run dev            # http://localhost:3000/en/
```

```bash
npm run build          # static site → out/
npm run preview        # production-like preview → http://127.0.0.1:4173
npm run check          # lint + types + formatting + build
npm run test:e2e       # 21 browser checks (features, accessibility, security)
```

## What's inside

- **Pages:** Home (3D opening → welcome → signature trio + rotating six →
  founder story → atmosphere → Nukkad Ki Baatein → events → map → contact),
  Menu, Our Story, Nukkad Ki Baatein (storytelling, calendar, community
  events, group bookings), Location, Contact — each in `/en/` and `/ml/`.
- **3D opening:** React Three Fiber scene built in code (street, shopfront,
  owner character, café interior), automatic quality tiers, 2D fallback,
  reduced-motion support, optional voice with subtitles (muted by default).
- **No ordering, accounts, reservations or registration** — calls and
  WhatsApp only.

Not deployed yet — see DEPLOYMENT.md.
