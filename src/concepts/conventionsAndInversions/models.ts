export type OpticalDeviceType = 'convex-lens' | 'concave-lens' | 'concave-mirror' | 'convex-mirror'

export interface CartesianSignResult {
  device: OpticalDeviceType
  objectDistanceU: number // always negative in cm (e.g. -20)
  focalLengthF: number // + for convex lens / convex mirror; - for concave lens / concave mirror
  imageDistanceV: number // cm (+ or - or Infinity)
  magnificationM: number // m = v/u (lens) or -v/u (mirror)
  isReal: boolean
  isErect: boolean
  imageSizeCategory: 'diminished' | 'same-size' | 'magnified' | 'at-infinity'
}

/**
 * Symmetric SVG coordinate mapping for the Optics Ray Bench (`OpticsRayBenchSVG`).
 * Maps `[-60 cm, +60 cm]` to `[80 px, 800 px]` inside `viewBox="0 0 880 340"`
 * with 80 px visual padding on both sides so object/image arrows and labels stay unclipped.
 */
export const OPTICS_RAY_BENCH_GEOMETRY = {
  SVG_W: 880,
  SVG_H: 340,
  ORIGIN_X: 440,
  ORIGIN_Y: 175,
  PX_PER_CM: 6.0,
  Y_PX_PER_CM: 12.0,
  RULER_MIN_CM: -60,
  RULER_MAX_CM: 60,
  OBJECT_HEIGHT_CM: 3.5,
  toSvgX(cm: number): number {
    return 440 + cm * 6.0
  },
  toSvgY(cm: number): number {
    return 175 - cm * 12.0
  },
} as const

export interface RaySegment2D {
  x1Cm: number
  y1Cm: number
  x2Cm: number
  y2Cm: number
  kind: 'incident' | 'transmitted-or-reflected' | 'virtual-extension'
}

export interface PrincipalRayDiagram {
  state: CartesianSignResult
  objectHeightCm: number
  imageHeightCm: number
  clampedImageXCm: number | null
  isImageWithinBench: boolean
  segments: readonly RaySegment2D[]
}

export function calculateOpticalState(
  device: OpticalDeviceType,
  absObjectDistanceCm: number,
  absFocalLengthCm: number
): CartesianSignResult {
  const absU = Math.max(2, absObjectDistanceCm)
  const absF = Math.max(5, absFocalLengthCm)

  const u = -absU
  const isPositiveFocus = device === 'convex-lens' || device === 'convex-mirror'
  const f = isPositiveFocus ? absF : -absF

  const isLens = device === 'convex-lens' || device === 'concave-lens'

  // Lens formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u
  // Mirror formula: 1/v + 1/u = 1/f => 1/v = 1/f - 1/u
  const invV = isLens ? 1 / f + 1 / u : 1 / f - 1 / u

  if (Math.abs(invV) < 1e-6) {
    return {
      device,
      objectDistanceU: u,
      focalLengthF: f,
      imageDistanceV: Infinity,
      magnificationM: Infinity,
      isReal: true,
      isErect: false,
      imageSizeCategory: 'at-infinity',
    }
  }

  const v = Number((1 / invV).toFixed(2))
  // Lens: m = v / u; Mirror: m = -v / u
  const m = Number((isLens ? v / u : -v / u).toFixed(2))

  // For lens: v > 0 means real (right side); v < 0 means virtual (left side)
  // For mirror: v < 0 means real (in front); v > 0 means virtual (behind)
  const isReal = isLens ? v > 0 : v < 0
  const isErect = m > 0

  const absM = Math.abs(m)
  let imageSizeCategory: 'diminished' | 'same-size' | 'magnified' = 'diminished'
  if (Math.abs(absM - 1) < 0.05) {
    imageSizeCategory = 'same-size'
  } else if (absM > 1) {
    imageSizeCategory = 'magnified'
  }

  return {
    device,
    objectDistanceU: u,
    focalLengthF: f,
    imageDistanceV: v,
    magnificationM: m,
    isReal,
    isErect,
    imageSizeCategory,
  }
}

/**
 * Computes two NCERT principal rays (parallel to axis + through optical centre / pole)
 * and any virtual backward extensions for the 4 spherical optical devices.
 */
