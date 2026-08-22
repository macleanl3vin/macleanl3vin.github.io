import type {Metadata} from "next";
import {PageHeader} from "@/components/ui/page-header";
import {Section, SectionHeader, Shell} from "@/components/ui/primitives";
import {Experience} from "@/components/sections/experience";
import {Skills} from "@/components/sections/skills";
import {ProjectIndex} from "@/components/sections/project-index";
import {timeline} from "@/lib/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Research experience and technical capabilities across computation, mathematical systems, molecular science and software.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="EXPERIENCE"
        title="Experience."
        lede="What I work on, and the tools I reach for. Detail on individual projects lives in the research write-ups."
        meta={[
          {
            key: "Entries",
            value: String(timeline.length).padStart(2, "0"),
          },
          {key: "Field", value: "Computational Biology"},
          {key: "Method", value: "Hybrid Modeling"},
          {key: "Based in", value: "Charleston, SC"},
        ]}
      />

      <Section rule={false}>
        <Shell>
          <SectionHeader eyebrow="TIMELINE" title="Research experience." />
          <Experience />
        </Shell>
      </Section>

      <Section>
        <Shell>
          <SectionHeader
            eyebrow="CAPABILITIES"
            title="Capabilities, organized by scientific function."
            lede="Tools matter less than what they are used to model. These are grouped by the scientific question they serve."
          />
          <Skills />
        </Shell>
      </Section>

      <Section>
        <Shell>
          <SectionHeader eyebrow="SELECTED WORK" title="Projects." aside="RESEARCH INDEX" />
          <ProjectIndex />
        </Shell>
      </Section>
    </>
  );
}
