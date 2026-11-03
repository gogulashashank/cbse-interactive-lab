import { describe, expect, it } from 'vitest'
import {
  calculateCircuitFailure,
  calculateConstantTempOhmic,
  calculateFixedConditionPower,
  calculateStretchingVsComparing,
} from './models'

describe('Controlled Experiments Physics Models', () => {
  it('calculates fixed voltage vs fixed current power scaling', () => {
    // 4 Ω vs 12 Ω at fixed 12 V:
    // P1 = 144 / 4 = 36 W, P2 = 144 / 12 = 12 W
    const fixedV = calculateFixedConditionPower('fixed-voltage', 4.0, 12.0, 12.0)
    expect(fixedV.p1).toBe(36.0)
    expect(fixedV.p2).toBe(12.0)
    expect(fixedV.higherPowerResistor).toBe('r1') // smaller R gives HIGHER power!

    // 4 Ω vs 12 Ω at fixed 2 A:
    // P1 = 4 * 4 = 16 W, P2 = 4 * 12 = 48 W
    const fixedI = calculateFixedConditionPower('fixed-current', 4.0, 12.0, 2.0)
    expect(fixedI.p1).toBe(16.0)
    expect(fixedI.p2).toBe(48.0)
    expect(fixedI.higherPowerResistor).toBe('r2') // larger R gives HIGHER power!
  })

  it('distinguishes comparing two wires (2x) vs stretching a single wire (4x)', () => {
    const res = calculateStretchingVsComparing(1.0, 1.0, 2.0)
    // Comparing two wires: length doubled, area unchanged => R doubles (2x)
    expect(res.comparedResistanceOhm).toBe(2.0)
    expect(res.comparedFactor).toBe(2.0)

    // Stretching single wire: length doubled, area halves (0.5 mm²) => R quadruples (4x)!
    expect(res.stretchedAreaMm2).toBe(0.5)
    expect(res.stretchedResistanceOhm).toBe(4.0)
    expect(res.stretchedFactor).toBe(4.0)
  })

  it('calculates constant temp Ohmic straight line vs filament heating resistance increase', () => {
    const res10V = calculateConstantTempOhmic(10.0, 10.0)
    expect(res10V.ohmicResistanceOhm).toBe(10.0)
    expect(res10V.ohmicCurrentA).toBe(1.0)
    // Filament resistance rose from 10 to 22 Ω
    expect(res10V.filamentResistanceOhm).toBe(22.0)
    expect(res10V.filamentCurrentA).toBeCloseTo(0.45, 2)
  })

  it('calculates circuit failure: series goes completely dark, parallel continues working', () => {
    // Series with 1 broken bulb: all 0 bulbs work
    const seriesFail = calculateCircuitFailure('series', 3, 1)
    expect(seriesFail.activeBulbsCount).toBe(0)
    expect(seriesFail.isWholeCircuitDark).toBe(true)

    // Parallel with 1 broken bulb: remaining 2 bulbs stay lit
    const parallelFail = calculateCircuitFailure('parallel', 3, 1)
    expect(parallelFail.activeBulbsCount).toBe(2)
    expect(parallelFail.isWholeCircuitDark).toBe(false)
  })
})
