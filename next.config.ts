import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
