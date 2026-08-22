/**
 * The heterogeneous graph schema used in the hero visual and the model
 * explorer's GRAPH view.
 *
 * This describes the *generalized typed schema* — biologically typed entity
 * classes and the relations between them — rather than one worked compound.
 * Nodes are labelled by their type for that reason.
 *
 * Deliberately absent: concentration-over-time. A trajectory is a state of the
 * mechanistic ODE system, not an entity in the biological graph, and showing it
 * here would blur the boundary between the representation and the simulation
 * that consumes it.
 *
 * Coordinates are authored in a 0–100 unit space and mapped into the SVG
 * viewBox at render time, which keeps the layout resolution-independent.
 */

import type { Accent } from "./areas";

export type NodeKind =
  | "patient"
  | "event"
  | "drug"
  | "enzyme"
  | "reaction"
  | "metabolite"
  | "compartment"
  | "outcome";

/** Relation classes that message passing keeps distinct. */
export type Relation =
  | "administration"
  | "metabolism"
  | "catalysis"
  | "distribution"
  | "outcome";

export interface GraphNode {
  id: string;
  /**
   * Rendered one line per entry so long type names stay legible; the joined
   * form is the accessible name (see `nodeLabel`).
   */
  lines: string[];
  kind: NodeKind;
  /** Role or worked examples, surfaced when the node is focused. */
  note: string;
  x: number;
  y: number;
  r: number;
}

/**
 * Colour is a property of the entity class, not of the individual node, so it
 * is derived from `kind` rather than repeated per node. Site-wide semantics:
 * cyan = context and outputs, teal = molecular species, violet = catalytic
 * machinery.
 */
export const kindAccent: Record<NodeKind, Accent> = {
  patient: "cyan",
  event: "cyan",
  drug: "teal",
  enzyme: "violet",
  reaction: "violet",
  metabolite: "teal",
  compartment: "cyan",
  outcome: "cyan",
};

export function nodeAccent(node: GraphNode): Accent {
  return kindAccent[node.kind];
}

export interface GraphEdge {
  from: string;
  to: string;
  relation: Relation;
  /** Renders a travelling pulse along this edge. */
  pulse?: boolean;
  /** Exchange rather than one-way flow — drawn with arrowheads at both ends. */
  bidirectional?: boolean;
}

export function nodeLabel(node: GraphNode): string {
  return node.lines.join(" ");
}

export const graphNodes: GraphNode[] = [
  {
    id: "patient",
    lines: ["Patient"],
    kind: "patient",
    note: "Individual context and physiology",
    x: 5,
    y: 44,
    r: 5,
  },
  {
    id: "administration",
    lines: ["Administration", "Event"],
    kind: "event",
    note: "Dose, route and timing",
    x: 24,
    y: 16,
    r: 4.5,
  },
  {
    id: "drug",
    lines: ["Drug"],
    kind: "drug",
    note: "Administered compound — the reaction substrate",
    x: 38,
    y: 48,
    r: 6.5,
  },
  {
    id: "enzyme",
    lines: ["Enzyme"],
    kind: "enzyme",
    note: "Catalyses a reaction — e.g. a CYP isoform",
    x: 54,
    y: 7,
    r: 5,
  },
  {
    id: "reaction",
    lines: ["Reaction"],
    kind: "reaction",
    note: "Biotransformation step with its own kinetics",
    x: 60,
    y: 42,
    r: 6,
  },
  {
    id: "compartment",
    lines: ["Physiological", "Compartment"],
    kind: "compartment",
    note: "Where a species resides — e.g. plasma, liver, gut",
    x: 51,
    y: 82,
    r: 5,
  },
  {
    id: "metabolite",
    lines: ["Metabolite"],
    kind: "metabolite",
    note: "Reaction product, itself a modelled species",
    x: 82,
    y: 29,
    r: 5.5,
  },
  {
    id: "outcome",
    lines: ["Clinical", "Outcome"],
    kind: "outcome",
    note: "Downstream consequence the model reasons toward",
    x: 92,
    y: 71,
    r: 4.5,
  },
];

export const graphEdges: GraphEdge[] = [
  { from: "patient", to: "administration", relation: "administration", pulse: true },
  { from: "administration", to: "drug", relation: "administration", pulse: true },
  { from: "drug", to: "reaction", relation: "metabolism", pulse: true },
  { from: "enzyme", to: "reaction", relation: "catalysis" },
  { from: "reaction", to: "metabolite", relation: "metabolism", pulse: true },
  { from: "reaction", to: "compartment", relation: "distribution", bidirectional: true },
  { from: "metabolite", to: "outcome", relation: "outcome", pulse: true },
];

export const relationLabel: Record<Relation, string> = {
  administration: "Administration",
  metabolism: "Metabolism",
  catalysis: "Catalysis",
  distribution: "Distribution",
  outcome: "Outcome",
};

/** Catalysis is modulation rather than mass transfer, so it is drawn dashed. */
export const relationDash: Record<Relation, string | undefined> = {
  administration: undefined,
  metabolism: undefined,
  catalysis: "5 6",
  distribution: undefined,
  outcome: undefined,
};

export const relationAccent: Record<Relation, Accent> = {
  administration: "cyan",
  metabolism: "teal",
  catalysis: "violet",
  distribution: "cyan",
  outcome: "cyan",
};

/**
 * Compact typed-schema summary rendered beneath the interactive graph. It
 * doubles as the non-hover, screen-reader-friendly description of the same
 * structure the diagram draws.
 */
export const relationSchema: { relation: Relation; chain: string }[] = [
  { relation: "administration", chain: "Patient → Administration Event → Drug" },
  { relation: "metabolism", chain: "Drug → Reaction → Metabolite" },
  { relation: "catalysis", chain: "Enzyme → Reaction" },
  // ↔ rather than ⇄: the double-barbed arrow is missing from many monospace
  // faces and falls back to a glyph that reads as "not equal".
  { relation: "distribution", chain: "Reaction ↔ Physiological Compartment" },
  { relation: "outcome", chain: "Metabolite → Clinical Outcome" },
];
