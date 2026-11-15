import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t } from "@/i18n/config";
import { story } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";

export async function generateMetadata({ params }: PageProps<"/[lang]/our-story">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return { title: dict.nav.story, description: t(story.intro.body[0], locale) };
}

export default async function StoryPage({ params }: PageProps<"/[lang]/our-story">) {
  const { locale } = await resolveLocale(params);
  const i = story.intro;
  return (
    <>
      <PageHeader
        eyebrow={i.eyebrow && t(i.eyebrow, locale)}
        title={t(i.title, locale)}
        intro={<Paragraphs items={i.body} locale={locale} className="text-xl" />}
      />
      <Container width="prose" className="space-y-14 py-16">
        {story.chapters.map((c, n) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`}>
            <p
              className="font-display text-5xl text-yellow [-webkit-text-stroke:1.5px_var(--color-ink)]"
              aria-hidden="true"
            >
              {String(n + 1).padStart(2, "0")}
            </p>
            <h2 id={`${c.id}-title`} className="mt-1 text-3xl font-bold">
              {t(c.title, locale)}
            </h2>
            <Paragraphs items={c.body} locale={locale} className="mt-4" />
          </section>
        ))}
      </Container>
    </>
  );
}
