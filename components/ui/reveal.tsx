"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Scroll reveal: a short fade plus vertical translate, executed entirely in
 * CSS and triggered by IntersectionObserver.
 *
 * How the "safe by default" behaviour works:
 *
 *  1. `.reveal` is *visible* in the base stylesheet. Nothing is ever hidden
 *     unless something explicitly opts in.
 *  2. A tiny blocking script in the document head (see REVEAL_ARM_SCRIPT) adds
 *     `data-reveal-ready` to <html> before first paint — but only when the
 *     visitor has not asked for reduced motion. That attribute is what arms
 *     the hidden initial state, so there is no flash of visible content.
 *  3. That same script starts a failsafe timer which disarms everything again.
 *     The first Reveal to mount cancels it. So if the bundle fails to load or
 *     hydration never happens, the page un-hides itself rather than staying
 *     blank.
 * ----------------------------------------------------------------------- */

export const REVEAL_ARM_SCRIPT = `
try {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var d = document.documentElement;
    d.setAttribute('data-reveal-ready', 'true');
    window.__revealFailsafe = setTimeout(function () {
      d.removeAttribute('data-reveal-ready');
    }, 4000);
  }
} catch (e) {}
`.trim();

declare global {
  interface Window {
    __revealFailsafe?: ReturnType<typeof setTimeout>;
  }
}

let failsafeCleared = false;

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Hydration happened — the page can reveal itself, so drop the failsafe.
    if (!failsafeCleared) {
      failsafeCleared = true;
      if (window.__revealFailsafe) {
        clearTimeout(window.__revealFailsafe);
        window.__revealFailsafe = undefined;
      }
    }

    // Nothing was armed (reduced motion, or no observer support), so the
    // content is already visible and there is nothing to do.
    if (
      !document.documentElement.hasAttribute("data-reveal-ready") ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-shown={shown ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
