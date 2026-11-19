import { tidyNumber } from '../../kit/validation'

export interface InverseAreaResult {
  areaMm2: number
  resistanceOhm: number
  relativeArea: number
  relativeResistance: number
}

/**
 * R = rho * L / A.
 * Using baseline rho*L = 1.0 (e.g. baseline at A = 1 mm² has R = 1.0 Ω).
 */
export function calculateInverseArea(areaMm2: number, baselineAreaMm2 = 1.0): InverseAreaResult {
  const safeA = Math.max(0.1, areaMm2)
  const resistanceOhm = tidyNumber(1.0 / safeA, 2)
  const relativeArea = tidyNumber(safeA / baselineAreaMm2, 2)
  const relativeResistance = tidyNumber(1.0 / relativeArea, 2)

  return {
    areaMm2: safeA,
    resistanceOhm,
    relativeArea,
    relativeResistance,
  }
}

export interface DiameterTrapResult {
  diameterMm: number
  areaMm2: number
  resistanceOhm: number
  areaFactor: number
  resistanceFactor: number
}

/**
 * Area = pi * (d/2)^2 = pi * d^2 / 4.
 * If d doubles, Area quadruples (4x), and R quarters (1/4x).
 */
export function calculateDiameterTrap(diameterMm: number, baselineDiameterMm = 1.0): DiameterTrapResult {
  const safeD = Math.max(0.1, diameterMm)
  const areaMm2 = tidyNumber((Math.PI * safeD * safeD) / 4, 3)
  const baselineArea = (Math.PI * baselineDiameterMm * baselineDiameterMm) / 4

  const areaFactor = tidyNumber(areaMm2 / baselineArea, 2)
  const resistanceFactor = tidyNumber(1.0 / areaFactor, 2)
  const resistanceOhm = tidyNumber(4.0 / areaFactor, 2) // assuming 4 Ω at d = 1 mm

  return {
    diameterMm: safeD,
    areaMm2,
    resistanceOhm,
    areaFactor,
    resistanceFactor,
  }
}

export interface VoltageSquaredResult {
  voltageV: number
  resistanceOhm: number
  currentA: number
  powerW: number
  voltageFactor: number
  powerFactor: number
}

/**
 * P = V^2 / R.
 * If V doubles, P quadruples (4x) for constant R.
 */
export function calculateVoltageSquared(voltageV: number, resistanceOhm = 6.0, baselineVoltageV = 6.0): VoltageSquaredResult {
  const safeV = Math.max(0, voltageV)
  const safeR = Math.max(0.5, resistanceOhm)
  const currentA = tidyNumber(safeV / safeR, 2)
  const powerW = tidyNumber((safeV * safeV) / safeR, 2)

  const voltageFactor = tidyNumber(safeV / baselineVoltageV, 2)
  const powerFactor = tidyNumber((safeV * safeV) / (baselineVoltageV * baselineVoltageV), 2)

  return {
    voltageV: safeV,
    resistanceOhm: safeR,
    currentA,
    powerW,
    voltageFactor,
    powerFactor,
  }
}

export interface GravityInverseResult {
  distanceR: number
  forceN: number
  distanceFactor: number
  forceFactor: number
}

/**
 * F = G * m1 * m2 / r^2.
 * If r doubles, F drops to 1/4 (0.25x).
 * Using baseline F = 100 N at r = 1 unit.
 */
export function calculateGravityInverse(distanceR: number, baselineDistanceR = 1.0): GravityInverseResult {
  const safeR = Math.max(0.5, distanceR)
  const distanceFactor = tidyNumber(safeR / baselineDistanceR, 2)
  const forceFactor = tidyNumber(1.0 / (distanceFactor * distanceFactor), 4)
  const forceN = tidyNumber(100.0 * forceFactor, 2)

  return {
    distanceR: safeR,
    forceN,
    distanceFactor,
    forceFactor,
  }
}

