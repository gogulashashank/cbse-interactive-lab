import { getAreaError, getLengthError, getVoltageError } from './resistivityLimits'
import { type WireInput } from './resistivityModel'

export interface WireDrafts {
  lengthM: string
  areaMm2: string
  supplyVoltageV: string
}

export type WireFieldErrors = Partial<Record<'lengthM' | 'areaMm2' | 'supplyVoltageV', string>>

export const INITIAL_WIRE_INPUT: WireInput = {
  materialId: 'nichrome',
  lengthM: 1.0,
  areaMm2: 0.5,
  supplyVoltageV: 6.0,
  switchClosed: true,
}

export function createWireDrafts(input: WireInput): WireDrafts {
  return {
    lengthM: String(input.lengthM),
    areaMm2: String(input.areaMm2),
    supplyVoltageV: String(input.supplyVoltageV),
  }
}

export function parseDraftNumber(draft: string): number | null {
  const trimmed = draft.trim()
  if (trimmed === '') return null
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

export function validateWireDrafts(drafts: WireDrafts): WireFieldErrors {
  const errors: WireFieldErrors = {}
  const lVal = parseDraftNumber(drafts.lengthM)
  const aVal = parseDraftNumber(drafts.areaMm2)
  const vVal = parseDraftNumber(drafts.supplyVoltageV)

  if (lVal === null) errors.lengthM = 'Enter a wire length in meters.'
  else {
    const err = getLengthError(lVal)
    if (err) errors.lengthM = err
  }

  if (aVal === null) errors.areaMm2 = 'Enter an area in mm².'
  else {
    const err = getAreaError(aVal)
    if (err) errors.areaMm2 = err
  }

  if (vVal === null) errors.supplyVoltageV = 'Enter a supply voltage in volts.'
  else {
    const err = getVoltageError(vVal)
    if (err) errors.supplyVoltageV = err
  }

  return errors
}

export function applyWireDraftEdit(
  previous: WireInput,
  drafts: WireDrafts,
  field: keyof WireDrafts,
  rawValue: string
): { input: WireInput; drafts: WireDrafts; errors: WireFieldErrors } {
  const nextDrafts: WireDrafts = { ...drafts, [field]: rawValue }
  const errors = validateWireDrafts(nextDrafts)
  const input: WireInput = { ...previous }

  if (!errors.lengthM) input.lengthM = parseDraftNumber(nextDrafts.lengthM) as number
  if (!errors.areaMm2) input.areaMm2 = parseDraftNumber(nextDrafts.areaMm2) as number
  if (!errors.supplyVoltageV) input.supplyVoltageV = parseDraftNumber(nextDrafts.supplyVoltageV) as number

  return { input, drafts: nextDrafts, errors }
}

export function formatWireNumber(val: number, maxDigits = 3): string {
  if (Math.abs(val) < 0.0001 && val !== 0) {
    return val.toExponential(2)
  }
  const rounded = Number(val.toFixed(maxDigits))
  return String(Object.is(rounded, -0) ? 0 : rounded)
}
