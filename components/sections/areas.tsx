import { areas } from "@/lib/content/areas";
import { accentVar } from "@/lib/accent";
import { Label, Section, SectionHeader, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * Areas of work.
 *
 * Editorial rather than card-based: a 2×2 field separated by hairlines, with
 * the index number and an accent tick carrying the visual weight. Hovering an
 * area brings its keyword list forward.
 * ----------------------------------------------------------------------- */

export function Areas() {
  return (
    <Section id="areas">
      <Shell>
        <SectionHeader
          eyebrow="AREAS OF WORK"
          title="Four domains, one problem."
          lede="Molecular structure, learned representation, mechanistic dynamics and clinical exposure are usually studied separately. The interesting questions live where they meet."
        />

        <div className="grid gap-px border-t border-line-faint bg-line-faint sm:grid-cols-2">
          {areas.map((area, i) => (
            <Reveal
              key={area.index}
              delay={i * 70}
              className="group relative bg-base"
            >
              <div
                className="relative h-full px-0 py-9 transition-colors duration-500 sm:px-7 sm:py-11"
                style={{ ["--accent" as string]: accentVar[area.accent] }}
              >
                {/* Accent tick that extends on hover/focus-within. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-9 h-px w-0 bg-(--accent) opacity-70 transition-all duration-500 group-hover:w-6 sm:top-11 sm:left-7"
                />

                <div className="flex items-baseline gap-4">
                  <Label className="tnum text-(--accent)">{area.index}</Label>
                  <h3 className="text-[clamp(1.05rem,2vw,1.3rem)] font-medium tracking-tight text-ink">
                    {area.title}
                  </h3>
                </div>

                <p className="mt-4 max-w-[42ch] text-[0.875rem] leading-relaxed text-muted">
                  {area.note}
                </p>

                <ul className="mt-7 flex flex-col gap-2.5">
                  {area.topics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-center gap-3 text-[0.82rem] text-faint transition-colors duration-500 group-hover:text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1 shrink-0 rounded-full bg-(--accent) opacity-40 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
