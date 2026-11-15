import type { Metadata } from "next";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { Container } from "@/components/ui/Container";
import { DietMark } from "@/components/ui/DietMark";
import { PageHeader } from "@/components/ui/PageHeader";
import { menu } from "@/lib/content";
import { menuLabels } from "@/lib/menu-shared";
import { resolveLocale } from "@/lib/locale-params";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">): Promise<Metadata> {
  const { dict } = await resolveLocale(params);
  return { title: dict.pages.menuTitle, description: dict.pages.menuIntro };
}

/** The full menu: a street-stall board with interactive categories and item details. */
export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { locale, dict } = await resolveLocale(params);
  const usedDiets = [
    ...new Set(
      menu.flatMap((c) => c.items.flatMap((i) => (i.diet && i.status !== "hidden" ? [i.diet] : []))),
    ),
  ];
  return (
    <>
      <PageHeader eyebrow="Kya loge?" title={dict.pages.menuTitle} intro={<p>{dict.pages.menuIntro}</p>} />
      <Container width="wide" className="py-14">
        <MenuBoard initialMenu={menu} locale={locale} labels={menuLabels(dict)} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-muted">
          {usedDiets.length > 0 && (
            <div>
              <h2 className="sr-only">{dict.common.dietLegend}</h2>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {usedDiets.map((d) => (
                  <li key={d} className="flex items-center gap-1.5">
                    <DietMark diet={d} label={dict.diet[d]} />
                    <span aria-hidden="true">{dict.diet[d]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p>
            {dict.menu.allPricesNote} {dict.menu.menuOnlyNote}
          </p>
        </div>
      </Container>
    </>
  );
}
