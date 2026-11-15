import { Baloo_2, Baloo_Chettan_2, Mukta, Noto_Sans_Malayalam, Yatra_One } from "next/font/google";
import type { Locale } from "@/i18n/config";

/**
 * Brand typefaces (all SIL Open Font License, self-hosted at build time —
 * no requests to Google from visitors' browsers).
 *
 *  Display  Yatra One         hand-painted signboard lettering (also the logo font)
 *  Heading  Baloo 2           warm, rounded; Baloo Chettan 2 for Malayalam (same family, by Ek Type)
 *  Body     Mukta             clear and friendly; Noto Sans Malayalam for Malayalam
 *
 * Only the Latin subset is preloaded; Devanagari/Malayalam glyph files are
 * fetched on demand via unicode-range when a page actually uses them.
 */
const yatra = Yatra_One({ weight: "400", subsets: ["latin"], variable: "--font-yatra", display: "swap" });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", display: "swap" });
const mukta = Mukta({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mukta",
  display: "swap",
});
const balooChettan = Baloo_Chettan_2({
  subsets: ["malayalam"],
  variable: "--font-baloo-chettan",
  display: "swap",
});
const notoMl = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--font-noto-ml", display: "swap" });

const shared = [yatra, baloo, mukta];
const perLocale: Record<Locale, (typeof shared)[number][]> = {
  en: shared,
  ml: [...shared, balooChettan, notoMl],
};

/** className for <html> that exposes the font CSS variables used by this locale. */
export function fontVariables(locale: Locale): string {
  return perLocale[locale].map((f) => f.variable).join(" ");
}
