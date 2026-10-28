/**
 * Pure TypeScript Scientific Model: Ideal Thin Convex Lens (Class 10 Optics)
 *
 * Sign Convention (NCERT New Cartesian Sign Convention):
 * - Optical centre O is at origin (0, 0).
 * - Object is placed to the left of the lens; incident light travels left-to-right (+x).
 * - Object coordinate u = -objectDistanceCm < 0.
 * - Convex lens principal focal length f = +focalLengthCm > 0.
 * - Thin-lens equation: 1/v - 1/u = 1/f  =>  v = (u * f) / (u + f).
 * - Linear magnification: m = h' / h = v / u.
 * - Optical power in dioptres: P = 100 / f_cm (D).
 *
 * Zero React, DOM, or rendering imports.
 */

export const FOCAL_BOUNDARY_EPSILON_CM = 1e-6
export const TWO_F_BOUNDARY_EPSILON_CM = 1e-5
export const SHARP_SCREEN_TOLERANCE_CM = 0.5

export type LensObjectRegime =
  | 'beyond_2f'
  | 'at_2f'
  | 'between_f_and_2f'
  | 'at_f'
  | 'within_f'

export type LensImageNature = 'real_inverted' | 'virtual_erect' | 'at_infinity'

export type LensRelativeSize =
  | 'diminished'
  | 'same_size'
  | 'enlarged'
  | 'infinitely_large'

export interface Point2DCm {
  xCm: number
  yCm: number
}

export interface PrincipalRayPath {
  incidentStart: Point2DCm
  lensHit: Point2DCm
  refractedEnd: Point2DCm
  virtualExtensionEnd: Point2DCm | null
}

export interface ScreenRayIntersections {
  screenXCm: number
  ray1YCm: number
  ray2YCm: number
  ray3YCm: number | null
  beamCenterYCm: number
  beamSpreadCm: number
}

export interface ConvexLensPrincipalRays {
  objectBase: Point2DCm
  objectTip: Point2DCm
  imageBase: Point2DCm | null
  imageTip: Point2DCm | null
  /** Ray 1: Parallel to principal axis -> refracts through secondary focus F2(+f, 0) */
  ray1ParallelToF2: PrincipalRayPath
  /** Ray 2: Passes through optical centre O(0, 0) undeviated */
  ray2ThroughOpticalCentre: PrincipalRayPath
  /** Ray 3: Passes through (or directed from) primary focus F1(-f, 0) -> refracts parallel to axis (null when object is at F1) */
  ray3ThroughF1ToParallel: PrincipalRayPath | null
  /** Exact intersections of refracted rays with the movable screen at x = +screenDistanceCm */
  screenIntersections: ScreenRayIntersections
}

export interface ConvexLensInput {
  /** Focal length f of the convex lens in cm (must be finite and > 0) */
  focalLengthCm: number
  /** Unsigned ruler distance |u| of the object to the left of O in cm (must be finite and > 0) */
  objectDistanceCm: number
  /** Upright object height h_o in cm (must be finite and > 0) */
  objectHeightCm: number
  /** Distance d_s of the movable projection screen to the right of O in cm (must be finite and > 0) */
  screenDistanceCm: number
}

