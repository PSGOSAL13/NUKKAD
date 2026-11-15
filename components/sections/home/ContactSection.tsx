import { ContactActions, SeatingPolicy } from "@/components/sections/VisitDetails";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home } from "@/lib/content";

/** 8 · Contact: big Call and WhatsApp buttons, plus seating / group-booking policy. */
export function ContactSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.contact;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 border-t border-cream-dark bg-paper texture-paper py-20 sm:py-24"
    >
      <Container width="prose" className="text-center">
        <SectionHeading
          id="contact-title"
          align="center"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4" />
        <ContactActions dict={dict} size="lg" className="mt-8 flex flex-wrap justify-center gap-4" />
        <div className="mt-12 text-left">
          <SeatingPolicy locale={locale} dict={dict} />
        </div>
      </Container>
    </section>
  );
}
