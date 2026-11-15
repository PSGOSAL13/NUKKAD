"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string };

/** Main navigation links with the current page highlighted. */
export function NavLinks({
  items,
  orientation = "horizontal",
  onNavigate,
}: {
  items: NavItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul
      className={cn(
        "flex font-heading font-semibold",
        orientation === "horizontal" ? "items-center gap-1" : "flex-col gap-1",
      )}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "block rounded-md transition-colors",
                orientation === "horizontal" ? "px-3 py-2 text-[0.95rem]" : "px-2 py-3 text-2xl",
                active ? "hand-underline text-red" : "text-ink hover:text-red",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
