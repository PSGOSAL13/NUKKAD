import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { events, home } from "@/lib/content";

/** 8 · Events preview — informational only, no registration. Hidden when there are no events. */
export function EventsPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.events;
  if (events.length === 0) return null;
  return (
    <section aria-labelledby="events-title" className="bg-ink texture-paper py-20 text-cream">
      <Container>
        <SectionHeading
          id="events-title"
          tone="dark"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl text-cream/90" />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border-2 border-dashed border-yellow p-6">
              <Tag tone="yellow">{t(e.schedule, locale)}</Tag>
              <h3 className="mt-3 text-2xl font-bold">{t(e.title, locale)}</h3>
              <p className="mt-2 text-cream/90">{t(e.description, locale)}</p>
              <p className="mt-3 text-sm font-semibold text-yellow">{dict.common.noRegistration}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