export interface SoundEchoWaveResult {
  frequencyHz: number
  waveSpeedMps: number
  cliffDistanceM: number
  wavelengthM: number
  timePeriodMs: number
  roundTripDistanceM: number
  echoTimeS: number
  isDistinctEcho: boolean
}

/**
 * Class 9 Sound (NCERT Ch 11.2–11.3):
 * 1. Wave equation: v = f * λ => λ = v / f (inversely proportional in a given medium).
 * 2. Echo round-trip equation: 2d = v * t => t_echo = 2d / v.
 * 3. Distinct echo condition: human persistence of hearing is 0.1 s (t_echo >= 0.1 s).
 */
export function calculateSoundEchoWave(
  frequencyHz: number,
  waveSpeedMps = 340,
  cliffDistanceM = 85
): SoundEchoWaveResult {
  const safeF = Math.max(50, frequencyHz)
  const safeV = Math.max(200, waveSpeedMps)
  const safeD = Math.max(5, cliffDistanceM)

  const wavelengthM = tidyNumber(safeV / safeF, 2)
  const timePeriodMs = tidyNumber((1 / safeF) * 1000, 2)
  const roundTripDistanceM = tidyNumber(2 * safeD, 1)
  const echoTimeS = tidyNumber(roundTripDistanceM / safeV, 2)
  const isDistinctEcho = echoTimeS >= 0.1

  return {
    frequencyHz: safeF,
    waveSpeedMps: safeV,
    cliffDistanceM: safeD,
    wavelengthM,
    timePeriodMs,
    roundTripDistanceM,
    echoTimeS,
    isDistinctEcho,
  }
}

export interface MagneticFieldSolenoidResult {
  currentA: number
  radialDistanceCm: number
  solenoidTurnsN: number
  currentDirection: 'upward-or-ccw' | 'downward-or-cw'
  wireFieldMicroTesla: number
  solenoidCoreFieldMilliTesla: number
  thumbRuleFieldLoopSense: 'anticlockwise' | 'clockwise'
  solenoidLeftPole: 'North' | 'South'
  solenoidRightPole: 'North' | 'South'
}

/**
 * Class 10 Magnetic Effects of Electric Current (NCERT Ch 12.2):
 * 1. Straight conductor magnetic field: B_wire ∝ I / r (inversely proportional to radial distance r).
 *    Exact Biot-Savart / Ampere value in vacuum: B = (μ₀ I) / (2π r) = 20 * I(A) / r(cm) μT.
 * 2. Current-carrying solenoid internal field: B_solenoid ∝ N * I (for fixed length L = 10 cm,
 *    B = μ₀ (N/L) I ≈ 0.01257 * N * I mT).
 * 3. Right-Hand Thumb Rule reverses magnetic field sense and solenoid N/S polarity when current reverses.
 */
export function calculateMagneticFieldSolenoid(
  currentA: number,
  radialDistanceCm: number,
  solenoidTurnsN = 100,
  currentDirection: 'upward-or-ccw' | 'downward-or-cw' = 'upward-or-ccw'
): MagneticFieldSolenoidResult {
  const safeI = Math.max(0.5, currentA)
  const safeR = Math.max(1, radialDistanceCm)
  const safeN = Math.max(20, solenoidTurnsN)

  // B_wire (μT) = 20 * I / r_cm
  const wireFieldMicroTesla = tidyNumber((20 * safeI) / safeR, 2)
  // B_solenoid (mT) for L = 0.1257 m => 0.01 * N * I mT
  const solenoidCoreFieldMilliTesla = tidyNumber(0.01 * safeN * safeI, 2)

  const isUp = currentDirection === 'upward-or-ccw'

  return {
    currentA: safeI,
    radialDistanceCm: safeR,
    solenoidTurnsN: safeN,
    currentDirection,
    wireFieldMicroTesla,
    solenoidCoreFieldMilliTesla,
    thumbRuleFieldLoopSense: isUp ? 'anticlockwise' : 'clockwise',
    solenoidLeftPole: isUp ? 'North' : 'South',
    solenoidRightPole: isUp ? 'South' : 'North',
  }
}
