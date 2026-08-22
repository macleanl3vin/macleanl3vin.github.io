import type { ReactNode } from "react";
import { Label } from "@/components/ui/primitives";

/* --------------------------------------------------------------------------
 * A minimal math layer.
 *
 * Only fractions, italic variables and sub/superscripts are needed, all of
 * which are handled by ~40 lines of CSS in globals.css. That is a far better
 * trade than shipping a full typesetting library for four equations.
 * ----------------------------------------------------------------------- */

function V({
  children,
  sub,
  sup,
}: {
  children: ReactNode;
  sub?: ReactNode;
  sup?: ReactNode;
}) {
  return (
    <span className="v">
      {children}
      {sup ? <sup>{sup}</sup> : null}
      {sub ? <sub>{sub}</sub> : null}
    </span>
  );
}

/** Summation with an index below-right, kept inline so it never adds height. */
function Sum({ index }: { index: ReactNode }) {
  return (
    <span className="sum">
      ∑<sub>{index}</sub>
    </span>
  );
}

function Op({ children }: { children: ReactNode }) {
  return <span className="op">{children}</span>;
}

function Frac({ over, under }: { over: ReactNode; under: ReactNode }) {
  return (
    <span className="frac">
      <span>{over}</span>
      <span>{under}</span>
    </span>
  );
}

/** d·/dt written as a proper fraction. */
function Deriv({ of, sub }: { of: string; sub?: ReactNode }) {
  return (
    <Frac
      over={
        <>
          d<V sub={sub}>{of}</V>
        </>
      }
      under={
        <>
          d<V>t</V>
        </>
      }
    />
  );
}

/* --------------------------------------------------------------------------
 * The two systems referenced on the research page
 * ----------------------------------------------------------------------- */

/**
 * One-compartment model, first-order absorption into a saturable
 * elimination pathway.
 */
export function PkEquations() {
  return (
    <div className="thin-scroll flex flex-col gap-5 overflow-x-auto">
      <div className="math">
        <Deriv of="A" sub="d" />
        <Op>=</Op>
        <Op>−</Op>
        <V sub="a">k</V>
        <V sub="d">A</V>
      </div>

      <div className="math">
        <Deriv of="C" />
        <Op>=</Op>
        <Frac
          over={
            <>
              <V sub="a">k</V>
              <V sub="d">A</V>
            </>
          }
          under={<V>V</V>}
        />
        <Op>−</Op>
        <Frac
          over={
            <>
              <V sub="max">V</V>
              <V>C</V>
            </>
          }
          under={
            <>
              <V sub="m">K</V>
              <Op>+</Op>
              <V>C</V>
            </>
          }
        />
      </div>
    </div>
  );
}

/**
 * Competitive inhibition: the perpetrator concentration raises the apparent
 * Michaelis constant of the victim's clearance pathway.
 */
