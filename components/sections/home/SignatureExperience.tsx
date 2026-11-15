import { FoodIllustration } from "@/components/illustrations/FoodIllustration";
import { SoldOutStamp } from "@/components/menu/MenuPhoto";
import { RotatingMenuPreview } from "@/components/menu/RotatingMenuPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { home, menu, signatureItems } from "@/lib/content";
import { formatPrice } from "@/lib/format";
import { menuLabels } from "@/lib/menu-shared";
import { href } from "@/lib/routes";

/** 2 · Signature experience: Masala Chai, Samosa, Jalebi + rotating six-item preview. */
export function SignatureExperience({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.signature;
  return (
    <section aria-labelledby="signature-title" className="bg-red texture-paper py-20 text-cream sm:py-24">
      <Container>
        <SectionHeading
          id="signature-title"
          tone="dark"
          align="center"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs
          items={s.body}
          locale={locale}
          className="mx-auto mt-4 max-w-xl text-center text-cream/90"
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {signatureItems.map(({ item, illustration, note }, i) => (
            <li
              key={item.id}
              className={
                "relative rounded-2xl border-2 border-ink bg-paper p-6 text-center text-ink shadow-print-lg " +
                (i === 1 ? "md:-translate-y-4" : "")
              }
            >
              {item.status === "sold-out" && (
                <SoldOutStamp label={dict.menu.soldOut} className="absolute top-4 right-4 z-10" />
              )}
              <FoodIllustration kind={illustration} className="mx-auto max-w-[180px]" />
              <h3 className="mt-2 font-display text-3xl text-red">{t(item.name, locale)}</h3>
              <p className="mt-2 text-lg">{t(note, locale)}</p>
              <p className="mt-4 inline-block rounded-full border-2 border-ink bg-yellow px-4 py-1 font-heading text-lg font-bold">
                {formatPrice(item.price, locale)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-20">
          <h3 className="text-center font-display text-2xl text-yellow sm:text-3xl">
            {t(s.previewTitle, locale)}
          </h3>
          <div className="mt-8 text-ink">
            <RotatingMenuPreview
              initialMenu={menu}
              locale={locale}
              labels={menuLabels(dict)}
              pauseLabel={dict.common.pauseRotation}
              playLabel={dict.common.playRotation}
              controlClassName="text-cream/80 hover:text-yellow"
            />
          </div>
          <div className="mt-10 text-center">
            <Button href={href(locale, "menu")} size="lg">
              {dict.common.viewFullMenu}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
