import { accentVar } from "@/lib/accent";
import { highlights } from "@/lib/content/experience";
import { Label, Section, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * Quantitative band.
 *
 * These describe the scope and configuration of the modelling work — not
 * accuracies, benchmarks or outcomes, none of which are claimed anywhere on
 * this site. Large numerals act as visual anchors between two dense sections.
 * ----------------------------------------------------------------------- */

export function Highlights() {
  return (
    <Section id="highlights" tight>
      <Shell>
        <header className="mb-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <Label className="label-bright">MODEL SCOPE</Label>
          <Label>PHARML PK · CURRENT CONFIGURATION</Label>
        </header>

        <dl className="grid gap-px border-y border-line-faint bg-line-faint sm:grid-cols-2 lg:grid-cols-4">
          {/* Exactly one <div> wrapper per group — HTML allows a single div
              between <dl> and its <dt>/<dd> children, not two. */}
          {highlights.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 70}
              className="group bg-base px-0 py-8 sm:px-6"
            >
              <dd
                className="tnum display text-[clamp(2.1rem,4.6vw,2.9rem)] transition-colors duration-500"
                style={{ color: accentVar[item.accent] }}
              >
                {item.value}
                {item.unit ? (
                  <span className="ml-1 text-[0.42em] text-muted">
                    {item.unit}
                  </span>
                ) : null}
              </dd>

              <dt className="mt-5">
                <Label className="label-bright">{item.label}</Label>
              </dt>

              <dd className="mt-3 max-w-[28ch] text-[0.78rem] leading-relaxed text-faint">
                {item.note}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Shell>
    </Section>
  );
}
