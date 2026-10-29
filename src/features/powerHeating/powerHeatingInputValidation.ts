import {
  POWER_HEATING_LIMITS,
  validateDuration,
  validateResistance,
  validateSupplyVoltage,
} from './powerHeatingLimits'
import type { HeatingCircuitInput } from './powerHeatingModel'

export interface HeatingDrafts {
  supplyVoltageV: string
  resistanceOhm: string
  targetDurationS: string
}

export interface HeatingValidationErrors {
  supplyVoltageV?: string
  resistanceOhm?: string
  targetDurationS?: string
}

export function createHeatingDrafts(
  input: HeatingCircuitInput,
  targetDurationS: number = 10
): HeatingDrafts {
  return {
    supplyVoltageV: input.supplyVoltageV.toString(),
    resistanceOhm: input.resistanceOhm.toString(),
    targetDurationS: targetDurationS.toString(),
  }
}

export function parseDraftNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

export function formatHeatingNumber(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('en-IN', { maximumFractionDigits: decimals })
  }
  return Number(value.toFixed(decimals)).toString()
}

export function applyHeatingDraftEdit(
  currentInput: HeatingCircuitInput,
  currentDrafts: HeatingDrafts,
  currentTargetDurationS: number,
  field: keyof HeatingDrafts,
  rawValue: string
): {
  input: HeatingCircuitInput
  drafts: HeatingDrafts
  targetDurationS: number
  errors: HeatingValidationErrors
} {
  const newDrafts: HeatingDrafts = { ...currentDrafts, [field]: rawValue }
  const errors: HeatingValidationErrors = {}
  let newInput: HeatingCircuitInput = { ...currentInput }
  let newTargetDurationS = currentTargetDurationS

  // Validate supply voltage
  const vNum = parseDraftNumber(newDrafts.supplyVoltageV)
  if (vNum === null) {
    errors.supplyVoltageV = 'Enter a valid voltage.'
  } else {
    try {
      validateSupplyVoltage(vNum)
      newInput = { ...newInput, supplyVoltageV: vNum }
    } catch (err) {
      errors.supplyVoltageV =
        err instanceof Error
          ? err.message
          : `Voltage must be between ${POWER_HEATING_LIMITS.supplyVoltageV.min} V and ${POWER_HEATING_LIMITS.supplyVoltageV.max} V.`
    }
  }

  // Validate resistance
  const rNum = parseDraftNumber(newDrafts.resistanceOhm)
  if (rNum === null) {
    errors.resistanceOhm = 'Enter a valid resistance.'
  } else {
    try {
      validateResistance(rNum)
      newInput = { ...newInput, resistanceOhm: rNum }
    } catch (err) {
      errors.resistanceOhm =
        err instanceof Error
          ? err.message
          : `Resistance must be between ${POWER_HEATING_LIMITS.resistanceOhm.min} Ω and ${POWER_HEATING_LIMITS.resistanceOhm.max} Ω.`
    }
  }

  // Validate target duration
  const tNum = parseDraftNumber(newDrafts.targetDurationS)
  if (tNum === null) {
    errors.targetDurationS = 'Enter a valid duration.'
  } else {
    try {
      validateDuration(tNum)
      newTargetDurationS = tNum
    } catch (err) {
      errors.targetDurationS =
        err instanceof Error
          ? err.message
          : `Duration must be between ${POWER_HEATING_LIMITS.durationS.min} s and ${POWER_HEATING_LIMITS.durationS.max} s.`
    }
  }

  return {
    input: newInput,
    drafts: newDrafts,
    targetDurationS: newTargetDurationS,
    errors,
  }
}
