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
