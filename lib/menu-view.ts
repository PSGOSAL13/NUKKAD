import type { MenuItemView } from "@/components/menu/MenuItemCard";
import type { MenuItem } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPrice } from "./format";

/** Resolve a menu item's text for one language. */
export function toMenuItemView(item: MenuItem, locale: Locale, dict: Dictionary): MenuItemView {
  return {
    id: item.id,
    name: t(item.name, locale),
    description: item.description && t(item.description, locale),
    price: formatPrice(item.price, locale),
    diet: item.diet,
    dietLabel: dict.diet[item.diet],
    tags: item.tags.map((tag) => dict.tags[tag]),
  };
}
