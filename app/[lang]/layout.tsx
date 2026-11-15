import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, t } from "@/i18n/config";
import { site } from "@/lib/content";
import "@/styles/globals.css";

// Only /en, /hi and /ml exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const name = t(site.name, lang);
  return {
    title: { default: `${name} | ${t(site.tagline, lang)}`, template: `%s | ${name}` },
    description: t(site.description, lang),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
