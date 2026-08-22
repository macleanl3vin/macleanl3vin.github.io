/**
 * Capabilities grouped under scientific domains rather than a logo wall.
 * Typography does the work here — no vendor marks.
 */

import type { Accent } from "./areas";

export interface SkillGroup {
  index: string;
  domain: string;
  accent: Accent;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    index: "01",
    domain: "Computation",
    accent: "violet",
    items: [
      "Python & PyTorch",
      "Graph Neural Networks (PyTorch Geometric)",
      "Machine Learning",
      "RDKit / Molecular Fingerprints",
      "NumPy / SciPy / pandas / Matplotlib",
    ],
  },
  {
    index: "02",
    domain: "Mathematical Systems",
    accent: "cyan",
    items: [
      "Ordinary Differential Equations",
      "Differentiable Numerical Integration",
      "Optimization",
      "Scientific Computing",
      "Parameter Estimation",
    ],
  },
  {
    index: "03",
    domain: "Molecular Science",
    accent: "teal",
    items: [
      "Pharmacokinetics",
      "Drug Discovery",
      "Molecular Graphs",
      "Drug–Drug Interactions",
      "Cheminformatics",
    ],
  },
  {
    index: "04",
    domain: "Software",
    accent: "cyan",
    items: ["Git", "Databases", "APIs", "Web Systems"],
  },
];
