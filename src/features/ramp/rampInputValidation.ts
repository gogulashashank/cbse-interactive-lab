import type { RampModelInput } from './rampModel'

export const INITIAL_RAMP_INPUT: RampModelInput = {
  massKg: 10,
  heightM: 1,
  rampLengthM: 2,
}

export const PRESET_2M_RAMP: RampModelInput = {
  massKg: 10,
  heightM: 1,
  rampLengthM: 2,
}

export const PRESET_4M_RAMP: RampModelInput = {
  massKg: 10,
  heightM: 1,
  rampLengthM: 4,
}

export const RAMP_UI_LIMITS = {
  massKg: { min: 1, max: 50, step: 1, unit: 'kg', label: 'Object mass' },
  heightM: { min: 0.5, max: 3, step: 0.1, unit: 'm', label: 'Vertical height' },
  rampLengthM: { min: 0.5, max: 8, step: 0.1, unit: 'm', label: 'Ramp length' },
} as const

export interface RampInputDrafts {
  massKg: string
  heightM: string
  rampLengthM: string
}

export interface RampFieldErrors {
  massKg?: string
  heightM?: string
  rampLengthM?: string
}

export type RampValidationOutcome =
  | {
      isValid: true
      parsedInput: RampModelInput
      errors: RampFieldErrors
    }
  | {
      isValid: false
      parsedInput: null
      errors: RampFieldErrors
    }

/**
 * Converts a valid RampModelInput into string drafts for controlled inputs.
 */
export function createDraftsFromInput(input: RampModelInput): RampInputDrafts {
  return {
    massKg: String(input.massKg),
    heightM: String(input.heightM),
    rampLengthM: String(input.rampLengthM),
  }
}

/**
 * Strictly parses a string draft into a finite number, or returns null if empty or non-numeric.
 * Never converts an empty string or whitespace to 0.
 */
export function parseNumericDraft(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return null
  }
  const value = Number(trimmed)
  if (!Number.isFinite(value)) {
    return null
  }
  return value
}

/**
 * Validates raw string drafts against UI exploration limits and geometric constraints
 * before calling the scientific calculation model.
 */
export function validateRampDrafts(drafts: RampInputDrafts): RampValidationOutcome {
  const errors: RampFieldErrors = {}

  const massVal = parseNumericDraft(drafts.massKg)
  const heightVal = parseNumericDraft(drafts.heightM)
  const lengthVal = parseNumericDraft(drafts.rampLengthM)

  // Validate Mass (1–50 kg)
  if (massVal === null) {
    errors.massKg = 'Enter a mass between 1 kg and 50 kg.'
  } else if (massVal <= 0) {
    errors.massKg = 'Mass must be greater than 0 kg (allowed range: 1 to 50 kg).'
  } else if (massVal < RAMP_UI_LIMITS.massKg.min || massVal > RAMP_UI_LIMITS.massKg.max) {
    errors.massKg = `Mass must be between ${RAMP_UI_LIMITS.massKg.min} kg and ${RAMP_UI_LIMITS.massKg.max} kg.`
  }

  // Validate Vertical Height (0.5–3 m)
  if (heightVal === null) {
    errors.heightM = 'Enter a vertical height between 0.5 m and 3 m.'
  } else if (heightVal <= 0) {
    errors.heightM = 'Vertical height must be greater than 0 m (allowed range: 0.5 to 3 m).'
  } else if (
    heightVal < RAMP_UI_LIMITS.heightM.min ||
    heightVal > RAMP_UI_LIMITS.heightM.max
  ) {
    errors.heightM = `Vertical height must be between ${RAMP_UI_LIMITS.heightM.min} m and ${RAMP_UI_LIMITS.heightM.max} m.`
  }

  // Validate Ramp Length (0.5–8 m, and rampLengthM >= heightM)
  if (lengthVal === null) {
    errors.rampLengthM = 'Enter a ramp length between 0.5 m and 8 m.'
  } else if (lengthVal <= 0) {
    errors.rampLengthM = 'Ramp length must be greater than 0 m (allowed range: 0.5 to 8 m).'
  } else if (
    lengthVal < RAMP_UI_LIMITS.rampLengthM.min ||
    lengthVal > RAMP_UI_LIMITS.rampLengthM.max
  ) {
    errors.rampLengthM = `Ramp length must be between ${RAMP_UI_LIMITS.rampLengthM.min} m and ${RAMP_UI_LIMITS.rampLengthM.max} m.`
  } else if (heightVal !== null && heightVal > 0 && lengthVal < heightVal) {
    errors.rampLengthM = `Ramp length (${lengthVal} m) must be at least the vertical height (${heightVal} m).`
  }

  const hasErrors = Boolean(errors.massKg || errors.heightM || errors.rampLengthM)

  if (hasErrors || massVal === null || heightVal === null || lengthVal === null) {
    return {
      isValid: false,
      parsedInput: null,
      errors,
    }
  }

  return {
    isValid: true,
    parsedInput: {
      massKg: massVal,
      heightM: heightVal,
      rampLengthM: lengthVal,
    },
    errors,
  }
}

/**
 * Formats a numerical value for presentation, stripping unnecessary trailing zeros
 * up to maxDecimals while preserving full precision in the model layer.
 */
export function formatDisplayNumber(value: number, maxDecimals = 2): string {
  const fixed = value.toFixed(maxDecimals)
  return Number(fixed).toString()
}
