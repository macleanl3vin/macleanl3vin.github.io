import { accentVar } from "@/lib/accent";
import { skillGroups } from "@/lib/content/skills";
import { Label } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/* --------------------------------------------------------------------------
 * Capabilities.
 *
 * Organised under scientific domains, set in type. No logo wall — a grid of
 * vendor marks says nothing about how someone thinks.
 * ----------------------------------------------------------------------- */

export function Skills() {
  return (
    <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {skillGroups.map((group, i) => (
        <Reveal key={group.domain} delay={i * 70}>
          <div className="group">
            <div className="flex items-baseline gap-3 border-t border-line pt-5 transition-colors duration-500 group-hover:border-line-strong">
              <Label
                className="tnum"
                as="span"
              >
                <span style={{ color: accentVar[group.accent] }}>
                  {group.index}
                </span>
              </Label>
              <h3 className="text-[0.95rem] font-medium text-ink">
                {group.domain}
              </h3>
            </div>

            <ul className="mt-6 flex flex-col gap-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-[0.85rem] leading-snug text-muted transition-colors duration-500 group-hover:text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
