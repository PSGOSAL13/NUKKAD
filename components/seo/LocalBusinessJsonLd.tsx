import { PLACEHOLDER_VALUES } from "@/content/placeholders";
import { t, type Locale } from "@/i18n/config";
import { site } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

const DAY: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
const isReal = (v?: string) => !!v && !v.includes("PLACEHOLDER") && !PLACEHOLDER_VALUES.includes(v);

/**
 * schema.org CafeOrCoffeeShop data for Google (name, address, hours, phone…).
 * Placeholder values are left out, so Google never sees dummy details.
 */
export function LocalBusinessJsonLd({ locale }: { locale: Locale }) {
  const a = site.address;
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "NUKKAD",
    alternateName: site.nameDevanagari,
    slogan: t(site.tagline, locale),
    description: t(site.description, locale),
    url: `${SITE_URL}/${locale}/`,
    image: `${SITE_URL}/brand/og-image.png`,
    logo: `${SITE_URL}/brand/nukkad-app-icon.svg`,
    servesCuisine: ["North Indian", "Chai", "Indian street food"],
    priceRange: "₹",
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      ...(isReal(a.line1.en) ? { streetAddress: a.line1.en } : {}),
      addressLocality: a.city.en,
      addressRegion: a.state.en,
      ...(isReal(a.line1.en) ? { postalCode: a.postalCode } : {}),
      addressCountry: "IN",
    },
    ...(site.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng } }
      : {}),
    ...(isReal(site.phone) ? { telephone: site.phone } : {}),
    ...(site.mapsUrl ? { hasMap: site.mapsUrl } : {}),
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => DAY[d]),
      opens: h.open,
      closes: h.close,
    })),
    sameAs: site.social.map((s) => s.url).filter(isReal),
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be a raw script; "<" is escaped so content can never close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
