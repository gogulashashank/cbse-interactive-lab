import {
  getResistanceError,
  getVoltageError,
  type CircuitInput,
  type OhmField,
} from './ohmModel'

export interface OhmDrafts {
  supplyVoltageV: string
  resistanceOhm: string
}

export type OhmFieldErrors = Partial<Record<OhmField, string>>

export const INITIAL_CIRCUIT_INPUT: CircuitInput = {
  supplyVoltageV: 6,
  resistanceOhm: 6,
  switchClosed: true,
}

export function createOhmDrafts(input: CircuitInput): OhmDrafts {
  return {
    supplyVoltageV: String(input.supplyVoltageV),
    resistanceOhm: String(input.resistanceOhm),
  }
}

/** Parses a draft without turning blank or whitespace-only text into 0. */
export function parseOhmDraft(draft: string): number | null {
  const trimmed = draft.trim()
  if (trimmed === '') return null
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

function fieldError(field: OhmField, draft: string): string | null {
  const value = parseOhmDraft(draft)
  if (value === null) {
    return field === 'supplyVoltageV'
      ? 'Enter a supply voltage in volts.'
      : 'Enter a resistance in ohms.'
  }
  return field === 'supplyVoltageV' ? getVoltageError(value) : getResistanceError(value)
}

export function validateOhmDrafts(drafts: OhmDrafts): OhmFieldErrors {
  const errors: OhmFieldErrors = {}
  const v = fieldError('supplyVoltageV', drafts.supplyVoltageV)
  const r = fieldError('resistanceOhm', drafts.resistanceOhm)
  if (v) errors.supplyVoltageV = v
  if (r) errors.resistanceOhm = r
  return errors
}

/**
 * Applies one edited field. Each field is applied only when valid, so an invalid
 * entry never corrupts the last valid circuit state. The draft text is kept so
 * the student can keep typing, and errors are reported per field.
 */
export function applyOhmDraftEdit(
  previous: CircuitInput,
  drafts: OhmDrafts,
  field: OhmField,
  rawValue: string
): { input: CircuitInput; drafts: OhmDrafts; errors: OhmFieldErrors } {
  const nextDrafts: OhmDrafts = { ...drafts, [field]: rawValue }
  const errors = validateOhmDrafts(nextDrafts)
  const input: CircuitInput = { ...previous }
  if (!errors.supplyVoltageV) {
    input.supplyVoltageV = parseOhmDraft(nextDrafts.supplyVoltageV) as number
  }
  if (!errors.resistanceOhm) {
    input.resistanceOhm = parseOhmDraft(nextDrafts.resistanceOhm) as number
  }
  return { input, drafts: nextDrafts, errors }
}

export function formatOhmNumber(value: number, maxFractionDigits = 2): string {
  const rounded = Number(value.toFixed(maxFractionDigits))
  return String(Object.is(rounded, -0) ? 0 : rounded)
}
