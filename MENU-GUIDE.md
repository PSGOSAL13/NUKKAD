# Updating the NUKKAD menu — owner's guide

You can change products, prices, photos and availability **without touching
any code**. The menu lives in a Google Sheet; the website reads it.

> Until a sheet is connected, the site shows the built-in **sample** menu
> (`content/menu.ts`). Every sample item and sample photo is listed in the
> build's placeholder report until it is replaced.

---

## 1. One-time setup (about 10 minutes)

1. Open [Google Sheets](https://sheets.google.com) and create a blank sheet named **NUKKAD Menu**.
2. **File → Import → Upload** the file `content/menu-sheet-template.csv` from this
   project, and choose **Replace current sheet**. You now have the sample menu in
   the right layout.
3. **File → Share → Publish to web** → choose the sheet tab, format
   **Comma-separated values (.csv)** → **Publish**. Copy the link it gives you
   (it ends with `output=csv`).
4. Give that link to whoever deploys the website, to set as
   `NEXT_PUBLIC_MENU_SHEET_CSV_URL` in the hosting settings (and in
   `.env.local` for local builds). That's it.

The published link is read-only and public — which is fine, because the menu
is public anyway. Never put anything private in this sheet.

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
