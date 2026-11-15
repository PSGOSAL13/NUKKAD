import { DietMark } from "@/components/ui/DietMark";
import { Tag } from "@/components/ui/Tag";
import type { MenuItem } from "@/content/schema";
import { cn } from "@/lib/cn";

/** Plain, already-localized data, so the card works in server and client components. */
export type MenuItemView = {
  id: string;
  name: string;
  description?: string;
  price: string;
  diet: MenuItem["diet"];
  dietLabel: string;
  tags: string[];
};

/** A single menu item as a handwritten-board row ("row") or a paper card ("card"). */
export function MenuItemCard({
  item,
  layout = "row",
  className,
}: {
  item: MenuItemView;
  layout?: "row" | "card";
  className?: string;
}) {
  return (
    <article
      className={cn(
        layout === "card" &&
          "h-full rounded-lg border-2 border-ink bg-paper texture-paper p-5 shadow-print-sm",
        layout === "row" && "border-b border-dashed border-cream-dark py-4 last:border-0",
        className,
      )}
    >
      <div className="flex items-baseline gap-3">
        <DietMark diet={item.diet} label={item.dietLabel} className="translate-y-0.5" />
        <h3 className="text-lg leading-snug font-bold">{item.name}</h3>
        <span
          aria-hidden="true"
          className="mx-1 hidden flex-1 translate-y-[-4px] border-b-2 border-dotted border-ink/30 sm:block"
        />
        <p className="ml-auto shrink-0 font-heading text-lg font-bold text-red tabular-nums">{item.price}</p>
      </div>
      {(item.description || item.tags.length > 0) && (
        <div className="mt-1 pl-7">
          {item.description && <p className="text-ink-muted">{item.description}</p>}
          {item.tags.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Tag key={tag} tilt>
                  {tag}
                </Tag>
              ))}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
