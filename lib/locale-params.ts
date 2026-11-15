import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/** Resolve the [lang] route param to a supported locale + its dictionary, or 404. */
export async function resolveLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { locale: lang, dict: getDictionary(lang) };
}
