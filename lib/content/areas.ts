/**
 * "Areas of Work" — the four domains the site is organised around.
 *
 * `highlight` maps each area onto node ids in the hero's heterogeneous graph,
 * so hovering an area lights the corresponding part of the visualisation.
 */

export type Accent = "cyan" | "teal" | "violet";

export interface Area {
  index: string;
  title: string;
  accent: Accent;
  topics: string[];
  note: string;
  /** Node ids in `heteroGraph` emphasised while this area is active. */
  highlight: string[];
}

export const areas: Area[] = [
  {
    index: "01",
    title: "AI for Science",
    accent: "violet",
    topics: ["Machine Learning", "Graph Neural Networks", "Scientific ML"],
    note: "Learning bounded, context-dependent adjustments inside mechanistic models.",
    highlight: ["drug", "cyp", "reaction"],
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
    highlight: ["drug", "metabolite", "gsh"],
  },
  {
    index: "03",
    title: "Mathematical Modeling",
    accent: "cyan",
    topics: ["Differential Equations", "Numerical Methods", "Optimization"],
    note: "Mechanistic systems that stay interpretable and physically constrained.",
    highlight: ["reaction", "plasma", "metabolite"],
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
    highlight: ["patient", "plasma", "cyp", "output"],
  },
];
