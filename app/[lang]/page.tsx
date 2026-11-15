import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localeMeta, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { menu, site } from "@/lib/content";

/**
 * M0 placeholder home page. It only proves that routing, translations and
 * validated content are wired up. The real design arrives in M1/M2.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-12">
      <nav aria-label={dict.common.language} className="flex gap-4 text-sm">
        {locales.map((l) => (
          <Link
            key={l}
            href={`/${l}/`}
            aria-current={l === lang ? "page" : undefined}
            className="underline aria-[current=page]:font-bold"
          >
            {localeMeta[l].nativeLabel}
          </Link>
        ))}
      </nav>

      <header>
        <h1 className="text-4xl font-bold">
          {site.name.en} | {site.name.hi}
        </h1>
        <p className="mt-2 text-lg">{t(site.tagline, lang)}</p>
      </header>

      <section>
        <h2 className="font-semibold">{dict.common.hours}</h2>
        <ul>
          {site.hours.map((h) => (
            <li key={h.days.join()}>
              {h.days.map((d) => dict.days[d]).join(", ")}: {h.open}–{h.close}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold">{dict.nav.menu}</h2>
        {menu.map((category) => (
          <div key={category.id} className="mt-3">
            <h3 className="font-medium">{t(category.name, lang)}</h3>
            <ul>
              {category.items
                .filter((item) => item.available)
                .map((item) => (
                  <li key={item.id}>
                    {t(item.name, lang)} — ₹{item.price} ({dict.diet[item.diet]})
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
