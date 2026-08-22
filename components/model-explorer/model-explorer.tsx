"use client";

import { useMemo, useRef, useState } from "react";
import { HeteroGraph } from "@/components/diagrams/hetero-graph";
import { ConcentrationPlot, DdiSchematic, CompartmentDiagram, type Series } from "@/components/diagrams/plots";
import { PkEquations, DdiEquations } from "@/components/diagrams/equations";
import { Label } from "@/components/ui/primitives";
import { auc, cmax, simulateDdi, type DdiParams } from "@/lib/pk";

/* --------------------------------------------------------------------------
 * Model explorer.
 *
 * Four views onto the same conceptual system: the graph representation, the
 * equations it parameterises, the exposure those equations produce, and what
 * happens when two compounds share an enzyme.
 *
 * Curves are real RK4 solutions computed in the browser from the parameters
 * shown alongside them. Parameters are illustrative — every panel says so.
 * ----------------------------------------------------------------------- */

const TABS = [
  { id: "graph", label: "GRAPH", note: "Representation" },
  { id: "ode", label: "ODE", note: "Mechanism" },
  { id: "pk", label: "PK", note: "Exposure" },
  { id: "ddi", label: "DDI", note: "Interaction" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Shared illustrative parameter set — one enzyme, saturable clearance. */
const BASE: DdiParams = {
  kaA: 1.1,
  vA: 32,
  doseA: 500,
  vmax: 3.4,
  km: 4.2,
  kaB: 0.9,
  keB: 0.22,
  vB: 48,
  doseB: 0,
  ki: 2.6,
};

export function ModelExplorer() {
  const [tab, setTab] = useState<TabId>("graph");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* ---- PK: saturable elimination at three dose levels ------------------ */
  const pkSeries = useMemo<Series[]>(() => {
    const doses = [250, 500, 1000];
    const accents = ["teal", "cyan", "violet"] as const;
    return doses.map((dose, i) => ({
      id: `dose-${dose}`,
      label: `${dose} mg`,
      accent: accents[i],
      markPeak: dose === 500,
      points: simulateDdi({ ...BASE, doseA: dose }, 24, 360).victim,
    }));
  }, []);

  const pkStats = useMemo(() => {
    return pkSeries.map((s) => ({
      label: s.label,
      auc: auc(s.points),
      peak: cmax(s.points),
    }));
  }, [pkSeries]);

  /* ---- DDI: victim alone vs victim with a competing substrate ---------- */
  const ddi = useMemo(() => {
    const alone = simulateDdi({ ...BASE, doseB: 0 }, 24, 480);
    const withB = simulateDdi({ ...BASE, doseB: 400 }, 24, 480);

    const aucAlone = auc(alone.victim);
    const aucWith = auc(withB.victim);

    const series: Series[] = [
      {
        id: "victim-alone",
        label: "Drug A — alone",
        accent: "teal",
        points: alone.victim,
        dashed: true,
      },
      {
        id: "victim-with",
        label: "Drug A — with Drug B",
        accent: "cyan",
        points: withB.victim,
        markPeak: true,
      },
      {
        id: "perp",
        label: "Drug B — inhibitor",
        accent: "violet",
        points: withB.perpetrator,
      },
    ];

    return {
      series,
      ratio: aucWith / aucAlone,
      cmaxRatio: cmax(withB.victim).c / cmax(alone.victim).c,
    };
  }, []);

  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    const last = TABS.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      setTab(TABS[next].id);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* ---- tab strip -------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3 sm:px-5">
        <div
          role="tablist"
          aria-label="Model explorer views"
          className="flex flex-wrap gap-1"
        >
          {TABS.map((t, i) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`explorer-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`explorer-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`label rounded-md border px-3 py-2 transition-colors duration-300 ${
                  selected
                    ? "border-cyan/40 bg-cyan/10 text-cyan"
                    : "border-transparent text-faint hover:border-line hover:text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <Label className="hidden sm:block">
          {TABS.find((t) => t.id === tab)?.note}
        </Label>
      </div>

      {/* ---- panels ------------------------------------------------------ */}
      <div className="px-4 py-6 sm:px-7 sm:py-8">
        {/* GRAPH */}
        <Panel id="graph" active={tab === "graph"}>
          <PanelHead
            title="Heterogeneous representation"
            body="Entities are typed — patient, dose, drug, enzyme, reaction, metabolite, compartment — and so are the relations between them. Message passing respects those types, so catalysis is not treated like distribution."
          />
          <HeteroGraph variant="interactive" className="mt-7" />
        </Panel>

        {/* ODE */}
        <Panel id="ode" active={tab === "ode"}>
          <PanelHead
            title="Mechanistic system"
            body="The network predicts coefficients; these equations produce the dynamics. Saturable elimination is what makes competition between two substrates possible."
          />

          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-lg border border-line bg-base px-5 py-6">
              <Label className="label-bright">SINGLE DRUG</Label>
              <div className="mt-5">
                <PkEquations />
              </div>
            </div>
            <div className="rounded-lg border border-line bg-base px-5 py-6">
              <Label className="label-bright">COMPETITIVE INHIBITION</Label>
              <div className="mt-5">
                <DdiEquations />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-line bg-base px-4 py-6 sm:px-6">
            <CompartmentDiagram />
          </div>
        </Panel>

        {/* PK */}
        <Panel id="pk" active={tab === "pk"}>
          <PanelHead
            title="Exposure over 24 hours"
            body="Three dose levels through the same saturable pathway. Because clearance has finite capacity, exposure does not scale proportionally with dose — doubling the dose more than doubles the area under the curve."
          />

          <div className="mt-7 rounded-lg border border-line bg-base px-3 py-5 sm:px-5">
            <ConcentrationPlot series={pkSeries} hours={24} />
          </div>

          <dl className="mt-7 grid gap-x-6 gap-y-6 sm:grid-cols-3">
            {pkStats.map((s) => (
              <div key={s.label} className="border-t border-line pt-4">
                <dt className="label">{s.label}</dt>
                <dd className="tnum mt-3 text-sm text-ink">
                  AUC {s.auc.toFixed(1)}{" "}
                  <span className="text-faint">mg·h/L</span>
                </dd>
                <dd className="tnum mt-1 text-sm text-muted">
                  Cmax {s.peak.c.toFixed(2)}{" "}
                  <span className="text-faint">
                    mg/L @ {s.peak.t.toFixed(1)} h
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <Provenance />
        </Panel>

        {/* DDI */}
        <Panel id="ddi" active={tab === "ddi"}>
          <PanelHead
            title="Two substrates, one enzyme"
            body="Drug B competes for the enzyme that clears Drug A, raising its apparent Michaelis constant. The effect is dynamic: it grows as B is absorbed and fades as B is eliminated."
          />

          <div className="mt-7 rounded-lg border border-line bg-base px-4 py-6 sm:px-6">
            <DdiSchematic />
          </div>

          <div className="mt-7 rounded-lg border border-line bg-base px-3 py-5 sm:px-5">
            <ConcentrationPlot series={ddi.series} hours={24} />
          </div>

          <dl className="mt-7 grid gap-x-6 gap-y-6 sm:grid-cols-3">
            <Stat
              term="AUC Ratio"
              value={`${ddi.ratio.toFixed(2)}×`}
              detail="Drug A exposure with vs without Drug B"
            />
            <Stat
              term="Cmax Ratio"
              value={`${ddi.cmaxRatio.toFixed(2)}×`}
              detail="Peak concentration shift"
            />
            <Stat
              term="Mechanism"
              value="Competitive"
              detail="Apparent Km scaled by (1 + CB / Ki)"
            />
          </dl>

          <Provenance />
        </Panel>
      </div>
    </div>
  );
}

/* ---- panel scaffolding --------------------------------------------------- */

function Panel({
  id,
  active,
  children,
}: {
  id: TabId;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`explorer-panel-${id}`}
      aria-labelledby={`explorer-tab-${id}`}
      hidden={!active}
      tabIndex={0}
    >
      {active ? children : null}
    </div>
  );
}

function PanelHead({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[1.05rem] font-medium text-ink">{title}</h3>
      <p className="mt-2.5 max-w-[62ch] text-[0.875rem] leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}

function Stat({
  term,
  value,
  detail,
}: {
  term: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="label">{term}</dt>
      <dd className="tnum mt-3 text-xl text-ink">{value}</dd>
      <dd className="mt-1.5 text-[0.78rem] leading-snug text-faint">{detail}</dd>
    </div>
  );
}

/** Explicit provenance note — these are demonstrations, not clinical data. */
function Provenance() {
  return (
    <p className="label mt-7 border-t border-line-faint pt-5 leading-relaxed text-faint">
      Illustrative parameters · numerically integrated in-browser (RK4) ·
      not clinical data
    </p>
  );
}
