import type { Accent } from "./content/areas";

/**
 * Accent semantics used across the site:
 *   cyan   → computation, data, model outputs
 *   teal   → molecular / biological / mechanistic systems
 *   violet → machine learning, neural networks
 *
 * Tailwind cannot see dynamically-built class names, so accent-dependent
 * styling goes through explicit maps rather than string interpolation.
 */

export const accentVar: Record<Accent, string> = {
  cyan: "var(--color-cyan)",
  teal: "var(--color-teal)",
  violet: "var(--color-violet)",
};

export const accentDimVar: Record<Accent, string> = {
  cyan: "var(--color-cyan-dim)",
  teal: "var(--color-teal-dim)",
  violet: "var(--color-violet-dim)",
};

export const accentText: Record<Accent, string> = {
  cyan: "text-cyan",
  teal: "text-teal",
  violet: "text-violet",
};

/** Inline style carrying the accent as a custom property. */
export function accentStyle(accent: Accent): React.CSSProperties {
  return {
    ["--accent" as string]: accentVar[accent],
    ["--accent-dim" as string]: accentDimVar[accent],
  };
}