export function computePrincipalRays(
  device: OpticalDeviceType,
  absObjectDistanceCm: number,
  absFocalLengthCm: number,
  objectHeightCm: number = OPTICS_RAY_BENCH_GEOMETRY.OBJECT_HEIGHT_CM
): PrincipalRayDiagram {
  const state = calculateOpticalState(device, absObjectDistanceCm, absFocalLengthCm)
  const u = state.objectDistanceU
  const f = state.focalLengthF
  const v = state.imageDistanceV
  const isLens = device === 'convex-lens' || device === 'concave-lens'
  const hO = objectHeightCm
  const hI =
    v === Infinity ? Infinity : Number(Math.max(-9.5, Math.min(9.5, state.magnificationM * hO)).toFixed(2))

  const segments: RaySegment2D[] = [
    // Incident Ray 1: Parallel to principal axis from object tip (u, hO) to (0, hO)
    { x1Cm: u, y1Cm: hO, x2Cm: 0, y2Cm: hO, kind: 'incident' },
    // Incident Ray 2: From object tip (u, hO) to optical centre / pole (0, 0)
    { x1Cm: u, y1Cm: hO, x2Cm: 0, y2Cm: 0, kind: 'incident' },
  ]

  if (v === Infinity) {
    // Object at focus F of convex lens or concave mirror -> parallel outgoing rays
    if (isLens) {
      const slope = -hO / f
      segments.push({
        x1Cm: 0,
        y1Cm: hO,
        x2Cm: 58,
        y2Cm: hO + slope * 58,
        kind: 'transmitted-or-reflected',
      })
      segments.push({
        x1Cm: 0,
        y1Cm: 0,
        x2Cm: 58,
        y2Cm: slope * 58,
        kind: 'transmitted-or-reflected',
      })
    } else {
      const slope = hO / f
      segments.push({
        x1Cm: 0,
        y1Cm: hO,
        x2Cm: -58,
        y2Cm: hO + slope * -58,
        kind: 'transmitted-or-reflected',
      })
      segments.push({
        x1Cm: 0,
        y1Cm: 0,
        x2Cm: -58,
        y2Cm: slope * -58,
        kind: 'transmitted-or-reflected',
      })
    }
    return {
      state,
      objectHeightCm: hO,
      imageHeightCm: Infinity,
      clampedImageXCm: null,
      isImageWithinBench: false,
      segments,
    }
  }

  const rawImageY = state.magnificationM * hO
  const isImageWithinBench =
    v >= OPTICS_RAY_BENCH_GEOMETRY.RULER_MIN_CM && v <= OPTICS_RAY_BENCH_GEOMETRY.RULER_MAX_CM
  const clampedImageXCm = Math.max(
    OPTICS_RAY_BENCH_GEOMETRY.RULER_MIN_CM,
    Math.min(OPTICS_RAY_BENCH_GEOMETRY.RULER_MAX_CM, v)
  )

  if (isLens) {
    // Transmitted rays travel to the right (x > 0)
    const slope1 = -hO / f // passes through (f, 0)
    const slope2 = hO / u // undeviated through (0, 0)
    const xRight = Math.max(58, isImageWithinBench && v > 0 ? v : 58)
    segments.push({
      x1Cm: 0,
      y1Cm: hO,
      x2Cm: Math.min(60, xRight),
      y2Cm: hO + slope1 * Math.min(60, xRight),
      kind: 'transmitted-or-reflected',
    })
    segments.push({
      x1Cm: 0,
      y1Cm: 0,
      x2Cm: Math.min(60, xRight),
      y2Cm: slope2 * Math.min(60, xRight),
      kind: 'transmitted-or-reflected',
    })

    if (!state.isReal) {
      // Virtual image on the left (v < 0): dashed backward extensions to (v, rawImageY)
      segments.push({
        x1Cm: 0,
        y1Cm: hO,
        x2Cm: clampedImageXCm,
        y2Cm: rawImageY,
        kind: 'virtual-extension',
      })
      segments.push({
        x1Cm: 0,
        y1Cm: 0,
        x2Cm: clampedImageXCm,
        y2Cm: rawImageY,
        kind: 'virtual-extension',
      })
    }
  } else {
    // Mirror: reflected rays travel to the left (x < 0)
    const slope1 = hO / f // reflects through (f, 0)
    const slope2 = -hO / u // symmetric reflection at pole (0, 0)
    segments.push({
      x1Cm: 0,
      y1Cm: hO,
      x2Cm: -58,
      y2Cm: hO + slope1 * -58,
      kind: 'transmitted-or-reflected',
    })
    segments.push({
      x1Cm: 0,
      y1Cm: 0,
      x2Cm: -58,
      y2Cm: slope2 * -58,
      kind: 'transmitted-or-reflected',
    })

    if (!state.isReal) {
      // Virtual image behind the mirror (v > 0): dashed extensions to (v, rawImageY)
      segments.push({
        x1Cm: 0,
        y1Cm: hO,
        x2Cm: clampedImageXCm,
        y2Cm: rawImageY,
        kind: 'virtual-extension',
      })
      segments.push({
        x1Cm: 0,
        y1Cm: 0,
        x2Cm: clampedImageXCm,
        y2Cm: rawImageY,
        kind: 'virtual-extension',
      })
    }
  }

  return {
    state,
    objectHeightCm: hO,
    imageHeightCm: hI,
    clampedImageXCm,
    isImageWithinBench,
    segments,
  }
}

