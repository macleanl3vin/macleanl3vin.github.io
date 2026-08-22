"use client";

import { useId, useMemo, useState } from "react";
import {
  graphEdges,
  graphNodes,
  nodeAccent,
  nodeLabel,
  relationAccent,
  relationDash,
  relationLabel,
  relationSchema,
  type GraphNode,
} from "@/lib/content/graph";
import { accentVar } from "@/lib/accent";
import { Label } from "@/components/ui/primitives";

/* --------------------------------------------------------------------------
 * Heterogeneous biological graph.
 *
 * Draws the generalized typed schema from lib/content/graph.ts: biologically
 * typed entity classes and the relations between them. Authoring coordinates
 * live in a 0–100 space and are projected into the viewBox here, so layout is
 * resolution-independent and the same data drives both the ambient hero visual
 * and the interactive explorer view.
 * ----------------------------------------------------------------------- */

const VB_W = 1000;
const VB_H = 620;
const INSET = { l: 74, r: 74, t: 78, b: 78 };

const px = (x: number) => INSET.l + (x / 100) * (VB_W - INSET.l - INSET.r);
const py = (y: number) => INSET.t + (y / 100) * (VB_H - INSET.t - INSET.b);
const pr = (r: number) => r * 2.15;

/**
 * Gentle arc between two nodes, trimmed to sit outside both node radii.
 * `startMarker` widens the leading gap so a start arrowhead does not collide
 * with the source node.
 */
