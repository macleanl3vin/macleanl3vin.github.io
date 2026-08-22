import Link from "next/link";
import { Hero } from "@/components/hero/hero";
import { Areas } from "@/components/sections/areas";
import { FeaturedResearch } from "@/components/sections/featured-research";
import { ProjectIndex } from "@/components/sections/project-index";
import { Highlights } from "@/components/sections/highlights";
import { Experience } from "@/components/sections/experience";
import { AboutColumns, AboutStatement } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { ModelExplorer } from "@/components/model-explorer/model-explorer";
import {
  ActionLink,
  Label,
  Section,
  SectionHeader,
  Shell,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export default function Home() {
  return (
    <>
      <Hero />

      <Areas />

      <FeaturedResearch />

      {/* ---- interactive model explorer ---------------------------------- */}
      <Section id="explorer">
        <Shell>
          <SectionHeader
            eyebrow="MODEL EXPLORER"
            title="Four views of one system."
            lede="The same conceptual model, seen as a graph, as equations, as exposure over time, and as an interaction. Curves are integrated in the browser from the parameters shown — illustrative values, not clinical data."
            aside="INTERACTIVE"
          />
          <Reveal>
            <ModelExplorer />
          </Reveal>
        </Shell>
      </Section>

      {/* ---- research index ---------------------------------------------- */}
      <Section id="work">
        <Shell>
          <SectionHeader
            eyebrow="SELECTED WORK"
            title="Research index."
            lede="Projects with a full write-up link through to a technical report."
            aside={
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 text-faint transition-colors duration-300 hover:text-muted"
              >
                ALL RESEARCH
                <span aria-hidden="true" className="arrow-shift">
                  →
                </span>
              </Link>
            }
          />
          <ProjectIndex />
        </Shell>
      </Section>

      <Highlights />

      {/* ---- experience --------------------------------------------------- */}
      <Section id="experience">
        <Shell>
          <SectionHeader eyebrow="EXPERIENCE" title="Where the work happens." />
          <Experience />
          <Reveal>
            <div className="mt-12 border-t border-line-faint pt-8">
              <ActionLink href="/work" variant="secondary">
                Capabilities and detail
              </ActionLink>
            </div>
          </Reveal>
        </Shell>
      </Section>

      {/* ---- about -------------------------------------------------------- */}
      <Section id="about">
        <Shell>
          <div className="mb-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <Label className="label-bright">ABOUT</Label>
            <Label>THREE DISCIPLINES</Label>
          </div>

          <AboutStatement />

          <div className="mt-16">
            <AboutColumns />
          </div>

          <Reveal>
            <div className="mt-12">
              <ActionLink href="/about" variant="secondary">
                More background
              </ActionLink>
            </div>
          </Reveal>
        </Shell>
      </Section>

      <Contact />
    </>
  );
}
