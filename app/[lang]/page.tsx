import { OpeningExperience } from "@/components/opening/OpeningExperience";
import { Atmosphere } from "@/components/sections/home/Atmosphere";
import { BaateinPreview } from "@/components/sections/home/BaateinPreview";
import { EventsPreview } from "@/components/sections/home/EventsPreview";
import { MenuPreview } from "@/components/sections/home/MenuPreview";
import { OwnerWelcome } from "@/components/sections/home/OwnerWelcome";
import { SignatureChai } from "@/components/sections/home/SignatureChai";
import { SitAndStay } from "@/components/sections/home/SitAndStay";
import { StoryTeaser } from "@/components/sections/home/StoryTeaser";
import { VisitSection } from "@/components/sections/home/VisitSection";
import { t } from "@/i18n/config";
import { home, opening, ownerCharacter } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";

/** Immersive scrolling home page. Section 11 (footer) comes from the layout. */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      {/* 1 · Cinematic opening */}
      <OpeningExperience
        labels={dict.opening}
        kicker={t(home.hero.kicker, locale)}
        title={t(home.hero.title, locale)}
        subtitle={t(home.hero.subtitle, locale)}
        greetings={opening.greetings}
        translation={t(opening.translation, locale)}
        defaultGreeting={locale === "ml" ? "ml" : "hi"}
        ambience={opening.ambience}
        owner={ownerCharacter}
        nextSectionId="welcome"
      />
      <OwnerWelcome locale={locale} />
      <SitAndStay locale={locale} />
      <SignatureChai locale={locale} />
      <MenuPreview locale={locale} dict={dict} />
      <StoryTeaser locale={locale} dict={dict} />
      <BaateinPreview locale={locale} dict={dict} />
      <EventsPreview locale={locale} dict={dict} />
      <Atmosphere locale={locale} />
      <VisitSection locale={locale} dict={dict} />
    </>
  );
}
