/**
 * Menu helpers that work on both server and client (no React hooks here —
 * the live-sheet hook is in lib/use-live-menu.ts).
 */
import menuPhotos from "@/content/generated/menu-photos.json";
import type { MenuItem } from "@/content/schema";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { MenuData } from "./menu-sheet";

export type { MenuData };

/** Labels the menu components need (a small slice of the dictionary). */
export type MenuLabels = Dictionary["menu"] & { diet: Dictionary["diet"]; tags: Dictionary["tags"] };

export function menuLabels(dict: Dictionary): MenuLabels {
  return { ...dict.menu, diet: dict.diet, tags: dict.tags };
}

type PhotoManifest = Record<string, { width: number; height: number; sample: boolean }>;
const photos = menuPhotos as PhotoManifest;

export type PhotoSource = { src: string; srcSet?: string; width?: number; height?: number; sample: boolean };

/** Resolve an item's photo: a processed local photo (with srcset) or an https URL. */
export function photoSource(photo: MenuItem["photo"]): PhotoSource | null {
  if (!photo) return null;
  if (photo.startsWith("https://")) return { src: photo, sample: false };
  const p = photos[photo];
  if (!p) return null;
  return {
    src: `/images/menu/${photo}-960.webp`,
    srcSet: `/images/menu/${photo}-480.webp 480w, /images/menu/${photo}-960.webp 960w`,
    width: p.width,
    height: p.height,
    sample: p.sample,
  };
}

export const visibleItems = (items: MenuItem[]) => items.filter((i) => i.status !== "hidden");

/** Products for the home page's rotating six: featured and currently available. */
export const featuredItems = (menu: MenuData) =>
  menu
    .flatMap((c) => c.items.map((item) => ({ item, illustration: item.illustration ?? c.illustration })))
    .filter(({ item }) => item.featured && item.status === "available");
