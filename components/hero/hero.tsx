import { HeteroGraph } from "@/components/diagrams/hetero-graph";
import { ActionLink, Label, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/content/site";

/* --------------------------------------------------------------------------
 * Hero.
 *
 * Asymmetric: identity and statement on the left, the heterogeneous graph on
 * the right at ≥lg. Below that breakpoint the graph moves beneath the copy and
 * drops its tier-2 nodes rather than disappearing.
 * ----------------------------------------------------------------------- */

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-36">
      {/* Background texture — deliberately at the threshold of visibility. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <div className="grid-texture absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% -10%, transparent 40%, var(--color-base) 82%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[60vh]"
          style={{
            background:
              "radial-gradient(46% 60% at 72% 20%, color-mix(in oklab, var(--color-violet) 7%, transparent), transparent 70%)",
          }}
        />
      </div>

      <Shell>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)] lg:gap-12 xl:gap-16">
          {/* ---- copy ---------------------------------------------------- */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-7 shrink-0 bg-cyan/50"
                />
                <Label className="label-bright leading-relaxed">
                  {site.role.toUpperCase()}
                </Label>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="display mt-7 text-[clamp(2.6rem,7.2vw,4.4rem)] text-ink">
                {site.name}
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="display mt-5 max-w-[19ch] text-[clamp(1.4rem,3.3vw,2.05rem)] leading-[1.12] text-muted">
                Building computational models of{" "}
                <span className="text-cyan">biological systems.</span>
              </p>
            </Reveal>

            <Reveal delay={190}>
              <p className="prose-measure mt-8 text-[0.95rem] leading-relaxed text-muted">
                Computer scientist working across machine learning, molecular
                modeling, pharmacokinetics, mathematical simulation, and AI for
                scientific discovery.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ActionLink href="/research">Explore Research</ActionLink>
                <ActionLink href={site.links.github} variant="secondary" external>
                  GitHub
                </ActionLink>
                {site.links.resume ? (
                  <ActionLink
                    href={site.links.resume}
                    variant="secondary"
                    external
                  >
                    Resume
                  </ActionLink>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* ---- visualization ------------------------------------------- */}
          <Reveal delay={300} className="lg:-mr-6 xl:-mr-10">
            <div className="anim-drift" style={{ ["--dur" as string]: "18s" }}>
              <HeteroGraph />
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:justify-end">
              <Label className="label-bright">FIG. 00</Label>
              <span className="text-[0.78rem] text-faint">
                Heterogeneous disposition graph — illustrative
              </span>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
