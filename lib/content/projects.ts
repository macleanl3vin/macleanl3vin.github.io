/**
 * Research / project content model.
 *
 * Adding a project = appending one object to `projects`. Detail pages are
 * generated from `sections`; a project with no `sections` renders as an index
 * entry only and is excluded from static path generation.
 *
 * ── CONTENT POLICY ────────────────────────────────────────────────────────
 * Nothing in this file asserts a result, metric, publication or affiliation
 * that has not been supplied. Sections that require real experimental output
 * use `{ kind: "pending" }`, which renders as an explicit, designed
 * "in preparation" state instead of invented findings.
 */

import type { Accent } from "./areas";

export type FigureId =
  | "architecture"
  | "hetero-graph"
  | "pk-curve"
  | "ddi"
  | "mechanism";

/**
 * Equation systems a section can reference. Declared here, alongside
 * `FigureId`, so the content model stays the source of truth and does not have
 * to import from the component layer.
 */
export type EquationSystem = "denominator" | "reaction-rate" | "reduced";

export type Block =
  | { kind: "prose"; paragraphs: string[] }
  | { kind: "terms"; intro?: string; items: { term: string; detail: string }[] }
  | { kind: "figure"; figure: FigureId; number: string; caption: string }
  | {
      kind: "equation";
      number: string;
      caption: string;
      system: EquationSystem;
    }
  | { kind: "pending"; note: string };

export interface ResearchSection {
  id: string;
  index: string;
  title: string;
  blocks: Block[];
}

export interface Project {
  slug: string;
  index: string;
  category: string;
  title: string;
  /** One line, used on cards and as the page lede. */
  tagline: string;
  /** Longer framing sentence for the featured panel. */
  summary: string;
  accent: Accent;
  year: string;
  status: string;
  meta: { key: string; value: string }[];
  tags: string[];
  /** Present only when the project has a detail page worth reading. */
  sections?: ResearchSection[];
  /** Real URL or null — never a placeholder href. */
  repo?: string | null;
}

