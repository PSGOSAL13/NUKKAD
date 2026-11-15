import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { locales, t } from "@/i18n/config";
import { site } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { resolveLocale } from "@/lib/locale-params";
import "@/styles/globals.css";

// Only /en and /ml exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const name = `${t(site.name, locale)} | ${site.nameDevanagari}`;
  return {
    title: { default: `${name} — ${t(site.tagline, locale)}`, template: `%s · ${name}` },
    description: t(site.description, locale),
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/`])) },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { locale, dict } = await resolveLocale(params);

  return (
    <html lang={locale} className={`${fontVariables(locale)} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md border-2 border-ink bg-yellow px-4 py-2 font-heading font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.common.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
