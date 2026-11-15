import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  yellow: "bg-yellow text-ink",
  red: "bg-red text-cream",
  outline: "border border-red text-red",
} as const;

/** Small painted label, slightly tilted like a sticker on a menu board. */
export function Tag({
  tone = "yellow",
  tilt = false,
  className,
  children,
}: {
  tone?: keyof typeof tones;
  tilt?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-heading text-xs font-semibold tracking-wide uppercase",
        tones[tone],
        tilt && "-rotate-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
