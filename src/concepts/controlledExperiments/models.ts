import { tidyNumber } from '../../kit/validation'

export interface FixedConditionPowerResult {
  mode: 'fixed-voltage' | 'fixed-current'
  r1: number
  r2: number
  p1: number
  p2: number
  powerRatio: number
  higherPowerResistor: 'r1' | 'r2'
}

/**
 * Compare two resistors (e.g. 4 Ω vs 12 Ω) under fixed voltage (e.g. 12 V)
 * or fixed current (e.g. 2 A).
 * Fixed V: P = V^2 / R (smaller R has higher P)
 * Fixed I: P = I^2 * R (larger R has higher P)
 */
export function calculateFixedConditionPower(
  mode: 'fixed-voltage' | 'fixed-current',
  r1: number,
  r2: number,
  fixedValue = 12.0
): FixedConditionPowerResult {
  const safeR1 = Math.max(0.5, r1)
  const safeR2 = Math.max(0.5, r2)
  const val = Math.max(0.1, fixedValue)

  let p1: number
  let p2: number

  if (mode === 'fixed-voltage') {
    // V is fixed
    p1 = tidyNumber((val * val) / safeR1, 2)
    p2 = tidyNumber((val * val) / safeR2, 2)
  } else {
    // I is fixed
    p1 = tidyNumber(val * val * safeR1, 2)
    p2 = tidyNumber(val * val * safeR2, 2)
  }

  const powerRatio = tidyNumber(p2 / p1, 2)
  const higherPowerResistor = p1 > p2 ? 'r1' : 'r2'

  return {
    mode,
    r1: safeR1,
    r2: safeR2,
    p1,
    p2,
    powerRatio,
    higherPowerResistor,
  }
}

export interface StretchingVsComparingResult {
  initialLengthM: number
  initialAreaMm2: number
  initialResistanceOhm: number
  lengthMultiplier: number
  // Comparing different wire: Length = nL, Area = A (unchanged)
  comparedAreaMm2: number
  comparedResistanceOhm: number
  comparedFactor: number
  // Stretching single wire: Length = nL, Volume = const => Area = A / n
  stretchedAreaMm2: number
  stretchedResistanceOhm: number
  stretchedFactor: number
}

/**
 * Baseline: rho = 1.0, R = L / A.
 * Length multiplier n (e.g. n = 2 for doubling).
 */
export function calculateStretchingVsComparing(
  initialLengthM = 1.0,
  initialAreaMm2 = 1.0,
  lengthMultiplier = 2.0
): StretchingVsComparingResult {
  const L = Math.max(0.1, initialLengthM)
  const A = Math.max(0.1, initialAreaMm2)
  const n = Math.max(1.0, lengthMultiplier)

  const initialResistanceOhm = tidyNumber(L / A, 2)

  // Comparing two different wires (Area kept constant)
  const comparedAreaMm2 = A
  const comparedResistanceOhm = tidyNumber((n * L) / comparedAreaMm2, 2)
  const comparedFactor = tidyNumber(comparedResistanceOhm / initialResistanceOhm, 2)

  // Stretching one wire (Volume = L * A = constant => A_new = A / n)
  const stretchedAreaMm2 = tidyNumber(A / n, 4)
  const stretchedResistanceOhm = tidyNumber((n * L) / stretchedAreaMm2, 2)
  const stretchedFactor = tidyNumber(stretchedResistanceOhm / initialResistanceOhm, 2)

  return {
    initialLengthM: L,
    initialAreaMm2: A,
    initialResistanceOhm,
    lengthMultiplier: n,
    comparedAreaMm2,
    comparedResistanceOhm,
    comparedFactor,
    stretchedAreaMm2,
    stretchedResistanceOhm,
    stretchedFactor,
  }
}

export interface ConstantTempOhmicResult {
  voltageV: number
  ohmicCurrentA: number
  ohmicResistanceOhm: number
  // Non-ohmic filament lamp: resistance increases with heating (R = R0 * (1 + alpha * V))
  filamentResistanceOhm: number
  filamentCurrentA: number
}

/**
 * Constant temperature maintains straight V-I line (Ohm's Law).
 * In an incandescent bulb, heating causes R to rise, bending the curve.
 */
