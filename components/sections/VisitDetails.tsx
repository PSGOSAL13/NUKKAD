import { Button } from "@/components/ui/Button";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/content";
import { directionsHref, formatDays, formatPhone, formatTime, telHref, whatsappHref } from "@/lib/format";

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

/** Call + WhatsApp buttons (and optionally Get directions). */
export function ContactActions({
  dict,
  directions = false,
  size = "md",
  className,
}: {
  dict: Dictionary;
  directions?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={className ?? "flex flex-wrap gap-3"}>
      <Button href={telHref(site.phone)} variant="secondary" size={size}>
        <PhoneIcon />
        {dict.common.callUs}
        <span className="sr-only"> {formatPhone(site.phone)}</span>
      </Button>
      <Button href={whatsappHref(site.whatsapp, dict.common.whatsappMessage)} variant="primary" size={size}>
        <WhatsAppIcon />
        {dict.common.whatsappUs}
      </Button>
      {directions && (
        <Button href={directionsHref(site)} variant="outline" size={size}>
          <PinIcon />
          {dict.common.directions}
        </Button>
      )}
    </div>
  );
}

const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true } as const;

function PhoneIcon() {
  return (
    <svg {...iconProps} fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path
        d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"
        fill="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** Walk-in seating + group booking policy. */
export function SeatingPolicy({
  locale,
  dict,
  headingLevel = "h3",
}: {
  locale: Locale;
  dict: Dictionary;
  /** Use "h2" where the policy sits directly under the page title. */
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-cream-dark bg-paper p-5">
        <H className="text-lg font-bold">{dict.common.walkInTitle}</H>
        <p className="mt-1">{t(site.seating, locale)}</p>
      </div>
      <div className="rounded-lg border border-cream-dark bg-yellow-soft p-5">
        <H className="text-lg font-bold">{dict.common.groupBookingTitle}</H>
        <p className="mt-1">{t(site.groupBooking.note, locale)}</p>
        <a
          href={telHref(site.phone)}
          className="mt-2 inline-block font-semibold text-red underline underline-offset-4"
        >
          {formatPhone(site.phone)}
        </a>
      </div>
    </div>
  );
}
