import Link from "next/link";
import type { ReactNode } from "react";

/* ========================================================================== */
/* Layout shell                                                               */
/* ========================================================================== */

export function Shell({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-8 ${
        wide ? "max-w-[92rem]" : "max-w-shell"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A page section with consistent vertical rhythm and a hairline top rule.
 * `id` doubles as the scroll-spy target for the navigation.
 */
export function Section({
  id,
  children,
  className = "",
  rule = true,
  tight = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  rule?: boolean;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 ${
        tight ? "py-16 sm:py-20" : "py-20 sm:py-28 lg:py-36"
      } ${className}`}
    >
      {rule && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-line-faint sm:inset-x-8"
        />
      )}
      {children}
    </section>
  );
}

/* ========================================================================== */
/* Typographic primitives                                                     */
/* ========================================================================== */

/** Uppercase monospace annotation — the site's scientific label language. */
export function Label({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "p" | "dt";
}) {
  return <Tag className={`label ${className}`}>{children}</Tag>;
}

/**
 * Section heading: a monospace eyebrow, a display title, and an optional
 * lede constrained to a readable measure.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  aside,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`mb-14 sm:mb-20 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <Label className="label-bright">{eyebrow}</Label>
        {aside ? <div className="label">{aside}</div> : null}
      </div>
      <h2 className="display mt-6 text-[clamp(1.9rem,4.2vw,3.1rem)] text-ink">
        {title}
      </h2>
      {lede ? (
        <p className="prose-measure mt-5 text-[0.975rem] leading-relaxed text-muted">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-line-faint ${className}`} />;
}

/* ========================================================================== */
/* Technical metadata                                                         */
/* ========================================================================== */

export function MetaGrid({
  items,
  className = "",
  columns = 4,
}: {
  items: { key: string; value: string }[];
  className?: string;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";

  return (
    <dl className={`grid gap-x-6 gap-y-7 ${cols} ${className}`}>
      {items.map((item) => (
        <div key={item.key}>
          <dt className="label">{item.key}</dt>
          <dd className="tnum mt-2.5 text-sm text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Small bordered keyword chip used for technical tag lists. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="label border border-line px-2.5 py-1.5 text-faint transition-colors duration-300 hover:border-line-strong hover:text-muted">
      {children}
    </li>
  );
}

export function TagRow({
  tags,
  className = "",
}: {
  tags: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}

/* ========================================================================== */
/* Figures                                                                    */
/* ========================================================================== */

/**
 * Research-style figure wrapper. The caption is the numbered scientific
 * annotation; `note` carries provenance (e.g. "illustrative parameters").
 */
export function Figure({
  number,
  caption,
  note,
  children,
  className = "",
  bleed = false,
}: {
  number: string;
  caption: string;
  note?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className={`overflow-hidden border border-line bg-surface ${
          bleed ? "" : "p-4 sm:p-6"
        }`}
      >
        {children}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <Label className="label-bright shrink-0">FIG. {number}</Label>
        <span className="text-[0.8rem] leading-relaxed text-muted">
          {caption}
        </span>
        {note ? (
          <Label className="text-faint/80">— {note}</Label>
        ) : null}
      </figcaption>
    </figure>
  );
}

/* ========================================================================== */
/* Links & actions                                                            */
/* ========================================================================== */

const arrowFor = {
  right: "→",
  external: "↗",
} as const;

export function ActionLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
}) {
  const base =
    "group inline-flex items-center gap-2.5 rounded-md px-5 py-3 text-sm font-medium transition-colors duration-300";

  const styles =
    variant === "primary"
      ? "border border-cyan/35 bg-cyan/8 text-cyan hover:border-cyan/60 hover:bg-cyan/12"
      : "border border-line text-muted hover:border-line-strong hover:text-ink";

  const arrow = (
    <span
      aria-hidden="true"
      className={external ? "arrow-shift-diag" : "arrow-shift"}
    >
      {external ? arrowFor.external : arrowFor.right}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${base} ${styles} ${className}`}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
      {arrow}
    </Link>
  );
}

/** Inline text link with a growing underline. */
export function TextLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `underline-grow text-muted transition-colors duration-300 hover:text-ink ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ========================================================================== */
/* Missing-content state                                                      */
/* ========================================================================== */

/**
 * Explicit, designed placeholder. Used wherever real content does not exist
 * yet — preferable to inventing results to fill space.
 */
export function Pending({
  note,
  label = "In Preparation",
}: {
  note: string;
  label?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed border-line bg-surface/60 px-6 py-8 sm:px-8">
      <div
        aria-hidden="true"
        className="dot-texture pointer-events-none absolute inset-0"
      />
      <div className="relative">
        <Label className="text-faint">STATUS: {label}</Label>
        <p className="prose-measure mt-4 text-[0.9rem] leading-relaxed text-muted">
          {note}
        </p>
      </div>
    </div>
  );
}
