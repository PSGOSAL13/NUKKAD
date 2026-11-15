import { FounderPortrait } from "@/components/illustrations/FounderPortrait";
import { Conversation } from "@/components/story/Conversation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home, ownerCharacter, story } from "@/lib/content";
import { href } from "@/lib/routes";

/** 3 · Our story: cartoon founder portrait + the first exchanges of the chai conversation. */
export function StorySection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.story;
  const name = t(story.founder.name, locale);
  return (
    <section aria-labelledby="story-title" className="py-20 sm:py-24">
      <Container className="grid items-start gap-12 lg:grid-cols-[22rem_1fr]">
        <div className="mx-auto w-full max-w-xs lg:sticky lg:top-28">
          <FounderPortrait owner={ownerCharacter} label={dict.common.founderPortrait} />
          <p className="mt-4 text-center font-display text-2xl text-red">{name}</p>
          <p className="text-center text-ink-muted">{t(story.founder.role, locale)}</p>
        </div>
        <div>
          <SectionHeading
            id="story-title"
            eyebrow={s.eyebrow && t(s.eyebrow, locale)}
            title={t(s.title, locale)}
          />
          <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
          <Conversation
            exchanges={story.conversation.slice(0, 3)}
            founderName={name}
            locale={locale}
            dict={dict}
            className="mt-10"
          />
          <div className="mt-10">
            <Button href={href(locale, "story")} variant="outline">
              {dict.common.readFullStory}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
