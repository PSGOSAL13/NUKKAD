import { buttonClasses } from "@/components/ui/Button";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { baatein, site } from "@/lib/content";
import { formatPhone, telHref } from "@/lib/format";

/** Group bookings (10+): call the owner; custom menus discussed by phone. No online booking. */
export function GroupBookingPanel({ locale, dict, id }: { locale: Locale; dict: Dictionary; id?: string }) {
  const g = baatein.groupBooking;
  return (
    <section
      id={id}
      aria-labelledby="group-booking-title"
      className="scroll-mt-28 rounded-2xl border-2 border-ink bg-red texture-paper p-6 text-cream shadow-print-lg sm:p-10"
    >
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          {g.eyebrow && <p className="font-display text-xl text-yellow">{t(g.eyebrow, locale)}</p>}
          <h2 id="group-booking-title" className="mt-1 text-3xl font-bold sm:text-4xl">
            {t(g.title, locale)}
          </h2>
          <Paragraphs items={g.body} locale={locale} className="mt-3 text-cream/90" />
          <p className="mt-4 rounded-md border-l-4 border-yellow bg-cream/10 px-4 py-2">
            {t(g.customMenus, locale)}
          </p>
        </div>
        <div className="text-center">
          <a href={telHref(site.phone)} className={buttonClasses({ size: "lg" })}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
            </svg>
            {dict.events.callForGroupBooking}
          </a>
          <p className="mt-3 font-heading text-lg text-cream/90 tabular-nums">{formatPhone(site.phone)}</p>
        </div>
      </div>
    </section>
  );
}