export interface ConvexLensResult {
  focalLengthCm: number
  objectDistanceCm: number
  objectHeightCm: number
  screenDistanceCm: number
  /** Signed Cartesian object position u = -objectDistanceCm (< 0) */
  uCm: number
  /** Signed Cartesian focal length f = +focalLengthCm (> 0) */
  fCm: number
  /** Signed Cartesian image position v in cm (> 0 real on right, < 0 virtual on left, null at focus) */
  vCm: number | null
  /** Unsigned image distance |v| in cm (null at focus) */
  imageDistanceCm: number | null
  /** Signed image height h' = m * h_o in cm (< 0 inverted, > 0 erect, null at focus) */
  imageHeightCm: number | null
  /** Linear magnification m = v / u = h' / h_o (null at focus) */
  magnification: number | null
  /** Optical power P = 100 / f_cm in dioptres (D) */
  opticalPowerDioptre: number
  /** True when |objectDistanceCm - focalLengthCm| <= FOCAL_BOUNDARY_EPSILON_CM */
  isAtFocus: boolean
  /** NCERT Class 10 Table 9.4 object position regime */
  regime: LensObjectRegime
  /** Nature of image: real_inverted, virtual_erect, or at_infinity */
  imageNature: LensImageNature
  /** Relative size compared to object */
  relativeSize: LensRelativeSize
  /** Human-readable NCERT Table 9.4 object position label */
  objectPositionLabel: string
  /** Human-readable NCERT Table 9.4 image position label */
  imagePositionLabel: string
  /** True iff the image is real (v > 0) and can be caught on a physical screen */
  canCatchOnScreen: boolean
  /** Signed offset (screenDistanceCm - vCm) when image is real, else null */
  screenOffsetFromImageCm: number | null
  /** True when image is real and the screen is within SHARP_SCREEN_TOLERANCE_CM of vCm */
  isSharpOnScreen: boolean
  /** Normalized blur [0..1] on the movable screen (0 = crisp focus, 1 = completely blurred/unfocused) */
  screenBlurFraction: number
  /** Effective height of the projected image on the screen when real, else null */
  screenProjectedHeightCm: number | null
  /** Student-friendly explanation of what appears on the movable screen right now */
  screenStatusText: string
  /** Consistent geometric coordinates for the 3 principal rays and screen intersections */
  rays: ConvexLensPrincipalRays
}

export class ConvexLensValidationError extends Error {
  public readonly field: keyof ConvexLensInput

  constructor(field: keyof ConvexLensInput, message: string) {
    super(message)
    this.name = 'ConvexLensValidationError'
    this.field = field
  }
}

export function validateConvexLensInput(input: ConvexLensInput): void {
  const { focalLengthCm, objectDistanceCm, objectHeightCm, screenDistanceCm } = input

  if (typeof focalLengthCm !== 'number' || !Number.isFinite(focalLengthCm)) {
    throw new ConvexLensValidationError(
      'focalLengthCm',
      'Focal length (f) must be a finite number in cm.'
    )
  }
  if (focalLengthCm <= 0) {
    throw new ConvexLensValidationError(
      'focalLengthCm',
      'Convex lens focal length (f) must be greater than 0 cm.'
    )
  }

  if (typeof objectDistanceCm !== 'number' || !Number.isFinite(objectDistanceCm)) {
    throw new ConvexLensValidationError(
      'objectDistanceCm',
      'Object distance (|u|) must be a finite number in cm.'
    )
  }
  if (objectDistanceCm <= 0) {
    throw new ConvexLensValidationError(
      'objectDistanceCm',
      'Object distance (|u|) must be greater than 0 cm (placed to the left of the lens).'
    )
  }

  if (typeof objectHeightCm !== 'number' || !Number.isFinite(objectHeightCm)) {
    throw new ConvexLensValidationError(
      'objectHeightCm',
      'Object height (h) must be a finite number in cm.'
    )
  }
  if (objectHeightCm <= 0) {
    throw new ConvexLensValidationError(
      'objectHeightCm',
      'Object height (h) must be greater than 0 cm.'
    )
  }

  if (typeof screenDistanceCm !== 'number' || !Number.isFinite(screenDistanceCm)) {
    throw new ConvexLensValidationError(
      'screenDistanceCm',
      'Screen distance must be a finite number in cm.'
    )
  }
  if (screenDistanceCm <= 0) {
    throw new ConvexLensValidationError(
      'screenDistanceCm',
      'Screen distance must be greater than 0 cm (on the right side of the lens).'
    )
  }
}

/**
 * Evaluates y(x) along a ray passing through (0, lensY) with given slope dy/dx.
 */
