import type { Metadata } from "next";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Container } from "@/components/ui/Container";
import { DietMark } from "@/components/ui/DietMark";
import { PageHeader } from "@/components/ui/PageHeader";
import { t } from "@/i18n/config";
import { menu } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";
import { toMenuItemView } from "@/lib/menu-view";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">): Promise<Metadata> {
  const { dict } = await resolveLocale(params);
  return { title: dict.pages.menuTitle, description: dict.pages.menuIntro };
}

export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { locale, dict } = await resolveLocale(params);
  const categories = menu
    .map((c) => ({ ...c, items: c.items.filter((i) => i.available) }))
    .filter((c) => c.items.length > 0);

  return (
    <>
      <PageHeader eyebrow="Kya loge?" title={dict.pages.menuTitle} intro={<p>{dict.pages.menuIntro}</p>} />
      <Container className="grid gap-12 py-14 lg:grid-cols-[14rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label={dict.common.jumpTo}>
            <ul className="flex flex-wrap gap-2 font-heading font-semibold lg:flex-col">
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="block rounded-md border-2 border-ink px-3 py-1.5 hover:bg-yellow-soft"
                  >
                    {t(c.name, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ink-muted">{dict.common.dietLegend}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(["veg", "vegan", "egg", "nonveg"] as const).map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <DietMark diet={d} label={dict.diet[d]} />
                  <span aria-hidden="true">{dict.diet[d]}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-14">
          {categories.map((c) => (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-28">
              <h2 id={`${c.id}-title`} className="font-display text-4xl text-red">
                {t(c.name, locale)}
              </h2>
              {c.description && <p className="mt-1 text-lg text-ink-muted">{t(c.description, locale)}</p>}
              <div className="mt-5 rounded-lg border-2 border-ink bg-paper texture-paper px-5 shadow-print sm:px-8">
                {c.items.map((item) => (
                  <MenuItemCard key={item.id} item={toMenuItemView(item, locale, dict)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
