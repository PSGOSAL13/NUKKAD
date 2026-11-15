import type { Metadata } from "next";
import { LocationMap } from "@/components/sections/LocationMap";
import { Address, ContactActions, HoursList, SeatingPolicy } from "@/components/sections/VisitDetails";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n/config";
import { home, site } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/location">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return {
    title: dict.pages.locationTitle,
    description: `${t(site.address.city, locale)}, ${t(site.address.state, locale)}`,
    alternates: alternatesFor(locale, "location/"),
  };
}

export default async function LocationPage({ params }: PageProps<"/[lang]/location">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <PageHeader eyebrow={t(home.location.title, locale)} title={dict.pages.locationTitle} />
      <Container className="grid items-start gap-12 py-14 lg:grid-cols-[1.4fr_1fr]">
        <LocationMap locale={locale} dict={dict} />
        <div className="space-y-8 text-lg">
          <section aria-labelledby="address-title">
            <h2 id="address-title" className="text-2xl font-bold">
              {dict.common.address}
            </h2>
            <div className="mt-2">
              <Address locale={locale} />
            </div>
          </section>
          <section aria-labelledby="hours-title">
            <h2 id="hours-title" className="text-2xl font-bold">
              {dict.common.hours}
            </h2>
            <div className="mt-2 max-w-sm">
              <HoursList locale={locale} dict={dict} />
            </div>
          </section>
          <ContactActions dict={dict} directions />
        </div>
      </Container>
      {site.geo && (
        <Container className="pb-10">
          <div className="aspect-[16/7] overflow-hidden rounded-lg border-2 border-ink shadow-print">
            {/* Keyless Google Maps embed — no API key to leak or pay for. */}
            <iframe
              title={dict.pages.locationTitle}
              src={`https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full"
            />
          </div>
        </Container>
      )}
      <Container className="pb-16">
        <SeatingPolicy locale={locale} dict={dict} />
      </Container>
    </>
  );
}
