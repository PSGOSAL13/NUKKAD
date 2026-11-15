import { DietMark } from "@/components/ui/DietMark";
import { Tag } from "@/components/ui/Tag";
import type { FoodIllustration, MenuItem } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { MenuLabels } from "@/lib/menu-shared";
import { MenuPhoto, SoldOutStamp } from "./MenuPhoto";

/** A product as a paper card with photo — used in the home page's rotating six. */
export function MenuItemCard({
  item,
  illustration,
  locale,
  labels,
  className,
}: {
  item: MenuItem;
  illustration: FoodIllustration;
  locale: Locale;
  labels: MenuLabels;
  className?: string;
}) {
  const soldOut = item.status === "sold-out";
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border-2 border-ink bg-paper texture-paper shadow-print-sm",
        className,
      )}
    >
      <div className="relative">
        <MenuPhoto
          item={item}
          illustration={illustration}
          locale={locale}
          labels={labels}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className={cn("aspect-[4/3]", soldOut && "grayscale")}
        />
        {soldOut && <SoldOutStamp label={labels.soldOut} className="absolute top-3 left-3" />}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline gap-2">
          {item.diet && (
            <DietMark diet={item.diet} label={labels.diet[item.diet]} className="translate-y-0.5" />
          )}
          <h3 className="text-lg leading-snug font-bold">{t(item.name, locale)}</h3>
          <p className="ml-auto shrink-0 font-heading text-lg font-bold text-red tabular-nums">
            {formatPrice(item.price, locale)}
          </p>
        </div>
        {item.description && <p className="mt-1 text-ink-muted">{t(item.description, locale)}</p>}
        {item.tags.length > 0 && (
          <p className="mt-auto flex flex-wrap gap-2 pt-3">
            {item.tags.map((tag) => (
              <Tag key={tag} tilt>
                {labels.tags[tag]}
              </Tag>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
