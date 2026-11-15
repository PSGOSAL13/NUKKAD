import { Address, ContactActions, HoursList } from "@/components/sections/VisitDetails";
import { LocationMap } from "@/components/sections/LocationMap";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home } from "@/lib/content";

/** 7 · Location: vintage illustrated map, address, hours and a Google Maps directions link. */
export function LocationSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.location;
  return (
    <section id="location" aria-labelledby="location-title" className="scroll-mt-20 py-20 sm:py-24">
      <Container className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
        <LocationMap locale={locale} dict={dict} />
        <div className="space-y-6">
          <SectionHeading
            id="location-title"
            eyebrow={s.eyebrow && t(s.eyebrow, locale)}
            title={t(s.title, locale)}
          />
          <Paragraphs items={s.body} locale={locale} />
          <div className="text-lg">
            <h3 className="font-bold">{dict.common.address}</h3>
            <Address locale={locale} />
          </div>
          <div className="max-w-sm text-lg">
            <h3 className="font-bold">{dict.common.hours}</h3>
            <HoursList locale={locale} dict={dict} />
          </div>
          <ContactActions dict={dict} directions />
        </div>
      </Container>
    </section>
  );
}
