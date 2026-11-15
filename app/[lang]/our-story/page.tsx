import type { Metadata } from "next";
import { FounderPortrait } from "@/components/illustrations/FounderPortrait";
import { Conversation } from "@/components/story/Conversation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t } from "@/i18n/config";
import { ownerCharacter, story } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/our-story">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return {
    title: dict.nav.story,
    description: t(story.intro.body[0], locale),
    alternates: alternatesFor(locale, "our-story/"),
  };
}

/** Our Story: the founder's story as a full conversation over chai. */
export default async function StoryPage({ params }: PageProps<"/[lang]/our-story">) {
  const { locale, dict } = await resolveLocale(params);
  const i = story.intro;
  const name = t(story.founder.name, locale);
  return (
    <>
      <PageHeader
        eyebrow={i.eyebrow && t(i.eyebrow, locale)}
        title={t(i.title, locale)}
        intro={<Paragraphs items={i.body} locale={locale} className="text-xl" />}
      />
      <Container className="grid items-start gap-12 py-16 lg:grid-cols-[20rem_1fr]">
        <div className="mx-auto w-full max-w-xs lg:sticky lg:top-28">
          <FounderPortrait owner={ownerCharacter} label={dict.common.founderPortrait} />
          <p className="mt-4 text-center font-display text-2xl text-red">{name}</p>
          <p className="text-center text-ink-muted">{t(story.founder.role, locale)}</p>
        </div>
        <Conversation exchanges={story.conversation} founderName={name} locale={locale} dict={dict} />
      </Container>
    </>
  );
}
