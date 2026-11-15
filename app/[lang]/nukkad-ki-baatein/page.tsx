import type { Metadata } from "next";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { ThemeIllustration } from "@/components/illustrations/ThemeIllustration";
import { GroupBookingPanel } from "@/components/sections/GroupBookingPanel";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t } from "@/i18n/config";
import { baatein, buildNow, publicEvents, site } from "@/lib/content";
import { telHref } from "@/lib/format";
import { resolveLocale } from "@/lib/locale-params";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/nukkad-ki-baatein">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return {
    title: `${dict.nav.baatein} — ${t(baatein.intro.title, locale)}`,
    description: t(baatein.intro.body[0], locale),
  };
}

/**
 * Nukkad Ki Baatein — Stories Beyond Chai.
 * Owner-led storytelling (owner chooses the topic), upcoming events with a
 * calendar, community-hosted gatherings (by phone, owner approval), group
 * bookings by phone, and the café's written chai notes.
 * No registration, seat booking, accounts or forms anywhere.
 */
export default async function BaateinPage({ params }: PageProps<"/[lang]/nukkad-ki-baatein">) {
  const { locale, dict } = await resolveLocale(params);
  const b = baatein;
  return (
    <>
      <PageHeader
        title={
          <>
            {dict.nav.baatein}
            <span className="mt-2 block font-display text-3xl text-red sm:text-4xl">
              — {t(b.intro.title, locale)}
            </span>
          </>
        }
        intro={<Paragraphs items={b.intro.body} locale={locale} className="text-xl" />}
      />

      {/* Owner-led storytelling */}
      <section aria-labelledby="storytelling-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="storytelling-title"
            eyebrow={b.storytelling.eyebrow && t(b.storytelling.eyebrow, locale)}
            title={t(b.storytelling.title, locale)}
          />
          <Paragraphs items={b.storytelling.body} locale={locale} className="mt-4 max-w-2xl" />
          <p className="mt-5 inline-block rounded-full border-2 border-ink bg-yellow px-4 py-1.5 font-heading font-semibold shadow-print-sm">
            {t(b.storytelling.format, locale)}
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {b.storytelling.themes.map((theme) => (
              <li
                key={theme.id}
                className="overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-print"
              >
                <div className="aspect-[4/3]">
                  <ThemeIllustration kind={theme.id} />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl text-red">{t(theme.title, locale)}</h3>
                  <p className="mt-1 text-lg">{t(theme.body, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Calendar + upcoming events */}
      <section
        id="events"
        aria-labelledby="events-title"
        className="scroll-mt-20 bg-yellow-soft texture-paper py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="events-title"
            eyebrow={b.events.eyebrow && t(b.events.eyebrow, locale)}
            title={t(b.events.title, locale)}
          />
          <Paragraphs items={b.events.body} locale={locale} className="mt-4 max-w-2xl" />
          <div className="mt-10">
            <EventsExplorer
              initialEvents={publicEvents}
              buildNow={buildNow}
              locale={locale}
              labels={dict.events}
              phone={site.phone}
            />
          </div>
        </Container>
      </section>

      {/* Community-hosted gatherings */}
      <section aria-labelledby="community-title" className="py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <SectionHeading
              id="community-title"
              eyebrow={b.community.eyebrow && t(b.community.eyebrow, locale)}
              title={t(b.community.title, locale)}
            />
            <Paragraphs items={b.community.body} locale={locale} className="mt-4 max-w-2xl" />
            <ul className="mt-5 flex flex-wrap gap-2">
              {b.community.examples.map((ex, i) => (
                <li key={i} className="rounded-full border border-cream-dark bg-paper px-3 py-1">
                  {t(ex, locale)}
                </li>
              ))}
            </ul>
            <a
              href={telHref(site.phone)}
              className={buttonClasses({ variant: "outline", className: "mt-6" })}
            >
              {dict.events.callToPropose}
            </a>
          </div>
          <div className="hidden aspect-[4/3] overflow-hidden rounded-xl border-2 border-ink shadow-print lg:block">
            <ThemeIllustration kind="community" />
          </div>
        </Container>
      </section>

      {/* Group bookings */}
      <Container className="pb-16">
        <GroupBookingPanel locale={locale} dict={dict} id="group-bookings" />
      </Container>

      {/* Chai notes */}
      {b.notes.entries.length > 0 && (
        <section
          aria-labelledby="notes-title"
          className="border-t border-cream-dark bg-paper texture-paper py-16 sm:py-20"
        >
          <Container width="prose">
            <SectionHeading
              id="notes-title"
              eyebrow={b.notes.eyebrow && t(b.notes.eyebrow, locale)}
              title={t(b.notes.title, locale)}
            />
            <Paragraphs items={b.notes.body} locale={locale} className="mt-4" />
            <div className="mt-8 space-y-8">
              {b.notes.entries.map((e) => (
                <article
                  key={e.id}
                  id={e.id}
                  aria-labelledby={`${e.id}-title`}
                  className="scroll-mt-28 rounded-lg border-2 border-ink bg-cream p-6 shadow-print-sm"
                >
                  <h3 id={`${e.id}-title`} className="text-2xl font-bold">
                    {t(e.title, locale)}
                  </h3>
                  <p className="mt-1 font-display text-lg text-red">{t(e.excerpt, locale)}</p>
                  <Paragraphs items={e.body} locale={locale} className="mt-3" />
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
