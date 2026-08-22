import type { ReactNode } from "react";
import {
  ReactionRateEquation,
  SharedDenominatorEquation,
} from "@/components/diagrams/equations";
import { MechanismDiagram } from "@/components/diagrams/mechanism-diagram";
import { Label } from "@/components/ui/primitives";

/* --------------------------------------------------------------------------
 * ODE / mechanistic system tab.
 *
 * Three beats, in order of specificity: what the system does, the two
 * relations that make multi-drug behaviour work, and the state flow they sit
 * inside.
 *
 * Extracted from model-explorer.tsx so the tab's content can grow without the
 * explorer shell becoming unreadable.
 * ----------------------------------------------------------------------- */

/**
 * Equation card. The heading and notes sit at the top and the equation is
 * pushed to the bottom with `mt-auto`, so a pair of cards in a grid keep their
 * equations on the same baseline whatever the note lengths.
 */
function EquationCard({
  eyebrow,
  notes,
  children,
  footnote,
}: {
  eyebrow: string;
  notes: ReactNode[];
  children: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-base px-5 py-6 sm:px-7 sm:py-7">
      <Label className="label-bright">{eyebrow}</Label>

      <ul className="mt-5 flex flex-col gap-2.5">
        {notes.map((note, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[0.82rem] leading-relaxed text-muted"
          >
            <span
              aria-hidden="true"
              className="mt-[0.5em] size-1 shrink-0 rounded-full bg-line-strong"
            />
            <span>{note}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 border-t border-line-faint pt-7">
        {children}
        {footnote ? (
          <p className="label mt-5 text-faint/80">{footnote}</p>
        ) : null}
      </div>
    </div>
  );
}

/** Inline mono fragment, for parameter names inside running text. */
function P({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.92em] text-ink">{children}</span>;
}

export function OdePanel() {
  return (
    <div>
      <div>
        <h3 className="text-[1.05rem] font-medium text-ink">
          Mechanistic system
        </h3>
        <p className="mt-2.5 max-w-[68ch] text-[0.875rem] leading-relaxed text-muted">
          The ODE framework evolves drug mass through plasma and hepatic states
          while preserving the mechanistic structure of the system. Shared
          enzymes use a common denominator: substrates contribute{" "}
          <P>C/Kₘ</P> terms, inhibitors contribute <P>I/Kᵢ</P> terms, and
          interaction effects are evaluated using liver concentration.
        </p>
      </div>

      {/* ---- the two relations ------------------------------------------- */}
      <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
        <EquationCard
          eyebrow="SHARED ENZYME DENOMINATOR"
          notes={[
            <>
              Substrates contribute <P>C/Kₘ</P> terms on shared enzymes.
            </>,
            <>
              Inhibitors contribute <P>I/Kᵢ</P> terms.
            </>,
            <>
              Competition and inhibition are evaluated using hepatic
              concentration.
            </>,
          ]}
          footnote="ONE DENOMINATOR PER ENZYME, SHARED BY ITS SUBSTRATES"
        >
          <SharedDenominatorEquation />
        </EquationCard>

        <EquationCard
          eyebrow="REACTION RATE"
          notes={[
            <>
              <P>Vmax,r = Kcat,r [E]r</P> is the reaction&rsquo;s kinetic
              capacity.
            </>,
            <>
              <P>fGNN,r</P> is bounded learned modulation.
            </>,
            <>
              The shared denominator carries substrate competition and
              inhibition.
            </>,
          ]}
          footnote="KINETIC CAPACITY × LEARNED FACTOR × SUBSTRATE TERM / SHARED DENOMINATOR"
        >
          <ReactionRateEquation />
        </EquationCard>
      </div>

      {/* ---- state flow --------------------------------------------------- */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <Label className="label-bright">MECHANISTIC PROCESS</Label>
          <Label>ONE SHARED SYSTEM · NOT PER-DRUG PIPELINES</Label>
        </div>

        <div className="flex items-center justify-center rounded-lg border border-line bg-base px-3 py-5 sm:px-5">
          <MechanismDiagram />
        </div>
      </div>
    </div>
  );
}
