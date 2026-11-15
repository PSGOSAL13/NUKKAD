import { Button } from "@/components/ui/Button";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/content";
import { formatDays, formatPhone, formatTime, telHref, whatsappHref } from "@/lib/format";

/** Opening hours, from content/site.ts. */
export function HoursList({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <dl className="space-y-1">
      {site.hours.map((h) => (
        <div key={h.days.join()} className="flex flex-wrap justify-between gap-x-4">
          <dt className="font-medium">{formatDays(h.days, dict.days)}</dt>
          <dd className="tabular-nums">
            {formatTime(h.open, locale)} – {formatTime(h.close, locale)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Postal address as structured, copy-friendly text. */
export function Address({ locale }: { locale: Locale }) {
  const a = site.address;
  return (
    <address className="not-italic">
      {t(a.line1, locale)}
      <br />
      {a.line2 && (
        <>
          {t(a.line2, locale)}
          <br />
        </>
      )}
      {t(a.city, locale)}, {t(a.state, locale)} {a.postalCode}
      {site.landmark && <span className="mt-1 block opacity-80">{t(site.landmark, locale)}</span>}
    </address>
  );
}

/** Call / WhatsApp / Directions buttons — only the ones with data in content/site.ts. */
export function ContactActions({ dict, className }: { dict: Dictionary; className?: string }) {
  return (
    <div className={className ?? "flex flex-wrap gap-3"}>
      {site.phone && (
        <Button href={telHref(site.phone)} variant="secondary">
          {dict.common.callUs}
          <span className="sr-only"> {formatPhone(site.phone)}</span>
        </Button>
      )}
      {site.whatsapp && (
        <Button href={whatsappHref(site.whatsapp)} variant="primary">
          {dict.common.whatsappUs}
        </Button>
      )}
      {site.mapsUrl && (
        <Button href={site.mapsUrl} variant="outline">
          {dict.common.directions}
        </Button>
      )}
    </div>
  );
}

/** Walk-in seating + group booking policy. */
export function SeatingPolicy({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-cream-dark bg-paper p-5">
        <h3 className="text-lg font-bold">{dict.common.walkInTitle}</h3>
        <p className="mt-1">{t(site.seating, locale)}</p>
      </div>
      <div className="rounded-lg border border-cream-dark bg-yellow-soft p-5">
        <h3 className="text-lg font-bold">{dict.common.groupBookingTitle}</h3>
        <p className="mt-1">{t(site.groupBooking.note, locale)}</p>
        {site.phone && (
          <a
            href={telHref(site.phone)}
            className="mt-2 inline-block font-semibold text-red underline underline-offset-4"
          >
            {formatPhone(site.phone)}
          </a>
        )}
      </div>
    </div>
  );
}
