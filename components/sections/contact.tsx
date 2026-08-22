import { ActionLink, Label, Section, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/content/site";

/* --------------------------------------------------------------------------
 * Contact.
 *
 * Only links that actually resolve. Optional destinations (resume, LinkedIn)
 * appear automatically once their URL is filled in in lib/content/site.ts.
 * ----------------------------------------------------------------------- */

export function Contact() {
  return (
    <Section id="contact">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <Reveal>
              <Label className="label-bright">CONTACT</Label>
            </Reveal>

            <Reveal delay={60}>
              <h2 className="display mt-6 text-[clamp(1.9rem,4.4vw,3rem)] text-ink">
                Open to research
                <br />
                collaboration.
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="prose-measure mt-6 text-[0.95rem] leading-relaxed text-muted">
                If you work on AI for science, computational pharmacology or
                mechanistic modeling — or you have a problem that sits between
                them — I would be glad to hear about it.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ActionLink href={`mailto:${site.links.email}`} external>
                  Email
                </ActionLink>
                <ActionLink
                  href={site.links.github}
                  variant="secondary"
                  external
                >
                  GitHub
                </ActionLink>
                {site.links.linkedin ? (
                  <ActionLink
                    href={site.links.linkedin}
                    variant="secondary"
                    external
                  >
                    LinkedIn
                  </ActionLink>
                ) : null}
              </div>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <dl className="grid gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:border-t-0 lg:pt-0">
              <Field term="Email" value={site.links.email} href={`mailto:${site.links.email}`} />
              <Field term="Based in" value={site.location} />
              <Field term="Field" value="Computational Biology" />
              <Field term="Method" value="Hybrid Modeling" />
            </dl>
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}

function Field({
  term,
  value,
  href,
}: {
  term: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="label">{term.toUpperCase()}</dt>
      <dd className="mt-3 text-sm break-words text-ink">
        {href ? (
          <a
            href={href}
            className="underline-grow transition-colors duration-300 hover:text-cyan"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
