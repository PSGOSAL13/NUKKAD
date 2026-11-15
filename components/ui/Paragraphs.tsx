import { t, type Locale, type Localized } from "@/i18n/config";
import { cn } from "@/lib/cn";

/** Renders an array of localized paragraphs from /content. */
export function Paragraphs({
  items,
  locale,
  className,
}: {
  items: Localized[];
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 text-lg leading-relaxed", className)}>
      {items.map((p, i) => (
        <p key={i} lang={p[locale] === undefined ? "en" : undefined}>
          {t(p, locale)}
        </p>
      ))}
    </div>
  );
}
