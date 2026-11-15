import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { hi } from "./dictionaries/hi";
import { ml } from "./dictionaries/ml";

const dictionaries: Record<Locale, Dictionary> = { en, hi, ml };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
