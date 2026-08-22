/**
 * Research / work timeline.
 *
 * ── ACTION REQUIRED ───────────────────────────────────────────────────────
 * TODO(MacLean): confirm the entry below. It was transcribed from the brief
 * you supplied and has not been independently verified. Correct the dates,
 * title and description — or delete the entry — before publishing.
 *
 * Nothing here claims a degree, award, publication or outcome. Add further
 * entries by appending to the array; the timeline renders whatever it is given.
 */

import type { Accent } from "./areas";

export interface TimelineEntry {
  period: string;
  organization: string;
  unit?: string;
  role: string;
  accent: Accent;
  summary: string;
  tags: string[];
}

export const timeline: TimelineEntry[] = [
  {
    period: "2026",
    organization: "MUSC",
    unit: "Drug Discovery Core",
    role: "Computational Drug Discovery Research",
    accent: "cyan",
    summary:
      "Research at the intersection of machine learning and mechanistic modeling — molecular representation, pharmacokinetic systems, and the numerical methods that connect them.",
    tags: ["GNN", "PK / PD", "ODE", "Scientific ML"],
  },
  // TODO(MacLean): add education, prior roles, or teaching here.
];

/**
 * Quantitative anchors. These describe the *scope and configuration* of the
 * modelling work — deliberately not accuracy, benchmark or outcome numbers,
 * none of which are reported anywhere on this site.
 *
 * TODO(MacLean): confirm these against the current model configuration.
 */
export interface Highlight {
  value: string;
  unit?: string;
  label: string;
  accent: Accent;
  note: string;
}

export const highlights: Highlight[] = [
  {
    value: "03",
    label: "Drugs Modeled",
    accent: "teal",
    note: "Concurrent substrates in the multi-drug regime",
  },
  {
    value: "09",
    label: "Biological Node Types",
    accent: "violet",
    note: "Distinct entity classes in the heterogeneous graph",
  },
  {
    value: "24",
    unit: "h",
    label: "Simulation Horizon",
    accent: "cyan",
    note: "Integration window per administration event",
  },
  {
    value: "GNN + ODE",
    label: "Hybrid System",
    accent: "cyan",
    note: "Learned parameters, mechanistic dynamics",
  },
];
