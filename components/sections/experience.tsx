import { accentVar } from "@/lib/accent";
import { timeline } from "@/lib/content/experience";
import { Label, TagRow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * Research timeline.
 *
 * A vertical rail rather than resume cards: period on the left, a node on the
 * rail, and a short technical summary on the right. Deliberately free of
 * bullet lists — detail belongs on the research pages.
 * ----------------------------------------------------------------------- */

export function Experience() {
  if (timeline.length === 0) return null;

  return (
    <ol className="relative flex flex-col">
      {/* The rail itself. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-px bg-line-faint sm:left-[8.5rem]"
      />

      {timeline.map((entry, i) => (
        <li key={`${entry.organization}-${entry.period}`}>
          <Reveal delay={i * 80}>
            <article className="group relative grid grid-cols-1 gap-y-4 py-10 pl-8 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-10 sm:pl-0">
              {/* Period + rail node */}
              <div className="relative sm:pr-10 sm:text-right">
                <Label className="tnum label-bright">{entry.period}</Label>

                <span
                  aria-hidden="true"
                  className="absolute top-[0.3rem] -left-8 size-[7px] rounded-full ring-4 ring-base transition-transform duration-500 group-hover:scale-125 sm:left-auto sm:-right-[3.5px]"
                  style={{ background: accentVar[entry.accent] }}
                />
              </div>

              <div className="sm:pl-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[1.05rem] font-medium text-ink">
                    {entry.organization}
                  </h3>
                  {entry.unit ? (
                    <Label className="label-bright">{entry.unit}</Label>
                  ) : null}
                </div>

                <p className="mt-2 text-[0.9rem] text-muted">{entry.role}</p>

                <p className="mt-4 max-w-[54ch] text-[0.875rem] leading-relaxed text-faint">
                  {entry.summary}
                </p>

                <TagRow tags={entry.tags} className="mt-6" />
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
