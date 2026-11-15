/**
 * Photo pipeline for the menu and events. Runs automatically before `dev`
 * and `build`.
 *
 *   photos/<collection>/<name>.jpg|jpeg|png|webp|avif   ← drop real photos here
 *   photos/<collection>/sample/<name>.jpg               ← stand-in sample photos
 *
 * collections: menu, events
 *
 * For each photo it writes two optimised WebP files
 *   public/images/<collection>/<name>-480.webp  and  <name>-960.webp
 * and a manifest (content/generated/<collection>-photos.json) the site reads.
 *
 * A real photo always wins over a sample with the same name. EXIF metadata
 * (including phone GPS location) is stripped. Unchanged photos are skipped.
 * In the sheet (or content files) refer to a photo by <name>.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const COLLECTIONS = ["menu", "events"];
const SIZES = [480, 960];
const EXT = /\.(jpe?g|png|webp|avif)$/i;
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const collection of COLLECTIONS) {
  const srcDir = path.join(root, "photos", collection);
  const outDir = path.join(root, "public", "images", collection);
  const manifestPath = path.join(root, "content", "generated", `${collection}-photos.json`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

  /** name → { file, sample } ; real photos override samples. */
  const sources = new Map();
  const add = (dir, sample) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      if (!EXT.test(f)) continue;
      const name = f.replace(EXT, "").toLowerCase();
      if (!NAME.test(name)) {
        console.warn(
          `${collection} photos: skipped "${f}" — use lowercase-words-with-dashes, e.g. masala-chai.jpg`,
        );
        continue;
      }
      if (sample && sources.has(name)) continue;
      sources.set(name, { file: path.join(dir, f), sample });
    }
  };
  add(srcDir, false);
  add(path.join(srcDir, "sample"), true);

  const manifest = {};
  let built = 0;
  for (const [name, { file, sample }] of [...sources].sort()) {
    const srcTime = fs.statSync(file).mtimeMs;
    const outs = SIZES.map((w) => path.join(outDir, `${name}-${w}.webp`));
    const fresh = outs.every((o) => fs.existsSync(o) && fs.statSync(o).mtimeMs >= srcTime);
    if (!fresh) {
      for (const [i, w] of SIZES.entries()) {
        await sharp(file)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 74 })
          .toFile(outs[i]);
      }
      built++;
    }
    const meta = await sharp(outs[1]).metadata();
    manifest[name] = { width: meta.width, height: meta.height, sample };
  }

  // Remove outputs whose source photo was deleted.
  for (const f of fs.readdirSync(outDir)) {
    const name = f.replace(/-(480|960)\.webp$/, "");
    if (!sources.has(name)) fs.rmSync(path.join(outDir, f));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${collection} photos: ${Object.keys(manifest).length} photo(s), ${built} (re)built.`);
}
