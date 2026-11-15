import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale, LOCALE_STORAGE_KEY, localeMeta, locales } from "@/i18n/config";

/**
 * "/" has no content of its own. On a static site there's no server to
 * redirect, so a tiny inline script sends the visitor to the language they
 * picked last time (stored by the language switch), or English by default.
 * Without JavaScript, a meta refresh goes to English; links are a last resort.
 */
export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: `/${defaultLocale}/` },
};

const supported = JSON.stringify(locales);
const redirectScript = `(function(){var l;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(${supported}.indexOf(l)<0)l=${JSON.stringify(defaultLocale)};location.replace("/"+l+"/"+location.hash)})()`;

export default function RootPage() {
  return (
    <main className="p-8">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
      </noscript>
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
