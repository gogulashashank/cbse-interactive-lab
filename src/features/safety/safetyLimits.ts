export type SafetyFaultMode = 'none' | 'short_circuit' | 'chassis_leakage'

export type FuseRating = 1 | 2 | 3 | 5 | 10 | 15 | 16

export const STANDARD_FUSE_RATINGS: readonly FuseRating[] = [1, 2, 3, 5, 10, 15, 16] as const

export interface ApplianceSafetySpec {
  id: string
  name: string
  powerW: number
  hasMetalBody: boolean
  icon: string
  description: string
  defaultEnabled: boolean
}

export const SUPPLY_VOLTAGE_RMS = 220 // Volts AC
export const AC_FREQUENCY_HZ = 50 // Hertz
export const LIVE_POTENTIAL_V = 220 // Volts
export const NEUTRAL_POTENTIAL_V = 0 // Volts
export const EARTH_POTENTIAL_V = 0 // Volts reference

// Short circuit resistance path (wires + fault contact in ohms)
export const SHORT_CIRCUIT_RESISTANCE_OHMS = 0.44 // at 220V, results in 500 A peak short current
export const SHORT_CIRCUIT_CURRENT_A = 500

// Earthing and human resistance models
export const EARTH_WIRE_RESISTANCE_OHMS = 1.0 // Very low resistance path to ground
export const HUMAN_BODY_RESISTANCE_OHMS = 1000 // Approximate resistance of wet/standard human body contact (1000 - 1500 ohms)

export const DEFAULT_APPLIANCES: readonly ApplianceSafetySpec[] = [
  {
    id: 'bulb',
    name: 'LED / CFL Bulb',
    powerW: 60,
    hasMetalBody: false,
    icon: '💡',
    description: 'General lighting, double insulated plastic socket.',
    defaultEnabled: true,
  },
  {
    id: 'fan',
    name: 'Ceiling Fan',
    powerW: 75,
    hasMetalBody: true,
    icon: '🌀',
    description: 'Induction motor with grounded metal suspension and canopy.',
    defaultEnabled: true,
  },
  {
    id: 'tv',
    name: 'Smart TV',
    powerW: 100,
    hasMetalBody: false,
    icon: '📺',
    description: 'Double insulated plastic casing entertainment display.',
    defaultEnabled: false,
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    powerW: 250,
    hasMetalBody: true,
    icon: '🧊',
    description: 'Large metallic cabinet enclosing compressor and condenser tubes.',
    defaultEnabled: true,
  },
  {
    id: 'iron',
    name: 'Electric Iron',
    powerW: 1000,
    hasMetalBody: true,
    icon: '👔',
    description: 'High power heating element with polished metal soleplate and casing.',
    defaultEnabled: false,
  },
  {
    id: 'geyser',
    name: 'Geyser / Water Heater',
    powerW: 2000,
    hasMetalBody: true,
    icon: '🚿',
    description: 'High power immersion heating tank connected to water pipes.',
    defaultEnabled: false,
  },
] as const

export class SafetyLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SafetyLimitError'
  }
}

export function validateFuseRating(rating: number): FuseRating {
  if (!Number.isFinite(rating)) {
    throw new SafetyLimitError('Fuse rating must be a valid number.')
  }
  if (!STANDARD_FUSE_RATINGS.includes(rating as FuseRating)) {
    throw new SafetyLimitError(
      `Fuse rating ${rating} A is not a standard commercial rating (${STANDARD_FUSE_RATINGS.join(', ')} A).`
    )
  }
  return rating as FuseRating
}

export function validateAppliancePower(powerW: number): number {
  if (!Number.isFinite(powerW) || powerW <= 0) {
    throw new SafetyLimitError('Appliance power must be a positive number in Watts.')
  }
  if (powerW > 5000) {
    throw new SafetyLimitError('Appliance power cannot exceed 5000 W for single-phase domestic circuits.')
  }
  return powerW
}

export function validateSupplyVoltage(voltageV: number): number {
  if (!Number.isFinite(voltageV) || voltageV <= 0) {
    throw new SafetyLimitError('Supply voltage must be positive.')
  }
  return voltageV
}
