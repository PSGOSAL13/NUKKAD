import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import { gallery, home } from "@/lib/content";
import { cn } from "@/lib/cn";

/** 9 · Café atmosphere / gallery. Tiles without a photo show a textured placeholder. */
export function Atmosphere({ locale }: { locale: Locale }) {
  const s = home.gallery;
  if (gallery.length === 0) return null;
  return (
    <section aria-labelledby="atmosphere-title" className="py-20">
      <Container>
        <SectionHeading
          id="atmosphere-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((g, i) => (
            <li key={g.id}>
              <figure>
                <div
                  className={cn(
                    "overflow-hidden rounded-lg border-2 border-ink",
                    i % 2 === 0 ? "aspect-[4/5]" : "aspect-square lg:aspect-[4/5]",
                  )}
                >
                  {g.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- pre-optimised at build (M2)
                    <img
                      src={g.src}
                      alt={t(g.alt, locale)}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={t(g.alt, locale)}
                      className="size-full bg-red-soft texture-halftone text-red/25"
                    />
                  )}
                </div>
                {g.caption && (
                  <figcaption className="mt-2 font-display text-lg text-red">
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
