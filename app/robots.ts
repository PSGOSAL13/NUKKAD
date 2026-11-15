import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** robots.txt — everything public except the internal style guide. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/en/brand/", "/ml/brand/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
