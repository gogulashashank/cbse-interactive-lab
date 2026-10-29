export interface PowerHeatingLimit {
  min: number
  max: number
  step: number
  default: number
}

export const POWER_HEATING_LIMITS = {
  supplyVoltageV: {
    min: 0.0,
    max: 12.0,
    step: 0.5,
    default: 6.0,
  },
  resistanceOhm: {
    min: 1.0,
    max: 50.0,
    step: 0.5,
    default: 6.0,
  },
  durationS: {
    min: 1,
    max: 120,
    step: 1,
    default: 10,
  },
} as const

export class PowerHeatingValidationError extends Error {
  readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.name = 'PowerHeatingValidationError'
    this.field = field
  }
}

export function validateSupplyVoltage(v: number): void {
  if (!Number.isFinite(v)) {
    throw new PowerHeatingValidationError('supplyVoltageV', 'Voltage must be a finite number.')
  }
  if (v < POWER_HEATING_LIMITS.supplyVoltageV.min || v > POWER_HEATING_LIMITS.supplyVoltageV.max) {
    throw new PowerHeatingValidationError(
      'supplyVoltageV',
      `Supply voltage must be between ${POWER_HEATING_LIMITS.supplyVoltageV.min} V and ${POWER_HEATING_LIMITS.supplyVoltageV.max} V.`
    )
  }
}

export function validateResistance(r: number): void {
  if (!Number.isFinite(r)) {
    throw new PowerHeatingValidationError('resistanceOhm', 'Resistance must be a finite number.')
  }
  if (r < POWER_HEATING_LIMITS.resistanceOhm.min || r > POWER_HEATING_LIMITS.resistanceOhm.max) {
    throw new PowerHeatingValidationError(
      'resistanceOhm',
      `Resistance must be between ${POWER_HEATING_LIMITS.resistanceOhm.min} Ω and ${POWER_HEATING_LIMITS.resistanceOhm.max} Ω.`
    )
  }
}

export function validateDuration(t: number): void {
  if (!Number.isFinite(t)) {
    throw new PowerHeatingValidationError('durationS', 'Duration must be a finite number.')
  }
  if (t < POWER_HEATING_LIMITS.durationS.min || t > POWER_HEATING_LIMITS.durationS.max) {
    throw new PowerHeatingValidationError(
      'durationS',
      `Duration must be between ${POWER_HEATING_LIMITS.durationS.min} s and ${POWER_HEATING_LIMITS.durationS.max} s.`
    )
  }
}
