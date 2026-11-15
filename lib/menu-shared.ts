/**
 * Menu helpers that work on both server and client (no React hooks here —
 * the live-sheet hook is in lib/use-live-menu.ts).
 */
import type { MenuItem } from "@/content/schema";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { MenuData } from "./menu-sheet";
import { photoSourceFor, type PhotoSource } from "./photos";

export type { MenuData };

/** Labels the menu components need (a small slice of the dictionary). */
export type MenuLabels = Dictionary["menu"] & { diet: Dictionary["diet"]; tags: Dictionary["tags"] };

export function menuLabels(dict: Dictionary): MenuLabels {
  return { ...dict.menu, diet: dict.diet, tags: dict.tags };
}

export type { PhotoSource } from "./photos";

/** Resolve a menu item's photo: a processed local photo (with srcset) or an https URL. */
export function photoSource(photo: MenuItem["photo"]): PhotoSource | null {
  return photoSourceFor("menu", photo);
}

export const visibleItems = (items: MenuItem[]) => items.filter((i) => i.status !== "hidden");

/** Products for the home page's rotating six: featured and currently available. */
export const featuredItems = (menu: MenuData) =>
  menu
    .flatMap((c) => c.items.map((item) => ({ item, illustration: item.illustration ?? c.illustration })))
    .filter(({ item }) => item.featured && item.status === "available");
