/**
 * Short technical writing.
 *
 * Empty on purpose — nothing has been published yet, and the page renders a
 * designed empty state rather than placeholder posts. Add an entry here and it
 * appears automatically.
 *
 * TODO(MacLean): when you write the first note, decide whether the body lives
 * in MDX (add @next/mdx) or as an external link, then extend this type.
 */

export interface Note {
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-03-14". */
  date: string;
  summary: string;
  tags: string[];
  /** External destination if the note is published elsewhere. */
  href?: string;
}

export const notes: Note[] = [];
