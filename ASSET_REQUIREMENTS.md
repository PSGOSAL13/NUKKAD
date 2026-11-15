# Asset requirements

What NUKKAD still needs from the owner, and the technical spec for each.
Everything currently on the site in these places is a **sample or
placeholder** (the build lists them).

## Content (text)

| Item                                                                              | Where it goes                      | Status                    |
| --------------------------------------------------------------------------------- | ---------------------------------- | ------------------------- |
| Final address, PIN, Google Maps link, map coordinates                             | `content/site.ts`                  | ⏳ premises not confirmed |
| Phone and WhatsApp numbers                                                        | `content/site.ts`                  | ⏳ dummy number in place  |
| Instagram profile URL (and Swiggy/Zomato if used)                                 | `content/site.ts`                  | ⏳                        |
| Nearby landmarks (up to 8) + one-line directions                                  | `content/location.ts`              | ⏳                        |
| Real menu: names, descriptions, **exact prices**                                  | Google Sheet / `content/menu.ts`   | ⏳ 14 sample items        |
| Founder story — remaining answers (years of service, sea, submarines, Trivandrum) | `content/story.ts`                 | ◐ partly provided         |
| Real events                                                                       | Google Sheet / `content/events.ts` | ⏳ 6 sample events        |
| Malayalam review by a native speaker                                              | all `ml:` texts                    | ⏳ drafts                 |
| Hindi spelling decision: नुक्कड vs नुक्कड़                                             | logo + `content/site.ts`           | ⏳                        |
| FSSAI licence number                                                              | `content/site.ts`                  | optional                  |

## Photographs

| Use                                                             | Folder                                          | Spec                                                                                              |
| --------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Menu items                                                      | `photos/menu/<item-id>.jpg`                     | Landscape or square, ≥ 1200 px wide, JPEG/PNG/WebP. Daylight or warm light, dish fills the frame. |
| Events                                                          | `photos/events/<name>.jpg`                      | ≥ 1200 px wide. Only people who agreed to appear online.                                          |
| Café atmosphere (counter, radio, bicycle, lamps, books, carrom) | `public/images/gallery/` + `content/gallery.ts` | 4:5 portrait, ≥ 1000 px wide                                                                      |

The build converts photos to optimised WebP (240 / 480 / 960 px) and strips
EXIF data, including phone GPS location. Delete `photos/*/sample/` once real
photos exist.

## Audio (optional)

| File                               | Spec                                                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `public/audio/welcome-hi.mp3`      | "Namaste! NUKKAD mein aapka swagat hai. Chai piyenge?" — 3–4 s, mono, 96–128 kbps, peaks ≈ −3 dB, trimmed silence |
| `public/audio/welcome-ml.mp3`      | "നമസ്കാരം! നുക്കഡിലേക്ക് സ്വാഗതം. ഒരു ചായ കുടിക്കാമോ?" — same spec                                                         |
| `public/audio/street-ambience.mp3` | 20–40 s seamless loop, ≈ 64 kbps, low level                                                                       |

Only recordings you own or have licensed. Enable them in `content/opening.ts`.

## 3D models (optional — the scene is fully built in code today)

Blender → GLB, one file per object, registered in `three/models/registry.ts`.

| Budget                                                | Value                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Owner character                                       | ≤ 1.5 MB, ≤ 25k triangles                                         |
| Each prop (counter, bicycle, lamp, bench, shopfront…) | ≤ 300 KB, ≤ 5k triangles                                          |
| Whole opening                                         | ≤ ~2 MB of models                                                 |
| Textures                                              | 1K–2K, lighting **baked** in Blender, no real-time shadows needed |

Optimise before adding:
`npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp`

## Brand

Logo, colours and fonts are final in `brand/` (see `brand/README.md`). For
large physical signage, a sign painter can hand-trace the outlined lettering.