export function calculateConstantTempOhmic(voltageV: number, baseResistanceOhm = 10.0): ConstantTempOhmicResult {
  const safeV = Math.max(0, voltageV)
  const R0 = Math.max(1.0, baseResistanceOhm)

  // Ideal Ohmic resistor (constant temp)
  const ohmicResistanceOhm = R0
  const ohmicCurrentA = tidyNumber(safeV / R0, 2)

  // Filament lamp (heating increases resistance: R = R0 + 1.2 * V)
  const filamentResistanceOhm = tidyNumber(R0 + 1.2 * safeV, 2)
  const filamentCurrentA = tidyNumber(safeV / filamentResistanceOhm, 2)

  return {
    voltageV: safeV,
    ohmicCurrentA,
    ohmicResistanceOhm,
    filamentResistanceOhm,
    filamentCurrentA,
  }
}

export interface CircuitFailureResult {
  circuitType: 'series' | 'parallel'
  totalBulbs: number
  blownBulbIndex: number | null
  activeBulbsCount: number
  isWholeCircuitDark: boolean
}

/**
 * Series circuit: one bulb breaks => whole path broken.
 * Parallel circuit: one bulb breaks => remaining branches continue receiving full 220 V.
 */
export function calculateCircuitFailure(
  circuitType: 'series' | 'parallel',
  totalBulbs = 3,
  blownBulbIndex: number | null = null
): CircuitFailureResult {
  if (blownBulbIndex === null) {
    return {
      circuitType,
      totalBulbs,
      blownBulbIndex: null,
      activeBulbsCount: totalBulbs,
      isWholeCircuitDark: false,
    }
  }

  if (circuitType === 'series') {
    return {
      circuitType,
      totalBulbs,
      blownBulbIndex,
      activeBulbsCount: 0,
      isWholeCircuitDark: true,
    }
  }

  // Parallel
  return {
    circuitType,
    totalBulbs,
    blownBulbIndex,
    activeBulbsCount: totalBulbs - 1,
    isWholeCircuitDark: false,
  }
}

export interface MomentumImpulseResult {
  massKg: number
  initialSpeedMps: number
  stoppingTimeS: number
  momentumChangeKgMps: number
  impactForceN: number
  stiffHandsForceN: number
  forceReductionFactor: number
}

/**
 * Class 9 Force & Laws of Motion (NCERT Ch 8.4):
 * Stopping a ball of mass m moving at speed u requires a FIXED momentum change Δp = m * u.
 * Average stopping force F = Δp / Δt.
 * Increasing stopping time Δt inversely reduces peak impact force F.
 */
export function calculateMomentumImpulse(
  massKg: number,
  initialSpeedMps: number,
  stoppingTimeS: number,
  stiffBaselineTimeS = 0.05
): MomentumImpulseResult {
  const safeM = Math.max(0.05, massKg)
  const safeU = Math.max(1, initialSpeedMps)
  const safeDt = Math.max(0.02, stoppingTimeS)
  const safeBaselineDt = Math.max(0.02, stiffBaselineTimeS)

  const momentumChangeKgMps = tidyNumber(safeM * safeU, 2)
  const impactForceN = tidyNumber(momentumChangeKgMps / safeDt, 2)
  const stiffHandsForceN = tidyNumber(momentumChangeKgMps / safeBaselineDt, 2)
  const forceReductionFactor = tidyNumber(stiffHandsForceN / impactForceN, 2)

  return {
    massKg: safeM,
    initialSpeedMps: safeU,
    stoppingTimeS: safeDt,
    momentumChangeKgMps,
    impactForceN,
    stiffHandsForceN,
    forceReductionFactor,
  }
}

export interface MotorForceFlemingsResult {
  magneticFieldTesla: number
  currentA: number
  conductorLengthM: number
  angleDeg: number
  sinTheta: number
  forceMagnitudeN: number
  currentPolarity: 1 | -1
  fieldPolarity: 1 | -1
  forceDirectionSign: -1 | 0 | 1
  forceDirectionLabel: 'Upward (+Z)' | 'Downward (−Z)' | 'Zero Force (Parallel: θ = 0°)'
}

/**
 * Class 10 Magnetic Effects of Electric Current (NCERT Ch 12.3):
 * Force on a current-carrying conductor in a magnetic field:
 *   F = B * I * L * sin(θ)
 * - Maximum force when conductor is perpendicular to magnetic field (θ = 90°, sin 90° = 1).
 * - Zero force when conductor is parallel to magnetic field (θ = 0°, sin 0° = 0).
 * - Fleming's Left-Hand Rule polarity:
 *   Reversing ONLY current OR ONLY magnetic field reverses force direction (-1).
 *   Reversing BOTH current AND magnetic field keeps force direction UNCHANGED (( -1 ) * ( -1 ) = +1)!
 */
