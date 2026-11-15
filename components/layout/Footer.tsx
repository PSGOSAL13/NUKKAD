import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Address, HoursList } from "@/components/sections/VisitDetails";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/content";
import { formatPhone, telHref, whatsappHref } from "@/lib/format";
import { href, routes } from "@/lib/routes";

/**
 * Vintage footer: awning edge, deep-red "shop front" panel.
 * (Illustrated street-scene artwork is added once illustrations exist.)
 */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-red texture-paper text-cream">
      <div
        aria-hidden="true"
        className="h-7 border-t-4 border-red-dark texture-awning [--awning-a:var(--color-yellow)] [--awning-b:var(--color-cream)]"
      />
      <div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Logo variant="primary" tone="reverse" height={150} />
            <p className="mt-4 font-display text-xl text-yellow">{t(site.tagline, locale)}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-yellow">{dict.common.hours}</h2>
            <div className="mt-3">
              <HoursList locale={locale} dict={dict} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-yellow">{dict.common.address}</h2>
            <div className="mt-3">
              <Address locale={locale} />
            </div>
            <ul className="mt-4 space-y-1">
              {site.phone && (
                <li>
                  <a className="underline underline-offset-4" href={telHref(site.phone)}>
                    {formatPhone(site.phone)}
                  </a>
                </li>
              )}
              {site.whatsapp && (
                <li>
                  <a
                    className="underline underline-offset-4"
                    href={whatsappHref(site.whatsapp)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {dict.common.whatsappUs}
                  </a>
                </li>
              )}
              {site.social.map((s) => (
                <li key={s.url}>
                  <a
                    className="capitalize underline underline-offset-4"
                    href={s.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={dict.common.mainNavigation}>
            <ul className="space-y-2 font-heading font-semibold">
              {routes.map((r) => (
                <li key={r.key}>
                  <Link href={href(locale, r.key)} className="hover:text-yellow">
                    {dict.nav[r.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-cream/20">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-sm text-cream/80 sm:px-6 lg:px-8">
            <p>
              © {year} {t(site.name, locale)} | {site.nameDevanagari}. {dict.footer.rights}
            </p>
            {site.fssaiLicence && (
              <p>
                {dict.footer.fssai} {site.fssaiLicence}
              </p>
            )}
            <p>{dict.footer.madeWith}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
