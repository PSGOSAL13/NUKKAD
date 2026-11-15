import { SceneIllustration } from "@/components/illustrations/SceneIllustration";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { gallery, home } from "@/lib/content";

/**
 * 4 · Café atmosphere: photographs where they exist, illustrations otherwise.
 * A loose, pinned-to-the-wall layout with slight tilts.
 */
export function Atmosphere({ locale }: { locale: Locale }) {
  const s = home.atmosphere;
  if (gallery.length === 0) return null;
  const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-1", "-rotate-2"];
  return (
    <section aria-labelledby="atmosphere-title" className="bg-yellow-soft texture-paper py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="atmosphere-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <li key={g.id}>
              <figure
                className={cn(
                  "border-ink bg-paper p-2.5 pb-3 shadow-print transition-transform motion-safe:hover:rotate-0",
                  tilts[i % tilts.length],
                )}
              >
                <div className="aspect-[4/5] overflow-hidden border border-ink/20">
                  {g.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised at build time
                    <img
                      src={g.src}
                      alt={t(g.alt, locale)}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div role="img" aria-label={t(g.alt, locale)} className="size-full">
                      <SceneIllustration kind={g.illustration} />
                    </div>
                  )}
                </div>
                {g.caption && (
                  <figcaption className="mt-2 text-center font-display text-lg text-red">
                    {t(g.caption, locale)}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
