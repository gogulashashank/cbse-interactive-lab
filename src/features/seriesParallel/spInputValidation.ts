import { formatOhmNumber, parseOhmDraft } from '../electricity/ohmInputValidation'
import { getResistanceError, getVoltageError } from './spLimits'
import type { SPField, SPInput } from './spModel'

export { formatOhmNumber, parseOhmDraft }

export interface SPDrafts {
  supplyVoltageV: string
  resistance1Ohm: string
  resistance2Ohm: string
}

export type SPFieldErrors = Partial<Record<SPField, string>>

export const INITIAL_SP_INPUT: SPInput = {
  arrangement: 'single',
  supplyVoltageV: 6,
  resistance1Ohm: 6,
  resistance2Ohm: 6,
  switchClosed: true,
}

export function createSPDrafts(input: SPInput): SPDrafts {
  return {
    supplyVoltageV: String(input.supplyVoltageV),
    resistance1Ohm: String(input.resistance1Ohm),
    resistance2Ohm: String(input.resistance2Ohm),
  }
}

const EMPTY_MESSAGE: Record<SPField, string> = {
  supplyVoltageV: 'Enter a supply voltage in volts.',
  resistance1Ohm: 'Enter a value for resistor 1 in ohms.',
  resistance2Ohm: 'Enter a value for resistor 2 in ohms.',
}

function fieldError(field: SPField, draft: string): string | null {
  const value = parseOhmDraft(draft)
  if (value === null) return EMPTY_MESSAGE[field]
  if (field === 'supplyVoltageV') return getVoltageError(value)
  return getResistanceError(value, field === 'resistance1Ohm' ? 'Resistor 1' : 'Resistor 2')
}

export function validateSPDrafts(drafts: SPDrafts): SPFieldErrors {
  const errors: SPFieldErrors = {}
  for (const f of ['supplyVoltageV', 'resistance1Ohm', 'resistance2Ohm'] as const) {
    const e = fieldError(f, drafts[f])
    if (e) errors[f] = e
  }
  return errors
}

/** Applies each field only when valid, so an invalid entry never corrupts the last valid circuit. */
export function applySPDraftEdit(
  previous: SPInput,
  drafts: SPDrafts,
  field: SPField,
  rawValue: string
): { input: SPInput; drafts: SPDrafts; errors: SPFieldErrors } {
  const nextDrafts: SPDrafts = { ...drafts, [field]: rawValue }
  const errors = validateSPDrafts(nextDrafts)
  const input: SPInput = { ...previous }
  for (const f of ['supplyVoltageV', 'resistance1Ohm', 'resistance2Ohm'] as const) {
    if (!errors[f]) input[f] = parseOhmDraft(nextDrafts[f]) as number
  }
  return { input, drafts: nextDrafts, errors }
}
