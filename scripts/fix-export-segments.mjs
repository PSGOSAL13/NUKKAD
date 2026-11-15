/**
 * Post-build fix for a Next.js static-export bug on Windows.
 *
 * Next writes per-segment prefetch files named like
 *   out/en/menu/__next.$d$lang.menu.__PAGE__.txt
 * but on Windows the segment path contains backslashes, so it creates
 *   out/en/menu/__next.$d$lang/menu/__PAGE__.txt
 * instead, and the browser's prefetch requests 404. This script flattens
 * those folders into the expected file names. On Linux/macOS (and on CI
 * hosting) there is nothing to fix and it does nothing.
 *
 * Runs automatically after `npm run build` (the "postbuild" script).
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(import.meta.dirname, "..", "out");
let fixed = 0;

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walkFiles(p) : [p];
  });
}

function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of walkFiles(full)) {
        const rel = path.relative(full, file).split(path.sep).join(".");
        fs.copyFileSync(file, path.join(dir, `${entry.name}.${rel}`));
        fixed++;
      }
      fs.rmSync(full, { recursive: true });
    } else {
      visit(full);
    }
  }
}

if (fs.existsSync(outDir)) {
  visit(outDir);
  if (fixed) console.log(`fix-export-segments: flattened ${fixed} prefetch file(s).`);
}
