import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DietMark } from "@/components/ui/DietMark";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { menu } from "@/lib/content";
import { resolveLocale } from "@/lib/locale-params";
import { menuLabels } from "@/lib/menu-shared";

/** Living style guide. Not linked from the site and excluded from search engines. */
export const metadata: Metadata = { title: "Brand system", robots: { index: false, follow: false } };

const colours = [
  {
    name: "Deep Red",
    token: "red",
    hex: "#8F2925",
    role: "Primary. Signage, headings, primary surfaces.",
    cls: "bg-red text-cream",
  },
  {
    name: "Warm Yellow",
    token: "yellow",
    hex: "#E9B83E",
    role: "Primary. Highlights, buttons, fills. Never as text on cream.",
    cls: "bg-yellow text-ink",
  },
  {
    name: "Cream",
    token: "cream",
    hex: "#F6EBD3",
    role: "Primary. The page.",
    cls: "bg-cream text-ink border-2 border-cream-dark",
  },
  {
    name: "Ink",
    token: "ink",
    hex: "#2B1D16",
    role: "Body text (13.7:1 on cream).",
    cls: "bg-ink text-cream",
  },
  {
    name: "Red Dark",
    token: "red-dark",
    hex: "#72211E",
    role: "Hover / pressed red.",
    cls: "bg-red-dark text-cream",
  },
  {
    name: "Paper",
    token: "paper",
    hex: "#FBF5E8",
    role: "Cards on cream.",
    cls: "bg-paper text-ink border-2 border-cream-dark",
  },
  {
    name: "Cream Dark",
    token: "cream-dark",
    hex: "#E5D8BF",
    role: "Borders, dividers.",
    cls: "bg-cream-dark text-ink",
  },
  {
    name: "Yellow Soft",
    token: "yellow-soft",
    hex: "#FAEDCF",
    role: "Highlighted panels.",
    cls: "bg-yellow-soft text-ink",
  },
  {
    name: "Red Soft",
    token: "red-soft",
    hex: "#E3CAC9",
    role: "Tinted panels.",
    cls: "bg-red-soft text-ink",
  },
  {
    name: "Ink Muted",
    token: "ink-muted",
    hex: "#6B5848",
    role: "Secondary text (5.7:1 on cream).",
    cls: "bg-ink-muted text-cream",
  },
  {
    name: "Clay",
    token: "clay",
    hex: "#B5653A",
    role: "Illustration only.",
    cls: "bg-clay text-ink text-xl",
  },
  {
    name: "Veg / Non-veg",
    token: "veg · nonveg",
    hex: "#2A6E2E · #7A3E1D",
    role: "Food marks only.",
    cls: "bg-[linear-gradient(90deg,var(--color-veg)_50%,var(--color-nonveg)_50%)] text-cream",
  },
];

