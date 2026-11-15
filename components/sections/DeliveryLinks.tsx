import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/cn";
import { site } from "@/lib/content";

/**
 * "Also on Swiggy · Zomato" — external links to the café's delivery-platform
 * pages, from `delivery` in content/site.ts. Renders nothing until added.
 * (The NUKKAD website itself has no ordering.)
 */
export function DeliveryLinks({ dict, className }: { dict: Dictionary; className?: string }) {
  const links = [
    { name: "Swiggy", url: site.delivery?.swiggy },
    { name: "Zomato", url: site.delivery?.zomato },
  ].filter((l): l is { name: string; url: string } => !!l.url);
  if (links.length === 0) return null;
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2", className)}>
      <span>{dict.common.alsoOn}</span>
      {links.map((l, i) => (
        <span key={l.name}>
          {i > 0 && <span aria-hidden="true">· </span>}
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            {l.name}
          </a>
        </span>
      ))}
    </p>
  );
}
