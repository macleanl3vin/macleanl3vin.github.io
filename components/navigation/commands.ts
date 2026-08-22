import { projects } from "@/lib/content/projects";
import { site } from "@/lib/content/site";

/**
 * Command registry — shared by the command palette and the primary nav so the
 * two can never drift apart. External entries are filtered out automatically
 * when their URL is null, which keeps unfinished links from ever rendering.
 */

export interface Command {
  id: string;
  label: string;
  group: "Navigate" | "Research" | "Elsewhere";
  href: string;
  external?: boolean;
  hint?: string;
  /** Extra terms matched by the palette's filter. */
  keywords?: string;
}

export const primaryNav = [
  { label: "Research", href: "/research" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/notes" },
] as const;

export function buildCommands(): Command[] {
  const commands: Command[] = [
    {
      id: "home",
      label: "Home",
      group: "Navigate",
      href: "/",
      hint: "Overview",
      keywords: "start index landing",
    },
    ...primaryNav.map((item) => ({
      id: item.href,
      label: item.label,
      group: "Navigate" as const,
      href: item.href,
      hint:
        item.label === "Research"
          ? "Selected research"
          : item.label === "Work"
            ? "Experience and capabilities"
            : item.label === "About"
              ? "Background"
              : "Writing",
    })),
    {
      id: "contact",
      label: "Contact",
      group: "Navigate",
      href: "/#contact",
      hint: "Get in touch",
      keywords: "email reach message",
    },
    ...projects
      .filter((p) => p.sections?.length)
      .map((project) => ({
        id: `project-${project.slug}`,
        label: project.title,
        group: "Research" as const,
        href: `/research/${project.slug}`,
        hint: project.category,
        keywords: `${project.tags.join(" ")} ${project.tagline}`,
      })),
    {
      id: "github",
      label: "GitHub",
      group: "Elsewhere",
      href: site.links.github,
      external: true,
      hint: "Source and projects",
      keywords: "code repository git",
    },
    {
      id: "email",
      label: "Email",
      group: "Elsewhere",
      href: `mailto:${site.links.email}`,
      external: true,
      hint: site.links.email,
      keywords: "contact message write",
    },
  ];

  // Optional links only appear once a real URL exists in lib/content/site.ts.
  if (site.links.resume) {
    commands.push({
      id: "resume",
      label: "Resume",
      group: "Elsewhere",
      href: site.links.resume,
      external: true,
      hint: "PDF",
      keywords: "cv curriculum vitae",
    });
  }

  if (site.links.linkedin) {
    commands.push({
      id: "linkedin",
      label: "LinkedIn",
      group: "Elsewhere",
      href: site.links.linkedin,
      external: true,
      keywords: "profile professional network",
    });
  }

  return commands;
}
