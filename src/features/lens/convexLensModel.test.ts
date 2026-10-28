import { describe, expect, it } from 'vitest'
import {
  calculateConvexLens,
  ConvexLensValidationError,
  validateConvexLensInput,
} from './convexLensModel'

describe('convexLensModel — ideal thin convex lens (New Cartesian Sign Convention)', () => {
  it('computes Case 1: object beyond 2F₁ (|u| = 45 cm, f = 15 cm) -> real, inverted, diminished between F₂ and 2F₂', () => {
    const result = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 45,
      objectHeightCm: 6,
      screenDistanceCm: 22.5,
    })

    // 1/v = 1/15 + 1/(-45) = 2/45 => v = +22.5 cm
    expect(result.uCm).toBe(-45)
    expect(result.fCm).toBe(15)
    expect(result.vCm).toBeCloseTo(22.5, 6)
    expect(result.imageDistanceCm).toBeCloseTo(22.5, 6)

    // m = v / u = 22.5 / -45 = -0.5, h' = -3 cm
    expect(result.magnification).toBeCloseTo(-0.5, 6)
    expect(result.imageHeightCm).toBeCloseTo(-3, 6)
    expect(result.opticalPowerDioptre).toBeCloseTo(100 / 15, 6)

    expect(result.regime).toBe('beyond_2f')
    expect(result.imageNature).toBe('real_inverted')
    expect(result.relativeSize).toBe('diminished')
    expect(result.canCatchOnScreen).toBe(true)
    expect(result.isSharpOnScreen).toBe(true)
    expect(result.screenBlurFraction).toBe(0)
    expect(result.rays.screenIntersections.beamSpreadCm).toBeCloseTo(0, 6)
  })

  it('computes Case 2: object at 2F₁ (|u| = 30 cm, f = 15 cm) -> real, inverted, same size at 2F₂ (v = +30 cm, m = -1)', () => {
    const result = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 30,
      objectHeightCm: 4,
      screenDistanceCm: 30,
    })

    expect(result.uCm).toBe(-30)
    expect(result.vCm).toBeCloseTo(30, 6)
    expect(result.magnification).toBeCloseTo(-1, 6)
    expect(result.imageHeightCm).toBeCloseTo(-4, 6)
    expect(result.regime).toBe('at_2f')
    expect(result.imageNature).toBe('real_inverted')
    expect(result.relativeSize).toBe('same_size')
    expect(result.canCatchOnScreen).toBe(true)
    expect(result.isSharpOnScreen).toBe(true)
  })

  it('computes Case 3: object between F₁ and 2F₁ (|u| = 20 cm, f = 15 cm) -> real, inverted, enlarged beyond 2F₂ (v = +60 cm, m = -3)', () => {
    const result = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 20,
      objectHeightCm: 3,
      screenDistanceCm: 60,
    })

    // 1/v = 1/15 - 1/20 = 1/60 => v = +60 cm
    expect(result.vCm).toBeCloseTo(60, 6)
    expect(result.magnification).toBeCloseTo(-3, 6)
    expect(result.imageHeightCm).toBeCloseTo(-9, 6)
    expect(result.regime).toBe('between_f_and_2f')
    expect(result.imageNature).toBe('real_inverted')
    expect(result.relativeSize).toBe('enlarged')
    expect(result.canCatchOnScreen).toBe(true)
    expect(result.isSharpOnScreen).toBe(true)
  })

  it('handles Case 4: focal boundary (|u| = f = 15 cm) cleanly without NaN or division-by-zero', () => {
    const result = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 15,
      objectHeightCm: 4,
      screenDistanceCm: 30,
    })

    expect(result.isAtFocus).toBe(true)
    expect(result.vCm).toBeNull()
    expect(result.imageDistanceCm).toBeNull()
    expect(result.magnification).toBeNull()
    expect(result.imageHeightCm).toBeNull()
    expect(result.regime).toBe('at_f')
    expect(result.imageNature).toBe('at_infinity')
    expect(result.relativeSize).toBe('infinitely_large')
    expect(result.canCatchOnScreen).toBe(false)
    expect(result.isSharpOnScreen).toBe(false)
    expect(result.rays.ray3ThroughF1ToParallel).toBeNull()

    // Refracted rays 1 and 2 must be parallel (constant vertical separation h_o = 4 cm)
    expect(result.rays.screenIntersections.beamSpreadCm).toBeCloseTo(4, 6)
  })

  it('computes Case 5: object inside focus (|u| = 10 cm, f = 15 cm) -> virtual, erect, enlarged on object side (v = -30 cm, m = +3) and cannot be caught on screen', () => {
    const result = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 10,
      objectHeightCm: 2.5,
      screenDistanceCm: 30,
    })

    // 1/v = 1/15 - 1/10 = -1/30 => v = -30 cm
    expect(result.uCm).toBe(-10)
    expect(result.vCm).toBeCloseTo(-30, 6)
    expect(result.imageDistanceCm).toBeCloseTo(30, 6)
    expect(result.magnification).toBeCloseTo(3, 6)
    expect(result.imageHeightCm).toBeCloseTo(7.5, 6)
    expect(result.regime).toBe('within_f')
    expect(result.imageNature).toBe('virtual_erect')
    expect(result.relativeSize).toBe('enlarged')
    expect(result.canCatchOnScreen).toBe(false)
    expect(result.isSharpOnScreen).toBe(false)

    // Virtual traceback extensions must converge at (v = -30 cm, h' = +7.5 cm)
    expect(result.rays.ray1ParallelToF2.virtualExtensionEnd?.xCm).toBeCloseTo(-30, 6)
    expect(result.rays.ray1ParallelToF2.virtualExtensionEnd?.yCm).toBeCloseTo(7.5, 6)
    expect(result.rays.ray2ThroughOpticalCentre.virtualExtensionEnd?.xCm).toBeCloseTo(-30, 6)
    expect(result.rays.ray2ThroughOpticalCentre.virtualExtensionEnd?.yCm).toBeCloseTo(7.5, 6)
    expect(result.rays.ray3ThroughF1ToParallel?.virtualExtensionEnd?.xCm).toBeCloseTo(-30, 6)
    expect(result.rays.ray3ThroughF1ToParallel?.virtualExtensionEnd?.yCm).toBeCloseTo(7.5, 6)
  })

  it('detects out-of-focus screen placement when screenDistanceCm !== vCm for a real image', () => {
    const outOfFocus = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 30,
      objectHeightCm: 4,
      screenDistanceCm: 18, // sharp image is at +30 cm
    })

    expect(outOfFocus.canCatchOnScreen).toBe(true)
    expect(outOfFocus.isSharpOnScreen).toBe(false)
    expect(outOfFocus.screenOffsetFromImageCm).toBeCloseTo(-12, 6)
    expect(outOfFocus.screenBlurFraction).toBeGreaterThan(0)
    expect(outOfFocus.rays.screenIntersections.beamSpreadCm).toBeGreaterThan(0)
  })

  it('computes optical power P = 100 / f_cm in dioptres accurately', () => {
    const lens20Cm = calculateConvexLens({
      focalLengthCm: 20,
      objectDistanceCm: 40,
      objectHeightCm: 3,
      screenDistanceCm: 40,
    })
    expect(lens20Cm.opticalPowerDioptre).toBeCloseTo(5.0, 6)

    const lens10Cm = calculateConvexLens({
      focalLengthCm: 10,
      objectDistanceCm: 25,
      objectHeightCm: 3,
      screenDistanceCm: 20,
    })
    expect(lens10Cm.opticalPowerDioptre).toBeCloseTo(10.0, 6)
  })

  it('rejects non-finite and non-positive inputs with ConvexLensValidationError', () => {
    expect(() =>
      validateConvexLensInput({
        focalLengthCm: 0,
        objectDistanceCm: 30,
        objectHeightCm: 4,
        screenDistanceCm: 30,
      })
    ).toThrow(ConvexLensValidationError)

    expect(() =>
      validateConvexLensInput({
        focalLengthCm: 15,
        objectDistanceCm: -10,
        objectHeightCm: 4,
        screenDistanceCm: 30,
      })
    ).toThrow(ConvexLensValidationError)

    expect(() =>
      validateConvexLensInput({
        focalLengthCm: Number.NaN,
        objectDistanceCm: 30,
        objectHeightCm: 4,
        screenDistanceCm: 30,
      })
    ).toThrow(ConvexLensValidationError)

    expect(() =>
      validateConvexLensInput({
        focalLengthCm: 15,
        objectDistanceCm: 30,
        objectHeightCm: 0,
        screenDistanceCm: 30,
      })
    ).toThrow(ConvexLensValidationError)

    expect(() =>
      validateConvexLensInput({
        focalLengthCm: 15,
        objectDistanceCm: 30,
        objectHeightCm: 4,
        screenDistanceCm: -5,
      })
    ).toThrow(ConvexLensValidationError)
  })
})
