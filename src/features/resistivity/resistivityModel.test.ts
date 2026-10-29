import { describe, expect, it } from 'vitest'
import {
  areaMm2ToDiameterMm,
  calculateWire,
  calculateWireResistance,
  getMaterial,
  MATERIALS,
  ResistivityValidationError,
  type WireInput,
} from './resistivityModel'
import {
  applyWireDraftEdit,
  createWireDrafts,
  INITIAL_WIRE_INPUT,
  validateWireDrafts,
} from './resistivityInputValidation'

const mkWire = (mat: WireInput['materialId'], L: number, A: number, V = 6, closed = true): WireInput => ({
  materialId: mat,
  lengthM: L,
  areaMm2: A,
  supplyVoltageV: V,
  switchClosed: closed,
})

describe('resistivityModel — R = ρ * L / A', () => {
  it('computes standard baseline: Nichrome (1.0e-6 Ω·m), L = 1 m, A = 0.5 mm² -> R = 2.0 Ω, I = 3.0 A at 6 V', () => {
    const rawR = calculateWireResistance(1.0e-6, 1.0, 0.5)
    expect(rawR).toBeCloseTo(2.0, 8)
    const diam = areaMm2ToDiameterMm(0.5)
    expect(diam).toBeCloseTo(Math.sqrt((4 * 0.5) / Math.PI), 8)

    const res = calculateWire(mkWire('nichrome', 1.0, 0.5, 6))
    expect(res.resistanceOhm).toBeCloseTo(2.0, 8)
    expect(res.currentA).toBeCloseTo(3.0, 8)
    expect(res.diameterMm).toBeCloseTo(diam, 8)
  })

  it('doubling length doubles resistance and halves current', () => {
    const r1 = calculateWire(mkWire('nichrome', 1.0, 0.5, 6))
    const r2 = calculateWire(mkWire('nichrome', 2.0, 0.5, 6))
    expect(r2.resistanceOhm / r1.resistanceOhm).toBeCloseTo(2.0, 8)
    expect(r2.currentA / r1.currentA).toBeCloseTo(0.5, 8)
  })

  it('doubling cross-sectional area halves resistance and doubles current', () => {
    const r1 = calculateWire(mkWire('nichrome', 1.0, 0.5, 6))
    const r2 = calculateWire(mkWire('nichrome', 1.0, 1.0, 6))
    expect(r2.resistanceOhm / r1.resistanceOhm).toBeCloseTo(0.5, 8)
    expect(r2.currentA / r1.currentA).toBeCloseTo(2.0, 8)
  })

  it('doubling diameter quadruples area and quarters resistance', () => {
    const d1 = 0.5 // 0.5 mm diameter
    const A1 = (Math.PI * d1 * d1) / 4 // ~0.196 mm²
    const d2 = 1.0 // 1.0 mm diameter (doubled)
    const A2 = (Math.PI * d2 * d2) / 4 // ~0.785 mm²

    const r1 = calculateWire(mkWire('nichrome', 2.0, A1, 6))
    const r2 = calculateWire(mkWire('nichrome', 2.0, A2, 6))

    expect(A2 / A1).toBeCloseTo(4.0, 8)
    expect(r2.resistanceOhm / r1.resistanceOhm).toBeCloseTo(0.25, 8)
  })

  it('changing material changes resistance proportionally to resistivity', () => {
    const nichromeRes = calculateWire(mkWire('nichrome', 2.0, 0.5, 6)).resistanceOhm
    const copperRes = calculateWire(mkWire('copper', 2.0, 0.5, 6)).resistanceOhm
    const nichromeMat = getMaterial('nichrome')
    const copperMat = getMaterial('copper')
    expect(nichromeRes / copperRes).toBeCloseTo(nichromeMat.resistivityOhmMeter / copperMat.resistivityOhmMeter, 8)
  })

  it('switch open gives zero current but preserves calculated wire resistance', () => {
    const res = calculateWire(mkWire('nichrome', 1.0, 0.5, 6, false))
    expect(res.currentA).toBe(0)
    expect(res.resistorVoltageV).toBe(0)
    expect(res.resistanceOhm).toBeCloseTo(2.0, 8)
  })

  it('rejects out of range or non-finite inputs with ResistivityValidationError', () => {
    expect(() => calculateWire(mkWire('copper', 0.1, 0.5))).toThrow(ResistivityValidationError)
    expect(() => calculateWire(mkWire('copper', 12, 0.5))).toThrow(ResistivityValidationError)
    expect(() => calculateWire(mkWire('copper', 1.0, 0.01))).toThrow(ResistivityValidationError)
    expect(() => calculateWire(mkWire('copper', 1.0, 3.0))).toThrow(ResistivityValidationError)
    expect(() => calculateWire(mkWire('copper', NaN, 0.5))).toThrow(ResistivityValidationError)
  })
})

describe('resistivityInputValidation', () => {
  it('lists all materials with valid positive resistivities', () => {
    expect(MATERIALS.length).toBeGreaterThanOrEqual(4)
    for (const m of MATERIALS) {
      expect(m.resistivityOhmMeter).toBeGreaterThan(0)
    }
  })

  it('keeps the last valid circuit on invalid drafts', () => {
    const drafts = createWireDrafts(INITIAL_WIRE_INPUT)
    expect(validateWireDrafts(drafts)).toEqual({})
    for (const raw of ['', '0', '-2', '50', 'abc']) {
      const out = applyWireDraftEdit(INITIAL_WIRE_INPUT, drafts, 'lengthM', raw)
      expect(out.errors.lengthM).toBeTruthy()
      expect(out.input).toEqual(INITIAL_WIRE_INPUT)
    }
  })

  it('updates valid drafts cleanly', () => {
    const drafts = createWireDrafts(INITIAL_WIRE_INPUT)
    const out = applyWireDraftEdit(INITIAL_WIRE_INPUT, drafts, 'lengthM', '2.5')
    expect(out.errors.lengthM).toBeUndefined()
    expect(out.input.lengthM).toBe(2.5)
  })
})