export const projects: Project[] = [
  {
    slug: "pharml-pk",
    index: "01",
    category: "Computational Pharmacology",
    title: "PharML PK",
    tagline:
      "Hybrid AI and mechanistic modeling for multi-drug pharmacokinetics.",
    summary:
      "A hybrid graph neural network and mechanistic ODE framework for modeling multi-drug pharmacokinetics and drug–drug interactions.",
    accent: "cyan",
    year: "2026",
    status: "Active Research",
    meta: [
      { key: "Model", value: "GNN + ODE" },
      { key: "Domain", value: "PK / DDI" },
      { key: "Language", value: "Python" },
      { key: "Year", value: "2026" },
    ],
    tags: [
      "Graph Neural Networks",
      "Ordinary Differential Equations",
      "Pharmacokinetics",
      "Drug–Drug Interactions",
      "Scientific ML",
    ],
    // TODO(MacLean): set this to the repository URL once the project is public.
    repo: null,
    sections: [
      {
        id: "problem",
        index: "01",
        title: "Problem",
        blocks: [
          {
            kind: "prose",
            paragraphs: [
              "Pharmacokinetic models describe what the body does to a drug: how quickly it is absorbed, how it distributes between tissues, how it is metabolized, and how it is cleared. Classical compartmental models express this as a small system of ordinary differential equations whose parameters — absorption rate, volume of distribution, clearance — are fitted per compound from measured concentration data.",
              "That approach is interpretable and physically grounded, but it does not generalize. Each new compound requires its own fit, and the model has no notion of chemical structure: two molecules that differ by a single substituent are, to the ODE system, unrelated sets of numbers.",
              "Drug–drug interactions make the gap sharper. When two compounds compete for the same metabolizing enzyme, the clearance of one becomes a function of the concentration of the other. The interaction is mechanistic and time-varying, so it cannot be captured by a static correction factor — yet predicting it for an unseen pair of molecules is exactly the kind of structure-dependent question a fitted compartmental model cannot answer.",
            ],
          },
          {
            kind: "terms",
            intro: "The framework is built around three constraints.",
            items: [
              {
                term: "Context must enter the model",
                detail:
                  "Predictions should depend on the patient, the regimen and the biology connecting them — not on a per-compound parameter table fitted in isolation.",
              },
              {
                term: "Dynamics must stay mechanistic",
                detail:
                  "Concentration–time behaviour should come from a system of differential equations with physical meaning, not from a black-box sequence model.",
              },
              {
                term: "Interactions must be emergent",
                detail:
                  "Competition at a shared enzyme should fall out of the mechanism, not be injected as a hand-tuned interaction term.",
              },
            ],
          },
        ],
      },
      {
        id: "approach",
        index: "02",
        title: "Approach",
        blocks: [
          {
            kind: "prose",
            paragraphs: [
              "PharML PK splits the problem along the line where each method is strongest. A graph neural network handles the part that depends on context — reading a heterogeneous graph of the patient, the administered drugs and the biological mechanism connecting them. A mechanistic ODE system handles the part that depends on time.",
              "The learned component never predicts concentrations directly, and it does not invent kinetic constants from nothing. It emits bounded adjustment factors that modulate reaction, clearance, absorption and disposition terms already present in the mechanism. The equations do the rest. This keeps the temporal behaviour physically constrained: mass is conserved, concentrations stay non-negative, and the shape of every curve is one the mechanism can actually produce.",
              "Because the ODE solve is differentiable, error measured on the concentration–time output can be propagated back through the solver into the network weights. The model is therefore trained end-to-end on the quantity that matters, while the inductive bias of the mechanism is preserved.",
            ],
          },
          {
            kind: "figure",
            figure: "architecture",
            number: "01",
            caption:
              "Hybrid model architecture — context graph to dynamic exposure.",
          },
        ],
      },
      {
        id: "architecture",
        index: "03",
        title: "Model Architecture",
        blocks: [
          {
            kind: "prose",
            paragraphs: [
              "The system is represented as a heterogeneous graph. Rather than a single molecular graph, nodes carry distinct types — patient, administration event, drug, enzyme, reaction, metabolite, physiological compartment and clinical outcome — and edges carry the relation between them. A patient reaches a drug through an administration event; the drug enters a reaction that an enzyme catalyzes; the reaction yields a metabolite and exchanges with a compartment.",
              "Message passing runs over this typed structure with relation-specific transformations. Nodes and relations retain their biological roles throughout, so catalysis, metabolism, administration and distribution are each propagated differently rather than collapsed into one generic edge.",
              "Concentration over time is deliberately not a node here. A trajectory is a state of the mechanistic system downstream, not an entity in the biological graph — keeping that boundary sharp is what lets the representation stay reusable across regimens.",
              "Readout produces bounded reaction and disposition factors — multiplicative adjustments constrained to a plausible range, applied to the reaction, clearance, absorption and disposition terms the mechanistic system already defines. The network shifts those terms within limits; it does not originate them, and it cannot move them somewhere the mechanism does not permit.",
            ],
          },
          {
            kind: "figure",
            figure: "hetero-graph",
            number: "02",
            caption:
              "Heterogeneous biological graph — typed entity classes and the relations between them.",
          },
        ],
      },
      {
        id: "mechanistic-system",
        index: "04",
        title: "Mechanistic System",
        blocks: [
          {
            kind: "prose",
            paragraphs: [
              "The learned factors are applied inside a compartmental system that evolves drug mass through plasma and hepatic states. The structure is shared: however many compounds a regimen contains, there is one plasma state, one hepatic state and one term per enzyme — not an independent pipeline per drug. That is what makes the drugs able to affect one another at all.",
              "An enzyme has finite capacity, so everything routed through it competes for the same sites. Rather than treating each pair of drugs as a special case, the framework collects every contribution at an enzyme into a single denominator: each substrate on that enzyme contributes a C/Km term, each inhibitor an I/Ki term. Because metabolism happens in the liver, these are evaluated at hepatic concentration rather than plasma concentration.",
            ],
          },
          {
            kind: "equation",
            number: "01",
            caption:
              "Shared-enzyme denominator — one per enzyme, accumulating every substrate and inhibitor acting on it.",
            system: "denominator",
          },
          {
            kind: "prose",
            paragraphs: [
              "Each reaction rate is then the product of three separable pieces: the mechanistic capacity of the enzyme, a bounded learned factor, and the substrate's own term divided by that shared denominator. The first is physiology, the second is what the network is allowed to adjust, and the third is where competition enters.",
              "Keeping them as distinct factors is deliberate. The network can shift a reaction's throughput within its bounds, but it cannot change the functional form of the competition, and it cannot produce a rate the mechanism does not admit.",
            ],
          },
          {
            kind: "equation",
            number: "02",
            caption:
              "Reaction rate — kinetic capacity × bounded learned factor × substrate term over the shared denominator.",
            system: "reaction-rate",
          },
          {
            kind: "prose",
            paragraphs: [
              "Nothing about this formulation is exotic. With a single substrate and a single inhibitor on an enzyme the denominator collapses, algebraically and exactly, to the familiar apparent-Michaelis-constant form — Km scaled by (1 + I/Ki). The general version simply stops requiring that the regimen contain only two drugs.",
              "That reduced case is what the interactive simulation elsewhere on this site integrates, which is why its curves and the equations above describe the same mechanism rather than two different ones.",
            ],
          },
          {
            kind: "equation",
            number: "03",
            caption:
              "The two-drug reduction — the case the in-browser simulation integrates.",
            system: "reduced",
          },
          {
            kind: "figure",
            figure: "mechanism",
            number: "03",
            caption:
              "Mechanistic state flow — several drugs, one plasma state, one hepatic state, one term per shared enzyme.",
          },
        ],
      },
      {
        id: "experiments",
        index: "05",
        title: "Experiments",
        blocks: [
          {
            kind: "pending",
            note: "Datasets, splits, baselines and training protocol are being written up. This section will describe how the model is evaluated and against what.",
          },
        ],
      },
      {
        id: "results",
        index: "06",
        title: "Results",
        blocks: [
          {
            kind: "pending",
            note: "Quantitative results are not yet published. No performance figures are reported here until they are measured and reproducible.",
          },
        ],
      },
      {
        id: "limitations",
        index: "07",
        title: "Limitations",
        blocks: [
          {
            kind: "terms",
            intro:
              "The following are known constraints of the approach as designed.",
            items: [
              {
                term: "Mechanistic misspecification",
                detail:
                  "Constraining dynamics to a chosen compartmental structure is what buys interpretability, but if the true disposition of a compound needs more compartments or a different clearance mechanism, no amount of learned parameterization recovers it.",
              },
              {
                term: "Competitive inhibition is one mechanism among many",
                detail:
                  "Enzyme induction, mechanism-based inactivation, transporter-mediated interactions and protein-binding displacement are not represented by a competitive term alone.",
              },
              {
                term: "Coverage of the training context",
                detail:
                  "Learned factors are only as general as the drugs, enzymes and pathways represented during training. A regimen whose mechanism graph looks unlike anything seen before should be treated as out of distribution.",
              },
              {
                term: "No structural generalization yet",
                detail:
                  "Because the model reads a mechanism graph rather than molecular structure, a genuinely novel compound needs its pathway context supplied. Inferring that context from chemistry is future work, not a current capability.",
              },
              {
                term: "Population variability",
                detail:
                  "The current formulation targets typical-subject kinetics. Inter-individual variation — genotype, organ function, age — is not yet modelled as a random-effects layer.",
              },
              {
                term: "Cost of differentiating through the solver",
                detail:
                  "Backpropagating through numerical integration is considerably more expensive than a direct regression, and stiff parameter regimes can make gradients poorly conditioned.",
              },
            ],
          },
        ],
      },
      {
        id: "future-work",
        index: "08",
        title: "Future Work",
        blocks: [
          {
            kind: "terms",
            items: [
              {
                term: "Structure-informed parameter priors",
                detail:
                  "Extending the input side so molecular structure and enzyme context can supply biochemical parameter priors to the mechanistic simulation — the natural next stage, and not part of the model as it stands.",
              },
              {
                term: "Physiologically-based compartments",
                detail:
                  "Extending from an empirical central compartment toward organ-level structure with tissue partition coefficients.",
              },
              {
                term: "Additional interaction mechanisms",
                detail:
                  "Adding induction and time-dependent inactivation so a broader class of interactions is expressible by the mechanism itself.",
              },
              {
                term: "Uncertainty quantification",
                detail:
                  "Propagating parameter uncertainty through the ODE system to produce prediction intervals rather than point trajectories.",
              },
              {
                term: "PK/PD coupling",
                detail:
                  "Linking predicted exposure to an effect model, so the output is a clinical response rather than a concentration alone.",
              },
              {
                term: "Three-or-more-drug regimes",
                detail:
                  "The graph formulation already admits additional substrate nodes; evaluating whether interaction predictions remain calibrated as regimen size grows.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const featuredProject = projects[0];

/** Projects that have a full write-up and therefore a detail route. */
export const projectsWithPages = projects.filter((p) => p.sections?.length);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
