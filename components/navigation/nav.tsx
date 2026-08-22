"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { primaryNav } from "./commands";
import { site } from "@/lib/content/site";
import { Shell } from "@/components/ui/primitives";
import { useIsMac } from "@/lib/use-platform";

/* --------------------------------------------------------------------------
 * Primary navigation.
 *
 * A thin, translucent bar that gains a border and background only once the
 * page has scrolled, so it sits invisibly over the hero and becomes a defined
 * surface everywhere else.
 * ----------------------------------------------------------------------- */

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const mac = useIsMac();

  // Close the mobile menu when the route changes. Adjusting state during
  // render is React's recommended alternative to a reset effect: it avoids the
  // extra commit an effect would cause.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl K lives here rather than in the palette, because it has to work
  // while the palette is unmounted.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md border border-cyan/40 bg-elevated px-4 py-2 text-sm text-cyan focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || menuOpen
            ? "border-b border-line bg-base/72 backdrop-blur-lg"
            : "border-b border-transparent"
        }`}
      >
        <Shell>
          <div className="flex h-15 items-center justify-between gap-6">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5 text-[0.925rem] font-medium tracking-tight text-ink"
            >
              <Mark />
              <span>{site.name}</span>
            </Link>

            {/* ---- desktop links ---------------------------------------- */}
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {primaryNav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative block rounded-md px-3 py-2 text-[0.85rem] transition-colors duration-300 ${
                          active
                            ? "text-ink"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-3 -bottom-px h-px transition-opacity duration-300 ${
                            active ? "bg-cyan opacity-70" : "opacity-0"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-1.5 rounded-md px-3 py-2 text-[0.85rem] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    GitHub
                    <span aria-hidden="true" className="arrow-shift-diag text-[0.75em]">
                      ↗
                    </span>
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                aria-label={`Open command palette (${mac ? "Command K" : "Control K"})`}
                aria-haspopup="dialog"
                className="group hidden items-center gap-2.5 rounded-md border border-line px-2.5 py-1.5 transition-colors duration-300 hover:border-line-strong sm:flex"
              >
                <span className="label group-hover:text-muted">Search</span>
                <kbd className="label rounded border border-line px-1.5 py-0.5 text-faint/80">
                  {mac ? "⌘K" : "^K"}
                </kbd>
              </button>

              {/* ---- mobile disclosure ---------------------------------- */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="flex size-9 items-center justify-center rounded-md border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-ink md:hidden"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                >
                  {menuOpen ? (
                    <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" />
                  ) : (
                    <path d="M2.5 5 H13.5 M2.5 11 H13.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Shell>

        {/* ---- mobile panel ------------------------------------------- */}
        <div
          id="mobile-nav"
          hidden={!menuOpen}
          className="border-t border-line bg-base/95 backdrop-blur-lg md:hidden"
        >
          <Shell>
            <nav aria-label="Primary mobile">
              <ul className="flex flex-col py-2">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`flex items-center justify-between border-b border-line-faint py-4 text-[0.95rem] ${
                        isActive(item.href) ? "text-cyan" : "text-muted"
                      }`}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-faint">→</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between py-4 text-[0.95rem] text-muted"
                  >
                    GitHub
                    <span aria-hidden="true" className="text-faint">↗</span>
                  </a>
                </li>
              </ul>
            </nav>
          </Shell>
        </div>
      </header>

      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}

/** Small identity mark: a three-node motif, echoing the graph language. */
function Mark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-[18px] shrink-0"
      fill="none"
    >
      <path
        d="M4.5 14.5 L10 5.5 L15.5 14.5"
        stroke="var(--color-line-strong)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="5.5" r="2.1" fill="var(--color-cyan)" />
      <circle cx="4.5" cy="14.5" r="1.9" fill="var(--color-teal)" />
      <circle cx="15.5" cy="14.5" r="1.9" fill="var(--color-violet)" />
    </svg>
  );
}
