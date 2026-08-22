import {accentVar} from "@/lib/accent";
import type {Accent} from "@/lib/content/areas";
import {Label} from "@/components/ui/primitives";
import {Reveal} from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * Interdisciplinary identity.
 *
 * Three disciplines presented as equal columns, then the statement about what
 * connects them. Deliberately not a "passionate developer" biography.
 * ----------------------------------------------------------------------- */

interface Discipline {
  index: string;
  name: string;
  accent: Accent;
  body: string;
}

export const disciplines: Discipline[] = [
  {
    index: "01",
    name: "Computer Science",
    accent: "violet",
    body: "Software systems and machine learning — the engineering that makes a scientific model runnable, reproducible and fast enough to iterate on.",
  },
  {
    index: "02",
    name: "Mathematics",
    accent: "cyan",
    body: "Differential equations, numerical methods and optimization — the language for describing how a system changes and for fitting it to what is observed.",
  },
  {
    index: "03",
    name: "Molecular Science",
    accent: "teal",
    body: "Drug discovery, pharmacokinetics and molecular systems — the domain that decides which questions are worth asking in the first place.",
  },
];

export function AboutColumns() {
  return (
    <div className="grid gap-px border-y border-line-faint bg-line-faint md:grid-cols-3">
      {disciplines.map((d, i) => (
        <Reveal key={d.index} delay={i * 80} className="bg-base">
          <div className="group h-full px-0 py-9 md:px-7 md:py-10">
            <div className="flex items-baseline gap-3">
              <Label className="tnum">
                <span style={{color: accentVar[d.accent]}}>{d.index}</span>
              </Label>
              <h3 className="text-[1rem] font-medium text-ink">{d.name}</h3>
            </div>
            <p className="mt-5 max-w-[40ch] text-[0.875rem] leading-relaxed text-muted">{d.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function AboutStatement() {
  return (
    <Reveal>
      <p className="max-w-[46ch] text-[clamp(1.15rem,2.6vw,1.6rem)] leading-snug text-muted">
        My work focuses on combining machine learning with <span className="text-teal">mechanistic mathematical models</span> to study
        complex biological and molecular systems — keeping what the equations already know, and learning the rest.
      </p>
    </Reveal>
  );
}
