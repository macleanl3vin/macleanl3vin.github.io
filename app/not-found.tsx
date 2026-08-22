import { ActionLink, Label, Shell } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-texture absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 30% 0%, transparent 30%, var(--color-base) 76%)",
          }}
        />
      </div>

      <Shell>
        <div className="flex min-h-[70vh] flex-col justify-center py-32">
          <Label className="label-bright">ERROR / 404</Label>

          <h1 className="display mt-7 text-[clamp(2.4rem,7vw,4.2rem)] text-ink">
            No such route.
          </h1>

          <p className="prose-measure mt-6 text-[0.95rem] leading-relaxed text-muted">
            The page you asked for does not exist. It may have been renamed, or
            it may never have been written.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ActionLink href="/">Back to overview</ActionLink>
            <ActionLink href="/research" variant="secondary">
              Research
            </ActionLink>
          </div>
        </div>
      </Shell>
    </div>
  );
}