export interface LensPowerResult {
  focalLengthCm: number
  focalLengthMeters: number
  powerDioptres: number // P = 1 / f(m) = 100 / f(cm)
  wrongCmPower: number // student trap: 1 / f(cm)
  lensNature: 'converging' | 'diverging'
}

export function calculateLensPower(focalLengthCm: number): LensPowerResult {
  const safeFCm = Math.abs(focalLengthCm) < 1 ? 10 : focalLengthCm
  const fMeters = Number((safeFCm / 100).toFixed(3))
  const powerD = Number((100 / safeFCm).toFixed(2))
  const wrongD = Number((1 / safeFCm).toFixed(4))

  return {
    focalLengthCm: safeFCm,
    focalLengthMeters: fMeters,
    powerDioptres: powerD,
    wrongCmPower: wrongD,
    lensNature: safeFCm > 0 ? 'converging' : 'diverging',
  }
}

export type EyeDefectType = 'myopia' | 'hypermetropia'

export interface EyeDefectCorrectionResult {
  defectType: EyeDefectType
  defectivePointCm: number
  objectDistanceCm: number
  virtualImageDistanceCm: number
  correctiveFocalLengthCm: number
  correctivePowerDioptres: number
  requiredLensType: 'concave' | 'convex'
  uncorrectedFocusSite: 'in-front-of-retina' | 'behind-retina'
  activeFocusSite: 'on-retina' | 'in-front-of-retina' | 'behind-retina'
}

/**
 * Class 10 Human Eye (NCERT Ch 10.2):
 * - Myopia (Near-sightedness): Distant objects (u = -Infinity) focus IN FRONT OF retina.
 *   To form a virtual image at the defective far point v = -d_F (cm),
 *   1/f = 1/(-d_F) - 1/(-Infinity) => f = -d_F cm (Concave lens), Power P = -100 / d_F D.
 * - Hypermetropia (Far-sightedness): Nearby objects at normal near point (u = -25 cm) focus BEHIND retina.
 *   To form a virtual image at the receded near point v = -d_N (cm, where d_N > 25),
 *   1/f = 1/(-d_N) - 1/(-25) = (d_N - 25) / (25 * d_N) => f = +(25 * d_N) / (d_N - 25) cm (Convex lens),
 *   Power P = +100 / f D.
 */
