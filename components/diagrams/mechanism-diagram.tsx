import { accentVar } from "@/lib/accent";
import { NodeBox } from "./plots";

/* --------------------------------------------------------------------------
 * Mechanistic process diagram for the ODE tab.
 *
 * Shows the state flow the ODE system integrates for a regimen of several
 * drugs at once. The modelling point it has to carry: there is ONE plasma
 * state, ONE hepatic state and ONE shared-enzyme term — the drugs converge
 * into a single mechanistic system rather than running as parallel per-drug
 * pipelines. Competition between them appears in the shared denominator.
 *
 * The GNN is present but deliberately peripheral: a dashed violet feed into
 * the enzyme term only. State dynamics belong to the ODE.
 *
 * Two layouts, one set of content. The wide layout puts plasma and hepatic
 * side by side with their branches beneath; below `sm` that composition
 * collapses into unreadability, so a stacked layout takes over — a vertical
 * spine with branches teeing off it. Both reuse NodeBox so the boxes match the
 * other schematics, and both take their type scale from CSS (.mech-*) so text
 * grows on narrow screens instead of shrinking.
 * ----------------------------------------------------------------------- */

const cyan = accentVar.cyan;
const teal = accentVar.teal;
const violet = accentVar.violet;

/** Content, shared by both layouts. */
const DRUGS = ["DRUG A", "DRUG B", "DRUG …"];

const BOXES = {
  plasma: { label: "PLASMA", sub: "SYSTEMIC STATE", color: cyan, emphasis: false },
  hepatic: { label: "HEPATIC", sub: "LIVER STATE", color: cyan, emphasis: true },
  metabolites: { label: "METABOLITES", sub: "PRODUCTS", color: teal, emphasis: false },
  renal: { label: "RENAL", sub: "ELIMINATION", color: cyan, emphasis: false },
  enzyme: { label: "SHARED ENZYME", sub: "ONE PER ENZYME", color: violet, emphasis: true },
} as const;

const DENOMINATOR = "D = 1 + Σ C/Km + Σ I/Ki";
const DENOMINATOR_SUB = "EVALUATED AT LIVER CONCENTRATION";
const GNN_LINES = ["BOUNDED GNN", "FACTORS"];

const DESCRIPTION =
  "Mechanistic process diagram. Several drugs enter one shared plasma state, which exchanges with a single hepatic state. Plasma is also cleared renally. The hepatic state feeds one shared enzyme term, which produces metabolites and is modulated by bounded GNN factors. Competition and inhibition at that enzyme are collected into a single denominator: D equals one plus the sum of substrate over K m terms plus the sum of inhibitor over K i terms.";

/** Arrowhead shared by both layouts; `id` is scoped per layout. */
function ArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="5"
      markerHeight="5"
      orient="auto-start-reverse"
    >
      <path d="M0,1 L9,5 L0,9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </marker>
  );
}

function Box({
  x,
  y,
  w,
  h,
  which,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  which: keyof typeof BOXES;
}) {
  const b = BOXES[which];
  return (
    <NodeBox
      x={x}
      y={y}
      w={w}
      h={h}
      label={b.label}
      sub={b.sub}
      color={b.color}
      emphasis={b.emphasis}
      labelClass="mech-label"
      subClass="mech-sub"
    />
  );
}

function DrugChip({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        fill="var(--color-surface)"
        stroke={teal}
        strokeOpacity="0.32"
        strokeWidth="1.1"
      />
      <text
        className="mech-sub"
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fill="var(--color-muted)"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
      >
        {label}
      </text>
    </g>
  );
}

function DenominatorPlate({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill="var(--color-base)"
        stroke={violet}
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <text
        className="mech-eq"
        x={x + w / 2}
        y={y + h / 2 - 2}
        textAnchor="middle"
        fill="var(--color-ink)"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
      >
        {DENOMINATOR}
      </text>
      <text
        className="mech-sub"
        x={x + w / 2}
        y={y + h - 10}
        textAnchor="middle"
        fill="var(--color-faint)"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
      >
        {DENOMINATOR_SUB}
      </text>
    </g>
  );
}

/* ========================================================================== */
/* Wide layout — plasma ⇄ hepatic side by side                                */
/* ========================================================================== */

