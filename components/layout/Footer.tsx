import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { StreetScene } from "@/components/illustrations/StreetScene";
import { DeliveryLinks } from "@/components/sections/DeliveryLinks";
import { Address, HoursList } from "@/components/sections/VisitDetails";
import { buttonClasses } from "@/components/ui/Button";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/content";
import { formatPhone, telHref, whatsappHref } from "@/lib/format";
import { href, routes } from "@/lib/routes";

/** Vintage footer: awning edge, illustrated street scene, and the café's essentials. */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const instagram = site.social.find((s) => s.platform === "instagram");
  return (
    <footer className="mt-auto bg-red texture-paper text-cream">
      <div
        aria-hidden="true"
        className="h-7 border-t-4 border-red-dark texture-awning [--awning-a:var(--color-yellow)] [--awning-b:var(--color-cream)]"
      />
      <StreetScene className="mx-auto mt-4 max-w-6xl px-4 opacity-95" />

      <div className="mx-auto grid max-w-7xl gap-10 border-t border-cream/15 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo variant="primary" tone="reverse" height={140} />
          <p className="mt-4 font-display text-xl text-yellow">{t(site.tagline, locale)}</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-yellow">{dict.common.hours}</h2>
          <div className="mt-3">
            <HoursList locale={locale} dict={dict} />
          </div>
          <h2 className="mt-6 text-lg font-bold text-yellow">{dict.common.address}</h2>
          <div className="mt-3">
            <Address locale={locale} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-yellow">{dict.nav.contact}</h2>
          <div className="mt-3 flex flex-col items-start gap-3">
            <a href={telHref(site.phone)} className={buttonClasses({ size: "sm", className: "bg-cream" })}>
              {dict.common.callUs} · {formatPhone(site.phone)}
            </a>
            <a
              href={whatsappHref(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ size: "sm" })}
            >
              {dict.common.whatsappUs}
            </a>
            {instagram && (
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:text-yellow"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                {dict.common.instagram}
              </a>
            )}
            <DeliveryLinks dict={dict} className="text-sm text-cream/90" />
          </div>
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
    </footer>
  );
}
