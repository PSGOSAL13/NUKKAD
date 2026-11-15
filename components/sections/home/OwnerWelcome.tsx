import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t, type Locale } from "@/i18n/config";
import { home } from "@/lib/content";

/** 2 · Welcome from the owner character. Portrait illustration slots in later. */
export function OwnerWelcome({ locale }: { locale: Locale }) {
  const o = home.owner;
  return (
    <section
      id="welcome"
      tabIndex={-1}
      aria-labelledby="welcome-title"
      className="scroll-mt-20 py-20 outline-none"
    >
      <Container width="prose">
        <figure className="relative rounded-xl border-2 border-ink bg-paper p-8 shadow-print sm:p-10">
          <p id="welcome-title" className="font-display text-3xl text-red sm:text-4xl">
            {t(o.greeting, locale)}
          </p>
          <blockquote className="mt-4">
            <Paragraphs items={o.message} locale={locale} className="text-xl" />
          </blockquote>
          <figcaption className="mt-6 font-heading font-semibold">
            — {t(o.name, locale)}, <span className="font-normal text-ink-muted">{t(o.role, locale)}</span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
