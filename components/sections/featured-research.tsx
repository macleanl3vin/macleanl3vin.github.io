import Link from "next/link";
import { ArchitectureDiagram } from "@/components/diagrams/architecture-diagram";
import { CursorLight } from "@/components/ui/cursor-light";
import {
  ActionLink,
  Label,
  MetaGrid,
  Section,
  Shell,
  TagRow,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { featuredProject } from "@/lib/content/projects";

/* --------------------------------------------------------------------------
 * Flagship research panel.
 *
 * The strongest block on the homepage: a wide bordered surface holding the
 * project statement on the left and the full architecture flow on the right,
 * stacking to a single column below lg.
 * ----------------------------------------------------------------------- */

export function FeaturedResearch() {
  const p = featuredProject;

  return (
    <Section id="research">
      <Shell>
        <header className="mb-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 sm:mb-16">
          <Label className="label-bright">SELECTED RESEARCH / {p.year}</Label>
          <Label>STATUS: {p.status.toUpperCase()}</Label>
        </header>

        <CursorLight
          as="article"
          className="overflow-hidden rounded-xl border border-line bg-surface"
        >
          <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
            {/* ---- statement ------------------------------------------- */}
            <div className="border-b border-line px-6 py-10 sm:px-10 sm:py-14 lg:border-r lg:border-b-0">
              <Reveal>
                <div className="flex items-center gap-3">
                  <Label className="tnum text-cyan">{p.index}</Label>
                  <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
                  <Label>{p.category.toUpperCase()}</Label>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h2 className="display mt-8 text-[clamp(2.2rem,5.4vw,3.4rem)] text-ink">
                  {p.title}
                </h2>
              </Reveal>

              <Reveal delay={110}>
                <p className="mt-6 max-w-[38ch] text-[clamp(1.02rem,2vw,1.2rem)] leading-snug text-muted">
                  {p.summary}
                </p>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-10 border-t border-line-faint pt-8">
                  <MetaGrid items={[...p.meta]} columns={4} />
                </div>
              </Reveal>

              <Reveal delay={210}>
                <TagRow tags={p.tags} className="mt-9" />
              </Reveal>

              <Reveal delay={260}>
                <div className="mt-10">
                  <ActionLink href={`/research/${p.slug}`}>
                    Read the write-up
                  </ActionLink>
                </div>
              </Reveal>
            </div>

            {/* ---- architecture ---------------------------------------- */}
            <div className="relative px-4 py-10 sm:px-8 sm:py-14">
              <div
                aria-hidden="true"
                className="dot-texture pointer-events-none absolute inset-0"
              />

              <div className="relative">
                <Label className="label-bright">MODEL ARCHITECTURE</Label>
                <ArchitectureDiagram className="mt-7" />

                <p className="label mt-7 border-t border-line-faint pt-5 leading-relaxed">
                  FIG. 01 — Hybrid model architecture: bounded learned
                  modulation, mechanistic dynamics
                </p>
              </div>
            </div>
          </div>
        </CursorLight>

        <Reveal>
          <p className="mt-8 text-[0.85rem] text-faint">
            More on the mechanism, the equations and the open questions in the{" "}
            <Link
              href={`/research/${p.slug}`}
              className="underline-grow text-muted transition-colors duration-300 hover:text-ink"
            >
              full write-up
            </Link>
            .
          </p>
        </Reveal>
      </Shell>
    </Section>
  );
}
