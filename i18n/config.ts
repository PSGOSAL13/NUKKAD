/**
 * Supported languages. English is primary; Malayalam is offered for the
 * important sections. Any Malayalam text that is missing falls back to English.
 * (Hindi is used as natural expressions inside the English copy, not as a
 * separate site language.)
 */
export const locales = ["en", "ml"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; nativeLabel: string }> = {
  en: { label: "English", nativeLabel: "English" },
  ml: { label: "Malayalam", nativeLabel: "മലയാളം" },
};

/** localStorage key used to remember the visitor's chosen language. */
export const LOCALE_STORAGE_KEY = "nukkad-lang";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A piece of text in English, optionally Malayalam. */
export type Localized = { en: string; ml?: string };

/** Pick the text for a locale, falling back to English if it is missing. */
export function t(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}

/** True when the text shown for this locale is a fallback, not a translation. */
export function isFallback(value: Localized, locale: Locale): boolean {
  return value[locale] === undefined;
}
