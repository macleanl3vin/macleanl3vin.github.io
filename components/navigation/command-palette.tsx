"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCommands, type Command } from "./commands";
import { Label } from "@/components/ui/primitives";
import { useIsMac } from "@/lib/use-platform";

/* --------------------------------------------------------------------------
 * Command palette (⌘K / Ctrl K).
 *
 * Accessibility notes:
 *  - The input keeps DOM focus throughout; the active option is communicated
 *    via aria-activedescendant, which is the correct pattern for a combobox
 *    driving a listbox.
 *  - Focus is restored to whatever opened the palette on close.
 *  - Escape closes; ↑/↓ move; Enter activates; Tab is trapped inside.
 *  - Background content is inert to screen readers via aria-hidden on the
 *    app shell (set by the layout when `open`).
 * ----------------------------------------------------------------------- */

function score(command: Command, query: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = command.label.toLowerCase();
  const haystack = `${label} ${command.group} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();

  if (label.startsWith(q)) return 100;
  if (label.includes(q)) return 60;
  if (haystack.includes(q)) return 30;

  // Loose subsequence match, so "phml" still finds "PharML PK".
  let i = 0;
  for (const char of haystack) {
    if (char === q[i]) i++;
    if (i === q.length) return 10;
  }
  return 0;
}

/**
 * Rendered only while open — the parent unmounts it on close, so `query` and
 * the active index reset naturally instead of being cleared from an effect.
 */
export function CommandPalette({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const uid = useId().replace(/[:]/g, "");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const mac = useIsMac();

  const commands = useMemo(() => buildCommands(), []);

  const results = useMemo(() => {
    return commands
      .map((command) => ({ command, s: score(command, query.trim()) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.command);
  }, [commands, query]);

  /** Results regrouped for display while preserving flat keyboard order. */
  const groups = useMemo(() => {
    const order: Command["group"][] = ["Navigate", "Research", "Elsewhere"];
    const map = new Map<Command["group"], { command: Command; i: number }[]>();
    results.forEach((command, i) => {
      const bucket = map.get(command.group) ?? [];
      bucket.push({ command, i });
      map.set(command.group, bucket);
    });
    return order
      .map((group) => ({ group, items: map.get(group) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const run = useCallback(
    (command: Command) => {
      close();
      if (command.external) {
        window.open(command.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(command.href);
      }
    },
    [close, router],
  );

  /* ---- mount/unmount side effects -------------------------------------- */
  useEffect(() => {
    // Remember what had focus so it can be restored on close.
    const previous = document.activeElement as HTMLElement | null;
    restoreFocus.current = previous;

    // Focus after paint, so the input exists and is not scrolled into view
    // mid-transition.
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    // Lock background scrolling, compensating for the scrollbar so the page
    // behind the palette does not shift.
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreFocus.current?.focus?.();
    };
  }, []);

  /* ---- keep the active option scrolled into view ----------------------- */
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${index}"]`,
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [index]);

  function onQueryChange(value: string) {
    setQuery(value);
    // Selection always returns to the top result as the query changes.
    setIndex(0);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setIndex(Math.max(0, results.length - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[index];
      if (command) run(command);
      return;
    }
    // Trap Tab: the palette is modal, so focus must not escape behind it.
    if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[14vh] sm:pt-[16vh]">
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close command palette"
        onClick={close}
        className="absolute inset-0 cursor-default bg-base/78 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-[34rem] overflow-hidden rounded-xl border border-line-strong bg-elevated shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)]"
      >
        {/* ---- input --------------------------------------------------- */}
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 shrink-0 text-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <circle cx="7" cy="7" r="4.6" />
            <path d="M10.5 10.5 L14 14" strokeLinecap="round" />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`palette-list-${uid}`}
            aria-autocomplete="list"
            aria-activedescendant={
              results[index] ? `palette-option-${uid}-${index}` : undefined
            }
            placeholder="Search research, pages and links…"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent py-4 text-[0.925rem] text-ink outline-none placeholder:text-faint"
          />

          <kbd className="label hidden shrink-0 rounded border border-line px-1.5 py-1 text-faint sm:block">
            ESC
          </kbd>
        </div>

        {/* ---- results ------------------------------------------------- */}
        <div
          ref={listRef}
          id={`palette-list-${uid}`}
          role="listbox"
          aria-label="Commands"
          className="thin-scroll max-h-[min(56vh,26rem)] overflow-y-auto py-2"
        >
          {groups.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-faint">
              No matches for “{query}”.
            </p>
          ) : (
            groups.map(({ group, items }) => (
              <div key={group} className="px-2 py-1.5">
                <Label className="block px-2 py-2">{group}</Label>
                {items.map(({ command, i }) => {
                  const selected = i === index;
                  return (
                    <div
                      key={command.id}
                      id={`palette-option-${uid}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={selected}
                      onClick={() => run(command)}
                      onMouseMove={() => setIndex(i)}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 transition-colors duration-150 ${
                        selected ? "bg-raised" : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-baseline gap-3">
                        <span
                          className={`truncate text-[0.9rem] ${
                            selected ? "text-ink" : "text-muted"
                          }`}
                        >
                          {command.label}
                        </span>
                        {command.hint ? (
                          <span className="truncate text-[0.75rem] text-faint">
                            {command.hint}
                          </span>
                        ) : null}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`shrink-0 text-xs ${
                          selected ? "text-cyan" : "text-faint/50"
                        }`}
                      >
                        {command.external ? "↗" : "→"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* ---- footer -------------------------------------------------- */}
        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
          <div className="flex items-center gap-4">
            <Hint keys="↑ ↓" action="Navigate" />
            <Hint keys="↵" action="Open" />
          </div>
          <Label>{mac ? "⌘ K" : "CTRL K"}</Label>
        </div>
      </div>
    </div>
  );
}

function Hint({ keys, action }: { keys: string; action: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="label rounded border border-line px-1.5 py-0.5 text-faint">
        {keys}
      </kbd>
      <span className="label">{action}</span>
    </span>
  );
}
