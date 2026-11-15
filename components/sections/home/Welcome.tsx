import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t, type Locale } from "@/i18n/config";
import { home } from "@/lib/content";

/**
 * 1 · Welcome — continues straight from the cinematic opening (it is the
 * Skip / Continue target, hence id + tabIndex). The feeling line leads.
 */
export function Welcome({ locale }: { locale: Locale }) {
  const w = home.welcome;
  return (
    <section
      id="welcome"
      tabIndex={-1}
      aria-labelledby="welcome-title"
      className="scroll-mt-20 bg-cream texture-paper py-20 outline-none sm:py-24"
    >
      <Container>
        <p className="text-center font-display text-2xl leading-snug text-balance text-red sm:text-4xl">
          “{t(home.feeling, locale)}”
        </p>
        <div aria-hidden="true" className="mx-auto mt-6 flex w-40 items-center gap-3">
          <span className="h-1 flex-1 rounded-full bg-yellow" />
          <span className="size-2.5 rotate-45 bg-red" />
          <span className="h-1 flex-1 rounded-full bg-yellow" />
        </div>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            {w.eyebrow && <p className="font-display text-xl text-red">{t(w.eyebrow, locale)}</p>}
            <p className="mt-1 font-display text-3xl text-ink">{t(w.greeting, locale)}</p>
            <h2 id="welcome-title" className="mt-3 text-3xl leading-tight font-bold sm:text-4xl">
              {t(w.title, locale)}
            </h2>
            <Paragraphs items={w.body} locale={locale} className="mt-4 text-xl" />
          </div>
          <ul className="grid gap-4">
            {w.points.map((p, i) => (
              <li key={i} className="flex gap-4 rounded-lg border-2 border-ink bg-paper p-5 shadow-print-sm">
                <span aria-hidden="true" className="font-display text-3xl leading-none text-red">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{t(p.title, locale)}</h3>
                  <p className="mt-1">{t(p.body, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
