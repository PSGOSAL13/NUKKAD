import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const widths = { prose: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl" } as const;

export function Container({
  width = "default",
  className,
  children,
}: {
  width?: keyof typeof widths;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[width], className)}>{children}</div>
  );
}
