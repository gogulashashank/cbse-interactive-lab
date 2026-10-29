export const SP_LIMITS = {
  supplyVoltageV: { min: 0, max: 12, step: 0.5 },
  resistanceOhm: { min: 1, max: 100, step: 1 },
} as const

export function getVoltageError(value: number): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Supply voltage must be a finite number in volts.'
  }
  if (value < SP_LIMITS.supplyVoltageV.min || value > SP_LIMITS.supplyVoltageV.max) {
    return `Supply voltage must be between ${SP_LIMITS.supplyVoltageV.min} V and ${SP_LIMITS.supplyVoltageV.max} V.`
  }
  return null
}

export function getResistanceError(value: number, name: string): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return `${name} must be a finite number in ohms.`
  }
  if (value < SP_LIMITS.resistanceOhm.min || value > SP_LIMITS.resistanceOhm.max) {
    return `${name} must be between ${SP_LIMITS.resistanceOhm.min} Ω and ${SP_LIMITS.resistanceOhm.max} Ω (short circuits are not part of this lesson).`
  }
  return null
}
