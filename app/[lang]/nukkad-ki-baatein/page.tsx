import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t } from "@/i18n/config";
import { baatein } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/nukkad-ki-baatein">): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return { title: dict.nav.baatein, description: t(baatein.intro.body[0], locale) };
}

export default async function BaateinPage({ params }: PageProps<"/[lang]/nukkad-ki-baatein">) {
  const { locale } = await resolveLocale(params);
  const i = baatein.intro;
  const dateFmt = new Intl.DateTimeFormat(locale === "ml" ? "ml-IN" : "en-IN", { dateStyle: "long" });
  return (
    <>
      <PageHeader
        eyebrow={i.eyebrow && t(i.eyebrow, locale)}
        title={t(i.title, locale)}
        intro={<Paragraphs items={i.body} locale={locale} className="text-xl" />}
      />
      <Container width="prose" className="space-y-10 py-16">
        {baatein.entries.map((e) => (
          <article
            key={e.id}
            id={e.id}
            aria-labelledby={`${e.id}-title`}
            className="scroll-mt-28 rounded-lg border-2 border-ink bg-paper texture-paper p-6 shadow-print sm:p-8"
          >
            {e.date && (
              <time dateTime={e.date} className="text-sm text-ink-muted">
                {dateFmt.format(new Date(e.date))}
              </time>
            )}
            <h2 id={`${e.id}-title`} className="text-3xl font-bold">
              {t(e.title, locale)}
            </h2>
            <p className="mt-1 font-display text-xl text-red">{t(e.excerpt, locale)}</p>
            <Paragraphs items={e.body} locale={locale} className="mt-4" />
          </article>
        ))}
      </Container>
    </>
  );
}
