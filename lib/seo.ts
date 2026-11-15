import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

/**
 * The site's public address, from NEXT_PUBLIC_SITE_URL (set it in the
 * hosting settings once the domain is known). Used for canonical links,
 * hreflang, the sitemap and social previews.
 */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "") || "https://nukkad.example";
export const siteUrlIsPlaceholder = !process.env.NEXT_PUBLIC_SITE_URL;

/** Canonical + language alternates for a page path relative to the locale root ("" or "menu/"). */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: `/${locale}/${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}/${path}`])),
      "x-default": `/en/${path}`,
    },
  };
}
