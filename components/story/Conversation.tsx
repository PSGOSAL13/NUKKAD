import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/cn";
import type { story as storyContent } from "@/lib/content";

type Exchange = (typeof storyContent)["conversation"][number];

/**
 * The founder's story as a conversation over chai: the guest's question on
 * the right (cream note), the founder's answer on the left (paper card with
 * a small kulhad). Placeholder answers are visibly marked for editing.
 */
export function Conversation({
  exchanges,
  founderName,
  locale,
  dict,
  className,
}: {
  exchanges: Exchange[];
  founderName: string;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <ol className={cn("space-y-6", className)}>
      {exchanges.map((x) => (
        <li key={x.id} id={x.id} className="scroll-mt-28 space-y-3">
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-sm border border-cream-dark bg-yellow-soft px-4 py-3 text-lg">
              <span className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">
                {dict.common.you}
              </span>
              {t(x.question, locale)}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-red text-cream"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M5 9h14l-2 11H7z" />
                <path
                  d="M9 7c-1-1.5 1-2 0-3.5M12 7c-1-1.5 1-2 0-3.5M15 7c-1-1.5 1-2 0-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </span>
            <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm border-2 border-ink bg-paper px-4 py-3 text-lg shadow-print-sm">
              <span className="block text-xs font-semibold tracking-wide text-red uppercase">
                {founderName}
              </span>
              {x.answer.map((p, i) => {
                const text = t(p, locale);
                const placeholder = text.includes("PLACEHOLDER");
                return (
                  <p
                    key={i}
                    className={cn(
                      placeholder &&
                        "rounded border border-dashed border-ink-muted/40 px-2 py-1 text-base text-ink-muted italic",
                    )}
                  >
                    {text}
                  </p>
                );
              })}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
