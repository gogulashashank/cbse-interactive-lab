/**
 * Pure scientific calculation model for an ideal frictionless ramp (inclined plane).
 *
 * Physical assumptions:
 * - Straight, rigid, frictionless ramp.
 * - Object pulled uphill at constant speed (zero acceleration, zero net work, zero kinetic energy change).
 * - Applied pulling force acts parallel to the ramp surface.
 * - Excludes starting and stopping transients, friction, and air resistance.
 * - Standard gravitational acceleration fixed at g = 9.81 m/s^2.
 *
 * Reference: docs/SCIENTIFIC_MODEL.md
 */

export const GRAVITATIONAL_ACCELERATION_M_PER_S2 = 9.81

export interface RampModelInput {
  /** Mass of the object in kilograms (must be finite and > 0) */
  massKg: number
  /** Vertical rise height of the ramp in meters (must be finite and > 0) */
  heightM: number
  /** Length of the ramp slope in meters (must be finite and >= heightM) */
  rampLengthM: number
}

export interface RampModelResult {
  /** Input mass in kilograms (kg) */
  massKg: number
  /** Input vertical height in meters (m) */
  heightM: number
  /** Input ramp slope length in meters (m) */
  rampLengthM: number
  /** Gravitational acceleration constant used in meters per second squared (m/s^2) */
  gravitationalAccelerationMPerS2: number
  /** Gravitational weight of the object in newtons (N) */
  weightN: number
  /** Ramp inclination angle relative to horizontal in radians (rad) */
  rampAngleRadians: number
  /** Ramp inclination angle relative to horizontal in degrees (deg) */
  rampAngleDegrees: number
  /** Horizontal base length (run) of the ramp in meters (m) */
  horizontalRunM: number
  /** Uphill pulling force parallel to the frictionless ramp at constant speed in newtons (N) */
  pullingForceN: number
  /** Distance moved along the ramp slope in meters (m) */
  distanceAlongRampM: number
  /** Work done by the applied pulling force along the ramp in joules (J) */
  appliedWorkJ: number
  /** Gravitational potential energy gained by the object in joules (J) */
  potentialEnergyGainJ: number
  /** Force required to lift the object straight up vertically at constant speed in newtons (N) */
  verticalLiftForceN: number
  /** Vertical distance lifted in meters (m) */
  verticalLiftDistanceM: number
  /** Work done when lifting the object straight up vertically in joules (J) */
  verticalLiftWorkJ: number
  /** Ideal mechanical advantage of the ramp (dimensionless ratio L / h) */
  idealMechanicalAdvantage: number
}

export class RampModelValidationError extends Error {
  public readonly field?: keyof RampModelInput | 'computedOutput'

  constructor(message: string, field?: keyof RampModelInput | 'computedOutput') {
    super(message)
    this.name = 'RampModelValidationError'
    this.field = field
  }
}

/**
 * Validates inputs for the ideal frictionless ramp model.
 * Throws a RampModelValidationError if any constraint is violated.
 */
export function validateRampInput(input: RampModelInput): void {
  const { massKg, heightM, rampLengthM } = input

  if (typeof massKg !== 'number' || !Number.isFinite(massKg)) {
    throw new RampModelValidationError(
      'Mass (massKg) must be a finite number.',
      'massKg'
    )
  }
  if (massKg <= 0) {
    throw new RampModelValidationError(
      'Mass (massKg) must be greater than 0 kg.',
      'massKg'
    )
  }

  if (typeof heightM !== 'number' || !Number.isFinite(heightM)) {
    throw new RampModelValidationError(
      'Height (heightM) must be a finite number.',
      'heightM'
    )
  }
  if (heightM <= 0) {
    throw new RampModelValidationError(
      'Height (heightM) must be greater than 0 m.',
      'heightM'
    )
  }

  if (typeof rampLengthM !== 'number' || !Number.isFinite(rampLengthM)) {
    throw new RampModelValidationError(
      'Ramp length (rampLengthM) must be a finite number.',
      'rampLengthM'
    )
  }
  if (rampLengthM < heightM) {
    throw new RampModelValidationError(
      'Ramp length (rampLengthM) must be greater than or equal to height (heightM).',
      'rampLengthM'
    )
  }
}

/**
 * Calculates forces, geometry, work, energy, and ideal mechanical advantage
 * for pulling an object up an ideal frictionless ramp at constant speed.
 */
export function calculateRampMechanics(input: RampModelInput): RampModelResult {
  validateRampInput(input)

  const { massKg, heightM, rampLengthM } = input
  const g = GRAVITATIONAL_ACCELERATION_M_PER_S2

  const weightN = massKg * g
  const sineRatio = heightM / rampLengthM
  const rampAngleRadians = Math.asin(sineRatio)
  const rampAngleDegrees = (rampAngleRadians * 180) / Math.PI
  const horizontalRunM = Math.sqrt((rampLengthM - heightM) * (rampLengthM + heightM))
  const pullingForceN = (weightN * heightM) / rampLengthM
  const distanceAlongRampM = rampLengthM
  const appliedWorkJ = pullingForceN * rampLengthM
  const potentialEnergyGainJ = weightN * heightM
  const verticalLiftForceN = weightN
  const verticalLiftDistanceM = heightM
  const verticalLiftWorkJ = weightN * heightM
  const idealMechanicalAdvantage = rampLengthM / heightM

  const result: RampModelResult = {
    massKg,
    heightM,
    rampLengthM,
    gravitationalAccelerationMPerS2: g,
    weightN,
    rampAngleRadians,
    rampAngleDegrees,
    horizontalRunM,
    pullingForceN,
    distanceAlongRampM,
    appliedWorkJ,
    potentialEnergyGainJ,
    verticalLiftForceN,
    verticalLiftDistanceM,
    verticalLiftWorkJ,
    idealMechanicalAdvantage,
  }

  for (const [key, value] of Object.entries(result)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new RampModelValidationError(
        `Numeric overflow or non-finite computed output for "${key}".`,
        'computedOutput'
      )
    }
  }

  return result
}
