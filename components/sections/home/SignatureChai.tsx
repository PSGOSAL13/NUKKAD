import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import { home } from "@/lib/content";

/** 4 · Signature chai experience — the boil, the pour, the kulhad. */
export function SignatureChai({ locale }: { locale: Locale }) {
  const s = home.signatureChai;
  return (
    <section aria-labelledby="chai-title" className="bg-red texture-paper py-20 text-cream">
      <Container>
        <SectionHeading
          id="chai-title"
          tone="dark"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {s.ritual.map((step, i) => (
            <li key={i}>
              <span className="font-display text-5xl text-yellow" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-xl font-bold">{t(step.title, locale)}</h3>
              <p className="mt-1 text-cream/90">{t(step.body, locale)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
