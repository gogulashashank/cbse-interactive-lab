import { describe, expect, it } from 'vitest'
import {
  calculateSeriesParallel,
  parallelResistance,
  seriesResistance,
  SPValidationError,
  type SPInput,
} from './spModel'
import {
  applySPDraftEdit,
  createSPDrafts,
  INITIAL_SP_INPUT,
  validateSPDrafts,
} from './spInputValidation'

const mk = (arrangement: SPInput['arrangement'], v: number, r1: number, r2: number, closed = true): SPInput => ({
  arrangement,
  supplyVoltageV: v,
  resistance1Ohm: r1,
  resistance2Ohm: r2,
  switchClosed: closed,
})

describe('spModel — the three arrangements at 6 V with 6 Ω resistors', () => {
  it('one resistor: 6 Ω, 1 A', () => {
    const r = calculateSeriesParallel(mk('single', 6, 6, 6))
    expect(r.equivalentResistanceOhm).toBeCloseTo(6, 10)
    expect(r.supplyCurrentA).toBeCloseTo(1, 10)
    expect(r.resistor2).toBeNull()
  })
  it('two in series: 12 Ω, 0.5 A, 3 V across each', () => {
    const r = calculateSeriesParallel(mk('series', 6, 6, 6))
    expect(r.equivalentResistanceOhm).toBeCloseTo(12, 10)
    expect(r.supplyCurrentA).toBeCloseTo(0.5, 10)
    expect(r.resistor1.currentA).toBeCloseTo(0.5, 10)
    expect(r.resistor2?.currentA).toBeCloseTo(0.5, 10)
    expect(r.resistor1.voltageV).toBeCloseTo(3, 10)
    expect(r.resistor2?.voltageV).toBeCloseTo(3, 10)
  })
  it('two in parallel: 3 Ω, 2 A, 1 A in each branch, 6 V across each', () => {
    const r = calculateSeriesParallel(mk('parallel', 6, 6, 6))
    expect(r.equivalentResistanceOhm).toBeCloseTo(3, 10)
    expect(r.supplyCurrentA).toBeCloseTo(2, 10)
    expect(r.resistor1.currentA).toBeCloseTo(1, 10)
    expect(r.resistor2?.currentA).toBeCloseTo(1, 10)
    expect(r.resistor1.voltageV).toBe(6)
    expect(r.resistor2?.voltageV).toBe(6)
  })
  it('adding a resistor can lower or raise the supply current', () => {
    const one = calculateSeriesParallel(mk('single', 6, 6, 6)).supplyCurrentA
    expect(calculateSeriesParallel(mk('series', 6, 6, 6)).supplyCurrentA).toBeLessThan(one)
    expect(calculateSeriesParallel(mk('parallel', 6, 6, 6)).supplyCurrentA).toBeGreaterThan(one)
  })
})

describe('spModel — laws', () => {
  it('unequal parallel (6 Ω and 12 Ω at 6 V): 4 Ω, 1.5 A, branch currents 1 A and 0.5 A', () => {
    const r = calculateSeriesParallel(mk('parallel', 6, 6, 12))
    expect(r.equivalentResistanceOhm).toBeCloseTo(4, 10)
    expect(r.supplyCurrentA).toBeCloseTo(1.5, 10)
    expect(r.resistor1.currentA).toBeCloseTo(1, 10)
    expect(r.resistor2?.currentA).toBeCloseTo(0.5, 10)
    expect(r.resistor1.currentA).toBeGreaterThan(r.resistor2?.currentA ?? 0)
  })
  it('series voltages add to the supply; parallel currents add to the supply current', () => {
    const s = calculateSeriesParallel(mk('series', 9, 4, 8))
    expect((s.resistor1.voltageV) + (s.resistor2?.voltageV ?? 0)).toBeCloseTo(9, 10)
    const p = calculateSeriesParallel(mk('parallel', 9, 5, 20))
    expect(p.resistor1.currentA + (p.resistor2?.currentA ?? 0)).toBeCloseTo(p.supplyCurrentA, 10)
  })
  it('parallel equivalent is smaller than the smaller resistor; series is bigger than the bigger', () => {
    expect(parallelResistance(10, 40)).toBeLessThan(10)
    expect(parallelResistance(10, 40)).toBeCloseTo(8, 10)
    expect(seriesResistance(10, 40)).toBe(50)
  })
  it('open switch and zero supply give zero current everywhere', () => {
    for (const a of ['single', 'series', 'parallel'] as const) {
      const o = calculateSeriesParallel(mk(a, 12, 10, 20, false))
      expect(o.supplyCurrentA).toBe(0)
      expect(o.resistor1).toEqual({ currentA: 0, voltageV: 0 })
      expect(o.state).toBe('open')
      const z = calculateSeriesParallel(mk(a, 0, 10, 20))
      expect(z.supplyCurrentA).toBe(0)
      expect(z.resistor1.voltageV).toBe(0)
      expect(z.state).toBe('zero_supply')
    }
  })
  it('rejects out-of-range and non-finite values, accepts boundaries', () => {
    expect(() => calculateSeriesParallel(mk('series', 12, 1, 100))).not.toThrow()
    for (const bad of [mk('series', 13, 6, 6), mk('series', 6, 0, 6), mk('parallel', 6, 6, 0), mk('parallel', 6, 6, 101), mk('series', NaN, 6, 6), mk('series', 6, Infinity, 6), mk('single', 6, 6, -2)]) {
      expect(() => calculateSeriesParallel(bad)).toThrow(SPValidationError)
    }
  })
})

describe('spInputValidation', () => {
  it('keeps the last valid circuit when an entry is invalid', () => {
    const drafts = createSPDrafts(INITIAL_SP_INPUT)
    for (const field of ['resistance1Ohm', 'resistance2Ohm'] as const) {
      for (const raw of ['', '0', '-3', '500', 'abc']) {
        const out = applySPDraftEdit(INITIAL_SP_INPUT, drafts, field, raw)
        expect(out.errors[field]).toBeTruthy()
        expect(out.input).toEqual(INITIAL_SP_INPUT)
        expect(out.drafts[field]).toBe(raw)
      }
    }
    const v = applySPDraftEdit(INITIAL_SP_INPUT, drafts, 'supplyVoltageV', '13')
    expect(v.errors.supplyVoltageV).toBeTruthy()
    expect(v.input.supplyVoltageV).toBe(6)
  })
  it('applies valid entries', () => {
    const out = applySPDraftEdit(INITIAL_SP_INPUT, createSPDrafts(INITIAL_SP_INPUT), 'resistance2Ohm', '12')
    expect(out.input.resistance2Ohm).toBe(12)
    expect(validateSPDrafts(out.drafts)).toEqual({})
  })
})
