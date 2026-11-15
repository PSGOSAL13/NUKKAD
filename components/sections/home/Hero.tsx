import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home } from "@/lib/content";
import { href } from "@/lib/routes";

/**
 * 1 · Cinematic opening.
 * Structural version: the static hero is also the permanent fallback for
 * devices that won't get the 3D street-corner scene (milestone M4).
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = home.hero;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden texture-paper">
      <Container className="grid min-h-[min(calc(100svh-5rem),60rem)] items-center gap-10 py-16 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-display text-2xl text-red sm:text-3xl">{t(h.kicker, locale)}</p>
          <h1
            id="hero-title"
            className="mt-3 font-display text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl"
          >
            {t(h.title, locale)}
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed">{t(h.subtitle, locale)}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={href(locale, "menu")} size="lg">
              {dict.common.viewFullMenu}
            </Button>
            <Button href={href(locale, "location")} variant="outline" size="lg">
              {dict.nav.location}
            </Button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Logo variant="symbol" height={320} decorative priority className="h-56 w-auto sm:h-72 lg:h-80" />
        </div>
      </Container>
    </section>
  );
}
