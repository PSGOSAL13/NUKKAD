import { VintageMap } from "@/components/illustrations/VintageMap";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { location } from "@/lib/content";

/** Illustrated map + text list of the same landmarks (the list is what screen readers use). */
export function LocationMap({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const landmarks = location.landmarks.map((l) => ({ ...l, text: t(l.label, locale) }));
  return (
    <figure className="space-y-4">
      <div className="overflow-hidden rounded-xl border-2 border-ink shadow-print">
        <VintageMap
          cafe={location.cafe}
          landmarks={landmarks}
          labels={{
            cafe: dict.common.mapCafe,
            notToScale: dict.common.mapNotToScale,
            north: dict.common.mapNorth,
          }}
        />
      </div>
      <figcaption>
        {!location.confirmed && (
          <p className="mb-3 rounded-md border-l-4 border-yellow bg-yellow-soft px-3 py-2 text-sm">
            {dict.common.locationUnconfirmed}
          </p>
        )}
        {landmarks.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-ink-muted">{dict.common.nearbyLandmarks}</h3>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {landmarks.map((l) => (
                <li key={l.id}>
                  {l.text}
                  {l.distance && <span className="text-ink-muted"> · {t(l.distance, locale)}</span>}
                </li>
              ))}
            </ul>
          </>
        )}
        {location.directions && <p className="mt-2">{t(location.directions, locale)}</p>}
      </figcaption>
    </figure>
  );
}
