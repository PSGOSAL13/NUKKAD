import { UpcomingEventsPreview } from "@/components/events/UpcomingEventsPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { buildNow, home, publicEvents, site } from "@/lib/content";
import { href } from "@/lib/routes";

/** 6 · Upcoming community events — the next three, informational only (no registration). */
export function EventsPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.events;
  return (
    <section
      aria-labelledby="events-preview-title"
      className="bg-ink texture-paper py-20 text-cream sm:py-24"
    >
      <Container>
        <SectionHeading
          id="events-preview-title"
          tone="dark"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl text-cream/90" />
        <div className="mt-10">
          <UpcomingEventsPreview
            initialEvents={publicEvents}
            buildNow={buildNow}
            locale={locale}
            labels={dict.events}
            phone={site.phone}
          />
        </div>
        <div className="mt-10">
          <Button href={href(locale, "baatein", "events")} size="lg">
            {dict.events.seeAllEvents}
          </Button>
        </div>
      </Container>
    </section>
  );
}
