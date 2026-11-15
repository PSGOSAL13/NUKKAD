import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Eyebrow (hand-painted label) + title. The eyebrow is set in the display
 * face like a shop-sign kicker; the title uses the heading face.
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** light = on cream; dark = on red */
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className={cn("font-display text-lg sm:text-xl", tone === "light" ? "text-red" : "text-yellow")}>
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "mt-1 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl",
          tone === "light" ? "text-ink" : "text-cream",
        )}
      >
        {title}
      </Tag>
    </header>
  );
}
