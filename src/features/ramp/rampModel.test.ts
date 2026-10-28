import { describe, expect, it } from 'vitest'
import {
  calculateRampMechanics,
  GRAVITATIONAL_ACCELERATION_M_PER_S2,
  RampModelValidationError,
} from './rampModel'

describe('Ideal Frictionless Ramp Scientific Model (rampModel)', () => {
  describe('Reference Cases (Fixed Numerical Expectations)', () => {
    it('matches Reference Case A: mass = 10 kg, height = 1 m, ramp length = 2 m', () => {
      const result = calculateRampMechanics({
        massKg: 10,
        heightM: 1,
        rampLengthM: 2,
      })

      expect(result.gravitationalAccelerationMPerS2).toBeCloseTo(9.81, 10)
      expect(result.weightN).toBeCloseTo(98.1, 10)
      expect(result.pullingForceN).toBeCloseTo(49.05, 10)
      expect(result.rampAngleRadians).toBeCloseTo(0.5235987756, 9)
      expect(result.rampAngleDegrees).toBeCloseTo(30, 9)
      expect(result.horizontalRunM).toBeCloseTo(1.7320508076, 9)
      expect(result.distanceAlongRampM).toBeCloseTo(2, 10)
      expect(result.appliedWorkJ).toBeCloseTo(98.1, 10)
      expect(result.potentialEnergyGainJ).toBeCloseTo(98.1, 10)
      expect(result.verticalLiftForceN).toBeCloseTo(98.1, 10)
      expect(result.verticalLiftDistanceM).toBeCloseTo(1, 10)
      expect(result.verticalLiftWorkJ).toBeCloseTo(98.1, 10)
      expect(result.idealMechanicalAdvantage).toBeCloseTo(2, 10)
    })

    it('matches Reference Case B: mass = 10 kg, height = 1 m, ramp length = 4 m', () => {
      const result = calculateRampMechanics({
        massKg: 10,
        heightM: 1,
        rampLengthM: 4,
      })

      expect(result.weightN).toBeCloseTo(98.1, 10)
      expect(result.pullingForceN).toBeCloseTo(24.525, 10)
      expect(result.rampAngleDegrees).toBeCloseTo(14.4775121859, 9)
      expect(result.horizontalRunM).toBeCloseTo(3.8729833462, 9)
      expect(result.distanceAlongRampM).toBeCloseTo(4, 10)
      expect(result.appliedWorkJ).toBeCloseTo(98.1, 10)
      expect(result.potentialEnergyGainJ).toBeCloseTo(98.1, 10)
      expect(result.verticalLiftWorkJ).toBeCloseTo(98.1, 10)
      expect(result.idealMechanicalAdvantage).toBeCloseTo(4, 10)
    })
  })

  describe('Physical Laws, Scaling & Boundary Cases', () => {
    it('handles the vertical limit where ramp length equals height (L = h)', () => {
      const result = calculateRampMechanics({
        massKg: 5,
        heightM: 3,
        rampLengthM: 3,
      })

      expect(result.rampAngleDegrees).toBeCloseTo(90, 9)
      expect(result.rampAngleRadians).toBeCloseTo(1.5707963268, 9)
      expect(result.horizontalRunM).toBeCloseTo(0, 10)
      expect(result.pullingForceN).toBeCloseTo(49.05, 10)
      expect(result.pullingForceN).toBeCloseTo(result.weightN, 10)
      expect(result.idealMechanicalAdvantage).toBeCloseTo(1, 10)
      expect(result.appliedWorkJ).toBeCloseTo(147.15, 10)
    })

    it('doubles pulling force and work when mass is doubled at fixed geometry', () => {
      const baseCase = calculateRampMechanics({
        massKg: 6,
        heightM: 1.5,
        rampLengthM: 3,
      })
      const doubledMass = calculateRampMechanics({
        massKg: 12,
        heightM: 1.5,
        rampLengthM: 3,
      })

      expect( baseCase.weightN ).toBeCloseTo(58.86, 10)
      expect( doubledMass.weightN ).toBeCloseTo(117.72, 10)
      expect( baseCase.pullingForceN ).toBeCloseTo(29.43, 10)
      expect( doubledMass.pullingForceN ).toBeCloseTo(58.86, 10)
      expect( baseCase.appliedWorkJ ).toBeCloseTo(88.29, 10)
      expect( doubledMass.appliedWorkJ ).toBeCloseTo(176.58, 10)
      expect(doubledMass.pullingForceN).toBeCloseTo(baseCase.pullingForceN * 2, 10)
      expect(doubledMass.appliedWorkJ).toBeCloseTo(baseCase.appliedWorkJ * 2, 10)
    })

    it('halves pulling force while keeping work constant when ramp length is doubled', () => {
      const shortRamp = calculateRampMechanics({
        massKg: 8,
        heightM: 2,
        rampLengthM: 5,
      })
      const longRamp = calculateRampMechanics({
        massKg: 8,
        heightM: 2,
        rampLengthM: 10,
      })

      expect(shortRamp.pullingForceN).toBeCloseTo(31.392, 10)
      expect(longRamp.pullingForceN).toBeCloseTo(15.696, 10)
      expect(longRamp.pullingForceN).toBeCloseTo(shortRamp.pullingForceN / 2, 10)
      expect(shortRamp.appliedWorkJ).toBeCloseTo(156.96, 10)
      expect(longRamp.appliedWorkJ).toBeCloseTo(156.96, 10)
    })

    it('conserves energy: applied ramp work agrees with potential energy gain and vertical-lift work', () => {
      const testCases = [
        { massKg: 2.5, heightM: 0.8, rampLengthM: 3.2, expectedWorkJ: 19.62 },
        { massKg: 15, heightM: 2.4, rampLengthM: 6.0, expectedWorkJ: 353.16 },
        { massKg: 0.75, heightM: 1.2, rampLengthM: 4.8, expectedWorkJ: 8.829 },
      ]

      for (const tc of testCases) {
        const res = calculateRampMechanics(tc)
        expect(res.appliedWorkJ).toBeCloseTo(tc.expectedWorkJ, 9)
        expect(res.potentialEnergyGainJ).toBeCloseTo(tc.expectedWorkJ, 9)
        expect(res.verticalLiftWorkJ).toBeCloseTo(tc.expectedWorkJ, 9)
        expect(res.appliedWorkJ).toBeCloseTo(res.potentialEnergyGainJ, 10)
        expect(res.appliedWorkJ).toBeCloseTo(res.verticalLiftWorkJ, 10)
      }
    })

    it('handles representative small positive inputs accurately', () => {
      const result = calculateRampMechanics({
        massKg: 0.05,
        heightM: 0.01,
        rampLengthM: 0.05,
      })

      expect(result.weightN).toBeCloseTo(0.4905, 10)
      expect(result.pullingForceN).toBeCloseTo(0.0981, 10)
      expect(result.appliedWorkJ).toBeCloseTo(0.004905, 10)
      expect(result.idealMechanicalAdvantage).toBeCloseTo(5, 10)
      expect(result.horizontalRunM).toBeCloseTo(0.0489897949, 9)
    })

    it('exports standard gravitational acceleration as 9.81 m/s^2', () => {
      expect(GRAVITATIONAL_ACCELERATION_M_PER_S2).toBe(9.81)
    })
  })

  describe('Input Validation & Error Handling', () => {
    it('rejects zero or negative mass', () => {
      expect(() =>
        calculateRampMechanics({ massKg: 0, heightM: 1, rampLengthM: 2 })
      ).toThrowError(RampModelValidationError)

      expect(() =>
        calculateRampMechanics({ massKg: -5, heightM: 1, rampLengthM: 2 })
      ).toThrow(/massKg.*greater than 0/i)
    })

    it('rejects zero or negative height', () => {
      expect(() =>
        calculateRampMechanics({ massKg: 10, heightM: 0, rampLengthM: 2 })
      ).toThrowError(RampModelValidationError)

      expect(() =>
        calculateRampMechanics({ massKg: 10, heightM: -1.5, rampLengthM: 2 })
      ).toThrow(/heightM.*greater than 0/i)
    })

    it('rejects ramp length strictly less than height', () => {
      expect(() =>
        calculateRampMechanics({ massKg: 10, heightM: 3, rampLengthM: 2.999 })
      ).toThrowError(RampModelValidationError)

      expect(() =>
        calculateRampMechanics({ massKg: 10, heightM: 3, rampLengthM: 1 })
      ).toThrow(/rampLengthM.*greater than or equal to height/i)
    })

    it('rejects NaN, +Infinity, and -Infinity in every input position', () => {
      const nonFiniteValues = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]

      for (const badVal of nonFiniteValues) {
        expect(() =>
          calculateRampMechanics({ massKg: badVal, heightM: 1, rampLengthM: 2 })
        ).toThrowError(RampModelValidationError)

        expect(() =>
          calculateRampMechanics({ massKg: 10, heightM: badVal, rampLengthM: 2 })
        ).toThrowError(RampModelValidationError)

        expect(() =>
          calculateRampMechanics({ massKg: 10, heightM: 1, rampLengthM: badVal })
        ).toThrowError(RampModelValidationError)
      }
    })

    it('reports a clear error if valid finite inputs produce non-finite computed outputs due to numeric overflow', () => {
      // Number.MAX_VALUE is finite (> 0), but multiplying by g = 9.81 or squaring overflows to Infinity
      expect(() =>
        calculateRampMechanics({
          massKg: Number.MAX_VALUE,
          heightM: 1,
          rampLengthM: 2,
        })
      ).toThrow(/Numeric overflow or non-finite computed output/i)

      expect(() =>
        calculateRampMechanics({
          massKg: 10,
          heightM: 1,
          rampLengthM: Number.MAX_VALUE,
        })
      ).toThrow(/Numeric overflow or non-finite computed output/i)
    })
  })
})
