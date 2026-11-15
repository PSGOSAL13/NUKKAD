"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import type { EventsData } from "@/lib/events-sheet";
import {
  formatEventDate,
  formatMonth,
  monthGrid,
  upcomingEvents,
  weekdayNames,
  type EventLabels,
} from "@/lib/events-shared";
import { useIndiaNow, useLiveEvents } from "@/lib/use-live-events";
import { EventCard } from "./EventCard";

/**
 * Visual month calendar + upcoming list. Picking a day filters the list to
 * that day; "Show all upcoming" resets it. Viewing only — no registration.
 */
export function EventsExplorer({
  initialEvents,
  buildNow,
  locale,
  labels,
  phone,
}: {
  initialEvents: EventsData;
  buildNow: { date: string; time: string };
  locale: Locale;
  labels: EventLabels;
  phone: string;
}) {
  const now = useIndiaNow(buildNow);
  const events = upcomingEvents(useLiveEvents(initialEvents), now);
  const byDate = new Map<string, number>();
  for (const e of events) byDate.set(e.date, (byDate.get(e.date) ?? 0) + 1);

  // Start on the month of the next event (or this month).
  const start = events[0]?.date ?? now.date;
  const [view, setView] = useState({ y: Number(start.slice(0, 4)), m: Number(start.slice(5, 7)) - 1 });
  const [picked, setPicked] = useState<string | null>(null);

  const shift = (d: number) =>
    setView(({ y, m }) => {
      const t = new Date(Date.UTC(y, m + d, 1));
      return { y: t.getUTCFullYear(), m: t.getUTCMonth() };
    });

  const list = picked ? events.filter((e) => e.date === picked) : events;
  const weeks = monthGrid(view.y, view.m);
  const names = weekdayNames(locale);
  const monthLabel = formatMonth(view.y, view.m, locale);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[22rem_1fr]">
      {/* calendar */}
      <section
        aria-label={labels.calendar}
        className="rounded-xl border-2 border-ink bg-paper texture-paper p-4 shadow-print lg:sticky lg:top-28"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label={labels.previousMonth}
            className="grid size-10 place-items-center rounded-full border-2 border-ink hover:bg-yellow-soft"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <h3 aria-live="polite" className="font-display text-xl text-red">
            {monthLabel}
          </h3>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label={labels.nextMonth}
            className="grid size-10 place-items-center rounded-full border-2 border-ink hover:bg-yellow-soft"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <table className="mt-3 w-full table-fixed border-collapse text-center">
          <caption className="sr-only">{monthLabel}</caption>
          <thead>
            <tr>
              {names.map((n) => (
                <th key={n} scope="col" className="pb-1 text-xs font-semibold text-ink-muted">
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((day, d) => {
                  if (!day) return <td key={d} />;
                  const count = byDate.get(day) ?? 0;
                  const isToday = day === now.date;
                  const isPicked = day === picked;
                  const label = `${formatEventDate(day, locale)}${count ? `, ${count === 1 ? labels.oneEvent : `${count} ${labels.manyEvents}`}` : ""}`;
                  return (
                    <td key={d} className="p-0.5">
                      {count ? (
                        <button
                          type="button"
                          onClick={() => setPicked(isPicked ? null : day)}
                          aria-pressed={isPicked}
                          aria-label={label}
                          className={cn(
                            "relative grid aspect-square w-full place-items-center rounded-md border-2 font-heading font-bold transition-colors",
                            isPicked
                              ? "border-ink bg-red text-cream"
                              : "border-ink bg-yellow hover:bg-yellow-soft",
                          )}
                        >
                          {Number(day.slice(8))}
                          <span aria-hidden="true" className="absolute bottom-1 flex gap-0.5">
                            {Array.from({ length: Math.min(count, 3) }, (_, i) => (
                              <span
                                key={i}
                                className={cn("size-1 rounded-full", isPicked ? "bg-cream" : "bg-red")}
                              />
                            ))}
                          </span>
                        </button>
                      ) : (
                        <span
                          aria-label={label}
                          className={cn(
                            "grid aspect-square place-items-center rounded-md text-sm",
                            day < now.date ? "text-ink-muted/50" : "text-ink-muted",
                            isToday && "font-bold ring-2 ring-red",
                          )}
                        >
                          {Number(day.slice(8))}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
          <span className="inline-block size-3 rounded-sm border border-ink bg-yellow" aria-hidden="true" />{" "}
          {labels.upcoming}
          <span className="ml-3 inline-block size-3 rounded-sm ring-2 ring-red" aria-hidden="true" />{" "}
          {labels.today}
        </p>
      </section>

      {/* list */}
      <div aria-live="polite">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-2xl font-bold">
            {picked ? `${labels.eventsOn} ${formatEventDate(picked, locale)}` : labels.upcoming}
          </h3>
          {picked && (
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="font-semibold text-red underline underline-offset-4"
            >
              {labels.showAll}
            </button>
          )}
        </div>
        {list.length === 0 ? (
          <p className="rounded-lg border border-cream-dark bg-yellow-soft p-5 text-lg">
            {picked ? labels.noEventsOnDay : labels.noUpcoming}
          </p>
        ) : (
          <ul className="space-y-6">
            {list.map((e) => (
              <li key={e.id}>
                <EventCard
                  event={e}
                  locale={locale}
                  labels={labels}
                  phone={phone}
                  highlighted={e.date === picked}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
