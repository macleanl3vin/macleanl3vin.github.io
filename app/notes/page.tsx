import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import {
  ActionLink,
  Label,
  Pending,
  Section,
  Shell,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { notes } from "@/lib/content/notes";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short technical writing on modeling, numerical methods and computational biology.",
};

export default function NotesPage() {
  return (
    <>
      <PageHeader
        eyebrow="NOTES"
        title="Working notes."
        lede="Short technical writing on modeling decisions, numerical methods and things that turned out to be harder than expected."
        meta={[
          {
            key: "Published",
            value: String(notes.length).padStart(2, "0"),
          },
          { key: "Topics", value: "Modeling · Numerics" },
          { key: "Status", value: notes.length ? "Active" : "Not yet started" },
          { key: "Year", value: site.year },
        ]}
      />

      <Section rule={false}>
        <Shell>
          {notes.length === 0 ? (
            <Reveal>
              <div className="max-w-2xl">
                <Pending
                  label="No entries yet"
                  note="Nothing has been published here so far. When there is something worth writing down — a modeling decision, a numerical failure mode, a result that did not survive scrutiny — it will appear in this index."
                />

                <p className="mt-10 text-[0.9rem] leading-relaxed text-muted">
                  In the meantime, the research write-ups carry the technical
                  detail.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <ActionLink href="/research">Read the research</ActionLink>
                  <ActionLink
                    href={site.links.github}
                    variant="secondary"
                    external
                  >
                    GitHub
                  </ActionLink>
                </div>
              </div>
            </Reveal>
          ) : (
            <ul className="flex flex-col">
              {notes.map((note, i) => (
                <Reveal key={note.slug} delay={i * 60} as="li">
                  <article className="group grid gap-x-10 gap-y-3 border-t border-line py-9 transition-colors duration-500 hover:border-line-strong sm:grid-cols-[9rem_minmax(0,1fr)]">
                    <Label className="tnum pt-1">{note.date}</Label>
                    <div>
                      <h2 className="text-[1.05rem] font-medium text-ink">
                        {note.title}
                      </h2>
                      <p className="mt-3 max-w-[58ch] text-[0.9rem] leading-relaxed text-muted">
                        {note.summary}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </Shell>
      </Section>
    </>
  );
}
