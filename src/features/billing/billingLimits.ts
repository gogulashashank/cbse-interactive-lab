export interface BillingLimit {
  min: number
  max: number
  step: number
  default: number
}

export interface ApplianceDefinition {
  id: string
  name: string
  category: 'Heating & Cooling' | 'Kitchen & Water' | 'Lighting & Fans' | 'Entertainment & Office'
  defaultPowerW: number
  powerRangeW: { min: number; max: number; step: number }
  defaultHoursPerDay: number
  hoursRange: { min: number; max: number; step: number }
  defaultQuantity: number
  icon: string
  description: string
}

export const STANDARD_APPLIANCES: readonly ApplianceDefinition[] = [
  {
    id: 'geyser',
    name: 'Geyser / Water Heater',
    category: 'Heating & Cooling',
    defaultPowerW: 2000,
    powerRangeW: { min: 1000, max: 3000, step: 100 },
    defaultHoursPerDay: 1,
    hoursRange: { min: 0, max: 24, step: 0.5 },
    defaultQuantity: 1,
    icon: '🚿',
    description: 'High power heating element used for quick water heating in baths.',
  },
  {
    id: 'electric-iron',
    name: 'Electric Iron',
    category: 'Heating & Cooling',
    defaultPowerW: 1000,
    powerRangeW: { min: 500, max: 1500, step: 50 },
    defaultHoursPerDay: 1,
    hoursRange: { min: 0, max: 12, step: 0.5 },
    defaultQuantity: 1,
    icon: '👔',
    description: 'Medium-high power resistive heating element used for pressing clothes.',
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    category: 'Kitchen & Water',
    defaultPowerW: 200,
    powerRangeW: { min: 100, max: 500, step: 10 },
    defaultHoursPerDay: 24,
    hoursRange: { min: 0, max: 24, step: 1 },
    defaultQuantity: 1,
    icon: '🧊',
    description: 'Runs continuous compressor duty cycles throughout the day and night.',
  },
  {
    id: 'ceiling-fan',
    name: 'Ceiling Fan',
    category: 'Lighting & Fans',
    defaultPowerW: 75,
    powerRangeW: { min: 30, max: 120, step: 5 },
    defaultHoursPerDay: 12,
    hoursRange: { min: 0, max: 24, step: 1 },
    defaultQuantity: 3,
    icon: '🌀',
    description: 'Low-to-medium power motor running for long summer stretches.',
  },
  {
    id: 'led-bulb',
    name: 'LED Bulbs (set)',
    category: 'Lighting & Fans',
    defaultPowerW: 10,
    powerRangeW: { min: 5, max: 40, step: 1 },
    defaultHoursPerDay: 6,
    hoursRange: { min: 0, max: 24, step: 1 },
    defaultQuantity: 5,
    icon: '💡',
    description: 'Energy-efficient solid state lighting for rooms and corridors.',
  },
  {
    id: 'television',
    name: 'Smart Television',
    category: 'Entertainment & Office',
    defaultPowerW: 100,
    powerRangeW: { min: 40, max: 250, step: 10 },
    defaultHoursPerDay: 4,
    hoursRange: { min: 0, max: 24, step: 0.5 },
    defaultQuantity: 1,
    icon: '📺',
    description: 'Modern LED/OLED display panel for household entertainment.',
  },
] as const

export const BILLING_GLOBAL_LIMITS = {
  billingDays: {
    min: 1,
    max: 90,
    step: 1,
    default: 30,
  },
  tariffRate: {
    min: 1.0,
    max: 15.0,
    step: 0.5,
    default: 6.0,
  },
  hoursPerDay: {
    min: 0,
    max: 24,
    step: 0.5,
    default: 1,
  },
  quantity: {
    min: 1,
    max: 20,
    step: 1,
    default: 1,
  },
  powerW: {
    min: 1,
    max: 10000,
    step: 5,
    default: 100,
  },
} as const

export class BillingValidationError extends Error {
  readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.name = 'BillingValidationError'
    this.field = field
  }
}

export function validateBillingDays(days: number): void {
  if (!Number.isFinite(days)) {
    throw new BillingValidationError('billingDays', 'Billing days must be a finite number.')
  }
  if (days < BILLING_GLOBAL_LIMITS.billingDays.min || days > BILLING_GLOBAL_LIMITS.billingDays.max) {
    throw new BillingValidationError(
      'billingDays',
      `Billing days must be between ${BILLING_GLOBAL_LIMITS.billingDays.min} and ${BILLING_GLOBAL_LIMITS.billingDays.max} days.`
    )
  }
}

export function validateTariffRate(rate: number): void {
  if (!Number.isFinite(rate)) {
    throw new BillingValidationError('tariffRate', 'Tariff rate must be a finite number.')
  }
  if (rate < BILLING_GLOBAL_LIMITS.tariffRate.min || rate > BILLING_GLOBAL_LIMITS.tariffRate.max) {
    throw new BillingValidationError(
      'tariffRate',
      `Tariff rate must be between ₹${BILLING_GLOBAL_LIMITS.tariffRate.min} and ₹${BILLING_GLOBAL_LIMITS.tariffRate.max} per unit.`
    )
  }
}

export function validateHoursPerDay(hours: number): void {
  if (!Number.isFinite(hours)) {
    throw new BillingValidationError('hoursPerDay', 'Daily hours must be a finite number.')
  }
  if (hours < BILLING_GLOBAL_LIMITS.hoursPerDay.min || hours > BILLING_GLOBAL_LIMITS.hoursPerDay.max) {
    throw new BillingValidationError(
      'hoursPerDay',
      `Hours per day must be between ${BILLING_GLOBAL_LIMITS.hoursPerDay.min} and ${BILLING_GLOBAL_LIMITS.hoursPerDay.max} hours.`
    )
  }
}

export function validateAppliancePower(powerW: number): void {
  if (!Number.isFinite(powerW)) {
    throw new BillingValidationError('powerW', 'Power must be a finite number.')
  }
  if (powerW < BILLING_GLOBAL_LIMITS.powerW.min || powerW > BILLING_GLOBAL_LIMITS.powerW.max) {
    throw new BillingValidationError(
      'powerW',
      `Power must be between ${BILLING_GLOBAL_LIMITS.powerW.min} W and ${BILLING_GLOBAL_LIMITS.powerW.max} W.`
    )
  }
}

export function validateQuantity(quantity: number): void {
  if (!Number.isFinite(quantity)) {
    throw new BillingValidationError('quantity', 'Quantity must be a finite number.')
  }
  if (quantity < BILLING_GLOBAL_LIMITS.quantity.min || quantity > BILLING_GLOBAL_LIMITS.quantity.max) {
    throw new BillingValidationError(
      'quantity',
      `Quantity must be between ${BILLING_GLOBAL_LIMITS.quantity.min} and ${BILLING_GLOBAL_LIMITS.quantity.max}.`
    )
  }
}