export function calculateMotorForceFlemingsRule(
  magneticFieldTesla: number,
  currentA: number,
  angleDeg = 90,
  currentPolarity: 1 | -1 = 1,
  fieldPolarity: 1 | -1 = 1,
  conductorLengthM = 0.2
): MotorForceFlemingsResult {
  const safeB = Math.max(0.1, magneticFieldTesla)
  const safeI = Math.max(0.5, currentA)
  const safeL = Math.max(0.05, conductorLengthM)
  const safeAngle = Math.max(0, Math.min(90, angleDeg))

  const rad = (safeAngle * Math.PI) / 180
  const sinTheta = tidyNumber(Math.sin(rad), 3)
  const forceMagnitudeN = tidyNumber(safeB * safeI * safeL * Math.sin(rad), 3)

  const rawSign = forceMagnitudeN < 1e-6 ? 0 : ((currentPolarity * fieldPolarity) as -1 | 1)
  let forceDirectionLabel: MotorForceFlemingsResult['forceDirectionLabel'] =
    'Zero Force (Parallel: θ = 0°)'
  if (rawSign === 1) forceDirectionLabel = 'Upward (+Z)'
  else if (rawSign === -1) forceDirectionLabel = 'Downward (−Z)'

  return {
    magneticFieldTesla: safeB,
    currentA: safeI,
    conductorLengthM: safeL,
    angleDeg: safeAngle,
    sinTheta,
    forceMagnitudeN,
    currentPolarity,
    fieldPolarity,
    forceDirectionSign: rawSign,
    forceDirectionLabel,
  }
}

export type ReactivityMetalSymbol = 'Mg' | 'Zn' | 'Fe' | 'Cu' | 'Ag'

export interface MetalDisplacementResult {
  dippedMetal: ReactivityMetalSymbol
  solutionCationMetal: ReactivityMetalSymbol
  dippedRank: number
  solutionRank: number
  reactionOccurs: boolean
  initialSolutionColor: string
  finalSolutionColor: string
  depositOnStrip: string
  equationText: string
}

const METAL_REACTIVITY_RANK: Record<ReactivityMetalSymbol, number> = {
  Mg: 5,
  Zn: 4,
  Fe: 3,
  Cu: 2,
  Ag: 1,
}

const SALT_SOLUTION_COLOR: Record<ReactivityMetalSymbol, string> = {
  Mg: 'Colourless (MgSO₄)',
  Zn: 'Colourless (ZnSO₄)',
  Fe: 'Pale Green (FeSO₄)',
  Cu: 'Deep Blue (CuSO₄)',
  Ag: 'Colourless (AgNO₃)',
}

const DEPOSIT_DESCRIPTION: Record<ReactivityMetalSymbol, string> = {
  Mg: 'Silvery Mg',
  Zn: 'Greyish Zn',
  Fe: 'Dark Grey Fe',
  Cu: 'Reddish-Brown Cu coating',
  Ag: 'Shiny Silver Ag crystals',
}

/**
 * Class 10 Chemistry Ch 3 (NCERT Sec 3.2.5 — Reactivity Series):
 * Single-displacement reaction A(s) + BSO4(aq) -> ASO4(aq) + B(s)
 * occurs IF AND ONLY IF Reactivity(A) > Reactivity(B).
 */
export function calculateMetalDisplacement(
  dippedMetal: ReactivityMetalSymbol,
  solutionCationMetal: ReactivityMetalSymbol
): MetalDisplacementResult {
  const dippedRank = METAL_REACTIVITY_RANK[dippedMetal]
  const solutionRank = METAL_REACTIVITY_RANK[solutionCationMetal]
  const reactionOccurs = dippedRank > solutionRank

  const initialSolutionColor = SALT_SOLUTION_COLOR[solutionCationMetal]
  const finalSolutionColor = reactionOccurs
    ? SALT_SOLUTION_COLOR[dippedMetal]
    : initialSolutionColor

  const depositOnStrip = reactionOccurs
    ? DEPOSIT_DESCRIPTION[solutionCationMetal]
    : 'None (Strip unchanged)'

  const saltFormula = (m: ReactivityMetalSymbol) => (m === 'Ag' ? '2AgNO₃' : `${m}SO₄`)
  const productSalt = (m: ReactivityMetalSymbol) =>
    solutionCationMetal === 'Ag'
      ? m === 'Ag'
        ? '2AgNO₃'
        : `${m}(NO₃)₂`
      : `${m}SO₄`
  const displacedAtom = solutionCationMetal === 'Ag' ? '2Ag↓' : `${solutionCationMetal}↓`

  const equationText =
    dippedMetal === solutionCationMetal
      ? `${dippedMetal}(s) + ${saltFormula(solutionCationMetal)}(aq) → No Net Change (Same Metal)`
      : reactionOccurs
        ? `${dippedMetal}(s) + ${saltFormula(solutionCationMetal)}(aq) → ${productSalt(dippedMetal)}(aq) + ${displacedAtom}`
        : `${dippedMetal}(s) + ${saltFormula(solutionCationMetal)}(aq) → No Reaction (${dippedMetal} is less reactive than ${solutionCationMetal})`

  return {
    dippedMetal,
    solutionCationMetal,
    dippedRank,
    solutionRank,
    reactionOccurs,
    initialSolutionColor,
    finalSolutionColor,
    depositOnStrip,
    equationText,
  }
}