export function calculateEyeDefectCorrection(
  defectType: EyeDefectType,
  defectivePointCm: number,
  correctionEnabled = true
): EyeDefectCorrectionResult {
  if (defectType === 'myopia') {
    const dF = Math.max(20, Math.min(400, defectivePointCm))
    const fCm = -dF
    const powerD = Number((100 / fCm).toFixed(2))
    return {
      defectType: 'myopia',
      defectivePointCm: dF,
      objectDistanceCm: -Infinity,
      virtualImageDistanceCm: -dF,
      correctiveFocalLengthCm: Number(fCm.toFixed(1)),
      correctivePowerDioptres: powerD,
      requiredLensType: 'concave',
      uncorrectedFocusSite: 'in-front-of-retina',
      activeFocusSite: correctionEnabled ? 'on-retina' : 'in-front-of-retina',
    }
  }

  // Hypermetropia: d_N must be > 25 cm (normal near point)
  const dN = Math.max(30, Math.min(300, defectivePointCm))
  const fCm = (25 * dN) / (dN - 25)
  const powerD = Number((100 / fCm).toFixed(2))

  return {
    defectType: 'hypermetropia',
    defectivePointCm: dN,
    objectDistanceCm: -25,
    virtualImageDistanceCm: -dN,
    correctiveFocalLengthCm: Number(fCm.toFixed(1)),
    correctivePowerDioptres: powerD,
    requiredLensType: 'convex',
    uncorrectedFocusSite: 'behind-retina',
    activeFocusSite: correctionEnabled ? 'on-retina' : 'behind-retina',
  }
}

export interface PrismDispersionScatteringResult {
  wavelengthNm: number
  colorBandName: 'Violet' | 'Blue' | 'Green' | 'Yellow-Orange' | 'Red'
  refractiveIndexGlass: number
  prismDeviationDeg: number
  relativeSpeedInGlassFactor: number
  rayleighScatteringRelativeToRed: number
  secondInvertedPrismEnabled: boolean
  emergentBeamState: 'dispersed-spectrum' | 'recombined-white-light'
}

/**
 * Class 10 Human Eye & Colourful World (NCERT Ch 10.3–10.6):
 * - Shorter wavelength λ (Violet ~ 400 nm) has higher refractive index n in glass,
 *   slower speed in glass (v = c/n), and bends (deviates) the MOST through a prism.
 * - Longer wavelength λ (Red ~ 700 nm) has lower refractive index n, travels fastest in glass,
 *   and bends the LEAST.
 * - Rayleigh scattering intensity scales inversely with the 4th power of wavelength:
 *   I_scat ∝ (700 / λ)^4 (Violet/Blue scatters ~9.4× to 6× more strongly than Red).
 * - Newton's second identical inverted prism cancels angular dispersion and recombines white light.
 */
export function calculatePrismDispersionScattering(
  wavelengthNm: number,
  secondInvertedPrismEnabled = false
): PrismDispersionScatteringResult {
  const safeLambda = Math.max(400, Math.min(700, wavelengthNm))
  // Normalized t in [0, 1] from 400 nm (Violet) to 700 nm (Red)
  const t = (safeLambda - 400) / 300

  let colorBandName: PrismDispersionScatteringResult['colorBandName'] = 'Green'
  if (safeLambda < 445) colorBandName = 'Violet'
  else if (safeLambda < 500) colorBandName = 'Blue'
  else if (safeLambda < 570) colorBandName = 'Green'
  else if (safeLambda < 625) colorBandName = 'Yellow-Orange'
  else colorBandName = 'Red'

  // Crown/Flint illustrative refractive index n(400nm)=1.532 down to n(700nm)=1.512
  const refractiveIndexGlass = Number((1.532 - 0.02 * t).toFixed(3))
  // Deviation angle through 60° prism: ~43.2° for Violet down to ~39.2° for Red
  const prismDeviationDeg = Number((43.2 - 4.0 * t).toFixed(1))
  const relativeSpeedInGlassFactor = Number((1 / refractiveIndexGlass).toFixed(3))
  // Rayleigh scattering ratio relative to 700 nm Red: (700 / λ)^4
  const rayleighScatteringRelativeToRed = Number(Math.pow(700 / safeLambda, 4).toFixed(2))

  return {
    wavelengthNm: safeLambda,
    colorBandName,
    refractiveIndexGlass,
    prismDeviationDeg,
    relativeSpeedInGlassFactor,
    rayleighScatteringRelativeToRed,
    secondInvertedPrismEnabled,
    emergentBeamState: secondInvertedPrismEnabled
      ? 'recombined-white-light'
      : 'dispersed-spectrum',
  }
}
