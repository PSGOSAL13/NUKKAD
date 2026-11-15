# Installation

How to get the NUKKAD website running on a computer (Windows, macOS or Linux).

## 1. Requirements

| Tool           | Version    | Notes                                                                                                                           |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Node.js        | **24**     | `.nvmrc` pins it. With nvm: `nvm install 24 && nvm use 24` (Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows)) |
| npm            | 11+        | Comes with Node 24                                                                                                              |
| Git            | any        |                                                                                                                                 |
| Chrome or Edge | any recent | Only for `npm run test:e2e`                                                                                                     |

No database, Docker or paid service is needed.

## 2. Get the code and install

```bash
git clone <your-repository-url> nukkad
cd nukkad
npm install
```

## 3. Optional settings

Copy `.env.example` to `.env.local` and fill in what you have (see
ENVIRONMENT_VARIABLES.md). Everything is optional — without it the site uses
the built-in sample menu and events.

## 4. Run it

```bash
npm run dev        # development server with live reload → http://localhost:3000
```

Or see exactly what visitors will get:

```bash
npm run build      # builds the static site into out/
npm run preview    # serves out/ like the real host (headers, gzip) → http://127.0.0.1:4173
```

Open `/en/` or `/ml/`. Add `?opening-quality=high`, `low` or `2d` to the home
page address to force a 3D quality level.

## 5. Check everything

```bash
npm run check      # lint + type check + formatting + build
npm run test:e2e   # 21 browser checks: features, accessibility, security (needs a build first)
```

## Troubleshooting

- **`node: command not found` / wrong version** — run `nvm use 24` in this folder.
- **Fonts fail to download during build** — the build fetches the brand fonts
  from Google Fonts once; check the internet connection or proxy.
- **`EBUSY … out/` on Windows** — a terminal or Explorer window is open inside
  `out/`; close it and build again.
- **e2e: "Chrome not found"** — set `CHROME_PATH` to your browser's executable.
