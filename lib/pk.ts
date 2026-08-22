/**
 * Small, dependency-free pharmacokinetic simulation used to draw the figures.
 *
 * These are genuine numerical solutions of the compartmental systems described
 * on the PharML PK page — not hand-drawn splines — but the parameters are
 * illustrative textbook values, not fitted clinical data. Every figure that
 * uses them is labelled accordingly in the UI.
 */

export interface Point {
  t: number;
  c: number;
}

/* ------------------------------------------------------------------------ */
/* Single drug — one compartment, first-order absorption and elimination     */
/* ------------------------------------------------------------------------ */

export interface OralPkParams {
  /** Dose (mg). */
  dose: number;
  /** Bioavailable fraction, 0–1. */
  f: number;
  /** Absorption rate constant (1/h). */
  ka: number;
  /** Elimination rate constant (1/h). */
  ke: number;
  /** Apparent volume of distribution (L). */
  v: number;
}

/**
 * Closed-form Bateman function for oral administration:
 *
 *   C(t) = (F·D·ka) / (V·(ka − ke)) · (e^(−ke·t) − e^(−ka·t))
 */
export function oralConcentration(p: OralPkParams, t: number): number {
  const { dose, f, ka, ke, v } = p;
  if (Math.abs(ka - ke) < 1e-9) {
    // Flip-flop degenerate case: C(t) = (F·D/V)·ka·t·e^(−ka·t)
    return ((f * dose) / v) * ka * t * Math.exp(-ka * t);
  }
  return (
    ((f * dose * ka) / (v * (ka - ke))) *
    (Math.exp(-ke * t) - Math.exp(-ka * t))
  );
}

export function oralCurve(
  p: OralPkParams,
  hours = 24,
  steps = 240,
): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * hours;
    out.push({ t, c: Math.max(0, oralConcentration(p, t)) });
  }
  return out;
}

/* ------------------------------------------------------------------------ */
/* Two drugs competing for one enzyme — integrated numerically               */
/* ------------------------------------------------------------------------ */

export interface DdiParams {
  /** Victim: absorption rate (1/h). */
  kaA: number;
  /** Victim: apparent volume (L). */
  vA: number;
  /** Victim dose (mg). */
  doseA: number;
  /** Maximum metabolic rate of the shared enzyme (mg/L/h). */
  vmax: number;
  /** Michaelis constant of the victim at that enzyme (mg/L). */
  km: number;
  /** Perpetrator: absorption rate (1/h). */
  kaB: number;
  /** Perpetrator: elimination rate (1/h). */
  keB: number;
  /** Perpetrator: apparent volume (L). */
  vB: number;
  /** Perpetrator dose (mg). Zero disables the interaction. */
  doseB: number;
  /** Competitive inhibition constant (mg/L). */
  ki: number;
}

type State = [depotA: number, centralA: number, depotB: number, centralB: number];

/**
 * State derivatives.
 *
 *   dA_depot/dt   = −ka_A · A_depot
 *   dA_central/dt = ka_A · A_depot / V_A
 *                   − Vmax · A / ( Km · (1 + B / Ki) + A )
 *   dB_depot/dt   = −ka_B · B_depot
 *   dB_central/dt = ka_B · B_depot / V_B − ke_B · B
 *
 * The `(1 + B/Ki)` factor is competitive inhibition: the perpetrator raises
 * the apparent Km of the victim's clearance pathway in proportion to its own
 * concentration, which is itself a state variable — so the interaction grows
 * and decays with the perpetrator's exposure.
 */
function derivatives(y: State, p: DdiParams): State {
  const [ad, a, bd, b] = y;
  const apparentKm = p.km * (1 + (p.doseB > 0 ? b / p.ki : 0));
  const metabolism = (p.vmax * a) / (apparentKm + a);

  return [
    -p.kaA * ad,
    (p.kaA * ad) / p.vA - metabolism,
    -p.kaB * bd,
    (p.kaB * bd) / p.vB - p.keB * b,
  ];
}

function addScaled(y: State, k: State, h: number): State {
  return [y[0] + k[0] * h, y[1] + k[1] * h, y[2] + k[2] * h, y[3] + k[3] * h];
}

/**
 * Fixed-step classical Runge–Kutta (RK4). The system is non-stiff over the
 * horizons used here, so a fixed step is both adequate and cheap enough to run
 * on every render without a solver dependency.
 */
export function simulateDdi(
  p: DdiParams,
  hours = 24,
  steps = 480,
): { victim: Point[]; perpetrator: Point[] } {
  const h = hours / steps;
  let y: State = [p.doseA, 0, p.doseB, 0];

  const victim: Point[] = [{ t: 0, c: 0 }];
  const perpetrator: Point[] = [{ t: 0, c: 0 }];

  for (let i = 0; i < steps; i++) {
    const t = i * h;
    const k1 = derivatives(y, p);
    const k2 = derivatives(addScaled(y, k1, h / 2), p);
    const k3 = derivatives(addScaled(y, k2, h / 2), p);
    const k4 = derivatives(addScaled(y, k3, h), p);

    y = [
      y[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
      y[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
      y[2] + (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
      y[3] + (h / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
    ];

    // Concentrations are physically non-negative; clamp integrator undershoot.
    y[1] = Math.max(0, y[1]);
    y[3] = Math.max(0, y[3]);

    victim.push({ t: t + h, c: y[1] });
    perpetrator.push({ t: t + h, c: y[3] });
  }

  return { victim, perpetrator };
}

/** Trapezoidal AUC — used to quantify the magnitude of an interaction. */
export function auc(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dt = points[i].t - points[i - 1].t;
    total += ((points[i].c + points[i - 1].c) / 2) * dt;
  }
  return total;
}

export function cmax(points: Point[]): Point {
  return points.reduce((best, p) => (p.c > best.c ? p : best), points[0]);
}

/**
 * Convert a series into an SVG path string within the given plot box.
 * `yMax` is passed in so multiple series can share one scale.
 */
export function toPath(
  points: Point[],
  opts: {
    width: number;
    height: number;
    padLeft: number;
    padRight: number;
    padTop: number;
    padBottom: number;
    tMax: number;
    yMax: number;
  },
): string {
  const { width, height, padLeft, padRight, padTop, padBottom, tMax, yMax } =
    opts;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  return points
    .map((p, i) => {
      const x = padLeft + (p.t / tMax) * plotW;
      const y = padTop + plotH - (p.c / yMax) * plotH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}
