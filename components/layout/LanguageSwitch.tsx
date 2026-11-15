"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { LOCALE_STORAGE_KEY, localeMeta, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * "English | മലയാളം" — always visible. Links to the same page in the other
 * language and remembers the choice for the next visit (see app/(root)/page.tsx).
 */
export function LanguageSwitch({
  current,
  label,
  className,
}: {
  current: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname() ?? `/${current}/`;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  function remember(locale: Locale) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Storage blocked (private mode etc.) — the switch still works, it just won't be remembered.
    }
  }

  return (
    <nav
      aria-label={label}
      className={cn("flex items-center font-heading text-[0.8rem] font-semibold sm:text-sm", className)}
    >
      {locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5 text-ink-muted">
              |
            </span>
          )}
          <Link
            href={`/${locale}${rest || "/"}`}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            onClick={() => remember(locale)}
            className={cn(
              "rounded-sm px-1 py-1",
              locale === current ? "hand-underline text-red" : "text-ink-muted hover:text-red",
            )}
          >
            {localeMeta[locale].nativeLabel}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
