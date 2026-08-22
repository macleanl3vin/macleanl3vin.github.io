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
      "Python",
      "PyTorch",
      "Machine Learning",
      "Graph Neural Networks",
      "NumPy / SciPy",
    ],
  },
  {
    index: "02",
    domain: "Mathematical Systems",
    accent: "cyan",
    items: [
      "Ordinary Differential Equations",
      "Numerical Integration",
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
    items: ["Git", "Databases", "APIs", "Web Systems", "Java"],
  },
];
