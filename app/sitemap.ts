import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** sitemap.xml — every public page in both languages, with language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((r) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}/${r.path}`,
      changeFrequency: r.key === "menu" || r.key === "baatein" ? "weekly" : "monthly",
      priority: r.key === "home" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/${r.path}`])) },
    })),
  );
}
