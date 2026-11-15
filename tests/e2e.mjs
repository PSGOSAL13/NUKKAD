/**
 * End-to-end, accessibility and security checks against the production build.
 *
 *   npm run build && npm run test:e2e
 *
 * Uses the Chrome/Edge already installed on this computer (set CHROME_PATH if
 * it isn't found). Serves out/ with the real _headers (CSP etc.) on port 4180,
 * runs every check in a fresh private browser profile, and exits non-zero on
 * any failure.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out");
const PORT = 4180;
const BASE = `http://127.0.0.1:${PORT}`;

// ---------- setup ----------
const chrome =
  process.env.CHROME_PATH ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find((p) => fs.existsSync(p));
if (!chrome) throw new Error("Chrome not found — set CHROME_PATH");
if (!fs.existsSync(path.join(out, "index.html")))
  throw new Error('No build in out/ — run "npm run build" first');

const server = spawn(process.execPath, [path.join(root, "scripts", "serve-out.mjs"), out, String(PORT)], {
  stdio: "pipe",
});
await new Promise((resolve, reject) => {
  server.stdout.on("data", (d) => String(d).includes("Previewing") && resolve());
  server.on("error", reject);
  setTimeout(() => reject(new Error("preview server did not start")), 10000);
});
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run one named check in a fresh private profile; problems = console errors, CSP violations, 4xx/5xx. */
async function check(name, fn, { mobile = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const problems = [];
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("/does-not-exist"))
      problems.push(`HTTP ${r.status()} ${r.url()}`);
  });
  await page.setViewport(
    mobile
      ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { width: 1280, height: 900 },
  );
  const start = Date.now();
  try {
    await fn(page, ctx);
    if (problems.length) throw new Error(problems.slice(0, 5).join(" | "));
    results.push({ name, ok: true, ms: Date.now() - start });
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
  } finally {
    await ctx.close();
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const go = (page, p) => page.goto(BASE + p, { waitUntil: "networkidle0" });
const text = (page, sel) => page.$eval(sel, (e) => e.textContent ?? "");

// ---------- functional ----------
const PAGES = [
  "/en/",
  "/en/menu/",
  "/en/our-story/",
  "/en/nukkad-ki-baatein/",
  "/en/location/",
  "/en/contact/",
];

await check("Every page loads with one h1, no errors, no CSP violations", async (page) => {
  for (const p of [...PAGES, ...PAGES.map((x) => x.replace("/en/", "/ml/"))]) {
    await go(page, p + (p.endsWith("en/") || p.endsWith("ml/") ? "?opening-quality=2d" : ""));
    const h1 = await page.$$eval("h1", (h) => h.length);
    assert(h1 === 1, `${p}: ${h1} h1 elements`);
  }
});

await check("Security headers are served (CSP, nosniff, frame denial, referrer policy)", async () => {
  const r = await fetch(BASE + "/en/");
  for (const h of [
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
  ]) {
    assert(r.headers.get(h), `missing ${h}`);
  }
  assert(
    /frame-ancestors 'none'/.test(r.headers.get("content-security-policy")),
    "CSP lacks frame-ancestors",
  );
  const js = fs.readdirSync(path.join(out, "_next", "static", "chunks"))[0];
  const c = await fetch(`${BASE}/_next/static/chunks/${js}`);
  assert(/immutable/.test(c.headers.get("cache-control") ?? ""), "static chunks not cached immutably");
});

await check("Main navigation reaches every page (desktop)", async (page) => {
  await go(page, "/en/menu/");
  const links = await page.$$eval('header nav[aria-label="Main navigation"] a', (a) =>
    a.map((x) => x.getAttribute("href")),
  );
  assert(links.length === 6, `expected 6 nav links, got ${links.length}`);
  for (const href of links) {
    const r = await fetch(BASE + href);
    assert(r.ok, `${href} → ${r.status}`);
  }
});

await check(
  "Mobile navigation opens, links work, Escape closes",
  async (page) => {
    await go(page, "/en/menu/");
    const btn = await page.$("button[aria-controls][aria-expanded]");
    assert(btn, "no menu button");
    await btn.click();
    assert(
      (await page.$eval("button[aria-controls]", (b) => b.getAttribute("aria-expanded"))) === "true",
      "not expanded",
    );
    const visible = await page.$$eval("[id] ul a", (a) => a.filter((x) => x.offsetParent !== null).length);
    assert(visible >= 6, `only ${visible} links visible`);
    await page.keyboard.press("Escape");
    await sleep(100);
    assert(
      (await page.$eval("button[aria-controls]", (b) => b.getAttribute("aria-expanded"))) === "false",
      "Escape did not close",
    );
  },
  { mobile: true },
);

await check(
  "Language switch keeps the page, and the choice is remembered on the next visit",
  async (page) => {
    await go(page, "/en/menu/");
    await page.click('a[hreflang="ml"]');
    await page.waitForFunction(() => location.pathname === "/ml/menu/");
    assert((await page.evaluate(() => localStorage.getItem("nukkad-lang"))) === "ml", "not stored");
    await page.goto(BASE + "/", { waitUntil: "networkidle0" });
    await page.waitForFunction(() => location.pathname.startsWith("/ml/"), { timeout: 5000 });
    assert(await page.$eval("html", (h) => h.lang === "ml"), "html lang not ml");
  },
);

await check("First visit to / goes to English", async (page) => {
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.waitForFunction(() => location.pathname === "/en/", { timeout: 5000 });
});

await check("Sound is off by default; the choice is remembered after reload", async (page) => {
  await go(page, "/en/?opening-quality=2d");
  const label = () =>
    page.$eval('section[aria-labelledby="opening-title"] button[aria-label*="ound"]', (b) =>
      b.getAttribute("aria-label"),
    );
  assert(/on/i.test(await label()), `expected "Turn sound on", got "${await label()}"`);
  await page.click('section[aria-labelledby="opening-title"] button[aria-label*="ound"]');
  assert(/mute/i.test(await label()), "toggle did not switch");
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(300);
  assert(/mute/i.test(await label()), "sound preference not remembered");
  assert(
    (await page.$$eval("audio", (a) => a.filter((x) => !x.paused).length)) === 0,
    "audio element playing",
  );
});

await check("Welcome greeting: subtitles, Hindi/Malayalam choice remembered", async (page) => {
  await go(page, "/en/?opening-quality=2d");
  assert((await text(page, '[aria-live="polite"] p')).includes("Namaste"), "Hindi subtitle missing");
  await page.click('[role="group"] button[lang="ml"]');
  assert((await text(page, '[aria-live="polite"] p')).includes("നമസ്കാരം"), "Malayalam subtitle missing");
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(300);
  assert(
    (await text(page, '[aria-live="polite"] p')).includes("നമസ്കാരം"),
    "greeting language not remembered",
  );
});

await check("Skip moves to the welcome section", async (page) => {
  await go(page, "/en/?opening-quality=2d");
  await page.click('section[aria-labelledby="opening-title"] a[href="#welcome"]');
  await page.waitForFunction(() => document.activeElement?.id === "welcome", { timeout: 4000 });
});

await check("3D opening: loads, Come Sit & Stay plays the transition, Continue appears", async (page) => {
  await go(page, "/en/?opening-quality=low");
  await page.waitForFunction(() => document.querySelector("canvas")?.closest("div.opacity-100"), {
    timeout: 30000,
  });
  const come = await page.$$("xpath/.//button[contains(., 'Come, Sit')]");
  await come[0].click();
  await page.waitForFunction(
    () => [...document.querySelectorAll("button")].some((b) => b.textContent?.includes("Continue")),
    { timeout: 20000 },
  );
});

await check("3D opening respects reduced motion (cuts straight to the interior)", async (page) => {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await go(page, "/en/?opening-quality=low");
  await page.waitForFunction(() => document.querySelector("canvas")?.closest("div.opacity-100"), {
    timeout: 30000,
  });
  const t0 = Date.now();
  await (await page.$$("xpath/.//button[contains(., 'Come, Sit')]"))[0].click();
  await page.waitForFunction(
    () => [...document.querySelectorAll("button")].some((b) => b.textContent?.includes("Continue")),
    { timeout: 3000 },
  );
  assert(Date.now() - t0 < 3000, "transition not skipped");
});

await check("Without WebGL / with 2D, the illustrated opening still works", async (page) => {
  await go(page, "/en/?opening-quality=2d");
  assert(!(await page.$("canvas")), "canvas should not load in 2D mode");
  assert(await page.$('section[aria-labelledby="opening-title"] svg'), "poster missing");
});

await check(
  "Menu: categories (keyboard), exact prices, Sold Out, hidden items, details dialog",
  async (page) => {
    await go(page, "/en/menu/");
    assert((await page.$$('[role="tab"]')).length === 3, "expected 3 categories");
    const panel = () => page.$eval('[role="tabpanel"]:not([hidden])', (e) => e.innerText);
    assert(/₹\s?\d+/.test(await panel()), "no prices");
    await page.focus('[role="tab"][aria-selected="true"]');
    await page.keyboard.press("End");
    assert(
      (await text(page, '[role="tab"][aria-selected="true"]')).includes("Sweets"),
      "End key did not select last tab",
    );
    const sweets = await panel();
    assert(/Lassi[\s\S]{0,200}Sold Out/i.test(sweets), "Sold Out label missing");
    assert(!sweets.includes("Gulab"), "hidden item is visible");
    await page.click('[role="tabpanel"]:not([hidden]) button');
    assert(await page.$eval("dialog", (d) => d.open), "dialog did not open");
    await page.keyboard.press("Escape");
    await sleep(150);
    assert(!(await page.$eval("dialog", (d) => d.open)), "dialog did not close");
    assert(
      (await page.$$("form:not([method=dialog])")).length === 0,
      "unexpected form (no ordering allowed)",
    );
  },
);

await check("Home: rotating six-item preview shows six available products", async (page) => {
  await go(page, "/en/?opening-quality=2d");
  const n = await page.$$eval('section[aria-labelledby="signature-title"] ul.grid article', (a) => a.length);
  assert(n === 6, `expected 6 preview items, got ${n}`);
});

await check(
  "Events: calendar + list (or the empty message), Call to enquire, no registration",
  async (page) => {
    await go(page, "/en/nukkad-ki-baatein/");
    assert(await page.$('section[aria-label="Event calendar"] table'), "calendar missing");
    const cards = await page.$$("#events article");
    const empty = await page.$eval("#events", (e) => e.innerText.includes("Nothing scheduled"));
    assert(cards.length > 0 || empty, "neither events nor empty message");
    if (cards.length) {
      const tels = await page.$$eval('#events article a[href^="tel:"]', (a) => a.length);
      assert(tels === cards.length, "an event lacks Call to enquire");
    }
    assert((await page.$$("form, input, textarea")).length === 0, "registration-like inputs found");
    assert(await page.$('a[href^="tel:"]'), "group booking call missing");
  },
);

await check("Contact: Call, WhatsApp with pre-filled message, Google Maps directions", async (page) => {
  await go(page, "/en/location/");
  const hrefs = await page.$$eval("main a", (a) => a.map((x) => x.href));
  assert(
    hrefs.some((h) => h.startsWith("tel:+")),
    "no tel: link",
  );
  const wa = hrefs.find((h) => h.startsWith("https://wa.me/"));
  assert(wa && /\?text=.+/.test(wa), "WhatsApp link without pre-filled text");
  const maps = hrefs.find((h) => h.includes("google.com/maps"));
  assert(
    maps &&
      (maps.startsWith("https://www.google.com/maps/dir/?api=1&destination=") ||
        maps.includes("maps.app.goo.gl")),
    "no Maps directions link",
  );
  assert(!maps.includes("PLACEHOLDER"), "placeholder text sent to Google Maps");
});

await check("No admin area, login or upload endpoints exist (owner chose Google Sheets)", async () => {
  for (const p of ["/admin/", "/en/admin/", "/login/", "/api/"]) {
    const r = await fetch(BASE + p);
    assert(r.status === 404, `${p} → ${r.status}`);
  }
});

await check("No secrets in the published files", async () => {
  const bad =
    /(service_role|SUPABASE_SERVICE|PRIVATE KEY|sk_live_|sk_test_|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35})/;
  const walk = (d) =>
    fs
      .readdirSync(d, { withFileTypes: true })
      .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const hits = walk(out)
    .filter((f) => /\.(js|html|txt|json|css)$/.test(f))
    .filter((f) => bad.test(fs.readFileSync(f, "utf8")));
  assert(hits.length === 0, `possible secrets in: ${hits.map((h) => path.relative(out, h)).join(", ")}`);
  const env = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert(/\.env\*/.test(env), ".env files are not git-ignored");
});

