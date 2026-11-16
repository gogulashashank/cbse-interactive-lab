/**
 * Pure TypeScript Scientific & Geometric Model: Power of a Thin Lens (Class 10 Optics)
 *
 * Governing Equations & Sign Convention (NCERT New Cartesian Sign Convention):
 * - Optical centre O is at origin (0, 0).
 * - Incident rays travel parallel to the principal axis from left (-x) to right (+x).
 * - Focal length f:
 *   - Converging (convex) lens: principal focus F2 lies on the right (+x), so f > 0.
 *   - Diverging (concave) lens: principal focus F1 lies on the left (-x), so f < 0;
 *     refracted rays diverge on the right (+x) as if originating from (-|f|, 0).
 * - Optical Power (SI unit: dioptre, D, where 1 D = 1 m^-1):
 *   - f_m = f_cm / 100
 *   - P = 1 / f_m = 100 / f_cm
 *
 * Modelling Assumptions & Scope:
 * - Ideal paraxial thin-lens approximation: all refraction occurs at the vertical principal plane x = 0,
 *   and all incoming rays parallel to the principal axis meet at (or appear to diverge from) a single
 *   principal focus F without spherical aberration.
 * - Different parallel rays at different heights y from the principal axis bend through different angles
 *   tan(theta) = |y / f|. Because outer rays are drawn at y = +-6 cm for visual clarity at screen scale,
 *   steep settings (such as |f| = 10 cm, where theta = arctan(6/10) = 30.96 deg) exceed a strictly small-angle
 *   physical beam while still following the exact ideal thin-lens focus construction.
 * - Interactive display & ruler range: |f| is constrained to 10-50 cm (-50 cm to -10 cm for concave;
 *   +10 cm to +50 cm for convex) as a chosen interactive bench range so the principal focus always lies
 *   within the symmetric calibrated bench ruler (-50 cm to +50 cm).
 * - Lens thickness in the SVG diagram is a schematic visual indicator only; physical power depends
 *   on surface curvatures and refractive index, not thickness alone.
 *
 * Zero React, DOM, or browser imports.
 */

export type ThinLensNature = 'converging' | 'diverging'

export interface LensPowerModelInput {
  /** Signed focal length in centimetres (non-zero, finite; e.g. +20 for convex, -25 for concave) */
  focalLengthCm: number
}

export interface ParallelRayGeometry {
  /** Height y in cm above/below principal axis (0 is axial ray) */
  heightYCm: number
  /** Start point of parallel incident ray on the left (xCm < 0, yCm = heightYCm) */
  incidentStart: { xCm: number; yCm: number }
  /** Point where ray hits the thin-lens plane (xCm = 0, yCm = heightYCm) */
  lensHit: { xCm: number; yCm: number }
  /** End point of actual refracted ray on the right (xCm > 0), clipped cleanly to the optical bench corridor */
  refractedEnd: { xCm: number; yCm: number }
  /**
   * Optional backward virtual ray extension (for concave diverging lenses,
   * dashed construction line from lensHit (0, heightYCm) back to virtual focus (fCm, 0)).
   */
  backwardExtensionEnd: { xCm: number; yCm: number } | null
  /**
   * Ray-specific deflection angle in degrees at height y = heightYCm.
   * Note: In a paraxial lens, deflection angle depends on ray height y (tan theta = |y / f|);
   * it is not an intrinsic constant of the lens independent of ray height.
   */
  deflectionAngleDeg: number
}

export interface LensPowerModelResult {
  /** Signed focal length in centimetres */
  focalLengthCm: number
  /** Unsigned focal length distance |f| in centimetres */
  absFocalLengthCm: number
  /** Signed focal length converted to metres: f_m = f_cm / 100 */
  focalLengthMetres: number
  /** Optical power in dioptres: P = 1 / f_m = 100 / f_cm */
  powerDioptres: number
  /** Unsigned magnitude of power |P| in dioptres */
  absPowerDioptres: number
  /** Common student misconception value when forgetting cm -> m conversion: 1 / f_cm */
  unconvertedCmTrapPower: number
  /** Converging (convex, f > 0, P > 0) or diverging (concave, f < 0, P < 0) */
  lensNature: ThinLensNature
  /** Principal focus coordinate on the optical axis where parallel rays meet or appear to diverge from */
  principalFocusPoint: { xCm: number; yCm: number; label: 'F₂' | 'F₁' }
  /** 5 parallel incident rays and their refracted/virtual paths across the bench */
  parallelRays: readonly ParallelRayGeometry[]
}

