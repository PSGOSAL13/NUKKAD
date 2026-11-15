"use client";

import type { Locale } from "@/i18n/config";
import type { EventsData } from "@/lib/events-sheet";
import { upcomingEvents, type EventLabels } from "@/lib/events-shared";
import { useIndiaNow, useLiveEvents } from "@/lib/use-live-events";
import { EventCard } from "./EventCard";

/** Home page: the next few events (live from the sheet, past ones dropped by the visitor's clock). */
export function UpcomingEventsPreview({
  initialEvents,
  buildNow,
  locale,
  labels,
  phone,
  limit = 3,
}: {
  initialEvents: EventsData;
  buildNow: { date: string; time: string };
  locale: Locale;
  labels: EventLabels;
  phone: string;
  limit?: number;
}) {
  const now = useIndiaNow(buildNow);
  const events = upcomingEvents(useLiveEvents(initialEvents), now).slice(0, limit);
  if (events.length === 0) {
    return <p className="rounded-lg border border-cream/20 bg-cream/10 p-5 text-lg">{labels.noUpcoming}</p>;
  }
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {events.map((e) => (
        <li key={e.id}>
          <EventCard event={e} locale={locale} labels={labels} phone={phone} compact />
        </li>
      ))}
    </ul>
  );
}
