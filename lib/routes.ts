import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/** Site pages, in navigation order. `path` is relative to the locale root. */
export const routes = [
  { key: "home", path: "" },
  { key: "menu", path: "menu/" },
  { key: "story", path: "our-story/" },
  { key: "baatein", path: "nukkad-ki-baatein/" },
  { key: "location", path: "location/" },
  { key: "contact", path: "contact/" },
] as const satisfies readonly { key: keyof Dictionary["nav"]; path: string }[];

export type RouteKey = (typeof routes)[number]["key"];

export function href(locale: Locale, key: RouteKey, hash?: string): string {
  const path = routes.find((r) => r.key === key)!.path;
  return `/${locale}/${path}${hash ? `#${hash}` : ""}`;
}
