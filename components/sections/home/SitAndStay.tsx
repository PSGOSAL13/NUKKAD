import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import { home } from "@/lib/content";

/** 3 · Come, Sit & Stay. */
export function SitAndStay({ locale }: { locale: Locale }) {
  const s = home.sitAndStay;
  return (
    <section aria-labelledby="sit-title" className="bg-yellow-soft texture-paper py-20">
      <Container>
        <SectionHeading
          id="sit-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {s.points.map((p, i) => (
            <li key={i} className="rounded-lg border-2 border-ink bg-paper p-6 shadow-print-sm">
              <h3 className="text-xl font-bold">{t(p.title, locale)}</h3>
              <p className="mt-2">{t(p.body, locale)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
