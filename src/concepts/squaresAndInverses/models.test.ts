import { describe, expect, it } from 'vitest'
import {
  calculateDiameterTrap,
  calculateGravityInverse,
  calculateInverseArea,
  calculateVoltageSquared,
} from './models'

describe('Squares and Inverses Physics Models', () => {
  it('calculates inverse area scaling (R ∝ 1/A)', () => {
    // Baseline: A = 1 mm² → R = 1 Ω
    const base = calculateInverseArea(1.0)
    expect(base.resistanceOhm).toBe(1.0)
    expect(base.relativeArea).toBe(1.0)
    expect(base.relativeResistance).toBe(1.0)

    // Double area: A = 2 mm² → R = 0.5 Ω (halves)
    const doubleA = calculateInverseArea(2.0)
    expect(doubleA.resistanceOhm).toBe(0.5)
    expect(doubleA.relativeArea).toBe(2.0)
    expect(doubleA.relativeResistance).toBe(0.5)
  })

  it('calculates diameter scaling and verifies 1/4th resistance trap (A ∝ d²)', () => {
    // Baseline: d = 1 mm
    const base = calculateDiameterTrap(1.0)
    expect(base.areaFactor).toBe(1.0)
    expect(base.resistanceFactor).toBe(1.0)

    // Doubled diameter: d = 2 mm
    const doubled = calculateDiameterTrap(2.0)
    expect(doubled.areaFactor).toBe(4.0) // Area quadruples
    expect(doubled.resistanceFactor).toBe(0.25) // Resistance becomes 1/4th!
    expect(doubled.resistanceOhm).toBe(1.0) // 4 Ω / 4 = 1 Ω
  })

  it('calculates voltage squared power scaling (P ∝ V²)', () => {
    // 6 V on 6 Ω: P = 36 / 6 = 6 W
    const base = calculateVoltageSquared(6.0, 6.0)
    expect(base.powerW).toBe(6.0)
    expect(base.currentA).toBe(1.0)
    expect(base.powerFactor).toBe(1.0)

    // 12 V on 6 Ω: P = 144 / 6 = 24 W (quadrupled!)
    const doubleV = calculateVoltageSquared(12.0, 6.0)
    expect(doubleV.powerW).toBe(24.0)
    expect(doubleV.currentA).toBe(2.0)
    expect(doubleV.powerFactor).toBe(4.0)
  })

  it('calculates universal inverse-square law for gravity (F ∝ 1/r²)', () => {
    // Baseline at r = 1: F = 100 N
    const base = calculateGravityInverse(1.0)
    expect(base.forceN).toBe(100.0)

    // Double distance: r = 2 → F = 25 N (1/4th)
    const doubleR = calculateGravityInverse(2.0)
    expect(doubleR.forceN).toBe(25.0)
    expect(doubleR.forceFactor).toBe(0.25)

    // Triple distance: r = 3 → F ≈ 11.11 N (1/9th)
    const tripleR = calculateGravityInverse(3.0)
    expect(tripleR.forceN).toBeCloseTo(11.11, 1)
  })
})
