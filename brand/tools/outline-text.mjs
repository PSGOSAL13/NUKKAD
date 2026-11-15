// Usage: node brand/tools/outline-text.mjs <harfbuzzjsDir> <font.ttf> <out.json> "TEXT" ["MORE TEXT" ...]
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const [hbDir, fontPath, out, ...texts] = process.argv.slice(2);
const require = createRequire(path.join(hbDir, "package.json"));
const hb = await require("harfbuzzjs");
const face = hb.createFace(hb.createBlob(fs.readFileSync(fontPath)), 0);
const font = hb.createFont(face);
const result = {};
for (const text of texts) {
  const buf = hb.createBuffer();
  buf.addText(text);
  buf.guessSegmentProperties();
  hb.shape(font, buf);
  const glyphs = buf.json();
  let x = 0,
    d = "";
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const g of glyphs) {
    const ox = x + g.dx,
      oy = g.dy;
    const p = font.glyphToPath(g.g).replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, a, b) => {
      const X = +a + ox,
        Y = -(+b + oy);
      minX = Math.min(minX, X);
      maxX = Math.max(maxX, X);
      minY = Math.min(minY, Y);
      maxY = Math.max(maxY, Y);
      return `${+X.toFixed(1)},${+Y.toFixed(1)}`;
    });
    d += p;
    x += g.ax;
  }
  result[text] = { upem: face.upem, advance: x, bbox: [minX, minY, maxX, maxY], glyphs: glyphs.length, d };
  buf.destroy();
}
fs.writeFileSync(out, JSON.stringify(result, null, 1));
for (const [k, v] of Object.entries(result))
  console.log(k, "glyphs", v.glyphs, "bbox", v.bbox.map(Math.round), "d.length", v.d.length);
