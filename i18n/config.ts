/**
 * Supported languages. English is the default and the fallback for any
 * content that has not been translated yet.
 */
export const locales = ["en", "hi", "ml"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; nativeLabel: string }> = {
  en: { label: "English", nativeLabel: "English" },
  hi: { label: "Hindi", nativeLabel: "हिन्दी" },
  ml: { label: "Malayalam", nativeLabel: "മലയാളം" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A piece of text in up to three languages. English is required. */
export type Localized = { en: string; hi?: string; ml?: string };

/** Pick the text for a locale, falling back to English if it is missing. */
export function t(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}
