export const RESISTIVITY_LIMITS = {
  lengthM: { min: 0.2, max: 10.0, step: 0.1 },
  areaMm2: { min: 0.05, max: 2.0, step: 0.05 },
  supplyVoltageV: { min: 0, max: 12, step: 0.5 },
} as const

export function getLengthError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Wire length must be a finite number in meters.'
  }
  if (value < RESISTIVITY_LIMITS.lengthM.min || value > RESISTIVITY_LIMITS.lengthM.max) {
    return `Wire length must be between ${RESISTIVITY_LIMITS.lengthM.min} m and ${RESISTIVITY_LIMITS.lengthM.max} m.`
  }
  return null
}

export function getAreaError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Cross-sectional area must be a finite number in mm².'
  }
  if (value < RESISTIVITY_LIMITS.areaMm2.min || value > RESISTIVITY_LIMITS.areaMm2.max) {
    return `Cross-sectional area must be between ${RESISTIVITY_LIMITS.areaMm2.min} mm² and ${RESISTIVITY_LIMITS.areaMm2.max} mm².`
  }
  return null
}

export function getVoltageError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Supply voltage must be a finite number in volts.'
  }
  if (value < RESISTIVITY_LIMITS.supplyVoltageV.min || value > RESISTIVITY_LIMITS.supplyVoltageV.max) {
    return `Supply voltage must be between ${RESISTIVITY_LIMITS.supplyVoltageV.min} V and ${RESISTIVITY_LIMITS.supplyVoltageV.max} V.`
  }
  return null
}
