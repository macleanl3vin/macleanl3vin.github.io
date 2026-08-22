/**
 * Site-level identity and outbound links.
 *
 * Every link here must be real. Anything unknown is left `null` and the UI
 * simply does not render it, rather than shipping a dead or invented URL.
 */

export const site = {
  name: "MacLean Levin",
  role: "Computational Drug Discovery · AI × Mechanistic Modeling",
  location: "Charleston, SC",
  year: "2026",

  title: "MacLean Levin — Computational Drug Discovery",
  description:
    "Computer scientist working across machine learning, molecular modeling, pharmacokinetics, mathematical simulation, and AI for scientific discovery.",

  links: {
    github: "https://github.com/macleanl3vin",
    email: "levinmt@g.cofc.edu",

    // TODO(MacLean): add your LinkedIn profile URL to surface the link in the
    // navigation, contact section and footer. Left null so nothing fake ships.
    linkedin: null as string | null,

    // TODO(MacLean): drop a PDF at `public/resume.pdf` and set this to
    // "/resume.pdf" to enable the "Resume ↗" links across the site.
    resume: null as string | null,

    // TODO(MacLean): add a Google Scholar / ORCID profile if you want one.
    scholar: null as string | null,
  },
} as const;

export type SiteLinkKey = keyof typeof site.links;
