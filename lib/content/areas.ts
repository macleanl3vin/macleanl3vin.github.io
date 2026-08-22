/**
 * "Areas of Work" — the four domains the site is organised around.
 */

export type Accent = "cyan" | "teal" | "violet";

export interface Area {
  index: string;
  title: string;
  accent: Accent;
  topics: string[];
  note: string;
}

export const areas: Area[] = [
  {
    index: "01",
    title: "Machine Learning for Science",
    accent: "violet",
    topics: ["Machine Learning", "Graph Neural Networks", "Scientific ML"],
    note: "Learning bounded, context-dependent adjustments inside mechanistic models.",
  },
  {
    index: "02",
    title: "Molecular Systems",
    accent: "teal",
    topics: [
      "Drug Discovery",
      "Molecular Representation",
      "Cheminformatics",
    ],
    note: "Treating molecules as graphs — atoms, bonds, and the reactions they enter.",
  },
  {
    index: "03",
    title: "Mechanistic Modeling",
    accent: "cyan",
    topics: ["Differential Equations", "Numerical Methods", "Optimization"],
    note: "Mechanistic systems that stay interpretable and physically constrained.",
  },
  {
    index: "04",
    title: "Computational Pharmacology",
    accent: "cyan",
    topics: [
      "Pharmacokinetics",
      "PK / PD",
      "Drug–Drug Interactions",
      "Mechanistic Modeling",
    ],
    note: "How dose becomes exposure — and what happens when two drugs share a pathway.",
  },
];