export interface RulerMeasurementComparison {
  /** Learner's current ruler cursor position in centimetres from O */
  rulerPositionCm: number
  /** Learner's ruler position converted to metres */
  rulerPositionMetres: number
  /** Optical power calculated from the learner's ruler position (null if ruler is at 0 cm) */
  measuredPowerDioptres: number | null
  /** True configured lens focal length in cm */
  trueFocalLengthCm: number
  /** True configured lens power in dioptres */
  truePowerDioptres: number
  /** Signed measurement error (rulerPositionCm - trueFocalLengthCm) in cm */
  measurementErrorCm: number
  /** True when the learner's ruler is within 1.0 cm of the principal focus */
  isAlignedWithFocus: boolean
  /** Clear diagnostic message distinguishing the ruler reading from the lens's true focal length */
  statusMessage: string
}

export const LENS_POWER_LIMITS = {
  absFocalLengthCm: {
    min: 10,
    max: 50,
    step: 5,
  },
  rulerCm: {
    min: -50,
    max: 50,
    step: 1,
  },
} as const

/**
 * Symmetric SVG coordinate mapping for the 880x380 optical bench diagram.
 * - Optical centre O(0, 0) is placed at the exact horizontal midpoint ORIGIN_X = 440 px.
 * - PX_PER_CM = 7.2 maps the calibrated [-50 cm, +50 cm] ruler to [80 px, 800 px],
 *   leaving 80 px of visual padding beyond both endpoints so focus markers, labels,
 *   and the 124px-wide caliper badge remain completely inside [0, 880].
 */
export const BENCH_SVG_GEOMETRY = {
  SVG_W: 880,
  SVG_H: 380,
  ORIGIN_X: 440,
  ORIGIN_Y: 185,
  PX_PER_CM: 7.2,
  Y_PX_PER_CM: 14.2,
  RULER_MIN_CM: -50,
  RULER_MAX_CM: 50,
  RULER_BAR_LEFT_CM: -52,
  RULER_BAR_RIGHT_CM: 52,
  toSvgX(xCm: number): number {
    return 440 + xCm * 7.2
  },
  toSvgY(yCm: number): number {
    return 185 - yCm * 14.2
  },
} as const

export interface LensPowerValidationResult {
  isValid: boolean
  errorMessage: string | null
  parsedFocalLengthCm: number | null
}

/**
 * Validates raw numeric or string focal length input in cm.
 * Never silently clamps out-of-range or zero inputs.
 */
export function validateFocalLengthCmInput(
  raw: string | number,
  expectedSign?: '+' | '-'
): LensPowerValidationResult {
  const str = typeof raw === 'number' ? String(raw) : raw.trim()
  if (str.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Enter a focal length in centimetres (for example, 20 or 25).',
      parsedFocalLengthCm: null,
    }
  }

  const num = Number(str)
  if (!Number.isFinite(num)) {
    return {
      isValid: false,
      errorMessage: 'Focal length must be a valid finite number in cm.',
      parsedFocalLengthCm: null,
    }
  }

  if (Math.abs(num) < 1e-6) {
    return {
      isValid: false,
      errorMessage:
        'Focal length f cannot be 0 cm (division by zero in P = 1/f is physically undefined).',
      parsedFocalLengthCm: null,
    }
  }

  if (expectedSign === '+' && num < 0) {
    return {
      isValid: false,
      errorMessage: 'A converging (convex) lens has a positive focal length (+f).',
      parsedFocalLengthCm: null,
    }
  }

  if (expectedSign === '-' && num > 0) {
    return {
      isValid: false,
      errorMessage: 'A diverging (concave) lens has a negative focal length (−f).',
      parsedFocalLengthCm: null,
    }
  }

  const absVal = Math.abs(num)
  const { min, max } = LENS_POWER_LIMITS.absFocalLengthCm
  if (absVal < min || absVal > max) {
    return {
      isValid: false,
      errorMessage: `Keep |f| between ${min} cm and ${max} cm so the principal focus stays on the optical bench.`,
      parsedFocalLengthCm: null,
    }
  }

  return {
    isValid: true,
    errorMessage: null,
    parsedFocalLengthCm: num,
  }
}

const RAY_HEIGHTS_CM: readonly number[] = [6, 3, 0, -3, -6]
const INCIDENT_START_X_CM = -52
const MAX_REFRACTED_X_CM = 52
const MAX_CORRIDOR_ABS_Y_CM = 7.6

/**
 * Computes exact thin-lens optical power, metre conversion, and paraxial parallel ray geometry.
 * Refracted rays are cleanly bounded within the optical corridor (|y| <= 7.6 cm, x <= 52 cm)
 * so rays never clip into top headers or the bottom bench ruler.
 */
