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
