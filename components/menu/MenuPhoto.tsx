import { FoodIllustration } from "@/components/illustrations/FoodIllustration";
import type { FoodIllustration as IllustrationKind, MenuItem } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { photoSource, type MenuLabels } from "@/lib/menu-shared";

/**
 * A product's photograph — or its hand-drawn illustration when there is no
 * photo yet. Sample (stand-in) photos carry a small "Sample photo" tag.
 */
export function MenuPhoto({
  item,
  illustration,
  locale,
  labels,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  className,
}: {
  item: MenuItem;
  illustration: IllustrationKind;
  locale: Locale;
  labels: MenuLabels;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = photoSource(item.photo);
  return (
    <div className={cn("relative overflow-hidden bg-yellow-soft", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- pre-optimised WebP with srcset
        <img
          src={src.src}
          srcSet={src.srcSet}
          sizes={src.srcSet ? sizes : undefined}
          width={src.width}
          height={src.height}
          alt={item.photoAlt ? t(item.photoAlt, locale) : t(item.name, locale)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center p-3">
          <FoodIllustration kind={item.illustration ?? illustration} className="max-h-full max-w-[220px]" />
        </div>
      )}
      {src?.sample && labels.samplePhoto && (
        <span className="absolute right-1.5 bottom-1.5 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-cream uppercase">
          {labels.samplePhoto}
        </span>
      )}
    </div>
  );
}

/** Rubber-stamp "Sold Out" label. */
export function SoldOutStamp({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block -rotate-6 rounded-md border-[3px] border-red bg-cream/90 px-2 py-0.5 font-heading text-sm font-extrabold tracking-wider text-red uppercase",
        className,
      )}
    >
      {label}
    </span>
  );
}
