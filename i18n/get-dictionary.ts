import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { ml } from "./dictionaries/ml";

const dictionaries: Record<Locale, Dictionary> = { en, ml };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
