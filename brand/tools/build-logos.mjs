/**
 * Builds every NUKKAD logo file from one source of truth.
 *
 *   node brand/tools/build-logos.mjs      (or: npm run brand:logos)
 *
 * Inputs : brand/source/wordmarks.json  (Yatra One lettering, pre-outlined
 *          with HarfBuzz by brand/tools/outline-text.mjs — see brand/README.md)
 * Outputs: brand/logo/*.svg             master vector files (print, signage)
 *          brand/logo/png/*.png         raster exports
 *          public/brand/*.svg           copies used by the website
 *          app/icon.svg, app/apple-icon.png, app/favicon.ico
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../..");
const out = (...p) => path.join(root, ...p);
const W = JSON.parse(fs.readFileSync(out("brand/source/wordmarks.json"), "utf8"));

// Devanagari spelling used in the logo. Swap to W.devanagariNukta for "नुक्कड़".
const DEVANAGARI = W.devanagari;

const C = {
  red: "#8F2925",
  redDark: "#72211E",
  yellow: "#E9B83E",
  cream: "#F6EBD3",
  creamDark: "#E5D8BF",
  ink: "#2B1D16",
};

/** Colour schemes. mono-* are true single-colour versions (stamps, embossing, one-colour print). */
const SCHEMES = {
  full: {
    body: C.red,
    rim: C.redDark,
    chai: C.yellow,
    band: C.yellow,
    steam: C.red,
    text: C.red,
    accent: C.yellow,
    sub: C.ink,
  },
  reverse: {
    body: C.cream,
    rim: C.creamDark,
    chai: C.yellow,
    band: C.red,
    steam: C.cream,
    text: C.cream,
    accent: C.yellow,
    sub: C.cream,
  },
  "mono-ink": { mono: C.ink },
  "mono-cream": { mono: C.cream },
};

// ---------- The kulhad mark (drawn in a 120 × 124 box) ----------
const MARK = { x: 24, y: 0, w: 72, h: 124 };
const BODY = "M26 62C27 80 33 104 40 118Q60 125 80 118C87 104 93 80 94 62A34 8 0 0 1 26 62Z";
const BAND = "M30 81Q60 92 90 81";
const STEAM = [
  "M60 50C52 42 68 36 60 27C52 18 66 13 60 5",
  "M44 52C38 45 50 40 44 32C39 26 46 21 43 16",
  "M76 52C70 45 82 40 76 32C71 26 78 21 75 16",
];

let maskId = 0;
function mark(s, { steamWidth = 5 } = {}) {
  const steam = (c) =>
    `<g fill="none" stroke="${c}" stroke-width="${steamWidth}" stroke-linecap="round" stroke-linejoin="round">${STEAM.map((d) => `<path d="${d}"/>`).join("")}</g>`;
  if (s.mono) {
    const id = `nk-knockout-${maskId++}`;
    return (
      `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="130">` +
      `<rect width="120" height="130" fill="#fff"/><ellipse cx="60" cy="62.6" rx="28.5" ry="5.4" fill="#000"/>` +
      `<path d="${BAND}" fill="none" stroke="#000" stroke-width="3.6" stroke-linecap="round"/></mask>` +
      `${steam(s.mono)}<g fill="${s.mono}" mask="url(#${id})"><path d="${BODY}"/><ellipse cx="60" cy="62" rx="34" ry="8"/></g>`
    );
  }
  return (
    `${steam(s.steam)}<path d="${BODY}" fill="${s.body}"/>` +
    `<ellipse cx="60" cy="62" rx="34" ry="8" fill="${s.rim}"/>` +
    `<ellipse cx="60" cy="62.6" rx="28.5" ry="5.4" fill="${s.chai}"/>` +
    `<path d="${BAND}" fill="none" stroke="${s.band}" stroke-width="3.6" stroke-linecap="round"/>`
  );
}
const col = (s, key) => s.mono ?? s[key];

/** Place outlined text so its bbox top-left lands at (x, y), scaled by k. */
function text(word, x, y, k, fill) {
  const [minX, minY] = word.bbox;
  return `<path fill="${fill}" transform="translate(${r(x - minX * k)} ${r(y - minY * k)}) scale(${r(k, 5)})" d="${word.d}"/>`;
}
const size = (word, k) => ({ w: (word.bbox[2] - word.bbox[0]) * k, h: (word.bbox[3] - word.bbox[1]) * k });
const r = (n, d = 2) => +n.toFixed(d);

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
}

// ---------- Compositions ----------

/** Primary logo: stacked — kulhad, NUKKAD, ── नुक्कड ──, optional tagline. */
function primary(s, { tagline = false } = {}) {
  const pad = 24,
    width = 360,
    cx = width / 2;
  const m = 1.3;
  const kL = 300 / (W.latin.bbox[2] - W.latin.bbox[0]);
  const kD = kL * 1.05;
  const kT = 240 / (W.tagline.bbox[2] - W.tagline.bbox[0]);
  let y = pad,
    b = "";

  b += `<g transform="translate(${r(cx - (MARK.x + MARK.w / 2) * m)} ${y}) scale(${m})">${mark(s)}</g>`;
  y += MARK.h * m + 14;

  const L = size(W.latin, kL);
  b += text(W.latin, cx - L.w / 2, y, kL, col(s, "text"));
  y += L.h + 16;

  const D = size(DEVANAGARI, kD);
  b += text(DEVANAGARI, cx - D.w / 2, y, kD, col(s, "text"));
  const ruleY = y + (0 - DEVANAGARI.bbox[1] - 300) * kD; // mid-height of the letter bodies
  const a = col(s, "accent");
  b += `<g stroke="${a}" stroke-width="4" stroke-linecap="round"><path d="M${r(cx - D.w / 2 - 44)} ${r(ruleY)}H${r(cx - D.w / 2 - 14)}"/><path d="M${r(cx + D.w / 2 + 14)} ${r(ruleY)}H${r(cx + D.w / 2 + 44)}"/></g>`;
  y += D.h;

  if (tagline) {
    y += 18;
    const T = size(W.tagline, kT);
    b += text(W.tagline, cx - T.w / 2, y, kT, col(s, "sub"));
    y += T.h;
  }
  return svg(width, y + pad, b, "NUKKAD | नुक्कड — Apna Nukkad. Apne Log.");
}

