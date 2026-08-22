import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeader, Shell } from "@/components/ui/primitives";
import { ProjectIndex } from "@/components/sections/project-index";
import { Areas } from "@/components/sections/areas";
import { projects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Selected research in computational pharmacology, scientific machine learning and mechanistic modeling.",
};

export default function ResearchPage() {
  const withPages = projects.filter((p) => p.sections?.length).length;

  return (
    <>
      <PageHeader
        eyebrow="RESEARCH"
        title="Selected research."
        lede="Work on hybrid modeling — learned molecular representations coupled to mechanistic systems that stay physically interpretable."
        meta={[
          { key: "Entries", value: String(projects.length).padStart(2, "0") },
          { key: "Write-ups", value: String(withPages).padStart(2, "0") },
          { key: "Field", value: "Computational Biology" },
          { key: "Year", value: "2026" },
        ]}
      />

      <Section rule={false}>
        <Shell>
          <SectionHeader
            eyebrow="INDEX"
            title="Projects."
            aside={`${String(projects.length).padStart(2, "0")} LISTED`}
          />
          <ProjectIndex />
        </Shell>
      </Section>

      <Areas />
    </>
  );
}