// ---------- accessibility ----------
for (const mobile of [true, false]) {
  await check(
    `Accessibility (axe, WCAG 2.2 AA) — ${mobile ? "phone" : "desktop"}, all pages, both languages`,
    async (page) => {
      const found = [];
      for (const p of [...PAGES, ...PAGES.map((x) => x.replace("/en/", "/ml/"))]) {
        await go(page, p + (p.endsWith("en/") || p.endsWith("ml/") ? "?opening-quality=2d" : ""));
        await page.evaluate(axeSource);
        const v = await page.evaluate(() =>
          window.axe
            .run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
              },
            })
            .then((r) => r.violations.map((x) => `${x.id} (${x.nodes.length})`)),
        );
        if (v.length) found.push(`${p}: ${v.join(", ")}`);
      }
      assert(found.length === 0, found.join(" | "));
    },
    { mobile },
  );
}

await check("Keyboard: skip link is first, focus is visible", async (page) => {
  await go(page, "/en/menu/");
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => ({
    href: document.activeElement?.getAttribute("href"),
    outline: getComputedStyle(document.activeElement).outlineStyle,
  }));
  assert(first.href === "#main", `first tab stop is ${first.href}`);
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert(outline !== "none", "no visible focus outline");
});

// ---------- report ----------
await browser.close();
server.kill();
const failed = results.filter((r) => !r.ok);
for (const r of results)
  console.log(
    `${r.ok ? "✓" : "✗"} ${r.name}${r.ok ? ` (${(r.ms / 1000).toFixed(1)}s)` : `\n    → ${r.error}`}`,
  );
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
fs.writeFileSync(
  path.join(root, "tests", "last-run.json"),
  JSON.stringify({ at: new Date().toISOString(), results }, null, 2),
);
process.exit(failed.length ? 1 : 0);
