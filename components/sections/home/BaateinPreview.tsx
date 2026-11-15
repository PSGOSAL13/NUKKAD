import Link from "next/link";
import { ThemeIllustration } from "@/components/illustrations/ThemeIllustration";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { baatein, home } from "@/lib/content";
import { href } from "@/lib/routes";

/** 5 · Nukkad Ki Baatein — introduces the storytelling themes and community gatherings. */
export function BaateinPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.baatein;
  return (
    <section aria-labelledby="baatein-title" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="baatein-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <p className="mt-3 font-heading text-ink-muted">{t(baatein.storytelling.format, locale)}</p>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {baatein.storytelling.themes.map((theme) => (
            <li key={theme.id}>
              <Link
                href={href(locale, "baatein")}
                className="group block h-full overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-print-sm transition-shadow hover:shadow-print"
              >
                <div className="aspect-[16/9]">
                  <ThemeIllustration kind={theme.id} />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl group-hover:text-red">{t(theme.title, locale)}</h3>
                  <p className="mt-1 text-ink-muted">{t(theme.body, locale)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href={href(locale, "baatein")} variant="ghost">
            {dict.common.allBaatein}
          </Button>
        </div>
      </Container>
    </section>
  );
}
