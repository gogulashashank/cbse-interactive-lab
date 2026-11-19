import { describe, expect, it } from 'vitest'
import {
  calculateDiameterTrap,
  calculateGravityInverse,
  calculateInverseArea,
  calculateMagneticFieldSolenoid,
  calculatePhIonScaling,
  calculateSoundEchoWave,
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

  it('calculates inverse wavelength λ = v/f and echo round-trip time t = 2d/v', () => {
    // f = 170 Hz, v = 340 m/s, d = 85 m => λ = 2 m, 2d = 170 m, t_echo = 0.5 s (distinct echo)
    const echo = calculateSoundEchoWave(170, 340, 85)
    expect(echo.wavelengthM).toBe(2)
    expect(echo.roundTripDistanceM).toBe(170)
    expect(echo.echoTimeS).toBe(0.5)
    expect(echo.isDistinctEcho).toBe(true)

    // Near wall d = 10 m at v = 340 m/s => 2d = 20 m, t_echo = 0.06 s (< 0.1 s, not distinct)
    const near = calculateSoundEchoWave(340, 340, 10)
    expect(near.wavelengthM).toBe(1)
    expect(near.echoTimeS).toBe(0.06)
    expect(near.isDistinctEcho).toBe(false)
  })

  it('calculates magnetic field inverse radial scaling (B ∝ I/r) and solenoid Right-Hand Thumb Rule polarity', () => {
    const nearUp = calculateMagneticFieldSolenoid(4, 2, 100, 'upward-or-ccw')
    const farDown = calculateMagneticFieldSolenoid(4, 4, 200, 'downward-or-cw')

    // Doubling r from 2 cm to 4 cm halves B_wire from 40 μT to 20 μT
    expect(nearUp.wireFieldMicroTesla).toBe(40)
    expect(farDown.wireFieldMicroTesla).toBe(20)
    // Doubling turns N from 100 to 200 doubles solenoid core field from 4 mT to 8 mT
    expect(nearUp.solenoidCoreFieldMilliTesla).toBe(4)
    expect(farDown.solenoidCoreFieldMilliTesla).toBe(8)
    // Polarity reversal
    expect(nearUp.thumbRuleFieldLoopSense).toBe('anticlockwise')
    expect(nearUp.solenoidLeftPole).toBe('North')
    expect(farDown.thumbRuleFieldLoopSense).toBe('clockwise')
    expect(farDown.solenoidLeftPole).toBe('South')
  })

  it('calculates ten-fold logarithmic [H+] scaling on the pH scale and tooth enamel decay threshold', () => {
    // pH 2 compared to pH 5 => 10^(5-2) = 1000x higher [H+]
    const strongAcid = calculatePhIonScaling(2, 5)
    expect(strongAcid.hPlusExponent).toBe(-2)
    expect(strongAcid.tenFoldHPlusRatioVsReference).toBe(1000)
    expect(strongAcid.nature).toBe('strongly-acidic')
    expect(strongAcid.causesToothEnamelDecay).toBe(true)

    const neutral = calculatePhIonScaling(7, 7)
    expect(neutral.nature).toBe('neutral')
    expect(neutral.causesToothEnamelDecay).toBe(false)
  })
})
