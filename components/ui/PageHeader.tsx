import type { ReactNode } from "react";
import { Container } from "./Container";

/** Top band for inner pages: signboard eyebrow, title, intro, awning edge. */
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
      <Container className="py-14 sm:py-20">
        {eyebrow && <p className="font-display text-xl text-red sm:text-2xl">{eyebrow}</p>}
        <h1 className="mt-1 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-xl leading-relaxed">{intro}</div>}
      </Container>
      <div aria-hidden="true" className="h-6 texture-awning" />
    </div>
  );
}
