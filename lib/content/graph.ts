/**
 * Node/edge data for the heterogeneous biological graph used in the hero and
 * in the model explorer.
 *
 * Coordinates are authored in a 0–100 unit space and mapped into the SVG
 * viewBox at render time, which keeps the layout resolution-independent and
 * makes it trivial to drop nodes on smaller screens (`tier`).
 *
 * The structure illustrates acetaminophen (APAP) disposition — a standard
 * textbook example — and is labelled as illustrative wherever it is shown.
 */

import type { Accent } from "./areas";

export type NodeKind =
  | "patient"
  | "event"
  | "drug"
  | "reaction"
  | "enzyme"
  | "metabolite"
  | "compartment"
  | "output";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  accent: Accent;
  x: number;
  y: number;
  r: number;
  /** 1 = always shown, 2 = desktop only. Keeps the mobile graph legible. */
  tier: 1 | 2;
}

export interface GraphEdge {
  from: string;
  to: string;
  /** Renders a travelling pulse along this edge. */
  pulse?: boolean;
  /** Dashed edges denote catalysis / modulation rather than mass transfer. */
  dashed?: boolean;
}

export const graphNodes: GraphNode[] = [
  { id: "patient", label: "Patient", kind: "patient", accent: "cyan", x: 9, y: 20, r: 5, tier: 1 },
  { id: "dose", label: "Dose", kind: "event", accent: "cyan", x: 9, y: 60, r: 4, tier: 2 },
  { id: "drug", label: "APAP", kind: "drug", accent: "teal", x: 36, y: 34, r: 7, tier: 1 },
  { id: "cyp", label: "CYP2E1", kind: "enzyme", accent: "violet", x: 34, y: 8, r: 5, tier: 1 },
  { id: "reaction", label: "Reaction", kind: "reaction", accent: "violet", x: 61, y: 20, r: 5.5, tier: 1 },
  { id: "plasma", label: "Plasma", kind: "compartment", accent: "cyan", x: 44, y: 72, r: 6, tier: 1 },
  { id: "metabolite", label: "NAPQI", kind: "metabolite", accent: "teal", x: 82, y: 40, r: 5, tier: 1 },
  { id: "gsh", label: "GSH", kind: "metabolite", accent: "teal", x: 74, y: 80, r: 4.5, tier: 2 },
  { id: "output", label: "C(t)", kind: "output", accent: "cyan", x: 93, y: 68, r: 4.5, tier: 2 },
];

export const graphEdges: GraphEdge[] = [
  { from: "patient", to: "drug", pulse: true },
  { from: "patient", to: "dose" },
  { from: "dose", to: "plasma" },
  { from: "drug", to: "reaction", pulse: true },
  { from: "cyp", to: "reaction", dashed: true },
  { from: "drug", to: "plasma" },
  { from: "reaction", to: "metabolite", pulse: true },
  { from: "metabolite", to: "gsh" },
  { from: "plasma", to: "gsh" },
  { from: "plasma", to: "output", pulse: true },
  { from: "metabolite", to: "output" },
];

export const nodeKindLabel: Record<NodeKind, string> = {
  patient: "Patient",
  event: "Administration Event",
  drug: "Drug",
  reaction: "Reaction",
  enzyme: "Enzyme",
  metabolite: "Metabolite",
  compartment: "Compartment",
  output: "Clinical Output",
};

/** Legend order for the model explorer's GRAPH tab. */
export const nodeKindOrder: NodeKind[] = [
  "patient",
  "event",
  "drug",
  "enzyme",
  "reaction",
  "metabolite",
  "compartment",
  "output",
];

export const kindAccent: Record<NodeKind, Accent> = {
  patient: "cyan",
  event: "cyan",
  drug: "teal",
  reaction: "violet",
  enzyme: "violet",
  metabolite: "teal",
  compartment: "cyan",
  output: "cyan",
};
