# NUKKAD — Admin guide (for the owner)

There is no login or dashboard (by decision — see DEPLOYMENT.md). Everyday
changes are made in two places:

| What                                                                               | Where                                                       | Code?         | Live in…                     |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------- | ---------------------------- |
| Menu: products, prices, Sold Out, hide, photos                                     | Google Sheet → **Menu** tab                                 | No            | ~5 min (photos: next deploy) |
| Events: create, edit, delete, dates, publish, photos                               | Google Sheet → **Events** tab                               | No            | ~5 min (photos: next deploy) |
| Address, Maps link, hours, phone, WhatsApp, Instagram, Swiggy/Zomato, announcement | `content/site.ts` (§7)                                      | Edit one file | next deploy (~2 min)         |
| Landmarks on the map                                                               | `content/location.ts` (§7)                                  | Edit one file | next deploy                  |
| Founder story, café story, page text                                               | `content/story.ts`, `content/home.ts`, `content/baatein.ts` | Edit one file | next deploy                  |

The menu and events live in one Google Sheet (two tabs); the website reads it.

> Until the sheet is connected, the site shows the built-in **sample** menu
> (`content/menu.ts`) and **sample** events (`content/events.ts`). Every
> sample item, event and photo is listed in the build's placeholder report
> until it is replaced.

**Sections:** 1 Setup · 2 Menu changes · 3 Menu columns · 4 Photos · 5 Events

---

## 1. One-time setup (about 15 minutes)

