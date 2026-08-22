"use client";

import { useId, useMemo, useState } from "react";
import {
  graphEdges,
  graphNodes,
  kindAccent,
  nodeKindLabel,
  nodeKindOrder,
  type GraphNode,
} from "@/lib/content/graph";
import { accentVar } from "@/lib/accent";
import { Label } from "@/components/ui/primitives";

/* --------------------------------------------------------------------------
 * Heterogeneous biological graph.
 *
 * Authoring coordinates live in a 0–100 space (lib/content/graph.ts) and are
 * projected into the viewBox here, so layout is resolution-independent and
 * the same data drives both the ambient hero visual and the interactive
 * explorer view.
 * ----------------------------------------------------------------------- */

const VB_W = 1000;
const VB_H = 620;
const INSET = { l: 74, r: 74, t: 78, b: 78 };

const px = (x: number) => INSET.l + (x / 100) * (VB_W - INSET.l - INSET.r);
const py = (y: number) => INSET.t + (y / 100) * (VB_H - INSET.t - INSET.b);
const pr = (r: number) => r * 2.15;

/** Gentle arc between two nodes, trimmed to sit outside both node radii. */
function edgeGeometry(a: GraphNode, b: GraphNode) {
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
  const startGap = pr(a.r) + 7;
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
        aria-label="Heterogeneous biological graph linking a patient, an administered drug, a metabolizing enzyme, a reaction, its metabolites, plasma compartment and clinical output."
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

            const { path, approxLen } = edgeGeometry(a, b);
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
                  strokeDasharray={edge.dashed ? "5 6" : undefined}
                  markerEnd={`url(#arrow-${uid})`}
                  color={lit ? "var(--color-line-strong)" : "var(--color-line)"}
                  style={{ transition: "stroke 420ms, stroke-width 420ms" }}
                />

                {/* Travelling pulse — decorative; removed under reduced motion. */}
                {edge.pulse && (
                  <path
                    className="anim-pulse-edge"
                    d={path}
                    fill="none"
                    stroke={accentVar[b.accent]}
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
            const color = accentVar[node.accent];

            return (
              <g
                key={node.id}
                // Tier-2 nodes are dropped on narrow viewports to keep the
                // mobile graph legible rather than hiding it entirely.
                className={node.tier === 2 ? "hidden sm:inline" : undefined}
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
                    aria-label={`${node.label} — ${nodeKindLabel[node.kind]}`}
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

                {/* Label */}
                <text
                  x={cx}
                  y={cy + r + 26}
                  textAnchor="middle"
                  fill={lit ? "var(--color-ink)" : "var(--color-muted)"}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 19,
                    letterSpacing: "0.1em",
                    transition: "fill 420ms",
                  }}
                >
                  {node.label.toUpperCase()}
                </text>

                {/* Type annotation, only when the node is the focus. */}
                <text
                  x={cx}
                  y={cy + r + 45}
                  textAnchor="middle"
                  fill="var(--color-faint)"
                  opacity={active === node.id ? 1 : 0}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 15,
                    letterSpacing: "0.12em",
                    transition: "opacity 300ms",
                  }}
                >
                  {nodeKindLabel[node.kind].toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {interactive && (
        <>
          {/* Legend doubles as the accessible, non-hover description. */}
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-line-faint pt-6">
            {nodeKindOrder.map((kind) => (
              <li key={kind} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full"
                  style={{ background: accentVar[kindAccent[kind]] }}
                />
                <Label>{nodeKindLabel[kind]}</Label>
              </li>
            ))}
          </ul>

          <p
            aria-live="polite"
            className="mt-5 min-h-[1.25rem] text-[0.8rem] text-muted"
          >
            {activeNode
              ? `${activeNode.label} · ${nodeKindLabel[activeNode.kind]}`
              : "Focus a node to inspect its type and neighbourhood."}
          </p>
        </>
      )}
    </div>
  );
}
