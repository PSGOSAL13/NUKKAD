import { RotatingMenuPreview } from "@/components/menu/RotatingMenuPreview";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { featuredMenuItems, home } from "@/lib/content";
import { toMenuItemView } from "@/lib/menu-view";
import { href } from "@/lib/routes";

/** 5 · Rotating six-item menu preview (items marked `featured` in content/menu.ts). */
export function MenuPreview({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = home.menuPreview;
  if (featuredMenuItems.length === 0) return null;
  return (
    <section aria-labelledby="menu-preview-title" className="py-20">
      <Container>
        <SectionHeading
          id="menu-preview-title"
          eyebrow={s.eyebrow && t(s.eyebrow, locale)}
          title={t(s.title, locale)}
        />
        <Paragraphs items={s.body} locale={locale} className="mt-4 max-w-2xl" />
        <div className="mt-10">
          <RotatingMenuPreview
            items={featuredMenuItems.map((i) => toMenuItemView(i, locale, dict))}
            pauseLabel={dict.common.pauseRotation}
            playLabel={dict.common.playRotation}
          />
        </div>
        <div className="mt-10">
          <Button href={href(locale, "menu")} variant="secondary" size="lg">
            {dict.common.viewFullMenu}
          </Button>
        </div>
      </Container>
    </section>
  );
}
