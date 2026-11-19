import { describe, expect, it } from 'vitest'
import {
  calculateCircuitFailure,
  calculateConstantTempOhmic,
  calculateFixedConditionPower,
  calculateMetalDisplacement,
  calculateMomentumImpulse,
  calculateMotorForceFlemingsRule,
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

  it('calculates fixed momentum change Δp and inverse force reduction as stopping time Δt increases', () => {
    // 0.15 kg cricket ball at 20 m/s => Δp = 3.0 kg·m/s
    // Stiff catch (0.05 s) => F = 60 N; Cushioned catch (0.25 s) => F = 12 N (5x reduction)
    const cushioned = calculateMomentumImpulse(0.15, 20, 0.25, 0.05)
    expect(cushioned.momentumChangeKgMps).toBe(3)
    expect(cushioned.stiffHandsForceN).toBe(60)
    expect(cushioned.impactForceN).toBe(12)
    expect(cushioned.forceReductionFactor).toBe(5)
  })

  it('calculates motor force F = B*I*L*sin(θ) and verifies double-reversal invariance under Fleming’s Left-Hand Rule', () => {
    // Perpendicular (90°): B = 0.5 T, I = 4 A, L = 0.2 m => F = 0.4 N Upward (+Z)
    const perp = calculateMotorForceFlemingsRule(0.5, 4, 90, 1, 1, 0.2)
    expect(perp.forceMagnitudeN).toBe(0.4)
    expect(perp.forceDirectionSign).toBe(1)
    expect(perp.forceDirectionLabel).toBe('Upward (+Z)')

    // Reverse ONLY current (-1, +1) => Downward (-Z)
    const revI = calculateMotorForceFlemingsRule(0.5, 4, 90, -1, 1, 0.2)
    expect(revI.forceDirectionSign).toBe(-1)
    expect(revI.forceDirectionLabel).toBe('Downward (−Z)')

    // Reverse BOTH current and magnetic field (-1, -1) => Upward (+Z) unchanged!
    const revBoth = calculateMotorForceFlemingsRule(0.5, 4, 90, -1, -1, 0.2)
    expect(revBoth.forceDirectionSign).toBe(1)
    expect(revBoth.forceDirectionLabel).toBe('Upward (+Z)')

    // Parallel (0°) => F = 0 N
    const parallel = calculateMotorForceFlemingsRule(0.5, 4, 0, 1, 1, 0.2)
    expect(parallel.forceMagnitudeN).toBe(0)
    expect(parallel.forceDirectionSign).toBe(0)
  })

  it('determines single-displacement direction across the Metal Reactivity Series (Fe + CuSO4 vs Cu + FeSO4)', () => {
    const feInCu = calculateMetalDisplacement('Fe', 'Cu')
    expect(feInCu.reactionOccurs).toBe(true)
    expect(feInCu.initialSolutionColor).toContain('Blue')
    expect(feInCu.finalSolutionColor).toContain('Green')
    expect(feInCu.depositOnStrip).toContain('Cu')

    const cuInFe = calculateMetalDisplacement('Cu', 'Fe')
    expect(cuInFe.reactionOccurs).toBe(false)
    expect(cuInFe.equationText).toContain('No Reaction')
  })
})