export function calculateLensPowerModel(input: LensPowerModelInput): LensPowerModelResult {
  const { focalLengthCm } = input
  if (!Number.isFinite(focalLengthCm) || Math.abs(focalLengthCm) < 1e-6) {
    throw new Error('focalLengthCm must be a non-zero finite number.')
  }

  const fCm = Number(focalLengthCm.toFixed(4))
  const absFCm = Math.abs(fCm)
  const fMetres = Number((fCm / 100).toFixed(6))
  const powerD = Number((100 / fCm).toFixed(4))
  const absPowerD = Math.abs(powerD)
  const trapPower = Number((1 / fCm).toFixed(6))
  const lensNature: ThinLensNature = fCm > 0 ? 'converging' : 'diverging'

  const principalFocusPoint = {
    xCm: fCm,
    yCm: 0,
    label: (fCm > 0 ? 'F₂' : 'F₁') as 'F₂' | 'F₁',
  }

  const parallelRays: ParallelRayGeometry[] = RAY_HEIGHTS_CM.map((y0) => {
    const incidentStart = { xCm: INCIDENT_START_X_CM, yCm: y0 }
    const lensHit = { xCm: 0, yCm: y0 }

    // Slope of refracted ray: m = -y0 / fCm
    const slope = -y0 / fCm
    let endX = MAX_REFRACTED_X_CM
    let endY = y0 + slope * endX

    if (Math.abs(endY) > MAX_CORRIDOR_ABS_Y_CM && Math.abs(slope) > 1e-9) {
      const targetY = endY > 0 ? MAX_CORRIDOR_ABS_Y_CM : -MAX_CORRIDOR_ABS_Y_CM
      const candidateX = (targetY - y0) / slope
      if (candidateX > 0 && candidateX < MAX_REFRACTED_X_CM) {
        endX = Number(candidateX.toFixed(4))
        endY = Number(targetY.toFixed(4))
      }
    } else {
      endY = Number(endY.toFixed(4))
    }

    const refractedEnd = { xCm: endX, yCm: endY }

    const backwardExtensionEnd =
      lensNature === 'diverging' && Math.abs(y0) > 1e-6
        ? { xCm: fCm, yCm: 0 }
        : null

    const deflectionRad = Math.atan(Math.abs(slope))
    const deflectionAngleDeg = Number(((deflectionRad * 180) / Math.PI).toFixed(2))

    return {
      heightYCm: y0,
      incidentStart,
      lensHit,
      refractedEnd,
      backwardExtensionEnd,
      deflectionAngleDeg,
    }
  })

  return {
    focalLengthCm: fCm,
    absFocalLengthCm: absFCm,
    focalLengthMetres: fMetres,
    powerDioptres: powerD,
    absPowerDioptres: absPowerD,
    unconvertedCmTrapPower: trapPower,
    lensNature,
    principalFocusPoint,
    parallelRays,
  }
}

export function formatSignedValue(val: number, decimals = 2): string {
  const rounded = Number(val.toFixed(decimals))
  if (Object.is(rounded, -0) || Math.abs(rounded) < 1e-9) return '0'
  return rounded > 0 ? `+${rounded}` : `${rounded}`
}

/**
 * Compares the learner's current ruler caliper reading against the lens's true focal point.
 * Ensures the interface never conflates an unaligned ruler handle with the lens's focal length.
 */
export function evaluateRulerMeasurement(
  rulerCursorCm: number,
  model: LensPowerModelResult
): RulerMeasurementComparison {
  const posCm = Number(rulerCursorCm.toFixed(1))
  const posM = Number((posCm / 100).toFixed(4))
  const measuredP = Math.abs(posCm) < 0.5 ? null : Number((100 / posCm).toFixed(2))
  const errCm = Number((posCm - model.focalLengthCm).toFixed(1))
  const isAligned = Math.abs(errCm) <= 1.0

  let statusMessage: string
  if (isAligned) {
    statusMessage = `Ruler aligned with principal focus ${model.principalFocusPoint.label} at ${formatSignedValue(
      model.focalLengthCm,
      0
    )} cm (${formatSignedValue(model.focalLengthMetres, 2)} m) → Power P = ${formatSignedValue(
      model.powerDioptres,
      2
    )} D.`
  } else if (Math.abs(posCm) < 0.5) {
    statusMessage = `Ruler is at the optical centre O (0 cm). Move the caliper to ${model.principalFocusPoint.label} (${formatSignedValue(
      model.focalLengthCm,
      0
    )} cm) where the rays meet the axis.`
  } else {
    statusMessage = `Ruler is at ${formatSignedValue(
      posCm,
      0
    )} cm (off by ${formatSignedValue(
      errCm,
      0
    )} cm). Align the caliper with ${model.principalFocusPoint.label} (${formatSignedValue(
      model.focalLengthCm,
      0
    )} cm)—an unaligned ruler position is not the focal length.`
  }

  return {
    rulerPositionCm: posCm,
    rulerPositionMetres: posM,
    measuredPowerDioptres: measuredP,
    trueFocalLengthCm: model.focalLengthCm,
    truePowerDioptres: model.powerDioptres,
    measurementErrorCm: errCm,
    isAlignedWithFocus: isAligned,
    statusMessage,
  }
}