export function DdiEquations() {
  return (
    <div className="thin-scroll flex flex-col gap-5 overflow-x-auto">
      <div className="math">
        <Deriv of="C" sub="A" />
        <Op>=</Op>
        <Frac
          over={
            <>
              <V sub="a,A">k</V>
              <V sub="d,A">A</V>
            </>
          }
          under={<V sub="A">V</V>}
        />
        <Op>−</Op>
        <Frac
          over={
            <>
              <V sub="max">V</V>
              <V sub="A">C</V>
            </>
          }
          under={
            <>
              <V sub="m">K</V>
              <Op>(</Op>1<Op>+</Op>
              <Frac over={<V sub="B">C</V>} under={<V sub="i">K</V>} />
              <Op>)</Op>
              <Op>+</Op>
              <V sub="A">C</V>
            </>
          }
        />
      </div>

      <div className="math">
        <Deriv of="C" sub="B" />
        <Op>=</Op>
        <Frac
          over={
            <>
              <V sub="a,B">k</V>
              <V sub="d,B">A</V>
            </>
          }
          under={<V sub="B">V</V>}
        />
        <Op>−</Op>
        <V sub="e,B">k</V>
        <V sub="B">C</V>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * PharML PK — the two relations the ODE tab is built around.
 *
 * `--eq-w` is the equation's natural width in em. The `.math-fit` wrapper uses
 * it to scale the type down with the container so a wide expression shrinks to
 * fit instead of producing a scrollbar.
 * ----------------------------------------------------------------------- */

/**
 * Shared-enzyme denominator: every substrate on the enzyme contributes a
 * C/Km term, every inhibitor an I/Ki term, all evaluated at liver
 * concentration. One denominator per enzyme, not per drug.
 */
export function SharedDenominatorEquation() {
  return (
    <div className="math-fit" style={{ ["--eq-w" as string]: 19 }}>
      <div className="math">
        <V sub="enz">D</V>
        <Op>=</Op>
        <span>1</span>
        <Op>+</Op>
        <Sum index="j" />
        <Frac
          over={
            <V sup="liver" sub="j">
              C
            </V>
          }
          under={<V sub="m,j">K</V>}
        />
        <Op>+</Op>
        <Sum index="k" />
        <Frac
          over={
            <V sup="liver" sub="k">
              I
            </V>
          }
          under={<V sub="i,k">K</V>}
        />
      </div>
    </div>
  );
}

/**
 * Reaction rate: mechanistic kinetic capacity × bounded learned factor ×
 * substrate term over the shared-enzyme denominator. The three parts are
 * spaced so that separation stays visible.
 */
export function ReactionRateEquation() {
  return (
    <div className="math-fit" style={{ ["--eq-w" as string]: 21 }}>
      <div className="math">
        <V sub="r">v</V>
        <Op>=</Op>
        <V sub="cat,r">K</V>
        <V sub="r">[E]</V>
        <Op>·</Op>
        {/* The one learned quantity in the expression — violet, per the
            site's accent semantics. */}
        <span style={{ color: "var(--color-violet)" }}>
          <V sub="GNN,r">f</V>
        </span>
        <Op>·</Op>
        <Frac
          over={
            <>
              <V sup="liver" sub="sub,r">
                C
              </V>
              <Op>∕</Op>
              <V sub="m,r">K</V>
            </>
          }
          under={<V sub="enz(r)">D</V>}
        />
      </div>
    </div>
  );
}

const legends: Record<"pk" | "ddi", { sym: ReactNode; def: string }[]> = {
  pk: [
    { sym: <V sub="d">A</V>, def: "Amount at absorption site" },
    { sym: <V>C</V>, def: "Plasma concentration" },
    { sym: <V sub="a">k</V>, def: "Absorption rate constant" },
    { sym: <V sub="max">V</V>, def: "Maximum metabolic rate" },
    { sym: <V sub="m">K</V>, def: "Michaelis constant" },
    { sym: <V>V</V>, def: "Apparent volume of distribution" },
  ],
  ddi: [
    { sym: <V sub="A">C</V>, def: "Victim concentration" },
    { sym: <V sub="B">C</V>, def: "Perpetrator concentration" },
    { sym: <V sub="i">K</V>, def: "Inhibition constant" },
    { sym: <V sub="e,B">k</V>, def: "Perpetrator elimination rate" },
  ],
};

/**
 * Equation block with a numbered scientific caption and a symbol legend,
 * matching the figure language used elsewhere.
 */
export function EquationBlock({
  number,
  caption,
  system,
}: {
  number: string;
  caption: string;
  system: "pk" | "ddi";
}) {
  return (
    <figure>
      <div className="rounded-lg border border-line bg-surface px-5 py-7 sm:px-8 sm:py-9">
        {system === "pk" ? <PkEquations /> : <DdiEquations />}

        <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-line-faint pt-6 sm:grid-cols-2">
          {legends[system].map((row, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <dt className="math shrink-0 text-[0.95rem] text-muted">
                {row.sym}
              </dt>
              <dd className="text-[0.8rem] leading-snug text-faint">
                {row.def}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <Label className="label-bright shrink-0">EQ. {number}</Label>
        <span className="text-[0.8rem] leading-relaxed text-muted">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}