function evaluateRayAtX(lensYCm: number, slope: number, xCm: number): number {
  return lensYCm + slope * xCm
}

export function calculateConvexLens(input: ConvexLensInput): ConvexLensResult {
  validateConvexLensInput(input)

  const { focalLengthCm, objectDistanceCm, objectHeightCm, screenDistanceCm } = input
  const uCm = -objectDistanceCm
  const fCm = focalLengthCm
  const opticalPowerDioptre = 100 / fCm

  const denominator = uCm + fCm // f - d_o
  const isAtFocus = Math.abs(denominator) <= FOCAL_BOUNDARY_EPSILON_CM
  const twoFCm = 2 * fCm

  // Principal Ray 1: Parallel to axis from (u, h_o) to (0, h_o), then through F2(f, 0)
  // Slope for x >= 0 is s1 = (0 - h_o) / (f - 0) = -h_o / f
  const slope1 = -objectHeightCm / fCm

  // Principal Ray 2: Through O(0, 0) undeviated from (u, h_o)
  // Slope for all x is s2 = (0 - h_o) / (0 - u) = h_o / u  (< 0 since u < 0)
  const slope2 = objectHeightCm / uCm

  const objectBase: Point2DCm = { xCm: uCm, yCm: 0 }
  const objectTip: Point2DCm = { xCm: uCm, yCm: objectHeightCm }

  if (isAtFocus) {
    // Focal boundary: u = -f => refracted rays 1 and 2 emerge strictly parallel (slope1 === slope2 === -h_o/f)
    const farXCm = Math.max(screenDistanceCm + 20, 4 * fCm, 80)
    const backXCm = -Math.max(2.5 * fCm, 50)

    const ray1YAtScreen = evaluateRayAtX(objectHeightCm, slope1, screenDistanceCm)
    const ray2YAtScreen = evaluateRayAtX(0, slope2, screenDistanceCm)
    const beamCenterYCm = 0.5 * (ray1YAtScreen + ray2YAtScreen)
    const beamSpreadCm = Math.abs(ray1YAtScreen - ray2YAtScreen)

    const rays: ConvexLensPrincipalRays = {
      objectBase,
      objectTip,
      imageBase: null,
      imageTip: null,
      ray1ParallelToF2: {
        incidentStart: objectTip,
        lensHit: { xCm: 0, yCm: objectHeightCm },
        refractedEnd: {
          xCm: farXCm,
          yCm: evaluateRayAtX(objectHeightCm, slope1, farXCm),
        },
        virtualExtensionEnd: {
          xCm: backXCm,
          yCm: evaluateRayAtX(objectHeightCm, slope1, backXCm),
        },
      },
      ray2ThroughOpticalCentre: {
        incidentStart: objectTip,
        lensHit: { xCm: 0, yCm: 0 },
        refractedEnd: {
          xCm: farXCm,
          yCm: evaluateRayAtX(0, slope2, farXCm),
        },
        virtualExtensionEnd: {
          xCm: backXCm,
          yCm: evaluateRayAtX(0, slope2, backXCm),
        },
      },
      ray3ThroughF1ToParallel: null,
      screenIntersections: {
        screenXCm: screenDistanceCm,
        ray1YCm: ray1YAtScreen,
        ray2YCm: ray2YAtScreen,
        ray3YCm: null,
        beamCenterYCm,
        beamSpreadCm,
      },
    }

    return {
      focalLengthCm,
      objectDistanceCm,
      objectHeightCm,
      screenDistanceCm,
      uCm,
      fCm,
      vCm: null,
      imageDistanceCm: null,
      imageHeightCm: null,
      magnification: null,
      opticalPowerDioptre,
      isAtFocus: true,
      regime: 'at_f',
      imageNature: 'at_infinity',
      relativeSize: 'infinitely_large',
      objectPositionLabel: 'At focus F₁ (|u| = f)',
      imagePositionLabel: 'At infinity (refracted rays emerge parallel)',
      canCatchOnScreen: false,
      screenOffsetFromImageCm: null,
      isSharpOnScreen: false,
      screenBlurFraction: 1,
      screenProjectedHeightCm: null,
      screenStatusText:
        'Object is at principal focus F₁: refracted rays emerge parallel and never converge on the screen at any finite distance.',
      rays,
    }
  }

  // Non-focal positions: exact thin-lens formula v = (u * f) / (u + f)
  const vCm = (uCm * fCm) / denominator
  const imageDistanceCm = Math.abs(vCm)
  const magnification = vCm / uCm
  const imageHeightCm = magnification * objectHeightCm

  // Principal Ray 3: Line through objectTip(u, h_o) and primary focus F1(-f, 0)
  // Hits lens x = 0 at y = imageHeightCm, then emerges parallel to principal axis (slope = 0)
  const lensHit3YCm = imageHeightCm
  const slope3Refracted = 0

  // Classify regime, nature, and relative size according to NCERT Table 9.4
  let regime: LensObjectRegime
  let imageNature: LensImageNature
  let relativeSize: LensRelativeSize
  let objectPositionLabel: string
  let imagePositionLabel: string

  if (objectDistanceCm < fCm) {
    regime = 'within_f'
    imageNature = 'virtual_erect'
    relativeSize = 'enlarged'
    objectPositionLabel = 'Between focus F₁ and optical centre O (|u| < f)'
    imagePositionLabel = 'On the same side of the lens as the object (virtual, v < 0)'
  } else if (Math.abs(objectDistanceCm - twoFCm) <= TWO_F_BOUNDARY_EPSILON_CM) {
    regime = 'at_2f'
    imageNature = 'real_inverted'
    relativeSize = 'same_size'
    objectPositionLabel = 'At 2F₁ (|u| = 2f)'
    imagePositionLabel = 'At 2F₂ on the other side (v = +2f)'
  } else if (objectDistanceCm > twoFCm) {
    regime = 'beyond_2f'
    imageNature = 'real_inverted'
    relativeSize = 'diminished'
    objectPositionLabel = 'Beyond 2F₁ (|u| > 2f)'
    imagePositionLabel = 'Between F₂ and 2F₂ on the other side (f < v < 2f)'
  } else {
    regime = 'between_f_and_2f'
    imageNature = 'real_inverted'
    relativeSize = 'enlarged'
    objectPositionLabel = 'Between F₁ and 2F₁ (f < |u| < 2f)'
    imagePositionLabel = 'Beyond 2F₂ on the other side (v > 2f)'
  }

  const canCatchOnScreen = imageNature === 'real_inverted'

  // Screen intersections at x = +screenDistanceCm
  const ray1YAtScreen = evaluateRayAtX(objectHeightCm, slope1, screenDistanceCm)
  const ray2YAtScreen = evaluateRayAtX(0, slope2, screenDistanceCm)
  const ray3YAtScreen = evaluateRayAtX(lensHit3YCm, slope3Refracted, screenDistanceCm)
  const minRayY = Math.min(ray1YAtScreen, ray2YAtScreen, ray3YAtScreen)
  const maxRayY = Math.max(ray1YAtScreen, ray2YAtScreen, ray3YAtScreen)
  const beamCenterYCm = 0.5 * (minRayY + maxRayY)
  const beamSpreadCm = maxRayY - minRayY

  let screenOffsetFromImageCm: number | null = null
  let isSharpOnScreen = false
  let screenBlurFraction = 1
  let screenProjectedHeightCm: number | null = null
  let screenStatusText: string

  if (canCatchOnScreen && vCm > 0) {
    screenOffsetFromImageCm = screenDistanceCm - vCm
    const absDiff = Math.abs(screenOffsetFromImageCm)
    isSharpOnScreen = absDiff <= SHARP_SCREEN_TOLERANCE_CM
    screenBlurFraction = isSharpOnScreen
      ? 0
      : Math.min(1, absDiff / Math.max(12, 0.65 * vCm))
    screenProjectedHeightCm = imageHeightCm * (screenDistanceCm / vCm)

    if (isSharpOnScreen) {
      screenStatusText = `Sharp real, inverted image caught on screen at v = +${Number(vCm.toFixed(1))} cm!`
    } else if (screenOffsetFromImageCm < 0) {
      screenStatusText = `Blurred patch on screen: screen (${Number(screenDistanceCm.toFixed(1))} cm) is in front of the convergence point (v = +${Number(vCm.toFixed(1))} cm). Move screen right to focus.`
    } else {
      screenStatusText = `Blurred patch on screen: rays already crossed at v = +${Number(vCm.toFixed(1))} cm before hitting the screen (${Number(screenDistanceCm.toFixed(1))} cm). Move screen left to focus.`
    }
  } else {
    screenStatusText =
      'No image caught on screen: because |u| < f, refracted rays diverge on the right side. The upright enlarged image is virtual (v < 0) and can only be seen by looking through the lens.'
  }

  // Ray endpoints for rendering
  const farRightXCm = Math.max(
    screenDistanceCm + 15,
    vCm > 0 ? vCm + 18 : 3 * fCm,
    3.2 * fCm
  )
  const virtualExtXCm = vCm < 0 ? vCm : null

  const imageBase: Point2DCm = { xCm: vCm, yCm: 0 }
  const imageTip: Point2DCm = { xCm: vCm, yCm: imageHeightCm }

  const rays: ConvexLensPrincipalRays = {
    objectBase,
    objectTip,
    imageBase,
    imageTip,
    ray1ParallelToF2: {
      incidentStart: objectTip,
      lensHit: { xCm: 0, yCm: objectHeightCm },
      refractedEnd: {
        xCm: farRightXCm,
        yCm: evaluateRayAtX(objectHeightCm, slope1, farRightXCm),
      },
      virtualExtensionEnd:
        virtualExtXCm !== null
          ? {
              xCm: virtualExtXCm,
              yCm: evaluateRayAtX(objectHeightCm, slope1, virtualExtXCm),
            }
          : null,
    },
    ray2ThroughOpticalCentre: {
      incidentStart: objectTip,
      lensHit: { xCm: 0, yCm: 0 },
      refractedEnd: {
        xCm: farRightXCm,
        yCm: evaluateRayAtX(0, slope2, farRightXCm),
      },
      virtualExtensionEnd:
        virtualExtXCm !== null
          ? {
              xCm: virtualExtXCm,
              yCm: evaluateRayAtX(0, slope2, virtualExtXCm),
            }
          : null,
    },
    ray3ThroughF1ToParallel: {
      incidentStart: objectTip,
      lensHit: { xCm: 0, yCm: lensHit3YCm },
      refractedEnd: {
        xCm: farRightXCm,
        yCm: lensHit3YCm,
      },
      virtualExtensionEnd:
        virtualExtXCm !== null
          ? {
              xCm: virtualExtXCm,
              yCm: lensHit3YCm,
            }
          : null,
    },
    screenIntersections: {
      screenXCm: screenDistanceCm,
      ray1YCm: ray1YAtScreen,
      ray2YCm: ray2YAtScreen,
      ray3YCm: ray3YAtScreen,
      beamCenterYCm,
      beamSpreadCm,
    },
  }

  return {
    focalLengthCm,
    objectDistanceCm,
    objectHeightCm,
    screenDistanceCm,
    uCm,
    fCm,
    vCm,
    imageDistanceCm,
    imageHeightCm,
    magnification,
    opticalPowerDioptre,
    isAtFocus: false,
    regime,
    imageNature,
    relativeSize,
    objectPositionLabel,
    imagePositionLabel,
    canCatchOnScreen,
    screenOffsetFromImageCm,
    isSharpOnScreen,
    screenBlurFraction,
    screenProjectedHeightCm,
    screenStatusText,
    rays,
  }
}
