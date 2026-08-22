import type { ReactNode } from "react";
import { Label, Shell } from "./primitives";
import { Reveal } from "./reveal";

/**
 * Shared header for interior pages: eyebrow, display title, lede, and an
 * optional metadata strip. Keeps every route on the same vertical rhythm.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  meta?: { key: string; value: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-texture absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 80% at 20% -20%, transparent 30%, var(--color-base) 78%)",
          }}
        />
      </div>

      <Shell>
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-cyan/50" />
            <Label className="label-bright">{eyebrow}</Label>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="display mt-7 max-w-[18ch] text-[clamp(2.3rem,6.4vw,4rem)] text-ink">
            {title}
          </h1>
        </Reveal>

        {lede ? (
          <Reveal delay={110}>
            <p className="prose-measure mt-7 text-[1rem] leading-relaxed text-muted">
              {lede}
            </p>
          </Reveal>
        ) : null}

        {meta?.length ? (
          <Reveal delay={160}>
            <dl className="mt-12 grid max-w-3xl gap-x-6 gap-y-7 border-t border-line-faint pt-8 grid-cols-2 sm:grid-cols-4">
              {meta.map((item) => (
                <div key={item.key}>
                  <dt className="label">{item.key.toUpperCase()}</dt>
                  <dd className="tnum mt-2.5 text-sm text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {children}
      </Shell>
    </header>
  );
}
