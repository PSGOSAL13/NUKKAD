import type { ReactNode } from "react";
import { Container } from "./Container";

/**
 * Compact top band for inner pages: signboard eyebrow, title, one-line intro,
 * awning edge. Kept short so the page's real content starts high on screen.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div className="bg-paper texture-paper">
      <Container className="py-3.5 sm:py-4">
        {/* Eyebrow and title share one line to keep the band short. */}
        <div className="flex flex-wrap items-baseline gap-x-3">
          {eyebrow && <p className="font-display text-base text-red sm:text-lg">{eyebrow}</p>}
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{title}</h1>
        </div>
        {intro && <div className="mt-1 max-w-3xl text-base leading-snug text-ink-muted">{intro}</div>}
      </Container>
      <div aria-hidden="true" className="h-7 texture-awning" />
    </div>
  );
}
