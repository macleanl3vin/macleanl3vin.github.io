import type { ReactNode } from "react";
import { accentVar } from "@/lib/accent";
import type { Accent } from "@/lib/content/areas";
import { Label } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * PharML PK architecture: structure → graph → learned parameters → mechanism
 * → exposure → interaction.
 *
 * Built as HTML modules with SVG connectors rather than one large SVG, so the
 * labels reflow and remain legible at every breakpoint instead of scaling into
 * illegibility on a phone.
 *
 * Accent semantics: teal = molecular, violet = learned, cyan = mechanistic
 * and output.
 * ----------------------------------------------------------------------- */

type Stage = {
  id: string;
  index: string;
  kind: string;
  title: string;
  detail: string;
  accent: Accent;
  glyph: ReactNode;
};

const g = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ---- glyphs (28×28, currentColor) --------------------------------------- */

const MoleculeGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M14 5.5 L20.5 9.2 L20.5 16.6 L14 20.3 L7.5 16.6 L7.5 9.2 Z" />
    <path {...g} d="M14 5.5 L14 1.8 M20.5 16.6 L24.4 19" strokeOpacity="0.6" />
    <circle cx="14" cy="1.8" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="24.4" cy="19" r="1.7" fill="currentColor" stroke="none" />
  </svg>
);

const GraphGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M6 8 L14 4 L22 9 M6 8 L10 19 M14 4 L15.5 14 M22 9 L15.5 14 M10 19 L15.5 14 M10 19 L21 21" strokeOpacity="0.75" />
    <circle cx="6" cy="8" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="4" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="22" cy="9" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="14" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="10" cy="19" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="21" cy="21" r="2.1" fill="currentColor" stroke="none" />
  </svg>
);

const NetworkGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} strokeOpacity="0.5" d="M6 6 L14 5 L6 6 L14 14 L6 6 L14 23 M6 14 L14 5 M6 14 L14 14 M6 14 L14 23 M6 22 L14 5 M6 22 L14 14 M6 22 L14 23 M14 5 L22 14 M14 14 L22 14 M14 23 L22 14" />
    <circle cx="6" cy="6" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="6" cy="14" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="6" cy="22" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="14" cy="5" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="14" cy="14" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="14" cy="23" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="22" cy="14" r="2.2" fill="currentColor" stroke="none" />
  </svg>
);

const ParamGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M4 7.5 H24 M4 14 H24 M4 20.5 H24" strokeOpacity="0.55" />
    <circle cx="9" cy="7.5" r="2.6" fill="currentColor" stroke="none" />
    <circle cx="18" cy="14" r="2.6" fill="currentColor" stroke="none" />
    <circle cx="13" cy="20.5" r="2.6" fill="currentColor" stroke="none" />
  </svg>
);

const OdeGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M3 22 C 8 22, 7 6, 12 6 S 17 20, 22 20 S 26 12, 26 12" />
    <path {...g} d="M3 4 V 24 H 25" strokeOpacity="0.4" />
  </svg>
);

const CurveGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M3 5 V 23.5 H 26" strokeOpacity="0.4" />
    <path {...g} d="M4 23 C 8 23, 8 8, 13 8 C 19 8, 20 20, 26 21.5" />
    <circle cx="13" cy="8" r="1.9" fill="currentColor" stroke="none" />
  </svg>
);

const DdiGlyph = (
  <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
    <path {...g} d="M3 5 V 23.5 H 26" strokeOpacity="0.4" />
    <path {...g} d="M4 23 C 8 23, 8 11, 13 11 C 19 11, 20 21, 26 22" strokeOpacity="0.5" />
    <path {...g} strokeDasharray="3 3" d="M4 23 C 8 23, 7 5, 13 5 C 20 5, 20 18, 26 19.5" />
  </svg>
);

/* ---- stages ------------------------------------------------------------- */

const stages: Stage[] = [
  {
    id: "structure",
    index: "01",
    kind: "Input",
    title: "Molecular Structure",
    detail: "Atoms, bonds and substructure for every compound in the regimen.",
    accent: "teal",
    glyph: MoleculeGlyph,
  },
  {
    id: "graph",
    index: "02",
    kind: "Representation",
    title: "Heterogeneous Graph",
    detail:
      "Typed nodes — drug, enzyme, reaction, metabolite, compartment — joined by typed relations.",
    accent: "teal",
    glyph: GraphGlyph,
  },
  {
    id: "gnn",
    index: "03",
    kind: "Learned",
    title: "Graph Neural Network",
    detail: "Relation-specific message passing over the typed structure.",
    accent: "violet",
    glyph: NetworkGlyph,
  },
  {
    id: "params",
    index: "04",
    kind: "Learned",
    title: "Disposition Parameters",
    detail:
      "Absorption and elimination rates, apparent volumes, and enzyme kinetic constants.",
    accent: "violet",
    glyph: ParamGlyph,
  },
  {
    id: "ode",
    index: "05",
    kind: "Mechanistic",
    title: "Mechanistic ODE System",
    detail:
      "Compartmental equations integrated forward — mass-conserving and differentiable.",
    accent: "cyan",
    glyph: OdeGlyph,
  },
  {
    id: "curve",
    index: "06",
    kind: "Output",
    title: "Concentration vs Time",
    detail: "Plasma trajectories for each compound over the dosing horizon.",
    accent: "cyan",
    glyph: CurveGlyph,
  },
  {
    id: "ddi",
    index: "07",
    kind: "Analysis",
    title: "Drug–Drug Interaction",
    detail:
      "Exposure shift when two substrates compete for the same enzyme.",
    accent: "cyan",
    glyph: DdiGlyph,
  },
];

/** Thin connector with an arrowhead; draws itself in on reveal. */
function Connector({ accent }: { accent: Accent }) {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg
        viewBox="0 0 12 44"
        className="h-9 w-3 overflow-visible"
        style={{ color: accentVar[accent] }}
      >
        <path
          className="trace"
          d="M6 1 V 34"
          stroke="var(--color-line-strong)"
          strokeWidth="1.2"
          fill="none"
          style={{ ["--len" as string]: 40 }}
        />
        <path
          d="M2.5 30 L6 35 L9.5 30"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

export function ArchitectureDiagram({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <ol className="list-none">
        {stages.map((stage, i) => (
          <li key={stage.id}>
            <Reveal delay={i * 55}>
              <article
                className="group grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-2 rounded-lg border border-line bg-surface px-4 py-4 transition-colors duration-300 hover:border-line-strong hover:bg-elevated sm:grid-cols-[auto_auto_1fr] sm:gap-x-6 sm:px-6 sm:py-5"
                style={{ color: accentVar[stage.accent] }}
              >
                <span className="label mt-0.5 tnum shrink-0 self-center text-faint">
                  {stage.index}
                </span>

                <span
                  className="shrink-0 self-center opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: accentVar[stage.accent] }}
                >
                  {stage.glyph}
                </span>

                <div className="col-span-2 sm:col-span-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[0.975rem] font-medium text-ink">
                      {stage.title}
                    </h3>
                    <Label className="shrink-0">
                      {stage.kind}
                    </Label>
                  </div>
                  <p className="mt-1.5 max-w-[46ch] text-[0.82rem] leading-relaxed text-muted">
                    {stage.detail}
                  </p>
                </div>
              </article>
            </Reveal>

            {i < stages.length - 1 && (
              <Reveal>
                <Connector accent={stages[i + 1].accent} />
              </Reveal>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
