import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Signboard-style buttons: solid colour, ink outline and a hard "print"
 * shadow. Hover lifts the sign, press pushes it flat like a rubber stamp.
 */
const base =
  "inline-flex items-center justify-center gap-2 font-heading font-semibold leading-none whitespace-nowrap " +
  "rounded-md border-2 border-ink transition-[transform,box-shadow,background-color] duration-150 ease-pour " +
  "disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-x-px motion-safe:hover:-translate-y-px " +
  "motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px] active:shadow-none";

const variants: Record<Variant, string> = {
  /** Main call to action — yellow sign, ink text (8.8:1). */
  primary: "bg-yellow text-ink shadow-print hover:shadow-print-lg",
  /** Deep-red sign, cream text (7.1:1). */
  secondary: "bg-red text-cream shadow-print hover:bg-red-dark hover:shadow-print-lg",
  /** Quieter action on cream. */
  outline: "bg-transparent text-red border-red shadow-print-red hover:bg-yellow-soft",
  /** Text-only, for low-emphasis actions. */
  ghost:
    "border-transparent bg-transparent text-red underline decoration-2 underline-offset-4 shadow-none hover:decoration-yellow",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-base", // 44px — comfortable touch target
  lg: "min-h-13 px-7 text-lg",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AsLink = CommonProps & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button(props: AsLink | AsButton) {
  const { variant, size, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, className });

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as AsLink;
    // External / tel: / wa.me links use a plain <a>; internal pages use <Link>.
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...button } = rest as AsButton;
  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  );
}
