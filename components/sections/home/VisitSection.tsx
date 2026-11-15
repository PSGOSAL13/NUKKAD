import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Address, ContactActions, HoursList, SeatingPolicy } from "@/components/sections/VisitDetails";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home } from "@/lib/content";

/** 10 · Location and contact. */
export function VisitSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.visit;
  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-yellow-soft texture-paper py-20">
      <Container>
        <SectionHeading
          id="visit-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">{dict.common.address}</h3>
            <div className="mt-2 text-lg">
              <Address locale={locale} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">{dict.common.hours}</h3>
            <div className="mt-2 text-lg">
              <HoursList locale={locale} dict={dict} />
            </div>
          </div>
        </div>
        <ContactActions dict={dict} className="mt-8 flex flex-wrap gap-3" />
        <div className="mt-10">
          <SeatingPolicy locale={locale} dict={dict} />
        </div>
      </Container>
    </section>
  );
}