export interface ReflexAndHomeostasisResult {
  routingMode: 'spinal-reflex-arc' | 'conscious-brain-detour'
  armPathLengthM: number
  spinalReflexLatencyMs: number
  brainDetourLatencyMs: number
  activeLatencyMs: number
  timeSavedByReflexMs: number
  bloodGlucoseMgDl: number
  glucoseStatus: 'hypoglycemia-low' | 'normal-homeostasis' | 'hyperglycemia-high'
  activePancreaticHormone: 'Insulin Secreted (β-cells ↑)' | 'Basal Homeostasis (Balanced)' | 'Glucagon Secreted (α-cells ↑)'
  feedbackMechanismText: string
}

/**
 * Class 10 Biology Ch 6 (NCERT Sec 6.1.1 Reflex Actions & Sec 6.3 Hormones in Animals):
 * 1. Spinal Reflex Arc: round-trip distance 2 * L at 100 m/s nerve impulse speed + 5 ms spinal synapse.
 *    Conscious Brain Detour adds cranial path + cortical thinking delay (+120 ms).
 * 2. Negative-Feedback Homeostasis: Pancreas regulates blood glucose around 70–110 mg/dL.
 *    If glucose > 110 mg/dL, Insulin increases to store glucose as glycogen.
 *    If glucose < 70 mg/dL, Insulin secretion falls and Glucagon releases glucose.
 */
export function calculateReflexAndHomeostasis(
  routingMode: 'spinal-reflex-arc' | 'conscious-brain-detour',
  armPathLengthM: number,
  bloodGlucoseMgDl: number
): ReflexAndHomeostasisResult {
  const safeL = tidyNumber(Math.max(0.4, Math.min(1.2, armPathLengthM)), 2)
  const safeG = Math.max(40, Math.min(240, Math.round(bloodGlucoseMgDl)))

  // Conduction at 100 m/s => (2 * L / 100) * 1000 ms + 10 ms spinal relay synapse
  const spinalReflexLatencyMs = tidyNumber(20 * safeL + 10, 1)
  const brainDetourLatencyMs = tidyNumber(spinalReflexLatencyMs + 120, 1)
  const activeLatencyMs =
    routingMode === 'spinal-reflex-arc' ? spinalReflexLatencyMs : brainDetourLatencyMs
  const timeSavedByReflexMs = tidyNumber(brainDetourLatencyMs - spinalReflexLatencyMs, 1)

  let glucoseStatus: ReflexAndHomeostasisResult['glucoseStatus'] = 'normal-homeostasis'
  let activePancreaticHormone: ReflexAndHomeostasisResult['activePancreaticHormone'] =
    'Basal Homeostasis (Balanced)'
  let feedbackMechanismText = 'Normal 70–110 mg/dL → Negative feedback inhibits excess insulin.'

  if (safeG > 110) {
    glucoseStatus = 'hyperglycemia-high'
    activePancreaticHormone = 'Insulin Secreted (β-cells ↑)'
    feedbackMechanismText = 'High sugar → Pancreas secretes INSULIN → Cells store glycogen.'
  } else if (safeG < 70) {
    glucoseStatus = 'hypoglycemia-low'
    activePancreaticHormone = 'Glucagon Secreted (α-cells ↑)'
    feedbackMechanismText = 'Low sugar → Insulin stops & GLUCAGON releases liver glucose.'
  }

  return {
    routingMode,
    armPathLengthM: safeL,
    spinalReflexLatencyMs,
    brainDetourLatencyMs,
    activeLatencyMs,
    timeSavedByReflexMs,
    bloodGlucoseMgDl: safeG,
    glucoseStatus,
    activePancreaticHormone,
    feedbackMechanismText,
  }
}
