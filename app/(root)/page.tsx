import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale, localeMeta, locales } from "@/i18n/config";

/**
 * A static site has no server to redirect "/" → "/en/", so this page does it
 * with a meta refresh and also shows plain links as a fallback.
 * (Once hosting is chosen, the host can do a proper 301 redirect instead.)
 */
export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: `/${defaultLocale}/` },
};

export default function RootPage() {
  return (
    <main className="p-8">
      <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
      <ul className="flex gap-4">
        {locales.map((l) => (
          <li key={l}>
            <Link href={`/${l}/`} lang={l} className="underline">
              {localeMeta[l].nativeLabel}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