/** Secondary logo: horizontal — kulhad + NUKKAD | नुक्कड on one line. For headers & narrow signage. */
function secondary(s) {
  const pad = 12;
  const m = 0.66;
  const kL = 42 / 684; // 42px cap height
  const kD = kL * 1.05;
  const L = size(W.latin, kL),
    D = size(DEVANAGARI, kD);
  const markW = MARK.w * m,
    markH = MARK.h * m;
  const baseline = pad + 92 * m + (684 * kL) / 2; // text centred on the kulhad body
  let x = pad,
    b = "";

  b += `<g transform="translate(${r(x - MARK.x * m)} ${pad}) scale(${m})">${mark(s)}</g>`;
  x += markW + 16;
  b += text(W.latin, x, baseline + W.latin.bbox[1] * kL, kL, col(s, "text"));
  x += L.w + 16;
  b += `<rect x="${r(x)}" y="${r(baseline - 684 * kL - 4)}" width="4.5" height="${r(684 * kL + 8)}" rx="2.25" fill="${col(s, "accent")}"/>`;
  x += 4.5 + 16;
  b += text(DEVANAGARI, x, baseline + DEVANAGARI.bbox[1] * kD, kD, col(s, "text"));
  x += D.w + pad;
  const h = Math.max(pad + markH, baseline + DEVANAGARI.bbox[3] * kD) + pad;
  return svg(x, h, b, "NUKKAD | नुक्कड");
}

/** Kulhad symbol on its own. */
function symbol(s) {
  const pad = 6;
  return svg(
    MARK.w + pad * 2,
    MARK.h + pad * 2,
    `<g transform="translate(${pad - MARK.x} ${pad})">${mark(s)}</g>`,
    "NUKKAD kulhad",
  );
}

/** App icon / favicon: kulhad on a deep-red tile, heavier steam so it survives 16 px. */
function appIcon() {
  const S = 512,
    m = 3.25;
  const s = { ...SCHEMES.reverse };
  const tx = S / 2 - (MARK.x + MARK.w / 2) * m,
    ty = (S - MARK.h * m) / 2 + 6;
  return svg(
    S,
    S,
    `<rect width="${S}" height="${S}" rx="112" fill="${C.red}"/><g transform="translate(${r(tx)} ${r(ty)}) scale(${m})">${mark(s, { steamWidth: 7.5 })}</g>`,
    "NUKKAD",
  );
}

// ---------- Write files ----------
const written = [];
function write(rel, data) {
  fs.mkdirSync(path.dirname(out(rel)), { recursive: true });
  fs.writeFileSync(out(rel), data);
  written.push(rel);
}

const files = {};
for (const [name, s] of Object.entries(SCHEMES)) {
  files[`nukkad-primary-${name}.svg`] = primary(s);
  files[`nukkad-primary-tagline-${name}.svg`] = primary(s, { tagline: true });
  files[`nukkad-secondary-${name}.svg`] = secondary(s);
  files[`nukkad-symbol-${name}.svg`] = symbol(s);
}
files["nukkad-app-icon.svg"] = appIcon();

for (const [f, data] of Object.entries(files)) {
  write(`brand/logo/${f}`, data);
  write(`public/brand/${f}`, data);
}
write("app/icon.svg", files["nukkad-app-icon.svg"]);

// Intrinsic sizes for the <Logo> component (prevents layout shift).
const manifest = Object.fromEntries(
  Object.entries(files).map(([f, s]) => {
    const [, w, h] = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    return [f.replace(/\.svg$/, ""), { width: +w, height: +h }];
  }),
);
write(
  "components/brand/logo-manifest.ts",
  `// GENERATED by brand/tools/build-logos.mjs — do not edit.\nexport const logoManifest = ${JSON.stringify(manifest, null, 2)} as const;\n`,
);

async function png(svgText, width) {
  const vbW = +svgText.match(/viewBox="0 0 ([\d.]+)/)[1];
  return sharp(Buffer.from(svgText), { density: Math.min(2400, (72 * width) / vbW) })
    .resize({ width })
    .png()
    .toBuffer();
}

for (const f of [
  "nukkad-primary-full",
  "nukkad-primary-tagline-full",
  "nukkad-primary-reverse",
  "nukkad-secondary-full",
  "nukkad-symbol-full",
  "nukkad-app-icon",
]) {
  write(`brand/logo/png/${f}-2048.png`, await png(files[`${f}.svg`], 2048));
}
write("app/apple-icon.png", await png(files["nukkad-app-icon.svg"], 180));

// favicon.ico with embedded PNGs (16, 32, 48)
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((n) => png(files["nukkad-app-icon.svg"], n)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((p, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(p.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += p.length;
});
write("app/favicon.ico", Buffer.concat([header, ...pngs]));

console.log(`Wrote ${written.length} files.`);
