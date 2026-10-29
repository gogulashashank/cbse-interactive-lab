import { describe, expect, it } from 'vitest'
import {
  calculateCircuit,
  fitSlopeOhm,
  OhmValidationError,
  type CircuitInput,
} from './ohmModel'
import {
  applyOhmDraftEdit,
  createOhmDrafts,
  INITIAL_CIRCUIT_INPUT,
  parseOhmDraft,
  validateOhmDrafts,
} from './ohmInputValidation'

const closed = (v: number, r: number): CircuitInput => ({
  supplyVoltageV: v,
  resistanceOhm: r,
  switchClosed: true,
})

describe('ohmModel — I = V / R', () => {
  it('gives 1 A for 6 V and 6 Ω', () => {
    const r = calculateCircuit(closed(6, 6))
    expect(r.currentA).toBeCloseTo(1, 10)
    expect(r.resistorVoltageV).toBeCloseTo(6, 10)
    expect(r.state).toBe('flowing')
  })
  it('gives 2 A for 12 V and 6 Ω', () => {
    expect(calculateCircuit(closed(12, 6)).currentA).toBeCloseTo(2, 10)
  })
  it('gives 0.5 A for 6 V and 12 Ω', () => {
    expect(calculateCircuit(closed(6, 12)).currentA).toBeCloseTo(0.5, 10)
  })
  it('doubling V doubles I and doubling R halves I', () => {
    const base = calculateCircuit(closed(3, 6)).currentA
    expect(calculateCircuit(closed(6, 6)).currentA / base).toBeCloseTo(2, 10)
    expect(calculateCircuit(closed(6, 12)).currentA / calculateCircuit(closed(6, 6)).currentA).toBeCloseTo(0.5, 10)
  })
  it('gives zero current and zero resistor voltage for an open switch', () => {
    const r = calculateCircuit({ supplyVoltageV: 12, resistanceOhm: 10, switchClosed: false })
    expect(r.currentA).toBe(0)
    expect(r.resistorVoltageV).toBe(0)
    expect(r.supplyVoltageV).toBe(12)
    expect(r.state).toBe('open')
  })
  it('gives zero current for zero supply voltage with a closed switch', () => {
    const r = calculateCircuit(closed(0, 6))
    expect(r.currentA).toBe(0)
    expect(r.resistorVoltageV).toBe(0)
    expect(r.state).toBe('zero_supply')
  })
  it('accepts range boundaries and rejects values outside them', () => {
    expect(() => calculateCircuit(closed(12, 1))).not.toThrow()
    expect(() => calculateCircuit(closed(0, 100))).not.toThrow()
    for (const bad of [closed(12.5, 6), closed(-1, 6), closed(6, 0), closed(6, 0.5), closed(6, 101), closed(6, -4)]) {
      expect(() => calculateCircuit(bad)).toThrow(OhmValidationError)
    }
  })
  it('rejects non-finite inputs', () => {
    for (const bad of [closed(NaN, 6), closed(Infinity, 6), closed(6, NaN), closed(6, Infinity), closed(6, -Infinity)]) {
      expect(() => calculateCircuit(bad)).toThrow(OhmValidationError)
    }
  })
  it('fits a slope equal to R for same-resistance data', () => {
    const pts = [2, 4, 8].map((v) => {
      const r = calculateCircuit(closed(v, 5))
      return { currentA: r.currentA, voltageV: r.resistorVoltageV }
    })
    expect(fitSlopeOhm(pts)).toBeCloseTo(5, 8)
    expect(fitSlopeOhm(pts.slice(0, 1))).toBeNull()
  })
})

describe('ohmInputValidation', () => {
  it('does not turn blank text into zero', () => {
    expect(parseOhmDraft('')).toBeNull()
    expect(parseOhmDraft('   ')).toBeNull()
    expect(parseOhmDraft('abc')).toBeNull()
  })
  it('keeps the last valid circuit when an entry is invalid', () => {
    const drafts = createOhmDrafts(INITIAL_CIRCUIT_INPUT)
    for (const raw of ['', '0', '-3', '500', 'abc', 'Infinity']) {
      const out = applyOhmDraftEdit(INITIAL_CIRCUIT_INPUT, drafts, 'resistanceOhm', raw)
      expect(out.errors.resistanceOhm).toBeTruthy()
      expect(out.input).toEqual(INITIAL_CIRCUIT_INPUT)
      expect(out.drafts.resistanceOhm).toBe(raw)
    }
    const volts = applyOhmDraftEdit(INITIAL_CIRCUIT_INPUT, drafts, 'supplyVoltageV', '13')
    expect(volts.errors.supplyVoltageV).toBeTruthy()
    expect(volts.input.supplyVoltageV).toBe(6)
  })
  it('applies a valid entry and clears errors', () => {
    const drafts = createOhmDrafts(INITIAL_CIRCUIT_INPUT)
    const out = applyOhmDraftEdit(INITIAL_CIRCUIT_INPUT, drafts, 'supplyVoltageV', '9')
    expect(out.input.supplyVoltageV).toBe(9)
    expect(out.errors).toEqual({})
    expect(validateOhmDrafts(out.drafts)).toEqual({})
  })
})
