"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { nowInIndia } from "@/lib/events-shared";

/**
 * Site-wide announcement strip (from `announcement` in content/site.ts).
 * Hidden automatically after its `until` date — checked in the visitor's
 * browser too, so it disappears on time even without a rebuild.
 */
export function AnnouncementBar({
  text,
  link,
  linkLabel,
  until,
  locale,
  label,
}: {
  text: string;
  link?: string;
  linkLabel?: string;
  until?: string;
  locale: Locale;
  /** Accessible name for the region, e.g. "Announcement". */
  label: string;
}) {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- compare with the visitor's real date after mount
    if (until) setExpired(nowInIndia().date > until);
  }, [until]);
  if (expired) return null;

  const external = link?.startsWith("https://");
  const href = link && !external ? `/${locale}${link}` : link;
  return (
    <div role="region" aria-label={label} className="border-b-2 border-ink bg-yellow text-ink">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center font-heading text-sm font-semibold sm:px-6 lg:px-8">
        <span aria-hidden="true" className="mr-1.5">
          📣
        </span>
        {text}
        {href && (
          <>
            {" "}
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {linkLabel ?? "→"}
              </a>
            ) : (
              <Link href={href} className="underline underline-offset-2">
                {linkLabel ?? "→"}
              </Link>
            )}
          </>
        )}
      </p>
    </div>
  );
}
