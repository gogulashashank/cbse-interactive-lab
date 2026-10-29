/**
 * Pure TypeScript Scientific Model: One Ideal DC Circuit (Class 10 Electricity)
 *
 * Circuit: adjustable ideal supply -> switch -> fixed-temperature ohmic resistor,
 * with an ammeter in series and a voltmeter across the resistor.
 *
 * Units: voltage in volts (V), resistance in ohms (Ω), current in amperes (A).
 *
 * Model:
 * - Switch closed: I = V / R.
 * - Switch open: I = 0 A, so the voltage across the resistor is also 0 V.
 *   The supply still has its set voltage; an ideal voltmeter across the
 *   resistor (not across the switch gap) reads 0 V.
 *
 * Assumptions (stated to students in the lesson):
 * - Ideal source: the supply keeps its set voltage whatever the current is.
 * - Ideal meters: the ammeter has zero resistance and the voltmeter draws no current.
 * - Constant temperature: the resistor's resistance does not change with current.
 * - Wires have no resistance.
 *
 * Range limits: supply 0–12 V, resistance 1–100 Ω. Zero-resistance (short
 * circuit) is deliberately excluded from this lesson.
 *
 * Zero React, DOM, or rendering imports.
 */

export const OHM_LIMITS = {
  supplyVoltageV: { min: 0, max: 12, step: 0.5 },
  resistanceOhm: { min: 1, max: 100, step: 1 },
} as const

export type OhmField = 'supplyVoltageV' | 'resistanceOhm'

export interface CircuitInput {
  /** Set supply voltage in V (0 to 12) */
  supplyVoltageV: number
  /** Resistance of the fixed-temperature resistor in Ω (1 to 100) */
  resistanceOhm: number
  /** True when the switch is closed */
  switchClosed: boolean
}

export type CircuitState = 'open' | 'zero_supply' | 'flowing'

export interface CircuitResult {
  supplyVoltageV: number
  resistanceOhm: number
  switchClosed: boolean
  /** Ammeter reading in A */
  currentA: number
  /** Voltmeter reading across the resistor in V */
  resistorVoltageV: number
  state: CircuitState
}

export class OhmValidationError extends Error {
  public readonly field: OhmField

  constructor(field: OhmField, message: string) {
    super(message)
    this.name = 'OhmValidationError'
    this.field = field
  }
}

/** Returns an error message for an invalid supply voltage, or null when valid. */
export function getVoltageError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Supply voltage must be a finite number in volts.'
  }
  if (value < OHM_LIMITS.supplyVoltageV.min || value > OHM_LIMITS.supplyVoltageV.max) {
    return `Supply voltage must be between ${OHM_LIMITS.supplyVoltageV.min} V and ${OHM_LIMITS.supplyVoltageV.max} V.`
  }
  return null
}

/** Returns an error message for an invalid resistance, or null when valid. */
export function getResistanceError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Resistance must be a finite number in ohms.'
  }
  if (value < OHM_LIMITS.resistanceOhm.min || value > OHM_LIMITS.resistanceOhm.max) {
    return `Resistance must be between ${OHM_LIMITS.resistanceOhm.min} Ω and ${OHM_LIMITS.resistanceOhm.max} Ω (short circuits are not part of this lesson).`
  }
  return null
}

export function validateCircuitInput(input: CircuitInput): void {
  const vErr = getVoltageError(input.supplyVoltageV)
  if (vErr) throw new OhmValidationError('supplyVoltageV', vErr)
  const rErr = getResistanceError(input.resistanceOhm)
  if (rErr) throw new OhmValidationError('resistanceOhm', rErr)
}

export function calculateCircuit(input: CircuitInput): CircuitResult {
  validateCircuitInput(input)
  const { supplyVoltageV, resistanceOhm, switchClosed } = input

  if (!switchClosed) {
    return {
      supplyVoltageV,
      resistanceOhm,
      switchClosed,
      currentA: 0,
      resistorVoltageV: 0,
      state: 'open',
    }
  }

  const currentA = supplyVoltageV / resistanceOhm
  return {
    supplyVoltageV,
    resistanceOhm,
    switchClosed,
    currentA,
    // Ideal wires and ammeter: the whole supply voltage appears across R (V = I R).
    resistorVoltageV: currentA * resistanceOhm,
    state: supplyVoltageV === 0 ? 'zero_supply' : 'flowing',
  }
}

export interface MeasurementPoint {
  currentA: number
  voltageV: number
}

/**
 * Least-squares slope of V against I (ΔV/ΔI in Ω).
 * Returns null unless at least two points with different currents exist.
 */
export function fitSlopeOhm(points: readonly MeasurementPoint[]): number | null {
  if (points.length < 2) return null
  const n = points.length
  const meanI = points.reduce((s, p) => s + p.currentA, 0) / n
  const meanV = points.reduce((s, p) => s + p.voltageV, 0) / n
  let num = 0
  let den = 0
  for (const p of points) {
    num += (p.currentA - meanI) * (p.voltageV - meanV)
    den += (p.currentA - meanI) ** 2
  }
  if (den < 1e-12) return null
  return num / den
}