export default async function BrandPage({ params }: PageProps<"/[lang]/brand">) {
  const { locale, dict } = await resolveLocale(params);
  // Real menu cards: one with a photo, one with an illustration, one sold out.
  const examples = ["masala-chai", "bun-maska", "kulhad-lassi"].flatMap((id) =>
    menu.flatMap((c) =>
      c.items.filter((i) => i.id === id).map((item) => ({ item, illustration: c.illustration })),
    ),
  );

  return (
    <>
      <PageHeader
        eyebrow="NUKKAD | नुक्कड"
        title="Brand system"
        intro={<p>Logos, colour, type and components. Full guidelines: brand/README.md.</p>}
      />
      <Container className="space-y-20 py-16">
        <section aria-labelledby="logos" className="space-y-6">
          <SectionHeading id="logos" eyebrow="01" title="Logos" />
          <div className="grid gap-6 md:grid-cols-3">
            <figure className="grid place-items-center rounded-lg border-2 border-cream-dark bg-cream p-8">
              <Logo variant="primary-tagline" height={300} />
              <figcaption className="mt-4 text-sm">Primary · full colour</figcaption>
            </figure>
            <figure className="grid place-items-center rounded-lg bg-red p-8">
              <Logo variant="primary" tone="reverse" height={260} />
              <figcaption className="mt-4 text-sm text-cream">Primary · reverse</figcaption>
            </figure>
            <figure className="grid place-items-center rounded-lg border-2 border-dashed border-cream-dark p-8">
              <Logo variant="primary" tone="mono-ink" height={260} />
              <figcaption className="mt-4 text-sm">Primary · one colour (stamps, print)</figcaption>
            </figure>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <figure className="rounded-lg border-2 border-cream-dark bg-cream p-6">
              <Logo variant="secondary" height={70} />
              <figcaption className="mt-3 text-sm">
                Secondary · horizontal (header, narrow signage)
              </figcaption>
            </figure>
            <figure className="rounded-lg bg-red p-6">
              <Logo variant="secondary" tone="reverse" height={70} />
              <figcaption className="mt-3 text-sm text-cream">Secondary · reverse</figcaption>
            </figure>
          </div>
          <div className="flex flex-wrap items-end gap-8">
            <figure>
              <Logo variant="symbol" height={120} />
              <figcaption className="mt-2 text-sm">Symbol</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/nukkad-app-icon.svg" width={120} height={120} alt="App icon" />
              <figcaption className="mt-2 text-sm">App icon / favicon</figcaption>
            </figure>
            <figure className="flex items-end gap-3">
              {[16, 32, 48].map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={s} src="/brand/nukkad-app-icon.svg" width={s} height={s} alt={`${s}px`} />
              ))}
              <figcaption className="text-sm">16 / 32 / 48 px</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="colour" className="space-y-6">
          <SectionHeading id="colour" eyebrow="02" title="Colour" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colours.map((c) => (
              <li key={c.token} className="overflow-hidden rounded-lg border-2 border-ink">
                <div className={`h-24 p-3 font-heading font-bold ${c.cls}`}>{c.name}</div>
                <div className="bg-paper p-3 text-sm">
                  <p className="font-mono">{c.hex}</p>
                  <p className="font-mono text-ink-muted">{c.token}</p>
                  <p className="mt-1">{c.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="type" className="space-y-6">
          <SectionHeading id="type" eyebrow="03" title="Typography" />
          <div className="space-y-6">
            <div>
              <p className="text-sm text-ink-muted">Display · Yatra One — signboards, kickers, big moments</p>
              <p className="font-display text-6xl text-red">Apna Nukkad. Apne Log.</p>
              <p className="font-display text-5xl text-red">नुक्कड़ की बातें</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Heading · Baloo 2 / Baloo Chettan 2 (Malayalam)</p>
              <p className="font-heading text-4xl font-bold">Come, Sit &amp; Stay</p>
              <p
                className="font-heading text-3xl font-bold"
                lang="ml"
                style={{ fontFamily: "var(--font-baloo-chettan, var(--font-heading-stack))" }}
              >
                വരൂ, ഇരിക്കൂ
              </p>
            </div>
            <div className="max-w-2xl">
              <p className="text-sm text-ink-muted">Body · Mukta / Noto Sans Malayalam</p>
              <p className="text-lg">
                Every nukkad has someone who knows your order before you say it. Pull up a stool — ek cutting
                ho jaaye?
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="buttons" className="space-y-6">
          <SectionHeading id="buttons" eyebrow="04" title="Buttons & interaction" />
          <p className="max-w-2xl">
            Hover lifts the sign; press pushes it flat like a rubber stamp. Tab through to see the focus ring.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost link</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section aria-labelledby="components" className="space-y-6">
          <SectionHeading id="components" eyebrow="05" title="Components" />
          <div className="flex flex-wrap items-center gap-3">
            <Tag>Signature</Tag>
            <Tag tone="red">New</Tag>
            <Tag tone="outline">Seasonal</Tag>
            <Tag tilt>Tilted sticker</Tag>
            {(["veg", "vegan", "egg", "nonveg"] as const).map((d) => (
              <span key={d} className="flex items-center gap-1 text-sm">
                <DietMark diet={d} label={dict.diet[d]} /> {dict.diet[d]}
              </span>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {examples.map(({ item, illustration }) => (
              <MenuItemCard
                key={item.id}
                item={item}
                illustration={illustration}
                locale={locale}
                labels={menuLabels(dict)}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="textures" className="space-y-6">
          <SectionHeading id="textures" eyebrow="06" title="Textures" />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid h-36 place-items-end rounded-lg border-2 border-ink bg-cream texture-paper p-3 text-sm">
              Aged paper
            </div>
            <div className="grid h-36 place-items-end rounded-lg border-2 border-ink bg-yellow-soft texture-halftone p-3 text-sm text-red/40">
              <span className="text-ink">Halftone print</span>
            </div>
            <div className="overflow-hidden rounded-lg border-2 border-ink">
              <div className="h-10 texture-awning" />
              <p className="p-3 text-sm">Chai-stall awning</p>
            </div>
            <div className="grid h-36 place-items-center rounded-lg border-2 border-ink">
              <span className="hand-underline font-display text-3xl text-red">Brush underline</span>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