1. Open [Google Sheets](https://sheets.google.com) and create a blank sheet named **NUKKAD Website**.
2. Rename the first tab **Menu**. **File → Import → Upload**
   `content/menu-sheet-template.csv` and choose **Replace current sheet**.
3. Add a second tab named **Events**. With it selected, **File → Import → Upload**
   `content/events-sheet-template.csv` and choose **Replace current sheet**.
4. **File → Share → Publish to web**. Publish the **Menu** tab as
   **Comma-separated values (.csv)** and copy the link; then do the same for
   the **Events** tab. You get two links ending in `output=csv`.
5. Give both links to whoever deploys the website, to set in the hosting
   settings (and `.env.local` for local builds):
   - `NEXT_PUBLIC_MENU_SHEET_CSV_URL` — the Menu tab link
   - `NEXT_PUBLIC_EVENTS_SHEET_CSV_URL` — the Events tab link

The published links are read-only and public — which is fine, because the
menu and events are public anyway. **Never put anything private in this
sheet** (no phone numbers of guests, no personal notes).

## 2. Day-to-day changes

| To…                               | Do this in the sheet                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| Change a price                    | Edit the **price** cell (`30` or `₹30` both work)                                       |
| Mark something sold out for today | Set **status** to `sold-out` (or `Sold Out`)                                            |
| Hide something completely         | Set **status** to `hidden`                                                              |
| Bring it back                     | Set **status** to `available` (or leave it empty)                                       |
| Add a product                     | Add a row (copy an existing row in the same category)                                   |
| Feature it on the home page       | Put `yes` in **featured** (the home page shows six of these)                            |
| Highlight it                      | **highlights**: `signature`, `bestseller`, `new`, `spicy`, `seasonal` (comma-separated) |
| Add Malayalam                     | Fill the `_ml` columns; empty ones fall back to English                                 |
| Remove the "sample" marker        | Clear the **sample** cell once the item is real                                         |

**Sold Out vs hidden:** `sold-out` keeps the product on the menu with a
"Sold Out" stamp (good for "back tomorrow"); `hidden` removes it from the
site entirely (good for seasonal or discontinued items).

### When do changes appear?

- **Prices and Sold Out / hidden** show on the menu and home page within a
  few minutes (Google refreshes published sheets roughly every 5 minutes).
- Search engines and visitors without JavaScript see the menu as of the
  **last site build**, so ask for a rebuild after big changes (new products,
  new photos).

### If something is wrong in the sheet

The website never breaks because of a typo. It keeps showing the last good
menu and the build lists each problem with its **row number**, e.g.
`Row 7: price "thirty" is not a number`.

## 3. Columns

Only `category_id`, `name_en` and `price` are required. Category details
(`category_en`, `category_ml`, `category_description_*`,
`category_illustration`) only need filling on the **first row** of each
category.

| Column                | Example                     | Notes                                                        |
| --------------------- | --------------------------- | ------------------------------------------------------------ |
| category_id           | `chai-coffee`               | lowercase-with-dashes; same for every row in the category    |
| category_en / _ml     | `Chai & Coffee`             |                                                              |
| category_illustration | `chai`                      | `chai`, `samosa`, `jalebi`, `bun-maska`, `pakora`            |
| id                    | `masala-chai`               | unique; created from the name if left empty                  |
| name_en / name_ml     | `Masala Chai`               |                                                              |
| description_en / _ml  | `Ginger, cardamom, clove…`  | one line, shown on the board                                 |
| details_en / _ml      | longer text                 | shown when a visitor taps the item                           |
| price                 | `30`                        | whole rupees                                                 |
| diet                  | `veg`                       | optional: `veg`, `vegan`, `egg`, `nonveg`                    |
| highlights            | `signature, bestseller`     | optional                                                     |
| status                | `available`                 | `available`, `sold-out`, `hidden`                            |
| featured              | `yes`                       | home page rotation                                           |
| photo                 | `masala-chai`               | a photo name (see below) **or** a full `https://` image link |
| photo_alt_en / _ml    | `Chai poured into tumblers` | describe the photo (for blind visitors and Google)           |
| illustration          | `bun-maska`                 | drawing used when there's no photo                           |
| sample                | `yes`                       | marks sample content                                         |

## 4. Photos

**Easiest:** put the photo file in the project's `photos/menu/` folder,
named after the product — e.g. `photos/menu/masala-chai.jpg` — and write
`masala-chai` in the **photo** column. On the next build the site makes
small and large web versions automatically and removes hidden phone data
(like GPS location). A real photo automatically replaces the sample one
with the same name.

Tips for good menu photos: daylight or warm light, the dish filling the
frame, a plain or wooden background, landscape or square, at least
1200 px wide.

**Alternative:** any public `https://` image link in the **photo** column
also works (it is used as-is, so keep it small).

When all sample photos are replaced, delete the `photos/menu/sample/`
folder.

---

## 5. Events (the **Events** tab)

One row per event. There is **no online registration or seat booking** —
every event shows a **Call to enquire** button, and people simply walk in.

| To…                       | Do this in the Events tab                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Create an event           | Add a row                                                                                             |
| Edit an event             | Change its cells                                                                                      |
| Change the date or time   | Edit **date** / **start** / **end**                                                                   |
| Unpublish (keep it saved) | Set **status** to `draft`                                                                             |
| Publish                   | Set **status** to `published` (or leave it empty)                                                     |
| Delete an event           | Delete the row                                                                                        |
| Add a photo               | Put the photo in `photos/events/` and write its name in **photo** (or paste an `https://` image link) |

Past events disappear from the website automatically — no need to delete
them (though you can).

**About drafts:** `draft` keeps an event off the website, but the published
sheet link itself contains every row. Don't write anything in a draft that
you wouldn't want seen — keep private plans outside this sheet.

**Your storytelling sessions:** set **type** to `storytelling` and choose a
**theme**: `beyond-the-uniform`, `stories-of-the-sea` or `stories-over-chai`
(you can also type the theme's name, e.g. _Stories of the Sea_). You choose
the topic — visitors can't.

**Community events** (proposed by guests or groups and approved by you): set
**type** to `community` and put the organiser's name in **host_en**. Only
add events you've agreed to, and only publish photos of people who have
said yes to being on the website.

### Event columns

| Column               | Example                      | Notes                                              |
| -------------------- | ---------------------------- | -------------------------------------------------- |
| id                   | `stories-of-the-sea-dec`     | unique; made from the title and date if left empty |
| status               | `published`                  | `published` or `draft`                             |
| type                 | `storytelling`               | `storytelling`, `community` or `cafe`              |
| theme                | `stories-of-the-sea`         | storytelling only                                  |
| title_en / title_ml  | `Stories of the Sea`         |                                                    |
| description_en / _ml | one or two sentences         |                                                    |
| date                 | `2026-12-05` or `05/12/2026` | day first, as in India                             |
| start / end          | `18:00` or `6 pm`            | Indian Standard Time; end is optional              |
| host_en / host_ml    | `Trivandrum Book Club`       | community events                                   |
| photo                | `stories-of-the-sea`         | a photo name or an `https://` link                 |
| photo_alt_en / _ml   | `A submarine at sunset`      | describe the photo                                 |
| sample               | `yes`                        | marks sample content                               |

**Tip:** if Google Sheets turns your dates into a different format, select
the **date** column and choose **Format → Number → Plain text**, then type
dates as `2026-12-05`.

As with the menu, mistakes never break the site: the last good events are
kept and the build lists problems by row number, e.g.
`Row 4: theme — storytelling sessions need a theme`.

## 6. Group bookings

Group bookings (10 or more people) and customised menus are handled by
phone only — the website shows a **Call for group booking** button. Nothing
to manage here; just keep the phone number in `content/site.ts` current.

---

## 7. Café details, contact numbers, announcements (content files)

These live in small, clearly commented files in the `content/` folder. You
can edit them **in the browser** on GitHub — no tools needed:

1. Open the project on github.com → `content/` → the file (e.g. `site.ts`).
2. Click the ✏️ pencil (Edit), change the text between the quotes, keep the
   commas and brackets as they are.
3. Click **Commit changes**. The host rebuilds the site automatically
   (about 2 minutes). If you made a mistake, the build stops, the live site
   stays as it was, and the error says exactly which line to fix.

### `content/site.ts`

| To change          | Edit                                 | Example                                                                  |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------ |
| Address            | `address.line1`, `postalCode`        | `line1: { en: "TC 12/345, MG Road" }`                                    |
| Google Maps link   | `mapsUrl` (remove the `//` in front) | `mapsUrl: "https://maps.app.goo.gl/…"`                                   |
| Exact map pin      | `geo`                                | `geo: { lat: 8.5241, lng: 76.9366 }`                                     |
| Opening hours      | `hours`                              | `{ days: ["mon","tue"], open: "08:00", close: "20:00" }` (24-hour)       |
| Phone / WhatsApp   | `phone`, `whatsapp`                  | `"+919876543210"` (no spaces)                                            |
| Instagram          | `social`                             | `{ platform: "instagram", url: "https://www.instagram.com/yourpage" }`   |
| Swiggy / Zomato    | `delivery`                           | `delivery: { swiggy: "https://…", zomato: "https://…" }`                 |
| Announcement strip | `announcement`                       | text, optional link, optional `until: "2027-01-26"` (hides itself after) |
| Group booking text | `groupBooking.note`                  |                                                                          |

Malayalam: add `ml: "…"` next to `en: "…"` (`{ en: "Kerala", ml: "കേരളം" }`).
Without it, the English text is shown on the Malayalam pages.

### `content/location.ts` — the illustrated map

Set `confirmed: true` once the premises are final, replace the landmark
labels, and move pins with `x` / `y` (0–100, left→right, top→bottom).

### Story and page text

`content/story.ts` (founder story — a conversation over chai),
`content/home.ts` (home page), `content/baatein.ts` (Nukkad Ki Baatein page).
Lines containing **PLACEHOLDER** are waiting for your words.

## 8. Voice recordings for the welcome

Record the two greeting lines (see `content/opening.ts` for the exact
words and the recording spec), save them as
`public/audio/welcome-hi.mp3` and `public/audio/welcome-ml.mp3`, and
uncomment the two `voice:` lines in `content/opening.ts`.

## 9. Before launch — the placeholder list

Every build prints a list headed **"placeholder value(s) still in
content/"**. Launch when that list is empty (or only contains things you've
decided to keep).
