"use client";

import { useEffect, useRef, useState } from "react";
import { FoodIllustration } from "@/components/illustrations/FoodIllustration";
import { DietMark } from "@/components/ui/DietMark";
import type { FoodIllustration as IllustrationKind, MenuItem } from "@/content/schema";
import { t, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { visibleItems, type MenuData, type MenuLabels } from "@/lib/menu-shared";
import { useLiveMenu } from "@/lib/use-live-menu";
import { MenuPhoto, SoldOutStamp } from "./MenuPhoto";

/**
 * The street-stall menu board: hand-painted category tabs above a framed
 * chalkboard with handwritten items and exact prices. Tap an item for its
 * photo and details. Viewing only — no ordering.
 *
 * Without JavaScript every category is shown; with it, one at a time.
 * Follows the live Google Sheet (prices, Sold Out) when one is connected.
 */
export function MenuBoard({
  initialMenu,
  locale,
  labels,
}: {
  initialMenu: MenuData;
  locale: Locale;
  labels: MenuLabels;
}) {
  const menu = useLiveMenu(initialMenu);
  const categories = menu
    .map((c) => ({ ...c, items: visibleItems(c.items) }))
    .filter((c) => c.items.length > 0);

  const [active, setActive] = useState(categories[0]?.id);
  const [open, setOpen] = useState<{ item: MenuItem; illustration: IllustrationKind } | null>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Deep links: /menu/#sweets-desserts opens that category — on load and
  // whenever the hash changes (e.g. a link to another category on this page).
  const ids = categories.map((c) => c.id).join(",");
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (ids.split(",").includes(id)) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [ids]);

  const current = categories.some((c) => c.id === active) ? active : categories[0]?.id;

  function select(id: string, focus = false) {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }

  function onTabKey(e: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      Home: -index,
      End: categories.length - 1 - index,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (index + keys[e.key] + categories.length) % categories.length;
    select(categories[next].id, true);
  }

  return (
    <div className="font-hand">
      {/* Without JS, show every category. */}
      <noscript>
        <style>{"[data-menu-panel]{display:block!important}"}</style>
      </noscript>

      {/* painted category signs */}
      <div
        role="tablist"
        aria-label={labels.categories}
        className="flex flex-wrap justify-center gap-3 sm:gap-4"
      >
        {categories.map((c, i) => {
          const selected = c.id === current;
          return (
            <a
              key={c.id}
              ref={(el) => {
                tabRefs.current[c.id] = el;
              }}
              href={`#${c.id}`}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`panel-${c.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                select(c.id);
              }}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "flex items-center gap-2 rounded-lg border-2 border-ink px-4 py-2 font-display text-lg transition-[transform,background-color] sm:text-xl",
                selected
                  ? "-rotate-1 bg-yellow text-ink shadow-print"
                  : "bg-paper text-ink shadow-print-sm hover:bg-yellow-soft motion-safe:hover:-rotate-1",
              )}
            >
              <span aria-hidden="true" className="w-8 shrink-0">
                <FoodIllustration kind={c.illustration} />
              </span>
              {t(c.name, locale)}
            </a>
          );
        })}
      </div>

      {/* the board: wooden frame, chalkboard inside */}
      <div className="relative mt-10">
        <div
          aria-hidden="true"
          className="absolute -top-8 left-1/2 hidden h-8 w-2/3 -translate-x-1/2 sm:block"
        >
          <svg viewBox="0 0 400 32" className="size-full" preserveAspectRatio="none">
            <path d="M10 32 L200 2 L390 32" stroke="#4E2E1A" strokeWidth="3" fill="none" />
            <circle cx="200" cy="4" r="5" fill="#2B1D16" />
          </svg>
        </div>
        <div className="rounded-xl border-[10px] border-wood bg-wood-dark shadow-print-lg sm:border-[14px]">
          <div className="rounded-sm texture-chalkboard px-4 py-8 text-cream sm:px-10 sm:py-12">
            {categories.map((c) => (
              <section
                key={c.id}
                id={`panel-${c.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${c.id}`}
                data-menu-panel
                hidden={c.id !== current}
                className="mx-auto max-w-3xl"
              >
                <header className="text-center">
                  <h2 className="font-display text-4xl text-yellow sm:text-5xl">{t(c.name, locale)}</h2>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    className="mx-auto mt-1 h-3 w-48"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M4 8 Q60 2 100 7 T196 5"
                      stroke="#F6EBD3"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                  {c.description && <p className="mt-2 text-xl text-cream/80">{t(c.description, locale)}</p>}
                </header>

                <ul className="mt-8 divide-y divide-dashed divide-cream/20">
                  {c.items.map((item) => {
                    const soldOut = item.status === "sold-out";
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setOpen({ item, illustration: c.illustration })}
                          aria-haspopup="dialog"
                          className="group flex w-full items-start gap-4 rounded-lg px-2 py-4 text-left transition-colors hover:bg-cream/5 focus-visible:bg-cream/5"
                        >
                          <MenuPhoto
                            item={item}
                            illustration={c.illustration}
                            locale={locale}
                            labels={{ ...labels, samplePhoto: "" }}
                            sizes="96px"
                            className={cn(
                              "size-16 shrink-0 rounded-md border-2 border-cream/30 sm:size-20",
                              soldOut && "opacity-50 grayscale",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              {item.diet && (
                                <span className="rounded-sm bg-cream p-0.5">
                                  <DietMark diet={item.diet} label={labels.diet[item.diet]} />
                                </span>
                              )}
                              <span
                                className={cn(
                                  "text-2xl leading-tight font-bold sm:text-3xl",
                                  soldOut && "text-cream/60 line-through decoration-2",
                                )}
                              >
                                {t(item.name, locale)}
                              </span>
                              <span
                                aria-hidden="true"
                                className="mx-1 hidden flex-1 translate-y-[-6px] border-b-2 border-dotted border-cream/40 sm:block"
                              />
                              <span className="ml-auto shrink-0 text-2xl font-bold text-yellow tabular-nums sm:text-3xl">
                                {formatPrice(item.price, locale)}
                              </span>
                            </span>
                            {item.description && (
                              <span className="mt-1 block text-lg leading-snug text-cream/80">
                                {t(item.description, locale)}
                              </span>
                            )}
                            <span className="mt-2 flex flex-wrap items-center gap-2">
                              {soldOut && <SoldOutStamp label={labels.soldOut} className="text-xs" />}
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-yellow px-2 text-sm text-yellow"
                                >
                                  {labels.tags[tag]}
                                </span>
                              ))}
                              {item.sample && (
                                <span className="rounded border border-dashed border-cream/40 px-1.5 text-xs text-cream/60 uppercase">
                                  {labels.sample}
                                </span>
                              )}
                              <span className="ml-auto font-sans text-xs text-cream/50 underline underline-offset-2 group-hover:text-cream">
                                {labels.viewDetails}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>

      <ItemDialog open={open} onClose={() => setOpen(null)} locale={locale} labels={labels} />
    </div>
  );
}

/** Product details in a native modal dialog (focus trap, Esc to close, focus restored). */
function ItemDialog({
  open,
  onClose,
  locale,
  labels,
}: {
  open: { item: MenuItem; illustration: IllustrationKind } | null;
  onClose: () => void;
  locale: Locale;
  labels: MenuLabels;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const item = open?.item;
  const soldOut = item?.status === "sold-out";
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
      aria-labelledby="menu-dialog-title"
      className="m-auto w-[min(34rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-xl border-2 border-ink bg-paper p-0 font-sans text-ink shadow-print-lg backdrop:bg-ink/70"
    >
      {item && open && (
        <div>
          <div className="relative">
            <MenuPhoto
              item={item}
              illustration={open.illustration}
              locale={locale}
              labels={labels}
              sizes="(min-width: 560px) 544px, 100vw"
              priority
              className={cn("aspect-[4/3]", soldOut && "grayscale")}
            />
            {soldOut && <SoldOutStamp label={labels.soldOut} className="absolute top-4 left-4 text-lg" />}
            <form method="dialog" className="absolute top-3 right-3">
              <button
                type="submit"
                aria-label={labels.close}
                className="grid size-11 place-items-center rounded-full border-2 border-ink bg-cream shadow-print-sm hover:bg-yellow"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </form>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-baseline gap-3">
              <h2 id="menu-dialog-title" className="font-display text-3xl text-red">
                {t(item.name, locale)}
              </h2>
              <p className="ml-auto shrink-0 rounded-full border-2 border-ink bg-yellow px-3 py-0.5 font-heading text-xl font-bold tabular-nums">
                {formatPrice(item.price, locale)}
              </p>
            </div>
            {item.diet && (
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                <DietMark diet={item.diet} label={labels.diet[item.diet]} />
                <span aria-hidden="true">{labels.diet[item.diet]}</span>
              </p>
            )}
            {item.description && <p className="mt-3 text-lg">{t(item.description, locale)}</p>}
            {item.details && <p className="mt-2 text-ink-muted">{t(item.details, locale)}</p>}
            {item.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="sr-only">{labels.highlights}</h3>
                <ul className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-red px-3 py-0.5 font-heading text-sm font-semibold text-cream"
                    >
                      {labels.tags[tag]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-5 border-t border-cream-dark pt-3 text-sm text-ink-muted">
              {labels.menuOnlyNote}
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}
