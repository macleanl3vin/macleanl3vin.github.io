import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockRenderer, SectionHeading } from "@/components/research/blocks";
import { Toc } from "@/components/research/toc";
import { PageHeader } from "@/components/ui/page-header";
import {
  ActionLink,
  Label,
  Shell,
  TagRow,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getProject, projectsWithPages } from "@/lib/content/projects";
import { site } from "@/lib/content/site";

/** Only projects that actually have a write-up get a route. */
export function generateStaticParams() {
  return projectsWithPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ResearchDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.sections?.length) notFound();

  const sections = project.sections;
  const toc = sections.map((s) => ({
    id: s.id,
    index: s.index,
    title: s.title,
  }));

  return (
    <>
      <PageHeader
        eyebrow={`RESEARCH / ${project.index}`}
        title={project.title}
        meta={[
          { key: "Year", value: project.year },
          { key: "Field", value: project.category },
          { key: "System", value: "GNN → ODE" },
          { key: "Status", value: project.status },
        ]}
      >
        <Reveal delay={90}>
          <p className="display mt-8 max-w-[24ch] text-[clamp(1.35rem,3.4vw,2.1rem)] leading-[1.15] text-muted">
            Hybrid GNN–ODE modeling for multi-drug pharmacokinetics.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <TagRow tags={project.tags} className="mt-12" />
        </Reveal>

        {project.repo ? (
          <Reveal delay={240}>
            <div className="mt-10">
              <ActionLink href={project.repo} variant="secondary" external>
                Repository
              </ActionLink>
            </div>
          </Reveal>
        ) : null}
      </PageHeader>

      <Shell>
        <div className="grid gap-x-16 gap-y-10 py-14 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:py-20">
          {/* ---- contents ----------------------------------------------- */}
          <div className="border-b border-line pb-6 lg:border-b-0 lg:pb-0">
            <Toc sections={toc} />
          </div>

          {/* ---- body --------------------------------------------------- */}
          <article className="min-w-0">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className={`scroll-mt-28 ${
                  i === 0 ? "" : "mt-20 border-t border-line-faint pt-20"
                }`}
              >
                <SectionHeading index={section.index} title={section.title} />

                <div className="flex flex-col gap-10">
                  {section.blocks.map((block, j) => (
                    <BlockRenderer key={j} block={block} />
                  ))}
                </div>
              </section>
            ))}

            {/* ---- footer of the report ------------------------------- */}
            <Reveal>
              <div className="mt-20 border-t border-line pt-10">
                <Label>END OF REPORT</Label>
                <p className="mt-5 max-w-[54ch] text-[0.9rem] leading-relaxed text-muted">
                  Questions, corrections or collaboration — the fastest route is
                  email.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ActionLink href={`mailto:${site.links.email}`} external>
                    Get in touch
                  </ActionLink>
                  <ActionLink href="/research" variant="secondary">
                    All research
                  </ActionLink>
                </div>
              </div>
            </Reveal>
          </article>
        </div>
      </Shell>

      <div className="border-t border-line">
        <Shell>
          <div className="py-10">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[0.85rem] text-muted transition-colors duration-300 hover:text-ink"
            >
              <span aria-hidden="true">←</span>
              <span className="underline-grow">Back to overview</span>
            </Link>
          </div>
        </Shell>
      </div>
    </>
  );
}
