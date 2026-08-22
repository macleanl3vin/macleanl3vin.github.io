"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/primitives";

/* --------------------------------------------------------------------------
 * Sticky table of contents with scroll spy.
 *
 * Rendered as a real <nav> of anchors, so it works with keyboard navigation
 * and without JavaScript; the observer only adds the "you are here" state.
 * ----------------------------------------------------------------------- */

export function Toc({
  sections,
}: {
  sections: { id: string; index: string; title: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry nearest the top of the reading area.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -68% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections" className="lg:sticky lg:top-28">
      <Label className="hidden lg:block">CONTENTS</Label>

      <ol className="mt-0 flex gap-x-5 gap-y-1 overflow-x-auto pb-2 lg:mt-6 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0 thin-scroll">
        {sections.map((section) => {
          const current = active === section.id;
          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                aria-current={current ? "true" : undefined}
                className={`group flex items-baseline gap-3 py-1.5 text-[0.82rem] whitespace-nowrap transition-colors duration-300 lg:whitespace-normal ${
                  current ? "text-ink" : "text-faint hover:text-muted"
                }`}
              >
                <span
                  className={`tnum shrink-0 font-mono text-[0.68rem] tracking-widest transition-colors duration-300 ${
                    current ? "text-cyan" : "text-faint/70"
                  }`}
                >
                  {section.index}
                </span>
                <span>{section.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
