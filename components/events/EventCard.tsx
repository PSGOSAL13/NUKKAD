import { ThemeIllustration } from "@/components/illustrations/ThemeIllustration";
import { buttonClasses } from "@/components/ui/Button";
import { t, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatEventDate, type CafeEvent, type EventLabels } from "@/lib/events-shared";
import { formatTime, telHref } from "@/lib/format";
import { photoSourceFor } from "@/lib/photos";

/**
 * One event: photo (or themed illustration), type and theme, date and time,
 * description, host, and a Call to Enquire button. No registration.
 */
export function EventCard({
  event,
  locale,
  labels,
  phone,
  compact = false,
  highlighted = false,
}: {
  event: CafeEvent;
  locale: Locale;
  labels: EventLabels;
  phone: string;
  compact?: boolean;
  highlighted?: boolean;
}) {
  const photo = photoSourceFor("events", event.photo);
  const time = `${formatTime(event.start, locale)}${event.end ? ` – ${formatTime(event.end, locale)}` : ""}`;
  const storytelling = event.type === "storytelling";
  return (
    <article
      id={`event-${event.id}`}
      className={cn(
        "grid scroll-mt-28 overflow-hidden rounded-xl border-2 border-ink bg-paper text-ink transition-shadow",
        compact ? "shadow-print-sm" : "shadow-print sm:grid-cols-[minmax(0,15rem)_1fr]",
        highlighted && "ring-4 ring-yellow",
      )}
    >
      <div
        className={cn("relative bg-cream-dark", compact ? "aspect-[16/9]" : "aspect-[16/9] sm:aspect-auto")}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP with srcset
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes="(min-width: 640px) 240px, 100vw"
            width={photo.width}
            height={photo.height}
            alt={event.photoAlt ? t(event.photoAlt, locale) : ""}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <ThemeIllustration kind={event.theme ?? "community"} className="absolute inset-0" />
        )}
        {photo?.sample && (
          <span className="absolute right-1.5 bottom-1.5 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-cream uppercase">
            {labels.samplePhoto}
          </span>
        )}
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full border-2 px-3 py-0.5 font-heading text-xs font-bold tracking-wide uppercase",
            storytelling ? "border-cream bg-red text-cream" : "border-ink bg-yellow text-ink",
          )}
        >
          {labels.types[event.type]}
        </span>
      </div>

      <div className="flex flex-col p-5">
        <p className="font-heading font-bold text-red">
          <time dateTime={`${event.date}T${event.start}+05:30`}>
            {formatEventDate(event.date, locale)} · {time}
          </time>
        </p>
        <h3 className="mt-1 text-2xl leading-tight font-bold">{t(event.title, locale)}</h3>
        {event.theme && labels.themes[event.theme] !== t(event.title, locale) && (
          <p className="mt-0.5 font-display text-ink-muted">{labels.themes[event.theme]}</p>
        )}
        <p className="mt-2">{t(event.description, locale)}</p>
        <p className="mt-2 text-sm text-ink-muted">
          {storytelling
            ? labels.hostedByOwner
            : event.host
              ? `${labels.hostedBy} ${t(event.host, locale)}`
              : null}
          {(storytelling || event.host) && " · "}
          {labels.walkIn}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href={telHref(phone)} className={buttonClasses({ variant: "secondary", size: "sm" })}>
            {labels.callToEnquire}
          </a>
          {event.sample && (
            <span className="rounded border border-dashed border-ink-muted/50 px-1.5 text-xs text-ink-muted uppercase">
              {labels.sample}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
