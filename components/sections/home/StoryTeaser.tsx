import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home } from "@/lib/content";
import { href } from "@/lib/routes";

/** 6 · NUKKAD story teaser → Our Story page. */
export function StoryTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.story;
  return (
    <section
      aria-labelledby="story-title"
      className="border-y border-cream-dark bg-paper texture-paper py-20"
    >
      <Container width="prose" className="text-center">
        <SectionHeading
          id="story-title"
          align="center"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-5" />
        <div className="mt-8">
          <Button href={href(locale, "story")} variant="outline">
            {dict.common.readOurStory}
          </Button>
        </div>
      </Container>
    </section>
  );
}
