import { ArchitectureDiagram } from "@/components/diagrams/architecture-diagram";
import { HeteroGraph } from "@/components/diagrams/hetero-graph";
import {
  CompartmentDiagram,
  ConcentrationPlot,
  DdiSchematic,
  type Series,
} from "@/components/diagrams/plots";
import { EquationBlock } from "@/components/diagrams/equations";
import { Figure, Label, Pending } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { simulateDdi } from "@/lib/pk";
import type { Block, FigureId } from "@/lib/content/projects";

/* --------------------------------------------------------------------------
 * Renders the content blocks of a research write-up.
 *
 * Figures are addressed by id from the content model, so a section can request
 * a diagram without the data file importing React components.
 * ----------------------------------------------------------------------- */

const ILLUSTRATIVE = "illustrative parameters";

function pkSeries(): Series[] {
  const base = {
    kaA: 1.1,
    vA: 32,
    doseA: 500,
    vmax: 3.4,
    km: 4.2,
    kaB: 0.9,
    keB: 0.22,
    vB: 48,
    doseB: 0,
    ki: 2.6,
  };

  return [
    {
      id: "pk-500",
      label: "500 mg — single dose",
      accent: "cyan" as const,
      markPeak: true,
      points: simulateDdi(base, 24, 360).victim,
    },
  ];
}

function ddiSeries(): Series[] {
  const base = {
    kaA: 1.1,
    vA: 32,
    doseA: 500,
    vmax: 3.4,
    km: 4.2,
    kaB: 0.9,
    keB: 0.22,
    vB: 48,
    doseB: 0,
    ki: 2.6,
  };

  const alone = simulateDdi(base, 24, 480);
  const withB = simulateDdi({ ...base, doseB: 400 }, 24, 480);

  return [
    {
      id: "alone",
      label: "Drug A — alone",
      accent: "teal" as const,
      dashed: true,
      points: alone.victim,
    },
    {
      id: "with",
      label: "Drug A — with inhibitor",
      accent: "cyan" as const,
      points: withB.victim,
    },
    {
      id: "perp",
      label: "Drug B — inhibitor",
      accent: "violet" as const,
      points: withB.perpetrator,
    },
  ];
}

function FigureBody({ id }: { id: FigureId }) {
  switch (id) {
    case "architecture":
      return <ArchitectureDiagram />;
    case "hetero-graph":
      return <HeteroGraph variant="interactive" />;
    case "compartments":
      return <CompartmentDiagram />;
    case "ddi":
      return (
        <div className="flex flex-col gap-8">
          <DdiSchematic />
          <ConcentrationPlot series={ddiSeries()} hours={24} />
        </div>
      );
    case "pk-curve":
      return <ConcentrationPlot series={pkSeries()} hours={24} />;
  }
}

/** Figures that plot simulated data carry an explicit provenance note. */
const simulated: FigureId[] = ["pk-curve", "ddi"];

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="flex flex-col gap-6">
          {block.paragraphs.map((text, i) => (
            <Reveal key={i} delay={i * 40}>
              <p className="max-w-[64ch] text-[0.975rem] leading-[1.75] text-muted">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      );

    case "terms":
      return (
        <div>
          {block.intro ? (
            <Reveal>
              <p className="max-w-[64ch] text-[0.975rem] leading-[1.75] text-muted">
                {block.intro}
              </p>
            </Reveal>
          ) : null}

          <dl className="mt-9 flex flex-col">
            {/* One <div> level only — <dl> permits a single div wrapper
                around its <dt>/<dd> pairs. */}
            {block.items.map((item, i) => (
              <Reveal
                key={item.term}
                delay={i * 50}
                className="group grid gap-x-8 gap-y-2 border-t border-line-faint py-6 transition-colors duration-500 hover:border-line sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
              >
                <dt className="text-[0.925rem] font-medium text-ink">
                  <span className="label mr-3 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.term}
                </dt>
                <dd className="max-w-[58ch] text-[0.9rem] leading-relaxed text-muted">
                  {item.detail}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      );

    case "figure":
      return (
        <Reveal>
          <Figure
            number={block.number}
            caption={block.caption}
            note={simulated.includes(block.figure) ? ILLUSTRATIVE : undefined}
          >
            <FigureBody id={block.figure} />
          </Figure>
        </Reveal>
      );

    case "equation":
      return (
        <Reveal>
          <EquationBlock
            number={block.number}
            caption={block.caption}
            system={block.system}
          />
        </Reveal>
      );

    case "pending":
      return (
        <Reveal>
          <Pending note={block.note} />
        </Reveal>
      );
  }
}

export function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="mb-9">
        <Label className="tnum text-cyan">{index}</Label>
        <h2 className="display mt-4 text-[clamp(1.6rem,3.4vw,2.2rem)] text-ink">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
