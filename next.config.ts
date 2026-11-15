import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { baateinData } from "./content/baatein";
import { eventsData } from "./content/events";
import { galleryData } from "./content/gallery";
import { homeData } from "./content/home";
import { locationData } from "./content/location";
import { menuData } from "./content/menu";
import { openingData } from "./content/opening";
import { siteData } from "./content/site";
import { storyData } from "./content/story";
import { printPlaceholderReport } from "./lib/placeholder-report";

const nextConfig = (phase: string): NextConfig => {
  // Once per build: list any content still marked as a placeholder.
  if (phase === PHASE_PRODUCTION_BUILD) {
    const generated = (f: string) => {
      const p = path.join(process.cwd(), "content", "generated", f);
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : undefined;
    };
    const sheetMenu = generated("menu-from-sheet.json");
    const sheetEvents = generated("events-from-sheet.json");
    printPlaceholderReport({
      site: siteData,
      ...(sheetMenu ? { "generated/menu-from-sheet (Google Sheet)": sheetMenu } : { menu: menuData }),
      "generated/menu-photos": generated("menu-photos.json"),
      ...(sheetEvents
        ? { "generated/events-from-sheet (Google Sheet)": sheetEvents }
        : { events: eventsData }),
      "generated/events-photos": generated("events-photos.json"),
      home: homeData,
      story: storyData,
      location: locationData,
      baatein: baateinData,
      gallery: galleryData,
      opening: openingData,
    });
  }
  return config;
};

const config: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to /out,
  // deployable to any static host / CDN. No server, no runtime secrets.
  output: "export",
  // Emit /menu/index.html instead of /menu.html — works on every static host.
  trailingSlash: true,
  // The default image optimizer needs a server. Images will be pre-optimised
  // at build time by scripts/optimize-images (milestone M2).
  images: { unoptimized: true },
  // cacheComponents is intentionally off: it targets server-rendered caching,
  // which a fully static export does not use, and it forbids `dynamicParams`.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
