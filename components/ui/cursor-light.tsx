"use client";

import { useCallback, useRef, type ReactNode } from "react";

/**
 * Very subtle radial lighting that follows the pointer *inside a single
 * panel* — deliberately not a page-wide effect.
 *
 * The handler writes two custom properties and does no layout reads beyond a
 * cached bounding box, and it is only attached while the pointer is over the
 * element, so there is no always-on event loop.
 */
export function CursorLight({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el || frame.current) return;

    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`cursor-light ${className}`}
    >
      {children}
    </Tag>
  );
}
