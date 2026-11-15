import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { baatein, home } from "@/lib/content";
import { href } from "@/lib/routes";

/** 7 · Nukkad Ki Baatein — latest three entries. */
export function BaateinPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.baatein;
  if (baatein.entries.length === 0) return null;
  return (
    <section aria-labelledby="baatein-title" className="py-20">
      <Container>
        <SectionHeading
          id="baatein-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {baatein.entries.slice(0, 3).map((e) => (
            <li key={e.id}>
              <Link
                href={href(locale, "baatein", e.id)}
                className="group block h-full rounded-lg border-2 border-ink bg-paper p-6 shadow-print-sm transition-shadow hover:shadow-print"
              >
                <h3 className="text-xl font-bold group-hover:text-red">{t(e.title, locale)}</h3>
                <p className="mt-2 text-ink-muted">{t(e.excerpt, locale)}</p>
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
