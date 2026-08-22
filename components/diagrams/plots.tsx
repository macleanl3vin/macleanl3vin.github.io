import { accentVar } from "@/lib/accent";
import type { Accent } from "@/lib/content/areas";
import { cmax, toPath, type Point } from "@/lib/pk";

/* --------------------------------------------------------------------------
 * Concentration–time plot.
 *
 * Plain SVG driven by the numerical solutions in lib/pk.ts. Everything is
 * computed at render time from real parameters, so the curves are genuine
 * solutions of the stated equations — with illustrative parameter values,
 * which the surrounding figure caption always says.
 * ----------------------------------------------------------------------- */

const W = 760;
const H = 380;
const PAD = { l: 58, r: 26, t: 24, b: 46 };

const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

export interface Series {
  id: string;
  label: string;
  points: Point[];
  accent: Accent;
  dashed?: boolean;
  /** Draw a marker and annotation at peak concentration. */
  markPeak?: boolean;
}

function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = 10 ** exp;
  const norm = value / base;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * base;
}

export function ConcentrationPlot({
  series,
  hours = 24,
  yLabel = "C(t)  mg/L",
  xLabel = "Time (h)",
  className = "",
  animate = true,
}: {
  series: Series[];
  hours?: number;
  yLabel?: string;
  xLabel?: string;
  className?: string;
  animate?: boolean;
}) {
  const peak = Math.max(
    ...series.flatMap((s) => s.points.map((p) => p.c)),
    0.0001,
  );
  const yMax = niceCeiling(peak * 1.18);

  const xTicks = [0, 4, 8, 12, 16, 20, 24].filter((t) => t <= hours);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);

  const geom = {
    width: W,
    height: H,
    padLeft: PAD.l,
    padRight: PAD.r,
    padTop: PAD.t,
    padBottom: PAD.b,
    tMax: hours,
    yMax,
  };

  const sx = (t: number) => PAD.l + (t / hours) * plotW;
  const sy = (c: number) => PAD.t + plotH - (c / yMax) * plotH;

  const description = series
    .map((s) => {
      const top = cmax(s.points);
      return `${s.label}: peak ${top.c.toFixed(2)} mg per litre at ${top.t.toFixed(1)} hours`;
    })
    .join("; ");

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Concentration versus time plot. ${description}.`}
      >
        {/* ---- plotting grid ---------------------------------------- */}
        <g>
          {yTicks.map((c) => (
            <line
              key={`gy-${c}`}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={sy(c)}
              y2={sy(c)}
              stroke="var(--color-line)"
              strokeWidth="1"
              opacity={c === 0 ? 0.9 : 0.4}
            />
          ))}
          {xTicks.map((t) => (
            <line
              key={`gx-${t}`}
              x1={sx(t)}
              x2={sx(t)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--color-line)"
              strokeWidth="1"
              opacity="0.22"
            />
          ))}
        </g>

        {/* ---- axes -------------------------------------------------- */}
        <line
          x1={PAD.l}
          x2={PAD.l}
          y1={PAD.t}
          y2={H - PAD.b}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
        />

        <g
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            letterSpacing: "0.08em",
          }}
          fill="var(--color-faint)"
        >
          {yTicks.map((c) => (
            <text key={`ty-${c}`} x={PAD.l - 12} y={sy(c) + 5} textAnchor="end">
              {yMax >= 10 ? c.toFixed(0) : c.toFixed(1)}
            </text>
          ))}
          {xTicks.map((t) => (
            <text key={`tx-${t}`} x={sx(t)} y={H - PAD.b + 24} textAnchor="middle">
              {t}
            </text>
          ))}
          <text x={PAD.l} y={PAD.t - 9} textAnchor="start" fill="var(--color-faint)">
            {yLabel.toUpperCase()}
          </text>
          <text x={W - PAD.r} y={H - 8} textAnchor="end">
            {xLabel.toUpperCase()}
          </text>
        </g>

        {/* ---- series ------------------------------------------------ */}
        {series.map((s, i) => {
          const d = toPath(s.points, geom);
          const color = accentVar[s.accent];
          const top = cmax(s.points);

          return (
            <g key={s.id}>
              {/* Soft fill under the curve, cyan/teal at very low alpha. */}
              {!s.dashed && (
                <path
                  d={`${d} L${sx(hours).toFixed(2)},${sy(0).toFixed(2)} L${sx(0).toFixed(2)},${sy(0).toFixed(2)} Z`}
                  fill={color}
                  opacity="0.06"
                />
              )}

              <path
                className={animate ? "trace" : undefined}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? "6 6" : undefined}
                style={
                  animate && !s.dashed
                    ? ({ "--len": 2400, "--delay": `${i * 0.22}s` } as React.CSSProperties)
                    : undefined
                }
              />

              {s.markPeak && (
                <g>
                  <line
                    x1={sx(top.t)}
                    x2={sx(top.t)}
                    y1={sy(top.c)}
                    y2={sy(0)}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    opacity="0.45"
                  />
                  <circle cx={sx(top.t)} cy={sy(top.c)} r="4.5" fill={color} />
                  <circle
                    cx={sx(top.t)}
                    cy={sy(top.c)}
                    r="9"
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend is real DOM so it is readable without hover and by AT. */}
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {series.map((s) => (
          <li key={s.id} className="flex items-center gap-2.5">
            <svg width="18" height="8" aria-hidden="true" className="shrink-0">
              <line
                x1="0"
                y1="4"
                x2="18"
                y2="4"
                stroke={accentVar[s.accent]}
                strokeWidth="2"
                strokeDasharray={s.dashed ? "4 4" : undefined}
                strokeLinecap="round"
              />
            </svg>
            <span className="label label-bright">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Shared-enzyme competition schematic.
 * Two substrates converge on one enzyme; the perpetrator's edge terminates in
 * an inhibition bar rather than an arrowhead.
 * ----------------------------------------------------------------------- */

export function DdiSchematic({ className = "" }: { className?: string }) {
  const teal = accentVar.teal;
  const violet = accentVar.violet;
  const cyan = accentVar.cyan;

  return (
    <svg
      viewBox="0 0 760 300"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Two drugs competing for one metabolizing enzyme. Drug A is metabolized to a metabolite; Drug B binds the same enzyme and competitively inhibits that pathway, reducing Drug A clearance."
    >
      <defs>
        <marker
          id="ddi-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M0,1 L9,5 L0,9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* edges */}
      <g fill="none" strokeWidth="1.6">
        <path
          d="M148 84 C 250 84, 280 130, 344 144"
          stroke={teal}
          markerEnd="url(#ddi-arrow)"
          color={teal}
          opacity="0.75"
        />
        <path
          d="M148 218 C 250 218, 280 172, 344 158"
          stroke={violet}
          strokeDasharray="6 6"
          opacity="0.75"
        />
        <path
          d="M446 150 L 592 150"
          stroke={cyan}
          markerEnd="url(#ddi-arrow)"
          color={cyan}
          opacity="0.75"
        />
      </g>

      {/* inhibition bar — the classic ⊣ terminator */}
      <line x1="352" y1="176" x2="352" y2="200" stroke={violet} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="340" y1="200" x2="364" y2="200" stroke={violet} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M352 176 L352 166" stroke={violet} strokeWidth="1.6" opacity="0.5" />

      {/* nodes */}
      <NodeBox x={40} y={58} w={108} h={52} label="DRUG A" sub="SUBSTRATE" color={teal} />
      <NodeBox x={40} y={192} w={108} h={52} label="DRUG B" sub="INHIBITOR" color={violet} />
      <NodeBox x={344} y={124} w={102} h={52} label="CYP" sub="ENZYME" color={cyan} emphasis />
      <NodeBox x={592} y={124} w={128} h={52} label="METABOLITE" sub="CLEARED" color={teal} />

      <text
        x={352}
        y={224}
        textAnchor="middle"
        fill="var(--color-faint)"
        style={{ fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: "0.12em" }}
      >
        COMPETITIVE INHIBITION
      </text>
    </svg>
  );
}

/**
 * Shared box primitive for the SVG schematics.
 *
 * `labelClass` / `subClass` let a caller move the type scale into CSS so it can
 * respond to viewport width; omitting them keeps the original fixed sizes, so
 * existing diagrams are unaffected.
 */
export function NodeBox({
  x,
  y,
  w,
  h,
  label,
  sub,
  color,
  emphasis = false,
  labelClass,
  subClass,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  color: string;
  emphasis?: boolean;
  labelClass?: string;
  subClass?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={emphasis ? "var(--color-elevated)" : "var(--color-surface)"}
        stroke={color}
        strokeOpacity={emphasis ? 0.55 : 0.35}
        strokeWidth="1.2"
      />
      <text
        className={labelClass}
        x={x + w / 2}
        y={y + 24}
        textAnchor="middle"
        fill="var(--color-ink)"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: labelClass ? undefined : 17,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </text>
      <text
        className={subClass}
        x={x + w / 2}
        y={y + 41}
        textAnchor="middle"
        fill="var(--color-faint)"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: subClass ? undefined : 13,
          letterSpacing: "0.12em",
        }}
      >
        {sub}
      </text>
    </g>
  );
}
