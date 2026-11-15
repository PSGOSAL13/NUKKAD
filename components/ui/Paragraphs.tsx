import { t, type Locale, type Localized } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * Renders an array of localized paragraphs from /content.
 * `compact` = smaller, tighter text (for page headers); otherwise relaxed body text.
 */
export function Paragraphs({
  items,
  locale,
  compact = false,
  className,
}: {
  items: Localized[];
  locale: Locale;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        compact ? "space-y-1 text-base leading-snug sm:text-lg" : "space-y-4 text-lg leading-relaxed",
        className,
      )}
    >
      {items.map((p, i) => (
        <p key={i} lang={p[locale] === undefined ? "en" : undefined}>
          {t(p, locale)}
        </p>
      ))}
    </div>
  );
}