function edgeGeometry(a: GraphNode, b: GraphNode, startMarker = false) {
  const x1 = px(a.x);
  const y1 = py(a.y);
  const x2 = px(b.x);
  const y2 = py(b.y);

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  // Trim so the line stops just short of each node's circle.
  const startGap = pr(a.r) + (startMarker ? 10 : 7);
  const endGap = pr(b.r) + 10;
  const sx = x1 + ux * startGap;
  const sy = y1 + uy * startGap;
  const ex = x2 - ux * endGap;
  const ey = y2 - uy * endGap;

  // Bow the curve perpendicular to its own direction, scaled by length.
  const bow = Math.min(len * 0.11, 34);
  const cx = (sx + ex) / 2 - uy * bow;
  const cy = (sy + ey) / 2 + ux * bow;

  const path = `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  // Quadratic arc length approximation — good enough for dash timing.
  const approxLen = Math.hypot(cx - sx, cy - sy) + Math.hypot(ex - cx, ey - cy);

  return { path, approxLen, ex, ey, ux, uy };
}

export function HeteroGraph({
  variant = "ambient",
  className = "",
  highlight,
}: {
  variant?: "ambient" | "interactive";
  className?: string;
  /** Node ids to emphasise from outside (e.g. a hovered category). */
  highlight?: string[];
}) {
  const uid = useId().replace(/[:]/g, "");
  const [active, setActive] = useState<string | null>(null);

  const byId = useMemo(
    () => new Map(graphNodes.map((n) => [n.id, n])),
    [],
  );

  /** Nodes adjacent to the active node, so hovering lights a neighbourhood. */
  const neighbourhood = useMemo(() => {
    const focus = active ?? null;
    if (!focus) return null;
    const set = new Set<string>([focus]);
    for (const e of graphEdges) {
      if (e.from === focus) set.add(e.to);
      if (e.to === focus) set.add(e.from);
    }
    return set;
  }, [active]);

  const external = highlight && highlight.length ? new Set(highlight) : null;
  const emphasis = neighbourhood ?? external;

  const isDim = (id: string) => Boolean(emphasis) && !emphasis!.has(id);
  const edgeDim = (from: string, to: string) =>
    Boolean(emphasis) && !(emphasis!.has(from) && emphasis!.has(to));

  const interactive = variant === "interactive";
  const activeNode = active ? byId.get(active) : undefined;

  return (
    <div className={`relative ${className}`}>
      {/* Radial lift behind the graph — barely visible, adds depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 52% at 52% 44%, color-mix(in oklab, var(--color-cyan) 6%, transparent), transparent 72%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Heterogeneous biological graph schema. A patient connects through an administration event to a drug; the drug enters a reaction which an enzyme catalyses; the reaction produces a metabolite and exchanges with a physiological compartment; the metabolite leads to a clinical outcome."
      >
        <defs>
          <marker
            id={`arrow-${uid}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,1 L9,5 L0,9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </marker>
        </defs>

        {/* ---- edges ---------------------------------------------------- */}
        <g>
          {graphEdges.map((edge, i) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;

            const { path, approxLen } = edgeGeometry(a, b, edge.bidirectional);
            const dim = edgeDim(edge.from, edge.to);
            const lit = Boolean(emphasis) && !dim;

            return (
              <g
                key={`${edge.from}-${edge.to}`}
                style={{
                  transition: "opacity 420ms cubic-bezier(0.22,1,0.36,1)",
                  opacity: dim ? 0.22 : 1,
                }}
              >
                <path
                  d={path}
                  fill="none"
                  stroke={lit ? "var(--color-line-strong)" : "var(--color-line)"}
                  strokeWidth={lit ? 1.7 : 1.3}
                  strokeDasharray={relationDash[edge.relation]}
                  markerEnd={`url(#arrow-${uid})`}
                  // Exchange relations carry an arrowhead at both ends.
                  markerStart={
                    edge.bidirectional ? `url(#arrow-${uid})` : undefined
                  }
                  color={lit ? "var(--color-line-strong)" : "var(--color-line)"}
                  style={{ transition: "stroke 420ms, stroke-width 420ms" }}
                />

                {/* Travelling pulse — decorative; removed under reduced motion. */}
                {edge.pulse && (
                  <path
                    className="anim-pulse-edge"
                    d={path}
                    fill="none"
                    stroke={accentVar[nodeAccent(b)]}
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    style={
                      {
                        "--dash-len": approxLen,
                        "--dur": `${5.5 + i * 0.9}s`,
                        "--delay": `${i * 1.35}s`,
                        strokeDasharray: `${Math.min(46, approxLen * 0.3)} ${approxLen}`,
                      } as React.CSSProperties
                    }
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ---- nodes ---------------------------------------------------- */}
        <g>
          {graphNodes.map((node, i) => {
            const cx = px(node.x);
            const cy = py(node.y);
            const r = pr(node.r);
            const dim = isDim(node.id);
            const lit = Boolean(emphasis) && !dim;
            const color = accentVar[nodeAccent(node)];

            const label = nodeLabel(node);

            return (
              <g
                key={node.id}
                // Every node is a distinct entity class in the schema, so none
                // can be dropped on narrow viewports without breaking it. The
                // label type scale compensates instead — see .graph-label.
                style={{
                  transition: "opacity 420ms cubic-bezier(0.22,1,0.36,1)",
                  opacity: dim ? 0.26 : 1,
                }}
                onMouseEnter={interactive ? () => setActive(node.id) : undefined}
                onMouseLeave={interactive ? () => setActive(null) : undefined}
              >
                {interactive && (
                  /* Generous, invisible hit area — the visible dot is small. */
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 22}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${label} — ${node.note}`}
                    onFocus={() => setActive(node.id)}
                    onBlur={() => setActive(null)}
                    style={{ cursor: "pointer", outlineOffset: 0 }}
                  />
                )}

                {/* Halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + (lit ? 13 : 9)}
                  fill={color}
                  opacity={lit ? 0.16 : 0.07}
                  style={{ transition: "r 420ms, opacity 420ms" }}
                />

                {/* Breathing core */}
                <circle
                  className="anim-breathe"
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={color}
                  style={
                    {
                      "--node-r": r,
                      "--dur": `${6.5 + (i % 4) * 1.4}s`,
                      "--delay": `${i * 0.6}s`,
                    } as React.CSSProperties
                  }
                />

                {/* Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 5.5}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity={lit ? 0.55 : 0.28}
                  style={{ transition: "opacity 420ms" }}
                />

                {/* Label — the node's entity type, one tspan per line so long
                    type names stay legible instead of overrunning neighbours. */}
                <text
                  className="graph-label"
                  x={cx}
                  y={cy + r + 26}
                  textAnchor="middle"
                  fill={lit ? "var(--color-ink)" : "var(--color-muted)"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.1em",
                    transition: "fill 420ms",
                  }}
                >
                  {node.lines.map((line, li) => (
                    <tspan key={line} x={cx} dy={li === 0 ? 0 : 21}>
                      {line.toUpperCase()}
                    </tspan>
                  ))}
                </text>

                {/* Role annotation, only while the node is the focus. */}
                <text
                  className="graph-note"
                  x={cx}
                  y={cy + r + 26 + node.lines.length * 21}
                  textAnchor="middle"
                  fill="var(--color-faint)"
                  opacity={active === node.id ? 1 : 0}
                  style={{
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em",
                    transition: "opacity 300ms",
                  }}
                >
                  {node.note}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {interactive && (
        <>
          {/* Typed relation schema. Since every node is now labelled by its
              entity class, a node-type legend would only repeat the diagram;
              naming the relations carries the information the diagram cannot,
              and doubles as the accessible non-hover description. */}
          <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line-faint pt-6 sm:grid-cols-2">
            {relationSchema.map(({ relation, chain }) => (
              <div key={relation} className="flex items-baseline gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ background: accentVar[relationAccent[relation]] }}
                />
                <div className="min-w-0">
                  <dt>
                    <Label>{relationLabel[relation]}</Label>
                  </dt>
                  <dd className="mt-1.5 font-mono text-[0.72rem] leading-relaxed text-muted">
                    {chain}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <p
            aria-live="polite"
            className="mt-6 min-h-[1.25rem] text-[0.8rem] text-muted"
          >
            {activeNode
              ? `${nodeLabel(activeNode)} · ${activeNode.note}`
              : "Focus a node to inspect its role and neighbourhood."}
          </p>
        </>
      )}
    </div>
  );
}
