/**
 * Pure TypeScript Scientific Model: Two Resistors, One Supply (Class 10 Electricity)
 *
 * Arrangements (two resistors at most; no mixed networks):
 * - 'single'   : only R1 is connected.
 * - 'series'   : R1 and R2 in one path.   R_eq = R1 + R2
 * - 'parallel' : R1 and R2 in two paths.  1/R_eq = 1/R1 + 1/R2
 *
 * Units: volts (V), ohms (Ω), amperes (A).
 * Supply current I = V / R_eq when the switch is closed, and 0 when it is open.
 *
 * Series:   the same current through both; V1 + V2 = V.
 * Parallel: the same voltage across both; I1 + I2 = I.
 *
 * Assumptions: ideal source, ideal meters, ideal wires, resistors at constant
 * temperature. Resistance range 1–100 Ω each (no short circuits); supply 0–12 V.
 *
 * Zero React, DOM, or rendering imports.
 */
import { getResistanceError, getVoltageError } from './spLimits'

export { SP_LIMITS } from './spLimits'

export type Arrangement = 'single' | 'series' | 'parallel'
export type SPField = 'supplyVoltageV' | 'resistance1Ohm' | 'resistance2Ohm'

export interface SPInput {
  arrangement: Arrangement
  supplyVoltageV: number
  resistance1Ohm: number
  /** Ignored when arrangement is 'single' (R2 is not connected). */
  resistance2Ohm: number
  switchClosed: boolean
}

export interface BranchReading {
  currentA: number
  voltageV: number
}

export type SPState = 'open' | 'zero_supply' | 'flowing'

export interface SPResult {
  arrangement: Arrangement
  supplyVoltageV: number
  resistance1Ohm: number
  resistance2Ohm: number
  switchClosed: boolean
  /** Equivalent resistance seen by the supply, in Ω. */
  equivalentResistanceOhm: number
  /** Ammeter reading in the supply path, in A. */
  supplyCurrentA: number
  resistor1: BranchReading
  /** null when R2 is not connected (arrangement 'single'). */
  resistor2: BranchReading | null
  state: SPState
}

export class SPValidationError extends Error {
  public readonly field: SPField

  constructor(field: SPField, message: string) {
    super(message)
    this.name = 'SPValidationError'
    this.field = field
  }
}

export function seriesResistance(r1: number, r2: number): number {
  return r1 + r2
}

export function parallelResistance(r1: number, r2: number): number {
  return (r1 * r2) / (r1 + r2)
}

export function validateSPInput(input: SPInput): void {
  const v = getVoltageError(input.supplyVoltageV)
  if (v) throw new SPValidationError('supplyVoltageV', v)
  const r1 = getResistanceError(input.resistance1Ohm, 'Resistor 1')
  if (r1) throw new SPValidationError('resistance1Ohm', r1)
  const r2 = getResistanceError(input.resistance2Ohm, 'Resistor 2')
  if (r2) throw new SPValidationError('resistance2Ohm', r2)
}

export function calculateSeriesParallel(input: SPInput): SPResult {
  validateSPInput(input)
  const { arrangement, supplyVoltageV: V, resistance1Ohm: r1, resistance2Ohm: r2, switchClosed } = input

  const req =
    arrangement === 'single'
      ? r1
      : arrangement === 'series'
        ? seriesResistance(r1, r2)
        : parallelResistance(r1, r2)

  const zero: BranchReading = { currentA: 0, voltageV: 0 }
  const base = {
    arrangement,
    supplyVoltageV: V,
    resistance1Ohm: r1,
    resistance2Ohm: r2,
    switchClosed,
    equivalentResistanceOhm: req,
  }
  const hasR2 = arrangement !== 'single'

  if (!switchClosed) {
    return {
      ...base,
      supplyCurrentA: 0,
      resistor1: zero,
      resistor2: hasR2 ? zero : null,
      state: 'open',
    }
  }

  const I = V / req
  let resistor1: BranchReading
  let resistor2: BranchReading | null
  if (arrangement === 'single') {
    resistor1 = { currentA: I, voltageV: I * r1 }
    resistor2 = null
  } else if (arrangement === 'series') {
    resistor1 = { currentA: I, voltageV: I * r1 }
    resistor2 = { currentA: I, voltageV: I * r2 }
  } else {
    resistor1 = { currentA: V / r1, voltageV: V }
    resistor2 = { currentA: V / r2, voltageV: V }
  }
  return {
    ...base,
    supplyCurrentA: I,
    resistor1,
    resistor2,
    state: V === 0 ? 'zero_supply' : 'flowing',
  }
}
