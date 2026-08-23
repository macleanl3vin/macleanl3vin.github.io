import Link from "next/link";
import { primaryNav } from "@/components/navigation/commands";
import { Label, Shell } from "@/components/ui/primitives";
import { site } from "@/lib/content/site";

/* --------------------------------------------------------------------------
 * Footer. Minimal, and only real destinations.
 * ----------------------------------------------------------------------- */

export function Footer() {
  const external = [
    { label: "GitHub", href: site.links.github },
    { label: "Email", href: `mailto:${site.links.email}` },
    site.links.linkedin
      ? { label: "LinkedIn", href: site.links.linkedin }
      : null,
    site.links.resume ? { label: "Resume", href: site.links.resume } : null,
  ].filter((x): x is { label: string; href: string } => x !== null);

  return (
    <footer className="border-t border-line">
      <Shell>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:py-20">
          <div>
            <p className="text-[0.95rem] font-medium text-ink">{site.name}</p>
            <p className="mt-4 max-w-[26ch] text-[0.85rem] leading-relaxed text-muted">
              Computational Drug Discovery
              <br />
              AI × Mechanistic Modeling
            </p>
          </div>

          <nav aria-label="Footer">
            <Label>PAGES</Label>
            <ul className="mt-5 flex flex-col gap-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-grow text-[0.85rem] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Label>ELSEWHERE</Label>
            <ul className="mt-5 flex flex-col gap-3">
              {external.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors duration-300 hover:text-ink"
                  >
                    <span className="underline-grow">{item.label}</span>
                    <span aria-hidden="true" className="arrow-shift-diag text-[0.75em] text-faint">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
