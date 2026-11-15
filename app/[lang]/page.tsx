import { OpeningExperience } from "@/components/opening/OpeningExperience";
import { Atmosphere } from "@/components/sections/home/Atmosphere";
import { BaateinPreview } from "@/components/sections/home/BaateinPreview";
import { ContactSection } from "@/components/sections/home/ContactSection";
import { EventsPreview } from "@/components/sections/home/EventsPreview";
import { LocationSection } from "@/components/sections/home/LocationSection";
import { SignatureExperience } from "@/components/sections/home/SignatureExperience";
import { StorySection } from "@/components/sections/home/StorySection";
import { Welcome } from "@/components/sections/home/Welcome";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { t } from "@/i18n/config";
import { home, opening, ownerCharacter } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";

/**
 * Home: "Somewhere between chai and conversations, you find your people."
 * Footer (logo, hours, contact, street scene) comes from the layout.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <LocalBusinessJsonLd locale={locale} />
      {/* 1 · Welcome: cinematic opening + the owner's welcome */}
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
      <Welcome locale={locale} />
      {/* 2 · Signature experience */}
      <SignatureExperience locale={locale} dict={dict} />
      {/* 3 · Our story */}
      <StorySection locale={locale} dict={dict} />
      {/* 4 · Café atmosphere */}
      <Atmosphere locale={locale} />
      {/* 5 · Nukkad Ki Baatein */}
      <BaateinPreview locale={locale} dict={dict} />
      {/* 6 · Events */}
      <EventsPreview locale={locale} dict={dict} />
      {/* 7 · Location */}
      <LocationSection locale={locale} dict={dict} />
      {/* 8 · Contact */}
      <ContactSection locale={locale} dict={dict} />
    </>
  );
}
