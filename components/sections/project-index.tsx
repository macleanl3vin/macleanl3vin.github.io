import Link from "next/link";
import { CursorLight } from "@/components/ui/cursor-light";
import { Label, MetaGrid, Pending } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { projects, type Project } from "@/lib/content/projects";
import { accentVar } from "@/lib/accent";

/* --------------------------------------------------------------------------
 * Research index rows.
 *
 * Publication-style metadata rather than a name/description/button card:
 * an index number, a category, a rule, the statement, then a metadata grid.
 * The whole row is one link target when a write-up exists.
 * ----------------------------------------------------------------------- */

function Row({ project }: { project: Project }) {
  const hasPage = Boolean(project.sections?.length);

  const body = (
    <CursorLight className="relative block rounded-lg border border-line bg-surface px-6 py-9 transition-colors duration-500 group-hover:border-line-strong group-hover:bg-elevated sm:px-9 sm:py-11">
      <div className="relative">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <Label
            className="tnum"
            // Accent the index only — the rest of the row stays neutral.
          >
            <span style={{ color: accentVar[project.accent] }}>
              {project.index}
            </span>
            <span className="px-2 text-line-strong">/</span>
            <span>{project.category.toUpperCase()}</span>
          </Label>
        </div>

        <h3 className="display mt-6 text-[clamp(1.7rem,4vw,2.5rem)] text-ink">
          {project.title}
        </h3>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-full origin-left bg-line transition-colors duration-500 group-hover:bg-line-strong"
        />

        <p className="mt-6 max-w-[52ch] text-[0.925rem] leading-relaxed text-muted">
          {project.tagline}
        </p>

        <MetaGrid
          items={[...project.meta]}
          columns={4}
          className="mt-9 max-w-2xl"
        />

        {hasPage && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 text-lg text-faint transition-colors duration-500 group-hover:text-cyan"
          >
            <span className="arrow-shift-diag inline-block">↗</span>
          </span>
        )}
      </div>
    </CursorLight>
  );

  if (!hasPage) {
    return <div className="group">{body}</div>;
  }

  return (
    <Link
      href={`/research/${project.slug}`}
      className="group block rounded-lg"
      aria-label={`${project.title} — ${project.tagline}`}
    >
      {body}
    </Link>
  );
}

export function ProjectIndex({
  showPending = true,
}: {
  showPending?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      {projects.map((project, i) => (
        <Reveal key={project.slug} delay={i * 80}>
          <Row project={project} />
        </Reveal>
      ))}

      {/* An honest empty slot beats inventing a second project to fill the
          grid. Remove this once `projects` has more entries. */}
      {showPending && (
        <Reveal delay={projects.length * 80}>
          <Pending
            label="Pending"
            note="Additional research and engineering write-ups are in preparation. Until they are ready, this space stays empty rather than padded."
          />
        </Reveal>
      )}
    </div>
  );
}
