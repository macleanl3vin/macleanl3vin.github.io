import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import {
  ActionLink,
  Label,
  Section,
  SectionHeader,
  Shell,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { AboutColumns, AboutStatement } from "@/components/sections/about";
import { HeteroGraph } from "@/components/diagrams/hetero-graph";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Interdisciplinary background across computer science, mathematics and molecular science — and the work of connecting them.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT"
        title="Three fields, treated as one."
        lede="Computer science supplies the machinery, mathematics supplies the language, and molecular science supplies the questions. Most of the interesting work is in the translation between them."
        meta={[
          { key: "Field", value: "Computational Biology" },
          { key: "Method", value: "Hybrid Modeling" },
          { key: "System", value: "GNN → ODE" },
          { key: "Based in", value: site.location },
        ]}
      />

      <Section rule={false}>
        <Shell>
          <AboutStatement />
          <div className="mt-16">
            <AboutColumns />
          </div>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="HOW I WORK"
                title="Keep the mechanism. Learn the rest."
                className="mb-10"
              />

              <div className="flex max-w-[58ch] flex-col gap-6 text-[0.975rem] leading-[1.75] text-muted">
                <Reveal>
                  <p>
                    Purely mechanistic models are interpretable but rigid: every
                    new compound means a new fit, and chemistry never enters the
                    equations. Purely learned models generalise across chemistry
                    but discard everything already known about how a system
                    behaves — conservation, saturation, the shape a curve is
                    allowed to take.
                  </p>
                </Reveal>
                <Reveal delay={60}>
                  <p>
                    The approach I find most productive is to let each method do
                    what it is good at. A network reads the context — patient,
                    regimen, and the biological mechanism joining them — and
                    emits bounded adjustments; a differential-equation system
                    handles the dynamics. The mechanism stays in charge of what
                    is possible, and the learning happens inside those limits.
                  </p>
                </Reveal>
                <Reveal delay={120}>
                  <p>
                    In practice that means a lot of time spent on the seam
                    between the two — making the numerical integration
                    differentiable, keeping parameters in physically admissible
                    ranges, and being honest about which parts of a prediction
                    the mechanism is actually supporting.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={180}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <ActionLink href="/research">Read the research</ActionLink>
                  <ActionLink
                    href={`mailto:${site.links.email}`}
                    variant="secondary"
                    external
                  >
                    Email
                  </ActionLink>
                </div>
              </Reveal>
            </div>

            <Reveal delay={140}>
              <HeteroGraph variant="interactive" />
              <p className="label mt-6 border-t border-line-faint pt-5 leading-relaxed">
                FIG. 01 — Typed representation of a dosing regimen. Illustrative.
              </p>
            </Reveal>
          </div>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <div className="rounded-xl border border-line bg-surface px-6 py-10 sm:px-10 sm:py-12">
            <Label className="label-bright">CURRENTLY</Label>
            <p className="mt-6 max-w-[46ch] text-[clamp(1.1rem,2.4vw,1.45rem)] leading-snug text-ink">
              Building PharML PK — a hybrid graph neural network and mechanistic
              ODE framework for multi-drug pharmacokinetics.
            </p>
            {/*
              TODO(MacLean): add education, coursework or teaching here if you
              want it on the site. Nothing has been assumed.
            */}
          </div>
        </Shell>
      </Section>
    </>
  );
}
