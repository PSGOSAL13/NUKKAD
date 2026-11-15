import type { MenuItem } from "@/content/schema";
import { cn } from "@/lib/cn";

/**
 * Indian food-label convention: square with a dot (veg, green) or a
 * triangle (non-veg, brown). Egg uses the brown square + dot; vegan the green
 * square with a leaf-shaped dot. Always paired with an accessible label.
 */
export function DietMark({
  diet,
  label,
  className,
}: {
  diet: MenuItem["diet"];
  label: string;
  className?: string;
}) {
  const green = diet === "veg" || diet === "vegan";
  const color = green ? "text-veg" : "text-nonveg";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn("inline-block shrink-0", color, className)}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        {diet === "nonveg" ? (
          <path d="M8 3.8 12 11.5H4Z" fill="currentColor" />
        ) : diet === "vegan" ? (
          <path d="M4.5 11.5C4.5 7 7.5 4.5 11.5 4.5 11.5 8.5 9 11.5 4.5 11.5Z" fill="currentColor" />
        ) : (
          <circle cx="8" cy="8" r="3.4" fill="currentColor" />
        )}
      </svg>
    </span>
  );
}