function WideLayout() {
  const A = "url(#mech-arrow-wide)";
  return (
    <svg
      viewBox="0 0 680 266"
      className="mx-auto hidden h-auto w-full max-w-[43rem] sm:block"
      role="img"
      aria-label={DESCRIPTION}
    >
      <defs>
        <ArrowMarker id="mech-arrow-wide" />
      </defs>

      {DRUGS.map((d, i) => (
        <DrugChip key={d} x={20 + i * 90} y={4} w={80} h={24} label={d} />
      ))}

      {/* Drugs converge onto one bus, then into one plasma state. */}
      <g fill="none" stroke="var(--color-line-strong)" strokeWidth="1.2">
        <path d="M60 28 V 40" />
        <path d="M150 28 V 40" />
        <path d="M240 28 V 40" />
        <path d="M60 40 H 240" />
      </g>
      <path
        d="M150 40 V 52"
        fill="none"
        stroke={cyan}
        color={cyan}
        strokeWidth="1.4"
        markerEnd={A}
        opacity="0.85"
      />

      <g fill="none" strokeWidth="1.4" opacity="0.85">
        {/* Distribution runs both ways between the two states. */}
        <path d="M220 74 H 300" stroke={cyan} color={cyan} markerEnd={A} />
        <path d="M300 88 H 220" stroke={cyan} color={cyan} markerEnd={A} />
        <path d="M440 80 H 516" stroke={teal} color={teal} markerEnd={A} />
        <path d="M150 104 V 128" stroke={cyan} color={cyan} markerEnd={A} />
        <path d="M370 104 V 128" stroke={cyan} color={cyan} markerEnd={A} />
        <path d="M370 180 V 204" stroke={violet} color={violet} markerEnd={A} />
      </g>

      {/* Bounded learned modulation — dashed, peripheral. */}
      <path
        d="M544 156 H 461"
        fill="none"
        stroke={violet}
        color={violet}
        strokeWidth="1.3"
        strokeDasharray="5 5"
        markerEnd={A}
        opacity="0.8"
      />

      <Box x={84} y={56} w={132} h={48} which="plasma" />
      <Box x={304} y={56} w={132} h={48} which="hepatic" />
      <Box x={520} y={56} w={150} h={48} which="metabolites" />
      <Box x={90} y={132} w={120} h={48} which="renal" />
      <Box x={285} y={132} w={170} h={48} which="enzyme" />

      {GNN_LINES.map((line, i) => (
        <text
          key={line}
          className="mech-note"
          x={608}
          y={152 + i * 18}
          textAnchor="middle"
          fill={violet}
          opacity="0.85"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
        >
          {line}
        </text>
      ))}

      <DenominatorPlate x={220} y={208} w={300} h={52} />
    </svg>
  );
}

/* ========================================================================== */
/* Stacked layout — a vertical spine with branches teeing off it              */
/* ========================================================================== */

function StackLayout() {
  const A = "url(#mech-arrow-stack)";
  const SPINE = 72;
  const BOX_X = 60;
  const BOX_W = 290;

  return (
    <svg
      viewBox="0 0 360 496"
      className="mx-auto h-auto w-full sm:hidden"
      role="img"
      aria-label={DESCRIPTION}
    >
      <defs>
        <ArrowMarker id="mech-arrow-stack" />
      </defs>

      {DRUGS.map((d, i) => (
        <DrugChip key={d} x={12 + i * 116} y={2} w={108} h={26} label={d} />
      ))}

      <g fill="none" stroke="var(--color-line-strong)" strokeWidth="1.2">
        <path d="M66 28 V 38" />
        <path d="M182 28 V 38" />
        <path d="M298 28 V 38" />
        <path d="M66 38 H 298" />
        <path d="M182 38 V 44" />
      </g>
      <path
        d={`M182 44 V 56`}
        fill="none"
        stroke={cyan}
        color={cyan}
        strokeWidth="1.4"
        markerEnd={A}
        opacity="0.85"
      />

      <Box x={BOX_X} y={56} w={BOX_W} h={48} which="plasma" />

      {/* Spine continues past each branch, so the tees read as branches
          rather than as steps in a sequence. */}
      <g fill="none" strokeWidth="1.4" opacity="0.85">
        {/* plasma → renal (tee) */}
        <path d={`M${SPINE} 104 V 132`} stroke={cyan} />
        <path d={`M${SPINE} 132 H 104`} stroke={cyan} color={cyan} markerEnd={A} />
        {/* plasma ⇄ hepatic, continuing down the spine */}
        <path d={`M${SPINE} 132 V 186`} stroke={cyan} color={cyan} markerEnd={A} />
        <path d={`M${SPINE + 16} 186 V 108`} stroke={cyan} color={cyan} markerEnd={A} />
      </g>

      <Box x={104} y={114} w={246} h={48} which="renal" />
      <Box x={BOX_X} y={192} w={BOX_W} h={48} which="hepatic" />

      <g fill="none" strokeWidth="1.4" opacity="0.85">
        {/* hepatic → metabolites (tee) */}
        <path d={`M${SPINE} 240 V 268`} stroke={teal} />
        <path d={`M${SPINE} 268 H 104`} stroke={teal} color={teal} markerEnd={A} />
        {/* hepatic → shared enzyme */}
        <path d={`M${SPINE} 268 V 322`} stroke={cyan} color={cyan} markerEnd={A} />
      </g>

      <Box x={104} y={250} w={246} h={48} which="metabolites" />
      <Box x={BOX_X} y={328} w={BOX_W} h={48} which="enzyme" />

      {/* GNN feeds the enzyme term from below-right, out of the spine's way. */}
      <path
        d="M280 400 V 380"
        fill="none"
        stroke={violet}
        color={violet}
        strokeWidth="1.3"
        strokeDasharray="5 5"
        markerEnd={A}
        opacity="0.8"
      />
      <text
        className="mech-note"
        x={350}
        y={414}
        textAnchor="end"
        fill={violet}
        opacity="0.85"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
      >
        {GNN_LINES.join(" ")}
      </text>

      <path
        d={`M${SPINE} 376 V 428`}
        fill="none"
        stroke={violet}
        color={violet}
        strokeWidth="1.4"
        markerEnd={A}
        opacity="0.85"
      />

      <DenominatorPlate x={16} y={432} w={330} h={54} />
    </svg>
  );
}

export function MechanismDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <WideLayout />
      <StackLayout />
    </div>
  );
}
